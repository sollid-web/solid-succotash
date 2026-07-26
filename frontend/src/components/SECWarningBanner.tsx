'use client'

import Link from 'next/link'

export default function SECWarningBanner() {
  return (
    <div className="w-full bg-[#FFF8E1] border-b-2 border-[#F59E0B]">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-2.5 px-4">
          <p className="text-center text-[13px] text-gray-800 leading-relaxed max-w-4xl">
            <span className="mr-2">⚠️</span>
            <span className="font-medium">Compliance Notice:</span> WolvCapital operates under KYC, AML, and PCI-DSS compliance standards. FinCEN MSB Registered.
            {' '}
            <Link href="/risk-disclosure" className="font-semibold text-gray-800 hover:text-gray-600 underline inline-flex items-center gap-1">
              Learn more →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
