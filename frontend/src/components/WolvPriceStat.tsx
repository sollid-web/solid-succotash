'use client'

import { useEffect, useState } from 'react'

interface Props {
  contractAddress: string
}

export default function WolvPriceStat({ contractAddress }: Props) {
  const [value, setValue] = useState('$0.50')
  const [sub, setSub] = useState('Presale reference')

  useEffect(() => {
    let cancelled = false

    async function loadPrice() {
      try {
        const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${contractAddress}`)
        if (!res.ok) return
        const data = await res.json()
        const pair = data?.pairs?.[0]
        const priceUsd = pair?.priceUsd ? parseFloat(pair.priceUsd) : null
        if (!cancelled && priceUsd && priceUsd > 0) {
          setValue(`$${priceUsd < 1 ? priceUsd.toFixed(4) : priceUsd.toFixed(2)}`)
          setSub(`Live · ${pair.dexId || 'DEX'}`)
        }
      } catch {
        // keep the pre-listing fallback
      }
    }

    loadPrice()
    return () => {
      cancelled = true
    }
  }, [contractAddress])

  return (
    <div className="px-6 py-6 text-center" style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(10px)' }}>
      <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">Current Price</div>
      <div className="text-xl font-extrabold mb-1" style={{ color: '#00c9b1' }}>{value}</div>
      <div className="text-xs text-gray-500">{sub}</div>
    </div>
  )
}
