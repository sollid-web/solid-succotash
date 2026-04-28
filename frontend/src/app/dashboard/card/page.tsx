"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useVirtualCard } from "@/hooks/useVirtualCard";
import { useBiometricAuth } from "@/hooks/useBiometricAuth";
import { apiFetch } from "@/lib/api";

/** --- Helper Functions --- **/
const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
const maskNumber = (num: string) => num ? `•••• •••• •••• ${num.slice(-4)}` : "•••• •••• •••• ••••";
const formatExpiry = (m: string, y: string) => (m && y) ? `${m.toString().padStart(2, "0")}/${y.toString().slice(-2)}` : "••/••";

/** --- Components --- **/

function Toast({ message, show }: { message: string; show: boolean }) {
  return (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-gray-900/90 text-white text-sm font-semibold shadow-2xl backdrop-blur-md transition-all duration-300 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
      {message}
    </div>
  );
}

function CreatePinModal({ show, onCancel, onSuccess }: { show: boolean; onCancel: () => void; onSuccess: () => void }) {
  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  if (!show) return null;

  async function handleSubmit() {
    if (pin.length < 4) return setError("PIN must be at least 4 digits");
    if (pin !== confirm) return setError("PINs do not match");
    setSaving(true);
    try {
      const res = await apiFetch("/api/cards/set-pin/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin, confirm_pin: confirm }),
      });
      if (!res.ok) throw new Error("Failed to set PIN");
      onSuccess();
    } catch {
      setError("Failed to save PIN. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-end sm:items-center justify-center backdrop-blur-sm" onClick={onCancel}>
      <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6" onClick={e => e.stopPropagation()} style={{ background: "linear-gradient(135deg, rgba(26,58,143,0.6) 0%, rgba(14,165,201,0.4) 100%)" }}>
        <div className="w-12 h-1 rounded-full mx-auto mb-6 sm:hidden" style={{ background: "rgba(255,255,255,0.2)" }} />
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🔑</div>
          <h3 className="text-xl font-bold" style={{ color: "#fff" }}>Create Card PIN</h3>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>Set a PIN to protect your card details</p>
        </div>
        <input
          type="password"
          inputMode="numeric"
          autoFocus
          value={pin}
          onChange={e => setPin(e.target.value)}
          placeholder="Enter PIN"
          className="w-full px-4 py-4 rounded-2xl border text-center text-2xl tracking-[1em] mb-3 outline-none"
          style={{ borderColor: "rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)", color: "#fff" }}
        />
        <input
          type="password"
          inputMode="numeric"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder="Confirm PIN"
          className="w-full px-4 py-4 rounded-2xl border text-center text-2xl tracking-[1em] mb-2 outline-none"
          style={{ borderColor: "rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)", color: "#fff" }}
        />
        {error && <p className="text-xs text-center mb-4" style={{ color: "#ff6b6b" }}>{error}</p>}
        <button onClick={handleSubmit} disabled={saving || !pin || !confirm}
          className="w-full py-4 text-white rounded-2xl font-bold mb-3 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #00a896, #0f7a70)" }}>
          {saving ? "Saving..." : "Create PIN"}
        </button>
        <button onClick={onCancel} className="w-full py-3 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>Cancel</button>
      </div>
    </div>
  );
}

