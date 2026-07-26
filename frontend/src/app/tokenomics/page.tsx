
import Link from "next/link";





const CONTRACTS = {
  token:   "0xe0167279aef7bf4ad313d261da82e8366822270c",
  pool:    "0xb233cf74b14abf9d9702d585c540030125599579",
  staking: "0x4b62efee5695ed55cd362a0b818f4c5f9694322b",
};

const DISTRIBUTION = [
  { label: "Investor Rewards",    pct: 60, amount: "600,000,000", color: "#2A52BE", desc: "Distributed to investors via staking rewards and profit distributions over the platform lifetime." },
  { label: "Treasury Reserve",    pct: 20, amount: "200,000,000", color: "#1E3A8A", desc: "Held in treasury for operational continuity, future reward pool top-ups, and platform development." },
  { label: "Liquidity Reserve",   pct: 10, amount: "100,000,000", color: "#3b82f6", desc: "Reserved for future DEX liquidity provision on PancakeSwap to enable open market trading." },
  { label: "Team & Development",  pct:  7, amount:  "70,000,000", color: "#60a5fa", desc: "Allocated to the founding team and ongoing development. Subject to 12-month vesting schedule." },
  { label: "Marketing & Growth",  pct:  3, amount:  "30,000,000", color: "#93c5fd", desc: "Reserved for partnerships, listings, community growth, and platform promotion." },
];

const PLANS = [
  { name: "Pioneer",    apy: "8%",  days: 90,  min: "$100",    exit: "2.0%", wolv: "~1,973 WOLV per $100k staked/year" },
  { name: "Vanguard",   apy: "12%", days: 150, min: "$1,000",  exit: "2.5%", wolv: "~2,959 WOLV per $100k staked/year" },
  { name: "Horizon",    apy: "18%", days: 180, min: "$5,000",  exit: "3.0%", wolv: "~4,438 WOLV per $100k staked/year" },
  { name: "Summit VIP", apy: "25%", days: 365, min: "$15,000", exit: "3.5%", wolv: "~25,000 WOLV per $100k staked/year" },
];

import LiveChainMetricsWrapper from "./LiveChainMetricsWrapper"
import { generateOgMetadata } from '@/lib/og-metadata'
export const metadata = generateOgMetadata('tokenomics')

