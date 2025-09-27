'use client'

import { useAuth } from '@/lib/auth-state'
import { useRouter } from 'next/navigation'
import UnifiedDashboard from '@/app/components/UnifiedDashboard'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name || user?.email}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your legal practice today.
          </p>
        </div>
        <UnifiedDashboard />
      </main>
    </div>
  )
}
