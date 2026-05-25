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
import '@/app/globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.wolvcapital.com'),
  title: {
    default: 'WolvCapital — BNB Smart Chain Staking & Digital Asset Investment',
    template: '%s | WolvCapital',
  },
  description: 'WolvCapital is a U.S. regulated digital investment platform offering 8%–25% APY staking plans on BNB Smart Chain. Verified on-chain rewards, KYC compliant, FinCEN registered.',
  keywords: [
    'digital asset investment', 'BNB Smart Chain staking', 'crypto investment platform',
    'WOLV token', 'BEP-20 staking', 'blockchain investment', 'crypto APY',
    'regulated crypto platform', 'FinCEN registered', 'KYC investment platform',
    'WolvCapital', 'secure crypto staking', 'on-chain rewards',
  ],
  authors: [{ name: 'WolvCapital', url: 'https://wolvcapital.com' }],
  creator: 'WolvCapital',
  publisher: 'WolvCapital',
  category: 'finance',
  alternates: { canonical: 'https://www.wolvcapital.com' },
  openGraph: {
    title: 'WolvCapital — BNB Smart Chain Staking & Digital Asset Investment',
    description: 'U.S. regulated platform offering 8%–25% APY staking. WOLV token rewards on BNB Smart Chain. KYC compliant · FinCEN registered · On-chain transparent.',
    url: 'https://wolvcapital.com',
    siteName: 'WolvCapital',
    images: [
      {
        url: '/og-images/home-og.png',
        width: 1200,
        height: 630,
        alt: 'WolvCapital — BNB Smart Chain Staking Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WolvCapital — BNB Smart Chain Staking & Digital Asset Investment',
    description: 'U.S. regulated platform offering 8%–25% APY staking. WOLV token on BNB Smart Chain.',
    images: ['/og-images/home-og.png'],
    creator: '@WolvCapital',
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
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
        <meta name="google-site-verification" content="z2bE7_WWwLyDUFbwY9UFtrHVf1xXvFqq_iauSokX5yI" />
        {/* FAQ structured data */}
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

        {/* Organization + WebSite + Trustpilot rating structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://wolvcapital.com/#organization',
                  name: 'WolvCapital',
                  url: 'https://wolvcapital.com',
                  logo: 'https://wolvcapital.com/wolv-icon.svg',
                  description: 'U.S. regulated digital asset investment platform offering BNB Smart Chain staking with 8%–25% APY.',
                  aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: '4.2',
                    reviewCount: '10',
                    bestRating: '5',
                    worstRating: '1',
                  },
                  review: [
                    {
                      '@type': 'Review',
                      reviewRating: { '@type': 'Rating', ratingValue: '5' },
                      author: { '@type': 'Person', name: 'Lucas' },
                      datePublished: '2026-04-05',
                      reviewBody: 'WolvCapital\'s support team genuinely deserves a review. Every time I reached out, I got a fast and clear response without the usual back-and-forth or generic replies.',
                    },
                    {
                      '@type': 'Review',
                      reviewRating: { '@type': 'Rating', ratingValue: '5' },
                      author: { '@type': 'Person', name: 'Cunningham' },
                      datePublished: '2026-04-18',
                      reviewBody: 'I\'ve been using WolvCapital for a while now, specifically their Pioneer Investment Plan, and my experience has been genuinely positive so far.',
                    },
                  ],
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: '516 High St',
                    addressLocality: 'Palo Alto',
                    addressRegion: 'CA',
                    postalCode: '94301',
                    addressCountry: 'US',
                  },
                  contactPoint: {
                    '@type': 'ContactPoint',
                    email: 'support@mail.wolvcapital.com',
                    contactType: 'customer support',
                    availableLanguage: ['English'],
                  },
                  sameAs: [
                    'https://bscscan.com/token/0xe0167279aef7bf4ad313d261da82e8366822270c',
                  ],
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://wolvcapital.com/#website',
                  url: 'https://wolvcapital.com',
                  name: 'WolvCapital',
                  publisher: { '@id': 'https://wolvcapital.com/#organization' },
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: 'https://wolvcapital.com/blog?q={search_term_string}',
                    'query-input': 'required name=search_term_string',
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

          <LocaleProvider locale={locale}>
            <TranslationProvider initialLocale={locale}>
              <AppChrome>
                <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
                  {children}
                </Suspense>
              </AppChrome>
            </TranslationProvider>
          </LocaleProvider>

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
        </SegmentProvider>
      </body>
    </html>
  )
}