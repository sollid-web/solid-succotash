'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useAccount, useReadContract } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { formatUnits } from 'viem'
import { WalletProviderClient } from '@/_client/WalletProviderClient'

const WOLV_ADDRESS = '0xe0167279aef7bf4ad313d261da82e8366822270c' as const
const STAKING_ADDRESS = '0x7cd22f3c08b4195225da7d043cbe00da118d31ec' as const
const POOL_ADDRESS = '0x7310f3e07627ce98246973e068bf2ff294f84e5f' as const
const PANCAKESWAP_URL = `https://pancakeswap.finance/swap?outputCurrency=${WOLV_ADDRESS}`

const ERC20_ABI = [
  { name: 'totalSupply', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }] },
] as const

const POOL_ABI = [
  { name: 'poolBalance', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
] as const

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

function formatTokenValue(value: bigint | undefined, maximumFractionDigits = 0) {
  if (value === undefined) return '—'
  return Number(formatUnits(value, 18)).toLocaleString('en-US', { maximumFractionDigits })
}

function useWolvMarketData() {
  const [market, setMarket] = useState<{ price: string; change: number; liquidity: string } | null>(null)
  const refresh = useCallback(async () => {
    try {
      const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${WOLV_ADDRESS}`)
      if (!response.ok) return
      const data = await response.json()
      const pair = data?.pairs?.[0]
      if (!pair) return
      setMarket({
        price: pair.priceUsd ? `$${Number(pair.priceUsd).toFixed(8)}` : '—',
        change: Number(pair.priceChange?.h24 ?? 0),
        liquidity: pair.liquidity?.usd ? `$${Number(pair.liquidity.usd).toLocaleString('en-US', { maximumFractionDigits: 0 })}` : '—',
      })
    } catch {
      // Market data is informational and should never block the page.
    }
  }, [])
  useEffect(() => {
    refresh()
    const timer = window.setInterval(refresh, 60_000)
    return () => window.clearInterval(timer)
  }, [refresh])
  return market
}

function CopyContractButton() {
  const [copied, setCopied] = useState(false)
  async function copy() {
    await navigator.clipboard.writeText(WOLV_ADDRESS)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }
  return <button type="button" onClick={copy} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[11px] text-slate-300 transition hover:border-emerald-300/40 hover:bg-emerald-300/10"><span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.8)]" />{copied ? 'Copied contract' : `${shortenAddress(WOLV_ADDRESS)} · copy`}</button>
}

function WalletCTA() {
  const { address, isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  if (isConnected && address) return <Link href="/dashboard/stake" className="inline-flex items-center justify-center gap-3 rounded-xl bg-emerald-300 px-5 py-3 text-sm font-bold text-[#07100e] shadow-[0_0_32px_rgba(110,231,183,0.2)] transition hover:-translate-y-0.5 hover:bg-emerald-200">Open staking app <span aria-hidden>↗</span></Link>
  return <button type="button" onClick={() => openConnectModal?.()} className="inline-flex items-center justify-center gap-3 rounded-xl bg-emerald-300 px-5 py-3 text-sm font-bold text-[#07100e] shadow-[0_0_32px_rgba(110,231,183,0.2)] transition hover:-translate-y-0.5 hover:bg-emerald-200">Connect wallet <span aria-hidden>→</span></button>
}

function TokenomicsRing() {
  return <div className="relative flex h-56 w-56 shrink-0 items-center justify-center"><svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-label="WOLV token supply visualization"><circle cx="60" cy="60" r="46" fill="none" stroke="#15211e" strokeWidth="12" /><circle cx="60" cy="60" r="46" fill="none" stroke="#6ee7b7" strokeWidth="12" strokeDasharray="115 289" strokeLinecap="round" /><circle cx="60" cy="60" r="46" fill="none" stroke="#f5c451" strokeWidth="12" strokeDasharray="74 289" strokeDashoffset="-123" strokeLinecap="round" /><circle cx="60" cy="60" r="46" fill="none" stroke="#51645d" strokeWidth="12" strokeDasharray="100 289" strokeDashoffset="-205" strokeLinecap="round" /></svg><div className="absolute text-center"><div className="font-mono text-2xl font-bold text-white">1B</div><div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">WOLV max</div></div></div>
}

function HomePageContent() {
  const market = useWolvMarketData()
  const { address } = useAccount()
  const { data: totalSupply } = useReadContract({ address: WOLV_ADDRESS, abi: ERC20_ABI, functionName: 'totalSupply' })
  const { data: walletBalance } = useReadContract({ address: WOLV_ADDRESS, abi: ERC20_ABI, functionName: 'balanceOf', args: address ? [address] : undefined, query: { enabled: Boolean(address) } })
  const { data: poolBalance } = useReadContract({ address: POOL_ADDRESS, abi: POOL_ABI, functionName: 'poolBalance' })
  const stats = useMemo(() => [
    { label: 'WOLV price', value: market?.price ?? 'Loading…', detail: market ? `${market.change >= 0 ? '+' : ''}${market.change.toFixed(2)}% / 24h` : 'DexScreener reference' },
    { label: 'Reward pool', value: poolBalance ? `${formatTokenValue(poolBalance)} WOLV` : '—', detail: 'Read from contract' },
    { label: 'Max supply', value: totalSupply ? `${formatTokenValue(totalSupply)} WOLV` : '1,000,000,000', detail: 'BEP-20 token supply' },
    { label: 'Liquidity', value: market?.liquidity ?? '—', detail: 'Public market reference' },
  ], [market, poolBalance, totalSupply])

  return <div className="relative overflow-hidden bg-[#07100e] text-white">
    <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(110,231,183,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(110,231,183,0.07)_1px,transparent_1px)] [background-size:72px_72px]" /><div className="pointer-events-none absolute -left-40 top-20 h-[480px] w-[480px] rounded-full bg-emerald-400/10 blur-[120px]" /><div className="pointer-events-none absolute right-[-180px] top-[520px] h-[560px] w-[560px] rounded-full bg-yellow-400/[0.07] blur-[130px]" />
    <section className="relative mx-auto grid max-w-7xl gap-14 px-5 pb-20 pt-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pb-28 lg:pt-28"><div><div className="mb-7 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-emerald-200/70"><span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.06] px-3 py-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> BNB Smart Chain</span><span>Non-custodial · on-chain</span></div><h1 className="max-w-3xl text-5xl font-semibold leading-[0.96] tracking-[-0.06em] sm:text-7xl lg:text-[6.6rem]">Put your WOLV to work <span className="text-emerald-300">on-chain.</span></h1><p className="mt-7 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">A transparent staking protocol for the WOLV community. Connect a wallet, review the contract, and interact directly on BNB Smart Chain.</p><div className="mt-9 flex flex-wrap gap-3"><WalletCTA /><Link href="/verification-pack" className="inline-flex items-center justify-center rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/25 hover:bg-white/[0.05]">Review references</Link></div><div className="mt-7 flex flex-wrap items-center gap-3"><CopyContractButton /><a href={PANCAKESWAP_URL} target="_blank" rel="noreferrer" className="font-mono text-[11px] text-slate-500 underline decoration-white/10 underline-offset-4 hover:text-emerald-200">View WOLV market ↗</a></div></div><div className="relative rounded-[2rem] border border-white/10 bg-[#0d1916]/80 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-7"><div className="absolute right-5 top-5 flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.06] px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-emerald-200"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" /> Live reference</div><div className="mb-10 mt-10 flex items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.2em] text-slate-500">WOLV / BNB</p><p className="mt-3 font-mono text-4xl font-medium tracking-[-0.05em] text-white">{market?.price ?? '—'}</p></div><div className="text-right"><p className="text-xs text-slate-500">24h change</p><p className={`mt-2 font-mono text-sm ${market?.change && market.change < 0 ? 'text-rose-300' : 'text-emerald-300'}`}>{market ? `${market.change >= 0 ? '+' : ''}${market.change.toFixed(2)}%` : '—'}</p></div></div><div className="h-px bg-white/10" /><div className="mt-6 grid grid-cols-2 gap-3">{stats.slice(1, 3).map((stat) => <div key={stat.label} className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs text-slate-500">{stat.label}</p><p className="mt-2 truncate font-mono text-sm font-medium text-slate-100">{stat.value}</p><p className="mt-1 text-[10px] text-slate-600">{stat.detail}</p></div>)}</div><div className="mt-5 rounded-2xl border border-yellow-300/15 bg-yellow-300/[0.05] p-4 text-xs leading-5 text-yellow-100/70">Market data is informational only. Verify the token address, liquidity, and transaction details independently before interacting.</div></div></section>
    <section className="relative border-y border-white/10 bg-black/10"><div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">{stats.map((stat) => <div key={stat.label} className="px-5 py-6 sm:px-8"><p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{stat.label}</p><p className="mt-2 truncate font-mono text-sm text-slate-100 sm:text-base">{stat.value}</p><p className="mt-1 text-[10px] text-slate-600">{stat.detail}</p></div>)}</div></section>
    <section id="staking" className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32"><div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center"><div><p className="text-xs uppercase tracking-[0.22em] text-emerald-300">The protocol</p><h2 className="mt-4 max-w-lg text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">A clearer path from wallet to position.</h2><p className="mt-6 max-w-lg leading-7 text-slate-400">No custody layer. No opaque dashboard balances. Your position is created by the staking contract, and the important references stay public.</p><div className="mt-8 space-y-4">{['Connect a wallet on BNB Smart Chain', 'Review pool terms and contract state', 'Stake through the existing on-chain app'].map((item, index) => <div key={item} className="flex items-center gap-4 text-sm text-slate-300"><span className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-300/20 font-mono text-xs text-emerald-300">0{index + 1}</span>{item}</div>)}</div><div className="mt-9"><Link href="/dashboard/stake" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-emerald-200">Open staking app <span>↗</span></Link></div></div><div className="rounded-[2rem] border border-white/10 bg-[#0d1916] p-5 sm:p-8"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.2em] text-slate-500">Wallet snapshot</p><p className="mt-2 font-mono text-sm text-slate-300">{address ? shortenAddress(address) : 'Wallet not connected'}</p></div><span className="rounded-full bg-emerald-300/10 px-3 py-1 text-[10px] uppercase tracking-widest text-emerald-300">Read-only</span></div><div className="mt-8 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-white/10 bg-black/20 p-5"><p className="text-xs text-slate-500">WOLV in wallet</p><p className="mt-3 font-mono text-2xl text-white">{address ? `${formatTokenValue(walletBalance)} WOLV` : 'Connect to view'}</p></div><div className="rounded-2xl border border-white/10 bg-black/20 p-5"><p className="text-xs text-slate-500">Next action</p><p className="mt-3 text-2xl text-emerald-300">{address ? 'Review stake' : 'Connect wallet'}</p></div></div><div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 px-5 py-4 text-xs text-slate-500"><span>Staking contract</span><a href={`https://bscscan.com/address/${STAKING_ADDRESS}`} target="_blank" rel="noreferrer" className="font-mono text-emerald-300 hover:text-emerald-200">{shortenAddress(STAKING_ADDRESS)} ↗</a></div></div></div></section>
    <section id="tokenomics" className="relative border-t border-white/10 bg-[#091411]"><div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:py-32"><div><p className="text-xs uppercase tracking-[0.22em] text-yellow-300">Supply architecture</p><h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Tokenomics you can trace.</h2><p className="mt-6 max-w-xl leading-7 text-slate-400">WOLV is a BEP-20 token with a maximum supply of 1,000,000,000. Allocation percentages should be read alongside the project documentation and current on-chain records—not treated as a promise of value.</p><div className="mt-8 grid max-w-lg grid-cols-3 gap-3">{[['40%', 'Community'], ['26%', 'Liquidity'], ['34%', 'Protocol']].map(([value, label]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><p className="font-mono text-xl text-white">{value}</p><p className="mt-1 text-[10px] uppercase tracking-widest text-slate-500">{label}</p></div>)}</div></div><div className="flex flex-col items-center justify-center gap-7 rounded-[2rem] border border-white/10 bg-black/20 p-8 sm:flex-row"><TokenomicsRing /><div className="space-y-4 text-xs text-slate-400"><div className="flex items-center gap-3"><span className="h-2.5 w-2.5 rounded-full bg-emerald-300" /> Community</div><div className="flex items-center gap-3"><span className="h-2.5 w-2.5 rounded-full bg-yellow-300" /> Liquidity</div><div className="flex items-center gap-3"><span className="h-2.5 w-2.5 rounded-full bg-slate-500" /> Protocol</div><a href={`https://bscscan.com/token/${WOLV_ADDRESS}`} target="_blank" rel="noreferrer" className="inline-block pt-3 font-semibold text-emerald-300 hover:text-emerald-200">Inspect token contract ↗</a></div></div></div></section>
    <section id="transparency" className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8"><div className="flex flex-col justify-between gap-6 rounded-[2rem] border border-emerald-300/15 bg-emerald-300/[0.05] p-7 sm:flex-row sm:items-center sm:p-10"><div><p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Public by default</p><h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">Read the contracts. Then decide.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">WolvCapital provides public references, not financial advice or a guarantee of returns. Digital assets and smart-contract interactions carry risk.</p></div><Link href="/verification-pack" className="shrink-0 rounded-xl border border-emerald-300/30 px-5 py-3 text-sm font-bold text-emerald-200 transition hover:bg-emerald-300/10">Open verification pack ↗</Link></div></section>
  </div>
}

export default function HomePage() {
  return <WalletProviderClient><HomePageContent /></WalletProviderClient>
}
