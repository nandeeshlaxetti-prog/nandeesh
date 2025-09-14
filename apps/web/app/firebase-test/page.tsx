'use client'

import { useState, useEffect } from 'react'
import { auth } from '@/lib/firebase'
import { FirebaseAuthService } from '@/lib/firebase-auth'

export default function FirebaseTestPage() {
  const [status, setStatus] = useState('Checking Firebase...')
  const [user, setUser] = useState<any>(null)
  const [testEmail, setTestEmail] = useState('test@example.com')
  const [testPassword, setTestPassword] = useState('testpass123')

  useEffect(() => {
    // Test Firebase initialization
    try {
      if (auth) {
        setStatus('✅ Firebase initialized successfully!')
        
        // Listen to auth state changes
        const unsubscribe = FirebaseAuthService.onAuthStateChanged((user) => {
          setUser(user)
          if (user) {
            setStatus(`✅ User authenticated: ${user.email}`)
          } else {
            setStatus('ℹ️ No user authenticated')
          }
        })

        return () => unsubscribe()
      } else {
        setStatus('❌ Firebase failed to initialize')
      }
    } catch (error) {
      setStatus(`❌ Firebase error: ${error}`)
    }
  }, [])

  const handleTestSignUp = async () => {
    try {
      setStatus('Creating test account...')
      const profile = await FirebaseAuthService.signUp(testEmail, testPassword, 'Test User')
      setStatus(`✅ Account created: ${profile.email}`)
    } catch (error) {
      setStatus(`❌ Sign up error: ${error}`)
    }
  }

  const handleTestSignIn = async () => {
    try {
      setStatus('Signing in...')
      const profile = await FirebaseAuthService.signIn(testEmail, testPassword)
      setStatus(`✅ Signed in: ${profile.email}`)
    } catch (error) {
      setStatus(`❌ Sign in error: ${error}`)
    }
  }

  const handleSignOut = async () => {
    try {
      await FirebaseAuthService.signOut()
      setStatus('✅ Signed out successfully')
    } catch (error) {
      setStatus(`❌ Sign out error: ${error}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Firebase Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <p className="text-lg">{status}</p>
          
          {user && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800">Current User:</h3>
              <p className="text-green-700">Email: {user.email}</p>
              <p className="text-green-700">UID: {user.uid}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Authentication</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Test Email
              </label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Test Password
              </label>
              <input
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={handleTestSignUp}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Test Sign Up
              </button>
              
              <button
                onClick={handleTestSignIn}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Test Sign In
              </button>
              
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a 
            href="/login" 
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            ← Back to Login Page
          </a>
        </div>
      </div>
    </div>
  )
}
