'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { triggerHaptic } from './useHaptic'

// Shared spring feel for every tactile press across the app.
export const pressSpring = { type: 'spring' as const, stiffness: 400, damping: 30 }

// Spread onto any motion.* element — applies the press-down scale + haptic
// without touching the element's existing className/layout/colors.
export const pressableTapProps = {
  whileTap: { scale: 0.97 },
  transition: pressSpring,
  onTapStart: () => triggerHaptic(),
}

// motion-enhanced next/link, for CTA buttons that need client-side routing.
export const MotionLink = motion.create(Link)
