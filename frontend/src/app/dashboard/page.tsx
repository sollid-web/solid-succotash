"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";

/**
 * Dashboard (simple + stable)
 * - Uses JWT from localStorage for Authorization header
 * - Shows a clear "session missing" message when token is absent/expired
 */

interface WalletData {
  balance: number;
  total_deposits: number;
  total_withdrawals: number;
}

type TxType =
  | "deposit"
  | "withdrawal"
  | "profit"
  | "investment"
  | "bonus"
  | "fee"
  | string;

type TxStatus =
  | "pending"
  | "approved"
  | "completed"
  | "rejected"
  | "failed"
  | string;

interface Transaction {
  id: string;
  tx_type: TxType;
  amount: number;
  status: TxStatus;
  created_at: string;
  reference?: string;
  description?: string;
}

interface Plan {
  name?: string;
  daily_roi?: number;
  roi_rate?: number;
  duration_days?: number;
}

interface Investment {
  id: number | string;
  amount: number;
  status: string;
  created_at?: string;
  started_at?: string;
  ends_at?: string;

  plan?: Plan;
  plan_name?: string;
  plan_daily_roi?: number;
  plan_duration_days?: number;

  total_earned?: number;
  expected_total?: number;
}

function money(n: number) {
  if (!Number.isFinite(n)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function safeDate(input?: string) {
  if (!input) return null;
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? null : d;
}

function daysBetween(a: Date, b: Date) {
  const ms = 24 * 60 * 60 * 1000;
  return Math.floor((b.getTime() - a.getTime()) / ms);
}

function formatDate(d: Date | null) {
  if (!d) return "-";
  return d.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function DashboardPage() {
  const router = useRouter();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [walletResult, invResult, txResult] = await Promise.allSettled([
          apiFetch("/api/wallet/"),
          apiFetch("/api/investments/my/"),
          apiFetch("/api/transactions/"),
        ]);

        const walletRes = walletResult.status === "fulfilled" ? walletResult.value : null;
        const invRes = invResult.status === "fulfilled" ? invResult.value : null;
        const txRes = txResult.status === "fulfilled" ? txResult.value : null;

        // If token is invalid/expired, backend returns 401.
        const anyUnauthorized =
          walletRes?.status === 401 ||
          invRes?.status === 401 ||
          txRes?.status === 401 ||
          walletRes?.status === 403 ||
          invRes?.status === 403 ||
          txRes?.status === 403;

        if (anyUnauthorized) {
          throw new Error("Session expired or missing. Please log in again.");
        }

        if (!walletRes || !walletRes.ok) {
          throw new Error(`Wallet fetch failed (${walletRes?.status || "network"})`);
        }
        if (!invRes || !invRes.ok) {
          throw new Error(`Investments fetch failed (${invRes?.status || "network"})`);
        }

        const walletJson = (await walletRes.json()) as WalletData;
        const invJson = (await invRes.json()) as Investment[];
        const txJson = txRes && txRes.ok ? ((await txRes.json()) as Transaction[]) : [];

        if (cancelled) return;

        setWallet(walletJson);
        setInvestments(Array.isArray(invJson) ? invJson : []);
        setTransactions(Array.isArray(txJson) ? txJson : []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load dashboard data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeInvestments = useMemo(() => {
    return investments.filter((i) => ["active", "approved"].includes(String(i.status)));
  }, [investments]);

  const totalInvested = useMemo(() => {
    return activeInvestments.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
  }, [activeInvestments]);

  const lockedRoi = useMemo(() => {
    return transactions
      .filter(
        (t) =>
          String(t.tx_type) === "profit" &&
          ["approved", "completed"].includes(String(t.status))
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

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
    router.push("/accounts/login");
  };

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
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {error ? (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard title="Current Balance" value={money(wallet?.balance ?? 0)} subtitle="Available funds" />
          <StatCard title="Total Deposits" value={money(wallet?.total_deposits ?? 0)} subtitle="Approved deposits" />
          <StatCard title="Total Withdrawals" value={money(wallet?.total_withdrawals ?? 0)} subtitle="Approved withdrawals" />
          <StatCard title="Total Invested" value={money(totalInvested)} subtitle="Active investments" />
          <StatCard title="Locked ROI" value={money(lockedRoi)} subtitle="Profit earned (locked)" />
        </div>

        <section className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Active Plans</h2>
            <Link href="/dashboard/new-investment" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>

          {loading ? (
            <div className="rounded-lg border bg-white p-6">Loading…</div>
          ) : activeInvestments.length === 0 ? (
            <div className="rounded-lg border bg-white p-6 text-gray-600">
              No active plans yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeInvestments.map((inv) => {
                const planName = inv.plan_name || inv.plan?.name || `Plan #${String(inv.id)}`;
                const dailyRoi =
                  Number(inv.plan_daily_roi ?? inv.plan?.daily_roi ?? inv.plan?.roi_rate) || 0;
                const durationDays = Number(inv.plan_duration_days ?? inv.plan?.duration_days) || 0;

                const started = safeDate(inv.started_at) || safeDate(inv.created_at);
                let end = safeDate(inv.ends_at);
                if (!end && started && durationDays > 0) {
                  end = new Date(started);
                  end.setDate(end.getDate() + durationDays);
                }

                const today = new Date();
                const elapsed = started ? Math.max(0, daysBetween(started, today)) : 0;
                const left = end ? Math.max(0, daysBetween(today, end)) : 0;

                const totalEarned = Number(inv.total_earned);
                const expectedTotal = Number(inv.expected_total);

                return (
                  <div key={String(inv.id)} className="rounded-xl border bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-lg font-semibold">{planName}</div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-blue-700">
                            {String(inv.status).toUpperCase()}
                          </span>
                          <span>{dailyRoi > 0 ? `${dailyRoi}% daily ROI` : "Daily ROI"}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-gray-500">Investment Amount</div>
                        <div className="text-2xl font-semibold">{money(Number(inv.amount) || 0)}</div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <InfoRow label="Started" value={formatDate(started)} />
                      <InfoRow label="End Date" value={formatDate(end)} />
                      <InfoRow label="Duration" value={durationDays > 0 ? `${durationDays} days` : "-"} />
                      <InfoRow
                        label="Progress"
                        value={durationDays > 0 ? `${Math.min(elapsed, durationDays)}/${durationDays} days` : "-"}
                      />
                      <InfoRow label="Days left" value={durationDays > 0 ? String(left) : "-"} />
                      <InfoRow label="Daily ROI" value={dailyRoi > 0 ? `${dailyRoi}%` : "-"} />
                    </div>

                    {(Number.isFinite(totalEarned) || Number.isFinite(expectedTotal)) && (
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-lg bg-green-50 p-4">
                          <div className="text-xs text-green-700">Total Earned</div>
                          <div className="text-xl font-semibold text-green-800">
                            {Number.isFinite(totalEarned) ? money(totalEarned) : "-"}
                          </div>
                        </div>
                        <div className="rounded-lg bg-indigo-50 p-4">
                          <div className="text-xs text-indigo-700">Expected Total</div>
                          <div className="text-xl font-semibold text-indigo-800">
                            {Number.isFinite(expectedTotal) ? money(expectedTotal) : "-"}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <Link href="/dashboard/transactions" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>

          <div className="rounded-xl border bg-white shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-4 py-4" colSpan={4}>
                      Loading…
                    </td>
                  </tr>
                ) : recentTransactions.length === 0 ? (
                  <tr>
                    <td className="px-4 py-4 text-gray-600" colSpan={4}>
                      No transactions yet.
                    </td>
                  </tr>
                ) : (
                  recentTransactions.slice(0, 10).map((tx) => {
                    const d = safeDate(tx.created_at);
                    return (
                      <tr key={tx.id} className="border-t">
                        <td className="px-4 py-3 whitespace-nowrap">{d ? d.toLocaleString() : "-"}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{String(tx.tx_type)}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{String(tx.status)}</td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">{money(Number(tx.amount) || 0)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard(props: { title: string; value: string; subtitle: string }) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="text-sm text-gray-600">{props.title}</div>
      <div className="text-2xl font-semibold mt-2">{props.value}</div>
      <div className="text-xs text-gray-500 mt-1">{props.subtitle}</div>
    </div>
  );
}

function InfoRow(props: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{props.label}</div>
      <div className="text-sm font-medium text-gray-900">{props.value}</div>
    </div>
  );
}
