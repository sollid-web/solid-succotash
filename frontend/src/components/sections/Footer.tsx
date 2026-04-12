'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-brand-dark">
      {/* Main Footer */}
      <div className="border-b border-[#1E3A5F] py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold text-white mb-3">
                WolvCapital
              </h3>
              <p className="text-[#64748B] text-sm leading-relaxed mb-4 max-w-xs">
                Regulated digital asset portfolio management. Transparent fees. Institutional custody. Capital at risk.
              </p>
            </div>

            {/* Platform */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#94A3B8] mb-4">Platform</h4>
              <ul className="space-y-2">
                {[
                  { label: 'Create Account', href: '/accounts/signup' },
                  { label: 'Login', href: '/accounts/login' },
                  { label: 'Investment Plans', href: '/plans' },
                  { label: 'Virtual Card', href: '#virtual-card' },
                  { label: 'FAQ', href: '/faq' },
                ].map((item, idx) => (
                  <li key={idx}>
                    <Link href={item.href} className="text-[#94A3B8] text-sm hover:text-white transition">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Compliance */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#94A3B8] mb-4">Legal & Compliance</h4>
              <ul className="space-y-2">
                {[
                  { label: 'Terms of Service', href: '/terms-of-service' },
                  { label: 'Privacy Policy', href: '/privacy' },
                  { label: 'Risk Disclosure', href: '/risk-disclosure' },
                  { label: 'Legal Disclaimer', href: '/legal-disclaimer' },
                  { label: 'Compliance', href: '#compliance' },
                ].map((item, idx) => (
                  <li key={idx}>
                    <Link href={item.href} className="text-[#94A3B8] text-sm hover:text-white transition">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#94A3B8] mb-4">Support</h4>
              <ul className="space-y-2">
                {[
                  { label: 'About', href: '/about' },
                  { label: 'Contact', href: '/contact' },
                  { label: 'Blog', href: '/blog' },
                  { label: 'Security', href: '/security' },
                  { label: 'Status', href: '#' },
                ].map((item, idx) => (
                  <li key={idx}>
                    <Link href={item.href} className="text-[#94A3B8] text-sm hover:text-white transition">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#1E3A5F] py-6">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-[#475569] text-xs">
              © {new Date().getFullYear()} WolvCapital, Inc. All rights reserved.
            </p>
            
            {/* Badges */}
            <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
              <span className="px-2 py-1">🔒 FinCEN MSB Registered</span>
              <span className="px-2 py-1">🔐 256-bit SSL Encryption</span>
              <span className="px-2 py-1">✓ PCI-DSS Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
