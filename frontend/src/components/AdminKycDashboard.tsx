"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'

interface KycDocument {
  id: string
  user_email: string
  document_type: 'passport' | 'national_id' | 'drivers_license'
  status: 'pending' | 'approved' | 'rejected'
  submitted_at: string
  reviewed_at: string | null
  reviewed_by_email: string | null
  rejection_reason: string
  created_at: string
  updated_at: string
}

export default function AdminKycDashboard() {
  const [applications, setApplications] = useState<KycDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedApp, setSelectedApp] = useState<KycDocument | null>(null)
  const [approvalNotes, setApprovalNotes] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await apiFetch('/api/admin/kyc-documents/?status=pending')

        if (!response.ok) {
          throw new Error('Failed to fetch KYC documents')
        }

        const data = await response.json()
        setApplications(data)
      } catch (err) {
        setError('Failed to load KYC documents')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  const handleApprove = async (docId: string) => {
    if (!approvalNotes.trim()) {
      alert('Please add approval notes')
      return
    }

    setActionLoading(true)
    try {
      const response = await apiFetch(`/api/admin/kyc-documents/${docId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          approval_action: 'approve',
          approval_notes: approvalNotes
        })
      })

      if (!response.ok) {
        throw new Error('Failed to approve document')
      }

      // Refresh the list
      const updated = await response.json()
      setApplications(prev => prev.map(app => app.id === docId ? updated : app))
      setSelectedApp(null)
      setApprovalNotes('')
      alert('KYC document approved successfully!')
    } catch (err) {
      alert('Error approving document: ' + (err as Error).message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (docId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason')
      return
    }

    setActionLoading(true)
    try {
      const response = await apiFetch(`/api/admin/kyc-documents/${docId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          approval_action: 'reject',
          approval_notes: rejectionReason
        })
      })

      if (!response.ok) {
        throw new Error('Failed to reject document')
      }

      const updated = await response.json()
      setApplications(prev => prev.map(app => app.id === docId ? updated : app))
      setSelectedApp(null)
      setRejectionReason('')
      alert('KYC document rejected')
    } catch (err) {
      alert('Error rejecting document: ' + (err as Error).message)
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const pendingApps = applications.filter(app => app.status === 'pending')
  const approvedApps = applications.filter(app => app.status === 'approved')
  const rejectedApps = applications.filter(app => app.status === 'rejected')

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading KYC documents...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 md:gap-6">
        <div className="bg-yellow-50 rounded-lg p-4 md:p-6 border-l-4 border-yellow-400">
          <div className="text-3xl font-bold text-yellow-600">{pendingApps.length}</div>
          <div className="text-sm text-yellow-700">Pending Documents</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 md:p-6 border-l-4 border-green-400">
          <div className="text-3xl font-bold text-green-600">{approvedApps.length}</div>
          <div className="text-sm text-green-700">Approved</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 md:p-6 border-l-4 border-red-400">
          <div className="text-3xl font-bold text-red-600">{rejectedApps.length}</div>
          <div className="text-sm text-red-700">Rejected</div>
        </div>
      </div>

      {/* Pending Documents */}
      {pendingApps.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-yellow-50 px-6 py-4 border-b border-yellow-200">
            <h3 className="text-xl font-bold text-yellow-900">Pending KYC Documents</h3>
          </div>
          <div className="divide-y">
            {pendingApps.map(app => (
              <div key={app.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold text-lg">{app.user_email}</p>
                    <p className="text-sm text-gray-600">
                      Document: {app.document_type.replace(/_/g, ' ').toUpperCase()} · Submitted {new Date(app.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(app.status)}`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>

                {selectedApp?.id === app.id ? (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Document Details</h4>
                      <div className="bg-white p-3 rounded text-sm space-y-2">
                        <p><strong>Type:</strong> {app.document_type.replace(/_/g, ' ').toUpperCase()}</p>
                        <p><strong>Submitted:</strong> {new Date(app.submitted_at).toLocaleString()}</p>
                        {app.rejection_reason && (
                          <p className="text-red-600"><strong>Previous Rejection:</strong> {app.rejection_reason}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Approval Notes</label>
                        <textarea
                          value={approvalNotes}
                          onChange={(e) => setApprovalNotes(e.target.value)}
                          placeholder="Enter approval notes..."
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          rows={4}
                        />
                        <button
                          onClick={() => handleApprove(app.id)}
                          disabled={actionLoading}
                          className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                        >
                          {actionLoading ? 'Processing...' : 'Approve'}
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Rejection Reason (if rejecting)</label>
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Enter rejection reason..."
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                          rows={4}
                        />
                        <button
                          onClick={() => handleReject(app.id)}
                          disabled={actionLoading}
                          className="mt-3 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                        >
                          {actionLoading ? 'Processing...' : 'Reject'}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedApp(null)}
                      className="w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="btn-cta-sky px-4 py-2 rounded-lg font-semibold"
                  >
                    Review Document
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Applications */}
      {approvedApps.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-50 px-6 py-4 border-b border-green-200">
            <h3 className="text-xl font-bold text-green-900">Approved Applications ({approvedApps.length})</h3>
          </div>
          <div className="divide-y max-h-96 overflow-y-auto">
            {approvedApps.map(app => (
              <div key={app.id} className="p-4 text-sm">
                <div className="flex justify-between">
                  <span className="font-semibold">{app.user_email}</span>
                  <span className="text-gray-600">{new Date(app.reviewed_at!).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
