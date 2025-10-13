'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-state'

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    // Instant redirect - no timeout needed
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/dashboard')
      } else {
        router.replace('/login')
      }
    } else {
      // If still loading after 1 second, force redirect to login
      const timeout = setTimeout(() => {
        router.replace('/login')
      }, 1000)
      return () => clearTimeout(timeout)
    }
  }, [isAuthenticated, isLoading, router])

  // Return null - no visible loading screen
  return null
}