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

// Firebase configuration - using actual values with env var override
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCDoZu4RNkSCn7uYpX1W9e83zwdfJ2ivoY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "lnn-legal-app.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "lnn-legal-app",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "lnn-legal-app.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "114196336810",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:114196336810:web:bebc54507fa8c23b6b40d3",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-JX55MML2VZ"
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
