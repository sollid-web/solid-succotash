'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ChainStats {
  holders: number
  poolWolv: string
  updatedAt: number
}

interface DexPrice {
  price: string
  change24h: string
  positive: boolean
}

const WOLV_CONTRACT = '0xe0167279aef7bf4ad313d261da82e8366822270c'
const DEXSCREENER_API = `https://api.dexscreener.com/latest/dex/tokens/${WOLV_CONTRACT}`

function Pulse() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400" />
    </span>
  )
}

function StatItem({
  label,
  value,
  sub,
  highlight,
}: {
  label: string
  value: string
  sub?: string
  highlight?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-4 sm:px-6 border-r border-white/10 last:border-0">
      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">{label}</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={value}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3 }}
          className={`text-sm sm:text-base font-bold font-mono ${highlight ? 'text-teal-400' : 'text-white'}`}
        >
          {value}
        </motion.span>
      </AnimatePresence>
      {sub && (
        <span className={`text-[10px] font-semibold ${sub.startsWith('+') ? 'text-emerald-400' : sub.startsWith('-') ? 'text-red-400' : 'text-slate-500'}`}>
          {sub}
        </span>
      )}
    </div>
  )
}

export default function LiveStatsTicker() {
  const [chain, setChain] = useState<ChainStats | null>(null)
  const [dex, setDex] = useState<DexPrice | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  const fetchChain = useCallback(async () => {
    try {
      const res = await fetch('/api/chain-stats', { next: { revalidate: 60 } } as RequestInit)
      if (res.ok) setChain(await res.json())
    } catch { /* silent */ }
  }, [])

  const fetchDex = useCallback(async () => {
    try {
      const res = await fetch(DEXSCREENER_API)
      if (!res.ok) return
      const data = await res.json()
      const pair = data?.pairs?.[0]
      if (!pair) return
      const change = Number(pair.priceChange?.h24 ?? 0)
      setDex({
        price:    pair.priceUsd ? `$${Number(pair.priceUsd).toFixed(8)}` : '—',
        change24h: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
        positive:  change >= 0,
      })
    } catch { /* silent */ }
  }, [])

  useEffect(() => {
    fetchChain()
    fetchDex()
    const interval = setInterval(() => {
      fetchChain()
      fetchDex()
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }, 60_000)
    setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    return () => clearInterval(interval)
  }, [fetchChain, fetchDex])

  return (
    <div className="w-full bg-[#070d1a]/90 border-b border-white/[0.06] backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 py-3">
        {/* Top label row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Pulse />
            <span className="text-[10px] uppercase tracking-widest text-teal-400 font-bold">Live reference data</span>
          </div>
          {lastUpdated && (
            <span className="text-[10px] text-slate-600 font-mono">Updated {lastUpdated}</span>
          )}
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-center sm:justify-between flex-wrap gap-y-2 overflow-x-auto">
          <StatItem
            label="WOLV Price"
            value={dex?.price ?? '—'}
            sub={dex?.change24h}
            highlight
          />
          <StatItem
            label="Network"
            value="BNB Chain"
          />
          <StatItem
            label="Holders"
            value={chain ? chain.holders.toLocaleString() : '—'}
            highlight
          />
          <StatItem
            label="Reward Pool"
            value={chain?.poolWolv ?? '—'}
            sub="WOLV"
          />
          <StatItem
            label="Contract"
            value="Public reference"
          />
          <div className="flex flex-col items-center gap-0.5 px-4 sm:px-6">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">DEX</span>
            <a
              href={`https://pancakeswap.finance/swap?outputCurrency=${WOLV_CONTRACT}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-amber-400 hover:text-amber-300 transition"
            >
              PancakeSwap ↗
            </a>
          </div>
        </div>
        <p className="mt-3 text-center text-[10px] text-slate-500">Sources: DexScreener and the public chain-stats endpoint. Values are informational, may be delayed, and are not proof of reserves, performance, or security. <a href="/metrics-methodology" className="font-semibold underline hover:text-slate-300">Methodology and limits</a>.</p>
      </div>
    </div>
  )
}
