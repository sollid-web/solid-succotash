import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vanguard Plan information — WolvCapital',
  description: 'Review current plan information for WolvCapital Vanguard staking plan. BNB Smart Chain on-chain rewards. Minimum $1,000. current account terms apply.',
  alternates: { canonical: 'https://www.wolvcapital.com/plans/vanguard' },
  openGraph: {
    title: 'Vanguard Plan information — WolvCapital',
    description: 'Review current plan information for WolvCapital Vanguard staking plan. BNB Smart Chain on-chain rewards. Minimum $1,000. current account terms apply.',
    url: 'https://www.wolvcapital.com/plans/vanguard',
    images: [{ url: '/og-images/plans-og.png', width: 1200, height: 630 }],
    type: 'website',
  },
  robots: { index: true, follow: true },
}

import PlanDetailPage from "@/components/PlanDetailPage";

export default function VanguardPlanPage() {
  return (
    <PlanDetailPage
      plan={{
        slug: "vanguard",
        name: "Vanguard",
        subtitleLine: "1.25% Daily outcome • 150 Days",
        supportingLine:
          "Minimum $1,000 to $4,999 • Balanced structure for investors who want clear terms and oversight.",
        dailyRoiPct: 1.25,
        durationDays: 150,
        minUsd: 1000,
        maxUsd: 4999,
        ctaLabel: "Start Vanguard Plan",
        ctaMicrotext: "Supported assets vary by current terms • current account terms apply • Review current security and privacy terms",
        secondaryLinkLabel: "View outcome Calculator",
        highlightsTitle: "What you get with Vanguard",
        highlightsNote: "Transparent tracking inside your dashboard, updated daily.",
        calculatorTitle: "Review Vanguard terms",
        calculatorHelper:
          "Enter an amount within the plan limits to see estimated outcomes.",
        calculatorCtaLabel: "Continue to Deposit & Activate",
        positioningTitle: "Designed for balanced structure",
        positioningBody:
          "The Vanguard Plan offers a measured approach with current plan terms visibility and defined limits. It’s a solid fit for investors who want structure without the longest lockup.",
        positioningBullets: [
          "You want a balanced plan with a mid-range outcome",
          "You’re comfortable with a 150-day structure window",
          "You prefer consistent dashboard tracking over constant trading",
          "You value clear account and security information",
        ],
        activationTitle: "Activate in minutes",
        activationSteps: [
          "Create / Log in to your account",
          "Review account information and current eligibility terms",
          "Deposit USDT or BTC and select Vanguard Plan",
        ],
        activationCtaLabel: "Start Vanguard Plan Now",
        trustTitle: "Security & disclosure first",
        trustBody:
          "Wolv Capital follows account and security information designed to help visitors review the platform. Your dashboard, transactions, and verification steps are protected using modern encryption standards.",
        trustBullets: [
          "Account and activity terms",
          "Encrypted data handling",
          "Secure login protections (2FA recommended)",
          "24/7 Support availability",
        ],
        trustLinkLabel: "Read our Security Standards",
        faqTitle: "Vanguard Plan FAQs",
        faqs: [
          {
            q: "What’s the minimum and maximum for Vanguard?",
            a: "The Vanguard Plan accepts investments from $1,000 to $4,999.",
          },
          {
            q: "When is outcome credited?",
            a: "outcome is shown according to current terms and can be tracked in your dashboard.",
          },
          {
            q: "What account information may be requested?",
            a: "The platform may request account or eligibility information before particular features become available.",
          },
          {
            q: "Which assets can I deposit?",
            a: "You can deposit USDT or BTC (supported networks will be shown at deposit).",
          },
          {
            q: "Can I withdraw anytime?",
            a: "The platform supports flexible withdrawals according to the withdrawal rules shown in your dashboard.",
          },
        ],
        finalCtaHeadline: "Ready to activate Vanguard?",
        finalCtaSubhead:
          "Review current plan terms with a plan built for balanced structure.",
        finalCtaLabel: "Activate Vanguard Plan",
        finalCtaMicrotext: "Review before continuing • current account terms apply • Supported assets vary by current terms",
        stickyBarText: "Vanguard Plan • current terms",
        stickyCtaLabel: "Start Vanguard",
      }}
    />
  );
}
