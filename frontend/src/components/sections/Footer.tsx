'use client'
import Link from 'next/link'
import { useTranslation } from '@/components/TranslationProvider'
export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="bg-brand-dark">
      <div className="border-b border-[#1E3A5F] py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <h3 className="text-xl font-bold text-white mb-3">WolvCapital</h3>
              <p className="text-[#64748B] text-sm leading-relaxed mb-4 max-w-xs">{t('footer.brand.description')}</p>
            </div>
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#94A3B8] mb-4">{t('footer.platform')}</h4>
              <ul className="space-y-2">
                {[
                  { key: 'footer.platform.createAccount', href: '/accounts/signup' },
                  { key: 'footer.platform.login', href: '/accounts/login' },
                  { key: 'footer.platform.plans', href: '/plans' },
                  { key: 'footer.platform.virtualCard', href: '#virtual-card' },
                  { key: 'footer.platform.faq', href: '/faq' },
                  { key: 'WOLV Token', href: '/wolv-token' },
                  { key: 'Whitepaper', href: '/whitepaper' },
                  { key: 'Smart Contracts', href: '/smart-contracts' },
                  { key: 'Whitepaper', href: '/whitepaper' },
                  { key: 'Smart Contracts', href: '/smart-contracts' },
                ].map((item) => (
                  <li key={item.key}><Link href={item.href} className="text-[#94A3B8] text-sm hover:text-white transition">{item.key.startsWith('footer') ? t(item.key) : item.key}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#94A3B8] mb-4">{t('footer.legal')}</h4>
              <ul className="space-y-2">
                {[
                  { key: 'footer.legal.terms', href: '/terms-of-service' },
                  { key: 'footer.legal.privacy', href: '/privacy' },
                  { key: 'footer.legal.risk', href: '/risk-disclosure' },
                  { key: 'footer.legal.disclaimer', href: '/legal-disclaimer' },
                  { key: 'footer.legal.compliance', href: '#compliance' },
                ].map((item) => (
                  <li key={item.key}><Link href={item.href} className="text-[#94A3B8] text-sm hover:text-white transition">{item.key.startsWith('footer') ? t(item.key) : item.key}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#94A3B8] mb-4">{t('footer.support')}</h4>
              <ul className="space-y-2">
                {[
                  { key: 'footer.support.about', href: '/about' },
                  { key: 'footer.support.contact', href: '/contact' },
                  { key: 'footer.support.blog', href: '/blog' },
                  { key: 'footer.support.security', href: '/security' },
                  { key: 'footer.support.status', href: '#' },
                ].map((item) => (
                  <li key={item.key}><Link href={item.href} className="text-[#94A3B8] text-sm hover:text-white transition">{item.key.startsWith('footer') ? t(item.key) : item.key}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-[#1E3A5F] py-6">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#475569] text-xs">{t('footer.copyright').replace('{year}', String(new Date().getFullYear()))}</p>
            <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
              <span className="px-2 py-1">{t('footer.badge.fincen')}</span>
              <span className="px-2 py-1">{t('footer.badge.ssl')}</span>
              <span className="px-2 py-1">{t('footer.badge.pci')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
