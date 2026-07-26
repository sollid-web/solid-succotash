import type { Metadata } from 'next'

const SITE_URL = 'https://wolvcapital.com'

const PAGE_COPY: Record<string, { title: string; description: string }> = {
  home: {
    title: 'WolvCapital',
    description: 'Next-generation DeFi on BNB Smart Chain. Stake, earn, and govern with WOLV.',
  },
  'wolv-token': {
    title: 'WOLV Token — WolvCapital',
    description: 'The core utility token powering the WolvCapital ecosystem. Fixed supply, no mint, no pause.',
  },
  tokenomics: {
    title: 'Tokenomics — WolvCapital',
    description: 'Hard-capped supply of 1,000,000,000 WOLV. Transparent, auditable, on-chain.',
  },
  roadmap: {
    title: 'Roadmap — WolvCapital',
    description: 'Our path to a fully decentralized, community-owned DeFi protocol.',
  },
  whitepaper: {
    title: 'Whitepaper — WolvCapital',
    description: 'Technical architecture, tokenomics model, and governance framework in full detail.',
  },
}

export function generateOgMetadata(pageKey: string, overrides: Partial<Metadata> = {}): Metadata {
  const copy = PAGE_COPY[pageKey] || PAGE_COPY.home
  const ogImage = `${SITE_URL}/og?page=${encodeURIComponent(pageKey)}`
  const pagePath = pageKey === 'home' ? '' : `/${pageKey}`

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: `${SITE_URL}${pagePath}`,
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: `${SITE_URL}${pagePath}`,
      siteName: 'WolvCapital',
      images: [{ url: ogImage, width: 1200, height: 630, alt: copy.title }],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.title,
      description: copy.description,
      images: [ogImage],
    },
    ...overrides,
  }
}
