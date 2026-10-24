import Link from 'next/link'
import PublicLayout from '@/components/PublicLayout'
import { generateOgMetadata } from '@/lib/og-metadata'
import WolvPriceStat from '@/components/WolvPriceStat'
import TokenOrb from '@/components/web3/TokenOrb'
import Reveal from '@/components/web3/Reveal'
import GlassCard from '@/components/web3/GlassCard'
import ContractRow from '@/components/web3/ContractRow'
import LiveChainPanel from '@/components/web3/LiveChainPanel'
import AddWolvToWallet from '@/components/web3/AddWolvToWallet'

const WOLV_CONTRACT = '0xe0167279aef7bf4ad313d261da82e8366822270c'
const POOL_CONTRACT  = '0x7310f3e07627ce98246973e068bf2ff294f84e5f'
const STAKING_CONTRACT = '0x7cd22f3c08b4195225da7d043cbe00da118d31ec'

export const metadata = {
title: 'WOLV Token — Public BNB Smart Chain Data',
  description:
    'Review WOLV token data, public contract references, current supply information, and risk disclosures on BNB Smart Chain.',
  alternates: {
    canonical: 'https://www.wolvcapital.com/wolv-token',
  },
  openGraph: {
    title: 'WOLV Token — Public BNB Smart Chain Data',
    description: 'Review public WOLV token data and contract references on BNB Smart Chain.',
    url: 'https://www.wolvcapital.com/wolv-token',
    siteName: 'WolvCapital',
    images: [
      {
        url: 'https://www.wolvcapital.com/wolv-token-og.png', // Suggest using a stylized image of the WOLV logo here
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
    title: 'WOLV Token — Public BNB Smart Chain Data',
    description: 'Review public WOLV token data and contract references on BNB Smart Chain.',
  },
};
export default function WolvTokenPage() {
  return (
    <PublicLayout backgroundClassName="bg-transparent">
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
            <span className="glass inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-8 text-teal-300" style={{ borderRadius: 9999 }}>
              <span className="live-dot" />
              Live on BNB Chain
            </span>

            {/* Token orb */}
            <div className="flex justify-center mb-8"><TokenOrb size={200} /></div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.05] tracking-tight">
              WOLV Token
              <span className="block mt-2" style={{
                background: 'linear-gradient(135deg, #00c9b1 0%, #7cc7ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                On-Chain Token Records
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10">
              Token transfers and other public blockchain activity can be viewed on a block explorer. Public records do not prove profit, ownership, safety, or future value.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <a
                href={`https://pancakeswap.finance/swap?outputCurrency=${WOLV_CONTRACT}`}
                target="_blank" rel="noopener noreferrer"
                className="btn-glow">
                View WOLV market reference
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a href={`https://bscscan.com/token/${WOLV_CONTRACT}`}
                target="_blank" rel="noopener noreferrer"
                className="btn-glass">
                View on BSCScan
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <a href={`https://dexscreener.com/bsc/${WOLV_CONTRACT}`}
                target="_blank" rel="noopener noreferrer"
                className="btn-glass">
                📊 Live Chart
              </a>
              <AddWolvToWallet />
            </div>

            {/* Live on-chain data */}
            <div className="max-w-5xl mx-auto mb-10 text-left"><LiveChainPanel /></div>

            {/* Key stats bar */}
            <div className="glass max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px">
              {[
                { label: 'Max Supply',       value: '1,000,000,000', sub: 'WOLV — BSCScan reference' },
                { label: 'Token Standard',  value: 'BEP-20',        sub: 'BNB Smart Chain' },
                { label: 'Reward Allocation', value: '600,000,000',   sub: 'WOLV — published allocation' },
              ].map((stat, i) => (
                <div key={i} className="px-6 py-6 text-center"
                  style={{ background: 'transparent' }}>
                  <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">{stat.label}</div>
                  <div className="text-xl font-extrabold mb-1" style={{ color: '#00c9b1' }}>{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.sub}</div>
                </div>
              ))}
              <WolvPriceStat contractAddress={WOLV_CONTRACT} />
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
        <section className="py-16">
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
                    WOLV is a BEP-20 token on BNB Smart Chain. Staking terms, lock periods, fees, and reward outcomes are subject to the current platform terms and smart-contract state.
                  </p>
                  <p>
                    Every WOLV distribution is recorded on BNB Smart Chain — immutable, transparent,
                    and verifiable by anyone on BSCScan at any time using your wallet address.
                  </p>
                  <p>
                    Market availability and liquidity can change. Review the pair, price impact, liquidity, contract address, and transaction details independently before trading.
                  </p>
                </div>
              </div>

              {/* DEX Live Section */}
              <div className="bg-teal-500/10 border border-teal-500/30 rounded-xl p-8 mb-12">
                <h3 className="text-xl font-bold text-teal-400 mb-4">WOLV Market Reference</h3>
                <div className="space-y-3 text-gray-300">
                  <p>WOLV market information and DEX availability can change. Review the pair, liquidity, price impact, contract address, and transaction details independently before trading.</p>
                  <p>Track live price, chart, and trading volume on <a href="https://dexscreener.com/bsc/0xe0167279aef7bf4ad313d261da82e8366822270c" target="_blank" rel="noopener noreferrer" className="text-teal-400 underline">DEXScreener</a> and <a href="https://www.dextools.io/app/en/bnb/pair-explorer/0xe0167279aef7bf4ad313d261da82e8366822270c" target="_blank" rel="noopener noreferrer" className="text-teal-400 underline">DEXTools</a>. Contract address and public holder data are available on BSCScan.</p>
                  <div className="pt-2">
                    <a
                      href="https://pancakeswap.finance/swap?outputCurrency=0xe0167279aef7bf4ad313d261da82e8366822270c"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm"
                      style={{ background: 'linear-gradient(135deg, #00a896, #2A52BE)' }}
                    >
                      View WOLV market reference →
                    </a>
                  </div>
                  <p className="text-yellow-300 text-sm font-medium pt-2">⚠️ Staking carries risk. WOLV market price is determined by supply and demand on DEX. Value may fluctuate significantly.</p>
                </div>
              </div>

              {/* Smart Contracts */}
              <Reveal className="mb-12">
                <GlassCard tilt={0} rim className="p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-white mb-4">Contract Addresses</h3>
                  <ContractRow name="WOLV Token Contract" address={WOLV_CONTRACT} href={`https://bscscan.com/token/${WOLV_CONTRACT}`} />
                  <ContractRow name="Reward Pool Contract" address={POOL_CONTRACT} href={`https://bscscan.com/address/${POOL_CONTRACT}#code`} />
                  <ContractRow name="Staking Contract" address={STAKING_CONTRACT} href={`https://bscscan.com/address/${STAKING_CONTRACT}#code`} />
                </GlassCard>
              </Reveal>

              {/* Call to Action */}
              <div className="text-center">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://pancakeswap.finance/swap?outputCurrency=0xe0167279aef7bf4ad313d261da82e8366822270c"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-glow"
                  >
                    View WOLV market reference →
                  </a>
                  <Link href="/accounts/signup"
                    className="btn-glass">
                    Start Staking →
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
