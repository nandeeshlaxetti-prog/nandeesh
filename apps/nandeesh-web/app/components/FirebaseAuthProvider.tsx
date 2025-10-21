'use client'

interface FirebaseAuthProviderProps {
  children: React.ReactNode
}

// Authentication disabled - Firebase auth provider bypassed
export default function FirebaseAuthProvider({ children }: FirebaseAuthProviderProps) {
  // Simply render children without Firebase auth initialization
  return <>{children}</>
}
