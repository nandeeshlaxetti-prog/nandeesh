#!/usr/bin/env node

const { spawn } = require('child_process')
const path = require('path')

// Set environment variables
process.env.NODE_ENV = 'development'

// Wait a bit for the web server to start, then start Electron
setTimeout(() => {
  const electronProcess = spawn('pnpm', ['run', 'dev:main'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  })

  // Handle cleanup
  process.on('SIGINT', () => {
    electronProcess.kill()
    process.exit()
  })

  process.on('SIGTERM', () => {
    electronProcess.kill()
    process.exit()
  })
}, 3000) // Wait 3 seconds for Next.js to start
