import PlanDetailPage from "@/components/PlanDetailPage";

export default function PioneerPlanPage() {
  return (
    <PlanDetailPage
      plan={{
        slug: "pioneer",
        name: "Pioneer",
        subtitleLine: "1% Daily ROI • 90 Days",
        supportingLine:
          "Minimum $100 to $999 • Ideal for new investors seeking a simple, structured start.",
        dailyRoiPct: 1,
        durationDays: 90,
        minUsd: 100,
        maxUsd: 999,
        ctaLabel: "Start Pioneer Plan",
        ctaMicrotext: "USDT & BTC deposits • KYC required • Secure & encrypted",
        secondaryLinkLabel: "View ROI Calculator",
        highlightsTitle: "What you get with Pioneer",
        highlightsNote: "Transparent tracking inside your dashboard, updated daily.",
        calculatorTitle: "Estimate your Pioneer earnings",
        calculatorHelper:
          "Enter an amount within the plan limits to see estimated returns.",
        calculatorCtaLabel: "Continue to Deposit & Activate",
        positioningTitle: "Designed for a steady start",
        positioningBody:
          "The Pioneer Plan is built for investors who want clarity and simplicity. It provides daily ROI tracking with a defined window so you can build confidence before scaling.",
        positioningBullets: [
          "You want a beginner-friendly plan with clear limits",
          "You prefer a 90-day investment window",
          "You want daily dashboard visibility without complexity",
          "You value KYC and platform security standards",
        ],
        activationTitle: "Activate in minutes",
        activationSteps: [
          "Create / Log in to your account",
          "Complete KYC verification (required for access and security)",
          "Deposit USDT or BTC and select Pioneer Plan",
        ],
        activationCtaLabel: "Start Pioneer Plan Now",
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
        faqTitle: "Pioneer Plan FAQs",
        faqs: [
          {
            q: "What’s the minimum and maximum for Pioneer?",
            a: "The Pioneer Plan accepts investments from $100 to $999.",
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
        finalCtaHeadline: "Ready to activate Pioneer?",
        finalCtaSubhead:
          "Start earning daily ROI with a plan built for new investors.",
        finalCtaLabel: "Activate Pioneer Plan",
        finalCtaMicrotext: "Takes minutes • KYC required • USDT/BTC supported",
        stickyBarText: "Pioneer Plan • 1% Daily ROI",
        stickyCtaLabel: "Start Pioneer",
      }}
    />
  );
}
