import type { Metadata } from 'next'
import HomePage from '@/components/HomePage'
import PublicLayout from '@/components/PublicLayout'
export const metadata: Metadata = {
  title: 'WolvCapital | Professionally Managed Digital Asset Portfolios',
  description: 'KYC-verified digital asset management with 1–2% annual fees, institutional custody via Coinbase, and transparent reporting. Audit-verified platform.',
  keywords: 'digital asset investment, cryptocurrency portfolio, managed investments, institutional custody, KYC compliant, crypto management, WolvCapital, audited platform',
  openGraph: {
    title: 'Professional Digital Asset Management | WolvCapital',
    description:
      'Professionally managed cryptocurrency portfolios with KYC verification, institutional custody (Coinbase), and transparent fees.',
    images: [
      {
         url: '/og-images/home-og.png',
        width: 1200,
        height: 630,
        alt: 'WolvCapital Professional Digital Asset Management Platform',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Digital Asset Management | WolvCapital',
    description:
      'Professionally managed cryptocurrency portfolios with KYC verification, institutional custody, and audited compliance.',
     images: ['/og-images/home-og.png'],
  },
}

export default function Home() {
  return (
    <PublicLayout backgroundClassName="bg-hero-home overlay-dark-60">
      <HomePage />
    </PublicLayout>
  )
}