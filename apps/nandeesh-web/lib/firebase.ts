import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase configuration - using your actual values
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCDoZu4RNkSCn7uYpX1W9e83zwdfJ2ivoY",
  authDomain: "lnn-legal-app.firebaseapp.com",
  projectId: "lnn-legal-app",
  storageBucket: "lnn-legal-app.firebasestorage.app",
  messagingSenderId: "114196336810",
  appId: "1:114196336810:web:bebc54507fa8c23b6b40d3",
  measurementId: "G-JX55MML2VZ"
}

// Initialize Firebase only on client side
let app: any = null
let auth: any = null
let db: any = null

if (typeof window !== 'undefined') {
  try {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
  } catch (error) {
    console.error('Firebase initialization error:', error)
  }
}

export { auth, db }
export default app
