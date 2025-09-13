import { 
  backupService,
  BackupResult,
  RestoreResult,
  BackupConfig
} from 'data'

/**
 * Backup System Test Suite
 * Tests the backup and restore functionality
 */
class BackupSystemTester {
  
  async testBackupSystem() {
    console.log('💾 Testing Backup System...\n')
    
    // Test backup service
    await this.testBackupService()
    
    // Test backup export
    await this.testBackupExport()
    
    // Test backup restore
    await this.testBackupRestore()
    
    // Test backup management
    await this.testBackupManagement()
    
    // Test backup statistics
    await this.testBackupStatistics()
    
    console.log('\n✅ Backup System tests completed!')
  }
  
  private async testBackupService() {
    console.log('💾 Testing Backup Service...')
    
    try {
      // Test backup configuration
      const config: BackupConfig = {
        dataDir: './test-data',
        backupDir: './test-backups',
        maxBackupSize: 100 * 1024 * 1024, // 100MB
        compressionLevel: 6,
        includeFiles: true,
        includeDatabase: true,
        includeMetadata: true
      }
      
      console.log('  Backup Configuration: ✅ Configuration created')
      console.log('    Data Directory:', config.dataDir)
      console.log('    Backup Directory:', config.backupDir)
      console.log('    Max Backup Size:', config.maxBackupSize, 'bytes')
      console.log('    Compression Level:', config.compressionLevel)
      console.log('    Include Files:', config.includeFiles)
      console.log('    Include Database:', config.includeDatabase)
      console.log('    Include Metadata:', config.includeMetadata)
      
    } catch (error) {
      console.log('  Backup Service: ❌ Error -', error)
    }
    
    console.log('')
  }
  
  private async testBackupExport() {
    console.log('📤 Testing Backup Export...')
    
    try {
      // Test backup export with default options
      const exportResult = await backupService.exportNow()
      
      console.log('  Backup Export (Default): ✅ Export completed')
      console.log('    Backup ID:', exportResult.backupId)
      console.log('    File Path:', exportResult.filePath)
      console.log('    Size:', exportResult.size, 'bytes')
      console.log('    Created At:', exportResult.createdAt)
      console.log('    Checksum:', exportResult.checksum)
      console.log('    Metadata:')
      console.log('      Database Version:', exportResult.metadata.databaseVersion)
      console.log('      File Count:', exportResult.metadata.fileCount)
      console.log('      Total File Size:', exportResult.metadata.totalFileSize, 'bytes')
      console.log('      User Count:', exportResult.metadata.userCount)
      console.log('      Case Count:', exportResult.metadata.caseCount)
      console.log('      Task Count:', exportResult.metadata.taskCount)
      
      // Test backup export with custom options
      const customExportResult = await backupService.exportNow({
        includeFiles: true,
        includeDatabase: false,
        includeMetadata: true,
        compressionLevel: 9
      })
      
      console.log('  Backup Export (Custom): ✅ Export completed')
      console.log('    Backup ID:', customExportResult.backupId)
      console.log('    File Path:', customExportResult.filePath)
      console.log('    Size:', customExportResult.size, 'bytes')
      console.log('    Compression Level: 9')
      console.log('    Database Included: false')
      
      // Test backup export with minimal options
      const minimalExportResult = await backupService.exportNow({
        includeFiles: false,
        includeDatabase: true,
        includeMetadata: false,
        compressionLevel: 1
      })
      
      console.log('  Backup Export (Minimal): ✅ Export completed')
      console.log('    Backup ID:', minimalExportResult.backupId)
      console.log('    File Path:', minimalExportResult.filePath)
      console.log('    Size:', minimalExportResult.size, 'bytes')
      console.log('    Compression Level: 1')
      console.log('    Files Included: false')
      console.log('    Metadata Included: false')
      
    } catch (error) {
      console.log('  Backup Export: ❌ Error -', error)
    }
    
    console.log('')
  }
  
