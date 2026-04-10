"use client"

import Link from 'next/link'
import Image from 'next/image'
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
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo + Wordmark */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 sm:w-12 sm:h-12 relative">
              <Image
                src="/logo.svg"
                alt="WolvCapital"
                width={48}
                height={48}
                priority
                className="w-full h-full object-contain"
              />
            </div>
            <span className="hidden sm:inline text-xl sm:text-2xl font-bold text-brand-primary">
              WolvCapital
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors duration-200',
                    pathname === item.href ? 'text-brand-primary' : 'text-gray-600 hover:text-brand-primary'
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Side: Auth Links */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/accounts/login" className="text-sm font-semibold text-brand-primary hover:text-brand-secondary transition-colors">
              Login
            </Link>
            <Button variant="cta-sky" size="md" asLink href="/accounts/signup">
              Sign Up
            </Button>
          </div>

          {/* Mobile: Show sign up button only */}
          <div className="lg:hidden">
            <Button variant="cta-sky" size="sm" asLink href="/accounts/signup">
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
