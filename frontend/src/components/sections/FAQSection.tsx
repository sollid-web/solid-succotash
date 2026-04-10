'use client'

import { useRef, useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import Link from 'next/link'

interface FAQ {
  question: string
  answer: string
}

const FAQS: FAQ[] = [
  {
    question: 'How does WolvCapital generate returns for investors?',
    answer:
      'WolvCapital manages diversified digital asset portfolios through price appreciation, staking yields, and DeFi liquidity strategies. Returns are entirely market-dependent and not guaranteed. We charge a management fee regardless of performance, and a performance fee only on gains above the agreed benchmark.',
  },
  {
    question: 'Is WolvCapital regulated?',
    answer:
      'WolvCapital is pursuing SEC Investment Adviser registration and holds FinCEN Money Services Business registration. We are not yet a fully licensed investment adviser. We operate under KYC, AML, and PCI-DSS standards. Review our full regulatory status before investing and consider consulting an independent financial adviser.',
  },
  {
    question: 'Are my returns guaranteed?',
    answer:
      'No. WolvCapital does not guarantee any investment return. Digital assets are highly volatile and speculative. The value of your portfolio can fall significantly and you may lose some or all of your capital. Any projection on this website is for educational purposes only and does not represent a commitment of any kind.',
  },
  {
    question: 'How and when can I withdraw?',
    answer:
      'Withdrawal terms depend on the portfolio plan and are disclosed in full in your investment agreement before you commit any capital. Standard redemption windows and notice periods are set out clearly before you sign. There are no hidden withdrawal locks beyond what is disclosed upfront.',
  },
  {
    question: 'Who holds my assets?',
    answer:
      'Client assets are held by a licensed institutional digital asset custodian — not by WolvCapital directly. Your funds are segregated from company assets and protected in the event of any operational issue on our side. Custodian details are disclosed in your investment agreement.',
  },
  {
    question: 'What are the fees?',
    answer:
      'Management fees range from 1–2% of AUM annually, charged monthly. Performance fees of 20% apply only on gains above the benchmark on applicable plans. There are no hidden fees. The full fee schedule is provided in writing before account activation and is downloadable from your dashboard at any time.',
  },
  {
    question: 'Which countries does WolvCapital serve?',
    answer:
      'WolvCapital supports investors from 120+ countries, subject to local legal requirements. Residents of OFAC-sanctioned jurisdictions are not eligible. Please check our eligibility page for your specific country before signing up.',
  },
]

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <section id="faq" className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#0b2f6b] mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Get answers to common questions about investing with WolvCapital.
          </p>
        </div>

        {/* FAQ Cards */}
        <div className="max-w-4xl mx-auto space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border transition-all ${
                openIdx === idx
                  ? 'border-blue-600 bg-white shadow-lg'
                  : 'border-gray-200 bg-white hover:border-[#0b2f6b] hover:shadow-md'
              }`}
            >
              {/* Question Header */}
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-start gap-4 p-6 text-left hover:bg-gray-50 rounded-2xl"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mt-0.5">
                  <HelpCircle className="w-5 h-5 text-[#0b2f6b]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#0b2f6b] text-lg">{faq.question}</h3>
                </div>
                <div
                  className={`flex-shrink-0 text-blue-600 text-2xl transition-transform ${
                    openIdx === idx ? 'rotate-45' : ''
                  }`}
                >
                  +
                </div>
              </button>

              {/* Answer */}
              {openIdx === idx && (
                <div className="px-6 pb-6 pt-0 border-t border-gray-100">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/faq"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-sky-400 to-cyan-500 text-[#0b2f6b] font-bold rounded-full hover:opacity-90 transition"
          >
            View All FAQs →
          </Link>
        </div>
      </div>
    </section>
  )
}
