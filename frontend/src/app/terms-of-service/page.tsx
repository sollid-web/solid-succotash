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
      <main className="min-h-screen bg-white">
  <section className="max-w-2xl mx-auto py-16 px-4">
    <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
    <p className="text-lg text-gray-700 mb-8">These terms govern your access and use of WolvCapital, including all investment activities, withdrawals, and dashboard actions.</p>
    <h2 className="text-2xl font-semibold mb-4">Key Areas Covered</h2>
    <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
      <li>Account registration</li>
      <li>Investor responsibilities</li>
      <li>ROI structure</li>
      <li>Withdrawal rules</li>
      <li>Platform rights</li>
      <li>Limitations of liability</li>
      <li>Dispute resolution</li>
    </ul>
    <p className="text-lg text-blue-700 font-semibold mt-8">By using WolvCapital, you agree to these terms.</p>
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
