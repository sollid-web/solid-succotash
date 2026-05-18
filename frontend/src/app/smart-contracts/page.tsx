import type { Metadata } from "next";
import Link from "next/link";

export const metadata = {
  title: 'Smart Contracts & Security — WolvCapital',
  description:
    'Review the verified smart contracts and blockchain infrastructure securing the WolvCapital ecosystem. Transparent, audited, and built for decentralized asset management.',
  alternates: {
    canonical: 'https://wolvcapital.com/smart-contracts',
  },
  openGraph: {
    title: 'Verified Smart Contracts — WolvCapital',
    description: 'Review the blockchain infrastructure and verified smart contracts securing the WolvCapital platform.',
    url: 'https://wolvcapital.com/smart-contracts',
    siteName: 'WolvCapital',
    images: [
      {
        url: 'https://wolvcapital.com/og-contracts.png', // Suggest using an image featuring code/nodes or a security shield
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
    title: 'Verified Smart Contracts — WolvCapital',
    description: 'Review the blockchain infrastructure and verified smart contracts securing our platform.',
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
    compiler: "Solidity v0.8.28",
    auditScore: "87/100",
    auditLink: "https://solidityscan.com",
    verified: true,
    icon: "🪙",
    color: "#2A52BE",
    description:
      "The native profit token of WolvCapital. Fixed supply of 1,000,000,000 WOLV minted entirely at deployment. No mint function exists — supply is permanently capped. Includes emergency pause via multisig only.",
    functions: [
      { name: "pause()", access: "Multisig only", desc: "Emergency freeze of all transfers" },
      { name: "unpause()", access: "Multisig only", desc: "Resume transfers after pause" },
      { name: "burn(amount)", access: "Token holder", desc: "Holder can burn their own tokens" },
      { name: "transfer(to, amount)", access: "Token holder", desc: "Standard ERC20 transfer" },
      { name: "approve(spender, amount)", access: "Token holder", desc: "Approve spender allowance" },
    ],
    keyFacts: [
      "Total supply: 1,000,000,000 WOLV (fixed forever)",
      "No mint function — supply cannot increase",
      "No owner — no single admin key",
      "Pause requires multisig (2+ signatures)",
      "No blacklist, no fee, no tax on transfers",
      "SolidityScan score: 87/100",
    ],
  },
  {
    name: "Reward Pool",
    symbol: "RewardPool",
    address: "0xb233cf74b14abf9d9702d585c540030125599579",
    network: "BNB Smart Chain (BSC)",
    chainId: 56,
    standard: "Custom",
    compiler: "Solidity v0.8.28",
    auditScore: "Verified",
    verified: true,
    icon: "🏦",
    color: "#0ea5e9",
    description:
      "Holds the WOLV reward supply for staker claims. Protected by a 48-hour timelock — no funds can be moved without a mandatory 48-hour delay. Currently funded with 1,000,000 WOLV from the treasury.",
    functions: [
      { name: "fund(amount)", access: "Owner only", desc: "Add WOLV to the reward pool" },
      { name: "release(to, amount)", access: "StakingContract only", desc: "Release rewards to a staker" },
      { name: "poolBalance()", access: "Public", desc: "View current WOLV in the pool" },
      { name: "timelock()", access: "Public", desc: "View 48-hour timelock status" },
    ],
    keyFacts: [
      "48-hour timelock on all fund movements",
      "Only StakingContract can call release()",
      "Pool balance publicly visible on BSCScan",
      "Currently funded: 1,000,000 WOLV",
      "Owner-funded — WolvCapital tops up monthly",
      "No user funds held — rewards only",
    ],
  },
  {
    name: "Staking Contract",
    symbol: "StakingContract",
    address: "0x4b62efee5695ed55cd362a0b818f4c5f9694322b",
    network: "BNB Smart Chain (BSC)",
    chainId: 56,
    standard: "Custom",
    compiler: "Solidity v0.8.28",
    auditScore: "Verified",
    verified: true,
    icon: "⬡",
    color: "#10b981",
    description:
      "Manages WOLV staking positions across four tiers. Integrates Chainlink price feeds for manipulation-resistant APY calculations. Handles stake deposits, lock periods, and reward claims via the RewardPool.",
    functions: [
      { name: "stake(tier, amount)", access: "Token holder", desc: "Stake WOLV into a tier (0–3)" },
      { name: "unstake(stakeId)", access: "Staker", desc: "Unstake after lock period expires" },
      { name: "claimRewards(stakeId)", access: "Staker", desc: "Claim accumulated APY rewards" },
      { name: "getStakeInfo(stakeId)", access: "Public", desc: "View details of any stake" },
      { name: "getTierAPY(tier)", access: "Public", desc: "View current APY for a tier" },
      { name: "totalStaked()", access: "Public", desc: "View total WOLV staked in contract" },
    ],
    keyFacts: [
      "4 staking tiers: Starter, Growth, Pro, Elite",
      "APY range: 8% – 25%",
      "Chainlink oracle for price feeds",
      "Lock periods: 30 / 60 / 90 / 180 days",
      "Rewards paid from timelock-protected RewardPool",
      "No admin can access staker funds",
    ],
  },
];

const TIERS = [
  { name: "Starter", apy: "8%", lock: "30 days", min: "Any", color: "#64748b" },
  { name: "Growth", apy: "12%", lock: "60 days", min: "Any", color: "#2A52BE" },
  { name: "Pro", apy: "18%", lock: "90 days", min: "Any", color: "#7c3aed" },
  { name: "Elite", apy: "25%", lock: "180 days", min: "Any", color: "#10b981" },
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
            All WolvCapital smart contracts are open-source, verified on BSCScan,
            and auditable by anyone. No hidden code. No admin backdoors.
          </p>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { label: "3 Contracts", color: "#2A52BE" },
              { label: "BNB Smart Chain", color: "#f59e0b" },
              { label: "All Verified ✓", color: "#10b981" },
              { label: "Solidity v0.8.28", color: "#8b5cf6" },
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
                      <span className="verified-badge">✓ Verified</span>
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
                    href={`https://bscscan.com/address/${contract.address}#readContract`}
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
                  { label: `Audit: ${contract.auditScore}` },
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
            All WolvCapital contracts are open-source and publicly verified on BSCScan. You do not need to trust our documentation — verify the source code, read the functions, and check the on-chain state yourself. That's the point of blockchain.
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
