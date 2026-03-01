'use client'

import Link from 'next/link'
import FlipCard from './FlipCard'
import { useEffect, useState } from 'react'

/**
 * VirtualCardWidget - Dashboard component displaying virtual card with CTA
 * Shows flip card animation with $1000 purchase amount and activation request link
 */
export default function VirtualCardWidget() {
  const [cards, setCards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await fetch('/api/virtual-cards/', { credentials: 'include' })
        if (!res.ok) throw new Error('Failed to load cards')
        const data = await res.json()
        if (active) setCards(Array.isArray(data) ? data : [])
      } catch (e: any) {
        if (active) setError(e.message || 'Error fetching cards')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [])

  return (
    <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Virtual Visa Card</h3>
          <p className="text-sm text-gray-600 mt-1">Activate your digital card for instant transactions</p>
        </div>
        <div className="text-3xl">💳</div>
      </div>

      {/* Flip Card Component */}
      <div className="mb-6 flex justify-center">
        <div className="w-full max-w-sm">
          <FlipCard maxWidth={340} />
        </div>
      </div>

      {/* Card Details */}
      <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="font-semibold text-gray-700">Purchase Amount</div>
          <div className="text-lg font-bold text-gray-900 mt-1">$1,000</div>
        </div>
        <div>
          <div className="font-semibold text-gray-700">Status</div>
          <div className="inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-semibold ">
            {loading ? 'Loading…' : error ? 'Error' : cards.some(c => c.status === 'active') ? (
              <span className="bg-green-100 text-green-700 border-green-200">Activated</span>
            ) : cards.some(c => c.status === 'pending') ? (
              <span className="bg-yellow-100 text-yellow-700 border-yellow-200">Pending</span>
            ) : (
              <span className="bg-yellow-100 text-yellow-700 border-yellow-200">Not Activated</span>
            )}
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-6 bg-blue-100 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          {loading
            ? 'Checking card status…'
            : cards.some(c => c.status === 'active')
            ? 'Your virtual card is active. You can request withdrawals or view details below.'
            : cards.some(c => c.status === 'pending')
            ? 'You have a pending card request. Please wait for admin approval.'
            : 'Ready to activate? Request your virtual card below. Admin approval required (24-72 hours).'}
        </p>
        {error && <p className="mt-2 text-red-600 text-xs">{error}</p>}
      </div>

      {/* CTA / View Actions */}
      {loading ? null : cards.some(c => c.status === 'active') ? (
        <Link
          href="/dashboard/cards"
          className="block w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-xl text-center hover:shadow-lg transition-all duration-200"
        >
          View Active Card
        </Link>
      ) : (
        <>
          <Link
            href="/dashboard/purchase-card"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-xl text-center hover:shadow-lg transition-all duration-200"
          >
            Request Card Activation
          </Link>

          <Link
            href="/dashboard/cards"
            className="block w-full mt-3 text-center text-sm font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2"
          >
            View My Cards
          </Link>
        </>
      )}
    </div>
  )
}
