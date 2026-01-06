import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Withdrawal Policy — WolvCapital",
  description:
    "WolvCapital withdrawal policy: eligibility, request process, verification, processing times, fees, and dispute handling.",
};

export default function WithdrawalPolicyPage(): JSX.Element {
  return (
    <main className="min-h-screen py-16 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4">Withdrawal Policy</h1>
        <p className="text-gray-700 mb-6">
          This page explains how withdrawals are processed, timelines, verification steps, and user responsibilities.
        </p>

        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-medium">Eligibility</h2>
            <p className="text-gray-600 mt-2">
              Withdrawals are available for accrued profits and, where permitted by the plan, for capital after the plan's
              minimum holding period. Withdrawals may be subject to minimum and maximum limits per request.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-medium">How to request a withdrawal</h2>
            <ol className="list-decimal ml-6 mt-2 text-gray-600">
              <li>Open your dashboard and navigate to the Withdrawals section.</li>
              <li>Enter the withdrawal amount and your destination wallet address.</li>
              <li>Confirm the request and submit. You will receive an email notification confirming receipt.</li>
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-medium">Verification & manual review</h2>
            <p className="text-gray-600 mt-2">
              Every request is reviewed by our compliance team. Verification may include:
            </p>
            <ul className="list-disc ml-6 mt-2 text-gray-600">
              <li>Identity checks and account ownership verification.</li>
              <li>Review of recent deposits and transaction history.</li>
              <li>Validation of the destination wallet address.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-medium">Processing times</h2>
            <p className="text-gray-600 mt-2">
              After approval, funds are sent and are subject to network confirmation times. Typical timelines:
            </p>
            <ul className="list-disc ml-6 mt-2 text-gray-600">
              <li>Internal review & approval: usually within 24–72 hours (business days).</li>
              <li>Blockchain network confirmations: variable depending on network congestion.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-medium">Fees & limits</h2>
            <p className="text-gray-600 mt-2">
              Standard network fees apply where applicable. Any platform fees will be disclosed before you confirm the
              withdrawal. Daily limits and verification thresholds may apply to protect the platform and users.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-medium">Cancellation & disputes</h2>
            <p className="text-gray-600 mt-2">
              Withdrawal requests cannot be reversed once approved and broadcast to the network. If you believe a request
              was unauthorized, contact support immediately with all relevant details.
            </p>
          </div>
        </section>

        <div className="mt-8 border-t pt-6">
          <p className="text-gray-600">
            For urgent issues email <a className="text-indigo-600 underline" href="mailto:support@mail.wolvcapital.com">support@mail.wolvcapital.com</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
