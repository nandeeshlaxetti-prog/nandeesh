# Configuration System

The LNN Legal Desktop application uses a centralized configuration system with Zod validation for environment variables.

## Features

- ✅ **Zod Validation**: Type-safe environment variable parsing
- ✅ **OS-specific Defaults**: Automatic data directory detection
- ✅ **Multiple Environments**: Support for desktop, web, and server modes
- ✅ **Queue Backend Options**: Local, Redis, SQS, Bull support
- ✅ **Security**: Sensitive values are masked in logs
- ✅ **Auto-creation**: Data directories are created automatically

## Environment Variables

### Required Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `APP_MODE` | enum | `desktop` | Application mode: `desktop`, `web`, `server` |
| `DESKTOP_RUNTIME` | enum | `electron` | Desktop runtime: `electron`, `tauri`, `neutralino` |
| `QUEUE_BACKEND` | enum | `local` | Queue backend: `local`, `redis`, `sqs`, `bull` |

### Optional Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `DATA_DIR` | string | OS-specific | Data directory path |
| `DATABASE_URL` | string | Auto-generated | Database connection string |
| `NODE_ENV` | enum | `development` | Environment: `development`, `production`, `test` |
| `LOG_LEVEL` | enum | `info` | Log level: `error`, `warn`, `info`, `debug` |
| `API_HOST` | string | `localhost` | API server host |
| `API_PORT` | number | - | API server port |
| `JWT_SECRET` | string | - | JWT signing secret |
| `ENCRYPTION_KEY` | string | - | Data encryption key |

## Data Directory Defaults

The `DATA_DIR` defaults to OS-specific application data directories:

- **Windows**: `%APPDATA%\LNN Legal Desktop`
- **macOS**: `~/Library/Application Support/LNN Legal Desktop`
- **Linux**: `~/.local/share/lnn-legal-desktop`

## Usage

### Basic Import

```typescript
import { config, ConfigUtils } from '@core'

// Access configuration values
console.log('App mode:', config.APP_MODE)
console.log('Data directory:', config.DATA_DIR)
console.log('Database URL:', config.DATABASE_URL)
```

### Utility Functions

```typescript
// Environment checks
if (ConfigUtils.isDesktop()) {
  console.log('Running in desktop mode')
}

if (ConfigUtils.isDevelopment()) {
  console.log('Development mode enabled')
}

// Path utilities
const dataDir = ConfigUtils.getDataDir()
const apiUrl = ConfigUtils.getApiUrl()

// Ensure data directory exists
await ConfigUtils.ensureDataDir()
```

### Configuration Summary

```typescript
// Get safe configuration summary for logging
const summary = ConfigUtils.getSummary()
console.log('Configuration:', summary)
```

## Environment Files

### Root Level
- `env.example` - Main configuration template

### Package Specific
- `apps/desktop/env.example` - Desktop app configuration
- `apps/web/env.example` - Web app configuration

## Configuration Examples

### Desktop Development
```bash
APP_MODE=desktop
DESKTOP_RUNTIME=electron
QUEUE_BACKEND=local
NODE_ENV=development
LOG_LEVEL=debug
API_HOST=localhost
API_PORT=3000
```

### Web Production
```bash
APP_MODE=web
QUEUE_BACKEND=redis
NODE_ENV=production
LOG_LEVEL=info
API_HOST=0.0.0.0
API_PORT=3000
JWT_SECRET=your-secret-key
ENCRYPTION_KEY=your-encryption-key
```

### Server with Redis
```bash
APP_MODE=server
QUEUE_BACKEND=redis
NODE_ENV=production
LOG_LEVEL=info
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Validation

The configuration system validates all environment variables on startup:

```typescript
// Invalid values will cause the application to exit
APP_MODE=invalid_mode  // ❌ Error: Invalid enum value
QUEUE_BACKEND=unknown  // ❌ Error: Invalid enum value
LOG_LEVEL=verbose      // ❌ Error: Invalid enum value
```

## Integration

### Database Package
```typescript
// packages/data/src/database.ts
import { ConfigUtils } from '@core'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: ConfigUtils.getDatabaseUrl(),
    },
  },
})
```

### Jobs Package
```typescript
// packages/jobs/src/scheduler.ts
import { config } from '@core'

if (config.QUEUE_BACKEND === 'redis') {
  // Configure Redis connection
}
```

### Desktop App
```typescript
// apps/desktop/src/main.ts
import { ConfigUtils } from '@core'

const apiUrl = ConfigUtils.getApiUrl()
mainWindow.loadURL(apiUrl)
```

## Security

- Sensitive values (`JWT_SECRET`, `ENCRYPTION_KEY`) are masked in logs
- Configuration summary excludes sensitive data
- Environment variables are validated before use
- Invalid configurations cause immediate exit

## Error Handling

```typescript
// Configuration errors are logged and cause exit
❌ Environment validation failed:
  - APP_MODE: Invalid enum value. Expected 'desktop' | 'web' | 'server', received 'invalid'
  - QUEUE_BACKEND: Invalid enum value. Expected 'local' | 'redis' | 'sqs' | 'bull', received 'unknown'
```

## Development Tips

1. **Copy Environment Files**: Copy `env.example` to `.env` and customize
2. **Use TypeScript**: Get full type safety with imported types
3. **Check Logs**: Configuration summary is logged in development
4. **Validate Early**: Configuration is validated on application startup
5. **OS Compatibility**: Data directory defaults work across platforms

## Troubleshooting

### Common Issues

1. **Missing Environment File**
   ```bash
   # Copy the example file
   cp env.example .env
   ```

2. **Invalid Configuration**
   ```bash
   # Check the validation errors in console
   # Fix the invalid values in .env
   ```

3. **Permission Errors**
   ```bash
   # Ensure data directory is writable
   chmod 755 ~/.local/share/lnn-legal-desktop
   ```

4. **Port Conflicts**
   ```bash
   # Change API_PORT in .env
   API_PORT=3001
   ```
