"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type MarketSnapshotProps = {
  refreshMs?: number
}

type SnapshotData = {
  btcUsd: number
  btcChange24h: number
  ethUsd: number
  ethChange24h: number
  asOf: Date
}

type SnapshotState =
  | { status: 'loading'; data?: SnapshotData; error?: string }
  | { status: 'ready'; data: SnapshotData; error?: string }
  | { status: 'error'; data?: SnapshotData; error: string }

const COINGECKO_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true'

function formatUsd(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value >= 100 ? 0 : 2,
  }).format(value)
}

function formatPct(value: number) {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export default function MarketSnapshot({ refreshMs = 60_000 }: MarketSnapshotProps) {
  const [state, setState] = useState<SnapshotState>({ status: 'loading' })
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const timerRef = useRef<number | null>(null)

  const numberOrNull = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) ? value : null)

  const fetchSnapshot = useCallback(async (signal: AbortSignal) => {
    const res = await fetch(COINGECKO_URL, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
      signal,
    })

    if (!res.ok) {
      throw new Error(`CoinGecko request failed (${res.status})`)
    }

    const json = (await res.json()) as {
      bitcoin?: { usd?: unknown; usd_24h_change?: unknown }
      ethereum?: { usd?: unknown; usd_24h_change?: unknown }
    }

    const btcUsd = numberOrNull(json.bitcoin?.usd)
    const btcChange24h = numberOrNull(json.bitcoin?.usd_24h_change)
    const ethUsd = numberOrNull(json.ethereum?.usd)
    const ethChange24h = numberOrNull(json.ethereum?.usd_24h_change)

    if (btcUsd === null || btcChange24h === null || ethUsd === null || ethChange24h === null) {
      throw new Error('Unexpected market data format')
    }

    return {
      btcUsd,
      btcChange24h,
      ethUsd,
      ethChange24h,
      asOf: new Date(),
    } satisfies SnapshotData
  }, [])

  useEffect(() => {
    let mounted = true
    const controller = new AbortController()

    const tick = async () => {
      const attemptAt = new Date()
      try {
        const data = await fetchSnapshot(controller.signal)
        if (!mounted) return
        setState({ status: 'ready', data })
      } catch (err) {
        if (!mounted) return
        const message = err instanceof Error ? err.message : 'Market data unavailable'
        setState((prev) => ({ status: 'error', data: prev.data, error: message }))
      } finally {
        if (!mounted) return
        setLastUpdated(attemptAt)
      }
    }

    void tick()

    timerRef.current = window.setInterval(() => {
      void tick()
    }, refreshMs)

    return () => {
      mounted = false
      controller.abort()
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [refreshMs, fetchSnapshot])

  const content = useMemo(() => {
    const data = state.data
    const isLoading = state.status === 'loading' && !data

    const btc = {
      label: 'Bitcoin (BTC)',
      price: data ? formatUsd(data.btcUsd) : '—',
      change: data ? formatPct(data.btcChange24h) : '—',
      changeClass:
        data && data.btcChange24h > 0
          ? 'text-green-700'
          : data && data.btcChange24h < 0
            ? 'text-red-700'
            : 'text-gray-600',
    }

    const eth = {
      label: 'Ethereum (ETH)',
      price: data ? formatUsd(data.ethUsd) : '—',
      change: data ? formatPct(data.ethChange24h) : '—',
      changeClass:
        data && data.ethChange24h > 0
          ? 'text-green-700'
          : data && data.ethChange24h < 0
            ? 'text-red-700'
            : 'text-gray-600',
    }

    return { btc, eth, isLoading }
  }, [state])

  const lastUpdatedText = lastUpdated
    ? new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        month: 'short',
        day: '2-digit',
      }).format(lastUpdated)
    : null

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-xl font-bold text-[#0b2f6b]">Market Snapshot</h3>
          <p className="text-sm text-gray-600">
            Live reference prices for educational purposes only. Not investment advice.
          </p>
        </div>

        <div className="text-xs text-gray-500">
          Source:{' '}
          <a
            href="https://www.coingecko.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline hover:no-underline"
          >
            CoinGecko
          </a>
          {lastUpdatedText ? <span className="ml-2">Last updated {lastUpdatedText}</span> : null}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-gray-50 p-4">
          <div className="text-sm font-semibold text-gray-700">{content.btc.label}</div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-[#0b2f6b]">{content.btc.price}</div>
            <div className={`text-sm font-bold ${content.btc.changeClass}`}>{content.btc.change}</div>
          </div>
          <div className="mt-1 text-xs text-gray-500">24h change</div>
        </div>

        <div className="rounded-xl bg-gray-50 p-4">
          <div className="text-sm font-semibold text-gray-700">{content.eth.label}</div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-[#0b2f6b]">{content.eth.price}</div>
            <div className={`text-sm font-bold ${content.eth.changeClass}`}>{content.eth.change}</div>
          </div>
          <div className="mt-1 text-xs text-gray-500">24h change</div>
        </div>
      </div>

      {content.isLoading ? (
        <p className="mt-4 text-sm text-gray-600">Loading live market data…</p>
      ) : state.status === 'error' ? (
        <p className="mt-4 text-sm text-gray-600">
          Market data temporarily unavailable. Please try again shortly.
        </p>
      ) : null}
    </div>
  )
}
