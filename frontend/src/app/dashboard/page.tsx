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

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUserData = async () => {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const token = localStorage.getItem('authToken')

      try {
        const response = await fetch(`${apiBase}/api/auth/me/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Token ${token}` }),
          },
          credentials: 'include',
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data)
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
            <Link href="/" className="flex items-center space-x-2">
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#0b2f6b] via-[#2563eb] to-[#1d4ed8] rounded-3xl shadow-xl p-8 mb-8 text-white">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user?.first_name || user?.email}!
          </h1>
          <p className="text-xl opacity-90">
            Here's your investment dashboard overview
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">Total Investment</h3>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">$0.00</p>
            <p className="text-sm text-gray-500 mt-2">No active investments yet</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">Total Returns</h3>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">$0.00</p>
            <p className="text-sm text-gray-500 mt-2">+0.00% this month</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">Active Plans</h3>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">0</p>
            <p className="text-sm text-gray-500 mt-2">Start investing today</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/plans" className="p-6 border-2 border-gray-200 rounded-2xl hover:border-[#2563eb] hover:shadow-lg transition text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#2563eb] transition">
                <svg className="w-8 h-8 text-[#2563eb] group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">New Investment</h3>
              <p className="text-sm text-gray-600">Browse investment plans</p>
            </Link>

            <Link href="/contact" className="p-6 border-2 border-gray-200 rounded-2xl hover:border-[#2563eb] hover:shadow-lg transition text-center group">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#2563eb] transition">
                <svg className="w-8 h-8 text-green-600 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Support</h3>
              <p className="text-sm text-gray-600">Get help from our team</p>
            </Link>

            <div className="p-6 border-2 border-gray-200 rounded-2xl hover:border-[#2563eb] hover:shadow-lg transition text-center group cursor-pointer">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#2563eb] transition">
                <svg className="w-8 h-8 text-yellow-600 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Portfolio</h3>
              <p className="text-sm text-gray-600">View your investments</p>
            </div>

            <div className="p-6 border-2 border-gray-200 rounded-2xl hover:border-[#2563eb] hover:shadow-lg transition text-center group cursor-pointer">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#2563eb] transition">
                <svg className="w-8 h-8 text-purple-600 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Settings</h3>
              <p className="text-sm text-gray-600">Manage your account</p>
            </div>
          </div>
        </div>

        {/* User Info Section (for debugging) */}
        {user?.is_staff && (
          <div className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-yellow-800 mb-3">👑 Admin User</h3>
            <div className="text-sm text-yellow-700 space-y-1">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>User ID:</strong> {user.id}</p>
              <p><strong>Staff:</strong> {user.is_staff ? 'Yes' : 'No'}</p>
              <p><strong>Superuser:</strong> {user.is_superuser ? 'Yes' : 'No'}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
