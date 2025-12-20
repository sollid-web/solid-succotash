"use client"

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from '@/i18n/TranslationProvider'
import LanguageSwitcher from '@/components/LanguageSwitcher'

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function NavBar() {
  const pathname = usePathname()
  const { t } = useTranslation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { href: '/', label: t('nav.home') },
    { href: '/blog', label: t('nav.blog') },
    { href: '/contact', label: t('nav.contact') }
  ]

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
            <Image
              src="/wolv-logo.svg"
              alt="WolvCapital"
              width={240}
              height={64}
              priority
              className="h-8 sm:h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={classNames(
                  'font-medium transition',
                  pathname === item.href ? 'text-[#0b2f6b] font-semibold' : 'text-gray-700 hover:text-[#0b2f6b]'
                )}
              >
                {item.label}
              </Link>
            ))}
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
            <Link href="/accounts/login" className="text-[#0b2f6b] font-semibold hover:text-[#2563eb] transition">
              {t('nav.login')}
            </Link>
            <Link href="/accounts/signup" className="bg-gradient-to-r from-[#0b2f6b] via-[#2563eb] to-[#1d4ed8] text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
              {t('nav.signup')}
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-sm">
            <div className="px-4 py-4 space-y-3">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={classNames(
                    'block px-3 py-2 rounded-md font-medium transition',
                    pathname === item.href 
                      ? 'text-[#0b2f6b] bg-blue-50 font-semibold' 
                      : 'text-gray-700 hover:text-[#0b2f6b] hover:bg-gray-50'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Auth Buttons */}
              <div className="pt-3 border-t border-gray-100 space-y-3">
                <Link 
                  href="/accounts/login" 
                  className="block w-full text-center px-4 py-3 text-[#0b2f6b] font-semibold hover:text-[#2563eb] transition border border-[#0b2f6b] rounded-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.login')}
                </Link>
                <Link 
                  href="/accounts/signup" 
                  className="block w-full text-center bg-gradient-to-r from-[#0b2f6b] via-[#2563eb] to-[#1d4ed8] text-white px-4 py-3 rounded-full font-semibold hover:shadow-lg transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.signup')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
