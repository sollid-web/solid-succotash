import React from 'react';

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-2xl mx-auto py-16 px-4">
        <h1 className="text-4xl font-bold mb-6">Legal & Compliance Overview</h1>
        <p className="text-lg text-gray-700 mb-8">WolvCapital is committed to maintaining high standards of operational transparency, data protection, and responsible investment practices.</p>
        <h2 className="text-2xl font-semibold mb-4">Compliance Focus Areas</h2>
        <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
          <li>Data Protection & Privacy</li>
          <li>Secure Asset Handling</li>
          <li>Transparent Investment Terms</li>
          <li>Responsible Communication</li>
          <li>User Identity & Account Protection</li>
        </ul>
        <p className="text-lg text-blue-700 font-semibold mt-8">Our goal is to provide a safe, responsible, and compliant investment environment.</p>
      </section>
    </main>
  );
}