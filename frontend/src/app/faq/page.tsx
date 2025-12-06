import React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FAQ — WolvCapital | Common Questions About Digital Asset Investment",
  description: "Find answers to frequently asked questions about WolvCapital's investment plans, security features, withdrawals, verification process, and platform operations.",
}

export default function FAQPage(): JSX.Element {
  return (
    <main className="min-h-screen py-16 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4">Frequently Asked Questions (FAQ)</h1>
        <p className="text-gray-700 mb-6">Answers to the most common questions about WolvCapital and how the platform operates.</p>

        <section className="space-y-6">
          <article>
            <h2 className="text-xl font-medium">How do I sign up?</h2>
            <p className="text-gray-600 mt-2">Click “Sign Up” in the header, provide a valid email and password, then verify your account via email.</p>
          </article>

          <article>
            <h2 className="text-xl font-medium">What deposit methods are supported?</h2>
            <p className="text-gray-600 mt-2">We currently accept supported cryptocurrencies as listed on the deposit page. Deposit details appear in your wallet once confirmed.</p>
          </article>

          <article>
            <h2 className="text-xl font-medium">How long does it take to receive ROI?</h2>
            <p className="text-gray-600 mt-2">ROI is calculated daily and credited according to the plan schedule. Check your dashboard for daily breakdowns.</p>
          </article>

          <article>
            <h2 className="text-xl font-medium">Why are withdrawals manually reviewed?</h2>
            <p className="text-gray-600 mt-2">Manual review prevents fraudulent or unauthorized transfers and protects the entire user base. Verification is focused on account ownership and transaction integrity.</p>
          </article>

          <article>
            <h2 className="text-xl font-medium">Are there fees for withdrawals?</h2>
            <p className="text-gray-600 mt-2">Network fees apply where relevant. Any platform fees are disclosed before you confirm a withdrawal request.</p>
          </article>

          <article>
            <h2 className="text-xl font-medium">How do I contact support?</h2>
            <p className="text-gray-600 mt-2">Email <a className="text-indigo-600 underline" href="mailto:support@wolv-invest">support@wolv-invest</a> or use the contact form on the Contact page.</p>
          </article>

          <article>
            <h2 className="text-xl font-medium">Is WolvCapital regulated?</h2>
            <p className="text-gray-600 mt-2">Regulatory status is described in our legal pages. We operate with a focus on compliance and disclosure; please review our Risk Disclosure and Terms for details.</p>
          </article>
        </section>

        <div className="mt-8 border-t pt-6">
          <p className="text-gray-600">
            Still have a question? Reach out to <a className="text-indigo-600 underline" href="mailto:support@wolv-invest">support@wolv-invest</a>.
          </p>
        </div>
      </div>
    </main>
  )
}
