import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Summit VIP Plan information — WolvCapital',
  description: 'WolvCapital Summit VIP plan information. BNB Smart Chain plan information. Review current plan terms before continuing.',
  alternates: { canonical: 'https://www.wolvcapital.com/plans/summit' },
  openGraph: {
    title: 'Summit VIP Plan information — WolvCapital',
    description: 'WolvCapital Summit VIP plan information. BNB Smart Chain plan information. Review current plan terms before continuing.',
    url: 'https://www.wolvcapital.com/plans/summit',
    images: [{ url: '/og-images/plans-og.png', width: 1200, height: 630 }],
    type: 'website',
  },
  robots: { index: true, follow: true },
}

import PlanDetailPage from "@/components/PlanDetailPage";

export default function SummitPlanPage() {
  return (
    <PlanDetailPage
      plan={{
        slug: "summit",
        name: "Summit VIP",
        subtitleLine: "Review current terms • 365 Days",
        supportingLine:
          "Minimum $15,000 to $100,000 • Plan information for larger allocations; review current terms.",
        dailyRoiPct: 2,
        durationDays: 365,
        minUsd: 15000,
        maxUsd: 100000,
        ctaLabel: "Start Summit Plan",
        ctaMicrotext: "Supported assets vary by current terms • current account terms apply • Review current security and privacy terms",
        secondaryLinkLabel: "View outcome Calculator",
        highlightsTitle: "What you get with Summit VIP",
        highlightsNote: "Transparent tracking inside your dashboard, updated daily.",
        calculatorTitle: "Review Summit terms",
        calculatorHelper:
          "Enter an amount within the plan limits to see estimated outcomes.",
        calculatorCtaLabel: "Continue to Deposit & Activate",
        positioningTitle: "Designed for larger allocations",
        positioningBody:
          "The Summit VIP Plan is built for larger allocations that require structure, documentation, and consistent daily visibility across the investment window.",
        positioningBullets: [
          "You want a premium plan with higher allocation ranges",
          "You’re comfortable with a 365-day structure window",
          "You prefer clear reporting and daily dashboard tracking",
          "You value clear account and security information",
        ],
        activationTitle: "Activate in minutes",
        activationSteps: [
          "Create / Log in to your account",
          "Review account information and current eligibility terms",
          "Deposit USDT or BTC and select Summit VIP Plan",
        ],
        activationCtaLabel: "Start Summit Plan Now",
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
        faqTitle: "Summit VIP FAQs",
        faqs: [
          {
            q: "What’s the minimum and maximum for Summit VIP?",
            a: "The Summit VIP Plan accepts investments from $15,000 to $100,000.",
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
        finalCtaHeadline: "Ready to activate Summit VIP?",
        finalCtaSubhead:
          "Review current plan terms with a plan built for higher allocations.",
        finalCtaLabel: "Activate Summit VIP",
        finalCtaMicrotext: "Review before continuing • current account terms apply • Supported assets vary by current terms",
        stickyBarText: "Summit VIP • current terms",
        stickyCtaLabel: "Start Summit",
      }}
    />
  );
}
