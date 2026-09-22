import type { Metadata } from 'next'
import HomePageContent from '@/components/HomePage'
import PublicLayout from '@/components/PublicLayout'

export const metadata: Metadata = {
  title: 'WolvCapital — On-Chain Staking & WOLV Token | BNB Smart Chain',
  description: 'WolvCapital is a Web3 staking protocol on BNB Smart Chain. Review staking terms, public contract references, WOLV market data, and risks before participating.',
  keywords:
    'WOLV token, BEP-20 token, BNB Smart Chain staking, Web3 staking protocol, WOLV PancakeSwap, on-chain staking, WolvCapital, blockchain staking, DeFi staking BNB, WOLV DEX, smart contract verification, KYC staking platform',
  openGraph: {
    title: 'WolvCapital | On-Chain Staking & WOLV Token — BNB Smart Chain',
    description:
      'Review WOLV staking, public smart-contract references, on-chain data, and risk disclosures on BNB Smart Chain.',
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
    title: 'WolvCapital | On-Chain Staking, WOLV Token Data, and Risk Disclosure',
    description:
      'Review staking terms, target APY assumptions, public contract references, WOLV market data, and risks before participating.',
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
