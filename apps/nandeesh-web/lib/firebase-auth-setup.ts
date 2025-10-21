/**
 * Firebase Authentication Setup Checker
 * Helps diagnose Firebase auth issues
 */

import { auth } from './firebase-config'

export async function checkFirebaseAuthSetup() {
  const checks = {
    firebaseInitialized: false,
    authEnabled: false,
    environmentVarsPresent: false,
    errors: [] as string[]
  }

  try {
    // Check if Firebase is initialized
    if (auth) {
      checks.firebaseInitialized = true
      console.log('✅ Firebase initialized')
    }

    // Check environment variables
    const requiredVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID'
    ]

    const missingVars = requiredVars.filter(
      varName => !process.env[varName] || process.env[varName] === 'demo-api-key' || process.env[varName] === 'demo-project'
    )

    if (missingVars.length === 0) {
      checks.environmentVarsPresent = true
      console.log('✅ All Firebase environment variables present')
    } else {
      checks.errors.push(`Missing environment variables: ${missingVars.join(', ')}`)
      console.error('❌ Missing Firebase environment variables:', missingVars)
    }

    // Check if auth is ready
    if (auth && auth.currentUser !== undefined) {
      checks.authEnabled = true
      console.log('✅ Firebase Auth is enabled')
    }

  } catch (error) {
    checks.errors.push(`Firebase initialization error: ${error}`)
    console.error('❌ Firebase setup error:', error)
  }

  return checks
}

export function logFirebaseConfig() {
  console.log('🔍 Firebase Configuration Check:')
  console.log('API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing')
  console.log('Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing')
  console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing')
  console.log('Storage Bucket:', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Missing')
  console.log('Messaging Sender ID:', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✅ Set' : '❌ Missing')
  console.log('App ID:', process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing')
}

