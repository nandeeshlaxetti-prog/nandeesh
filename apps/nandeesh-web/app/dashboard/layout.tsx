'use client'

interface ProtectedLayoutProps {
  children: React.ReactNode
}

// Authentication disabled - no protection needed
export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return <>{children}</>
}
