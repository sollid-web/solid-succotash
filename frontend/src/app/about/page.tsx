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
    <PublicLayout backgroundClassName="bg-hero-about overlay-dark-40">
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
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-16 bg-black/50 text-white">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6">About WolvCapital</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto px-4">WolvCapital is a U.S. regulated digital investment platform dedicated to secure investment returns, transparent operations, and rigorous human oversight. Our mission is to deliver compliant cryptocurrency investment opportunities for institutional and individual investors.</p>
          <div className="mt-6 sm:mt-8 flex justify-center">
              <div className="relative w-full max-w-[320px] sm:max-w-[480px] aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 mx-auto flex items-center justify-center">
                  <Image
                    src="/images/about-hero.jpg"
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
      <main className="min-h-screen bg-white">
  <section className="max-w-2xl mx-auto py-16 px-4">
    <h1 className="text-4xl font-bold mb-6">About WolvCapital</h1>
    <p className="text-lg text-gray-700 mb-8">WolvCapital is a secure digital asset investment platform providing structured daily ROI for investors worldwide.</p>
    <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
    <p className="mb-6 text-gray-700">To make crypto investing simple, transparent, and profitable for everyday users.</p>
    <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
    <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
      <li>Security</li>
      <li>Transparency</li>
      <li>Performance</li>
      <li>Professional Support</li>
      <li>Responsible Investment</li>
    </ul>
    <p className="text-lg text-blue-700 font-semibold mt-8">WolvCapital is built to empower global investors with consistent returns and reliable financial growth.</p>
  </section>
</main>

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
