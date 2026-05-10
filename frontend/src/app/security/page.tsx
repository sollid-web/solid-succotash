import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Clock, Database, FileCheck, Lock, Server, Shield, ShieldCheck, Wallet } from "lucide-react";

export const metadata: Metadata = {
  title: "Security — WolvCapital | Enterprise-Grade Fund Protection",
  description:
    "WolvCapital employs enterprise-grade security: 256-bit SSL encryption, KYC/AML compliance, on-chain smart contracts with 48hr timelock, Chainlink oracles, and verified BSCScan contracts.",
};

const CONTRACTS = [
  { name: "WOLV Token",       address: "0xe0167279aef7bf4ad313d261da82e8366822270c", desc: "Fixed supply · No mint · BEP-20", url: "https://bscscan.com/address/0xe0167279aef7bf4ad313d261da82e8366822270c#code" },
  { name: "Reward Pool",      address: "0xb233cf74b14abf9d9702d585c540030125599579", desc: "48hr timelock · Treasury funded",  url: "https://bscscan.com/address/0xb233cf74b14abf9d9702d585c540030125599579#code" },
  { name: "Staking Contract", address: "0x4b62efee5695ed55cd362a0b818f4c5f9694322b", desc: "Chainlink oracle · Auditable",      url: "https://bscscan.com/address/0x4b62efee5695ed55cd362a0b818f4c5f9694322b#code" },
];

