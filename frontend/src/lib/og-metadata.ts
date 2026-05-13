// src/lib/og-metadata.ts
import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wolvcapital.com'

const PAGES = {
  home:         { title: 'WolvCapital — DeFi on BNB Smart Chain',   description: 'Next-generation DeFi. Stake WOLV, earn rewards, and govern the protocol.' },
  'wolv-token': { title: 'WOLV Token — WolvCapital',                description: '1 WOLV = $1.00 USD. Live on BNB Smart Chain with 4 active staking plans.' },
  tokenomics:   { title: 'Tokenomics — WolvCapital',                description: 'Hard-capped 1B supply, transparent distribution, and on-chain auditability.' },
  roadmap:      { title: 'Roadmap — WolvCapital',                   description: 'Our milestone-by-milestone path to a fully decentralized DeFi protocol.' },
  whitepaper:   { title: 'Whitepaper — WolvCapital',                description: 'Full technical docs: architecture, tokenomics model, and governance framework.' },
} as const

const TIERS = {
  pioneer:  { title: 'Pioneer Plan — 8% APY · WolvCapital',   description: 'Start staking WOLV for 90 days. Minimum $100. Earn 8% APY.' },
  vanguard: { title: 'Vanguard Plan — 12% APY · WolvCapital', description: 'Stake WOLV for 150 days. Minimum $1,000. Earn 12% APY.' },
  horizon:  { title: 'Horizon Plan — 18% APY · WolvCapital',  description: 'Stake WOLV for 180 days. Minimum $5,000. Earn 18% APY.' },
  summit:   { title: 'Summit VIP — 25% APY · WolvCapital',    description: 'Elite staking for 365 days. Minimum $15,000. Earn 25% APY.' },
} as const

type PageKey = keyof typeof PAGES
type TierKey = keyof typeof TIERS

export function generateOgMetadata(page: PageKey): Metadata {
  const { title, description } = PAGES[page]
  const imageUrl = `${BASE_URL}/og?page=${page}`
  return {
    title,
    description,
    openGraph: {
      title, description,
      url: BASE_URL,
      siteName: 'WolvCapital',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description, images: [imageUrl] },
  }
}

export function generateTierOgMetadata(tier: TierKey): Metadata {
  const { title, description } = TIERS[tier]
  const imageUrl = `${BASE_URL}/og?tier=${tier}`
  return {
    title,
    description,
    openGraph: {
      title, description,
      url: `${BASE_URL}/staking/${tier}`,
      siteName: 'WolvCapital',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description, images: [imageUrl] },
  }
}

