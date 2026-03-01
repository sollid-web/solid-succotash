'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/api'

const CARD_PURCHASE_AMOUNT = 1000

type CryptoWallet = {
  currency: 'BTC' | 'USDT' | 'USDC' | 'ETH'
  wallet_address: string
  network: string
  is_active: boolean
}

export default function PurchaseCardPage() {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState<'BTC' | 'USDT' | 'USDC' | 'ETH'>('BTC')
  const [wallets, setWallets] = useState<CryptoWallet[]>([])
  const [selectedWallet, setSelectedWallet] = useState<CryptoWallet | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingWallets, setLoadingWallets] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [copiedAddress, setCopiedAddress] = useState('')

  useEffect(() => {
    const loadWallets = async () => {
      try {
        const res = await apiFetch('/api/crypto-wallets/')
        if (!res.ok) throw new Error('Failed to load wallets')
        const data = await res.json()
        setWallets(Array.isArray(data) ? data : [])
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unable to load wallet addresses')
      } finally {
        setLoadingWallets(false)
      }
    }
    loadWallets()
  }, [])

  useEffect(() => {
    const wallet = wallets.find(
      w => w.currency === paymentMethod && w.is_active
    )
    setSelectedWallet(wallet || null)
  }, [wallets, paymentMethod])

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedAddress(text)
      setMessage(`${label} copied to clipboard!`)
      setTimeout(() => {
        setCopiedAddress('')
        setMessage('')
      }, 3000)
    } catch {
      setError('Failed to copy to clipboard')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedWallet) {
      setError('Selected payment method unavailable')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    try {
      const res = await apiFetch('/api/virtual-cards/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purchase_amount: CARD_PURCHASE_AMOUNT,
          notes: `Virtual card purchase request via ${paymentMethod}`,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data?.detail || data?.error || 'Failed to submit card request')
      }

      setMessage('Card request submitted successfully! Awaiting admin approval.')
      setTimeout(() => {
        router.push('/dashboard/cards')
      }, 2000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment submission failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="inline-flex items-center text-[#2563eb] hover:text-[#1d4ed8] mb-6">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Activate Virtual Card</h1>
          <p className="text-gray-600 mb-8">Request activation of your $1,000 virtual Visa card. Must be approved by admin.</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card Details Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-semibold text-gray-700">Card Type</div>
                  <div className="text-lg font-bold text-gray-900 mt-1">Visa Virtual</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-700">Purchase Amount</div>
                  <div className="text-lg font-bold text-gray-900 mt-1">${CARD_PURCHASE_AMOUNT.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-700">Status</div>
                  <div className="inline-block mt-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                    Pending
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-700">Activation</div>
                  <div className="text-sm text-gray-600 mt-1">Requires admin approval</div>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-semibold text-gray-700 mb-3">
                Payment Method
              </label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => {
                  setPaymentMethod(e.target.value as any)
                  setError('')
                }}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#2563eb] focus:outline-none"
              >
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="USDT">Tether (USDT)</option>
                <option value="USDC">USD Coin (USDC)</option>
                <option value="ETH">Ethereum (ETH)</option>
              </select>
            </div>

            {/* Wallet Address Display */}
            {loadingWallets ? (
              <div className="p-4 bg-gray-50 rounded-xl text-gray-600 text-sm">
                Loading wallet addresses...
              </div>
            ) : selectedWallet ? (
              <div className="rounded-xl border-2 border-blue-200 p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-bold text-gray-800">
                        {selectedWallet.currency} Deposit Address
                      </div>
                      {selectedWallet.network && (
                        <span className="text-xs font-semibold text-gray-600 bg-white px-2 py-1 rounded-lg">
                          Network: {selectedWallet.network}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <div className="font-mono text-xs break-all bg-white border-2 border-gray-200 rounded-lg p-3 pr-20">
                        {selectedWallet.wallet_address}
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(selectedWallet.wallet_address, `${selectedWallet.currency} address`)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white px-3 py-2 rounded-lg text-xs font-semibold hover:shadow-lg transition-all flex items-center space-x-1"
                      >
                        {copiedAddress === selectedWallet.wallet_address ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
                    <div className="flex items-start space-x-2">
                      <svg className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div className="text-xs text-amber-800">
                        <p className="font-semibold mb-1">Important:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Send exactly <strong>${CARD_PURCHASE_AMOUNT}</strong> worth of {selectedWallet.currency}</li>
                          <li>Use the {selectedWallet.network || 'correct'} network only</li>
                          <li>Verify address before confirming</li>
                          <li>Admin approval required (24-72 hours)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                No active wallet configured for {paymentMethod}. Please contact support.
              </div>
            )}

            {/* Terms Note */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="mt-1 w-4 h-4 border-gray-300 rounded focus:ring-[#2563eb]"
                />
                <span className="text-sm text-gray-700">
                  I understand this is a virtual card request and requires manual admin approval before activation. Card details will be provided once approved.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !selectedWallet || loadingWallets}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Submitting Request...' : 'Submit Card Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}