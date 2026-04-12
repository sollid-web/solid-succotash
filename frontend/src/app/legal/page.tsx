import Link from 'next/link';

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="min-h-screen bg-white">
        <section className="max-w-2xl mx-auto py-16 px-4">
          <h1 className="text-4xl font-bold mb-6">Legal & Compliance Overview</h1>
          
          {/* Blockquote replacing image */}
          <div className="mb-8 border-l-4 border-brand-primary pl-6 py-4">
            <blockquote className="text-lg italic text-gray-700 mb-2">
              "WolvCapital is committed to full regulatory transparency. All legal documents are available upon request and disclosed before account activation."
            </blockquote>
            <p className="text-sm text-gray-600">— WolvCapital Compliance Team</p>
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
