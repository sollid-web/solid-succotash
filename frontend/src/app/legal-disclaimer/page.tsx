import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Legal Disclaimer · WolvCapital Digital Investment Platform',
  description:
    'Read WolvCapital’s official legal disclaimer for secure investment returns, cryptocurrency investment opportunities, and U.S. regulatory compliance.',
  keywords: [
    'digital investment platform',
    'U.S. fintech company',
    'secure investment returns',
    'cryptocurrency investment',
    'regulated financial platform',
    'legal disclaimer',
    'WolvCapital'
  ],
  openGraph: {
    title: 'WolvCapital Legal Disclaimer · U.S. Digital Investment Platform',
    description: 'Official investment disclaimer and compliance notice by WolvCapital, a U.S. regulated platform.',
    images: [
      {
        url: '/images/legal/wolvcapital-legal-disclaimer.jpg',
        width: 1200,
        height: 630,
        alt: 'WolvCapital digital investment platform legal disclaimer',
      },
    ],
  },
  robots: { index: true, follow: true },
}

export default function LegalDisclaimerPage() {
    return (
      <>
        <div className="min-h-screen bg-hero-legal bg-cover bg-center bg-no-repeat">
          <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="flex items-center justify-between h-20">
                <Link href="/" className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0b2f6b] to-[#2563eb] rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">W</span>
                  </div>
                  <span className="text-2xl font-bold text-[#0b2f6b]">WolvCapital</span>
                </Link>
              </div>
            </div>
          </nav>

          <main className="min-h-screen bg-white">
            <section className="max-w-2xl mx-auto py-16 px-4">
              <h1 className="text-4xl font-bold mb-6">Legal Disclaimer</h1>
              <p className="text-lg text-gray-700 mb-8">WolvCapital does not provide financial or investment advice.<br />All information on this platform is for educational and operational purposes only.</p>
              <h2 className="text-2xl font-semibold mb-4">Limitations</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>ROI is not guaranteed</li>
                <li>Market volatility may affect results</li>
                <li>Users invest at their own discretion</li>
              </ul>
              <p className="text-lg text-blue-700 font-semibold mt-8">Always invest responsibly.</p>
            </section>
          </main>
        </div>
      </>
    );
}
