"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { apiFetch, getApiBaseUrl } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [referralCode, setReferralCode] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [step, setStep] = useState<'form' | 'sent'>('form')

  const apiBase = getApiBaseUrl()
  const router = useRouter()

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
      console.log('Attempting signup with API:', apiBase)
      const resp = await apiFetch('/api/auth/complete-signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, referral_code: referralCode || undefined })
      })
      console.log('Signup response status:', resp.status)
      const data = await resp.json()
      console.log('Signup response data:', data)
      if (!resp.ok) {
        setError(data?.error || 'Signup failed. Please try again.')
        return
      }
      setStep('sent')
    } catch (e: any) {
      console.error('Signup error:', e)
      setError(e?.message || 'Failed to complete signup. Please check your connection.')
    } finally { setLoading(false) }
  }

  return (
    <>
    <div className="relative">
      {/* Full-page background hero image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/legal/home-hero.png"
          alt="WolvCapital - Join Global Investors"
          fill
          priority
          className="object-cover object-center"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/75 to-black/85" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <Link href="/" className="inline-block mb-8">
              <Image src="/wolv-logo.svg" alt="WolvCapital" width={180} height={60} />
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-2xl mb-6">
              Create Your WolvCapital Account
            </h1>
            <p className="text-xl md:text-2xl text-white/95 drop-shadow-lg max-w-3xl mx-auto leading-relaxed">
              Join 45,000+ global investors growing their digital assets through a secure and transparent platform.
            </p>
          </div>

          {/* Main Content Panel */}
          <div className="backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
            {/* Benefits Section */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">Why Create an Account?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { icon: "📊", title: "Access All Plans", desc: "Choose from 4 investment tiers with 1%–2% daily ROI" },
                  { icon: "📈", title: "Real-Time Tracking", desc: "Monitor your daily ROI and portfolio growth live" },
                  { icon: "💰", title: "Weekly Withdrawals", desc: "Withdraw profits every 7 days with secure processing" },
                  { icon: "🛡️", title: "Professional Security", desc: "AML/KYC compliance and 256-bit encryption" },
                  { icon: "🤝", title: "Referral Rewards", desc: "Earn 3% commission from your network's investments" },
                  { icon: "💬", title: "24/7 Support", desc: "Instant assistance from our dedicated team" }
                ].map((benefit, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <span className="text-3xl flex-shrink-0">{benefit.icon}</span>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{benefit.title}</h3>
                      <p className="text-sm text-gray-700">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3-Step Process */}
            <div className="mb-10 p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white">
              <h2 className="text-2xl font-bold mb-4 text-center">Sign Up in 3 Easy Steps</h2>
              <ol className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">1</span>
                  <span>Enter your email and create a secure password</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">2</span>
                  <span>Verify your email with the confirmation link</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">3</span>
                  <span>Start investing and earning 1%–2% daily ROI</span>
                </li>
              </ol>
            </div>

            {/* Signup Form */}
            <div className="max-w-md mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">Create Your Account</h2>
              
              {error && <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-4">{error}</div>}
              {message && <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl p-4">{message}</div>}

              {step === 'form' && (
                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); completeSignup(); }}>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-blue-600 focus:ring focus:ring-blue-200 transition-all" 
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Password</label>
                    <input 
                      type="password" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-blue-600 focus:ring focus:ring-blue-200 transition-all" 
                      placeholder="••••••••"
                      minLength={8}
                      required
                    />
                    <p className="text-xs text-gray-600 mt-1">Must be at least 8 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Confirm Password</label>
                    <input 
                      type="password" 
                      value={confirmPassword} 
                      onChange={e => setConfirmPassword(e.target.value)} 
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-blue-600 focus:ring focus:ring-blue-200 transition-all" 
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Referral Code (Optional)</label>
                    <input 
                      type="text" 
                      value={referralCode} 
                      onChange={e => setReferralCode(e.target.value.trim())} 
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-blue-600 focus:ring focus:ring-blue-200 transition-all" 
                      placeholder="ABC123"
                    />
                    <p className="text-xs text-gray-600 mt-1">Have a referral code? Enter it here</p>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading || !email || password.length < 8 || confirmPassword !== password} 
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? 'Creating Account...' : 'Create Free Account'}
                  </button>

                  <div className="text-center pt-4">
                    <p className="text-gray-700">
                      Already have an account?{' '}
                      <Link href="/accounts/login" className="text-blue-600 font-bold hover:underline">
                        Sign In
                      </Link>
                    </p>
                  </div>

                  <div className="text-center pt-2 text-xs text-gray-600">
                    By creating an account, you agree to our{' '}
                    <Link href="/terms-of-service" className="text-blue-600 hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                  </div>
                </form>
              )}

              {step === 'sent' && (
                <div className="space-y-6 text-center">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-2xl font-bold text-green-700">Registration Successful!</h3>
                  <div className="text-gray-700 space-y-3">
                    <p className="text-lg">Check your email for a verification link.</p>
                    <p>Click the link to verify your email and activate your account.</p>
                    <p className="text-sm text-gray-600">Didn't receive the email? Check your spam folder.</p>
                  </div>
                  <button 
                    className="mt-6 w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition-all duration-300" 
                    onClick={() => router.replace('/accounts/login')}
                  >
                    Go to Sign In
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 text-center">
            <div className="flex flex-wrap justify-center gap-8 text-white/90">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔒</span>
                <span className="font-semibold">256-bit Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <span className="font-semibold">AML/KYC Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌍</span>
                <span className="font-semibold">45,000+ Investors</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
