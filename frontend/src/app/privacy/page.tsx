import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Privacy Policy — WolvCapital | Data Protection & Security',
  description: 'Learn how WolvCapital protects your personal information with 256-bit encryption, KYC compliance, and strict data security measures.',
  openGraph: {
    title: 'Privacy Policy — WolvCapital',
    description: 'Your Data. Protected.',
    images: ['/og-images/privacy-og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy — WolvCapital',
    description: 'Your Data. Protected.',
    images: ['/og-images/privacy-og.png'],
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-hero-privacy bg-cover bg-center bg-no-repeat overlay-dark-60">
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

        <section className="pt-32 pb-16 bg-white/80 backdrop-blur-[1px]">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <div className="text-center mb-12">
              <div className="flex flex-col items-center mb-8">
                {/* Privacy OG Image as Hero Background */}
                <section className="relative w-full flex items-center justify-center mb-8 mt-4">
                  <Image
                    src="/og-images/privacy-og.png"
                    alt="Privacy Policy – Your Data. Protected."
                    width={1200}
                    height={630}
                    priority
                    className="rounded-2xl shadow-2xl max-w-full h-auto"
                  />
                </section>
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-[#0b2f6b] mb-4">Privacy Policy</h1>
              <p className="text-gray-600">Effective Date: October 2025. WolvCapital complies with all applicable U.S. financial and data protection regulations.</p>
            </div>

            <div className="prose max-w-none space-y-8">
              <p className="text-lg text-gray-700">
                At WolvCapital, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and protect your information when you use our services, in accordance with U.S. financial and data protection regulations.
              </p>

              <div>
                <h2 className="text-3xl font-bold text-[#0b2f6b] mt-12 mb-6">1. Information We Collect</h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Personal Data</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li><strong>Identity Information:</strong> Full name, date of birth, nationality, and government-issued identification</li>
                  <li><strong>Contact Information:</strong> Email address, phone number, and residential address</li>
                  <li><strong>Verification Documents:</strong> Passport, driver's license, or other KYC documentation</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Financial Data</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li>Deposit and withdrawal details, including payment methods and amounts</li>
                  <li>Transaction history and investment portfolio data</li>
                  <li>Cryptocurrency wallet addresses</li>
                  <li>Virtual card usage and transaction records</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Technical Data</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>IP address and geolocation data</li>
                  <li>Device information (type, operating system, browser)</li>
                  <li>Login timestamps and session duration</li>
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-[#0b2f6b] mt-12 mb-6">2. How We Use Your Data</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Service Provision:</strong> To provide our digital investment platform and process transactions</li>
                  <li><strong>Compliance:</strong> To comply with AML and KYC requirements</li>
                  <li><strong>Security:</strong> To enhance platform security and prevent fraud</li>
                  <li><strong>Communication:</strong> To notify you about account activity and service updates</li>
                  <li><strong>Customer Support:</strong> To respond to your inquiries and provide assistance</li>
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-[#0b2f6b] mt-12 mb-6">3. Data Sharing</h2>
                <p className="text-gray-700 mb-3"><strong>We do not sell your personal data.</strong> However, we may share your information with service providers and legal authorities in accordance with U.S. financial and data protection regulations:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Service Providers:</strong> Payment processors, identity verification partners, cloud hosting providers</li>
                  <li><strong>Legal Authorities:</strong> When required by law or legal process</li>
                  <li><strong>Business Transfers:</strong> In the event of a merger or acquisition</li>
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-[#0b2f6b] mt-12 mb-6">4. Data Security</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Encryption:</strong> End-to-end encryption for data transmission and storage</li>
                  <li><strong>Secure Authentication:</strong> Multi-factor authentication and secure password requirements</li>
                  <li><strong>Manual Review:</strong> Human oversight for all financial transactions</li>
                  <li><strong>Access Controls:</strong> Strict role-based access to data</li>
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-[#0b2f6b] mt-12 mb-6">5. Data Retention</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Active Accounts:</strong> Data retained for the duration of your account relationship</li>
                  <li><strong>Closed Accounts:</strong> Personal and financial data retained for 7 years to comply with financial regulations</li>
                  <li><strong>Transaction Records:</strong> Maintained for 7 years from the transaction date</li>
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-[#0b2f6b] mt-12 mb-6">6. Your Rights</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> Request deletion of your data (subject to legal retention requirements)</li>
                  <li><strong>Objection:</strong> Object to certain types of data processing, such as marketing</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  To exercise these rights, contact us at <a href="mailto:privacy@wolvcapital.com" className="text-blue-600 hover:underline">privacy@wolvcapital.com</a>.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-[#0b2f6b] mt-12 mb-6">7. Contact</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Email:</strong> <a href="mailto:privacy@wolvcapital.com" className="text-blue-600 hover:underline">privacy@wolvcapital.com</a></li>
                  <li><strong>General Support:</strong> <a href="mailto:support@wolvcapital.com" className="text-blue-600 hover:underline">support@wolvcapital.com</a></li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mt-8">
                <h3 className="text-lg font-bold text-green-800 mb-2">Your Privacy Matters</h3>
                <p className="text-green-700">
                  WolvCapital is committed to transparency and data protection. If you have any questions about how we handle your personal information, please contact us. All communications are handled in accordance with U.S. financial and data protection regulations.
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