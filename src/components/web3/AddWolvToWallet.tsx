'use client'
import { useState } from 'react'
import { WOLV_TOKEN, WOLV_SYMBOL, WOLV_DECIMALS } from '@/lib/contracts'

/** Asks the injected wallet to track WOLV (EIP-747). Hidden when no wallet is injected. */
export default function AddWolvToWallet({ className = 'btn-glass' }: { className?: string }) {
  const [state, setState] = useState<'idle' | 'ok' | 'err' | 'none'>('idle')
  const add = async () => {
    const eth = (window as unknown as { ethereum?: { request: (a: { method: string; params?: unknown }) => Promise<unknown> } }).ethereum
    if (!eth) { setState('none'); return }
    try {
      await eth.request({ method: 'wallet_watchAsset', params: { type: 'ERC20', options: { address: WOLV_TOKEN, symbol: WOLV_SYMBOL, decimals: WOLV_DECIMALS, image: 'https://www.wolvcapital.com/wolv-icon.svg' } } })
      setState('ok')
    } catch { setState('err') }
  }
  return (
    <button type="button" onClick={add} className={className}>
      {state === 'ok' ? 'Added to wallet ✓' : state === 'none' ? 'No wallet detected' : state === 'err' ? 'Request declined — retry' : '🦊 Add WOLV to wallet'}
    </button>
  )
}
