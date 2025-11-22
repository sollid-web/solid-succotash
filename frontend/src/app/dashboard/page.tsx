'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import FlipCard from '@/components/FlipCard'

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

interface InvestmentPlanDetails {
  id: number
  name: string
  description?: string
  daily_roi: string
  duration_days: number
  min_amount?: string
  max_amount?: string
}

interface Investment {
  id: number
  plan_name?: string
  amount: string
  status: string
  created_at: string
  started_at: string
  ends_at: string
  expected_return: string
  total_return: string
  daily_roi?: string
  duration_days?: number
  plan?: InvestmentPlanDetails
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


      {/* Main Content (always visible, activation only restricts actions) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        {/* Welcome Section */}
        <section className="bg-gradient-to-r from-[#0b2f6b] via-[#2563eb] to-[#1d4ed8] rounded-3xl shadow-xl p-6 sm:p-8 text-white mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">
            Welcome back, {user?.first_name || (user?.email ? user.email.split('@')[0] : 'User')}!
          </h1>
          <p className="text-base sm:text-xl opacity-90">Your secure investment dashboard overview</p>
        </section>

        {/* Wallet Summary Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-start">
            <span className="text-xs font-semibold text-gray-500 mb-1">Current Balance</span>
            <span className="text-3xl font-bold text-[#2563eb]">${wallet ? parseFloat(wallet.balance || '0').toFixed(2) : '0.00'}</span>
            <span className="text-xs text-gray-400 mt-2">Available funds</span>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-start">
            <span className="text-xs font-semibold text-gray-500 mb-1">Total Deposits</span>
            <span className="text-3xl font-bold text-emerald-600">${wallet ? parseFloat(wallet.total_deposits || '0').toFixed(2) : '0.00'}</span>
            <span className="text-xs text-gray-400 mt-2">Approved deposits</span>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-start">
            <span className="text-xs font-semibold text-gray-500 mb-1">Total Withdrawals</span>
            <span className="text-3xl font-bold text-orange-600">${wallet ? parseFloat(wallet.total_withdrawals || '0').toFixed(2) : '0.00'}</span>
            <span className="text-xs text-gray-400 mt-2">Approved withdrawals</span>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-start">
            <span className="text-xs font-semibold text-gray-500 mb-1">Total Invested</span>
            <span className="text-3xl font-bold text-[#0b2f6b]">${investments ? investments.filter(inv => inv.status === 'approved').reduce((sum, inv) => sum + parseFloat(inv.amount || '0'), 0).toFixed(2) : '0.00'}</span>
            <span className="text-xs text-gray-400 mt-2">Active investments</span>
          </div>
        </section>

        {/* Active Investment Plans Section */}
        <section className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Active Investment Plans</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {investments ? investments.filter(inv => inv.status === 'approved').length : 0} active
              </span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {investments && investments.filter(inv => inv.status === 'approved').length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {investments.filter(inv => inv.status === 'approved').map((investment) => {
                const startDate = investment.started_at ? new Date(investment.started_at) : null
                const endDate = investment.ends_at ? new Date(investment.ends_at) : null
                const now = new Date()
                const planName = investment.plan?.name ?? investment.plan_name ?? 'Investment Plan'
                const totalDays = investment.plan?.duration_days ?? investment.duration_days ?? 0
                const planDailyRoi = investment.plan?.daily_roi ?? investment.daily_roi ?? '0'
                const numericDailyRoi = parseFloat(planDailyRoi || '0')
                const investmentAmount = parseFloat(investment.amount || '0')
                const daysLeft = endDate ? Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0
                const daysElapsed = Math.min(totalDays, Math.max(0, totalDays - daysLeft))
                const progressPercentage = totalDays > 0 ? Math.min(100, (daysElapsed / totalDays) * 100) : 0
                const dailyReturn = (investmentAmount * numericDailyRoi) / 100
                const totalEarned = dailyReturn * daysElapsed
                const expectedTotal = parseFloat(
                  investment.total_return || investment.expected_return || '0'
                ) || (investmentAmount + dailyReturn * totalDays)
                const isCompleted = daysLeft === 0 && endDate && now >= endDate
                
                return (
                  <div key={investment.id} className="border-2 border-gray-100 rounded-2xl p-6 hover:border-blue-200 transition-all duration-300 hover:shadow-lg">
                    {/* Investment Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{planName}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            isCompleted 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {isCompleted ? 'Completed' : 'Active'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {numericDailyRoi}% daily ROI
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Investment Amount</p>
                        <p className="text-2xl font-bold text-gray-800">${parseFloat(investment.amount || '0').toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">Progress</span>
                        <span className="text-sm text-gray-500">{daysElapsed}/{totalDays} days</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-300 ${
                            isCompleted ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-2 text-sm">
                        <span className="text-gray-500">
                          Started: {startDate ? startDate.toLocaleDateString() : 'N/A'}
                        </span>
                        <span className={`font-medium ${isCompleted ? 'text-green-600' : 'text-blue-600'}`}>
                          {isCompleted ? 'Completed' : `${daysLeft} days left`}
                        </span>
                      </div>
                    </div>

                    {/* Financial Details Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-green-50 rounded-xl p-4 text-center">
                        <p className="text-sm text-gray-600 mb-1">Total Earned</p>
                        <p className="text-lg font-bold text-green-600">
                          ${totalEarned.toFixed(2)}
                        </p>
                        <p className="text-xs text-green-500">
                          ${dailyReturn.toFixed(2)}/day
                        </p>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-4 text-center">
                        <p className="text-sm text-gray-600 mb-1">Expected Total</p>
                        <p className="text-lg font-bold text-blue-600">
                          ${expectedTotal.toFixed(2)}
                        </p>
                        <p className="text-xs text-blue-500">
                          At completion
                        </p>
                      </div>
                    </div>

                    {/* Investment Details */}
                    <div className="border-t border-gray-100 pt-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Duration</p>
                          <p className="text-sm font-semibold text-gray-700">{totalDays} days</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Daily ROI</p>
                          <p className="text-sm font-semibold text-gray-700">{numericDailyRoi}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">End Date</p>
                          <p className="text-sm font-semibold text-gray-700">
                            {endDate ? endDate.toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    {isCompleted && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-center space-x-2 text-green-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-semibold">Investment Completed</span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 012-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Active Investments</h3>
              <p className="text-gray-500 mb-6">You don't have any active investment plans yet. Start investing today!</p>
              <Link
                href="/dashboard/new-investment"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#0b2f6b] via-[#2563eb] to-[#1d4ed8] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Start Your First Investment
              </Link>
            </div>
          )}
        </section>

        {/* Virtual Card Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Virtual Card Display */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Your Virtual Card</h2>
              <div className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold">
                Not Active
              </div>
            </div>
            <p className="text-gray-600 mb-6">Activate your WolvCapital virtual Visa card for global transactions</p>
            
            <div className="flex justify-center mb-6">
              <FlipCard 
                maxWidth={480}
                aspectWidth={480}
                aspectHeight={300}
                animationMs={800}
                perspective={1200}
                borderRadius={24}
                shadow="0 12px 30px rgba(11,47,107,0.35)"
              />
            </div>
            <p className="text-sm text-gray-500 text-center mb-6">Tap to flip the WolvCapital Visa card preview — purchase below to unlock real usage.</p>
            
            <div className="grid grid-cols-2 gap-4 text-center mb-6">
              <div className="p-3 bg-blue-50 rounded-xl">
                <p className="text-sm text-gray-600">Monthly Limit</p>
                <p className="text-lg font-bold text-blue-600">$50,000</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <p className="text-sm text-gray-600">Activation Fee</p>
                <p className="text-lg font-bold text-green-600">$1,000</p>
              </div>
            </div>

            <Link
              href="/dashboard/purchase-card"
              className="w-full bg-gradient-to-r from-[#0b2f6b] via-[#2563eb] to-[#1d4ed8] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span>Purchase Card - $1,000</span>
            </Link>
          </div>

          {/* Card Benefits */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Premium Card Benefits</h3>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Global Transactions</h4>
                  <p className="text-sm text-gray-600">Make purchases worldwide with instant processing and competitive exchange rates</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Unlimited Withdrawals</h4>
                  <p className="text-sm text-gray-600">Access your funds anytime with no withdrawal limits or restrictions</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Account Upgrade</h4>
                  <p className="text-sm text-gray-600">Unlock premium features and higher investment limits with card activation</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Instant Processing</h4>
                  <p className="text-sm text-gray-600">Lightning-fast transactions for seamless online purchases and payments</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
              <div className="flex items-center space-x-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <div>
                  <p className="font-semibold text-blue-900">Premium Member Exclusive</p>
                  <p className="text-sm text-blue-700">Join our elite members with enhanced privileges</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Transactions Section */}
        <section className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2 sm:mb-6">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Recent Transactions</h2>
            <Link href="/dashboard/transactions" className="text-[#2563eb] text-xs sm:text-sm hover:underline">View all</Link>
          </div>
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-sm">No transactions yet.</p>
          ) : (
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                <thead>
                  <tr>
                    <th className="px-2 sm:px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-2 sm:px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-2 sm:px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="px-2 sm:px-4 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-2 sm:px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="px-2 sm:px-4 py-3 text-gray-700">{new Date(tx.created_at).toLocaleDateString()}</td>
                      <td className="px-2 sm:px-4 py-3 capitalize">
                        <span className={tx.tx_type === 'deposit' ? 'text-emerald-600' : 'text-orange-600'}>
                          {tx.tx_type}
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 py-3 text-gray-600">{tx.payment_method}</td>
                      <td className="px-2 sm:px-4 py-3 text-gray-900 text-right">${parseFloat(tx.amount || '0').toFixed(2)}</td>
                      <td className="px-2 sm:px-4 py-3">
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
        </section>

        {/* Quick Actions Section */}
        <section className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/new-investment" className="p-4 sm:p-6 border-2 border-gray-200 rounded-2xl hover:border-[#2563eb] hover:shadow-lg transition text-center group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:bg-[#2563eb] transition">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#2563eb] group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 mb-1 sm:mb-2">New Investment</h3>
              <p className="text-xs sm:text-sm text-gray-600">Select a compliant investment plan and amount</p>
            </Link>
            <Link href="/dashboard/deposit" className="p-4 sm:p-6 border-2 border-gray-200 rounded-2xl hover:border-[#2563eb] hover:shadow-lg transition text-center group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:bg-[#2563eb] transition">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 mb-1 sm:mb-2">Deposit</h3>
              <p className="text-xs sm:text-sm text-gray-600">Fund your wallet securely</p>
            </Link>
            <Link href="/dashboard/withdraw" className="p-4 sm:p-6 border-2 border-gray-200 rounded-2xl hover:border-[#2563eb] hover:shadow-lg transition text-center group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:bg-[#2563eb] transition">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20V4m8 8H4" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 mb-1 sm:mb-2">Withdraw</h3>
              <p className="text-xs sm:text-sm text-gray-600">Request a payout (subject to compliance review)</p>
            </Link>
            <Link href="/dashboard/support" className="p-4 sm:p-6 border-2 border-gray-200 rounded-2xl hover:border-[#2563eb] hover:shadow-lg transition text-center group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:bg-[#2563eb] transition">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 mb-1 sm:mb-2">Support</h3>
              <p className="text-xs sm:text-sm text-gray-600">Get help from our compliance and investor support teams</p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

