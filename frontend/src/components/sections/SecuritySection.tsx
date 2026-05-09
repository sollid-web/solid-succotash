'use client'

import { Shield, Lock, AlertTriangle, CheckSquare, Eye, Coins, TrendingUp, Layers } from 'lucide-react'
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
    icon: <Coins className="w-6 h-6" />,
    title: 'Blockchain-Verified Returns',
    description: 'Every profit we distribute is recorded permanently on the BNB blockchain as WOLV tokens — independently verifiable by anyone, anytime.',
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Chainlink Price Feeds',
    description: 'Our staking contracts use Chainlink oracles for real-time BNB/USD pricing — tamper-proof and decentralised.',
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: 'Audited Smart Contracts',
    description: 'WOLV token, Reward Pool, and Staking contracts are all verified on BSCScan. Source code is public and readable by anyone.',
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: '24/7 Monitoring',
    description: 'Our systems monitor platform activity around the clock to detect and respond to any unusual behaviour instantly.',
  },
]

const STANDARDS = [
  { label: '2FA',       value: 'Mandatory on all accounts',    color: 'from-indigo-600 to-indigo-700' },
  { label: 'SSL',       value: '256-bit encryption',           color: 'from-green-600 to-green-700' },
  { label: 'Chainlink', value: 'Tamper-proof price oracles',   color: 'from-blue-500 to-blue-700' },
  { label: 'BNB Chain', value: 'On-chain proof of returns',    color: 'from-yellow-500 to-yellow-600' },
]

const CONTRACTS = [
  { name: 'WOLV Token',       address: '0xe0167279aef7bf4ad313d261da82e8366822270c', label: 'Fixed supply · No mint · BEP20' },
  { name: 'Reward Pool',      address: '0xb233cf74b14abf9d9702d585c540030125599579', label: '48hr timelock · Treasury funded' },
  { name: 'Staking Contract', address: '0x4b62efee5695ed55cd362a0b818f4c5f9694322b', label: 'BNB & BUSD · Chainlink oracle' },
]

export default function SecuritySection() {
  return (
    <section id="security" className="py-24 bg-[#f8fafc] border-t border-[#E2E8F0] border-b">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-4">
          <span className="text-[11px] font-bold tracking-widest text-brand-primary uppercase">
            Security & Transparency
          </span>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#0F172A] mb-4" style={{ letterSpacing: '-0.02em' }}>
            Built for Trust. Verified on the Blockchain.
          </h2>
          <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
            WolvCapital combines institutional-grade security with fully audited smart contracts — so you never have to take our word for it.
          </p>
        </div>

        {/* Security feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {SECURITY_FEATURES.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm hover:shadow-lg hover:border-[#CBD5E1] transition"
            >
              <div className="w-12 h-12 bg-[#2A52BE] rounded-lg flex items-center justify-center text-white mb-4">
                {feature.icon}
              </div>
              <h3 className="font-bold text-[#0F172A] mb-2 text-[14px]">{feature.title}</h3>
              <p className="text-[#64748B] text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Standards */}
        <div className="bg-white rounded-xl p-12 border border-[#E2E8F0] mb-10">
          <h3 className="text-center text-2xl font-bold text-[#0F172A] mb-12">Security & Transparency Standards</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STANDARDS.map((standard, idx) => (
              <div key={idx} className="text-center">
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 bg-gradient-to-br ${standard.color}`}>
                  <span className="text-white font-bold text-xs">{standard.label}</span>
                </div>
                <p className="font-bold text-[#0F172A] mb-1 text-sm">{standard.label}</p>
                <p className="text-[#64748B] text-xs">{standard.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Verified contracts */}
        <div className="bg-[#0F172A] rounded-xl p-8 border border-[#1E3A5F]">
          <h3 className="text-white font-bold text-lg mb-2">Verified Smart Contracts</h3>
          <p className="text-[#64748B] text-sm mb-6">All contracts are publicly verified on BSCScan. Read the source code yourself.</p>
          <div className="flex flex-col gap-4">
            {CONTRACTS.map((c, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#1E3A5F]/40 rounded-lg border border-[#1E3A5F]">
                <div>
                  <div className="text-white font-semibold text-sm mb-1">{c.name}</div>
                  <div className="text-[#64748B] text-xs">{c.label}</div>
                </div>
                <a
                  href={`https://bscscan.com/address/${c.address}#code`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono text-[#00a896] hover:underline break-all"
                >
                  {c.address.slice(0, 10)}...{c.address.slice(-8)} ↗
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
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