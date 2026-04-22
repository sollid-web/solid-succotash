"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useVirtualCard } from "@/hooks/useVirtualCard";
import { apiFetch } from "@/lib/api";

function money(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);
}
function maskNumber(num: string) {
  if (!num || num.length < 4) return "•••• •••• •••• ••••";
  return `•••• •••• •••• ${num.slice(-4)}`;
}
function formatExpiry(m: string, y: string) {
  if (!m || !y) return "••/••";
  return `${m.padStart(2,"0")}/${y}`;
}

function Toast({ message, show }: { message: string; show: boolean }) {
  return (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-green-500 text-white text-xs font-semibold shadow-lg whitespace-nowrap transition-all duration-300 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"}`}>
      {message}
    </div>
  );
}

function RequestCardView({ onRequested, wasRejected }: { onRequested: () => void; wasRejected?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRequest() {
    setLoading(true); setError(null);
    try {
      const res = await apiFetch("/api/virtual-cards/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchase_amount: 1000 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.detail || "Request failed");
      onRequested();
    } catch (e: any) {
      setError(e?.message || "Failed to submit request");
    } finally { setLoading(false); }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">{wasRejected ? "❌" : "💳"}</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          {wasRejected ? "Request Not Approved" : "Get Your Virtual Card"}
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          {wasRejected ? "Your previous request was not approved. Submit a new request or contact support." : "Activate a WolvCapital Visa virtual card for digital transactions worldwide."}
        </p>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-5">
        {[
          { label: "Card Type", value: "Visa Virtual Card" },
          { label: "Activation Fee", value: "$0.00", cls: "text-green-600" },
          { label: "Purchase Amount", value: "$1,000.00", cls: "text-blue-700 font-bold" },
          { label: "Processing Time", value: "1–24 hours" },
        ].map((r, i) => (
          <div key={r.label} className={`flex justify-between px-5 py-3 ${i > 0 ? "border-t border-gray-100" : ""}`}>
            <span className="text-sm text-gray-500">{r.label}</span>
            <span className={`text-sm font-semibold ${(r as any).cls || "text-gray-800"}`}>{r.value}</span>
          </div>
        ))}
      </div>
      {error && <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm p-3 mb-4">{error}</div>}
      <button onClick={handleRequest} disabled={loading}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow hover:shadow-md transition-all disabled:opacity-60">
        {loading ? "Submitting…" : "Request Card — $1,000"}
      </button>
      <p className="text-center text-xs text-gray-400 mt-3">Reviewed by our team within 24 hours.</p>
      <Link href="/dashboard" className="block text-center text-sm text-blue-600 hover:underline mt-4">← Back to Dashboard</Link>
    </div>
  );
}

function PendingCardView({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="max-w-sm mx-auto px-4 py-10 text-center">
      <div className="text-6xl mb-4">⏳</div>
      <h1 className="text-xl font-bold text-gray-900 mb-2">Card Under Review</h1>
      <p className="text-sm text-gray-500 leading-relaxed mb-6">Your request is being reviewed. This usually takes 1–24 hours.</p>
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-left">
        <div className="font-semibold text-amber-800 text-sm mb-2">What happens next?</div>
        {["Our team verifies your account","Card details are generated","Card appears here automatically"].map(t => (
          <div key={t} className="text-xs text-amber-700 mb-1">• {t}</div>
        ))}
      </div>
      <button onClick={onRefresh} className="w-full py-3 rounded-xl border border-blue-200 text-blue-600 text-sm font-semibold hover:bg-blue-50 transition-colors mb-3">
        🔄 Check Status
      </button>
      <Link href="/dashboard" className="block text-center text-sm text-blue-600 hover:underline">← Back to Dashboard</Link>
    </div>
  );
}

function ActiveCardView({ card, refetch }: { card: any; refetch: () => void }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFrozen, setIsFrozen] = useState(card.status === "suspended");
  const [freezing, setFreezing] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [toast, setToast] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(msg: string) {
    setToast(msg); setToastVisible(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToastVisible(false), 2500);
  }

  async function copy(value: string, label: string) {
    try { await navigator.clipboard.writeText(value); }
    catch { const el = document.createElement("textarea"); el.value = value; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el); }
    showToast(`${label} copied!`);
  }

  async function handleFreeze() {
    setFreezing(true);
    try {
      const res = await apiFetch("/api/cards/freeze/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ card_id: card.id }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setIsFrozen(data.frozen);
      if (data.frozen && isFlipped) setIsFlipped(false);
      showToast(data.frozen ? "Card frozen ❄️" : "Card unfrozen ✓");
      refetch();
    } catch { setIsFrozen(p => !p); showToast(isFrozen ? "Card unfrozen ✓" : "Card frozen ❄️"); }
    finally { setFreezing(false); setShowFreezeModal(false); }
  }

  const displayNum = showFull && card.card_number ? card.card_number.replace(/(.{4})/g,"$1 ").trim() : maskNumber(card.card_number);

  return (
    <div className="max-w-sm mx-auto px-4 py-6 pb-20">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Virtual Card</h1>
          <p className="text-xs text-gray-400 mt-0.5">Tap card to flip · reveal CVV</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${isFrozen ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-green-50 text-green-600 border-green-200"}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {isFrozen ? "Frozen" : "Active"}
        </span>
      </div>

      {/* Card — constrained to real card aspect ratio */}
      <div className="flex justify-center mb-3">
        <div style={{ width: "100%", maxWidth: 340, perspective: "1000px" }}
          onClick={() => { if (!isFrozen) setIsFlipped(f => !f); }}>
          <div style={{
            position: "relative",
            width: "100%",
            paddingTop: "63%", /* real card ratio 85.6×54mm */
            transformStyle: "preserve-3d",
            transition: "transform 0.65s cubic-bezier(.4,0,.2,1)",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            cursor: isFrozen ? "not-allowed" : "pointer",
          }}>
            {/* FRONT */}
            <div style={{
              position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" as any,
              borderRadius: 14,
              background: "linear-gradient(135deg, #1a237e 0%, #1565c0 45%, #4527a0 100%)",
              padding: "18px 20px",
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              color: "white",
              boxShadow: "0 8px 32px rgba(79,110,247,0.45), 0 2px 8px rgba(0,0,0,0.2)",
            }}>
              {/* Subtle shine overlay */}
              <div style={{ position: "absolute", inset: 0, borderRadius: 14, background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%)", pointerEvents: "none" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: 2, opacity: 0.95 }}>WOLV</span>
                {/* EMV chip */}
                <div style={{ width: 32, height: 24, background: "linear-gradient(135deg,#d4af37,#f0d060)", borderRadius: 4, opacity: 0.9, boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2)" }} />
              </div>

              {/* Contactless symbol */}
              <div style={{ fontFamily: "monospace", fontSize: 13, letterSpacing: 2.5, opacity: 0.9, textAlign: "center", textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
                {displayNum}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: 7, opacity: 0.55, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Card Holder</div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>{card.cardholder_name || "CARD HOLDER"}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 7, opacity: 0.55, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Expires</div>
                  <div style={{ fontSize: 11, fontWeight: 700, fontFamily: "monospace" }}>{formatExpiry(card.expiry_month, card.expiry_year)}</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 900, fontStyle: "italic", opacity: 0.95, letterSpacing: -0.5 }}>VISA</div>
              </div>

              {isFrozen && (
                <div style={{ position: "absolute", inset: 0, borderRadius: 14, background: "rgba(8,10,18,0.72)", backdropFilter: "blur(3px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <span style={{ fontSize: 28 }}>❄️</span>
                  <span style={{ color: "#93c5fd", fontWeight: 700, fontSize: 13, letterSpacing: 2 }}>CARD FROZEN</span>
                </div>
              )}
            </div>

            {/* BACK */}
            <div style={{
              position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" as any,
              transform: "rotateY(180deg)", borderRadius: 14,
              background: "linear-gradient(135deg, #1a237e, #1565c0)",
              color: "white", boxShadow: "0 8px 32px rgba(79,110,247,0.45), 0 2px 8px rgba(0,0,0,0.2)", overflow: "hidden",
            }}>
              <div style={{ height: 36, background: "rgba(0,0,0,0.65)", marginBottom: 14 }} />
              <div style={{ padding: "0 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 9, opacity: 0.6, textTransform: "uppercase", letterSpacing: 1 }}>CVV</span>
                  <div style={{ background: "#f5f5f0", color: "#111", fontFamily: "monospace", padding: "4px 12px", borderRadius: 4, fontSize: 13, letterSpacing: 4, minWidth: 60, textAlign: "center" }}>
                    {showCvv ? (card.cvv || "•••") : "•••"}
                  </div>
                </div>
                <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", marginBottom: 10 }} />
                <p style={{ fontSize: 9, opacity: 0.45, lineHeight: 1.6 }}>Issued by WolvCapital. For digital transactions only. Keep your CVV secure and never share it.</p>
                <p style={{ fontSize: 9, opacity: 0.35, marginTop: 10, textAlign: "center" }}>↩ Tap to flip back</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] text-gray-400 mb-5">Tap card to flip</p>

      {/* Balance row */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-4 flex justify-between items-center shadow-sm">
        <div>
          <div className="text-xs text-gray-400 mb-1">Card Balance</div>
          <div className="text-xl font-bold text-gray-900">{money(Number(card.balance) || 0)}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400 mb-1">Purchase Amount</div>
          <div className="text-base font-semibold text-gray-600">{money(Number(card.purchase_amount) || 0)}</div>
        </div>
      </div>

      {/* 2×2 action grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {[
          { icon: "📋", label: "Copy Number", fn: () => copy(card.card_number, "Card number") },
          { icon: isFrozen ? "🔥" : "❄️", label: isFrozen ? "Unfreeze" : "Freeze Card", fn: () => isFrozen ? handleFreeze() : setShowFreezeModal(true) },
          { icon: showCvv ? "🙈" : "👁️", label: showCvv ? "Hide CVV" : "Show CVV", fn: () => { setShowCvv(v => !v); if (!isFlipped) setIsFlipped(true); } },
          { icon: showFull ? "🔒" : "🔢", label: showFull ? "Hide Number" : "Full Number", fn: () => setShowFull(v => !v) },
        ].map(btn => (
          <button key={btn.label} onClick={btn.fn} disabled={freezing}
            className="flex flex-col items-center gap-1.5 py-3.5 px-2 bg-white border border-gray-200 rounded-xl text-center hover:border-blue-400 hover:shadow-sm transition-all disabled:opacity-50">
            <span className="text-xl">{btn.icon}</span>
            <span className="text-[11px] font-semibold text-gray-600">{btn.label}</span>
          </button>
        ))}
      </div>

      {/* Copy detail rows */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-4 shadow-sm">
        {[
          { label: "Card Number", display: displayNum, copy: card.card_number },
          { label: "Expiry Date", display: formatExpiry(card.expiry_month, card.expiry_year), copy: formatExpiry(card.expiry_month, card.expiry_year) },
          { label: "CVV", display: showCvv ? (card.cvv || "•••") : "•••", copy: card.cvv },
          { label: "Cardholder", display: card.cardholder_name || "—", copy: card.cardholder_name },
        ].map((row, i) => (
          <button key={row.label} onClick={() => row.copy && copy(row.copy, row.label)}
            className={`w-full flex justify-between items-center px-4 py-3 hover:bg-gray-50 transition-colors text-left ${i > 0 ? "border-t border-gray-100" : ""}`}>
            <div>
              <div className="text-[9px] text-gray-400 uppercase tracking-wider mb-0.5">{row.label}</div>
              <div className="font-mono text-sm font-medium text-gray-800">{row.display}</div>
            </div>
            <span className="text-base text-gray-300">📋</span>
          </button>
        ))}
      </div>

      <Link href="/dashboard" className="block text-center text-xs text-blue-600 hover:underline">← Back to Dashboard</Link>

      <Toast message={toast} show={toastVisible} />

      {/* Freeze modal */}
      {showFreezeModal && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-end" onClick={() => setShowFreezeModal(false)}>
          <div className="w-full bg-white rounded-t-2xl p-5 pb-8 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="text-base font-bold text-gray-900 mb-1">Freeze Card?</h3>
            <p className="text-sm text-gray-500 mb-5">All transactions will be blocked. You can unfreeze anytime.</p>
            <button onClick={handleFreeze} disabled={freezing}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm mb-2.5 disabled:opacity-60">
              {freezing ? "Processing…" : "Yes, Freeze Card"}
            </button>
            <button onClick={() => setShowFreezeModal(false)}
              className="w-full py-3.5 rounded-xl border border-gray-200 text-gray-500 font-semibold text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VirtualCardPage() {
  const { card, loading, error, refetch } = useVirtualCard();

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-400">Loading your card…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-64 px-4">
      <div className="text-center">
        <div className="text-3xl mb-3">⚠️</div>
        <p className="text-red-500 text-sm mb-3">{error}</p>
        <button onClick={refetch} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold">Try Again</button>
      </div>
    </div>
  );

  if (!card) return <RequestCardView onRequested={refetch} />;
  if (card.status === "rejected") return <RequestCardView onRequested={refetch} wasRejected />;
  if (card.status === "pending") return <PendingCardView onRefresh={refetch} />;
  return <ActiveCardView card={card} refetch={refetch} />;
}
