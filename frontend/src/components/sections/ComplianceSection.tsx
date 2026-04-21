'use client'
import Link from 'next/link'
import { useTranslation } from '@/i18n/TranslationProvider'
export default function ComplianceSection() {
  const { t } = useTranslation()
  const benefits = [
    t('compliance.benefit.1'), t('compliance.benefit.2'), t('compliance.benefit.3'),
    t('compliance.benefit.4'), t('compliance.benefit.5'), t('compliance.benefit.6'), t('compliance.benefit.7'),
  ]
  return (
    <section id="compliance" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-16 max-w-3xl">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#2A52BE] block mb-4">{t('compliance.eyebrow')}</span>
          <h2 className="text-3xl font-semibold text-[#0F172A] leading-tight sm:text-4xl md:text-5xl" style={{ letterSpacing: '-0.02em' }}>{t('compliance.title')}</h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-700">{t('compliance.description')}</p>
        </div>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[45%_55%] items-start max-w-[1200px] mx-auto">
          <div className="overflow-hidden rounded-[14px] bg-slate-100 shadow-2xl">
            <img src="/compliance-ecosystem.png" alt="Compliance ecosystem visual" className="w-full h-full object-cover" />
          </div>
          <div className="bg-[#2A52BE] rounded-[14px] p-8 lg:p-12 text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            <div className="mb-8">
              <p className="text-[15px] font-medium uppercase tracking-[0.26em] text-[#D6E8FF]">{t('compliance.card.subtitle')}</p>
              <h3 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">{t('compliance.card.title')}</h3>
            </div>
            <p className="mb-8 text-[15px] leading-7 text-[#E2E8F0]">{t('compliance.card.body')}</p>
            <ul className="space-y-4 mb-10">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#E2F5FF] text-[#2A52BE] text-sm font-semibold">✓</span>
                  <span className="text-[15px] leading-7 text-white">{benefit}</span>
                </li>
              ))}
            </ul>
            <Link href="/legal-disclaimer" className="inline-flex min-h-[44px] items-center justify-center rounded-[7px] bg-white px-6 py-3 text-sm font-semibold text-[#2A52BE] transition hover:bg-slate-100">{t('compliance.card.readMore')}</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
