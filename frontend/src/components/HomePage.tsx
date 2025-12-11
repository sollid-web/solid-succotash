"use client"

import Image from 'next/image'
import Link from 'next/link'
import FlipCard from './FlipCard'
import { useTranslation } from '@/i18n/TranslationProvider'
import ReviewsRotator from '@/components/ReviewsRotator'
import TrustSection from '@/components/TrustSection'
import ProfessionalFooter from '@/components/ProfessionalFooter'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { UserPlus, Briefcase, CreditCard, TrendingUp, Shield, Lock, FileCheck, Clock, Bitcoin, HelpCircle, CheckCircle2, ShieldCheck, Globe, Users } from 'lucide-react'
// NavBar and any live transaction banners are intentionally omitted for a cleaner, faster initial render.

export default function HomePage() {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background Image and Text Overlay */}
      <section className="relative min-h-screen flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          {/* Mobile and Desktop - Using same hero image */}
          <Image
            src="/images/home-hero.jpg"
            alt="WolvCapital digital investment platform hero image, U.S. fintech company"
            fill
            className="object-cover object-center"
            priority
            quality={90}
          />
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b2f6b]/90 via-[#0b2f6b]/70 to-[#2563eb]/50" />
        </div>

        {/* Content Overlay */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              {t('hero.welcome').split(' ').slice(0,2).join(' ') || 'Welcome to'}
              <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-blue-200 to-blue-100 bg-clip-text text-transparent">
                WolvCapital
              </span>
            </h1>
            <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
              Invest confidently with WolvCapital, a U.S. digital investment platform delivering secure cryptocurrency investment opportunities, transparent performance, and regulated financial solutions for institutional and individual investors.
            </p>

            <Link
              href="/accounts/signup"
              className="inline-block bg-white text-[#0b2f6b] px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full text-sm sm:text-base md:text-lg font-bold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-2xl"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

  {/* Live transactions ticker removed per request (performance + visual focus) */}

      {/* OG Image Display */}
      <div className="w-full flex justify-center items-center py-8 bg-gray-50">
        <Image
          src="/og-images/home-og.png"
          alt="Secure Digital Asset Investment — WolvCapital"
          width={1200}
          height={630}
          priority
          className="rounded-2xl shadow-2xl max-w-full h-auto"
        />
      </div>

      {/* SEO Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#0b2f6b] mb-6">Invest in Secure Digital Assets With Confidence</h2>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <p className="text-lg leading-relaxed">
              WolvCapital is a digital investment platform designed for individuals seeking reliable, technology-driven asset growth. Our infrastructure combines advanced encryption, real-time fraud monitoring, transparent performance metrics, and strict KYC/AML compliance to ensure every investor experiences a secure and seamless investment process.
            </p>
            <p className="text-lg leading-relaxed">
              We provide structured investment plans with daily returns, flexible withdrawal options, and enterprise-grade security. Our platform supports investors from over 120 countries, delivering a user-friendly environment backed by professional risk controls and continuous system monitoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-[#0b2f6b] mb-4">Predictable Daily ROI</h3>
              <p className="text-gray-700">
                Our fixed and flexible plans provide structured returns ranging from 1% to 2% daily, depending on the selected tier. Investors retain control of their capital, profits, and withdrawal schedules.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-[#0b2f6b] mb-4">Battle-Tested Infrastructure</h3>
              <p className="text-gray-700">
                WolvCapital operates on secure, cloud-based architecture with 99.9% uptime, ensuring uninterrupted platform performance during deposits, withdrawals, or active investment periods.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
              <div className="relative w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <div className="absolute inset-0 bg-purple-400 rounded-2xl blur-sm opacity-50"></div>
                <Globe className="relative w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-bold text-[#0b2f6b] mb-4">Global Investor Network</h3>
              <p className="text-gray-700">
                More than 45,000 verified investors trust WolvCapital to manage their digital assets across 120+ countries. Our user approval and verification processes meet global standards for operational transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0b2f6b] mb-3 sm:mb-4">Why Investors Choose WolvCapital</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">WolvCapital combines advanced technology and rigorous human oversight to deliver a secure, transparent, and compliant digital investment experience for discerning investors.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0b2f6b] to-[#2563eb] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#0b2f6b] mb-4">Human Oversight</h3>
              <p className="text-gray-600 leading-relaxed">All transactions are subject to manual review by our compliance team, ensuring your capital is protected by robust security protocols and regulatory best practices.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[#fde047] to-[#facc15] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-[#0b2f6b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#0b2f6b] mb-4">Audited Performance</h3>
              <p className="text-gray-600 leading-relaxed">Our investment plans offer competitive daily returns, subject to transparent audit and compliance review. All performance is verified and never guaranteed.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#0b2f6b] mb-4">Virtual Card Solutions</h3>
              <p className="text-gray-600 leading-relaxed">Access premium virtual Visa cards for secure global transactions. Enjoy instant activation, 24/7 support, and enhanced spending controls.</p>
            </div>
          </div>

          {/* Interactive Virtual Card Demo */}
          <div className="mt-16">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#0b2f6b] mb-2 sm:mb-3">Preview Our Virtual Card Experience</h3>
              <p className="text-sm sm:text-base text-gray-600">Tap the card below to view both sides. WolvCapital virtual cards are designed for secure, compliant digital asset spending.</p>
            </div>
            <FlipCard />
            {/* Reviews carousel placed below the Visa card */}
            <div className="mt-12">
              <ReviewsRotator />
            </div>
          </div>
        </div>
      </section>

      {/* Investment Plans Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#0b2f6b] mb-4">Explore Our Investment Plans</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Select from a range of professionally structured investment plans tailored to diverse risk profiles and financial objectives. All plans are subject to U.S. regulatory standards and compliance review.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
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
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">Entry-level plan designed for new investors seeking stable, secure digital asset growth over a three-month period.</p>
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
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">A balanced plan for investors seeking portfolio growth and consistent returns over a five-month term, with full compliance and audit transparency.</p>
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
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">Advanced plan for experienced investors seeking higher allocations and extended growth over a six-month period, with all activity subject to regulatory review.</p>
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
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">Exclusive annual plan for high-net-worth and institutional clients seeking premium digital investment opportunities with comprehensive compliance oversight.</p>
                <Link href="/accounts/signup" className="block w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white text-center py-3 rounded-full font-bold hover:shadow-lg transition-all duration-300 group-hover:scale-105">Get Started</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-extrabold text-[#0b2f6b] mb-4">How WolvCapital Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Our streamlined investment process ensures security, transparency, and compliance at every step.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#0b2f6b] to-[#2563eb] rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <UserPlus className="w-10 h-10 text-white" aria-hidden="true" />
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#0b2f6b] font-bold shadow-lg">1</span>
              </div>
              <h3 className="text-xl font-bold text-[#0b2f6b] mb-3">Create Account</h3>
              <p className="text-gray-600">Sign up with your email and complete KYC verification for regulatory compliance.</p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <Briefcase className="w-10 h-10 text-white" aria-hidden="true" />
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#2563eb] font-bold shadow-lg">2</span>
              </div>
              <h3 className="text-xl font-bold text-[#0b2f6b] mb-3">Choose Plan</h3>
              <p className="text-gray-600">Select from our professionally structured investment plans based on your goals.</p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <CreditCard className="w-10 h-10 text-white" aria-hidden="true" />
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-purple-600 font-bold shadow-lg">3</span>
              </div>
              <h3 className="text-xl font-bold text-[#0b2f6b] mb-3">Deposit Funds</h3>
              <p className="text-gray-600">Fund your wallet securely. All deposits are manually reviewed and approved.</p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <TrendingUp className="w-10 h-10 text-white" aria-hidden="true" />
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-green-600 font-bold shadow-lg">4</span>
              </div>
              <h3 className="text-xl font-bold text-[#0b2f6b] mb-3">Track Returns</h3>
              <p className="text-gray-600">Monitor your investment performance with real-time dashboard analytics.</p>
            </div>
          </div>

          <div className="text-center">
            <Link href="/how-it-works" className="inline-block bg-gradient-to-r from-[#0b2f6b] via-[#2563eb] to-[#1d4ed8] text-white px-8 py-4 rounded-full text-lg font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105">
              Learn More About Our Process
            </Link>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-5xl font-extrabold text-[#0b2f6b] mb-6">Security and Compliance Standards</h2>
              <p className="text-lg text-gray-700 max-w-4xl mx-auto">
                WolvCapital implements a multilayered security framework to safeguard investor funds and sensitive information. Our operational environment includes:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <div className="absolute inset-0 bg-blue-400 rounded-2xl blur-sm opacity-50"></div>
                    <UserPlus className="relative w-8 h-8 text-white" aria-hidden="true" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0b2f6b] mb-2">KYC Verification</h3>
                    <p className="text-gray-600">Mandatory identity verification helps prevent fraud, identity theft, and unauthorized account use.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="relative w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <div className="absolute inset-0 bg-green-400 rounded-2xl blur-sm opacity-50"></div>
                    <Shield className="relative w-8 h-8 text-white" aria-hidden="true" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0b2f6b] mb-2">AML Compliance</h3>
                    <p className="text-gray-600">Real-time transaction monitoring detects and blocks suspicious activity while preserving user privacy.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="relative w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <div className="absolute inset-0 bg-purple-400 rounded-2xl blur-sm opacity-50"></div>
                    <Lock className="relative w-8 h-8 text-white" aria-hidden="true" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0b2f6b] mb-2">256-Bit SSL Encryption</h3>
                    <p className="text-gray-600">All data exchanged on the platform is encrypted with bank-grade security.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="relative w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <div className="absolute inset-0 bg-amber-400 rounded-2xl blur-sm opacity-50"></div>
                    <ShieldCheck className="relative w-8 h-8 text-white" aria-hidden="true" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0b2f6b] mb-2">Two-Factor Authentication</h3>
                    <p className="text-gray-600">Added protection prevents unauthorized access to investor accounts.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="relative w-14 h-14 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <div className="absolute inset-0 bg-red-400 rounded-2xl blur-sm opacity-50"></div>
                    <Clock className="relative w-8 h-8 text-white" aria-hidden="true" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0b2f6b] mb-2">24/7 Fraud Monitoring</h3>
                    <p className="text-gray-600">Our systems proactively track account behavior and prevent abnormal financial activity.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="relative w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <div className="absolute inset-0 bg-indigo-400 rounded-2xl blur-sm opacity-50"></div>
                    <FileCheck className="relative w-8 h-8 text-white" aria-hidden="true" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0b2f6b] mb-2">PCI-DSS Level 1 Standards</h3>
                    <p className="text-gray-600">Ensures that payment operations meet the highest industry benchmark.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
              <p className="text-lg text-gray-700 mb-6">
                WolvCapital is committed to maintaining a secure, transparent, and reliable ecosystem for digital asset investors worldwide.
              </p>
              <Link href="/security" className="inline-block bg-gradient-to-r from-[#0b2f6b] via-[#2563eb] to-[#1d4ed8] text-white px-8 py-4 rounded-full text-lg font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105">
                View Our Security Measures
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Security Visual Stats */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-[#0b2f6b] mb-6 text-center">Security At A Glance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl text-center">
                  <div className="flex justify-center mb-3">
                    <div className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <div className="absolute inset-0 bg-green-400 rounded-2xl blur opacity-40"></div>
                      <Lock className="relative w-9 h-9 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-green-700 mb-2">256-bit</div>
                  <div className="text-sm text-green-600 font-semibold">SSL Encryption</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl text-center">
                  <div className="flex justify-center mb-3">
                    <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <div className="absolute inset-0 bg-blue-400 rounded-2xl blur opacity-40"></div>
                      <ShieldCheck className="relative w-9 h-9 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-blue-700 mb-2">AML/KYC</div>
                  <div className="text-sm text-blue-600 font-semibold">Fully Compliant</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl text-center">
                  <div className="flex justify-center mb-3">
                    <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <div className="absolute inset-0 bg-purple-400 rounded-2xl blur opacity-40"></div>
                      <Clock className="relative w-9 h-9 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-purple-700 mb-2">24/7</div>
                  <div className="text-sm text-purple-600 font-semibold">Monitoring</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-2xl text-center">
                  <div className="flex justify-center mb-3">
                    <div className="relative w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <div className="absolute inset-0 bg-orange-400 rounded-2xl blur opacity-40"></div>
                      <Users className="relative w-9 h-9 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-orange-700 mb-2">45,000+</div>
                  <div className="text-sm text-orange-600 font-semibold">Global Investors</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-extrabold text-[#0b2f6b] mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Get answers to common questions about investing with WolvCapital.</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4 mb-12">
            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all border border-gray-200 hover:border-[#0b2f6b]">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-[#0b2f6b]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0b2f6b] mb-3">How does WolvCapital generate investor returns?</h3>
                  <p className="text-gray-700">WolvCapital uses a diversified strategy within the digital asset market, supported by automated monitoring tools and controlled risk exposure. Returns are based on the performance of selected asset pools and daily market conditions.</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all border border-gray-200 hover:border-green-600">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-green-600" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0b2f6b] mb-3">Is WolvCapital regulated?</h3>
                  <p className="text-gray-700">WolvCapital follows global compliance standards such as KYC, AML, and PCI-DSS, but it is not a government-regulated financial institution. Investors should review our Risk Disclosure before investing.</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all border border-gray-200 hover:border-purple-600">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-purple-600" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0b2f6b] mb-3">How long do withdrawals take?</h3>
                  <p className="text-gray-700">Profit withdrawals are available at end of your active investment plan. Processing time may vary depending on network conditions and verification requirements.</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all border border-gray-200 hover:border-amber-600">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-6 h-6 text-amber-600" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0b2f6b] mb-3">What are the minimum and maximum investment amounts?</h3>
                  <p className="text-gray-700">Minimum investment begins at $100. Higher-tier plans allow flexible or custom amounts depending on investor profile and plan type.</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all border border-gray-200 hover:border-indigo-600">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-indigo-600" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0b2f6b] mb-3">How is my account secured?</h3>
                  <p className="text-gray-700">WolvCapital uses multi-layer security including 2FA, 256-bit encryption, and real-time fraud detection to ensure full account protection.</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all border border-gray-200 hover:border-blue-600">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UserPlus className="w-6 h-6 text-blue-600" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0b2f6b] mb-3">Which countries does WolvCapital serve?</h3>
                  <p className="text-gray-700">Our platform supports investors from over 120 countries, provided they meet local compliance requirements.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/faq" className="inline-block bg-gradient-to-r from-[#0b2f6b] via-[#2563eb] to-[#1d4ed8] text-white px-8 py-4 rounded-full text-lg font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105">
              View All FAQs
            </Link>
          </div>
        </div>
      </section>

      {/* Referral Program Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-[#0b2f6b] mb-4">Earn with Our Referral Program</h2>
              <p className="text-gray-700 text-base lg:text-lg mb-4">Share WolvCapital with your network and earn referral rewards when your referrals become active investors. All activity is subject to manual compliance review and approval.</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Generate your unique code from the dashboard</li>
                <li>Share your referral link with friends or colleagues</li>
                <li>Track stats and rewards in your account</li>
              </ul>
              <div className="flex flex-wrap gap-3">
                <Link href="/referrals" className="bg-gradient-to-r from-[#0b2f6b] via-[#2563eb] to-[#1d4ed8] text-white px-6 py-3 rounded-full font-bold hover:shadow-lg transition-all">Learn More</Link>
                <a href="/referrals-brochure.html" target="_blank" rel="noopener" className="bg-white border border-gray-200 text-[#0b2f6b] px-6 py-3 rounded-full font-bold hover:shadow-lg transition-all">Download Brochure</a>
              </div>
              <p className="text-xs text-gray-500 mt-3">Rewards are never auto-approved; all payouts require administrative review.</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0b2f6b] to-[#2563eb] flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m6-6H6"/></svg>
                </div>
                <h3 className="text-xl font-bold text-[#0b2f6b]">Referral Highlights</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-2xl text-center">
                  <p className="text-sm text-blue-700">Manual Review</p>
                  <p className="text-2xl font-extrabold text-blue-900">100%</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl text-center">
                  <p className="text-sm text-emerald-700">Transparent</p>
                  <p className="text-2xl font-extrabold text-emerald-900">Always</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-2xl text-center">
                  <p className="text-sm text-amber-700">Secure</p>
                  <p className="text-2xl font-extrabold text-amber-900">By Design</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-[#0b2f6b] via-[#1d4ed8] to-[#2563eb] text-white">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 sm:mb-6">Begin Your Secure Investment Experience</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-10 max-w-3xl mx-auto">Join a growing community of investors who trust WolvCapital, a regulated U.S. fintech company, for transparent, secure digital investment solutions and cryptocurrency portfolio management.</p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
            <Link href="/plans" className="bg-white text-[#0b2f6b] px-6 sm:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105">View Plans</Link>
            <Link href="/accounts/signup" className="bg-gradient-to-r from-[#fde047] to-[#facc15] text-[#0b2f6b] px-6 sm:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105">Open Account</Link>
          </div>
        </div>
      </section>
      {/* Trust & Compliance Section */}
      <TrustSection />

      {/* Professional Footer */}
      <ProfessionalFooter />
    </div>
  )
}
