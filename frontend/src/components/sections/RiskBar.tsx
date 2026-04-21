'use client'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { useTranslation } from '@/i18n/TranslationProvider'
export default function RiskBar() {
  const { t } = useTranslation()
  return (
    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-t-4 border-amber-500 py-6 md:py-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-start gap-4 md:gap-5">
          <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-[#0F172A]" />
          </div>
          <div className="flex-1 min-w-0">
            <strong className="block text-base md:text-lg text-amber-950 mb-2">{t('riskbar.title')}</strong>
            <p className="text-amber-900 text-xs md:text-sm leading-relaxed">
              {t('riskbar.body')}{' '}
              <Link href="/risk-disclosure" className="font-bold underline hover:no-underline">{t('riskbar.riskDisclosure')}</Link>{' '}
              {t('riskbar.and')}{' '}
              <Link href="/terms-of-service" className="font-bold underline hover:no-underline">{t('riskbar.terms')}</Link>{' '}
              {t('riskbar.before')}
            </p>
          </div>
          <Link href="/risk-disclosure" className="w-full md:w-auto md:flex-shrink-0 inline-flex items-center justify-center gap-2 px-4 md:px-6 py-2 bg-amber-600 text-[#0F172A] rounded-lg font-semibold hover:bg-amber-700 transition whitespace-nowrap text-sm md:text-base">
            {t('riskbar.cta')}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
