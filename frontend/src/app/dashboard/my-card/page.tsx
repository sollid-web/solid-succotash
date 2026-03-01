'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'
import FlipCard from '@/components/FlipCard'

interface Card {
  id: string
  card_type: string
  card_number: string
  cardholder_name: string
  expiry_month: string
  expiry_year: string
  cvv: string
  balance: string
  purchase_amount: string
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'suspended' | 'expired'
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function MyCardPage() {
  const [card, setCard] = useState<Card | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await apiFetch('/api/virtual-cards/')
        if (!res.ok) throw new Error('Failed to load cards')
        const data = await res.json()
        const cards = Array.isArray(data) ? data : []
        // Get the first/most recent card, prefer active
        const activeCard = cards.find((c: Card) => c.status === 'active')
        const mostRecent = cards[0]
        if (!active) return
        setCard(activeCard || mostRecent || null)
        if (!activeCard && !mostRecent) setError('No virtual cards found. Request one to get started.')
      } catch (e: any) {
        if (!active) return
        setError(e.message || 'Failed to load card')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [])

  const statusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' }
      case 'approved':
        return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' }
      case 'active':
        return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' }
      case 'rejected':
        return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' }
      case 'suspended':
        return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' }
      case 'expired':
        return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' }
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="inline-flex items-center text-[#2563eb] hover:text-[#1d4ed8] mb-6">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Virtual Card</h1>
              <p className="text-gray-600 mt-2">View your card details and manage activation</p>
            </div>
            <div className="text-5xl">💳</div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4 animate-spin">
                  <div className="w-8 h-8 rounded-full border-4 border-blue-200 border-t-blue-600"></div>
                </div>
                <p className="text-gray-600">Loading your card…</p>
              </div>
            </div>
          )}

          {error && !card && (
            <div className="mb-6 p-6 bg-yellow-50 border border-yellow-200 rounded-2xl text-center">
              <p className="text-yellow-900 mb-4">{error}</p>
              <Link
                href="/dashboard/purchase-card"
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                Request Virtual Card
              </Link>
            </div>
          )}

          {card && (
            <>
              {/* Card Display */}
              <div className="mb-8 flex justify-center">
                <div className="w-full max-w-md">
                  <FlipCard maxWidth={380} initialFlipped={false} />
                </div>
              </div>

              {/* Card Details */}
              <div className="mb-8 rounded-2xl border border-gray-200 bg-gray-50 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Card Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-semibold text-gray-700 mb-2">Status</div>
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${statusColor(card.status).bg} ${statusColor(card.status).text} ${statusColor(card.status).border}`}
                      >
                        {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-gray-700 mb-2">Card Type</div>
                    <p className="text-lg text-gray-900">{card.card_type || 'Visa Virtual Card'}</p>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-gray-700 mb-2">Purchase Amount</div>
                    <p className="text-lg font-bold text-gray-900">${parseFloat(card.purchase_amount).toFixed(2)}</p>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-gray-700 mb-2">Current Balance</div>
                    <p className="text-lg font-bold text-green-700">${parseFloat(card.balance).toFixed(2)}</p>
                  </div>

                  {card.card_number && (
                    <>
                      <div>
                        <div className="text-sm font-semibold text-gray-700 mb-2">Card Number</div>
                        <p className="text-lg font-mono text-gray-900">****-****-****-{card.card_number.slice(-4)}</p>
                      </div>

                      <div>
                        <div className="text-sm font-semibold text-gray-700 mb-2">Expiry</div>
                        <p className="text-lg font-mono text-gray-900">
                          {card.expiry_month}/{card.expiry_year}
                        </p>
                      </div>
                    </>
                  )}

                  <div>
                    <div className="text-sm font-semibold text-gray-700 mb-2">Created</div>
                    <p className="text-gray-900">
                      {new Date(card.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status-based CTAs */}
              <div className="flex gap-4 flex-wrap">
                {card.status === 'active' ? (
                  <div className="flex-1 p-6 bg-green-50 border border-green-200 rounded-2xl text-center">
                    <p className="text-green-900 font-semibold mb-3">✓ Card is active</p>
                    <p className="text-sm text-green-700 mb-4">You can now withdraw funds and make purchases with your card.</p>
                    <Link
                      href="/dashboard/withdraw"
                      className="inline-block px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                    >
                      Request Withdrawal
                    </Link>
                  </div>
                ) : card.status === 'pending' ? (
                  <div className="flex-1 p-6 bg-yellow-50 border border-yellow-200 rounded-2xl text-center">
                    <p className="text-yellow-900 font-semibold mb-3">⏳ Approval Pending</p>
                    <p className="text-sm text-yellow-700">Your card request is under review. This typically takes 24-72 hours.</p>
                  </div>
                ) : card.status === 'rejected' ? (
                  <div className="flex-1 p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
                    <p className="text-red-900 font-semibold mb-3">✗ Request Rejected</p>
                    <p className="text-sm text-red-700 mb-4">Your request was not approved. Please contact support for details.</p>
                    <Link
                      href="/dashboard/support"
                      className="inline-block px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                    >
                      Contact Support
                    </Link>
                  </div>
                ) : (
                  <div className="flex-1 p-6 bg-blue-50 border border-blue-200 rounded-2xl text-center">
                    <p className="text-blue-900 font-semibold mb-3">Request a New Card</p>
                    <p className="text-sm text-blue-700 mb-4">You don't have an active card yet. Request activation to get started.</p>
                    <Link
                      href="/dashboard/purchase-card"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                    >
                      Request Card
                    </Link>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-2xl">
                <h3 className="font-semibold text-gray-900 mb-3">ℹ️ Card Security</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Your full card details are only displayed once and encrypted in our system.</li>
                  <li>• Never share your card number or CVV with anyone.</li>
                  <li>• Contact support immediately if your card is compromised.</li>
                  <li>• All card transactions require manual admin approval.</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
