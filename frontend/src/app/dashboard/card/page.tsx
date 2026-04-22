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
function formatExpiry(month: string, year: string) {
  if (!month || !year) return "••/••";
  return `${month.padStart(2, "0")}/${year}`;
}
function Toast({ message, show }: { message: string; show: boolean }) {
  return (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-green-500 text-white text-sm font-semibold shadow-lg whitespace-nowrap transition-all duration-300 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
      {message}
    </div>
  );
}

// ── STATE 1: No card or rejected ──────────────────────────
function RequestCardView({ onRequested, wasRejected }: { onRequested: () => void; wasRejected?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRequest() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/api/virtualcards/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchase_amount: 1000 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.detail || "Request failed");
      onRequested();
    } catch (e: any) {
      setError(e?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F2F9FF] flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <div className="text-7xl mb-5">{wasRejected ? "❌" : "💳"}</div>
          <h2 className="text-2xl font-bold text-[#0b2f6b] mb-2">
            {wasRejected ? "Request Not Approved" : "Get Your Virtual Card"}
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            {wasRejected
              ? "Your previous request was not approved. You may submit a new request or contact support."
              : "Activate a WolvCapital Visa virtual card for digital transactions worldwide."}
          </p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-white p-6 mb-5 shadow-sm">
          {[
            { label: "Card Type", value: "Visa Virtual Card" },
            { label: "Activation Fee", value: "$0.00", green: true },
            { label: "Purchase Amount", value: "$1,000.00", bold: true },
            { label: "Processing Time", value: "1–24 hours" },
          ].map((row, i) => (
            <div key={row.label} className={`flex justify-between items-center py-3 ${i > 0 ? "border-t border-gray-100" : ""}`}>
              <span className="text-sm text-gray-500">{row.label}</span>
              <span className={`text-sm font-semibold ${row.green ? "text-green-600" : row.bold ? "text-[#0b2f6b] font-bold" : ""}`}>{row.value}</span>
            </div>
          ))}
        </div>

        {error && <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm p-4 mb-4">{error}</div>}

        <button onClick={handleRequest} disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-60">
          {loading ? "Submitting…" : "Request Card — $1,000"}
        </button>
        <p className="text-center text-xs text-gray-400 mt-4">Reviewed and approved by our team within 24 hours.</p>
        <Link href="/dashboard" className="block text-center text-sm text-blue-600 hover:underline mt-4">← Back to Dashboard</Link>
      </div>
    </div>
  );
}

// ── STATE 2: Pending approval ─────────────────────────────
function PendingCardView({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="min-h-screen bg-[#F2F9FF] flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        <div className="text-7xl mb-5">⏳</div>
        <h2 className="text-xl font-bold text-[#0b2f6b] mb-2">Card Under Review</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          Your virtual card request is being reviewed. This usually takes 1–24 hours.
        </p>
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 mb-6 text-left">
          <div className="flex gap-3">
            <span className="text-xl">📋</span>
            <div>
              <div className="font-semibold text-yellow-800 text-sm mb-1">What happens next?</div>
              <ul className="text-yellow-700 text-xs space-y-1 leading-relaxed">
                <li>• Our team verifies your account</li>
                <li>• Card details are generated and assigned</li>
                <li>• Card becomes available here instantly</li>
              </ul>
            </div>
          </div>
        </div>
        <button onClick={onRefresh}
          className="w-full py-3 rounded-2xl border border-blue-200 text-blue-600 font-semibold text-sm hover:bg-blue-50 transition-colors mb-3">
          🔄 Check Status
        </button>
        <Link href="/dashboard" className="block text-center text-sm text-blue-600 hover:underline">← Back to Dashboard</Link>
      </div>
    </div>
  );
}

