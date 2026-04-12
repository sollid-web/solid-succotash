'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'

interface HeroSectionProps {
  onPlansClick?: () => void
}

export default function HeroSection({ onPlansClick }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden flex items-center min-h-[80vh] py-24 bg-slate-950">
      {/* Mesh Gradient Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: '#f8fbff',
          backgroundImage: 'radial-gradient(at 0% 0%, rgba(52, 183, 217, 0.3) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(15, 23, 42, 0.1) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(52, 183, 217, 0.2) 0px, transparent 50%)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          opacity: 1,
          zIndex: 0,
        }}
      />

      {/* Subtle Node/Network Overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-10 z-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
        <defs>
          <pattern id="network" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            <circle cx="50" cy="50" r="2" fill="#00204a" />
            <circle cx="100" cy="100" r="2" fill="#00204a" />
            <circle cx="150" cy="75" r="2" fill="#00204a" />
            <circle cx="75" cy="150" r="2" fill="#00204a" />
            <line x1="50" y1="50" x2="100" y2="100" stroke="#00204a" strokeWidth="0.5" />
            <line x1="100" y1="100" x2="150" y2="75" stroke="#00204a" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="1200" height="800" fill="url(#network)" />
      </svg>
      
      {/* Content Container with Glassmorphism */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 lg:px-20 w-full">
        <div className="relative backdrop-blur-xl bg-white/40 border border-white/20 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl shadow-slate-900/10">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-16 items-center">
            {/* Left column (60%): Text */}
            <div className="lg:col-span-3">
              {/* Eyebrow label */}
              <div className="mb-4">
                <span className="text-[11px] font-bold tracking-widest text-slate-900 uppercase opacity-80">
                  Institutional-Grade Digital Asset Management
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl lg:text-6xl font-bold leading-[1.15] mb-6 text-slate-900 tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                Managed cryptocurrency portfolios. Fixed fees. No guaranteed returns.
              </h1>

              {/* Subheadline */}
              <p className="text-lg text-slate-900 leading-[1.65] max-w-xl mb-10" style={{ marginTop: '20px' }}>
                WolvCapital provides managed exposure to digital assets through a transparent fee structure and institutional custody. Capital is at risk. Past performance does not predict future results.
              </p>

              {/* CTA Row */}
              <div className="flex flex-col sm:flex-row items-start gap-4 mb-10 w-full sm:w-auto">
                <Link
                  href="/#plans"
                  onClick={(e) => {
                    if (onPlansClick) {
                      e.preventDefault()
                      onPlansClick()
                    }
                  }}
                  className="w-full sm:w-auto my-2 px-8 py-3.5 bg-[#34B7D9] text-white rounded-lg font-bold text-sm hover:bg-[#2ca0b5] hover:brightness-110 transition-all shadow-lg hover:shadow-xl"
                >
                  View Portfolio Plans
                </Link>
                <Link
                  href="/compliance"
                  className="w-full sm:w-auto my-2 px-8 py-3.5 border-2 border-[#34B7D9] bg-transparent text-slate-900 rounded-lg font-semibold text-sm hover:bg-slate-100 transition-all"
                >
                  Read Full Disclosure →
                </Link>
              </div>

              {/* Trust strip */}
              <div className="flex flex-wrap items-center gap-2 text-[12px] text-slate-700 uppercase font-semibold tracking-widest opacity-75">
                <span>256-bit Encryption</span>
                <span>|</span>
                <span>Institutional Custody</span>
                <span>|</span>
                <span>FinCEN Registered MSB</span>
              </div>
            </div>

            {/* Right column (40%): Card */}
            <div className="hidden lg:col-span-2 lg:flex">
              <div className="w-full backdrop-blur-sm bg-white/80 border border-white/40 rounded-2xl p-8 shadow-lg">
                {/* Card header */}
                <p className="text-[10px] font-bold tracking-widest text-slate-700 uppercase mb-6 pb-4 border-b border-slate-200">
                  Platform at a glance
                </p>
                
                {/* Data rows */}
                <div className="space-y-0">
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-xs text-slate-600">Management fee</span>
                    <span className="text-sm font-bold text-slate-900">1–2% annually</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-xs text-slate-600">Performance fee</span>
                    <span className="text-sm font-bold text-slate-900">20% above benchmark</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-xs text-slate-600">Minimum investment</span>
                    <span className="text-sm font-bold text-slate-900">$100</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-xs text-slate-600">Asset custody</span>
                    <span className="text-sm font-bold text-slate-900">Institutional-grade</span>
                  </div>
                </div>

                {/* Footer text */}
                <p className="mt-4 text-xs text-slate-600 leading-relaxed">
                  Returns vary with market conditions and are not guaranteed. See fee schedule for full details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
