import React from "react";
import ProfessionalFooter from '@/components/ProfessionalFooter';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security — WolvCapital | 256-bit Encryption & AML/KYC Compliance",
  description:
    "WolvCapital employs enterprise-grade security: 256-bit SSL encryption, KYC verification, AML compliance, 2FA, 24/7 fraud monitoring, and PCI-DSS standards.",
};

export default function SecurityPage(): JSX.Element {
  return (
    <main className="min-h-screen py-16 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-semibold mb-4">Security & Fund Protection</h1>
        <p className="text-gray-700 mb-6">
          Security is a core responsibility at WolvCapital. We combine technical controls, operational processes,
          and manual verification to protect user funds and personal data.
        </p>

        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-medium">Account Protection</h2>
            <ul className="list-disc ml-6 mt-2 text-gray-600">
              <li>Strong password requirements and rate-limited authentication attempts.</li>
              <li>Optional Two-Factor Authentication (2FA) via authenticator apps.</li>
              <li>Session monitoring and device management within your dashboard.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-medium">Fund Handling</h2>
            <p className="text-gray-600 mt-2">
              We use industry best practices for fund custody and transfers. Where applicable, deposits are received on-chain
              and recorded transparently. Withdrawal processing includes manual validation to prevent unauthorized transfers.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-medium">Manual Review & Anti-Fraud</h2>
            <p className="text-gray-600 mt-2">
              All withdrawal requests are subject to manual review. Our compliance and anti-fraud team verifies:
            </p>
            <ul className="list-disc ml-6 mt-2 text-gray-600">
              <li>Account ownership and KYC status (where required).</li>
              <li>Consistency of transaction history and deposit sources.</li>
              <li>Destination wallet verification and unusual activity flags.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-medium">Data Security & Privacy</h2>
            <p className="text-gray-600 mt-2">
              Personal data is processed in accordance with our <a className="text-indigo-600 underline" href="/privacy">Privacy Policy</a>.
              Data is encrypted at rest and in transit, and access is restricted to authorized personnel only.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-medium">Infrastructure & Monitoring</h2>
            <p className="text-gray-600 mt-2">
              We employ secure hosting, automated backups, network monitoring, and DDoS protection. Critical systems are
              monitored 24/7 and backed by incident response procedures.
            </p>
          </div>
        </section>

        <div className="mt-8 border-t pt-6">
          <h3 className="text-xl font-medium mb-2">Transparency & Reporting</h3>
          <p className="text-gray-600">
            We keep records of account actions and transactions to enable auditing and dispute resolution. If you suspect
            unauthorized activity, contact <a className="text-indigo-600 underline" href="mailto:support@wolvcapital.com">support@wolvcapital.com</a> immediately.
          </p>
        </div>
      </div>
      <ProfessionalFooter />
    </main>
  );
}