// ── STATE 3: Active card ──────────────────────────────────
function ActiveCardView({ card, refetch }: { card: any; refetch: () => void }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFrozen, setIsFrozen] = useState(card.status === "suspended");
  const [freezing, setFreezing] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [toast, setToast] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(msg: string) {
    setToast(msg); setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2500);
  }

  async function copyToClipboard(value: string, label: string) {
    try { await navigator.clipboard.writeText(value); }
    catch {
      const el = document.createElement("textarea"); el.value = value;
      document.body.appendChild(el); el.select();
      document.execCommand("copy"); document.body.removeChild(el);
    }
    showToast(`${label} copied!`);
  }

  async function handleFreeze() {
    setFreezing(true);
    try {
      const res = await apiFetch("/api/cards/freeze/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card_id: card.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setIsFrozen(data.frozen);
      showToast(data.frozen ? "Card frozen ❄️" : "Card unfrozen ✓");
      refetch();
    } catch {
      setIsFrozen((p) => !p);
      showToast(isFrozen ? "Card unfrozen ✓" : "Card frozen ❄️");
    } finally { setFreezing(false); setShowFreezeModal(false); }
  }

  const displayNumber = showFull && card.card_number
    ? card.card_number.replace(/(.{4})/g, "$1 ").trim()
    : maskNumber(card.card_number);

  return (
    <div className="min-h-screen bg-[#F2F9FF]">
      <main className="max-w-lg mx-auto px-4 pt-6 pb-28">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
          <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Virtual Card</span>
        </div>

        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-semibold text-[#0b2f6b]">Virtual Card</h1>
            <p className="text-sm text-gray-500 mt-0.5">Tap card to flip and reveal CVV</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${isFrozen ? "bg-blue-100 text-blue-700 border-blue-200" : card.is_active ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"}`}>
            {isFrozen ? "❄️ Frozen" : card.is_active ? "● Active" : card.status}
          </span>
        </div>

        {/* 3D Flip Card */}
        <div className="w-full cursor-pointer mb-2 select-none" style={{ perspective: "1000px" }}
          onClick={() => { if (!isFrozen) setIsFlipped((f) => !f); }}>
          <div style={{ position: "relative", width: "100%", paddingTop: "56%", transformStyle: "preserve-3d", transition: "transform 0.7s cubic-bezier(.4,0,.2,1)", transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
            {/* FRONT */}
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", borderRadius: 20, background: "linear-gradient(135deg,#1e2a78 0%,#4f6ef7 55%,#7c3aed 100%)", padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between", color: "white", boxShadow: "0 25px 50px rgba(79,110,247,0.35)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 3 }}>WOLV</span>
                <div style={{ width: 40, height: 30, background: "linear-gradient(135deg,#d4af37,#f0d060)", borderRadius: 6 }} />
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 15, letterSpacing: 3, color: "rgba(255,255,255,0.9)", textAlign: "center" }}>{displayNumber}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1 }}>Card Holder</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{card.cardholder_name || "CARD HOLDER"}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1 }}>Expires</div>
                  <div style={{ fontSize: 14, fontWeight: 600, fontFamily: "monospace" }}>{formatExpiry(card.expiry_month, card.expiry_year)}</div>
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, fontStyle: "italic", opacity: 0.9 }}>VISA</div>
              </div>
              {isFrozen && (
                <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: "rgba(10,11,15,0.75)", backdropFilter: "blur(4px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span style={{ fontSize: 40 }}>❄️</span>
                  <span style={{ color: "#93c5fd", fontWeight: 700, fontSize: 18, letterSpacing: 2 }}>CARD FROZEN</span>
                </div>
              )}
            </div>
            {/* BACK */}
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 20, background: "linear-gradient(135deg,#1e2a78,#4f6ef7)", color: "white", boxShadow: "0 25px 50px rgba(79,110,247,0.35)", overflow: "hidden" }}>
              <div style={{ height: 44, background: "rgba(0,0,0,0.6)", marginBottom: 20 }} />
              <div style={{ padding: "0 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Security Code (CVV)</span>
                  <div style={{ background: "white", color: "#111", fontFamily: "monospace", padding: "6px 16px", borderRadius: 6, fontSize: 15, letterSpacing: 4 }}>
                    {showCvv ? (card.cvv || "•••") : "•••"}
                  </div>
                </div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>Issued by WolvCapital for digital transactions only. Keep your CVV secure.</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 16, textAlign: "center" }}>↩ Tap to flip back</p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mb-6">Tap card to flip</p>

        {/* Balance */}
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 mb-5 flex justify-between items-center">
          <div>
            <div className="text-xs text-gray-500 mb-1">Card Balance</div>
            <div className="text-2xl font-semibold">{money(Number(card.balance) || 0)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-1">Purchase Amount</div>
            <div className="text-lg font-semibold text-gray-700">{money(Number(card.purchase_amount) || 0)}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { icon: "📋", label: "Copy Number", action: () => copyToClipboard(card.card_number, "Card number") },
            { icon: isFrozen ? "🔥" : "❄️", label: freezing ? "Please wait…" : isFrozen ? "Unfreeze" : "Freeze Card", action: () => isFrozen ? handleFreeze() : setShowFreezeModal(true) },
            { icon: showCvv ? "🙈" : "👁️", label: showCvv ? "Hide CVV" : "Show CVV", action: () => { setShowCvv((v) => !v); if (!isFlipped) setIsFlipped(true); } },
            { icon: showFull ? "🔒" : "🔢", label: showFull ? "Hide Number" : "Show Number", action: () => setShowFull((v) => !v) },
          ].map((btn) => (
            <button key={btn.label} onClick={btn.action} disabled={freezing && btn.label.includes("reeze")}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-200 bg-white hover:border-blue-400 hover:shadow-sm transition-all disabled:opacity-60">
              <span className="text-2xl">{btn.icon}</span>
              <span className="text-xs font-semibold text-gray-700">{btn.label}</span>
            </button>
          ))}
        </div>

        {/* Copy rows */}
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden mb-5">
          {[
            { label: "Card Number", display: displayNumber, copy: card.card_number },
            { label: "Expiry Date", display: formatExpiry(card.expiry_month, card.expiry_year), copy: formatExpiry(card.expiry_month, card.expiry_year) },
            { label: "CVV", display: showCvv ? (card.cvv || "•••") : "•••", copy: card.cvv },
            { label: "Cardholder Name", display: card.cardholder_name || "-", copy: card.cardholder_name },
          ].map((row, i) => (
            <button key={row.label} onClick={() => row.copy && copyToClipboard(row.copy, row.label)}
              className={`w-full flex justify-between items-center px-5 py-4 hover:bg-gray-50 transition-colors text-left ${i > 0 ? "border-t border-gray-100" : ""}`}>
              <div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">{row.label}</div>
                <div className="font-mono text-sm font-medium text-gray-900">{row.display}</div>
              </div>
              <span className="text-gray-400">📋</span>
            </button>
          ))}
        </div>

        <Link href="/dashboard" className="block text-center text-sm text-blue-600 hover:underline mt-4">← Back to Dashboard</Link>
      </main>

      <Toast message={toast} show={toastVisible} />

      {showFreezeModal && (
        <div className="fixed inset-0 bg-black/60 z-40 flex items-end backdrop-blur-sm" onClick={() => setShowFreezeModal(false)}>
          <div className="w-full bg-white rounded-t-3xl p-6 pb-10" onClick={(e) => e.stopPropagation()} style={{ animation: "slideUp 0.3s ease" }}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
            <h3 className="text-lg font-bold mb-2">Freeze Card?</h3>
            <p className="text-sm text-gray-500 mb-6">Freezing blocks all transactions. You can unfreeze anytime.</p>
            <button onClick={handleFreeze} disabled={freezing} className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold mb-3 disabled:opacity-60">
              {freezing ? "Processing…" : "Yes, Freeze Card"}
            </button>
            <button onClick={() => setShowFreezeModal(false)} className="w-full py-4 rounded-2xl border border-gray-200 text-gray-600 font-semibold">Cancel</button>
          </div>
        </div>
      )}
      <style jsx global>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────
