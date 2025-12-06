import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Risk Disclosure — WolvCapital',
  description: 'Understand the risks associated with digital asset investment. WolvCapital provides transparent disclosure of investment risks and volatility.',
  openGraph: {
    title: 'Risk Disclosure — WolvCapital',
    description: 'Understand Digital Asset Investment Risks',
    images: ['/og-images/risk-disclosure-og.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Risk Disclosure — WolvCapital',
    description: 'Understand Digital Asset Investment Risks',
    images: ['/og-images/risk-disclosure-og.png'],
  },
};

export default function RiskDisclosurePage() {
	return (
			<div className="min-h-screen bg-hero-risk bg-cover bg-center bg-no-repeat">
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

				<section className="pt-32 pb-16 bg-black/50 text-white">
					<div className="container mx-auto px-4 lg:px-8 text-center">
						<h1 className="text-5xl lg:text-6xl font-extrabold mb-6">Risk Disclosure</h1>
						<p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
							Understand the risks associated with digital asset investments. WolvCapital provides secure investment opportunities, but all investments carry inherent risk and are subject to market volatility and regulatory review.
						</p>
						<div className="mt-8 flex justify-center">
							<div className="relative w-full max-w-[480px] aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 mx-auto flex items-center justify-center">
								<Image
									src="/images/og/risk-disclosure-hero.jpg"
									alt="WolvCapital Risk Disclosure Document"
									fill
									priority
									className="object-cover object-center"
									sizes="100vw"
								/>
							</div>
						</div>
					</div>
				</section>

				<main className="min-h-screen bg-white">
					<section className="max-w-4xl mx-auto py-16 px-4 space-y-10">
						<div>
							<p className="text-lg text-gray-700 mb-6">
								All investment opportunities carry inherent risk. Digital asset markets are particularly volatile, with prices subject to significant fluctuation. Past performance does not guarantee future results.
							</p>
							<p className="text-lg text-gray-700">
								By investing with WolvCapital, you acknowledge and accept the following risks:
							</p>
						</div>
						
						<div>
							<h2 className="text-3xl font-bold text-[#0b2f6b] mb-6">Market Volatility</h2>
							<p className="text-lg text-gray-700 leading-relaxed">
								Digital asset prices may experience rapid and unpredictable changes. Market conditions can impact the value of your investments at any time.
							</p>
						</div>

						<div>
							<h2 className="text-3xl font-bold text-[#0b2f6b] mb-6">No Guarantees</h2>
							<p className="text-lg text-gray-700 leading-relaxed">
								WolvCapital does not guarantee investment returns. While our strategies aim for consistent ROI, external factors may affect performance.
							</p>
						</div>

						<div>
							<h2 className="text-3xl font-bold text-[#0b2f6b] mb-6">Operational Risk</h2>
							<p className="text-lg text-gray-700 leading-relaxed">
								Technology failures, cybersecurity incidents, or human error may affect platform operations. We employ industry-standard security protocols but cannot eliminate all operational risk.
							</p>
						</div>

						<div>
							<h2 className="text-3xl font-bold text-[#0b2f6b] mb-6">Regulatory Considerations</h2>
							<p className="text-lg text-gray-700 leading-relaxed">
								Digital asset regulations vary by jurisdiction. Legal or regulatory changes may impact platform operations or investment availability.
							</p>
						</div>

						<div className="bg-blue-50 p-8 rounded-2xl">
							<p className="text-lg text-gray-700 leading-relaxed font-semibold">
								Only invest funds you can afford to lose. Review all terms and policies before participating. Contact support for further clarification.
							</p>
						</div>
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
								</ul>
							</div>
							<div>
								<h3 className="text-xl font-bold mb-4">Contact Info</h3>
								<ul className="space-y-2 text-gray-300">
									<li>support@wolvcapital.com</li>
									<li>Compliance & Investor Support</li>
								</ul>
							</div>
							<div>
								<h3 className="text-xl font-bold mb-4">WolvCapital</h3>
								<p className="text-gray-300 text-sm leading-relaxed">WolvCapital is a digital asset investment platform providing secure and sustainable daily ROI opportunities through diversified strategies and advanced risk controls. With global investor support, AML/KYC compliance, and industry-grade security, WolvCapital delivers a trusted environment for digital asset growth.</p>
							</div>
						</div>
						<div className="border-t border-gray-700 pt-8 text-center text-gray-400">
							<p>© 2025 WolvCapital. All rights reserved.</p>
						</div>
				</div>
			</footer>
		</div>
	);
}