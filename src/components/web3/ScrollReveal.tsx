'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const TARGETS = 'main section, main article, main details, main table, main [class*="grid"] > *'

/**
 * Reveals below-the-fold blocks as they scroll into view on every public page.
 * Only elements that start off-screen are hidden, so first paint is never blank.
 */
export default function ScrollReveal() {
  const pathname = usePathname()
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const seen = new WeakSet<Element>()
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        const el = e.target as HTMLElement
        el.classList.remove('sr-hide'); el.classList.add('sr-show')
        io.unobserve(el)
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 })

    const scan = () => {
      const nodes = Array.from(document.querySelectorAll<HTMLElement>(TARGETS))
      nodes.forEach((el) => {
        if (seen.has(el) || el.closest('[data-no-reveal]') || el.classList.contains('sr-show')) return
        seen.add(el)
        const r = el.getBoundingClientRect()
        if (r.top < window.innerHeight * 0.92) return // already visible: leave alone
        const idx = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0
        el.style.setProperty('--sr-d', `${Math.min(idx, 6) * 0.07}s`)
        el.classList.add('sr-hide')
        io.observe(el)
      })
    }
    const t = window.setTimeout(scan, 120)
    let t2 = 0
    const mo = new MutationObserver(() => { window.clearTimeout(t2); t2 = window.setTimeout(scan, 160) })
    mo.observe(document.querySelector('main') ?? document.body, { childList: true, subtree: true })
    return () => { window.clearTimeout(t); window.clearTimeout(t2); io.disconnect(); mo.disconnect() }
  }, [pathname])
  return null
}
