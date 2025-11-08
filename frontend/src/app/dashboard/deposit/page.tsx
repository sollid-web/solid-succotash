'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

interface CompanyWallet {
  currency: string
  wallet_address: string
  network: string
  is_active: boolean
  updated_at: string
}

export default function DepositPage() {
  const apiBase = useMemo(() => (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, ''), [])
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('bank_transfer')
  const [reference, setReference] = useState('')
  const [txHash, setTxHash] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [companyWallets, setCompanyWallets] = useState<CompanyWallet[]>([])
  const [showWallets, setShowWallets] = useState(false)

  useEffect(() => {
    const loadWallets = async () => {
      try {
        const res = await fetch(`${apiBase}/api/crypto-wallets/`)
        if (res.ok) {
          const data = await res.json()
          setCompanyWallets(Array.isArray(data) ? data : [])
        }
      } catch (e) {
        console.warn('Failed to load company wallets', e)
      }
    }
    loadWallets()
  }, [apiBase])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (!amount) return setError('Please enter an amount')
    if (!reference) return setError('Please provide a reference or note')

    const token = localStorage.getItem('authToken')
    if (!token) {
      window.location.href = '/accounts/login?next=/dashboard/deposit'
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${apiBase}/api/transactions/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
        credentials: 'include',
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

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="depositAmount" className="block text-sm font-semibold text-gray-700 mb-2">Amount (USD)</label>
            <input id="depositAmount" aria-label="Deposit amount" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#2563eb]" placeholder="0.00"/>
          </div>
          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
            <select id="paymentMethod" aria-label="Payment method" value={method} onChange={(e) => setMethod(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#2563eb]">
              <option value="bank_transfer">Bank Transfer</option>
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="USDT">Tether (USDT)</option>
              <option value="USDC">USD Coin (USDC)</option>
              <option value="ETH">Ethereum (ETH)</option>
            </select>
            {['BTC','USDT','USDC','ETH'].includes(method) && (
              <div className="mt-3 space-y-3">
                <button type="button" onClick={() => setShowWallets(!showWallets)} className="text-xs text-[#2563eb] underline">
                  {showWallets ? 'Hide' : 'Show'} Company {method} Deposit Info
                </button>
                {showWallets && (
                  <div className="rounded-xl border-2 border-blue-100 p-3 bg-blue-50/50">
                    {companyWallets.filter(w => w.currency === method).map(w => (
                      <div key={w.currency} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-700">Address:</span>
                          <button type="button" onClick={() => { navigator.clipboard.writeText(w.wallet_address); setMessage(`${w.currency} address copied.`) }} className="text-xs text-[#2563eb] underline">Copy</button>
                        </div>
                        <div className="font-mono text-xs break-all select-all">{w.wallet_address}</div>
                        {w.network && <div className="text-[10px] text-gray-500">Network: {w.network}</div>}
                        <div className="pt-2 flex items-center space-x-4">
                          <QRCode address={w.wallet_address} />
                          <CryptoIcon currency={w.currency} />
                        </div>
                      </div>
                    ))}
                    {companyWallets.filter(w => w.currency === method).length === 0 && (
                      <div className="text-xs text-gray-500">No active {method} wallet configured.</div>
                    )}
                  </div>
                )}
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
  // Lightweight inline QR generation via third-party API placeholder (could be replaced with local lib)
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(address)}`
  return (
    <img
      src={src}
      alt="Wallet address QR code"
      className="w-20 h-20 rounded-lg border border-gray-200 bg-white"
      loading="lazy"
    />
  )
}

function CryptoIcon({ currency }: { currency: string }) {
  const base = 'w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white'
  if (currency === 'BTC') return <div className={`${base} bg-orange-500`}>BTC</div>
  if (currency === 'ETH') return <div className={`${base} bg-gray-700`}>ETH</div>
  if (currency === 'USDT') return <div className={`${base} bg-green-600`}>USDT</div>
  if (currency === 'USDC') return <div className={`${base} bg-blue-600`}>USDC</div>
  return <div className={`${base} bg-gray-400`}>{currency}</div>
}
