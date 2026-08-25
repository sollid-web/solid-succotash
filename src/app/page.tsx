import type { Metadata } from 'next'
import HomePageContent from '@/components/HomePage'
import PublicLayout from '@/components/PublicLayout'

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
        url: "https://www.wolvcapital.com/images/hero/home-hero.webp",
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
    images: [
      {
        url: "https://www.wolvcapital.com/images/hero/home-hero.webp",
        width: 1200,
        height: 630,
        alt: 'WolvCapital — Blockchain-Verified Investment & Staking Platform',
      },
    ],
  },
}

export default function Page() {
  return (
    /* HeroSection paints its own opaque background over this whole area now,
       so the bg-hero-home image class is never actually visible here — it
       was just wasted download/decode/paint weight sitting behind it. */
    <PublicLayout backgroundClassName="bg-[#070B19]">
      <HomePageContent />
    </PublicLayout>
  )
}
