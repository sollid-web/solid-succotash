'use client'

import { useMemo, useState } from 'react'
import { getApiBaseUrl } from '@/lib/config'
import Link from 'next/link'

export default function WithdrawPage() {
  const apiBase = useMemo(() => getApiBaseUrl(), [])
  const [amount, setAmount] = useState('')
  const [reference, setReference] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (!amount) return setError('Please enter an amount')
    if (!reference) return setError('Please provide a withdrawal note')

    const token = localStorage.getItem('authToken')
    if (!token) {
      window.location.href = '/accounts/login?next=/dashboard/withdraw'
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${apiBase}/api/transactions/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
        credentials: 'include',
        body: JSON.stringify({ tx_type: 'withdrawal', amount: Number(amount), reference }),
      })
      const data = await res.json()
      if (res.ok) {
        setMessage('Withdrawal request submitted. Awaiting approval.')
        setTimeout(() => (window.location.href = '/dashboard'), 1000)
      } else {
        setError(data?.detail || data?.non_field_errors?.[0] || 'Failed to submit withdrawal')
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
        <h1 className="text-2xl font-bold text-gray-800">Withdraw Funds</h1>
        <Link href="/dashboard" className="text-sm text-[#2563eb] hover:underline">Back to dashboard</Link>
      </div>

      <form onSubmit={submit} className="space-y-6 max-w-xl">
        {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}
        {message && <div className="p-3 bg-amber-50 text-amber-700 rounded-xl text-sm">{message}</div>}

        <div>
          <label htmlFor="withdrawAmount" className="block text-sm font-semibold text-gray-700 mb-2">Amount (USD)</label>
          <input id="withdrawAmount" aria-label="Withdrawal amount" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#2563eb]" placeholder="0.00"/>
        </div>

        <div>
          <label htmlFor="withdrawReference" className="block text-sm font-semibold text-gray-700 mb-2">Reference / Notes</label>
          <input id="withdrawReference" aria-label="Withdrawal reference or notes" value={reference} onChange={(e) => setReference(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#2563eb]" placeholder="e.g., Payout to bank"/>
        </div>

        <button type="submit" disabled={loading} className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50">
          {loading ? 'Submitting...' : 'Request Withdrawal'}
        </button>
      </form>
    </div>
  )
}
