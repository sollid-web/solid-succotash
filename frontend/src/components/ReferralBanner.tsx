// components/ReferralBanner.tsx
import React from 'react'

export default function ReferralBanner({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <svg
        viewBox="0 0 900 500"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-labelledby="referralHeroTitle"
      >
        <title id="referralHeroTitle">WolvCapital referral hero</title>

        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0" stopColor="#0f172a" stopOpacity="1" />
            <stop offset="1" stopColor="#0ea5a4" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="g2" x1="0" x2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.06" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="900" height="500" fill="url(#g1)" rx="24" />

        <g transform="translate(60,40)" opacity="0.85">
          <path d="M0 120 C60 20, 240 -20, 360 40 C480 100, 620 160, 740 80 L740 220 L0 220 Z" fill="url(#g2)" />
        </g>

        <g transform="translate(560,220)" aria-hidden="true">
          <ellipse cx="120" cy="140" rx="120" ry="28" fill="#0ea5a4" opacity="0.18" />
          <g transform="translate(0,-40)">
            <ellipse cx="60" cy="60" rx="60" ry="18" fill="#ffd166" />
            <ellipse cx="60" cy="86" rx="60" ry="18" fill="#f7c948" opacity="0.95" />
            <ellipse cx="60" cy="112" rx="60" ry="18" fill="#f2b830" opacity="0.9" />
            <text x="60" y="78" textAnchor="middle" fontSize="14" fontWeight="700" fill="#09203f">WLV</text>
          </g>

          <g transform="translate(120,-18) scale(0.85)">
            <ellipse cx="60" cy="60" rx="60" ry="18" fill="#ffd166" />
            <ellipse cx="60" cy="86" rx="60" ry="18" fill="#f7c948" opacity="0.95" />
            <text x="60" y="78" textAnchor="middle" fontSize="13" fontWeight="700" fill="#09203f">+2.5%</text>
          </g>
        </g>

        <g transform="translate(60,160)">
          <text x="0" y="0" fill="#fff" fontSize="36" fontWeight="700" fontFamily="Inter, ui-sans-serif, system-ui, -apple-system">
            Earn when you invite investors
          </text>
          <text x="0" y="46" fill="#e6f3f2" fontSize="18" fontWeight="500" fontFamily="Inter, ui-sans-serif, system-ui, -apple-system">
            Get a commission when your referrals make their first qualifying deposit.
          </text>
        </g>

        <g transform="translate(60,300)">
          <rect x="0" y="-12" rx="12" ry="12" width="320" height="72" fill="#fff" opacity="0.06" />
          <text x="24" y="16" fill="#fff" fontSize="16" fontWeight="600">Share your link — grow your earnings</text>
          <rect x="240" y="-6" rx="8" ry="8" width="80" height="44" fill="#06b6d4" />
          <text x="280" y="24" textAnchor="middle" fill="#06283d" fontSize="14" fontWeight="700">Get started</text>
        </g>

        <g transform="translate(80,320)">
          <rect x="0" y="0" width="68" height="68" rx="12" fill="#fff" opacity="0.08" />
          <text x="34" y="42" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">Wallet</text>
        </g>

        <g transform="translate(160,320)">
          <rect x="0" y="0" width="68" height="68" rx="12" fill="#fff" opacity="0.08" />
          <text x="34" y="42" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">Share</text>
        </g>

        <g transform="translate(240,320)">
          <rect x="0" y="0" width="68" height="68" rx="12" fill="#fff" opacity="0.08" />
          <text x="34" y="42" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">Stats</text>
        </g>
      </svg>
    </div>
  )
}
