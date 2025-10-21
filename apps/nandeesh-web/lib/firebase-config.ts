/**
 * Firebase Configuration
 * Centralized cloud storage for all users
 * 
 * NOTE: This is a demo configuration. In production, replace with your actual Firebase config.
 * To set up Firebase:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new project
 * 3. Enable Firestore Database
 * 4. Get your config from Project Settings > General > Your apps
 * 5. Replace the config below with your actual values
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getAuth, Auth } from 'firebase/auth'

// Helper function to clean environment variables (remove newlines, trim whitespace)
const cleanEnvVar = (value: string | undefined): string | undefined => {
  if (!value) return value
  // Remove all newline characters (\r\n, \n, \r), URL-encoded newlines, and trim whitespace
  return value
    .replace(/[\r\n]+/g, '')
    .replace(/%0D%0A/g, '')
    .replace(/%0D/g, '')
    .replace(/%0A/g, '')
    .trim()
}

// Firebase configuration - using actual values with env var override
// Clean all environment variables to remove any newline characters
const firebaseConfig = {
  apiKey: cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_API_KEY) || "AIzaSyCDoZu4RNkSCn7uYpX1W9e83zwdfJ2ivoY",
  authDomain: cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) || "lnn-legal-app.firebaseapp.com",
  projectId: cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) || "lnn-legal-app",
  storageBucket: cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) || "lnn-legal-app.firebasestorage.app",
  messagingSenderId: cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID) || "114196336810",
  appId: cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_APP_ID) || "1:114196336810:web:bebc54507fa8c23b6b40d3",
  measurementId: cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) || "G-JX55MML2VZ"
}

// Initialize Firebase - check if app already exists
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

// Initialize Firestore
export const db = getFirestore(app)

// Initialize Auth
export const auth = getAuth(app)

// Enable Auth persistence for faster subsequent logins (client-side only)
if (typeof window !== 'undefined') {
  import('firebase/auth').then(({ setPersistence, browserLocalPersistence }) => {
    setPersistence(auth, browserLocalPersistence).catch(err => {
      console.warn('Could not set auth persistence:', err)
    })
  })
}

// For demo purposes, we'll use localStorage fallback when Firebase is not configured
export const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey !== "demo-api-key" && 
         firebaseConfig.projectId !== "demo-project"
}

// Export configuration for debugging
export const getFirebaseConfig = () => firebaseConfig

export default app
