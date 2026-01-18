import type { Metadata } from 'next'
import Link from 'next/link'
import SignatureImage from '@/components/SignatureImage'
import CertificateActions from './CertificateActions'
import { getApiBaseUrl } from '@/lib/api'

export const metadata: Metadata = {
  title: 'Certificate of Operation · WolvCapital',
  description: 'Branded Certificate of Operation for WolvCapital with verification details.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'WolvCapital · Certificate of Operation',
    description: 'Branded Certificate of Operation with verification details.',
    images: [{ url: '/images/home-og.jpg', width: 1200, height: 630 }],
  },
}

async function fetchCertificate() {
  const base = getApiBaseUrl()
  const res = await fetch(`${base}/api/public/certificate/`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json() as Promise<{
    title: string
    certificate_id: string
    issue_date: string
    jurisdiction: string
    issuing_authority: string
    verification_url: string
    authority_seal_url?: string
    signature_1_url?: string
    signature_2_url?: string
  }>
}

export default async function CertificateOfOperationPage() {
  const data = await fetchCertificate()
  const certificateId = data?.certificate_id || 'WC-OP-2025-0001'
  const issueDate = data?.issue_date || '2025-11-27'
  const jurisdiction = data?.jurisdiction || 'United States'
  const issuingAuthority = data?.issuing_authority || 'Issuing Authority'
  const verificationUrl = data?.verification_url || `https://wolvcapital.com/legal/certificate-of-operation?cert=${certificateId}`
  const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(verificationUrl)}`

  return (
    <div className="min-h-screen bg-hero-legal bg-cover bg-center bg-no-repeat overlay-dark-60">
      <main className="container-readable">
        <section className="certificate-shell print:bg-white">
          <div className="certificate-border">
            <div className="certificate-watermark">W</div>
            <div className="p-6 sm:p-10 relative">
              <header className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#0b2f6b] to-[#2563eb] rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white">W</span>
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight h-readable">WolvCapital</h1>
                    <p className="text-xs sm:text-sm text-gray-500">Digital Investment Platform</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-3 text-right">
                  <div className="hidden md:block">
                    <p className="text-xs text-gray-500">Verify at</p>
                    <p className="text-xs font-semibold text-[#0b2f6b]">wolvcapital.com/legal/certificate-of-operation</p>
                  </div>
                  {data?.authority_seal_url ? (
                    <SignatureImage
                      src={data.authority_seal_url}
                      alt="Issuing authority seal"
                      className="w-12 h-12 object-contain"
                    />
                  ) : null}
                </div>
              </header>

              <div className="panel-readable rounded-xl p-6 sm:p-10">
                <div className="text-center mb-6">
                  <p className="tracking-[0.35em] text-[10px] sm:text-xs text-gray-500 mb-2">OFFICIAL DOCUMENT</p>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0b2f6b]">Certificate of Operation</h2>
                </div>

                <p className="p-readable text-sm sm:text-base leading-relaxed text-justify">
                  This document acknowledges that <span className="font-semibold">WolvCapital</span> is organized and operating as a digital investment platform subject to applicable financial laws, compliance requirements, and manual review protocols. This certificate serves as a public attestation of the platform’s operational status and commitment to transparent, supervised financial workflows.
                </p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-xs text-gray-500">Certificate ID</p>
                    <p className="text-sm sm:text-base font-semibold text-[#0b2f6b]">{certificateId}</p>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-xs text-gray-500">Issue Date</p>
                    <p className="text-sm sm:text-base font-semibold text-[#0b2f6b]">{issueDate}</p>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-xs text-gray-500">Jurisdiction</p>
                    <p className="text-sm sm:text-base font-semibold text-[#0b2f6b]">{jurisdiction}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-start">
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-xs text-gray-500">Issuing Authority</p>
                    <p className="text-sm sm:text-base font-semibold text-[#0b2f6b]">{issuingAuthority}</p>
                    <p className="text-[11px] text-gray-500 mt-1">Replace with the appropriate authority name and reference number.</p>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-center">
                    <img src={qrApi} alt="Verification QR" className="w-28 h-28 sm:w-36 sm:h-36" />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col">
                    {data?.signature_1_url ? (
                      <SignatureImage
                        src={data.signature_1_url}
                        alt="Authorized signatory signature"
                        className="signature-img mb-2"
                      />
                    ) : null}
                    <div className="signature-line" />
                    <p className="text-xs text-gray-500 mt-1">Authorized Signatory</p>
                  </div>
                  <div className="flex flex-col">
                    {data?.signature_2_url ? (
                      <SignatureImage
                        src={data.signature_2_url}
                        alt="Regulatory affairs signature"
                        className="signature-img mb-2"
                      />
                    ) : null}
                    <div className="signature-line" />
                    <p className="text-xs text-gray-500 mt-1">Regulatory Affairs</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="certificate-seal">
                      <span className="text-[10px] sm:text-xs font-bold tracking-wider">WOLVCAPITAL</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-center">
                  <div>
                    <p className="text-[11px] text-gray-500">Verification URL</p>
                    <p className="text-xs sm:text-sm font-semibold text-[#0b2f6b] break-all">{verificationUrl}</p>
                  </div>
                  <CertificateActions />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
