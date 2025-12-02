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
      const resp = await fetch(`${apiBase}/api/auth/complete-signup/`, {
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
    <PublicLayout backgroundClassName="bg-hero-auth overlay-dark-md">
      <main className="min-h-screen bg-white">
        <section className="max-w-2xl mx-auto py-16 px-4">
          <h1 className="text-4xl font-bold mb-6">Create Your WolvCapital Account</h1>
          <p className="text-lg text-gray-700 mb-8">Join thousands of global investors growing their digital assets through a secure and transparent platform.</p>
          <h2 className="text-2xl font-semibold mb-4">Why Create an Account?</h2>
          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
            <li>Access all investment plans</li>
            <li>Track your daily ROI in real time</li>
            <li>Withdraw profits every 7 days</li>
            <li>Manage your wallet and referrals</li>
            <li>Receive instant support from our team</li>
          </ul>
          <h2 className="text-2xl font-semibold mb-4">Sign Up in 3 Easy Steps</h2>
          <ol className="list-decimal pl-6 mb-6 text-gray-700 space-y-2">
            <li>Enter your name and email</li>
            <li>Choose a secure password</li>
            <li>Verify your account and start investing</li>
          </ol>
          <p className="text-lg text-blue-700 font-semibold mt-8">Your financial growth starts here.</p>

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
              <label className="block text-sm font-semibold">Referral Code (optional)</label>
              <input type="text" value={referralCode} onChange={e => setReferralCode(e.target.value.trim())} className="w-full border rounded px-3 py-2" placeholder="ABC123" />
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
        </section>
      </main>
    </PublicLayout>
  )
}
