"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";

/* ─── Types (unchanged) ─────────────────────────────────── */
interface WalletData {
  balance: number;
  total_deposits: number;
  total_withdrawals: number;
}
type TxType = "deposit" | "withdrawal" | "profit" | "investment" | "bonus" | "fee" | string;
type TxStatus = "pending" | "approved" | "completed" | "rejected" | "failed" | string;
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

/* ─── Helpers (unchanged) ───────────────────────────────── */
function money(n: number) {
  if (!Number.isFinite(n)) return "$0.00";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}
function safeDate(input?: string) {
  if (!input) return null;
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? null : d;
}
function daysBetween(a: Date, b: Date) {
  return Math.floor((b.getTime() - a.getTime()) / (24 * 60 * 60 * 1000));
}
function formatDate(d: Date | null) {
  if (!d) return "—";
  return d.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "2-digit" });
}

/* ─── Tx icon / color map ───────────────────────────────── */
function txMeta(type: string, status: string) {
  const t = String(type).toLowerCase();
  const s = String(status).toLowerCase();
  const icon = t === "deposit" ? "↓" : t === "withdrawal" ? "↑" : t === "profit" ? "%" : t === "investment" ? "◈" : t === "bonus" ? "★" : "·";
  const color = t === "deposit" ? "#22c55e" : t === "withdrawal" ? "#f59e0b" : t === "profit" ? "#3b82f6" : t === "investment" ? "#8b5cf6" : "#94a3b8";
  const statusColor = ["approved","completed"].includes(s) ? "#22c55e" : s === "pending" ? "#f59e0b" : ["rejected","failed"].includes(s) ? "#ef4444" : "#94a3b8";
  const statusBg = ["approved","completed"].includes(s) ? "rgba(34,197,94,0.1)" : s === "pending" ? "rgba(245,158,11,0.1)" : ["rejected","failed"].includes(s) ? "rgba(239,68,68,0.1)" : "rgba(148,163,184,0.1)";
  return { icon, color, statusColor, statusBg };
}

