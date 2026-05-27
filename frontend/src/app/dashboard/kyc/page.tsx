'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'

// ─── Types ───────────────────────────────────────────────────────────────────

interface KYCStep {
  id: number
  title: string
  description: string
  status: 'completed' | 'pending' | 'required' | 'failed'
  required: boolean
}

interface DocumentMetadata {
  name: string
  type?: string
  size?: number
  source?: 'local' | 'server'
}

interface KycApplication {
  id: string
  status: 'draft' | 'pending' | 'approved' | 'rejected'
  personal_info: Record<string, any> | null
  document_info: {
    government_id_front?: DocumentMetadata | null
    government_id_back?: DocumentMetadata | null
    proof_of_address?: DocumentMetadata | null
    [key: string]: any
  } | null
  personal_info_submitted_at: string | null
  document_submitted_at: string | null
  last_submitted_at: string | null
  reviewed_by_email?: string | null
  reviewed_at: string | null
  reviewer_notes: string
  rejection_reason: string
  created_at: string
  updated_at: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_KYC_STEPS: KYCStep[] = [
  {
    id: 1,
    title: 'Email Verification',
    description: 'Verify your email address',
    status: 'completed',
    required: true,
  },
  {
    id: 2,
    title: 'Personal Information',
    description: 'Complete your personal profile',
    status: 'required',
    required: true,
  },
  {
    id: 3,
    title: 'Identity Documents',
    description: 'Upload government-issued ID (front & back) and proof of address',
    status: 'required',
    required: true,
  },
  {
    id: 4,
    title: 'Enhanced Verification',
    description: 'Additional verification for higher limits (optional)',
    status: 'required',
    required: true,
  },
]

const APPLICATION_STATUS_TO_STEP_STATUS: Record<KycApplication['status'], KYCStep['status']> = {
  draft: 'required',
  pending: 'pending',
  approved: 'completed',
  rejected: 'failed',
}

const STATUS_LABEL: Record<KycApplication['status'], string> = {
  draft: 'Not Started',
  pending: 'Pending Review',
  approved: 'Approved',
  rejected: 'Action Required',
}

const STATUS_BADGE_CLASS: Record<KycApplication['status'], string> = {
  draft: 'bg-slate-700 text-slate-300',
  pending: 'bg-amber-900/60 text-amber-300 border border-amber-700',
  approved: 'bg-emerald-900/60 text-emerald-300 border border-emerald-700',
  rejected: 'bg-red-900/60 text-red-300 border border-red-700',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const hasJsonContent = (v: Record<string, any> | null | undefined) =>
  Boolean(v && Object.keys(v).length > 0)

const hasPersonalInfoSubmission = (app: KycApplication | null) => {
  if (!app) return false
  if (app.status === 'approved' || app.status === 'rejected') return true
  return Boolean(app.personal_info_submitted_at || hasJsonContent(app.personal_info))
}

const hasDocumentSubmission = (app: KycApplication | null) => {
  if (!app) return false
  if (app.status === 'approved' || app.status === 'rejected') return true
  return Boolean(app.document_submitted_at || hasJsonContent(app.document_info))
}

const formatFileSize = (bytes?: number) => {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepIcon({ status }: { status: string }) {
  if (status === 'completed')
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    )
  if (status === 'pending')
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  if (status === 'failed')
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    )
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  )
}

function stepColor(status: string) {
  if (status === 'completed') return 'text-emerald-400 bg-emerald-900/50 border-emerald-700'
  if (status === 'pending') return 'text-amber-400 bg-amber-900/50 border-amber-700'
  if (status === 'failed') return 'text-red-400 bg-red-900/50 border-red-700'
  return 'text-slate-400 bg-slate-800 border-slate-600'
}

// Upload dropzone for a single file slot
interface DropZoneProps {
  id: string
  label: string
  sublabel: string
  badge?: string      // e.g. "FRONT" | "BACK"
  badgeColor?: string
  file: DocumentMetadata | null
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
}

