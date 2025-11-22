'use client'

import Head from 'next/head';
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import FaqAccordion from '@/components/FaqAccordion'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import PublicLayout from '@/components/PublicLayout'

function AboutNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#0b2f6b] to-[#2563eb] rounded-lg flex items-center justify-center">
              <span className="text-xl sm:text-2xl font-bold text-white">W</span>
            </div>
            <span className="text-lg sm:text-2xl font-bold text-[#0b2f6b] hidden xs:block">WolvCapital</span>
            <span className="text-lg font-bold text-[#0b2f6b] block xs:hidden">Wolv</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-[#0b2f6b] font-medium transition">Home</Link>
            <Link href="/plans" className="text-gray-700 hover:text-[#0b2f6b] font-medium transition">Plans</Link>
            <Link href="/about" className="text-[#0b2f6b] font-semibold">About</Link>
            <Link href="/contact" className="text-gray-700 hover:text-[#0b2f6b] font-medium transition">Contact</Link>
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <div className="mr-2">
              <LanguageSwitcher />
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-[#0b2f6b] hover:bg-gray-100 transition"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/accounts/login" className="text-[#0b2f6b] font-semibold hover:text-[#2563eb] transition">Login</Link>
            <Link href="/accounts/signup" className="bg-gradient-to-r from-[#0b2f6b] via-[#2563eb] to-[#1d4ed8] text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">Sign Up</Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-sm">
            <div className="px-4 py-4 space-y-3">
              <Link href="/" className="block px-3 py-2 rounded-md font-medium text-gray-700 hover:text-[#0b2f6b] hover:bg-gray-50 transition" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link href="/plans" className="block px-3 py-2 rounded-md font-medium text-gray-700 hover:text-[#0b2f6b] hover:bg-gray-50 transition" onClick={() => setIsMobileMenuOpen(false)}>Plans</Link>
              <Link href="/about" className="block px-3 py-2 rounded-md font-medium text-[#0b2f6b] bg-blue-50 font-semibold" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
              <Link href="/contact" className="block px-3 py-2 rounded-md font-medium text-gray-700 hover:text-[#0b2f6b] hover:bg-gray-50 transition" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
              
              {/* Mobile Auth Buttons */}
              <div className="pt-3 border-t border-gray-100 space-y-3">
                <Link href="/accounts/login" className="block w-full text-center px-4 py-3 text-[#0b2f6b] font-semibold hover:text-[#2563eb] transition border border-[#0b2f6b] rounded-full" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                <Link href="/accounts/signup" className="block w-full text-center bg-gradient-to-r from-[#0b2f6b] via-[#2563eb] to-[#1d4ed8] text-white px-4 py-3 rounded-full font-semibold hover:shadow-lg transition" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default function AboutPage() {
  return (
    <PublicLayout>
      <Head>
  <title>About WolvCapital · U.S. Digital Investment Platform</title>
  <meta name="description" content="Discover WolvCapital, a U.S. regulated digital investment platform led by experienced professionals. Learn about our commitment to secure investment returns, compliance, and transparent cryptocurrency investment opportunities." />
  <meta name="keywords" content="digital investment platform, U.S. fintech company, secure investment returns, cryptocurrency investment, regulated financial platform, WolvCapital team" />
  <meta property="og:title" content="About WolvCapital · U.S. Digital Investment Platform" />
  <meta property="og:description" content="Meet the WolvCapital team—trusted U.S. professionals delivering secure, compliant investment management." />
    <meta property="og:image" content="/images/about-og.jpg" />
  <meta name="robots" content="index, follow" />
      </Head>

      {/* Navigation */}
      <AboutNavigation />

      {/* Hero */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-16 bg-gradient-to-br from-[#0b2f6b] to-[#1d4ed8] text-white">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6">About WolvCapital</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto px-4">WolvCapital is a U.S. regulated digital investment platform dedicated to secure investment returns, transparent operations, and rigorous human oversight. Our mission is to deliver compliant cryptocurrency investment opportunities for institutional and individual investors.</p>
          <div className="mt-6 sm:mt-8 flex justify-center">
              <div className="relative w-full max-w-[320px] sm:max-w-[480px] aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 mx-auto flex items-center justify-center">
                  <Image
                    src="/images/home-hero.jpg"
                    alt="WolvCapital About Hero"
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 320px, 480px"
                  />
              </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="space-y-8 sm:space-y-12">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0b2f6b] mb-4 sm:mb-6">Our Mission</h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                WolvCapital's mission is to provide secure, transparent, and compliant investment opportunities in the digital asset sector. We integrate advanced technology with proven financial safeguards, ensuring every investment is protected and every transaction is subject to manual review by our compliance team.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0b2f6b] mb-4 sm:mb-6">Why Choose WolvCapital</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#0b2f6b] to-[#2563eb] rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-[#0b2f6b] mb-3">Human Oversight</h3>
                  <p className="text-gray-700">All financial transactions require manual approval by our compliance team. Automated withdrawals are not permitted, ensuring maximum security and regulatory compliance for your assets.</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-purple-700 mb-3">Audited Performance</h3>
                  <p className="text-gray-700">All investment returns are calculated transparently and deposited only after manual verification by our compliance team. Performance is subject to audit and regulatory review.</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-green-700 mb-3">Virtual Card Solutions</h3>
                  <p className="text-gray-700">Access secure virtual debit cards linked to your WolvCapital wallet. Spend your investment returns globally, with robust compliance and security controls.</p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-white p-8 rounded-2xl shadow-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-yellow-600 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-amber-700 mb-3">Dedicated Support</h3>
                  <p className="text-gray-700">Our compliance and client support teams are available to assist you with account management and investment inquiries. We prioritize responsive, professional service for all clients.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-[#0b2f6b] mb-6">Our Approach</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                WolvCapital prioritizes security and transparency through rigorous human oversight. Every deposit, withdrawal, and investment is manually approved by our compliance team, ensuring:
              </p>
              <ul className="space-y-4 text-lg text-gray-700">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Protection against unauthorized transactions and financial fraud</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Comprehensive audit trail for all financial operations</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Verified investment returns before wallet crediting</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Real human oversight for every money-moving operation</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-[#0b2f6b] mb-6">Frequently Asked Questions</h2>
              <div className="max-w-3xl">
                <FaqAccordion />
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0b2f6b] to-[#1d4ed8] text-white rounded-3xl p-12 text-center">
              <h2 className="text-4xl font-bold mb-6">Ready to Invest Securely?</h2>
              <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">Join a growing community of investors who trust WolvCapital, a U.S. regulated digital investment platform, for secure investment returns and transparent portfolio management.</p>
              <Link href="/accounts/signup" className="inline-block bg-white text-[#0b2f6b] px-12 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">Open Account</Link>
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
                <li>24/7 Support</li>
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
    </PublicLayout>
  )
}
