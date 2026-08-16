"use client"

import { useEffect, useMemo, useRef, useState } from 'react'

type LiveMarketTickerProps = {
  refreshMs?: number
}

type AssetKey = 'bitcoin' | 'ethereum' | 'solana' | 'binancecoin'

type MarketRow = {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h_in_currency?: number | null
  sparkline_in_7d?: { price?: number[] }
}

type AssetView = {
  id: AssetKey
  name: string
  symbol: string
  priceUsd: number
  change24hPct: number
  sparkline24h: number[]
}

type TickerState =
  | { status: 'loading'; data?: AssetView[]; error?: string }
  | { status: 'ready'; data: AssetView[]; error?: string }
  | { status: 'error'; data?: AssetView[]; error: string }

const ASSETS: Array<{ id: AssetKey; label: string; symbol: string }> = [
  { id: 'bitcoin', label: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', label: 'Ethereum', symbol: 'ETH' },
  { id: 'solana', label: 'Solana', symbol: 'SOL' },
  { id: 'binancecoin', label: 'BNB', symbol: 'BNB' },
]

const MARKET_DATA_URL = (idsCsv: string) =>
  `/market-data?ids=${encodeURIComponent(idsCsv)}`

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

function Sparkline({ values, tone, animateKey }: { values: number[]; tone: 'up' | 'down' | 'flat'; animateKey: string }) {
  const width = 120
  const height = 28
  const padding = 2

  const points = useMemo(() => {
    if (!values.length) return ''
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = Math.max(1e-9, max - min)

    return values
      .map((v, idx) => {
        const x = (idx / Math.max(1, values.length - 1)) * (width - padding * 2) + padding
        const y = (1 - (v - min) / range) * (height - padding * 2) + padding
        return `${x.toFixed(2)},${y.toFixed(2)}`
      })
      .join(' ')
  }, [values])

  const strokeClass =
    tone === 'up' ? 'text-green-600' : tone === 'down' ? 'text-red-600' : 'text-gray-400'

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="shrink-0"
      aria-hidden="true"
    >
      <polyline
        key={animateKey}
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        className={`${strokeClass} [stroke-dasharray:1] [stroke-dashoffset:0] animate-sparkline-draw`}
      />
    </svg>
  )
}

export default function LiveMarketTicker({ refreshMs = 90_000 }: LiveMarketTickerProps) {
  const [state, setState] = useState<TickerState>({ status: 'loading' })
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    let mounted = true
    const controller = new AbortController()

    const tick = async () => {
      const attemptAt = new Date()
      try {
        const idsCsv = ASSETS.map((a) => a.id).join(',')
        const res = await fetch(MARKET_DATA_URL(idsCsv), {
          method: 'GET',
          headers: { Accept: 'application/json' },
          cache: 'no-store',
          signal: controller.signal,
        })

        if (!res.ok) throw new Error(`Market data request failed (${res.status})`)

        const rows = (await res.json()) as MarketRow[]
        const byId = new Map(rows.map((r) => [r.id, r]))

        const data: AssetView[] = ASSETS.map((asset) => {
          const row = byId.get(asset.id)
          const price = typeof row?.current_price === 'number' ? row.current_price : null
          const change =
            typeof row?.price_change_percentage_24h_in_currency === 'number'
              ? row.price_change_percentage_24h_in_currency
              : null
          const spark7d = Array.isArray(row?.sparkline_in_7d?.price) ? row!.sparkline_in_7d!.price! : null

          if (price === null || change === null || !spark7d?.length) {
            throw new Error('Unexpected market data format')
          }

          const sparkline24h = spark7d.slice(-24)

          return {
            id: asset.id,
            name: asset.label,
            symbol: asset.symbol,
            priceUsd: price,
            change24hPct: change,
            sparkline24h,
          }
        })

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
  }, [refreshMs])

  const lastUpdatedText = lastUpdated
    ? new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        month: 'short',
        day: '2-digit',
      }).format(lastUpdated)
    : null

  const items = state.data ?? []

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-xl font-bold text-[#0b2f6b]">Live Market Ticker</h3>
          <p className="text-sm text-gray-600">
            Educational reference prices only. No predictions, signals, or guarantees.
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

      <div className="mt-5 space-y-3">
        {items.map((asset) => {
          const tone = asset.change24hPct > 0 ? 'up' : asset.change24hPct < 0 ? 'down' : 'flat'
          const changeClass =
            tone === 'up' ? 'text-green-700' : tone === 'down' ? 'text-red-700' : 'text-gray-600'

          return (
            <div
              key={asset.id}
              className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 p-4"
            >
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <div className="text-sm font-semibold text-gray-800">{asset.symbol}</div>
                  <div className="text-xs text-gray-500 truncate">{asset.name}</div>
                </div>
                <div className="mt-1 flex items-baseline gap-3">
                  <div className="text-lg font-extrabold text-[#0b2f6b]">{formatUsd(asset.priceUsd)}</div>
                  <div className={`text-sm font-bold ${changeClass}`}>{formatPct(asset.change24hPct)}</div>
                  <div className="text-xs text-gray-500">24h</div>
                </div>
              </div>

              <div className="flex items-center">
                <Sparkline
                  values={asset.sparkline24h}
                  tone={tone}
                  animateKey={`${asset.id}-${lastUpdated?.getTime() ?? 'init'}`}
                />
              </div>
            </div>
          )
        })}
      </div>

      {state.status === 'loading' && !state.data ? (
        <p className="mt-4 text-sm text-gray-600">Loading live market data…</p>
      ) : state.status === 'error' ? (
        <p className="mt-4 text-sm text-gray-600">Market data temporarily unavailable. Please try again shortly.</p>
      ) : null}

      <style jsx>{`
        @keyframes sparkline-draw {
          from {
            stroke-dashoffset: 1;
            opacity: 0.7;
          }
          to {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
        :global(.animate-sparkline-draw) {
          animation: sparkline-draw 650ms ease-out;
        }
      `}</style>
    </div>
  )
}
