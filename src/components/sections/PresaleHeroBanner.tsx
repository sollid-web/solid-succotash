'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Flame } from 'lucide-react'

// Immutable constructor args of the deployed WOLVPresale contract
// (0x04b5c5e204e812c176ce632f3781ea88c500497c) — these can never change
// on-chain, so hardcoding them here carries no staleness risk.
const PRESALE_END_TIME = 1785686442 // 2026-08-02T16:00:42Z

function formatDuration(seconds: number) {
  if (seconds <= 0) return null
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return `${d}d ${h}h ${m}m`
}

export default function PresaleHeroBanner() {
  const [timeLeft, setTimeLeft] = useState<string | null>(
    formatDuration(PRESALE_END_TIME - Math.floor(Date.now() / 1000)),
  )
  const [ended, setEnded] = useState(Math.floor(Date.now() / 1000) >= PRESALE_END_TIME)

  useEffect(() => {
    const tick = () => {
      const secondsLeft = PRESALE_END_TIME - Math.floor(Date.now() / 1000)
      setTimeLeft(formatDuration(secondsLeft))
      setEnded(secondsLeft <= 0)
    }
    tick()
    const interval = setInterval(tick, 60_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gradient-to-r from-teal-950 to-blue-950 border-t-4 border-teal-500 py-6 md:py-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-5">
          <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl">🚀</span>
          </div>
          <div className="flex-1 min-w-0">
            <strong className="block text-base md:text-lg text-white mb-1">
              🚀 WOLV is now live on PancakeSwap — trade on DEX
            </strong>
            <p className="text-teal-200 text-xs md:text-sm leading-relaxed">
              WOLV/BNB pair is live on PancakeSwap V2 · BNB Smart Chain · Contract verified on BSCScan · 231+ holders
            </p>
          </div>
          <a
            href="https://pancakeswap.finance/swap?outputCurrency=0xe0167279aef7bf4ad313d261da82e8366822270c"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto md:flex-shrink-0 inline-flex items-center justify-center gap-2 px-4 md:px-6 py-2 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition whitespace-nowrap text-sm md:text-base"
          >
            Buy WOLV
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
