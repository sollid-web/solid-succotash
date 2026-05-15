"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import dynamic from 'next/dynamic';

import { WalletProvider } from '@/_client/WalletProvider';
const WolvWalletSection = dynamic(() => import('@/_client/WolvWalletSection').then(mod => ({ default: mod.WolvWalletSection })), { ssr: false });
import { apiFetch } from "@/lib/api";

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

const txTypeConfig: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  deposit:    { label: "Deposit",    icon: "↓", color: "#7dd3fc", bg: "rgba(59,130,246,0.12)" },
  withdrawal: { label: "Withdrawal", icon: "↑", color: "#fca5a5", bg: "rgba(248,113,113,0.12)" },
  profit:     { label: "Profit",     icon: "◈", color: "#fbbf24", bg: "rgba(251,191,36,0.12)" },
  investment: { label: "Investment", icon: "⬡", color: "#93c5fd", bg: "rgba(59,130,246,0.12)" },
  bonus:      { label: "Bonus",      icon: "★", color: "#c7d2fe", bg: "rgba(148,163,184,0.12)" },
  fee:        { label: "Fee",        icon: "−", color: "#9ca3af", bg: "rgba(156,163,175,0.12)" },
};

const statusConfig: Record<string, { color: string; bg: string; dot: string }> = {
  approved:  { color: "#7dd3fc", bg: "rgba(59,130,246,0.12)",  dot: "#7dd3fc" },
  completed: { color: "#7dd3fc", bg: "rgba(59,130,246,0.12)",  dot: "#7dd3fc" },
  pending:   { color: "#facc15", bg: "rgba(250,204,21,0.12)",  dot: "#facc15" },
  rejected:  { color: "#fca5a5", bg: "rgba(248,113,113,0.12)",   dot: "#fca5a5" },
  failed:    { color: "#fca5a5", bg: "rgba(248,113,113,0.12)",   dot: "#fca5a5" },
};

