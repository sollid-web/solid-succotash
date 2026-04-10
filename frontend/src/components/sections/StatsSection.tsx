'use client'

interface Stat {
  value: string
  label: string
  sublabel: string
}

const STATS: Stat[] = [
  {
    value: '$2.5B+',
    label: 'Assets Under Management',
    sublabel: 'Secure digital assets',
  },
  {
    value: '45K+',
    label: 'Verified Investors',
    sublabel: 'From 120+ countries',
  },
  {
    value: '99.9%',
    label: 'Platform Uptime',
    sublabel: 'Enterprise-grade infrastructure',
  },
  {
    value: '0',
    label: 'Security Breaches',
    sublabel: 'Industry-leading record',
  },
]

export default function StatsSection() {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {STATS.map((stat, idx) => (
            <div key={idx}>
              <div className="text-4xl lg:text-5xl font-bold text-[#0b2f6b] mb-2">{stat.value}</div>
              <div className="font-semibold text-gray-700 mb-1">{stat.label}</div>
              <div className="text-sm text-gray-500">{stat.sublabel}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
