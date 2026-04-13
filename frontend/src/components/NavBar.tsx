'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

export default function NavBar() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '#plans', label: 'Plans' },
    { href: '#virtual-card', label: 'Virtual Card' },
    { href: '#compliance', label: 'Compliance' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
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
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-[#1E3A8A] px-5 py-2 border border-[#2A52BE] rounded-[7px] hover:bg-[#eff6ff] transition-colors"
            >
              Login
            </Link>
            <Button
              asLink
              href="/auth/signup"
              className="bg-[#2A52BE] text-white px-5 py-2 rounded-[7px] font-bold text-sm hover:bg-[#244bb0] transition-colors"
            >
              Sign Up
            </Button>
          </div>

          <div className="lg:hidden">
            <Button
              asLink
              href="/auth/signup"
              className="bg-[#2A52BE] text-white px-5 py-2 rounded-[7px] font-bold text-sm hover:bg-[#244bb0] transition-colors"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
