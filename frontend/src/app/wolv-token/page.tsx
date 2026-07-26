import Link from 'next/link'
import PublicLayout from '@/components/PublicLayout'
import { generateOgMetadata } from '@/lib/og-metadata'

const WOLV_CONTRACT = '0xe0167279aef7bf4ad313d261da82e8366822270c'
const POOL_CONTRACT  = '0xb233cf74b14abf9d9702d585c540030125599579'
const STAKING_CONTRACT = '0x4b62efee5695ed55cd362a0b818f4c5f9694322b'

export const metadata = {
title: 'WOLV Token — The Native Asset of WolvCapital',
  description:
    'Discover the WOLV token, the utility token powering the WolvCapital ecosystem on the BNB Smart Chain. Explore tokenomics, use cases, and how to participate.',
  alternates: {
    canonical: 'https://wolvcapital.com/wolv-token',
  },
  openGraph: {
    title: 'WOLV Token — The Native Asset of WolvCapital',
    description: 'Explore the utility and tokenomics of the WOLV token on the BNB Smart Chain.',
    url: 'https://wolvcapital.com/wolv-token',
    siteName: 'WolvCapital',
    images: [
      {
        url: 'https://wolvcapital.com/wolv-token-og.png', // Suggest using a stylized image of the WOLV logo here
        width: 1200,
        height: 630,
        alt: 'WOLV Token Details',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WOLV Token — Powering WolvCapital',
    description: 'Explore the utility and tokenomics of the WOLV token on the BNB Smart Chain.',
  },
};
export default function WolvTokenPage() {
  return (
    <PublicLayout backgroundClassName="bg-hero-wolv overlay-dark-60">
      <div className="min-h-screen">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden pt-24 sm:pt-32 pb-20 sm:pb-28">

          {/* Ambient glow */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div style={{
              width: '700px', height: '700px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,168,150,0.13) 0%, rgba(42,82,190,0.10) 40%, transparent 70%)',
              filter: 'blur(40px)',
            }} />
          </div>
          <div className="pointer-events-none absolute top-0 left-1/4" style={{
            width: '400px', height: '400px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(42,82,190,0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }} />

          <div className="relative container mx-auto px-4 lg:px-8 text-center">

            {/* Live badge */}
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-8"
              style={{ background: 'rgba(0,168,150,0.15)', border: '1px solid rgba(0,168,150,0.35)', color: '#00c9b1' }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: '#00a896' }} />
                <span className="relative inline-flex rounded-full h-2 w-2"
                  style={{ background: '#00a896' }} />
              </span>
              Live on BNB Chain
            </span>

            {/* Token logo */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 rounded-full" style={{
                  background: 'radial-gradient(circle, rgba(0,168,150,0.3) 0%, transparent 70%)',
                  filter: 'blur(20px)',
                  transform: 'scale(1.4)',
                }} />
                <div className="relative w-24 h-24 rounded-full flex items-center justify-center text-4xl font-black text-white"
                  style={{
                    background: 'linear-gradient(135deg, #2A52BE 0%, #00a896 100%)',
                    boxShadow: '0 0 40px rgba(0,168,150,0.4), 0 0 80px rgba(42,82,190,0.2)',
                  }}>
                  W
                </div>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.05] tracking-tight">
              WOLV Token
              <span className="block mt-2" style={{
                background: 'linear-gradient(135deg, #00c9b1 0%, #7cc7ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Proof of Returns
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10">
              Every profit distributed on WolvCapital is recorded permanently on the BNB blockchain —
              verified by anyone, anywhere, anytime.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <Link href="/accounts/signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-sm transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #2A52BE 0%, #00a896 100%)',
                  boxShadow: '0 0 30px rgba(0,168,150,0.3)',
                }}>
                Start Staking
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a href={`https://bscscan.com/token/${WOLV_CONTRACT}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm transition-all hover:scale-105"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#e2e8f0',
                }}>
                View on BSCScan
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* Key stats bar */}
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {[
                { label: 'Total Supply',    value: '1,000,000,000', sub: 'WOLV — Fixed Forever' },
                { label: 'Token Standard',  value: 'BEP-20',        sub: 'BNB Smart Chain' },
                { label: 'Reward Pool',     value: '600,000,000',   sub: 'WOLV (60% Allocated)' },
                { label: 'Current Price',   value: '$1.00',         sub: 'Pre-listing reference' },
              ].map((stat, i) => (
                <div key={i} className="px-6 py-6 text-center"
                  style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(10px)' }}>
                  <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">{stat.label}</div>
                  <div className="text-xl font-extrabold mb-1" style={{ color: '#00c9b1' }}>{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* Contract address pill */}
            <div className="mt-8 inline-flex items-center gap-3 px-5 py-3 rounded-full text-xs font-mono"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#94a3b8',
              }}>
              <span className="text-gray-500">Contract:</span>
              <span className="text-teal-400 hidden sm:inline">{WOLV_CONTRACT}</span>
              <span className="text-teal-400 sm:hidden">{WOLV_CONTRACT.slice(0, 10)}...{WOLV_CONTRACT.slice(-8)}</span>
              <a href={`https://bscscan.com/token/${WOLV_CONTRACT}`}
                target="_blank" rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

          </div>
        </section>

        {/* ── Token Information ── */}
        <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">WOLV Token Details</h2>

              {/* Token Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {[
                  { label: 'Token Name',     value: 'Wolv Capital' },
                  { label: 'Symbol',         value: 'WOLV' },
                  { label: 'Network',        value: 'BNB Smart Chain' },
                  { label: 'Max Supply',     value: '1,000,000,000' },
                  { label: 'Token Standard', value: 'BEP-20' },
                  { label: 'Reward Pool',    value: '600,000,000 WOLV' },
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
                    When you stake BUSD, you receive WOLV tokens proportional to your investment performance.
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

              {/* Pre-Listing Value Notice */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-8 mb-12">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">⚠️ Pre-Listing Token Value</h3>
                <div className="space-y-3 text-gray-300">
                  <p>WOLV is currently in its <strong className="text-white">pre-listing phase</strong>. The $1 per WOLV value shown on the platform is an internal reference price set by WolvCapital — it is not yet determined by an open market.</p>
                  <p>WOLV rewards earned now are <strong className="text-white">not yet realisable as cash</strong> until WOLV is listed on a decentralised exchange such as PancakeSwap and a liquidity pool is established.</p>
                  <p>Once listed, the market price of WOLV will be determined by supply and demand. WolvCapital plans to provide initial liquidity to support price stability at launch. DEX listing is scheduled for Q3 2026.</p>
                  <p className="text-yellow-300 text-sm font-medium">⚠️ All investments carry risk. Token value after listing may differ from the pre-listing reference price.</p>
                </div>
              </div>

              {/* Staking Plans */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-white text-center mb-8">Staking Plans — Earn WOLV Rewards</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: 'Pioneer',    apy: '8%',  days: '90',  min: '$100',    color: 'blue' },
                    { name: 'Vanguard',   apy: '12%', days: '150', min: '$1,000',  color: 'teal' },
                    { name: 'Horizon',    apy: '18%', days: '180', min: '$5,000',  color: 'purple' },
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
                    { name: 'Staking Contract',     address: STAKING_CONTRACT },
                  ].map(contract => (
                    <div key={contract.name}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-black/20 rounded-lg">
                      <span className="text-white font-medium mb-2 sm:mb-0">{contract.name}</span>
                      <a
                        href={`https://bscscan.com/address/${contract.address}#code`}
                        target="_blank" rel="noopener noreferrer"
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
                  <Link href="/dashboard/stake"
                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold rounded-lg hover:from-teal-600 hover:to-blue-700 transition-all duration-200">
                    Start Staking WOLV →
                  </Link>
                  <Link href="/plans"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-200">
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
