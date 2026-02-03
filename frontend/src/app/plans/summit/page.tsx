import PlanDetailPage from "@/components/PlanDetailPage";

export default function SummitPlanPage() {
  return (
    <PlanDetailPage
      plan={{
        slug: "summit",
        name: "Summit VIP",
        subtitleLine: "2% Daily ROI • 365 Days",
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
          "Start earning daily ROI with a plan built for higher allocations.",
        finalCtaLabel: "Activate Summit VIP",
        finalCtaMicrotext: "Takes minutes • KYC required • USDT/BTC supported",
        stickyBarText: "Summit VIP • 2% Daily ROI",
        stickyCtaLabel: "Start Summit",
      }}
    />
  );
}
