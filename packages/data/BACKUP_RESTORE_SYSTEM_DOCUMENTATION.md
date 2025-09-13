# Backup & Restore System Documentation

This document provides comprehensive documentation for the Backup & Restore System, including ZIP export/import functionality, job management, and UI integration with success/error toasts.

## Overview

The Backup & Restore System provides:
- **ZIP Export/Import**: Complete database and file backup in ZIP format
- **Job Management**: Automatic job stopping/restarting during restore
- **Integrity Verification**: Checksum validation and restore verification
- **UI Integration**: Settings page with backup management
- **Toast Notifications**: Success/error feedback for all operations
- **Compression Options**: Configurable compression levels
- **Selective Backup**: Choose what to include (database, files, metadata)
- **Statistics**: Comprehensive backup analytics

## System Architecture

### Core Components

#### **Backup Service**
- **ZIP Creation**: Creates compressed backup archives
- **Database Export**: Exports SQLite database
- **File Export**: Exports content-addressed files
- **Metadata Export**: Exports backup metadata JSON
- **Integrity Verification**: Checksum validation
- **Restore Process**: Complete restore with verification

#### **IPC Handlers**
- **backup:exportNow**: Export backup with options
- **backup:restoreFromZip**: Restore from ZIP file
- **backup:listBackups**: List available backups
- **backup:deleteBackup**: Delete backup file
- **backup:getStatistics**: Get backup statistics

#### **UI Components**
- **BackupSettings**: Complete backup management interface
- **Toast Notifications**: Success/error feedback
- **File Selection**: Backup file selection for restore
- **Progress Indicators**: Export/restore progress
- **Statistics Display**: Backup analytics dashboard

### Data Flow

1. **Backup Export** → User initiates export
2. **Options Selection** → Choose what to include
3. **Temporary Directory** → Create temp workspace
4. **Database Export** → Export SQLite database
5. **File Export** → Export content-addressed files
6. **Metadata Export** → Export backup metadata
7. **ZIP Creation** → Compress all data
8. **Checksum Calculation** → Calculate file integrity
9. **Cleanup** → Remove temporary files
10. **Response** → Return backup result

## Backup Export Process

### Export Options

```typescript
interface ExportOptions {
  includeFiles?: boolean      // Include content-addressed files
  includeDatabase?: boolean   // Include SQLite database
  includeMetadata?: boolean   // Include backup metadata
  compressionLevel?: number   // Compression level (1-9)
}
```

### Export Process

1. **Create Temporary Directory**
   ```typescript
   const tempDir = path.join(this.config.backupDir, `temp-${backupId}`)
   await fs.mkdir(tempDir, { recursive: true })
   ```

2. **Export Database**
   ```typescript
   const dbPath = path.join(this.config.dataDir, 'database.sqlite')
   const exportPath = path.join(tempDir, 'database.sqlite')
   await fs.copyFile(dbPath, exportPath)
   ```

3. **Export Files**
   ```typescript
   const filesDir = path.join(this.config.dataDir, 'files')
   const exportFilesDir = path.join(tempDir, 'files')
   await this.copyDirectory(filesDir, exportFilesDir)
   ```

4. **Export Metadata**
   ```typescript
   const metadata = await this.getBackupMetadata()
   const metadataPath = path.join(tempDir, 'backup-metadata.json')
   await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2))
   ```

5. **Create ZIP File**
   ```typescript
   await this.createZipFile(tempDir, backupFilePath, compressionLevel)
   ```

6. **Calculate Checksum**
   ```typescript
   const checksum = await this.calculateFileChecksum(backupFilePath)
   ```

### Backup Metadata

```typescript
interface BackupMetadata {
  version: string
  createdAt: Date
  appVersion: string
  databaseVersion: string
  fileCount: number
  totalFileSize: number
  userCount: number
  caseCount: number
  taskCount: number
  hearingCount: number
  orderCount: number
  checksum: string
  compressionLevel: number
  includeFiles: boolean
  includeDatabase: boolean
  includeMetadata: boolean
}
```

## Restore Process

### Restore Steps

1. **Verify ZIP File**
   ```typescript
   const isValidZip = await this.verifyZipFile(zipFilePath)
   if (!isValidZip) {
     throw new Error('Invalid or corrupted backup file')
   }
   ```

2. **Extract ZIP File**
   ```typescript
   const tempDir = path.join(this.config.backupDir, `restore-${restoreId}`)
   await this.extractZipFile(zipFilePath, tempDir)
   ```

3. **Read Backup Metadata**
   ```typescript
   const metadata = await this.readBackupMetadata(tempDir)
   ```

4. **Stop Background Jobs**
   ```typescript
   await this.stopBackgroundJobs()
   ```

5. **Restore Database**
   ```typescript
   if (metadata.includeDatabase) {
     await this.restoreDatabase(tempDir)
   }
   ```

6. **Restore Files**
   ```typescript
   if (metadata.includeFiles) {
     await this.restoreFiles(tempDir)
   }
   ```

7. **Restore Metadata**
   ```typescript
   if (metadata.includeMetadata) {
     await this.restoreMetadata(tempDir)
   }
   ```

