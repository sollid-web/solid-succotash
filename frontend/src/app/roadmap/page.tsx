
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Roadmap — WolvCapital | Platform Development Timeline",
  description:
    "WolvCapital's development roadmap — from initial platform launch to full Web3 integration, DEX listing, third-party audit, and institutional-grade DeFi infrastructure.",
};

const PHASES = [
  {
    phase: "Phase 1",
    title: "Platform Launch",
    period: "Q1 – Q2 2024",
    status: "completed",
    items: [
      "WolvCapital investment platform launched",
      "4 investment plans deployed (Pioneer, Vanguard, Horizon, Summit VIP)",
      "KYC & AML compliance integration",
      "User dashboard with portfolio tracking",
      "Referral system launched",
      "Multi-language support added",
    ],
  },
  {
    phase: "Phase 2",
    title: "WOLV Token Deployment",
    period: "Q4 2024 – Q1 2025",
    status: "completed",
    items: [
      "WOLV BEP-20 token deployed on BNB Smart Chain",
      "Fixed supply of 1,000,000,000 WOLV minted",
      "Token verified on BSCScan",
      "Wallet connect integration (RainbowKit + WagMi)",
      "WOLV wallet section added to investor dashboard",
      "Public /wolv-token page launched",
    ],
  },
  {
    phase: "Phase 3",
    title: "Web3 Staking Infrastructure",
    period: "Q2 2025",
    status: "completed",
    items: [
      "RewardPool contract deployed with 48hr timelock",
      "StakingContract deployed with Chainlink BNB/USD oracle",
      "All 3 contracts verified on BSCScan & Sourcify",
      "Reward pool funded with 1,000,000 WOLV",
      "Staking dashboard launched at /dashboard/stake",
      "WOLV Admin panel for treasury management",
      "BSCScan token info application submitted",
      "Tokenomics & security pages published",
    ],
  },
  {
    phase: "Phase 4",
    title: "Listings & Liquidity",
    period: "Q3 – Q4 2025",
    status: "active",
    items: [
      "BSCScan token profile approval",
      "PancakeSwap liquidity pool creation",
      "CoinGecko listing application",
      "CoinMarketCap listing application",
      "Blockaid false positive resolution",
      "DEX trading enabled for WOLV",
      "Initial market making strategy",
    ],
  },
  {
    phase: "Phase 5",
    title: "Audit & Compliance",
    period: "Q3 2026",
    status: "upcoming",
    items: [
      "Full third-party smart contract security audit",
      "Audit report published publicly",
      "Any recommended contract upgrades deployed",
      "ISO 27001 compliance review",
      "Regulatory compliance assessment",
      "Institutional investor onboarding framework",
    ],
  },
  {
    phase: "Phase 6",
    title: "DeFi Expansion",
    period: "Q4 2026 – 2027",
    status: "upcoming",
    items: [
      "Staking multiplier & vesting schedule upgrades",
      "Cross-chain bridge exploration (ETH, Polygon)",
      "WOLV governance token utility",
      "DAO voting for reward rate parameters",
      "Institutional-grade reporting dashboard",
      "API access for enterprise investors",
      "Mobile app launch",
    ],
  },
];

const STATUS_CONFIG = {
  completed: { label: "Completed",  bg: "bg-[#dcfce7]", text: "text-[#166534]", dot: "bg-[#16a34a]", border: "border-[#16a34a]" },
  active:    { label: "In Progress", bg: "bg-[#dbeafe]", text: "text-[#1E3A8A]", dot: "bg-[#2A52BE]", border: "border-[#2A52BE]" },
  upcoming:  { label: "Upcoming",   bg: "bg-[#f1f5f9]", text: "text-[#475569]", dot: "bg-[#94A3B8]", border: "border-[#CBD5E1]" },
};

