"use client"

import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'

const MapWithOverlay = dynamic(() => import('@/components/MapWithOverlay'), { ssr: false })

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-hero-contact bg-cover bg-center bg-no-repeat overlay-dark-40">
  <section className="pt-32 pb-16 bg-black/40 text-white text-center">
          <div className="container mx-auto px-4 lg:px-8">
            <h1 className="text-5xl lg:text-6xl font-extrabold mb-6">Contact WolvCapital</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              WolvCapital is a U.S. regulated digital investment platform. For compliance, account inquiries, or partnership
              discussions, please contact our investor support and compliance teams below.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="relative w-full max-w-[480px] aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 mx-auto">
                <Image
                  src="/images/contact-hero.jpg"
                  alt="Contact WolvCapital — investor support and compliance"
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="100vw"
                />
              </div>
            </div>
          </div>
        </section>
  {/* Live transactions ticker removed per request (no banner after header) */}
  <section className="py-24 bg-white/90 backdrop-blur-[1px]">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mb-16">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-[#0b2f6b] mb-4">Registered Office</h2>
                <p className="text-xl text-gray-600">
                  516 High St, Palo Alto, CA 94301, United States
                  <br />
                  WolvCapital’s principal office is located in Palo Alto, California. All regulatory correspondence and investor
                  communications are managed through this location in accordance with U.S. financial regulations.
                </p>
              </div>
              <MapWithOverlay
                query="516 High St, Palo Alto, CA 94301, United States"
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
                <h2 className="text-4xl font-bold text-[#0b2f6b] mb-8">Contact Information</h2>
                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#0b2f6b] to-[#2563eb] rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#0b2f6b] mb-2">Email Support</h3>
                      <p className="text-gray-700 text-lg">support@wolvcapital.com</p>
                      <p className="text-gray-600 mt-1">Our compliance and investor support teams respond to all inquiries within one business day.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-purple-700 mb-2">Business Hours</h3>
                      <p className="text-gray-700 text-lg">Monday–Friday, 9:00 AM–6:00 PM Pacific Time</p>
                      <p className="text-gray-600 mt-1">Investor support is available outside business hours for urgent account matters.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-green-700 mb-2">Live Chat</h3>
                      <p className="text-gray-700 text-lg">Secure live chat is available via your dashboard after login.</p>
                      <p className="text-gray-600 mt-1">All conversations are encrypted and monitored for regulatory compliance.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-4xl font-bold text-[#0b2f6b] mb-8">Contact Form</h2>
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                    <input id="name" type="text" className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#2563eb] focus:outline-none transition" placeholder="John Doe" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                    <input id="email" type="email" className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#2563eb] focus:outline-none transition" placeholder="john@example.com" required />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-2">Subject *</label>
                    <input id="subject" type="text" className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#2563eb] focus:outline-none transition" placeholder="Account inquiry, compliance, or partnership" required />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">Message *</label>
                    <textarea id="message" rows={6} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#2563eb] focus:outline-none transition resize-none" placeholder="Please provide details regarding your inquiry." required />
                  </div>
                  <button type="submit" className="w-full bg-gradient-to-r from-[#0b2f6b] via-[#2563eb] to-[#1d4ed8] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">Submit</button>
                  <p className="text-sm text-gray-600 text-center">All fields are required. Your information is handled in accordance with our privacy policy.</p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
  )
}
