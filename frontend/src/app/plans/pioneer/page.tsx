import Head from 'next/head';

export default function PioneerPlanPage() {
  return (
    <>
      <Head>
        <title>Pioneer Plan – 1% Daily ROI | WolvCapital Entry-Level Investment</title>
        <meta name="description" content="Start with the Pioneer Plan and earn 1% daily for 90 days. Minimum $100, maximum $999. Ideal for new investors seeking stable and secure digital asset growth." />
        <meta name="robots" content="index, follow" />
      </Head>
      <div className="min-h-screen bg-white">
        <section className="py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Pioneer Plan</h1>
          <p className="text-lg text-gray-700 mb-6">1% Daily ROI | 90 Days</p>
          <p className="max-w-xl mx-auto text-gray-600 mb-8">Minimum $100, maximum $999. Ideal for new investors seeking stable and secure digital asset growth.</p>
          {/* ...plan details, signup CTA, etc... */}
        </section>
      </div>
    </>
  );
}