8. **Verify Integrity**
   ```typescript
   const integrityCheck = await this.verifyRestoreIntegrity(tempDir, metadata)
   ```

9. **Restart Background Jobs**
   ```typescript
   await this.restartBackgroundJobs()
   ```

### Job Management

#### **Stop Background Jobs**
```typescript
private async stopBackgroundJobs(): Promise<void> {
  try {
    const { stopSchedulers } = await import('jobs')
    await stopSchedulers()
    console.log('✅ Background jobs stopped')
  } catch (error) {
    console.error('Error stopping background jobs:', error)
  }
}
```

#### **Restart Background Jobs**
```typescript
private async restartBackgroundJobs(): Promise<void> {
  try {
    const { bootSchedulers } = await import('jobs')
    await bootSchedulers()
    console.log('✅ Background jobs restarted')
  } catch (error) {
    console.error('Error restarting background jobs:', error)
  }
}
```

## IPC Handlers

### Desktop App IPC Handlers

#### **backup:exportNow**
```typescript
ipcMain.handle('backup:exportNow', async (event, exportParams) => {
  try {
    const { backupService } = await import('data')
    
    const result = await backupService.exportNow({
      includeFiles: exportParams.includeFiles !== false,
      includeDatabase: exportParams.includeDatabase !== false,
      includeMetadata: exportParams.includeMetadata !== false,
      compressionLevel: exportParams.compressionLevel || 6
    })
    
    return {
      success: true,
      backupId: result.backupId,
      filePath: result.filePath,
      size: result.size,
      createdAt: result.createdAt,
      checksum: result.checksum,
      metadata: result.metadata,
      message: 'Backup exported successfully'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to export backup'
    }
  }
})
```

#### **backup:restoreFromZip**
```typescript
ipcMain.handle('backup:restoreFromZip', async (event, restoreParams) => {
  try {
    const { backupService } = await import('data')
    
    const result = await backupService.restoreFromZip(restoreParams.filePath)
    
    return {
      success: result.success,
      restoreId: result.restoreId,
      restoredAt: result.restoredAt,
      metadata: result.metadata,
      errors: result.errors,
      message: result.success ? 'Backup restored successfully' : 'Backup restore completed with errors'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to restore backup'
    }
  }
})
```

#### **backup:listBackups**
```typescript
ipcMain.handle('backup:listBackups', async (event) => {
  try {
    const { backupService } = await import('data')
    
    const backups = await backupService.listBackups()
    
    return {
      success: true,
      backups: backups.map(backup => ({
        fileName: backup.fileName,
        filePath: backup.filePath,
        size: backup.size,
        createdAt: backup.createdAt,
        checksum: backup.checksum
      })),
      message: 'Backups listed successfully'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to list backups'
    }
  }
})
```

## UI Components

### Toast Notifications

#### **Toast Provider**
```typescript
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const showToast = (toast: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: ToastProps = {
      ...toast,
      id,
      duration: toast.duration || 5000
    }

    setToasts(prev => [...prev, newToast])

    if (newToast.duration > 0) {
      setTimeout(() => {
        hideToast(id)
      }, newToast.duration)
    }
  }

  return (
    <ToastContext.Provider value={{ showToast, hideToast, clearAllToasts }}>
      {children}
      <ToastContainer toasts={toasts} onHideToast={hideToast} />
    </ToastContext.Provider>
  )
}
```

#### **Toast Usage**
```typescript
const { showToast } = useToast()

// Success toast
showToast({
  type: 'success',
  title: 'Backup exported successfully',
  message: `Backup created: ${backupId} (${formatFileSize(size)})`
})

// Error toast
showToast({
  type: 'error',
  title: 'Backup export failed',
  message: error.message
})

// Warning toast
showToast({
  type: 'warning',
  title: 'No file selected',
  message: 'Please select a backup file to restore'
})
```

### Backup Settings Component

#### **Export Backup**
```typescript
const handleExportBackup = async () => {
  try {
    setIsExporting(true)
    
    const result = await window.app.invoke('backup:exportNow', exportOptions)
    
    if (result.success) {
      showToast({
        type: 'success',
        title: 'Backup exported successfully',
        message: `Backup created: ${result.backupId} (${formatFileSize(result.size)})`
      })
      
      await loadBackups()
      await loadStatistics()
    } else {
      showToast({
        type: 'error',
        title: 'Backup export failed',
        message: result.error || 'Unknown error occurred'
      })
    }
  } catch (error) {
    showToast({
      type: 'error',
      title: 'Backup export error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    })
  } finally {
    setIsExporting(false)
  }
}
```

#### **Restore Backup**
```typescript
const handleRestoreBackup = async () => {
  if (!selectedFile) {
    showToast({
      type: 'warning',
      title: 'No file selected',
      message: 'Please select a backup file to restore'
    })
    return
  }

  try {
    setIsRestoring(true)
    
    const result = await window.app.invoke('backup:restoreFromZip', {
      filePath: selectedFile.path
    })
    
    if (result.success) {
      showToast({
        type: 'success',
        title: 'Backup restored successfully',
        message: `Restored ${result.metadata.fileCount} files and ${result.metadata.caseCount} cases`
      })
      
      await loadStatistics()
    } else {
      showToast({
        type: 'error',
        title: 'Backup restore failed',
        message: result.error || 'Unknown error occurred'
      })
    }
  } catch (error) {
    showToast({
      type: 'error',
      title: 'Backup restore error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    })
  } finally {
    setIsRestoring(false)
  }
}
```

