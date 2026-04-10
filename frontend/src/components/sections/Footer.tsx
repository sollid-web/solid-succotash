'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0b2f6b] text-white">
      {/* Main Footer */}
      <div className="border-b border-white border-opacity-10 py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-200 to-blue-100 bg-clip-text text-transparent mb-3">
                WolvCapital
              </h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-4 max-w-xs">
                A trusted digital investment platform providing secure, transparent, and compliant financial solutions for institutional and
                individual investors worldwide.
              </p>
              {/* Socials */}
              <div className="flex gap-2">
                {[
                  { icon: <Facebook className="w-4 h-4" />, href: '#' },
                  { icon: <Twitter className="w-4 h-4" />, href: '#' },
                  { icon: <Instagram className="w-4 h-4" />, href: '#' },
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    className="w-9 h-9 rounded-full bg-white bg-opacity-10 flex items-center justify-center hover:bg-opacity-20 transition"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div>
              <h4 className="text-lg font-bold mb-4">Platform</h4>
              <ul className="space-y-2">
                {[
                  { label: 'Create Account', href: '/accounts/signup' },
                  { label: 'Login', href: '/accounts/login' },
                  { label: 'Investment Plans', href: '/plans' },
                  { label: 'Virtual Card', href: '#virtual-card' },
                  { label: 'FAQ', href: '/faq' },
                ].map((item, idx) => (
                  <li key={idx}>
                    <Link href={item.href} className="text-blue-100 text-sm hover:text-white transition">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Compliance */}
            <div>
              <h4 className="text-lg font-bold mb-4">Legal & Compliance</h4>
              <ul className="space-y-2">
                {[
                  { label: 'Terms of Service', href: '/terms-of-service' },
                  { label: 'Privacy Policy', href: '/privacy' },
                  { label: 'Risk Disclosure', href: '/risk-disclosure' },
                  { label: 'Legal Disclaimer', href: '/legal-disclaimer' },
                ].map((item, idx) => (
                  <li key={idx}>
                    <Link href={item.href} className="text-blue-100 text-sm hover:text-white transition">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-bold mb-4">Support</h4>
              <ul className="space-y-2">
                {[
                  { label: 'Contact Us', href: '/contact' },
                  { label: 'About WolvCapital', href: '/about' },
                  { label: 'Email Support', href: 'mailto:support@mail.wolvcapital.com' },
                  { label: 'Available 24/7 on business days', href: '#' },
                ].map((item, idx) => (
                  <li key={idx}>
                    {item.href === '#' ? (
                      <span className="text-blue-100 text-sm">{item.label}</span>
                    ) : (
                      <Link href={item.href} className="text-blue-100 text-sm hover:text-white transition">
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="py-8">
        <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Copyright */}
          <div>
            <p className="text-sm text-blue-100">© {new Date().getFullYear()} WolvCapital, Inc. All rights reserved.</p>
            <p className="text-xs text-white text-opacity-35 mt-1">
              WolvCapital is a registered U.S.-based digital investment platform. All investments are subject to risk and regulatory oversight.
            </p>
          </div>

          {/* Badges */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-xs text-blue-100">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              SSL Encrypted
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-100">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Verified Platform
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
