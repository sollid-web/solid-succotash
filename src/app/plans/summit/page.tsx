import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Summit VIP Plan — 25% APY · 365 Days · WolvCapital',
  description: 'WolvCapital Summit VIP: 25% APY over 365 days. Institutional-grade BNB Smart Chain staking. Minimum $15,000. Enhanced KYC. Maximum $100,000.',
  alternates: { canonical: 'https://wolvcapital.com/plans/summit' },
  openGraph: {
    title: 'Summit VIP Plan — 25% APY · 365 Days · WolvCapital',
    description: 'WolvCapital Summit VIP: 25% APY over 365 days. Institutional-grade BNB Smart Chain staking. Minimum $15,000. Enhanced KYC. Maximum $100,000.',
    url: 'https://wolvcapital.com/plans/summit',
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
        subtitleLine: "25% APY • 365 Days",
        supportingLine:
          "Minimum $15,000 to $100,000 • Institutional/HNW plan for larger allocations.",
        dailyRoiPct: 2,
        durationDays: 365,
        minUsd: 15000,
        maxUsd: 100000,
        ctaLabel: "Start Summit Plan",
        ctaMicrotext: "USDT & BTC deposits • KYC required • Secure & encrypted",
        secondaryLinkLabel: "View ROI Calculator",
        highlightsTitle: "What you get with Summit VIP",
        highlightsNote: "Transparent tracking inside your dashboard, updated daily.",
        calculatorTitle: "Estimate your Summit earnings",
        calculatorHelper:
          "Enter an amount within the plan limits to see estimated returns.",
        calculatorCtaLabel: "Continue to Deposit & Activate",
        positioningTitle: "Designed for institutional allocations",
        positioningBody:
          "The Summit VIP Plan is built for larger allocations that require structure, documentation, and consistent daily visibility across the investment window.",
        positioningBullets: [
          "You want a premium plan with higher allocation ranges",
          "You’re comfortable with a 365-day growth window",
          "You prefer clear reporting and daily dashboard tracking",
          "You value KYC and platform security standards",
        ],
        activationTitle: "Activate in minutes",
        activationSteps: [
          "Create / Log in to your account",
          "Complete KYC verification (required for access and security)",
          "Deposit USDT or BTC and select Summit VIP Plan",
        ],
        activationCtaLabel: "Start Summit Plan Now",
        trustTitle: "Security & compliance first",
        trustBody:
          "Wolv Capital follows strict account protection practices designed to keep your profile secure and your activity traceable. Your dashboard, transactions, and verification steps are protected using modern encryption standards.",
        trustBullets: [
          "KYC / AML Compliance",
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
            q: "When is ROI credited?",
            a: "ROI is credited daily and can be tracked in your dashboard.",
          },
          {
            q: "Do I need to complete KYC?",
            a: "Yes. KYC is required to activate your account and access platform features.",
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
          "Start earning APY with a plan built for higher allocations.",
        finalCtaLabel: "Activate Summit VIP",
        finalCtaMicrotext: "Takes minutes • KYC required • USDT/BTC supported",
        stickyBarText: "Summit VIP • 25% APY",
        stickyCtaLabel: "Start Summit",
      }}
    />
  );
}
