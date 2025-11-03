import Link from 'next/link'
import Image from 'next/image'

export default function RiskDisclosurePage() {
  return (
    <div className="min-h-screen bg-white">
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

      <section className="pt-32 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-[#0b2f6b] mb-4">Risk Disclosure</h1>
            <p className="text-xl text-gray-600">Important information about cryptocurrency and investment risks</p>
          </div>

          <div className="grid lg:grid-cols-[420px_1fr] gap-12 items-start mb-12">
            {/* Risk Disclosure Image */}
            <div className="mx-auto lg:mx-0">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-200">
                <Image
                  src="/img/wolvcapital-risk-disclosure.jpg"
                  alt="Professional reviewing investment risk analysis with WolvCapital platform"
                  width={480}
                  height={720}
                  priority
                  sizes="(min-width: 1024px) 420px, 90vw"
                  className="w-full h-auto object-cover animate-fadeIn"
                />
              </div>
              <p className="text-sm text-gray-500 text-center mt-4 italic">
                Understanding risks is essential for informed investment decisions
              </p>
            </div>

            {/* Warning Banner */}
            <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-xl">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-red-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-lg font-bold text-red-800 mb-2">High Risk Investment Warning</h3>
                  <p className="text-red-700">Investing in cryptocurrencies and digital assets involves significant risk. Never invest money you cannot afford to lose.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="prose max-w-none space-y-8 bg-white rounded-2xl p-8 lg:p-12 shadow-lg">
            <p className="text-lg text-gray-700">
              Investing in cryptocurrencies and digital assets involves significant risk. By using WolvCapital, you acknowledge and accept the following risks:
            </p>

            <div>
              <h2 className="text-2xl font-bold text-[#0b2f6b] mb-4">Market Volatility</h2>
              <p className="text-gray-700">
                Cryptocurrency markets are highly volatile. Prices may fluctuate rapidly and unpredictably, resulting in potential substantial gains or losses.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0b2f6b] mb-4">Regulatory Uncertainty</h2>
              <p className="text-gray-700">
                The legal and regulatory framework for digital assets is evolving and varies by jurisdiction. Changes in laws or enforcement actions may impact platform operations or asset values.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0b2f6b] mb-4">Security Risks</h2>
              <p className="text-gray-700 mb-3">While WolvCapital employs advanced security measures, potential risks include:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Cybersecurity attacks and data breaches</li>
                <li>Technical vulnerabilities in blockchain protocols</li>
                <li>Human error in manual review processes</li>
                <li>System outages or technical failures</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0b2f6b] mb-4">Liquidity Risk</h2>
              <p className="text-gray-700">
                Certain assets or investment plans may have limited liquidity. Market conditions or platform policies may impact the availability of funds when needed.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0b2f6b] mb-4">Manual Review Process</h2>
              <p className="text-gray-700 mb-3">Our manual off-chain approval process introduces specific risks:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Processing delays of 24-72 hours or longer</li>
                <li>Potential for human error in transaction review</li>
                <li>Limited availability during non-business hours</li>
                <li>Inability to process urgent or time-sensitive requests</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0b2f6b] mb-4">No Financial Advice</h2>
              <p className="text-gray-700">
                Information provided on the platform does not constitute financial, legal, or investment advice. Users should conduct their own research and consult qualified professionals before making investment decisions.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0b2f6b] mb-4">Your Acknowledgment</h2>
              <p className="text-gray-700 mb-3">By participating in WolvCapital's services, you agree that:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>You understand the high-risk nature of cryptocurrency investments</li>
                <li>You are investing only funds you can afford to lose entirely</li>
                <li>You have read and understood this comprehensive risk disclosure</li>
                <li>You accept full responsibility for all investment decisions</li>
                <li>You will not hold WolvCapital liable for investment losses</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mt-8">
              <h3 className="text-lg font-bold text-yellow-800 mb-2">Seek Professional Advice</h3>
              <p className="text-yellow-700">
                If you are unsure about any investment decision or the risks involved, you should seek advice from qualified financial, legal, and tax professionals before proceeding.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/" className="text-[#2563eb] hover:text-[#1d4ed8] font-semibold">← Back to Home</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
