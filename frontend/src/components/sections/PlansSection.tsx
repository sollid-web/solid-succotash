'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { SectionHeader } from '@/components/ui/SectionHeader'

const plans = [
  {
    id: 'pioneer',
    name: 'Pioneer',
    sub: 'Conservative Strategy · 90-day term',
    duration: 'Contract term: 90 days from activation. This is a minimum holding period — funds are locked for the full term. Early withdrawal incurs a 2% exit fee deducted before return of capital. At term end, your account continues on a rolling monthly basis unless you withdraw or switch plans. You will be notified 7 days before your term ends.',
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
    withdrawal: 'Withdrawals available after 90-day term. Capital returned within 5 business days.',
    card: false,
    featured: false,
    withdrawalDetails: '90-day term - This is a minimum holding period. Early withdrawals before day 90 incur a 2% exit fee. At term end, your account continues on a rolling monthly basis unless you withdraw or switch plans. You will be notified 7 days before your term ends.',
  },
  {
    id: 'vanguard',
    name: 'Vanguard',
    sub: 'Balanced Strategy · 150-day term',
    duration: 'Contract term: 150 days from activation. This is a minimum holding period — funds are locked for the full term. Early withdrawal incurs a 2.5% exit fee deducted before return of capital. At term end, your account continues on a rolling monthly basis unless you withdraw or switch plans. You will be notified 7 days before your term ends.',
    fee: '1.25%',
    feeNote: 'annual management fee',
    features: [
      'Diversified top-10 crypto basket',
      'DeFi yield exposure',
      'Bi-weekly rebalancing',
      'Enhanced KYC verification',
      'Priority support + Virtual card access',
    ],
    min: '$1,000',
    withdrawal: 'Withdrawals available after 150-day term. Capital returned within 5 business days.',
    card: true,
    cardCost: '$1,000 one-time card setup',
    featured: true,
    withdrawalDetails: '150-day term - This is a minimum holding period. Early withdrawals before day 150 incur a 2.5% exit fee. At term end, your account continues on a rolling monthly basis unless you withdraw or switch plans. You will be notified 7 days before your term ends.',
  },
  {
    id: 'horizon',
    name: 'Horizon',
    sub: 'Active Management · 180-day term',
    duration: 'Contract term: 180 days from activation. This is a minimum holding period — funds are locked for the full term. Early withdrawal incurs a 3% exit fee deducted before return of capital. At term end, your account continues on a rolling monthly basis unless you withdraw or switch plans. You will be notified 7 days before your term ends.',
    fee: '1.5%',
    feeNote: 'annual fee + 20% performance fee on gains above benchmark',
    features: [
      'Actively managed multi-asset',
      'Derivatives risk overlay',
      'Weekly rebalancing',
      'Dedicated account manager',
      'Quarterly strategy reviews + Physical card eligible',
    ],
    min: '$5,000',
    withdrawal: 'Withdrawals available after 180-day term. Capital returned within 5 business days.',
    card: true,
    cardCost: 'Physical card: Requires additional identity verification',
    featured: false,
    withdrawalDetails: '180-day term - This is a minimum holding period. Early withdrawals before day 180 incur a 3% exit fee. At term end, your account continues on a rolling monthly basis unless you withdraw or switch plans. You will be notified 7 days before your term ends.',
  },
  {
    id: 'summit',
    name: 'Summit VIP',
    sub: 'Custom Mandate · 365-day term',
    duration: 'Contract term: 365 days from activation. This is a minimum holding period — funds are locked for the full term. Early withdrawal incurs a 3.5% exit fee deducted before return of capital. At term end, your account continues on a rolling quarterly basis unless you withdraw or switch plans. You will be notified 14 days before your term ends.',
    fee: '2%',
    feeNote: 'annual fee + negotiated performance fee',
    features: [
      'Bespoke investment mandate',
      'Custom risk parameters',
      'Institutional-grade reporting',
      'Dedicated compliance officer',
      'Direct investment team access + Physical card included',
    ],
    min: '$15,000',
    withdrawal: 'Withdrawals available after 365-day term. Capital returned within 5 business days.',
    card: true,
    cardCost: 'Physical card: Included at no extra cost',
    featured: false,
    withdrawalDetails: '365-day term - This is a minimum holding period. Early withdrawals before day 365 incur a 3.5% exit fee. At term end, your account continues on a rolling quarterly basis unless you withdraw or switch plans. You will be notified 14 days before your term ends.',
  },
]

