import Link from 'next/link'
import PublicLayout from '@/components/PublicLayout'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WOLV Token — WolvCapital Profit Token on BNB Smart Chain',
  description: 'WOLV is the native profit token of WolvCapital. Investors earn WOLV as verifiable on-chain proof of investment returns. Deployed and verified on BNB Smart Chain.',
  keywords: 'WOLV token, WolvCapital token, BNB chain token, investment profit token, blockchain rewards, WOLV BEP20',
  openGraph: {
    title: 'WOLV Token — WolvCapital Profit Token',
    description: 'Earn WOLV tokens as verifiable proof of your investment returns on WolvCapital.',
    url: 'https://wolvcapital.com/wolv-token',
    siteName: 'WolvCapital',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WOLV Token — WolvCapital Profit Token',
    description: 'Earn WOLV tokens as verifiable proof of your investment returns on WolvCapital.',
    images: ['/og-images/wolv-token-og.png'],
  },
}

const WOLV_CONTRACT = '0xe0167279aef7bf4ad313d261da82e8366822270c'
const POOL_CONTRACT = '0xb233cf74b14abf9d9702d585c540030125599579'
const STAKING_CONTRACT = '0x4b62efee5695ed55cd362a0b818f4c5f9694322b'

export default function WolvTokenPage() {
  return (
    <PublicLayout backgroundClassName="bg-hero-wolv overlay-dark-60">
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="pt-24 sm:pt-32 pb-12 sm:pb-16">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <span className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/30 rounded-full px-4 py-2 text-xs font-semibold text-teal-400 uppercase tracking-wider mb-6">
              <span className="w-2 h-2 bg-teal-400 rounded-full"></span>
              LIVE ON BNB CHAIN
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              WOLV — The Proof of Your Returns
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Every profit distributed on WolvCapital is recorded permanently on the BNB blockchain.
              Stake BNB or BUSD, earn WOLV rewards — verified by anyone, anywhere, anytime.
            </p>
          </div>
        </section>

        {/* Token Information */}
        <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">WOLV Token Details</h2>

              {/* Token Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {[
                  { label: 'Token Name', value: 'Wolv Capital' },
                  { label: 'Symbol', value: 'WOLV' },
                  { label: 'Network', value: 'BNB Smart Chain' },
                  { label: 'Max Supply', value: '1,000,000,000' },
                  { label: 'Token Standard', value: 'BEP-20' },
                  { label: 'Reward Pool', value: '1,000,000 WOLV' },
                ].map(stat => (
                  <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">{stat.label}</div>
                    <div className="text-lg font-bold text-teal-400 font-mono">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* How WOLV Works */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-12">
                <h3 className="text-xl font-bold text-white mb-6">How WOLV Works</h3>
                <div className="space-y-4 text-gray-300">
                  <p>
                    WOLV tokens are earned as verifiable proof of investment returns on WolvCapital.
                    When you stake BNB or BUSD, you receive WOLV tokens proportional to your investment performance.
                  </p>
                  <p>
                    Every WOLV token distribution is recorded on the BNB blockchain, providing immutable,
                    transparent proof of your investment returns that can be verified by anyone.
                  </p>
                  <p>
                    WOLV tokens can be held, traded, or used within the WolvCapital ecosystem for enhanced benefits.
                  </p>
                </div>
              </div>

              {/* Staking Plans */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-white text-center mb-8">Staking Plans — Earn WOLV Rewards</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: 'Pioneer', apy: '8%', days: '90', min: '$100', color: 'blue' },
                    { name: 'Vanguard', apy: '12%', days: '150', min: '$1,000', color: 'teal' },
                    { name: 'Horizon', apy: '18%', days: '180', min: '$5,000', color: 'purple' },
                    { name: 'Summit VIP', apy: '25%', days: '365', min: '$15,000', color: 'amber' },
                  ].map(plan => (
                    <div key={plan.name} className={`bg-white/5 border border-${plan.color}-400/30 rounded-xl p-6 text-center`}>
                      <div className="text-sm font-semibold text-white mb-2">{plan.name}</div>
                      <div className={`text-3xl font-bold text-${plan.color}-400 font-mono mb-2`}>{plan.apy}</div>
                      <div className="text-xs text-gray-400">APY • {plan.days} days • Min {plan.min}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Smart Contracts */}
              <div className="bg-white/5 border border-teal-400/20 rounded-xl p-8 mb-12">
                <h3 className="text-xl font-bold text-white mb-6">Verified Smart Contracts</h3>
                <div className="space-y-4">
                  {[
                    { name: 'WOLV Token Contract', address: WOLV_CONTRACT },
                    { name: 'Reward Pool Contract', address: POOL_CONTRACT },
                    { name: 'Staking Contract', address: STAKING_CONTRACT },
                  ].map(contract => (
                    <div key={contract.name} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-black/20 rounded-lg">
                      <span className="text-white font-medium mb-2 sm:mb-0">{contract.name}</span>
                      <a
                        href={`https://bscscan.com/address/${contract.address}#code`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-400 hover:text-teal-300 font-mono text-sm break-all"
                      >
                        {contract.address.slice(0, 10)}...{contract.address.slice(-8)} ↗
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/dashboard/stake"
                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold rounded-lg hover:from-teal-600 hover:to-blue-700 transition-all duration-200"
                  >
                    Start Staking WOLV →
                  </Link>
                  <Link
                    href="/plans"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-200"
                  >
                    View All Plans
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}
