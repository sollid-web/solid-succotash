'use client'

import Image from 'next/image'
import Link from 'next/link'
import FlipVisaCard from './FlipVisaCard'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
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
              <Link href="/plans" className="text-gray-700 hover:text-[#0b2f6b] font-medium transition">Plans</Link>
              <Link href="/about" className="text-gray-700 hover:text-[#0b2f6b] font-medium transition">About</Link>
              <Link href="/contact" className="text-gray-700 hover:text-[#0b2f6b] font-medium transition">Contact</Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/accounts/login" className="text-[#0b2f6b] font-semibold hover:text-[#2563eb] transition">
                Login
              </Link>
              <Link href="/accounts/signup" className="bg-gradient-to-r from-[#0b2f6b] via-[#2563eb] to-[#1d4ed8] text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#071d42] via-[#0b2f6b] to-[#1d4ed8] overflow-hidden pt-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.15) 0%, transparent 50%)'}}></div>
        </div>

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-8">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">INSTITUTIONAL-GRADE DIGITAL INVESTING</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight">
                Secure crypto banking,
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#fde047] to-[#facc15]"> audited ROI programs</span>
              </h1>

              <p className="text-xl lg:text-2xl text-gray-200 leading-relaxed max-w-2xl">
                Where institutional discipline meets crypto innovation. Every investment decision blends transparent data, audited reporting, and manual verification.
              </p>

              <div className="flex flex-wrap gap-4 text-sm font-semibold">
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                  <span className="text-gray-300">BITCOIN</span> <span className="text-green-400">+2.4%</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                  <span className="text-gray-300">ETHEREUM</span> <span className="text-green-400">+1.8%</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                  <span className="text-gray-300">USDT</span> <span className="text-blue-400">Stable</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                  <span className="text-gray-300">VIRTUAL CARDS</span> <span className="text-[#fde047]">24/7 issue</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/accounts/signup" className="bg-gradient-to-r from-[#fde047] to-[#facc15] text-[#0b2f6b] px-10 py-4 rounded-full text-lg font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  Open an account
                </Link>
                <Link href="/plans" className="bg-white/10 backdrop-blur-sm text-white px-10 py-4 rounded-full text-lg font-bold border-2 border-white/30 hover:bg-white/20 transition-all duration-300">
                  View investment plans
                </Link>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                <Image src="/images/hero-crypto-abstract-xl.jpg" alt="Secure blockchain operations" fill className="object-cover" priority sizes="50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b2f6b]/80 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-500 font-medium">Total Value Locked</div>
                      <div className="text-3xl font-bold text-[#0b2f6b]">$24.8M+</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 font-medium">Active Investors</div>
                      <div className="text-3xl font-bold text-[#0b2f6b]">12,450+</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#0b2f6b] mb-4">Why Choose WolvCapital?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Advanced technology with human oversight for ultimate security and profitability</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0b2f6b] to-[#2563eb] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#0b2f6b] mb-4">Manual Security</h3>
              <p className="text-gray-600 leading-relaxed">Every transaction manually reviewed for maximum security. Human oversight ensures your capital never moves without verification.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[#fde047] to-[#facc15] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-[#0b2f6b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#0b2f6b] mb-4">Premium Returns</h3>
              <p className="text-gray-600 leading-relaxed">Daily returns from 1% to 2% with our investment plans. Transparent, audited, and designed for consistent growth.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#0b2f6b] mb-4">Virtual Cards</h3>
              <p className="text-gray-600 leading-relaxed">Premium virtual Visa cards for global transactions. Instant activation with 24/7 support and exclusive rewards.</p>
            </div>
          </div>

          {/* Interactive Virtual Card Demo */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-[#0b2f6b] mb-3">Experience Your Virtual Card</h3>
              <p className="text-gray-600">Click or tap the card to flip and see both sides</p>
            </div>
            <FlipVisaCard />
          </div>
        </div>
      </section>

      {/* Investment Plans Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#0b2f6b] mb-4">Our Investment Plans</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Choose from our carefully crafted investment plans designed to meet different risk tolerances and investment goals</p>
          </div>

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
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">Entry-level investment plan perfect for beginners. Low risk with steady returns over 3 months.</p>
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
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">Intermediate plan for growing portfolios over 5 months.</p>
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
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">Advanced plan with higher allocation over 6 months.</p>
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
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">Premium annual plan for high-net-worth investors.</p>
                <Link href="/accounts/signup" className="block w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white text-center py-3 rounded-full font-bold hover:shadow-lg transition-all duration-300 group-hover:scale-105">Get Started</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-[#0b2f6b] via-[#1d4ed8] to-[#2563eb] text-white">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-6">Ready to Start Your Investment Journey?</h2>
          <p className="text-xl text-gray-200 mb-10 max-w-3xl mx-auto">Join thousands of investors who trust WolvCapital for secure, profitable digital investments</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/plans" className="bg-white text-[#0b2f6b] px-10 py-4 rounded-full text-lg font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105">View Investment Plans</Link>
            <Link href="/accounts/signup" className="bg-gradient-to-r from-[#fde047] to-[#facc15] text-[#0b2f6b] px-10 py-4 rounded-full text-lg font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105">Create Account</Link>
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
              <p className="text-gray-300 text-sm leading-relaxed">Secure crypto banking, audited ROI programs, and virtual cards—all governed by a human approval loop.</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>© 2025 WolvCapital Invest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
