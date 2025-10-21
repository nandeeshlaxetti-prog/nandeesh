'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase-config'
import UnifiedDashboard from '@/app/components/UnifiedDashboard'

export default function Dashboard() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  // Get user info from localStorage (only on client)
  const [userName, setUserName] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      setUserName(localStorage.getItem('userName'))
      setUserEmail(localStorage.getItem('userEmail'))
    }
  }, [])

  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth)
      console.log('✅ User signed out successfully')
      
      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('isAuthenticated')
        localStorage.removeItem('userName')
        localStorage.removeItem('userEmail')
      }
      
      // Redirect to login
      router.push('/login')
    } catch (error) {
      console.error('❌ Sign out error:', error)
      // Still redirect to login even if Firebase signOut fails
      router.push('/login')
    }
  }

  // Show loading while checking client-side state
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {userName || userEmail || 'User'}
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
