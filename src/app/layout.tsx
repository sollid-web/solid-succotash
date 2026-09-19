import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import AppChrome from '@/components/AppChrome'
import { TranslationProvider } from '@/components/TranslationProvider'
import WolvAiWidget from './WolvAiWidget'
import UserActivityTracker from '@/components/UserActivityTracker'
import { SITE_URL } from '@/lib/site-config'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'WolvCapital — On-Chain Staking & WOLV Token | BNB Smart Chain',
  description: 'WolvCapital is a Web3 staking protocol on BNB Smart Chain. Stake BNB or BUSD and earn WOLV token rewards.',
  alternates: { canonical: '/' },
  openGraph: {
    siteName: 'WolvCapital',
    url: '/',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TranslationProvider>
          <AppChrome>{children}</AppChrome>
        </TranslationProvider>
        <UserActivityTracker />
        <WolvAiWidget />
      </body>
    </html>
  )
}
