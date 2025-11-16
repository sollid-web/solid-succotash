import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Investment Plans · WolvCapital Digital Investment Platform',
  description: 'Explore professionally structured investment plans by WolvCapital. Secure, compliant, and subject to manual review.',
  openGraph: {
    title: 'Investment Plans · WolvCapital',
    description: 'Discover WolvCapital’s secure, audited investment plans.',
    images: [
      {
        url: '/images/og/plans-og.jpg',
        width: 1200,
        height: 630,
        alt: 'WolvCapital Investment Plans – OpenGraph image',
      },
    ],
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Page metadata moved to Next.js Metadata API */}
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
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
              <Link href="/plans" className="text-[#0b2f6b] font-semibold">Plans</Link>
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
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#0b2f6b] to-[#1d4ed8] text-white">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-extrabold mb-6">Investment Plans</h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">Explore WolvCapital’s professionally structured investment plans, designed for secure investment returns and compliant with U.S. financial regulations. Select a plan that aligns with your risk tolerance and financial objectives.</p>
          <div className="mt-8 flex justify-center">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 w-full max-w-[600px] mx-auto flex items-center justify-center">
              <Image
                src="/images/plans-hero.jpg"
                alt="WolvCapital Investment Plans — compliant, manually reviewed"
                width={1152}
                height={768}
                priority
                className="w-full h-auto object-cover object-center max-h-[300px] sm:max-h-[400px] md:max-h-[500px] lg:max-h-[630px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Pioneer */}
            <div className="group bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-[#0b2f6b] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#0b2f6b]/10 to-transparent rounded-bl-full"></div>
              <div className="relative">
                <div className="text-sm font-bold text-[#0b2f6b] uppercase tracking-wider mb-4">Pioneer</div>
                <div className="mb-6">
                  <div className="text-5xl font-extrabold text-[#0b2f6b] mb-2">1.00%</div>
                  <div className="text-gray-600 font-medium">Daily Return</div>
                </div>
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-bold text-[#0b2f6b]">90 days</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Min Amount:</span>
                    <span className="font-bold text-[#0b2f6b]">$100.00</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Max Amount:</span>
                    <span className="font-bold text-[#0b2f6b]">$999.00</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Total Return:</span>
                    <span className="font-bold text-green-600">90%</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">Entry-level plan for new investors seeking secure digital asset growth over a three-month period. All investments are subject to compliance review and audit.</p>
                <Link href="/accounts/signup" className="block w-full bg-gradient-to-r from-[#0b2f6b] to-[#2563eb] text-white text-center py-3 rounded-full font-bold hover:shadow-lg transition-all duration-300 group-hover:scale-105">Get Started</Link>
              </div>
            </div>

            {/* Vanguard */}
            <div className="group bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 hover:border-[#2563eb] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#2563eb]/10 to-transparent rounded-bl-full"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-bold text-[#2563eb] uppercase tracking-wider">Vanguard</div>
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">Popular</span>
                </div>
                <div className="mb-6">
                  <div className="text-5xl font-extrabold text-[#2563eb] mb-2">1.25%</div>
                  <div className="text-gray-600 font-medium">Daily Return</div>
                </div>
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-bold text-[#2563eb]">150 days</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Min Amount:</span>
                    <span className="font-bold text-[#2563eb]">$1,000.00</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Max Amount:</span>
                    <span className="font-bold text-[#2563eb]">$4,999.00</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Total Return:</span>
                    <span className="font-bold text-green-600">188%</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">Balanced plan for investors seeking portfolio growth and consistent returns over five months. All performance is subject to transparent audit and regulatory standards.</p>
                <Link href="/accounts/signup" className="block w-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white text-center py-3 rounded-full font-bold hover:shadow-lg transition-all duration-300 group-hover:scale-105">Get Started</Link>
              </div>
            </div>

            {/* Horizon */}
            <div className="group bg-gradient-to-br from-purple-50 to-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-purple-200 hover:border-purple-600 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-600/10 to-transparent rounded-bl-full"></div>
              <div className="relative">
                <div className="text-sm font-bold text-purple-700 uppercase tracking-wider mb-4">Horizon</div>
                <div className="mb-6">
                  <div className="text-5xl font-extrabold text-purple-700 mb-2">1.50%</div>
                  <div className="text-gray-600 font-medium">Daily Return</div>
                </div>
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-bold text-purple-700">180 days</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Min Amount:</span>
                    <span className="font-bold text-purple-700">$5,000.00</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Max Amount:</span>
                    <span className="font-bold text-purple-700">$14,999.00</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Total Return:</span>
                    <span className="font-bold text-green-600">270%</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">Advanced plan for experienced investors seeking higher allocations and extended growth over six months. All investments are reviewed for compliance and regulatory standards.</p>
                <Link href="/accounts/signup" className="block w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white text-center py-3 rounded-full font-bold hover:shadow-lg transition-all duration-300 group-hover:scale-105">Get Started</Link>
              </div>
            </div>

            {/* Summit */}
            <div className="group bg-gradient-to-br from-amber-50 via-yellow-50 to-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-amber-300 hover:border-amber-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-transparent rounded-bl-full"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-amber-400/10 to-transparent rounded-tr-full"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-bold text-amber-700 uppercase tracking-wider">Summit</div>
                  <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">VIP</span>
                </div>
                <div className="mb-6">
                  <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-600 mb-2">2.00%</div>
                  <div className="text-gray-600 font-medium">Daily Return</div>
                </div>
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-bold text-amber-700">365 days</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Min Amount:</span>
                    <span className="font-bold text-amber-700">$15,000.00</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Max Amount:</span>
                    <span className="font-bold text-amber-700">$100,000.00</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Total Return:</span>
                    <span className="font-bold text-green-600">730%</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">Exclusive annual plan for high-net-worth and institutional clients seeking premium digital investment opportunities. All activity is subject to comprehensive compliance oversight.</p>
                <Link href="/accounts/signup" className="block w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white text-center py-3 rounded-full font-bold hover:shadow-lg transition-all duration-300 group-hover:scale-105">Get Started</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#071d42] text-white py-16">
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
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-gray-300">
                <li>support@wolvcapital.com</li>
                <li>Compliance & Investor Support</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">WolvCapital</h3>
              <p className="text-gray-300 text-sm leading-relaxed">WolvCapital is a U.S. regulated digital investment platform providing secure investment returns, robust compliance controls, and premium virtual card solutions for professional and institutional clients.</p>
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