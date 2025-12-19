import Link from 'next/link'
import Image from 'next/image'
import RiskDisclaimer from '@/components/RiskDisclaimer'

export const metadata = {
  title: 'Investment Plans — WolvCapital',
  description:
    'Review WolvCapital investment plan structures, eligibility, and key terms. Educational information only—no guarantees or predictions.',
  openGraph: {
    title: 'Investment Plans — WolvCapital',
    description: 'Plan structures • Eligibility • Key terms (no guarantees)',
    images: ['/og-images/plans-og.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Investment Plans — WolvCapital',
    description: 'Plan structures • Eligibility • Key terms (no guarantees)',
    images: ['/og-images/plans-og.png'],
  },
}

const PLANS = [
  {
    key: 'pioneer',
    name: 'Pioneer',
    summary: 'A structured option for getting familiar with the platform and workflow.',
    fit: 'Best for: first-time investors and smaller allocations.',
    details: [
      'Eligibility and limits apply; review plan terms before requesting.',
      'Funding and withdrawals follow verification and manual review.',
      'Performance varies with market conditions; no guarantees.',
      'Ongoing monitoring and reporting available in your dashboard.',
    ],
    ctaLabel: 'Review plan',
    href: '/plans/pioneer',
  },
  {
    key: 'vanguard',
    name: 'Vanguard',
    summary: 'Designed for investors who prefer a balanced structure and clear plan terms.',
    fit: 'Best for: investors seeking a mid-range plan structure.',
    details: [
      'Plan terms and eligibility are defined up front for clarity.',
      'Requests are subject to compliance checks and manual approval.',
      'Digital assets are volatile; outcomes can be positive or negative.',
      'Account activity is logged for transparency and audit support.',
    ],
    ctaLabel: 'Review plan',
    href: '/plans/vanguard',
  },
  {
    key: 'horizon',
    name: 'Horizon',
    summary: 'A longer-term structure for investors who want defined terms and oversight.',
    fit: 'Best for: experienced investors with higher allocations.',
    details: [
      'All activity is reviewed under platform policies and disclosures.',
      'Withdrawals may require additional verification depending on context.',
      'No predictions, signals, or guaranteed outcomes are provided.',
      'You can track plan status and records in your dashboard.',
    ],
    ctaLabel: 'Review plan',
    href: '/plans/horizon',
  },
  {
    key: 'summit',
    name: 'Summit',
    summary: 'A premium structure intended for larger, more complex allocations.',
    fit: 'Best for: high-allocation investors seeking a structured workflow.',
    details: [
      'Designed for investors who require a higher-touch, documented process.',
      'Enhanced verification and review may apply.',
      'Market conditions can change rapidly; no guarantees.',
      'Support is available for understanding terms and requirements.',
    ],
    ctaLabel: 'Review plan',
    href: '/plans/summit',
  },
] as const

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-white relative">
      {/* spacer for fixed global NavBar */}
      <div className="h-20" />

      {/* Hero Section */}
      <section className="relative w-full min-h-[320px] sm:min-h-[360px] md:min-h-[420px] flex items-center justify-center mb-8 mt-24 overflow-hidden rounded-3xl shadow-xl">
        <Image
          src="/images/plans-hero.jpg"
          alt="WolvCapital Investment Plans Hero"
          fill
          priority
          className="object-cover object-center w-full h-full absolute inset-0 z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30 z-10" />
        <div className="relative z-20 w-full text-center px-4 py-12 sm:py-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-2xl mb-4 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_80%)]">
            Investment Plans
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white drop-shadow-xl mb-4 [text-shadow:_1px_1px_3px_rgb(0_0_0_/_70%)]">
            Understand the structure, terms, and review process before you decide.
          </p>
          <p className="text-base sm:text-lg md:text-xl text-white/95 drop-shadow-lg mt-2 max-w-2xl mx-auto [text-shadow:_1px_1px_2px_rgb(0_0_0_/_60%)]">
            This page provides educational information about plan structures, eligibility, and key terms. Digital assets are volatile and outcomes are not guaranteed.
          </p>
        </div>
      </section>

      {/* OG Image Display Below Hero */}
      <div className="w-full flex justify-center items-center mb-8">
        <Image
          src="/og-images/plans-og.png"
          alt="WolvCapital Investment Plans – OpenGraph image"
          width={1200}
          height={630}
          priority
          className="rounded-2xl shadow-xl w-full max-w-2xl h-auto object-cover object-center border-4 border-blue-100"
        />
      </div>

      {/* Intro */}
      <section className="py-10 sm:py-14 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0b2f6b]">How plans work</h2>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl bg-white border border-gray-200 p-4">
                <div className="text-sm font-semibold text-gray-800">1) Review</div>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                  Read the plan terms and disclosures. Choose what fits your goals and risk tolerance.
                </p>
              </div>
              <div className="rounded-xl bg-white border border-gray-200 p-4">
                <div className="text-sm font-semibold text-gray-800">2) Request</div>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                  Submit a request from your account. Eligibility checks and verification may apply.
                </p>
              </div>
              <div className="rounded-xl bg-white border border-gray-200 p-4">
                <div className="text-sm font-semibold text-gray-800">3) Oversight</div>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                  All investment activity is subject to manual review. You can monitor status and records in your dashboard.
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs sm:text-sm text-gray-500">
              No hype, no urgency. Please take the time you need to review terms before making any request.
            </p>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b2f6b]">Plans, explained simply</h2>
              <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-3xl mx-auto">
                Choose a plan structure, then review the specific terms. This page avoids performance claims and focuses on process and transparency.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {PLANS.map((plan) => (
                <div key={plan.key} className="rounded-2xl border border-gray-200 bg-white p-5">
                  <div className="text-sm font-bold text-[#0b2f6b] uppercase tracking-wider">{plan.name}</div>
                  <p className="mt-2 text-sm text-gray-700 leading-relaxed">{plan.summary}</p>
                  <p className="mt-3 text-xs text-gray-500">{plan.fit}</p>

                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-semibold text-[#0b2f6b] underline underline-offset-4 hover:no-underline">
                      View details
                    </summary>
                    <ul className="mt-3 space-y-2 text-sm text-gray-600">
                      {plan.details.map((line) => (
                        <li key={line} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gray-300" aria-hidden="true" />
                          <span className="flex-1">{line}</span>
                        </li>
                      ))}
                    </ul>
                  </details>

                  <div className="mt-5">
                    <Link
                      href={plan.href}
                      className="inline-flex w-full items-center justify-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-[#0b2f6b] hover:border-gray-300 hover:text-[#2563eb] transition"
                    >
                      {plan.ctaLabel}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <RiskDisclaimer className="mt-10" />
          </div>
        </div>
      </section>

    </div>
  )
}