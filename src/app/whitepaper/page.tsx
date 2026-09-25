import Link from "next/link";
import { generateOgMetadata } from '@/lib/og-metadata'

export const metadata = generateOgMetadata('whitepaper')

const CONTRACTS = [
  {
    label: "WOLV Token",
    address: "0xe0167279aef7bf4ad313d261da82e8366822270c",
    note: "Fixed supply BEP-20 · No mint function · 1B hard cap",
  },
  {
    label: "Reward Pool",
    address: "0x7310f3e07627ce98246973e068bf2ff294f84e5f",
    note: "48-hour timelock functions · BSCScan reference · No audit submitted",
  },
  {
    label: "Staking Contract",
    address: "0x7cd22f3c08b4195225da7d043cbe00da118d31ec",
    note: "BNB/BUSD staking functions · BSCScan reference · No audit submitted",
  },
];

const SECTIONS = [
  {
    id: "abstract",
    num: "01",
    title: "Abstract",
    content: [
      "WolvCapital publishes structured platform information, public contract references, and staking information for a BNB Smart Chain-based digital-asset service.",
      "The platform issues WOLV, a fixed-supply BEP-20 token, as verifiable on-chain proof of investor earnings. Unlike traditional investment platforms that issue PDF statements, WolvCapital distributes WOLV tokens directly to investor wallets — creating permanent, publicly auditable records of every profit distribution.",
      "The platform publishes account, KYC/AML, contract, and risk information for review. No government registration, securities licence, audit, endorsement, or guaranteed outcome is claimed by this document.",
    ],
  },
  {
    id: "problem",
    num: "02",
    title: "Problem Statement",
    content: [
      "Traditional investment platforms suffer from a fundamental trust problem: profit records exist only as internal database entries or PDF statements that investors cannot independently verify. This creates opacity, disputes, and vulnerability to manipulation.",
      "The DeFi ecosystem offers on-chain transparency, but users must independently assess compliance, custody, portfolio management, and smart-contract risk before participating.",
      "WolvCapital aims to make selected reward records easier to review through public blockchain references. On-chain records do not by themselves establish regulatory approval, custody protection, solvency, or future returns.",
    ],
  },
  {
    id: "platform",
    num: "03",
    title: "Platform Architecture",
    content: [
      "WolvCapital operates a two-layer architecture. The off-chain layer may handle KYC verification, account eligibility, onboarding, portfolio information, and withdrawal review under the current platform terms. The on-chain layer handles WOLV token distribution, staking contracts, and the reward pool.",
      "The frontend is built on Next.js 16 deployed on Vercel, with a scalable cloud backend. All smart contracts are deployed on BNB Smart Chain (BSC) — chosen for its low transaction fees, EVM compatibility, and large ecosystem.",
      "Reward pool: The published token allocation assigns 600,000,000 WOLV to staking rewards. The RewardPool address is publicly referenced on BSCScan, where users can inspect the deployed contract and current state. Allocation figures, pool balances, reward rates, liquidity, and outcomes can change or may differ from historical documentation.",
      "Platform plans and staking positions have terms, lock periods, fees, and reward parameters that should be reviewed before use. On-chain transfers can be inspected independently, but a transaction record does not prove profit, solvency, custody, or future performance.",
    ],
  },
  {
    id: "investment",
    num: "04",
    title: "Investment Plans",
    content: [
      "WolvCapital offers four investment tiers, each designed for a different investor profile. All plans operate on fixed terms with structured APY.",
      "Pioneer (Entry): Minimum $100 · 8% APY · 90-day term. Designed for first-time investors exploring the platform with minimal capital commitment.",
      "Vanguard (Growth): Minimum $1,000 · 12% APY · 150-day term. For investors ready to commit meaningful capital for consistent compounding returns.",
      "Horizon (Advanced): Minimum $5,000 · 18% APY · 180-day term. For serious investors seeking significant portfolio growth over a structured period.",
      "Summit VIP (Elite): Minimum $15,000 · 25% target APY · 365-day term. Terms, fees, eligibility, and risk disclosures should be reviewed before participation.",
    ],
  },
  {
    id: "wolv-token",
    num: "05",
    title: "WOLV Token",
    content: [
      "WOLV is a BEP-20 token deployed on BNB Smart Chain with a fixed supply of 1,000,000,000 (one billion) tokens. BSCScan currently shows a 1,000,000,000 WOLV maximum supply and a current supply of approximately 999,999,994.48 WOLV at the time reviewed. The published ABI exposes no mint function; burns can reduce the current supply.",
      "Token contract: 0xe0167279aef7bf4ad313d261da82e8366822270c. The contract address and public ABI are available on BSCScan. BSCScan currently shows no contract security audit submitted for this token reference. Review the deployed functions and current state independently.",
      "Token activity: WOLV transfers may be recorded on-chain. A transfer record does not establish that value was earned, will retain value, or represents a guaranteed return.",
      "Token utility: WOLV transfers and other token activity can be inspected on BNB Smart Chain. Market availability, liquidity, token balances, and reward outcomes can change; check current BSCScan and DEX data rather than relying on static wording.",
      "Security review: BSCScan currently shows no contract security audit submitted for the WOLV reference. Public contract information is not an independent audit or a safety guarantee. Review the deployed contract, permissions, and risk disclosures before interacting.",
    ],
  },
  {
    id: "staking",
    num: "06",
    title: "Staking System",
    content: [
      "WolvCapital's staking system references the StakingContract and RewardPool. Their BSCScan pages provide public contract and ABI/source information where available; this is not the same as an independent audit.",
      "StakingContract (0x7cd22f3c08b4195225da7d043cbe00da118d31ec): Handles stake deposits, lock periods, reward calculations using Chainlink price feeds, and claim processing. Four staking tiers are available: Starter (8% APY), Growth (12% APY), Pro (18% APY), and Elite (25% APY).",
      "RewardPool (0x7310f3e07627ce98246973e068bf2ff294f84e5f): Holds the WOLV reward supply available for staker claims. The RewardPool ABI exposes a queue and execute withdrawal flow with a 48-hour timelock. This is a technical control, not a guarantee against loss, misuse, contract defects, or other risks.",
      "The staking ABI exposes a BNB/USD feed reference. Oracle configuration, availability, and output should be inspected on-chain; no oracle eliminates all market, implementation, or operational risk.",
      "Pool balance and funding activity can change. Review the current RewardPool balance and transaction history on BSCScan before relying on any reward or liquidity statement.",
    ],
  },
  {
    id: "tokenomics",
    num: "07",
    title: "Tokenomics",
    content: [
      "Maximum supply: 1,000,000,000 WOLV. BSCScan currently shows approximately 999,999,994.48 WOLV in current supply. The published ABI exposes no mint function; burns can reduce the current supply.",
      "Staking Rewards: 60% — 600,000,000 WOLV. Distributed to stakers as on-chain rewards over the platform lifetime.", "Treasury Reserve: 20% — 200,000,000 WOLV. Held in treasury for operational continuity, future reward pool top-ups, and platform development.", "Liquidity Reserve: 10% — 100,000,000 WOLV. Allocated to DEX liquidity provision. WOLV/BNB liquidity pool is now live on PancakeSwap V2 (BNB Smart Chain) — WOLV is actively tradeable on DEX.", "Team & Development: 7% — 70,000,000 WOLV. Allocated to the founding team and ongoing development. Subject to 12-month vesting schedule.", "Marketing & Growth: 3% — 30,000,000 WOLV. Reserved for partnerships, exchange listings, community growth, and platform promotion.",
      "No tokens are allocated to founders, team, or advisors outside the categories above. All WOLV in circulation represent either earned staking rewards or tokens acquired through the public presale or DEX. None are pre-mined to founders or distributed through private allocations.",
      "DEX Listing: WOLV market information is available through public DEX and BSCScan references. The token address is 0xe0167279aef7bf4ad313d261da82e8366822270c. At the time reviewed, BSCScan showed 231 holders, 237 transfers, a 1,000,000,000 maximum supply, and approximately 999,999,994.48 WOLV current supply. These figures change over time and are not a guarantee of liquidity, price, or value.",
    ],
  },
  {
    id: "compliance",
    num: "08",
    title: "Compliance & Regulation",
    content: [
      "WolvCapital publishes compliance and risk information for users to review. Eligibility and permitted activities depend on the applicable jurisdiction and the platform terms.",
      "KYC/AML and eligibility: The platform may request identity and eligibility information before access to particular features. Requirements and availability depend on the current platform terms and applicable jurisdiction.",
      "No regulatory status, licence, government approval, or endorsement is claimed by this document. Review the current terms and jurisdictional limits independently.",
      "KYC/AML: Full Know Your Customer identity verification is required for all investors. Anti-Money Laundering screening is applied to all deposits and withdrawals. PCI-DSS compliance standards govern payment processing.",
      "Manual withdrawal approvals: Every withdrawal request undergoes manual human review before processing. This prevents unauthorized transfers, detects fraudulent activity, and ensures compliance with AML requirements.",
      "All compliance disclosures are published at wolvcapital.com/compliance. Risk disclosures are available at wolvcapital.com/risk-disclosure. By investing, all users acknowledge having read and accepted these disclosures.",
    ],
  },
  {
    id: "security",
    num: "09",
    title: "Security Architecture",
    content: [
      "Platform security: 256-bit SSL encryption on all connections. JWT authentication with token refresh. Session management with automatic expiry. Rate limiting on all API endpoints.",
      "Smart contract security: Contract references: BSCScan pages provide public contract and ABI/source information where available. At the time reviewed, BSCScan showed no contract security audit submitted for the WOLV, RewardPool, or StakingContract references. Public code visibility is not an audit or safety guarantee.",
      "Custody: Review the current custody and fund-handling disclosures, contract addresses, lock terms, and withdrawal policy before depositing. Do not rely on a general security statement as proof of custody protection.",
      "Bug bounty: WolvCapital maintains an internal bug bounty program. Security researchers should use the project's private disclosure process. No bounty or payment is promised.",
      "Incident response: WolvCapital maintains a documented incident response procedure. Administrative controls and emergency behavior should be verified from the deployed contract and current permissions. This document does not promise a pause capability or guaranteed incident response.",
    ],
  },
  {
    id: "roadmap",
    num: "10",
    title: "Roadmap",
    content: [
      "Q1 2026 (Completed): Platform launch · KYC/AML integration · Four investment plans live · Manual withdrawal system · Virtual Visa card integration.",
      "Q2 2026 (Completed): WOLV Token deployment on BNB Smart Chain · Published token allocation · Treasury model · BSCScan contract references · Staking contracts (RewardPool + StakingContract) · BNB/USD feed reference · Staking UI on dashboard.",
      "Q3 2026 (Planned): PancakeSwap liquidity provision · CoinGecko and CoinMarketCap listing applications · Independent third-party smart contract audit · Gnosis Safe multisig implementation · Mobile app launch.",
      "Q4 2026 (Planned): WOLV governance proposals · Cross-chain bridge exploration (ETH/Polygon) · Institutional partnership programme · Enhanced staking tiers · Referral staking rewards.",
      "2027 (Vision): Fully decentralized governance · DAO transition for ecosystem reserve allocation · WOLV listed on tier-1 centralised exchanges · Expanded investment plan offerings.",
    ],
  },
  {
    id: "risk",
    num: "11",
    title: "Risk Disclosures",
    content: [
      "Digital asset investments involve substantial risk of loss. Past performance does not guarantee future results. The value of digital assets can be highly volatile and may result in the loss of your entire investment.",
      "WolvCapital is not a bank. No deposit, investor, or return protection is promised. Digital-asset positions involve risk, and no projected outcome is guaranteed.",
      "Smart contract risk: Even publicly inspectable smart contracts carry inherent risk. Bugs, exploits, or unforeseen interactions may result in loss of funds held in staking contracts.",
      "Regulatory risk: The regulatory environment for digital assets is evolving. Changes in applicable laws or regulations may affect WolvCapital's ability to operate in certain jurisdictions.",
      "Full risk disclosure is available at wolvcapital.com/risk-disclosure. By using the WolvCapital platform, you confirm you have read, understood, and accepted all risk disclosures and Terms of Service.",
    ],
  },
  {
    id: "conclusion",
    num: "12",
    title: "Conclusion",
    content: [
      "WolvCapital represents a new standard for investment platform transparency. By combining published platform information, KYC/AML controls, contract references, and blockchain transaction records through WOLV Token, we eliminate the trust gap that has historically separated mainstream investors from digital asset markets.",
      "WOLV transfers and other token activity can be inspected on-chain. A token balance or transaction record does not establish that value was earned, will retain value, or represents a guaranteed return.",
      "We invite users and community members to review the BSCScan references, current platform terms, and risk disclosures. Public information should be assessed independently and is not an endorsement or guarantee.",
      "WolvCapital. Public references. Independent review.",
    ],
  },
];
export default function WhitepaperPage() {
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
        .section-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 36px; margin-bottom: 16px; }
        .section-card:hover { border-color: rgba(42,82,190,0.25); }
        .contract-row { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 10px; }
        .toc-link { display: block; padding: 8px 12px; border-radius: 8px; font-size: 13px; color: rgba(255,255,255,0.5); text-decoration: none; transition: all 0.15s; }
        .toc-link:hover { background: rgba(42,82,190,0.1); color: #93c5fd; }
        @media (max-width: 768px) { .layout { flex-direction: column !important; } .toc { display: none !important; } }
      `}</style>

      {/* Hero */}
      <section
        style={{
          padding: "100px 24px 56px",
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(42,82,190,0.12) 0%, transparent 70%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
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
            Official Documentation
          </div>
          <h1
            style={{
              fontSize: "clamp(36px,6vw,56px)",
              fontWeight: 800,
              letterSpacing: "-1.5px",
              lineHeight: 1.1,
              marginBottom: "16px",
            }}
          >
            WolvCapital Whitepaper
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.7,
              marginBottom: "24px",
            }}
          >
            Version 2.0 · May 2026 · BNB Smart Chain
          </p>
          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {["12 Sections", "3 BSCScan References", "1B WOLV Maximum Supply", "No Audit Submitted"].map((badge) => (
              <span
                key={badge}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "99px",
                  padding: "4px 14px",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Layout */}
      <div
        className="layout"
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "48px 24px 100px",
          display: "flex",
          gap: "32px",
          alignItems: "flex-start",
        }}
      >
        {/* TOC Sidebar */}
        <div
          className="toc"
          style={{
            width: "220px",
            flexShrink: 0,
            position: "sticky",
            top: "80px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              marginBottom: "12px",
              paddingLeft: "12px",
            }}
          >
            Contents
          </div>
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="toc-link">
              <span
                style={{
                  fontFamily: "monospace",
                  color: "rgba(255,255,255,0.25)",
                  marginRight: "6px",
                }}
              >
                {s.num}
              </span>
              {s.title}
            </a>
          ))}
          <div style={{ marginTop: "24px", padding: "12px" }}>
            <a
              href="https://bscscan.com/token/0xe0167279aef7bf4ad313d261da82e8366822270c"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                background: "rgba(42,82,190,0.15)",
                border: "1px solid rgba(42,82,190,0.3)",
                borderRadius: "8px",
                padding: "10px 12px",
                fontSize: "12px",
                color: "#93c5fd",
                textDecoration: "none",
                textAlign: "center",
                fontWeight: 600,
              }}
            >
              View on BSCScan ↗
            </a>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Contracts summary */}
          <div className="section-card" style={{ marginBottom: "24px" }}>
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#fff",
                marginBottom: "16px",
              }}
            >
              Public Contract Addresses
            </h2>
            {CONTRACTS.map((c) => (
              <div key={c.label} className="contract-row">
                <div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#fff",
                      marginBottom: "3px",
                    }}
                  >
                    {c.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "11px",
                      color: "#93c5fd",
                      wordBreak: "break-all",
                      marginBottom: "2px",
                    }}
                  >
                    {c.address}
                  </div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
                    {c.note}
                  </div>
                </div>
                <a
                  href={c.label === 'Reward Pool' ? `https://bscscan.com/token/0xe0167279aef7bf4ad313d261da82e8366822270c?a=${c.address}` : `https://bscscan.com/address/${c.address}#code`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "rgba(42,82,190,0.15)",
                    border: "1px solid rgba(42,82,190,0.3)",
                    color: "#93c5fd",
                    borderRadius: "8px",
                    padding: "6px 14px",
                    fontSize: "11px",
                    fontWeight: 600,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  Verify ↗
                </a>
              </div>
            ))}
          </div>

          {/* Sections */}
          {SECTIONS.map((section) => (
            <div
              key={section.id}
              id={section.id}
              className="section-card"
              style={{ scrollMarginTop: "80px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "20px",
                }}
              >
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "12px",
                    color: "#93c5fd",
                    background: "rgba(42,82,190,0.15)",
                    border: "1px solid rgba(42,82,190,0.3)",
                    padding: "3px 10px",
                    borderRadius: "6px",
                  }}
                >
                  {section.num}
                </span>
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: "-0.3px",
                  }}
                >
                  {section.title}
                </h2>
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "14px" }}
              >
                {section.content.map((para, i) => (
                  <p
                    key={i}
                    style={{
                      fontSize: "14px",
                      color: "rgba(255,255,255,0.55)",
                      lineHeight: 1.8,
                      margin: 0,
                      borderLeft:
                        section.id === "tokenomics" && i > 0
                          ? "2px solid rgba(42,82,190,0.3)"
                          : "none",
                      paddingLeft:
                        section.id === "tokenomics" && i > 0 ? "14px" : "0",
                    }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}

          {/* Footer note */}
          <div
            style={{
              marginTop: "32px",
              padding: "24px",
              background: "rgba(42,82,190,0.06)",
              border: "1px solid rgba(42,82,190,0.15)",
              borderRadius: "16px",
              fontSize: "13px",
              color: "rgba(255,255,255,0.35)",
              lineHeight: 1.7,
              textAlign: "center",
            }}
          >
            This whitepaper is for informational purposes only and does not constitute financial or investment advice. All investments involve risk. Please read our full{" "}
            <Link href="/risk-disclosure" style={{ color: "#93c5fd" }}>
              Risk Disclosure
            </Link>{" "}
            and{" "}
            <Link href="/terms-of-service" style={{ color: "#93c5fd" }}>
              Terms of Service
            </Link>{" "}
            before investing. WolvCapital, Inc. © 2026.
          </div>
        </div>
      </div>
    </div>
  );
}
