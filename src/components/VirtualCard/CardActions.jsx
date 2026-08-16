'use client'

import { useRef, useState } from 'react'
import { apiFetch } from '@/lib/api'

export default function CardActions({ cardData, onFreeze, isFrozen }) {
  const [toast, setToast] = useState('')
  const [isBusy, setIsBusy] = useState(false)
  const [showCvv, setShowCvv] = useState(false)
  const [showFull, setShowFull] = useState(false)
  // Fix: use useRef instead of window.__wolvCardToast for timer
  const toastTimer = useRef(null)

  const showToast = (message) => {
    setToast(message)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2800)
  }

  const copyToClipboard = async (text, label = 'Copied') => {
    if (!text) { showToast('Nothing to copy'); return }
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const el = document.createElement('textarea')
      el.value = text
      el.style.cssText = 'position:fixed;left:-9999px'
      document.body.appendChild(el)
      el.focus(); el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    showToast(`${label} copied!`)
  }

  const handleFreeze = async () => {
    if (isBusy) return
    setIsBusy(true)
    try {
      const res = await apiFetch('/api/cards/freeze/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ card_id: cardData?.id }),
      })
      if (!res.ok) {
        const p = await res.json().catch(() => null)
        throw new Error(p?.error || 'Could not update card status')
      }
      const p = await res.json()
      onFreeze?.(p.frozen)
      showToast(p.frozen ? '❄️ Card frozen' : '🔥 Card unfrozen')
    } catch (err) {
      showToast(err?.message || 'Action failed')
    } finally {
      setIsBusy(false)
    }
  }

  const cardNumber = cardData?.card_number || cardData?.number || ''
  const cvv = cardData?.cvv || ''

  const actions = [
    {
      icon: '📋',
      label: 'Copy Number',
      onClick: () => copyToClipboard(cardNumber, 'Card number'),
      disabled: !cardNumber,
    },
    {
      icon: isFrozen ? '🔥' : '❄️',
      label: isBusy ? 'Please wait…' : isFrozen ? 'Unfreeze Card' : 'Freeze Card',
      onClick: handleFreeze,
      disabled: isBusy || !cardData,
      highlight: true,
    },
    {
      icon: showCvv ? '🙈' : '👁️',
      label: showCvv ? 'Hide CVV' : 'Show CVV',
      onClick: () => {
        if (!showCvv && !cvv) { showToast('CVV not available'); return }
        setShowCvv(v => !v)
      },
      disabled: !cardData,
    },
    {
      // Fix: showFull now actually renders the full number below
      icon: showFull ? '🔒' : '🔢',
      label: showFull ? 'Hide Number' : 'Full Number',
      onClick: () => {
        if (!showFull && !cardNumber) { showToast('Number not available'); return }
        if (!showFull) copyToClipboard(cardNumber, 'Full card number')
        setShowFull(v => !v)
      },
      disabled: !cardData,
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Action buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {actions.map((btn) => (
          <button
            key={btn.label}
            type="button"
            onClick={btn.onClick}
            disabled={btn.disabled}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '8px', padding: '16px 12px', borderRadius: '16px',
              border: btn.highlight ? 'none' : '1px solid rgba(255,255,255,0.08)',
              background: btn.highlight
                ? 'linear-gradient(135deg, #1a3a8f, #00a896)'
                : 'rgba(255,255,255,0.04)',
              color: '#fff', cursor: btn.disabled ? 'not-allowed' : 'pointer',
              opacity: btn.disabled ? 0.5 : 1,
              transition: 'all 0.2s',
              boxShadow: btn.highlight ? '0 6px 20px rgba(0,168,150,0.25)' : 'none',
            }}
          >
            <span style={{ fontSize: '22px' }}>{btn.icon}</span>
            <span style={{ fontSize: '11px', fontWeight: 600, textAlign: 'center', lineHeight: 1.3 }}>
              {btn.label}
            </span>
          </button>
        ))}
      </div>

      {/* Fix: Full number reveal row (was missing in original) */}
      {showFull && cardNumber && (
        <div style={{
          padding: '12px 16px', borderRadius: '12px',
          background: 'rgba(59,130,246,0.08)',
          border: '1px solid rgba(59,130,246,0.2)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Full Number</span>
          <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#fff', fontSize: '13px', letterSpacing: '2px' }}>
            {cardNumber.replace(/(.{4})/g, '$1 ').trim()}
          </span>
        </div>
      )}

      {/* CVV reveal row */}
      {showCvv && cvv && (
        <div style={{
          padding: '12px 16px', borderRadius: '12px',
          background: 'rgba(0,168,150,0.08)',
          border: '1px solid rgba(0,168,150,0.2)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>CVV / CVC</span>
          <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#00a896', fontSize: '16px', letterSpacing: '4px' }}>
            {cvv}
          </span>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          padding: '10px 16px', borderRadius: '12px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.8)', fontSize: '13px',
          textAlign: 'center', fontWeight: 500,
        }}>
          {toast}
        </div>
      )}
    </div>
  )
}