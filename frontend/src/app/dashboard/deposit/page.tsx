'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

export default function DepositPage() {
  const apiBase = useMemo(() => (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, ''), [])
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('bank_transfer')
  const [reference, setReference] = useState('')
  const [txHash, setTxHash] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (!amount) return setError('Please enter an amount')
    if (!reference) return setError('Please provide a reference or note')

    const token = localStorage.getItem('authToken')
    if (!token) {
      window.location.href = '/accounts/login?next=/dashboard/deposit'
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${apiBase}/api/transactions/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
        credentials: 'include',
        body: JSON.stringify({
          tx_type: 'deposit',
          amount: Number(amount),
          reference,
          payment_method: method,
          tx_hash: txHash,
          wallet_address_used: walletAddress,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setMessage('Deposit request submitted. Awaiting approval.')
        setTimeout(() => (window.location.href = '/dashboard'), 1000)
      } else {
        setError(data?.detail || data?.non_field_errors?.[0] || 'Failed to submit deposit')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Deposit Funds</h1>
        <Link href="/dashboard" className="text-sm text-[#2563eb] hover:underline">Back to dashboard</Link>
      </div>

      <form onSubmit={submit} className="space-y-6 max-w-xl">
        {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}
        {message && <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm">{message}</div>}

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="depositAmount" className="block text-sm font-semibold text-gray-700 mb-2">Amount (USD)</label>
            <input id="depositAmount" aria-label="Deposit amount" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#2563eb]" placeholder="0.00"/>
          </div>
          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
            <select id="paymentMethod" aria-label="Payment method" value={method} onChange={(e) => setMethod(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#2563eb]">
              <option value="bank_transfer">Bank Transfer</option>
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="USDT">Tether (USDT)</option>
              <option value="USDC">USD Coin (USDC)</option>
              <option value="ETH">Ethereum (ETH)</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="depositReference" className="block text-sm font-semibold text-gray-700 mb-2">Reference / Notes</label>
          <input id="depositReference" aria-label="Deposit reference or notes" value={reference} onChange={(e) => setReference(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#2563eb]" placeholder="e.g., Bank transfer ref or wallet used"/>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="cryptoTxHash" className="block text-sm font-semibold text-gray-700 mb-2">Crypto Tx Hash (optional)</label>
            <input id="cryptoTxHash" aria-label="Cryptocurrency transaction hash" value={txHash} onChange={(e) => setTxHash(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#2563eb]"/>
          </div>
          <div>
            <label htmlFor="walletAddressUsed" className="block text-sm font-semibold text-gray-700 mb-2">Wallet Address Used (optional)</label>
            <input id="walletAddressUsed" aria-label="Wallet address used" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#2563eb]"/>
          </div>
        </div>

        <button type="submit" disabled={loading} className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50">
          {loading ? 'Submitting...' : 'Submit Deposit'}
        </button>
      </form>
    </div>
  )
}
