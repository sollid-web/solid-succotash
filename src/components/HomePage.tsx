'use client'
import HeroSection from '@/components/sections/HeroSection'
import LiveStatsTicker from '@/components/sections/LiveStatsTicker'
import PresaleHeroBanner from '@/components/sections/PresaleHeroBanner'
import TrustpilotWidget from '@/components/TrustpilotWidget'
import RiskBar from '@/components/sections/RiskBar'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import WolvChartSection from '@/components/sections/WolvChartSection'
import SecuritySection from '@/components/sections/SecuritySection'
import WolvTokenSection from '@/components/sections/WolvTokenSection'
import FAQSection from '@/components/sections/FAQSection'
import ShareButtons from '@/components/ShareButtons'

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <LiveStatsTicker />
      <PresaleHeroBanner />
      <TrustpilotWidget />
      <div className="container mx-auto px-4 lg:px-8 flex justify-center py-4">
        <ShareButtons url="https://www.wolvcapital.com" text="Trade WOLV on PancakeSwap — BNB Smart Chain staking protocol by WolvCapital." />
      </div>
      <RiskBar />
      <HowItWorksSection />
      <WolvChartSection />
      <WolvTokenSection />
      <SecuritySection />
      <FAQSection />
    </div>
  )
}
