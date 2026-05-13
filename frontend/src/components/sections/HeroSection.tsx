'use client'

import Link from 'next/link'
import { useTranslation } from '@/components/TranslationProvider'

interface HeroSectionProps {
  onPlansClick?: () => void
}

export default function HeroSection({ onPlansClick }: HeroSectionProps) {
  const { t } = useTranslation()

  return (
    <section
      className="relative overflow-hidden bg-cover bg-center bg-[url('/images/hero/hero-bg.webp')]"
      style={{ minHeight: '80vh' }}
    >
      <div className="absolute inset-0 bg-slate-950/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/15 via-white/10 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[60%_40%] lg:items-center">
          <div className="space-y-8">
            <div className="max-w-xl">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1E3A8A]">
                Invest · Stake · Earn — All On-Chain
              </span>
            </div>

            <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#0F172A] sm:text-4xl md:text-5xl lg:text-[48px] lg:leading-[1.05]">
              {t('hero.title')}
            </h1>

            <p className="max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
              {t('hero.subtitle')}
            </p>

            {/* Live blockchain badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#eff6ff] border border-[#2A52BE]/20 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[12px] font-semibold text-[#1E3A8A]">
                Every profit recorded on BNB Chain · Stake BNB or BUSD · Earn WOLV rewards
              </span>
            </div>

            {/* Staking APY pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { plan: 'Pioneer',    apy: '8%',  days: '90d' },
                { plan: 'Vanguard',   apy: '12%', days: '150d' },
                { plan: 'Horizon',    apy: '18%', days: '180d' },
                { plan: 'Summit VIP', apy: '25%', days: '365d' },
              ].map(p => (
                <div key={p.plan} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-full shadow-sm">
                  <span className="text-[11px] font-semibold text-[#0F172A]">{p.plan}</span>
                  <span className="text-[11px] font-bold text-[#2A52BE]">{p.apy} APY</span>
                  <span className="text-[10px] text-slate-400">{p.days}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap items-start sm:items-center">
              <Link
                href="/plans"
                onClick={() => onPlansClick?.()}
                className="inline-flex min-h-[44px] items-center justify-center rounded-[7px] bg-[#2A52BE] px-8 py-3.5 text-sm font-bold text-white transition hover:bg-[#244bb0]"
              >
                {t('hero.button.viewPlans')}
              </Link>
              <Link
                href="/accounts/signup"
                className="inline-flex min-h-[44px] items-center justify-center rounded-[7px] border-2 border-[#2A52BE] bg-white px-8 py-3.5 text-sm font-semibold text-[#1E3A8A] transition hover:bg-[#eff6ff]"
              >
                {t('hero.button.openAccount')}
              </Link>
            </div>

            <div className="flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.16em] text-slate-700">
              <span>{t('hero.badge.encryption')}</span>
              <span>|</span>
              <span>{t('hero.badge.custody')}</span>
              <span>|</span>
              <span>{t('hero.badge.fincen')}</span>
              <span>|</span>
              <span>BNB Chain Verified</span>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative mx-auto h-[520px] max-w-[420px] overflow-hidden rounded-[16px] shadow-2xl shadow-slate-900/10">
              <img
                src="/images/hero/home-hero.webp"
                alt="WolvCapital blockchain investment and staking platform — earn WOLV rewards"
                className="h-full w-full object-cover object-top"
                loading="eager"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#2A52BE]/15" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}