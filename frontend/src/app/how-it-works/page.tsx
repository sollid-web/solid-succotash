import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works — WolvCapital | Digital Asset Investment Process",
  description:
    "Learn how WolvCapital works: create account, choose plan, deposit funds, track returns. Simple 4-step process for secure digital asset investment with 1%–2% daily ROI.",
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">How It Works</h1>
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Create Account</h2>
            <p className="text-gray-700">
              Sign up with a valid email and secure password. After verification, a secure investor dashboard is created
              for you. Your dashboard provides access to funding, plan selection, and account tools.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3">2. Make Deposit</h2>
            <p className="text-gray-700">
              Use supported deposit options (cryptocurrency). Deposits are recorded on-chain when applicable and reflected
              in your wallet after confirmation.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Choose Plan</h2>
            <p className="text-gray-700">
              Select a plan that fits your target ROI, duration and capital. Plan details (daily ROI range, minimum/maximum,
              and duration) are displayed clearly before confirmation.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Earn Returns</h2>
            <p className="text-gray-700">
              Returns are calculated and credited on a daily basis. Your dashboard shows daily earnings, cumulative profit,
              and remaining days for each active plan.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Request a Withdrawal</h2>
            <p className="text-gray-700">
              Submit a withdrawal request with the destination address. Requests are logged and enter our compliance review queue.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3">6. Manual Review and Approval</h2>
            <p className="text-gray-700">
              Every withdrawal undergoes a manual verification to confirm account ownership and transaction integrity.
              This protects you from unauthorized or fraudulent transfers.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3">7. Payout Release</h2>
            <p className="text-gray-700">
              Once approved, the payout is released to your wallet. Network confirmation times depend on the chosen asset
              and blockchain conditions.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3">8. Reinvest or Withdraw</h2>
            <p className="text-gray-700">
              After completion you may withdraw capital and earnings or reinvest into a new plan. WolvCapital supports flexible
              portfolio management so you can diversify across plan tiers.
            </p>
          </section>
        </div>

        <div className="mt-10 border-t pt-8">
          <h3 className="text-xl font-medium mb-2">Need help?</h3>
          <p className="text-gray-600">
            If anything is unclear, visit our{" "}
            <a className="text-indigo-600 underline" href="/faq">
              FAQ
            </a>{" "}
            or contact support at{" "}
            <a className="text-indigo-600 underline" href="mailto:support@wolv-invest">
              support@wolv-invest
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
