import PlanDetailPage from "@/components/PlanDetailPage";

export default function VanguardPlanPage() {
  return (
    <PlanDetailPage
      plan={{
        slug: "vanguard",
        name: "Vanguard",
        subtitleLine: "1.25% Daily ROI • 150 Days",
        supportingLine:
          "Minimum $1,000 to $4,999 • Balanced growth for investors who want clear terms and oversight.",
        dailyRoiPct: 1.25,
        durationDays: 150,
        minUsd: 1000,
        maxUsd: 4999,
        ctaLabel: "Start Vanguard Plan",
        ctaMicrotext: "USDT & BTC deposits • KYC required • Secure & encrypted",
        secondaryLinkLabel: "View ROI Calculator",
        highlightsTitle: "What you get with Vanguard",
        highlightsNote: "Transparent tracking inside your dashboard, updated daily.",
        calculatorTitle: "Estimate your Vanguard earnings",
        calculatorHelper:
          "Enter an amount within the plan limits to see estimated returns.",
        calculatorCtaLabel: "Continue to Deposit & Activate",
        positioningTitle: "Designed for balanced growth",
        positioningBody:
          "The Vanguard Plan offers a measured approach with daily ROI visibility and defined limits. It’s a solid fit for investors who want structure without the longest lockup.",
        positioningBullets: [
          "You want a balanced plan with a mid-range ROI",
          "You’re comfortable with a 150-day growth window",
          "You prefer consistent dashboard tracking over constant trading",
          "You value KYC and platform security standards",
        ],
        activationTitle: "Activate in minutes",
        activationSteps: [
          "Create / Log in to your account",
          "Complete KYC verification (required for access and security)",
          "Deposit USDT or BTC and select Vanguard Plan",
        ],
        activationCtaLabel: "Start Vanguard Plan Now",
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
        faqTitle: "Vanguard Plan FAQs",
        faqs: [
          {
            q: "What’s the minimum and maximum for Vanguard?",
            a: "The Vanguard Plan accepts investments from $1,000 to $4,999.",
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
        finalCtaHeadline: "Ready to activate Vanguard?",
        finalCtaSubhead:
          "Start earning daily ROI with a plan built for balanced growth.",
        finalCtaLabel: "Activate Vanguard Plan",
        finalCtaMicrotext: "Takes minutes • KYC required • USDT/BTC supported",
        stickyBarText: "Vanguard Plan • 1.25% Daily ROI",
        stickyCtaLabel: "Start Vanguard",
      }}
    />
  );
}
