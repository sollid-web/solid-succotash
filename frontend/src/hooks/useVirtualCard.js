'use client'

import { useCallback, useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'

export default function useVirtualCard() {
  const [cardData, setCardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await apiFetch('/api/cards/detail/')
      if (res.status === 401) {
        window.location.href = '/accounts/login?next=/dashboard/card'
        return
      }

      if (!res.ok) {
        const payload = await res.json().catch(() => null)
        throw new Error(payload?.error || 'Failed to load card details')
      }

      const payload = await res.json()
      setCardData(payload.card || payload)
    } catch (err) {
      setError(err?.message || 'Failed to load card details')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return {
    cardData,
    loading,
    error,
    refetch,
  }
}
