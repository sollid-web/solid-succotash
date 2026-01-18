'use client'

import { useEffect, useState } from 'react'
import { apiFetch, buildApiUrl } from '@/lib/api'
import Link from 'next/link'

interface CompanyWallet {
  currency: string
  wallet_address: string
  network: string
  is_active: boolean
  updated_at: string
}

export default function DepositPage() {
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('BTC')
  const [reference, setReference] = useState('')
  const [txHash, setTxHash] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [companyWallets, setCompanyWallets] = useState<CompanyWallet[]>([])
  const [showWallets, setShowWallets] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState('')

  useEffect(() => {
    const loadWallets = async () => {
      try {
        console.log('Loading wallets from:', buildApiUrl('/api/crypto-wallets/'))
        const res = await apiFetch('/api/crypto-wallets/', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        })
        console.log('Wallet fetch response status:', res.status)
        if (res.ok) {
          const data = await res.json()
          console.log('Loaded wallets:', data)
          setCompanyWallets(Array.isArray(data) ? data : [])
          // Show wallets section when crypto method is selected
          if (['BTC','USDT','USDC','ETH'].includes(method)) {
            setShowWallets(true)
          }
        } else {
          const errorText = await res.text()
          console.error('Failed to load wallets, status:', res.status, 'Response:', errorText)
          setError(`Failed to load wallet addresses. Status: ${res.status}`)
        }
      } catch (e) {
        console.error('Error loading company wallets:', e)
        setError(`Network error loading wallet addresses: ${e instanceof Error ? e.message : 'Unknown error'}`)
      }
    }
    loadWallets()
  }, [method])

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedAddress(text)
      setMessage(`${label} copied to clipboard!`)
      setTimeout(() => {
        setCopiedAddress('')
        setMessage('')
      }, 3000)
    } catch (err) {
      setError('Failed to copy to clipboard')
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (!amount) return setError('Please enter an amount')
    if (!reference) return setError('Please provide a reference or note')

    setLoading(true)
    try {
      const res = await apiFetch('/api/transactions/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tx_type: 'deposit',
          amount: Number(amount),
          reference,
          payment_method: method,
          tx_hash: txHash,
          wallet_address_used: walletAddress,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setMessage('Deposit request submitted. Awaiting approval.')
        setTimeout(() => (window.location.href = '/dashboard'), 1000)
      } else {
        setError(data?.detail || data?.non_field_errors?.[0] || 'Failed to submit deposit')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Deposit Funds</h1>
        <Link href="/dashboard" className="text-sm text-[#2563eb] hover:underline">Back to dashboard</Link>
      </div>

      <form onSubmit={submit} className="space-y-6 max-w-xl">
        {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}
        {message && <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm">{message}</div>}
        
        {/* Debug block removed for production build (was conditional on NODE_ENV) */}

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="depositAmount" className="block text-sm font-semibold text-gray-700 mb-2">Amount (USD)</label>
            <input id="depositAmount" aria-label="Deposit amount" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#2563eb]" placeholder="0.00"/>
          </div>
          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
            <select id="paymentMethod" aria-label="Payment method" value={method} onChange={(e) => {
              setMethod(e.target.value)
              setShowWallets(['BTC','USDT','USDC','ETH'].includes(e.target.value))
              setError('') // Clear any previous errors
            }} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#2563eb]">
              <option value="bank_transfer">Bank Transfer</option>
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="USDT">Tether (USDT)</option>
              <option value="USDC">USD Coin (USDC)</option>
              <option value="ETH">Ethereum (ETH)</option>
            </select>
            {['BTC','USDT','USDC','ETH'].includes(method) && showWallets && (
              <div className="mt-3 space-y-3">
                {/* Company wallet address for selected crypto method */}
                <div className="rounded-xl border-2 border-blue-200 p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
                  {companyWallets.filter(w => w.currency === method && w.is_active).map(w => (
                    <div key={w.currency} className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                        <div className="flex items-center space-x-2">
                          <CryptoIcon currency={w.currency} />
                          <span className="text-sm font-bold text-gray-800">{w.currency} Deposit Address</span>
                        </div>
                        {w.network && <span className="text-xs font-semibold text-gray-600 bg-white px-2 py-1 rounded-lg">Network: {w.network}</span>}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Wallet Address</span>
                        </div>
                        <div className="relative group">
                          <div className="font-mono text-xs break-all bg-white border-2 border-gray-200 rounded-lg p-3 pr-20 hover:border-blue-300 transition">
                            {w.wallet_address}
                          </div>
                          <button 
                            type="button" 
                            onClick={() => copyToClipboard(w.wallet_address, `${w.currency} address`)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center space-x-1"
                          >
                            {copiedAddress === w.wallet_address ? (
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
                      <div className="flex items-center justify-center pt-3 pb-1">
                        <div className="text-center">
                          <QRCode address={w.wallet_address} />
                          <p className="text-[10px] text-gray-500 mt-2">Scan QR to copy address</p>
                        </div>
                      </div>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-1">
                        <div className="flex items-start space-x-2">
                          <svg className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <div className="text-xs text-amber-800">
                            <p className="font-semibold">Important:</p>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              <li>Only send {w.currency} to this address</li>
                              <li>Verify the network is {w.network || 'correct'} before sending</li>
                              <li>Double-check the address before confirming transaction</li>
                              <li>Deposits require manual approval (24-72 hours)</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {companyWallets.length === 0 && (
                    <div className="text-center py-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 mb-2">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">Loading wallet addresses...</p>
                      <p className="text-xs text-gray-500 mt-1">Please wait while we fetch deposit information</p>
                    </div>
                  )}
                  {companyWallets.length > 0 && companyWallets.filter(w => w.currency === method && w.is_active).length === 0 && (
                    <div className="text-center py-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-2">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">No active {method} wallet configured</p>
                      <p className="text-xs text-gray-500 mt-1">Please contact support for deposit information</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="depositReference" className="block text-sm font-semibold text-gray-700 mb-2">Reference / Notes</label>
          <input id="depositReference" aria-label="Deposit reference or notes" value={reference} onChange={(e) => setReference(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#2563eb]" placeholder="e.g., Bank transfer ref or wallet used"/>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="cryptoTxHash" className="block text-sm font-semibold text-gray-700 mb-2">Crypto Tx Hash (optional)</label>
            <input id="cryptoTxHash" aria-label="Cryptocurrency transaction hash" value={txHash} onChange={(e) => setTxHash(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#2563eb]"/>
          </div>
          <div>
            <label htmlFor="walletAddressUsed" className="block text-sm font-semibold text-gray-700 mb-2">Wallet Address Used (optional)</label>
            <input id="walletAddressUsed" aria-label="Wallet address used" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#2563eb]"/>
          </div>
        </div>

        <button type="submit" disabled={loading} className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50">
          {loading ? 'Submitting...' : 'Submit Deposit'}
        </button>
      </form>
    </div>
  )
}

function QRCode({ address }: { address: string }) {
  const [imageError, setImageError] = useState(false)
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(address)}&bgcolor=ffffff&color=000000&format=png&margin=1`
  
  if (imageError) {
    return (
      <div className="w-28 h-28 rounded-lg border-2 border-gray-300 bg-gray-50 p-1 shadow-sm flex items-center justify-center">
        <div className="text-center">
          <svg className="w-8 h-8 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs text-gray-500">QR Code</span>
        </div>
      </div>
    )
  }
  
  return (
    <img
      src={src}
      alt="Wallet address QR code"
      className="w-28 h-28 rounded-lg border-2 border-gray-300 bg-white p-1 shadow-sm"
      loading="lazy"
      onError={() => setImageError(true)}
    />
  )
}

function CryptoIcon({ currency }: { currency: string }) {
  const base = 'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md'
  if (currency === 'BTC') return <div className={`${base} bg-gradient-to-br from-orange-400 to-orange-600`}>₿</div>
  if (currency === 'ETH') return <div className={`${base} bg-gradient-to-br from-gray-600 to-gray-800`}>Ξ</div>
  if (currency === 'USDT') return <div className={`${base} bg-gradient-to-br from-green-500 to-green-700`}>₮</div>
  if (currency === 'USDC') return <div className={`${base} bg-gradient-to-br from-blue-500 to-blue-700`}>$</div>
  return <div className={`${base} bg-gradient-to-br from-gray-400 to-gray-600`}>{currency[0]}</div>
}
