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
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { href: '/', labelKey: 'nav.home' },
    { href: '/wolv-token', label: 'WOLV Token' },
    { href: '#plans', labelKey: 'nav.plans' },
    { href: '#compliance', labelKey: 'nav.compliance' },
    { href: '/blog', labelKey: 'nav.blog' },
    { href: '/contact', labelKey: 'nav.contact' },
  ]

  return (
    <nav className="sticky top-0 w-full z-50 bg-white border-b border-[rgba(15,23,42,0.1)] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 hover:opacity-90 transition-opacity">
            <img src="/wolv-icon.svg" alt="WolvCapital" width={32} height={32} style={{ borderRadius: "50%" }} />
            <span className="text-xl font-bold text-[#0F172A]">WolvCapital</span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-9">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors duration-200 tracking-tighter',
                    item.label === 'WOLV Token'
                      ? 'text-[#00a896] hover:text-[#007a6e] font-semibold'
                      : pathname === item.href
                      ? 'text-[#0F172A] border-b-2 border-[#2A52BE] pb-1'
                      : 'text-[#475569] hover:text-[#0F172A]'
                  )}
                >
                  {item.label || t(item.labelKey!)}
                  {item.label === 'WOLV Token' && (
                    <span style={{
                      marginLeft: '6px', fontSize: '9px', background: '#00a896',
                      color: '#fff', padding: '1px 6px', borderRadius: '99px',
                      fontWeight: 700, verticalAlign: 'middle', letterSpacing: '0.5px',
                    }}>LIVE</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Auth */}
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

          {/* Mobile Right */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <Link
              href="/accounts/login"
              className="text-xs font-medium text-[#1E3A8A] px-3 py-2 border border-[#2A52BE] rounded-[7px] hover:bg-[#eff6ff] transition-colors"
            >
              {t('nav.login')}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="w-6 h-6 text-[#0F172A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-[#0F172A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white shadow-lg">
          <div className="px-4 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                  item.label === 'WOLV Token'
                    ? 'bg-[#e6faf8] text-[#00a896] font-semibold'
                    : pathname === item.href
                    ? 'bg-[#eff6ff] text-[#2A52BE]'
                    : 'text-[#475569] hover:bg-gray-50 hover:text-[#0F172A]'
                )}
              >
                <span>{item.label || t(item.labelKey!)}</span>
                {item.label === 'WOLV Token' && (
                  <span style={{
                    fontSize: '9px', background: '#00a896', color: '#fff',
                    padding: '2px 8px', borderRadius: '99px', fontWeight: 700, letterSpacing: '0.5px',
                  }}>LIVE</span>
                )}
              </Link>
            ))}

            <div className="pt-3 mt-2 border-t border-gray-100">
              <Button
                asLink
                href="/accounts/signup"
                className="w-full bg-[#2A52BE] text-white px-5 py-3 rounded-[10px] font-bold text-sm hover:bg-[#244bb0] transition-colors text-center block"
              >
                {t('nav.signup')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
