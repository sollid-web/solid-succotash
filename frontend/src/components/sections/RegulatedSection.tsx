'use client'
import { CheckCircle2, Shield, Lock } from 'lucide-react'
import { useTranslation } from '@/i18n/TranslationProvider'
export default function RegulatedSection() {
  const { t } = useTranslation()
  const CARDS = [
    { id: 'green', icon: <CheckCircle2 className="w-7 h-7" />, titleKey: 'regulated.kyc.title', descKey: 'regulated.kyc.description', borderColor: 'border-l-4 border-green-500', iconBg: 'bg-gradient-to-br from-green-500 to-green-600' },
    { id: 'blue', icon: <Shield className="w-7 h-7" />, titleKey: 'regulated.aml.title', descKey: 'regulated.aml.description', borderColor: 'border-l-4 border-blue-500', iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-600' },
    { id: 'purple', icon: <Lock className="w-7 h-7" />, titleKey: 'regulated.encryption.title', descKey: 'regulated.encryption.description', borderColor: 'border-l-4 border-purple-500', iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600' },
  ]
  const STANDARDS = [
    { label: '2FA', valueKey: 'regulated.standard.2fa', color: 'bg-gradient-to-br from-indigo-600 to-indigo-700', textColor: 'text-indigo-700' },
    { label: '256-bit', valueKey: 'regulated.standard.ssl', color: 'bg-gradient-to-br from-green-600 to-green-700', textColor: 'text-[#4F46E5]' },
    { label: '24/7', valueKey: 'regulated.standard.monitoring', color: 'bg-gradient-to-br from-red-600 to-red-700', textColor: 'text-white' },
    { label: 'PCI-DSS', valueKey: 'regulated.standard.pci', color: 'bg-gradient-to-br from-blue-600 to-cyan-600', textColor: 'text-blue-700' },
  ]
  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#0b2f6b] mb-4">{t('regulated.title')}</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">{t('regulated.subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {CARDS.map((card) => (
            <div key={card.id} className={`bg-white rounded-2xl p-8 ${card.borderColor} shadow-sm hover:shadow-md transition`}>
              <div className={`w-14 h-14 rounded-xl ${card.iconBg} flex items-center justify-center text-white mb-4`}>{card.icon}</div>
              <h3 className="text-lg font-bold text-[#0b2f6b] mb-2">{t(card.titleKey)}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t(card.descKey)}</p>
            </div>
          ))}
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-10 lg:p-16">
          <h3 className="text-center text-2xl font-bold text-[#0b2f6b] mb-12">{t('regulated.standards.title')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STANDARDS.map((standard, idx) => (
              <div key={idx} className="text-center">
                <div className={`w-20 h-20 rounded-xl ${standard.color} flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-white font-bold text-2xl">{standard.label}</span>
                </div>
                <p className={`font-bold ${standard.textColor} mb-1`}>{standard.label}</p>
                <p className="text-gray-600 text-sm">{t(standard.valueKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
