'use client'
import dynamic from 'next/dynamic'
const LiveChainMetrics = dynamic(() => import('./LiveChainMetrics'), { ssr: false })
export default function LiveChainMetricsWrapper() {
  return <LiveChainMetrics />
}
