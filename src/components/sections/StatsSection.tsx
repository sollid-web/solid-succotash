'use client'
import Link from 'next/link'
import { useTranslation } from '@/components/TranslationProvider'
export default function StatsSection() {
  const { t } = useTranslation()
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-6">{t('stats.eyebrow')}</p>
          </div>
          <div className="bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl p-8 md:p-12 text-center">
            <p className="text-lg text-gray-700 italic leading-relaxed">{t('stats.body')}</p>
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {t('stats.supporting')}{' '}
              <Link href="/legal" className="text-blue-600 font-semibold underline hover:no-underline">{t('stats.link')}</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
