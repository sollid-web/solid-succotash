'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Check } from 'lucide-react'

const CARD_SERVICES = [
  { 
    name: 'Netflix',
    icon: '/icons/Netflix-Logo.wine.svg'
  },
  { 
    name: 'Spotify',
    icon: '/icons/Spotify-Logo.wine.svg'
  },
  { 
    name: 'Apple Pay',
    icon: '/icons/Apple_Pay-Logo.wine.svg'
  },
  { 
    name: 'Amazon',
    icon: '/icons/Amazon_(company)-Logo.wine.svg'
  },
  { 
    name: 'Google',
    icon: '/icons/Google-Logo.wine.svg'
  },
  { 
    name: 'Steam',
    icon: '/icons/Steam_(service)-Logo.wine(1).svg'
  },
  { 
    name: 'Shopify',
    icon: '/icons/Shopify-Logo.wine.svg'
  },
  { 
    name: '+100 more',
    icon: null
  },
]

const FEATURES = [
  'Instant virtual card issued on KYC approval',
  'Pay Netflix, Spotify, Apple, Amazon and 100+ merchants',
  'Connect to Apple Pay and Google Pay wallets',
  'Set custom spending limits per merchant category',
  'Real-time transaction notifications and dashboard tracking',
  'Freeze or unfreeze instantly from the app',
  'Physical card available for eligible verified accounts',
]

export default function VirtualCardSection() {
  return (
    <section id="virtual-card" className="relative py-24 bg-[#0F172A] overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0" 
        style={{ 
          backgroundImage: "url(/images/sections/card-bg.webp)", 
          backgroundSize: "cover", 
          backgroundPosition: "center",
          opacity: 0.05,
          zIndex: 0
        }} 
      />
      
      <div className="relative z-10 container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Card Visualization */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-xs">
              {/* Card */}
              <div
                className="w-full aspect-video rounded-2xl p-6 mb-8"
                style={{
                  background: 'linear-gradient(135deg, #1e5df7 0%, #0a34b0 100%)',
                  boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
                }}
              >
                {/* Chip */}
                <div className="w-10 h-8 rounded mb-6" style={{ background: 'linear-gradient(135deg, #d4af37, #b8860b)' }} />

                {/* Card Number */}
                <div className="font-mono text-sm text-white text-opacity-90 mb-4 tracking-widest">4532 •••• •••• 7891</div>

                {/* Bottom Row */}
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs text-white text-opacity-40 mb-1 uppercase tracking-widest">Card Holder</div>
                    <div className="text-sm text-white font-semibold">VERIFIED MEMBER</div>
                  </div>
                  <div>
                    <div className="text-xs text-white text-opacity-40 mb-1 uppercase tracking-widest">Expires</div>
                    <div className="text-sm text-white font-semibold">12/28</div>
                  </div>
                  <div className="text-lg font-bold text-yellow-400" style={{ letterSpacing: '-1px' }}>
                    VISA
                  </div>
                </div>
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                {CARD_SERVICES.map((service, idx) => (
                  <div 
                    key={idx} 
                    className="rounded-lg p-4 text-center hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center gap-3 min-h-28 cursor-pointer"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    {service.icon === null ? (
                      <div className="w-12 h-12 border-2 border-white border-opacity-30 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        +
                      </div>
                    ) : (
                      <Image
                        src={service.icon}
                        alt={service.name}
                        width={48}
                        height={48}
                        className="max-w-[48px] max-h-[48px] object-contain"
                        unoptimized
                      />
                    )}
                    <div className="text-xs font-semibold text-white text-opacity-80 line-clamp-2 leading-tight">{service.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <span className="text-[11px] font-bold tracking-widest text-[#0EA5E9] uppercase block mb-4">Virtual Card</span>
            <h2 className="text-4xl font-bold text-white my-4" style={{ letterSpacing: '-0.02em' }}>Pay bills directly from your dashboard</h2>
            <p className="text-[#CBD5E1] text-lg leading-relaxed mb-8">
              Once your account is KYC-verified and activated, you can request a WolvCapital virtual Visa card linked directly to your portfolio balance. Use it to pay subscriptions, shop online, or connect to Apple Pay and Google Pay — all managed from your dashboard.
            </p>

            {/* Features List */}
            <ul className="space-y-3 mb-8">
              {FEATURES.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#0EA5E9] flex-shrink-0 mt-0.5" />
                  <span className="text-[#E2E8F0] text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Disclaimer */}
            <div className="border-l-4 border-[#0EA5E9] p-4 mb-8 text-sm text-[#CBD5E1]" style={{ background: 'rgba(14, 165, 233, 0.08)' }}>
              The WolvCapital virtual card is currently available to verified residents of supported countries only. A full list of supported countries is available at activation. Residents of unsupported regions may register their interest via the waitlist.
            </div>

            {/* CTA */}
            <Link
              href="/accounts/signup"
              className="inline-flex items-center px-8 py-3 bg-white text-[#0F172A] font-semibold rounded-md hover:bg-gray-100 transition"
            >
              Activate Your Card →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
