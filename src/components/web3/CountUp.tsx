'use client'
import { useEffect, useRef } from 'react'
import { animate, useInView } from 'framer-motion'

/** Animated number counter; renders the final value immediately for reduced-motion users. */
export default function CountUp({ value, decimals = 0, prefix = '', suffix = '' }: { value: number; decimals?: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const fmt = (n: number) => `${prefix}${n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`

  useEffect(() => {
    if (!inView || !ref.current) return
    const el = ref.current
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = fmt(value); return }
    const c = animate(0, value, { duration: 1.4, ease: 'easeOut', onUpdate: v => { el.textContent = fmt(v) } })
    return () => c.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value])

  return <span ref={ref}>{fmt(value)}</span>
}
