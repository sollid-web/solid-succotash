'use client'

import { CheckCircle2, Shield, Lock } from 'lucide-react'

const CARDS = [
  {
    id: 'green',
    icon: <CheckCircle2 className="w-7 h-7" />,
    title: 'KYC Verified',
    description:
      'All investors undergo comprehensive identity verification before account activation, ensuring regulatory compliance and investor protection.',
    borderColor: 'border-l-4 border-green-500',
    iconBg: 'bg-gradient-to-br from-green-500 to-green-600',
  },
  {
    id: 'blue',
    icon: <Shield className="w-7 h-7" />,
    title: 'AML Compliant',
    description:
      'Advanced Anti-Money Laundering systems monitor all transactions in real-time, identifying and preventing suspicious activity while maintaining customer privacy.',
    borderColor: 'border-l-4 border-blue-500',
    iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
  },
  {
    id: 'purple',
    icon: <Lock className="w-7 h-7" />,
    title: 'Data Encryption',
    description:
      'Military-grade SSL/TLS encryption protects all communications and financial data, secured with multi-factor authentication throughout.',
    borderColor: 'border-l-4 border-purple-500',
    iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
  },
]

const STANDARDS = [
  {
    label: '2FA',
    value: 'Two-Factor Authentication',
    color: 'bg-gradient-to-br from-indigo-600 to-indigo-700',
    textColor: 'text-indigo-700',
  },
  {
    label: '256-bit',
    value: 'SSL Encryption',
    color: 'bg-gradient-to-br from-green-600 to-green-700',
    textColor: 'text-[#4F46E5]',
  },
  {
    label: '24/7',
    value: 'Fraud Monitoring',
    color: 'bg-gradient-to-br from-red-600 to-red-700',
    textColor: 'text-white',
  },
  {
    label: 'PCI-DSS',
    value: 'Level 1 Certified',
    color: 'bg-gradient-to-br from-blue-600 to-cyan-600',
    textColor: 'text-blue-700',
  },
]

export default function RegulatedSection() {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#0b2f6b] mb-4">Regulated & Compliant</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            WolvCapital operates under stringent compliance standards to protect investor capital and ensure transparency.
          </p>
        </div>

        {/* Compliance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {CARDS.map((card) => (
            <div key={card.id} className={`bg-white rounded-2xl p-8 ${card.borderColor} shadow-sm hover:shadow-md transition`}>
              <div className={`w-14 h-14 rounded-xl ${card.iconBg} flex items-center justify-center text-white mb-4`}>
                {card.icon}
              </div>
              <h3 className="text-lg font-bold text-[#0b2f6b] mb-2">{card.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>

        {/* Standards Box */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-10 lg:p-16">
          <h3 className="text-center text-2xl font-bold text-[#0b2f6b] mb-12">Security Standards</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STANDARDS.map((standard, idx) => (
              <div key={idx} className="text-center">
                <div className={`w-20 h-20 rounded-xl ${standard.color} flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-white font-bold text-2xl">{standard.label}</span>
                </div>
                <p className={`font-bold ${standard.textColor} mb-1`}>{standard.label}</p>
                <p className="text-gray-600 text-sm">{standard.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
