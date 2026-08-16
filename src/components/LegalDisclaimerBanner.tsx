'use client'

import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function LegalDisclaimerBanner() {
  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 border-b-2 border-red-400 sticky top-0 z-40 py-3 md:py-4">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm text-red-900 leading-relaxed">
              <strong>Legal Notice:</strong> WolvCapital operates under SEC exemptions (§203(m) for non-U.S. clients, §203(l) for pooled investments) and is not yet registered as an investment adviser. Verify current status at{' '}
              <a href="https://www.sec.gov" target="_blank" rel="noopener noreferrer" className="text-red-700 font-bold underline hover:no-underline">
                sec.gov
              </a>
              . Custodian: Coinbase Custody. Audit: Deloitte LLP (2024).{' '}
              <Link href="/legal" className="text-red-700 font-bold underline hover:no-underline">
                Full legal details
              </Link>
            </p>
          </div>

          {/* Close button (optional) */}
          <button className="flex-shrink-0 text-red-600 hover:text-red-700 transition hidden md:block">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
