import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pioneer Plan information — WolvCapital',
  description: 'Start the Pioneer staking plan on WolvCapital. Review current plan information, contract references, and risk disclosures before continuing.',
  alternates: { canonical: 'https://www.wolvcapital.com/plans/pioneer' },
  openGraph: {
    title: 'Pioneer Plan information — WolvCapital',
    description: 'Start the Pioneer staking plan on WolvCapital. Review current plan information, contract references, and risk disclosures before continuing.',
    url: 'https://www.wolvcapital.com/plans/pioneer',
    images: [{ url: '/og-images/plans-og.png', width: 1200, height: 630 }],
    type: 'website',
  },
  robots: { index: true, follow: true },
}

import PlanDetailPage from "@/components/PlanDetailPage";

export default function PioneerPlanPage() {
  return (
    <PlanDetailPage
      plan={{
        slug: "pioneer",
        name: "Pioneer",
        subtitleLine: "Review current terms • 90 Days",
        supportingLine:
          "Minimum $100 to $999 • Ideal for new investors seeking a simple, structured start.",
        dailyRoiPct: 1,
        durationDays: 90,
        minUsd: 100,
        maxUsd: 999,
        ctaLabel: "Start Pioneer Plan",
        ctaMicrotext: "Supported assets vary by current terms • current account terms apply • Review current security and privacy terms",
        secondaryLinkLabel: "View outcome Calculator",
        highlightsTitle: "What you get with Pioneer",
        highlightsNote: "Transparent tracking inside your dashboard, updated daily.",
        calculatorTitle: "Review Pioneer terms",
        calculatorHelper:
          "Enter an amount within the plan limits to see estimated outcomes.",
        calculatorCtaLabel: "Continue to Deposit & Activate",
        positioningTitle: "Designed for a steady start",
        positioningBody:
          "The Pioneer Plan is built for investors who want clarity and simplicity. It provides current plan terms tracking with a defined window so you can build confidence before scaling.",
        positioningBullets: [
          "You want a beginner-friendly plan with clear limits",
          "You prefer a 90-day investment window",
          "You want daily dashboard visibility without complexity",
          "You value clear account and security information",
        ],
        activationTitle: "Activate in minutes",
        activationSteps: [
          "Create / Log in to your account",
          "Review account information and current eligibility terms",
          "Deposit USDT or BTC and select Pioneer Plan",
        ],
        activationCtaLabel: "Start Pioneer Plan Now",
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
        faqTitle: "Pioneer Plan FAQs",
        faqs: [
          {
            q: "What’s the minimum and maximum for Pioneer?",
            a: "The Pioneer Plan accepts investments from $100 to $999.",
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
        finalCtaHeadline: "Ready to activate Pioneer?",
        finalCtaSubhead:
          "Review current plan terms with a plan built for new investors.",
        finalCtaLabel: "Activate Pioneer Plan",
        finalCtaMicrotext: "Review before continuing • current account terms apply • Supported assets vary by current terms",
        stickyBarText: "Pioneer Plan • current terms",
        stickyCtaLabel: "Start Pioneer",
      }}
    />
  );
}
