import type { Metadata } from 'next'
import './globals.css'

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
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-brand antialiased bg-gray-50 text-gray-900">
        {/* Global Navigation would go here */}
        <main className="min-h-screen">
          {children}
        </main>
        {/* Global Footer would go here */}
      </body>
    </html>
  )
}