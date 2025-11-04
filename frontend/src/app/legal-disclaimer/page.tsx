import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Legal Disclaimer · WolvCapital',
  description:
    'Read WolvCapital’s official legal disclaimer outlining investment terms, risk responsibilities, and service conditions for all users.',
  keywords: ['investment disclaimer', 'compliance', 'investor terms', 'platform conditions', 'WolvCapital legal'],
  openGraph: {
    title: 'WolvCapital Legal Disclaimer',
    description: 'Official investment disclaimer and compliance notice by WolvCapital Ltd.',
    images: [
      // Use a known-present image to avoid 404s in previews
      {
        url: '/images/hero-crypto-abstract-xl.jpg',
        width: 1200,
        height: 630,
        alt: 'WolvCapital Professional Investment Platform',
      },
    ],
  },
  robots: { index: true, follow: true },
}

export default function LegalDisclaimerPage() {
  return (
      <div className="min-h-screen bg-white">
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

        <section className="pt-32 pb-16 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold text-[#0b2f6b] mb-4">Legal Disclaimer</h1>
              <p className="text-gray-600">Last updated: November 2025</p>
            </div>

            <div className="grid lg:grid-cols-[420px_1fr] gap-12 items-start mb-12">
              {/* Legal Image */}
              <div className="mx-auto lg:mx-0">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-200">
                  <Image
                    src="/images/legal/wolvcapital-legal-disclaimer.jpg"
                    alt="Legal practitioner signing official WolvCapital disclaimer documents"
                    width={480}
                    height={720}
                    priority
                    sizes="(min-width: 1024px) 420px, 90vw"
                    className="w-full h-auto object-cover animate-fadeIn"
                  />
                </div>
                <p className="text-sm text-gray-500 text-center mt-4 italic">
                  Professional legal review ensures compliance and transparency
                </p>
              </div>

              {/* Intro Content */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-[#0b2f6b] mb-4">Important Notice</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  WolvCapital is a digital investment platform offering cryptocurrency-based financial services. By accessing or using our services, you acknowledge and agree to the following terms and conditions.
                </p>
              </div>
            </div>

            <div className="prose max-w-none space-y-8 bg-white rounded-2xl p-8 lg:p-12 shadow-lg">
              <p className="text-lg text-gray-700">
                Please read this disclaimer carefully before using our platform. These terms outline important limitations and responsibilities.
              </p>

              <div>
                <h2 className="text-2xl font-bold text-[#0b2f6b] mb-4">No Guarantee of Returns</h2>
                <p className="text-gray-700">
                  Investment returns are subject to market conditions and platform performance. Past performance does not guarantee future results. All investments carry inherent risk, and you may receive back less than your original investment amount.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#0b2f6b] mb-4">User Responsibility</h2>
                <p className="text-gray-700 mb-3">Users must ensure the accuracy of their account information and maintain the confidentiality of their credentials. You are solely responsible for:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Maintaining the security of your account credentials</li>
                  <li>Providing accurate and up-to-date personal information</li>
                  <li>Understanding the risks associated with your investments</li>
                  <li>Complying with applicable laws and regulations in your jurisdiction</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#0b2f6b] mb-4">Service Availability</h2>
                <p className="text-gray-700 mb-3">Platform features are subject to availability and approval. Service interruptions may occur due to:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Scheduled maintenance and system upgrades</li>
                  <li>Technical difficulties or security concerns</li>
                  <li>Regulatory requirements or legal obligations</li>
                  <li>Market conditions or operational constraints</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#0b2f6b] mb-4">Manual Review Process</h2>
                <p className="text-gray-700">
                  All transactions undergo manual off-chain review for security purposes. Processing times typically range from 24-72 hours but may vary during high-volume periods.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#0b2f6b] mb-4">Limitation of Liability</h2>
                <p className="text-gray-700">
                  WolvCapital shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform, investment losses, or service interruptions.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#0b2f6b] mb-4">Contact Information</h2>
                <p className="text-gray-700">
                  If you have any questions about this Legal Disclaimer, please contact us at <a href="mailto:legal@wolvcapital.com" className="text-blue-600 hover:underline">legal@wolvcapital.com</a>.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link href="/" className="text-[#2563eb] hover:text-[#1d4ed8] font-semibold">← Back to Home</Link>
            </div>
          </div>
        </section>
      </div>
  )
}
