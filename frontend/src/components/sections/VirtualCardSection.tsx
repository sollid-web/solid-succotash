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
    <section id="virtual-card" className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Card Visualization */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-xs">
              {/* Card */}
              <div
                className="w-full aspect-video rounded-2xl p-6 mb-6"
                style={{
                  background: 'linear-gradient(135deg, #1e5df7 0%, #0a34b0 100%)',
                  boxShadow: '0 20px 60px rgba(11, 47, 107, 0.35)',
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
              <div className="grid grid-cols-4 gap-3">
                {CARD_SERVICES.map((service, idx) => (
                  <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center hover:border-blue-600 hover:bg-blue-50 transition flex flex-col items-center justify-center gap-2 min-h-20">
                    {service.icon === null ? (
                      <div className="w-8 h-8 border-2 border-gray-400 rounded flex items-center justify-center text-gray-600 font-bold">
                        +
                      </div>
                    ) : (
                      <Image
                        src={service.icon}
                        alt={service.name}
                        width={32}
                        height={32}
                        className="max-w-[32px] max-h-[32px] object-contain"
                        unoptimized
                      />
                    )}
                    <div className="text-xs font-medium text-gray-700 line-clamp-2">{service.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-blue-600">Virtual Card</span>
            <h2 className="text-4xl font-bold text-[#0b2f6b] my-4">Pay bills directly from your dashboard</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Once your account is KYC-verified and activated, you can request a WolvCapital virtual Visa card linked directly to your portfolio balance. Use it to pay subscriptions, shop online, or connect to Apple Pay and Google Pay — all managed from your dashboard.
            </p>

            {/* Features List */}
            <ul className="space-y-3 mb-8">
              {FEATURES.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Disclaimer */}
            <div className="bg-gray-50 border-l-4 border-gray-300 p-4 mb-8 text-sm text-gray-600">
              Card issuance is subject to KYC verification, eligibility review, and partner programme availability. Card spending draws from your available portfolio balance. This is not a credit card — no credit is extended. Availability varies by country. Features and limits are disclosed at activation.
            </div>

            {/* CTA */}
            <Link
              href="/accounts/signup"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-sky-400 to-cyan-500 text-[#0b2f6b] font-bold rounded-full hover:opacity-90 transition"
            >
              Activate Your Card →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
