'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Use environment variable for API URL
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    window.location.href = `${apiBase}/accounts/signup/?email=${encodeURIComponent(email)}`;
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

        {/* Signup Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          <h1 className="text-3xl font-bold text-[#0b2f6b] mb-2 text-center">Create Account</h1>
          <p className="text-gray-600 text-center mb-8">Start your investment journey today</p>

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
              <label htmlFor="password1" className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                id="password1"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#2563eb] focus:outline-none transition"
                placeholder="••••••••"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
            </div>

            <div>
              <label htmlFor="password2" className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
              <input 
                type="password" 
                id="password2"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#2563eb] focus:outline-none transition"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-start">
              <input 
                type="checkbox" 
                id="terms"
                className="w-4 h-4 mt-1 text-[#2563eb] border-gray-300 rounded focus:ring-[#2563eb]"
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                I agree to the{' '}
                <Link href="/terms-of-service" className="text-[#2563eb] hover:underline font-semibold">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-[#2563eb] hover:underline font-semibold">Privacy Policy</Link>
              </label>
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-[#0b2f6b] via-[#2563eb] to-[#1d4ed8] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Create Account
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account? {' '}
              <Link href="/accounts/login" className="text-[#2563eb] hover:text-[#1d4ed8] font-bold transition">Sign In</Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> All accounts require admin approval for deposits and withdrawals. Manual verification ensures maximum security.
              </p>
            </div>
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
