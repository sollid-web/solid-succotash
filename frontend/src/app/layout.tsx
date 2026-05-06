import type { Metadata } from 'next'
import Script from 'next/script'
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { Analytics } from '@vercel/analytics/next'
import { LocaleProvider } from '@/components/LocaleProvider'
import { TranslationProvider } from '@/components/TranslationProvider'
import AppChrome from '@/components/AppChrome'
import GaPageView from '@/components/GaPageView'
import SegmentProvider from '@/components/SegmentProvider'
import RemoveSyncBannerClient from '@/components/RemoveSyncBannerClient'
import TawkWidget from '@/components/TawkWidget'
import '@/app/globals.css'

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
        url: '/images/og/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'WolvCapital - Managed Digital Asset Portfolios',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WolvCapital - Professional Investment Platform',
    description: 'Professional investment platform with secure deposits, real-time tracking, and verified withdrawals.',
    images: ['/images/og/og-image.svg'],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 1. Fetch dynamic data from cookies to prevent prerender errors
  const cookieStore = await cookies()
  const locale = cookieStore.get('django_language')?.value || 'en'

  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
  const linkedInPartnerId = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID
  const hotjarId = process.env.NEXT_PUBLIC_HOTJAR_ID
  const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID

  return (
    <html lang={locale}>
      <head>
        {/* Structured Data Scripts */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'How does WolvCapital generate investor returns?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'WolvCapital uses diversified digital asset strategies with automated monitoring tools to generate structured daily returns.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Is WolvCapital regulated?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'WolvCapital follows KYC, AML, and PCI-DSS compliance standards.',
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-white">
        <RemoveSyncBannerClient />
        
        <SegmentProvider writeKey={process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY || ''}>
          {/* Tracking Scripts */}
          {metaPixelId && (
            <Script
              id="meta-pixel"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
                  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${metaPixelId}');
                  fbq('track', 'PageView');
                `,
              }}
            />
          )}

          {/* 2. LocaleProvider must wrap AppChrome and children */}
          <LocaleProvider locale={locale}>
            <TranslationProvider initialLocale={locale}>
              <AppChrome>
              {/* 3. Suspense boundary is CRITICAL for Next.js builds */}
              <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
                {children}
              </Suspense>
            </AppChrome>
          </TranslationProvider>
          </LocaleProvider>

          {/* Analytics and Widgets */}
          {measurementId && (
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
          )}

          <Analytics />
          <TawkWidget propertyId="1h5r7jmq1" />
        </SegmentProvider>
      </body>
    </html>
  )
}