// Overwrite src/app/contact/page.tsx with the clean, UTF-8 (no BOM) content
// and correct path aliases.
const fs = require('fs');
const path = require('path');
const outPath = path.join(__dirname, '..', 'src', 'app', 'contact', 'page.tsx');
const content = `"use client"
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useTranslation } from '@/i18n/TranslationProvider'

const MapWithOverlay = dynamic(() => import('@/components/MapWithOverlay'), { ssr: false })

export default function ContactPage() {
  const { t } = useTranslation()
  return (
    <>
      <Head>
        <title>{t('nav.contact')} · WolvCapital</title>
        <meta name="description" content="Contact WolvCapital — registered investment management firm headquartered in the United States. Get in touch with our compliance and support team." />
        <meta name="keywords" content="contact WolvCapital, office location United States, registered investment firm, investment support" />
        <meta property="og:title" content="WolvCapital · Contact & Office Location" />
        <meta property="og:description" content="Get in touch with WolvCapital's legal and support offices in the United States." />
        <meta property="og:image" content="/images/office-location-map-og.jpg" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Navigation is provided globally in layout */}
        <section className="pt-32 pb-16 bg-gradient-to-br from-[#0b2f6b] to-[#1d4ed8] text-white text-center">
          <div className="container mx-auto px-4 lg:px-8">
            <h1 className="text-5xl lg:text-6xl font-extrabold mb-6">{t('contact.title')}</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">{t('contact.subtitle')}</p>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mb-16">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-[#0b2f6b] mb-4">{t('contact.locationHeading')}</h2>
                <p className="text-xl text-gray-600">{t('contact.location')}</p>
              </div>
              <MapWithOverlay
                query="1600 Amphitheatre Parkway, Mountain View, CA, USA"
                overlayWebp="/images/office-location-map.webp"
                overlayFallback="/images/office-location-map.jpg"
                title="WolvCapital Registered Office — United States"
              />
            </div>

            <div className="mb-16 lg:hidden">
              <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/welcome-mobile.jpg"
                  alt="Welcome to WolvCapital - Your trusted partner in digital investment solutions"
                  fill
                  className="object-cover object-center"
                  sizes="100vw"
                />
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
              <div>
                <h2 className="text-4xl font-bold text-[#0b2f6b] mb-8">{t('contact.contactInformationHeading')}</h2>
                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#0b2f6b] to-[#2563eb] rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#0b2f6b] mb-2">{t('contact.emailSupportHeading')}</h3>
                      <p className="text-gray-700 text-lg">{t('contact.email')}</p>
                      <p className="text-gray-600 mt-1">{t('contact.emailSupportResponse')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-purple-700 mb-2">{t('contact.businessHoursHeading')}</h3>
                      <p className="text-gray-700 text-lg">{t('contact.businessHoursValue')}</p>
                      <p className="text-gray-600 mt-1">{t('contact.businessHoursNote')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-green-700 mb-2">{t('contact.liveChatHeading')}</h3>
                      <p className="text-gray-700 text-lg">{t('contact.liveChatValue')}</p>
                      <p className="text-gray-600 mt-1">{t('contact.liveChatNote')}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
                  <h3 className="text-2xl font-bold text-[#0b2f6b] mb-4">{t('contact.faqHeading')}</h3>
                  <p className="text-gray-700 mb-4">{t('contact.faqIntro')}</p>
                  <Link href="/about" className="inline-flex items-center text-[#2563eb] font-semibold hover:text-[#1d4ed8] transition">
                    {t('contact.faqLink')}
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                </div>
              </div>

              <div>
                <h2 className="text-4xl font-bold text-[#0b2f6b] mb-8">{t('contact.formHeading')}</h2>
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">{t('contact.form.name')} *</label>
                    <input id="name" type="text" className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#2563eb] focus:outline-none transition" placeholder="John Doe" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">{t('contact.form.email')} *</label>
                    <input id="email" type="email" className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#2563eb] focus:outline-none transition" placeholder="john@example.com" required />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-2">{t('contact.form.subject')} *</label>
                    <input id="subject" type="text" className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#2563eb] focus:outline-none transition" placeholder="How can we help?" required />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">{t('contact.form.message')} *</label>
                    <textarea id="message" rows={6} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#2563eb] focus:outline-none transition resize-none" placeholder="Tell us more about your inquiry..." required />
                  </div>
                  <button type="submit" className="w-full bg-gradient-to-r from-[#0b2f6b] via-[#2563eb] to-[#1d4ed8] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">{t('contact.form.submit')}</button>
                  <p className="text-sm text-gray-600 text-center">{t('contact.form.requiredNote')}</p>
                </form>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-[#071d42] text-white py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div>
                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link href="/" className="text-gray-300 hover:text-white transition">Home</Link></li>
                  <li><Link href="/plans" className="text-gray-300 hover:text-white transition">Investment Plans</Link></li>
                  <li><Link href="/about" className="text-gray-300 hover:text-white transition">About Us</Link></li>
                  <li><Link href="/contact" className="text-gray-300 hover:text-white transition">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><Link href="/terms-of-service" className="text-gray-300 hover:text-white transition">Terms of Service</Link></li>
                  <li><Link href="/legal-disclaimer" className="text-gray-300 hover:text-white transition">Legal Disclaimer</Link></li>
                  <li><Link href="/risk-disclosure" className="text-gray-300 hover:text-white transition">Risk Disclosure</Link></li>
                  <li><Link href="/privacy" className="text-gray-300 hover:text-white transition">Privacy Policy</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Contact Info</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>support@mail.wolvcapital.com</li>
                  <li>24/7 Support</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">WolvCapital</h3>
                <p className="text-gray-300 text-sm leading-relaxed">Secure crypto banking, audited ROI programs, and virtual cards—all governed by a human approval loop.</p>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
              <p>© 2025 WolvCapital Invest. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
`;

fs.writeFileSync(outPath, content, { encoding: 'utf8' });
console.log('Sanitized contact page written to', outPath);
