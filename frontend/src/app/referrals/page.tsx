import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Referral Program — Earn Rewards with WolvCapital',
  description: 'Invite friends to WolvCapital and earn rewards. Grow your passive income through our verified BNB Smart Chain investment platform.',
  alternates: { canonical: 'https://wolvcapital.com/referral' },
  openGraph: {
    title: 'Referral Program — WolvCapital',
    description: 'Earn rewards by referring investors to WolvCapital.',
    url: 'https://wolvcapital.com/referral',
    images: [{ url: '/og-images/referral-og.png', width: 1200, height: 630 }],
    type: 'website',
  },
  robots: { index: true, follow: true },
}

import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function ReferralsLegacyRedirect() {
  redirect('/referral')
}
