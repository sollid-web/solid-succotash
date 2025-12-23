'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

export default function TrustpilotInvite() {
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [scriptError, setScriptError] = useState(false)

  useEffect(() => {
    if (scriptLoaded && !scriptError && typeof window !== 'undefined') {
      try {
        // @ts-ignore
        if (window.tp && typeof window.tp === 'function') {
          // @ts-ignore
          window.tp('register', '41a2HhCCWtcwdtgx')
        }
      } catch (error) {
        console.error('Trustpilot registration error:', error)
      }
    }
  }, [scriptLoaded, scriptError])

  return (
    <>
      <Script
        id="trustpilot-invite"
        src="https://invites.trustpilot.com/product-reviews/evaluation.min.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
        onError={() => {
          console.error('Failed to load Trustpilot script')
          setScriptError(true)
        }}
      />
    </>
  )
}
