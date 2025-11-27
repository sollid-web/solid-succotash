import Head from 'next/head';
import Link from 'next/link'
import Image from 'next/image'

export default function TermsOfServicePage() {
  return (
    <>
      <Head>
  <title>Terms of Service · WolvCapital Digital Investment Platform</title>
  <meta name="description" content="Review WolvCapital’s Terms of Service for secure investment returns, cryptocurrency investment opportunities, and U.S. regulatory compliance." />
  <meta name="keywords" content="digital investment platform, U.S. fintech company, secure investment returns, cryptocurrency investment, regulated financial platform, terms of service, WolvCapital" />
  <meta property="og:title" content="WolvCapital Terms of Service · U.S. Digital Investment Platform" />
  <meta property="og:description" content="Read WolvCapital's user participation, investment, and compliance policy agreements." />
   <meta property="og:image" content="/images/legal/legal-terms-og.jpg" />
  <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-hero-terms bg-cover bg-center bg-no-repeat">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0b2f6b] to-[#2563eb] rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-white">W</span>
              </div>
              <span className="text-2xl font-bold text-[#0b2f6b]">WolvCapital</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-[#0b2f6b] font-medium transition">Home</Link>
              <Link href="/plans" className="text-gray-700 hover:text-[#0b2f6b] font-medium transition">Plans</Link>
              <Link href="/about" className="text-gray-700 hover:text-[#0b2f6b] font-medium transition">About</Link>
              <Link href="/contact" className="text-gray-700 hover:text-[#0b2f6b] font-medium transition">Contact</Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/accounts/login" className="text-[#0b2f6b] font-semibold hover:text-[#2563eb] transition">Login</Link>
              <Link href="/accounts/signup" className="bg-gradient-to-r from-[#0b2f6b] via-[#2563eb] to-[#1d4ed8] text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">Sign Up</Link>
            </div>
          </div>
        </div>
      </nav>

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
      <section className="py-24 bg-white/90 backdrop-blur-[1px]">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl prose prose-lg">
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Welcome to WolvCapital, a U.S. regulated digital investment platform. By accessing or using our services, you agree to be bound by these Terms of Service. Please read them carefully before using the platform. All financial operations are subject to U.S. regulatory standards and compliance review.
          </p>

          <h2 className="text-3xl font-bold text-[#0b2f6b] mt-12 mb-6">1. Eligibility</h2>
          <p className="text-gray-700 leading-relaxed mb-4">To use WolvCapital's services, you must meet the following requirements:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Be at least 18 years of age or the age of majority in your jurisdiction</li>
            <li>Have the legal capacity to enter into binding contracts</li>
            <li>Be legally permitted to invest in cryptocurrencies and digital assets in your jurisdiction</li>
            <li>Not be located in a country subject to international sanctions or embargoes</li>
          </ul>

          <h2 className="text-3xl font-bold text-[#0b2f6b] mt-12 mb-6">2. Account Responsibilities</h2>
          <p className="text-gray-700 leading-relaxed mb-4">When you create an account with WolvCapital, you agree to:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Confidentiality:</strong> Maintain the confidentiality of your login credentials</li>
            <li><strong>Account Activity:</strong> Any activity under your account is your responsibility</li>
            <li><strong>Notification:</strong> Notify us immediately of unauthorized access</li>
            <li><strong>Accurate Information:</strong> Provide and maintain accurate personal information</li>
          </ul>

          <h2 className="text-3xl font-bold text-[#0b2f6b] mt-12 mb-6">3. Investment Risks</h2>
          <p className="text-gray-700 leading-relaxed">
            All investments carry inherent risk. You acknowledge that investment returns are not guaranteed, digital asset values can decline rapidly, and you may lose some or all of your invested capital. WolvCapital does not provide any guarantee of performance. Please review our <Link href="/risk-disclosure" className="text-[#2563eb] hover:underline font-semibold">Risk Disclosure</Link> before investing.
          </p>

          <h2 className="text-3xl font-bold text-[#0b2f6b] mt-12 mb-6">4. Manual Approval Process</h2>
          <p className="text-gray-700 leading-relaxed">
            All financial transactions undergo manual off-chain review by our compliance team. Processing times typically range from 24-72 hours. Transactions may be delayed or rejected if they do not meet our compliance standards or U.S. regulatory requirements.
          </p>

          <h2 className="text-3xl font-bold text-[#0b2f6b] mt-12 mb-6">5. Fees</h2>
          <p className="text-gray-700 leading-relaxed mb-4">WolvCapital may charge fees for certain services, including:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Deposit processing fees (depending on payment method)</li>
            <li>Withdrawal transaction fees</li>
            <li>Virtual card issuance and maintenance fees</li>
            <li>Early withdrawal penalties on investment plans</li>
          </ul>

          <h2 className="text-3xl font-bold text-[#0b2f6b] mt-12 mb-6">6. Limitation of Liability</h2>
          <p className="text-gray-700 leading-relaxed">
            To the fullest extent permitted by law, WolvCapital is not liable for losses arising from market volatility, investment performance, or user negligence. Our total liability shall not exceed the amount of fees paid by you in the 12 months preceding the claim. All services are provided in accordance with applicable U.S. financial regulations.
          </p>

          <h2 className="text-3xl font-bold text-[#0b2f6b] mt-12 mb-6">7. Governing Law</h2>
          <p className="text-gray-700 leading-relaxed">
            These Terms of Service are governed by the laws of the United States. Any disputes shall be resolved in courts located in the United States unless otherwise required by mandatory consumer protection laws in your jurisdiction. WolvCapital complies with all applicable SEC, CFTC, and CCPA requirements.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mt-12 rounded-r-lg">
            <h3 className="text-xl font-bold text-blue-900 mb-2">Agreement Acknowledgment</h3>
            <p className="text-blue-800">
              By creating an account and using WolvCapital's services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service, our{' '}
              <Link href="/legal-disclaimer" className="text-blue-600 hover:underline font-semibold">Legal Disclaimer</Link>,{' '}
              <Link href="/risk-disclosure" className="text-blue-600 hover:underline font-semibold">Risk Disclosure</Link>, and{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline font-semibold">Privacy Policy</Link>. All policies are designed to meet U.S. financial and data protection standards.
            </p>
          </div>
        </div>
      </section>

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
              <p className="text-gray-300 text-sm leading-relaxed">U.S. regulated digital investment platform delivering secure investment workflows, manual compliance reviews, and premium virtual card solutions for professional and institutional clients.</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>© 2025 WolvCapital. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </div>
    </>
  )
}
