'use client'

import './DisclosureTicker.css'

const tickerText = "⚠️ SEC Registration In Progress — Not yet a registered investment adviser · Custodian & audit details disclosed at activation · No guaranteed returns · Digital assets are speculative and may lose all value · FinCEN MSB Registered · KYC required before account activation · All fees disclosed in writing before investing · WolvCapital is not a bank · Not FDIC or SIPC insured ·"

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
