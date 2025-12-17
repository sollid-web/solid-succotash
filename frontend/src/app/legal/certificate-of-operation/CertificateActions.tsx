'use client'

import Link from 'next/link'

export default function CertificateActions() {
  return (
    <div className="flex gap-2 justify-end">
      <button
        type="button"
        onClick={() => window.print()}
        className="px-4 py-2 rounded-md text-white bg-[#0b2f6b] hover:bg-[#0a285c] text-sm font-semibold shadow"
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
