"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useVirtualCard } from "@/hooks/useVirtualCard";
import { apiFetch } from "@/lib/api";

function money(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(n);
}

function maskNumber(num: string) {
  if (!num || num.length < 4) return "•••• •••• •••• ••••";
  return `•••• •••• •••• ${num.slice(-4)}`;
}

function formatExpiry(month: string, year: string) {
  if (!month || !year) return "••/••";
  return `${month.padStart(2, "0")}/${year}`;
}

function Toast({ message, show }: { message: string; show: boolean }) {
  return (
    <div
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-green-500 text-white text-sm font-semibold shadow-lg whitespace-nowrap transition-all duration-300 ${
        show
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      {message}
    </div>
  );
}

function StatusBadge({ status, isActive }: { status: string; isActive: boolean }) {
  const map: Record<string, string> = {
    active:    "bg-green-100 text-green-700 border-green-200",
    approved:  "bg-blue-100 text-blue-700 border-blue-200",
    pending:   "bg-yellow-100 text-yellow-700 border-yellow-200",
    suspended: "bg-red-100 text-red-700 border-red-200",
    rejected:  "bg-gray-100 text-gray-600 border-gray-200",
    expired:   "bg-gray-100 text-gray-500 border-gray-200",
  };
  const cls = map[status] ?? "bg-gray-100 text-gray-600 border-gray-200";
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {isActive ? "Active" : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function VirtualCardPage() {
  const { card, loading, error, refetch } = useVirtualCard();
  const [isFlipped, setIsFlipped]     = useState(false);
  const [isFrozen, setIsFrozen]       = useState(false);
  const [freezing, setFreezing]       = useState(false);
  const [showCvv, setShowCvv]         = useState(false);
  const [showFull, setShowFull]       = useState(false);
  const [toast, setToast]             = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [showModal, setShowModal]     = useState<"freeze" | "limits" | "replace" | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2500);
  }

  async function copyToClipboard(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // fallback for older browsers
      const el = document.createElement("textarea");
      el.value = value;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    showToast(`${label} copied!`);
  }

  async function handleFreeze() {
    if (!card) return;
    setFreezing(true);
    try {
      const res = await apiFetch("/api/virtualcards/freeze/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card_id: card.id }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setIsFrozen(data.frozen ?? !isFrozen);
      showToast(data.frozen ? "Card frozen ❄️" : "Card unfrozen ✓");
    } catch {
      // optimistic toggle fallback
      setIsFrozen((prev) => !prev);
      showToast(isFrozen ? "Card unfrozen ✓" : "Card frozen ❄️");
    } finally {
      setFreezing(false);
      setShowModal(null);
    }
  }

  // ── LOADING STATE ──────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F9FF] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading your card…</p>
        </div>
      </div>
    );
  }

  // ── ERROR STATE ────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-[#F2F9FF] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ── NO CARD STATE ──────────────────────────────────────
  if (!card) {
    return (
      <div className="min-h-screen bg-[#F2F9FF] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-6">💳</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Virtual Card Yet</h2>
          <p className="text-gray-500 text-sm mb-6">
            Request a virtual card to make digital transactions instantly.
          </p>
          <Link
            href="/dashboard/card/request"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all"
          >
            Request a Card
          </Link>
        </div>
      </div>
    );
  }

  const canUseCard = card.is_active && card.status === "active" && !isFrozen;
  const displayNumber = showFull && card.card_number
    ? card.card_number.replace(/(.{4})/g, "$1 ").trim()
    : maskNumber(card.card_number);

  // ── MAIN CARD PAGE ─────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F2F9FF]">
      <main className="max-w-lg mx-auto px-4 pt-6 pb-28">

        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
          <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Virtual Card</span>
        </div>

        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-semibold text-[#0b2f6b]">Virtual Card</h1>
            <p className="text-sm text-gray-500 mt-0.5">Tap card to reveal CVV</p>
          </div>
          <StatusBadge status={card.status} isActive={card.is_active && !isFrozen} />
        </div>

        {/* ── 3D Flip Card ── */}
        <div
          className="w-full cursor-pointer mb-2"
          style={{ perspective: "1000px" }}
          onClick={() => { if (!isFrozen) setIsFlipped((f) => !f); }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              paddingTop: "56%",
              transformStyle: "preserve-3d",
              transition: "transform 0.7s cubic-bezier(.4,0,.2,1)",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* FRONT */}
            <div
              style={{
                position: "absolute", inset: 0,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                borderRadius: "20px",
                background: "linear-gradient(135deg, #1e2a78 0%, #4f6ef7 55%, #7c3aed 100%)",
                padding: "24px",
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                color: "white",
                boxShadow: "0 25px 50px rgba(79,110,247,0.35)",
              }}
            >
              <div className="flex justify-between items-start">
                <span className="text-lg font-bold tracking-widest">WOLV</span>
                <div style={{
                  width: 40, height: 30,
                  background: "linear-gradient(135deg, #d4af37, #f0d060)",
                  borderRadius: 6, opacity: 0.9,
                }} />
              </div>

              <div className="font-mono text-base tracking-[3px] text-white/90 text-center my-2 select-none">
                {displayNumber}
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[9px] text-white/50 uppercase tracking-widest mb-1">Card Holder</div>
                  <div className="text-sm font-semibold truncate max-w-[160px]">
                    {card.cardholder_name || "CARD HOLDER"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[9px] text-white/50 uppercase tracking-widest mb-1">Expires</div>
                  <div className="text-sm font-semibold font-mono">
                    {formatExpiry(card.expiry_month, card.expiry_year)}
                  </div>
                </div>
                <div className="text-xl font-black italic opacity-90">VISA</div>
              </div>

              {/* Frozen overlay */}
              {isFrozen && (
                <div style={{
                  position: "absolute", inset: 0, borderRadius: 20,
                  background: "rgba(10,11,15,0.75)",
                  backdropFilter: "blur(4px)",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 8,
                }}>
                  <span style={{ fontSize: 40 }}>❄️</span>
                  <span style={{ color: "#93c5fd", fontWeight: 700, fontSize: 18, letterSpacing: 2 }}>
                    CARD FROZEN
                  </span>
                </div>
              )}
            </div>

            {/* BACK */}
            <div
              style={{
                position: "absolute", inset: 0,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                borderRadius: "20px",
                background: "linear-gradient(135deg, #1e2a78, #4f6ef7)",
                color: "white",
                boxShadow: "0 25px 50px rgba(79,110,247,0.35)",
                overflow: "hidden",
              }}
            >
              <div style={{ height: 44, background: "rgba(0,0,0,0.6)", marginBottom: 20 }} />
              <div className="px-6">
                <div className="flex justify-between items-center mb-3">
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Security Code (CVV)</span>
                  <div style={{
                    background: "white", color: "#111",
                    fontFamily: "monospace", padding: "6px 16px",
                    borderRadius: 6, fontSize: 15, letterSpacing: 4,
                  }}>
                    {showCvv ? (card.cvv || "•••") : "•••"}
                  </div>
                </div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
                  This card is issued by WolvCapital for digital transactions only. Keep your CVV secure.
                </p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 16, textAlign: "center" }}>
                  ↩ Tap to flip back
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mb-6">
          Tap card to flip · Reveal details below
        </p>

        {/* ── Balance strip ── */}
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 mb-5 flex justify-between items-center">
          <div>
            <div className="text-xs text-gray-500 mb-1">Card Balance</div>
            <div className="text-2xl font-semibold text-gray-900">{money(Number(card.balance) || 0)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-1">Purchase Amount</div>
            <div className="text-lg font-semibold text-gray-700">{money(Number(card.purchase_amount) || 0)}</div>
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            onClick={() => copyToClipboard(card.card_number, "Card number")}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-200 bg-white hover:border-blue-400 hover:shadow-sm transition-all"
          >
            <span className="text-2xl">📋</span>
            <span className="text-xs font-semibold text-gray-700">Copy Number</span>
          </button>

          <button
            onClick={() => setShowModal(isFrozen ? null : "freeze")}
            disabled={freezing}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
              isFrozen
                ? "border-blue-300 bg-blue-50 hover:border-blue-500"
                : "border-gray-200 bg-white hover:border-red-300 hover:shadow-sm"
            }`}
            onClickCapture={() => {
              if (isFrozen) { handleFreeze(); }
            }}
          >
            <span className="text-2xl">{isFrozen ? "🔥" : "❄️"}</span>
            <span className="text-xs font-semibold text-gray-700">
              {freezing ? "Please wait…" : isFrozen ? "Unfreeze" : "Freeze Card"}
            </span>
          </button>

          <button
            onClick={() => {
              setShowCvv((v) => !v);
              if (!isFlipped) setIsFlipped(true);
            }}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-200 bg-white hover:border-blue-400 hover:shadow-sm transition-all"
          >
            <span className="text-2xl">👁️</span>
            <span className="text-xs font-semibold text-gray-700">{showCvv ? "Hide CVV" : "Show CVV"}</span>
          </button>

          <button
            onClick={() => setShowFull((v) => !v)}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-200 bg-white hover:border-blue-400 hover:shadow-sm transition-all"
          >
            <span className="text-2xl">🔢</span>
            <span className="text-xs font-semibold text-gray-700">{showFull ? "Hide Number" : "Show Number"}</span>
          </button>
        </div>

        {/* ── Copy Rows ── */}
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden mb-5">
          {[
            {
              label: "Card Number",
              value: card.card_number
                ? card.card_number.replace(/(.{4})/g, "$1 ").trim()
                : "Not generated",
              copy: card.card_number,
              tag: "Card number",
            },
            {
              label: "Expiry Date",
              value: formatExpiry(card.expiry_month, card.expiry_year),
              copy: formatExpiry(card.expiry_month, card.expiry_year),
              tag: "Expiry date",
            },
            {
              label: "CVV",
              value: showCvv ? (card.cvv || "•••") : "•••",
              copy: card.cvv,
              tag: "CVV",
            },
            {
              label: "Cardholder Name",
              value: card.cardholder_name || "-",
              copy: card.cardholder_name,
              tag: "Name",
            },
          ].map((row, i) => (
            <button
              key={row.label}
              onClick={() => row.copy && copyToClipboard(row.copy, row.tag)}
              className={`w-full flex justify-between items-center px-5 py-4 hover:bg-gray-50 transition-colors text-left ${
                i > 0 ? "border-t border-gray-100" : ""
              }`}
            >
              <div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">{row.label}</div>
                <div className="font-mono text-sm font-medium text-gray-900">{row.value}</div>
              </div>
              <span className="text-lg text-gray-400">📋</span>
            </button>
          ))}
        </div>

        {/* ── Card Status Info ── */}
        {card.status === "pending" && (
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 mb-5">
            <div className="flex gap-3">
              <span className="text-xl">⏳</span>
              <div>
                <div className="font-semibold text-yellow-800 text-sm">Card Pending Approval</div>
                <div className="text-yellow-700 text-xs mt-1">
                  Your card request is under review. Card details will be available once approved by our team.
                </div>
              </div>
            </div>
          </div>
        )}

        {card.status === "suspended" && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 mb-5">
            <div className="flex gap-3">
              <span className="text-xl">🚫</span>
              <div>
                <div className="font-semibold text-red-800 text-sm">Card Suspended</div>
                <div className="text-red-700 text-xs mt-1">
                  Contact support to reactivate your card.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Back to Dashboard ── */}
        <Link
          href="/dashboard"
          className="block text-center text-sm text-blue-600 hover:underline mt-4"
        >
          ← Back to Dashboard
        </Link>
      </main>

      {/* ── Toast ── */}
      <Toast message={toast} show={toastVisible} />

      {/* ── Freeze Confirm Modal ── */}
      {showModal === "freeze" && (
        <div className="fixed inset-0 bg-black/60 z-40 flex items-end backdrop-blur-sm"
          onClick={() => setShowModal(null)}>
          <div
            className="w-full bg-white rounded-t-3xl p-6 pb-10 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
            <h3 className="text-lg font-bold mb-2">Freeze Card?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Freezing your card blocks all transactions. You can unfreeze anytime.
            </p>
            <button
              onClick={handleFreeze}
              disabled={freezing}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold mb-3 disabled:opacity-60"
            >
              {freezing ? "Processing…" : "Yes, Freeze Card"}
            </button>
            <button
              onClick={() => setShowModal(null)}
              className="w-full py-4 rounded-2xl border border-gray-200 text-gray-600 font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease;
        }
      `}</style>
    </div>
  );
}
