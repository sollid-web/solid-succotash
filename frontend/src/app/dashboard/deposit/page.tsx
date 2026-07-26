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

  const readErrorMessage = async (res: Response) => {
    const text = await res.text()
    if (!text) return `Request failed (${res.status})`
    try {
      const data = JSON.parse(text)
      if (data?.detail) return String(data.detail)
      if (data?.error) return String(data.error)
      if (Array.isArray(data?.non_field_errors) && data.non_field_errors[0]) return String(data.non_field_errors[0])
      const fieldErrors = Object.entries(data).filter(([, v]) => Array.isArray(v) && (v as any[]).length).map(([k, v]) => `${k}: ${(v as string[]).join(', ')}`)
      if (fieldErrors.length) return fieldErrors.join(' | ')
      return text
    } catch { return text }
  }

  useEffect(() => {
    const loadWallets = async () => {
      try {
        const res = await apiFetch('/api/crypto-wallets/', { method: 'GET', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } })
        if (res.ok) {
          const data = await res.json()
          setCompanyWallets(Array.isArray(data) ? data : [])
          if (['BTC','USDT','USDC','ETH'].includes(method)) setShowWallets(true)
        }
      } catch (e) { setError(`Network error loading wallet addresses`) }
    }
    loadWallets()
  }, [method])

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedAddress(text)
      setMessage(`${label} copied!`)
      setTimeout(() => { setCopiedAddress(''); setMessage('') }, 3000)
    } catch { setError('Failed to copy') }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(''); setError('')
    if (!amount) return setError('Please enter an amount')
    if (!reference) return setError('Please provide a reference')
    setLoading(true)
    try {
      const res = await apiFetch('/api/transactions/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tx_type: 'deposit', amount: Number(amount), reference, payment_method: method, tx_hash: txHash, wallet_address_used: walletAddress }),
      })
      if (res.ok) { setMessage('Deposit request submitted. Awaiting approval.'); setTimeout(() => (window.location.href = '/dashboard'), 1500) }
      else { const msg = await readErrorMessage(res); setError(msg || 'Failed to submit deposit') }
    } catch { setError('Network error. Please try again.') }
    finally { setLoading(false) }
  }

  const isCrypto = ['BTC','USDT','USDC','ETH'].includes(method)
  const activeWallet = companyWallets.find(w => w.currency === method && w.is_active)

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ color: "#fff", fontSize: "24px", fontWeight: 700, marginBottom: "4px" }}>Deposit Funds</h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>Add funds to your investment account</p>
      </div>

      <div style={{ maxWidth: "640px" }}>
        {error && <div style={{ padding: "12px 16px", borderRadius: "12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontSize: "13px", marginBottom: "16px" }}>{error}</div>}
        {message && <div style={{ padding: "12px 16px", borderRadius: "12px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399", fontSize: "13px", marginBottom: "16px" }}>{message}</div>}

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label>Amount (USD)</label>
              <input type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
            </div>
            <div>
              <label>Payment Method</label>
              <select value={method} onChange={e => { setMethod(e.target.value); setShowWallets(['BTC','USDT','USDC','ETH'].includes(e.target.value)) }}>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="USDT">Tether (USDT)</option>
                <option value="USDC">USD Coin (USDC)</option>
                <option value="ETH">Ethereum (ETH)</option>
              </select>
            </div>
          </div>

          {isCrypto && showWallets && (
            <div style={{ borderRadius: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", padding: "20px" }}>
              {activeWallet ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <CryptoIcon currency={activeWallet.currency} />
                      <span style={{ color: "#fff", fontWeight: 600, fontSize: "14px" }}>{activeWallet.currency} Deposit Address</span>
                    </div>
                    {activeWallet.network && <span style={{ padding: "3px 10px", borderRadius: "99px", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", fontSize: "11px" }}>Network: {activeWallet.network}</span>}
                  </div>
                  <div style={{ position: "relative" }}>
                    <div style={{ fontFamily: "monospace", fontSize: "12px", padding: "14px 100px 14px 14px", borderRadius: "10px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", wordBreak: "break-all" }}>
                      {activeWallet.wallet_address}
                    </div>
                    <button type="button" onClick={() => copyToClipboard(activeWallet.wallet_address, `${activeWallet.currency} address`)} style={{
                      position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)",
                      padding: "6px 14px", borderRadius: "8px", background: "linear-gradient(135deg, #00a896, #0f7a70)",
                      color: "#fff", fontSize: "12px", fontWeight: 600, cursor: "pointer", border: "none",
                    }}>
                      {copiedAddress === activeWallet.wallet_address ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <QRCode address={activeWallet.wallet_address} />
                  </div>
                  <div style={{ padding: "12px 16px", borderRadius: "10px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)" }}>
                    <p style={{ color: "#fbbf24", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>⚠ Important</p>
                    <ul style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", listStyle: "disc", paddingLeft: "16px", lineHeight: 1.8 }}>
                      <li>Only send {activeWallet.currency} to this address</li>
                      <li>Verify the network is {activeWallet.network || 'correct'} before sending</li>
                      <li>Deposits require manual approval (24-72 hours)</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", textAlign: "center", padding: "24px 0" }}>
                  {companyWallets.length === 0 ? "Loading wallet addresses..." : `No active ${method} wallet configured. Contact support.`}
                </p>
              )}
            </div>
          )}

          <div>
            <label>Reference / Notes</label>
            <input value={reference} onChange={e => setReference(e.target.value)} placeholder="e.g., Bank transfer ref or wallet used" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label>Crypto Tx Hash (optional)</label>
              <input value={txHash} onChange={e => setTxHash(e.target.value)} />
            </div>
            <div>
              <label>Wallet Address Used (optional)</label>
              <input value={walletAddress} onChange={e => setWalletAddress(e.target.value)} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-cta-sky" style={{ width: "fit-content" }}>
            {loading ? 'Submitting...' : 'Submit Deposit'}
          </button>
        </form>
      </div>
    </div>
  )
}

function QRCode({ address }: { address: string }) {
  const [imageError, setImageError] = useState(false)
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(address)}&bgcolor=1a2035&color=ffffff&format=png&margin=1`
  if (imageError) return <div style={{ width: "100px", height: "100px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>QR Code</div>
  return <img src={src} alt="QR" style={{ width: "100px", height: "100px", borderRadius: "10px" }} loading="lazy" onError={() => setImageError(true)} />
}

function CryptoIcon({ currency }: { currency: string }) {
  const colors: Record<string, string> = { BTC: "#f97316", ETH: "#6366f1", USDT: "#10b981", USDC: "#3b82f6" }
  const symbols: Record<string, string> = { BTC: "₿", ETH: "Ξ", USDT: "₮", USDC: "$" }
  return <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: colors[currency] || "#6b7280", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "14px" }}>{symbols[currency] || currency[0]}</div>
}