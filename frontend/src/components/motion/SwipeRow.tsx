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
