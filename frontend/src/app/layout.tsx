import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], weight: [
  '300', '400', '500', '600', '700', '800', '900'
] });

export const metadata: Metadata = {
  title: 'WolvCapital - Professional Investment Platform',
  description: 'WolvCapital offers professional investment opportunities with manual off-chain approvals for maximum security.',
  keywords: 'investment, platform, wolvcapital, professional, secure, blockchain',
  authors: [{ name: 'WolvCapital Team' }],
  creator: 'WolvCapital',
  publisher: 'WolvCapital',
  metadataBase: new URL('https://wolvcapital.com'),
  openGraph: {
    title: 'WolvCapital - Professional Investment Platform',
    description: 'Professional investment platform with secure deposits, real-time tracking, and verified withdrawals.',
    url: 'https://wolvcapital.com',
    siteName: 'WolvCapital',
    images: [
      {
        url: '/images/hero-crypto-abstract-xl.jpg',
        width: 1200,
        height: 630,
        alt: 'WolvCapital Professional Investment Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WolvCapital - Professional Investment Platform',
    description: 'Professional investment platform with secure deposits, real-time tracking, and verified withdrawals.',
    images: ['/images/hero-crypto-abstract-xl.jpg'],
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <title>WolvCapital · Digital Investment Platform</title>
        <meta name="description" content="WolvCapital is a trusted digital investment platform offering crypto-based and ROI-driven financial opportunities with transparency, security, and expert oversight." />
        <meta name="keywords" content="digital investment platform, crypto ROI, secure investments, fintech growth, WolvCapital" />
        <meta property="og:title" content="WolvCapital · Digital Investment Platform" />
        <meta property="og:description" content="Trusted crypto-based investment platform offering transparency and real returns." />
        <meta property="og:image" content="/images/hero-crypto-abstract-xl.jpg" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="WolvCapital Ltd" />
        <meta name="theme-color" content="#0b2f6b" />
        <meta property="og:site_name" content="WolvCapital" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} font-brand antialiased bg-gray-50 text-gray-900`}>
        {/* Global Navigation would go here */}
        <main className="min-h-screen">
          {children}
        </main>
        {/* Global Footer would go here */}
      </body>
    </html>
  )
}