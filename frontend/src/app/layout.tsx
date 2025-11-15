import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import TawkToChat from '@/components/TawkToChat'
import { TranslationProvider } from '@/i18n/TranslationProvider'
import NavBar from '@/components/NavBar'

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
        url: '/images/home-og.jpg',
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
    images: ['/images/home-og.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
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
      <body className={`${inter.className} font-brand antialiased bg-gray-50 text-gray-900`}>
        <TranslationProvider>
          <NavBar />
          <main className="min-h-screen pt-20">{/* offset for fixed navbar */}
            {children}
          </main>
          <TawkToChat />
        </TranslationProvider>
      </body>
    </html>
  )
}