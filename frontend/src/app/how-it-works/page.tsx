import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works — WolvCapital | Digital Asset Investment & Staking",
  description:
    "Learn how WolvCapital works: create account, choose plan, deposit funds, earn daily ROI, stake WOLV tokens, and withdraw profits. Fully compliant, blockchain-verified investment platform.",
  keywords:
    "how it works, investment process, digital asset investment, WOLV staking, cryptocurrency investment, ROI tracking, secure investment platform, WolvCapital process",
  openGraph: {
    title: "How It Works — WolvCapital",
    description:
      "Step-by-step guide to investing and staking on WolvCapital. Earn daily ROI + WOLV token rewards. KYC/AML compliant.",
    images: ["/og-images/home-og.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How It Works — WolvCapital",
    description:
      "Invest, earn daily ROI, stake WOLV tokens. Professional digital asset investment platform.",
    images: ["/og-images/home-og.png"],
  },
};

const STEPS = [
  {
    num: "01",
    title: "Create Your Account",
    description:
      "Sign up with a valid email address and secure password. After email verification, your investor dashboard is activated with access to deposits, plan selection, and portfolio tracking — all protected by AML/KYC compliance and 256-bit SSL encryption.",
    icon: "👤",
    tag: "Getting Started",
  },
  {
    num: "02",
    title: "Complete KYC Verification",
    description:
      "Submit your identity documents for KYC review. This is required by regulation and protects every investor on the platform. Verification is typically completed within 24 hours. Only verified investors may deposit and withdraw.",
    icon: "🪪",
    tag: "Compliance",
  },
  {
    num: "03",
    title: "Make a Deposit",
    description:
      "Fund your account using supported cryptocurrencies. Deposits are recorded and reflected in your wallet after blockchain confirmation. All transactions are secured with institutional-grade encryption and AML review.",
    icon: "💳",
    tag: "Funding",
  },
  {
    num: "04",
    title: "Choose an Investment Plan",
    description:
      "Select a plan matching your capital level and investment horizon. WolvCapital offers four tiers — Pioneer ($100+), Vanguard ($1,000+), Horizon ($5,000+), and Summit VIP ($10,000+) — each with a fixed term and structured daily ROI.",
    icon: "📊",
    tag: "Investment",
  },
  {
    num: "05",
    title: "Earn Daily Returns",
    description:
      "Returns are calculated and credited daily. Your dashboard shows real-time earnings, cumulative profit, plan progress, and days remaining. All returns are tracked transparently with on-chain verification via the WOLV Token system.",
    icon: "📈",
    tag: "Returns",
  },
  {
    num: "06",
    title: "Receive WOLV Profit Tokens",
    description:
      "As your plan generates returns, WOLV tokens are distributed to your connected wallet as blockchain-backed proof of earnings. Connect MetaMask or Trust Wallet on your dashboard to receive and verify your WOLV balance on BNB Smart Chain.",
    icon: "🪙",
    tag: "WOLV Token",
    highlight: true,
  },
  {
    num: "07",
    title: "Stake WOLV for Additional Rewards",
    description:
      "Take your WOLV earnings further by staking them in WolvCapital's audited staking contracts. Choose from four staking tiers (Starter, Growth, Pro, Elite) offering 8%–25% APY. Rewards are powered by Chainlink price feeds and a 48-hour timelock-protected reward pool.",
    icon: "⬡",
    tag: "Staking",
    highlight: true,
  },
  {
    num: "08",
    title: "Request a Withdrawal",
    description:
      "Submit a withdrawal request with your destination wallet address. Requests enter our compliance review queue. Every withdrawal undergoes manual verification to confirm account ownership and transaction integrity — protecting you from unauthorized transfers.",
    icon: "💸",
    tag: "Withdrawal",
  },
  {
    num: "09",
    title: "Payout Release",
    description:
      "Once approved, your payout is released to your wallet. Network confirmation times vary by asset and blockchain conditions. All payouts are processed with institutional-grade security and full audit trail.",
    icon: "🚀",
    tag: "Payout",
  },
  {
    num: "10",
    title: "Reinvest or Exit",
    description:
      "After plan completion, withdraw your capital and earnings or reinvest into a new plan. WolvCapital supports flexible portfolio management — diversify across plan tiers, compound returns, or exit at any maturity point.",
    icon: "🔄",
    tag: "Portfolio",
  },
];

const CONTRACTS = [
  {
    label: "WOLV Token",
    address: "0xe0167279aef7bf4ad313d261da82e8366822270c",
    note: "Fixed supply BEP-20 · 1 Billion hard cap",
  },
  {
    label: "Reward Pool",
    address: "0xb233cf74b14abf9d9702d585c540030125599579",
    note: "48-hour timelock · Funded with 1M WOLV",
  },
  {
    label: "Staking Contract",
    address: "0x4b62efee5695ed55cd362a0b818f4c5f9694322b",
    note: "Chainlink price feeds · 4 staking tiers",
  },
];

