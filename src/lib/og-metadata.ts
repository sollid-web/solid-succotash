import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site-config'

const PAGE_COPY: Record<string, { title: string; description: string }> = {
  home: {
    title: 'WolvCapital',
    description: 'Public WOLV token information, platform terms, contract references, and digital-asset risk context.',
  },
  'wolv-token': {
    title: 'WOLV Token — WolvCapital',
    description: 'Review WOLV token information, public contract references, market data, and digital-asset risks.',
  },
  tokenomics: {
    title: 'Tokenomics — WolvCapital',
    description: 'Public WOLV token information, allocation references, current terms, and digital-asset risk context.',
  },
  roadmap: {
    title: 'Roadmap — WolvCapital',
    description: 'Review the published WolvCapital roadmap and the limits of forward-looking product information.',
  },
  whitepaper: {
    title: 'Whitepaper — WolvCapital',
    description: 'Technical architecture, tokenomics model, and governance framework in full detail.',
  },
  presale: {
    title: 'WOLV Presale — WolvCapital',
    description: 'Historical WOLV presale information. Review current availability, terms, and risk disclosures before taking action.',
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
