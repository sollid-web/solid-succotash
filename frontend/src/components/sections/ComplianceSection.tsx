'use client'
import dynamic from 'next/dynamic'

const ComplianceSectionInner = dynamic(() => import('./ComplianceSectionInner'), { ssr: false })

export default function ComplianceSection() {
  return <ComplianceSectionInner />
}
