"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useVirtualCard } from "@/hooks/useVirtualCard";
import { useBiometricAuth } from "@/hooks/useBiometricAuth";
import { apiFetch } from "@/lib/api";

function money(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);
}
function maskNumber(num: string) {
  if (!num || num.length < 4) return "•••• •••• •••• ••••";
  return "•••• •••• •••• " + num.slice(-4);
}
function formatExpiry(m: string, y: string) {
  if (!m || !y) return "••/••";
  return m.toString().padStart(2, "0") + "/" + y.toString();
}

function Toast({ message, show }: { message: string; show: boolean }) {
  return (
    <div className={"fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-green-500 text-white text-sm font-semibold shadow-lg whitespace-nowrap transition-all duration-300 " + (show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none")}>
      {message}
    </div>
  );
}

function PasswordModal({ show, onSubmit, onCancel, error, isVerifying }: {
  show: boolean;
  onSubmit: (p: string) => void;
  onCancel: () => void;
  error: string;
  isVerifying: boolean;
}) {
  const [pw, setPw] = useState("");
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end backdrop-blur-sm" onClick={onCancel}>
      <div className="w-full bg-white rounded-t-3xl p-6 pb-10 max-w-lg mx-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slideUp 0.3s ease" }}>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🔐</div>
          <h3 className="text-lg font-bold text-gray-900">Enter Card PIN</h3>
          <p className="text-sm text-gray-500 mt-1">Enter your card PIN to reveal details</p>
        </div>
        <input
          type="password"
          inputMode="numeric"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && pw && onSubmit(pw)}
          placeholder="Enter card PIN"
          autoComplete="new-password"
          data-lpignore="true"
          data-form-type="other"
          className="w-full px-4 py-4 rounded-2xl border border-gray-200 text-sm mb-2 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 tracking-widest text-center text-lg"
        />
        {error && <p className="text-red-500 text-xs mb-3 ml-1">{error}</p>}
        <button onClick={() => pw && onSubmit(pw)} disabled={isVerifying || !pw}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold mb-3 disabled:opacity-60">
          {isVerifying ? "Verifying..." : "Verify & Reveal"}
        </button>
        <button onClick={onCancel} className="w-full py-4 rounded-2xl border border-gray-200 text-gray-600 font-semibold">
          Cancel
        </button>
      </div>
    </div>
  );
}

function CreatePinModal({ show, onSuccess, onCancel }: {
  show: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  if (!show) return null;

  async function handleCreate() {
    setError("");
    if (pin.length < 4 || !/^\d+$/.test(pin)) { setError("PIN must be at least 4 digits."); return; }
    if (pin !== confirm) { setError("PINs do not match."); return; }
    setLoading(true);
    try {
      const res = await apiFetch("/api/cards/set-pin/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin, confirm_pin: confirm }),
      });
      const data = await res.json();
      if (res.ok && data.success) { onSuccess(); }
      else { setError(data.error || "Failed to set PIN."); }
    } catch { setError("Connection error. Please try again."); }
    finally { setLoading(false); }
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end backdrop-blur-sm" onClick={onCancel}>
      <div className="w-full bg-white rounded-t-3xl p-6 pb-10 max-w-lg mx-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slideUp 0.3s ease" }}>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🔏</div>
          <h3 className="text-lg font-bold text-gray-900">Create Card PIN</h3>
          <p className="text-sm text-gray-500 mt-1">Set a secure PIN separate from your account password</p>
        </div>
        <input type="password" inputMode="numeric" pattern="[0-9]*" maxLength={6}
          value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter 4-6 digit PIN"
          autoComplete="new-password" data-lpignore="true" data-form-type="other"
          className="w-full px-4 py-4 rounded-2xl border border-gray-200 text-sm mb-3 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 tracking-widest text-center text-lg"
        />
        <input type="password" inputMode="numeric" pattern="[0-9]*" maxLength={6}
          value={confirm} onChange={(e) => setConfirm(e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          placeholder="Confirm PIN"
          autoComplete="new-password" data-lpignore="true" data-form-type="other"
          className="w-full px-4 py-4 rounded-2xl border border-gray-200 text-sm mb-2 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 tracking-widest text-center text-lg"
        />
        {error && <p className="text-red-500 text-xs mb-3 ml-1">{error}</p>}
        <button onClick={handleCreate} disabled={loading || !pin || !confirm}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold mb-3 disabled:opacity-60">
          {loading ? "Creating PIN..." : "Create PIN & Reveal"}
        </button>
        <button onClick={onCancel} className="w-full py-4 rounded-2xl border border-gray-200 text-gray-600 font-semibold">
          Cancel
        </button>
      </div>
    </div>
  );
}

