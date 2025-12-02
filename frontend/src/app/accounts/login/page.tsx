'use client'

import { useEffect, useMemo, useState } from 'react'
import { getApiBaseUrl } from '@/lib/config'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)

  // Compute API base once and normalize (no trailing slash)
  const apiBase = useMemo(() => getApiBaseUrl(), [])

  // Check for signup success parameter and show success message
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('signup') === 'success') {
        setSignupSuccess(true)
        // Clear the URL parameter after 5 seconds
        setTimeout(() => {
          const newUrl = window.location.pathname
          window.history.replaceState({}, '', newUrl)
        }, 5000)
      }
    }
  }, [])

  // Proactive diagnostics in production: surface misconfiguration early
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isProdLike = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
      // Basic sanity check: apiBase should not point to localhost in production-like environments
      if (isProdLike && apiBase.includes('localhost')) {
        setError('Configuration error: API base URL is still localhost. Set NEXT_PUBLIC_API_URL in environment and redeploy.')
      }
      // Optional lightweight health check
      fetch(`${apiBase}/healthz/`, { method: 'GET' }).catch(() => {
        // Don't override an existing error, only hint if empty
        setError(prev => prev || 'Network error. Please check your connection and try again.')
      })
    }
  }, [apiBase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${apiBase}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for session cookies
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Store token if provided
        if (data.token) {
          localStorage.setItem('authToken', data.token)
          // Also set a cookie so middleware can protect routes (non-HttpOnly client cookie)
          const maxAgeDays = 1
          const maxAge = maxAgeDays * 24 * 60 * 60
          document.cookie = `authToken=${data.token}; Max-Age=${maxAge}; Path=/; SameSite=Lax; Secure`
        }
        // Redirect to dashboard (support return path)
        const params = new URLSearchParams(window.location.search)
        const nextPath = params.get('next') || '/dashboard'
        window.location.href = nextPath
      } else {
        // If backend indicates inactive account, show resend option
        if (data?.inactive) {
          setError('Your account is not verified. Check your email or resend the verification link below.')
        } else {
          setError(data.error || 'Login failed. Please try again.')
        }
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setError('')
    if (!email) {
      setError('Enter your email above to resend the verification link.')
      return
    }
    try {
      const res = await fetch(`${apiBase}/api/auth/verification/resend/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include',
      })
      const data = await res.json()
      if (res.ok) {
        setError('Verification email resent. Please check your inbox.')
      } else {
        setError(data?.error || 'Unable to resend verification. Try again later.')
      }
    } catch (e) {
      console.error('Resend error', e)
      setError('Network error. Please try again later.')
    }
  }

  return (
    <main className="min-h-screen bg-hero-login bg-cover bg-center bg-no-repeat">
      <section className="pt-32 pb-16 bg-black/60 text-white text-center">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-5xl font-extrabold mb-3">Login to Your WolvCapital Dashboard</h1>
          <p className="text-lg text-blue-100 mb-6">Access your secure investment portal to manage funds, track performance, and withdraw earnings.</p>
        </div>
      </section>
      <section className="py-16 bg-white/90 backdrop-blur-[1px]">
        <div className="container mx-auto px-4 lg:px-8 max-w-xl">
          {/* Error and success messages */}
          {signupSuccess && (
            <div className="mb-6 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl">
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-bold text-emerald-800 mb-1">Account Created Successfully!</p>
                  <p className="text-sm text-emerald-700">Please sign in with your credentials to access your dashboard.</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#2563eb] focus:outline-none transition"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#2563eb] focus:outline-none transition"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-[#2563eb] border-gray-300 rounded focus:ring-[#2563eb]" />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <a href={`${apiBase}/accounts/password/reset/`} className="text-sm text-[#2563eb] hover:text-[#1d4ed8] font-semibold transition">Forgot password?</a>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#0b2f6b] via-[#2563eb] to-[#1d4ed8] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            {error.includes('not verified') && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-sm text-[#2563eb] hover:text-[#1d4ed8] font-semibold"
                >
                  Resend verification email
                </button>
              </div>
            )}
          </form>

          <h2 className="text-2xl font-semibold mt-10 mb-4">Dashboard Features</h2>
          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
            <li>What currencies do you accept?<br /><span className="text-blue-700">Bitcoin (BTC), USDT (TRC20/ERC20), Visa card, and other major digital assets.</span></li>
            <li>Is WolvCapital secure?<br /><span className="text-blue-700">Your dashboard is encrypted and monitored with advanced security measures.</span></li>
            <li>Are there hidden fees?<br /><span className="text-blue-700">No. All returns and charges are clearly displayed before you invest.</span></li>
          </ul>
        </div>
      </section>
    </main>
  )
}
