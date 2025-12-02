import Head from 'next/head';
import Link from 'next/link'
import Image from 'next/image'

export default function PrivacyPolicyPage() {
  return (
    <>
      <Head>
  <title>Privacy Policy · WolvCapital Digital Investment Platform</title>
  <meta name="description" content="Review WolvCapital’s privacy policy for secure investment returns, cryptocurrency investment opportunities, and U.S. regulatory compliance." />
  <meta name="keywords" content="digital investment platform, U.S. fintech company, secure investment returns, cryptocurrency investment, regulated financial platform, privacy policy, WolvCapital" />
  <meta property="og:title" content="WolvCapital Privacy Policy · U.S. Digital Investment Platform" />
  <meta property="og:description" content="Learn about WolvCapital’s user data protection and privacy practices, compliant with U.S. financial regulations." />
  <meta property="og:image" content="/images/legal/wolvcapital-privacy-policy.jpg" />
  <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-hero-privacy bg-cover bg-center bg-no-repeat overlay-dark-60">
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
    <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
    <p className="text-lg text-gray-700 mb-8">WolvCapital prioritizes user privacy and complies with global data protection standards.</p>
    <h2 className="text-2xl font-semibold mb-4">We Collect</h2>
    <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
      <li>Basic account information</li>
      <li>Transaction details</li>
      <li>Platform usage data</li>
    </ul>
    <h2 className="text-2xl font-semibold mb-4">We Use Data To</h2>
    <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
      <li>Deliver services</li>
      <li>Secure your account</li>
      <li>Improve platform performance</li>
    </ul>
    <p className="text-lg text-blue-700 font-semibold mt-8">Your data is not sold or shared with third parties for marketing.</p>
  </section>
</main>

      </div>
    </>
  )
}
