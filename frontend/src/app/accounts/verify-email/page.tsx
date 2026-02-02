"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import PublicLayout from "@/components/PublicLayout"
import { apiFetch, getApiBaseUrl } from "@/lib/api"

// Force dynamic rendering since we use search params
export const dynamic = 'force-dynamic'

function VerifyEmailContent() {
  const router = useRouter()
  const params = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Verifying your email address...')
  const [redirectUrl, setRedirectUrl] = useState('/accounts/login')

  useEffect(() => {
    const token = params.get('token')
    
    if (!token) {
      setStatus('error')
      setMessage('Verification token is missing. Please check your email link.')
      setRedirectUrl('/accounts/signup')
      return
    }

    // Call the backend API to verify the token
    const apiBase = getApiBaseUrl()
    const verifyUrl = `${apiBase}/api/auth/verify-email/?token=${encodeURIComponent(token)}`
    
    console.log('Email Verification Debug:')
    console.log('- API URL:', apiBase)
    console.log('- Verify URL:', verifyUrl)
    console.log('- Token (first 20 chars):', token.substring(0, 20))
    
    apiFetch(verifyUrl, {
      headers: {
        'Accept': 'application/json',
      },
    })
      .then(res => {
        console.log('- Response Status:', res.status)
        console.log('- Response OK:', res.ok)
        return res.json()
      })
      .then(data => {
        console.log('- Response Data:', data)
        
        if (data.success) {
          setStatus('success')
          setMessage(data.message || 'Email verified successfully!')
          setRedirectUrl(data.redirect_url || '/accounts/login')
          
          // Auto-redirect after 3 seconds
          setTimeout(() => {
            router.push(data.redirect_url || '/accounts/login')
          }, 3000)
        } else {
          setStatus('error')
          setMessage(data.error || 'Email verification failed.')
          setRedirectUrl(data.redirect_url || '/accounts/signup')
        }
      })
      .catch((error) => {
        console.error('Verification fetch error:', error)
        setStatus('error')
        setMessage('Failed to verify email. Please try again or contact support.')
        setRedirectUrl('/accounts/signup')
      })
  }, [params, router])

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-lg mx-auto bg-white/95 backdrop-blur rounded-2xl shadow-xl p-8 text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Verifying Email</h1>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg
                className="h-10 w-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Email Verified!</h1>
            <p className="text-gray-700 mb-6">{message}</p>
            <p className="text-sm text-gray-500 mb-6">Redirecting to login in 3 seconds...</p>
            <Link
              href={redirectUrl}
              className="btn-cta-sky inline-block px-8 py-3 rounded-lg font-semibold"
            >
              Go to Login Now
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <svg
                className="h-10 w-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Verification Failed</h1>
            <p className="text-gray-700 mb-6">{message}</p>
            <div className="space-y-3">
              <Link
                href="/accounts/login"
                className="btn-cta-sky block w-full px-6 py-3 rounded-lg font-semibold"
              >
                Go to Login
              </Link>
              <Link
                href="/accounts/signup"
                className="block w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Sign Up Again
              </Link>
            </div>
          </>
        )}
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
