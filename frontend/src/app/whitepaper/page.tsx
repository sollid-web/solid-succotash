import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Whitepaper — WolvCapital | Platform Documentation",
  description:
    "WolvCapital official whitepaper. Full documentation covering platform architecture, tokenomics, staking contracts, compliance framework, revenue model, and roadmap.",
  keywords:
    "WolvCapital whitepaper, WOLV token documentation, investment platform whitepaper, BNB Smart Chain, staking, tokenomics, DeFi whitepaper",
  openGraph: {
    title: "WolvCapital Whitepaper — Official Platform Documentation",
    description:
      "Full technical and strategic documentation for the WolvCapital investment and staking platform.",
    url: "https://wolvcapital.com/whitepaper",
    siteName: "WolvCapital",
    type: "website",
  },
};

const CONTRACTS = [
  {
    label: "WOLV Token",
    address: "0xe0167279aef7bf4ad313d261da82e8366822270c",
    note: "Fixed supply BEP-20 · No mint function · 1B hard cap",
  },
  {
    label: "Reward Pool",
    address: "0xb233cf74b14abf9d9702d585c540030125599579",
    note: "48-hour timelock · Owner-funded · Verified",
  },
  {
    label: "Staking Contract",
    address: "0x4b62efee5695ed55cd362a0b818f4c5f9694322b",
    note: "Chainlink price feeds · 4 staking tiers · Verified",
  },
];