export default function TokenomicsPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-[#eff6ff] py-16 border-b border-[#dbeafe]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="text-xs font-bold tracking-widest uppercase text-[#2A52BE] block mb-4">WOLV Tokenomics</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] mb-4" style={{ letterSpacing: '-0.02em' }}>
            Supply, Distribution & Reward Model
          </h1>
          <p className="text-base sm:text-lg text-[#475569] max-w-3xl mx-auto mb-8">
            WOLV has a fixed supply of 1 billion tokens, minted once at deployment on BNB Smart Chain. No additional tokens can ever be created. All distribution is governed by publicly verifiable smart contracts.
          </p>

          {/* Key stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Supply",    value: "1,000,000,000" },
              { label: "Token Standard",  value: "BEP-20" },
              { label: "Network",         value: "BNB Smart Chain" },
              { label: "1 WOLV =",        value: "$1.00 USD" },
            ].map(s => (
              <div key={s.label} className="bg-white border border-[#bfdbfe] rounded-xl px-4 py-5 text-center">
                <div className="text-xs text-[#64748B] uppercase tracking-widest mb-2">{s.label}</div>
                <div className="text-lg font-bold text-[#2A52BE] font-mono">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Distribution */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <LiveChainMetricsWrapper />

            <span className="text-xs font-bold tracking-widest uppercase text-[#2A52BE] block mb-3">Allocation</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]" style={{ letterSpacing: '-0.02em' }}>
              Token Distribution
            </h2>
          </div>

          {/* Visual bar */}
          <div className="flex h-6 rounded-full overflow-hidden mb-8 w-full">
            {DISTRIBUTION.map(d => (
              <div key={d.label} style={{ width: `${d.pct}%`, background: d.color }} title={`${d.label}: ${d.pct}%`} />
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            {DISTRIBUTION.map(d => (
              <div key={d.label} className="flex items-center gap-2 text-sm text-[#475569]">
                <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: d.color }} />
                {d.label} ({d.pct}%)
              </div>
            ))}
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {DISTRIBUTION.map(d => (
              <div key={d.label} className="rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: d.color }} />
                  <span className="font-bold text-[#0F172A] text-sm">{d.label}</span>
                  <span className="ml-auto font-bold text-[#2A52BE] text-sm">{d.pct}%</span>
                </div>
                <div className="font-mono text-xs text-[#64748B] mb-3">{d.amount} WOLV</div>
                <p className="text-xs text-[#475569] leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reward model */}
      <section className="py-16 bg-[#0F172A]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-[#2A52BE] block mb-3">Reward Mechanics</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
              How Rewards Are Calculated
            </h2>
            <p className="text-[#94A3B8] text-sm max-w-2xl mx-auto">
              Rewards are calculated pro-rata based on your USD stake value, chosen plan APY, and lock duration. The formula is publicly readable in the smart contract.
            </p>
          </div>

          {/* Formula */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 text-center">
            <div className="text-[#94A3B8] text-xs uppercase tracking-widest mb-4">Reward Formula (on-chain)</div>
            <div className="font-mono text-[#2A52BE] text-lg font-bold mb-2">
              WOLV Reward = (Stake USD × APY% × Lock Days) ÷ 365
            </div>
            <div className="text-[#64748B] text-xs">1 WOLV = $1.00 · APY expressed as basis points in contract · Result scaled to 18 decimals</div>
          </div>

          {/* Plan table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  {["Plan", "APY", "Lock Period", "Min Stake", "Exit Fee", "Example Yield"].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PLANS.map((p, i) => (
                  <tr key={p.name} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-white/3' : ''}`}>
                    <td className="py-4 px-4 font-semibold text-white">{p.name}</td>
                    <td className="py-4 px-4 font-bold text-[#2A52BE] font-mono">{p.apy}</td>
                    <td className="py-4 px-4 text-[#94A3B8]">{p.days} days</td>
                    <td className="py-4 px-4 text-[#94A3B8]">{p.min}</td>
                    <td className="py-4 px-4 text-[#94A3B8]">{p.exit}</td>
                    <td className="py-4 px-4 text-[#64748B] text-xs">{p.wolv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-[#2A52BE] block mb-3">Long-Term Model</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mb-4" style={{ letterSpacing: '-0.02em' }}>
              Sustainability & Supply Control
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {[
              { icon: "🔒", title: "Hard Capped Supply",      desc: "1 billion WOLV total — ever. The mint function does not exist in the contract. No inflation is possible." },
              { icon: "📊", title: "Reward Pool Transparency", desc: "The reward pool balance is publicly visible on BSCScan. Investors can verify available rewards before staking." },
              { icon: "⏱️", title: "48hr Withdrawal Timelock", desc: "Any treasury withdrawal from the reward pool is queued publicly 48 hours before execution — protecting investor funds." },
              { icon: "🔁", title: "Treasury Top-Ups",         desc: "WolvCapital periodically funds the reward pool from treasury reserves. All funding transactions are on-chain and verifiable." },
              { icon: "📈", title: "Sustainable APY Rates",    desc: "At maximum staking of $1M total, annual WOLV distribution is approximately 120,000 WOLV — less than 0.02% of total supply per year." },
              { icon: "🛡️", title: "Audit Scheduled",         desc: "Full third-party smart contract security audit is scheduled for Q3 2026. Source code is publicly readable on BSCScan now." },
            ].map(f => (
              <div key={f.title} className="rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] p-6">
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-[#0F172A] text-sm mb-2">{f.title}</h3>
                <p className="text-xs text-[#475569] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contract addresses */}
      <section className="py-16 bg-[#eff6ff] border-t border-[#dbeafe]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-bold tracking-widest uppercase text-[#2A52BE] block mb-3">Verified Contracts</span>
            <h2 className="text-2xl font-extrabold text-[#0F172A] mb-3" style={{ letterSpacing: '-0.02em' }}>Smart Contract Addresses</h2>
            <p className="text-[#475569] text-sm max-w-xl mx-auto">All contracts are open-source and verified on BSCScan. Click any address to view the source code.</p>
          </div>

          <div className="flex flex-col gap-4 mb-10">
            {[
              { name: "WOLV Token",       address: CONTRACTS.token,   desc: "Fixed supply · No mint · BEP-20",     url: `https://bscscan.com/address/${CONTRACTS.token}#code` },
              { name: "Reward Pool",      address: CONTRACTS.pool,    desc: "48hr timelock · Treasury funded",      url: `https://bscscan.com/address/${CONTRACTS.pool}#code` },
              { name: "Staking Contract", address: CONTRACTS.staking, desc: "Chainlink oracle · 4 staking plans",  url: `https://bscscan.com/address/${CONTRACTS.staking}#code` },
            ].map(c => (
              <div key={c.name} className="bg-white border border-[#bfdbfe] rounded-xl px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="font-semibold text-[#0F172A] text-sm mb-1">{c.name}</div>
                  <div className="text-[#64748B] text-xs mb-2">{c.desc}</div>
                  <div className="font-mono text-xs text-[#2A52BE] break-all">{c.address}</div>
                </div>
                <a href={c.url} target="_blank" rel="noopener noreferrer"
                  className="flex-shrink-0 px-4 py-2 rounded-lg bg-[#2A52BE] text-white text-xs font-semibold hover:bg-[#244bb0] transition text-center">
                  View on BSCScan ↗
                </a>
              </div>
            ))}
          </div>

          <div className="text-center flex gap-4 justify-center flex-wrap">
            <Link href="/dashboard/stake" className="inline-flex items-center justify-center rounded-[7px] px-6 py-3 text-sm font-bold bg-[#2A52BE] text-white hover:bg-[#244bb0] transition">
              Start Staking →
            </Link>
            <Link href="/wolv-token" className="inline-flex items-center justify-center rounded-[7px] px-6 py-3 text-sm font-bold border border-[#2A52BE] text-[#2A52BE] hover:bg-[#eff6ff] transition">
              WOLV Token Page
            </Link>
            <Link href="/security" className="inline-flex items-center justify-center rounded-[7px] px-6 py-3 text-sm font-bold border border-[#CBD5E1] text-[#475569] hover:bg-[#f8fafc] transition">
              Security Details
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}


