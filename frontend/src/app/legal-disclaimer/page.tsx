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

          <section className="pt-32 pb-16 relative overflow-hidden bg-black/40">
            {/* Hero Background Image */}
            {/* Background already applied to wrapper; optional secondary overlay retained */}
            <div className="relative z-10 container mx-auto px-4 lg:px-8 max-w-6xl">
              {/* Enhanced Legal Disclaimer Image Card */}
              <div className="w-full flex flex-col items-center justify-center mb-8 mt-2">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-blue-200 ring-4 ring-blue-100/40 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg w-full">
                  <Image
                    src="/images/legal/wolvcapital-legal-disclaimer.jpg"
                    alt="WolvCapital Legal Disclaimer Document Signing"
                    width={480}
                    height={720}
                    priority
                    className="object-cover object-center w-full h-auto"
                  />
                  {/* Credibility Badge */}
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-[#0b2f6b] to-[#2563eb] text-white px-4 py-1 rounded-full shadow-lg text-xs font-bold tracking-wide flex items-center gap-2">
                    <svg className="w-4 h-4 text-white mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Verified Legal Document
                  </div>
                </div>
                <p className="text-sm text-gray-600 text-center mt-4 italic max-w-md">Signed and reviewed by legal counsel. All platform operations are subject to U.S. regulatory compliance and audit.</p>
              </div>
              <div className="text-center mb-12">
                <h1 className="text-5xl lg:text-6xl font-extrabold text-[#0b2f6b] mb-4 drop-shadow-lg">Legal Disclaimer</h1>
                <p className="text-gray-600 font-medium drop-shadow">Last updated: November 2025</p>
              </div>
              <div className="bg-white bg-opacity-90 rounded-2xl p-8 shadow-lg backdrop-blur-md mx-auto max-w-3xl">
                <h2 className="text-3xl font-bold text-[#0b2f6b] mt-4 mb-6">Important Notice</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  WolvCapital is a U.S. regulated digital investment platform offering cryptocurrency-based financial services. By accessing or using our services, you acknowledge and agree to the following terms and conditions, which are designed to meet U.S. financial and data protection standards.
                </p>
              </div>
              <div className="prose max-w-none space-y-8 bg-white rounded-2xl p-8 lg:p-12 shadow-lg mt-12">
                <p className="text-lg text-gray-700">
                  Please read this disclaimer carefully before using our platform. These terms outline important limitations and responsibilities.
                </p>
                <div>
                  <h2 className="text-3xl font-bold text-[#0b2f6b] mt-12 mb-6">No Guarantee of Returns</h2>
                  <p className="text-gray-700">
                    Investment returns are subject to market conditions and platform performance. Past performance does not guarantee future results. All investments carry inherent risk, and you may receive back less than your original investment amount. WolvCapital does not provide any guarantee of performance.
                  </p>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[#0b2f6b] mt-12 mb-6">User Responsibility</h2>
                  <p className="text-gray-700 mb-3">Users must ensure the accuracy of their account information and maintain the confidentiality of their credentials. You are solely responsible for compliance with all applicable laws and regulations in your jurisdiction:</p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Maintaining the security of your account credentials</li>
                    <li>Providing accurate and up-to-date personal information</li>
                    <li>Understanding the risks associated with your investments</li>
                    <li>Complying with applicable laws and regulations in your jurisdiction</li>
                  </ul>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[#0b2f6b] mt-12 mb-6">Service Availability</h2>
                  <p className="text-gray-700 mb-3">Platform features are subject to availability and approval. Service interruptions may occur due to regulatory requirements, compliance reviews, or operational constraints:</p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Scheduled maintenance and system upgrades</li>
                    <li>Technical difficulties or security concerns</li>
                    <li>Regulatory requirements or legal obligations</li>
                    <li>Market conditions or operational constraints</li>
                  </ul>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[#0b2f6b] mt-12 mb-6">Manual Review Process</h2>
                  <p className="text-gray-700">
                    All transactions undergo manual off-chain review for security and regulatory compliance purposes. Processing times typically range from 24-72 hours but may vary during high-volume periods or additional compliance checks.
                  </p>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[#0b2f6b] mt-12 mb-6">Limitation of Liability</h2>
                  <p className="text-gray-700">
                    WolvCapital shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform, investment losses, or service interruptions. All services are provided in accordance with applicable U.S. financial regulations.
                  </p>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[#0b2f6b] mt-12 mb-6">Contact Information</h2>
                  <p className="text-gray-700">
                    If you have any questions about this Legal Disclaimer, please contact us at <a href="mailto:legal@wolvcapital.com" className="text-blue-600 hover:underline">legal@wolvcapital.com</a>. All communications are handled in accordance with U.S. regulatory requirements.
                  </p>
                </div>
              </div>
              <div className="text-center mt-12">
                <Link href="/" className="text-[#2563eb] hover:text-[#1d4ed8] font-semibold">← Back to Home</Link>
              </div>
            </div>
          </section>
        </div>
      </>
    );
}
