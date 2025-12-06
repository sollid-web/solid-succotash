import Link from 'next/link'
import Image from 'next/image'
import PublicLayout from '@/components/PublicLayout'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us — WolvCapital',
  description: 'Learn about WolvCapital\'s mission to provide secure, transparent digital asset investment opportunities with sustainable returns.',
  openGraph: {
    title: 'About WolvCapital',
    description: 'Global, Secure, Transparent Digital Asset Management',
    images: ['/og-images/about-og.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About WolvCapital',
    description: 'Global, Secure, Transparent Digital Asset Management',
    images: ['/og-images/about-og.png'],
  },
}

export default function AboutPage() {
  return (
    <PublicLayout backgroundClassName="bg-hero-about overlay-dark-40">
      {/* Hero */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-16 bg-black/50 text-white">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6">About WolvCapital</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto px-4">WolvCapital is a digital asset investment platform dedicated to delivering secure, transparent, and technology-driven financial solutions for individuals worldwide.</p>
          <div className="mt-6 sm:mt-8 flex justify-center">
              <div className="relative w-full max-w-[320px] sm:max-w-[480px] aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 mx-auto flex items-center justify-center">
                  <Image
                    src="/images/about-hero.jpg"
                    alt="WolvCapital About Hero"
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 320px, 480px"
                  />
              </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="space-y-8 sm:space-y-12">
            <div>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
                Since inception, our mission has been to simplify access to digital asset opportunities while maintaining industry-leading security, compliance, and operational excellence.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                Our investment model focuses on sustainable daily returns ranging from 1% to 2%, supported by diversified digital asset strategies and automated risk management tools. We operate with a global mindset, serving verified investors across more than 120 countries.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0b2f6b] mb-4 sm:mb-6">Our Commitment</h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
                We prioritize integrity, transparency, and professional risk management. Each investor benefits from:
              </p>
              <ul className="space-y-4 text-base sm:text-lg text-gray-700 list-disc pl-6">
                <li>1%–2% Daily ROI Plans</li>
                <li>256-bit SSL encryption</li>
                <li>KYC & AML compliance</li>
                <li>24/7 system monitoring and fraud detection</li>
                <li>Protected user-data environment</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0b2f6b] mb-4 sm:mb-6">Our Vision</h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                To become a trusted global leader in digital asset investment by offering accessible, secure, and consistent growth opportunities backed by innovation and professional oversight.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0b2f6b] mb-4 sm:mb-6">Our Values</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#0b2f6b] mb-2">Security First</h3>
                  <p className="text-base sm:text-lg text-gray-700">Every system is built with protection in mind.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0b2f6b] mb-2">Transparency</h3>
                  <p className="text-base sm:text-lg text-gray-700">Investors receive clear insights into operations and policies.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0b2f6b] mb-2">Accessibility</h3>
                  <p className="text-base sm:text-lg text-gray-700">Our platform is designed for both new and experienced investors.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0b2f6b] mb-2">Sustainability</h3>
                  <p className="text-base sm:text-lg text-gray-700">We prioritize steady, controlled investment performance.</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl">
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                WolvCapital continues to evolve as global digital markets grow, maintaining a forward-thinking approach to investor success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
                <li><Link href="/legal/certificate-of-operation" className="text-gray-300 hover:text-white transition">Certificate of Operation</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-gray-300">
                <li>support@wolvcapital.com</li>
                <li>24/7 Support</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">WolvCapital</h3>
              <p className="text-gray-300 text-sm leading-relaxed">WolvCapital is a digital asset investment platform providing secure and sustainable daily ROI opportunities through diversified strategies and advanced risk controls. With global investor support, AML/KYC compliance, and industry-grade security, WolvCapital delivers a trusted environment for digital asset growth.</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>© 2025 WolvCapital. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </PublicLayout>
  )
}