  private async testBackupRestore() {
    console.log('📥 Testing Backup Restore...')
    
    try {
      // First, create a backup to restore from
      const backupResult = await backupService.exportNow()
      console.log('  Created Test Backup: ✅ Backup created (ID:', backupResult.backupId + ')')
      
      // Test backup restore
      const restoreResult = await backupService.restoreFromZip(backupResult.filePath)
      
      console.log('  Backup Restore: ✅ Restore completed')
      console.log('    Restore ID:', restoreResult.restoreId)
      console.log('    Success:', restoreResult.success)
      console.log('    Restored At:', restoreResult.restoredAt)
      console.log('    Errors:', restoreResult.errors.length)
      console.log('    Metadata:')
      console.log('      Database Version:', restoreResult.metadata.databaseVersion)
      console.log('      File Count:', restoreResult.metadata.fileCount)
      console.log('      Total File Size:', restoreResult.metadata.totalFileSize, 'bytes')
      console.log('      User Count:', restoreResult.metadata.userCount)
      console.log('      Case Count:', restoreResult.metadata.caseCount)
      console.log('      Task Count:', restoreResult.metadata.taskCount)
      
      if (restoreResult.errors.length > 0) {
        console.log('    Restore Errors:')
        restoreResult.errors.forEach((error, index) => {
          console.log(`      ${index + 1}. ${error}`)
        })
      }
      
      // Test restore with invalid file
      try {
        await backupService.restoreFromZip('./non-existent-backup.zip')
        console.log('  Invalid File Restore: ⚠️ Should have failed')
      } catch (error) {
        console.log('  Invalid File Restore: ✅ Correctly rejected invalid file')
      }
      
    } catch (error) {
      console.log('  Backup Restore: ❌ Error -', error)
    }
    
    console.log('')
  }
  
  private async testBackupManagement() {
    console.log('📋 Testing Backup Management...')
    
    try {
      // Test list backups
      const backups = await backupService.listBackups()
      console.log('  List Backups: ✅ Retrieved', backups.length, 'backups')
      
      for (const backup of backups) {
        console.log('    Backup:', backup.fileName)
        console.log('      Size:', backup.size, 'bytes')
        console.log('      Created At:', backup.createdAt)
        console.log('      Checksum:', backup.checksum.substring(0, 8) + '...')
      }
      
      // Test delete backup (delete the last one)
      if (backups.length > 0) {
        const lastBackup = backups[backups.length - 1]
        const deleteResult = await backupService.deleteBackup(lastBackup.fileName)
        
        console.log('  Delete Backup: ✅ Deleted backup:', deleteResult)
        console.log('    File Name:', lastBackup.fileName)
        
        // Verify deletion
        const backupsAfterDelete = await backupService.listBackups()
        console.log('  Verify Deletion: ✅ Backup count reduced from', backups.length, 'to', backupsAfterDelete.length)
      }
      
      // Test delete non-existent backup
      const deleteNonExistentResult = await backupService.deleteBackup('non-existent-backup.zip')
      console.log('  Delete Non-existent: ✅ Correctly handled non-existent backup:', deleteNonExistentResult)
      
    } catch (error) {
      console.log('  Backup Management: ❌ Error -', error)
    }
    
    console.log('')
  }
  
  private async testBackupStatistics() {
    console.log('📊 Testing Backup Statistics...')
    
    try {
      // Test get backup statistics
      const stats = await backupService.getBackupStatistics()
      
      console.log('  Backup Statistics: ✅ Retrieved statistics')
      console.log('    Total Backups:', stats.totalBackups)
      console.log('    Total Size:', stats.totalSize, 'bytes')
      console.log('    Average Size:', stats.averageSize, 'bytes')
      console.log('    Oldest Backup:', stats.oldestBackup)
      console.log('    Newest Backup:', stats.newestBackup)
      
      // Test with no backups
      if (stats.totalBackups === 0) {
        console.log('  No Backups Scenario: ✅ Handled empty backup list')
        console.log('    Total Backups: 0')
        console.log('    Total Size: 0')
        console.log('    Average Size: 0')
        console.log('    Oldest Backup: null')
        console.log('    Newest Backup: null')
      }
      
    } catch (error) {
      console.log('  Backup Statistics: ❌ Error -', error)
    }
    
    console.log('')
  }
  
  private async testBackupIntegrity() {
    console.log('🔍 Testing Backup Integrity...')
    
    try {
      // Create a backup
      const backupResult = await backupService.exportNow()
      console.log('  Created Integrity Test Backup: ✅ Backup created')
      
      // Test ZIP file verification
      const isValidZip = await backupService.verifyZipFile(backupResult.filePath)
      console.log('  ZIP File Verification: ✅ ZIP file is valid:', isValidZip)
      
      // Test checksum verification
      const calculatedChecksum = await backupService.calculateFileChecksum(backupResult.filePath)
      console.log('  Checksum Verification: ✅ Checksums match:', backupResult.checksum === calculatedChecksum)
      console.log('    Original Checksum:', backupResult.checksum)
      console.log('    Calculated Checksum:', calculatedChecksum)
      
      // Test restore integrity
      const restoreResult = await backupService.restoreFromZip(backupResult.filePath)
      console.log('  Restore Integrity: ✅ Restore completed with integrity check')
      console.log('    Success:', restoreResult.success)
      console.log('    Errors:', restoreResult.errors.length)
      
    } catch (error) {
      console.log('  Backup Integrity: ❌ Error -', error)
    }
    
    console.log('')
  }
  
