"use client";
import { useMemo, useState } from "react";

type FlipCardProps = {
  maxWidth?: number; // px
  aspectWidth?: number; // numerator (default 480)
  aspectHeight?: number; // denominator (default 300)
  animationMs?: number;
  perspective?: number; // px
  borderRadius?: number; // px
  shadow?: string; // CSS box-shadow
  initialFlipped?: boolean;
  className?: string;
};

export default function FlipCard({
  maxWidth = 480,
  aspectWidth = 480,
  aspectHeight = 300,
  animationMs = 800,
  perspective = 1000,
  borderRadius = 20,
  shadow = "0 10px 25px rgba(0, 0, 0, 0.3)",
  initialFlipped = false,
  className = "",
}: FlipCardProps) {
  const [flipped, setFlipped] = useState<boolean>(initialFlipped);
  const aspectCSS = useMemo(() => `${aspectWidth} / ${aspectHeight}`, [aspectWidth, aspectHeight]);
  const cssVars = useMemo(
    () => ({
      ['--max-width' as any]: `${maxWidth}px`,
      ['--aspect' as any]: aspectCSS,
      ['--duration' as any]: `${animationMs}ms`,
      ['--perspective' as any]: `${perspective}px`,
      ['--radius' as any]: `${borderRadius}px`,
      ['--shadow' as any]: shadow,
    }),
    [maxWidth, aspectCSS, animationMs, perspective, borderRadius, shadow]
  );

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setFlipped((f) => !f);
    }
  };

  return (
    <div className={`w-full flex items-center justify-center ${className}`}> 
      <style jsx>{`
        .flip-card { perspective: var(--perspective); max-width: var(--max-width); width: 100%; }
        .flip-outer { position: relative; width: 100%; aspect-ratio: var(--aspect); }
        .flip-inner { position: absolute; inset: 0; transform-style: preserve-3d; transition: transform var(--duration) ease; cursor: pointer; }
        .is-flipped { transform: rotateY(180deg); }
        .flip-face { position: absolute; inset: 0; backface-visibility: hidden; border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); }
        .flip-back { transform: rotateY(180deg); }
      `}</style>

      <div className="flip-card cursor-pointer" style={cssVars as React.CSSProperties}>
        <div className="flip-outer">
          <div
            className={`flip-inner ${flipped ? 'is-flipped' : ''}`}
            role="button"
            aria-pressed={flipped}
            aria-label={flipped ? "Click to flip card to front" : "Click to flip card to back"}
            tabIndex={0}
            onClick={() => setFlipped((f) => !f)}
            onKeyDown={onKeyDown}
          >
            <div className="flip-face" role="img" aria-label="Front of virtual Visa card">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 300">
                <defs>
                  <linearGradient id="bgGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1E5DF7" /><stop offset="100%" stopColor="#0A34B0" /></linearGradient>
                  <linearGradient id="chipGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#D4AF37" /><stop offset="100%" stopColor="#B8860B" /></linearGradient>
                  <linearGradient id="metallicText" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#E0E0E0" /><stop offset="50%" stopColor="#B0B0B0" /><stop offset="100%" stopColor="#F5F5F5" /></linearGradient>
                  <linearGradient id="visaGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1A1F71" /><stop offset="100%" stopColor="#F7B600" /></linearGradient>
                </defs>
                <rect width="480" height="300" rx="20" fill="url(#bgGradient)" />
                <text x="20" y="40" fill="url(#metallicText)" fontSize="22" fontFamily="Arial" fontWeight="bold" stroke="black" strokeOpacity="0.3" strokeWidth="0.4">WOLVCAPITAL LTD</text>
                <g transform="translate(40,90)">
                  <rect width="60" height="50" rx="6" fill="url(#chipGradient)" stroke="black" strokeWidth="1.2" />
                  <line x1="10" y1="0" x2="10" y2="50" stroke="black" strokeWidth="0.8" />
                  <line x1="30" y1="0" x2="30" y2="50" stroke="black" strokeWidth="0.8" />
                  <line x1="50" y1="0" x2="50" y2="50" stroke="black" strokeWidth="0.8" />
                  <line x1="0" y1="15" x2="60" y2="15" stroke="black" strokeWidth="0.8" />
                  <line x1="0" y1="35" x2="60" y2="35" stroke="black" strokeWidth="0.8" />
                </g>
                <path d="M120 95 q10 10 0 20 M130 90 q20 20 0 40 M140 85 q30 30 0 60" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <text x="40" y="190" fill="url(#metallicText)" fontSize="22" fontFamily="Courier New" fontWeight="bold" stroke="black" strokeOpacity="0.4" strokeWidth="0.5">4532 **** **** 7891</text>
                <text x="40" y="225" fill="url(#metallicText)" fontSize="14" fontFamily="Arial" fontWeight="bold" stroke="black" strokeOpacity="0.3" strokeWidth="0.4">CARD HOLDER</text>
                <text x="300" y="225" fill="url(#metallicText)" fontSize="14" fontFamily="Arial" fontWeight="bold" stroke="black" strokeOpacity="0.3" strokeWidth="0.4">12/28</text>
                <text x="350" y="270" fill="url(#visaGradient)" fontSize="38" fontFamily="Arial Black" fontWeight="bold">VISA</text>
              </svg>
            </div>
            <div className="flip-face flip-back" role="img" aria-label="Back of virtual Visa card">
              <div style={{ position: 'relative', zIndex: 2, color: '#fff', fontWeight: 'bold', fontSize: 18, padding: '16px 24px 0 24px' }}>
                Security Code
              </div>
              <div style={{ position: 'relative', zIndex: 2, color: '#fff', fontSize: 14, padding: '8px 24px 0 24px' }}>
                See above
              </div>
              <div style={{ position: 'relative', zIndex: 2, color: '#fff', fontSize: 14, padding: '8px 24px 0 24px' }}>
                For customer service:
              </div>
              <div style={{ position: 'relative', zIndex: 2, color: '#fff', fontSize: 14, padding: '8px 24px 0 24px' }}>
                support@wolvcapital.com
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 300">
                <rect width="480" height="300" rx="20" fill="url(#bgGradient)" />
                <rect x="0" y="40" width="480" height="50" fill="black" />
                <rect x="30" y="130" width="420" height="50" fill="white" />
                <text x="400" y="160" fill="black" fontSize="22" fontFamily="Courier New" fontWeight="bold">***</text>
                <text x="30" y="220" fill="white" fontSize="12" fontFamily="Arial" fontWeight="bold">WolvCapital Ltd · Customer Support +1-800-000-0000 · www.wolvcapital.com</text>
                <circle cx="420" cy="240" r="20" fill="url(#metallicText)" opacity="0.6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
