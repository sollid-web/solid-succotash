'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

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
  if (!num || num.length < 4) return '•••• •••• •••• ••••';
  return '•••• •••• •••• ' + num.slice(-4);
}

function formatExpiry(m?: string | number, y?: string | number) {
  if (!m || !y) return '••/••';
  return m.toString().padStart(2, '0') + '/' + y.toString();
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
  className = '',
}: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);

  const displayNumber =
    showFull && cardNumber
      ? cardNumber.replace(/(.{4})/g, '$1 ').trim()
      : maskNumber(cardNumber);

  return (
    <div className={'w-full ' + className} style={{ maxWidth, margin: '0 auto' }}>
      <div
        className="w-full cursor-pointer select-none"
        style={{ perspective: '1500px', aspectRatio: '1.586 / 1' }}
        onClick={() => { if (!isFrozen) setFlipped((f) => !f); }}
      >
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: 'preserve-3d' }}
          initial={false}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          {/* FRONT */}
          <div
            className="absolute inset-0 rounded-[18px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <Image
              src="/assets/cards/wolv-premium-front.webp"
              alt="WolvCapital Visa Infinite"
              fill
              priority
              className="object-cover object-top"
            />
            <div className="absolute inset-0 flex flex-col justify-end pb-[7%] px-[6%]">
              <div className="mb-[4%]">
                <p
                  className="font-mono text-white drop-shadow-md"
                  style={{ fontSize: 'clamp(14px, 3.8vw, 22px)', letterSpacing: '0.22em', fontWeight: 500, textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}
                >
                  {displayNumber}
                </p>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <span className="block uppercase text-white/60" style={{ fontSize: 'clamp(6px, 1.4vw, 9px)', letterSpacing: '0.18em' }}>Card Holder</span>
                  <span className="block uppercase text-white font-semibold tracking-wider" style={{ fontSize: 'clamp(11px, 2.5vw, 15px)', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                    {cardholderName || 'CARD HOLDER'}
                  </span>
                </div>
                <div className="text-center">
                  <span className="block uppercase text-white/60" style={{ fontSize: 'clamp(6px, 1.4vw, 9px)', letterSpacing: '0.18em' }}>Valid Thru</span>
                  <span className="block text-white font-semibold font-mono" style={{ fontSize: 'clamp(12px, 2.8vw, 16px)', letterSpacing: '0.12em', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                    {formatExpiry(expiryMonth, expiryYear)}
                  </span>
                </div>
                <div style={{ width: 'clamp(48px, 10%, 72px)' }} />
              </div>
            </div>
            {isFrozen && (
              <div className="absolute inset-0 rounded-[18px] flex flex-col items-center justify-center gap-2" style={{ background: 'rgba(5,10,20,0.78)', backdropFilter: 'blur(5px)' }}>
                <span style={{ fontSize: 44 }}>❄️</span>
                <span style={{ color: '#93c5fd', fontWeight: 700, fontSize: 20, letterSpacing: 3 }}>CARD FROZEN</span>
              </div>
            )}
          </div>

          {/* BACK */}
          <div
            className="absolute inset-0 rounded-[18px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <Image
              src="/assets/cards/wolv-premium-back.webp"
              alt="WolvCapital Visa Infinite — back"
              fill
              className="object-cover object-top"
            />
            <div className="absolute flex items-center justify-center z-10" style={{ top: '40%', right: '21%', width: '9%', height: '9%' }}>
              <span className="font-mono font-bold text-gray-900" style={{ fontSize: 'clamp(13px, 2.8vw, 18px)', letterSpacing: '0.12em' }}>
                {showCvv ? (cvv || '•••') : '•••'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
      <p className="text-center text-xs text-gray-400 mt-2">Tap card to flip</p>
    </div>
  );
}
