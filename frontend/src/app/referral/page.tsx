import React from 'react';
import Image from 'next/image';
import ReferralCTA from '../../components/ReferralCTA';
import PublicLayout from '../../components/PublicLayout';
import ProfessionalFooter from '@/components/ProfessionalFooter';

export const metadata = {
  title: 'Referral Program — WolvCapital | Earn Lifetime Commissions',
  description: 'Join WolvCapital\'s referral program and earn lifetime commissions on every investment made by your referrals. Automatic tracking, instant payouts, and unlimited earning potential.',
  keywords: 'referral program, earn commissions, investment referrals, passive income, affiliate program, WolvCapital referrals',
  openGraph: {
    title: 'Referral Program — WolvCapital',
    description: 'Earn Rewards by Inviting Investors • Lifetime Commissions',
    images: ['/og-images/referral-og.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Referral Program — WolvCapital',
    description: 'Earn Rewards by Inviting Investors',
    images: ['/og-images/referral-og.png'],
  },
};

export default function ReferralPage() {
  // Replace with dynamic data where required (e.g., code from props/session)
  const exampleCode = 'WOLV-AF67P9';
  const signupUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/signup?ref=${exampleCode}`;

  return (
    <PublicLayout>
      <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-16 bg-gradient-to-br from-[#0b2f6b] to-[#2563eb] text-white">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6">WolvCapital Referral Program</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto px-4">Earn lifetime commissions by sharing investment opportunities with your network.</p>
        </div>
      </section>

      {/* OG Image Display */}
      <div className="w-full flex justify-center items-center py-8 bg-gray-50">
        <Image
          src="/og-images/referral-og.png"
          alt="Referral Program – Earn Rewards by Inviting Investors"
          width={1200}
          height={630}
          priority
          className="rounded-2xl shadow-2xl max-w-full h-auto"
        />
      </div>

      {/* Main Content */}
      <section className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="space-y-8 sm:space-y-12">
            {/* Overview */}
            <div>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
                The WolvCapital Referral Program allows active investors to earn additional income by introducing new members to the platform.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                Receive a percentage of every investment made by users you refer—automatically credited to your wallet.
              </p>
            </div>

            {/* How It Works */}
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0b2f6b] mb-4 sm:mb-6">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-white p-6 sm:p-8 rounded-2xl shadow-lg">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#0b2f6b] to-[#2563eb] rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white font-extrabold text-xl sm:text-2xl">1</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0b2f6b] mb-3">Share Your Link</h3>
                  <p className="text-base sm:text-lg text-gray-700">Find your unique referral link in your dashboard and share it with friends, family, or followers.</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-white p-6 sm:p-8 rounded-2xl shadow-lg">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white font-extrabold text-xl sm:text-2xl">2</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-purple-700 mb-3">They Join & Invest</h3>
                  <p className="text-base sm:text-lg text-gray-700">When new users sign up through your link and activate an investment plan, you qualify for commission.</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-white p-6 sm:p-8 rounded-2xl shadow-lg">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white font-extrabold text-xl sm:text-2xl">3</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-green-700 mb-3">Earn Rewards</h3>
                  <p className="text-base sm:text-lg text-gray-700">Your commission is credited automatically every time your referral makes an investment.</p>
                </div>
              </div>
            </div>

            {/* Commission Details */}
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0b2f6b] mb-4 sm:mb-6">Referral Rewards</h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
                You earn a fixed percentage of each investment made by your referrals. Specific rates vary by plan tier and referral activity level.
              </p>
              <ul className="space-y-3 text-base sm:text-lg text-gray-700 list-disc pl-6">
                <li>Lifetime earnings: Earn for every investment, not just the first</li>
                <li>Automatic tracking: No manual submission required</li>
                <li>Instant payouts: Commissions are deposited directly to your balance</li>
              </ul>
            </div>

            {/* Why Promote */}
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0b2f6b] mb-4 sm:mb-6">Why Promote WolvCapital?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <h3 className="text-xl font-bold text-[#0b2f6b] mb-2">Trusted Platform</h3>
                  <p className="text-base sm:text-lg text-gray-700">Established security, KYC compliance, and global investor base.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0b2f6b] mb-2">Proven Returns</h3>
                  <p className="text-base sm:text-lg text-gray-700">1%-2% daily ROI model backed by diversified digital asset strategies.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0b2f6b] mb-2">Simple Dashboard</h3>
                  <p className="text-base sm:text-lg text-gray-700">User-friendly interface makes onboarding effortless.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0b2f6b] mb-2">24/7 Support</h3>
                  <p className="text-base sm:text-lg text-gray-700">Help your referrals succeed with responsive customer assistance.</p>
                </div>
              </div>
            </div>

            {/* Program Rules */}
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0b2f6b] mb-4 sm:mb-6">Program Rules</h2>
              <ul className="space-y-3 text-base sm:text-lg text-gray-700 list-disc pl-6">
                <li>Only verified investors can participate in the referral program</li>
                <li>Referrals must use your unique link during registration</li>
                <li>Self-referrals and fraudulent activity result in account suspension</li>
                <li>WolvCapital reserves the right to modify or terminate the program at any time</li>
              </ul>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-[#0b2f6b] to-[#2563eb] p-6 sm:p-10 rounded-2xl text-center text-white">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Start Earning?</h3>
              <p className="text-base sm:text-lg text-gray-200 mb-6 max-w-2xl mx-auto">
                Log in to your dashboard to access your unique referral link and start building passive income today.
              </p>
              <a href="/dashboard" className="inline-block bg-white text-[#0b2f6b] px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl">
                Go to Dashboard
              </a>
            </div>
          </div>
        </div>
      </section>
      </main>
      <ProfessionalFooter />
    </PublicLayout>
  );
}
