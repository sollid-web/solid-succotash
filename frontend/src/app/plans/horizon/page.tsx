import Head from 'next/head';

export default function HorizonPlanPage() {
  return (
    <>
      <Head>
        <title>Horizon Plan – 1.5% Daily ROI | WolvCapital Advanced Growth Investment</title>
        <meta name="description" content="Access 1.5% daily returns for 180 days with the Horizon Plan. Minimum $5,000 to $14,999. Designed for experienced investors seeking higher long-term growth." />
        <meta name="robots" content="index, follow" />
      </Head>
      <div className="min-h-screen bg-white">
        <section className="py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Horizon Plan</h1>
          <p className="text-lg text-gray-700 mb-6">1.5% Daily ROI | 180 Days</p>
          <p className="max-w-xl mx-auto text-gray-600 mb-8">Minimum $5,000 to $14,999. Designed for experienced investors seeking higher long-term growth.</p>
          {/* ...plan details, signup CTA, etc... */}
        </section>
      </div>
    </>
  );
}
