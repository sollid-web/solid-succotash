import PlanDetailPage from "@/components/PlanDetailPage";

export default function HorizonPlanPage() {
  return (
    <PlanDetailPage
      plan={{
        slug: "horizon",
        name: "Horizon",
        subtitleLine: "1.5% Daily ROI • 180 Days",
        supportingLine:
          "Minimum $5,000 to $14,999 • Built for experienced investors seeking higher long-term growth.",
        dailyRoiPct: 1.5,
        durationDays: 180,
        minUsd: 5000,
        maxUsd: 14999,
        ctaLabel: "Start Horizon Plan",
        ctaMicrotext: "USDT & BTC deposits • KYC required • Secure & encrypted",
        secondaryLinkLabel: "View ROI Calculator",
        highlightsTitle: "What you get with Horizon",
        highlightsNote: "Transparent tracking inside your dashboard, updated daily.",
        calculatorTitle: "Estimate your Horizon earnings",
        calculatorHelper:
          "Enter an amount within the plan limits to see estimated returns.",
        calculatorCtaLabel: "Continue to Deposit & Activate",
        positioningTitle: "Designed for long-term crypto growth",
        positioningBody:
          "The Horizon Plan is designed for investors who prefer a longer runway and consistent daily ROI tracking. If you’re building a disciplined strategy—rather than chasing short-term swings—this plan gives you a structured path and daily visibility.",
        positioningBullets: [
          "You want a mid-to-high tier plan with strong daily ROI",
          "You’re comfortable with a 180-day growth window",
          "You prefer consistent dashboard tracking over constant trading",
          "You value a platform that enforces KYC and security standards",
        ],
        activationTitle: "Activate in minutes",
        activationSteps: [
          "Create / Log in to your account",
          "Complete KYC verification (required for access and security)",
          "Deposit USDT or BTC and select Horizon Plan",
        ],
        activationCtaLabel: "Start Horizon Plan Now",
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
        faqTitle: "Horizon Plan FAQs",
        faqs: [
          {
            q: "What’s the minimum and maximum for Horizon?",
            a: "The Horizon Plan accepts investments from $5,000 to $14,999.",
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
        finalCtaHeadline: "Ready to activate Horizon?",
        finalCtaSubhead:
          "Start earning daily ROI with a plan built for long-term investors.",
        finalCtaLabel: "Activate Horizon Plan",
        finalCtaMicrotext: "Takes minutes • KYC required • USDT/BTC supported",
        stickyBarText: "Horizon Plan • 1.5% Daily ROI",
        stickyCtaLabel: "Start Horizon",
      }}
    />
  );
}
