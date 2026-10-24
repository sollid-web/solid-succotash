'use client'
import { motion } from 'framer-motion'

/** Floating glass coin: counter-rotating orbit rings around the WOLV icon. */
export default function TokenOrb({ size = 220 }: { size?: number }) {
  return (
    <div className="relative float-slow" style={{ width: size, height: size }} aria-hidden>
      <div className="absolute inset-[-18%] rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,201,177,.35), rgba(59,130,246,.15) 45%, transparent 70%)', filter: 'blur(28px)' }} />
      <motion.div className="absolute inset-0 rounded-full" style={{ border: '1px solid rgba(0,201,177,.45)', borderTopColor: 'transparent' }} animate={{ rotate: 360 }} transition={{ duration: 14, ease: 'linear', repeat: Infinity }} />
      <motion.div className="absolute inset-[9%] rounded-full" style={{ border: '1px dashed rgba(139,92,246,.45)' }} animate={{ rotate: -360 }} transition={{ duration: 22, ease: 'linear', repeat: Infinity }} />
      <div className="glass glass-strong absolute inset-[18%] grid place-items-center rounded-full" style={{ borderRadius: '9999px' }}>
        <img src="/wolv-icon.svg" alt="" width={size * 0.5} height={size * 0.5} style={{ borderRadius: '50%', filter: 'drop-shadow(0 0 18px rgba(0,201,177,.55))' }} />
      </div>
    </div>
  )
}
