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
    <section id="security" className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#0b2f6b] mb-4">Security & Compliance Standards</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            WolvCapital implements a multilayered security framework to safeguard investor funds and sensitive information.
          </p>
        </div>

        {/* Security Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {SECURITY_FEATURES.map((feature, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex gap-4 items-start">
                <div className="w-14 h-14 bg-gradient-to-br from-[#0b2f6b] to-[#2563eb] rounded-xl flex items-center justify-center flex-shrink-0 text-white">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-bold text-[#0b2f6b] mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Standards Box */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-10">
          <h3 className="text-center text-2xl font-bold text-[#0b2f6b] mb-10">Security Standards</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STANDARDS.map((standard, idx) => (
              <div key={idx} className="text-center">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-3 bg-gradient-to-br ${standard.color}`}>
                  <span className="text-white font-bold text-lg">{standard.label}</span>
                </div>
                <p className="font-bold text-[#0b2f6b] mb-1">{standard.label}</p>
                <p className="text-gray-600 text-sm">{standard.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="/security"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-sky-400 to-cyan-500 text-[#0b2f6b] font-bold rounded-full hover:opacity-90 transition"
          >
            View Our Security Measures →
          </a>
        </div>
      </div>
    </section>
  )
}
