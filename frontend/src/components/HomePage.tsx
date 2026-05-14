'use client'
import { useRef } from 'react'
import HeroSection from '@/components/sections/HeroSection'
import RiskBar from '@/components/sections/RiskBar'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import StakingSection from '@/components/sections/StakingSection'
import ComplianceSection from '@/components/sections/ComplianceSection'
import SecuritySection from '@/components/sections/SecuritySection'
import WolvTokenSection from '@/components/sections/WolvTokenSection'
import FAQSection from '@/components/sections/FAQSection'

export default function HomePage() {
  const plansRef = useRef<HTMLDivElement>(null)
  const handlePlansClick = () => {
    plansRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <div>
      <HeroSection onPlansClick={handlePlansClick} />
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