"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import PublicLayout from "@/components/PublicLayout"

// Force dynamic rendering since we use search params
export const dynamic = 'force-dynamic'

function VerifyEmailContent() {
  const router = useRouter()
  const params = useSearchParams()
  const [status, setStatus] = useState<'pending'|'success'|'error'>('pending')
  const [message, setMessage] = useState('Verifying your email...')

  useEffect(() => {
    const token = params.get('token')
    if (!token) {
      setStatus('error')
      setMessage('Missing verification token.')
      return
    }
    fetch(`/api/auth/verify-link/?token=${encodeURIComponent(token)}`)
      .then(res => {
        if (res.redirected) {
          router.replace(res.url)
          return
        }
        return res.json()
      })
      .then(data => {
        if (data?.error) {
          setStatus('error')
          setMessage(data.error)
        } else {
          setStatus('success')
          setMessage('Email verified! Redirecting to sign in...')
          setTimeout(() => router.replace('/accounts/login?verified=1'), 1500)
        }
      })
      .catch(() => {
        setStatus('error')
        setMessage('Verification failed.')
      })
  }, [params, router])

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-lg mx-auto bg.white/80 backdrop-blur rounded-2xl shadow p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
        <div className={`mb-3 text-sm p-2 rounded ${status === 'error' ? 'text-red-700 bg-red-50 border border-red-200' : 'text-green-700 bg-green-50 border border-green-200'}`}>{message}</div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <PublicLayout backgroundClassName="bg-hero-auth overlay-dark-md">
      <Suspense fallback={
        <div className="min-h-screen pt-24 px-4">
          <div className="max-w-lg mx-auto bg-white/80 backdrop-blur rounded-2xl shadow p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
            <div className="text-gray-600">Loading...</div>
          </div>
        </div>
      }>
        <VerifyEmailContent />
      </Suspense>
    </PublicLayout>
  )
}
