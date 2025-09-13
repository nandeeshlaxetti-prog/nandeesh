"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.envSchema = exports.ConfigUtils = exports.config = void 0;
const zod_1 = require("zod");
const path = __importStar(require("path"));
const os = __importStar(require("os"));
// Environment variable schema
const envSchema = zod_1.z.object({
    // Application mode
    APP_MODE: zod_1.z.enum(['desktop', 'web', 'server']).default('desktop'),
    // Desktop runtime
    DESKTOP_RUNTIME: zod_1.z.enum(['electron', 'tauri', 'neutralino']).default('electron'),
    // Queue backend
    QUEUE_BACKEND: zod_1.z.enum(['local', 'redis', 'sqs', 'bull']).default('local'),
    // Data directory
    DATA_DIR: zod_1.z.string().optional(),
    // Database URL
    DATABASE_URL: zod_1.z.string().optional(),
    // Node environment
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    // Log level
    LOG_LEVEL: zod_1.z.enum(['error', 'warn', 'info', 'debug']).default('info'),
    // API configuration
    API_PORT: zod_1.z.string().transform(Number).optional(),
    API_HOST: zod_1.z.string().default('localhost'),
    // Security
    JWT_SECRET: zod_1.z.string().optional(),
    ENCRYPTION_KEY: zod_1.z.string().optional(),
});
exports.envSchema = envSchema;
// Get default data directory based on OS
function getDefaultDataDir() {
    const platform = os.platform();
    const homeDir = os.homedir();
    switch (platform) {
        case 'win32':
            return path.join(homeDir, 'AppData', 'Roaming', 'LNN Legal Desktop');
        case 'darwin':
            return path.join(homeDir, 'Library', 'Application Support', 'LNN Legal Desktop');
        case 'linux':
            return path.join(homeDir, '.local', 'share', 'lnn-legal-desktop');
        default:
            return path.join(homeDir, '.lnn-legal-desktop');
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
    };
    try {
        const parsed = envSchema.parse(rawEnv);
        // Set default DATA_DIR if not provided
        if (!parsed.DATA_DIR) {
            parsed.DATA_DIR = getDefaultDataDir();
        }
        // Set default DATABASE_URL if not provided
        if (!parsed.DATABASE_URL) {
            parsed.DATABASE_URL = `file:${path.join(parsed.DATA_DIR, 'database.db')}`;
        }
        return parsed;
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            console.error('❌ Environment validation failed:');
            error.errors.forEach((err) => {
                console.error(`  - ${err.path.join('.')}: ${err.message}`);
            });
            process.exit(1);
        }
        throw error;
    }
}
// Export the validated configuration
exports.config = parseEnv();
// Configuration utilities
exports.ConfigUtils = {
    // Check if running in desktop mode
    isDesktop: () => exports.config.APP_MODE === 'desktop',
    // Check if running in web mode
    isWeb: () => exports.config.APP_MODE === 'web',
    // Check if running in server mode
    isServer: () => exports.config.APP_MODE === 'server',
    // Check if running in development
    isDevelopment: () => exports.config.NODE_ENV === 'development',
    // Check if running in production
    isProduction: () => exports.config.NODE_ENV === 'production',
    // Check if running in test
    isTest: () => exports.config.NODE_ENV === 'test',
    // Get data directory path
    getDataDir: () => exports.config.DATA_DIR,
    // Get database URL
    getDatabaseUrl: () => exports.config.DATABASE_URL,
    // Get API URL
    getApiUrl: () => {
        const port = exports.config.API_PORT ? `:${exports.config.API_PORT}` : '';
        return `http://${exports.config.API_HOST}${port}`;
    },
    // Validate data directory exists, create if not
    ensureDataDir: async () => {
        const fs = await Promise.resolve().then(() => __importStar(require('fs/promises')));
        try {
            await fs.access(exports.config.DATA_DIR);
        }
        catch {
            await fs.mkdir(exports.config.DATA_DIR, { recursive: true });
            console.log(`📁 Created data directory: ${exports.config.DATA_DIR}`);
        }
    },
    // Get configuration summary (safe for logging)
    getSummary: () => ({
        appMode: exports.config.APP_MODE,
        desktopRuntime: exports.config.DESKTOP_RUNTIME,
        queueBackend: exports.config.QUEUE_BACKEND,
        nodeEnv: exports.config.NODE_ENV,
        logLevel: exports.config.LOG_LEVEL,
        dataDir: exports.config.DATA_DIR,
        apiHost: exports.config.API_HOST,
        apiPort: exports.config.API_PORT,
        hasJwtSecret: !!exports.config.JWT_SECRET,
        hasEncryptionKey: !!exports.config.ENCRYPTION_KEY,
    }),
};
// Log configuration on startup (in development)
if (exports.config.NODE_ENV === 'development') {
    console.log('🔧 Configuration loaded:');
    console.log(JSON.stringify(exports.ConfigUtils.getSummary(), null, 2));
}
