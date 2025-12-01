import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Embedded Canvas | WolvCapital',
  description: 'Embedded brochure or design exported from Canva.',
}

type PageProps = {
  params: { slug: string }
}

export default function CanvasEmbedPage({ params }: PageProps) {
  const { slug } = params
  const htmlSrc = `/canvas/${slug}.html`
  const pdfSrc = `/canvas/${slug}.pdf`

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Embedded Canvas</h1>
          <p className="text-gray-600">Serving from public: <code className="font-mono">/public/canvas/{slug}.html</code> or <code className="font-mono">.pdf</code></p>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="rounded-2xl shadow-lg bg-white overflow-hidden">
          {/* Try HTML embed via iframe */}
          <iframe
            src={htmlSrc}
            className="w-full h-[80vh]"
            title={`Canvas HTML ${slug}`}
          />
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <p>If the HTML is not available, you can also export a PDF and place it at <code className="font-mono">/public/canvas/{slug}.pdf</code>. PDF preview:</p>
        </div>

        <div className="mt-3 rounded-2xl shadow bg-white overflow-hidden">
          <object data={pdfSrc} type="application/pdf" className="w-full h-[80vh]">
            <p className="p-4 text-gray-700">PDF preview not available. <a href={pdfSrc} className="text-blue-600 underline">Download PDF</a></p>
          </object>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>To update this page, upload your exported file(s) to <code className="font-mono">frontend/public/canvas/</code> with the name <code className="font-mono">{slug}.html</code> or <code className="font-mono">{slug}.pdf</code>.</p>
        </div>
      </section>
    </main>
  )
}
