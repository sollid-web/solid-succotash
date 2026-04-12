'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'

interface HeroSectionProps {
  onPlansClick?: () => void
}

export default function HeroSection({ onPlansClick }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden flex items-center min-h-[80vh] py-24 bg-white">
      {/* Background image */}
      <div 
        className="absolute inset-0" 
        style={{ 
          backgroundImage: "url(/images/hero/hero-bg.webp)", 
          backgroundSize: "cover", 
          backgroundPosition: "center",
          opacity: 0.08,
          zIndex: 0
        }} 
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-12 lg:px-20 w-full">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left column (60%): Text */}
          <div className="lg:col-span-3">
            {/* Eyebrow label */}
            <div className="mb-4">
              <span className="text-[11px] font-bold tracking-widest text-brand-primary uppercase">
                Regulated Digital Asset Management
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-6xl font-bold leading-[1.15] mb-6 text-[#0F172A] tracking-tight" style={{ letterSpacing: '-0.02em' }}>
              Managed cryptocurrency portfolios. Fixed fees. No guaranteed returns.
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-[#64748B] leading-[1.65] max-w-xl mb-9" style={{ marginTop: '20px' }}>
              WolvCapital provides managed exposure to digital assets through a transparent fee structure and institutional custody. Capital is at risk. Past performance does not predict future results.
            </p>

            {/* CTA Row */}
            <div className="flex flex-col sm:flex-row items-start gap-6 mb-10">
              <Link
                href="/#plans"
                onClick={(e) => {
                  if (onPlansClick) {
                    e.preventDefault()
                    onPlansClick()
                  }
                }}
                className="px-7 py-3.5 bg-brand-primary text-white rounded-md font-semibold text-sm hover:bg-[#1E3A5F] transition-colors"
              >
                View Portfolio Plans
              </Link>
              <Link
                href="/compliance"
                className="text-sm font-medium text-brand-primary hover:underline"
              >
                Read Full Disclosure →
              </Link>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#94A3B8] uppercase font-semibold tracking-widest">
              <span>256-bit Encryption</span>
              <span>|</span>
              <span>Institutional Custody</span>
              <span>|</span>
              <span>FinCEN Registered MSB</span>
            </div>
          </div>

          {/* Right column (40%): Card */}
          <div className="hidden lg:col-span-2 lg:flex">
            <div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-8 shadow-md">
              {/* Card header */}
              <p className="text-[10px] font-bold tracking-widest text-[#94A3B8] uppercase mb-6 pb-4 border-b border-[#E2E8F0]">
                Platform at a glance
              </p>
              
              {/* Data rows */}
              <div className="space-y-0">
                <div className="flex justify-between items-center py-2.5 border-b border-[#F1F5F9]">
                  <span className="text-xs text-[#64748B]">Management fee</span>
                  <span className="text-sm font-bold text-[#0F172A]">1–2% annually</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-[#F1F5F9]">
                  <span className="text-xs text-[#64748B]">Performance fee</span>
                  <span className="text-sm font-bold text-[#0F172A]">20% above benchmark</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-[#F1F5F9]">
                  <span className="text-xs text-[#64748B]">Minimum investment</span>
                  <span className="text-sm font-bold text-[#0F172A]">$100</span>
                </div>
                <div className="flex justify-between items-center py-2.5">
                  <span className="text-xs text-[#64748B]">Asset custody</span>
                  <span className="text-sm font-bold text-[#0F172A]">Institutional-grade</span>
                </div>
              </div>

              {/* Footer text */}
              <p className="mt-4 text-xs text-[#94A3B8] leading-relaxed">
                Returns vary with market conditions and are not guaranteed. See fee schedule for full details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
