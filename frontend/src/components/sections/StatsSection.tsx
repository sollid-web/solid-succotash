'use client'

import Link from 'next/link'

export default function StatsSection() {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Label */}
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-6">
              Platform Metrics — Pending Third-Party Audit
            </p>
          </div>

          {/* Stats Block */}
          <div className="bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl p-8 md:p-12 text-center">
            <p className="text-lg text-gray-700 italic leading-relaxed">
              Audited platform metrics will be published upon completion of our independent third-party audit. Expected Q3 2026.
            </p>
          </div>

          {/* Supporting text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Our commitment to transparency includes independent verification of all platform metrics. Check back for detailed statistics and audit reports.{' '}
              <Link href="/legal" className="text-blue-600 font-semibold underline hover:no-underline">
                View our compliance framework
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
