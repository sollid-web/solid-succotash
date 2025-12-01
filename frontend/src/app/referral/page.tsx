// app/referral/page.tsx
import React from 'react';
import ReferralCTA from '../../components/ReferralCTA';
import PublicLayout from '../../components/PublicLayout';

export const metadata = {
  title: 'WolvCapital — Referral Program',
  description: 'Invite friends, earn rewards. Learn how WolvCapital referral program works and start earning.',
};

export default function ReferralPage() {
  // Replace with dynamic data where required (e.g., code from props/session)
  const exampleCode = 'WOLV-AF67P9';
  const signupUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/signup?ref=${exampleCode}`;

  return (
    <PublicLayout>
      <main className="min-h-screen bg-white">
      {/* Hero Section - Dark Navy Background */}
      <section className="bg-gradient-to-br from-[#1a2847] via-[#243555] to-[#2d4366] text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 5L5 12L20 19L35 12L20 5Z" fill="white" opacity="0.9"/>
                  <path d="M5 18V25L20 32L35 25V18" stroke="white" strokeWidth="2" opacity="0.9"/>
                </svg>
                <span className="text-xl font-semibold">WolvCapital</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
                Earn with<br />WolvCapital —<br />Referral Program
              </h1>

              <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                Share your unique referral link. When someone registers with your link and completes a qualifying investment action (first deposit of investment), you earn a commission-edito to your wallet.
              </p>

              {/* CTA Buttons */}
              <ReferralCTA signupUrl={signupUrl} />
            </div>

            {/* Right Column - Visual Card */}
            <div className="bg-gradient-to-br from-[#2d4879] to-[#1e3a5f] rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 bg-[#3d5a8f] rounded-2xl flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                    <path d="M20 5L5 12L20 19L35 12L20 5Z" fill="white" opacity="0.9"/>
                  </svg>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center relative">
                  <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-orange-300 to-orange-400 rounded-xl flex items-center justify-center shadow-lg">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L14 8H20L15 12L17 18L12 14L7 18L9 12L4 8H10L12 2Z" fill="white"/>
                    </svg>
                  </div>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="white" strokeWidth="2"/>
                    <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="w-16 h-16 bg-[#3d5a8f] rounded-2xl flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2"/>
                    <path d="M12 6v6l4 2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="w-14 h-14 bg-[#3d5a8f] rounded-2xl flex items-center justify-center opacity-70">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="white" strokeWidth="2"/>
                  </svg>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-center mb-4">
                Earn when you invite investors
              </h2>

              <p className="text-blue-100 text-center mb-6">
                Get a commission when your referrals make their first qualifying deposit.
              </p>

              <div className="bg-cyan-600 text-white rounded-xl px-6 py-3 text-center font-semibold">
                Share your link —grow youermigs
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Steps Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="w-24 h-24 bg-[#3d5a8f] rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
                <path d="M20 5L5 12L20 19L35 12L20 5Z" fill="white" opacity="0.9"/>
                <path d="M5 18V25L20 32L35 25V18" stroke="white" strokeWidth="2" opacity="0.9"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Unique referral link</h3>
            <p className="text-gray-600 leading-relaxed">
              Your personal code and shareable link — private to your account.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 relative">
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="3" fill="white"/>
                <circle cx="18" cy="16" r="2.5" fill="white" opacity="0.8"/>
                <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="white" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Verified activity only</h3>
            <p className="text-gray-600 leading-relaxed">
              Bonuses are paid after qualifying deposit/investment — not on clicks alone.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="w-24 h-24 bg-[#3d5a8f] rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2.5"/>
                <circle cx="15" cy="9" r="2" fill="white"/>
                <path d="M12 12l-3 3M12 12l3-3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Audit & security</h3>
            <p className="text-gray-600 leading-relaxed">
              All rewards are recorded in the transaction ledger and subject to fraud checks.
            </p>
          </div>
        </div>
      </section>

      {/* Reward Model Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Current Reward Model</h2>
            <p className="text-gray-700 text-lg mb-4">
              <span className="font-semibold">Standard: 2.5 %</span> of referred user's <span className="font-semibold">s first deposit.</span> Rewards are credited when the referred user's deposit clears.
            </p>

            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-3">Security & rules</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Self-referrals and duplicate accounts are blocked.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>High-value rewards may require KYC before withdrawal.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Admin retains the right to review and reverse fraudulent rewards.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold mb-6">FAQ</h2>
          <div className="grid gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">When do I get paid?</h3>
              <p className="text-gray-600">When the referred user completes a qualifying deposit or investment and the deposit is confirmed.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Can I refer unlimited people?</h3>
              <p className="text-gray-600">Yes — as long as referrals comply with our terms and anti-fraud policies.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">How do I track rewards?</h3>
              <p className="text-gray-600">Open your Referral Dashboard to see pending and credited referrals, plus transaction history.</p>
            </div>
          </div>
        </div>
      </section>
      </main>
    </PublicLayout>
  );
}
