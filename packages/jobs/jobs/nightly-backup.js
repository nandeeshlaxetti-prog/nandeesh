import { Job } from 'bree'
import { db } from 'data'
import { ConfigUtils } from 'core'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

/**
 * Nightly Backup Job - Runs at 23:30 IST
 * Creates database backup and exports data
 */
export default async function nightlyBackup(job: Job) {
  console.log(`[${new Date().toISOString()}] Starting nightly backup job...`)
  
  try {
    // Get configuration
    const config = ConfigUtils.getConfig()
    
    // Check if backup is enabled
    if (!config.APP_MODE || config.APP_MODE !== 'desktop') {
      console.log('Nightly backup skipped - not in desktop mode')
      return
    }

    const backupDir = path.join(config.DATA_DIR || process.cwd(), 'backups')
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0]
    const backupFileName = `backup-${timestamp}.db`
    const backupPath = path.join(backupDir, backupFileName)

    // Ensure backup directory exists
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }

    // Create database backup
    console.log('Creating database backup...')
    await createDatabaseBackup(backupPath)

    // Export case data
    console.log('Exporting case data...')
    const caseData = await exportCaseData()

    // Export user data
    console.log('Exporting user data...')
    const userData = await exportUserData()

    // Export audit logs
    console.log('Exporting audit logs...')
    const auditData = await exportAuditLogs()

    // Create comprehensive backup package
    const backupPackagePath = path.join(backupDir, `backup-package-${timestamp}.zip`)
    await createBackupPackage(backupPath, caseData, userData, auditData, backupPackagePath)

    // Clean up old backups (keep last 30 days)
    await cleanupOldBackups(backupDir)

    // Log backup results
    const backupSize = fs.statSync(backupPackagePath).size
    console.log(`Nightly backup completed: ${backupPackagePath} (${formatBytes(backupSize)})`)
    
    // Create audit log entry
    await db.auditLog.create({
      data: {
        action: 'BACKUP',
        entityType: 'SYSTEM',
        entityName: 'Nightly Backup Job',
        severity: 'MEDIUM',
        description: `Nightly backup completed: ${backupPackagePath} (${formatBytes(backupSize)})`,
        details: JSON.stringify({
          backupPath: backupPackagePath,
          backupSize,
          timestamp,
          casesExported: caseData.length,
          usersExported: userData.length,
          auditLogsExported: auditData.length,
        }),
        createdAt: new Date(),
      },
    })

  } catch (error) {
    console.error('Nightly backup job failed:', error)
    
    // Create error audit log
    await db.auditLog.create({
      data: {
        action: 'BACKUP',
        entityType: 'SYSTEM',
        entityName: 'Nightly Backup Job',
        severity: 'CRITICAL',
        description: `Nightly backup job failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        createdAt: new Date(),
      },
    })
    
    throw error
  }
}

/**
 * Create database backup using SQLite backup command
 */
async function createDatabaseBackup(backupPath: string): Promise<void> {
  try {
    // Get database path from environment
    const dbPath = process.env.DATABASE_URL?.replace('file:', '') || './dev.db'
    
    // Use SQLite backup command
    const command = `sqlite3 "${dbPath}" ".backup '${backupPath}'"`
    await execAsync(command)
    
    console.log(`Database backup created: ${backupPath}`)
  } catch (error) {
    console.error('Database backup failed:', error)
    throw error
  }
}

/**
 * Export case data to JSON
 */
async function exportCaseData(): Promise<any[]> {
  const cases = await db.case.findMany({
    include: {
      client: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      assignedLawyer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      team: {
        select: {
          id: true,
          name: true,
        },
      },
      parties: true,
      hearings: true,
      orders: true,
      tasks: true,
    },
  })

  return cases
}

/**
 * Export user data to JSON
 */
async function exportUserData(): Promise<any[]> {
  const users = await db.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      status: true,
      phone: true,
      joiningDate: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return users
}

/**
 * Export audit logs to JSON
 */
async function exportAuditLogs(): Promise<any[]> {
  const auditLogs = await db.auditLog.findMany({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return auditLogs
}

/**
 * Create backup package with all data
 */
async function createBackupPackage(
  dbBackupPath: string,
  caseData: any[],
  userData: any[],
  auditData: any[],
  packagePath: string
): Promise<void> {
  const tempDir = path.join(path.dirname(packagePath), 'temp-backup')
  
  try {
    // Create temporary directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true })
    }
    fs.mkdirSync(tempDir, { recursive: true })

    // Copy database backup
    fs.copyFileSync(dbBackupPath, path.join(tempDir, 'database.db'))

    // Write JSON exports
    fs.writeFileSync(
      path.join(tempDir, 'cases.json'),
      JSON.stringify(caseData, null, 2)
    )
    
    fs.writeFileSync(
      path.join(tempDir, 'users.json'),
      JSON.stringify(userData, null, 2)
    )
    
    fs.writeFileSync(
      path.join(tempDir, 'audit-logs.json'),
      JSON.stringify(auditData, null, 2)
    )

    // Create backup manifest
    const manifest = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      database: 'database.db',
      exports: {
        cases: 'cases.json',
        users: 'users.json',
        auditLogs: 'audit-logs.json',
      },
      statistics: {
        totalCases: caseData.length,
        totalUsers: userData.length,
        totalAuditLogs: auditData.length,
      },
    }

    fs.writeFileSync(
      path.join(tempDir, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    )

    // Create ZIP package (using PowerShell on Windows)
    const zipCommand = `powershell Compress-Archive -Path "${tempDir}\\*" -DestinationPath "${packagePath}" -Force`
    await execAsync(zipCommand)

    console.log(`Backup package created: ${packagePath}`)

  } finally {
    // Clean up temporary directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true })
    }
  }
}

/**
 * Clean up old backups (keep last 30 days)
 */
async function cleanupOldBackups(backupDir: string): Promise<void> {
  try {
    const files = fs.readdirSync(backupDir)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    for (const file of files) {
      const filePath = path.join(backupDir, file)
      const stats = fs.statSync(filePath)
      
      if (stats.isFile() && stats.mtime < thirtyDaysAgo) {
        fs.unlinkSync(filePath)
        console.log(`Deleted old backup: ${file}`)
      }
    }
  } catch (error) {
    console.error('Error cleaning up old backups:', error)
  }
}

/**
 * Format bytes to human readable format
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
