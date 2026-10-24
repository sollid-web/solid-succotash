'use client'
import { motion, useScroll, useSpring } from 'framer-motion'

/** Fixed animated mesh behind every public page + a thin scroll-progress bar. */
export default function AuroraBackground() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.2 })
  return (
    <>
      <motion.div aria-hidden className="scroll-progress" style={{ scaleX }} />
      <div aria-hidden className="aurora">
        <i /><i /><i />
      </div>
    </>
  )
}
