import Link from 'next/link'
import Reveal from '@/components/web3/Reveal'
import GlassCard from '@/components/web3/GlassCard'
import ContractRow from '@/components/web3/ContractRow'
import LiveChainPanel from '@/components/web3/LiveChainPanel'
import AddWolvToWallet from '@/components/web3/AddWolvToWallet'
import { CONTRACTS } from '@/lib/contracts'

const FACTS = [
  { label: 'Token Name', value: 'Wolv Capital' },
  { label: 'Symbol', value: 'WOLV' },
  { label: 'Network', value: 'BNB Smart Chain' },
  { label: 'Max Supply', value: '1,000,000,000' },
  { label: 'Mint Function', value: 'None' },
  { label: 'Reward Pool', value: 'Live on BscScan' },
]

export default function WolvTokenSection() {
  return (
    <section id="wolv-token" className="relative px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-[1100px] space-y-12">
        <Reveal className="text-center">
          <span className="glass inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold tracking-[0.12em] text-teal-300" style={{ borderRadius: 9999 }}>
            <span className="live-dot" /> LIVE ON BNB CHAIN
          </span>
          <h2 className="mt-5 text-[clamp(28px,5vw,48px)] font-extrabold leading-[1.08] tracking-tight">
            <span className="text-gradient">WOLV — The Proof of Your Returns</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-base leading-7 text-white/55">
            Every profit distributed on WolvCapital is recorded permanently on the BNB blockchain. Stake BNB or BUSD, earn WOLV rewards — verified by anyone, anywhere, anytime.
          </p>
        </Reveal>

        <Reveal><LiveChainPanel /></Reveal>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {FACTS.map((f, i) => (
            <Reveal key={f.label} delay={i * 0.06}>
              <GlassCard className="p-5 text-center">
                <div className="mb-2 text-[11px] uppercase tracking-[0.14em] text-white/40">{f.label}</div>
                <div className="text-base font-bold text-teal-300" style={{ fontFamily: "'DM Mono', monospace" }}>{f.value}</div>
              </GlassCard>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <GlassCard tilt={0} className="p-6 sm:p-7">
            <div className="mb-3 text-xs uppercase tracking-[0.14em] text-white/40">Verified Smart Contracts</div>
            {CONTRACTS.map(c => <ContractRow key={c.key} name={c.name} address={c.address} href={c.href} />)}
          </GlassCard>
        </Reveal>

        <Reveal className="flex flex-wrap justify-center gap-3">
          <Link href="/dashboard/stake" className="btn-glow">Start Staking →</Link>
          <Link href="/wolv-token" className="btn-glass">Learn About WOLV</Link>
          <AddWolvToWallet />
        </Reveal>
      </div>
    </section>
  )
}
