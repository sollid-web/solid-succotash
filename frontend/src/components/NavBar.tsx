"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { useState } from 'react'

export default function NavBar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '#plans', label: 'Plans' },
    { href: '#virtual-card', label: 'Virtual Card' },
    { href: '#compliance', label: 'Compliance' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#E2E8F0] bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity">
          <div className="w-2 h-2 bg-brand-primary rounded-sm"></div>
          <span className="text-xl font-bold text-[#0F172A]">WolvCapital</span>
        </Link>

        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#CBD5E1] bg-white text-[#0F172A] shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            {isOpen ? (
              <span className="text-2xl leading-none">×</span>
            ) : (
              <span className="flex h-5 w-5 flex-col justify-between">
                <span className="block h-0.5 w-full rounded bg-[#0F172A]" />
                <span className="block h-0.5 w-full rounded bg-[#0F172A]" />
                <span className="block h-0.5 w-full rounded bg-[#0F172A]" />
              </span>
            )}
          </button>
          <Button
            asLink
            href="/accounts/signup"
            className="bg-brand-primary text-white px-4 py-2 rounded-md font-bold text-sm hover:brightness-110 transition-colors"
          >
            Sign Up
          </Button>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <ul className="flex items-center gap-9">
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

          <Link
            href="/accounts/login"
            className="text-sm font-medium text-[#0F172A] px-5 py-2 border border-[#CBD5E1] rounded-md hover:bg-[#F8FAFC] transition-colors"
          >
            Login
          </Link>
          <Button
            asLink
            href="/accounts/signup"
            className="bg-brand-primary text-white px-5 py-2 rounded-md font-bold text-sm hover:brightness-110 transition-colors"
          >
            Sign Up
          </Button>
        </div>
      </div>

      <div
        className={cn(
          'lg:hidden overflow-hidden border-t border-[#E2E8F0] bg-white transition-[max-height] duration-300 ease-in-out',
          isOpen ? 'max-h-screen' : 'max-h-0'
        )}
      >
        <div className="px-4 py-4 sm:px-6">
          <ul className="space-y-3">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-xl px-3 py-2 text-base font-medium text-[#475569] transition hover:bg-slate-50 hover:text-[#0F172A]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-3">
            <Link
              href="/accounts/login"
              onClick={() => setIsOpen(false)}
              className="block rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-center text-sm font-medium text-[#0F172A] hover:bg-[#F8FAFC] transition"
            >
              Login
            </Link>
            <Button
              asLink
              href="/accounts/signup"
              className="w-full bg-brand-primary text-white px-4 py-3 rounded-xl text-sm font-bold hover:brightness-110 transition-colors"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
