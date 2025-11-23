"use client"

import Link from 'next/link'

export default function ProfessionalFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0b2f6b] text-white">
      {/* Main Footer Content */}
      <div className="border-b border-blue-600">
        <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-200 to-blue-100 bg-clip-text text-transparent">
                WolvCapital
              </h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-6">
                A trusted digital investment platform providing secure, transparent, and regulated financial solutions for institutional and individual investors worldwide.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3a9 9 0 01-9 9m0-9a9 9 0 019 9" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-6">Platform</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/accounts/signup" className="text-blue-100 hover:text-white transition-colors">
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link href="/accounts/login" className="text-blue-100 hover:text-white transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/plans" className="text-blue-100 hover:text-white transition-colors">
                    Investment Plans
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-blue-100 hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal & Compliance */}
            <div>
              <h4 className="font-bold text-lg mb-6">Legal & Compliance</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/terms-of-service" className="text-blue-100 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-blue-100 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/risk-disclosure" className="text-blue-100 hover:text-white transition-colors">
                    Risk Disclosure
                  </Link>
                </li>
                <li>
                  <Link href="/legal-disclaimer" className="text-blue-100 hover:text-white transition-colors">
                    Legal Disclaimer
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support & Company */}
            <div>
              <h4 className="font-bold text-lg mb-6">Support</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/contact" className="text-blue-100 hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-blue-100 hover:text-white transition-colors">
                    About WolvCapital
                  </Link>
                </li>
                <li>
                  <a href="mailto:support@wolvcapital.com" className="text-blue-100 hover:text-white transition-colors">
                    Email Support
                  </a>
                </li>
                <li>
                  <p className="text-blue-100">
                    Available 24/7 on business days
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-blue-100 text-sm">
            <p>&copy; {currentYear} WolvCapital, Inc. All rights reserved.</p>
            <p className="mt-2 text-xs text-blue-200">
              WolvCapital is a registered U.S.-based digital investment platform. All investments are subject to risk and regulatory oversight.
            </p>
          </div>
          <div className="flex gap-4 text-xs text-blue-100">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Verified Platform</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
