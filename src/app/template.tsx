'use client'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

/** Re-mounts on every navigation: soft rise + fade between pages. */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}
