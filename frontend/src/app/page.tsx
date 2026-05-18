import type { Metadata } from 'next'
import HomePageContent from '@/components/HomePage'
import PublicLayout from '@/components/PublicLayout'
import { LocaleProvider } from '@/components/LocaleProvider'
import { detectLocale } from '@/lib/detectLocale'

export const metadata: Metadata = {
  title: 'Wolv Capital — BNB Staking & Crypto Investment Platform',
  description: 'Earn daily returns on BNB with Wolv Capitals transparent staking plans. Join thousands of investors earning passive income on the BSC network. Start from $50.',
  keywords:
    'blockchain investment platform, WOLV staking, BNB staking, BUSD staking, verified investment returns, on-chain profit distribution, WOLV token, BEP20 investment token, KYC investment platform, transparent investment, blockchain verified returns, WolvCapital, crypto staking rewards, digital asset management, stake BNB earn rewards',
  openGraph: {
    title: 'WolvCapital | Blockchain-Verified Returns, Invest, Stake & Earn On-Chain',
    description:
      'Stake BNB or BUSD and earn WOLV rewards on-chain. Every return is recorded permanently on the BNB blockchain — independently verifiable, immutable, and transparent.',
    images: [
      {
        url: '/og-images/home-og.png',
        width: 1200,
        height: 630,
        alt: 'WolvCapital — Blockchain-Verified Investment & Staking Platform',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WolvCapital | Blockchain-Verified Returns, Invest, Stake & Earn On-Chain',
    description:
      'Stake BNB or BUSD, earn 8–25% APY in WOLV tokens. KYC-verified platform with on-chain proof of every return. Transparent, immutable, verifiable.',
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
