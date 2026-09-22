'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const WOLV_CONTRACT = '0xe0167279aef7bf4ad313d261da82e8366822270c'

const PLANS = [
  { id: 0, name: 'Pioneer',    apy: 8,  days: 90,  min: 100,    max: 999,    color: '#00a896', label: '8% APY · 90 days'  },
  { id: 1, name: 'Vanguard',   apy: 12, days: 150, min: 1000,   max: 4999,   color: '#3b82f6', label: '12% APY · 150 days' },
  { id: 2, name: 'Horizon',    apy: 18, days: 180, min: 5000,   max: 14999,  color: '#8b5cf6', label: '18% APY · 180 days' },
  { id: 3, name: 'Summit VIP', apy: 25, days: 365, min: 15000,  max: 100000, color: '#f59e0b', label: '25% APY · 365 days' },
]

function useWolvPrice() {
  const [price, setPrice] = useState<number | null>(null)
  useEffect(() => {
    fetch(`https://api.dexscreener.com/latest/dex/tokens/${WOLV_CONTRACT}`)
      .then(r => r.json())
      .then(d => {
        const p = Number(d?.pairs?.[0]?.priceUsd ?? 0)
        if (p > 0) setPrice(p)
      })
      .catch(() => {})
  }, [])
  return price
}

function fmt(n: number, decimals = 2) {
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

export default function ROICalculator() {
  const [selectedPlan, setSelectedPlan] = useState(0)
  const [amount, setAmount] = useState('1000')
  const wolvPrice = useWolvPrice()

  const plan = PLANS[selectedPlan]
  const principal = Math.max(0, Number(amount.replace(/[^0-9.]/g, '')) || 0)

  // Simple interest: principal × (APY/100) × (days/365)
  const earningsUSD   = principal * (plan.apy / 100) * (plan.days / 365)
  const earningsWOLV  = wolvPrice && wolvPrice > 0 ? earningsUSD / wolvPrice : null
  const totalUSD      = principal + earningsUSD
  const dailyUSD      = earningsUSD / plan.days

  const belowMin = principal > 0 && principal < plan.min
  const aboveMax = principal > plan.max

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '')
    setAmount(raw)
  }, [])

  // Auto-select plan based on amount
  useEffect(() => {
    const n = Number(amount.replace(/[^0-9.]/g, '')) || 0
    if (n >= 15000) setSelectedPlan(3)
    else if (n >= 5000) setSelectedPlan(2)
    else if (n >= 1000) setSelectedPlan(1)
    else setSelectedPlan(0)
  }, [amount])

  return (
    <section className="py-16 md:py-24 bg-[#070B19] relative overflow-hidden">
      {/* grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,168,150,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,168,150,0.6) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      {/* glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,168,150,0.07) 0%, transparent 70%)' }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-[11px] font-bold tracking-widest uppercase text-teal-400">
            Scenario information
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Review terms before participating
          </h2>
          <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
            This calculator is not a promise or forecast. Review the current terms, fees, lock periods, liquidity, and risks independently.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* ── Left: Inputs ── */}
          <div
            className="rounded-2xl p-6 space-y-6"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Amount input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
                Investment Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="1,000"
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl pl-8 pr-4 py-3.5 text-white text-xl font-bold font-mono focus:outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/30 transition placeholder:text-slate-600"
                />
              </div>
              {belowMin && (
                <p className="mt-1.5 text-xs text-amber-400">
                  Minimum for {plan.name} is ${plan.min.toLocaleString()}
                </p>
              )}
              {aboveMax && (
                <p className="mt-1.5 text-xs text-amber-400">
                  Maximum for {plan.name} is ${plan.max.toLocaleString()}
                </p>
              )}
            </div>

            {/* Plan selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
                Staking Plan
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PLANS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlan(p.id)}
                    className="relative rounded-xl p-3 text-left transition-all border"
                    style={{
                      background: selectedPlan === p.id ? `${p.color}18` : 'rgba(255,255,255,0.03)',
                      borderColor: selectedPlan === p.id ? `${p.color}60` : 'rgba(255,255,255,0.08)',
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                      <span className="text-xs font-bold text-white">{p.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{p.label}</span>
                    {selectedPlan === p.id && (
                      <div
                        className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: p.color }}
                      >
                        <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-white fill-current">
                          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick amount presets */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
                Quick Select
              </label>
              <div className="flex flex-wrap gap-2">
                {[500, 1000, 5000, 10000, 25000].map((v) => (
                  <button
                    key={v}
                    onClick={() => setAmount(String(v))}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition border"
                    style={{
                      background: Number(amount) === v ? 'rgba(0,168,150,0.15)' : 'rgba(255,255,255,0.04)',
                      borderColor: Number(amount) === v ? 'rgba(0,168,150,0.4)' : 'rgba(255,255,255,0.08)',
                      color: Number(amount) === v ? '#00a896' : '#94a3b8',
                    }}
                  >
                    ${v.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Results ── */}
          <div className="space-y-4">

            {/* Main result card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedPlan}-${Math.floor(principal / 100)}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl p-6"
                style={{
                  background: `linear-gradient(135deg, ${plan.color}18 0%, rgba(7,11,25,0.9) 60%)`,
                  border: `1px solid ${plan.color}40`,
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: plan.color }} />
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: plan.color }}>
                    {plan.name} · {plan.apy}% APY
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Illustrative output</div>
                    <div className="text-4xl font-extrabold text-white font-mono">
                      ${principal > 0 ? fmt(earningsUSD) : '0.00'}
                    </div>
                    {earningsWOLV !== null && principal > 0 && (
                      <div className="text-sm mt-1 font-mono" style={{ color: plan.color }}>
                        ≈ {fmt(earningsWOLV, 0)} WOLV tokens
                      </div>
                    )}
                  </div>

                  <div className="h-px bg-white/[0.06]" />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-xs text-slate-500 mb-0.5">Principal</div>
                      <div className="font-bold text-white font-mono">${principal > 0 ? fmt(principal) : '—'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-0.5">Total Value</div>
                      <div className="font-bold text-white font-mono">${principal > 0 ? fmt(totalUSD) : '—'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-0.5">Lock Period</div>
                      <div className="font-bold text-white">{plan.days} days</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-0.5">Daily Earnings</div>
                      <div className="font-bold font-mono" style={{ color: plan.color }}>
                        {principal > 0 ? `$${fmt(dailyUSD)}` : '—'}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* WOLV price note */}
            {wolvPrice && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] text-slate-500"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse flex-shrink-0" />
                Live WOLV price: <span className="text-teal-400 font-mono font-semibold ml-1">${wolvPrice.toFixed(8)}</span>
                <span className="ml-auto">via DEXScreener</span>
              </div>
            )}

            {/* CTA */}
            <Link
              href="/accounts/signup"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-white text-sm transition-all"
              style={{
                background: `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)`,
                boxShadow: `0 4px 24px ${plan.color}30`,
              }}
            >
              Start Earning with {plan.name}
              <svg viewBox="0 0 16 16" className="w-4 h-4 fill-current">
                <path d="M8 0l8 8-8 8-1.4-1.4L12.2 9H0V7h12.2L6.6 1.4z" />
              </svg>
            </Link>

            <p className="text-[10px] text-slate-600 text-center leading-relaxed">
              This tool is informational only and should not be used as a forecast or investment decision.
              Digital assets can lose value. Review the full risk disclosure and current terms before taking action.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
