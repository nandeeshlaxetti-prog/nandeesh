import bcrypt from 'bcrypt'
import { db } from './database'
import { ConfigUtils } from 'core'

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  status: string
  isActive: boolean
  lastLoginAt?: Date
}

export interface AuthSession {
  user: AuthUser
  token: string
  expiresAt: Date
  createdAt: Date
}

/**
 * Authentication service for local user authentication
 */
export class AuthService {
  private static sessions = new Map<string, AuthSession>()
  private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

  /**
   * Authenticate user with email and password
   */
  static async login(credentials: LoginCredentials): Promise<AuthSession | null> {
    try {
      // Find user by email
      const user = await db.user.findUnique({
        where: { email: credentials.email },
        select: {
          id: true,
          email: true,
          passwordHash: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          isActive: true,
          lastLoginAt: true,
        },
      })

      if (!user) {
        console.log(`Login attempt with non-existent email: ${credentials.email}`)
        return null
      }

      // Check if user is active
      if (!user.isActive || user.status !== 'ACTIVE') {
        console.log(`Login attempt with inactive user: ${credentials.email}`)
        return null
      }

      // Check if user has password hash (for local authentication)
      if (!user.passwordHash) {
        console.log(`Login attempt with user without password: ${credentials.email}`)
        return null
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(credentials.password, user.passwordHash)
      if (!isValidPassword) {
        console.log(`Invalid password for user: ${credentials.email}`)
        return null
      }

      // Update last login time
      await db.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      })

      // Create session
      const session = this.createSession(user)
      
      console.log(`User logged in successfully: ${credentials.email}`)
      return session

    } catch (error) {
      console.error('Login error:', error)
      return null
    }
  }

  /**
   * Create a new session for authenticated user
   */
  private static createSession(user: any): AuthSession {
    const token = this.generateToken()
    const expiresAt = new Date(Date.now() + this.SESSION_DURATION)
    
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
    }

    const session: AuthSession = {
      user: authUser,
      token,
      expiresAt,
      createdAt: new Date(),
    }

    // Store session in memory
    this.sessions.set(token, session)

    // Clean up expired sessions
    this.cleanupExpiredSessions()

    return session
  }

  /**
   * Validate session token
   */
  static validateSession(token: string): AuthSession | null {
    const session = this.sessions.get(token)
    
    if (!session) {
      return null
    }

    // Check if session is expired
    if (session.expiresAt < new Date()) {
      this.sessions.delete(token)
      return null
    }

    return session
  }

  /**
   * Logout user by invalidating session
   */
  static logout(token: string): boolean {
    const session = this.sessions.get(token)
    if (session) {
      this.sessions.delete(token)
      console.log(`User logged out: ${session.user.email}`)
      return true
    }
    return false
  }

  /**
   * Get all active sessions (for admin purposes)
   */
  static getActiveSessions(): AuthSession[] {
    this.cleanupExpiredSessions()
    return Array.from(this.sessions.values())
  }

  /**
   * Generate a secure random token
   */
  private static generateToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  /**
   * Clean up expired sessions
   */
  private static cleanupExpiredSessions(): void {
    const now = new Date()
    for (const [token, session] of this.sessions.entries()) {
      if (session.expiresAt < now) {
        this.sessions.delete(token)
      }
    }
  }

  /**
   * Hash password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12
    return await bcrypt.hash(password, saltRounds)
  }

  /**
   * Verify password against hash
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }

  /**
   * Create a new user with hashed password
   */
  static async createUser(userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    role?: string
    status?: string
  }): Promise<AuthUser | null> {
    try {
      // Check if user already exists
      const existingUser = await db.user.findUnique({
        where: { email: userData.email },
      })

      if (existingUser) {
        throw new Error('User with this email already exists')
      }

      // Hash password
      const passwordHash = await this.hashPassword(userData.password)

      // Create user
      const user = await db.user.create({
        data: {
          email: userData.email,
          passwordHash,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role || 'LAWYER',
          status: userData.status || 'ACTIVE',
          isActive: true,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          isActive: true,
          lastLoginAt: true,
        },
      })

      console.log(`User created successfully: ${userData.email}`)
      return user

    } catch (error) {
      console.error('User creation error:', error)
      return null
    }
  }

  /**
   * Update user password
   */
  static async updatePassword(userId: string, newPassword: string): Promise<boolean> {
    try {
      const passwordHash = await this.hashPassword(newPassword)
      
      await db.user.update({
        where: { id: userId },
        data: { passwordHash },
      })

      console.log(`Password updated for user: ${userId}`)
      return true

    } catch (error) {
      console.error('Password update error:', error)
      return false
    }
  }

  /**
   * Check if authentication is enabled (desktop mode only)
   */
  static isAuthEnabled(): boolean {
    const config = ConfigUtils.getConfig()
    return config.APP_MODE === 'desktop'
  }

  /**
   * Get session statistics
   */
  static getSessionStats(): {
    totalSessions: number
    activeSessions: number
    expiredSessions: number
  } {
    const now = new Date()
    let activeSessions = 0
    let expiredSessions = 0

    for (const session of this.sessions.values()) {
      if (session.expiresAt < now) {
        expiredSessions++
      } else {
        activeSessions++
      }
    }

    return {
      totalSessions: this.sessions.size,
      activeSessions,
      expiredSessions,
    }
  }
}
