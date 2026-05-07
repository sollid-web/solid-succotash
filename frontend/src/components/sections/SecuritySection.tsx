'use client'

import { Shield, Lock, AlertTriangle, CheckSquare, Eye, FileCheck, Coins } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { useTranslation } from '@/components/TranslationProvider'

interface SecurityFeature {
  icon: React.ReactNode
  title: string
  description: string
}

const SECURITY_FEATURES: SecurityFeature[] = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'KYC Verification',
    description: 'Every investor is fully identity-verified before accessing any investment plan. No anonymous accounts, no exceptions.',
  },
  {
    icon: <AlertTriangle className="w-6 h-6" />,
    title: 'AML Compliance',
    description: 'Anti-money laundering protocols screen every transaction in real time, keeping your funds protected and compliant.',
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: 'SSL Encryption',
    description: 'Bank-grade 256-bit SSL encryption protects every connection and every piece of data you share with us.',
  },
  {
    icon: <CheckSquare className="w-6 h-6" />,
    title: 'Two-Factor Authentication',
    description: 'Mandatory 2FA on all accounts ensures only you can access your portfolio — even if your password is compromised.',
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: '24/7 Monitoring',
    description: 'Our systems monitor platform activity around the clock to detect and respond to any unusual behaviour instantly.',
  },
  {
    icon: <Coins className="w-6 h-6" />,
    title: 'Blockchain-Verified Returns',
    description: 'Every profit we distribute is recorded permanently on the BNB blockchain as WOLV tokens — independently verifiable by anyone, anytime.',
  },
]

const STANDARDS = [
  { label: '2FA', value: 'Mandatory on all accounts', color: 'from-indigo-600 to-indigo-700' },
  { label: 'SSL', value: '256-bit encryption', color: 'from-green-600 to-green-700' },
  { label: '24/7', value: 'Real-time monitoring', color: 'from-red-600 to-red-700' },
  { label: 'BNB Chain', value: 'On-chain proof of returns', color: 'from-yellow-500 to-yellow-600' },
]

export default function SecuritySection() {
  return (
    <section id="security" className="py-24 bg-[#f8fafc] border-t border-[#E2E8F0] border-b">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-4">
          <span className="text-[11px] font-bold tracking-widest text-brand-primary uppercase">
            Platform Security
          </span>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#0F172A] mb-4" style={{ letterSpacing: '-0.02em' }}>
            Built for Trust. Verified on the Blockchain.
          </h2>
          <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
            WolvCapital combines institutional-grade security with blockchain transparency — so you never have to take our word for it.
          </p>
        </div>

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
              <h3 className="font-bold text-[#0F172A] mb-2 text-[15px]">{feature.title}</h3>
              <p className="text-[#64748B] text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-12 border border-[#E2E8F0]">
          <h3 className="text-center text-2xl font-bold text-[#0F172A] mb-12">Security & Transparency Standards</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STANDARDS.map((standard, idx) => (
              <div key={idx} className="text-center">
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 bg-gradient-to-br ${standard.color}`}>
                  <span className="text-white font-bold text-sm">{standard.label}</span>
                </div>
                <p className="font-bold text-[#0F172A] mb-1 text-sm">{standard.label}</p>
                <p className="text-[#64748B] text-xs">{standard.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href="/security"
            className="inline-flex items-center px-7 py-3 bg-[#f8fafc] text-[#0F172A] font-semibold rounded-md hover:bg-[#1E3A5F] hover:text-white transition"
          >
            View Full Security Details
          </a>
        </div>
      </div>
    </section>
  )
}
