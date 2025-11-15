import type { Metadata } from 'next'
import HomePage from '@/components/HomePage'

export const metadata: Metadata = {
  title: 'WolvCapital · Digital Investment Platform',
  description:
    'WolvCapital is a trusted digital investment platform offering crypto-based and ROI-driven financial opportunities with transparency, security, and expert oversight.',
  openGraph: {
    title: 'WolvCapital · Digital Investment Platform',
    description:
      'Trusted crypto-based investment platform offering transparency and real returns.',
    images: [
      {
         url: '/images/home-og.jpg',
        width: 1200,
        height: 630,
        alt: 'WolvCapital Professional Investment Platform',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WolvCapital · Digital Investment Platform',
    description:
      'Trusted crypto-based investment platform offering transparency and real returns.',
     images: ['/images/home-og.jpg'],
  },
}

export default function Home() {
  return <HomePage />
}