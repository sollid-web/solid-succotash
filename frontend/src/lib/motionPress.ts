'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { triggerHaptic } from './useHaptic'

// Shared spring feel for every tactile press across the app.
export const pressSpring = { type: 'spring' as const, stiffness: 400, damping: 30 }

// Spread onto any motion.* element — applies the press-down scale + haptic
// without touching the element's existing className/layout/colors.
//
// Feedback fires on `onTap` (a completed, deliberate tap), not `onTapStart`
// (raw touch contact). Framer Motion cancels `onTap` automatically if the
// pointer moves past its drag threshold before release — e.g. a finger
// brushing a button while scrolling the page — so this is what gives presses
// their "resistance": a scroll-through touch no longer presses or vibrates
// every button it passes over.
export const pressableTapProps = {
  whileTap: { scale: 0.97 },
  transition: pressSpring,
  onTap: () => triggerHaptic(),
}

// motion-enhanced next/link, for CTA buttons that need client-side routing.
export const MotionLink = motion.create(Link)
