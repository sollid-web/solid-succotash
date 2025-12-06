import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — WolvCapital',
  description: 'Read WolvCapital\'s terms of service, user agreement, and platform rules governing digital asset investment services.',
  openGraph: {
    title: 'Terms of Service — WolvCapital',
    description: 'User Agreement & Platform Rules',
    images: ['/og-images/terms-og.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service — WolvCapital',
    description: 'User Agreement & Platform Rules',
    images: ['/og-images/terms-og.png'],
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-hero-terms bg-cover bg-center bg-no-repeat">
      {/* Hero */}
      <section className="pt-32 pb-16 bg-black/50 text-white">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-extrabold mb-6">Terms of Service</h1>
          <p className="text-xl text-gray-200">Effective Date: October 2025</p>
          <div className="mt-8 flex justify-center">
            <div className="relative w-full max-w-[480px] aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 mx-auto flex items-center justify-center">
              <Image
                src="/images/legal/legal-terms-hero.jpg"
                alt="WolvCapital Terms of Service — participation and compliance"
                fill
                priority
                className="object-cover object-center"
                sizes="100vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="min-h-screen bg-white">
        <section className="max-w-4xl mx-auto py-16 px-4">
          <div className="space-y-12">
            <div>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                By accessing or using WolvCapital, you agree to comply with these Terms of Service. If you do not agree with any part of these terms, do not use the platform.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#0b2f6b] mb-6">1. Acceptance of Terms</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                These terms constitute a legally binding agreement between you and WolvCapital. By registering, depositing funds, or using platform features, you accept all terms and policies.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#0b2f6b] mb-6">2. Eligibility</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                You must meet the following criteria:
              </p>
              <ul className="space-y-3 text-lg text-gray-700 list-disc pl-6">
                <li>At least 18 years of age</li>
                <li>Legally permitted to invest in digital assets in your jurisdiction</li>
                <li>Capable of entering a binding contract</li>
                <li>Able to pass KYC verification</li>
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#0b2f6b] mb-6">3. Investment Participation</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                All investment plans are subject to availability and review. WolvCapital reserves the right to:
              </p>
              <ul className="space-y-3 text-lg text-gray-700 list-disc pl-6">
                <li>Modify investment plans and ROI rates</li>
                <li>Suspend or terminate access at any time</li>
                <li>Require additional verification for withdrawals</li>
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#0b2f6b] mb-6">4. Withdrawals & Payouts</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Withdrawal requests are processed manually and may require up to 5 business days. Additional verification may be requested for security purposes.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#0b2f6b] mb-6">5. Account Security</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                You are responsible for protecting your login credentials and account access. Notify support immediately if unauthorized activity is suspected.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#0b2f6b] mb-6">6. Prohibited Activities</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                The following actions are strictly prohibited:
              </p>
              <ul className="space-y-3 text-lg text-gray-700 list-disc pl-6">
                <li>Using the platform for money laundering or fraud</li>
                <li>Creating multiple accounts</li>
                <li>Attempting to exploit system vulnerabilities</li>
                <li>Providing false information during KYC verification</li>
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#0b2f6b] mb-6">7. Changes to Terms</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                WolvCapital may update these terms at any time. Continued use of the platform after changes constitutes acceptance.
              </p>
            </div>

            <div className="bg-blue-50 p-8 rounded-2xl">
              <p className="text-lg text-gray-700 leading-relaxed font-semibold">
                For questions about these terms, contact support@wolvcapital.com
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#071d42] text-white py-16 bg-opacity-95">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-300 hover:text-white transition">Home</Link></li>
                <li><Link href="/plans" className="text-gray-300 hover:text-white transition">Investment Plans</Link></li>
                <li><Link href="/about" className="text-gray-300 hover:text-white transition">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/terms-of-service" className="text-gray-300 hover:text-white transition">Terms of Service</Link></li>
                <li><Link href="/legal-disclaimer" className="text-gray-300 hover:text-white transition">Legal Disclaimer</Link></li>
                <li><Link href="/risk-disclosure" className="text-gray-300 hover:text-white transition">Risk Disclosure</Link></li>
                <li><Link href="/privacy" className="text-gray-300 hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/legal/certificate-of-operation" className="text-gray-300 hover:text-white transition">Certificate of Operation</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-gray-300">
                <li>support@wolvcapital.com</li>
                <li>24/7 Support</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">WolvCapital</h3>
              <p className="text-gray-300 text-sm leading-relaxed">WolvCapital is a digital asset investment platform providing secure and sustainable daily ROI opportunities through diversified strategies and advanced risk controls. With global investor support, AML/KYC compliance, and industry-grade security, WolvCapital delivers a trusted environment for digital asset growth.</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>© 2025 WolvCapital. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