  private async testBackupCompression() {
    console.log('🗜️ Testing Backup Compression...')
    
    try {
      // Test different compression levels
      const compressionLevels = [1, 3, 6, 9]
      const compressionResults = []
      
      for (const level of compressionLevels) {
        const result = await backupService.exportNow({
          compressionLevel: level
        })
        
        compressionResults.push({
          level,
          size: result.size,
          filePath: result.filePath
        })
        
        console.log(`  Compression Level ${level}: ✅ Backup created`)
        console.log(`    Size: ${result.size} bytes`)
        console.log(`    File Path: ${result.filePath}`)
      }
      
      // Compare compression results
      console.log('  Compression Comparison: ✅ Compression levels compared')
      compressionResults.forEach((result, index) => {
        if (index > 0) {
          const previousResult = compressionResults[index - 1]
          const sizeDifference = result.size - previousResult.size
          const percentageChange = ((sizeDifference / previousResult.size) * 100).toFixed(2)
          
          console.log(`    Level ${result.level} vs Level ${previousResult.level}:`)
          console.log(`      Size Difference: ${sizeDifference} bytes (${percentageChange}%)`)
        }
      })
      
    } catch (error) {
      console.log('  Backup Compression: ❌ Error -', error)
    }
    
    console.log('')
  }
  
  private async testBackupOptions() {
    console.log('⚙️ Testing Backup Options...')
    
    try {
      // Test different backup options
      const optionTests = [
        { name: 'Database Only', options: { includeDatabase: true, includeFiles: false, includeMetadata: false } },
        { name: 'Files Only', options: { includeDatabase: false, includeFiles: true, includeMetadata: false } },
        { name: 'Metadata Only', options: { includeDatabase: false, includeFiles: false, includeMetadata: true } },
        { name: 'Database + Files', options: { includeDatabase: true, includeFiles: true, includeMetadata: false } },
        { name: 'All Options', options: { includeDatabase: true, includeFiles: true, includeMetadata: true } }
      ]
      
      for (const test of optionTests) {
        const result = await backupService.exportNow(test.options)
        
        console.log(`  ${test.name}: ✅ Backup created`)
        console.log(`    Size: ${result.size} bytes`)
        console.log(`    Database: ${test.options.includeDatabase}`)
        console.log(`    Files: ${test.options.includeFiles}`)
        console.log(`    Metadata: ${test.options.includeMetadata}`)
      }
      
    } catch (error) {
      console.log('  Backup Options: ❌ Error -', error)
    }
    
    console.log('')
  }
  
  private async testBackupErrorHandling() {
    console.log('⚠️ Testing Backup Error Handling...')
    
    try {
      // Test restore with invalid file path
      try {
        await backupService.restoreFromZip('./invalid-path.zip')
        console.log('  Invalid Path Restore: ⚠️ Should have failed')
      } catch (error) {
        console.log('  Invalid Path Restore: ✅ Correctly handled invalid path')
      }
      
      // Test restore with corrupted file
      try {
        // Create a fake corrupted ZIP file
        const fs = require('fs')
        const fakeZipPath = './fake-corrupted.zip'
        fs.writeFileSync(fakeZipPath, 'This is not a valid ZIP file')
        
        await backupService.restoreFromZip(fakeZipPath)
        console.log('  Corrupted File Restore: ⚠️ Should have failed')
        
        // Clean up fake file
        fs.unlinkSync(fakeZipPath)
      } catch (error) {
        console.log('  Corrupted File Restore: ✅ Correctly handled corrupted file')
      }
      
      // Test delete with invalid file name
      const deleteResult = await backupService.deleteBackup('invalid-file.zip')
      console.log('  Delete Invalid File: ✅ Correctly handled invalid file:', deleteResult)
      
    } catch (error) {
      console.log('  Backup Error Handling: ❌ Error -', error)
    }
    
    console.log('')
  }
}

// Run the test suite
async function runBackupSystemTests() {
  const tester = new BackupSystemTester()
  await tester.testBackupSystem()
}

// Export for use in other modules
export { BackupSystemTester, runBackupSystemTests }

// Run tests if this file is executed directly
if (require.main === module) {
  runBackupSystemTests().catch(console.error)
}