/* ─── MAIN PAGE ─────────────────────────────────────────── */
export default function DashboardPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ── API fetch (all routes preserved) ── */
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true); setError(null);
      try {
        const [walletResult, invResult, txResult] = await Promise.allSettled([
          apiFetch("/api/wallet/"),
          apiFetch("/api/investments/my/"),
          apiFetch("/api/transactions/"),
        ]);
        const walletRes = walletResult.status === "fulfilled" ? walletResult.value : null;
        const invRes = invResult.status === "fulfilled" ? invResult.value : null;
        const txRes = txResult.status === "fulfilled" ? txResult.value : null;
        const anyUnauthorized = [walletRes, invRes, txRes].some(r => r?.status === 401 || r?.status === 403);
        if (anyUnauthorized) throw new Error("Session expired or missing. Please log in again.");
        if (!walletRes || !walletRes.ok) throw new Error(`Wallet fetch failed (${walletRes?.status || "network"})`);
        if (!invRes || !invRes.ok) throw new Error(`Investments fetch failed (${invRes?.status || "network"})`);
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
    return () => { cancelled = true; };
  }, []);

  const activeInvestments = useMemo(() => investments.filter(i => ["active","approved"].includes(String(i.status))), [investments]);
  const totalInvested = useMemo(() => activeInvestments.reduce((s, i) => s + (Number(i.amount) || 0), 0), [activeInvestments]);
  const lockedRoi = useMemo(() => transactions.filter(t => String(t.tx_type) === "profit" && ["approved","completed"].includes(String(t.status))).reduce((s, t) => s + (Number(t.amount) || 0), 0), [transactions]);
  const recentTransactions = useMemo(() => [...transactions].sort((a, b) => (safeDate(b.created_at)?.getTime() || 0) - (safeDate(a.created_at)?.getTime() || 0)), [transactions]);

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        .stat-card { transition: all 0.22s; }
        .stat-card:hover { transform: translateY(-3px); }
        .inv-card { transition: all 0.22s; }
        .inv-card:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(37,99,235,0.10) !important; }
        .tx-row { transition: background 0.15s; }
        .tx-row:hover { background: #f8faff !important; }
        .quick-btn { transition: all 0.2s; }
        .quick-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(37,99,235,0.25) !important; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.38s ease forwards; }
      `}</style>

      {/* Error banner */}
      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "14px 20px", marginBottom: 24, color: "#dc2626", fontSize: 14 }}>
          {error}
        </div>
      )}

      {/* ── PAGE HEADER ── */}
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0b1929", margin: 0, lineHeight: 1.2 }}>Portfolio Overview</h1>
            <p style={{ fontSize: 14, color: "#64748b", marginTop: 6 }}>Monitor balances, ROI, and active plan performance.</p>
          </div>
          <Link href="/dashboard/new-investment"
            className="quick-btn action-btn"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", background: "linear-gradient(135deg, #1d4ed8, #2563eb)", color: "white", borderRadius: 12, fontWeight: 600, fontSize: 14, textDecoration: "none", boxShadow: "0 4px 16px rgba(37,99,235,0.35)" }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> New Investment
          </Link>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="fade-up" style={{ animationDelay: "0.05s", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Current Balance", value: money(wallet?.balance ?? 0), sub: "Available funds", icon: "💰", color: "#2563eb", bg: "linear-gradient(135deg,#eff6ff,#dbeafe)" },
          { label: "Total Invested", value: money(totalInvested), sub: "Active investments", icon: "◈", color: "#7c3aed", bg: "linear-gradient(135deg,#f5f3ff,#ede9fe)" },
          { label: "Locked ROI", value: money(lockedRoi), sub: "Profit earned", icon: "%", color: "#059669", bg: "linear-gradient(135deg,#ecfdf5,#d1fae5)" },
          { label: "Total Deposits", value: money(wallet?.total_deposits ?? 0), sub: "Approved deposits", icon: "↓", color: "#0891b2", bg: "linear-gradient(135deg,#ecfeff,#cffafe)" },
          { label: "Total Withdrawals", value: money(wallet?.total_withdrawals ?? 0), sub: "Approved withdrawals", icon: "↑", color: "#d97706", bg: "linear-gradient(135deg,#fffbeb,#fef3c7)" },
        ].map((s, i) => (
          <div key={s.label} className="stat-card" style={{
            background: "white", borderRadius: 16, padding: "20px 22px",
            border: "1px solid #e8eef8", boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            animationDelay: `${0.05 + i * 0.04}s`,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8 }}>{s.label}</span>
              <div style={{ width: 36, height: 36, background: s.bg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: s.color }}>
                {s.icon}
              </div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#0b1929", fontFamily: "'DM Mono', monospace", letterSpacing: -0.5 }}>
              {loading ? <span style={{ color: "#cbd5e1" }}>—</span> : s.value}
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── QUICK ACTIONS + VIRTUAL CARD ── */}
      <div className="fade-up" style={{ animationDelay: "0.1s", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>

        {/* Virtual Card banner */}
        <div style={{
          gridColumn: "1 / -1",
          background: "linear-gradient(135deg, #0b1929 0%, #0d2748 40%, #1d4ed8 100%)",
          borderRadius: 20, padding: "24px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
          boxShadow: "0 8px 32px rgba(37,99,235,0.3)", position: "relative", overflow: "hidden",
        }}>
          {/* Background shapes */}
          <div style={{ position: "absolute", top: -30, right: 80, width: 200, height: 200, background: "rgba(255,255,255,0.04)", borderRadius: "50%", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, right: -20, width: 160, height: 160, background: "rgba(37,99,235,0.15)", borderRadius: "50%", pointerEvents: "none" }} />

          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <span style={{ fontSize: 28 }}>💳</span>
              <div>
                <div style={{ color: "white", fontWeight: 700, fontSize: 17 }}>WolvCapital Virtual Card</div>
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>Visa Infinite · Instant access · Worldwide transactions</div>
              </div>
            </div>
          </div>
          <Link href="/dashboard/card" className="quick-btn"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 22px", background: "white", color: "#1d4ed8", borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.2)", whiteSpace: "nowrap" }}>
            Manage Card →
          </Link>
        </div>

        {/* Quick deposit */}
        <Link href="/dashboard/deposit" className="quick-btn"
          style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 20px", background: "white", borderRadius: 16, border: "1px solid #e8eef8", textDecoration: "none", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
          <div style={{ width: 44, height: 44, background: "linear-gradient(135deg,#ecfdf5,#d1fae5)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#059669" }}>↓</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#0b1929" }}>Deposit Funds</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Add balance to your account</div>
          </div>
        </Link>

        {/* Quick withdraw */}
        <Link href="/dashboard/withdraw" className="quick-btn"
          style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 20px", background: "white", borderRadius: 16, border: "1px solid #e8eef8", textDecoration: "none", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
          <div style={{ width: 44, height: 44, background: "linear-gradient(135deg,#fffbeb,#fef3c7)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#d97706" }}>↑</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#0b1929" }}>Withdraw</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Transfer earnings to wallet</div>
          </div>
        </Link>
      </div>

      {/* ── ACTIVE PLANS ── */}
      <div className="fade-up" style={{ animationDelay: "0.15s", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0b1929", margin: 0 }}>Active Plans</h2>
            <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>{activeInvestments.length} plan{activeInvestments.length !== 1 ? "s" : ""} running</p>
          </div>
          <Link href="/plans" style={{ fontSize: 13, color: "#2563eb", textDecoration: "none", fontWeight: 500 }}>Browse Plans →</Link>
        </div>

        {loading ? (
          <div style={{ background: "white", borderRadius: 16, padding: 40, textAlign: "center", border: "1px solid #e8eef8" }}>
            <div style={{ width: 32, height: 32, border: "3px solid #dbeafe", borderTop: "3px solid #2563eb", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
            <div style={{ color: "#94a3b8", fontSize: 14 }}>Loading plans…</div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : activeInvestments.length === 0 ? (
          <div style={{ background: "white", borderRadius: 16, padding: "40px 32px", textAlign: "center", border: "1px solid #e8eef8" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>◈</div>
            <div style={{ fontWeight: 600, color: "#0b1929", fontSize: 16, marginBottom: 6 }}>No active plans yet</div>
            <div style={{ color: "#94a3b8", fontSize: 14, marginBottom: 20 }}>Start an investment to grow your portfolio</div>
            <Link href="/dashboard/new-investment" style={{ display: "inline-flex", padding: "11px 24px", background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "white", borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
              Start Investing
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {activeInvestments.map((inv) => {
              const planName = inv.plan_name || inv.plan?.name || `Plan #${String(inv.id)}`;
              const dailyRoi = Number(inv.plan_daily_roi ?? inv.plan?.daily_roi ?? inv.plan?.roi_rate) || 0;
              const durationDays = Number(inv.plan_duration_days ?? inv.plan?.duration_days) || 0;
              const started = safeDate(inv.started_at) || safeDate(inv.created_at);
              let end = safeDate(inv.ends_at);
              if (!end && started && durationDays > 0) { end = new Date(started); end.setDate(end.getDate() + durationDays); }
              const today = new Date();
              const elapsed = started ? Math.max(0, daysBetween(started, today)) : 0;
              const left = end ? Math.max(0, daysBetween(today, end)) : 0;
              const progressPct = durationDays > 0 ? Math.min(100, Math.round((elapsed / durationDays) * 100)) : 0;
              const totalEarned = Number(inv.total_earned);
              const expectedTotal = Number(inv.expected_total);
              const statusLabel = String(inv.status || "").toUpperCase();
              const planSlug = planName.toLowerCase().includes("pioneer") ? "pioneer" : planName.toLowerCase().includes("vanguard") ? "vanguard" : planName.toLowerCase().includes("horizon") ? "horizon" : planName.toLowerCase().includes("summit") ? "summit" : null;

              return (
                <div key={String(inv.id)} className="inv-card" style={{ background: "white", borderRadius: 18, padding: "22px 24px", border: "1px solid #e8eef8", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
                  {/* Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: "#0b1929", marginBottom: 6 }}>{planName}</div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ background: "rgba(34,197,94,0.1)", color: "#16a34a", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>
                          {statusLabel}
                        </span>
                        {dailyRoi > 0 && (
                          <span style={{ background: "#eff6ff", color: "#2563eb", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>
                            {dailyRoi}% / day
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 3 }}>Invested</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: "#0b1929", fontFamily: "'DM Mono', monospace" }}>{money(Number(inv.amount) || 0)}</div>
                    </div>
                  </div>

                  {/* Progress */}
                  {durationDays > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: "#64748b" }}>Plan progress</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#0b1929" }}>{progressPct}%</span>
                      </div>
                      <div style={{ height: 6, background: "#f1f5fb", borderRadius: 10, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${progressPct}%`, background: "linear-gradient(90deg, #1d4ed8, #2563eb)", borderRadius: 10, transition: "width 0.5s" }} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                        <span style={{ fontSize: 11, color: "#94a3b8" }}>{Math.min(elapsed, durationDays)} of {durationDays} days</span>
                        <span style={{ fontSize: 11, color: "#94a3b8" }}>{left} days left</span>
                      </div>
                    </div>
                  )}

                  {/* Info grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                    {[
                      { label: "Started", value: formatDate(started) },
                      { label: "End Date", value: formatDate(end) },
                      { label: "Duration", value: durationDays > 0 ? `${durationDays} days` : "—" },
                      { label: "Daily ROI", value: dailyRoi > 0 ? `${dailyRoi}%` : "—" },
                    ].map(row => (
                      <div key={row.label} style={{ background: "#f8faff", borderRadius: 10, padding: "10px 12px" }}>
                        <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>{row.label}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#0b1929" }}>{row.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Earnings */}
                  {(Number.isFinite(totalEarned) || Number.isFinite(expectedTotal)) && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                      <div style={{ background: "linear-gradient(135deg,#ecfdf5,#d1fae5)", borderRadius: 12, padding: "14px 16px" }}>
                        <div style={{ fontSize: 11, color: "#059669", fontWeight: 600, marginBottom: 4 }}>Total Earned</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: "#065f46", fontFamily: "'DM Mono', monospace" }}>
                          {Number.isFinite(totalEarned) ? money(totalEarned) : "—"}
                        </div>
                      </div>
                      <div style={{ background: "linear-gradient(135deg,#eff6ff,#dbeafe)", borderRadius: 12, padding: "14px 16px" }}>
                        <div style={{ fontSize: 11, color: "#2563eb", fontWeight: 600, marginBottom: 4 }}>Expected Total</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: "#1e40af", fontFamily: "'DM Mono', monospace" }}>
                          {Number.isFinite(expectedTotal) ? money(expectedTotal) : "—"}
                        </div>
                      </div>
                    </div>
                  )}

                  <Link href={planSlug ? `/plans/${planSlug}` : "/plans"}
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#2563eb", textDecoration: "none" }}>
                    View Plan Details →
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── RECENT TRANSACTIONS ── */}
      <div className="fade-up" style={{ animationDelay: "0.2s" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0b1929", margin: 0 }}>Recent Activity</h2>
            <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>Last {Math.min(recentTransactions.length, 10)} transactions</p>
          </div>
          <Link href="/dashboard/transactions" style={{ fontSize: 13, color: "#2563eb", textDecoration: "none", fontWeight: 500 }}>View all →</Link>
        </div>

        <div style={{ background: "white", borderRadius: 18, border: "1px solid #e8eef8", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>Loading transactions…</div>
          ) : recentTransactions.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>No transactions yet.</div>
          ) : (
            <>
              {/* Table header */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 100px 120px", gap: 8, padding: "12px 20px", background: "#f8faff", borderBottom: "1px solid #e8eef8" }}>
                {["Transaction", "Type", "Status", "Amount"].map((h, i) => (
                  <div key={h} style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, textAlign: i === 3 ? "right" : "left" }}>{h}</div>
                ))}
              </div>
              {recentTransactions.slice(0, 10).map((tx, i) => {
                const d = safeDate(tx.created_at);
                const meta = txMeta(tx.tx_type, tx.status);
                const isLast = i === Math.min(recentTransactions.length, 10) - 1;
                return (
                  <div key={tx.id} className="tx-row" style={{
                    display: "grid", gridTemplateColumns: "1fr 140px 100px 120px", gap: 8, padding: "14px 20px",
                    borderBottom: isLast ? "none" : "1px solid #f1f5fb", alignItems: "center",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, background: `${meta.color}18`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: meta.color, fontSize: 15, fontWeight: 700, flexShrink: 0 }}>
                        {meta.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: "#0b1929" }}>{tx.description || `Transaction #${String(tx.id).slice(-6)}`}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{d ? d.toLocaleString() : "—"}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: meta.color, textTransform: "capitalize" }}>{String(tx.tx_type)}</div>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: meta.statusColor, background: meta.statusBg, padding: "3px 10px", borderRadius: 20, textTransform: "capitalize" }}>
                        {String(tx.status)}
                      </span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0b1929", textAlign: "right", fontFamily: "'DM Mono', monospace" }}>
                      {money(Number(tx.amount) || 0)}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* Mobile FAB */}
      <div className="lg:hidden" style={{ position: "fixed", bottom: 20, insetInline: 0, padding: "0 16px", zIndex: 50 }}>
        <Link href="/dashboard/new-investment"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "15px 24px", background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "white", borderRadius: 16, fontWeight: 700, fontSize: 15, textDecoration: "none", boxShadow: "0 6px 24px rgba(37,99,235,0.45)" }}>
          + New Investment
        </Link>
      </div>
    </div>
  );
}