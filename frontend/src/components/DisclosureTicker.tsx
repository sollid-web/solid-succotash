'use client'

import './DisclosureTicker.css'

const tickerText = "Stake BNB or BUSD on verified smart contracts. Earn WOLV rewards on BNB Chain. Principal at risk. KYC required."

export default function DisclosureTicker() {
  return (
    <div className="disclosure-ticker">
      <div className="ticker-track">
        {/* Repeat content 3 times for seamless loop */}
        {[0, 1, 2].map((i) => (
          <span key={i} className="ticker-content">
            {tickerText}
          </span>
        ))}
      </div>
    </div>
  )
}
