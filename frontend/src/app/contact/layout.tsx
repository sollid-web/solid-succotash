import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us — WolvCapital Investor Support',
  description: 'Contact WolvCapital for account assistance, compliance inquiries, or partnership discussions. U.S. regulated digital investment platform — support@mail.wolvcapital.com.',
  alternates: { canonical: 'https://wolvcapital.com/contact' },
  openGraph: {
    title: 'Contact WolvCapital — Investor Support & Compliance',
    description: 'Reach our investor support and compliance teams. Palo Alto, CA registered office.',
    url: 'https://wolvcapital.com/contact',
    images: [{ url: '/og-images/contact-og.png', width: 1200, height: 630 }],
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