export default function HowItWorksPage() {
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
        .step-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; padding: 28px; transition: all 0.3s ease; }
        .step-card:hover { border-color: rgba(42,82,190,0.4); transform: translateY(-2px); box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
        .step-card.highlight { background: rgba(42,82,190,0.06); border-color: rgba(42,82,190,0.2); }
        .step-card.highlight:hover { border-color: rgba(42,82,190,0.5); }
        .tag { display: inline-block; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
        .contract-row { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
      `}</style>

      {/* Hero */}
      <section
        style={{
          padding: "100px 24px 64px",
          textAlign: "center",
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(42,82,190,0.15) 0%, transparent 70%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
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
              fontSize: "12px",
              color: "#93c5fd",
              fontWeight: 600,
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            Platform Guide
          </div>
          <h1
            style={{
              fontSize: "clamp(36px,6vw,60px)",
              fontWeight: 800,
              letterSpacing: "-1.5px",
              lineHeight: 1.1,
              marginBottom: "20px",
              color: "#fff",
            }}
          >
            How WolvCapital Works
          </h1>
          <p
            style={{
              fontSize: "17px",
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.7,
              marginBottom: "36px",
            }}
          >
            From account creation to blockchain-verified profits — a complete
            10-step guide to investing, earning, and staking on WolvCapital.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/accounts/signup"
              style={{
                background: "linear-gradient(135deg,#2A52BE,#1d4ed8)",
                color: "#fff",
                padding: "14px 32px",
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "15px",
                textDecoration: "none",
                boxShadow: "0 8px 32px rgba(42,82,190,0.3)",
              }}
            >
              Get Started →
            </Link>
            <Link
              href="/plans"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                padding: "14px 32px",
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "15px",
                textDecoration: "none",
              }}
            >
              View Plans
            </Link>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section style={{ padding: "72px 24px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className={`step-card${step.highlight ? " highlight" : ""}`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                {/* Step number */}
                <div style={{ flexShrink: 0 }}>
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "14px",
                      background: step.highlight
                        ? "linear-gradient(135deg,#2A52BE,#1d4ed8)"
                        : "rgba(255,255,255,0.06)",
                      border: step.highlight
                        ? "none"
                        : "1px solid rgba(255,255,255,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      fontWeight: 700,
                      color: step.highlight ? "#fff" : "rgba(255,255,255,0.4)",
                      fontFamily: "monospace",
                    }}
                  >
                    {step.num}
                  </div>
                </div>
                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span style={{ fontSize: "22px" }}>{step.icon}</span>
                    <h2
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "#fff",
                        letterSpacing: "-0.3px",
                      }}
                    >
                      {step.title}
                    </h2>
                    <span
                      className="tag"
                      style={{
                        background: step.highlight
                          ? "rgba(42,82,190,0.2)"
                          : "rgba(255,255,255,0.06)",
                        color: step.highlight ? "#93c5fd" : "rgba(255,255,255,0.4)",
                        border: step.highlight
                          ? "1px solid rgba(42,82,190,0.3)"
                          : "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {step.tag}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "rgba(255,255,255,0.5)",
                      lineHeight: 1.75,
                      margin: 0,
                    }}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Smart Contracts */}
      <section
        style={{
          padding: "0 24px 72px",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: "28px" }}>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.5px",
              marginBottom: "8px",
            }}
          >
            Verified Smart Contracts
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.4)",
              fontFamily: "'DM Sans', system-ui",
            }}
          >
            All contracts are open-source and verified on BSCScan. No hidden
            code.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {CONTRACTS.map((c) => (
            <div key={c.label} className="contract-row">
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: "4px",
                  }}
                >
                  {c.label}
                </div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "12px",
                    color: "#93c5fd",
                    wordBreak: "break-all",
                    marginBottom: "4px",
                  }}
                >
                  {c.address}
                </div>
                <div
                  style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}
                >
                  {c.note}
                </div>
              </div>
              <a
                href={`https://bscscan.com/address/${c.address}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "rgba(42,82,190,0.15)",
                  border: "1px solid rgba(42,82,190,0.3)",
                  color: "#93c5fd",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  fontSize: "12px",
                  fontWeight: 600,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                BSCScan ↗
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "0 24px 100px", textAlign: "center" }}>
        <div
          style={{
            maxWidth: "680px",
            margin: "0 auto",
            background:
              "linear-gradient(135deg,rgba(42,82,190,0.12),rgba(42,82,190,0.06))",
            border: "1px solid rgba(42,82,190,0.25)",
            borderRadius: "24px",
            padding: "56px 40px",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(26px,4vw,38px)",
              fontWeight: 800,
              letterSpacing: "-1px",
              marginBottom: "14px",
            }}
          >
            Ready to Start?
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: "15px",
              marginBottom: "32px",
              lineHeight: 1.7,
            }}
          >
            Join WolvCapital investors earning daily ROI and WOLV token rewards
            on BNB Smart Chain. Start with as little as $100.
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
              href="/accounts/signup"
              style={{
                background: "linear-gradient(135deg,#2A52BE,#1d4ed8)",
                color: "#fff",
                padding: "14px 32px",
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "15px",
                textDecoration: "none",
                boxShadow: "0 8px 32px rgba(42,82,190,0.3)",
              }}
            >
              Create Account →
            </Link>
            <Link
              href="/dashboard/stake"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                padding: "14px 32px",
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "15px",
                textDecoration: "none",
              }}
            >
              Stake WOLV
            </Link>
          </div>
          <div
            style={{
              marginTop: "24px",
              fontSize: "13px",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            Have questions?{" "}
            <Link href="/faq" style={{ color: "#93c5fd" }}>
              Read our FAQ
            </Link>{" "}
            or{" "}
            <Link href="/contact" style={{ color: "#93c5fd" }}>
              contact support
            </Link>
            .
          </div>
        </div>
      </section>
    </div>
  );
}
