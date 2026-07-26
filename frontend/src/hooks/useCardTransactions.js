'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'

export default function useCardTransactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    async function fetchTransactions() {
      setLoading(true)
      setError(null)

      try {
        const res = await apiFetch('/api/cards/transactions/')
        if (res.status === 401) {
          window.location.href = '/accounts/login?next=/dashboard/card'
          return
        }

        if (!res.ok) {
          const payload = await res.json().catch(() => null)
          throw new Error(payload?.error || 'Failed to load transactions')
        }

        const payload = await res.json()
        if (active) {
          setTransactions(Array.isArray(payload) ? payload : payload.transactions || [])
        }
      } catch (err) {
        if (active) {
          setError(err?.message || 'Failed to load transactions')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchTransactions()
    return () => {
      active = false
    }
  }, [])

  return {
    transactions,
    loading,
    error,
  }
}
