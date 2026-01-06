"use client"

import React from "react"
import Image from 'next/image'
import Link from 'next/link'
import { Shield, Lock, TrendingUp, Clock, CreditCard, HelpCircle, Users, FileCheck, Globe } from 'lucide-react'

export default function FAQPage(): JSX.Element {
  const faqs = [
    {
      icon: <Users className="w-6 h-6" />,
      color: "blue",
      question: "How do I sign up?",
      answer: "Click 'Sign Up' in the header, provide a valid email and password, then verify your account via the confirmation email we send you. KYC verification may be required before making deposits."
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      color: "green",
      question: "What deposit methods are supported?",
      answer: "We accept major cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), USDT (TRC20/ERC20), and other supported digital assets. Full details appear on your deposit page once logged in."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      color: "purple",
      question: "How long does it take to receive ROI?",
      answer: "ROI is calculated daily based on your active investment plan (1.00%–2.00% daily depending on tier). Returns are credited automatically to your wallet balance according to your plan's schedule."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      color: "red",
      question: "Why are withdrawals manually reviewed?",
      answer: "Manual review prevents fraudulent or unauthorized transfers and protects the entire user base. Our compliance team verifies account ownership, transaction integrity, and AML/KYC requirements before approval."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      color: "amber",
      question: "How long do withdrawals take?",
      answer: "Withdrawal processing typically takes 24-72 hours after approval. Profit withdrawals are available at the end of your active investment plan. Processing time depends on network conditions and verification requirements."
    },
    {
      icon: <FileCheck className="w-6 h-6" />,
      color: "indigo",
      question: "Are there fees for withdrawals?",
      answer: "Network transaction fees apply depending on the blockchain used. Any additional platform fees are clearly disclosed before you confirm your withdrawal request. No hidden charges."
    },
    {
      icon: <Lock className="w-6 h-6" />,
      color: "teal",
      question: "How is my account secured?",
      answer: "We use 256-bit SSL encryption, two-factor authentication (2FA), 24/7 fraud monitoring, and compliance with PCI-DSS Level 1 standards to ensure maximum account protection."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      color: "pink",
      question: "Which countries are supported?",
      answer: "WolvCapital serves investors from 120+ countries worldwide. However, certain jurisdictions with regulatory restrictions may not be supported. Check our Terms of Service for details."
    },
    {
      icon: <HelpCircle className="w-6 h-6" />,
      color: "orange",
      question: "Is WolvCapital regulated?",
      answer: "WolvCapital follows global compliance standards including KYC, AML, and PCI-DSS, but is not a government-regulated financial institution. Please review our Risk Disclosure and legal pages for complete information."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      color: "emerald",
      question: "What are the minimum investment amounts?",
      answer: "Minimum investment starts at $100 for the Pioneer plan. Higher tiers (Vanguard, Horizon, Summit) have progressively higher minimums ranging from $1,000 to $15,000."
    },
    {
      icon: <Users className="w-6 h-6" />,
      color: "violet",
      question: "How does the referral program work?",
      answer: "Share your unique referral link with friends. When they sign up and make an active investment, you earn commission rewards. All referral payouts are manually reviewed and require admin approval."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      color: "cyan",
      question: "How do I contact support?",
      answer: "Email support@mail.wolvcapital.com or use the contact form on our Contact page. Our support team is available 24/7 to assist with account issues, technical questions, or investment inquiries."
    }
  ]

  const colorClasses: Record<string, {bg: string, text: string, border: string}> = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
    green: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
    purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
    red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
    indigo: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200" },
    teal: { bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-200" },
    pink: { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-200" },
    orange: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
    violet: { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-200" },
    cyan: { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-200" },
  }

  return (
    <div className="min-h-screen relative">
      {/* Full-page background hero image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/legal/home-hero.png"
          alt="WolvCapital FAQ - Frequently Asked Questions"
          fill
          priority
          className="object-cover object-center"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/75 to-black/85" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 min-h-screen py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Link href="/" className="inline-block mb-8">
              <Image src="/wolv-logo.svg" alt="WolvCapital" width={180} height={60} />
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-2xl mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl md:text-2xl text-white/95 drop-shadow-lg max-w-3xl mx-auto leading-relaxed">
              Everything you need to know about WolvCapital, investment plans, security, and platform operations.
            </p>
          </div>

          {/* FAQ Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {faqs.map((faq, index) => {
              const colors = colorClasses[faq.color]
              return (
                <div 
                  key={index}
                  className={`backdrop-blur-xl bg-white/95 rounded-2xl shadow-xl p-6 border ${colors.border} hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`${colors.bg} ${colors.text} p-3 rounded-xl flex-shrink-0`}>
                      {faq.icon}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 leading-tight">{faq.question}</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed ml-[60px]">{faq.answer}</p>
                </div>
              )
            })}
          </div>

          {/* CTA Section */}
          <div className="backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <HelpCircle className="w-9 h-9 text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
              <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                Our support team is available 24/7 to help with account setup, investment inquiries, security questions, or any platform assistance you need.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/contact"
                className="inline-block bg-gradient-to-r from-[#0b2f6b] via-[#2563eb] to-[#1d4ed8] text-white px-8 py-4 rounded-full text-lg font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Contact Support
              </Link>
              <a 
                href="mailto:support@mail.wolvcapital.com"
                className="inline-block bg-white border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-50 transition-all duration-300 hover:scale-105"
              >
                Email Us
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 backdrop-blur-xl bg-white/90 rounded-2xl shadow-xl p-6 border border-white/20">
            <p className="text-center text-gray-700 text-lg mb-4 font-semibold">Explore More Resources</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/plans" className="text-blue-600 hover:text-blue-700 font-medium underline">Investment Plans</Link>
              <Link href="/security" className="text-blue-600 hover:text-blue-700 font-medium underline">Security Details</Link>
              <Link href="/terms-of-service" className="text-blue-600 hover:text-blue-700 font-medium underline">Terms of Service</Link>
              <Link href="/risk-disclosure" className="text-blue-600 hover:text-blue-700 font-medium underline">Risk Disclosure</Link>
              <Link href="/how-it-works" className="text-blue-600 hover:text-blue-700 font-medium underline">How It Works</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
