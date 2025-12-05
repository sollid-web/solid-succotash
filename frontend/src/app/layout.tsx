import type { Metadata } from 'next'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import TawkToChat from '@/components/TawkToChat'
import { TranslationProvider } from '@/i18n/TranslationProvider'
import NavBar from '@/components/NavBar'
import RecentActivityTicker from '@/components/RecentActivityTicker'
import { headers } from 'next/headers'

// Removed Google font import for offline/build stability; fallback to Tailwind font-sans.

export const metadata: Metadata = {
  title: 'WolvCapital - Professional Investment Platform',
  description: 'WolvCapital offers professional investment opportunities with manual off-chain approvals for maximum security.',
  keywords: 'investment, platform, wolvcapital, professional, secure, blockchain',
  authors: [{ name: 'WolvCapital Team' }],
  creator: 'WolvCapital',
  publisher: 'WolvCapital',
  metadataBase: new URL('https://wolvcapital.com'),
  openGraph: {
    title: 'WolvCapital - Professional Investment Platform',
    description: 'Professional investment platform with secure deposits, real-time tracking, and verified withdrawals.',
    url: 'https://wolvcapital.com',
    siteName: 'WolvCapital',
    images: [
      {
        url: '/images/home-og.jpg',
        width: 1200,
        height: 630,
        alt: 'WolvCapital Professional Investment Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WolvCapital - Professional Investment Platform',
    description: 'Professional investment platform with secure deposits, real-time tracking, and verified withdrawals.',
    images: ['/images/home-og.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' }
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        {measurementId ? (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            />
            <Script
              id="ga4-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${measurementId}');
                `,
              }}
            />
          </>
        ) : null}
        <TranslationProvider>
          {children}
        </TranslationProvider>
        <Analytics />
      </body>
    </html>
  )
}