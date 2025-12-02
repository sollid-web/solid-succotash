import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function RiskDisclosurePage() {
	return (
		<>
			<Head>
				<title>Risk Disclosure · WolvCapital Digital Investment Platform</title>
				<meta name="description" content="Review WolvCapital’s risk disclosure for secure investment returns, cryptocurrency investment opportunities, and U.S. regulatory compliance." />
				<meta name="keywords" content="digital investment platform, risk disclosure, secure investment returns, cryptocurrency investment, regulated financial platform, WolvCapital" />
				<meta property="og:title" content="WolvCapital Risk Disclosure · U.S. Digital Investment Platform" />
				<meta property="og:description" content="Read WolvCapital’s official risk disclosure for secure investment returns and U.S. regulatory compliance." />
				<meta property="og:image" content="/images/og/risk-disclosure-og.jpg" />
				<meta property="og:image:type" content="image/jpeg" />
				<meta property="og:image:width" content="768" />
				<meta property="og:image:height" content="768" />
				<meta name="robots" content="index, follow" />
			</Head>

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
					<section className="max-w-2xl mx-auto py-16 px-4">
						<h1 className="text-4xl font-bold mb-6">Risk Disclosure Statement</h1>
						<p className="text-lg text-gray-700 mb-8">Investing in digital assets carries inherent financial risks. Past performance does not guarantee future results.</p>
						<h2 className="text-2xl font-semibold mb-4">Investor Acknowledgment</h2>
						<ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
							<li>ROI is based on market performance</li>
							<li>Cryptocurrency prices fluctuate</li>
							<li>There is potential for partial or total loss</li>
						</ul>
						<p className="text-lg text-blue-700 font-semibold mt-8">WolvCapital provides structured plans but cannot eliminate investment risks.</p>
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
								<p className="text-gray-300 text-sm leading-relaxed">U.S. regulated digital investment platform providing secure investment returns, robust compliance controls, and premium virtual card solutions for professional and institutional clients.</p>
							</div>
						</div>
						<div className="border-t border-gray-700 pt-8 text-center text-gray-400">
							<p>© 2025 WolvCapital. All rights reserved.</p>
						</div>
					</div>
				</footer>
			</div>
		</>
	);
}
