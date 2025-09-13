'use client'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  // Simple auth guard - always allow access for now
  return <>{children}</>
}