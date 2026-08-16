'use client'
import { useRef } from 'react'
import { useLenis } from 'lenis/dist/lenis-react'
import HeroSection from '@/components/sections/HeroSection'
import PresaleHeroBanner from '@/components/sections/PresaleHeroBanner'
import TrustpilotWidget from '@/components/TrustpilotWidget'
import RiskBar from '@/components/sections/RiskBar'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import StakingSection from '@/components/sections/StakingSection'
import ComplianceSection from '@/components/sections/ComplianceSection'
import SecuritySection from '@/components/sections/SecuritySection'
import WolvTokenSection from '@/components/sections/WolvTokenSection'
import FAQSection from '@/components/sections/FAQSection'
import ShareButtons from '@/components/ShareButtons'

export default function HomePage() {
  const plansRef = useRef<HTMLDivElement>(null)
  const lenis = useLenis()
  const handlePlansClick = () => {
    if (lenis && plansRef.current) {
      lenis.scrollTo(plansRef.current)
    } else {
      plansRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }
  return (
    <div>
      <HeroSection onPlansClick={handlePlansClick} />
      <PresaleHeroBanner />
      <TrustpilotWidget />
      <div className="container mx-auto px-4 lg:px-8 flex justify-center py-4">
        <ShareButtons url="https://www.wolvcapital.com" text="Invest, stake, and earn WOLV on WolvCapital — blockchain-verified returns." />
      </div>
      <RiskBar />
      <HowItWorksSection />
      <div ref={plansRef}>
        <StakingSection />
      </div>
      <WolvTokenSection />
      <ComplianceSection />
      <SecuritySection />
      <FAQSection />
    </div>
  )
}