import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Withdrawal Policy',
  description: 'Platform withdrawal policy details.',
}

export default function WithdrawalPolicyPage() {
  return (
    <main className="min-h-screen py-16 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Withdrawal Policy</h1>
        <p className="text-gray-600">
          All withdrawals are subject to manual review and compliance checks.
          Processing time is typically 24–72 business hours.
        </p>
      </div>
    </main>
  )
}