'use client'
import { motion } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { triggerHaptic } from '@/lib/useHaptic'

interface SwipeRowProps {
  children: ReactNode
  className?: string
}

export default function SwipeRow({ children, className }: SwipeRowProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className={`overflow-hidden ${className ?? ''}`}>
      <motion.div
        className="flex gap-4 w-max cursor-grab active:cursor-grabbing select-none"
        // Reserve vertical panning for native page scroll; only horizontal
        // movement is captured by the drag gesture below. Without this the
        // browser can't disambiguate a vertical scroll from a horizontal
        // swipe over the row, which is what made scrolling past it feel
        // sticky/resistant.
        style={{ touchAction: 'pan-y' }}
        drag="x"
        dragConstraints={containerRef}
        dragElastic={0.15}
        dragTransition={{ power: 0.2, timeConstant: 200 }}
        onDragEnd={() => triggerHaptic()}
      >
        {children}
      </motion.div>
    </div>
  )
}
