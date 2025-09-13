import { AuthService, AuthSession, AuthUser } from './auth'
import { ConfigUtils } from 'core'

export interface SessionManager {
  getCurrentSession(): AuthSession | null
  setSession(session: AuthSession): void
  clearSession(): void
  isAuthenticated(): boolean
  getCurrentUser(): AuthUser | null
  refreshSession(): boolean
}

/**
 * In-memory session manager for desktop mode
 */
export class DesktopSessionManager implements SessionManager {
  private currentSession: AuthSession | null = null
  private readonly SESSION_REFRESH_THRESHOLD = 2 * 60 * 60 * 1000 // 2 hours

  /**
   * Get current session
   */
  getCurrentSession(): AuthSession | null {
    if (!this.currentSession) {
      return null
    }

    // Check if session is expired
    if (this.currentSession.expiresAt < new Date()) {
      this.clearSession()
      return null
    }

    return this.currentSession
  }

  /**
   * Set current session
   */
  setSession(session: AuthSession): void {
    this.currentSession = session
    console.log(`Session set for user: ${session.user.email}`)
  }

  /**
   * Clear current session
   */
  clearSession(): void {
    if (this.currentSession) {
      console.log(`Session cleared for user: ${this.currentSession.user.email}`)
    }
    this.currentSession = null
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getCurrentSession() !== null
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): AuthUser | null {
    const session = this.getCurrentSession()
    return session ? session.user : null
  }

  /**
   * Refresh session if needed
   */
  refreshSession(): boolean {
    const session = this.getCurrentSession()
    if (!session) {
      return false
    }

    // Check if session needs refresh (within 2 hours of expiry)
    const refreshThreshold = new Date(session.expiresAt.getTime() - this.SESSION_REFRESH_THRESHOLD)
    if (new Date() > refreshThreshold) {
      // Extend session by 24 hours
      session.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
      console.log(`Session refreshed for user: ${session.user.email}`)
      return true
    }

    return false
  }

  /**
   * Get session info for debugging
   */
  getSessionInfo(): {
    isAuthenticated: boolean
    user?: AuthUser
    expiresAt?: Date
    timeUntilExpiry?: number
  } {
    const session = this.getCurrentSession()
    if (!session) {
      return { isAuthenticated: false }
    }

    const timeUntilExpiry = session.expiresAt.getTime() - Date.now()
    return {
      isAuthenticated: true,
      user: session.user,
      expiresAt: session.expiresAt,
      timeUntilExpiry: Math.max(0, timeUntilExpiry),
    }
  }
}

/**
 * Singleton session manager instance
 */
let sessionManager: SessionManager | null = null

/**
 * Get the session manager instance
 */
export function getSessionManager(): SessionManager {
  if (!sessionManager) {
    if (ConfigUtils.isDesktop()) {
      sessionManager = new DesktopSessionManager()
    } else {
      // For web mode, you might want to use a different session manager
      // that stores sessions in cookies or localStorage
      throw new Error('Session management not implemented for web mode')
    }
  }

  return sessionManager
}

/**
 * Authentication middleware for API routes
 */
export function requireAuth() {
  return (req: any, res: any, next: any) => {
    try {
      const sessionManager = getSessionManager()
      
      if (!sessionManager.isAuthenticated()) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      // Add user to request object
      req.user = sessionManager.getCurrentUser()
      req.session = sessionManager.getCurrentSession()
      
      next()
    } catch (error) {
      console.error('Auth middleware error:', error)
      return res.status(500).json({ error: 'Authentication error' })
    }
  }
}

/**
 * Role-based authorization middleware
 */
export function requireRole(allowedRoles: string[]) {
  return (req: any, res: any, next: any) => {
    try {
      const sessionManager = getSessionManager()
      const user = sessionManager.getCurrentUser()
      
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' })
      }

      next()
    } catch (error) {
      console.error('Role middleware error:', error)
      return res.status(500).json({ error: 'Authorization error' })
    }
  }
}

/**
 * Admin-only middleware
 */
export function requireAdmin() {
  return requireRole(['ADMIN'])
}

/**
 * Lawyer or Admin middleware
 */
export function requireLawyerOrAdmin() {
  return requireRole(['ADMIN', 'LAWYER'])
}
