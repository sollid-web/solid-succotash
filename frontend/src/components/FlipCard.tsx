"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

type FlipCardProps = {
  cardNumber?: string;
  cardholderName?: string;
  expiryMonth?: string | number;
  expiryYear?: string | number;
  cvv?: string;
  showCvv?: boolean;
  showFull?: boolean;
  isFrozen?: boolean;
  maxWidth?: number;
  className?: string;
};

function maskNumber(num?: string) {
  if (!num || num.length < 4) return "•••• •••• •••• ••••";
  return "•••• •••• •••• " + num.slice(-4);
}

function formatExpiry(m?: string | number, y?: string | number) {
  if (!m || !y) return "••/••";
  return m.toString().padStart(2, "0") + "/" + y.toString();
}

export default function FlipCard({
  cardNumber,
  cardholderName,
  expiryMonth,
  expiryYear,
  cvv,
  showCvv = false,
  showFull = false,
  isFrozen = false,
  maxWidth = 420,
  className = "",
}: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);

  const displayNumber = showFull && cardNumber
    ? cardNumber.replace(/(.{4})/g, "$1 ").trim()
    : maskNumber(cardNumber);

  return (
    <div
      className={"w-full " + className}
      style={{ maxWidth, margin: "0 auto" }}
    >
      <div
        className="w-full cursor-pointer select-none"
        style={{ perspective: "1500px", aspectRatio: "1.586 / 1" }}
        onClick={() => { if (!isFrozen) setFlipped((f) => !f); }}
      >
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: "preserve-3d" }}
          initial={false}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          {/* FRONT */}
          <div
            className="absolute inset-0 rounded-[18px] overflow-hidden shadow-2xl flex flex-col p-6 text-white"
            style={{
              backfaceVisibility: "hidden",
              background: "linear-gradient(135deg, #0a2472 0%, #0e7490 50%, #1e3a8a 100%)",
            }}
          >
            {/* Metallic sheen */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
              style={{ background: "linear-gradient(45deg,transparent 45%,rgba(255,255,255,0.6) 50%,transparent 55%)" }} />

            {/* Header */}
            <div className="flex justify-between items-start z-10">
              <h1 className="text-xl font-bold tracking-tight drop-shadow-sm">
                <span className="font-normal">Wolv</span>Capital
              </h1>
              <div className="text-right leading-tight">
                <span className="text-xl font-extrabold italic block">VISA</span>
                <span className="text-[9px] uppercase tracking-[0.2em] opacity-80">Infinite</span>
              </div>
            </div>

            {/* Chip + Contactless */}
            <div className="mt-4 flex items-center gap-3 z-10">
              <div className="w-11 h-8 rounded-md shadow-inner relative overflow-hidden border border-yellow-600/30"
                style={{ background: "linear-gradient(135deg, #f0d060 0%, #d4af37 50%, #f0d060 100%)" }}>
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20">
                  {[...Array(9)].map((_, i) => <div key={i} className="border border-black/20" />)}
                </div>
              </div>
              <svg className="w-5 h-5 opacity-60" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.5 6.5c.28 0 .5.22.5.5v4c0 .28-.22.5-.5.5S9 11.28 9 11V7c0-.28.22-.5.5-.5zm5 0c.28 0 .5.22.5.5v4c0 .28-.22.5-.5.5S14 11.28 14 11V7c0-.28.22-.5.5-.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              </svg>
            </div>

            {/* Card Number */}
            <div className="mt-auto mb-3 z-10">
              <p className="text-lg tracking-[0.22em] font-mono drop-shadow-md">{displayNumber}</p>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end z-10">
              <div>
                <span className="text-[7px] uppercase tracking-widest opacity-60 block">Card Holder</span>
                <span className="text-xs font-semibold tracking-wide uppercase">{cardholderName || "CARD HOLDER"}</span>
              </div>
              <div className="text-center">
                <span className="text-[7px] uppercase tracking-widest opacity-60 block">Valid Thru</span>
                <span className="text-xs font-semibold tracking-widest">{formatExpiry(expiryMonth, expiryYear)}</span>
              </div>
              <div className="w-12 h-9 rounded-lg opacity-70"
                style={{ background: "linear-gradient(135deg, #93c5fd, #c4b5fd, #6ee7b7)" }} />
            </div>

            {isFrozen && (
              <div className="absolute inset-0 rounded-[18px] flex flex-col items-center justify-center gap-2"
                style={{ background: "rgba(10,11,15,0.75)", backdropFilter: "blur(4px)" }}>
                <span style={{ fontSize: 40 }}>❄️</span>
                <span style={{ color: "#93c5fd", fontWeight: 700, fontSize: 18, letterSpacing: 2 }}>CARD FROZEN</span>
              </div>
            )}
          </div>

          {/* BACK */}
          <div
            className="absolute inset-0 rounded-[18px] overflow-hidden shadow-2xl bg-gray-200 flex flex-col text-gray-800"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className="w-full h-10 bg-gray-900 mt-6" />
            <div className="px-6 mt-5">
              <div className="flex items-center">
                <div className="flex-1 h-9 bg-white border-y border-gray-300 flex items-center px-3 italic text-gray-400 text-xs font-serif">
                  Authorized Signature
                </div>
                <div className="w-16 h-9 bg-white border border-gray-300 flex items-center justify-center font-mono font-bold text-base">
                  {showCvv ? (cvv || "•••") : "•••"}
                </div>
              </div>
              <p className="text-[8px] mt-1 text-right font-semibold opacity-60">CVV</p>
            </div>
            <div className="mt-auto px-6 pb-4">
              <p className="text-[7px] leading-tight opacity-60">
                This card is issued by WolvCapital pursuant to a license from Visa U.S.A. Inc.
                Use of this card is subject to the terms and conditions of the Cardholder Agreement.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      <p className="text-center text-xs text-gray-400 mt-2">Tap card to flip</p>
    </div>
  );
}
