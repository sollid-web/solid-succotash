'use client'

import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

export default function LegalDisclaimerBanner() {
  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 py-2 md:py-3">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
          <div className="flex-shrink-0">
            <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-teal-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-300">Risk Notice:</strong> Staking digital assets carries risk including potential loss of principal. WOLV rewards are on-chain and subject to market conditions. WolvCapital is FinCEN MSB registered for AML/KYC compliance purposes only — this is not a securities licence.{' '}
              <Link href="/risk-disclosure" className="text-teal-400 underline hover:no-underline">
                Full risk disclosure
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