## Usage Examples

### Basic Backup Export

```typescript
// Export backup with default options
const result = await window.app.invoke('backup:exportNow')

if (result.success) {
  console.log('Backup exported:', result.backupId)
  console.log('File path:', result.filePath)
  console.log('Size:', result.size)
  console.log('Checksum:', result.checksum)
}
```

### Custom Backup Export

```typescript
// Export backup with custom options
const result = await window.app.invoke('backup:exportNow', {
  includeFiles: true,
  includeDatabase: true,
  includeMetadata: true,
  compressionLevel: 9
})

if (result.success) {
  console.log('Backup exported with high compression')
}
```

### Backup Restore

```typescript
// Restore from backup file
const result = await window.app.invoke('backup:restoreFromZip', {
  filePath: '/path/to/backup.zip'
})

if (result.success) {
  console.log('Backup restored successfully')
  console.log('Restored files:', result.metadata.fileCount)
  console.log('Restored cases:', result.metadata.caseCount)
} else {
  console.error('Restore failed:', result.errors)
}
```

### List Backups

```typescript
// List available backups
const result = await window.app.invoke('backup:listBackups')

if (result.success) {
  result.backups.forEach(backup => {
    console.log('Backup:', backup.fileName)
    console.log('Size:', backup.size)
    console.log('Created:', backup.createdAt)
    console.log('Checksum:', backup.checksum)
  })
}
```

### Delete Backup

```typescript
// Delete backup file
const result = await window.app.invoke('backup:deleteBackup', {
  fileName: 'backup-2024-01-01.zip'
})

if (result.success) {
  console.log('Backup deleted successfully')
}
```

### Get Statistics

```typescript
// Get backup statistics
const result = await window.app.invoke('backup:getStatistics')

if (result.success) {
  const stats = result.statistics
  console.log('Total backups:', stats.totalBackups)
  console.log('Total size:', stats.totalSize)
  console.log('Average size:', stats.averageSize)
  console.log('Oldest backup:', stats.oldestBackup)
  console.log('Newest backup:', stats.newestBackup)
}
```

## Security Considerations

### File Validation

- **ZIP Integrity**: ZIP file integrity verification
- **Checksum Validation**: SHA-256 checksum validation
- **Path Validation**: Secure file path handling
- **Size Limits**: Maximum backup size enforcement

### Access Control

- **File Permissions**: Secure file permissions
- **Directory Isolation**: Isolated backup directories
- **Temporary Files**: Secure temporary file handling
- **Cleanup**: Automatic cleanup of temporary files

### Data Protection

- **Backup Encryption**: Optional backup encryption
- **Secure Storage**: Secure backup storage
- **Access Logging**: Backup access logging
- **Integrity Monitoring**: Continuous integrity monitoring

## Performance Considerations

### Compression

- **Configurable Levels**: Compression levels 1-9
- **Size Optimization**: Optimized backup sizes
- **Speed vs Size**: Balance between speed and size
- **Multiple Algorithms**: Support for different compression algorithms

### Storage Management

- **Automatic Cleanup**: Automatic cleanup of old backups
- **Size Monitoring**: Backup size monitoring
- **Space Management**: Efficient space management
- **Archive Rotation**: Automatic archive rotation

### Processing Optimization

- **Parallel Processing**: Parallel file processing
- **Streaming**: Streaming for large files
- **Memory Management**: Efficient memory usage
- **Progress Tracking**: Real-time progress tracking

## Error Handling

### Backup Errors

- **File System Errors**: Handle file system errors
- **Permission Errors**: Handle permission errors
- **Space Errors**: Handle insufficient space errors
- **Corruption Errors**: Handle file corruption errors

### Restore Errors

- **Integrity Errors**: Handle integrity check failures
- **Missing Files**: Handle missing backup files
- **Corrupted Backups**: Handle corrupted backup files
- **Partial Restores**: Handle partial restore failures

### UI Errors

- **Network Errors**: Handle network connectivity issues
- **Timeout Errors**: Handle operation timeouts
- **User Errors**: Handle user input errors
- **System Errors**: Handle system-level errors

## Future Enhancements

### Planned Features

- **Incremental Backups**: Incremental backup support
- **Cloud Storage**: Cloud storage integration
- **Scheduled Backups**: Automated scheduled backups
- **Backup Encryption**: End-to-end backup encryption
- **Backup Compression**: Advanced compression algorithms
- **Backup Verification**: Automated backup verification

### Performance Improvements

- **Parallel Processing**: Enhanced parallel processing
- **Streaming**: Improved streaming capabilities
- **Caching**: Backup metadata caching
- **Optimization**: Performance optimization

This Backup & Restore System provides a robust foundation for data protection while maintaining high performance, security, and user experience standards!
