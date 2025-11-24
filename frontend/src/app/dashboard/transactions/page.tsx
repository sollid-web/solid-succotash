'use client'

import { useEffect, useState, useMemo } from 'react'
import { getApiBaseUrl } from '@/lib/config'
import Link from 'next/link'

interface Transaction {
  id: string
  tx_type: 'deposit' | 'withdrawal'
  amount: string
  reference: string
  payment_method: string
  tx_hash: string
  wallet_address_used: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
  approval_notes?: string
}

export default function TransactionsPage() {
  const apiBase = useMemo(() => getApiBaseUrl(), [])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'deposit' | 'withdrawal'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem('authToken')
      if (!token) {
        window.location.href = '/accounts/login?next=/dashboard/transactions'
        return
      }

      try {
        const res = await fetch(`${apiBase}/api/transactions/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
          credentials: 'include',
        })

        if (res.ok) {
          const data = await res.json()
          setTransactions(Array.isArray(data) ? data : [])
        } else {
          setError('Failed to load transactions')
        }
      } catch (err) {
        setError('Network error. Please try again.')
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [apiBase])

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions]

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(tx => tx.tx_type === filterType)
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(tx => tx.status === filterStatus)
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        tx =>
          tx.id.toLowerCase().includes(term) ||
          tx.reference.toLowerCase().includes(term) ||
          tx.payment_method.toLowerCase().includes(term) ||
          tx.tx_hash.toLowerCase().includes(term)
      )
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.created_at).getTime()
        const dateB = new Date(b.created_at).getTime()
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
      } else {
        const amountA = parseFloat(a.amount || '0')
        const amountB = parseFloat(b.amount || '0')
        return sortOrder === 'asc' ? amountA - amountB : amountB - amountA
      }
    })

    return filtered
  }, [transactions, filterType, filterStatus, searchTerm, sortBy, sortOrder])

  // Statistics
  const stats = useMemo(() => {
    const totalDeposits = transactions
      .filter(tx => tx.tx_type === 'deposit' && tx.status === 'approved')
      .reduce((sum, tx) => sum + parseFloat(tx.amount || '0'), 0)

    const totalWithdrawals = transactions
      .filter(tx => tx.tx_type === 'withdrawal' && tx.status === 'approved')
      .reduce((sum, tx) => sum + parseFloat(tx.amount || '0'), 0)

    const pendingCount = transactions.filter(tx => tx.status === 'pending').length

    return { totalDeposits, totalWithdrawals, pendingCount }
  }, [transactions])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-100 text-emerald-700'
      case 'pending':
        return 'bg-amber-100 text-amber-700'
      case 'rejected':
        return 'bg-rose-100 text-rose-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getTypeIcon = (type: string) => {
    if (type === 'deposit') {
      return (
        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
        </svg>
      )
    }
    return (
      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
      </svg>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0b2f6b] to-[#2563eb] rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-white">W</span>
              </div>
              <span className="text-2xl font-bold text-[#0b2f6b]">WolvCapital</span>
            </Link>
            <Link href="/dashboard" className="text-sm text-[#2563eb] hover:underline">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Transaction History</h1>
          <p className="text-gray-600">View and manage all your deposits and withdrawals</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <input
                  id="search"
                  type="text"
                  placeholder="ID, reference, tx hash..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 pl-10 focus:border-[#2563eb] transition"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Filter by Type */}
            <div>
              <label htmlFor="filterType" className="block text-sm font-semibold text-gray-700 mb-2">
                Type
              </label>
              <select
                id="filterType"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-[#2563eb] transition"
              >
                <option value="all">All Types</option>
                <option value="deposit">Deposits</option>
                <option value="withdrawal">Withdrawals</option>
              </select>
            </div>

            {/* Filter by Status */}
            <div>
              <label htmlFor="filterStatus" className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-[#2563eb] transition"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label htmlFor="sortBy" className="block text-sm font-semibold text-gray-700 mb-2">
                Sort By
              </label>
              <div className="flex space-x-2">
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-[#2563eb] transition"
                >
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3 border-2 border-gray-200 rounded-xl hover:border-[#2563eb] transition"
                  title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {error && (
            <div className="p-4 bg-red-50 border-b border-red-100">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No transactions found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                  ? 'Try adjusting your filters or search term'
                  : 'Start by making a deposit or withdrawal'}
              </p>
              <div className="flex justify-center space-x-4">
                <Link
                  href="/dashboard/deposit"
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
                >
                  Make a Deposit
                </Link>
                <Link
                  href="/dashboard/withdraw"
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
                >
                  Request Withdrawal
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">#{tx.id.slice(0, 8)}</div>
                          {tx.reference && (
                            <div className="text-xs text-gray-500">Ref: {tx.reference}</div>
                          )}
                          {tx.tx_hash && (
                            <div className="text-xs text-gray-500 font-mono truncate max-w-xs" title={tx.tx_hash}>
                              Hash: {tx.tx_hash.slice(0, 12)}...
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(tx.tx_type)}
                          <span className="text-sm font-medium capitalize">{tx.tx_type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{tx.payment_method}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-sm font-bold ${tx.tx_type === 'deposit' ? 'text-emerald-600' : 'text-orange-600'}`}>
                          {tx.tx_type === 'deposit' ? '+' : '-'}${parseFloat(tx.amount || '0').toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(tx.status)}`}>
                          {tx.status}
                        </span>
                        {tx.approval_notes && (
                          <div className="text-xs text-gray-500 mt-1">{tx.approval_notes}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div>{new Date(tx.created_at).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-400">{new Date(tx.created_at).toLocaleTimeString()}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Results Count */}
          {filteredTransactions.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredTransactions.length}</span> of{' '}
                <span className="font-semibold">{transactions.length}</span> transactions
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
