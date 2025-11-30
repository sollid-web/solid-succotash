"use client"

import { useEffect, useState } from 'react'
import PublicLayout from '@/components/PublicLayout'
import { getApiBaseUrl } from '@/lib/config'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
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
      const resp = await fetch(`${apiBase}/api/auth/complete-signup/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data?.error || 'Signup failed')
      setStep('sent')
    } catch (e) {
      setError('Failed to complete signup.')
    } finally { setLoading(false) }
  }

  return (
    <PublicLayout backgroundClassName="bg-hero-auth overlay-dark-md">
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-lg mx-auto bg.white/80 backdrop-blur rounded-2xl shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Create your account</h1>
          {error && <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{error}</div>}
          {message && <div className="mb-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded p-2">{message}</div>}

          {step === 'form' && (
            <div className="space-y-4">
              <label className="block text-sm font-semibold">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="you@example.com" />
              <label className="block text-sm font-semibold">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="••••••••" />
              <label className="block text-sm font-semibold">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="••••••••" />
              <button onClick={completeSignup} disabled={loading || !email || password.length < 8 || confirmPassword !== password} className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50">Sign Up</button>
            </div>
          )}

          {step === 'sent' && (
            <div className="space-y-4 text-center">
              <div className="text-green-700 font-semibold">Registration successful!</div>
              <div className="text-sm">Check your email for a verification link.<br />Click the link to verify your email and activate your account.</div>
              <button className="mt-4 w-full bg-gray-200 text-gray-800 py-2 rounded" onClick={() => router.replace('/accounts/login')}>Go to Sign In</button>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  )
}
