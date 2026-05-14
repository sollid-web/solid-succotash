'use client'
import { useEffect, useRef } from 'react'

export default function DisclosureTicker() {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!container.current) return
    // Clean up any previous widget
    container.current.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: 'BINANCE:BNBUSDT', title: 'BNB/USDT' },
        { proName: 'BINANCE:BTCUSDT', title: 'BTC/USDT' },
        { proName: 'BINANCE:ETHUSDT', title: 'ETH/USDT' },
        { proName: 'BINANCE:BUSDUSDT', title: 'BUSD/USDT' },
        { proName: 'CRYPTO:BNBUSD', title: 'BNB/USD' },
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: 'adaptive',
      colorTheme: 'dark',
      locale: 'en',
    })

    container.current.appendChild(script)
  }, [])

  return (
    <div
      style={{
        background: 'rgba(6,12,26,0.95)',
        borderBottom: '1px solid rgba(0,168,150,0.2)',
        height: '46px',
        overflow: 'hidden',
      }}
    >
      <div className="tradingview-widget-container" ref={container} style={{ height: '46px' }}>
        <div className="tradingview-widget-container__widget" />
      </div>
    </div>
  )
}
