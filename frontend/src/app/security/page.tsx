import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Clock, Database, FileCheck, Lock, Server, Shield, ShieldCheck, Wallet } from "lucide-react";

export const metadata: Metadata = {
  title: "Security — WolvCapital | 256-bit Encryption & AML/KYC Compliance",
  description:
    "WolvCapital employs enterprise-grade security: 256-bit SSL encryption, KYC verification, AML compliance, 2FA, 24/7 fraud monitoring, and PCI-DSS standards.",
};

export default function SecurityPage(): JSX.Element {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#F2F9FF] py-14">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-blue-100 px-4 py-2 text-xs font-semibold text-[#0b2f6b]">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Security & Fund Protection
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0b2f6b]">
            Security & Fund Protection
          </h1>
          <p className="mt-3 text-base sm:text-lg text-gray-700 max-w-3xl mx-auto">
            Your funds, data, and transactions are protected by industry-grade security controls and continuous monitoring.
          </p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Encrypted Data", icon: Lock },
              { label: "KYC & AML", icon: FileCheck },
              { label: "Manual Withdrawal Review", icon: Shield },
              { label: "24/7 Monitoring", icon: Clock },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-xl bg-white border border-blue-100 px-3 py-4 text-sm font-semibold text-[#0b2f6b]">
                  <Icon className="h-4 w-4 mx-auto mb-2 text-[#4AB3F4]" aria-hidden="true" />
                  {item.label}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Cards */}
      <section className="py-14">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                title: "Account Protection",
                icon: Lock,
                bullets: [
                  "Strong password enforcement",
                  "Optional 2FA via authenticator apps",
                  "Session & device monitoring",
                ],
              },
              {
                title: "Fund Handling",
                icon: Wallet,
                bullets: [
                  "Industry-standard custody practices",
                  "Transparent transaction records",
                  "Manual withdrawal validation",
                ],
              },
              {
                title: "Manual Review & Anti-Fraud",
                icon: Shield,
                bullets: [
                  "Compliance review on withdrawals",
                  "KYC verification where required",
                  "Anomaly detection & human oversight",
                ],
              },
              {
                title: "Data Security & Privacy",
                icon: Database,
                bullets: [
                  "Encrypted data at rest & in transit",
                  "Restricted internal access",
                  "Privacy policy compliance",
                ],
              },
              {
                title: "Infrastructure & Monitoring",
                icon: Server,
                bullets: [
                  "Secure hosting",
                  "Automated backups",
                  "DDoS protection",
                  "24/7 system monitoring",
                ],
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="rounded-2xl bg-[#F2F9FF] border border-blue-100 p-5">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center border border-blue-100">
                      <Icon className="h-5 w-5 text-[#4AB3F4]" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[#0b2f6b]">{card.title}</h2>
                      <ul className="mt-2 space-y-1 text-sm text-gray-700">
                        {card.bullets.map((bullet) => (
                          <li key={bullet} className="flex items-start gap-2">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#4AB3F4]" aria-hidden="true" />
                            <span>{bullet}</span>
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
      <section className="py-12 bg-[#F2F9FF]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-[#0b2f6b]">Transparency Commitment</h2>
          <p className="mt-3 text-sm sm:text-base text-gray-700">
            Wolv Capital maintains detailed internal records of account activity and transactions.
            If you notice any suspicious activity, contact our security team immediately.
          </p>
          <div className="mt-6">
            <Link href="/contact" className="btn-cta-sky inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm sm:text-base font-bold">
              Contact Security Support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
