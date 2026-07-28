'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import SwipeRow from '@/components/motion/SwipeRow'
import { pressableTapProps } from '@/lib/motionPress'

interface Plan {
  key: string
  name: string
  apy: string
  duration: string
  min: string
  max: string
  color: string
  summary: string
  fit: string
  details: readonly string[]
  href: string
}

export default function PlanCardsRow({ plans }: { plans: readonly Plan[] }) {
  return (
    <SwipeRow>
      {plans.map((plan) => (
        <motion.div
          key={plan.key}
          {...pressableTapProps}
          style={{
            background: 'rgba(255,255,255,0.04)', border: `1px solid ${plan.color}30`,
            borderRadius: '16px', padding: '24px 20px', display: 'flex', flexDirection: 'column',
            width: '260px', flexShrink: 0,
            backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
          }}
        >
          {/* tier badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: plan.color }} />
            <span style={{ fontSize: '11px', fontWeight: 700, color: plan.color, letterSpacing: '0.1em' }}>{plan.name.toUpperCase()}</span>
          </div>

          {/* APY */}
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', lineHeight: 1, marginBottom: '4px' }}>{plan.apy}</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>{plan.duration} · {plan.min}–{plan.max}</div>

          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, margin: '0 0 8px', flex: 1 }}>{plan.summary}</p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', margin: '0 0 16px' }}>{plan.fit}</p>

          {/* details */}
          <div style={{ marginBottom: '20px' }}>
            {plan.details.map((d) => (
              <div key={d} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: plan.color, flexShrink: 0, marginTop: '6px' }} />
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{d}</span>
              </div>
            ))}
          </div>

          <Link href={plan.href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 0', borderRadius: '8px', border: `1px solid ${plan.color}50`, background: `${plan.color}10`, color: plan.color, fontSize: '13px', fontWeight: 600, textDecoration: 'none', transition: 'all 0.15s' }}>
            Review plan →
          </Link>
        </motion.div>
      ))}
    </SwipeRow>
  )
}
