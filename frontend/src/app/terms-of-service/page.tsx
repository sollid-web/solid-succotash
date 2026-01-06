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

      {/* OG Image Display */}
      <div className="w-full flex justify-center items-center py-8 bg-gray-50">
        <Image
          src="/og-images/terms-og.png"
          alt="Terms of Service – User Agreement & Platform Rules"
          width={1200}
          height={630}
          priority
          className="rounded-2xl shadow-2xl max-w-full h-auto"
        />
      </div>

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
                For questions about these terms, contact support@mail.wolvcapital.com
              </p>
            </div>
          </div>
        </section>
      </main>

    </div>
  )
}
