"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { apiFetch, getApiBaseUrl } from '@/lib/api'
import { useRouter } from 'next/navigation'

function trackEvent(name: string, props?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  const w = window as any
  if (typeof w.gtag === 'function') w.gtag('event', name, props || {})
  if (typeof w.analytics?.track === 'function') w.analytics.track(name, props || {})
}

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [referralCode, setReferralCode] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [step, setStep] = useState<'form' | 'sent'>('form')
  const [selectedPlan, setSelectedPlan] = useState('')

  const apiBase = getApiBaseUrl()
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const plan = new URLSearchParams(window.location.search).get('plan') || ''
    setSelectedPlan(plan)
    trackEvent('signup_view', { page: 'signup', plan: plan || undefined })
  }, [])

  const completeSignup = async () => {
    setLoading(true); setError(''); setMessage('')
    if (password.length < 8) {
      setLoading(false)
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setLoading(false)
      setError('Passwords do not match.')
      return
    }
    try {
      trackEvent('signup_submit', { page: 'signup', plan: selectedPlan || undefined })
      const resp = await apiFetch('/api/auth/complete-signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, referral_code: referralCode || undefined })
      })
      const data = await resp.json()
      if (!resp.ok) {
        setError(data?.error || 'Signup failed. Please try again.')
        return
      }
      trackEvent('signup_success', { plan: selectedPlan || undefined })
      setStep('sent')
    } catch (e: any) {
      setError(e?.message || 'Failed to complete signup. Please check your connection.')
    } finally { setLoading(false) }
  }

  const benefits = [
    { icon: "📊", title: "Access All Plans", desc: "4 investment tiers with 8%–25% APY" },
    { icon: "📈", title: "Real-Time Tracking", desc: "Monitor your portfolio growth live" },
    { icon: "🔒", title: "Secure Lock Plans", desc: "90–365 day structured staking terms" },
    { icon: "🛡️", title: "Professional Security", desc: "AML/KYC compliance, 256-bit encryption" },
    { icon: "🤝", title: "Referral Rewards", desc: "Earn 3% from your network's investments" },
    { icon: "💬", title: "24/7 Support", desc: "Instant help from our dedicated team" },
  ]

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #0F172A 0%, #1E3A8A 60%, #2A52BE 100%)' }}>
      {/* Top nav spacer */}
      <div className="pt-6 pb-10 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Logo + heading */}
          <div className="text-center mb-10">
            <Link href="/" className="inline-block mb-6">
              <Image src="/wolv-logo.svg" alt="WolvCapital" width={160} height={52} priority />
            </Link>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
              Create Your WolvCapital Account
            </h1>
            <p className="text-blue-200 text-base md:text-lg max-w-xl mx-auto">
              Join 45,000+ global investors growing their digital assets on a secure, transparent platform.
            </p>
          </div>

          {/* Main card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

            {/* Benefits grid */}
            <div className="px-8 pt-10 pb-8 border-b border-gray-100">
              <h2 className="text-xl font-bold text-white mb-6 text-center">Why Create an Account?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white/10 border border-white/20">
                    <span className="text-2xl flex-shrink-0 mt-0.5">{b.icon}</span>
                    <div>
                      <p className="font-bold text-white text-sm">{b.title}</p>
                      <p className="text-xs text-blue-200 mt-0.5">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3 steps banner */}
            <div className="px-8 py-6 border-b border-gray-100" style={{ background: 'linear-gradient(135deg, #2A52BE 0%, #1E3A8A 100%)' }}>
              <h2 className="text-lg font-bold text-white mb-4 text-center">Sign Up in 3 Easy Steps</h2>
              <ol className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-around">
                {[
                  "Enter your email and create a secure password",
                  "Verify your email with the confirmation link",
                  "Start investing and earning 8%–25% APY",
                ].map((step, i) => (
                  <li key={i} className="flex items-center gap-3 sm:flex-col sm:text-center sm:max-w-[160px]">
                    <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-blue-100 text-sm">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Form */}
            <div className="px-8 py-10 max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Your Account</h2>

              {error && (
                <div className="mb-5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-4">
                  {error}
                </div>
              )}
              {message && (
                <div className="mb-5 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl p-4">
                  {message}
                </div>
              )}

              {step === 'form' && (
                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); completeSignup() }}>
                  <div>
                    <label className="block text-sm font-semibold text-blue-200 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-blue-200 mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                      placeholder="••••••••"
                      minLength={8}
                      required
                    />
                    <p className="text-xs text-blue-300 mt-1">Must be at least 8 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-blue-200 mb-1.5">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-blue-200 mb-1.5">
                      Referral Code <span className="font-normal text-gray-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={referralCode}
                      onChange={e => setReferralCode(e.target.value.trim())}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                      placeholder="ABC123"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email || password.length < 8 || confirmPassword !== password}
                    className="w-full py-4 rounded-xl font-bold text-white text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg, #2A52BE 0%, #1E3A8A 100%)' }}
                  >
                    {loading ? 'Creating Account...' : 'Create Free Account'}
                  </button>

                  <p className="text-center text-sm text-blue-200 pt-1">
                    Already have an account?{' '}
                    <Link href="/accounts/login" className="text-blue-600 font-bold hover:underline">
                      Sign In
                    </Link>
                  </p>

                  <p className="text-center text-xs text-blue-300">
                    By creating an account, you agree to our{' '}
                    <Link href="/terms-of-service" className="text-blue-600 hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                  </p>
                </form>
              )}

              {step === 'sent' && (
                <div className="space-y-5 text-center">
                  <div className="text-6xl">✅</div>
                  <h3 className="text-2xl font-bold text-green-700">Registration Successful!</h3>
                  <div className="text-gray-600 space-y-2 text-sm">
                    <p>Check your email for a verification link.</p>
                    <p>Click it to activate your account.</p>
                    <p className="text-gray-400">Didn't receive it? Check your spam folder.</p>
                  </div>
                  <button
                    className="w-full py-4 rounded-xl font-bold text-white text-base transition-all"
                    style={{ background: 'linear-gradient(135deg, #2A52BE 0%, #1E3A8A 100%)' }}
                    onClick={() => router.replace('/accounts/login')}
                  >
                    Go to Sign In
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Trust bar */}
          <div className="mt-8 flex flex-wrap justify-center gap-8 text-blue-200 text-sm">
            <span className="flex items-center gap-2"><span>🔒</span> 256-bit Encryption</span>
            <span className="flex items-center gap-2"><span>✅</span> AML/KYC Compliant</span>
            <span className="flex items-center gap-2"><span>🌍</span> 45,000+ Investors</span>
          </div>

        </div>
      </div>
    </div>
  )
}
