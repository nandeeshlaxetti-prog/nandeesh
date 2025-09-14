'use client'

import { useFirebaseAuth } from '@/lib/auth-state'

interface FirebaseAuthProviderProps {
  children: React.ReactNode
}

export default function FirebaseAuthProvider({ children }: FirebaseAuthProviderProps) {
  // Initialize Firebase auth state listener
  useFirebaseAuth()
  
  return <>{children}</>
}
