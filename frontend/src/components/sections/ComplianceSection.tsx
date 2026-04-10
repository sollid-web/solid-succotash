'use client'

import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'

interface ComplianceItem {
  title: string
  description: string
  status: 'active' | 'pending' | 'in-progress'
}

const COMPLIANCE_ITEMS: ComplianceItem[] = [
  {
    title: 'SEC Investment Adviser Registration',
    description:
      'In the process of registering with the U.S. Securities and Exchange Commission. We will not manage client funds until registration is complete or applicable exemptions are confirmed.',
    status: 'in-progress',
  },
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
      'Actively applying for MTLs in applicable U.S. states. Current onboarding is limited to states where exemptions apply. Full list on our legal page.',
    status: 'in-progress',
  },
  {
    title: 'Form ADV Disclosure',
    description:
      'Upon SEC registration, WolvCapital will file Form ADV disclosing our business, fees, and conflicts of interest. This will be publicly accessible via the SEC EDGAR system.',
    status: 'pending',
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
    active: 'bg-green-100 text-green-800 border border-green-300',
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
    <section id="compliance" className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-blue-600 block mb-2">
            Regulatory Status
          </span>
          <h2 className="text-4xl font-bold text-[#0b2f6b] mb-4">Compliance & regulation</h2>
          <p className="text-gray-600 text-lg max-w-2xl">
            We believe investors deserve complete transparency about who they're trusting with their capital.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Compliance Items */}
          <div className="lg:col-span-1">
            {COMPLIANCE_ITEMS.map((item, idx) => (
              <div key={idx} className="pb-6 border-b border-gray-200 last:border-b-0">
                <h3 className="font-bold text-[#0b2f6b] mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-2">{item.description}</p>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>

          {/* Right Column: Benefits */}
          <div className="lg:col-span-2 bg-gradient-to-br from-[#0b2f6b] to-[#1d4ed8] rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">What this means for you</h3>
            <p className="text-blue-100 mb-6">
              Our compliance commitments translate into concrete protections for your capital:
            </p>
            <ul className="space-y-3">
              {BENEFITS.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-sky-400 flex-shrink-0 mt-0.5" />
                  <span className="text-blue-50 text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
