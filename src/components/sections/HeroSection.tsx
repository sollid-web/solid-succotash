'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslation } from '@/components/TranslationProvider'
import { MotionLink, pressableTapProps } from '@/lib/motionPress'
import GlassCard from '@/components/web3/GlassCard'
import TokenOrb from '@/components/web3/TokenOrb'
import AddWolvToWallet from '@/components/web3/AddWolvToWallet'
import { pancakeSwapUrl } from '@/lib/contracts'

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

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 20 } },
}

export default function HeroSection() {
  const { t } = useTranslation()
  const { price: wolvPrice, change: wolvChange } = useLiveWolvPrice()

  return (
    <section className="relative min-h-[100svh] text-white flex items-center px-4 py-16 overflow-hidden">
      {/* Aurora mesh lives in AppChrome; this just adds a soft vignette into the page below. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#060c1a]/80 z-0" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
          <motion.div variants={itemVariants}>
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-200" style={{ borderRadius: 9999 }}>
              <span className="live-dot" />
              WOLV data · BNB Smart Chain · Risk information
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]">
              <span className="text-gradient">{t('hero.title')}</span>
            </h1>
          </motion.div>

          <motion.p variants={itemVariants} className="max-w-xl text-base sm:text-lg text-slate-300 leading-relaxed">
            {t('hero.subtitle')}
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 pt-1">
            <MotionLink href="/how-it-works" {...pressableTapProps} className="btn-glow">Explore how it works →</MotionLink>
            <Link href="/verification-pack" className="btn-glass">Review public references →</Link>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-[10px] tracking-wider text-slate-400">
            <span>{t('hero.badge.encryption')}</span>
            <span>{t('hero.badge.custody')}</span>
            <span>{t('hero.badge.kyc')}</span>
            <span>PUBLIC CONTRACT REFERENCES</span>
          </motion.div>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col items-center gap-6">
          <motion.div variants={itemVariants}><TokenOrb size={230} /></motion.div>

          <motion.div variants={itemVariants} className="w-full max-w-sm">
            <GlassCard rim strong tilt={6} className="p-5 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-semibold text-teal-300"><span className="live-dot" />WOLV market reference</span>
                <span className="text-slate-400">BSC · V2</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold" style={{ fontFamily: "'DM Mono', monospace" }}>
                  {wolvPrice ?? <span className="inline-block h-7 w-32 animate-pulse rounded bg-white/10 align-middle" />}
                </span>
                {wolvChange !== null && (
                  <span className={`text-sm font-semibold ${wolvChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {wolvChange >= 0 ? '▲ +' : '▼ '}{wolvChange.toFixed(2)}%
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <a href={pancakeSwapUrl} target="_blank" rel="noopener noreferrer" className="btn-glass flex-1 !py-2.5 text-sm">Market reference ↗</a>
                <AddWolvToWallet className="btn-glass flex-1 !py-2.5 text-sm" />
              </div>
              <p className="text-[10px] text-slate-500">Source: Dexscreener · Reference only · Market data changes frequently</p>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
