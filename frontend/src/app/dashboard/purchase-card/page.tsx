'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'

type Wallet = {
  currency: 'BTC' | 'USDT' | 'USDC' | 'ETH'
  wallet_address: string
  network: string
  is_active: boolean
  updated_at: string
}

const QR_URL = (data: string) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(data)}`

export default function PurchaseCardPage() {
  const [paymentMethod, setPaymentMethod] = useState<'BTC' | 'USDT' | 'USDC' | 'ETH'>('BTC')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null)
  const [cardRequestId, setCardRequestId] = useState('')
  const [txnId, setTxnId] = useState('')

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const resp = await apiFetch('/api/crypto-wallets/')
        const data = await resp.json()
        if (!active) return
        setWallets(Array.isArray(data) ? data : [])
      } catch {
        // ignore
      }
    })()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const w = wallets.find((w) => w.currency === paymentMethod && w.is_active)
    setSelectedWallet(w || null)
  }, [wallets, paymentMethod])

  const qrData = useMemo(() => {
    if (!selectedWallet) return ''
    const memo = `Virtual Card Payment $1000 via ${paymentMethod}`
    return `${selectedWallet.wallet_address}\n${memo}`
  }, [selectedWallet, paymentMethod])

  const copyAddress = async () => {
    if (!selectedWallet) return
    try {
      await navigator.clipboard.writeText(selectedWallet.wallet_address)
      alert('Wallet address copied')
    } catch {
      alert('Copy failed')
    }
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      // 1) Create deposit transaction
      const txResp = await apiFetch('/api/transactions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tx_type: 'deposit',
          amount: 1000,
          reference: 'Virtual Card Activation Payment',
          payment_method: paymentMethod,
          wallet_address_used: selectedWallet?.wallet_address || '',
          tx_hash: ''
        })
      })
      const txData = await txResp.json().catch(() => ({}))
      if (!txResp.ok) {
        throw new Error(txData?.detail || txData?.non_field_errors?.[0] || 'Payment submission failed')
      }
      setTxnId(txData?.id || '')

      // 2) Create virtual card request
      const cardResp = await apiFetch('/api/virtual-cards/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ purchase_amount: 1000, notes: 'Card activation payment submitted' })
      })
      const cardData = await cardResp.json().catch(() => ({}))
      if (!cardResp.ok) {
        throw new Error(cardData?.error || cardData?.detail || 'Card request failed')
      }
      setCardRequestId(cardData?.id || '')

      setMessage('Payment submitted. Awaiting admin approval for virtual card request.')
    } catch (err) {
      setError('Network error. Please try again.')
      console.error('Payment error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-[#2563eb] hover:text-[#1d4ed8] mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Activate Your Virtual Card</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete your card payment and unlock global transactions, unlimited withdrawals, and account upgrade
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Card Activation Payment</h2>
                <div className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full font-bold">
                  $1,000.00
                </div>
              </div>
              <p className="text-gray-600">One-time activation fee to unlock all premium card features</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {message && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-green-700 text-sm">{message}</p>
              </div>
            )}

            <form onSubmit={handlePayment} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'BTC', label: 'Bitcoin (BTC)', icon: '₿' },
                    { value: 'ETH', label: 'Ethereum (ETH)', icon: 'Ξ' },
                    { value: 'USDT', label: 'Tether (USDT)', icon: '₮' },
                    { value: 'USDC', label: 'USD Coin (USDC)', icon: '$' }
                  ].map(method => (
                    <label key={method.value} className="relative">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={paymentMethod === method.value}
                        onChange={() => setPaymentMethod(method.value as 'BTC' | 'USDT' | 'USDC' | 'ETH')}
                        className="peer sr-only"
                      />
                      <div className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer peer-checked:border-[#2563eb] peer-checked:bg-blue-50 hover:border-gray-300 transition">
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">
                          {method.icon}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{method.label}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-yellow-800">Payment Instructions</p>
                    <ul className="text-xs text-yellow-700 mt-1 space-y-1">
                      <li>• Payment must be made via cryptocurrency deposit only</li>
                      <li>• Account balance cannot be used for card activation</li>
                      <li>• Card will be activated within 24-72 hours after payment confirmation</li>
                      <li>• One-time activation fee of $1,000 is non-refundable</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Wallet address + QR */}
              <div className="mt-4">
                {selectedWallet ? (
                  <div className="border rounded-xl p-4 flex items-center gap-4">
                    <img
                      src={QR_URL(qrData)}
                      alt="QR"
                      className="w-24 h-24 border rounded"
                    />
                    <div className="flex-1">
                      <div className="text-sm text-gray-500">Send exactly</div>
                      <div className="font-semibold">$1,000 in {paymentMethod}</div>
                      <div className="mt-2 text-sm text-gray-500">To wallet ({selectedWallet.network || 'network not specified'}):</div>
                      <div className="mt-1 font-mono break-all">{selectedWallet.wallet_address}</div>
                      <button
                        type="button"
                        onClick={copyAddress}
                        className="mt-2 text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                      >Copy Address</button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 border rounded bg-yellow-50 text-yellow-700">Selected payment method currently unavailable.</div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-cta-sky w-full py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Complete Card Payment</span>
                  </>
                )}
              </button>
            </form>

            {/* Awaiting Approval State */}
            {(txnId || cardRequestId) && (
              <div className="mt-6 p-4 border rounded bg-green-50 text-green-700 space-y-1">
                <div className="font-semibold">Awaiting Admin Approval</div>
                <div className="text-sm">Deposit reference ID: {txnId || '—'}</div>
                <div className="text-sm">Card request ID: {cardRequestId || '—'}</div>
                <a href="/dashboard/cards" className="text-sm text-indigo-700 underline">View card requests</a>
              </div>
            )}
          </div>

          {/* Benefits Summary */}
          <div className="space-y-6">
            {/* What You Get */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">What You Get</h3>
              <div className="space-y-4">
                {[
                  {
                    icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                    title: "Global Transaction Access",
                    desc: "Make purchases worldwide instantly"
                  },
                  {
                    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1",
                    title: "Unlimited Withdrawals",
                    desc: "No restrictions on fund access"
                  },
                  {
                    icon: "M13 10V3L4 14h7v7l9-11h-7z",
                    title: "Instant Processing",
                    desc: "Lightning-fast payment processing"
                  },
                  {
                    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                    title: "Premium Account Upgrade",
                    desc: "Access to enhanced platform features"
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={benefit.icon} />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{benefit.title}</h4>
                      <p className="text-sm text-gray-600">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Promise */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6 border border-blue-100">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-2">Security & Trust</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Your payment is secured with bank-level encryption. We never store your payment information.
                  </p>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs text-blue-600 font-semibold">SSL Encrypted</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h4 className="font-semibold text-gray-800 mb-3">Need Help?</h4>
              <p className="text-sm text-gray-600 mb-4">
                Our support team is available 24/7 to assist with your card activation.
              </p>
              <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
