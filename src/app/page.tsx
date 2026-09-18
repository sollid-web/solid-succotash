import type { Metadata } from 'next'
import HomePageContent from '@/components/HomePage'
import PublicLayout from '@/components/PublicLayout'

export const metadata: Metadata = {
  title: 'WolvCapital — On-Chain Staking & WOLV Token | BNB Smart Chain',
  description: 'WolvCapital is a Web3 staking protocol on BNB Smart Chain. Stake BNB or BUSD and earn WOLV token rewards. Contracts verified on BSCScan. WOLV now trading on PancakeSwap.',
  keywords:
    'WOLV token, BEP20 token, BNB Smart Chain staking, Web3 staking protocol, WOLV PancakeSwap, on-chain staking rewards, WolvCapital, blockchain staking, DeFi staking BNB, WOLV DEX, smart contract staking, KYC staking platform',
  openGraph: {
    title: 'WolvCapital | On-Chain Staking & WOLV Token — BNB Smart Chain',
    description:
      'Stake BNB or BUSD and earn WOLV token rewards on BNB Smart Chain. Smart contracts verified on BSCScan. WOLV now live on PancakeSwap DEX.',
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
