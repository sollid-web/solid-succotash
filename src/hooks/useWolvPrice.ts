'use client'
import { useState, useEffect } from 'react'

const CONTRACT = '0xe0167279aef7bf4ad313d261da82e8366822270c'
const OLD_WOLV_PRICE = 0.50 // price used to calculate stored USD amounts

export interface WolvPriceData {
  priceUsd: number | null
  priceNative: string | null
  loading: boolean
  error: boolean
}

export function useWolvPrice(): WolvPriceData {
  const [data, setData] = useState<WolvPriceData>({
    priceUsd: null,
    priceNative: null,
    loading: true,
    error: false,
  })

  useEffect(() => {
    let cancelled = false

    async function fetchPrice() {
      try {
        const res = await fetch(
          `https://api.dexscreener.com/latest/dex/tokens/${CONTRACT}`,
          { next: { revalidate: 60 } }
        )
        if (!res.ok) throw new Error('Failed')
        const json = await res.json()
        const pair = json?.pairs?.[0]
        if (!pair) throw new Error('No pair')
        if (!cancelled) {
          setData({
            priceUsd: parseFloat(pair.priceUsd || '0'),
            priceNative: pair.priceNative || null,
            loading: false,
            error: false,
          })
        }
      } catch {
        if (!cancelled) {
          setData(prev => ({ ...prev, loading: false, error: true }))
        }
      }
    }

    fetchPrice()
    const interval = setInterval(fetchPrice, 60_000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [])

  return data
}

// Convert stored USD amount (at old $0.50 price) to WOLV token count
export function usdToWolvTokens(usdAmount: number): number {
  return usdAmount / OLD_WOLV_PRICE
}

// Format large numbers nicely
export function formatWolv(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(2)}M`
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(2)}K`
  return amount.toFixed(2)
}
