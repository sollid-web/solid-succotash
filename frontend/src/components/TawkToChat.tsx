'use client'

import Script from 'next/script'

export default function TawkToChat() {
  const propertyId = '6910bc388e8c101957916042'
  const widgetId = '1j9klug1o'

  return (
    <Script
      id="tawkto-widget-src"
      strategy="afterInteractive"
      src={`https://embed.tawk.to/${propertyId}/${widgetId}`}
      crossOrigin="anonymous"
    />
  )
}
