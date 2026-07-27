'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslation } from '@/components/TranslationProvider'
import { MotionLink, pressableTapProps } from '@/lib/motionPress'

// Purely additive inner-glow, no color values changed — just a subtle glass edge.
const glassGlow = 'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'

// Immutable constructor args of the deployed WOLVPresale contract
// (0x04b5c5e204e812c176ce632f3781ea88c500497c) — fixed on-chain, safe to hardcode.
const PRESALE_END_TIME = 1785686442 // 2026-08-02T16:00:42Z

function formatTimeLeft(seconds: number) {
  if (seconds <= 0) return null
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return `${d}d ${h}h ${m}m`
}

const PLANS = [
  { plan: 'Pioneer', apy: '8%', days: '90d' },
  { plan: 'Vanguard', apy: '12%', days: '150d' },
  { plan: 'Horizon', apy: '18%', days: '180d' },
  { plan: 'Summit VIP', apy: '25%', days: '365d' },
]

interface HeroSectionProps {
  onPlansClick?: () => void
}

export default function HeroSection({ onPlansClick }: HeroSectionProps) {
  const { t } = useTranslation()
  const [timeLeft, setTimeLeft] = useState<string | null>(
    formatTimeLeft(PRESALE_END_TIME - Math.floor(Date.now() / 1000)),
  )

  useEffect(() => {
    const tick = () => setTimeLeft(formatTimeLeft(PRESALE_END_TIME - Math.floor(Date.now() / 1000)))
    const interval = setInterval(tick, 60_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen bg-[#070B19] text-white flex flex-col justify-center px-4 py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-[#070B19] pointer-events-none" />

      <div className="relative z-10 max-w-xl mx-auto w-full space-y-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-300">
          Invest · Stake · Earn — All On-Chain
        </p>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
            {t('hero.title')}
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          {t('hero.subtitle')}
        </p>

        {/* Presale status card */}
        <MotionLink
          href="/presale"
          {...pressableTapProps}
          className={`block p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-2 hover:border-orange-400/40 transition ${glassGlow}`}
        >
          <div className="flex justify-between items-center text-xs">
            <span className="flex items-center gap-2 font-semibold text-amber-400">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              🔥 WOLV Presale Live
            </span>
            <span className="text-slate-400">$0.50 / WOLV</span>
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-400">
            <span>{timeLeft ? `${timeLeft} left · $50,000 hard cap` : 'Hard cap $50,000'}</span>
            <span className="text-orange-400 font-semibold">Join Presale →</span>
          </div>
        </MotionLink>

        {/* Staking APY tiers */}
        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          {PLANS.map(p => (
            <motion.div
              key={p.plan}
              {...pressableTapProps}
              className={`p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 backdrop-blur-sm ${glassGlow}`}
            >
              <div className="text-slate-400 text-[10px]">{p.plan} ({p.days})</div>
              <div className="text-blue-400 font-bold text-sm">{p.apy} APY</div>
            </motion.div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <MotionLink
            href="/presale"
            {...pressableTapProps}
            className="w-full sm:flex-1 py-3 px-6 rounded-lg font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transition shadow-lg shadow-orange-500/20 text-center"
          >
            Join Presale →
          </MotionLink>
          <MotionLink
            href="/plans"
            onClick={() => onPlansClick?.()}
            {...pressableTapProps}
            className="w-full sm:flex-1 py-3 px-6 rounded-lg font-semibold text-slate-200 border border-slate-700 bg-slate-900/50 hover:bg-slate-800 transition text-center"
          >
            {t('hero.button.viewPlans')}
          </MotionLink>
        </div>

        <Link href="/accounts/signup" className="block text-center text-sm text-blue-300 hover:text-blue-200 underline underline-offset-2">
          {t('hero.button.openAccount')} →
        </Link>

        {/* Trust badges */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-wrap justify-between gap-2 text-[10px] text-slate-400 tracking-wider">
          <span>{t('hero.badge.encryption')}</span>
          <span>{t('hero.badge.custody')}</span>
          <span>{t('hero.badge.fincen')}</span>
          <span>BNB CHAIN VERIFIED</span>
        </div>
      </div>
    </section>
  )
}
