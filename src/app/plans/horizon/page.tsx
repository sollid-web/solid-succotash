import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Horizon Plan information — WolvCapital',
  description: 'WolvCapital Horizon plan offers 18% current plan terms over 180 days on BNB Smart Chain. Minimum $5,000. WOLV token rewards. For experienced investors.',
  alternates: { canonical: 'https://www.wolvcapital.com/plans/horizon' },
  openGraph: {
    title: 'Horizon Plan information — WolvCapital',
    description: 'WolvCapital Horizon plan offers 18% current plan terms over 180 days on BNB Smart Chain. Minimum $5,000. WOLV token rewards. For experienced investors.',
    url: 'https://www.wolvcapital.com/plans/horizon',
    images: [{ url: '/og-images/plans-og.png', width: 1200, height: 630 }],
    type: 'website',
  },
  robots: { index: true, follow: true },
}

import PlanDetailPage from "@/components/PlanDetailPage";

export default function HorizonPlanPage() {
  return (
    <PlanDetailPage
      plan={{
        slug: "horizon",
        name: "Horizon",
        subtitleLine: "1.5% Daily outcome • 180 Days",
        supportingLine:
          "Minimum $5,000 to $14,999 • Built for experienced investors seeking higher long-term structure.",
        dailyRoiPct: 1.5,
        durationDays: 180,
        minUsd: 5000,
        maxUsd: 14999,
        ctaLabel: "Start Horizon Plan",
        ctaMicrotext: "Supported assets vary by current terms • current account terms apply • Review current security and privacy terms",
        secondaryLinkLabel: "View outcome Calculator",
        highlightsTitle: "What you get with Horizon",
        highlightsNote: "Transparent tracking inside your dashboard, updated daily.",
        calculatorTitle: "Review Horizon terms",
        calculatorHelper:
          "Enter an amount within the plan limits to see estimated outcomes.",
        calculatorCtaLabel: "Continue to Deposit & Activate",
        positioningTitle: "Designed for long-term crypto structure",
        positioningBody:
          "The Horizon Plan is designed for investors who prefer a longer runway and consistent current plan terms tracking. If you’re building a disciplined strategy—rather than chasing short-term swings—this plan gives you a structured path and daily visibility.",
        positioningBullets: [
          "You want a mid-to-high tier plan with strong current plan terms",
          "You’re comfortable with a 180-day structure window",
          "You prefer consistent dashboard tracking over constant trading",
          "You value a platform that provides account and security information",
        ],
        activationTitle: "Activate in minutes",
        activationSteps: [
          "Create / Log in to your account",
          "Review account information and current eligibility terms",
          "Deposit USDT or BTC and select Horizon Plan",
        ],
        activationCtaLabel: "Start Horizon Plan Now",
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
        faqTitle: "Horizon Plan FAQs",
        faqs: [
          {
            q: "What’s the minimum and maximum for Horizon?",
            a: "The Horizon Plan accepts investments from $5,000 to $14,999.",
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
        finalCtaHeadline: "Ready to activate Horizon?",
        finalCtaSubhead:
          "Review current plan terms with a plan built for long-term investors.",
        finalCtaLabel: "Activate Horizon Plan",
        finalCtaMicrotext: "Review before continuing • current account terms apply • Supported assets vary by current terms",
        stickyBarText: "Horizon Plan • 1.5% Daily outcome",
        stickyCtaLabel: "Start Horizon",
      }}
    />
  );
}