export default function VirtualCardPage() {
  const { card, loading, error, refetch } = useVirtualCard();

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

  if (error) {
    return (
      <div className="min-h-screen bg-[#F2F9FF] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button onClick={refetch} className="px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold">Try Again</button>
        </div>
      </div>
    );
  }

  // No card at all → request form
  if (!card) return <RequestCardView onRequested={refetch} />;

  // Rejected → show request form with rejection message
  if (card.status === "rejected") return <RequestCardView onRequested={refetch} wasRejected />;

  // Pending admin approval
  if (card.status === "pending") return <PendingCardView onRefresh={refetch} />;

  // Active or suspended (frozen) → full card UI
  return <ActiveCardView card={card} refetch={refetch} />;
}
ENDOFFILEcat > frontend/src/app/dashboard/card/page.tsx << 'ENDOFFILE'
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
function formatExpiry(month: string, year: string) {
  if (!month || !year) return "••/••";
  return `${month.padStart(2, "0")}/${year}`;
}
function Toast({ message, show }: { message: string; show: boolean }) {
  return (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-green-500 text-white text-sm font-semibold shadow-lg whitespace-nowrap transition-all duration-300 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
      {message}
    </div>
  );
}

// ── STATE 1: No card or rejected ──────────────────────────
function RequestCardView({ onRequested, wasRejected }: { onRequested: () => void; wasRejected?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRequest() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/api/virtualcards/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchase_amount: 1000 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.detail || "Request failed");
      onRequested();
    } catch (e: any) {
      setError(e?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F2F9FF] flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <div className="text-7xl mb-5">{wasRejected ? "❌" : "💳"}</div>
          <h2 className="text-2xl font-bold text-[#0b2f6b] mb-2">
            {wasRejected ? "Request Not Approved" : "Get Your Virtual Card"}
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            {wasRejected
              ? "Your previous request was not approved. You may submit a new request or contact support."
              : "Activate a WolvCapital Visa virtual card for digital transactions worldwide."}
          </p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-white p-6 mb-5 shadow-sm">
          {[
            { label: "Card Type", value: "Visa Virtual Card" },
            { label: "Activation Fee", value: "$0.00", green: true },
            { label: "Purchase Amount", value: "$1,000.00", bold: true },
            { label: "Processing Time", value: "1–24 hours" },
          ].map((row, i) => (
            <div key={row.label} className={`flex justify-between items-center py-3 ${i > 0 ? "border-t border-gray-100" : ""}`}>
              <span className="text-sm text-gray-500">{row.label}</span>
              <span className={`text-sm font-semibold ${row.green ? "text-green-600" : row.bold ? "text-[#0b2f6b] font-bold" : ""}`}>{row.value}</span>
            </div>
          ))}
        </div>

        {error && <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm p-4 mb-4">{error}</div>}

        <button onClick={handleRequest} disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-60">
          {loading ? "Submitting…" : "Request Card — $1,000"}
        </button>
        <p className="text-center text-xs text-gray-400 mt-4">Reviewed and approved by our team within 24 hours.</p>
        <Link href="/dashboard" className="block text-center text-sm text-blue-600 hover:underline mt-4">← Back to Dashboard</Link>
      </div>
    </div>
  );
}

