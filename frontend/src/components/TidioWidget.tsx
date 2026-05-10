'use client'

import Script from 'next/script'
import { useEffect } from 'react'

declare global {
  interface Window {
    tidioChatApi?: any
  }
}

interface TidioWidgetProps {
  publicKey?: string
}

export default function TidioWidget({ publicKey }: TidioWidgetProps) {
  const key = publicKey || process.env.NEXT_PUBLIC_TIDIO_PUBLIC_KEY || 'YOUR_TIDIO_PUBLIC_KEY'
  useEffect(() => {
    // Configure Tidio widget with fintech color scheme on load
    const handleTidioLoad = () => {
      if (typeof window !== 'undefined' && window.tidioChatApi) {
        // Set custom fintech color scheme
        window.tidioChatApi.setColorPalette({
          bubble: {
            background: '#002350',
            color: '#ffffff'
          },
          button: {
            background: '#002350',
            color: '#ffffff'
          }
        })

        // Additional customizations can be added here
        window.tidioChatApi.setVisitorData({
          name: 'Fintech Theme Applied'
        })
      }
    }

    // Call immediately in case Tidio is already loaded
    handleTidioLoad()

    // Listen for Tidio load event
    window.addEventListener('tidioChat-ready', handleTidioLoad)

    return () => {
      window.removeEventListener('tidioChat-ready', handleTidioLoad)
    }
  }, [])

  return (
    <Script
      id="tidio-widget"
      strategy="afterInteractive"
      src={`//code.tidio.co/${key}.js`}
      async
      onLoad={() => {
        // Dispatch custom event when Tidio is ready
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('tidioChat-ready'))
        }
      }}
    />
  )
}