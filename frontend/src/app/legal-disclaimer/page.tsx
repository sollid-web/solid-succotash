
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function LegalDisclaimerPage() {
  return (
    <>
      <Head>
        <title>Legal Disclaimer · WolvCapital Digital Investment Platform</title>
        <meta name="description" content="Read WolvCapital’s official legal disclaimer for secure investment returns, cryptocurrency investment opportunities, and U.S. regulatory compliance." />
        <meta name="keywords" content="digital investment platform, U.S. fintech company, secure investment returns, cryptocurrency investment, regulated financial platform, legal disclaimer, WolvCapital" />
        <meta property="og:title" content="WolvCapital Legal Disclaimer · U.S. Digital Investment Platform" />
        <meta property="og:description" content="Official investment disclaimer and compliance notice by WolvCapital, a U.S. regulated platform." />
        <meta property="og:image" content="/images/legal/wolvcapital-legal-disclaimer.jpg" />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-hero-legal bg-cover bg-center bg-no-repeat overlay-dark-60">
        <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#0b2f6b] to-[#2563eb] rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">W</span>
                </div>
                <span className="text-2xl font-bold text-[#0b2f6b]">WolvCapital</span>
              </Link>
            </div>
          </div>
        </nav>

        <main className="min-h-screen bg-white">
          <section className="max-w-2xl mx-auto py-16 px-4">
            <h1 className="text-4xl font-bold mb-6">Legal Disclaimer</h1>
            <p className="text-lg text-gray-700 mb-8">
              <strong>WolvCapital is a U.S. regulated digital investment platform. All information provided on this website, including investment returns, product descriptions, and service features, is for informational purposes only and does not constitute financial, investment, or legal advice.</strong>
            </p>
            <h2 className="text-2xl font-semibold mb-4">No Guarantee of Returns</h2>
            <p className="mb-6 text-gray-700">
              Investment returns are subject to market risk, volatility, and regulatory changes. Past performance is not indicative of future results. WolvCapital does not guarantee any specific rate of return or profit.
            </p>
            <h2 className="text-2xl font-semibold mb-4">Regulatory Status & Compliance</h2>
            <p className="mb-6 text-gray-700">
              WolvCapital operates in compliance with applicable U.S. financial regulations, including AML/KYC requirements. Users are responsible for ensuring their activities comply with local laws and regulations.
            </p>
            <h2 className="text-2xl font-semibold mb-4">User Responsibilities</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Maintain the confidentiality and security of account credentials.</li>
              <li>Review all investment risks and disclosures before participating.</li>
              <li>Provide accurate information for compliance verification.</li>
              <li>Understand that all transactions are subject to manual review and may be delayed (24-72 hours).</li>
            </ul>
            <h2 className="text-2xl font-semibold mb-4">Service Availability & Limitations</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>WolvCapital reserves the right to modify, suspend, or discontinue any service at any time.</li>
              <li>Platform access may be restricted due to regulatory, technical, or operational reasons.</li>
              <li>All investments are subject to approval and may be declined at the platform’s discretion.</li>
            </ul>
            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
            <p className="mb-6 text-gray-700">
              WolvCapital, its affiliates, and partners shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of this platform, including but not limited to loss of funds, data, or business opportunities.
            </p>
            <h2 className="text-2xl font-semibold mb-4">Contact & Support</h2>
            <p className="mb-6 text-gray-700">
              For legal, compliance, or support inquiries, contact us at <a href="mailto:legal@wolvcapital.com" className="text-blue-700 underline">legal@wolvcapital.com</a> or <a href="mailto:support@wolvcapital.com" className="text-blue-700 underline">support@wolvcapital.com</a>.
            </p>
            <p className="text-lg text-blue-700 font-semibold mt-8">Always invest responsibly and consult a qualified financial advisor before making investment decisions.</p>
          </section>
        </main>

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
                  <li>legal@wolvcapital.com</li>
                  <li>compliance@wolvcapital.com</li>
                  <li>24/7 Support</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">WolvCapital</h3>
                <p className="text-gray-300 text-sm leading-relaxed">WolvCapital is a U.S. regulated digital investment platform providing secure investment returns, robust compliance controls, and premium virtual card solutions for professional and institutional clients.</p>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
              <p>© 2025 WolvCapital. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