export default function SecurityPage(): JSX.Element {
  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-[#eff6ff] py-16 border-b border-[#dbeafe]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white border border-[#bfdbfe] px-4 py-2 text-xs font-semibold text-[#1E3A8A] mb-4">
            <ShieldCheck className="h-4 w-4" />
            Security & Fund Protection
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] mb-4" style={{ letterSpacing: '-0.02em' }}>
            Enterprise-Grade Security
          </h1>
          <p className="text-base sm:text-lg text-[#475569] max-w-3xl mx-auto mb-8">
            Your funds, data, and transactions are protected by industry-grade security controls, continuous monitoring, and verifiable on-chain smart contracts.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "256-bit Encryption", icon: Lock },
              { label: "KYC & AML", icon: FileCheck },
              { label: "On-Chain Contracts", icon: Shield },
              { label: "24/7 Monitoring", icon: Clock },
            ].map(({ label, icon: Icon }) => (
              <div key={label} className="rounded-xl bg-white border border-[#bfdbfe] px-3 py-4 text-sm font-semibold text-[#1E3A8A] text-center">
                <Icon className="h-4 w-4 mx-auto mb-2 text-[#2A52BE]" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blockchain Security — new section */}
      <section className="py-14 bg-[#0F172A]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-bold tracking-widest uppercase text-[#2A52BE] block mb-3">On-Chain Transparency</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3" style={{ letterSpacing: '-0.02em' }}>
              Verified Smart Contracts
            </h2>
            <p className="text-[#94A3B8] text-sm max-w-2xl mx-auto">
              All WolvCapital smart contracts are publicly verified on BSCScan. Anyone can read the source code, verify the logic, and monitor all transactions in real time — no trust required.
            </p>
          </div>

          {/* Contract addresses */}
          <div className="flex flex-col gap-4 mb-10">
            {CONTRACTS.map(c => (
              <div key={c.name} className="rounded-xl bg-white/5 border border-white/10 px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="text-white font-semibold text-sm mb-1">{c.name}</div>
                  <div className="text-[#64748B] text-xs mb-2">{c.desc}</div>
                  <div className="font-mono text-xs text-[#2A52BE] break-all">{c.address}</div>
                </div>
                <a href={c.url} target="_blank" rel="noopener noreferrer"
                  className="flex-shrink-0 px-4 py-2 rounded-lg bg-[#2A52BE]/15 border border-[#2A52BE]/30 text-white text-xs font-semibold hover:bg-[#2A52BE]/25 transition text-center">
                  View on BSCScan ↗
                </a>
              </div>
            ))}
          </div>

          {/* Blockchain protections */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: "🔒", title: "Fixed Supply",       desc: "1 billion WOLV minted once at deployment. No further minting is possible — enforced by contract code, not policy." },
              { icon: "⏱️", title: "48hr Timelock",      desc: "Any withdrawal from the reward pool must be publicly queued 48 hours before execution. No instant draining is possible." },
              { icon: "⚡", title: "Chainlink Oracles",  desc: "BNB/USD pricing is sourced from Chainlink — the industry standard for tamper-proof, decentralised price feeds." },
            ].map(f => (
              <div key={f.title} className="rounded-xl bg-white/5 border border-white/10 p-5">
                <div className="text-2xl mb-3">{f.icon}</div>
                <div className="text-white font-semibold text-sm mb-2">{f.title}</div>
                <div className="text-[#94A3B8] text-xs leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>

          {/* Audit status */}
          <div className="mt-6 rounded-xl bg-[#2A52BE]/10 border border-[#2A52BE]/30 px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="text-white font-semibold text-sm mb-1">Smart Contract Audit</div>
              <div className="text-[#94A3B8] text-xs">Full third-party security audit scheduled for Q3 2026. All contract source code is publicly readable on BSCScan in the meantime.</div>
            </div>
            <div className="flex-shrink-0 px-4 py-2 rounded-lg bg-[#f59e0b]/15 border border-[#f59e0b]/30 text-[#f59e0b] text-xs font-bold">
              Audit: Q3 2026
            </div>
          </div>
        </div>
      </section>

      {/* Platform Security Cards */}
      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-bold tracking-widest uppercase text-[#2A52BE] block mb-3">Platform Security</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mb-3" style={{ letterSpacing: '-0.02em' }}>
              Multi-Layer Protection
            </h2>
            <p className="text-[#64748B] text-sm max-w-xl mx-auto">
              Beyond the blockchain, WolvCapital employs enterprise-grade platform security at every layer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                title: "Account Protection",
                icon: Lock,
                bullets: ["Strong password enforcement", "Optional 2FA via authenticator apps", "Session & device monitoring", "Automatic logout on inactivity"],
              },
              {
                title: "Fund Handling",
                icon: Wallet,
                bullets: ["On-chain reward pool — visible to everyone", "Manual withdrawal validation", "Transparent transaction records", "48hr timelock on pool withdrawals"],
              },
              {
                title: "KYC & Anti-Fraud",
                icon: Shield,
                bullets: ["KYC verification required for withdrawals", "AML compliance monitoring", "Anomaly detection & human oversight", "Suspicious activity reporting"],
              },
              {
                title: "Data Security & Privacy",
                icon: Database,
                bullets: ["256-bit SSL encryption in transit", "Encrypted data at rest", "Restricted internal data access", "GDPR-aligned privacy policy"],
              },
              {
                title: "Infrastructure",
                icon: Server,
                bullets: ["Secure cloud hosting", "Automated daily backups", "DDoS protection", "24/7 uptime monitoring"],
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] p-5">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center border border-[#dbeafe] flex-shrink-0">
                      <Icon className="h-5 w-5 text-[#2A52BE]" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-[#0F172A] mb-2">{card.title}</h2>
                      <ul className="space-y-1">
                        {card.bullets.map(b => (
                          <li key={b} className="flex items-start gap-2 text-sm text-[#475569]">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#2A52BE] flex-shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Transparency Statement */}
      <section className="py-14 bg-[#eff6ff] border-t border-[#dbeafe]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-extrabold text-[#0F172A] mb-3" style={{ letterSpacing: '-0.02em' }}>Transparency Commitment</h2>
          <p className="text-sm sm:text-base text-[#475569] max-w-2xl mx-auto mb-8">
            WolvCapital maintains detailed internal records of all account activity and transactions. All smart contracts are publicly verifiable on BSCScan. If you notice any suspicious activity, contact our security team immediately.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/contact" className="inline-flex items-center justify-center rounded-[7px] px-6 py-3 text-sm font-bold bg-[#2A52BE] text-white hover:bg-[#244bb0] transition">
              Contact Security Team
            </Link>
            <a href="https://bscscan.com/address/0xe0167279aef7bf4ad313d261da82e8366822270c#code" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-[7px] px-6 py-3 text-sm font-bold border border-[#2A52BE] text-[#2A52BE] hover:bg-[#eff6ff] transition">
              View Contracts on BSCScan ↗
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}