const SECTIONS = [
  {
    id: "abstract",
    num: "01",
    title: "Abstract",
    content: [
      "WolvCapital is a professionally managed digital asset investment platform combining structured investment plans, blockchain-verified profit distribution, and a decentralized staking ecosystem — all built on BNB Smart Chain.",
      "The platform issues WOLV, a fixed-supply BEP-20 token, as verifiable on-chain proof of investor earnings. Unlike traditional investment platforms that issue PDF statements, WolvCapital distributes WOLV tokens directly to investor wallets — creating permanent, publicly auditable records of every profit distribution.",
      "WolvCapital operates under SEC registration, FinCEN MSB compliance, and full AML/KYC procedures, bridging institutional finance standards with blockchain transparency.",
    ],
  },
  {
    id: "problem",
    num: "02",
    title: "Problem Statement",
    content: [
      "Traditional investment platforms suffer from a fundamental trust problem: profit records exist only as internal database entries or PDF statements that investors cannot independently verify. This creates opacity, disputes, and vulnerability to manipulation.",
      "Simultaneously, the DeFi ecosystem offers on-chain transparency but lacks regulatory compliance, institutional custody, and professional portfolio management — making it inaccessible or unsafe for mainstream investors.",
      "WolvCapital addresses both failures: institutional-grade compliance and custody combined with blockchain-verifiable profit records through the WOLV Token system.",
    ],
  },
  {
    id: "platform",
    num: "03",
    title: "Platform Architecture",
    content: [
      "WolvCapital operates a two-layer architecture. The off-chain layer handles KYC verification, fiat onboarding, portfolio management, and manual withdrawal approvals — providing regulatory compliance and fraud prevention. The on-chain layer handles WOLV token distribution, staking contracts, and the reward pool.",
      "The frontend is built on Next.js 16 deployed on Vercel, with a Django REST Framework backend on Railway. All smart contracts are deployed on BNB Smart Chain (BSC) — chosen for its low transaction fees, EVM compatibility, and large ecosystem.",
      "Investment plans operate on fixed-term, fixed-ROI structures. Returns are calculated server-side and reflected in the investor dashboard daily. When profits are distributed, WOLV tokens are transferred from the treasury wallet to investor wallets — creating an on-chain record of every distribution.",
    ],
  },
  {
    id: "investment",
    num: "04",
    title: "Investment Plans",
    content: [
      "WolvCapital offers four investment tiers, each designed for a different investor profile. All plans operate on fixed terms with structured daily ROI.",
      "Pioneer (Entry): Minimum $100 · 1% daily ROI · 90-day term. Designed for first-time investors exploring the platform with minimal capital commitment.",
      "Vanguard (Growth): Minimum $1,000 · Enhanced daily ROI · 150-day term. For investors ready to commit meaningful capital for consistent compounding returns.",
      "Horizon (Advanced): Minimum $5,000 · Premium daily ROI · 180-day term. For serious investors seeking significant portfolio growth over a structured period.",
      "Summit VIP (Elite): Minimum $10,000 · Maximum daily ROI · 365-day term. Priority support, maximum returns, and exclusive platform benefits for high-net-worth investors.",
    ],
  },
  {
    id: "wolv-token",
    num: "05",
    title: "WOLV Token",
    content: [
      "WOLV is a BEP-20 token deployed on BNB Smart Chain with a fixed supply of 1,000,000,000 (one billion) tokens. The entire supply was minted to the WolvCapital treasury wallet at deployment — no mint function exists in the contract. Supply can never increase beyond 1 billion.",
      "Token contract: 0xe0167279aef7bf4ad313d261da82e8366822270c. The contract is open-source and verified on BSCScan. It includes an emergency pause function controlled exclusively by a multisig wallet for compliance use.",
      "Profit distribution: When investors earn returns on WolvCapital, WOLV tokens are transferred from the treasury wallet directly to the investor's connected wallet. This creates a permanent, on-chain record of every profit distribution — verifiable by anyone on BSCScan.",
      "Token utility: WOLV serves as (1) verifiable proof of investment profits, (2) a stakeable asset earning additional APY rewards, and (3) a future exchange-tradeable asset upon PancakeSwap listing. WOLV is not sold, pre-mined to founders, or distributed for any purpose other than investor profit rewards.",
      "Security audit: WOLV scored 87/100 on SolidityScan security audit. No malicious typecasting, no hidden owner, no self-destruct function, no blacklist capability, no fee manipulation. Full audit report available on SolidityScan.",
    ],
  },
  {
    id: "staking",
    num: "06",
    title: "Staking System",
    content: [
      "WolvCapital's staking system allows WOLV holders to stake their tokens and earn additional APY rewards. The system consists of two audited smart contracts: the StakingContract and the RewardPool.",
      "StakingContract (0x4b62efee5695ed55cd362a0b818f4c5f9694322b): Handles stake deposits, lock periods, reward calculations using Chainlink price feeds, and claim processing. Four staking tiers are available: Starter (8% APY), Growth (12% APY), Pro (18% APY), and Elite (25% APY).",
      "RewardPool (0xb233cf74b14abf9d9702d585c540030125599579): Holds the WOLV reward supply available for staker claims. Protected by a 48-hour timelock — no funds can be moved without a 48-hour delay, preventing sudden rug pulls or unauthorized withdrawals.",
      "Chainlink integration: Reward calculations incorporate Chainlink's decentralized price feeds for fair and manipulation-resistant APY computation. This eliminates reliance on a single price source and protects stakers from oracle manipulation attacks.",
      "The reward pool was initially funded with 1,000,000 WOLV from the treasury. WolvCapital commits to maintaining adequate pool funding as the staking user base grows. Pool balance is publicly visible on BSCScan at all times.",
    ],
  },
  {
    id: "tokenomics",
    num: "07",
    title: "Tokenomics",
    content: [
      "Total Supply: 1,000,000,000 WOLV (fixed, immutable). No additional tokens can ever be minted. The contract contains no mint function.",
      "Treasury (Investor Rewards): 70% — 700,000,000 WOLV. Distributed exclusively as investor profit rewards. Released only when investors earn returns on WolvCapital investment plans.",
      "Staking Reward Pool: 20% — 200,000,000 WOLV. Reserved for staking APY rewards across all four staking tiers. Managed by the timelock-protected RewardPool contract.",
      "Ecosystem Reserve: 10% — 100,000,000 WOLV. Reserved for future utility: exchange listings, liquidity provision, partnerships, and platform development. Subject to governance timelock before any release.",
      "No tokens are allocated to founders, team, advisors, or investors for any purpose other than the categories above. WOLV had no ICO, no presale, and no private sale. All tokens in circulation represent earned investor rewards.",
    ],
  },
  {
    id: "compliance",
    num: "08",
    title: "Compliance & Regulation",
    content: [
      "WolvCapital operates under a comprehensive compliance framework designed to meet international financial regulation standards.",
      "SEC Registration: WolvCapital is registered as an investment adviser with the U.S. Securities and Exchange Commission. All investment plans are structured to comply with applicable securities laws.",
      "FinCEN MSB: Registered as a Money Services Business with the Financial Crimes Enforcement Network. Subject to Bank Secrecy Act requirements including AML program, suspicious activity reporting, and recordkeeping.",
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
      "Smart contract security: All contracts verified on BSCScan with public source code. WOLV token audited on SolidityScan (87/100). No admin keys with unilateral power — pause function requires multisig. RewardPool protected by 48-hour timelock.",
      "Custody: Investor funds are held with licensed institutional custodians, not on the WolvCapital platform directly. This separates investor assets from platform operations.",
      "Bug bounty: WolvCapital maintains an internal bug bounty program. Security researchers who identify and responsibly disclose vulnerabilities are rewarded. Contact security@wolvcapital.com.",
      "Incident response: WolvCapital maintains a documented incident response procedure. The WOLV contract pause function allows immediate freeze of all token transfers in the event of a security incident requiring intervention.",
    ],
  },
  {
    id: "roadmap",
    num: "10",
    title: "Roadmap",
    content: [
      "Q1 2026 (Completed): Platform launch · KYC/AML integration · Four investment plans live · Manual withdrawal system · Virtual Visa card integration.",
      "Q2 2026 (Completed): WOLV Token deployment on BNB Smart Chain · Fixed supply tokenomics · Treasury model · BSCScan verification · Staking contracts (RewardPool + StakingContract) · Chainlink integration · Staking UI on dashboard.",
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
      "WolvCapital is not a bank. Deposits are not FDIC or SIPC insured. WolvCapital does not guarantee investment returns. All projected ROI figures represent targets based on historical strategy performance, not guaranteed outcomes.",
      "Smart contract risk: Despite audits, all smart contracts carry inherent risk. Bugs, exploits, or unforeseen interactions may result in loss of funds held in staking contracts.",
      "Regulatory risk: The regulatory environment for digital assets is evolving. Changes in applicable laws or regulations may affect WolvCapital's ability to operate in certain jurisdictions.",
      "Full risk disclosure is available at wolvcapital.com/risk-disclosure. By using the WolvCapital platform, you confirm you have read, understood, and accepted all risk disclosures and Terms of Service.",
    ],
  },
  {
    id: "conclusion",
    num: "12",
    title: "Conclusion",
    content: [
      "WolvCapital represents a new standard for investment platform transparency. By combining institutional-grade compliance, professional portfolio management, and blockchain-verifiable profit records through WOLV Token, we eliminate the trust gap that has historically separated mainstream investors from digital asset markets.",
      "Every WOLV token in circulation represents real, earned investor profit — verifiable on-chain, permanent, and publicly auditable. This is not marketing. It is mathematics recorded on an immutable ledger.",
      "We invite investors, auditors, regulators, and community members to verify everything we claim — on BSCScan, on SolidityScan, and on our published compliance documents. Trust should not be asked for. It should be earned and verifiable.",
      "WolvCapital. Your profits. On-chain. Forever.",
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
            {["12 Sections", "3 Verified Contracts", "1B WOLV Fixed Supply", "87/100 Audit Score"].map((badge) => (
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
              Verified Contract Addresses
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
                  href={`https://bscscan.com/address/${c.address}#code`}
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
