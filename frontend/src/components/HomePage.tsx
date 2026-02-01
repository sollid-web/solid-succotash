"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import FlipCard from './FlipCard'
import ReviewsRotator from '@/components/ReviewsRotator'
import LiveMarketTicker from '@/components/LiveMarketTicker'
import MarketWidget from '@/components/MarketWidget'
import TrustSection from '@/components/TrustSection'
import ProfessionalFooter from '@/components/ProfessionalFooter'
import { UserPlus, Briefcase, CreditCard, TrendingUp, Shield, Lock, FileCheck, Clock, Bitcoin, HelpCircle, CheckCircle2, ShieldCheck, Globe, Users } from 'lucide-react'
// NavBar and any live transaction banners are intentionally omitted for a cleaner, faster initial render.

type RoiPlan = {
  id: 'pioneer' | 'vanguard' | 'horizon' | 'summit'
  name: string
  dailyRoiPct: number
  minDepositUsd: number
  durationDaysLabel: string
  accent: 'blue' | 'indigo' | 'emerald' | 'amber'
}

const ROI_PLANS: RoiPlan[] = [
  { id: 'pioneer', name: 'Pioneer', dailyRoiPct: 1, minDepositUsd: 100, durationDaysLabel: '90 days', accent: 'blue' },
  { id: 'vanguard', name: 'Vanguard', dailyRoiPct: 1.25, minDepositUsd: 1000, durationDaysLabel: '150 days', accent: 'indigo' },
  { id: 'horizon', name: 'Horizon', dailyRoiPct: 1.5, minDepositUsd: 5000, durationDaysLabel: '180 days', accent: 'emerald' },
  { id: 'summit', name: 'Summit VIP', dailyRoiPct: 2, minDepositUsd: 15000, durationDaysLabel: '365 days', accent: 'amber' },
]

const FALLBACK_WEEKLY_PAYOUT_USD = 247_100

function formatUsd(value: number) {
  if (!Number.isFinite(value)) return '$—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function estimateSimpleRoi(amountUsd: number, days: number, dailyRoiPct: number) {
  const safeAmount = Number.isFinite(amountUsd) ? Math.max(0, amountUsd) : 0
  const safeDays = Number.isFinite(days) ? Math.max(0, Math.floor(days)) : 0
  const safeDaily = Number.isFinite(dailyRoiPct) ? Math.max(0, dailyRoiPct) : 0
  const profit = safeAmount * (safeDaily / 100) * safeDays
  return { profit, total: safeAmount + profit }
}

function trackEvent(name: string, props?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  const w = window as any
  if (typeof w.gtag === 'function') w.gtag('event', name, props || {})
  if (typeof w.analytics?.track === 'function') w.analytics.track(name, props || {})
}

