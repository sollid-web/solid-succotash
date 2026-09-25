import type { Metadata } from "next";
import Link from "next/link";

export const metadata = {
  title: 'Smart Contracts & Security — WolvCapital',
  description:
    'Review public contract addresses, source links, network information, and stated limitations for WOLV-related contracts on BNB Smart Chain.',
  alternates: {
    canonical: 'https://www.wolvcapital.com/smart-contracts',
  },
  openGraph: {
    title: 'WolvCapital Contract References',
    description: 'Review blockchain contract references and stated technical limitations for the WolvCapital platform.',
    url: 'https://www.wolvcapital.com/smart-contracts',
    siteName: 'WolvCapital',
    images: [
      {
        url: 'https://www.wolvcapital.com/og-contracts.png', // Suggest using an image featuring code/nodes or a security shield
        width: 1200,
        height: 630,
        alt: 'WolvCapital Smart Contract Security',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WolvCapital Contract References',
    description: 'Review blockchain contract references and stated technical limitations for our platform.',
  },
};

const CONTRACTS = [
  {
    name: "WOLV Token",
    symbol: "WOLV",
    address: "0xe0167279aef7bf4ad313d261da82e8366822270c",
    network: "BNB Smart Chain (BSC)",
    chainId: 56,
    standard: "BEP-20",
    compiler: "Compiler details: review BSCScan",
    sourceVerified: "BSCScan contract reference",
    icon: "🪙",
    color: "#2A52BE",
    description:
      "A BEP-20 token reference on BNB Smart Chain. BSCScan shows a 1 billion maximum supply and a current supply slightly below that amount. The published ABI exposes no mint function; supply may decrease through burns.",
    functions: [
      { name: "burn(amount)", access: "Token holder", desc: "Holder can burn their own tokens" },
      { name: "burnFrom(account, amount)", access: "Approved spender", desc: "Burn from an approved account" },
      { name: "transfer(to, amount)", access: "Token holder", desc: "Standard ERC20 transfer" },
      { name: "approve(spender, amount)", access: "Token holder", desc: "Approve spender allowance" },
    ],
    keyFacts: [
      "Maximum supply: 1,000,000,000 WOLV; current supply is lower due to burns",
      "No mint function — supply cannot increase",
      "Review current administrative permissions on-chain",
      "Review the published ABI for available token functions",
      "No blacklist, no fee, no tax on transfers",
    ],
  },
  {
    name: "Reward Pool",
    symbol: "RewardPool",
    address: "0x7310f3e07627ce98246973e068bf2ff294f84e5f",
    network: "BNB Smart Chain (BSC)",
    chainId: 56,
    standard: "Custom",
    compiler: "Compiler details: review BSCScan",
    sourceVerified: "BSCScan contract reference",
    icon: "🏦",
    color: "#0ea5e9",
    description:
      "Holds the WOLV reward supply used by the staking flow. The deployed ABI exposes queue and execute withdrawal functions with a 48-hour timelock flow; review the current contract state and permissions independently.",
    functions: [
      { name: "fund(amount)", access: "Anyone", desc: "Add WOLV to the reward pool (requires prior approval)" },
      { name: "release(to, amount)", access: "StakingContract only", desc: "Release rewards to a staker" },
      { name: "queueWithdraw(amount)", access: "Multisig only", desc: "Queue an emergency withdrawal — starts 48hr timelock" },
      { name: "executeWithdraw()", access: "Multisig only", desc: "Execute a queued withdrawal after 48hrs" },
      { name: "cancelWithdraw()", access: "Multisig only", desc: "Cancel a queued withdrawal" },
      { name: "poolBalance()", access: "Public", desc: "View current WOLV in the pool" },
    ],
    keyFacts: [
      "Withdrawal functions include a 48-hour timelock flow",
      "Review the deployed caller permissions for release()",
      "Anyone can fund the pool — no gatekeeping",
      "Pool balance publicly visible on BSCScan at all times",
      "No user funds held — reward supply only",
    ],
  },
  {
    name: "Staking Contract",
    symbol: "StakingContract",
    address: "0x7cd22f3c08b4195225da7d043cbe00da118d31ec",
    network: "BNB Smart Chain (BSC)",
    chainId: 56,
    standard: "Custom",
    compiler: "Compiler details: review BSCScan",
    sourceVerified: "BSCScan contract reference",
    icon: "⬡",
    color: "#10b981",
    description:
      "Manages staking positions funded with BNB or BUSD. The deployed ABI exposes stake, claim, early-exit, plan, and price-feed functions. Review current plan values, permissions, lock periods, and fees on-chain before use.",
    functions: [
      { name: "stakeBNB(planId)", access: "Anyone", desc: "Stake BNB into a plan (0–3)" },
      { name: "stakeBUSD(planId, amount)", access: "Anyone", desc: "Stake BUSD into a plan (0–3)" },
      { name: "claimRewards(stakeId)", access: "Staker", desc: "Claim WOLV rewards after lock expires" },
      { name: "earlyExit(stakeId)", access: "Staker", desc: "Exit before lock ends, principal minus exit fee" },
      { name: "pendingReward(user, stakeId)", access: "Public", desc: "View a stake's projected WOLV reward" },
      { name: "getStake(user, stakeId)", access: "Public", desc: "View details of any stake" },
    ],
    keyFacts: [
      "4 staking tiers: Pioneer, Vanguard, Horizon, Summit VIP",
      "Rates and outcomes: review current terms",
      "Chainlink oracle for BNB/USD price feeds",
      "Lock periods: 90 / 150 / 180 / 365 days",
      "Reward rate locked in per-stake at the time you stake — later rate changes never affect existing stakes",
      "Rewards paid from timelock-protected RewardPool",
      "Review administrative roles and withdrawal conditions before use",
    ],
  },
];

const TIERS = [
  { name: "Pioneer",    apy: "8%",  lock: "90 days",  min: "$100",    color: "#3b82f6" },
  { name: "Vanguard",   apy: "12%", lock: "150 days", min: "$1,000",  color: "#00a896" },
  { name: "Horizon",    apy: "18%", lock: "180 days", min: "$5,000",  color: "#8b5cf6" },
  { name: "Summit VIP", apy: "25%", lock: "365 days", min: "$15,000", color: "#10b981" },
];

export default function SmartContractsPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0f1e",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        color: "#fff",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        .contract-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); border-radius: 24px; overflow: hidden; margin-bottom: 24px; }
        .contract-header { padding: 28px 32px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .contract-body { padding: 28px 32px; }
        .fn-row { display: flex; gap: 12px; align-items: flex-start; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .fn-row:last-child { border-bottom: none; }
        .fn-name { font-family: monospace; font-size: 13px; color: #93c5fd; background: rgba(42,82,190,0.1); padding: 2px 8px; border-radius: 6px; flex-shrink: 0; }
        .fact-item { display: flex; align-items: center; gap: 8px; padding: 8px 0; font-size: 13px; color: rgba(255,255,255,0.5); }
        .fact-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .tier-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 20px; text-align: center; }
        .verified-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.3); border-radius: 99px; padding: 4px 12px; font-size: 12px; color: #6ee7b7; font-weight: 600; }
      `}</style>

      {/* Hero */}
      <section
        style={{
          padding: "100px 24px 56px",
          textAlign: "center",
          background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(42,82,190,0.12) 0%, transparent 70%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(42,82,190,0.15)",
              border: "1px solid rgba(42,82,190,0.4)",
              borderRadius: "99px",
              padding: "5px 16px",
              fontSize: "11px",
              color: "#93c5fd",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            Blockchain
          </div>
          <h1
            style={{
              fontSize: "clamp(36px,6vw,54px)",
              fontWeight: 800,
              letterSpacing: "-1.5px",
              lineHeight: 1.1,
              marginBottom: "16px",
            }}
          >
            Smart Contracts
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.7,
              marginBottom: "28px",
            }}
          >
            The addresses below are public references for technical inspection. Source visibility does not establish safety, audit completion, absence of vulnerabilities, or absence of administrative risk.
          </p>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { label: "3 Contracts", color: "#2A52BE" },
              { label: "BNB Smart Chain", color: "#f59e0b" },
              { label: "Public references", color: "#10b981" },
              { label: "Compiler details: review BSCScan", color: "#8b5cf6" },
            ].map((b) => (
              <span
                key={b.label}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "99px",
                  padding: "5px 14px",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Staking Tiers Quick Reference */}
      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "48px 24px 0" }}>
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "#fff",
            marginBottom: "16px",
            letterSpacing: "-0.3px",
          }}
        >
          Staking Tiers — Quick Reference
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
            marginBottom: "48px",
          }}
        >
          {TIERS.map((tier) => (
            <div key={tier.name} className="tier-card">
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: tier.color,
                  marginBottom: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {tier.name}
              </div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  color: "#fff",
                  fontFamily: "monospace",
                  marginBottom: "4px",
                }}
              >
                {tier.apy}
              </div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "8px" }}>
                APY
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.4)",
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: "8px",
                  padding: "6px",
                }}
              >
                🔒 {tier.lock}
              </div>
            </div>
          ))}
        </div>

        {/* Contracts */}
        {CONTRACTS.map((contract) => (
          <div key={contract.address} id={contract.name.toLowerCase().replace(" ", "-")} className="contract-card" style={{ scrollMarginTop: "80px" }}>
            {/* Header */}
            <div className="contract-header">
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "14px",
                      background: `${contract.color}20`,
                      border: `1px solid ${contract.color}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "22px",
                    }}
                  >
                    {contract.icon}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                      <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", letterSpacing: "-0.3px" }}>
                        {contract.name}
                      </h2>
                      <span className="verified-badge">BSCScan reference</span>
                    </div>
                    <div style={{ fontFamily: "monospace", fontSize: "12px", color: "#93c5fd" }}>
                      {contract.address}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <a
                    href={`https://bscscan.com/address/${contract.address}#code`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: "rgba(42,82,190,0.15)",
                      border: "1px solid rgba(42,82,190,0.3)",
                      color: "#93c5fd",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      fontSize: "13px",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    View Code ↗
                  </a>
                  <a
                    href={`https://bscscan.com/address/${contract.address}#code`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.6)",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      fontSize: "13px",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    Read Contract ↗
                  </a>
                </div>
              </div>

              {/* Meta pills */}
              <div style={{ display: "flex", gap: "8px", marginTop: "16px", flexWrap: "wrap" }}>
                {[
                  { label: contract.network },
                  { label: `Standard: ${contract.standard}` },
                  { label: contract.compiler },
                  { label: contract.sourceVerified },
                ].map((pill) => (
                  <span
                    key={pill.label}
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "99px",
                      padding: "3px 12px",
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    {pill.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="contract-body">
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: "28px" }}>
                {contract.description}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                {/* Functions */}
                <div>
                  <h3 style={{ fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
                    Key Functions
                  </h3>
                  {contract.functions.map((fn) => (
                    <div key={fn.name} className="fn-row">
                      <span className="fn-name">{fn.name}</span>
                      <div>
                        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "2px" }}>{fn.desc}</div>
                        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>Access: {fn.access}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Key Facts */}
                <div>
                  <h3 style={{ fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
                    Key Facts
                  </h3>
                  {contract.keyFacts.map((fact, i) => (
                    <div key={i} className="fact-item">
                      <div className="fact-dot" style={{ background: contract.color }} />
                      {fact}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Security note */}
        <div
          style={{
            background: "rgba(42,82,190,0.06)",
            border: "1px solid rgba(42,82,190,0.15)",
            borderRadius: "16px",
            padding: "28px 32px",
            marginBottom: "16px",
          }}
        >
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "12px" }}>
            🔍 Verify Everything Yourself
          </h3>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: "16px" }}>
            Use the BSCScan contract pages as the primary references for addresses, ABI/source availability, functions, and current state. BSCScan currently shows no contract security audit submitted for these references. Public contract information is not an audit, endorsement, or safety guarantee.
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href="/whitepaper" style={{ background: "rgba(42,82,190,0.2)", border: "1px solid rgba(42,82,190,0.3)", color: "#93c5fd", padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>
              Read Whitepaper
            </Link>
            <Link href="/tokenomics" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>
              View Tokenomics
            </Link>
            <Link href="/security" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>
              Security Overview
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
