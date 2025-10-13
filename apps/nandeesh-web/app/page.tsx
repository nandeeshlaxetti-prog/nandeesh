'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-state'

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [showTimeout, setShowTimeout] = useState(false)

  useEffect(() => {
    // Fallback timeout to force redirect after 2 seconds
    const timeout = setTimeout(() => {
      console.warn('Redirect timeout - forcing navigation to login')
      setShowTimeout(true)
      router.replace('/login')
    }, 2000)

    if (!isLoading) {
      clearTimeout(timeout)
      if (isAuthenticated) {
        router.replace('/dashboard')
      } else {
        router.replace('/login')
      }
    }

    return () => clearTimeout(timeout)
  }, [isAuthenticated, isLoading, router])

  // Always show loading and let the redirect happen
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">
          {showTimeout ? 'Redirecting...' : 'Loading...'}
        </p>
      </div>
    </div>
  )
}