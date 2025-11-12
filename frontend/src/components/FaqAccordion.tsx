"use client";

import { useState } from 'react';

interface QAItem {
  q: string;
  a: string;
}

const faqs: QAItem[] = [
  {
    q: 'How are deposits processed?',
    a: 'Deposits are submitted in-app and manually verified by an admin. Once approved, your wallet balance is updated instantly. Typical review time is within business hours; off-hours may take longer.'
  },
  {
    q: 'How long do withdrawals take?',
    a: 'Withdrawals require manual review to prevent fraud and ensure balance availability. Most approved requests finalize the same business day; additional verification can extend timelines.'
  },
  {
    q: 'Are returns guaranteed?',
    a: 'No. Investment returns are not guaranteed. Plans publish target daily ROI ranges, but actual performance varies and all investments carry risk.'
  },
  {
    q: 'How is daily ROI paid?',
    a: 'Daily ROI is calculated per active investment and recorded as a pending deposit. Funds are credited to your wallet only after an admin approves each ROI transaction.'
  },
  {
    q: 'What are plan minimums and maximums?',
    a: 'Each plan has its own min/max amount. Refer to the Plans page for current thresholds and details before creating an investment.'
  },
  {
    q: 'Can I cancel an investment early?',
    a: 'Early termination policies vary by plan and may forfeit accrued ROI. Contact support before requesting any changes to an active investment.'
  },
  {
    q: 'What assets and payment methods are supported?',
    a: 'Crypto is supported for deposits and withdrawals. Supported networks and details are shown in your dashboard when creating or requesting a transaction.'
  },
  {
    q: 'What security and compliance controls are in place?',
    a: 'All financial operations require human approval. We maintain audit logs for admin actions and follow KYC/AML screening where applicable.'
  },
  {
    q: 'Are there any fees?',
    a: 'There are no hidden platform fees for deposits and withdrawals. Network or payment-rail fees may apply and are shown before you submit.'
  },
  {
    q: 'How can I get help?',
    a: 'You can contact support via email or 24/7 in-app chat. Most questions are resolved within one business day.'
  }
];

const testimonials = [
  { name: 'Alex R., USA', text: 'Support verified my deposit quickly and I saw funds in my wallet right after approval.' },
  { name: 'María G., ES', text: 'Clear timelines and transparent reviews. Withdrawal landed same day after a quick check.' },
  { name: 'D. Chen, SG', text: 'Daily ROI is logged consistently. I appreciate that every step requires a human sign-off.' },
];

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="w-full">
      {/* Testimonials */}
      <div className="mb-10 grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-gray-800">“{t.text}”</p>
            <p className="mt-3 text-sm font-semibold text-[#0b2f6b]">{t.name}</p>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
        {faqs.map((item, idx) => {
          const isOpen = open === idx;
          return (
            <div key={idx}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : idx)}
                className="flex w-full items-center justify-between p-5 text-left"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${idx}`}
              >
                <span className="text-lg font-semibold text-[#0b2f6b]">{item.q}</span>
                <svg className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z" clipRule="evenodd" />
                </svg>
              </button>
              <div id={`faq-panel-${idx}`} role="region" className={`px-5 pb-5 text-gray-700 ${isOpen ? 'block' : 'hidden'}`}>
                {item.a}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
