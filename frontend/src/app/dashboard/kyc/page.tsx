'use client'

import { useState } from 'react'
import Link from 'next/link'

interface KYCStep {
  id: number
  title: string
  description: string
  status: 'completed' | 'pending' | 'required' | 'failed'
  required: boolean
}

export default function KYCPage() {
  const [kycSteps] = useState<KYCStep[]>([
    {
      id: 1,
      title: 'Email Verification',
      description: 'Verify your email address',
      status: 'completed',
      required: true
    },
    {
      id: 2,
      title: 'Personal Information',
      description: 'Complete your personal profile',
      status: 'required',
      required: true
    },
    {
      id: 3,
      title: 'Identity Documents',
      description: 'Upload government-issued ID and proof of address',
      status: 'required',
      required: true
    },
    {
      id: 4,
      title: 'Enhanced Verification',
      description: 'Additional verification for higher limits (optional)',
      status: 'required',
      required: false
    }
  ])

  const [selectedStep, setSelectedStep] = useState(2)
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    address: ''
  })
  const [uploadedFiles, setUploadedFiles] = useState({
    governmentId: null as File | null,
    proofOfAddress: null as File | null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleFileUpload = (type: 'governmentId' | 'proofOfAddress') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf']
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid file type (JPG, PNG, or PDF)')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }
      setUploadedFiles(prev => ({ ...prev, [type]: file }))
    }
  }

  const handlePersonalInfoSubmit = async () => {
    if (!personalInfo.firstName || !personalInfo.lastName || !personalInfo.dateOfBirth || !personalInfo.nationality || !personalInfo.address) {
      alert('Please fill in all required fields')
      return
    }
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setSubmitMessage('Personal information saved successfully!')
      setIsSubmitting(false)
      setTimeout(() => setSubmitMessage(''), 3000)
    }, 1000)
  }

  const handleDocumentSubmit = async () => {
    if (!uploadedFiles.governmentId || !uploadedFiles.proofOfAddress) {
      alert('Please upload both required documents')
      return
    }
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setSubmitMessage('Documents uploaded successfully! Your KYC application is under review.')
      setIsSubmitting(false)
      setTimeout(() => setSubmitMessage(''), 3000)
    }, 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'failed': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': 
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case 'pending':
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'failed':
        return (
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  const renderStepContent = () => {
    const step = kycSteps.find(s => s.id === selectedStep)
    
    switch (selectedStep) {
      case 1: // Email Verification
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-green-800">Email Verified Successfully</h3>
                <p className="text-sm text-green-600">Your email address has been confirmed and is ready for use.</p>
              </div>
            </div>
          </div>
        )

      case 2: // Phone Number
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="flex space-x-3">
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>+1</option>
                    <option>+44</option>
                    <option>+47</option>
                    <option>+49</option>
                  </select>
                  <input
                    type="tel"
                    id="phone"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              <button className="w-full bg-[#2563eb] text-white py-3 rounded-lg hover:bg-[#1d4ed8] transition font-semibold">
                Send Verification Code
              </button>
            </div>
          </div>
        )

      case 2: // Personal Information
        return (
          <div className="space-y-6">
            {submitMessage && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-sm text-green-800">{submitMessage}</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={personalInfo.firstName}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={personalInfo.lastName}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your last name"
                  required
                />
              </div>
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  value={personalInfo.dateOfBirth}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-2">
                  Nationality
                </label>
                <select
                  id="nationality"
                  value={personalInfo.nationality}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, nationality: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select your nationality</option>
                  <option value="US">United States</option>
                  <option value="NO">Norway</option>
                  <option value="GB">United Kingdom</option>
                  <option value="DE">Germany</option>
                  <option value="CA">Canada</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                id="address"
                rows={3}
                value={personalInfo.address}
                onChange={(e) => setPersonalInfo(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your full address"
                required
              />
            </div>
            <button 
              onClick={handlePersonalInfoSubmit}
              disabled={isSubmitting}
              className="w-full bg-[#2563eb] text-white py-3 rounded-lg hover:bg-[#1d4ed8] transition font-semibold disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Information'}
            </button>
          </div>
        )

      case 3: // Identity Documents
        return (
          <div className="space-y-6">
            {submitMessage && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-sm text-green-800">{submitMessage}</p>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Government ID Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Government-issued ID</h3>
                <div className="relative">
                  <input
                    type="file"
                    id="governmentId"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileUpload('governmentId')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center transition cursor-pointer ${
                    uploadedFiles.governmentId ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-[#2563eb]'
                  }`}>
                    {uploadedFiles.governmentId ? (
                      <>
                        <svg className="w-12 h-12 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-green-600 font-medium mb-2">{uploadedFiles.governmentId.name}</p>
                        <p className="text-xs text-green-500">File uploaded successfully</p>
                      </>
                    ) : (
                      <>
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm text-gray-600 mb-2">Upload a photo of your ID</p>
                        <p className="text-xs text-gray-500">Passport, Driver's License, or National ID</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Proof of Address Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Proof of Address</h3>
                <div className="relative">
                  <input
                    type="file"
                    id="proofOfAddress"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileUpload('proofOfAddress')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center transition cursor-pointer ${
                    uploadedFiles.proofOfAddress ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-[#2563eb]'
                  }`}>
                    {uploadedFiles.proofOfAddress ? (
                      <>
                        <svg className="w-12 h-12 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-green-600 font-medium mb-2">{uploadedFiles.proofOfAddress.name}</p>
                        <p className="text-xs text-green-500">File uploaded successfully</p>
                      </>
                    ) : (
                      <>
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm text-gray-600 mb-2">Upload proof of address</p>
                        <p className="text-xs text-gray-500">Utility bill, bank statement, or lease agreement</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">Document Guidelines</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Ensure documents are clear and fully visible</li>
                    <li>• No edited or modified images</li>
                    <li>• Documents must be current and valid</li>
                    <li>• Accepted formats: JPG, PNG, PDF (max 5MB each)</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleDocumentSubmit}
              disabled={isSubmitting || !uploadedFiles.governmentId || !uploadedFiles.proofOfAddress}
              className="w-full bg-[#2563eb] text-white py-3 rounded-lg hover:bg-[#1d4ed8] transition font-semibold disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Documents'}
            </button>
          </div>
        )

      case 4: // Enhanced Verification
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl p-6 border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">Enhanced Verification Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-purple-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-purple-800">Higher withdrawal limits ($50,000+)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-purple-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-purple-800">Priority customer support</span>
                </div>
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-purple-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-purple-800">Faster transaction processing</span>
                </div>
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-purple-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-purple-800">Access to premium investment plans</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Video Call Verification</h4>
              <p className="text-gray-600 mb-6">Schedule a brief video call with our verification team</p>
              <button className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition font-semibold">
                Schedule Video Call
              </button>
            </div>
          </div>
        )

      default:
        return <div>Select a step to view details</div>
    }
  }

  const completedSteps = kycSteps.filter(step => step.status === 'completed').length
  const progress = (completedSteps / kycSteps.length) * 100

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0b2f6b] to-[#2563eb] rounded-3xl p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">KYC Verification</h1>
            <p className="text-xl opacity-90">Complete your identity verification</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{completedSteps}/{kycSteps.length}</div>
            <div className="text-sm opacity-80">Steps Completed</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-3">
          <div 
            className="bg-white h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Steps Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Verification Steps</h2>
            {kycSteps.map((step, index) => (
              <div
                key={step.id}
                onClick={() => setSelectedStep(step.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedStep === step.id
                    ? 'border-[#2563eb] bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(step.status)}`}>
                    {getStatusIcon(step.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className={`font-semibold ${selectedStep === step.id ? 'text-[#2563eb]' : 'text-gray-900'}`}>
                        {step.title}
                      </h3>
                      {step.required && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Required</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {kycSteps.find(s => s.id === selectedStep)?.title}
              </h2>
              <p className="text-gray-600">
                {kycSteps.find(s => s.id === selectedStep)?.description}
              </p>
            </div>
            
            {renderStepContent()}
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Need Help?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-[#2563eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Live Chat Support</h3>
              <p className="text-sm text-gray-600">Get instant help with verification</p>
              <Link href="/dashboard/support" className="text-[#2563eb] text-sm hover:underline">
                Start Chat →
              </Link>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
              <p className="text-sm text-gray-600">Send us your verification questions</p>
              <a href="mailto:support@wolvcapital.com" className="text-[#2563eb] text-sm hover:underline">
                support@wolvcapital.com →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}