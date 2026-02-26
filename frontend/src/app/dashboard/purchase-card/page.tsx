'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'

type Wallet = {
  currency: 'BTC' | 'USDT' | 'USDC' | 'ETH'
  wallet_address: string
  network: string
  is_active: boolean
}

export default function PurchaseCardPage() {
  const [paymentMethod, setPaymentMethod] = useState<'BTC' | 'USDT' | 'USDC' | 'ETH'>('BTC')
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadWallets = async () => {
      try {
        const res = await apiFetch('/api/crypto-wallets/')
        if (!res.ok) throw new Error('Failed to load wallets')
        const data = await res.json()
        setWallets(Array.isArray(data) ? data : [])
      } catch {
        setError('Unable to load wallets')
      }
    }
    loadWallets()
  }, [])

  useEffect(() => {
    const wallet = wallets.find(
      w => w.currency === paymentMethod && w.is_active
    )
    setSelectedWallet(wallet || null)
  }, [wallets, paymentMethod])

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedWallet) {
      setError('Selected payment method unavailable')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    try {
      const res = await apiFetch('/api/transactions/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1000 }),
      })

      if (!res.ok) throw new Error('Submission failed')

      setMessage('Payment submitted. Awaiting admin approval.')
    } catch {
      setError('Payment submission failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <Link href="/dashboard">Back</Link>
      <h1 className="text-2xl font-bold mt-4">Activate Virtual Card</h1>

      {error && <div className="text-red-600">{error}</div>}
      {message && <div className="text-green-600">{message}</div>}

      <form onSubmit={handlePayment} className="mt-6">
        <button
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? 'Processing...' : 'Submit Payment'}
        </button>
      </form>
    </div>
  )
}