// ── STATE 2: Pending approval ─────────────────────────────
function PendingCardView({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="min-h-screen bg-[#F2F9FF] flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        <div className="text-7xl mb-5">⏳</div>
        <h2 className="text-xl font-bold text-[#0b2f6b] mb-2">Card Under Review</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          Your virtual card request is being reviewed. This usually takes 1–24 hours.
        </p>
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 mb-6 text-left">
          <div className="flex gap-3">
            <span className="text-xl">📋</span>
            <div>
              <div className="font-semibold text-yellow-800 text-sm mb-1">What happens next?</div>
              <ul className="text-yellow-700 text-xs space-y-1 leading-relaxed">
                <li>• Our team verifies your account</li>
                <li>• Card details are generated and assigned</li>
                <li>• Card becomes available here instantly</li>
              </ul>
            </div>
          </div>
        </div>
        <button onClick={onRefresh}
          className="w-full py-3 rounded-2xl border border-blue-200 text-blue-600 font-semibold text-sm hover:bg-blue-50 transition-colors mb-3">
          🔄 Check Status
        </button>
        <Link href="/dashboard" className="block text-center text-sm text-blue-600 hover:underline">← Back to Dashboard</Link>
      </div>
    </div>
  );
}

// ── STATE 3: Active card ──────────────────────────────────
function ActiveCardView({ card, refetch }: { card: any; refetch: () => void }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFrozen, setIsFrozen] = useState(card.status === "suspended");
  const [freezing, setFreezing] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [toast, setToast] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(msg: string) {
    setToast(msg); setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2500);
  }

  async function copyToClipboard(value: string, label: string) {
    try { await navigator.clipboard.writeText(value); }
    catch {
      const el = document.createElement("textarea"); el.value = value;
      document.body.appendChild(el); el.select();
      document.execCommand("copy"); document.body.removeChild(el);
    }
    showToast(`${label} copied!`);
  }

  async function handleFreeze() {
    setFreezing(true);
    try {
      const res = await apiFetch("/api/cards/freeze/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card_id: card.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setIsFrozen(data.frozen);
      showToast(data.frozen ? "Card frozen ❄️" : "Card unfrozen ✓");
      refetch();
    } catch {
      setIsFrozen((p) => !p);
      showToast(isFrozen ? "Card unfrozen ✓" : "Card frozen ❄️");
    } finally { setFreezing(false); setShowFreezeModal(false); }
  }

  const displayNumber = showFull && card.card_number
    ? card.card_number.replace(/(.{4})/g, "$1 ").trim()
    : maskNumber(card.card_number);

  return (
    <div className="min-h-screen bg-[#F2F9FF]">
      <main className="max-w-lg mx-auto px-4 pt-6 pb-28">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
          <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Virtual Card</span>
        </div>

        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-semibold text-[#0b2f6b]">Virtual Card</h1>
            <p className="text-sm text-gray-500 mt-0.5">Tap card to flip and reveal CVV</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${isFrozen ? "bg-blue-100 text-blue-700 border-blue-200" : card.is_active ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"}`}>
            {isFrozen ? "❄️ Frozen" : card.is_active ? "● Active" : card.status}
          </span>
        </div>

        {/* 3D Flip Card */}
        <div className="w-full cursor-pointer mb-2 select-none" style={{ perspective: "1000px" }}
          onClick={() => { if (!isFrozen) setIsFlipped((f) => !f); }}>
          <div style={{ position: "relative", width: "100%", paddingTop: "56%", transformStyle: "preserve-3d", transition: "transform 0.7s cubic-bezier(.4,0,.2,1)", transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
            {/* FRONT */}
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", borderRadius: 20, background: "linear-gradient(135deg,#1e2a78 0%,#4f6ef7 55%,#7c3aed 100%)", padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between", color: "white", boxShadow: "0 25px 50px rgba(79,110,247,0.35)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 3 }}>WOLV</span>
                <div style={{ width: 40, height: 30, background: "linear-gradient(135deg,#d4af37,#f0d060)", borderRadius: 6 }} />
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 15, letterSpacing: 3, color: "rgba(255,255,255,0.9)", textAlign: "center" }}>{displayNumber}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1 }}>Card Holder</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{card.cardholder_name || "CARD HOLDER"}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1 }}>Expires</div>
                  <div style={{ fontSize: 14, fontWeight: 600, fontFamily: "monospace" }}>{formatExpiry(card.expiry_month, card.expiry_year)}</div>
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, fontStyle: "italic", opacity: 0.9 }}>VISA</div>
              </div>
              {isFrozen && (
                <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: "rgba(10,11,15,0.75)", backdropFilter: "blur(4px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span style={{ fontSize: 40 }}>❄️</span>
                  <span style={{ color: "#93c5fd", fontWeight: 700, fontSize: 18, letterSpacing: 2 }}>CARD FROZEN</span>
                </div>
              )}
            </div>
            {/* BACK */}
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 20, background: "linear-gradient(135deg,#1e2a78,#4f6ef7)", color: "white", boxShadow: "0 25px 50px rgba(79,110,247,0.35)", overflow: "hidden" }}>
              <div style={{ height: 44, background: "rgba(0,0,0,0.6)", marginBottom: 20 }} />
              <div style={{ padding: "0 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Security Code (CVV)</span>
                  <div style={{ background: "white", color: "#111", fontFamily: "monospace", padding: "6px 16px", borderRadius: 6, fontSize: 15, letterSpacing: 4 }}>
                    {showCvv ? (card.cvv || "•••") : "•••"}
                  </div>
                </div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>Issued by WolvCapital for digital transactions only. Keep your CVV secure.</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 16, textAlign: "center" }}>↩ Tap to flip back</p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mb-6">Tap card to flip</p>

        {/* Balance */}
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 mb-5 flex justify-between items-center">
          <div>
            <div className="text-xs text-gray-500 mb-1">Card Balance</div>
            <div className="text-2xl font-semibold">{money(Number(card.balance) || 0)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-1">Purchase Amount</div>
            <div className="text-lg font-semibold text-gray-700">{money(Number(card.purchase_amount) || 0)}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { icon: "📋", label: "Copy Number", action: () => copyToClipboard(card.card_number, "Card number") },
            { icon: isFrozen ? "🔥" : "❄️", label: freezing ? "Please wait…" : isFrozen ? "Unfreeze" : "Freeze Card", action: () => isFrozen ? handleFreeze() : setShowFreezeModal(true) },
            { icon: showCvv ? "🙈" : "👁️", label: showCvv ? "Hide CVV" : "Show CVV", action: () => { setShowCvv((v) => !v); if (!isFlipped) setIsFlipped(true); } },
            { icon: showFull ? "🔒" : "🔢", label: showFull ? "Hide Number" : "Show Number", action: () => setShowFull((v) => !v) },
          ].map((btn) => (
            <button key={btn.label} onClick={btn.action} disabled={freezing && btn.label.includes("reeze")}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-200 bg-white hover:border-blue-400 hover:shadow-sm transition-all disabled:opacity-60">
              <span className="text-2xl">{btn.icon}</span>
              <span className="text-xs font-semibold text-gray-700">{btn.label}</span>
            </button>
          ))}
        </div>

        {/* Copy rows */}
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden mb-5">
          {[
            { label: "Card Number", display: displayNumber, copy: card.card_number },
            { label: "Expiry Date", display: formatExpiry(card.expiry_month, card.expiry_year), copy: formatExpiry(card.expiry_month, card.expiry_year) },
            { label: "CVV", display: showCvv ? (card.cvv || "•••") : "•••", copy: card.cvv },
            { label: "Cardholder Name", display: card.cardholder_name || "-", copy: card.cardholder_name },
          ].map((row, i) => (
            <button key={row.label} onClick={() => row.copy && copyToClipboard(row.copy, row.label)}
              className={`w-full flex justify-between items-center px-5 py-4 hover:bg-gray-50 transition-colors text-left ${i > 0 ? "border-t border-gray-100" : ""}`}>
              <div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">{row.label}</div>
                <div className="font-mono text-sm font-medium text-gray-900">{row.display}</div>
              </div>
              <span className="text-gray-400">📋</span>
            </button>
          ))}
        </div>

        <Link href="/dashboard" className="block text-center text-sm text-blue-600 hover:underline mt-4">← Back to Dashboard</Link>
      </main>

      <Toast message={toast} show={toastVisible} />

      {showFreezeModal && (
        <div className="fixed inset-0 bg-black/60 z-40 flex items-end backdrop-blur-sm" onClick={() => setShowFreezeModal(false)}>
          <div className="w-full bg-white rounded-t-3xl p-6 pb-10" onClick={(e) => e.stopPropagation()} style={{ animation: "slideUp 0.3s ease" }}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
            <h3 className="text-lg font-bold mb-2">Freeze Card?</h3>
            <p className="text-sm text-gray-500 mb-6">Freezing blocks all transactions. You can unfreeze anytime.</p>
            <button onClick={handleFreeze} disabled={freezing} className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold mb-3 disabled:opacity-60">
              {freezing ? "Processing…" : "Yes, Freeze Card"}
            </button>
            <button onClick={() => setShowFreezeModal(false)} className="w-full py-4 rounded-2xl border border-gray-200 text-gray-600 font-semibold">Cancel</button>
          </div>
        </div>
      )}
      <style jsx global>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────
