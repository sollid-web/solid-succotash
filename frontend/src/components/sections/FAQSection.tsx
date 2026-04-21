'use client'
import { useState } from 'react'
import { HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/components/TranslationProvider'
export default function FAQSection() {
  const { t } = useTranslation()
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const FAQS = Array.from({ length: 11 }, (_, i) => ({
    question: t(`faq.q${i + 1}`),
    answer: t(`faq.a${i + 1}`),
  }))
  return (
    <section id="faq" className="py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-4">
          <span className="text-[11px] font-bold tracking-widest text-brand-primary uppercase">{t('faq.eyebrow')}</span>
        </div>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#0F172A] mb-4" style={{ letterSpacing: '-0.02em' }}>{t('faq.title')}</h2>
          <p className="text-[#64748B] text-lg max-w-2xl mx-auto">{t('faq.subtitle')}</p>
        </div>
        <div className="max-w-4xl mx-auto space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className={`rounded-xl border transition-all ${openIdx === idx ? 'border-brand-primary bg-white shadow-lg' : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:shadow-md'}`}>
              <button onClick={() => setOpenIdx(openIdx === idx ? null : idx)} className="w-full flex items-start gap-4 p-6 text-left hover:bg-gray-50 rounded-xl">
                <div className="flex-shrink-0 w-10 h-10 bg-[#EFF6FF] rounded-lg flex items-center justify-center mt-0.5">
                  <HelpCircle className="w-5 h-5 text-[#0F172A]" />
                </div>
                <div className="flex-1"><h3 className="font-bold text-[#0F172A] text-[15px]">{faq.question}</h3></div>
                <div className={`flex-shrink-0 text-brand-primary text-2xl transition-transform ${openIdx === idx ? 'rotate-45' : ''}`}>+</div>
              </button>
              {openIdx === idx && (
                <div className="px-6 pb-6 pt-0 border-t border-[#F1F5F9]">
                  <p className="text-[#64748B] leading-relaxed text-sm">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/faq" className="inline-flex items-center px-8 py-3 bg-[#e2f5ff] text-[#0F172A] font-semibold rounded-md hover:bg-[#1E3A5F] transition">{t('faq.viewAll')}</Link>
        </div>
      </div>
    </section>
  )
}
