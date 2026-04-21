'use client'

import { Shield, Lock, AlertTriangle, CheckSquare, Eye, FileCheck } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { IconBox } from '@/components/ui/IconBox'
import { Button } from '@/components/ui/Button'
import { useTranslation } from '@/components/TranslationProvider'

interface SecurityFeature {
  icon: React.ReactNode
  titleKey: string
  descriptionKey: string
}

const SECURITY_FEATURES: SecurityFeature[] = [
  {
    icon: <Shield className="w-6 h-6" />,
    titleKey: 'security.feature.kyc.title',
    descriptionKey: 'security.feature.kyc.description',
  },
  {
    icon: <AlertTriangle className="w-6 h-6" />,
    titleKey: 'security.feature.aml.title',
    descriptionKey: 'security.feature.aml.description',
  },
  {
    icon: <Lock className="w-6 h-6" />,
    titleKey: 'security.feature.ssl.title',
    descriptionKey: 'security.feature.ssl.description',
  },
  {
    icon: <CheckSquare className="w-6 h-6" />,
    titleKey: 'security.feature.2fa.title',
    descriptionKey: 'security.feature.2fa.description',
  },
  {
    icon: <Eye className="w-6 h-6" />,
    titleKey: 'security.feature.monitoring.title',
    descriptionKey: 'security.feature.monitoring.description',
  },
  {
    icon: <FileCheck className="w-6 h-6" />,
    titleKey: 'security.feature.pci.title',
    descriptionKey: 'security.feature.pci.description',
  },
]

const STANDARDS = [
  { label: '2FA', valueKey: 'security.standard.2fa', color: 'from-indigo-600 to-indigo-700' },
  { label: 'SSL', valueKey: 'security.standard.ssl', color: 'from-green-600 to-green-700' },
  { label: '24/7', valueKey: 'security.standard.monitoring', color: 'from-red-600 to-red-700' },
  { label: 'PCI-DSS', valueKey: 'security.standard.pci', color: 'from-blue-600 to-cyan-600' },
]

export default function SecuritySection() {
  const { t } = useTranslation()
  return (
    <section id="security" className="py-24 bg-[#f8fafc] border-t border-[#E2E8F0] border-b">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Eyebrow label */}
        <div className="text-center mb-4">
          <span className="text-[11px] font-bold tracking-widest text-brand-primary uppercase">
            {t('security.eyebrow')}
          </span>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#0F172A] mb-4" style={{ letterSpacing: '-0.02em' }}>{t('security.title')}</h2>
          <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
            {t('security.description')}
          </p>
        </div>

        {/* Security Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {SECURITY_FEATURES.map((feature, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-xl p-8 border border-[#E2E8F0] shadow-sm hover:shadow-lg hover:border-[#CBD5E1] transition"
            >
              <div className="flex gap-4 items-start mb-4">
                <div className="w-12 h-12 bg-[#2A52BE] rounded-lg flex items-center justify-center flex-shrink-0 text-white">
                  {feature.icon}
                </div>
              </div>
              <h3 className="font-bold text-[#0F172A] mb-2 text-[15px]">{t(feature.titleKey)}</h3>
              <p className="text-[#64748B] text-sm leading-relaxed">{t(feature.descriptionKey)}</p>
            </div>
          ))}
        </div>

        {/* Standards Box */}
        <div className="bg-white rounded-xl p-12 border border-[#E2E8F0]">
          <h3 className="text-center text-2xl font-bold text-white mb-12">{t('security.standards.heading')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STANDARDS.map((standard, idx) => (
              <div key={idx} className="text-center">
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 bg-gradient-to-br ${standard.color}`}>
                  <span className="text-white font-bold text-lg">{standard.label}</span>
                </div>
                <p className="font-bold text-[#0F172A] mb-1 text-sm">{standard.label}</p>
                <p className="text-[#64748B] text-xs">{t(standard.valueKey)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="/security"
            className="inline-flex items-center px-7 py-3 bg-[#f8fafc] text-[#0F172A] font-semibold rounded-md hover:bg-[#1E3A5F] transition"
          >
            {t('security.cta')}
          </a>
        </div>
      </div>
    </section>
  )
};