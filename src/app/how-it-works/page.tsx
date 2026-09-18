import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works — WolvCapital | WOLV Staking on BNB Smart Chain",
  description:
    "Learn how WolvCapital works: create account, complete KYC, stake BNB or BUSD, earn WOLV token rewards, and trade WOLV on PancakeSwap V2. Smart contracts verified on BSCScan.",
  keywords:
    "how it works, WOLV staking, BNB Smart Chain staking, WOLV token, PancakeSwap WOLV, Web3 staking protocol, WolvCapital process, KYC staking, BEP20 staking",
  openGraph: {
    title: "How It Works — WolvCapital",
    description:
      "Step-by-step guide to WOLV staking on BNB Smart Chain. Earn WOLV token rewards. Trade on PancakeSwap V2. KYC/AML compliant.",
    images: ["/og-images/home-og.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How It Works — WolvCapital",
    description:
      "Stake BNB or BUSD, earn WOLV token rewards on BNB Smart Chain. WOLV now live on PancakeSwap V2.",
    images: ["/og-images/home-og.png"],
  },
};

const STEPS = [
  {
    num: "01",
    title: "Create Your Account",
    description:
      "Sign up with a valid email address and secure password. After email verification, your dashboard is activated with access to staking tiers, WOLV rewards tracking, and wallet connection — protected by KYC/AML compliance and SSL encryption.",
    icon: "👤",
    tag: "Getting Started",
  },
  {
    num: "02",
    title: "Complete KYC Verification",
    description:
      "Submit your identity documents for KYC review. This is required for AML compliance and protects all users on the platform. Verification is typically completed within 24 hours. Only verified users may stake and withdraw.",
    icon: "🪪",
    tag: "Compliance",
  },
  {
    num: "03",
    title: "Deposit BNB or BUSD",
    description:
      "Fund your staking position using BNB or BUSD on BNB Smart Chain. Deposits are recorded on-chain and reflected in your dashboard after blockchain confirmation. All transactions are secured with AML review.",
    icon: "💳",
    tag: "Funding",
  },
  {
    num: "04",
    title: "Choose a Staking Tier",
    description:
      "Select a WOLV staking tier matching your lock period preference. WolvCapital offers four tiers — Pioneer ($100+), Vanguard ($1,000+), Horizon ($5,000+), and Summit VIP ($15,000+) — each with a defined lock period and target APY.",
    icon: "📊",
    tag: "Staking",
  },
  {
    num: "05",
    title: "Earn WOLV Rewards On-Chain",
    description:
      "WOLV token rewards accumulate on BNB Smart Chain for the duration of your staking lock period. Your dashboard shows real-time reward accumulation, staking progress, and days remaining. All activity is verifiable on BSCScan.",
    icon: "📈",
    tag: "Rewards",
  },
  {
    num: "06",
    title: "Receive WOLV Tokens",
    description:
      "WOLV tokens are distributed to your connected wallet as on-chain proof of staking rewards. Connect MetaMask or Trust Wallet on your dashboard to receive and verify your WOLV balance on BNB Smart Chain. WOLV contract: 0xe0167279aef7bf4ad313d261da82e8366822270c",
    icon: "🪙",
    tag: "WOLV Token",
    highlight: true,
  },
  {
    num: "07",
    title: "Trade WOLV on PancakeSwap",
    description:
      "WOLV is now live on PancakeSwap V2 (BNB Smart Chain). Swap your earned WOLV for BNB directly from your wallet — no registration required. Track live price and chart on DEXScreener and DEXTools. Contract verified on BSCScan.",
    icon: "⬡",
    tag: "DEX Trading",
    highlight: true,
  },
  {
    num: "08",
    title: "Request a Withdrawal",
    description:
      "Submit a withdrawal request with your destination wallet address after your lock period ends. Requests undergo compliance review to confirm account ownership and transaction integrity — protecting you from unauthorized transfers.",
    icon: "💸",
    tag: "Withdrawal",
  },
  {
    num: "09",
    title: "Payout Release",
    description:
      "Once approved, your principal is released to your wallet via on-chain transaction. Network confirmation times vary by blockchain conditions. All payouts are recorded on BNB Smart Chain and verifiable on BSCScan.",
    icon: "🚀",
    tag: "Payout",
  },
  {
    num: "10",
    title: "Restake or Exit",
    description:
      "After your staking term completes, withdraw your principal and WOLV rewards or restake into a new tier. Diversify across staking tiers or exit at any maturity point. WOLV earned is tradeable on PancakeSwap at any time.",
    icon: "🔄",
    tag: "Restake",
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
    address: "0x7310f3e07627ce98246973e068bf2ff294f84e5f",
    note: "48-hour timelock · Funded with 1M WOLV",
  },
  {
    label: "Staking Contract",
    address: "0x7cd22f3c08b4195225da7d043cbe00da118d31ec",
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
            From account creation to on-chain WOLV rewards — a complete
            10-step guide to staking and trading on WolvCapital.
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
                href={c.label === 'Reward Pool' ? `https://bscscan.com/token/0xe0167279aef7bf4ad313d261da82e8366822270c?a=${c.address}` : `https://bscscan.com/address/${c.address}#code`}
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
            Join WolvCapital users staking BNB and earning WOLV token rewards
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