function RequestCardView({ onRequested }: { onRequested: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRequest() {
    setLoading(true); setError(null);
    try {
      const res = await apiFetch("/api/virtualcards/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchase_amount: 1000 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      onRequested();
    } catch (e: any) {
      setError(e?.message || "Failed to submit request");
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-[#F2F9FF] flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <div className="text-7xl mb-5">💳</div>
          <h2 className="text-2xl font-bold text-[#0b2f6b] mb-2">Get Your Virtual Card</h2>
          <p className="text-gray-500 text-sm leading-relaxed">Activate a WolvCapital Visa virtual card for digital transactions worldwide.</p>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-white p-6 mb-5 shadow-sm">
          {([
            { label: "Card Type", value: "Visa Virtual Card" },
            { label: "Activation Fee", value: "$0.00", green: true },
            { label: "Purchase Amount", value: "$1,000.00", bold: true },
            { label: "Processing Time", value: "1-24 hours" },
          ] as any[]).map((row, i) => (
            <div key={row.label} className={"flex justify-between items-center py-3 " + (i > 0 ? "border-t border-gray-100" : "")}>
              <span className="text-sm text-gray-500">{row.label}</span>
              <span className={"text-sm " + (row.green ? "text-green-600 font-semibold" : row.bold ? "font-bold text-[#0b2f6b]" : "font-semibold")}>{row.value}</span>
            </div>
          ))}
        </div>
        {error && <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm p-4 mb-4">{error}</div>}
        <button onClick={handleRequest} disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-base shadow-lg disabled:opacity-60">
          {loading ? "Submitting..." : "Request Card — $1,000"}
        </button>
        <p className="text-center text-xs text-gray-400 mt-4">Your request will be reviewed and approved by our team.</p>
        <Link href="/dashboard" className="block text-center text-sm text-blue-600 hover:underline mt-4">Back to Dashboard</Link>
      </div>
    </div>
  );
}

function PendingCardView({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="min-h-screen bg-[#F2F9FF] flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        <div className="text-7xl mb-5">⏳</div>
        <h2 className="text-xl font-bold text-[#0b2f6b] mb-2">Card Under Review</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">Your virtual card request is being reviewed. This usually takes 1-24 hours.</p>
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 mb-6 text-left">
          <div className="flex gap-3">
            <span className="text-xl">📋</span>
            <div>
              <div className="font-semibold text-yellow-800 text-sm mb-1">What happens next?</div>
              <ul className="text-yellow-700 text-xs space-y-1">
                <li>• Our team verifies your account</li>
                <li>• Card details are generated and assigned</li>
                <li>• You receive a notification when ready</li>
              </ul>
            </div>
          </div>
        </div>
        <button onClick={onRefresh}
          className="w-full py-3 rounded-2xl border border-blue-200 text-blue-600 font-semibold text-sm hover:bg-blue-50 transition-colors mb-3">
          🔄 Check Status
        </button>
        <Link href="/dashboard" className="block text-center text-sm text-blue-600 hover:underline">Back to Dashboard</Link>
      </div>
    </div>
  );
}

function ActiveCardView({ card, refetch }: { card: any; refetch: () => void }) {
  const {
    securityUnlocked,
    showPasswordModal,
    showCreatePinModal,
    setShowCreatePinModal,
    passwordError,
    isVerifying,
    requestAccess,
    submitPassword,
    cancelModal,
    lockDetails,
    setOnLock,
  } = useBiometricAuth();

  const [isFlipped, setIsFlipped] = useState(false);
  const [isFrozen, setIsFrozen] = useState(card.status === "suspended");
  const [freezing, setFreezing] = useState(false);
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [toast, setToast] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setOnLock(() => {
      setShowCvv(false);
      setShowFull(false);
    });
  }, [setOnLock]);

  function showToast(msg: string) {
    setToast(msg); setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2500);
  }

  async function copyToClipboard(value: string, label: string) {
    try { await navigator.clipboard.writeText(value); }
    catch {
      const el = document.createElement("textarea");
      el.value = value; document.body.appendChild(el);
      el.select(); document.execCommand("copy");
      document.body.removeChild(el);
    }
    showToast(label + " copied!");
  }

  function handleReveal(action: "number" | "cvv") {
    requestAccess(action, (resolvedAction) => {
      showToast("Identity verified");
      if (resolvedAction === "number") setShowFull(true);
      if (resolvedAction === "cvv") { setShowCvv(true); if (!isFlipped) setIsFlipped(true); }
    });
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
      showToast(data.frozen ? "Card frozen" : "Card unfrozen");
      refetch();
    } catch { setIsFrozen((prev) => !prev); }
    finally { setFreezing(false); setShowFreezeModal(false); }
  }

  const displayNumber = showFull && card.card_number
    ? card.card_number.replace(/(.{4})/g, "$1 ").trim()
    : maskNumber(card.card_number);

  return (
    <>
      <div className="min-h-screen bg-[#F2F9FF]">
        <main className="max-w-lg mx-auto px-4 pt-6 pb-28">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
            <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Virtual Card</span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-semibold text-[#0b2f6b]">Virtual Card</h1>
              <p className="text-sm text-gray-500 mt-0.5">Tap card to flip</p>
            </div>
            <div className="flex items-center gap-2">
              {securityUnlocked && (
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                  🔓 Unlocked
                </span>
              )}
              <span className={"px-3 py-1 rounded-full text-xs font-semibold border " + (
                isFrozen ? "bg-blue-100 text-blue-700 border-blue-200"
                : card.is_active ? "bg-green-100 text-green-700 border-green-200"
                : "bg-gray-100 text-gray-600 border-gray-200"
              )}>
                {isFrozen ? "❄️ Frozen" : card.is_active ? "● Active" : card.status}
              </span>
            </div>
          </div>

          {!securityUnlocked && (
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 mb-4 flex items-center gap-3">
              <span className="text-xl">🔐</span>
              <div>
                <div className="text-xs font-semibold text-blue-800">PIN protection enabled</div>
                <div className="text-xs text-blue-600">Card PIN required to reveal sensitive details</div>
              </div>
            </div>
          )}

          {/* Premium 3D Flip Card */}
          <div
            className="w-full max-w-[420px] mx-auto mb-2 cursor-pointer select-none"
            style={{ perspective: "1500px", aspectRatio: "1.586 / 1" }}
            onClick={() => setIsFlipped((f) => !f)}
          >
            <motion.div
              className="relative w-full h-full"
              style={{ transformStyle: "preserve-3d" }}
              initial={false}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              {/* FRONT FACE */}
              <div
                className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-2xl"
                style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
              >
                {/* Card gradient background */}
                <div className="w-full h-full relative"
                  style={{ background: "linear-gradient(135deg, #0f1c30 0%, #0a3d62 40%, #00a896 100%)" }}>
                  {/* Decorative circles */}
                  <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10"
                    style={{ background: "radial-gradient(circle, #ffffff, transparent)" }} />
                  <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full opacity-10"
                    style={{ background: "radial-gradient(circle, #00a896, transparent)" }} />
                  {/* Header */}
                  <div className="absolute top-0 left-0 right-0 px-5 pt-4 flex justify-between items-start">
                    <span className="text-white font-bold text-sm tracking-widest opacity-90">WOLVCAPITAL</span>
                    <svg viewBox="0 0 48 16" width="52" height="18" fill="none">
                      <text x="0" y="13" fontFamily="serif" fontStyle="italic" fontSize="14" fontWeight="bold" fill="white" opacity="0.95">VISA</text>
                    </svg>
                  </div>
                  {/* Chip */}
                  <div className="absolute left-5" style={{ top: "38%" }}>
                    <div className="w-9 h-7 rounded-md"
                      style={{ background: "linear-gradient(135deg, #d4a843 0%, #f5d980 40%, #c8921e 100%)", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
                      <div className="w-full h-full rounded-md opacity-50"
                        style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)" }} />
                    </div>
                  </div>
                  {/* Card number */}
                  <div className="absolute bottom-10 left-5 right-5">
                    <div className="font-mono text-white text-base tracking-[0.2em] opacity-90 mb-2">
                      {displayNumber}
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-white opacity-50 text-xs uppercase tracking-wider mb-0.5">Card Holder</div>
                        <div className="text-white text-sm font-semibold tracking-wide">{card.cardholder_name || "CARD HOLDER"}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white opacity-50 text-xs uppercase tracking-wider mb-0.5">Expires</div>
                        <div className="text-white text-sm font-semibold">{formatExpiry(card.expiry_month, card.expiry_year)}</div>
                      </div>
                    </div>
                  </div>
                  {/* Frozen overlay */}
                  {isFrozen && (
                    <div className="absolute inset-0 rounded-2xl flex items-center justify-center"
                      style={{ background: "rgba(10,30,60,0.7)", backdropFilter: "blur(2px)" }}>
                      <div className="text-center">
                        <div className="text-5xl mb-2">❄️</div>
                        <div className="text-white font-bold text-sm tracking-widest">CARD FROZEN</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* BACK FACE */}
              <div
                className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-2xl"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="w-full h-full relative"
                  style={{ background: "linear-gradient(135deg, #0a3d62 0%, #0f1c30 60%, #00a896 100%)" }}>
                  {/* Magnetic stripe */}
                  <div className="absolute top-7 left-0 right-0 h-10 bg-gray-900 opacity-90" />
                  {/* Signature + CVV */}
                  <div className="absolute left-5 right-5" style={{ top: "52%" }}>
                    <div className="text-white opacity-50 text-xs uppercase tracking-wider mb-1">CVV</div>
                    <div className="bg-white rounded px-3 py-2 flex justify-between items-center">
                      <div className="text-gray-400 text-xs italic tracking-widest flex-1">{"— — — — — — — — — — —"}</div>
                      <div className="font-mono font-bold text-gray-900 text-sm ml-3">
                        {showCvv ? card.cvv : "•••"}
                      </div>
                    </div>
                  </div>
                  {/* VISA bottom right */}
                  <div className="absolute bottom-4 right-5">
                    <svg viewBox="0 0 48 16" width="44" height="16" fill="none">
                      <text x="0" y="13" fontFamily="serif" fontStyle="italic" fontSize="14" fontWeight="bold" fill="white" opacity="0.7">VISA</text>
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <p className="text-center text-xs text-gray-400 mb-5">Tap card to flip</p>

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

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {([
              {
                icon: "📋", label: "Copy Number",
                action: () => securityUnlocked ? copyToClipboard(card.card_number, "Card number") : handleReveal("number"),
              },
              {
                icon: isFrozen ? "🔥" : "❄️",
                label: freezing ? "Please wait..." : isFrozen ? "Unfreeze" : "Freeze Card",
                action: () => isFrozen ? handleFreeze() : setShowFreezeModal(true),
              },
              {
                icon: showCvv ? "🙈" : "👁️",
                label: showCvv ? "Hide CVV" : "🔐 Show CVV",
                action: () => showCvv ? setShowCvv(false) : handleReveal("cvv"),
              },
              {
                icon: showFull ? "🔒" : "🔢",
                label: showFull ? "Hide Number" : "🔐 Full Number",
                action: () => showFull ? setShowFull(false) : handleReveal("number"),
              },
            ] as any[]).map((btn) => (
              <button key={btn.label} onClick={btn.action}
                disabled={freezing && btn.label === "Freeze Card"}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-200 bg-white hover:border-blue-400 hover:shadow-sm transition-all disabled:opacity-60">
                <span className="text-2xl">{btn.icon}</span>
                <span className="text-xs font-semibold text-gray-700 text-center">{btn.label}</span>
              </button>
            ))}
          </div>

          {/* Copy rows */}
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden mb-5">
            {([
              { label: "Card Number", display: showFull ? (card.card_number || "").replace(/(.{4})/g, "$1 ").trim() : maskNumber(card.card_number), copy: card.card_number, secure: true, action: "number" },
              { label: "Expiry Date", display: formatExpiry(card.expiry_month, card.expiry_year), copy: formatExpiry(card.expiry_month, card.expiry_year), secure: false },
              { label: "CVV", display: showCvv ? card.cvv : "•••", copy: card.cvv, secure: true, action: "cvv" },
              { label: "Cardholder Name", display: card.cardholder_name || "-", copy: card.cardholder_name, secure: false },
            ] as any[]).map((row, i) => (
              <button key={row.label}
                onClick={() => {
                  if (row.secure && !securityUnlocked) { handleReveal(row.action); }
                  else if (row.copy) { copyToClipboard(row.copy, row.label); }
                }}
                className={"w-full flex justify-between items-center px-5 py-4 hover:bg-gray-50 transition-colors text-left " + (i > 0 ? "border-t border-gray-100" : "")}>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">
                    {row.label} {row.secure && !securityUnlocked ? "🔐" : ""}
                  </div>
                  <div className="font-mono text-sm font-medium text-gray-900">{row.display}</div>
                </div>
                <span className="text-gray-400">{row.secure && !securityUnlocked ? "🔐" : "📋"}</span>
              </button>
            ))}
          </div>

          {securityUnlocked && (
            <button onClick={() => { lockDetails(); setShowCvv(false); setShowFull(false); }}
              className="w-full py-3 rounded-2xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors mb-4">
              🔒 Lock Card Details
            </button>
          )}

          <Link href="/dashboard" className="block text-center text-sm text-blue-600 hover:underline mt-2">
            Back to Dashboard
          </Link>
        </main>

        <Toast message={toast} show={toastVisible} />

        <CreatePinModal
          show={showCreatePinModal}
          onCancel={() => setShowCreatePinModal(false)}
          onSuccess={() => {
            setShowCreatePinModal(false);
            showToast("PIN created! Tap again to reveal details.");
          }}
        />

        <PasswordModal
          show={showPasswordModal}
          onSubmit={submitPassword}
          onCancel={cancelModal}
          error={passwordError}
          isVerifying={isVerifying}
        />

        {showFreezeModal && (
          <div
            className="fixed inset-0 bg-black/60 z-40 flex items-end backdrop-blur-sm"
            onClick={() => setShowFreezeModal(false)}
          >
            <div className="w-full bg-white rounded-t-3xl p-6 pb-10"
              onClick={(e) => e.stopPropagation()}
              style={{ animation: "slideUp 0.3s ease" }}>
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
              <h3 className="text-lg font-bold mb-2">Freeze Card?</h3>
              <p className="text-sm text-gray-500 mb-6">Freezing blocks all transactions. You can unfreeze anytime.</p>
              <button onClick={handleFreeze} disabled={freezing}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold mb-3 disabled:opacity-60">
                {freezing ? "Processing..." : "Yes, Freeze Card"}
              </button>
              <button onClick={() => setShowFreezeModal(false)}
                className="w-full py-4 rounded-2xl border border-gray-200 text-gray-600 font-semibold">
                Cancel
              </button>
            </div>
          </div>
        )}

        <style jsx global>{`
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}</style>
      </div>
    </>
  );
}

export default function VirtualCardPage() {
  const { card, loading, error, refetch } = useVirtualCard();

  if (loading) return (
    <div className="min-h-screen bg-[#F2F9FF] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Loading your card...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#F2F9FF] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <p className="text-red-600 font-medium mb-4">{error}</p>
        <button onClick={refetch} className="px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold">Try Again</button>
      </div>
    </div>
  );

  if (!card) return <RequestCardView onRequested={refetch} />;
  if (card.status === "pending") return <PendingCardView onRefresh={refetch} />;
  return <ActiveCardView card={card} refetch={refetch} />;
}