function PasswordModal({ show, onSubmit, onCancel, error, isVerifying }: any) {
  const [pw, setPw] = useState("");
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-end sm:items-center justify-center backdrop-blur-sm" onClick={onCancel}>
      <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6" onClick={e => e.stopPropagation()} style={{ background: "linear-gradient(135deg, rgba(26,58,143,0.6) 0%, rgba(14,165,201,0.4) 100%)" }}>
        <div className="w-12 h-1 rounded-full mx-auto mb-6 sm:hidden" style={{ background: "rgba(255,255,255,0.2)" }} />
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🔐</div>
          <h3 className="text-xl font-bold" style={{ color: "#fff" }}>Security Check</h3>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>Enter your card PIN to reveal details</p>
        </div>
        <input
          type="password"
          inputMode="numeric"
          autoFocus
          value={pw}
          onChange={e => setPw(e.target.value)}
          placeholder="••••"
          className="w-full px-4 py-4 rounded-2xl border text-center text-2xl tracking-[1em] mb-2 outline-none"
          style={{ borderColor: "rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)", color: "#fff" }}
        />
        {error && <p className="text-xs text-center mb-4" style={{ color: "#ff6b6b" }}>{error}</p>}
        <button onClick={() => onSubmit(pw)} disabled={isVerifying || !pw} className="w-full py-4 text-white rounded-2xl font-bold mb-3 disabled:opacity-50" style={{ background: "linear-gradient(135deg, #00a896, #0f7a70)" }}>
          {isVerifying ? "Verifying..." : "Unlock Details"}
        </button>
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
      <div className="min-h-screen" style={{ background: "#0a0f1e", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <main className="max-w-lg mx-auto px-4 pt-6 pb-28">
          <div className="flex items-center gap-2 text-sm mb-5" style={{ color: "rgba(255,255,255,0.5)" }}>
            <Link href="/dashboard" style={{ color: "rgba(0,168,150,0.8)", textDecoration: "none" }} className="hover:underline">Dashboard</Link>
            <span>/</span>
            <span className="font-medium" style={{ color: "#fff" }}>Virtual Card</span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-semibold" style={{ color: "#fff" }}>Virtual Card</h1>
              <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>Tap card to flip</p>
            </div>
            <div className="flex items-center gap-2">
              {securityUnlocked && (
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                  🔓 Unlocked
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{
                ...(isFrozen ? { background: "rgba(59,130,246,0.2)", color: "#3b82f6", borderColor: "rgba(59,130,246,0.3)" }
                : card.is_active ? { background: "rgba(16,185,129,0.2)", color: "#10b981", borderColor: "rgba(16,185,129,0.3)" }
                : { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", borderColor: "rgba(255,255,255,0.1)" })
              }}>
                {isFrozen ? "❄️ Frozen" : card.is_active ? "● Active" : card.status}
              </span>
            </div>
          </div>

          {!securityUnlocked && (
            <div className="rounded-xl border p-3 mb-4 flex items-center gap-3" style={{ background: "rgba(0,168,150,0.15)", borderColor: "rgba(0,168,150,0.3)" }}>
              <span className="text-xl">🔐</span>
              <div>
                <div className="text-xs font-semibold" style={{ color: "rgba(0,168,150,0.9)" }}>PIN protection enabled</div>
                <div className="text-xs" style={{ color: "rgba(0,168,150,0.7)" }}>Card PIN required to reveal sensitive details</div>
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
                <div className="w-full h-full relative" style={{
                  background: "linear-gradient(135deg, #1a3a8f 0%, #1e4db7 20%, #2060cc 40%, #1a8fc1 70%, #0ea5c9 100%)",
                }}>
                  {/* Geometric polygons */}
                  <div className="absolute" style={{
                    top: 0, right: 0, width: "60%", height: "70%",
                    background: "linear-gradient(210deg, rgba(56,189,248,0.32) 0%, rgba(30,120,200,0.08) 55%, transparent 100%)",
                    clipPath: "polygon(100% 0%, 100% 75%, 25% 100%, 0% 35%, 45% 0%)",
                  }} />
                  <div className="absolute" style={{
                    bottom: 0, left: 0, width: "45%", height: "50%",
                    background: "linear-gradient(45deg, rgba(15,40,110,0.4) 0%, transparent 80%)",
                    clipPath: "polygon(0% 100%, 0% 15%, 75% 0%, 100% 55%, 35% 100%)",
                  }} />
                  <div className="absolute inset-0" style={{
                    background: "linear-gradient(155deg, transparent 25%, rgba(255,255,255,0.05) 50%, transparent 75%)",
                  }} />
                  {/* Header */}
                  <div className="absolute top-0 left-0 right-0 px-4 pt-3 flex justify-between items-start">
                    <div style={{ display: "flex", alignItems: "baseline" }}>
                      <span style={{ color: "#fff", fontWeight: 800, fontSize: "14px", fontFamily: "Georgia, serif" }}>Wolv</span>
                      <span style={{ color: "#7dd3fc", fontWeight: 800, fontSize: "14px", fontFamily: "Georgia, serif" }}>Capital</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", lineHeight: 1 }}>
                      <span style={{ color: "#fff", fontFamily: "serif", fontStyle: "italic", fontWeight: 900, fontSize: "19px", letterSpacing: "1px" }}>VISA</span>
                      <span style={{ color: "rgba(255,255,255,0.72)", fontSize: "7.5px", letterSpacing: "2px", marginTop: "1px" }}>Infinite</span>
                    </div>
                  </div>
                  {/* Chip + Contactless */}
                  <div style={{ position: "absolute", top: "37%", left: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{
                      width: "36px", height: "27px", borderRadius: "4px",
                      background: "linear-gradient(135deg, #b8860b 0%, #f5d06e 35%, #daa520 55%, #b8860b 100%)",
                      boxShadow: "0 1px 5px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.25)",
                      position: "relative", overflow: "hidden",
                    }}>
                      <div style={{
                        position: "absolute", inset: 0,
                        background: "repeating-linear-gradient(0deg,transparent,transparent 4px,rgba(0,0,0,0.08) 4px,rgba(0,0,0,0.08) 5px), repeating-linear-gradient(90deg,transparent,transparent 4px,rgba(0,0,0,0.08) 4px,rgba(0,0,0,0.08) 5px)",
                      }} />
                      <div style={{
                        position: "absolute", top: "5px", left: "5px", right: "5px", bottom: "5px",
                        background: "linear-gradient(135deg, #c8960c, #f0c83a)",
                        borderRadius: "2px", border: "0.5px solid rgba(0,0,0,0.2)",
                      }} />
                    </div>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 3C8 7 8 17 12 21" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M15.5 6C13 8.5 13 15.5 15.5 18" stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M19 9C17.5 10.5 17.5 13.5 19 15" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  {/* Card number + details */}
                  <div style={{ position: "absolute", bottom: "14px", left: "16px", right: "16px" }}>
                    <div style={{ fontFamily: "'Courier New', monospace", color: "#fff", fontSize: "14px", letterSpacing: "0.2em", opacity: 0.92, marginBottom: "8px" }}>
                      {displayNumber}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <div>
                        <div style={{ color: "rgba(255,255,255,0.52)", fontSize: "7px", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "2px" }}>Card Holder</div>
                        <div style={{ color: "#fff", fontSize: "11px", fontWeight: 600 }}>{card.cardholder_name || "CARD HOLDER"}</div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ color: "rgba(255,255,255,0.52)", fontSize: "7px", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "2px" }}>Valid Thru</div>
                        <div style={{ color: "#fff", fontSize: "11px", fontWeight: 600 }}>{formatExpiry(card.expiry_month, card.expiry_year)}</div>
                      </div>
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "50%",
                        background: "conic-gradient(from 0deg, #a78bfa, #60a5fa, #34d399, #fbbf24, #f472b6, #a78bfa)",
                        opacity: 0.78, flexShrink: 0,
                      }} />
                    </div>
                  </div>
                  {/* Frozen overlay */}
                  {isFrozen && (
                    <div className="absolute inset-0 rounded-2xl flex items-center justify-center"
                      style={{ background: "rgba(10,30,60,0.72)", backdropFilter: "blur(3px)" }}>
                      <div className="text-center">
                        <div className="text-5xl mb-2">❄️</div>
                        <div style={{ color: "#fff", fontWeight: 700, fontSize: "12px", letterSpacing: "3px" }}>CARD FROZEN</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* BACK FACE */}
              <div
                className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-2xl"
                style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <div className="w-full h-full relative" style={{
                  background: "linear-gradient(135deg, #1a3a8f 0%, #1e4db7 30%, #1a8fc1 75%, #0ea5c9 100%)",
                }}>
                  {/* Geometric overlays */}
                  <div className="absolute" style={{
                    top: 0, right: 0, width: "55%", height: "60%",
                    background: "linear-gradient(210deg, rgba(56,189,248,0.22) 0%, transparent 65%)",
                    clipPath: "polygon(100% 0%, 100% 70%, 20% 100%, 0% 30%, 50% 0%)",
                  }} />
                  <div className="absolute inset-0" style={{
                    background: "linear-gradient(155deg, transparent 30%, rgba(255,255,255,0.04) 50%, transparent 70%)",
                  }} />
                  {/* Magnetic stripe */}
                  <div style={{ position: "absolute", top: "17%", left: 0, right: 0, height: "38px", background: "linear-gradient(180deg, #111 0%, #1a1a1a 50%, #0a0a0a 100%)" }} />
                  {/* Contact info */}
                  <div style={{ position: "absolute", top: "7%", left: "14px" }}>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "6.5px", lineHeight: 1.6 }}>Tel. +1 800 XXX XXXX (Toll-Free USA)</div>
                    <div style={{ color: "rgba(255,255,255,0.38)", fontSize: "6px" }}>WolvCapital Global Contact Center</div>
                  </div>
                  {/* Signature + CVV */}
                  <div style={{ position: "absolute", left: "14px", right: "14px", top: "46%" }}>
                    <div style={{ color: "rgba(255,255,255,0.48)", fontSize: "6.5px", textTransform: "uppercase", marginBottom: "3px" }}>
                      Authorised Signature - Not valid unless signed
                    </div>
                    <div style={{ display: "flex", alignItems: "stretch", borderRadius: "4px", overflow: "hidden", height: "30px" }}>
                      <div style={{ flex: 1, display: "flex", alignItems: "center", paddingLeft: "8px", background: "repeating-linear-gradient(90deg, #ddd 0px, #ddd 1px, #fff 1px, #fff 7px)" }}>
                        <span style={{ fontFamily: "cursive", color: "#aaa", fontSize: "10px", opacity: 0.55 }}>WolvCapital Online Banking</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 10px", background: "#fff", minWidth: "44px" }}>
                        <div style={{ fontFamily: "monospace", fontWeight: 700, color: "#111", fontSize: "13px", letterSpacing: "2px" }}>
                          {showCvv ? card.cvv : "•••"}
                        </div>
                        <div style={{ color: "#999", fontSize: "5.5px" }}>CVV/CVC</div>
                      </div>
                    </div>
                  </div>
                  {/* Fine print */}
                  <div style={{ position: "absolute", left: "14px", right: "14px", top: "67%" }}>
                    <div style={{ color: "rgba(255,255,255,0.42)", fontSize: "6px", lineHeight: 1.65 }}>
                      Issued by WolvCapital Global Services Ltd. Visa Infinite benefits apply.
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "5.5px", marginTop: "2px" }}>
                      www.wolvcapital.com
                    </div>
                  </div>
                  {/* VISA Infinite */}
                  <div style={{ position: "absolute", bottom: "10px", right: "14px", display: "flex", flexDirection: "column", alignItems: "flex-end", lineHeight: 1 }}>
                    <span style={{ color: "#fff", fontFamily: "serif", fontStyle: "italic", fontWeight: 900, fontSize: "17px" }}>VISA</span>
                    <span style={{ color: "rgba(255,255,255,0.58)", fontSize: "6.5px", letterSpacing: "2px" }}>Infinite</span>
                    <span style={{ color: "rgba(255,255,255,0.38)", fontSize: "5.5px", marginTop: "1px" }}>WOLVCAPITAL</span>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>

          <p className="text-center text-xs mb-5" style={{ color: "rgba(255,255,255,0.5)" }}>Tap card to flip</p>

          {/* Balance */}
          <div className="rounded-2xl border p-4 mb-5 flex justify-between items-center" style={{
            background: "linear-gradient(135deg, rgba(26,58,143,0.4) 0%, rgba(14,165,201,0.3) 100%)",
            borderColor: "rgba(0,168,150,0.3)",
          }}>
            <div>
              <div className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>Card Balance</div>
              <div className="text-2xl font-semibold" style={{ color: "#fff" }}>{money(Number(card.balance) || 0)}</div>
            </div>
            <div className="text-right">
              <div className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>Purchase Amount</div>
              <div className="text-lg font-semibold" style={{ color: "rgba(255,255,255,0.9)" }}>{money(Number(card.purchase_amount) || 0)}</div>
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
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                  borderColor: "rgba(255,255,255,0.08)",
                }}>
                <span className="text-2xl">{btn.icon}</span>
                <span className="text-xs font-semibold text-center" style={{ color: "rgba(255,255,255,0.8)" }}>{btn.label}</span>
              </button>
            ))}
          </div>

          {/* Copy rows */}
          <div className="rounded-2xl border overflow-hidden mb-5" style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
            borderColor: "rgba(255,255,255,0.08)",
          }}>
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
                className="w-full flex justify-between items-center px-5 py-4 transition-colors text-left"
                style={{
                  borderTop: i > 0 ? "1px solid rgba(255,255,255,0.08)" : "none",
                }}>
                <div>
                  <div className="text-xs uppercase tracking-wider mb-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {row.label} {row.secure && !securityUnlocked ? "🔐" : ""}
                  </div>
                  <div className="font-mono text-sm font-medium" style={{ color: "#fff" }}>{row.display}</div>
                </div>
                <span style={{ color: "rgba(255,255,255,0.5)" }}>{row.secure && !securityUnlocked ? "🔐" : "📋"}</span>
              </button>
            ))}
          </div>

          {securityUnlocked && (
            <button onClick={() => { lockDetails(); setShowCvv(false); setShowFull(false); }}
              className="w-full py-3 rounded-2xl border text-sm font-semibold transition-colors mb-4"
              style={{
                borderColor: "rgba(239,68,68,0.3)",
                color: "#ff6b6b",
                background: "rgba(239,68,68,0.1)",
              }}>
              🔒 Lock Card Details
            </button>
          )}

          <Link href="/dashboard" className="block text-center text-sm hover:underline mt-2" style={{ color: "rgba(0,168,150,0.8)" }}>
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
            <div className="w-full rounded-t-3xl p-6 pb-10"
              onClick={(e) => e.stopPropagation()}
              style={{ animation: "slideUp 0.3s ease", background: "linear-gradient(135deg, rgba(26,58,143,0.6) 0%, rgba(14,165,201,0.4) 100%)", borderTop: "1px solid rgba(0,168,150,0.3)" }}>
              <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: "rgba(255,255,255,0.2)" }} />
              <h3 className="text-lg font-bold mb-2" style={{ color: "#fff" }}>Freeze Card?</h3>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.6)" }}>Freezing blocks all transactions. You can unfreeze anytime.</p>
              <button onClick={handleFreeze} disabled={freezing}
                className="w-full py-4 rounded-2xl text-white font-semibold mb-3 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #00a896, #0f7a70)", boxShadow: "0 8px 20px rgba(0,168,150,0.3)" }}>
                {freezing ? "Processing..." : "Yes, Freeze Card"}
              </button>
              <button onClick={() => setShowFreezeModal(false)}
                className="w-full py-4 rounded-2xl border font-semibold"
                style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
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