export default function VirtualCardPage() {
  const { card, loading, error, refetch } = useVirtualCard();

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

  if (error) {
    return (
      <div className="min-h-screen bg-[#F2F9FF] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button onClick={refetch} className="px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold">Try Again</button>
        </div>
      </div>
    );
  }

  // No card at all → request form
  if (!card) return <RequestCardView onRequested={refetch} />;

  // Rejected → show request form with rejection message
  if (card.status === "rejected") return <RequestCardView onRequested={refetch} wasRejected />;

  // Pending admin approval
  if (card.status === "pending") return <PendingCardView onRefresh={refetch} />;

  // Active or suspended (frozen) → full card UI
  return <ActiveCardView card={card} refetch={refetch} />;
}
ENDOFFILEcat > frontend/src/app/dashboard/card/page.tsx << 'ENDOFFILE'
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
function formatExpiry(month: string, year: string) {
  if (!month || !year) return "••/••";
  return `${month.padStart(2, "0")}/${year}`;
}
function Toast({ message, show }: { message: string; show: boolean }) {
  return (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-green-500 text-white text-sm font-semibold shadow-lg whitespace-nowrap transition-all duration-300 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
      {message}
    </div>
  );
}

// ── STATE 1: No card or rejected ──────────────────────────
function RequestCardView({ onRequested, wasRejected }: { onRequested: () => void; wasRejected?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRequest() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/api/virtualcards/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchase_amount: 1000 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.detail || "Request failed");
      onRequested();
    } catch (e: any) {
      setError(e?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F2F9FF] flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <div className="text-7xl mb-5">{wasRejected ? "❌" : "💳"}</div>
          <h2 className="text-2xl font-bold text-[#0b2f6b] mb-2">
            {wasRejected ? "Request Not Approved" : "Get Your Virtual Card"}
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            {wasRejected
              ? "Your previous request was not approved. You may submit a new request or contact support."
              : "Activate a WolvCapital Visa virtual card for digital transactions worldwide."}
          </p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-white p-6 mb-5 shadow-sm">
          {[
            { label: "Card Type", value: "Visa Virtual Card" },
            { label: "Activation Fee", value: "$0.00", green: true },
            { label: "Purchase Amount", value: "$1,000.00", bold: true },
            { label: "Processing Time", value: "1–24 hours" },
          ].map((row, i) => (
            <div key={row.label} className={`flex justify-between items-center py-3 ${i > 0 ? "border-t border-gray-100" : ""}`}>
              <span className="text-sm text-gray-500">{row.label}</span>
              <span className={`text-sm font-semibold ${row.green ? "text-green-600" : row.bold ? "text-[#0b2f6b] font-bold" : ""}`}>{row.value}</span>
            </div>
          ))}
        </div>

        {error && <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm p-4 mb-4">{error}</div>}

        <button onClick={handleRequest} disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-60">
          {loading ? "Submitting…" : "Request Card — $1,000"}
        </button>
        <p className="text-center text-xs text-gray-400 mt-4">Reviewed and approved by our team within 24 hours.</p>
        <Link href="/dashboard" className="block text-center text-sm text-blue-600 hover:underline mt-4">← Back to Dashboard</Link>
      </div>
    </div>
  );
}

