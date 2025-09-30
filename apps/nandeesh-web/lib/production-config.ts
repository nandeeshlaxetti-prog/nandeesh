/**
 * Production Configuration for Small Team
 * Optimized for 10 users with minimal costs
 */

import { z } from 'zod'

// Production environment schema for small teams
const productionEnvSchema = z.object({
  // Application mode
  APP_MODE: z.enum(['web']).default('web'),
  NODE_ENV: z.enum(['production']).default('production'),
  
  // Database - Supabase FREE tier
  DATABASE_URL: z.string().min(1, 'Database URL is required'),
  
  // Authentication - NextAuth.js (FREE)
  NEXTAUTH_URL: z.string().url('Valid URL required'),
  NEXTAUTH_SECRET: z.string().min(32, 'Secret must be at least 32 characters'),
  
  // Firebase - FREE tier (already configured)
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().optional(),
  
  // Security - Basic but sufficient
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
  ENCRYPTION_KEY: z.string().min(32, 'Encryption key must be at least 32 characters'),
  
  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info']).default('info'),
  
  // API Configuration
  API_HOST: z.string().default('0.0.0.0'),
  API_PORT: z.string().transform(Number).default(3000),
  
  // Next.js specific
  NEXT_PUBLIC_APP_URL: z.string().url('Valid app URL required'),
  NEXT_PUBLIC_APP_NAME: z.string().default('LNN Legal Desktop'),
})

// Parse and validate production environment
function parseProductionEnv() {
  try {
    const rawEnv = {
      APP_MODE: process.env.APP_MODE,
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      JWT_SECRET: process.env.JWT_SECRET,
      ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
      LOG_LEVEL: process.env.LOG_LEVEL,
      API_HOST: process.env.API_HOST,
      API_PORT: process.env.API_PORT,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    }

    return productionEnvSchema.parse(rawEnv)
  } catch (error) {
    console.error('❌ Production environment validation failed:', error)
    throw new Error('Invalid production environment configuration')
  }
}

// Export validated configuration
export const productionConfig = parseProductionEnv()

// Configuration utilities for small teams
export const ProductionConfigUtils = {
  /**
   * Check if running in production
   */
  isProduction: () => productionConfig.NODE_ENV === 'production',
  
  /**
   * Get database configuration
   */
  getDatabaseConfig: () => ({
    url: productionConfig.DATABASE_URL,
    ssl: true, // Required for Supabase
    connectionLimit: 10, // Small team, low limit
  }),
  
  /**
   * Get authentication configuration
   */
  getAuthConfig: () => ({
    url: productionConfig.NEXTAUTH_URL,
    secret: productionConfig.NEXTAUTH_SECRET,
    maxAge: 24 * 60 * 60, // 24 hours
  }),
  
  /**
   * Get security configuration
   */
  getSecurityConfig: () => ({
    jwtSecret: productionConfig.JWT_SECRET,
    encryptionKey: productionConfig.ENCRYPTION_KEY,
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // 100 requests per window per IP
    },
  }),
  
  /**
   * Get logging configuration
   */
  getLoggingConfig: () => ({
    level: productionConfig.LOG_LEVEL,
    format: 'json', // Structured logging for production
  }),
  
  /**
   * Get API configuration
   */
  getApiConfig: () => ({
    host: productionConfig.API_HOST,
    port: productionConfig.API_PORT,
    cors: {
      origin: productionConfig.NEXT_PUBLIC_APP_URL,
      credentials: true,
    },
  }),
  
  /**
   * Get app configuration
   */
  getAppConfig: () => ({
    url: productionConfig.NEXT_PUBLIC_APP_URL,
    name: productionConfig.NEXT_PUBLIC_APP_NAME,
    version: '1.0.0',
  }),
  
  /**
   * Validate configuration for deployment
   */
  validateForDeployment: () => {
    const required = [
      'DATABASE_URL',
      'NEXTAUTH_URL',
      'NEXTAUTH_SECRET',
      'JWT_SECRET',
      'ENCRYPTION_KEY',
      'NEXT_PUBLIC_APP_URL',
    ]
    
    const missing = required.filter(key => !process.env[key])
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
    }
    
    return true
  },
  
  /**
   * Get cost-effective resource limits
   */
  getResourceLimits: () => ({
    maxUsers: 10,
    maxCases: 1000,
    maxStorage: '500MB',
    maxBandwidth: '100GB/month',
    maxRequests: '1000/hour',
  }),
}

// Export schema for validation
export { productionEnvSchema }








