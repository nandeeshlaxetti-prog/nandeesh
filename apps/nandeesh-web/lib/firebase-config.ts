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

// Demo Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "demo-app-id",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase - check if app already exists (singleton pattern)
let app: FirebaseApp
let db: Firestore
let auth: Auth

if (typeof window !== 'undefined') {
  // Client-side initialization
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
  db = getFirestore(app)
  auth = getAuth(app)
  
  // Enable Auth persistence for faster subsequent logins
  import('firebase/auth').then(({ setPersistence, browserLocalPersistence }) => {
    setPersistence(auth, browserLocalPersistence).catch(err => {
      console.warn('Could not set auth persistence:', err)
    })
  })
} else {
  // Server-side initialization (minimal)
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
  db = getFirestore(app)
  auth = getAuth(app)
}

export { db, auth }

// For demo purposes, we'll use localStorage fallback when Firebase is not configured
export const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey !== "demo-api-key" && 
         firebaseConfig.projectId !== "demo-project"
}

// Export configuration for debugging
export const getFirebaseConfig = () => firebaseConfig

export default app
