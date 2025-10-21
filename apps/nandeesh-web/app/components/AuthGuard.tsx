'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface AuthGuardProps {
  children: React.ReactNode
}

// Define protected routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/cases',
  '/tasks', 
  '/projects',
  '/contacts',
  '/team',
  '/integrations',
  '/settings',
  '/my-work',
  '/cause-list'
]

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/firebase-test'
]

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client side before checking localStorage
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return // Don't run on server side

    // Check if current route is protected
    const isProtectedRoute = PROTECTED_ROUTES.some(route => 
      pathname.startsWith(route)
    )
    
    // Check if current route is public
    const isPublicRoute = PUBLIC_ROUTES.some(route => 
      pathname === route || pathname.startsWith(route + '/')
    )

    // Simple mock authentication check using localStorage (only on client)
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

    // If it's a protected route and user is not authenticated, redirect to login
    if (isProtectedRoute && !isAuthenticated) {
      router.replace('/login')
      return
    }

    // If user is authenticated and trying to access login page, redirect to dashboard
    if (isAuthenticated && pathname === '/login') {
      router.replace('/dashboard')
      return
    }

    // If user is authenticated and on root page, redirect to dashboard
    if (isAuthenticated && pathname === '/') {
      router.replace('/dashboard')
      return
    }
  }, [pathname, router, isClient])

  // Check if current route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  )

  // Simple mock authentication check (only on client)
  const isAuthenticated = isClient && localStorage.getItem('isAuthenticated') === 'true'

  // Show loading while checking authentication on client side
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

  // If it's a protected route and user is not authenticated, don't render anything
  if (isProtectedRoute && !isAuthenticated) {
    return null
  }

  return <>{children}</>
}
