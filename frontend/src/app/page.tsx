import type { Metadata } from 'next'
import HomePage from '@/components/HomePage'
import PublicLayout from '@/components/PublicLayout'
export const metadata: Metadata = {
  title: 'Wolvcapital | Structured Crypto Investment Platform',
  description:'Structured crypto investment plans designed for transparency, disciplined risk management, and long-term growth.',
  keywords: 'digital asset investment, crypto investment platform, crypto portfolio management, daily ROI crypto, WolvCapital, crypto risk management, verified investors, KYC compliant platform, crypto trading strategies, AML compliant investment, wolvcapital',
  openGraph: {
    title: 'Secure Digital Asset Investment | WolvCapital',
    description:
      'Earn 1%–2% Daily ROI with AML/KYC compliance and 256-bit encryption. Trusted by 45,000+ investors.',
    images: [
      {
         url: '/og-images/home-og.png',
        width: 1200,
        height: 630,
        alt: 'WolvCapital Secure Digital Asset Investment Platform',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WolvCapital — Secure Digital Asset Investment Platform',
    description:
      'Invest in secure digital assets. Daily ROI up to 5%, AML/KYC compliance, 256-bit encryption. Join 45,000+ verified investors globally.',
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