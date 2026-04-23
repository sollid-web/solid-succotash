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
          {wasRejected ? "Your previous request was not approved. Submit a new request or contact support." : "Activate a WolvCapital Visa Infinite virtual card for digital transactions worldwide."}
        </p>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-5">
        {[
          { label: "Card Type", value: "Visa Infinite Virtual" },
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
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0f1c30] to-[#00a896] text-white font-semibold text-sm shadow hover:shadow-md transition-all disabled:opacity-60">
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

// ── The realistic card face ───────────────────────────────
function CardFace({ card, showFull, showCvv, isFrozen, isBack }: {
  card: any; showFull: boolean; showCvv: boolean; isFrozen: boolean; isBack: boolean;
}) {
  const displayNum = showFull && card.card_number
    ? card.card_number.replace(/(.{4})/g, "$1 ").trim()
    : maskNumber(card.card_number);

  if (isBack) {
    return (
      <div style={{
        position: "absolute", inset: 0,
        backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" as any,
        transform: "rotateY(180deg)",
        borderRadius: 16,
        background: "linear-gradient(135deg, #0f1c30 0%, #1a3a5f 40%, #2a6a8f 70%, #00a896 100%)",
        color: "white",
        boxShadow: "0 20px 60px rgba(0,168,150,0.35), 0 4px 16px rgba(0,0,0,0.3)",
        overflow: "hidden",
      }}>
        {/* Geometric shapes background */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 16 }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, background: "rgba(0,168,150,0.2)", borderRadius: "50%", transform: "rotate(30deg)" }} />
          <div style={{ position: "absolute", bottom: -30, left: -30, width: 160, height: 160, background: "rgba(42,106,143,0.25)", borderRadius: "40%" }} />
        </div>
        {/* Magnetic stripe */}
        <div style={{ height: 44, background: "rgba(0,0,0,0.7)", marginBottom: 18, marginTop: 30 }} />
        <div style={{ padding: "0 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 8, opacity: 0.6, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Security Code</div>
              <div style={{ fontSize: 8, opacity: 0.45 }}>CVV / CVC</div>
            </div>
            <div style={{ background: "#f5f0e8", color: "#111", fontFamily: "monospace", padding: "5px 14px", borderRadius: 4, fontSize: 14, letterSpacing: 5, minWidth: 64, textAlign: "center", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.15)" }}>
              {showCvv ? (card.cvv || "•••") : "•••"}
            </div>
          </div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.1)", marginBottom: 10 }} />
          <p style={{ fontSize: 9, opacity: 0.4, lineHeight: 1.6 }}>
            This card is issued by WolvCapital for authorised digital transactions only.<br />
            Keep your security code confidential. Report lost cards immediately.
          </p>
          <p style={{ fontSize: 9, opacity: 0.3, marginTop: 14, textAlign: "center" }}>↩ Tap to flip back</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: "absolute", inset: 0,
      backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" as any,
      borderRadius: 16,
      background: "linear-gradient(135deg, #0f1c30 0%, #1a3a5f 35%, #2a6a8f 65%, #00a896 100%)",
      padding: "20px 22px",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      color: "white",
      boxShadow: "0 20px 60px rgba(0,168,150,0.35), 0 4px 16px rgba(0,0,0,0.3)",
      overflow: "hidden",
    }}>
      {/* Geometric background shapes — matches image 2 */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 16, pointerEvents: "none" }}>
        {/* Large diagonal teal shape */}
        <div style={{ position: "absolute", top: -20, right: -20, width: 260, height: 260, background: "rgba(0,168,150,0.18)", borderRadius: "35%", transform: "rotate(-15deg)" }} />
        {/* Medium blue-green shape */}
        <div style={{ position: "absolute", bottom: -30, left: 60, width: 180, height: 180, background: "rgba(42,106,143,0.22)", borderRadius: "40%", transform: "rotate(20deg)" }} />
        {/* Small accent */}
        <div style={{ position: "absolute", top: 30, right: 80, width: 100, height: 100, background: "rgba(100,200,180,0.1)", borderRadius: "50%", transform: "rotate(45deg)" }} />
        {/* Metallic shine */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0) 100%)" }} />
      </div>

      {/* Top row: brand + VISA Infinite */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 0.5, lineHeight: 1 }}>WolvCapital</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 20, fontWeight: 900, fontStyle: "italic", letterSpacing: -0.5, lineHeight: 1 }}>VISA</div>
          <div style={{ fontSize: 8, opacity: 0.7, letterSpacing: 1, textTransform: "uppercase", marginTop: 1 }}>Infinite</div>
        </div>
      </div>

      {/* Chip + contactless row */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
        {/* EMV chip */}
        <div style={{ width: 44, height: 34, background: "linear-gradient(135deg, #c8a951, #f0d878, #b8922a)", borderRadius: 6, position: "relative", boxShadow: "0 2px 6px rgba(0,0,0,0.3)", flexShrink: 0 }}>
          {/* Chip lines */}
          <div style={{ position: "absolute", inset: 0, borderRadius: 6, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "33%", left: 0, right: 0, height: 1, background: "rgba(150,110,20,0.5)" }} />
            <div style={{ position: "absolute", top: "66%", left: 0, right: 0, height: 1, background: "rgba(150,110,20,0.5)" }} />
            <div style={{ position: "absolute", left: "33%", top: 0, bottom: 0, width: 1, background: "rgba(150,110,20,0.5)" }} />
            <div style={{ position: "absolute", left: "66%", top: 0, bottom: 0, width: 1, background: "rgba(150,110,20,0.5)" }} />
            <div style={{ position: "absolute", inset: "25%", borderRadius: 2, border: "1px solid rgba(150,110,20,0.4)" }} />
          </div>
        </div>
        {/* Contactless symbol */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" opacity={0.75}>
          <path d="M12 17.5C9.5 15.5 9.5 8.5 12 6.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
          <path d="M15 19.5C10.5 16 10.5 8 15 4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
          <path d="M18 21C11.5 16.5 11.5 7.5 18 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
          <circle cx="9" cy="12" r="1.2" fill="white"/>
        </svg>
      </div>

      {/* Card number */}
      <div style={{ fontFamily: "monospace", fontSize: 17, letterSpacing: 3, opacity: 0.95, textShadow: "0 1px 3px rgba(0,0,0,0.4)", position: "relative" }}>
        {displayNum}
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative" }}>
        <div>
          <div style={{ fontSize: 7, opacity: 0.6, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 3 }}>Card Holder</div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" }}>{card.cardholder_name || "CARD HOLDER"}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 7, opacity: 0.6, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 3 }}>Valid Thru</div>
          <div style={{ fontSize: 12, fontWeight: 700, fontFamily: "monospace" }}>{formatExpiry(card.expiry_month, card.expiry_year)}</div>
        </div>
        {/* Hologram placeholder */}
        <div style={{ width: 36, height: 36, borderRadius: 4, background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(0,200,180,0.3), rgba(150,100,255,0.2))", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
          🕊️
        </div>
      </div>

      {/* Frozen overlay */}
      {isFrozen && (
        <div style={{ position: "absolute", inset: 0, borderRadius: 16, background: "rgba(8,10,18,0.72)", backdropFilter: "blur(3px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <span style={{ fontSize: 28 }}>❄️</span>
          <span style={{ color: "#93c5fd", fontWeight: 700, fontSize: 12, letterSpacing: 2 }}>CARD FROZEN</span>
        </div>
      )}
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

  return (
    <div className="max-w-sm mx-auto px-4 py-6 pb-20">

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

      {/* Card with real proportions — max 360px, 63% padding = 54/85.6 ratio */}
      <div className="flex justify-center mb-2">
        <div style={{ width: "100%", maxWidth: 360, perspective: "1200px" }}
          onClick={() => { if (!isFrozen) setIsFlipped(f => !f); }}>
          <div style={{
            position: "relative", width: "100%", paddingTop: "63%",
            transformStyle: "preserve-3d",
            transition: "transform 0.65s cubic-bezier(.4,0,.2,1)",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            cursor: isFrozen ? "not-allowed" : "pointer",
          }}>
            <CardFace card={card} showFull={showFull} showCvv={showCvv} isFrozen={isFrozen} isBack={false} />
            <CardFace card={card} showFull={showFull} showCvv={showCvv} isFrozen={isFrozen} isBack={true} />
          </div>
        </div>
      </div>
      <p className="text-center text-[10px] text-gray-400 mb-5">Tap card to flip</p>

      {/* Balance */}
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

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {[
          { icon: "📋", label: "Copy Number", fn: () => copy(card.card_number, "Card number") },
          { icon: isFrozen ? "🔥" : "❄️", label: isFrozen ? "Unfreeze" : "Freeze Card", fn: () => isFrozen ? handleFreeze() : setShowFreezeModal(true) },
          { icon: showCvv ? "🙈" : "👁️", label: showCvv ? "Hide CVV" : "Show CVV", fn: () => { setShowCvv(v => !v); if (!isFlipped) setIsFlipped(true); } },
          { icon: showFull ? "🔒" : "🔢", label: showFull ? "Hide Number" : "Full Number", fn: () => setShowFull(v => !v) },
        ].map(btn => (
          <button key={btn.label} onClick={btn.fn} disabled={freezing}
            className="flex flex-col items-center gap-1.5 py-3.5 px-2 bg-white border border-gray-200 rounded-xl text-center hover:border-teal-400 hover:shadow-sm transition-all disabled:opacity-50">
            <span className="text-xl">{btn.icon}</span>
            <span className="text-[11px] font-semibold text-gray-600">{btn.label}</span>
          </button>
        ))}
      </div>

      {/* Copy rows */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-4 shadow-sm">
        {[
          { label: "Card Number", display: showFull && card.card_number ? card.card_number.replace(/(.{4})/g,"$1 ").trim() : maskNumber(card.card_number), copy: card.card_number },
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

      {showFreezeModal && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-end" onClick={() => setShowFreezeModal(false)}>
          <div className="w-full bg-white rounded-t-2xl p-5 pb-8 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="text-base font-bold text-gray-900 mb-1">Freeze Card?</h3>
            <p className="text-sm text-gray-500 mb-5">All transactions will be blocked. You can unfreeze anytime.</p>
            <button onClick={handleFreeze} disabled={freezing}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0f1c30] to-[#00a896] text-white font-semibold text-sm mb-2.5 disabled:opacity-60">
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
        <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-400">Loading your card…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-64 px-4">
      <div className="text-center">
        <div className="text-3xl mb-3">⚠️</div>
        <p className="text-red-500 text-sm mb-3">{error}</p>
        <button onClick={refetch} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold">Try Again</button>
      </div>
    </div>
  );

  if (!card) return <RequestCardView onRequested={refetch} />;
  if (card.status === "rejected") return <RequestCardView onRequested={refetch} wasRejected />;
  if (card.status === "pending") return <PendingCardView onRefresh={refetch} />;
  return <ActiveCardView card={card} refetch={refetch} />;
}
