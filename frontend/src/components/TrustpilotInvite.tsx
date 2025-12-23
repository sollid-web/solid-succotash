'use client'

import { useEffect } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    TrustpilotObject: string
    tp: any
  }
}

export default function TrustpilotInvite() {
  useEffect(() => {
    // Initialize Trustpilot queue if not already present
    if (typeof window !== 'undefined' && !window.tp) {
      window.TrustpilotObject = 'tp'
      window.tp = window.tp || function() {
        (window.tp.q = window.tp.q || []).push(arguments)
      }
    }
  }, [])

  return (
    <>
      <Script
        id="trustpilot-invite-loader"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,r,n){w.TrustpilotObject=n;w[n]=w[n]||function(){(w[n].q=w[n].q||[]).push(arguments)};
            a=d.createElement(s);a.async=1;a.src=r;a.type='text/java'+s;f=d.getElementsByTagName(s)[0];
            f.parentNode.insertBefore(a,f)})(window,document,'script', 'https://invitejs.trustpilot.com/tp.min.js', 'tp');
            tp('register', '41a2HhCCWtcwdtgx');
          `
        }}
        onError={() => console.error('Failed to load Trustpilot script')}
      />
    </>
  )
}
