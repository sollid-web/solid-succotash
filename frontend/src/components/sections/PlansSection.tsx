'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { SectionHeader } from '@/components/ui/SectionHeader'

const plans = [
  {
    id: 'pioneer',
    name: 'Pioneer',
    sub: 'Conservative Strategy · 90 days',
    fee: '1%',
    feeNote: 'annual management fee',
    features: [
      'BTC & ETH allocation only',
      'Low volatility positioning',
      'Monthly rebalancing',
      'Standard KYC verification',
      'Email & chat support',
    ],
    min: '$100',
  },
  {
    id: 'vanguard',
    name: 'Vanguard',
    sub: 'Balanced Strategy · 150 days',
    fee: '1.25%',
    feeNote: 'annual management fee',
    featured: true,
    badge: 'Most Popular',
    features: [
      'Diversified top-10 crypto basket',
      'DeFi yield exposure',
      'Bi-weekly rebalancing',
      'Enhanced KYC verification',
      'Priority support',
    ],
    min: '$1,000',
  },
  {
    id: 'horizon',
    name: 'Horizon',
    sub: 'Active Management · 180 days',
    fee: '1.5%',
    feeNote: 'annual fee + 20% performance fee',
    features: [
      'Actively managed multi-asset',
      'Derivatives risk overlay',
      'Weekly rebalancing',
      'Dedicated account manager',
      'Quarterly strategy reviews',
    ],
    min: '$5,000',
  },
  {
    id: 'summit',
    name: 'Summit VIP',
    sub: 'Custom Mandate · 365 days',
    fee: '2%',
    feeNote: 'annual fee + negotiated performance fee',
    features: [
      'Bespoke investment mandate',
      'Custom risk parameters',
      'Institutional-grade reporting',
      'Dedicated compliance officer',
      'Direct investment team access',
    ],
    min: '$15,000',
  },
]

export default function PlansSection() {
  return (
    <section id="plans" className="py-12 md:py-20 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Choose your portfolio plan</h2>
          <p className="text-lg text-blue-100 max-w-2xl">
            Each tier reflects a distinct risk strategy and fee structure — not a return promise. All fees are disclosed in full before account activation.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 transition-all duration-200 ${
                plan.featured
                  ? 'bg-white/9 border border-t-4 border-t-sky-400 border-sky-400/50 hover:bg-white/12'
                  : 'bg-white/5 border border-white/10 hover:bg-white/8'
              }`}
            >
              {plan.badge && (
                <Badge variant="plan" className="mb-4 text-xs">
                  {plan.badge}
                </Badge>
              )}

              <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
              <p className="text-sm text-white/40 mb-4">{plan.sub}</p>

              <div className="mb-6">
                <div className="text-4xl font-bold text-blue-100 leading-tight mb-1">{plan.fee}</div>
                <p className="text-xs text-white/30">{plan.feeNote}</p>
              </div>

              <p className="text-xs text-white/30 mb-6">Minimum: {plan.min}</p>

              <ul className="space-y-1 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="text-xs text-white/65 flex items-start gap-2 pb-1 border-b border-white/5">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-sky-400 mt-1" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="flex gap-2">
                <Link
                  href={`/plans/${plan.id}`}
                  className="flex-1 px-3 py-2 text-center text-xs font-semibold text-white/75 border border-white/18 rounded-xl hover:bg-white/7 transition"
                >
                  Review
                </Link>
                <Link
                  href={`/accounts/signup?plan=${plan.id}`}
                  className="flex-1 px-3 py-2 text-center text-xs font-bold text-brand-primary bg-gradient-to-r from-sky-400 to-sky-500 rounded-xl hover:opacity-90 transition"
                >
                  Get Started
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Plans Note */}
        <div className="bg-white/10 border border-white/10 rounded-xl p-6 text-center">
          <p className="text-xs text-white/30 leading-relaxed">
            <strong className="text-white/50">Fee disclosure:</strong> Management fees are charged as a percentage of AUM, deducted monthly. Performance fees apply only on gains exceeding the agreed benchmark. No guaranteed returns are offered. All fees are disclosed in writing before account activation. Digital assets are speculative — you may lose some or all of your capital.
          </p>
        </div>
      </div>
    </section>
  )
}