function DropZone({ id, label, sublabel, badge, badgeColor = 'bg-blue-700 text-blue-100', file, onChange, required }: DropZoneProps) {
  const hasFile = Boolean(file)
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-200">{label}</span>
        {badge && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full tracking-widest uppercase ${badgeColor}`}>
            {badge}
          </span>
        )}
        {required && <span className="text-[10px] text-red-400 font-semibold">Required</span>}
      </div>
      <div className="relative group">
        <input
          type="file"
          id={id}
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={onChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          aria-label={label}
        />
        <div
          className={`
            border-2 border-dashed rounded-xl p-5 text-center transition-all duration-200
            ${hasFile
              ? 'border-emerald-500 bg-emerald-950/40'
              : 'border-slate-600 bg-slate-900/60 group-hover:border-blue-500 group-hover:bg-slate-900/90'
            }
          `}
        >
          {hasFile ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-emerald-900/60 border border-emerald-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-emerald-300 font-medium truncate max-w-[180px]">{file!.name}</p>
              {file!.size && (
                <p className="text-xs text-emerald-500">{formatFileSize(file!.size)}</p>
              )}
              <p className="text-[11px] text-emerald-600 mt-0.5">
                {file!.source === 'server' ? '✓ On file — click to replace' : '✓ Ready to submit'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-1">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center group-hover:border-blue-500 transition-colors">
                <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-sm text-slate-300 font-medium">{sublabel}</p>
              <p className="text-[11px] text-slate-500">JPG, PNG or PDF · max 5 MB</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function KYCPage() {
  const [kycSteps, setKycSteps] = useState<KYCStep[]>(() =>
    DEFAULT_KYC_STEPS.map(s => ({ ...s }))
  )
  const [latestApplication, setLatestApplication] = useState<KycApplication | null>(null)
  const [loadingStatus, setLoadingStatus] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [selectedStep, setSelectedStep] = useState(2)
  const [messageTone, setMessageTone] = useState<'success' | 'error'>('success')
  const [submitMessage, setSubmitMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    address: '',
  })

  // Three upload slots: front of ID, back of ID, proof of address
  const [uploadedFiles, setUploadedFiles] = useState({
    governmentIdFront: null as DocumentMetadata | null,
    governmentIdBack: null as DocumentMetadata | null,
    proofOfAddress: null as DocumentMetadata | null,
  })

  // ── Derivation helpers ─────────────────────────────────────────────────────

  const statusFromApplication = useCallback(
    (app: KycApplication | null, hasSubmission: boolean): KYCStep['status'] => {
      if (!app) return 'required'
      if (!hasSubmission) {
        if (app.status === 'approved') return 'completed'
        if (app.status === 'rejected') return 'failed'
        return 'required'
      }
      return APPLICATION_STATUS_TO_STEP_STATUS[app.status] ?? 'required'
    },
    []
  )

  const deriveSteps = useCallback(
    (app: KycApplication | null) => {
      const personalInfoSubmitted = hasPersonalInfoSubmission(app)
      const documentSubmitted = hasDocumentSubmission(app)
      return DEFAULT_KYC_STEPS.map(step => {
        if (step.id === 2) return { ...step, status: statusFromApplication(app, personalInfoSubmitted) }
        if (step.id === 3) return { ...step, status: statusFromApplication(app, documentSubmitted) }
        if (step.id === 4) {
          const hasProgress = Boolean(app && app.status !== 'draft')
          return { ...step, status: hasProgress ? statusFromApplication(app, hasProgress) : 'required' as const }
        }
        return { ...step }
      })
    },
    [statusFromApplication]
  )

  // ── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => { setKycSteps(deriveSteps(latestApplication)) }, [latestApplication, deriveSteps])

  useEffect(() => {
    if (latestApplication?.personal_info) {
      const info = latestApplication.personal_info
      setPersonalInfo({
        firstName: info.first_name || info.firstName || '',
        lastName: info.last_name || info.lastName || '',
        dateOfBirth: info.date_of_birth || info.dateOfBirth || '',
        nationality: info.nationality || '',
        address: info.address || '',
      })
    }
  }, [latestApplication])

  useEffect(() => {
    if (latestApplication?.document_info) {
      const docs = latestApplication.document_info
      setUploadedFiles({
        governmentIdFront: docs?.government_id_front
          ? { ...docs.government_id_front, source: docs.government_id_front.source || 'server' }
          : null,
        governmentIdBack: docs?.government_id_back
          ? { ...docs.government_id_back, source: docs.government_id_back.source || 'server' }
          : null,
        proofOfAddress: docs?.proof_of_address
          ? { ...docs.proof_of_address, source: docs.proof_of_address.source || 'server' }
          : null,
      })
    }
  }, [latestApplication])

  // ── API helpers ────────────────────────────────────────────────────────────

  const fetchKycStatus = useCallback(async () => {
    try {
      setFetchError('')
      const response = await apiFetch('/api/kyc/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) throw new Error('Unable to fetch KYC status')
      const payload = await response.json()
      const latest = Array.isArray(payload) ? payload[0] : payload
      setLatestApplication(latest ?? null)
    } catch {
      setFetchError('Unable to load your KYC status. Please refresh and try again.')
    } finally {
      setLoadingStatus(false)
    }
  }, [])

  useEffect(() => { fetchKycStatus() }, [fetchKycStatus])

  const extractErrorMessage = async (response: Response) => {
    try {
      const data = await response.json()
      if (!data) return 'Unknown error'
      if (typeof data === 'string') return data
      if (data.detail) return data.detail
      if (data.error) return data.error
      const msgs: string[] = []
      Object.entries(data).forEach(([k, v]) => {
        if (Array.isArray(v)) msgs.push(`${k}: ${v.join(', ')}`)
        else if (typeof v === 'string') msgs.push(`${k}: ${v}`)
      })
      return msgs.length ? msgs.join(' | ') : 'Something went wrong. Please try again.'
    } catch {
      return 'Something went wrong. Please try again.'
    }
  }

  const normalizeDate = (value: string): string => {
    if (!value) return value
    const iso = /^(\d{4})-(\d{2})-(\d{2})$/
    const mdY = /^(\d{2})\/(\d{2})\/(\d{4})$/
    if (iso.test(value)) return value
    const match = value.match(mdY)
    if (match) {
      const [, mm, dd, yyyy] = match
      return `${yyyy}-${mm}-${dd}`
    }
    return value
  }

  // ── Upload handler ─────────────────────────────────────────────────────────

  const handleFileUpload =
    (type: 'governmentIdFront' | 'governmentIdBack' | 'proofOfAddress') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf']
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid file type (JPG, PNG, or PDF)')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5 MB')
        return
      }
      // Screenshot detection — warn if filename contains common screenshot keywords
      const lowerName = file.name.toLowerCase()
      const screenshotKeywords = ['screenshot', 'screen_shot', 'screengrab', 'capture', 'chatgpt', 'whatsapp', 'telegram']
      if (screenshotKeywords.some(kw => lowerName.includes(kw))) {
        const proceed = window.confirm(
          'This file appears to be a screenshot. KYC documents must be direct photos of your physical ID, not screenshots. Screenshots will be rejected during review.\n\nDo you still want to upload this file?'
        )
        if (!proceed) return
      }
      setUploadedFiles(prev => ({
        ...prev,
        [type]: { file, name: file.name, type: file.type, size: file.size, source: 'local' },
      }))
    }

  // ── Submit handlers ────────────────────────────────────────────────────────

  const handlePersonalInfoSubmit = async () => {
    if (
      !personalInfo.firstName ||
      !personalInfo.lastName ||
      !personalInfo.dateOfBirth ||
      !personalInfo.nationality ||
      !personalInfo.address
    ) {
      setMessageTone('error')
      setSubmitMessage('All fields are required.')
      return
    }
    setIsSubmitting(true)
    setMessageTone('success')
    setSubmitMessage('')
    try {
      const response = await apiFetch('/api/kyc/personal-info/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: personalInfo.firstName.trim(),
          last_name: personalInfo.lastName.trim(),
          date_of_birth: normalizeDate(personalInfo.dateOfBirth.trim()),
          nationality: personalInfo.nationality.trim(),
          address: personalInfo.address.trim(),
        }),
      })
      if (!response.ok) {
        const detail =
          response.status >= 500
            ? 'Server error processing your information. Please retry shortly or contact support.'
            : await extractErrorMessage(response)
        setMessageTone('error')
        setSubmitMessage(detail)
        return
      }
      const data = await response.json()
      setLatestApplication(data)
      setMessageTone('success')
      setSubmitMessage('Personal information saved. Proceed to upload your documents.')
      setTimeout(() => setSubmitMessage(''), 4000)
    } catch {
      setMessageTone('error')
      setSubmitMessage('Network error submitting information. Please retry.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDocumentSubmit = async () => {
    if (!uploadedFiles.governmentIdFront || !uploadedFiles.governmentIdBack) {
      setMessageTone('error')
      setSubmitMessage('Please upload both the front and back of your government-issued ID.')
      return
    }
    if (!uploadedFiles.proofOfAddress) {
      setMessageTone('error')
      setSubmitMessage('Please upload a proof of address document.')
      return
    }
    setIsSubmitting(true)
    setMessageTone('success')
    setSubmitMessage('')

    // Map slot → { docType for API, label for errors }
    const docs: Array<{
      key: 'governmentIdFront' | 'governmentIdBack' | 'proofOfAddress'
      docType: string
      label: string
    }> = [
      { key: 'governmentIdFront', docType: 'national_id', label: 'ID front' },
      { key: 'governmentIdBack', docType: 'national_id_back', label: 'ID back' },
      { key: 'proofOfAddress', docType: 'proof_of_address', label: 'Proof of address' },
    ]

    try {
      for (const { key, docType, label } of docs) {
        const fileData: any = uploadedFiles[key]
        if (!fileData?.file) continue

        const form = new FormData()
        form.append('document_type', docType)
        form.append('document_file', fileData.file)

        const resp = await apiFetch('/api/kyc-documents/', { method: 'POST', body: form })
        if (!resp.ok) {
          const detail =
            resp.status >= 500
              ? `Server error uploading ${label}. Please retry shortly.`
              : await extractErrorMessage(resp)
          throw new Error(detail)
        }
      }

      await fetchKycStatus()
      setMessageTone('success')
      setSubmitMessage('All documents submitted successfully. Your KYC application is now under review.')
      setTimeout(() => setSubmitMessage(''), 4000)
    } catch (error) {
      setMessageTone('error')
      setSubmitMessage((error as Error).message || 'Unable to upload documents. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Render helpers ─────────────────────────────────────────────────────────

  const completedSteps = kycSteps.filter(s => s.status === 'completed').length
  const progress = (completedSteps / kycSteps.length) * 100

  const renderStepContent = () => {
    switch (selectedStep) {
      // ── Step 1: Email ──────────────────────────────────────────────────────
      case 1:
        return (
          <div className="flex items-start gap-4 p-5 bg-emerald-950/30 border border-emerald-800 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-emerald-900/60 border border-emerald-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-emerald-300">Email Verified</h3>
              <p className="text-sm text-emerald-500 mt-0.5">Your email address has been confirmed and is linked to your account.</p>
            </div>
          </div>
        )

      // ── Step 2: Personal Info ──────────────────────────────────────────────
      case 2:
        return (
          <div className="space-y-5">
            {submitMessage && (
              <div className={`p-4 rounded-xl border text-sm ${messageTone === 'error' ? 'bg-red-950/30 border-red-700 text-red-300' : 'bg-emerald-950/30 border-emerald-700 text-emerald-300'}`}>
                {submitMessage}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'firstName', label: 'First Name', placeholder: 'John', key: 'firstName' as const },
                { id: 'lastName', label: 'Last Name', placeholder: 'Doe', key: 'lastName' as const },
              ].map(field => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    {field.label} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id={field.id}
                    value={personalInfo[field.key]}
                    onChange={e => setPersonalInfo(prev => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition text-sm"
                    placeholder={field.placeholder}
                  />
                </div>
              ))}

              <div>
                <label htmlFor="dateOfBirth" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Date of Birth <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  value={personalInfo.dateOfBirth}
                  onChange={e => setPersonalInfo(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-700 bg-slate-900 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition text-sm"
                />
              </div>

              <div>
                <label htmlFor="nationality" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Nationality <span className="text-red-400">*</span>
                </label>
                <select
                  id="nationality"
                  value={personalInfo.nationality}
                  onChange={e => setPersonalInfo(prev => ({ ...prev, nationality: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-700 bg-slate-900 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition text-sm"
                >
                  <option value="">Select nationality</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="NG">Nigeria</option>
                  <option value="NO">Norway</option>
                  <option value="DE">Germany</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="FR">France</option>
                  <option value="ZA">South Africa</option>
                  <option value="KE">Kenya</option>
                  <option value="GH">Ghana</option>
                  <option value="IN">India</option>
                  <option value="AE">United Arab Emirates</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Full Residential Address <span className="text-red-400">*</span>
              </label>
              <textarea
                id="address"
                rows={3}
                value={personalInfo.address}
                onChange={e => setPersonalInfo(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-4 py-2.5 border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition text-sm resize-none"
                placeholder="Street address, city, state, postal code, country"
              />
            </div>

            <button
              onClick={handlePersonalInfoSubmit}
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg font-semibold text-sm transition-all duration-150"
            >
              {isSubmitting ? 'Saving…' : 'Save & Continue'}
            </button>
          </div>
        )

      // ── Step 3: Documents ──────────────────────────────────────────────────
      case 3:
        return (
          <div className="space-y-6">
            {submitMessage && (
              <div className={`p-4 rounded-xl border text-sm ${messageTone === 'error' ? 'bg-red-950/30 border-red-700 text-red-300' : 'bg-emerald-950/30 border-emerald-700 text-emerald-300'}`}>
                {submitMessage}
              </div>
            )}

            {/* ── Government-issued ID ──────────────────────────────────────── */}
            <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-900/60 border border-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">Government-Issued Photo ID</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Passport · National ID card · Driver's licence — both sides required
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DropZone
                  id="governmentIdFront"
                  label="ID Card"
                  sublabel="Upload front side"
                  badge="FRONT"
                  badgeColor="bg-blue-800 text-blue-200"
                  file={uploadedFiles.governmentIdFront}
                  onChange={handleFileUpload('governmentIdFront')}
                  required
                />
                <DropZone
                  id="governmentIdBack"
                  label="ID Card"
                  sublabel="Upload back side"
                  badge="BACK"
                  badgeColor="bg-slate-700 text-slate-300"
                  file={uploadedFiles.governmentIdBack}
                  onChange={handleFileUpload('governmentIdBack')}
                  required
                />
              </div>

              {/* Visual completeness indicator */}
              <div className="flex items-center gap-2 pt-1">
                <div className={`h-1.5 flex-1 rounded-full ${uploadedFiles.governmentIdFront ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                <div className={`h-1.5 flex-1 rounded-full ${uploadedFiles.governmentIdBack ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                <span className="text-[11px] text-slate-500 ml-1">
                  {[uploadedFiles.governmentIdFront, uploadedFiles.governmentIdBack].filter(Boolean).length}/2 sides
                </span>
              </div>
            </div>

            {/* ── Proof of Address ─────────────────────────────────────────── */}
            <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-900/60 border border-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">Proof of Address</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Utility bill · Bank statement · Official lease — issued within the last 3 months
                  </p>
                </div>
              </div>

              <DropZone
                id="proofOfAddress"
                label="Address Document"
                sublabel="Upload your proof of address"
                file={uploadedFiles.proofOfAddress}
                onChange={handleFileUpload('proofOfAddress')}
                required
              />
            </div>

            {/* ── Guidelines ───────────────────────────────────────────────── */}
            <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-xs font-semibold text-slate-300 mb-1.5">Submission requirements</p>
                  <ul className="text-xs text-slate-500 space-y-1">
                    <li>• Photos must be taken directly with your camera — no screenshots</li>
                    <li>• All four corners of the document must be fully visible</li>
                    <li>• Text and photos must be sharp and legible</li>
                    <li>• Documents must be valid and unedited</li>
                    <li>• Accepted: JPG, PNG, PDF · Maximum 5 MB per file</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ── Submit ───────────────────────────────────────────────────── */}
            <button
              onClick={handleDocumentSubmit}
              disabled={
                isSubmitting ||
                !uploadedFiles.governmentIdFront ||
                !uploadedFiles.governmentIdBack ||
                !uploadedFiles.proofOfAddress
              }
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Uploading documents…
                </>
              ) : (
                'Submit Documents for Review'
              )}
            </button>

            {/* Slot completeness summary */}
            {(!uploadedFiles.governmentIdFront || !uploadedFiles.governmentIdBack || !uploadedFiles.proofOfAddress) && (
              <p className="text-xs text-center text-slate-600">
                {[
                  !uploadedFiles.governmentIdFront && 'ID front',
                  !uploadedFiles.governmentIdBack && 'ID back',
                  !uploadedFiles.proofOfAddress && 'proof of address',
                ]
                  .filter(Boolean)
                  .join(', ')}{' '}
                still needed
              </p>
            )}
          </div>
        )

      // ── Step 4: Enhanced ───────────────────────────────────────────────────
      case 4:
        return (
          <div className="space-y-6">
            <div className="rounded-xl border border-purple-800/50 bg-purple-950/20 p-5">
              <h3 className="text-sm font-semibold text-purple-300 mb-3">Enhanced Verification Benefits</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-purple-300">
                {[
                  'Higher withdrawal limits ($50,000+)',
                  'Priority customer support',
                  'Faster transaction processing',
                  'Access to premium investment plans',
                ].map(benefit => (
                  <div key={benefit} className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <h4 className="text-sm font-semibold text-slate-200 mb-1">Video Call Verification</h4>
              <p className="text-xs text-slate-400 mb-4">Schedule a brief video call with our verification team</p>
              <button className="px-6 py-2.5 bg-purple-700 hover:bg-purple-600 text-white rounded-lg text-sm font-semibold transition">
                Schedule Video Call
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#0b2f6b] via-[#1a3f7f] to-[#2563eb] rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">KYC Verification</h1>
            <p className="text-blue-200 text-sm mt-1">Complete your identity verification to unlock full account access</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-2xl font-bold">{completedSteps}/{kycSteps.length}</div>
            <div className="text-xs text-blue-200 mt-0.5">Steps complete</div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-blue-200">
            <span>{Math.round(progress)}% complete</span>
            {latestApplication && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_BADGE_CLASS[latestApplication.status]}`}>
                {STATUS_LABEL[latestApplication.status]}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Status / Error banners ──────────────────────────────────────────── */}
      {loadingStatus && (
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-400">
          <svg className="w-4 h-4 animate-spin text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Loading your verification status…
        </div>
      )}

      {fetchError && (
        <div className="px-4 py-3 bg-red-950/30 border border-red-800 rounded-xl text-sm text-red-300">
          {fetchError}
        </div>
      )}

      {/* ── Rejection alert ─────────────────────────────────────────────────── */}
      {latestApplication?.status === 'rejected' && latestApplication.rejection_reason && (
        <div className="px-4 py-4 bg-red-950/30 border border-red-700 rounded-xl">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-red-300">Action required</p>
              <p className="text-sm text-red-400 mt-0.5">{latestApplication.rejection_reason}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Main grid ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Steps sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-slate-950/95 border border-slate-800 rounded-2xl p-5 space-y-2">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-1">
              Verification Steps
            </h2>
            {kycSteps.map(step => (
              <button
                key={step.id}
                onClick={() => setSelectedStep(step.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all duration-150 ${
                  selectedStep === step.id
                    ? 'border-blue-600 bg-blue-950/40'
                    : 'border-slate-800 hover:border-slate-600 bg-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 ${stepColor(step.status)}`}>
                    <StepIcon status={step.status} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-sm font-semibold truncate ${selectedStep === step.id ? 'text-blue-300' : 'text-slate-200'}`}>
                        {step.title}
                      </span>
                      {step.required && (
                        <span className="text-[9px] font-bold text-red-400 border border-red-800 rounded px-1 py-0.5 uppercase tracking-wider flex-shrink-0">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">{step.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="lg:col-span-2">
          <div className="bg-slate-950/95 border border-slate-800 rounded-2xl p-6">
            {/* Step header */}
            <div className="mb-5 pb-4 border-b border-slate-800">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h2 className="text-lg font-bold text-slate-100">
                    {kycSteps.find(s => s.id === selectedStep)?.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {kycSteps.find(s => s.id === selectedStep)?.description}
                  </p>
                </div>
                {latestApplication && (
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${STATUS_BADGE_CLASS[latestApplication.status]}`}>
                    {STATUS_LABEL[latestApplication.status]}
                  </span>
                )}
              </div>

              {latestApplication?.last_submitted_at && (
                <p className="text-xs text-slate-600 mt-2">
                  Last submitted: {new Date(latestApplication.last_submitted_at).toLocaleString()}
                </p>
              )}
              {latestApplication?.reviewer_notes && (
                <p className="text-xs text-slate-400 mt-1">
                  <span className="text-slate-300 font-medium">Reviewer note:</span> {latestApplication.reviewer_notes}
                </p>
              )}
            </div>

            {renderStepContent()}
          </div>
        </div>
      </div>

      {/* ── Help ────────────────────────────────────────────────────────────── */}
      <div className="bg-slate-950/95 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Need Help?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-slate-900 border border-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Live Chat Support</h3>
              <p className="text-xs text-slate-500 mt-0.5">Get instant help with your verification</p>
              <Link href="/dashboard/support" className="text-xs text-blue-400 hover:underline mt-1 inline-block">
                Start a chat →
              </Link>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-slate-900 border border-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Email Support</h3>
              <p className="text-xs text-slate-500 mt-0.5">Send us your verification questions</p>
              <a href="mailto:support@mail.wolvcapital.com" className="text-xs text-blue-400 hover:underline mt-1 inline-block">
                support@mail.wolvcapital.com →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
