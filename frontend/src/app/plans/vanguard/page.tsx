import Head from 'next/head';

export default function VanguardPlanPage() {
  return (
    <>
      <Head>
        <title>Vanguard Plan – 1.25% Daily ROI | WolvCapital Popular Mid-Tier Investment</title>
        <meta name="description" content="Earn 1.25% daily for 150 days with the Vanguard Plan. Minimum $1,000 to $4,999. A balanced option offering audited, consistent portfolio growth." />
        <meta name="robots" content="index, follow" />
      </Head>
      <div className="min-h-screen bg-white">
        <section className="py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Vanguard Plan</h1>
          <p className="text-lg text-gray-700 mb-6">1.25% Daily ROI | 150 Days</p>
          <p className="max-w-xl mx-auto text-gray-600 mb-8">Minimum $1,000 to $4,999. A balanced option offering audited, consistent portfolio growth.</p>
          {/* ...plan details, signup CTA, etc... */}
        </section>
      </div>
    </>
  );
}
