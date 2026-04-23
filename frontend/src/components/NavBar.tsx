'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useTranslation } from '@/components/TranslationProvider'
import { cn } from '@/lib/cn'
import { useState } from 'react'

export default function NavBar() {
  const pathname = usePathname()
  const { t } = useTranslation()

  const navItems = [
    { href: '/', labelKey: 'nav.home' },
    { href: '#plans', labelKey: 'nav.plans' },
    { href: '#virtual-card', labelKey: 'nav.virtualCard' },
    { href: '#compliance', labelKey: 'nav.compliance' },
    { href: '/blog', labelKey: 'nav.blog' },
    { href: '/contact', labelKey: 'nav.contact' },
  ]

  return (
    <nav className="sticky top-0 w-full z-50 bg-white border-b border-[rgba(15,23,42,0.1)] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 hover:opacity-90 transition-opacity">
            <div className="w-2 h-2 bg-[#2A52BE] rounded-sm"></div>
            <span className="text-xl font-bold text-[#0F172A]">
              WolvCapital
            </span>
          </Link>

          <ul className="hidden lg:flex items-center gap-9">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors duration-200 tracking-tighter',
                    pathname === item.href
                      ? 'text-[#0F172A] border-b-2 border-[#2A52BE] pb-1'
                      : 'text-[#475569] hover:text-[#0F172A]'
                  )}
                >
                  {t(item.labelKey)}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitcher />
            <Link
              href="/accounts/login"
              className="text-sm font-medium text-[#1E3A8A] px-5 py-2 border border-[#2A52BE] rounded-[7px] hover:bg-[#eff6ff] transition-colors"
            >
              {t('nav.login')}
            </Link>
            <Button
              asLink
              href="/accounts/signup"
              className="bg-[#2A52BE] text-white px-5 py-2 rounded-[7px] font-bold text-sm hover:bg-[#244bb0] transition-colors"
            >
              {t('nav.signup')}
            </Button>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <LanguageSwitcher />
            <Link
              href="/accounts/login"
              className="text-sm font-medium text-[#1E3A8A] px-4 py-2 border border-[#2A52BE] rounded-[7px] hover:bg-[#eff6ff] transition-colors"
            >
              {t('nav.login')}
            </Link>
            <Button
              asLink
              href="/accounts/signup"
              className="bg-[#2A52BE] text-white px-4 py-2 rounded-[7px] font-bold text-sm hover:bg-[#244bb0] transition-colors"
            >
              {t('nav.signup')}
            </Button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-6 h-6 text-[#0F172A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
