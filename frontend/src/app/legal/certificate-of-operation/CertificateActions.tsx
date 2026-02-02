'use client'

import Link from 'next/link'

export default function CertificateActions() {
  return (
    <div className="flex gap-2 justify-end">
      <button
        type="button"
        onClick={() => window.print()}
        className="btn-cta-sky inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-semibold"
      >
        Print / Save PDF
      </button>
      <Link
        href="/"
        className="px-4 py-2 rounded-md text-[#0b2f6b] bg-white border border-[#0b2f6b]/20 text-sm font-semibold shadow"
      >
        Back to Home
      </Link>
    </div>
  )
}
