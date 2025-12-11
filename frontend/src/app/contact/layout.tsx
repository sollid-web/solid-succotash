import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us — WolvCapital | Support & Investor Assistance',
  description: 'Reach out to WolvCapital support for account assistance, investment inquiries, or general platform help. Our team is available to support global investors.',
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
