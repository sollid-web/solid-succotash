"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/i18n/TranslationProvider'
import LanguageSwitcher from '@/components/LanguageSwitcher'

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function NavBar() {
  const pathname = usePathname()
  const { t } = useTranslation()

  const navItems = [
    { href: '/', label: t('nav.home') },
    { href: '/plans', label: t('nav.plans') },
    { href: '/about', label: t('nav.about') },
    { href: '/contact', label: t('nav.contact') }
  ]

  return (
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

          <div className="flex items-center space-x-4">
            <Link href="/accounts/login" className="text-[#0b2f6b] font-semibold hover:text-[#2563eb] transition">
              {t('nav.login')}
            </Link>
            <Link href="/accounts/signup" className="bg-gradient-to-r from-[#0b2f6b] via-[#2563eb] to-[#1d4ed8] text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
              {t('nav.signup')}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
