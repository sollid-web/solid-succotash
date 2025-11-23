'use client'

import { useEffect, useMemo, useState } from 'react'
import { getApiBaseUrl } from '@/lib/config'
import Link from 'next/link'

interface Plan {
  id: number
  name: string
  description: string
  daily_roi: string
  duration_days: number
  min_amount: string
  max_amount: string
}

export default function NewInvestmentPage() {
  const apiBase = useMemo(() => getApiBaseUrl(), [])
  const [plans, setPlans] = useState<Plan[]>([])
  const [planId, setPlanId] = useState<number | ''>('' as any)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${apiBase}/api/plans/`)
        if (res.ok) {
          const data = await res.json()
          setPlans(data)
        }
      } catch {}
    }
    load()
  }, [apiBase])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (!planId) return setError('Please select a plan')
    if (!amount) return setError('Please enter an amount')

    const token = localStorage.getItem('authToken')
    if (!token) {
      window.location.href = '/accounts/login?next=/dashboard/new-investment'
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${apiBase}/api/investments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ plan_id: Number(planId), amount: Number(amount) }),
      })
      const data = await res.json()
      if (res.ok) {
        setMessage('Investment created successfully.')
        setTimeout(() => (window.location.href = '/dashboard'), 1000)
      } else {
        setError(data?.detail || data?.non_field_errors?.[0] || 'Failed to create investment')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">New Investment</h1>
        <Link href="/dashboard" className="text-sm text-[#2563eb] hover:underline">Back to dashboard</Link>
      </div>

      <form onSubmit={submit} className="space-y-6 max-w-lg">
        {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}
        {message && <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm">{message}</div>}

        <div>
          <label htmlFor="planSelect" className="block text-sm font-semibold text-gray-700 mb-2">Plan</label>
          <select id="planSelect" aria-label="Investment Plan" value={planId} onChange={(e) => setPlanId(Number(e.target.value))} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#2563eb]">
            <option value="">Select a plan</option>
            {plans.map(p => (
              <option key={p.id} value={p.id}>{p.name} · {p.daily_roi}% · {p.duration_days} days</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="amountInput" className="block text-sm font-semibold text-gray-700 mb-2">Amount (USD)</label>
          <input id="amountInput" aria-label="Investment amount" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#2563eb]" placeholder="Enter amount"/>
          <p className="text-xs text-gray-500 mt-2">Must be within the plan's min/max limits.</p>
        </div>

        <button type="submit" disabled={loading} className="bg-gradient-to-r from-[#0b2f6b] via-[#2563eb] to-[#1d4ed8] text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50">
          {loading ? 'Submitting...' : 'Create Investment'}
        </button>
      </form>
    </div>
  )
}
