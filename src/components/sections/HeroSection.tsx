'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslation } from '@/components/TranslationProvider'
import { MotionLink, pressableTapProps } from '@/lib/motionPress'

const WOLV_CONTRACT = '0xe0167279aef7bf4ad313d261da82e8366822270c'

function useLiveWolvPrice() {
  const [price, setPrice] = useState<string | null>(null)
  const [change, setChange] = useState<number | null>(null)

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${WOLV_CONTRACT}`)
      if (!res.ok) return
      const data = await res.json()
      const pair = data?.pairs?.[0]
      if (!pair) return
      setPrice(pair.priceUsd ? `$${Number(pair.priceUsd).toFixed(8)}` : null)
      setChange(Number(pair.priceChange?.h24 ?? 0))
    } catch { /* silent */ }
  }, [])

  useEffect(() => {
    fetch_()
    const id = setInterval(fetch_, 60_000)
    return () => clearInterval(id)
  }, [fetch_])

  return { price, change }
}

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


// Entrance stagger: headline -> description -> presale badge -> APY cards -> CTA buttons.
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 20 } },
}


export default function HeroSection() {
  const { t } = useTranslation()
  const { price: wolvPrice, change: wolvChange } = useLiveWolvPrice()
  const [timeLeft, setTimeLeft] = useState<string | null>(
    formatTimeLeft(PRESALE_END_TIME - Math.floor(Date.now() / 1000)),
  )
  const [presaleEnded, setPresaleEnded] = useState(Math.floor(Date.now() / 1000) >= PRESALE_END_TIME)

  useEffect(() => {
    const tick = () => {
      const secondsLeft = PRESALE_END_TIME - Math.floor(Date.now() / 1000)
      setTimeLeft(formatTimeLeft(secondsLeft))
      setPresaleEnded(secondsLeft <= 0)
    }
    tick()
    const interval = setInterval(tick, 60_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen bg-[#070B19] text-white flex flex-col justify-center px-4 py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-[#070B19] pointer-events-none z-0" />

      {/* Ambient glow orbs. Previously 4 layered elements at blur-120/140px with
          backdrop-blur-xl cards sampling them every frame — real scroll jank,
          especially on mobile. Back to 2, lighter blur, GPU-hinted via willChange. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-16 top-8 w-[400px] h-[400px] rounded-full bg-blue-600/15 blur-[90px] z-0"
        style={{ willChange: 'transform, opacity' }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.12, 0.18, 0.12] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-10 bottom-10 w-[350px] h-[350px] rounded-full bg-amber-500/10 blur-[90px] z-0"
        style={{ willChange: 'transform, opacity' }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.12, 0.18, 0.12] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Sleek low-opacity dot-grid texture so the ambient light filters through a subtle technical surface. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03] z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-xl mx-auto w-full space-y-6"
      >
        <motion.div variants={itemVariants}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-300">
            Invest · Stake · Earn — All On-Chain
          </p>

          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
              {t('hero.title')}
            </span>
          </h1>
        </motion.div>

        <motion.p variants={itemVariants} className="text-sm sm:text-base text-slate-300 leading-relaxed">
          {t('hero.subtitle')}
        </motion.p>

        {/* Live WOLV price badge */}
        {wolvPrice && (
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.05] border border-white/10 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-slate-400">
                <img src="/wolv-icon.svg" alt="WOLV" className="w-4 h-4 rounded-full" />
                WOLV
              </span>
              <span className="text-white font-bold">{wolvPrice}</span>
              {wolvChange !== null && (
                <span className={wolvChange >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                  {wolvChange >= 0 ? '+' : ''}{wolvChange.toFixed(2)}%
                </span>
              )}
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
            </div>
          </motion.div>
        )}

        {/* DEX Listing badge */}
        <motion.div variants={itemVariants}>
          <a
            href="https://pancakeswap.finance/swap?outputCurrency=0xe0167279aef7bf4ad313d261da82e8366822270c"
            target="_blank"
            rel="noopener noreferrer"
            className={`block p-4 rounded-xl bg-[#0b1329]/60 border border-white/10 border-t-white/20 backdrop-blur-md space-y-2 hover:border-teal-400/40 transition ${glassGlow}`}
          >
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-2 font-semibold text-teal-400">
                <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
                🚀 WOLV Now Live on PancakeSwap
              </span>
              <span className="text-slate-400">BSC · V2</span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400">
              <span>Contract verified · 231+ holders · BNB Chain</span>
              <span className="text-teal-400 font-semibold">Buy WOLV →</span>
            </div>
          </a>
        </motion.div>

        {/* Action buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 pt-1">
          {!presaleEnded && (
            <MotionLink
              href="/presale"
              {...pressableTapProps}
              className="w-full sm:flex-1 py-3 px-6 rounded-lg font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transition shadow-lg shadow-orange-500/20 text-center"
            >
              Join Presale →
            </MotionLink>
          )}
          <a
            href="https://pancakeswap.finance/swap?outputCurrency=0xe0167279aef7bf4ad313d261da82e8366822270c"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1 py-3 px-6 rounded-lg font-bold text-white bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 transition shadow-lg shadow-teal-500/20 text-center"
          >
            Buy WOLV on PancakeSwap →
          </a>
        </motion.div>

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
      </motion.div>
    </section>
  )
}
