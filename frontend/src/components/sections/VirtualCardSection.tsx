'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Check } from 'lucide-react'
import { useTranslation } from '@/components/TranslationProvider'
const CARD_SERVICES = [
  { name: 'Netflix', icon: '/icons/Netflix-Logo.wine.svg' },
  { name: 'Spotify', icon: '/icons/Spotify-Logo.wine.svg' },
  { name: 'Apple Pay', icon: '/icons/Apple_Pay-Logo.wine.svg' },
  { name: 'Amazon', icon: '/icons/Amazon_(company)-Logo.wine.svg' },
  { name: 'Google', icon: '/icons/Google-Logo.wine.svg' },
  { name: 'Steam', icon: '/icons/Steam_(service)-Logo.wine(1).svg' },
  { name: 'Shopify', icon: '/icons/Shopify-Logo.wine.svg' },
  { name: '+100 more', icon: null },
]
export default function VirtualCardSection() {
  const { t } = useTranslation()
  const FEATURES = Array.from({ length: 7 }, (_, i) => t(`virtualcard.feature.${i + 1}`))
  return (
    <section id="virtual-card" className="relative py-24 bg-[#0F172A] overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundImage: "url(/images/sections/card-bg.webp)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.05, zIndex: 0 }} />
      <div className="relative z-10 container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-xs">
              <div className="w-full aspect-video rounded-2xl p-6 mb-8" style={{ background: 'linear-gradient(135deg, #1e5df7 0%, #0a34b0 100%)', boxShadow: '0 32px 64px rgba(0,0,0,0.4)' }}>
                <div className="w-10 h-8 rounded mb-6" style={{ background: 'linear-gradient(135deg, #d4af37, #b8860b)' }} />
                <div className="font-mono text-sm text-white text-opacity-90 mb-4 tracking-widest">4532 •••• •••• 7891</div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs text-white text-opacity-40 mb-1 uppercase tracking-widest">Card Holder</div>
                    <div className="text-sm text-white font-semibold">VERIFIED MEMBER</div>
                  </div>
                  <div>
                    <div className="text-xs text-white text-opacity-40 mb-1 uppercase tracking-widest">Expires</div>
                    <div className="text-sm text-white font-semibold">12/28</div>
                  </div>
                  <div className="text-lg font-bold text-yellow-400" style={{ letterSpacing: '-1px' }}>VISA</div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                {CARD_SERVICES.map((service, idx) => (
                  <div key={idx} className="rounded-lg p-4 text-center hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center gap-3 min-h-28 cursor-pointer" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)' }}>
                    {service.icon === null ? (
                      <div className="w-12 h-12 border-2 border-white border-opacity-30 rounded-lg flex items-center justify-center text-white font-bold text-lg">+</div>
                    ) : (
                      <Image src={service.icon} alt={service.name} width={48} height={48} className="max-w-[48px] max-h-[48px] object-contain" unoptimized />
                    )}
                    <div className="text-xs font-semibold text-white text-opacity-80 line-clamp-2 leading-tight">{service.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <span className="text-[11px] font-bold tracking-widest text-brand-primary uppercase block mb-4">{t('virtualcard.eyebrow')}</span>
            <h2 className="text-4xl font-bold text-white my-4" style={{ letterSpacing: '-0.02em' }}>{t('virtualcard.title')}</h2>
            <p className="text-[#CBD5E1] text-lg leading-relaxed mb-8">{t('virtualcard.subtitle')}</p>
            <ul className="space-y-3 mb-8">
              {FEATURES.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                  <span className="text-[#E2E8F0] text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="border-l-4 border-brand-primary p-4 mb-8 text-sm text-[#CBD5E1]" style={{ background: 'rgba(42, 82, 190, 0.08)' }}>{t('virtualcard.disclaimer')}</div>
            <Link href="/accounts/signup" className="inline-flex items-center px-8 py-3 bg-white text-[#0F172A] font-semibold rounded-md hover:bg-gray-100 transition">{t('virtualcard.cta')}</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
