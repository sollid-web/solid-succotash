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
    title: 'Account setup',
    description: 'Review the current account requirements before using any platform feature.',
  },
  {
    icon: <AlertTriangle className="w-6 h-6" />,
    title: 'Activity review',
    description: 'Account and transaction activity may be reviewed under the current platform rules and disclosures.',
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: 'HTTPS transport',
    description: 'Use the site over HTTPS and review the privacy and data-handling terms before submitting information.',
  },
  {
    icon: <CheckSquare className="w-6 h-6" />,
    title: 'Two-Factor Authentication',
    description: 'Optional authenticator-based 2FA is available to strengthen account access and withdrawal protection.',
  },
  {
    icon: <Coins className="w-6 h-6" />,
    title: 'On-Chain Reward Records',
    description: 'WOLV reward transactions can be checked on BNB Smart Chain using the published contract addresses. On-chain records do not guarantee returns or token value.',
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Contract data sources',
    description: 'Review the contract addresses and stated data-source references independently before relying on any displayed value.',
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: 'Public contract references',
    description: 'Contract addresses are provided for technical inspection. Public source visibility does not establish safety, audit completion, or absence of vulnerabilities.',
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: 'Activity information',
    description: 'Review available account and transaction information and contact support about unusual activity.',
  },
]

const STANDARDS = [
  { label: '2FA',       value: 'Optional authenticator 2FA',       color: 'from-indigo-600 to-indigo-700' },
  { label: 'HTTPS',     value: 'Transport security',           color: 'from-green-600 to-green-700' },
  { label: 'Data',      value: 'Review source references',      color: 'from-blue-500 to-blue-700' },
  { label: 'On-chain',  value: 'Public transaction data',      color: 'from-yellow-500 to-yellow-600' },
]

const CONTRACTS = [
  { name: 'WOLV Token',       address: '0xe0167279aef7bf4ad313d261da82e8366822270c', label: 'Fixed supply · No mint · BEP20' },
  { name: 'Reward Pool',      address: '0x7310f3e07627ce98246973e068bf2ff294f84e5f', label: '48hr timelock · Treasury funded' },
  { name: 'Staking Contract', address: '0x7cd22f3c08b4195225da7d043cbe00da118d31ec', label: 'BNB & BUSD · public contract reference' },
]

export default function SecuritySection() {
  return (
    <section id="security" className="py-24 bg-[#070B19] border-t border-white/[0.06] border-b border-white/[0.06]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-4">
          <span className="text-[11px] font-bold tracking-widest text-brand-primary uppercase">
            Security & Transparency
          </span>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#0F172A] mb-4" style={{ letterSpacing: '-0.02em' }}>
            Built for Transparency. Verify on the Blockchain.
          </h2>
          <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
            WolvCapital publishes selected account information and contract references for inspection. Public source visibility is not an independent audit or a safety guarantee.
          </p>
        </div>

        {/* Security feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {SECURITY_FEATURES.map((feature, idx) => (
            <div
              key={idx}
              className="rounded-xl p-6 border transition" style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(0,168,150,0.2)" }}
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
        <div className="rounded-xl p-12 border mb-10" style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(0,168,150,0.2)" }}>
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
          <h3 className="text-white font-bold text-lg mb-2">Public Contract References</h3>
          <p className="text-[#64748B] text-sm mb-6">Contract addresses are listed for independent inspection. Public source visibility is not an audit or safety guarantee.</p>
          <div className="flex flex-col gap-4">
            {CONTRACTS.map((c, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#1E3A5F]/40 rounded-lg border border-[#1E3A5F]">
                <div>
                  <div className="text-white font-semibold text-sm mb-1">{c.name}</div>
                  <div className="text-[#64748B] text-xs">{c.label}</div>
                </div>
                <a
                  href={c.name === 'Reward Pool' ? `https://bscscan.com/token/0xe0167279aef7bf4ad313d261da82e8366822270c?a=${c.address}` : `https://bscscan.com/address/${c.address}#code`}
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