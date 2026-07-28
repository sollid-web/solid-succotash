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