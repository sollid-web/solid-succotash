import Image from 'next/image'
import Link from 'next/link'
import { Shield, Lock, TrendingUp, Clock, CreditCard, HelpCircle, Users, FileCheck, Globe, Coins, Wallet, BarChart3 } from 'lucide-react'

export default function FAQPage(): JSX.Element {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') ?? 'https://wolvcapital.com'
  const canonicalUrl = `${baseUrl}/faq`

  const faqs = [
    // ── Account & Getting Started ──────────────────────────────────────────
    {
      icon: <Users className="w-6 h-6" />,
      color: "blue",
      category: "Getting Started",
      question: "How do I sign up?",
      answer: "Click 'Sign Up' in the header, provide a valid email and password, then verify your account via the confirmation email. KYC verification may be required before making deposits."
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      color: "green",
      category: "Getting Started",
      question: "What deposit methods are supported?",
      answer: "We accept major cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), USDT (TRC20/ERC20), and other supported digital assets. Full details appear on your deposit page once logged in."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      color: "purple",
      category: "Investment Plans",
      question: "What are the investment plans?",
      answer: "WolvCapital offers four managed investment plans: Pioneer ($100 min, 90 days), Vanguard ($1,000 min, 150 days), Horizon ($5,000 min, 180 days), and Summit VIP ($15,000 min, 365 days). Each plan has a fixed lock period and defined returns."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      color: "amber",
      category: "Withdrawals",
      question: "How long do withdrawals take?",
      answer: "Withdrawal processing typically takes 24–72 hours after approval. Profit withdrawals are available at the end of your active investment plan. Processing time depends on network conditions and verification requirements."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      color: "red",
      category: "Withdrawals",
      question: "Why are withdrawals manually reviewed?",
      answer: "Manual review prevents fraudulent or unauthorised transfers and protects the entire user base. Our compliance team verifies account ownership, transaction integrity, and AML/KYC requirements before approval."
    },
    {
      icon: <FileCheck className="w-6 h-6" />,
      color: "indigo",
      category: "Withdrawals",
      question: "Are there fees for withdrawals?",
      answer: "Network transaction fees apply depending on the blockchain used. Any additional platform fees are clearly disclosed before you confirm your withdrawal request. No hidden charges."
    },

    // ── WOLV Token ─────────────────────────────────────────────────────────
    {
      icon: <Coins className="w-6 h-6" />,
      color: "teal",
      category: "WOLV Token",
      question: "What is the WOLV token?",
      answer: "WOLV is WolvCapital's native BEP-20 profit token on BNB Smart Chain. It has a fixed supply of 1 billion tokens minted at deployment — no additional tokens can ever be created. 1 WOLV = $1 USD."
    },
    {
      icon: <Wallet className="w-6 h-6" />,
      color: "emerald",
      category: "WOLV Token",
      question: "How do I earn WOLV tokens?",
      answer: "Two ways: (1) Stake BNB or BUSD in our audited smart contracts to earn WOLV rewards at 8–25% APY based on your chosen plan. (2) Invest in a managed portfolio plan — when profits are distributed, WOLV is sent to your connected wallet as verifiable proof of earnings."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      color: "violet",
      category: "WOLV Token",
      question: "What is WOLV staking?",
      answer: "Staking lets you deposit BNB or BUSD into our on-chain smart contracts and earn WOLV rewards. Plans range from 90 to 365 days with APY of 8% to 25%. Rewards are calculated by the smart contract formula: (Stake USD × APY × Lock Days) ÷ 365."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      color: "blue",
      category: "WOLV Token",
      question: "Are the staking contracts safe?",
      answer: "All three contracts (WOLV Token, Reward Pool, Staking Contract) are publicly verified on BSCScan and Sourcify. The reward pool has a 48-hour timelock — no funds can be moved without advance on-chain notice. BNB pricing uses Chainlink oracles. A full third-party audit is scheduled for Q3 2026."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      color: "pink",
      category: "WOLV Token",
      question: "Can I exit a staking position early?",
      answer: "Yes. You can exit early at any time, but an exit fee applies to your principal: 2.0% (Pioneer), 2.5% (Vanguard), 3.0% (Horizon), or 3.5% (Summit VIP). No WOLV rewards are paid on early exits — only principal minus fee is returned."
    },
    {
      icon: <Coins className="w-6 h-6" />,
      color: "orange",
      category: "WOLV Token",
      question: "Where can I see the reward pool balance?",
      answer: "The reward pool is publicly visible on BSCScan at 0xb233cf74b14abf9d9702d585c540030125599579. Anyone can check the available WOLV balance before staking. The pool is funded periodically by the WolvCapital treasury."
    },

    // ── Security & Compliance ──────────────────────────────────────────────
    {
      icon: <Lock className="w-6 h-6" />,
      color: "cyan",
      category: "Security",
      question: "How is my account secured?",
      answer: "We use 256-bit SSL encryption, optional two-factor authentication (2FA), 24/7 fraud monitoring, and KYC/AML compliance. Smart contract funds are protected by a 48-hour timelock and Chainlink price oracles."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      color: "indigo",
      category: "Compliance",
      question: "Which countries are supported?",
      answer: "WolvCapital serves investors from 120+ countries worldwide. Certain jurisdictions with regulatory restrictions may not be supported. Check our Terms of Service for details."
    },
    {
      icon: <HelpCircle className="w-6 h-6" />,
      color: "purple",
      category: "Compliance",
      question: "Is WolvCapital regulated?",
      answer: "WolvCapital follows global compliance standards including KYC, AML, and PCI-DSS. Our smart contracts are publicly verifiable on BSCScan. Please review our Risk Disclosure and legal pages for complete information."
    },
    {
      icon: <Users className="w-6 h-6" />,
      color: "green",
      category: "Referrals",
      question: "How does the referral program work?",
      answer: "Share your unique referral link with friends. When they sign up and make an active investment, you earn commission rewards. All referral payouts are manually reviewed and require admin approval."
    },
    {
      icon: <HelpCircle className="w-6 h-6" />,
      color: "red",
      category: "Support",
      question: "How do I contact support?",
      answer: "Email support@mail.wolvcapital.com or use the contact form on our Contact page. Our support team is available 24/7 to assist with account issues, technical questions, or investment inquiries."
    },
  ]

  const colorClasses: Record<string, {bg: string, text: string, border: string}> = {
    blue:    { bg: "bg-blue-50",    text: "text-blue-600",    border: "border-blue-200" },
    green:   { bg: "bg-green-50",   text: "text-green-600",   border: "border-green-200" },
    purple:  { bg: "bg-purple-50",  text: "text-purple-600",  border: "border-purple-200" },
    red:     { bg: "bg-red-50",     text: "text-red-600",     border: "border-red-200" },
    amber:   { bg: "bg-amber-50",   text: "text-amber-600",   border: "border-amber-200" },
    indigo:  { bg: "bg-indigo-50",  text: "text-indigo-600",  border: "border-indigo-200" },
    teal:    { bg: "bg-teal-50",    text: "text-teal-600",    border: "border-teal-200" },
    pink:    { bg: "bg-pink-50",    text: "text-pink-600",    border: "border-pink-200" },
    orange:  { bg: "bg-orange-50",  text: "text-orange-600",  border: "border-orange-200" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
    violet:  { bg: "bg-violet-50",  text: "text-violet-600",  border: "border-violet-200" },
    cyan:    { bg: "bg-cyan-50",    text: "text-cyan-600",    border: "border-cyan-200" },
  }

  // Group by category
  const categories = [...new Set(faqs.map(f => f.category))]

  return (
    <div className="min-h-screen relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(f => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: { '@type': 'Answer', text: f.answer },
            })),
          }),
        }}
      />

      {/* Background */}
      <div className="fixed inset-0 z-0">
        <Image src="/images/legal/home-hero.png" alt="WolvCapital FAQ" fill priority className="object-cover object-center" quality={90} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/75 to-black/85" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen py-20 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Hero */}
          <div className="text-center mb-16">
            <Link href="/" className="inline-block mb-8">
              <Image src="/wolv-icon.svg" alt="WolvCapital" width={56} height={56} style={{ borderRadius: '50%' }} />
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-2xl mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl md:text-2xl text-white/80 drop-shadow-lg max-w-3xl mx-auto leading-relaxed">
              Everything you need to know about WolvCapital — investment plans, WOLV staking, security, and platform operations.
            </p>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2 justify-center mt-8">
              {categories.map(c => (
                <span key={c} className="px-4 py-2 rounded-full text-xs font-bold bg-white/10 border border-white/20 text-white">
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* FAQ by category */}
          {categories.map(cat => (
            <div key={cat} className="mb-12">
              <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#2A52BE] rounded-full inline-block" />
                {cat}
              </h2>
              <div className="grid md:grid-cols-2 gap-5">
                {faqs.filter(f => f.category === cat).map((faq, i) => {
                  const colors = colorClasses[faq.color]
                  return (
                    <div key={i} className={`backdrop-blur-xl bg-white/95 rounded-2xl shadow-xl p-6 border ${colors.border} hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]`}>
                      <div className="flex items-start gap-4 mb-3">
                        <div className={`${colors.bg} ${colors.text} p-3 rounded-xl flex-shrink-0`}>{faq.icon}</div>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight">{faq.question}</h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed ml-[60px] text-sm">{faq.answer}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {/* CTA */}
          <div className="backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20 text-center mt-8">
            <div className="w-16 h-16 bg-[#2A52BE] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <HelpCircle className="w-9 h-9 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Our support team is available 24/7 to help with account setup, investment inquiries, WOLV staking, or any platform assistance you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="inline-block bg-[#2A52BE] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#244bb0] transition">
                Contact Support
              </Link>
              <a href="mailto:support@mail.wolvcapital.com" className="inline-block bg-white border-2 border-[#2A52BE] text-[#2A52BE] px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-50 transition">
                Email Us
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="mt-8 backdrop-blur-xl bg-white/90 rounded-2xl shadow-xl p-6 border border-white/20">
            <p className="text-center text-gray-700 text-lg mb-4 font-semibold">Explore More Resources</p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { href: "/plans",          label: "Investment Plans" },
                { href: "/dashboard/stake", label: "WOLV Staking" },
                { href: "/wolv-token",     label: "WOLV Token" },
                { href: "/tokenomics",     label: "Tokenomics" },
                { href: "/roadmap",        label: "Roadmap" },
                { href: "/security",       label: "Security" },
                { href: "/how-it-works",   label: "How It Works" },
                { href: "/risk-disclosure", label: "Risk Disclosure" },
              ].map(l => (
                <Link key={l.href} href={l.href} className="text-[#2A52BE] hover:text-[#1E3A8A] font-medium underline text-sm">{l.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
