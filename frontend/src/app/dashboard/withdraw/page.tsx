"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

type WalletResponse = { balance?: string | number; total_deposits?: string | number; total_withdrawals?: string | number };
type Investment = { id: number; status?: string; amount?: string | number; plan_name?: string; plan?: { name?: string }; ends_at?: string; created_at?: string };

function money(x: string | number) {
  const n = Number(x || 0);
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(isFinite(n) ? n : 0);
}

async function readErrorText(res: Response) {
  const txt = await res.text();
  try { const j = JSON.parse(txt); if (j?.detail) return String(j.detail); return txt; } catch { return txt; }
}

export default function WithdrawPage() {
  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [investment, setInvestment] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [hasActiveCard, setHasActiveCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const eligibleInvestments = useMemo(() => investments.filter(i => ["ended","expired","completed","finished"].includes(String(i.status || "").toLowerCase())), [investments]);

  useEffect(() => {
    let cancelled = false;
    async function apiGet<T>(path: string): Promise<T> {
      const res = await apiFetch(path, { method: "GET", cache: "no-store" });
      if (!res.ok) { const msg = await readErrorText(res); throw new Error(msg); }
      return await res.json() as T;
    }
    async function load() {
      setError(""); setMessage("");
      try {
        const [w, inv, cardsRes] = await Promise.all([apiGet<WalletResponse>("/api/wallet/"), apiGet<any>("/api/investments/my/"), apiFetch("/api/virtual-cards/")]);
        if (cardsRes.ok) { const cardsData = await cardsRes.json(); const cardsArr = Array.isArray(cardsData) ? cardsData : []; if (!cancelled) setHasActiveCard(cardsArr.some((c: any) => c.status === "active")); }
        if (cancelled) return;
        setWallet(w);
        setInvestments(Array.isArray(inv) ? inv : Array.isArray(inv?.results) ? inv.results : []);
      } catch (e: any) { if (cancelled) return; setError(`Failed to load: ${String(e?.message || e)}`); }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(""); setMessage("");
    if (!investment) return setError("Please select an investment.");
    const amt = Number(amount);
    if (!isFinite(amt) || amt <= 0) return setError("Enter a valid withdrawal amount.");
    setLoading(true);
    try {
      const res = await apiFetch("/api/transactions/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tx_type: "withdrawal", investment_id: investment, amount: amt, reference: reference || "" }) });
      if (!res.ok) { const msg = await readErrorText(res); throw new Error(msg); }
      setMessage("Withdrawal request submitted. Awaiting admin approval."); setAmount(""); setReference(""); setInvestment(null);
    } catch (e: any) { setError(`Withdrawal failed: ${String(e?.message || e)}`); }
    finally { setLoading(false); }
  }

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ color: "#fff", fontSize: "24px", fontWeight: 700, marginBottom: "4px" }}>Withdraw Funds</h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>Request a withdrawal from your ended investments</p>
      </div>

      {/* Wallet stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "24px" }}>
        {[
          { label: "Wallet Balance", value: money(wallet?.balance ?? 0), color: "#10b981" },
          { label: "Total Deposits", value: money(wallet?.total_deposits ?? 0), color: "#3b82f6" },
          { label: "Total Withdrawals", value: money(wallet?.total_withdrawals ?? 0), color: "#f59e0b" },
        ].map(item => (
          <div key={item.label} style={{ borderRadius: "16px", padding: "16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "8px" }}>{item.label}</div>
            <div style={{ color: item.color, fontSize: "20px", fontWeight: 700, fontFamily: "monospace" }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: "560px" }}>
        {error && <div style={{ padding: "12px 16px", borderRadius: "12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontSize: "13px", marginBottom: "16px" }}>{error}</div>}
        {message && <div style={{ padding: "12px 16px", borderRadius: "12px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399", fontSize: "13px", marginBottom: "16px" }}>{message}</div>}
        {!hasActiveCard && (
          <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", marginBottom: "16px" }}>
            <p style={{ color: "#fbbf24", fontWeight: 600, fontSize: "13px", marginBottom: "4px" }}>Virtual card required</p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>
              <Link href="/dashboard/card" style={{ color: "#00a896" }}>Activate a Virtual Card</Link> to unlock withdrawals.
            </p>
          </div>
        )}

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label>Select Investment (ended/expired)</label>
            <select value={investment ?? ""} onChange={e => setInvestment(e.target.value ? Number(e.target.value) : null)}>
              <option value="">Select…</option>
              {eligibleInvestments.length === 0 && <option value="" disabled>No expired investments available</option>}
              {eligibleInvestments.map(inv => (
                <option key={inv.id} value={inv.id}>{inv.plan_name || inv.plan?.name || `Investment #${inv.id}`}{inv.ends_at ? ` (Ended: ${inv.ends_at.slice(0,10)})` : ""}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Amount (USD)</label>
            <input type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
          </div>
          <div>
            <label>Reference / Notes</label>
            <input value={reference} onChange={e => setReference(e.target.value)} placeholder="e.g., Payout to bank" />
          </div>
          <button type="submit" disabled={loading || !hasActiveCard} className="btn-cta-sky" style={{ width: "fit-content" }}>
            {loading ? "Submitting..." : hasActiveCard ? "Request Withdrawal" : "Activate Card First"}
          </button>
        </form>
      </div>
    </div>
  );
}