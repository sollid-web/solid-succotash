'use client'
import { useRef, type ReactNode, type CSSProperties } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface GlassCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  rim?: boolean
  tilt?: number // max degrees; 0 disables
  strong?: boolean
}

/** Liquid-glass card: pointer spotlight + subtle 3D tilt (hover devices only). */
export default function GlassCard({ children, className = '', style, rim = false, tilt = 5, strong = false }: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const sx = useSpring(px, { stiffness: 180, damping: 18 })
  const sy = useSpring(py, { stiffness: 180, damping: 18 })
  const rotateY = useTransform(sx, [0, 1], [-tilt, tilt])
  const rotateX = useTransform(sy, [0, 1], [tilt, -tilt])

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    px.set(x); py.set(y)
    ref.current.style.setProperty('--mx', `${x * 100}%`)
    ref.current.style.setProperty('--my', `${y * 100}%`)
  }
  const onLeave = () => { px.set(0.5); py.set(0.5) }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ ...style, rotateX: tilt ? rotateX : 0, rotateY: tilt ? rotateY : 0, transformPerspective: 900 }}
      className={`glass ${strong ? 'glass-strong' : ''} ${rim ? 'glass-rim' : ''} ${className}`}
    >
      {rim && <span className="rim" aria-hidden />}
      {children}
    </motion.div>
  )
}
