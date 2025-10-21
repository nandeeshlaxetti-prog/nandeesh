'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Authentication disabled - redirect directly to dashboard
    router.replace('/dashboard')
  }, [router])

  // Return null - no visible loading screen
  return null
}