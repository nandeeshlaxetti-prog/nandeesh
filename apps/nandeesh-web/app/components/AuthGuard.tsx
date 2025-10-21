'use client'

interface AuthGuardProps {
  children: React.ReactNode
}

// Authentication disabled - all routes are accessible
export default function AuthGuard({ children }: AuthGuardProps) {
  // Simply render children without any authentication checks
  return <>{children}</>
}
