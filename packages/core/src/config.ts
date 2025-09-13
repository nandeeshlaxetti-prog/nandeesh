import { z } from 'zod'
import * as path from 'path'
import * as os from 'os'

// Environment variable schema
const envSchema = z.object({
  // Application mode
  APP_MODE: z.enum(['desktop', 'web', 'server']).default('desktop'),
  
  // Desktop runtime
  DESKTOP_RUNTIME: z.enum(['electron', 'tauri', 'neutralino']).default('electron'),
  
  // Queue backend
  QUEUE_BACKEND: z.enum(['local', 'redis', 'sqs', 'bull']).default('local'),
  
  // Data directory
  DATA_DIR: z.string().optional(),
  
  // Database URL
  DATABASE_URL: z.string().optional(),
  
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Log level
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  
  // API configuration
  API_PORT: z.string().transform(Number).optional(),
  API_HOST: z.string().default('localhost'),
  
  // Security
  JWT_SECRET: z.string().optional(),
  ENCRYPTION_KEY: z.string().optional(),
})

// Get default data directory based on OS
function getDefaultDataDir(): string {
  const platform = os.platform()
  const homeDir = os.homedir()
  
  switch (platform) {
    case 'win32':
      return path.join(homeDir, 'AppData', 'Roaming', 'LNN Legal Desktop')
    case 'darwin':
      return path.join(homeDir, 'Library', 'Application Support', 'LNN Legal Desktop')
    case 'linux':
      return path.join(homeDir, '.local', 'share', 'lnn-legal-desktop')
    default:
      return path.join(homeDir, '.lnn-legal-desktop')
  }
}

// Parse and validate environment variables
function parseEnv() {
  const rawEnv = {
    APP_MODE: process.env.APP_MODE,
    DESKTOP_RUNTIME: process.env.DESKTOP_RUNTIME,
    QUEUE_BACKEND: process.env.QUEUE_BACKEND,
    DATA_DIR: process.env.DATA_DIR,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    LOG_LEVEL: process.env.LOG_LEVEL,
    API_PORT: process.env.API_PORT,
    API_HOST: process.env.API_HOST,
    JWT_SECRET: process.env.JWT_SECRET,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  }

  try {
    const parsed = envSchema.parse(rawEnv)
    
    // Set default DATA_DIR if not provided
    if (!parsed.DATA_DIR) {
      parsed.DATA_DIR = getDefaultDataDir()
    }
    
    // Set default DATABASE_URL if not provided
    if (!parsed.DATABASE_URL) {
      parsed.DATABASE_URL = `file:${path.join(parsed.DATA_DIR, 'database.db')}`
    }
    
    return parsed
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:')
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`)
      })
      process.exit(1)
    }
    throw error
  }
}

// Export the validated configuration
export const config = parseEnv()

// Export types
export type AppMode = z.infer<typeof envSchema>['APP_MODE']
export type DesktopRuntime = z.infer<typeof envSchema>['DESKTOP_RUNTIME']
export type QueueBackend = z.infer<typeof envSchema>['QUEUE_BACKEND']
export type NodeEnv = z.infer<typeof envSchema>['NODE_ENV']
export type LogLevel = z.infer<typeof envSchema>['LOG_LEVEL']

// Configuration utilities
export const ConfigUtils = {
  // Check if running in desktop mode
  isDesktop: () => config.APP_MODE === 'desktop',
  
  // Check if running in web mode
  isWeb: () => config.APP_MODE === 'web',
  
  // Check if running in server mode
  isServer: () => config.APP_MODE === 'server',
  
  // Check if running in development
  isDevelopment: () => config.NODE_ENV === 'development',
  
  // Check if running in production
  isProduction: () => config.NODE_ENV === 'production',
  
  // Check if running in test
  isTest: () => config.NODE_ENV === 'test',
  
  // Get data directory path
  getDataDir: () => config.DATA_DIR!,
  
  // Get database URL
  getDatabaseUrl: () => config.DATABASE_URL!,
  
  // Get API URL
  getApiUrl: () => {
    const port = config.API_PORT ? `:${config.API_PORT}` : ''
    return `http://${config.API_HOST}${port}`
  },
  
  // Validate data directory exists, create if not
  ensureDataDir: async () => {
    const fs = await import('fs/promises')
    try {
      await fs.access(config.DATA_DIR!)
    } catch {
      await fs.mkdir(config.DATA_DIR!, { recursive: true })
      console.log(`📁 Created data directory: ${config.DATA_DIR}`)
    }
  },
  
  // Get configuration summary (safe for logging)
  getSummary: () => ({
    appMode: config.APP_MODE,
    desktopRuntime: config.DESKTOP_RUNTIME,
    queueBackend: config.QUEUE_BACKEND,
    nodeEnv: config.NODE_ENV,
    logLevel: config.LOG_LEVEL,
    dataDir: config.DATA_DIR,
    apiHost: config.API_HOST,
    apiPort: config.API_PORT,
    hasJwtSecret: !!config.JWT_SECRET,
    hasEncryptionKey: !!config.ENCRYPTION_KEY,
  }),
}

// Export schema for external validation
export { envSchema }

// Log configuration on startup (in development)
if (config.NODE_ENV === 'development') {
  console.log('🔧 Configuration loaded:')
  console.log(JSON.stringify(ConfigUtils.getSummary(), null, 2))
}
