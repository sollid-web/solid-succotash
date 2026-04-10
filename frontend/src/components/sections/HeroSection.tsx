'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

interface HeroSectionProps {
  onPlansClick?: () => void
}

export default function HeroSection({ onPlansClick }: HeroSectionProps) {
  return (
    <section className="relative min-h-[calc(100vh-160px)] md:min-h-[calc(100vh-140px)] bg-brand-primary overflow-hidden flex items-center">
      {/* Background pattern/gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary opacity-20" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-0">
        <div className="grid lg:grid-cols-7 gap-10 lg:gap-12 items-center">
          {/* Left column: Text */}
          <div className="lg:col-span-4 text-white">
            <Badge variant="hero" className="mb-6">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              Secure • Transparent • KYC-Verified
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              A disciplined, transparent way to grow your digital assets
            </h1>

            <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed max-w-md">
              WolvCapital offers professionally managed cryptocurrency portfolios for retail and high-net-worth investors. Transparent fees, real risk controls, no guaranteed return promises.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                variant="cta-sky" 
                size="lg" 
                onClick={onPlansClick}
                className="text-base font-bold hover:scale-105"
              >
                Explore Portfolio Plans →
              </Button>
              <Button 
                variant="cta-sky" 
                size="lg" 
                asLink 
                href="/accounts/signup"
                className="text-base font-bold hover:scale-105"
              >
                Create Free Account
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2 text-sm text-blue-100">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                256-bit encryption
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-100">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                </svg>
                Institutional custody
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-100">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 6v6l4 2" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
                Real-time risk monitoring
              </div>
            </div>

            {/* Fine print */}
            <p className="text-xs text-blue-200/60 max-w-md leading-relaxed">
              Management fees: 1–2% annually. Performance fees apply only on gains above benchmark. No guaranteed returns. Digital assets are speculative and can lose value.
            </p>
          </div>

          {/* Right column: Card (desktop only) */}
          <div className="hidden lg:col-span-3 lg:flex">
            <div className="w-full bg-white/5 border border-white/12 backdrop-blur-lg rounded-2xl p-8">
              <p className="text-xs uppercase tracking-widest font-bold text-white/45 mb-6">Platform at a glance</p>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/6">
                  <span className="text-xs text-white/45">Fee structure</span>
                  <span className="text-sm font-bold text-white">1–2% annual AUM</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/6">
                  <span className="text-xs text-white/45">Performance fee</span>
                  <span className="text-sm font-bold text-white">20% above benchmark</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/6">
                  <span className="text-xs text-white/45">Minimum investment</span>
                  <span className="text-sm font-bold text-white">$100</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/6">
                  <span className="text-xs text-white/45">Countries supported</span>
                  <span className="text-sm font-bold text-white">120+</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs text-white/45">Asset custody</span>
                  <span className="text-sm font-bold text-white">Institutional-grade</span>
                </div>
              </div>

              <p className="mt-6 text-xs text-white/28 leading-relaxed">
                All figures are operational disclosures. Returns vary with market conditions and are not guaranteed. See our fee schedule for full details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
