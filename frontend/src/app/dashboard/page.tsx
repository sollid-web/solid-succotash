"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { buildApiUrl } from "@/lib/api";
import { authHeaders } from "@/lib/auth";

type WalletResponse = {
  balance?: string | number;
  total_deposits?: string | number;
  total_withdrawals?: string | number;
  updated_at?: string;
};

type Investment = {
  id: number;
  status?: string;
  amount?: string | number;
  plan_name?: string;
  plan?: { name?: string; daily_roi?: string | number; duration_days?: number };
  starts_at?: string;
  ends_at?: string;
  created_at?: string;
};

type Transaction = {
  id: number;
  tx_type?: string;
  status?: string;
  amount?: string | number;
  reference?: string;
  created_at?: string;
};

function money(x: string | number) {
  const n = Number(x || 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(isFinite(n) ? n : 0);
}

function safeDate(d?: string) {
  if (!d) return null;
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? null : dt;
}

async function readErrorText(res: Response) {
  const txt = await res.text();
  try {
    const j = JSON.parse(txt);
    if (j?.detail) return String(j.detail);
    return txt;
  } catch {
    return txt;
  }
}

export default function DashboardPage() {
  const router = useRouter();

  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function apiGet<T>(path: string): Promise<T> {
      const res = await fetch(buildApiUrl(path), {
        method: "GET",
        headers: authHeaders(),
        // keep cookies if your backend also uses them
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        const msg = await readErrorText(res);
        throw new Error(`${res.status} ${res.statusText}: ${msg}`);
      }

      return (await res.json()) as T;
    }

    async function load() {
      setLoading(true);
      setError("");

      try {
        const [w, inv, tx] = await Promise.all([
          apiGet<WalletResponse>("/api/wallet/"),
          apiGet<any>("/api/investments/my/"),
          apiGet<any>("/api/transactions/my/"),
        ]);

        if (cancelled) return;

        setWallet(w);

        // Investments endpoint might return {results: []} or []
        const invArr = Array.isArray(inv) ? inv : Array.isArray(inv?.results) ? inv.results : [];
        setInvestments(invArr);

        const txArr = Array.isArray(tx) ? tx : Array.isArray(tx?.results) ? tx.results : [];
        setTransactions(txArr);
      } catch (e: any) {
        if (cancelled) return;

        const msg = String(e?.message || e);

        // If token missing/expired, push user to login
        if (msg.includes("401") || msg.toLowerCase().includes("not provided") || msg.toLowerCase().includes("token")) {
          setError("Session expired or missing. Please log in again.");
          // optional redirect:
          // router.push("/accounts/login");
        } else {
          setError(`Dashboard fetch failed: ${msg}`);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const activeInvestments = useMemo(() => {
    return investments.filter((i) => ["active", "approved"].includes(String(i.status || "").toLowerCase()));
  }, [investments]);

  const totalInvested = useMemo(() => {
    return activeInvestments.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
  }, [activeInvestments]);

  const lockedRoi = useMemo(() => {
    return transactions
      .filter(
        (t) =>
          String(t.tx_type || "").toLowerCase() === "profit" &&
          ["approved", "completed"].includes(String(t.status || "").toLowerCase())
      )
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [transactions]);

  const recentTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      const da = safeDate(a.created_at)?.getTime() || 0;
      const db = safeDate(b.created_at)?.getTime() || 0;
      return db - da;
    });
  }, [transactions]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              W
            </div>
            <div>
              <div className="font-semibold">WolvCapital</div>
              <div className="text-xs text-gray-500">Investment Dashboard</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/new-investment"
              className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
            >
              New Investment
            </Link>
            <Link
              href="/logout"
              className="px-3 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
            >
              Logout
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {error ? (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="mb-6 text-sm text-gray-600">Loading dashboard…</div>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard title="Current Balance" value={money(wallet?.balance ?? 0)} subtitle="Available funds" />
          <StatCard title="Total Deposits" value={money(wallet?.total_deposits ?? 0)} subtitle="Approved deposits" />
          <StatCard title="Total Withdrawals" value={money(wallet?.total_withdrawals ?? 0)} subtitle="Approved withdrawals" />
          <StatCard title="Total Invested" value={money(totalInvested)} subtitle="Active principal" />
          <StatCard title="Locked ROI" value={money(lockedRoi)} subtitle="Sum of profit transactions (approved/completed)" />
        </div>

        <section className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Active Plans</h2>
            <Link href="/dashboard/investments" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>

          <div className="bg-white rounded-lg border p-4">
            {activeInvestments.length === 0 ? (
              <div className="text-gray-600">No active plans yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeInvestments.map((inv) => (
                  <div key={inv.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">
                        {inv.plan_name || inv.plan?.name || `Investment #${inv.id}`}
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700">
                        {String(inv.status || "").toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                      <InfoRow label="Amount" value={money(inv.amount || 0)} />
                      <InfoRow label="Start" value={(inv.starts_at || inv.created_at || "").slice(0, 10) || "-"} />
                      <InfoRow label="End" value={(inv.ends_at || "").slice(0, 10) || "-"} />
                      <InfoRow
                        label="Daily ROI"
                        value={
                          inv.plan?.daily_roi !== undefined
                            ? `${inv.plan.daily_roi}%`
                            : "-"
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Recent Transactions</h2>
            <Link href="/dashboard/transactions" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>

          <div className="bg-white rounded-lg border overflow-hidden">
            {recentTransactions.length === 0 ? (
              <div className="p-4 text-gray-600">No transactions yet.</div>
            ) : (
              <div className="divide-y">
                {recentTransactions.slice(0, 8).map((t) => (
                  <div key={t.id} className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="font-medium">
                        {String(t.tx_type || "transaction").toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {(t.created_at || "").replace("T", " ").slice(0, 19) || "-"}
                        {t.reference ? ` • ${t.reference}` : ""}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{money(t.amount || 0)}</div>
                      <div className="text-xs text-gray-500">
                        {String(t.status || "").toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard(props: { title: string; value: string; subtitle?: string }) {
  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="text-sm text-gray-600">{props.title}</div>
      <div className="text-2xl font-bold mt-1">{props.value}</div>
      {props.subtitle ? <div className="text-xs text-gray-500 mt-1">{props.subtitle}</div> : null}
    </div>
  );
}

function InfoRow(props: { label: string; value: string }) {
  return (
    <div>
      <div className="text-gray-600">{props.label}</div>
      <div className="font-medium text-gray-900">{props.value}</div>
    </div>
  );
}
