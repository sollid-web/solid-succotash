"use client"

import { useMemo } from 'react'
import { useTranslation } from '@/i18n/TranslationProvider'

interface MapWithOverlayProps {
  query: string // address query for Google Maps
  overlayWebp?: string // path to webp overlay image in /public
  overlayFallback?: string // fallback PNG/JPG path
  title?: string
  className?: string
}

export default function MapWithOverlay({
  query,
  overlayWebp = '/images/office-location-map.webp',
  overlayFallback = '/images/office-location-map.jpg',
  title = 'WolvCapital Office — United States',
  className = 'relative w-full aspect-[16/9] md:aspect-[21/9] lg:aspect-[2/1] max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl',
}: MapWithOverlayProps) {
  const { t } = useTranslation()

  const src = useMemo(() => {
    const q = encodeURIComponent(query)
    return `https://www.google.com/maps?q=${q}&output=embed`
  }, [query])

  return (
    <div className={className}>
      <iframe
        title={title}
        src={src}
        className="absolute inset-0 w-full h-full"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />

      {/* Non-interactive overlay; when you supply a transparent PNG/WebP, the map will be visible underneath */}
      <picture className="absolute inset-0 w-full h-full pointer-events-none">
        <source srcSet={overlayWebp} type="image/webp" />
        <img
          src={overlayFallback}
          alt={t('contact.mapAlt')}
          className="w-full h-full object-cover object-center"
          style={{ display: 'block' }}
        />
      </picture>
    </div>
  )
}
