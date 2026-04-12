'use client'

import { Shield, Lock, AlertTriangle, CheckSquare, Eye, FileCheck } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { IconBox } from '@/components/ui/IconBox'
import { Button } from '@/components/ui/Button'

interface SecurityFeature {
  icon: React.ReactNode
  title: string
  description: string
}

const SECURITY_FEATURES: SecurityFeature[] = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'KYC Verification',
    description:
      'Mandatory identity verification before activation prevents fraud, identity theft, and unauthorized account use.',
  },
  {
    icon: <AlertTriangle className="w-6 h-6" />,
    title: 'AML Compliance',
    description:
      'Real-time transaction monitoring detects suspicious activity. A human compliance team reviews all flagged cases before funds move.',
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: '256-Bit SSL Encryption',
    description:
      'All data between your browser and our servers uses bank-grade TLS/SSL encryption. Sensitive data is also encrypted at rest.',
  },
  {
    icon: <CheckSquare className="w-6 h-6" />,
    title: 'Two-Factor Authentication',
    description: 'All accounts require 2FA. New device logins trigger additional verification steps to prevent unauthorized access.',
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: '24/7 Fraud Monitoring',
    description:
      'Automated systems and our compliance team monitor account activity around the clock, flagging abnormal patterns before any funds move.',
  },
  {
    icon: <FileCheck className="w-6 h-6" />,
    title: 'PCI-DSS Level 1 Standards',
    description:
      'All payment operations meet the highest PCI-DSS benchmark. Investors receive audited monthly statements and annual third-party audit reports.',
  },
]

const STANDARDS = [
  { label: '2FA', value: 'Two-Factor Authentication', color: 'from-indigo-600 to-indigo-700' },
  { label: 'SSL', value: 'SSL Encryption', color: 'from-green-600 to-green-700' },
  { label: '24/7', value: 'Fraud Monitoring', color: 'from-red-600 to-red-700' },
  { label: 'PCI-DSS', value: 'Level 1 Certified', color: 'from-blue-600 to-cyan-600' },
]

export default function SecuritySection() {
  return (
    <section id="security" className="py-24 bg-[#f8fafc] border-t border-[#E2E8F0] border-b">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Eyebrow label */}
        <div className="text-center mb-4">
          <span className="text-[11px] font-bold tracking-widest text-brand-primary uppercase">
            Security
          </span>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#0F172A] mb-4" style={{ letterSpacing: '-0.02em' }}>Security &amp; Compliance Standards</h2>
          <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
            WolvCapital implements a multilayered security framework to safeguard investor funds and sensitive information.
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
                <div className="w-12 h-12 bg-[#f8fafc] rounded-lg flex items-center justify-center flex-shrink-0 text-[#1E3A5F]">
                  {feature.icon}
                </div>
              </div>
              <h3 className="font-bold text-[#0F172A] mb-2 text-[15px]">{feature.title}</h3>
              <p className="text-[#64748B] text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Standards Box */}
        <div className="bg-white rounded-xl p-12 border border-[#E2E8F0]">
          <h3 className="text-center text-2xl font-bold text-white mb-12">Security Standards</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STANDARDS.map((standard, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 bg-[#f8fafc]">
                  <span className="text-[#0F172A] font-bold text-lg">{standard.label}</span>
                </div>
                <p className="font-bold text-[#0F172A] mb-1 text-sm">{standard.label}</p>
                <p className="text-[#64748B] text-xs">{standard.value}</p>
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
            View Our Security Measures →
          </a>
        </div>
      </div>
    </section>
  )
};