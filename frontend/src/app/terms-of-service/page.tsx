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
            <div className="relative w-full max-w-[560px] aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 mx-auto flex items-center justify-center">
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
              <h2 className="text-3xl font-bold text-[#0b2f6b] mb-6">5. Terms & Conditions Addendum</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                <span className="font-semibold">Addendum:</span> Capital Participation, Compounding &amp; Withdrawals
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                This Addendum forms part of Wolv Capital’s Terms and Conditions and applies to all investors effective immediately (Addendum Effective Date: February 2, 2026).
              </p>

              <ol className="space-y-6 text-lg text-gray-700 list-decimal pl-6">
                <li>
                  <span className="font-semibold text-gray-900">Nature of the Platform</span>
                  <p className="mt-2 leading-relaxed">
                    Wolv Capital operates as a crypto trading and portfolio management platform. Returns distributed to investors are derived from active trading activities and portfolio deployment.
                    The platform does not guarantee fixed, instant, or automated payouts.
                  </p>
                </li>
                <li>
                  <span className="font-semibold text-gray-900">Capital Participation &amp; Compounding</span>
                  <p className="mt-2 leading-relaxed">
                    Investors may choose to compound profits, make additional capital deposits, or maintain their current position. Compounding alone does not independently expand portfolio capacity.
                    Accounts with limited capital participation may experience adjusted growth rates and extended liquidity timelines.
                  </p>
                </li>
                <li>
                  <span className="font-semibold text-gray-900">Withdrawals &amp; Maturity</span>
                  <p className="mt-2 leading-relaxed">
                    Investment plan maturity indicates eligibility for withdrawal review, not immediate disbursement. All withdrawals are processed according to operational liquidity availability,
                    portfolio cycle completion, and internal risk management protocols.
                  </p>
                </li>
                <li>
                  <span className="font-semibold text-gray-900">Liquidity Management</span>
                  <p className="mt-2 leading-relaxed">
                    Wolv Capital reserves the right to schedule withdrawals to protect platform stability, ensure fair execution across investors, and maintain sustainable trading operations.
                  </p>
                </li>
                <li>
                  <span className="font-semibold text-gray-900">No Obligation to Reinvest</span>
                  <p className="mt-2 leading-relaxed">
                    Investors are under no obligation to make additional deposits. Participation decisions remain voluntary. Continued participation constitutes acceptance of the platform’s operational model and timelines.
                  </p>
                </li>
              </ol>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#0b2f6b] mb-6">6. Account Security</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                You are responsible for protecting your login credentials and account access. Notify support immediately if unauthorized activity is suspected.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#0b2f6b] mb-6">7. Prohibited Activities</h2>
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
              <h2 className="text-3xl font-bold text-[#0b2f6b] mb-6">8. Changes to Terms</h2>
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
