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
    <div className="rounded-2xl p-6" style={{
      background: "linear-gradient(135deg, rgba(26,58,143,0.5) 0%, rgba(14,165,201,0.35) 100%)",
      border: "1px solid rgba(0,168,150,0.3)",
      backdropFilter: "blur(10px)",
    }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold" style={{ color: "#fff" }}>Virtual Visa Card</h3>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>Activate your digital card for instant transactions</p>
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
          <div className="font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>Purchase Amount</div>
          <div className="text-lg font-bold mt-1" style={{ color: "#fff" }}>$1,000</div>
        </div>
        <div>
          <div className="font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>Status</div>
          <div className="inline-block mt-1">
            {status === 'loading' && <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>Loading…</span>}
            {status === 'active' && <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(16,185,129,0.2)", color: "#10b981" }}>Active</span>}
            {status === 'pending' && <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(245,158,11,0.2)", color: "#f59e0b" }}>Pending</span>}
            {(status === 'none' || status === 'error') && <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(245,158,11,0.2)", color: "#f59e0b" }}>Not Activated</span>}
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-6 rounded-lg p-4" style={{
        background: "rgba(0,168,150,0.15)",
        border: "1px solid rgba(0,168,150,0.3)",
        color: "rgba(255,255,255,0.8)",
      }}>
        <p className="text-sm">
          {status === 'loading' && 'Checking card status…'}
          {status === 'active' && 'Your virtual card is active. View details or manage below.'}
          {status === 'pending' && 'You have a pending card request. Please wait for admin approval.'}
          {(status === 'none' || status === 'error') && 'Ready to activate? Request your virtual card below. Admin approval required (24-72 hours).'}
        </p>
        {error && <p className="mt-2" style={{ color: "#ff6b6b", fontSize: "12px" }}>{error}</p>}
      </div>

      {/* CTA */}
      {status === 'active' ? (
        <Link href="/dashboard/card"
          className="block w-full font-semibold py-3 px-4 rounded-xl text-center transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, #10b981, #059669)",
            color: "#fff",
            boxShadow: "0 8px 20px rgba(16,185,129,0.3)",
          }}>
          View Active Card
        </Link>
      ) : (
        <>
          <Link href="/dashboard/card"
            className="block w-full font-semibold py-3 px-4 rounded-xl text-center transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #00a896, #0f7a70)",
              color: "#fff",
              boxShadow: "0 8px 20px rgba(0,168,150,0.3)",
            }}>
            Request Card Activation
          </Link>
          <Link href="/dashboard/card"
            className="block w-full mt-3 text-center text-sm font-semibold underline underline-offset-2"
            style={{ color: "rgba(0,168,150,0.8)" }}>
            View My Cards
          </Link>
        </>
      )}
    </div>
  )
}
