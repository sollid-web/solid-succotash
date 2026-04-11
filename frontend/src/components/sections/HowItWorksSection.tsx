'use client'

import { Button } from '@/components/ui/Button'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { StepCircle } from '@/components/ui/StepCircle'

export default function HowItWorksSection() {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow label */}
        <div className="text-center mb-4">
          <span className="text-[11px] font-bold tracking-widest text-[#0EA5E9] uppercase">
            Process
          </span>
        </div>
        <SectionHeader 
          title="How WolvCapital Works" 
          description="Our streamlined process ensures security, transparency, and compliance at every step."
          centered
          className="mb-16"
        />

        {/* Steps Grid */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <StepCircle
            number={1}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" x2="19" y1="8" y2="14" />
                <line x1="22" x2="16" y1="11" y2="11" />
              </svg>
            }
            title="Create Account"
            description="Sign up and complete full KYC identity verification in line with U.S. regulatory requirements."
          />
          
          <StepCircle
            number={2}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9">
                <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                <rect width="20" height="14" x="2" y="6" rx="2" />
              </svg>
            }
            title="Choose Portfolio"
            description="Select a managed portfolio tier matching your risk tolerance and investment horizon. Review fees first."
          />
          
          <StepCircle
            number={3}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9">
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
            }
            title="Deposit Funds"
            description="Funds are held with a licensed institutional custodian. All deposits are subject to AML compliance review."
          />
          
          <StepCircle
            number={4}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9">
                <path d="M16 7h6v6" />
                <path d="m22 7-8.5 8.5-5-5L2 17" />
              </svg>
            }
            title="Track Performance"
            description="Monitor your portfolio via a real-time dashboard. Audited monthly statements are provided to all investors."
          />
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            variant="cta-sky" 
            size="lg" 
            asLink 
            href="/how-it-works"
            className="font-bold"
          >
            Learn More About Our Process
          </Button>
        </div>
      </div>
    </section>
  )
}
