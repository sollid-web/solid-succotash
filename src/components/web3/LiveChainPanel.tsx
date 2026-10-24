'use client'
import { useReadContracts, useBlockNumber } from 'wagmi'
import { bsc } from 'wagmi/chains'
import { formatUnits } from 'viem'
import { WalletProviderClient } from '@/_client/WalletProviderClient'
import { WOLV_TOKEN, WOLV_POOL, BURN_ADDRESS, ERC20_ABI, POOL_ABI, bscscanToken } from '@/lib/contracts'
import CountUp from './CountUp'
import GlassCard from './GlassCard'

const toNum = (v: unknown) => (typeof v === 'bigint' ? Number(formatUnits(v, 18)) : undefined)

function Metric({ label, value, sub, accent }: { label: string; value?: number; sub: string; accent: string }) {
  return (
    <GlassCard tilt={4} className="p-5">
      <div className="mb-2 text-[11px] uppercase tracking-[0.14em] text-white/45">{label}</div>
      <div className="text-2xl font-bold" style={{ color: accent, fontFamily: "'DM Mono', monospace" }}>
        {value === undefined ? <span className="inline-block h-7 w-28 animate-pulse rounded bg-white/10 align-middle" /> : <CountUp value={Math.round(value)} />}
      </div>
      <div className="mt-1 text-[11px] text-white/35">{sub}</div>
    </GlassCard>
  )
}

function Panel() {
  const { data: block } = useBlockNumber({ chainId: bsc.id, query: { refetchInterval: 30_000 } })
  const { data, isLoading, isError } = useReadContracts({
    allowFailure: true,
    query: { refetchInterval: 30_000 },
    contracts: [
      { chainId: bsc.id, address: WOLV_TOKEN, abi: ERC20_ABI, functionName: 'totalSupply' },
      { chainId: bsc.id, address: WOLV_TOKEN, abi: ERC20_ABI, functionName: 'balanceOf', args: [BURN_ADDRESS] },
      { chainId: bsc.id, address: WOLV_POOL, abi: POOL_ABI, functionName: 'poolBalance' },
    ],
  })
  const total = toNum(data?.[0]?.result)
  const burned = toNum(data?.[1]?.result)
  const pool = toNum(data?.[2]?.result)
  const circulating = total !== undefined && burned !== undefined ? total - burned : undefined

  return (
    <GlassCard tilt={0} rim strong className="p-6 sm:p-8">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className="live-dot" style={isError ? { background: '#f59e0b' } : undefined} />
        <span className="text-sm font-bold tracking-wide text-white">{isError ? 'Chain data unavailable' : isLoading ? 'Syncing with BNB Chain…' : 'Live BNB Chain data'}</span>
        {block !== undefined && <span className="text-xs text-white/40" style={{ fontFamily: "'DM Mono', monospace" }}>block #{block.toLocaleString()}</span>}
        <a href={bscscanToken(WOLV_TOKEN)} target="_blank" rel="noopener noreferrer" className="ml-auto text-xs font-semibold text-blue-300 hover:text-blue-200">Verify on BscScan ↗</a>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Total supply" value={total} sub="Read directly from the contract" accent="#60a5fa" />
        <Metric label="Circulating" value={circulating} sub="Total minus burn address" accent="#00c9b1" />
        <Metric label="Reward pool" value={pool} sub="poolBalance() on-chain" accent="#a78bfa" />
        <Metric label="Burned" value={burned} sub="Held at the dead address" accent="#93c5fd" />
      </div>
    </GlassCard>
  )
}

export default function LiveChainPanel() {
  return (
    <WalletProviderClient>
      <Panel />
    </WalletProviderClient>
  )
}
