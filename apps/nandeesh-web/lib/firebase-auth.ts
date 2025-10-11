import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

export interface UserProfile {
  email: string
  name?: string
  role?: string
  createdAt: Date
  lastLoginAt: Date
}

export class FirebaseAuthService {
  // Sign in with email and password
  static async signIn(email: string, password: string): Promise<UserProfile> {
    if (!auth) {
      throw new Error('Firebase not initialized')
    }
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Update last login time
      await this.updateLastLogin(user.uid)
      
      // Get user profile
      const profile = await this.getUserProfile(user.uid)
      return profile
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code))
    }
  }

  // Sign up with email and password
  static async signUp(email: string, password: string, name?: string): Promise<UserProfile> {
    if (!auth || !db) {
      throw new Error('Firebase not initialized')
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Update user display name
      if (name) {
        await updateProfile(user, { displayName: name })
      }
      
      // Create user profile in Firestore
      const profile: UserProfile = {
        email: user.email!,
        name: name || user.displayName || '',
        role: 'user',
        createdAt: new Date(),
        lastLoginAt: new Date()
      }
      
      await setDoc(doc(db, 'users', user.uid), profile)
      
      return profile
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code))
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    if (!auth) {
      return // No-op if Firebase not initialized
    }
    
    try {
      await signOut(auth)
    } catch (error: any) {
      console.error('Firebase sign out error:', error)
    }
  }

  // Get current user
  static getCurrentUser(): User | null {
    if (!auth) {
      return null
    }
    return auth.currentUser
  }

  // Listen to auth state changes
  static onAuthStateChanged(callback: (user: User | null) => void) {
    if (!auth) {
      console.warn('Firebase not configured - using localStorage fallback')
      // Return a no-op unsubscribe function and immediately call callback with null
      setTimeout(() => callback(null), 100)
      return () => {}
    }
    return onAuthStateChanged(auth, callback)
  }

  // Get user profile from Firestore
  static async getUserProfile(uid: string): Promise<UserProfile> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      
      if (userDoc.exists()) {
        const data = userDoc.data()
        return {
          email: data.email,
          name: data.name || '',
          role: data.role || 'user',
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLoginAt: data.lastLoginAt?.toDate() || new Date()
        }
      } else {
        // If no profile exists, create one from auth user
        const user = auth.currentUser
        if (user) {
          const profile: UserProfile = {
            email: user.email!,
            name: user.displayName || '',
            role: 'user',
            createdAt: new Date(),
            lastLoginAt: new Date()
          }
          await setDoc(doc(db, 'users', uid), profile)
          return profile
        }
        throw new Error('User not found')
      }
    } catch (error) {
      throw new Error('Failed to get user profile')
    }
  }

  // Update last login time
  static async updateLastLogin(uid: string): Promise<void> {
    try {
      await setDoc(doc(db, 'users', uid), {
        lastLoginAt: new Date()
      }, { merge: true })
    } catch (error) {
      console.error('Failed to update last login:', error)
    }
  }

  // Get user-friendly error messages
  private static getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No user found with this email address'
      case 'auth/wrong-password':
        return 'Incorrect password'
      case 'auth/invalid-email':
        return 'Invalid email address'
      case 'auth/user-disabled':
        return 'This user account has been disabled'
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later'
      case 'auth/email-already-in-use':
        return 'An account with this email already exists'
      case 'auth/weak-password':
        return 'Password should be at least 6 characters'
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection'
      default:
        return 'Authentication failed. Please try again'
    }
  }
}
