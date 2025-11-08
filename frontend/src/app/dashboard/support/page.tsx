'use client'

import Link from 'next/link'

export default function DashboardSupportPage() {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Support</h1>
        <Link href="/dashboard" className="text-sm text-[#2563eb] hover:underline">Back to dashboard</Link>
      </div>

      <p className="text-gray-700 mb-6">Need help? You can contact our team and track updates from your dashboard.</p>

      <div className="space-x-3">
        <Link href="/contact" className="inline-block bg-gradient-to-r from-[#0b2f6b] via-[#2563eb] to-[#1d4ed8] text-white px-6 py-3 rounded-xl font-semibold">Contact Support</Link>
        <Link href="/dashboard" className="inline-block px-6 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:border-[#2563eb]">Back</Link>
      </div>
    </div>
  )
}
