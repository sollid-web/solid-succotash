import PublicLayout from '@/components/PublicLayout'
import { generateOgMetadata } from '@/lib/og-metadata'
import { WalletProviderClient } from '@/_client/WalletProviderClient'
import PresaleWidget from '@/_client/PresaleWidget'
import ShareButtons from '@/components/ShareButtons'

export const metadata = generateOgMetadata('presale')

export default function PresalePage() {
  return (
    <PublicLayout backgroundClassName="bg-hero-wolv overlay-dark-60">
      <div className="min-h-screen">
        <section className="relative overflow-hidden pt-24 sm:pt-32 pb-20 sm:pb-28">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div style={{
              width: '700px', height: '700px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,168,150,0.13) 0%, rgba(42,82,190,0.10) 40%, transparent 70%)',
              filter: 'blur(40px)',
            }} />
          </div>

          <div className="relative container mx-auto px-4 lg:px-8 text-center">
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-8"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' }}>
              Presale Ended
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-[1.05] tracking-tight">
              WOLV Presale
              <span className="block mt-2" style={{
                background: 'linear-gradient(135deg, #00c9b1 0%, #7cc7ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Closed
              </span>
            </h1>

            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
              The WOLV presale concluded successfully. WOLV is now live and trading on PancakeSwap V2 — buy WOLV directly on DEX with any BNB wallet, no registration required.
            </p>

            <div className="max-w-lg mx-auto rounded-2xl p-8 text-center" style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(0,168,150,0.2)' }}>
              <div className="text-4xl mb-4">🥞</div>
              <h3 className="text-white font-bold text-xl mb-2">WOLV is Live on PancakeSwap</h3>
              <p className="text-slate-400 text-sm mb-6">WOLV/BNB pair · PancakeSwap V2 · BNB Smart Chain · Contract verified on BSCScan</p>
              <a
                href="https://pancakeswap.finance/swap?outputCurrency=0xe0167279aef7bf4ad313d261da82e8366822270c"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #00a896, #2A52BE)' }}
              >
                Buy WOLV on PancakeSwap →
              </a>
              <p className="text-slate-500 text-xs mt-4">
                Contract: 0xe0167279aef7bf4ad313d261da82e8366822270c
              </p>
            </div>

            <div className="mt-6 flex justify-center">
              <ShareButtons
                url="https://www.wolvcapital.com/wolv-token"
                text="WOLV is now live on PancakeSwap V2 — trade WOLV/BNB on BNB Smart Chain."
              />
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}
