'use client'
import { useTranslation } from '@/i18n/TranslationProvider'
import { Button } from '@/components/ui/Button'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { StepCircle } from '@/components/ui/StepCircle'
export default function HowItWorksSection() {
  const { t } = useTranslation()
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <span className="text-[11px] font-bold tracking-widest text-brand-primary uppercase">{t('howitworks.eyebrow')}</span>
        </div>
        <SectionHeader title={t('howitworks.title')} description={t('howitworks.description')} centered className="mb-16" />
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <StepCircle number={1} icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg>} title={t('howitworks.step1.title')} description={t('howitworks.step1.description')} />
          <StepCircle number={2} icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /><rect width="20" height="14" x="2" y="6" rx="2" /></svg>} title={t('howitworks.step2.title')} description={t('howitworks.step2.description')} />
          <StepCircle number={3} icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>} title={t('howitworks.step3.title')} description={t('howitworks.step3.description')} />
          <StepCircle number={4} icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9"><path d="M16 7h6v6" /><path d="m22 7-8.5 8.5-5-5L2 17" /></svg>} title={t('howitworks.step4.title')} description={t('howitworks.step4.description')} />
        </div>
        <div className="text-center">
          <Button variant="cta-sky" size="lg" asLink href="/how-it-works" className="font-bold">{t('howitworks.cta')}</Button>
        </div>
      </div>
    </section>
  )
}