export default function RoadmapPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-[#eff6ff] py-16 border-b border-[#dbeafe]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="text-xs font-bold tracking-widest uppercase text-[#2A52BE] block mb-4">Development Roadmap</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] mb-4" style={{ letterSpacing: '-0.02em' }}>
            Where We've Been.<br />Where We're Going.
          </h1>
          <p className="text-base sm:text-lg text-[#475569] max-w-3xl mx-auto mb-8">
            WolvCapital's development journey — from investment platform launch to full Web3 DeFi infrastructure. Every milestone is a commitment to transparency and investor trust.
          </p>

          {/* Progress summary */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { label: "Completed",   value: "3", color: "text-[#16a34a]" },
              { label: "In Progress", value: "1", color: "text-[#2A52BE]" },
              { label: "Upcoming",    value: "2", color: "text-[#94A3B8]" },
            ].map(s => (
              <div key={s.label} className="bg-white border border-[#bfdbfe] rounded-xl py-4 px-3 text-center">
                <div className={`text-2xl font-extrabold ${s.color} mb-1`}>{s.value}</div>
                <div className="text-xs text-[#64748B]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-[#e2e8f0] hidden sm:block" />

            <div className="flex flex-col gap-10">
              {PHASES.map((phase) => {
                const cfg = STATUS_CONFIG[phase.status as keyof typeof STATUS_CONFIG];
                return (
                  <div key={phase.phase} className="flex gap-6 relative">
                    {/* Dot */}
                    <div className="hidden sm:flex flex-shrink-0 flex-col items-center" style={{ width: '40px' }}>
                      <div className={`w-10 h-10 rounded-full border-2 ${cfg.border} bg-white flex items-center justify-center z-10 flex-shrink-0`}>
                        {phase.status === 'completed' && <span className="text-[#16a34a] text-lg">✓</span>}
                        {phase.status === 'active'    && <span className={`w-3 h-3 rounded-full ${cfg.dot} animate-pulse`} />}
                        {phase.status === 'upcoming'  && <span className={`w-3 h-3 rounded-full ${cfg.dot}`} />}
                      </div>
                    </div>

                    {/* Card */}
                    <div className={`flex-1 rounded-2xl border-2 ${cfg.border} bg-[#f8fafc] p-6`}>
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                        <div>
                          <div className="text-xs font-bold text-[#2A52BE] uppercase tracking-widest mb-1">{phase.phase}</div>
                          <h2 className="text-lg font-extrabold text-[#0F172A]" style={{ letterSpacing: '-0.02em' }}>{phase.title}</h2>
                          <div className="text-sm text-[#64748B] mt-1">{phase.period}</div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text}`}>
                          {cfg.label}
                        </span>
                      </div>

                      <ul className="space-y-2">
                        {phase.items.map(item => (
                          <li key={item} className="flex items-start gap-3 text-sm text-[#475569]">
                            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                            <span className={phase.status === 'completed' ? 'line-through text-[#94A3B8]' : ''}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#eff6ff] border-t border-[#dbeafe]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-extrabold text-[#0F172A] mb-3" style={{ letterSpacing: '-0.02em' }}>
            Built for the long term
          </h2>
          <p className="text-[#475569] text-sm max-w-xl mx-auto mb-8">
            Every phase of our roadmap is designed to increase transparency, investor trust, and platform utility. Join WolvCapital and grow with us.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/dashboard/stake" className="inline-flex items-center justify-center rounded-[7px] px-6 py-3 text-sm font-bold bg-[#2A52BE] text-white hover:bg-[#244bb0] transition">
              Start Staking →
            </Link>
            <Link href="/tokenomics" className="inline-flex items-center justify-center rounded-[7px] px-6 py-3 text-sm font-bold border border-[#2A52BE] text-[#2A52BE] hover:bg-[#eff6ff] transition">
              View Tokenomics
            </Link>
            <Link href="/wolv-token" className="inline-flex items-center justify-center rounded-[7px] px-6 py-3 text-sm font-bold border border-[#CBD5E1] text-[#475569] hover:bg-[#f8fafc] transition">
              WOLV Token
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
