'use client'

import { useAuth } from '@/lib/auth-state'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-sm font-bold text-white">L</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">LNN Legal Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-medium text-gray-900">{user?.name || user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to LNN Legal</h2>
            <p className="text-gray-600">
              You have successfully authenticated and are now viewing the protected dashboard.
            </p>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Cases Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">📁</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">Cases</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Manage your legal cases and track their progress.
              </p>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View Cases →
              </button>
            </div>

            {/* Tasks Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-semibold">✓</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">Tasks</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Track and manage your daily tasks and deadlines.
              </p>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                View Tasks →
              </button>
            </div>

            {/* Reports Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">📊</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">Reports</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Generate reports and analytics for your practice.
              </p>
              <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                View Reports →
              </button>
            </div>
          </div>

          {/* Authentication Info */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-amber-900 mb-2">Authentication Status</h3>
            <div className="space-y-2 text-sm">
              <p className="text-amber-800">
                <strong>Status:</strong> Authenticated ✅
              </p>
              <p className="text-amber-800">
                <strong>User:</strong> {user?.name || user?.email}
              </p>
              <p className="text-amber-800">
                <strong>Email:</strong> {user?.email}
              </p>
              <p className="text-amber-800">
                <strong>Role:</strong> {user?.role || 'user'}
              </p>
              <p className="text-amber-800">
                <strong>Session:</strong> Active (persisted in localStorage)
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
