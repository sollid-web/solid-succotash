"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/i18n/TranslationProvider'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

export default function NavBar() {
  const pathname = usePathname()
  const { t } = useTranslation()

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '#plans', label: 'Plans' },
    { href: '#virtual-card', label: 'Virtual Card' },
    { href: '#compliance', label: 'Compliance' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="sticky top-0 w-full z-50 bg-white border-b border-[#E2E8F0] shadow-sm" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)', height: '68px', paddingLeft: '48px', paddingRight: '48px' }}>
      <div className="max-w-full mx-auto">
        <div className="flex items-center justify-between h-full">
          {/* Brand Logo + Wordmark with Navy Dot */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity">
            <div className="w-2 h-2 bg-brand-primary rounded-sm" style={{ borderRadius: '2px' }}></div>
            <span className="text-xl font-bold text-[#0F172A]">
              WolvCapital
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden lg:flex items-center gap-9">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors duration-200 tracking-tighter',
                    pathname === item.href 
                      ? 'text-[#0F172A] border-b-2 border-brand-primary' 
                      : 'text-[#475569] hover:text-[#0F172A]'
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Side: Auth Links */}
          <div className="hidden lg:flex items-center gap-4">
            <Link 
              href="/accounts/login" 
              className="text-sm font-medium text-[#0F172A] px-5 py-2 border border-[#CBD5E1] rounded-md hover:bg-[#F8FAFC] transition-colors"
            >
              Login
            </Link>
            <Button 
              asLink 
              href="/accounts/signup"
              className="bg-brand-primary text-white px-5 py-2 rounded-md font-semibold text-sm hover:bg-[#1E3A5F] transition-colors"
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile: Show sign up button only */}
          <div className="lg:hidden">
            <Button 
              asLink 
              href="/accounts/signup"
              className="bg-brand-primary text-white px-5 py-2 rounded-md font-semibold text-sm hover:bg-[#1E3A5F] transition-colors"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
