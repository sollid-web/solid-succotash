import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import AppChrome from '@/components/AppChrome'
import { TranslationProvider } from '@/components/TranslationProvider'
import WolvAiWidget from './WolvAiWidget'
import UserActivityTracker from '@/components/UserActivityTracker'
import { SITE_URL } from '@/lib/site-config'
import OrganizationJsonLd from '@/components/OrganizationJsonLd'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'WolvCapital — WOLV Token Information | BNB Smart Chain',
  description: 'Review WOLV token information, public contract references, platform terms, and digital-asset risks on BNB Smart Chain.',
  alternates: { canonical: '/' },
  openGraph: {
    siteName: 'WolvCapital',
    images: [{ url: '/og-images/home-og.png', width: 1200, height: 630, alt: 'WolvCapital WOLV token information and risk disclosures' }],
    url: '/',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <OrganizationJsonLd />
        <TranslationProvider>
          <AppChrome>{children}</AppChrome>
        </TranslationProvider>
        <UserActivityTracker />
        <WolvAiWidget />
      </body>
    </html>
  )
}
