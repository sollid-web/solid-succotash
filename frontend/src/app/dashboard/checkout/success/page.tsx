'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import TrustpilotInvite from '@/components/TrustpilotInvite'
import { trackEvent } from '@/lib/segment'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null)
  const [transactionId, setTransactionId] = useState<string | null>(null)

  useEffect(() => {
    const status = searchParams.get('status')
    const txId = searchParams.get('txId')
    const amount = searchParams.get('amount')
    const userEmail = searchParams.get('email')
    const userName = searchParams.get('name')
    
    setTransactionStatus(status)
    setTransactionId(txId)

    // Track transaction completion in Segment (Trustpilot integration)
    if (status === 'completed' && txId) {
      trackEvent('Order Completed', {
        orderId: txId,
        revenue: amount ? parseFloat(amount) : undefined,
        email: userEmail || undefined,
        name: userName || undefined,
        properties: {
          trustpilot_invitation_trigger: true
        }
      })
    }
  }, [searchParams])

  const isCompleted = transactionStatus === 'completed'

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        {isCompleted ? (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Transaction Completed
            </h1>
            <p className="text-gray-600 mb-2">
              Your transaction has been successfully processed.
            </p>
            {transactionId && (
              <p className="text-sm text-gray-500 mb-6">
                Transaction ID: <span className="font-mono">{transactionId}</span>
              </p>
            )}
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Transaction Pending
            </h1>
            <p className="text-gray-600 mb-6">
              Your transaction is being processed. You will receive a notification once it is completed.
            </p>
          </>
        )}

        <div className="flex gap-4 justify-center mt-8">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-[#0b2f6b] text-white rounded-lg hover:bg-[#0a2858] transition-colors"
          >
            Return to Dashboard
          </Link>
          <Link
            href="/dashboard/transactions"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View Transactions
          </Link>
        </div>
      </div>

      {isCompleted && <TrustpilotInvite />}
    </div>
  )
}
