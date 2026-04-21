'use client'
import Link from 'next/link'
import { useTranslation } from '@/i18n/TranslationProvider'
export default function CTASection() {
  const { t } = useTranslation()
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#0F172A] mb-6">{t('cta.title')}</h2>
          <p className="text-xl text-[#475569] max-w-2xl mx-auto leading-relaxed">{t('cta.subtitle')}</p>
        </div>
        <form className="mx-auto max-w-4xl bg-white border border-[#E5E7EB] rounded-[8px] p-6 shadow-sm">
          <div className="grid gap-6 lg:grid-cols-2">
            <label className="block">
              <span className="text-[13px] font-medium text-[#475569]">{t('cta.field.fullName')}</span>
              <input type="text" name="fullName" placeholder={t('cta.field.fullName.placeholder')} className="mt-2 w-full rounded-[8px] border border-gray-300 bg-white px-4 py-3 text-[13px] text-[#0F172A] outline-none transition focus:border-[#2A52BE] focus:ring-2 focus:ring-[#2A52BE]/15" />
              <span className="mt-2 block text-[12px] text-[#94A3B8]">{t('cta.field.fullName.hint')}</span>
            </label>
            <label className="block">
              <span className="text-[13px] font-medium text-[#475569]">{t('cta.field.email')}</span>
              <input type="email" name="email" placeholder={t('cta.field.email.placeholder')} className="mt-2 w-full rounded-[8px] border border-gray-300 bg-white px-4 py-3 text-[13px] text-[#0F172A] outline-none transition focus:border-[#2A52BE] focus:ring-2 focus:ring-[#2A52BE]/15" />
              <span className="mt-2 block text-[12px] text-[#94A3B8]">{t('cta.field.email.hint')}</span>
            </label>
            <label className="block">
              <span className="text-[13px] font-medium text-[#475569]">{t('cta.field.country')}</span>
              <select name="country" className="mt-2 w-full appearance-none rounded-[8px] border border-gray-300 bg-white px-4 py-3 text-[13px] text-[#0F172A] outline-none transition focus:border-[#2A52BE] focus:ring-2 focus:ring-[#2A52BE]/15">
                <option value="">{t('cta.field.country.placeholder')}</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
              </select>
              <span className="mt-2 block text-[12px] text-[#94A3B8]">{t('cta.field.country.hint')}</span>
            </label>
            <label className="block">
              <span className="text-[13px] font-medium text-[#475569]">{t('cta.field.amount')}</span>
              <input type="number" name="investmentAmount" placeholder={t('cta.field.amount.placeholder')} className="mt-2 w-full rounded-[8px] border border-gray-300 bg-white px-4 py-3 text-[13px] text-[#0F172A] outline-none transition focus:border-[#2A52BE] focus:ring-2 focus:ring-[#2A52BE]/15" />
              <span className="mt-2 block text-[12px] text-[#94A3B8]">{t('cta.field.amount.hint')}</span>
            </label>
          </div>
          <div className="mt-8 flex flex-col gap-4 items-center justify-between sm:flex-row">
            <Link href="/accounts/signup" className="inline-flex items-center justify-center rounded-[7px] bg-[#2A52BE] px-8 py-3 text-sm font-bold text-white transition hover:bg-[#244bb0]">{t('cta.button')}</Link>
          </div>
          <p className="mt-6 text-[10px] text-[#94A3B8] text-center">{t('cta.disclaimer')}</p>
        </form>
      </div>
    </section>
  )
}