export default function DashboardPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now] = useState(() => new Date());

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

        const anyUnauthorized =
          walletRes?.status === 401 || invRes?.status === 401 || txRes?.status === 401 ||
          walletRes?.status === 403 || invRes?.status === 403 || txRes?.status === 403;

        if (anyUnauthorized) throw new Error("Session expired. Please log in again.");
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

  const activeInvestments = useMemo(() =>
    investments.filter((i) => ["active", "approved"].includes(String(i.status))), [investments]);

  const totalInvested = useMemo(() =>
    activeInvestments.reduce((sum, i) => sum + (Number(i.amount) || 0), 0), [activeInvestments]);

  const lockedRoi = useMemo(() =>
    transactions
      .filter((t) => String(t.tx_type) === "profit" && ["approved", "completed"].includes(String(t.status)))
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0), [transactions]);

  const recentTransactions = useMemo(() =>
    [...transactions].sort((a, b) => {
      const da = safeDate(a.created_at)?.getTime() || 0;
      const db = safeDate(b.created_at)?.getTime() || 0;
      return db - da;
    }), [transactions]);

  const roiRate = totalInvested > 0 ? ((lockedRoi / totalInvested) * 100).toFixed(1) : "0.0";

  const planColors = [
    { from: "#193a93", to: "#0f2f89" },
    { from: "#0f5c7a", to: "#0f5c7a" },
    { from: "#212c50", to: "#212c50" },
    { from: "#053257", to: "#053257" },
  ];

  const planColorMap = {
    pioneer: planColors[0],
    vanguard: planColors[1],
    horizon: planColors[2],
    summit: planColors[3],
  };

  return (
    <div className="min-h-screen" style={{ background: "#0a0f1e", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        
        .stat-card { 
          background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(20px);
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          border-color: rgba(0,168,150,0.4);
          transform: translateY(-2px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .plan-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(255,255,255,0.07);
          transition: all 0.3s ease;
        }
        .plan-card:hover {
          border-color: rgba(0,168,150,0.35);
          box-shadow: 0 0 40px rgba(0,168,150,0.08);
        }
        .glow-teal { box-shadow: 0 0 30px rgba(0,168,150,0.2); }
        .progress-bar {
          background: linear-gradient(90deg, #00a896, #1a3a8f);
          border-radius: 99px;
          transition: width 1s ease;
        }
        .tx-row { transition: background 0.15s; }
        .tx-row:hover { background: rgba(255,255,255,0.03); }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
        .fade-up-1 { animation-delay: 0.05s; opacity: 0; }
        .fade-up-2 { animation-delay: 0.1s;  opacity: 0; }
        .fade-up-3 { animation-delay: 0.15s; opacity: 0; }
        .fade-up-4 { animation-delay: 0.2s;  opacity: 0; }
        .fade-up-5 { animation-delay: 0.25s; opacity: 0; }
        .fade-up-6 { animation-delay: 0.3s;  opacity: 0; }
        .shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .card-mini {
          background: linear-gradient(135deg, #1a3a8f 0%, #1e4db7 35%, #1a8fc1 75%, #0ea5c9 100%);
        }
      `}</style>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-28 sm:pb-10">

        {error && (
          <div className="mb-6 rounded-2xl p-4 fade-up" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}>
            ⚠ {error}
          </div>
        )}

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 fade-up fade-up-1">
          <div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "4px" }}>
              WolvCapital
            </div>
            <h1 style={{ color: "#fff", fontSize: "26px", fontWeight: 700, letterSpacing: "-0.5px", lineHeight: 1.2 }}>
              Portfolio Overview
            </h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginTop: "4px" }}>
              Monitor balances, ROI, and active plan performance
            </p>
          </div>
          <Link href="/dashboard/new-investment"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "12px 24px", borderRadius: "12px",
              background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
              color: "#fff", fontWeight: 600, fontSize: "14px",
              boxShadow: "0 8px 32px rgba(37,99,235,0.22)",
              textDecoration: "none", whiteSpace: "nowrap",
              transition: "all 0.2s",
            }}>
            <span style={{ fontSize: "16px" }}>+</span> New Investment
          </Link>
        </div>

        {/* ── Virtual Card Banner ── */}
        <div className="fade-up fade-up-2 mb-6" style={{
          borderRadius: "20px",
          background: "linear-gradient(135deg, rgba(26,58,143,0.6) 0%, rgba(14,165,201,0.4) 100%)",
          border: "1px solid rgba(0,168,150,0.3)",
          padding: "0",
          overflow: "hidden",
          display: "flex",
          alignItems: "stretch",
        }}>
          {/* Mini card visual */}
          <div className="card-mini" style={{
            width: "120px", flexShrink: 0, padding: "16px 14px",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: 0, right: 0, width: "80px", height: "80px",
              background: "rgba(255,255,255,0.07)", borderRadius: "50%", transform: "translate(30px,-30px)" }} />
            <div style={{ color: "#fff", fontSize: "9px", fontWeight: 700, letterSpacing: "1px" }}>WOLVCAPITAL</div>
            <div>
              <div style={{ width: "28px", height: "20px", borderRadius: "3px",
                background: "linear-gradient(135deg, #b8860b, #f5d06e, #b8860b)", marginBottom: "8px" }} />
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "8px", fontFamily: "monospace", letterSpacing: "1px" }}>
                •••• 7717
              </div>
            </div>
          </div>
          {/* Text content */}
          <div style={{ flex: 1, padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <div>
              <div style={{ color: "#fff", fontWeight: 600, fontSize: "15px", marginBottom: "3px" }}>
                Virtual Card
              </div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>
                Visa Infinite · Digital payments worldwide
              </div>
            </div>
            <Link href="/dashboard/card" style={{
              padding: "9px 18px", borderRadius: "10px",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff", fontSize: "13px", fontWeight: 600,
              textDecoration: "none", whiteSpace: "nowrap",
              backdropFilter: "blur(10px)",
            }}>
              View Card →
            </Link>
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-3 fade-up fade-up-3">
          <MetricCard
            label="Total Invested"
            value={money(totalInvested)}
            sub="Active capital"
            icon="⬡"
            accent="#3b82f6"
            loading={loading}
          />
          <MetricCard
            label="Locked ROI"
            value={money(lockedRoi)}
            sub="Profit earned"
            icon="◈"
            accent="#f59e0b"
            loading={loading}
          />
          <MetricCard
            label="Available Balance"
            value={money(wallet?.balance ?? 0)}
            sub="Ready to deploy"
            icon="◎"
            accent="#10b981"
            loading={loading}
          />
          <MetricCard
            label="Total Deposits"
            value={money(wallet?.total_deposits ?? 0)}
            sub="All time"
            icon="↓"
            accent="#00a896"
            loading={loading}
          />
          <MetricCard
            label="Withdrawals"
            value={money(wallet?.total_withdrawals ?? 0)}
            sub="Approved"
            icon="↑"
            accent="#8b5cf6"
            loading={loading}
            className="col-span-2 sm:col-span-1"
          />
        </div>

        {/* ── ROI Rate Banner ── */}
        {!loading && totalInvested > 0 && (
          <div className="fade-up fade-up-3 mb-6 rounded-2xl px-5 py-4 flex items-center justify-between" style={{
            background: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.03))",
            border: "1px solid rgba(245,158,11,0.15)",
          }}>
            <div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>Overall ROI Rate</div>
              <Link href="/wolv-token" style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", marginTop: "4px", display: "inline-block", textDecoration: "underline" }}>
                These profits become WOLV tokens →
              </Link>
            </div>
            <div style={{ color: "#f59e0b", fontWeight: 700, fontSize: "20px", fontFamily: "'DM Mono', monospace" }}>
              +{roiRate}%
            </div>
          </div>
        )}


        {/* ── WOLV Wallet ── */}
        <section className="fade-up fade-up-4 mb-6">
          <Link href="/wolv-token" style={{ textDecoration: "none", display: "block", marginBottom: "16px" }}>
            <h2 style={{ color: "#fff", fontSize: "18px", fontWeight: 600 }}>WOLV Token</h2>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", marginTop: "2px" }}>
              Connect your wallet to receive profit tokens
            </p>
          </Link>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,168,150,0.2)", borderRadius: "20px", padding: "24px" }}>
            <WalletProvider>
              <WolvWalletSection />
            </WalletProvider>
          </div>
        </section>

        {/* ── Active Plans ── */}
        <section className="mb-8 fade-up fade-up-4">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div>
              <h2 style={{ color: "#fff", fontSize: "18px", fontWeight: 600 }}>Active Plans</h2>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", marginTop: "2px" }}>
                {activeInvestments.length} plan{activeInvestments.length !== 1 ? "s" : ""} running
              </p>
            </div>
            <Link href="/dashboard/new-investment" style={{
              color: "#bfdbfe", fontSize: "13px", fontWeight: 500, textDecoration: "none",
              padding: "6px 14px", borderRadius: "8px",
              border: "1px solid rgba(59,130,246,0.25)",
              background: "rgba(59,130,246,0.08)",
            }}>
              + Add Plan
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1,2].map(i => (
                <div key={i} className="shimmer rounded-2xl" style={{ height: "220px" }} />
              ))}
            </div>
          ) : activeInvestments.length === 0 ? (
            <div style={{
              borderRadius: "20px", padding: "48px 24px", textAlign: "center",
              background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)",
            }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>📊</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontWeight: 500, marginBottom: "6px" }}>No active plans yet</div>
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", marginBottom: "20px" }}>Start investing to grow your portfolio</div>
              <Link href="/dashboard/new-investment" style={{
                padding: "10px 24px", borderRadius: "10px",
                background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
                color: "#fff", fontWeight: 600, fontSize: "14px", textDecoration: "none",
              }}>
                Start Investing
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeInvestments.map((inv, idx) => {
                const planName = inv.plan_name || inv.plan?.name || `Plan #${String(inv.id)}`;
                const dailyRoi = Number(inv.plan_daily_roi ?? inv.plan?.daily_roi ?? inv.plan?.roi_rate) || 0;
                const durationDays = Number(inv.plan_duration_days ?? inv.plan?.duration_days) || 0;
                const started = safeDate(inv.started_at) || safeDate(inv.created_at);
                let end = safeDate(inv.ends_at);
                if (!end && started && durationDays > 0) {
                  end = new Date(started);
                  end.setDate(end.getDate() + durationDays);
                }
                const elapsed = started ? Math.max(0, daysBetween(started, now)) : 0;
                const left = end ? Math.max(0, daysBetween(now, end)) : 0;
                const totalEarned = Number(inv.total_earned);
                const expectedTotal = Number(inv.expected_total);
                const progressPct = durationDays > 0 ? Math.min(100, Math.round((elapsed / durationDays) * 100)) : 0;
                const planSlug = planName.toLowerCase().includes("pioneer") ? "pioneer"
                  : planName.toLowerCase().includes("vanguard") ? "vanguard"
                  : planName.toLowerCase().includes("horizon") ? "horizon"
                  : planName.toLowerCase().includes("summit") ? "summit" : null;

                const planColors = [
                  { from: "#1d4ed8", to: "#1d4ed8" },
                  { from: "#0f5c7a", to: "#0f5c7a" },
                  { from: "#212c50", to: "#212c50" },
                  { from: "#053257", to: "#053257" },
                ];
                const col = planColors[idx % planColors.length];

                return (
                  <div key={String(inv.id)} className="plan-card rounded-2xl p-5">
                    {/* Plan header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                          <div style={{
                            width: "32px", height: "32px", borderRadius: "8px",
                            background: `linear-gradient(135deg, ${col.from}, ${col.to})`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "14px",
                          }}>⬡</div>
                          <span style={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>{planName}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{
                            padding: "2px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: 600,
                            background: "rgba(16,185,129,0.15)", color: "#10b981",
                            border: "1px solid rgba(16,185,129,0.25)",
                          }}>
                            ● ACTIVE
                          </span>
                          {dailyRoi > 0 && (
                            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>
                              {dailyRoi}% APY
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "2px" }}>
                          Amount
                        </div>
                        <div style={{ color: "#fff", fontWeight: 700, fontSize: "22px", fontFamily: "'DM Mono', monospace" }}>
                          {money(Number(inv.amount) || 0)}
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    {durationDays > 0 && (
                      <div style={{ marginBottom: "16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px" }}>Plan Progress</span>
                          <span style={{ color: "#fff", fontSize: "12px", fontWeight: 600 }}>{progressPct}%</span>
                        </div>
                        <div style={{ height: "6px", borderRadius: "99px", background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                          <div className="progress-bar" style={{ width: `${progressPct}%`, height: "100%" }} />
                        </div>
                      </div>
                    )}

                    {/* Stats grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "14px" }}>
                      {[
                        { label: "Started",  value: formatDate(started) },
                        { label: "End Date", value: formatDate(end) },
                        { label: "Duration", value: durationDays > 0 ? `${durationDays} days` : "-" },
                        { label: "Days Left", value: durationDays > 0 ? `${left}` : "-" },
                      ].map(item => (
                        <div key={item.label} style={{
                          padding: "10px 12px", borderRadius: "10px",
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}>
                          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "3px" }}>
                            {item.label}
                          </div>
                          <div style={{ color: "#fff", fontSize: "13px", fontWeight: 500 }}>{item.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Earned / Expected */}
                    {(Number.isFinite(totalEarned) || Number.isFinite(expectedTotal)) && (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "14px" }}>
                        <div style={{
                          padding: "12px", borderRadius: "10px",
                          background: "rgba(16,185,129,0.08)",
                          border: "1px solid rgba(16,185,129,0.15)",
                        }}>
                          <div style={{ color: "#10b981", fontSize: "10px", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "3px" }}>
                            Total Earned
                          </div>
                          <div style={{ color: "#10b981", fontSize: "15px", fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>
                            {Number.isFinite(totalEarned) ? money(totalEarned) : "-"}
                          </div>
                        </div>
                        <div style={{
                          padding: "12px", borderRadius: "10px",
                          background: "rgba(0,168,150,0.08)",
                          border: "1px solid rgba(0,168,150,0.15)",
                        }}>
                          <div style={{ color: "#00a896", fontSize: "10px", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "3px" }}>
                            Expected Total
                          </div>
                          <div style={{ color: "#00a896", fontSize: "15px", fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>
                            {Number.isFinite(expectedTotal) ? money(expectedTotal) : "-"}
                          </div>
                        </div>
                      </div>
                    )}

                    <Link href={planSlug ? `/plans/${planSlug}` : "/plans"} style={{
                      display: "block", textAlign: "center", padding: "10px",
                      borderRadius: "10px", background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.7)", fontSize: "13px", fontWeight: 500,
                      textDecoration: "none", transition: "all 0.2s",
                    }}>
                      View Details →
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Recent Activity ── */}
        <section className="fade-up fade-up-5 mb-8">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div>
              <h2 style={{ color: "#fff", fontSize: "18px", fontWeight: 600 }}>Recent Activity</h2>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", marginTop: "2px" }}>
                Latest transactions
              </p>
            </div>
            <Link href="/dashboard/transactions" style={{
              color: "#7dd3fc", fontSize: "13px", fontWeight: 500, textDecoration: "none",
              padding: "6px 14px", borderRadius: "8px",
              border: "1px solid rgba(59,130,246,0.3)",
              background: "rgba(59,130,246,0.08)",
            }}>
              View All
            </Link>
          </div>

          <div style={{
            borderRadius: "20px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            overflow: "hidden",
          }}>
            {loading ? (
              <div style={{ padding: "24px" }}>
                {[1,2,3].map(i => (
                  <div key={i} className="shimmer rounded-xl" style={{ height: "52px", marginBottom: "8px" }} />
                ))}
              </div>
            ) : recentTransactions.length === 0 ? (
              <div style={{ padding: "48px 24px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>
                No transactions yet
              </div>
            ) : (
              <div>
                {/* Header */}
                <div style={{
                  display: "grid", gridTemplateColumns: "auto 1fr auto auto",
                  gap: "12px", padding: "12px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}>
                  {["Type", "Date", "Status", "Amount"].map(h => (
                    <div key={h} style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 600 }}>
                      {h}
                    </div>
                  ))}
                </div>
                {recentTransactions.slice(0, 10).map((tx, i) => {
                  const d = safeDate(tx.created_at);
                  const type = txTypeConfig[String(tx.tx_type)] || { label: String(tx.tx_type), icon: "·", color: "#9ca3af", bg: "rgba(156,163,175,0.1)" };
                  const stat = statusConfig[String(tx.status)] || { color: "#9ca3af", bg: "rgba(156,163,175,0.1)", dot: "#9ca3af" };
                  const isCredit = ["deposit", "profit", "bonus"].includes(String(tx.tx_type));

                  return (
                    <div key={tx.id} className="tx-row" style={{
                      display: "grid", gridTemplateColumns: "auto 1fr auto auto",
                      gap: "12px", padding: "14px 20px", alignItems: "center",
                      borderBottom: i < recentTransactions.slice(0,10).length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    }}>
                      {/* Type icon */}
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "10px",
                        background: type.bg, display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: "16px", color: type.color,
                        fontWeight: 700, flexShrink: 0,
                      }}>
                        {type.icon}
                      </div>
                      {/* Label + date */}
                      <div>
                        <div style={{ color: "#fff", fontSize: "13px", fontWeight: 500, marginBottom: "2px" }}>
                          {type.label}
                        </div>
                        <div style={{ color: "rgba(203,213,225,0.65)", fontSize: "11px", fontFamily: "Inter, system-ui, sans-serif" }}>
                          {d ? d.toLocaleDateString("en-GB") : "-"} · {d ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                        </div>
                      </div>
                      {/* Status */}
                      <div style={{
                        padding: "3px 10px", borderRadius: "99px",
                        background: stat.bg, fontSize: "11px", fontWeight: 600,
                        color: stat.color, whiteSpace: "nowrap",
                      }}>
                        <span style={{ marginRight: "4px" }}>●</span>
                        {String(tx.status).charAt(0).toUpperCase() + String(tx.status).slice(1)}
                      </div>
                      {/* Amount */}
                      <div style={{
                        color: isCredit ? "#bfdbfe" : "#fca5a5",
                        fontFamily: "Inter, system-ui, sans-serif",
                        fontWeight: 600, fontSize: "14px",
                        whiteSpace: "nowrap",
                      }}>
                        {isCredit ? "+" : "-"}{money(Number(tx.amount) || 0)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

      </main>

      {/* Mobile CTA */}
      <div className="sm:hidden fixed bottom-4 inset-x-0 px-4 z-40">
        <Link href="/dashboard/new-investment" style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: "100%", padding: "16px", borderRadius: "16px",
          background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
          color: "#fff", fontWeight: 700, fontSize: "15px",
          textDecoration: "none", boxShadow: "0 8px 32px rgba(37,99,235,0.35)",
        }}>
          + Start New Investment
        </Link>
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub, icon, accent, loading, className }: {
  label: string; value: string; sub: string; icon: string;
  accent: string; loading?: boolean; className?: string;
}) {
  return (
    <div className={`stat-card rounded-2xl p-4 ${className || ""}`}>
      {loading ? (
        <div>
          <div className="shimmer rounded-lg" style={{ height: "12px", width: "60%", marginBottom: "12px" }} />
          <div className="shimmer rounded-lg" style={{ height: "24px", width: "80%", marginBottom: "8px" }} />
          <div className="shimmer rounded-lg" style={{ height: "10px", width: "40%" }} />
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", letterSpacing: "0.5px", textTransform: "uppercase" }}>
              {label}
            </div>
            <div style={{
              width: "28px", height: "28px", borderRadius: "8px",
              background: `rgba(${accent === "#3b82f6" ? "59,130,246" : accent === "#f59e0b" ? "245,158,11" : accent === "#10b981" ? "16,185,129" : accent === "#00a896" ? "0,168,150" : "139,92,246"},0.15)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: accent, fontSize: "14px",
            }}>
              {icon}
            </div>
          </div>
          <div style={{ color: "#fff", fontSize: "20px", fontWeight: 700, fontFamily: "'DM Mono', monospace", marginBottom: "4px", letterSpacing: "-0.5px" }}>
            {value}
          </div>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>{sub}</div>
        </>
      )}
    </div>
  );
}// WOLV section added below via edit
