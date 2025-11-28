"use client"

import { useState } from 'react'
import PublicLayout from '@/components/PublicLayout'
import { getApiBaseUrl } from '@/lib/config'

export default function SignupPage() {
  const [step, setStep] = useState<'email' | 'code' | 'password'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const apiBase = getApiBaseUrl()

  const requestCode = async () => {
    setLoading(true); setError(''); setMessage('')
    try {
      const resp = await fetch(`${apiBase}/api/auth/verification/send/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data?.error || 'Failed to send code')
      setMessage('Verification code sent to your email.')
      setStep('code')
    } catch (e) {
      setError('Could not send code.')
    } finally { setLoading(false) }
  }

  const verifyCode = async () => {
    setLoading(true); setError(''); setMessage('')
    try {
      const resp = await fetch(`${apiBase}/api/auth/verification/verify/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data?.error || 'Invalid or expired code')
      setMessage('Email verified. Continue to set password.')
      setStep('password')
    } catch (e) {
      setError('Invalid or expired code.')
    } finally { setLoading(false) }
  }

  const completeSignup = async () => {
    setLoading(true); setError(''); setMessage('')
    try {
      const resp = await fetch(`${apiBase}/api/auth/token/generate/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data?.error || 'Signup failed')
      setMessage('Registration complete. Redirecting to dashboard...')
      localStorage.setItem('authToken', data.token)
      setTimeout(() => { window.location.href = '/dashboard' }, 800)
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

          {step === 'email' && (
            <div className="space-y-4">
              <label className="block text-sm font-semibold">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="you@example.com" />
              <button onClick={requestCode} disabled={loading || !email} className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50">Send Verification Code</button>
            </div>
          )}

          {step === 'code' && (
            <div className="space-y-4">
              <label className="block text-sm font-semibold">Enter 4-digit code</label>
              <input type="text" value={code} maxLength={4} onChange={e => setCode(e.target.value)} className="w-full border rounded px-3 py-2 tracking-widest" placeholder="1234" />
              <div className="flex gap-2">
                <button onClick={verifyCode} disabled={loading || code.length !== 4} className="flex-1 bg-green-600 text-white py-2 rounded disabled:opacity-50">Verify</button>
                <button onClick={requestCode} disabled={loading} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded">Resend</button>
              </div>
            </div>
          )}

          {step === 'password' && (
            <div className="space-y-4">
              <label className="block text-sm font-semibold">Choose a password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="••••••••" />
              <button onClick={completeSignup} disabled={loading || password.length < 8} className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50">Complete Registration</button>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  )
}
