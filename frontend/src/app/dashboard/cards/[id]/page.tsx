'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { apiFetch } from '@/lib/api'

type Card = {
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

export default function CardDetailPage() {
  const params = useParams()
  const id = useMemo(() => String(params?.id || ''), [params])
  const [card, setCard] = useState<Card | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const resp = await apiFetch(`/api/virtual-cards/${id}/`)
        const data = await resp.json()
        if (!resp.ok) throw new Error(data?.detail || 'Failed to load card')
        if (!active) return
        setCard(data)
      } catch (e: any) {
        if (!active) return
        setError(e.message || 'Failed to load card')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [id])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard/cards" className="inline-flex items-center text-[#2563eb] hover:text-[#1d4ed8]">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Cards
          </Link>
        </div>

        {loading && <div className="p-4 border rounded-xl bg-white">Loading…</div>}
        {error && <div className="p-4 border rounded-xl bg-red-50 text-red-700">{error}</div>}

        {card && (
          <div className="bg-white border rounded-2xl shadow p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">{card.card_type || 'Visa Virtual Card'}</div>
              <div className="text-sm text-gray-500">Requested: {new Date(card.created_at).toLocaleDateString()}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Status:</span>
              <span className="text-sm font-semibold">{card.status.toUpperCase()}</span>
            </div>
            <div>
              <div className="text-sm text-gray-500">Purchase Amount</div>
              <div className="font-mono">${card.purchase_amount}</div>
            </div>
            {card.card_number && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Card Number</div>
                <div className="font-mono">****-****-****-{card.card_number.slice(-4)}</div>
                <div className="mt-2 text-sm text-gray-500">Expiry</div>
                <div className="font-mono">{card.expiry_month}/{card.expiry_year} · CVV {card.cvv}</div>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">Balance</div>
              <div className="font-semibold">${card.balance}</div>
            </div>
            <div className="text-xs text-gray-500">ID: {card.id}</div>
          </div>
        )}
      </div>
    </div>
  )
}
