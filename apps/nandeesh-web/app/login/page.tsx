'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase-config'
import { logFirebaseConfig } from '@/lib/firebase-auth-setup'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string; general?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  
  const router = useRouter()

  const [firebaseStatus, setFirebaseStatus] = useState<'checking' | 'ready' | 'error'>('checking')

  // Log Firebase configuration on mount (for debugging)
  useEffect(() => {
    console.log('🔥 Login Page Loaded')
    logFirebaseConfig()
    console.log('Auth object:', auth ? '✅ Available' : '❌ Not available')
    
    // Check if Firebase is properly configured
    const isConfigured = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
                        process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'demo-api-key'
    
    if (isConfigured && auth) {
      setFirebaseStatus('ready')
      console.log('✅ Firebase is ready')
    } else {
      setFirebaseStatus('error')
      console.error('❌ Firebase is not properly configured')
    }
  }, [])

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setIsLoading(true)

    // Simple validation
    const newErrors: { email?: string; password?: string; name?: string; general?: string } = {}
    
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (isSignUp && !name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      // Check if Firebase is configured
      const isFirebaseConfigured = firebaseStatus === 'ready'
      
      if (isFirebaseConfigured && auth) {
        // Use Firebase Authentication
        if (isSignUp) {
          // Sign up with Firebase
          const userCredential = await createUserWithEmailAndPassword(auth, email, password)
          console.log('✅ User created with Firebase:', userCredential.user.email)
          
          // Store user info
          localStorage.setItem('isAuthenticated', 'true')
          localStorage.setItem('userName', name)
          localStorage.setItem('userEmail', email)
          
          // Redirect to dashboard
          router.push('/dashboard')
        } else {
          // Sign in with Firebase
          const userCredential = await signInWithEmailAndPassword(auth, email, password)
          console.log('✅ User signed in with Firebase:', userCredential.user.email)
          
          // Store authentication status
          localStorage.setItem('isAuthenticated', 'true')
          localStorage.setItem('userEmail', email)
          
          // Redirect to dashboard
          router.push('/dashboard')
        }
      } else {
        // Fallback to mock authentication (for development/testing)
        console.warn('⚠️ Using mock authentication (Firebase not configured)')
        await new Promise(resolve => setTimeout(resolve, 800)) // Simulate API call
        
        // Set authentication flag in localStorage
        localStorage.setItem('isAuthenticated', 'true')
        if (isSignUp) {
          localStorage.setItem('userName', name)
        }
        localStorage.setItem('userEmail', email)
        
        // Redirect to dashboard
        router.push('/dashboard')
      }
    } catch (error: any) {
      console.error('❌ Authentication error:', error)
      
      // Handle Firebase auth errors with user-friendly messages
      let errorMessage = 'Authentication failed. Please try again.'
      
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.'
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.'
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please sign up first.'
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.'
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please sign in instead.'
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password.'
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.'
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.'
      } else if (error.message && error.message.includes('auth/operation-not-allowed')) {
        errorMessage = 'Email/Password authentication is not enabled in Firebase Console. Please enable it in Authentication > Sign-in method.'
      }
      
      setErrors({ general: errorMessage })
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <span className="text-2xl font-bold text-white">L</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isSignUp ? 'Create Account' : 'Sign in'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isSignUp ? 'Join LNN Legal today' : 'Welcome back to LNN Legal'}
          </p>
        </div>

        {/* Firebase Status Warning */}
        {firebaseStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              ⚠️ <strong>Firebase not configured.</strong> Using local storage fallback.
              Check console for details.
            </p>
          </div>
        )}

        {/* Login Form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input (only for sign up) */}
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="mt-1 text-sm text-red-600">
                    {errors.name}
                  </p>
                )}
              </div>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
                autoComplete="email"
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder={isSignUp ? 'Create a password' : 'Enter your password'}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me (only for sign in) */}
            {!isSignUp && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  disabled
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2 px-4 rounded-lg font-medium hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isSignUp ? 'Creating account...' : 'Signing in...'}
                </div>
              ) : (
                isSignUp ? 'Create Account' : 'Sign in'
              )}
            </button>
          </form>

          {/* Toggle between sign in and sign up */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setErrors({})
                }}
                className="text-amber-600 hover:text-amber-700 font-medium"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}