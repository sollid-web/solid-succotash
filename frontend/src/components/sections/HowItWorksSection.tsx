'use client'
import { useTranslation } from '@/components/TranslationProvider'
import { Button } from '@/components/ui/Button'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { StepCircle } from '@/components/ui/StepCircle'

export default function HowItWorksSection() {
  const { t } = useTranslation()

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <span className="text-[11px] font-bold tracking-widest text-[#2A52BE] uppercase">
            How It Works
          </span>
        </div>
        <SectionHeader
          title={t('howitworks.title')}
          description={t('howitworks.description')}
          centered
          className="mb-16"
        />
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <StepCircle
            number={1}
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg>}
            title="Create Account"
            description="Sign up and complete full KYC identity verification in line with U.S. regulatory requirements."
          />
          <StepCircle
            number={2}
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>}
            title="Choose Staking Plan"
            description="Select Pioneer, Vanguard, Horizon, or Summit VIP — stake BNB or BUSD and start earning WOLV rewards."
          />
          <StepCircle
            number={3}
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>}
            title="Stake & Earn On-Chain"
            description="Your stake is locked in our audited smart contract. WOLV rewards accumulate automatically — verified on BNB Chain."
          />
          <StepCircle
            number={4}
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9"><path d="M16 7h6v6" /><path d="m22 7-8.5 8.5-5-5L2 17" /></svg>}
            title="Claim WOLV Rewards"
            description="After your lock period ends, claim your WOLV rewards directly to your wallet. Every token is on-chain proof of your earnings."
          />
        </div>
        <div className="text-center">
          <Button variant="cta-sky" size="lg" asLink href="/how-it-works" className="font-bold">
            {t('howitworks.cta')}
          </Button>
        </div>
      </div>
    </section>
  )
}
