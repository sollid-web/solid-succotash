'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getApiBaseUrl } from '@/lib/config'

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

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) {
          window.location.href = '/accounts/login?next=/dashboard/cards'
          return
        }
        const apiBase = getApiBaseUrl()
        const resp = await fetch(`${apiBase}/api/virtual-cards/`, {
          headers: { 'Authorization': `Token ${token}` },
          credentials: 'include',
        })
        const data = await resp.json()
        if (!resp.ok) throw new Error(data?.detail || 'Failed to load cards')
        if (!active) return
        setCards(Array.isArray(data) ? data : [])
      } catch (e: any) {
        if (!active) return
        setError(e.message || 'Failed to load cards')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [])

  const statusColor = (s: Card['status']) => {
    switch (s) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'approved': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'active': return 'bg-green-100 text-green-700 border-green-200'
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200'
      case 'suspended': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'expired': return 'bg-gray-100 text-gray-700 border-gray-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-[#2563eb] hover:text-[#1d4ed8]">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
          <Link href="/dashboard/purchase-card" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Purchase Card</Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Virtual Cards</h1>
        <p className="text-gray-600 mb-6">Track pending requests and active cards. All activations require admin approval.</p>

        {loading && (
          <div className="p-4 border rounded-xl bg-white">Loading cards…</div>
        )}

        {error && (
          <div className="mb-4 p-4 border rounded-xl bg-red-50 text-red-700">{error}</div>
        )}

        {!loading && !error && cards.length === 0 && (
          <div className="p-6 border rounded-xl bg-white">
            <p className="text-gray-700">No cards found. Submit a request via Purchase Card.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((c) => (
            <Link
              href={`/dashboard/cards/${c.id}`}
              key={c.id}
              className="group bg-white border rounded-2xl shadow p-6 hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`px-3 py-1 rounded-full text-xs border ${statusColor(c.status)}`}>{c.status.toUpperCase()}</div>
                <div className="text-sm text-gray-500">{new Date(c.created_at).toLocaleDateString()}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Type</div>
                <div className="font-semibold group-hover:text-indigo-600">{c.card_type || 'Visa Virtual Card'}</div>
                <div className="text-sm text-gray-500 mt-2">Purchase Amount</div>
                <div className="font-mono">${c.purchase_amount}</div>
              </div>
              {c.card_number && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Card Number</div>
                  <div className="font-mono">****-****-****-{c.card_number.slice(-4)}</div>
                  <div className="mt-2 text-sm text-gray-500">Expiry</div>
                  <div className="font-mono">{c.expiry_month}/{c.expiry_year} &middot; CVV {c.cvv}</div>
                </div>
              )}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">Balance</div>
                <div className="font-semibold">${c.balance}</div>
              </div>
              <div className="mt-3 text-xs text-gray-400">View details →</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
