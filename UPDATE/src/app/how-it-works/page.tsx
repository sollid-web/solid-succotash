import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How WolvCapital Works — WolvCapital",
  description:
    "Step-by-step explanation of WolvCapital's investment process — account creation, funding, plan activation, daily ROI, withdrawals and payouts.",
};

export default function HowItWorksPage(): JSX.Element {
  return (
    <main className="min-h-screen py-16 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-semibold mb-4">How WolvCapital Works</h1>
        <p className="text-gray-700 mb-8">
          A transparent, step-by-step explanation of our investment process — from account creation to payout.
        </p>

        <section className="space-y-8">
          <article>
            <h2 className="text-2xl font-medium">1. Create your account</h2>
            <p className="text-gray-600 mt-2">
              Sign up with a valid email and secure password. After verification, a secure investor dashboard is created
              for you. Your dashboard provides access to funding, plan selection, and account tools.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-medium">2. Fund your wallet</h2>
            <p className="text-gray-600 mt-2">
              Use supported deposit options (cryptocurrency). Deposits are recorded on-chain when applicable and reflected
              in your wallet after confirmation.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-medium">3. Choose an investment plan</h2>
            <p className="text-gray-600 mt-2">
              Select a plan that fits your target ROI, duration and capital. Plan details (daily ROI range, minimum/maximum,
              and duration) are displayed clearly before confirmation.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-medium">4. Plan activation</h2>
            <p className="text-gray-600 mt-2">
              After confirmation, the platform allocates the capital to the chosen plan and begins calculating returns
              immediately according to the plan rules.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-medium">5. Daily ROI earnings</h2>
            <p className="text-gray-600 mt-2">
              Returns are calculated and credited on a daily basis. Your dashboard shows daily earnings, cumulative profit,
              and remaining days for each active plan.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-medium">6. Request a withdrawal</h2>
            <p className="text-gray-600 mt-2">
              Submit a withdrawal request with the destination address. Requests are logged and enter our compliance review queue.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-medium">7. Manual review and approval</h2>
            <p className="text-gray-600 mt-2">
              Every withdrawal undergoes a manual verification to confirm account ownership and transaction integrity.
              This protects you from unauthorized or fraudulent transfers.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-medium">8. Payout release</h2>
            <p className="text-gray-600 mt-2">
              Once approved, the payout is released to your wallet. Network confirmation times depend on the chosen asset
              and blockchain conditions.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-medium">9. Reinvest or withdraw</h2>
            <p className="text-gray-600 mt-2">
              After completion you may withdraw capital and earnings or reinvest into a new plan. WolvCapital supports flexible
              portfolio management so you can diversify across plan tiers.
            </p>
          </article>
        </section>

        <div className="mt-10 border-t pt-8">
          <h3 className="text-xl font-medium mb-2">Need help?</h3>
          <p className="text-gray-600">
            If anything is unclear, visit our <a className="text-indigo-600 underline" href="/faq">FAQ</a> or contact support at{" "}
            <a className="text-indigo-600 underline" href="mailto:support@wolv-invest">support@wolv-invest</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
