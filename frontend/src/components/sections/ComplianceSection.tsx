'use client'

import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'

interface ComplianceItem {
  title: string
  description: string
  status: 'active' | 'pending' | 'in-progress'
  button?: boolean
}

const COMPLIANCE_ITEMS: ComplianceItem[] = [
  {
    title: 'FinCEN Registration (MSB)',
    description:
      'Registered as a Money Services Business with FinCEN, as required for U.S.-based crypto businesses handling fund transfers.',
    status: 'active',
  },
  {
    title: 'KYC / AML Program',
    description:
      'All investors undergo identity verification before account activation. Our AML program includes real-time transaction monitoring and a designated compliance officer.',
    status: 'active',
  },
  {
    title: 'State Money Transmitter Licenses',
    description:
      'Actively applying for MTLs in applicable U.S. states. Current onboarding is available only to residents of states where no Money Transmitter License is currently required or where a valid exemption applies. A full list of eligible states and applicable exemptions is available on our Legal page. Residents of unlisted states may not open accounts at this time.',
    status: 'in-progress',
    button: true,
  },
  {
    title: 'Transparent Fee & Conflict Disclosure',
    description:
      'WolvCapital maintains institutional-grade transparency standards, publicly disclosing our complete fee structure, business model, and conflict-of-interest policies aligned with SEC Form ADV requirements. Your investments are backed by comprehensive compliance documentation available through the SEC EDGAR system.',
    status: 'active',
  },
]

const BENEFITS = [
  'Identity verified before any funds accepted',
  'Funds held by a licensed institutional custodian — not WolvCapital directly',
  'All fees disclosed in writing before you invest',
  'No guaranteed or promised investment returns',
  'Audited monthly performance reports provided',
  'Withdrawal terms disclosed upfront — no hidden locks',
  'All transactions reviewed by our compliance team',
]

function StatusBadge({ status }: { status: 'active' | 'pending' | 'in-progress' }) {
  const badges = {
    active: 'bg-[#4F46E5] text-white border border-[#BFDBFE]',
    'in-progress': 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    pending: 'bg-gray-100 text-gray-800 border border-gray-300',
  }

  const labels = {
    active: '✓ Active',
    'in-progress': '⏳ In Progress',
    pending: '⏳ Pending',
  }

  return (
    <span className={`inline-block text-xs font-bold px-3 py-1 rounded-lg mt-3 ${badges[status]}`}>
      {labels[status]}
    </span>
  )
}

export default function ComplianceSection() {
  return (
    <section id="compliance" className="py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <span className="text-[11px] font-bold tracking-widest text-brand-primary uppercase block mb-4">
            Regulatory Status
          </span>
          <h2 className="text-4xl font-bold text-[#0F172A] mb-4" style={{ letterSpacing: '-0.02em' }}>Compliance &amp; regulation</h2>
          <p className="text-[#334155] text-lg max-w-2xl">
            We believe investors deserve complete transparency about who they're trusting with their capital.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Compliance Items */}
          <div className="lg:col-span-1">
            {COMPLIANCE_ITEMS.map((item, idx) => (
              <div key={idx} className="pb-8 border-b border-[#E2E8F0] last:border-b-0 last:pb-0">
                <h3 className="font-bold text-white mb-2 text-[15px]">{item.title}</h3>
                <p className="text-[#334155] text-sm leading-relaxed mb-4">{item.description}</p>
                <StatusBadge status={item.status} />
                {item.button && (
                  <a
                    href="/legal"
                    className="inline-block mt-3 px-4 py-2 border border-brand-primary text-brand-primary text-sm font-semibold rounded-md hover:bg-sky-50 transition"
                  >
                    View Eligible States →
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Right Column: Benefits */}
          <div className="lg:col-span-2 bg-brand-primary rounded-xl p-10 text-white relative overflow-hidden">
            <img
              src="/compliance-ecosystem.png"
              alt="WolvCapital Compliance Ecosystem — Capital secured through compliance"
              className="w-full h-auto object-cover rounded-lg mb-6"
            />
            
            <h3 className="text-2xl font-bold mb-4">What this means for you</h3>
            <p className="text-[#CBD5E1] mb-8">
              Our compliance commitments translate into concrete protections for your capital:
            </p>
            <ul className="space-y-4">
              {BENEFITS.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-brand-primary font-bold mt-1">✓</span>
                  <span className="text-[#E2E8F0] text-sm leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
