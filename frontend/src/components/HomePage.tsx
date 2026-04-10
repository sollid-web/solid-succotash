"use client"

import { useRef } from 'react'
import HeroSection from '@/components/sections/HeroSection'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import PlansSection from '@/components/sections/PlansSection'
import ComplianceSection from '@/components/sections/ComplianceSection'
import SecuritySection from '@/components/sections/SecuritySection'
import VirtualCardSection from '@/components/sections/VirtualCardSection'
import FAQSection from '@/components/sections/FAQSection'
import RiskBar from '@/components/sections/RiskBar'
import CTASection from '@/components/sections/CTASection'
import RegulatedSection from '@/components/sections/RegulatedSection'
import StatsSection from '@/components/sections/StatsSection'

export default function HomePage() {
  const plansRef = useRef<HTMLDivElement>(null)

  const handlePlansClick = () => {
    plansRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div>
      <HeroSection onPlansClick={handlePlansClick} />
      <HowItWorksSection />
      <div ref={plansRef}>
        <PlansSection />
      </div>
      <ComplianceSection />
      <SecuritySection />
      <VirtualCardSection />
      <FAQSection />
      <RiskBar />
      <CTASection />
      <RegulatedSection />
      <StatsSection />
    </div>
  )
}