export default function PlansSection() {
  return (
    <section id="plans" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow label */}
        <div className="text-center mb-4">
          <span className="text-[11px] font-bold tracking-widest text-[#0EA5E9] uppercase">
            Investment Tiers
          </span>
        </div>

        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4" style={{ letterSpacing: '-0.02em' }}>Choose your portfolio plan</h2>
          <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
            Each tier reflects a distinct risk strategy and fee structure — not a return promise. All fees are disclosed in full before account activation.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl p-8 transition-all duration-200 flex flex-col ${
                plan.featured
                  ? 'bg-white border-2 border-[#e2f5ff] shadow-xl' 
                  : 'bg-white border border-[#E2E8F0] shadow-md hover:shadow-lg hover:border-[#CBD5E1]'
              }`}
              style={plan.featured ? { boxShadow: '0 8px 32px rgba(15,23,42,0.12)' } : { boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
            >
              <h3 className="text-xl font-bold text-[#0F172A] mb-1">{plan.name}</h3>
              <p className="text-xs text-[#64748B] mb-4">{plan.sub}</p>
              
              {/* Contract term text box */}
              <div className="bg-[#F8FAFC] border-l-4 border-[#0EA5E9] px-4 py-3 rounded-r-md mb-6 text-xs text-[#475569] leading-relaxed">
                {plan.duration}
              </div>

              {/* Fee */}
              <div className="mb-6">
                <div className="text-5xl font-bold text-[#0F172A] leading-tight mb-1" style={{ letterSpacing: '-0.03em' }}>
                  {plan.fee}
                </div>
                <p className="text-xs text-[#64748B]">{plan.feeNote}</p>
              </div>

              {/* Minimum */}
              <p className="text-xs text-[#475569] mb-4">Minimum: <span className="font-bold text-[#0F172A]">{plan.min}</span></p>

              {/* Withdrawal info */}
              <p className="text-xs text-[#64748B] mb-6 pb-6 border-b border-[#E2E8F0]">{plan.withdrawal}</p>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="text-xs text-[#475569] flex items-start gap-3">
                    <span className="flex-shrink-0 text-[#0EA5E9] font-bold mt-1">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Card info if applicable */}
              {plan.card && (
                <div className="text-xs text-[#64748B] mb-6 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
                  {plan.cardCost}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 mb-4">
                <Link
                  href={`/plans/${plan.id}`}
                  className="flex-1 px-4 py-3 text-center text-sm font-medium text-[#475569] border border-[#CBD5E1] rounded-md hover:bg-[#F8FAFC] transition"
                >
                  Review
                </Link>
                <Link
                  href={`/accounts/signup?plan=${plan.id}`}
                  className="flex-1 px-4 py-3 text-center text-sm font-bold text-[#0F172A] bg-[#e2f5ff] rounded-md hover:bg-[#1E3A5F] transition"
                >
                  Get Started
                </Link>
              </div>

              {/* Risk Warning */}
              <div className="text-xs text-[#94A3B8] text-center">
                Digital assets are speculative. You may lose some or all of your invested capital.
              </div>
            </div>
          ))}
        </div>

        {/* Disclosure Note */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 text-center">
          <p className="text-xs text-[#64748B] leading-relaxed max-w-3xl mx-auto">
            <strong className="text-[#0F172A]">Fee disclosure:</strong> Management fees are charged as a percentage of AUM, deducted monthly. Performance fees apply only on gains exceeding the agreed benchmark. No guaranteed returns are offered. All fees are disclosed in writing before account activation. Digital assets are speculative — you may lose some or all of your capital.
          </p>
        </div>
      </div>
    </section>
  )
}
