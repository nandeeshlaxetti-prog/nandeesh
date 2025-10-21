'use client'

import { useEffect } from 'react'
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

  useEffect(() => {
    // Check if current route is protected
    const isProtectedRoute = PROTECTED_ROUTES.some(route => 
      pathname.startsWith(route)
    )
    
    // Check if current route is public
    const isPublicRoute = PUBLIC_ROUTES.some(route => 
      pathname === route || pathname.startsWith(route + '/')
    )

    // Simple mock authentication check using localStorage
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
  }, [pathname, router])

  // Check if current route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  )

  // Simple mock authentication check
  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('isAuthenticated') === 'true'

  // If it's a protected route and user is not authenticated, don't render anything
  if (isProtectedRoute && !isAuthenticated) {
    return null
  }

  return <>{children}</>
}
