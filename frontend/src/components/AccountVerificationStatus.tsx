"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface VerificationStatus {
  email_verified: boolean
  kyc_status: 'draft' | 'pending' | 'approved' | 'rejected' | null
  phone_verified: boolean
  two_fa_enabled: boolean
  identity_verified: boolean
}

export default function AccountVerificationStatus() {
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setLoading(false)
          return
        }

        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        const response = await fetch(`${apiBase}/api/auth/me/`, {
          headers: {
            Authorization: `Token ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          // Extract verification info from user profile
          setVerificationStatus({
            email_verified: data.email_verified || true,
            kyc_status: data.kyc_status || null,
            phone_verified: data.phone_verified || false,
            two_fa_enabled: data.two_fa_enabled || false,
            identity_verified: data.identity_verified || false
          })
        }
      } catch (error) {
        console.error('Failed to fetch verification status:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVerificationStatus()
  }, [])

  if (loading || !verificationStatus) {
    return null
  }

  const verificationItems = [
    {
      id: 'email',
      label: 'Email Verification',
      status: verificationStatus.email_verified,
      action: verificationStatus.email_verified ? null : '/dashboard/verify-email',
      description: 'Confirm your email address'
    },
    {
      id: 'kyc',
      label: 'KYC Verification',
      status: verificationStatus.kyc_status === 'approved',
      pending: verificationStatus.kyc_status === 'pending',
      action: verificationStatus.kyc_status !== 'approved' ? '/dashboard/kyc' : null,
      description: verificationStatus.kyc_status === 'pending' 
        ? 'Pending review by compliance team'
        : verificationStatus.kyc_status === 'rejected'
        ? 'Resubmit your KYC information'
        : 'Complete identity verification'
    },
    {
      id: '2fa',
      label: 'Two-Factor Authentication',
      status: verificationStatus.two_fa_enabled,
      action: verificationStatus.two_fa_enabled ? null : '/dashboard/security/2fa',
      description: 'Enable 2FA for enhanced security'
    }
  ]

  const completedCount = verificationItems.filter(v => v.status || v.pending).length
  const completionPercentage = Math.round((completedCount / verificationItems.length) * 100)

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-[#0b2f6b] mb-2">Account Security</h3>
          <p className="text-gray-600">Complete your verification to unlock full platform access</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-[#0b2f6b]">{completionPercentage}%</div>
          <div className="text-sm text-gray-600">Complete</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
        <div
          className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      {/* Verification Items */}
      <div className="space-y-4">
        {verificationItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
              item.status
                ? 'bg-green-50 border-green-200'
                : item.pending
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                item.status
                  ? 'bg-green-200'
                  : item.pending
                  ? 'bg-yellow-200'
                  : 'bg-gray-200'
              }`}>
                {item.status ? (
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : item.pending ? (
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0h.01m4.99-6a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0h.01" />
                  </svg>
                )}
              </div>
              <div>
                <h4 className={`font-semibold ${
                  item.status
                    ? 'text-green-800'
                    : item.pending
                    ? 'text-yellow-800'
                    : 'text-gray-700'
                }`}>
                  {item.label}
                </h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
            {item.action && (
              <Link
                href={item.action}
                className="px-4 py-2 bg-[#0b2f6b] text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors whitespace-nowrap"
              >
                {item.status ? 'Verify' : item.pending ? 'Pending' : 'Complete'}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Security Tips */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
        <h4 className="font-bold text-blue-900 mb-2">💡 Security Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Keep your password strong and never share it with anyone</li>
          <li>• Enable two-factor authentication for maximum security</li>
          <li>• Verify your identity to unlock higher investment limits</li>
          <li>• Review your account activity regularly</li>
        </ul>
      </div>
    </div>
  )
}
