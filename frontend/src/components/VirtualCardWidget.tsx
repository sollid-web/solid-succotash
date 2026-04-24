'use client'

import Link from 'next/link'
import FlipCard from './FlipCard'
import { useEffect, useState } from 'react'

export default function VirtualCardWidget() {
  const [card, setCard] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await fetch('/api/cards/', { credentials: 'include' })
        if (!res.ok) throw new Error('Failed to load cards')
        const data = await res.json()
        if (active) {
          const cards = Array.isArray(data) ? data : [data]
          const active_card = cards.find((c: any) => c.status === 'active') || cards[0] || null
          setCard(active_card)
        }
      } catch (e: any) {
        if (active) setError(e.message || 'Error fetching cards')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [])

  const status = loading ? 'loading' : error ? 'error' : !card ? 'none' : card.status

  return (
    <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Virtual Visa Card</h3>
          <p className="text-sm text-gray-600 mt-1">Activate your digital card for instant transactions</p>
        </div>
        <div className="text-3xl">💳</div>
      </div>

      {/* Premium Flip Card with real data */}
      <div className="mb-6 flex justify-center">
        <FlipCard
          maxWidth={340}
          cardNumber={card?.card_number}
          cardholderName={card?.cardholder_name}
          expiryMonth={card?.expiry_month}
          expiryYear={card?.expiry_year}
          isFrozen={card?.status === 'suspended'}
        />
      </div>

      {/* Card Details */}
      <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="font-semibold text-gray-700">Purchase Amount</div>
          <div className="text-lg font-bold text-gray-900 mt-1">$1,000</div>
        </div>
        <div>
          <div className="font-semibold text-gray-700">Status</div>
          <div className="inline-block mt-1">
            {status === 'loading' && <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">Loading…</span>}
            {status === 'active' && <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Active</span>}
            {status === 'pending' && <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Pending</span>}
            {(status === 'none' || status === 'error') && <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Not Activated</span>}
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-6 bg-blue-100 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          {status === 'loading' && 'Checking card status…'}
          {status === 'active' && 'Your virtual card is active. View details or manage below.'}
          {status === 'pending' && 'You have a pending card request. Please wait for admin approval.'}
          {(status === 'none' || status === 'error') && 'Ready to activate? Request your virtual card below. Admin approval required (24-72 hours).'}
        </p>
        {error && <p className="mt-2 text-red-600 text-xs">{error}</p>}
      </div>

      {/* CTA */}
      {status === 'active' ? (
        <Link href="/dashboard/card"
          className="block w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-xl text-center hover:shadow-lg hover:brightness-110 transition-all duration-200">
          View Active Card
        </Link>
      ) : (
        <>
          <Link href="/dashboard/card"
            className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-xl text-center hover:shadow-lg hover:brightness-110 transition-all duration-200">
            Request Card Activation
          </Link>
          <Link href="/dashboard/card"
            className="block w-full mt-3 text-center text-sm font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2">
            View My Cards
          </Link>
        </>
      )}
    </div>
  )
}
