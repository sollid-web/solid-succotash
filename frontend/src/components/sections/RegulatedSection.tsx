'use client'
import { CheckCircle2, Shield, Lock } from 'lucide-react'
import { useTranslation } from '@/components/TranslationProvider'

export default function RegulatedSection() {
  const { t } = useTranslation()

  const CARDS = [
    { id: 'kyc',        icon: <CheckCircle2 className="w-7 h-7" />, titleKey: 'regulated.kyc.title',        descKey: 'regulated.kyc.description' },
    { id: 'aml',        icon: <Shield       className="w-7 h-7" />, titleKey: 'regulated.aml.title',        descKey: 'regulated.aml.description' },
    { id: 'encryption', icon: <Lock         className="w-7 h-7" />, titleKey: 'regulated.encryption.title', descKey: 'regulated.encryption.description' },
  ]

  const STANDARDS = [
    { label: '2FA',     valueKey: 'regulated.standard.2fa' },
    { label: '256-bit', valueKey: 'regulated.standard.ssl' },
    { label: '24/7',    valueKey: 'regulated.standard.monitoring' },
    { label: 'PCI-DSS', valueKey: 'regulated.standard.pci' },
  ]

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#0F172A] mb-4">{t('regulated.title')}</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">{t('regulated.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {CARDS.map((card) => (
            <div key={card.id} className="bg-white rounded-2xl p-8 border-l-4 border-[#2A52BE] shadow-sm hover:shadow-md transition">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#2A52BE] to-[#1E3A8A] flex items-center justify-center text-white mb-4">
                {card.icon}
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">{t(card.titleKey)}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t(card.descKey)}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-[#eff6ff] to-[#e0e7ff] rounded-2xl p-10 lg:p-16">
          <h3 className="text-center text-2xl font-bold text-[#0F172A] mb-12">{t('regulated.standards.title')}</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STANDARDS.map((standard, idx) => (
              <div key={idx} className="text-center">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#2A52BE] to-[#1E3A8A] flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">{standard.label}</span>
                </div>
                <p className="font-bold text-[#2A52BE] mb-1">{standard.label}</p>
                <p className="text-gray-600 text-sm">{t(standard.valueKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
