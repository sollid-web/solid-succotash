"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { buildApiUrl } from "@/lib/api";
import { authHeaders } from "@/lib/auth";

type WalletResponse = {
  balance?: string | number;
  total_deposits?: string | number;
  total_withdrawals?: string | number;
};

type Investment = {
  id: number;
  status?: string;
  amount?: string | number;
  plan_name?: string;
  plan?: { name?: string };
  ends_at?: string;
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

export default function WithdrawPage() {
  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [investment, setInvestment] = useState<number | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [reference, setReference] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const eligibleInvestments = useMemo(() => {
    // If your backend marks withdrawable investments differently, change this filter.
    const endedStatuses = ["ended", "expired", "completed", "finished"];
    return investments.filter((i) => endedStatuses.includes(String(i.status || "").toLowerCase()));
  }, [investments]);

  useEffect(() => {
    let cancelled = false;

    async function apiGet<T>(path: string): Promise<T> {
      const res = await fetch(buildApiUrl(path), {
        method: "GET",
        headers: authHeaders(),
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
      setError("");
      setMessage("");

      try {
        const [w, inv] = await Promise.all([
          apiGet<WalletResponse>("/api/wallet/"),
          apiGet<any>("/api/investments/my/"),
        ]);

        if (cancelled) return;

        setWallet(w);

        const invArr = Array.isArray(inv) ? inv : Array.isArray(inv?.results) ? inv.results : [];
        setInvestments(invArr);
      } catch (e: any) {
        if (cancelled) return;
        setError(`Withdraw page fetch failed: ${String(e?.message || e)}`);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!investment) {
      setError("Please select an investment.");
      return;
    }

    const amt = Number(amount);
    if (!isFinite(amt) || amt <= 0) {
      setError("Enter a valid withdrawal amount.");
      return;
    }

    setLoading(true);

    try {
      // IMPORTANT:
      // If your backend uses a different route, change ONLY this path:
      // Examples: "/api/withdrawals/request/" or "/api/withdrawals/create/"
      const res = await fetch(buildApiUrl("/api/withdrawals/"), {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        credentials: "include",
        body: JSON.stringify({
          investment_id: investment,
          amount: amt,
          reference: reference || "",
        }),
      });

      if (!res.ok) {
        const msg = await readErrorText(res);
        throw new Error(`${res.status} ${res.statusText}: ${msg}`);
      }

      setMessage("Withdrawal request submitted. Awaiting admin approval.");
      setAmount("");
      setReference("");
      setInvestment(null);
    } catch (e: any) {
      setError(`Withdrawal submit failed: ${String(e?.message || e)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Withdraw Funds</h1>
            <Link href="/dashboard" className="text-sm text-[#2563eb] hover:underline">
              Back to dashboard
            </Link>
          </div>

          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border p-4">
              <div className="text-sm text-gray-600">Wallet Balance</div>
              <div className="text-xl font-bold mt-1">{money(wallet?.balance ?? 0)}</div>
            </div>
            <div className="rounded-xl border p-4">
              <div className="text-sm text-gray-600">Total Deposits</div>
              <div className="text-xl font-bold mt-1">{money(wallet?.total_deposits ?? 0)}</div>
            </div>
            <div className="rounded-xl border p-4">
              <div className="text-sm text-gray-600">Total Withdrawals</div>
              <div className="text-xl font-bold mt-1">{money(wallet?.total_withdrawals ?? 0)}</div>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-6 max-w-xl">
            {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}
            {message && <div className="p-3 bg-amber-50 text-amber-700 rounded-xl text-sm">{message}</div>}

            <div>
              <label htmlFor="withdrawInvestment" className="block text-sm font-semibold text-gray-700 mb-2">
                Select Investment (ended/expired)
              </label>
              <select
                id="withdrawInvestment"
                value={investment ?? ""}
                onChange={(e) => setInvestment(e.target.value ? Number(e.target.value) : null)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#2563eb]"
              >
                <option value="">Select…</option>
                {eligibleInvestments.length === 0 && (
                  <option value="" disabled>
                    No expired investments available
                  </option>
                )}
                {eligibleInvestments.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.plan_name || inv.plan?.name || `Investment #${inv.id}`}
                    {inv.ends_at ? ` (Ended: ${inv.ends_at.slice(0, 10)})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="withdrawAmount" className="block text-sm font-semibold text-gray-700 mb-2">
                Amount (USD)
              </label>
              <input
                id="withdrawAmount"
                aria-label="Withdrawal amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#2563eb]"
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="withdrawReference" className="block text-sm font-semibold text-gray-700 mb-2">
                Reference / Notes
              </label>
              <input
                id="withdrawReference"
                aria-label="Withdrawal reference or notes"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#2563eb]"
                placeholder="e.g., Payout to bank"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Request Withdrawal"}
            </button>

            <div className="text-xs text-gray-500">
              If you still get 404/401 after this, it is not “frontend styling” — it means the backend route or auth storage key must be aligned.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
