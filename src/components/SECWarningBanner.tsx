'use client'

import Link from 'next/link'

export default function SECWarningBanner() {
  return (
    <div className="w-full bg-slate-900 border-b border-slate-700">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-2 px-4">
          <p className="text-center text-[12px] text-slate-400 leading-relaxed max-w-4xl">
            <span className="mr-1">🔒</span>
            <span className="font-medium text-slate-300">Compliance:</span> WolvCapital is FinCEN MSB registered for AML/KYC compliance. WOLV is a BEP20 utility token — not a security. Staking involves risk.
            {' '}
            <Link href="/risk-disclosure" className="font-semibold text-teal-400 hover:text-teal-300 underline inline-flex items-center gap-1">
              Risk Disclosure →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
