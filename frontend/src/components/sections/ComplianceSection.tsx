'use client'

import Link from 'next/link'

const BENEFITS = [
  'Identity verified before any funds accepted',
  'Funds held by a licensed institutional custodian — not WolvCapital directly',
  'All fees disclosed in writing before you invest',
  'No guaranteed or promised investment returns',
  'Audited monthly performance reports provided',
  'Withdrawal terms disclosed upfront — no hidden locks',
  'All transactions reviewed by our compliance team',
]

export default function ComplianceSection() {
  return (
    <section id="compliance" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-16 max-w-3xl">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#2A52BE] block mb-4">
            Compliance Overview
          </span>
          <h2 className="text-3xl font-semibold text-[#0F172A] leading-tight sm:text-4xl md:text-5xl" style={{ letterSpacing: '-0.02em' }}>
            What this means for you
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-700">
            WolvCapital combines institutional compliance, transparent disclosures, and licensed custody to give investors a clear, professional foundation for digital asset investing.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[45%_55%] items-start max-w-[1200px] mx-auto">
          <div className="overflow-hidden rounded-[14px] bg-slate-100 shadow-2xl">
            <img
              src="/compliance-ecosystem.png"
              alt="Compliance ecosystem visual"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="bg-[#2A52BE] rounded-[14px] p-8 lg:p-12 text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            <div className="mb-8">
              <p className="text-[15px] font-medium uppercase tracking-[0.26em] text-[#D6E8FF]">
                Secure, audited, and transparent
              </p>
              <h3 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                A compliance-first framework built for investor confidence
              </h3>
            </div>

            <p className="mb-8 text-[15px] leading-7 text-[#E2E8F0]">
              Every step of our onboarding and investment process is designed to meet institutional standards while keeping you informed and protected.
            </p>

            <ul className="space-y-4 mb-10">
              {BENEFITS.map((benefit, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#E2F5FF] text-[#2A52BE] text-sm font-semibold">
                    ✓
                  </span>
                  <span className="text-[15px] leading-7 text-white">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href="/legal-disclaimer"
              className="inline-flex min-h-[44px] items-center justify-center rounded-[7px] bg-white px-6 py-3 text-sm font-semibold text-[#2A52BE] transition hover:bg-slate-100"
            >
              Read More
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