// ── STATE 2: Pending approval ─────────────────────────────
function PendingCardView({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="min-h-screen bg-[#F2F9FF] flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        <div className="text-7xl mb-5">⏳</div>
        <h2 className="text-xl font-bold text-[#0b2f6b] mb-2">Card Under Review</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          Your virtual card request is being reviewed. This usually takes 1–24 hours.
        </p>
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 mb-6 text-left">
          <div className="flex gap-3">
            <span className="text-xl">📋</span>
            <div>
              <div className="font-semibold text-yellow-800 text-sm mb-1">What happens next?</div>
              <ul className="text-yellow-700 text-xs space-y-1 leading-relaxed">
                <li>• Our team verifies your account</li>
                <li>• Card details are generated and assigned</li>
                <li>• Card becomes available here instantly</li>
              </ul>
            </div>
          </div>
        </div>
        <button onClick={onRefresh}
          className="w-full py-3 rounded-2xl border border-blue-200 text-blue-600 font-semibold text-sm hover:bg-blue-50 transition-colors mb-3">
          🔄 Check Status
        </button>
        <Link href="/dashboard" className="block text-center text-sm text-blue-600 hover:underline">← Back to Dashboard</Link>
      </div>
    </div>
  );
}

// ── STATE 3: Active card ──────────────────────────────────
function ActiveCardView({ card, refetch }: { card: any; refetch: () => void }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFrozen, setIsFrozen] = useState(card.status === "suspended");
  const [freezing, setFreezing] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [toast, setToast] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(msg: string) {
    setToast(msg); setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2500);
  }

  async function copyToClipboard(value: string, label: string) {
    try { await navigator.clipboard.writeText(value); }
    catch {
      const el = document.createElement("textarea"); el.value = value;
      document.body.appendChild(el); el.select();
      document.execCommand("copy"); document.body.removeChild(el);
    }
    showToast(`${label} copied!`);
  }

  async function handleFreeze() {
    setFreezing(true);
    try {
      const res = await apiFetch("/api/cards/freeze/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card_id: card.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setIsFrozen(data.frozen);
      showToast(data.frozen ? "Card frozen ❄️" : "Card unfrozen ✓");
      refetch();
    } catch {
      setIsFrozen((p) => !p);
      showToast(isFrozen ? "Card unfrozen ✓" : "Card frozen ❄️");
    } finally { setFreezing(false); setShowFreezeModal(false); }
  }

  const displayNumber = showFull && card.card_number
    ? card.card_number.replace(/(.{4})/g, "$1 ").trim()
    : maskNumber(card.card_number);

  return (
    <div className="min-h-screen bg-[#F2F9FF]">
      <main className="max-w-lg mx-auto px-4 pt-6 pb-28">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
          <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Virtual Card</span>
        </div>

        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-semibold text-[#0b2f6b]">Virtual Card</h1>
            <p className="text-sm text-gray-500 mt-0.5">Tap card to flip and reveal CVV</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${isFrozen ? "bg-blue-100 text-blue-700 border-blue-200" : card.is_active ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"}`}>
            {isFrozen ? "❄️ Frozen" : card.is_active ? "● Active" : card.status}
          </span>
        </div>

        {/* 3D Flip Card */}
        <div className="w-full cursor-pointer mb-2 select-none" style={{ perspective: "1000px" }}
          onClick={() => { if (!isFrozen) setIsFlipped((f) => !f); }}>
          <div style={{ position: "relative", width: "100%", paddingTop: "56%", transformStyle: "preserve-3d", transition: "transform 0.7s cubic-bezier(.4,0,.2,1)", transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
            {/* FRONT */}
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", borderRadius: 20, background: "linear-gradient(135deg,#1e2a78 0%,#4f6ef7 55%,#7c3aed 100%)", padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between", color: "white", boxShadow: "0 25px 50px rgba(79,110,247,0.35)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 3 }}>WOLV</span>
                <div style={{ width: 40, height: 30, background: "linear-gradient(135deg,#d4af37,#f0d060)", borderRadius: 6 }} />
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 15, letterSpacing: 3, color: "rgba(255,255,255,0.9)", textAlign: "center" }}>{displayNumber}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1 }}>Card Holder</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{card.cardholder_name || "CARD HOLDER"}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1 }}>Expires</div>
                  <div style={{ fontSize: 14, fontWeight: 600, fontFamily: "monospace" }}>{formatExpiry(card.expiry_month, card.expiry_year)}</div>
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, fontStyle: "italic", opacity: 0.9 }}>VISA</div>
              </div>
              {isFrozen && (
                <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: "rgba(10,11,15,0.75)", backdropFilter: "blur(4px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span style={{ fontSize: 40 }}>❄️</span>
                  <span style={{ color: "#93c5fd", fontWeight: 700, fontSize: 18, letterSpacing: 2 }}>CARD FROZEN</span>
                </div>
              )}
            </div>
            {/* BACK */}
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 20, background: "linear-gradient(135deg,#1e2a78,#4f6ef7)", color: "white", boxShadow: "0 25px 50px rgba(79,110,247,0.35)", overflow: "hidden" }}>
              <div style={{ height: 44, background: "rgba(0,0,0,0.6)", marginBottom: 20 }} />
              <div style={{ padding: "0 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Security Code (CVV)</span>
                  <div style={{ background: "white", color: "#111", fontFamily: "monospace", padding: "6px 16px", borderRadius: 6, fontSize: 15, letterSpacing: 4 }}>
                    {showCvv ? (card.cvv || "•••") : "•••"}
                  </div>
                </div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>Issued by WolvCapital for digital transactions only. Keep your CVV secure.</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 16, textAlign: "center" }}>↩ Tap to flip back</p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mb-6">Tap card to flip</p>

        {/* Balance */}
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 mb-5 flex justify-between items-center">
          <div>
            <div className="text-xs text-gray-500 mb-1">Card Balance</div>
            <div className="text-2xl font-semibold">{money(Number(card.balance) || 0)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-1">Purchase Amount</div>
            <div className="text-lg font-semibold text-gray-700">{money(Number(card.purchase_amount) || 0)}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { icon: "📋", label: "Copy Number", action: () => copyToClipboard(card.card_number, "Card number") },
            { icon: isFrozen ? "🔥" : "❄️", label: freezing ? "Please wait…" : isFrozen ? "Unfreeze" : "Freeze Card", action: () => isFrozen ? handleFreeze() : setShowFreezeModal(true) },
            { icon: showCvv ? "🙈" : "👁️", label: showCvv ? "Hide CVV" : "Show CVV", action: () => { setShowCvv((v) => !v); if (!isFlipped) setIsFlipped(true); } },
            { icon: showFull ? "🔒" : "🔢", label: showFull ? "Hide Number" : "Show Number", action: () => setShowFull((v) => !v) },
          ].map((btn) => (
            <button key={btn.label} onClick={btn.action} disabled={freezing && btn.label.includes("reeze")}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-200 bg-white hover:border-blue-400 hover:shadow-sm transition-all disabled:opacity-60">
              <span className="text-2xl">{btn.icon}</span>
              <span className="text-xs font-semibold text-gray-700">{btn.label}</span>
            </button>
          ))}
        </div>

        {/* Copy rows */}
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden mb-5">
          {[
            { label: "Card Number", display: displayNumber, copy: card.card_number },
            { label: "Expiry Date", display: formatExpiry(card.expiry_month, card.expiry_year), copy: formatExpiry(card.expiry_month, card.expiry_year) },
            { label: "CVV", display: showCvv ? (card.cvv || "•••") : "•••", copy: card.cvv },
            { label: "Cardholder Name", display: card.cardholder_name || "-", copy: card.cardholder_name },
          ].map((row, i) => (
            <button key={row.label} onClick={() => row.copy && copyToClipboard(row.copy, row.label)}
              className={`w-full flex justify-between items-center px-5 py-4 hover:bg-gray-50 transition-colors text-left ${i > 0 ? "border-t border-gray-100" : ""}`}>
              <div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">{row.label}</div>
                <div className="font-mono text-sm font-medium text-gray-900">{row.display}</div>
              </div>
              <span className="text-gray-400">📋</span>
            </button>
          ))}
        </div>

        <Link href="/dashboard" className="block text-center text-sm text-blue-600 hover:underline mt-4">← Back to Dashboard</Link>
      </main>

      <Toast message={toast} show={toastVisible} />

      {showFreezeModal && (
        <div className="fixed inset-0 bg-black/60 z-40 flex items-end backdrop-blur-sm" onClick={() => setShowFreezeModal(false)}>
          <div className="w-full bg-white rounded-t-3xl p-6 pb-10" onClick={(e) => e.stopPropagation()} style={{ animation: "slideUp 0.3s ease" }}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
            <h3 className="text-lg font-bold mb-2">Freeze Card?</h3>
            <p className="text-sm text-gray-500 mb-6">Freezing blocks all transactions. You can unfreeze anytime.</p>
            <button onClick={handleFreeze} disabled={freezing} className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold mb-3 disabled:opacity-60">
              {freezing ? "Processing…" : "Yes, Freeze Card"}
            </button>
            <button onClick={() => setShowFreezeModal(false)} className="w-full py-4 rounded-2xl border border-gray-200 text-gray-600 font-semibold">Cancel</button>
          </div>
        </div>
      )}
      <style jsx global>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────
export default function VirtualCardPage() {
  const { card, loading, error, refetch } = useVirtualCard();

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

  if (error) {
    return (
      <div className="min-h-screen bg-[#F2F9FF] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button onClick={refetch} className="px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold">Try Again</button>
        </div>
      </div>
    );
  }

  // No card at all → request form
  if (!card) return <RequestCardView onRequested={refetch} />;

  // Rejected → show request form with rejection message
  if (card.status === "rejected") return <RequestCardView onRequested={refetch} wasRejected />;

  // Pending admin approval
  if (card.status === "pending") return <PendingCardView onRefresh={refetch} />;

  // Active or suspended (frozen) → full card UI
  return <ActiveCardView card={card} refetch={refetch} />;
}
