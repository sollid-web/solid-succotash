import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Campaigns & Announcements — WolvCapital',
  description: 'Live announcements, promotions, and platform updates from WolvCapital — WOLV token updates, DEX milestones, staking news, and community campaigns.',
  alternates: { canonical: 'https://www.wolvcapital.com/campaigns' },
  openGraph: {
    title: 'Campaigns & Announcements — WolvCapital',
    description: 'Live announcements, promotions, and platform updates from WolvCapital.',
    url: 'https://www.wolvcapital.com/campaigns',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function CampaignsLayout({ children }: { children: React.ReactNode }) {
  return children
}
