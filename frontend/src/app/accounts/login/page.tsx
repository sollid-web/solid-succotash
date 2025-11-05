'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

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
        }
        // Redirect to dashboard
        window.location.href = '/dashboard'
      } else {
        setError(data.error || 'Login failed. Please try again.')
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b2f6b] via-[#1d4ed8] to-[#2563eb] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
              <span className="text-3xl font-bold text-[#0b2f6b]">W</span>
            </div>
            <span className="text-3xl font-bold text-white">WolvCapital</span>
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          <h1 className="text-3xl font-bold text-[#0b2f6b] mb-2 text-center">Welcome Back</h1>
          <p className="text-gray-600 text-center mb-8">Sign in to access your investment dashboard</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}

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
              <a href={(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/accounts/password/reset/'} className="text-sm text-[#2563eb] hover:text-[#1d4ed8] font-semibold transition">Forgot password?</a>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#0b2f6b] via-[#2563eb] to-[#1d4ed8] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account? {' '}
              <Link href="/accounts/signup" className="text-[#2563eb] hover:text-[#1d4ed8] font-bold transition">Sign Up</Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              By signing in, you agree to our{' '}
              <Link href="/terms-of-service" className="text-[#2563eb] hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-[#2563eb] hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-white hover:text-gray-200 font-semibold transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
