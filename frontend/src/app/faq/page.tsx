import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ — How Wolv Capital Staking Works | BNB Investment Questions",
  description: "Answers to common questions about deposits, withdrawals, daily ROI, smart contract security, and the WOLV token. Everything you need before investing.",
  keywords: [
    "WolvCapital FAQ",
    "WOLV token questions",
    "staking FAQ",
    "investment platform FAQ",
    "digital asset investment questions",
    "withdrawal process",
    "KYC verification"
  ],
  openGraph: {
    title: "FAQ — WolvCapital",
    description:
      "Everything you need to know about investing, staking, and earning WOLV on WolvCapital.",
    url: "https://wolvcapital.com/faq",
    siteName: "WolvCapital",
    type: "website",
  },
};

const CATEGORIES = [
  {
    id: "getting-started",
    label: "Getting Started",
    icon: "🚀",
    questions: [
      {
        q: "What is WolvCapital?",
        a: "WolvCapital is a professionally managed digital asset investment platform. Investors deposit funds, choose a structured investment plan, and earn staking rewards — tracked live on a personal dashboard. Profits are distributed as WOLV tokens on BNB Smart Chain, giving every investor verifiable, blockchain-backed proof of their earnings.",
      },
      {
        q: "How do I create an account?",
        a: "Click Sign Up on the top right of any page. Enter your email and password, verify your email address, then complete KYC identity verification. Once KYC is approved, your dashboard is fully activated and you can make your first deposit.",
      },
      {
        q: "What is the minimum investment?",
        a: "The minimum is $100 on the Pioneer plan — our entry-level tier. Higher tiers start at $1,000 (Vanguard), $5,000 (Horizon), and $10,000 (Summit VIP). We recommend starting with Pioneer to familiarize yourself with the platform before committing larger capital.",
      },
      {
        q: "Is WolvCapital available in my country?",
        a: "WolvCapital serves investors globally. However, availability may be restricted based on local regulations in some jurisdictions. Complete KYC verification — the system will confirm your eligibility based on your country of residence during the verification process.",
      },
      {
        q: "Do I need crypto experience to use WolvCapital?",
        a: "No. WolvCapital is designed for both crypto-native and traditional investors. The dashboard is straightforward — deposit, choose a plan, and track returns. For WOLV Token features, a basic MetaMask or Trust Wallet is helpful but optional for the core investment experience.",
      },
    ],
  },
  {
    id: "investment-plans",
    label: "Investment Plans",
    icon: "📊",
    questions: [
      {
        q: "What investment plans are available?",
        a: "WolvCapital offers four plans: Pioneer ($100 min · 8% APY · 90 days), Vanguard ($1,000 min · 12% APY · 150 days), Horizon ($5,000 min · 18% APY · 180 days), and Summit VIP ($15,000 min · 25% APY · 365 days). Each plan has a fixed term and structured daily return.",
      },
      {
        q: "Are returns guaranteed?",
        a: "No investment platform can legally guarantee returns. WolvCapital's structured APY figures represent targets based on our portfolio management strategy and historical performance. Digital asset investments carry inherent risk including potential loss of principal. Please read our full Risk Disclosure before investing.",
      },
      {
        q: "Can I run multiple plans simultaneously?",
        a: "Yes. You can invest in multiple plans across different tiers at the same time. Each plan runs independently with its own term, ROI, and maturity date. This allows you to diversify your investment across timeframes and risk levels.",
      },
      {
        q: "What happens when my plan matures?",
        a: "When a plan reaches its maturity date, your principal and accumulated returns become available. You can withdraw the full amount, reinvest into a new plan, or do a combination of both. Your dashboard will notify you when a plan is approaching maturity.",
      },
      {
        q: "Can I withdraw before my plan matures?",
        a: "Plans operate on fixed terms and early withdrawal is subject to compliance review. We recommend only investing capital you do not require access to during the plan term. This is disclosed clearly before any investment is confirmed.",
      },
    ],
  },
  {
    id: "wolv-token",
    label: "WOLV Token",
    icon: "🪙",
    questions: [
      {
        q: "What is WOLV Token?",
        a: "WOLV is a BEP-20 token on BNB Smart Chain issued by WolvCapital as verifiable, on-chain proof of investor profits. Every dollar you earn on WolvCapital is distributed as WOLV tokens directly to your connected wallet — creating a permanent, publicly auditable record on the blockchain.",
      },
      {
        q: "How do I receive WOLV tokens?",
        a: "Log into your dashboard, scroll to the WOLV Token section, and click Connect Wallet. Connect your MetaMask or Trust Wallet, then click Add WOLV to Wallet. WOLV tokens will be sent to your wallet address when profits are distributed. No manual contract address entry is needed.",
      },
      {
        q: "What is the total supply of WOLV?",
        a: "WOLV has a fixed total supply of 1,000,000,000 (one billion) tokens. All tokens were minted to the WolvCapital treasury at deployment — no additional tokens can ever be created. The contract contains no mint function. This is verifiable on BSCScan at contract 0xe0167279aef7bf4ad313d261da82e8366822270c.",
      },
      {
        q: "Is WOLV tradeable on exchanges?",
        a: "Not yet. WOLV is currently earned exclusively through WolvCapital investment returns and staking rewards. WolvCapital plans to add WOLV liquidity on PancakeSwap and apply for CoinGecko and CoinMarketCap listings in Q3 2026. Early investors earning WOLV now will hold tokens before exchange listing.",
      },
      {
        q: "Can I verify my WOLV balance independently?",
        a: "Yes. Your WOLV balance is always publicly verifiable on BSCScan. Go to bscscan.com, paste the WOLV contract address (0xe0167279aef7bf4ad313d261da82e8366822270c), click Token Holders, and find your wallet address. Your balance is on-chain and cannot be altered by anyone.",
      },
      {
        q: "Why does my wallet show a security warning for WOLV?",
        a: "Some wallet security scanners (like Blockaid) flag newly deployed tokens with low transaction history. This is a standard warning for new tokens — not an indicator of malicious code. WOLV scored 87/100 on SolidityScan audit and has no malicious functions. The warning will reduce as transaction history and liquidity grow. You can verify the contract source code yourself on BSCScan.",
      },
    ],
  },
  {
    id: "staking",
    label: "Staking",
    icon: "⬡",
    questions: [
      {
        q: "What is WOLV staking?",
        a: "WOLV staking allows you to deposit your WOLV tokens into WolvCapital's audited staking contracts and earn additional APY rewards. It's a way to compound your investment earnings — the WOLV you earn from investment plans can be staked to generate further returns.",
      },
      {
        q: "What staking tiers are available?",
        a: "Four staking tiers are available: Pioneer (8% APY · 90-day lock), Vanguard (12% APY · 150-day lock), Horizon (18% APY · 180-day lock), and Summit VIP (25% APY · 365-day lock). Higher tiers offer better APY in exchange for longer lock periods.",
      },
      {
        q: "How are staking rewards calculated?",
        a: "Staking rewards are calculated using Chainlink price feeds integrated into the StakingContract. Chainlink's decentralized oracle network provides manipulation-resistant price data, ensuring APY calculations are fair and cannot be gamed by any single party.",
      },
      {
        q: "Is the staking reward pool safe?",
        a: "Yes. The RewardPool contract (0xb233cf74b14abf9d9702d585c540030125599579) is protected by a 48-hour timelock. No funds can be moved from the pool without a 48-hour delay — this prevents sudden unauthorized withdrawals. The pool balance is publicly visible on BSCScan at all times.",
      },
      {
        q: "How do I start staking?",
        a: "Log into your dashboard and click Stake WOLV in the navigation. Connect your wallet, select a staking tier, enter the amount of WOLV to stake, and confirm the transaction in MetaMask or Trust Wallet. Your stake is immediately active and rewards begin accruing.",
      },
      {
        q: "Can I unstake early?",
        a: "Each staking tier has a lock period. Unstaking before the lock period expires may result in forfeiture of accumulated rewards, depending on the tier terms. Full terms are displayed before you confirm any stake. We recommend staking only WOLV you do not need access to during the lock period.",
      },
      {
        q: "Are the staking contracts audited?",
        a: "Both the StakingContract and RewardPool are verified on BSCScan with public source code. The WOLV token contract scored 87/100 on SolidityScan. A full independent third-party audit of the staking contracts is planned for Q3 2026.",
      },
    ],
  },
  {
    id: "withdrawals",
    label: "Withdrawals",
    icon: "💸",
    questions: [
      {
        q: "How do I withdraw my funds?",
        a: "Log into your dashboard, go to Withdraw, enter your destination wallet address and the amount, then submit the request. Your request enters the compliance review queue. Once approved, the payout is released to your wallet. Processing times vary by tier.",
      },
      {
        q: "Why are withdrawals reviewed manually?",
        a: "Every withdrawal undergoes manual human review to confirm account ownership, verify the destination address, and screen for AML compliance. This protects you from unauthorized transfers and ensures every payout goes to the correct wallet. It is a security feature, not a restriction.",
      },
      {
        q: "How long do withdrawals take?",
        a: "Standard withdrawal processing is typically completed within 1–5 business days after approval. Summit VIP investors receive priority processing. Once released, on-chain confirmation time depends on BNB Smart Chain network conditions — usually under 30 seconds.",
      },
      {
        q: "What is the minimum withdrawal amount?",
        a: "Minimum withdrawal amounts vary by plan tier. Details are displayed in your dashboard when submitting a withdrawal request. Network transaction fees are separate from platform minimums and depend on current BNB gas prices.",
      },
    ],
  },
  {
    id: "security-compliance",
    label: "Security & Compliance",
    icon: "🛡️",
    questions: [
      {
        q: "Is WolvCapital regulated?",
        a: "Yes. WolvCapital is registered as an investment adviser with the U.S. Securities and Exchange Commission (SEC) and as a Money Services Business (MSB) with FinCEN. Full KYC/AML procedures are enforced on all accounts. Compliance disclosures are published at wolvcapital.com/compliance.",
      },
      {
        q: "How are my funds protected?",
        a: "Investor funds are held with licensed institutional custodians — not on the WolvCapital platform directly. This separates your assets from platform operations. Additionally, all platform connections are protected by 256-bit SSL encryption and all accounts require KYC verification.",
      },
      {
        q: "What is KYC and why is it required?",
        a: "KYC (Know Your Customer) is an identity verification process required by financial regulations globally. It protects you and the platform from fraud, money laundering, and unauthorized account access. Without KYC completion, deposits and withdrawals are not permitted.",
      },
      {
        q: "What happens if I suspect unauthorized activity?",
        a: "Contact our security team immediately at support via the dashboard or through wolvcapital.com/contact. Do not attempt any transactions. Our team will freeze your account pending investigation. We also recommend immediately changing your password and enabling two-factor authentication.",
      },
      {
        q: "Has WolvCapital been audited?",
        a: "The WOLV token smart contract has been analyzed on SolidityScan (score: 87/100). A full independent third-party security audit of the staking contracts is planned for Q3 2026. All smart contract source code is public and verifiable on BSCScan.",
      },
    ],
  },
  {
    id: "virtual-card",
    label: "Virtual Card",
    icon: "💳",
    questions: [
      {
        q: "What is the WolvCapital Virtual Card?",
        a: "The WolvCapital Virtual Visa Infinite Card allows you to spend your investment earnings directly — on Netflix, Spotify, Amazon, Apple Pay, Google Pay, Steam, Shopify, and 100+ other merchants worldwide. It is linked to your portfolio balance and available to all active investors.",
      },
      {
        q: "How do I get the Virtual Card?",
        a: "The Virtual Card is activated when you have an active investment plan. Log into your dashboard and click Virtual Card in the navigation. Your card details are generated automatically — no application or credit check required.",
      },
      {
        q: "Where can I use the Virtual Card?",
        a: "The card is accepted anywhere Visa is accepted — online globally. It works with Apple Pay and Google Pay for contactless payments. A full list of supported merchants is available in your dashboard under the Virtual Card section.",
      },
    ],
  },
];

