import Head from 'next/head';

export default function SummitPlanPage() {
  return (
    <>
      <Head>
        <title>Summit VIP Plan – 2% Daily ROI | WolvCapital High-Net-Worth Annual Investment</title>
        <meta name="description" content="Earn 2% daily for 365 days with the Summit VIP Plan. Minimum $15,000 to $100,000. Exclusive annual program for high-net-worth and institutional investors." />
        <meta name="robots" content="index, follow" />
      </Head>
      <div className="min-h-screen bg-white">
        <section className="py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Summit VIP Plan</h1>
          <p className="text-lg text-gray-700 mb-6">2% Daily ROI | 365 Days</p>
          <p className="max-w-xl mx-auto text-gray-600 mb-8">Minimum $15,000 to $100,000. Exclusive annual program for high-net-worth and institutional investors.</p>
          {/* ...plan details, signup CTA, etc... */}
        </section>
      </div>
    </>
  );
}