function RequestCardView({ onRequested }: { onRequested: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRequest() {
    setLoading(true);
    try {
      const res = await apiFetch("/api/virtual-cards/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchase_amount: 1000 }),
      });
      if (!res.ok) throw new Error("Failed to request card");
      onRequested();
    } catch {
      setError("Failed to request card. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F2F9FF] flex items-center justify-center p-6">
      <div className="max-w-sm w-full text-center">
        <div className="text-6xl mb-4">💳</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Get Your Virtual Card</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">Activate a WolvCapital Visa virtual card for digital transactions worldwide.</p>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button onClick={handleRequest} disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0f1c30] to-[#00a896] text-white font-bold text-base disabled:opacity-60">
          {loading ? "Requesting..." : "Request Virtual Card"}
        </button>
        <Link href="/dashboard" className="block text-center text-sm text-blue-600 hover:underline mt-4">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

function PendingCardView({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="min-h-screen bg-[#F2F9FF] flex items-center justify-center p-6">
      <div className="max-w-sm w-full text-center">
        <div className="text-6xl mb-4">⏳</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Card Pending Approval</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">Your virtual card request is being reviewed. This usually takes 1-2 business days.</p>
        <button onClick={onRefresh}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0f1c30] to-[#00a896] text-white font-bold text-base">
          Refresh Status
        </button>
        <Link href="/dashboard" className="block text-center text-sm text-blue-600 hover:underline mt-4">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default function VirtualCardPage() {
  const { card, loading, error, refetch } = useVirtualCard();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"/>
    </div>
  );
  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-8 text-center">
      <p className="text-red-500">{error}</p>
    </div>
  );
  if (!card) return <RequestCardView onRequested={refetch} />;
  if (card.status === "pending") return <PendingCardView onRefresh={refetch} />;

  return <ActiveCardView card={card} refetch={refetch} />;
}