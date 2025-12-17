import Link from 'next/link';
import Image from 'next/image';

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-white">
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

    </div>
  );
}
