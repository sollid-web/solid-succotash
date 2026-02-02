import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works — WolvCapital | Digital Asset Investment Process",
  description:
    "Learn how WolvCapital works: create account, choose plan, deposit funds, track returns. Simple 8-step process for secure digital asset investment with 1%–2% daily ROI, AML/KYC compliance, and professional monitoring.",
  keywords: "how it works, investment process, digital asset investment, cryptocurrency investment, ROI tracking, secure investment platform, WolvCapital process, investment steps",
  openGraph: {
    title: "How It Works — WolvCapital | Investment Process",
    description: "Simple 8-step process: Create account → Deposit → Choose plan → Earn 1%–2% daily ROI → Withdraw profits. Professional digital asset investment platform.",
    images: ["/og-images/home-og.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How It Works — WolvCapital",
    description: "8-step investment process for secure digital asset growth with 1%–2% daily ROI",
    images: ["/og-images/home-og.png"],
  },
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen relative">
      {/* Full-page background hero image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/legal/home-hero.png"
          alt="WolvCapital - Secure Digital Asset Investment Platform"
          fill
          priority
          className="object-cover object-center"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/70 to-black/80" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-2xl mb-6">
              How It Works
            </h1>
            <p className="text-xl md:text-2xl text-white/95 drop-shadow-lg mb-8 max-w-3xl mx-auto leading-relaxed">
              Simple 8-step process for secure digital asset investment with 1%–2% daily ROI
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link 
                href="/accounts/signup" 
                className="btn-cta-sky inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-xl"
              >
                Get Started Now
              </Link>
              <Link 
                href="/plans" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/80 rounded-xl backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all duration-300"
              >
                View Investment Plans
              </Link>
            </div>
          </div>
        </section>

        {/* Main Content with Glass Effect */}
        <div className="max-w-5xl mx-auto px-4 pb-16">
          <div className="backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
            {/* Step-by-step process */}
            <div className="space-y-8">
              {[
                {
                  num: "01",
                  title: "Create Account",
                  description: "Sign up with a valid email and secure password. After verification, a secure investor dashboard is created for you. Your dashboard provides access to funding, plan selection, and account tools with AML/KYC compliance.",
                  icon: "👤"
                },
                {
                  num: "02",
                  title: "Make Deposit",
                  description: "Use supported deposit options (cryptocurrency). Deposits are recorded on-chain when applicable and reflected in your wallet after confirmation. All transactions are secured with 256-bit encryption.",
                  icon: "💳"
                },
                {
                  num: "03",
                  title: "Choose Plan",
                  description: "Select a plan that fits your target ROI, duration and capital. Plan details (daily ROI range, minimum/maximum, and duration) are displayed clearly before confirmation. Choose from Pioneer, Vanguard, Horizon, or Summit tiers.",
                  icon: "📊"
                },
                {
                  num: "04",
                  title: "Earn Returns",
                  description: "Returns are calculated and credited on a daily basis. Your dashboard shows daily earnings, cumulative profit, and remaining days for each active plan. Track real-time ROI with transparent reporting.",
                  icon: "📈"
                },
                {
                  num: "05",
                  title: "Request Withdrawal",
                  description: "Submit a withdrawal request with the destination address. Requests are logged and enter our compliance review queue. Flexible withdrawal schedules based on your plan tier.",
                  icon: "💸"
                },
                {
                  num: "06",
                  title: "Manual Review & Approval",
                  description: "Every withdrawal undergoes a manual verification to confirm account ownership and transaction integrity. This protects you from unauthorized or fraudulent transfers with professional monitoring.",
                  icon: "✅"
                },
                {
                  num: "07",
                  title: "Payout Release",
                  description: "Once approved, the payout is released to your wallet. Network confirmation times depend on the chosen asset and blockchain conditions. All payouts are processed with industry-grade security.",
                  icon: "🚀"
                },
                {
                  num: "08",
                  title: "Reinvest or Withdraw",
                  description: "After completion you may withdraw capital and earnings or reinvest into a new plan. WolvCapital supports flexible portfolio management so you can diversify across plan tiers for optimized returns.",
                  icon: "🔄"
                }
              ].map((step) => (
                <div key={step.num} className="flex gap-6 p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                      {step.num}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{step.icon}</span>
                      <h2 className="text-2xl font-bold text-gray-900">{step.title}</h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-lg">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action Section */}
            <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white text-center">
              <h3 className="text-3xl font-bold mb-4">Ready to Start Growing Your Digital Assets?</h3>
              <p className="text-xl mb-6 text-blue-100">Join 45,000+ global investors earning 1%–2% daily ROI with professional monitoring and AML/KYC compliance.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  href="/accounts/signup" 
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold bg-white text-blue-700 rounded-xl shadow-2xl hover:bg-blue-50 hover:scale-105 transition-all duration-300"
                >
                  Create Free Account
                </Link>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  Contact Support
                </Link>
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-10 pt-8 border-t border-gray-200 text-center">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Need Help?</h3>
              <p className="text-gray-700 text-lg mb-6">
                If anything is unclear, visit our{" "}
                <Link className="text-blue-600 font-semibold hover:underline" href="/faq">
                  FAQ
                </Link>
                {" "}or{" "}
                <Link className="text-blue-600 font-semibold hover:underline" href="/contact">
                  Contact Support
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
