'use client'

import { useState } from 'react'
import { HelpCircle } from 'lucide-react'
import Link from 'next/link'

interface FAQ {
  question: string
  answer: string
}

const FAQS: FAQ[] = [
  {
    question: 'How does WolvCapital generate returns for investors?',
    answer: 'WolvCapital manages diversified digital asset portfolios through price appreciation, staking yields, and DeFi liquidity strategies. Returns are entirely market-dependent and not guaranteed. We charge a management fee regardless of performance, and a performance fee only on gains above the agreed benchmark (tracked against the Bloomberg Crypto Index for public plans). Returns vary by market conditions and strategy.',
  },
  {
    question: 'Is WolvCapital regulated?',
    answer: 'WolvCapital operates under SEC exemptions: Section 203(m) for non-U.S. clients and Section 203(l) for pooled investments, and holds FinCEN Money Services Business registration. We are not yet registered as an investment adviser. By investing, you acknowledge this status. We operate under KYC, AML, and PCI-DSS standards. Check sec.gov for our current status or contact legal@wolvcapital.com for detailed regulatory documentation.',
  },
  {
    question: 'Are my returns guaranteed?',
    answer: 'No. WolvCapital does not guarantee any investment return. Digital assets are highly volatile and speculative. The value of your portfolio can fall significantly and you may lose some or all of your capital. Past performance does not indicate future results. Any projections on this website are for educational purposes only and do not represent a commitment of any kind.',
  },
  {
    question: 'How and when can I withdraw?',
    answer: 'Withdrawal terms vary by plan: Pioneer (90 days), Vanguard (150 days), Horizon (180 days), and Summit (365 days). Funds are locked during your contract term. Once the term ends, you may request withdrawal and funds return within 5 business days. Redemptions are processed at net portfolio value at the time of redemption. Early withdrawal requests are not permitted except under exceptional circumstances.',
  },
  {
    question: 'What are term lengths and exit fees?',
    answer: 'Each plan has a minimum holding period (term length). Pioneer is 90 days, Vanguard 150 days, Horizon 180 days, and Summit 365 days. Your funds are locked during this period and you cannot withdraw without penalty. Early withdrawals incur an exit fee (Pioneer 2%, Vanguard 2.5%, Horizon 3%, Summit 3.5%), which is deducted from your capital. At the end of your term, your account automatically continues on a rolling basis (monthly for Pioneer, Vanguard, and Horizon, quarterly for Summit) unless you withdraw or switch plans. You will receive notification 7-14 days before your term expires so you can decide whether to continue, withdraw, or restart.',
  },
  {
    question: 'Who holds my assets?',
    answer: 'Client assets are held by Coinbase Custody, a licensed institutional digital asset custodian. Your funds are segregated from WolvCapital company assets and protected in the event of any operational issue on our side. Custody terms and insurance coverage are disclosed in your investment agreement. Custodian details and proof of custody are available on your dashboard.',
  },
  {
    question: 'What are the fees?',
    answer: 'Management fees range from 1-2% of AUM annually (Pioneer 1%, Vanguard 1.25%, Horizon 1.5%, Summit 2%), charged monthly. Performance fees of 20% apply only on gains exceeding the Bloomberg Crypto Index on applicable plans. There are no hidden fees. The full fee schedule and performance fee benchmark are provided in writing before account activation.',
  },
  {
    question: 'Which countries does WolvCapital serve?',
    answer: 'WolvCapital supports investors from 120+ countries, subject to local legal requirements. Residents of OFAC-sanctioned jurisdictions are not eligible. Virtual card services are available in the U.S., UK, EU, and select Asian markets. Physical cards are available in the U.S. only. Check our eligibility page for your specific country before signing up.',
  },
  {
    question: 'How are taxes handled?',
    answer: 'WolvCapital generates quarterly tax reports (Forms K-1 for U.S. investors) detailing realized gains, losses, and staking income. Reports are downloadable from your dashboard. You are responsible for filing and paying taxes on your gains under the requirements of your local tax laws. Consult a tax professional regarding your specific tax obligations. Digital asset tax treatment varies by country.',
  },
  {
    question: 'What happens to my funds if WolvCapital shuts down?',
    answer: 'Your assets are held by Coinbase Custody and are separate from WolvCapital company assets. In the event of any WolvCapital operational issue, your funds remain protected with the custodian. Withdrawal rights are preserved and enforced through your custody agreement. Our insurance coverage through Coinbase Custody covers custodial holdings. Full details are in your investment agreement.',
  },
  {
    question: 'How is the performance benchmark calculated?',
    answer: 'Performance fees are calculated against the Bloomberg Crypto Index, a market-cap-weighted basket of major cryptocurrencies. For custom plans (Summit), the benchmark is negotiated individually. Calculations are audited quarterly by Deloitte LLP. Performance reports showing benchmark comparison, fees charged, and net returns are provided monthly and available in your dashboard.',
  },
]

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Eyebrow label */}
        <div className="text-center mb-4">
          <span className="text-[11px] font-bold tracking-widest text-brand-primary uppercase">
            Support
          </span>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#0F172A] mb-4" style={{ letterSpacing: '-0.02em' }}>Frequently Asked Questions</h2>
          <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
            Get answers to common questions about investing with WolvCapital.
          </p>
        </div>

        {/* FAQ Cards */}
        <div className="max-w-4xl mx-auto space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className={`rounded-xl border transition-all ${
                openIdx === idx
                  ? 'border-brand-primary bg-white shadow-lg'
                  : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:shadow-md'
              }`}
            >
              {/* Question Header */}
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-start gap-4 p-6 text-left hover:bg-gray-50 rounded-xl"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-[#EFF6FF] rounded-lg flex items-center justify-center mt-0.5">
                  <HelpCircle className="w-5 h-5 text-[#0F172A]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#0F172A] text-[15px]">{faq.question}</h3>
                </div>
                <div
                  className={`flex-shrink-0 text-brand-primary text-2xl transition-transform ${
                    openIdx === idx ? 'rotate-45' : ''
                  }`}
                >
                  +
                </div>
              </button>

              {/* Answer */}
              {openIdx === idx && (
                <div className="px-6 pb-6 pt-0 border-t border-[#F1F5F9]">
                  <p className="text-[#64748B] leading-relaxed text-sm">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/faq"
            className="inline-flex items-center px-8 py-3 bg-[#e2f5ff] text-[#0F172A] font-semibold rounded-md hover:bg-[#1E3A5F] transition"
          >
            View All FAQs →
          </Link>
        </div>
      </div>
    </section>
  )
}
