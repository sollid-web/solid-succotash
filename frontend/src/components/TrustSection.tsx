"use client"

import Link from 'next/link'
import { ShieldCheck, Lock, UserCheck, Shield, Clock, FileCheck, AlertTriangle } from 'lucide-react'

export default function TrustSection() {
  return (
    <>
      {/* Trust & Compliance Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0b2f6b] mb-4">
              Built for Trust. Verified on the Blockchain.
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              WolvCapital combines institutional-grade security with fully audited smart contracts so you always have full visibility into your rewards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-all">
              <div className="flex items-center mb-4">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mr-4">
                  <UserCheck className="w-8 h-8 text-green-600" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold text-[#0b2f6b]">KYC Verified</h3>
              </div>
              <p className="text-gray-600">All investors undergo comprehensive Know-Your-Customer verification before account activation, ensuring regulatory compliance and investor protection.</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-all">
              <div className="flex items-center mb-4">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mr-4">
                  <ShieldCheck className="w-8 h-8 text-blue-600" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold text-[#0b2f6b]">AML Compliant</h3>
              </div>
              <p className="text-gray-600">Advanced Anti-Money Laundering systems monitor all transactions in real-time, identifying and preventing suspicious activity while maintaining customer privacy.</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-purple-500 hover:shadow-xl transition-all">
              <div className="flex items-center mb-4">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mr-4">
                  <Lock className="w-8 h-8 text-purple-600" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold text-[#0b2f6b]">SSL Encryption</h3>
              </div>
              <p className="text-gray-600">Military-grade SSL/TLS encryption protects all communications and financial data. Your account information is secured with multi-factor authentication.</p>
            </div>
          </div>

          {/* Security Standards */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 md:p-12 shadow-lg">
            <h3 className="text-2xl font-bold text-[#0b2f6b] mb-8 text-center">Security & Transparency Standards</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Shield,    color: 'indigo', label: '2FA',     sub: 'Two-Factor Auth' },
                { icon: Lock,      color: 'green',  label: '256-bit', sub: 'SSL Encryption' },
                { icon: Clock,     color: 'blue',   label: '24/7',    sub: 'Fraud Monitoring' },
                { icon: FileCheck, color: 'teal',   label: 'PCI-DSS', sub: 'Level 1 Certified' },
              ].map(({ icon: Icon, color, label, sub }) => (
                <div key={label} className="text-center">
                  <div className={`flex justify-center mb-3`}>
                    <div className={`w-16 h-16 bg-${color}-100 rounded-2xl flex items-center justify-center`}>
                      <Icon className={`w-9 h-9 text-${color}-600`} strokeWidth={2.5} />
                    </div>
                  </div>
                  <div className={`text-2xl font-bold text-${color}-700 mb-2`}>{label}</div>
                  <p className="text-sm text-gray-600">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Verified Smart Contracts */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 lg:px-8">
          <h3 className="text-xl font-bold text-[#0b2f6b] text-center mb-8">Verified Smart Contracts</h3>
          <div className="max-w-3xl mx-auto space-y-3">
            {[
              { name: 'WOLV Token',        addr: '0xe0167279aef7bf4ad313d261da82e8366822270c' },
              { name: 'Reward Pool',       addr: '0xb233cf74b14abf9d9702d585c540030125599579' },
              { name: 'Staking Contract',  addr: '0x4b62efee5695ed55cd362a0b818f4c5f9694322b' },
            ].map(c => (
              <div key={c.name} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <span className="font-semibold text-gray-800 mb-1 sm:mb-0">{c.name}</span>
                <a href={`https://bscscan.com/address/${c.addr}#code`} target="_blank" rel="noopener noreferrer"
                  className="font-mono text-xs text-blue-600 hover:text-blue-800 break-all">
                  {c.addr.slice(0, 10)}...{c.addr.slice(-8)} ↗
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '45,000+', label: 'Registered Investors',   sub: 'From 120+ countries' },
              { value: '99.9%',   label: 'Platform Uptime',        sub: 'Enterprise infrastructure' },
              { value: '0',       label: 'Security Breaches',      sub: 'Industry-leading record' },
              { value: 'Q3 2026', label: 'DEX Listing Target',     sub: 'PancakeSwap launch' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-4xl md:text-5xl font-extrabold text-[#0b2f6b] mb-2">{s.value}</div>
                <p className="text-gray-600 font-semibold">{s.label}</p>
                <p className="text-xs text-gray-500 mt-1">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Disclosure — bottom of page, less intrusive */}
      <section className="py-6 bg-amber-50 border-t-2 border-amber-300">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 max-w-4xl mx-auto">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" strokeWidth={2.5} />
            <p className="text-sm text-amber-900 flex-1">
              <strong>Important Disclosure:</strong> All investments carry risk, including potential loss of principal. WOLV is in pre-listing phase — token value is an internal reference price, not a market price. Please review our{' '}
              <Link href="/risk-disclosure" className="font-bold underline hover:no-underline">Risk Disclosure</Link>
              {' '}before investing.
            </p>
            <Link href="/risk-disclosure"
              className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors whitespace-nowrap flex-shrink-0">
              Read More →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
