import type { Metadata } from 'next'
import HomePageContent from '@/components/HomePage'
import PublicLayout from '@/components/PublicLayout'
import { LocaleProvider } from '@/components/LocaleProvider'
import { detectLocale } from '@/lib/detectLocale'

export const metadata: Metadata = {
  title: 'WolvCapital | Blockchain-Verified Investment Returns',
  description:
    'KYC-verified investment platform with blockchain-recorded profit distribution. Every return you earn is issued as WOLV — a verified BEP20 token on BNB Chain. Institutional custody, transparent fees, SEC-registered.',
  keywords:
    'blockchain investment platform, verified investment returns, WOLV token, BEP20 investment token, on-chain profit distribution, KYC investment platform, transparent investment, blockchain verified returns, WolvCapital, digital asset management',
  openGraph: {
    title: 'WolvCapital | Your Returns. Verified on the Blockchain.',
    description:
      'Every profit you earn at WolvCapital is recorded permanently on the BNB blockchain as WOLV tokens — independently verifiable, immutable, and transparent.',
    images: [
      {
        url: '/og-images/home-og.png',
        width: 1200,
        height: 630,
        alt: 'WolvCapital — Blockchain-Verified Investment Returns',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WolvCapital | Your Returns. Verified on the Blockchain.',
    description:
      'KYC-verified investment platform where every profit is recorded on-chain as WOLV tokens. Transparent, immutable, independently verifiable.',
    images: ['/og-images/home-og.png'],
  },
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const resolvedParams = await searchParams
  const locale = await detectLocale(resolvedParams)

  return (
    <LocaleProvider locale={locale}>
      <PublicLayout backgroundClassName="bg-hero-home overlay-dark-60">
        <HomePageContent />
      </PublicLayout>
    </LocaleProvider>
  )
}
