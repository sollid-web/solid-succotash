'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslation } from '@/components/TranslationProvider'

export default function StatsSection() {
  const { t } = useTranslation()
  return (
    <section className="py-12 md:py-20 bg-[#070B19] relative overflow-hidden">
      {/* subtle grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,168,150,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,168,150,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      {/* glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,168,150,0.06) 0%, transparent 70%)' }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-widest font-bold text-teal-500 mb-6">
              {t('stats.eyebrow')}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl p-8 md:p-12 text-center relative"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(0,168,150,0.2)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05), 0 0 40px rgba(0,168,150,0.04)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* corner accent */}
            <div
              aria-hidden
              className="absolute top-0 left-0 w-24 h-24 rounded-tl-2xl pointer-events-none"
              style={{ background: 'linear-gradient(135deg, rgba(0,168,150,0.12) 0%, transparent 60%)' }}
            />
            <p className="text-base sm:text-lg text-slate-300 italic leading-relaxed">
              {t('stats.body')}
            </p>
          </motion.div>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              {t('stats.supporting')}{' '}
              <Link href="/legal" className="text-teal-400 font-semibold hover:text-teal-300 underline underline-offset-2 transition">
                {t('stats.link')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
