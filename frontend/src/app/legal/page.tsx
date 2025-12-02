
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function LegalPage() {
  return (
    <>
      <Head>
        <title>Legal & Compliance · WolvCapital Digital Investment Platform</title>
        <meta name="description" content="Review WolvCapital’s legal and compliance standards for secure investment returns, cryptocurrency investment opportunities, and U.S. regulatory compliance." />
        <meta name="keywords" content="digital investment platform, U.S. fintech company, secure investment returns, cryptocurrency investment, regulated financial platform, legal, compliance, WolvCapital" />
        <meta property="og:title" content="Legal & Compliance · WolvCapital Digital Investment Platform" />
        <meta property="og:description" content="Learn about WolvCapital’s legal, compliance, and risk management practices, compliant with U.S. financial regulations." />
        <meta property="og:image" content="/images/legal/terms.svg" />
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
            <h1 className="text-4xl font-bold mb-6">Legal & Compliance Overview</h1>
            <div className="mb-8 flex justify-center">
              <div className="relative w-full max-w-[480px] aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-200">
                <Image
                  src="/img/legal_disclaimer_wolvcapital.jpg"
                  alt="Legal practitioner signing WolvCapital disclaimer documents"
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 480px"
                />
              </div>
            </div>
            <p className="text-lg text-gray-700 mb-8">WolvCapital is committed to maintaining high standards of operational transparency, data protection, and responsible investment practices. Our legal and compliance framework is designed to protect investors, ensure regulatory adherence, and foster trust in digital asset management.</p>
            <h2 className="text-2xl font-semibold mb-4">Compliance Focus Areas</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Data Protection & Privacy (GDPR, CCPA)</li>
              <li>Secure Asset Handling & Custody</li>
              <li>Transparent Investment Terms</li>
              <li>Responsible Communication & Disclosure</li>
              <li>User Identity & Account Protection (AML/KYC)</li>
              <li>Manual Off-Chain Review for All Transactions</li>
              <li>Regulatory Compliance (SEC, CFTC, FinCEN)</li>
            </ul>
            <h2 className="text-2xl font-semibold mb-4">Key Legal Documents</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li><Link href="/terms-of-service" className="text-blue-700 underline">Terms of Service</Link></li>
              <li><Link href="/legal-disclaimer" className="text-blue-700 underline">Legal Disclaimer</Link></li>
              <li><Link href="/risk-disclosure" className="text-blue-700 underline">Risk Disclosure</Link></li>
              <li><Link href="/privacy" className="text-blue-700 underline">Privacy Policy</Link></li>
              <li><Link href="/legal/certificate-of-operation" className="text-blue-700 underline">Certificate of Operation</Link></li>
            </ul>
            <p className="text-lg text-blue-700 font-semibold mt-8">Our goal is to provide a safe, responsible, and compliant investment environment for all users.</p>
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