'use client'

import { useState } from 'react'
import { apiFetch } from '@/lib/api'
import SpendLimitsModal from './SpendLimitsModal'

export default function CardActions({ cardData, onFreeze, onReplace }) {
  const [toast, setToast] = useState('')
  const [isBusy, setIsBusy] = useState(false)
  const [showLimits, setShowLimits] = useState(false)

  const showToast = (message) => {
    setToast(message)
    window.clearTimeout(window.__virtualCardToast)
    window.__virtualCardToast = window.setTimeout(() => setToast(''), 2800)
  }

  const copyToClipboard = async (text) => {
    if (!text) {
      showToast('Nothing to copy')
      return
    }

    try {
      await navigator.clipboard.writeText(text)
      showToast('Copied to clipboard')
    } catch (error) {
      const fallback = document.createElement('textarea')
      fallback.value = text
      fallback.style.position = 'fixed'
      fallback.style.left = '-9999px'
      document.body.appendChild(fallback)
      fallback.focus()
      fallback.select()
      document.execCommand('copy')
      document.body.removeChild(fallback)
      showToast('Copied to clipboard')
    }
  }

  const handleFreeze = async () => {
    if (isBusy) return
    setIsBusy(true)

    try {
      const res = await apiFetch('/api/cards/freeze/', {
        method: 'POST',
      })
      if (!res.ok) {
        const payload = await res.json().catch(() => null)
        throw new Error(payload?.error || 'Could not update card status')
      }

      const payload = await res.json()
      onFreeze?.(payload.frozen)
      showToast(payload.frozen ? 'Card frozen' : 'Card reactivated')
    } catch (err) {
      showToast(err?.message || 'Action failed')
    } finally {
      setIsBusy(false)
    }
  }

  const handleReplace = () => {
    if (!window.confirm('Replace card details with the latest issued card?')) {
      return
    }
    onReplace?.()
    showToast('Refreshing card data')
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-500"
          onClick={handleFreeze}
          disabled={isBusy || !cardData}
        >
          {cardData?.is_frozen ? 'Unfreeze Card' : 'Freeze Card'}
        </button>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          onClick={() => copyToClipboard(cardData?.number)}
          disabled={!cardData?.number}
        >
          Copy Number
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          onClick={() => copyToClipboard(cardData?.cvc)}
          disabled={!cardData?.cvc}
        >
          Copy CVC
        </button>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          onClick={() => setShowLimits(true)}
        >
          Spending Limits
        </button>
      </div>

      <button
        type="button"
        className="inline-flex items-center justify-center w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
        onClick={handleReplace}
      >
        Replace Card
      </button>

      {toast ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {toast}
        </div>
      ) : null}

      <SpendLimitsModal open={showLimits} onClose={() => setShowLimits(false)} />
    </div>
  )
}
