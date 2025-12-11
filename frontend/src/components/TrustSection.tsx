"use client"

import Image from 'next/image'
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
              Regulated & Compliant
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              WolvCapital operates under stringent regulatory oversight and compliance standards to protect investor capital and ensure transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Compliance Card 1 */}
            <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-all">
              <div className="flex items-center mb-4">
                <div className="relative w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <div className="absolute inset-0 bg-green-400 rounded-2xl blur-sm opacity-50"></div>
                  <UserCheck className="relative w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold text-[#0b2f6b]">KYC Verified</h3>
              </div>
              <p className="text-gray-600">All investors undergo comprehensive Know-Your-Customer verification before account activation, ensuring regulatory compliance and investor protection.</p>
            </div>

            {/* Compliance Card 2 */}
            <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-all">
              <div className="flex items-center mb-4">
                <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <div className="absolute inset-0 bg-blue-400 rounded-2xl blur-sm opacity-50"></div>
                  <ShieldCheck className="relative w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold text-[#0b2f6b]">AML Compliant</h3>
              </div>
              <p className="text-gray-600">Advanced Anti-Money Laundering systems monitor all transactions in real-time, identifying and preventing suspicious activity while maintaining customer privacy.</p>
            </div>

            {/* Compliance Card 3 */}
            <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-purple-500 hover:shadow-xl transition-all">
              <div className="flex items-center mb-4">
                <div className="relative w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <div className="absolute inset-0 bg-purple-400 rounded-2xl blur-sm opacity-50"></div>
                  <Lock className="relative w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold text-[#0b2f6b]">Data Encryption</h3>
              </div>
              <p className="text-gray-600">Military-grade SSL/TLS encryption protects all communications and financial data. Your account information is secured with multi-factor authentication.</p>
            </div>
          </div>

          {/* Security Standards Row */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 md:p-12 shadow-lg">
            <h3 className="text-2xl font-bold text-[#0b2f6b] mb-8 text-center">Security Standards</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="relative w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <div className="absolute inset-0 bg-indigo-400 rounded-2xl blur opacity-40"></div>
                    <Shield className="relative w-9 h-9 text-white" strokeWidth={2.5} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-indigo-700 mb-2">2FA</div>
                <p className="text-sm text-gray-700">Two-Factor Authentication</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <div className="absolute inset-0 bg-green-400 rounded-2xl blur opacity-40"></div>
                    <Lock className="relative w-9 h-9 text-white" strokeWidth={2.5} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-700 mb-2">256-bit</div>
                <p className="text-sm text-gray-700">SSL Encryption</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="relative w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <div className="absolute inset-0 bg-red-400 rounded-2xl blur opacity-40"></div>
                    <Clock className="relative w-9 h-9 text-white" strokeWidth={2.5} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-red-700 mb-2">24/7</div>
                <p className="text-sm text-gray-700">Fraud Monitoring</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <div className="absolute inset-0 bg-blue-400 rounded-2xl blur opacity-40"></div>
                    <FileCheck className="relative w-9 h-9 text-white" strokeWidth={2.5} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-700 mb-2">PCI-DSS</div>
                <p className="text-sm text-gray-700">Level 1 Certified</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Risk Disclosure Banner */}
      <section className="py-8 bg-gradient-to-br from-yellow-50 to-amber-50 border-t-4 border-yellow-400">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex gap-4">
              <div className="relative w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <div className="absolute inset-0 bg-yellow-400 rounded-xl blur-sm opacity-50"></div>
                <AlertTriangle className="relative w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-yellow-800 mb-2">Important Disclosure</h3>
              <p className="text-sm md:text-base text-yellow-900 mb-4">
                All investments carry risk, including potential loss of principal. Past performance does not guarantee future results. Digital asset investments are highly volatile and not suitable for all investors. Please review our{' '}
                <Link href="/risk-disclosure" className="font-bold underline hover:no-underline">
                  Risk Disclosure
                </Link>
                {' '}and{' '}
                <Link href="/terms-of-service" className="font-bold underline hover:no-underline">
                  Terms of Service
                </Link>
                {' '}before investing.
              </p>
              </div>
            </div>
            <Link
              href="/risk-disclosure"
              className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-colors whitespace-nowrap"
            >
              Read Full Disclosure
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-extrabold text-[#0b2f6b] mb-2">$2.5B+</div>
              <p className="text-gray-600 font-semibold">Assets Under Management</p>
              <p className="text-xs text-gray-500 mt-1">Secure digital assets</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-extrabold text-[#0b2f6b] mb-2">45K+</div>
              <p className="text-gray-600 font-semibold">Verified Investors</p>
              <p className="text-xs text-gray-500 mt-1">From 120+ countries</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-extrabold text-[#0b2f6b] mb-2">99.9%</div>
              <p className="text-gray-600 font-semibold">Platform Uptime</p>
              <p className="text-xs text-gray-500 mt-1">Enterprise-grade infrastructure</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-extrabold text-[#0b2f6b] mb-2">0</div>
              <p className="text-gray-600 font-semibold">Security Breaches</p>
              <p className="text-xs text-gray-500 mt-1">Industry-leading record</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