export default function HomePage() {
  const heroRef = useRef<HTMLElement | null>(null)
  const [showStickyCta, setShowStickyCta] = useState(false)
  const [showExitIntent, setShowExitIntent] = useState(false)

  const [depositUsdInput, setDepositUsdInput] = useState('1000')
  const [days, setDays] = useState(10)
  const [selectedPlanId, setSelectedPlanId] = useState<RoiPlan['id']>('vanguard')

  const depositUsd = useMemo(() => {
    const parsed = Number(depositUsdInput)
    if (!Number.isFinite(parsed)) return 0
    return Math.max(0, parsed)
  }, [depositUsdInput])

  const weeklyPayoutUsdRaw = process.env.NEXT_PUBLIC_WEEKLY_PAYOUT_USD
  const weeklyPayoutUsdParsed = weeklyPayoutUsdRaw ? Number(weeklyPayoutUsdRaw) : NaN
  const weeklyPayoutUsd = Number.isFinite(weeklyPayoutUsdParsed) ? weeklyPayoutUsdParsed : FALLBACK_WEEKLY_PAYOUT_USD
  const weeklyPayoutIsExample = !Number.isFinite(weeklyPayoutUsdParsed)

  const scrollToPlans = (source: 'hero' | 'sticky' | 'exit_intent') => {
    trackEvent('cta_click', { location: source, cta: 'start_earning_now' })
    const el = document.getElementById('roi-plans')
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const resetCalculator = () => {
    setDepositUsdInput('1000')
    setDays(10)
    setSelectedPlanId('vanguard')
    trackEvent('plan_calculator_reset', { page: 'home' })
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mq = window.matchMedia?.('(max-width: 767px)')
    const isMobile = mq ? mq.matches : true
    if (!isMobile) return

    if (typeof IntersectionObserver !== 'undefined' && heroRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setShowStickyCta(entry.intersectionRatio < 0.35)
        },
        { threshold: [0, 0.2, 0.35, 0.6] },
      )
      observer.observe(heroRef.current)
      return () => observer.disconnect()
    }

    const onScroll = () => setShowStickyCta((window.scrollY || 0) > 240)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const thresholds = [25, 50, 75, 90]
    const fired = new Set<number>()

    const onScroll = () => {
      const doc = document.documentElement
      const scrollTop = window.scrollY || doc.scrollTop || 0
      const max = Math.max(1, doc.scrollHeight - window.innerHeight)
      const pct = Math.round((scrollTop / max) * 100)
      for (const t of thresholds) {
        if (pct >= t && !fired.has(t)) {
          fired.add(t)
          trackEvent('scroll_depth', { percent: t, page: 'home' })
        }
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const timer = window.setTimeout(() => trackEvent('time_on_page', { seconds: 30, page: 'home' }), 30_000)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const finePointer = window.matchMedia?.('(pointer:fine)')?.matches
    if (!finePointer) return
    if (window.sessionStorage.getItem('wolvcapital.exitIntentSeen') === '1') return

    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY > 0) return
      if ((e.relatedTarget as Node | null) !== null) return
      window.sessionStorage.setItem('wolvcapital.exitIntentSeen', '1')
      trackEvent('exit_intent_open', { page: 'home' })
      setShowExitIntent(true)
    }

    document.addEventListener('mouseout', onMouseOut)
    return () => document.removeEventListener('mouseout', onMouseOut)
  }, [])

  useEffect(() => {
    if (!showExitIntent) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        trackEvent('exit_intent_close', { action: 'escape' })
        setShowExitIntent(false)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [showExitIntent])

  return (
    <div className="min-h-screen bg-white pb-[calc(env(safe-area-inset-bottom)+5rem)] md:pb-0">
      {/* Hero Section (Above-the-Fold) */}
      <section ref={heroRef} className="relative min-h-[calc(100vh-5rem)] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/home-hero.jpg"
            alt="WolvCapital digital investment platform hero image"
            fill
            className="object-cover object-center"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b2f6b]/95 via-[#0b2f6b]/75 to-[#2563eb]/55" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center py-12 sm:py-16 lg:py-20">
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs sm:text-sm font-semibold text-white/95 backdrop-blur">
                <ShieldCheck className="h-4 w-4 text-emerald-200" aria-hidden="true" />
                <span>Secure • Transparent • KYC-Verified</span>
              </div>

              <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
                Earn 1%–2% Daily ROI on Your Crypto — Withdraw Anytime<span className="align-super text-base">*</span>
              </h1>
              <p className="mt-4 text-base sm:text-lg md:text-xl text-blue-100 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Secure, Transparent, KYC-Verified. Start with USDT or BTC.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <button
                  type="button"
                  onClick={() => scrollToPlans('hero')}
                  className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm sm:text-base font-extrabold text-[#0b2f6b] hover:bg-blue-50 transition-all shadow-2xl"
                >
                  Start Earning Now
                  <span className="ml-2 text-[#2563eb]" aria-hidden="true">
                    →
                  </span>
                </button>
                <Link
                  href="/accounts/signup"
                  onClick={() => trackEvent('cta_click', { location: 'hero', cta: 'create_free_account' })}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#fde047] to-[#facc15] px-7 py-3.5 text-sm sm:text-base font-extrabold text-[#0b2f6b] hover:shadow-2xl transition-all"
                >
                  Create Your Free Account
                </Link>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs sm:text-sm text-white/90">
                <span className="inline-flex items-center gap-2">
                  <Lock className="h-4 w-4 text-white/80" aria-hidden="true" />
                  256-bit encryption
                </span>
                <span className="inline-flex items-center gap-2">
                  <Shield className="h-4 w-4 text-white/80" aria-hidden="true" />
                  Cold storage protected
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4 text-white/80" aria-hidden="true" />
                  Real-time risk monitoring
                </span>
              </div>

              <p className="mt-4 text-[11px] sm:text-xs text-white/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                *Withdrawal requests are subject to plan terms, KYC verification, and manual review. Returns shown are estimates for educational purposes and are not guaranteed.
              </p>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur shadow-xl">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-blue-100 uppercase">Payout tracker</p>
                    <p className="mt-1 text-3xl font-extrabold text-white">{formatUsd(weeklyPayoutUsd)}</p>
                    <p className="mt-1 text-xs text-white/80">Paid to investors in the last 7 days</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/80">Updated</p>
                    <p className="text-xs font-semibold text-white">Daily</p>
                    {weeklyPayoutIsExample ? <p className="mt-1 text-[11px] text-white/70">Example figure</p> : null}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/10 p-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
                      <FileCheck className="h-4 w-4 text-emerald-200" aria-hidden="true" />
                      KYC compliant
                    </div>
                    <p className="mt-1 text-[11px] text-white/75">Identity checks before activation</p>
                  </div>
                  <div className="rounded-xl bg-white/10 p-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
                      <ShieldCheck className="h-4 w-4 text-blue-200" aria-hidden="true" />
                      AML protocols
                    </div>
                    <p className="mt-1 text-[11px] text-white/75">Transaction monitoring & review</p>
                  </div>
                </div>
              </div>

              <ReviewsRotator />
            </div>
          </div>
        </div>
      </section>

      {/* Investment Plans (Interactive Selector) */}
      <section id="roi-plans" className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0b2f6b]">Choose your daily ROI plan</h2>
              <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-3xl mx-auto">
                Select a plan, set an amount, and see a simple projection. You can review plans without creating an account.
              </p>
              <div className="mt-3">
                <Link href="/plans" className="text-sm font-semibold text-[#0b2f6b] underline underline-offset-4 hover:no-underline">
                  View plan terms & disclosures
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end">
                <div className="lg:col-span-4">
                  <label className="block text-sm font-bold text-gray-900 mb-2">Deposit amount (USD)</label>
                  <input
                    inputMode="decimal"
                    type="number"
                    min={0}
                    step={50}
                    value={depositUsdInput}
                    onChange={(e) => {
                      setDepositUsdInput(e.target.value)
                      trackEvent('plan_calculator_change', { field: 'deposit_usd', page: 'home' })
                    }}
                    className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 focus:border-blue-600 focus:ring focus:ring-blue-200 transition-all"
                    placeholder="1000"
                  />
                  <p className="mt-2 text-xs text-gray-500">Estimates update instantly (not financial advice).</p>
                </div>

                <div className="lg:col-span-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-bold text-gray-900">Timeline (days)</label>
                    <span className="text-sm font-semibold text-[#0b2f6b]">{days} days</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    step={1}
                    value={days}
                    onChange={(e) => {
                      setDays(Number(e.target.value))
                      trackEvent('plan_calculator_change', { field: 'days', page: 'home' })
                    }}
                    className="w-full accent-[#0b2f6b]"
                    aria-label="Timeline in days"
                  />
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                    <span>1</span>
                    <span>30</span>
                  </div>
                </div>

                <div className="lg:col-span-4">
                  <div className="rounded-2xl bg-white border border-gray-200 p-5">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Selected plan</div>
                    <div className="mt-1 text-lg font-extrabold text-[#0b2f6b]">
                      {ROI_PLANS.find((p) => p.id === selectedPlanId)?.name || 'Plan'}
                      <span className="ml-2 text-sm font-bold text-gray-600">
                        ({ROI_PLANS.find((p) => p.id === selectedPlanId)?.dailyRoiPct}% daily)
                      </span>
                    </div>
                    <div className="mt-3 text-sm text-gray-700 leading-relaxed">
                      {(() => {
                        const plan = ROI_PLANS.find((p) => p.id === selectedPlanId)
                        if (!plan) return null
                        const effectiveAmount = Math.max(depositUsd, plan.minDepositUsd)
                        const { profit, total } = estimateSimpleRoi(effectiveAmount, days, plan.dailyRoiPct)
                        return (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Projection</span>
                              <span className="font-bold text-gray-900">{formatUsd(profit)} profit</span>
                            </div>
                            <div className="mt-1 flex items-center justify-between">
                              <span className="text-gray-600">{formatUsd(effectiveAmount)} →</span>
                              <span className="font-extrabold text-[#0b2f6b]">{formatUsd(total)} total</span>
                            </div>
                          </>
                        )
                      })()}
                    </div>
                    <p className="mt-3 text-xs text-gray-500">Estimates are illustrative only. Outcomes can vary and are not guaranteed.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {ROI_PLANS.map((plan) => {
                  const isSelected = plan.id === selectedPlanId
                  const meetsMin = depositUsd >= plan.minDepositUsd
                  const effectiveAmount = Math.max(depositUsd, plan.minDepositUsd)
                  const { profit, total } = estimateSimpleRoi(effectiveAmount, days, plan.dailyRoiPct)

                  const accentRing =
                    plan.accent === 'blue'
                      ? 'ring-blue-400/60'
                      : plan.accent === 'indigo'
                        ? 'ring-indigo-400/60'
                        : plan.accent === 'emerald'
                          ? 'ring-emerald-400/60'
                          : 'ring-amber-300/70'

                  return (
                    <div
                      key={plan.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setSelectedPlanId(plan.id)
                        trackEvent('plan_selected', { plan_id: plan.id, daily_roi_pct: plan.dailyRoiPct, page: 'home' })
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setSelectedPlanId(plan.id)
                          trackEvent('plan_selected', { plan_id: plan.id, daily_roi_pct: plan.dailyRoiPct, page: 'home' })
                        }
                      }}
                      className={`cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-200 ${
                        isSelected ? `ring-2 ${accentRing}` : ''
                      }`}
                      aria-pressed={String(isSelected) as any}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-extrabold text-[#0b2f6b]">{plan.name}</div>
                          <div className="mt-1 text-xs font-semibold text-gray-600">
                            {plan.dailyRoiPct}% daily • {plan.durationDaysLabel}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">Min</div>
                          <div className="text-sm font-bold text-gray-900">{formatUsd(plan.minDepositUsd)}</div>
                        </div>
                      </div>

                      <div className="mt-4 rounded-xl bg-gray-50 border border-gray-200 p-3">
                        <div className="text-xs text-gray-600">
                          {formatUsd(effectiveAmount)} → <span className="font-extrabold text-[#0b2f6b]">{formatUsd(total)}</span> in {days} days
                        </div>
                        <div className="mt-1 text-sm font-bold text-gray-900">{formatUsd(profit)} profit</div>
                        {!meetsMin ? (
                          <p className="mt-2 text-[11px] text-amber-700">
                            Enter at least {formatUsd(plan.minDepositUsd)} to use this plan.
                          </p>
                        ) : null}
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Link
                          href={`/plans/${plan.id}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            trackEvent('plan_review_click', { plan_id: plan.id, page: 'home' })
                          }}
                          className="inline-flex flex-1 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
                        >
                          Review
                        </Link>
                        <Link
                          href={`/accounts/signup?plan=${encodeURIComponent(plan.id)}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            trackEvent('plan_get_started_click', { plan_id: plan.id, daily_roi_pct: plan.dailyRoiPct, page: 'home' })
                          }}
                          className="inline-flex flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-[#0b2f6b] via-[#2563eb] to-[#1d4ed8] px-4 py-2.5 text-sm font-bold text-white hover:shadow-lg transition-all"
                        >
                          Get Started
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-xs text-gray-500">
                  Tip: compare plans first, then create your account when you’re ready.
                </p>
                <button
                  type="button"
                  onClick={resetCalculator}
                  className="text-xs font-semibold text-gray-700 underline underline-offset-4 hover:no-underline"
                >
                  Reset calculator
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live transactions ticker removed per request (performance + visual focus) */}

      {/* SEO Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#0b2f6b] mb-6">Invest in Secure Digital Assets With Confidence</h2>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <p className="text-lg leading-relaxed">
              WolvCapital is a digital investment platform designed for individuals seeking reliable, technology-driven asset growth. Our infrastructure combines advanced encryption, real-time fraud monitoring, transparent performance metrics, and strict KYC/AML compliance to ensure every investor experiences a secure and seamless investment process.
            </p>
            <p className="text-lg leading-relaxed">
              We provide structured investment plans with daily returns, flexible withdrawal options, and enterprise-grade security. Our platform supports investors from over 120 countries, delivering a user-friendly environment backed by professional risk controls and continuous system monitoring.
            </p>
          </div>

          <div className="mt-10">
            <LiveMarketTicker />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-[#0b2f6b] mb-4">Predictable Daily ROI</h3>
              <p className="text-gray-700">
                Our fixed and flexible plans provide structured returns ranging from 1% to 2% daily, depending on the selected tier. Investors retain control of their capital, profits, and withdrawal schedules.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-[#0b2f6b] mb-4">Battle-Tested Infrastructure</h3>
              <p className="text-gray-700">
                WolvCapital operates on secure, cloud-based architecture with 99.9% uptime, ensuring uninterrupted platform performance during deposits, withdrawals, or active investment periods.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
              <div className="relative w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <div className="absolute inset-0 bg-purple-400 rounded-2xl blur-sm opacity-50"></div>
                <Globe className="relative w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-bold text-[#0b2f6b] mb-4">Global Investor Network</h3>
              <p className="text-gray-700">
                More than 45,000 verified investors trust WolvCapital to manage their digital assets across 120+ countries. Our user approval and verification processes meet global standards for operational transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0b2f6b] mb-3 sm:mb-4">Why Investors Choose WolvCapital</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">WolvCapital combines advanced technology and rigorous human oversight to deliver a secure, transparent, and compliant digital investment experience for discerning investors.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0b2f6b] to-[#2563eb] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#0b2f6b] mb-4">Human Oversight</h3>
              <p className="text-gray-600 leading-relaxed">All transactions are subject to manual review by our compliance team, ensuring your capital is protected by robust security protocols and regulatory best practices.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[#fde047] to-[#facc15] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-[#0b2f6b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#0b2f6b] mb-4">Audited Performance</h3>
              <p className="text-gray-600 leading-relaxed">Our investment plans offer competitive daily returns, subject to transparent audit and compliance review. All performance is verified and never guaranteed.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#0b2f6b] mb-4">Virtual Card Solutions</h3>
              <p className="text-gray-600 leading-relaxed">Access premium virtual Visa cards for secure global transactions. Enjoy instant activation, 24/7 support, and enhanced spending controls.</p>
            </div>
          </div>

          {/* Interactive Virtual Card Demo */}
          <div className="mt-16">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#0b2f6b] mb-2 sm:mb-3">Preview Our Virtual Card Experience</h3>
              <p className="text-sm sm:text-base text-gray-600">Tap the card below to view both sides. WolvCapital virtual cards are designed for secure, compliant digital asset spending.</p>
            </div>
            <FlipCard />
          </div>
        </div>
      </section>

      {/* Market + Plans CTA (homepage no longer lists plan details) */}
      <section className="py-12 sm:py-16 bg-white" aria-labelledby="market-reference">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
              <div className="justify-self-center lg:justify-self-start">
                <h2 id="market-reference" className="text-2xl sm:text-3xl font-extrabold text-[#0b2f6b]">
                  Market reference pricing
                </h2>
                <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-md leading-relaxed">
                  Live BTC and ETH quotes for context only. Prices can be volatile and are not investment advice.
                </p>
                <div className="mt-6">
                  <MarketWidget />
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-[#0b2f6b]">Explore investment plans</h3>
                <p className="mt-2 text-sm sm:text-base text-gray-700 leading-relaxed max-w-2xl">
                  Review plan terms, eligibility, and risk disclosures before making any request. All investment activity is subject to verification and manual review.
                </p>
                <div className="mt-6">
                  <Link
                    href="/plans"
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#0b2f6b] via-[#2563eb] to-[#1d4ed8] px-6 py-3 text-sm sm:text-base font-bold text-white hover:shadow-lg transition-all"
                  >
                    View Plans
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-extrabold text-[#0b2f6b] mb-4">How WolvCapital Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Our streamlined investment process ensures security, transparency, and compliance at every step.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#0b2f6b] to-[#2563eb] rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <UserPlus className="w-10 h-10 text-white" aria-hidden="true" />
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#0b2f6b] font-bold shadow-lg">1</span>
              </div>
              <h3 className="text-xl font-bold text-[#0b2f6b] mb-3">Create Account</h3>
              <p className="text-gray-600">Sign up with your email and complete KYC verification for regulatory compliance.</p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <Briefcase className="w-10 h-10 text-white" aria-hidden="true" />
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#2563eb] font-bold shadow-lg">2</span>
              </div>
              <h3 className="text-xl font-bold text-[#0b2f6b] mb-3">Choose Plan</h3>
              <p className="text-gray-600">Select from our professionally structured investment plans based on your goals.</p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <CreditCard className="w-10 h-10 text-white" aria-hidden="true" />
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-purple-600 font-bold shadow-lg">3</span>
              </div>
              <h3 className="text-xl font-bold text-[#0b2f6b] mb-3">Deposit Funds</h3>
              <p className="text-gray-600">Fund your wallet securely. All deposits are manually reviewed and approved.</p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <TrendingUp className="w-10 h-10 text-white" aria-hidden="true" />
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-green-600 font-bold shadow-lg">4</span>
              </div>
              <h3 className="text-xl font-bold text-[#0b2f6b] mb-3">Track Returns</h3>
              <p className="text-gray-600">Monitor your investment performance with real-time dashboard analytics.</p>
            </div>
          </div>

          <div className="text-center">
            <Link href="/how-it-works" className="inline-block bg-gradient-to-r from-[#0b2f6b] via-[#2563eb] to-[#1d4ed8] text-white px-8 py-4 rounded-full text-lg font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105">
              Learn More About Our Process
            </Link>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-5xl font-extrabold text-[#0b2f6b] mb-6">Security and Compliance Standards</h2>
              <p className="text-lg text-gray-700 max-w-4xl mx-auto">
                WolvCapital implements a multilayered security framework to safeguard investor funds and sensitive information. Our operational environment includes:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <div className="absolute inset-0 bg-blue-400 rounded-2xl blur-sm opacity-50"></div>
                    <UserPlus className="relative w-8 h-8 text-white" aria-hidden="true" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0b2f6b] mb-2">KYC Verification</h3>
                    <p className="text-gray-600">Mandatory identity verification helps prevent fraud, identity theft, and unauthorized account use.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="relative w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <div className="absolute inset-0 bg-green-400 rounded-2xl blur-sm opacity-50"></div>
                    <Shield className="relative w-8 h-8 text-white" aria-hidden="true" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0b2f6b] mb-2">AML Compliance</h3>
                    <p className="text-gray-600">Real-time transaction monitoring detects and blocks suspicious activity while preserving user privacy.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="relative w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <div className="absolute inset-0 bg-purple-400 rounded-2xl blur-sm opacity-50"></div>
                    <Lock className="relative w-8 h-8 text-white" aria-hidden="true" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0b2f6b] mb-2">256-Bit SSL Encryption</h3>
                    <p className="text-gray-600">All data exchanged on the platform is encrypted with bank-grade security.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="relative w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <div className="absolute inset-0 bg-amber-400 rounded-2xl blur-sm opacity-50"></div>
                    <ShieldCheck className="relative w-8 h-8 text-white" aria-hidden="true" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0b2f6b] mb-2">Two-Factor Authentication</h3>
                    <p className="text-gray-600">Added protection prevents unauthorized access to investor accounts.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="relative w-14 h-14 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <div className="absolute inset-0 bg-red-400 rounded-2xl blur-sm opacity-50"></div>
                    <Clock className="relative w-8 h-8 text-white" aria-hidden="true" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0b2f6b] mb-2">24/7 Fraud Monitoring</h3>
                    <p className="text-gray-600">Our systems proactively track account behavior and prevent abnormal financial activity.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="relative w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <div className="absolute inset-0 bg-indigo-400 rounded-2xl blur-sm opacity-50"></div>
                    <FileCheck className="relative w-8 h-8 text-white" aria-hidden="true" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0b2f6b] mb-2">PCI-DSS Level 1 Standards</h3>
                    <p className="text-gray-600">Ensures that payment operations meet the highest industry benchmark.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
              <p className="text-lg text-gray-700 mb-6">
                WolvCapital is committed to maintaining a secure, transparent, and reliable ecosystem for digital asset investors worldwide.
              </p>
              <Link href="/security" className="inline-block bg-gradient-to-r from-[#0b2f6b] via-[#2563eb] to-[#1d4ed8] text-white px-8 py-4 rounded-full text-lg font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105">
                View Our Security Measures
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Security Visual Stats */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-[#0b2f6b] mb-6 text-center">Security At A Glance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl text-center">
                  <div className="flex justify-center mb-3">
                    <div className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <div className="absolute inset-0 bg-green-400 rounded-2xl blur opacity-40"></div>
                      <Lock className="relative w-9 h-9 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-green-700 mb-2">256-bit</div>
                  <div className="text-sm text-green-600 font-semibold">SSL Encryption</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl text-center">
                  <div className="flex justify-center mb-3">
                    <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <div className="absolute inset-0 bg-blue-400 rounded-2xl blur opacity-40"></div>
                      <ShieldCheck className="relative w-9 h-9 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-blue-700 mb-2">AML/KYC</div>
                  <div className="text-sm text-blue-600 font-semibold">Fully Compliant</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl text-center">
                  <div className="flex justify-center mb-3">
                    <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <div className="absolute inset-0 bg-purple-400 rounded-2xl blur opacity-40"></div>
                      <Clock className="relative w-9 h-9 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-purple-700 mb-2">24/7</div>
                  <div className="text-sm text-purple-600 font-semibold">Monitoring</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-2xl text-center">
                  <div className="flex justify-center mb-3">
                    <div className="relative w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <div className="absolute inset-0 bg-orange-400 rounded-2xl blur opacity-40"></div>
                      <Users className="relative w-9 h-9 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-orange-700 mb-2">45,000+</div>
                  <div className="text-sm text-orange-600 font-semibold">Global Investors</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-extrabold text-[#0b2f6b] mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Get answers to common questions about investing with WolvCapital.</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4 mb-12">
            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all border border-gray-200 hover:border-[#0b2f6b]">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-[#0b2f6b]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0b2f6b] mb-3">How does WolvCapital generate investor returns?</h3>
                  <p className="text-gray-700">WolvCapital uses a diversified strategy within the digital asset market, supported by automated monitoring tools and controlled risk exposure. Returns are based on the performance of selected asset pools and daily market conditions.</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all border border-gray-200 hover:border-green-600">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-green-600" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0b2f6b] mb-3">Is WolvCapital regulated?</h3>
                  <p className="text-gray-700">WolvCapital follows global compliance standards such as KYC, AML, and PCI-DSS, but it is not a government-regulated financial institution. Investors should review our Risk Disclosure before investing.</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all border border-gray-200 hover:border-purple-600">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-purple-600" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0b2f6b] mb-3">How long do withdrawals take?</h3>
                  <p className="text-gray-700">Profit withdrawals are available at end of your active investment plan. Processing time may vary depending on network conditions and verification requirements.</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all border border-gray-200 hover:border-amber-600">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-6 h-6 text-amber-600" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0b2f6b] mb-3">What are the minimum and maximum investment amounts?</h3>
                  <p className="text-gray-700">Minimum investment begins at $100. Higher-tier plans allow flexible or custom amounts depending on investor profile and plan type.</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all border border-gray-200 hover:border-indigo-600">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-indigo-600" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0b2f6b] mb-3">How is my account secured?</h3>
                  <p className="text-gray-700">WolvCapital uses multi-layer security including 2FA, 256-bit encryption, and real-time fraud detection to ensure full account protection.</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all border border-gray-200 hover:border-blue-600">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UserPlus className="w-6 h-6 text-blue-600" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0b2f6b] mb-3">Which countries does WolvCapital serve?</h3>
                  <p className="text-gray-700">Our platform supports investors from over 120 countries, provided they meet local compliance requirements.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/faq" className="inline-block bg-gradient-to-r from-[#0b2f6b] via-[#2563eb] to-[#1d4ed8] text-white px-8 py-4 rounded-full text-lg font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105">
              View All FAQs
            </Link>
          </div>
        </div>
      </section>

      {/* Referral Program Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-[#0b2f6b] mb-4">Earn with Our Referral Program</h2>
              <p className="text-gray-700 text-base lg:text-lg mb-4">Share WolvCapital with your network and earn referral rewards when your referrals become active investors. All activity is subject to manual compliance review and approval.</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Generate your unique code from the dashboard</li>
                <li>Share your referral link with friends or colleagues</li>
                <li>Track stats and rewards in your account</li>
              </ul>
              <div className="flex flex-wrap gap-3">
                <Link href="/referrals" className="bg-gradient-to-r from-[#0b2f6b] via-[#2563eb] to-[#1d4ed8] text-white px-6 py-3 rounded-full font-bold hover:shadow-lg transition-all">Learn More</Link>
                <a href="/referrals-brochure.html" target="_blank" rel="noopener" className="bg-white border border-gray-200 text-[#0b2f6b] px-6 py-3 rounded-full font-bold hover:shadow-lg transition-all">Download Brochure</a>
              </div>
              <p className="text-xs text-gray-500 mt-3">Rewards are never auto-approved; all payouts require administrative review.</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0b2f6b] to-[#2563eb] flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m6-6H6"/></svg>
                </div>
                <h3 className="text-xl font-bold text-[#0b2f6b]">Referral Highlights</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-2xl text-center">
                  <p className="text-sm text-blue-700">Manual Review</p>
                  <p className="text-2xl font-extrabold text-blue-900">100%</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl text-center">
                  <p className="text-sm text-emerald-700">Transparent</p>
                  <p className="text-2xl font-extrabold text-emerald-900">Always</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-2xl text-center">
                  <p className="text-sm text-amber-700">Secure</p>
                  <p className="text-2xl font-extrabold text-amber-900">By Design</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-[#0b2f6b] via-[#1d4ed8] to-[#2563eb] text-white">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 sm:mb-6">Begin Your Secure Investment Experience</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-10 max-w-3xl mx-auto">Join a growing community of investors who trust WolvCapital for transparent, secure digital investment solutions and cryptocurrency portfolio management.</p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
            <Link href="/plans" className="bg-white text-[#0b2f6b] px-6 sm:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105">View Plans</Link>
            <Link href="/accounts/signup" className="bg-gradient-to-r from-[#fde047] to-[#facc15] text-[#0b2f6b] px-6 sm:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105">Open Account</Link>
          </div>
        </div>
      </section>
      {/* Trust & Compliance Section */}
      <TrustSection />

      {/* Professional Footer */}
      <ProfessionalFooter />

      {/* Sticky CTA (mobile) */}
      <div
        className={`md:hidden fixed inset-x-0 bottom-0 z-[60] transition-transform duration-300 ${
          showStickyCta && !showExitIntent ? 'translate-y-0' : 'translate-y-full'
        }`}
        role="region"
        aria-label="Quick actions"
      >
        <div className="border-t border-gray-200 bg-white/95 backdrop-blur">
          <div className="container mx-auto px-4 py-3 flex gap-3">
            <button
              type="button"
              onClick={() => scrollToPlans('sticky')}
              className="flex-1 rounded-full bg-[#0b2f6b] px-4 py-3 text-sm font-extrabold text-white shadow-lg"
            >
              Start Earning Now
            </button>
            <Link
              href="/accounts/signup"
              onClick={() => trackEvent('cta_click', { location: 'sticky', cta: 'create_free_account' })}
              className="flex-1 rounded-full bg-gradient-to-r from-[#fde047] to-[#facc15] px-4 py-3 text-sm font-extrabold text-[#0b2f6b] text-center shadow-lg"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </div>

      {/* Exit intent modal (desktop) */}
      {showExitIntent ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => {
              trackEvent('exit_intent_close', { action: 'backdrop' })
              setShowExitIntent(false)
            }}
          />
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#0b2f6b]">Wait — see how much you could earn</h3>
            <p className="mt-2 text-sm sm:text-base text-gray-700 leading-relaxed">
              Use the ROI calculator to compare plans and view a simple projection. No signup required to view plan terms.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  trackEvent('exit_intent_cta_click', { cta: 'open_calculator', page: 'home' })
                  setShowExitIntent(false)
                  scrollToPlans('exit_intent')
                }}
                className="flex-1 rounded-full bg-gradient-to-r from-[#0b2f6b] via-[#2563eb] to-[#1d4ed8] px-6 py-3 text-sm font-extrabold text-white"
              >
                Open ROI Calculator
              </button>
              <button
                type="button"
                onClick={() => {
                  trackEvent('exit_intent_close', { action: 'dismiss' })
                  setShowExitIntent(false)
                }}
                className="flex-1 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-extrabold text-gray-700 hover:bg-gray-50"
              >
                No thanks
              </button>
            </div>
            <p className="mt-4 text-xs text-gray-500">This is not financial advice. Digital assets are volatile and returns are not guaranteed.</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
