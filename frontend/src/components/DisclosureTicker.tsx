'use client'

import './DisclosureTicker.css'

const tickerText = "WolvCapital is an SEC-registered investment adviser. View our disclosures for details on fees and services. Digital assets are speculative and involve high risk, including loss of principal. KYC required."

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
