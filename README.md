# LNN Legal Desktop Application

A comprehensive legal practice management desktop application built with Next.js, Electron, and TypeScript.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **pnpm** (v8.0.0 or higher) - [Install pnpm](https://pnpm.io/installation)
- **Git** - [Install Git](https://git-scm.com/download/win)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lnn-legal-desktop
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up the database**
   ```bash
   # Generate Prisma client
   pnpm --filter data db:generate
   
   # Run database migrations
   pnpm migrate
   
   # Seed the database with sample data
   pnpm seed
   ```

4. **Start development**
   ```bash
   # Start web app only (recommended for development)
   pnpm dev:web
   
   # Or start both web and desktop concurrently (may have issues)
   pnpm dev
   ```

### ⚠️ Current Status

**Working Scripts:**
- ✅ `pnpm migrate` - Database migrations
- ✅ `pnpm seed` - Database seeding
- ✅ `pnpm dev:web` - Next.js development server
- ✅ `pnpm dev:desktop` - Electron development (with manual setup)
- ✅ `pnpm build:ui` - Next.js production build
- ✅ `pnpm test:e2e` - End-to-end tests with Playwright

**Scripts with Issues:**
- ⚠️ `pnpm dev` - Concurrent execution (Electron has path issues)
- ⚠️ `pnpm build:desktop` - Depends on UI build

**Recommended Development Workflow:**
1. Use `pnpm dev:web` for web development
2. Use `pnpm dev:desktop` separately for Electron development
3. Database operations work perfectly with `pnpm migrate` and `pnpm seed`

## 📋 Available Scripts

### Development
- **`pnpm dev`** - Run Next.js dev server (:3000) + Electron dev concurrently
- **`pnpm dev:web`** - Run only Next.js dev server
- **`pnpm dev:desktop`** - Run only Electron dev

### Building
- **`pnpm build:ui`** - Build Next.js application
- **`pnpm build:desktop`** - Build Electron application (EXE + MSI)
- **`pnpm build`** - Build all packages

### Database
- **`pnpm migrate`** - Run Prisma migrations
- **`pnpm seed`** - Seed database with sample data

### Testing
- **`pnpm test:e2e`** - Run end-to-end tests with Playwright
- **`pnpm test:e2e:ui`** - Run E2E tests with interactive UI
- **`pnpm test:e2e:headed`** - Run E2E tests with visible browser
- **`pnpm test:e2e:debug`** - Run E2E tests in debug mode
- **`pnpm test:e2e:report`** - Show E2E test report
- **`pnpm test:e2e:install`** - Install Playwright browsers

### Utilities
- **`pnpm clean`** - Clean all build artifacts
- **`pnpm lint`** - Run ESLint on all packages
- **`pnpm type-check`** - Run TypeScript type checking
- **`pnpm test`** - Run tests across all packages

## 🧪 End-to-End Testing

The project includes comprehensive E2E tests using Playwright that cover:

### Test Coverage
- ✅ **App Launch**: Dashboard display and system status
- ✅ **Case Management**: Add case by CNR, case details, search
- ✅ **Task Management**: Kanban board, work logging, automation
- ✅ **Automation Rules**: Hearing prep tasks, order processing, notifications
- ✅ **Integration**: Mock eCourts and KHC provider testing
- ✅ **Backup/Restore**: Export backup, verify ZIP contents, restore functionality
- ✅ **Electron Integration**: IPC communication, native notifications
- ✅ **Performance**: Load times, navigation speed, responsiveness
- ✅ **Accessibility**: Keyboard navigation, ARIA labels, screen reader support

### Running E2E Tests

```bash
# Install Playwright browsers (first time only)
pnpm test:e2e:install

# Run all E2E tests
pnpm test:e2e

# Run with interactive UI
pnpm test:e2e:ui

# Run with visible browser
pnpm test:e2e:headed

# Debug mode
pnpm test:e2e:debug

# View test report
pnpm test:e2e:report
```

### Test Structure
```
tests/e2e/
├── README.md                    # E2E testing documentation
├── test-config.ts              # Test configuration and mock data
├── helpers/
│   └── test-helpers.ts         # Test utility functions
├── legal-desktop-e2e.spec.ts   # Main E2E tests
├── electron-integration.spec.ts # Electron-specific tests
└── comprehensive-e2e.spec.ts   # Comprehensive test suite
```

## 🏗️ Project Structure

```
lnn-legal-desktop/
├── apps/
│   ├── web/                 # Next.js web application
│   └── desktop/             # Electron desktop application
├── tests/
│   └── e2e/                 # End-to-end tests with Playwright
├── packages/
│   ├── core/                # Shared types and utilities
│   ├── data/                # Prisma ORM and repositories
│   └── jobs/                # Background job scheduling
├── package.json             # Root package configuration
└── README.md               # This file
```

## 🛠️ Windows Setup Guide

### Step 1: Install Prerequisites

#### Install Node.js
1. Download Node.js from [nodejs.org](https://nodejs.org/)
2. Choose the LTS version (v18 or higher)
3. Run the installer with default settings
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

#### Install pnpm
1. Open PowerShell as Administrator
2. Install pnpm globally:
   ```bash
   npm install -g pnpm
   ```
3. Verify installation:
   ```bash
   pnpm --version
   ```

#### Install Git
1. Download Git from [git-scm.com](https://git-scm.com/download/win)
2. Run the installer with default settings
3. Verify installation:
   ```bash
   git --version
   ```

### Step 2: Clone and Setup

#### Clone the Repository
```bash
# Open Command Prompt or PowerShell
git clone <repository-url>
cd lnn-legal-desktop
```

#### Install Dependencies
```bash
# Install all dependencies
pnpm install

# This will install dependencies for:
# - Root workspace
# - Web application (Next.js)
# - Desktop application (Electron)
# - Core package (shared types)
# - Data package (Prisma)
# - Jobs package (scheduling)
```

### Step 3: Database Setup

#### Generate Prisma Client
```bash
pnpm --filter data db:generate
```

#### Run Migrations
```bash
# Create and apply database migrations
pnpm migrate
```

#### Seed Database
```bash
# Add sample data to the database
pnpm seed
```

### Step 4: Development

#### Start Development Server
```bash
# This will start both Next.js and Electron concurrently
pnpm dev
```

#### Alternative: Start Components Separately
```bash
# Terminal 1: Start Next.js dev server
pnpm dev:web

# Terminal 2: Start Electron dev
pnpm dev:desktop
```

### Step 5: Building for Production

#### Build Web UI
```bash
pnpm build:ui
```

#### Build Desktop Application
```bash
# This creates EXE and MSI installers
pnpm build:desktop
```

The built files will be in `apps/desktop/release/`:
- `LNN Legal Desktop Setup.exe` - NSIS installer
- `LNN Legal Desktop.msi` - MSI installer

## 🔧 Configuration

### Environment Variables

Create `.env.local` in the `apps/web` directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# Application
APP_MODE=desktop
DESKTOP_RUNTIME=electron
QUEUE_BACKEND=local

# Data Directory (Windows)
DATA_DIR=%APPDATA%/LNNLegal

# Notifications
NOTIFICATIONS_ENABLED=true
NOTIFICATIONS_HEARING_DATE=true
NOTIFICATIONS_SLA_BREACH=true
NOTIFICATIONS_REVIEW_REQUESTED=true
NOTIFICATIONS_DAILY_DIGEST=true
NOTIFICATIONS_SOUND=true
NOTIFICATIONS_SHOW_IN_TASKBAR=true
```

### Database Configuration

The application uses SQLite for development. Database file location:
- **Windows**: `%APPDATA%/LNNLegal/data/dev.db`
- **Development**: `packages/data/prisma/dev.db`

## 🎯 Features

### Core Features
- **Case Management**: Comprehensive case tracking and management
- **Task Management**: Kanban-style task board with categories
- **Hearing Management**: Court hearing scheduling and tracking
- **Document Management**: File upload, storage, and PDF viewer
- **Time Tracking**: Billable hours and worklog management
- **Leave Management**: Employee leave requests and approvals

### Automation Features
- **SLA Monitoring**: Automatic SLA breach detection and notifications
- **Task Automation**: Automated task creation based on events
- **Daily Digest**: Daily summary notifications at 07:30 IST
- **Background Jobs**: Automated sync, backup, and maintenance tasks

### Integration Features
- **eCourts Integration**: Court data synchronization
- **Karnataka High Court**: Specialized court integration
- **Manual Import**: Browser-based manual data import
- **Backup & Restore**: Complete data backup and restore system

### Notification System
- **Desktop Notifications**: Native Windows notifications
- **Hearing Notifications**: New hearing date alerts
- **SLA Breach Alerts**: Critical deadline notifications
- **Review Requests**: Task review notifications
- **Daily Digest**: Daily summary notifications
- **Configurable Settings**: User-controllable notification preferences

## 🚨 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# If port 3000 is already in use
# Kill the process using the port
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

#### Database Connection Issues
```bash
# Reset the database
rm packages/data/prisma/dev.db
pnpm migrate
pnpm seed
```

#### Build Issues
```bash
# Clean and rebuild
pnpm clean
pnpm install
pnpm build
```

#### Electron Build Issues
```bash
# Clear Electron cache
rm -rf apps/desktop/dist
rm -rf apps/desktop/release
pnpm build:desktop
```

### Windows-Specific Issues

#### PowerShell Execution Policy
If you get execution policy errors:
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Long Path Issues
If you encounter long path issues:
1. Open Group Policy Editor (`gpedit.msc`)
2. Navigate to: Computer Configuration > Administrative Templates > System > Filesystem
3. Enable "Enable Win32 long paths"

#### Antivirus Interference
Some antivirus software may interfere with the build process:
1. Add the project folder to antivirus exclusions
2. Temporarily disable real-time protection during builds

## 📚 Development

### Adding New Features

1. **Create feature branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make changes**
   - Update relevant packages
   - Add tests if applicable
   - Update documentation

3. **Test changes**
   ```bash
   pnpm type-check
   pnpm lint
   pnpm test
   ```

4. **Build and test**
   ```bash
   pnpm build
   pnpm dev
   ```

### Code Style

The project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Husky** for git hooks

### Git Hooks

Pre-commit hooks automatically:
- Run ESLint and fix issues
- Format code with Prettier
- Run type checking

## 📞 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the project documentation
3. Create an issue in the repository

## 📄 License

This project is proprietary software. All rights reserved.

---

**Happy Coding! 🚀**