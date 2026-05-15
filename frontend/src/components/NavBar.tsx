'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useTranslation } from '@/components/TranslationProvider'
import { cn } from '@/lib/cn'
import { useState, useEffect } from 'react'

export default function NavBar() {
  const pathname = usePathname()
  const { t } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const navItems = [
    { href: '/', labelKey: 'nav.home' },
    { href: '/wolv-token', label: 'WOLV Token' },
    { href: '/tokenomics', label: 'Tokenomics' },
    { href: '/roadmap', label: 'Roadmap' },
    { href: '/whitepaper', label: 'Whitepaper' },
    { href: '#plans', labelKey: 'nav.plans' },
    { href: '#compliance', labelKey: 'nav.compliance' },
    { href: '/blog', labelKey: 'nav.blog' },
    { href: '/contact', labelKey: 'nav.contact' },
  ]

  return (
    <nav style={{ background: 'rgba(6,12,26,0.92)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(42,82,190,0.2)' }} className="sticky top-0 w-full z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 hover:opacity-90 transition-opacity">
            <img src="/wolv-icon.svg" alt="WolvCapital" width={32} height={32} style={{ borderRadius: '50%' }} />
            <span className="text-xl font-bold text-white">WolvCapital</span>
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
                      ? 'text-[#00a896] hover:text-[#00c9b1] font-semibold'
                      : pathname === item.href
                      ? 'text-white border-b-2 border-[#00a896] pb-1'
                      : 'text-[rgba(255,255,255,0.65)] hover:text-white'
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
            {mounted <LanguageSwitcher /><LanguageSwitcher /> <LanguageSwitcher />}
            <Link
              href="/accounts/login"
              className="text-sm font-medium text-white px-5 py-2 border border-[rgba(255,255,255,0.2)] rounded-[7px] hover:border-[#00a896] hover:text-[#00a896] transition-colors"
            >
              {t('nav.login')}
            </Link>
            <Button
              asLink
              href="/accounts/signup"
              className="text-white px-5 py-2 rounded-[7px] font-bold text-sm transition-colors"
              style={{ background: 'linear-gradient(135deg, #2A52BE, #00a896)', boxShadow: '0 0 20px rgba(0,168,150,0.3)' }}
            >
              {t('nav.signup')}
            </Button>
          </div>

          {/* Mobile Right */}
          <div className="flex items-center gap-2 lg:hidden">
            {mounted <LanguageSwitcher /><LanguageSwitcher /> <LanguageSwitcher />}
            <Link
              href="/accounts/login"
              className="text-xs font-medium text-white px-3 py-2 border border-[rgba(255,255,255,0.2)] rounded-[7px] hover:border-[#00a896] transition-colors"
            >
              {t('nav.login')}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)' }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="lg:hidden" style={{ background: 'rgba(6,12,26,0.98)', borderTop: '1px solid rgba(42,82,190,0.2)', backdropFilter: 'blur(20px)' }}>
          <div className="px-4 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                  item.label === 'WOLV Token'
                    ? 'text-[#00a896] font-semibold'
                    : pathname === item.href
                    ? 'text-[#00a896] font-semibold'
                    : 'text-[rgba(255,255,255,0.75)] hover:text-white'
                )}
                style={
                  item.label === 'WOLV Token'
                    ? { background: 'rgba(0,168,150,0.08)', border: '1px solid rgba(0,168,150,0.2)' }
                    : pathname === item.href
                    ? { background: 'rgba(42,82,190,0.12)', border: '1px solid rgba(42,82,190,0.25)' }
                    : {}
                }
                onMouseEnter={e => {
                  if (item.label !== 'WOLV Token' && pathname !== item.href) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'
                  }
                }}
                onMouseLeave={e => {
                  if (item.label !== 'WOLV Token' && pathname !== item.href) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent'
                  }
                }}
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

            <div className="pt-3 mt-2" style={{ borderTop: '1px solid rgba(42,82,190,0.2)' }}>
              <Button
                asLink
                href="/accounts/signup"
                className="w-full text-white px-5 py-3 rounded-[10px] font-bold text-sm text-center block"
                style={{ background: 'linear-gradient(135deg, #2A52BE, #00a896)', boxShadow: '0 0 20px rgba(0,168,150,0.25)' }}
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
