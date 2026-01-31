import type { Metadata } from 'next'
import Script from 'next/script'
import { Suspense } from 'react'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { TranslationProvider } from '@/i18n/TranslationProvider'
import AppChrome from '@/components/AppChrome'
import GaPageView from '@/components/GaPageView'
import SegmentProvider from '@/components/SegmentProvider'

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
      <head>
        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How does WolvCapital generate investor returns?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "WolvCapital uses diversified digital asset strategies with automated monitoring tools to generate structured daily returns."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is WolvCapital regulated?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "WolvCapital follows KYC, AML, and PCI-DSS standards but is not licensed as a government-regulated financial institution."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How long do withdrawals take?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Profit withdrawals are available at end of your active investment plan and capital withdrawals are processed after plan completion."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What are the minimum and maximum investment amounts?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Minimum investment begins at $100. Higher-tier plans support custom or flexible amounts."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How is my account secured?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "WolvCapital provides 2FA, 256-bit SSL encryption, and continuous fraud monitoring to protect user accounts."
                  }
                }
              ]
            })
          }}
        />
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "WolvCapital",
              "url": "https://www.wolvcapital.com",
              "logo": "https://www.wolvcapital.com/wolv-logo.svg",
              "sameAs": [
                "https://facebook.com/wolvcapital",
                "https://instagram.com/wolvcapital",
                "https://twitter.com/wolvcapital"
              ],
              "description": "WolvCapital is a secure digital asset investment platform offering structured daily ROI, AML/KYC compliance, 256-bit encryption, and global investor support."
            })
          }}
        />
      </head>
      <body className="min-h-screen bg-white">
        <SegmentProvider writeKey={process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY || ''}>
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
              <Suspense fallback={null}>
                <GaPageView measurementId={measurementId} />
              </Suspense>
            </>
          ) : null}
          <TranslationProvider>
            <AppChrome>{children}</AppChrome>
          </TranslationProvider>
        <Analytics />
        </SegmentProvider>
      </body>
    </html>
  )
}
