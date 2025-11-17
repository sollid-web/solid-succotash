'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface UserData {
  id: number
  email: string
  first_name: string
  last_name: string
  is_staff: boolean
  is_superuser: boolean
}

interface WalletData {
  balance: string
  total_deposits: string
  total_withdrawals: string
}

interface Investment {
  id: number
  plan_name: string
  amount: string
  status: string
  created_at: string
  expected_return: string
}

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
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [investments, setInvestments] = useState<Investment[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activated, setActivated] = useState(false)

  // Minimum deposit for lowest plan (hardcoded, or fetch from API if needed)
  const MIN_DEPOSIT = 100.00;

  useEffect(() => {
    // Activation logic: must have at least one deposit >= MIN_DEPOSIT
    const hasQualifyingDeposit = transactions.some(
      (tx) => tx.tx_type === 'deposit' && tx.status === 'approved' && parseFloat(tx.amount) >= MIN_DEPOSIT
    );
    setActivated(hasQualifyingDeposit);
  }, [transactions]);

  useEffect(() => {
    const fetchUserData = async () => {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const token = localStorage.getItem('authToken')

      try {
        // Fetch user info
        const userResponse = await fetch(`${apiBase}/api/auth/me/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Token ${token}` }),
          },
          credentials: 'include',
        })

        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUser(userData)

          // Fetch wallet data
          const walletResponse = await fetch(`${apiBase}/api/wallet/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${token}`,
            },
            credentials: 'include',
          })

          if (walletResponse.ok) {
            const walletData = await walletResponse.json()
            setWallet(walletData)
          }

          // Fetch investments
          const investmentsResponse = await fetch(`${apiBase}/api/investments/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${token}`,
            },
            credentials: 'include',
          })

          if (investmentsResponse.ok) {
            const investmentsData = await investmentsResponse.json()
            setInvestments(investmentsData)
          }

          // Fetch transactions (recent)
          const txResponse = await fetch(`${apiBase}/api/transactions/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${token}`,
            },
            credentials: 'include',
          })

          if (txResponse.ok) {
            const txData: Transaction[] = await txResponse.json()
            setTransactions(Array.isArray(txData) ? txData.slice(0, 5) : [])
          }
        } else {
          setError('Please log in to access the dashboard')
          // Redirect to login after a delay
          setTimeout(() => {
            window.location.href = '/accounts/login'
          }, 2000)
        }
      } catch (err) {
        setError('Failed to load user data')
        console.error('Dashboard error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleLogout = async () => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    const token = localStorage.getItem('authToken')

    try {
      await fetch(`${apiBase}/api/auth/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Token ${token}` }),
        },
        credentials: 'include',
      })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      localStorage.removeItem('authToken')
      // Clear the client cookie used by middleware
      document.cookie = 'authToken=; Max-Age=0; Path=/; SameSite=Lax; Secure'
      window.location.href = '/accounts/login'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md">
          <div className="text-red-500 text-center mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">{error}</h2>
          <p className="text-gray-600 text-center mb-6">Redirecting to login...</p>
          <Link href="/accounts/login" className="block w-full bg-[#2563eb] text-white py-3 rounded-xl text-center font-semibold hover:bg-[#1d4ed8] transition">
            Go to Login
          </Link>
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
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Activation Notice */}
      {!activated && (
        <div className="max-w-2xl mx-auto mt-8 mb-8">
          <div className="bg-gradient-to-r from-[#0b2f6b] via-[#2563eb] to-[#1d4ed8] text-white rounded-3xl shadow-2xl p-8 text-center border-4 border-[#2563eb]">
            <div className="flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Account Activation Required</h2>
            <p className="text-lg mb-4">To activate your new account, please make a deposit of at least <span className="font-bold">${MIN_DEPOSIT.toFixed(2)}</span> (the minimum for our lowest investment plan). Account activation is mandatory before you can perform any platform activities, even if your previous balance has been credited by an admin.</p>
            <Link href="/dashboard/deposit" className="inline-block bg-white text-[#0b2f6b] px-8 py-3 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105 mt-2">Make a Deposit</Link>
          </div>
        </div>
      )}

      {/* Main Content (disabled if not activated) */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${!activated ? 'pointer-events-none opacity-50 select-none' : ''}`}>
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#0b2f6b] via-[#2563eb] to-[#1d4ed8] rounded-3xl shadow-xl p-8 mb-8 text-white">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user?.first_name || user?.email}!
          </h1>
          <p className="text-xl opacity-90">
            Your secure investment dashboard overview
          </p>
        </div>
        {/* ...existing code... */}

        {/* Recent Transactions */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Transactions</h2>
            <Link href="/dashboard/transactions" className="text-[#2563eb] text-sm hover:underline">View all</Link>
          </div>

          {transactions.length === 0 ? (
            <p className="text-gray-500 text-sm">No transactions yet.</p>
          ) : (
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="px-2 sm:px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="px-2 sm:px-4 py-3 text-sm text-gray-700">{new Date(tx.created_at).toLocaleDateString()}</td>
                      <td className="px-2 sm:px-4 py-3 text-sm capitalize">
                        <span className={tx.tx_type === 'deposit' ? 'text-emerald-600' : 'text-orange-600'}>
                          {tx.tx_type}
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 py-3 text-sm text-gray-600">{tx.payment_method}</td>
                      <td className="px-2 sm:px-4 py-3 text-sm text-gray-900 text-right">${parseFloat(tx.amount || '0').toFixed(2)}</td>
                      <td className="px-2 sm:px-4 py-3 text-sm">
                        <span
                          className={
                            tx.status === 'approved'
                              ? 'px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700'
                              : tx.status === 'pending'
                              ? 'px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-700'
                              : 'px-2 py-1 rounded-full text-xs bg-rose-100 text-rose-700'
                          }
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/new-investment" className="p-6 border-2 border-gray-200 rounded-2xl hover:border-[#2563eb] hover:shadow-lg transition text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#2563eb] transition">
                <svg className="w-8 h-8 text-[#2563eb] group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">New Investment</h3>
              <p className="text-sm text-gray-600">Select a compliant investment plan and amount</p>
            </Link>

            <Link href="/dashboard/deposit" className="p-6 border-2 border-gray-200 rounded-2xl hover:border-[#2563eb] hover:shadow-lg transition text-center group">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#2563eb] transition">
                <svg className="w-8 h-8 text-emerald-600 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Deposit</h3>
              <p className="text-sm text-gray-600">Fund your wallet securely</p>
            </Link>

            <Link href="/dashboard/withdraw" className="p-6 border-2 border-gray-200 rounded-2xl hover:border-[#2563eb] hover:shadow-lg transition text-center group">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#2563eb] transition">
                <svg className="w-8 h-8 text-orange-600 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20V4m8 8H4" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Withdraw</h3>
              <p className="text-sm text-gray-600">Request a payout (subject to compliance review)</p>
            </Link>

            <Link href="/dashboard/support" className="p-6 border-2 border-gray-200 rounded-2xl hover:border-[#2563eb] hover:shadow-lg transition text-center group">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#2563eb] transition">
                <svg className="w-8 h-8 text-green-600 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Support</h3>
              <p className="text-sm text-gray-600">Get help from our compliance and investor support teams</p>
            </Link>
          </div>
        </div>

        {/* User Info Section (for debugging) */}
        {user?.is_staff && (
          <div className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-yellow-800 mb-3">👑 Admin User</h3>
            <div className="text-sm text-yellow-700 space-y-1">
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>User ID:</strong> {user?.id}</p>
              <p><strong>Staff:</strong> {user?.is_staff ? 'Yes' : 'No'}</p>
              <p><strong>Superuser:</strong> {user?.is_superuser ? 'Yes' : 'No'}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