export default function FAQPage() {
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
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        details { border-bottom: 1px solid rgba(255,255,255,0.06); }
        details:last-child { border-bottom: none; }
        summary { padding: 18px 0; cursor: pointer; list-style: none; display: flex; align-items: center; justify-content: space-between; gap: 16px; font-size: 15px; font-weight: 600; color: #fff; user-select: none; }
        summary::-webkit-details-marker { display: none; }
        summary::after { content: '+'; font-size: 20px; color: rgba(255,255,255,0.3); flex-shrink: 0; transition: transform 0.2s; }
        details[open] summary::after { content: '−'; color: #93c5fd; }
        details[open] summary { color: #93c5fd; }
        .answer { padding: 0 0 18px; font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.8; }
        .cat-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; padding: 28px 32px; margin-bottom: 16px; }
        .cat-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .cat-icon { width: 40px; height: 40px; border-radius: 10px; background: rgba(42,82,190,0.15); border: 1px solid rgba(42,82,190,0.25); display: flex; align-items: center; justify-content: center; font-size: 18px; }
      `}</style>

      {/* Hero */}
      <section
        style={{
          padding: "100px 24px 56px",
          textAlign: "center",
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(42,82,190,0.12) 0%, transparent 70%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
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
            Support
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
            Frequently Asked Questions
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.7,
              marginBottom: "32px",
            }}
          >
            Everything you need to know about investing, staking, and earning
            WOLV on WolvCapital.
          </p>
          {/* Category pills */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {CATEGORIES.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "99px",
                  padding: "6px 16px",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.6)",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "all 0.15s",
                }}
              >
                {cat.icon} {cat.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section
        style={{ maxWidth: "860px", margin: "0 auto", padding: "56px 24px 100px" }}
      >
        {CATEGORIES.map((cat) => (
          <div key={cat.id} id={cat.id} style={{ scrollMarginTop: "80px" }}>
            <div className="cat-card">
              <div className="cat-header">
                <div className="cat-icon">{cat.icon}</div>
                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: "-0.3px",
                  }}
                >
                  {cat.label}
                </h2>
                <span
                  style={{
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.3)",
                    marginLeft: "auto",
                  }}
                >
                  {cat.questions.length} questions
                </span>
              </div>
              {cat.questions.map((item, i) => (
                <details key={i}>
                  <summary>{item.q}</summary>
                  <div className="answer">{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        ))}

        {/* Still have questions */}
        <div
          style={{
            marginTop: "16px",
            background: "linear-gradient(135deg,rgba(42,82,190,0.1),rgba(42,82,190,0.05))",
            border: "1px solid rgba(42,82,190,0.2)",
            borderRadius: "20px",
            padding: "40px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>💬</div>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#fff",
              marginBottom: "10px",
            }}
          >
            Still have questions?
          </h3>
          <p
            style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.45)",
              marginBottom: "24px",
              lineHeight: 1.7,
            }}
          >
            Our support team is available 24/7. You can also read our full
            platform documentation in the whitepaper.
          </p>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/dashboard/support"
              style={{
                background: "linear-gradient(135deg,#2A52BE,#1d4ed8)",
                color: "#fff",
                padding: "12px 28px",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              Live Chat Support
            </Link>
            <Link
              href="/whitepaper"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                padding: "12px 28px",
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              Read Whitepaper
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
