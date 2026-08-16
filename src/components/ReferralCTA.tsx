'use client';

import React from 'react';

interface ReferralCTAProps {
  signupUrl: string;
}

export default function ReferralCTA({ signupUrl }: ReferralCTAProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join WolvCapital',
        text: 'Start investing with WolvCapital',
        url: signupUrl,
      });
    } else {
      navigator.clipboard.writeText(signupUrl);
    }
  };

  return (
    <div className="flex flex-wrap gap-4">
      <button
        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition shadow-sm"
        onClick={handleShare}
        aria-label="Share referral link"
      >
        Share
      </button>

      <a
        href="/dashboard"
        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition shadow-sm"
        aria-label="View dashboard"
      >
        View Dashboard
      </a>
    </div>
  );
}
