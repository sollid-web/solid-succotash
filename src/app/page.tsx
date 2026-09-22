import type { Metadata } from 'next'
import HomePageContent from '@/components/HomePage'
import PublicLayout from '@/components/PublicLayout'

export const metadata: Metadata = {
  title: 'WolvCapital — WOLV Token Information | BNB Smart Chain',
  description: 'Review WOLV token information, public contract references, platform terms, and digital-asset risks on BNB Smart Chain.',
  keywords:
    'WOLV token, BEP-20 token, BNB Smart Chain, Web3 staking information, WOLV PancakeSwap, on-chain data, WolvCapital, blockchain records, WOLV DEX, contract references, digital-asset risks',
  openGraph: {
    title: 'WolvCapital | On-Chain Staking & WOLV Token — BNB Smart Chain',
    description:
      'Review WOLV token information, public contract references, on-chain data, platform terms, and risk disclosures.',
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
      'Review WOLV token information, public contract references, platform terms, and digital-asset risks before participating.',
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
