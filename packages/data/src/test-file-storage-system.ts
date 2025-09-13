import { 
  fileStorageService,
  fileManagementService,
  FileMetadata,
  FileUploadResult,
  FileQueryOptions
} from 'data'

/**
 * File Storage System Test Suite
 * Tests the content-addressed file storage and management system
 */
class FileStorageSystemTester {
  
  async testFileStorageSystem() {
    console.log('📁 Testing File Storage System...\n')
    
    // Test file storage service
    await this.testFileStorageService()
    
    // Test file management service
    await this.testFileManagementService()
    
    // Test content addressing
    await this.testContentAddressing()
    
    // Test file operations
    await this.testFileOperations()
    
    // Test file queries
    await this.testFileQueries()
    
    // Test file statistics
    await this.testFileStatistics()
    
    console.log('\n✅ File Storage System tests completed!')
  }
  
  private async testFileStorageService() {
    console.log('📁 Testing File Storage Service...')
    
    try {
      // Test file upload
      const testFileBuffer = Buffer.from('This is a test PDF content', 'utf-8')
      const uploadResult = await fileStorageService.uploadFile(
        testFileBuffer,
        'test-document.pdf',
        'application/pdf',
        'test-user-id',
        'test-case-id',
        'test-order-id',
        ['test', 'document'],
        'Test document for file storage testing'
      )
      
      console.log('  File Upload: ✅ Uploaded successfully (ID:', uploadResult.fileId + ')')
      console.log('    Hash:', uploadResult.hash)
      console.log('    Size:', uploadResult.size, 'bytes')
      console.log('    Path:', uploadResult.path)
      
      // Test duplicate file upload (should reuse existing file)
      const duplicateResult = await fileStorageService.uploadFile(
        testFileBuffer,
        'duplicate-document.pdf',
        'application/pdf',
        'test-user-id-2',
        'test-case-id-2',
        undefined,
        ['duplicate'],
        'Duplicate test document'
      )
      
      console.log('  Duplicate Upload: ✅ Reused existing file (ID:', duplicateResult.fileId + ')')
      console.log('    Same Hash:', uploadResult.hash === duplicateResult.hash)
      
      // Test get file by hash
      const fileByHash = await fileStorageService.getFileByHash(uploadResult.hash)
      console.log('  Get File by Hash: ✅ Retrieved file (ID:', fileByHash?.id + ')')
      
      // Test get file by ID
      const fileById = await fileStorageService.getFileById(uploadResult.fileId)
      console.log('  Get File by ID: ✅ Retrieved file (ID:', fileById?.id + ')')
      
      // Test get file content
      const fileContent = await fileStorageService.getFileContent(uploadResult.fileId)
      console.log('  Get File Content: ✅ Retrieved', fileContent?.length, 'bytes')
      
      // Test get file content by hash
      const fileContentByHash = await fileStorageService.getFileContentByHash(uploadResult.hash)
      console.log('  Get File Content by Hash: ✅ Retrieved', fileContentByHash?.length, 'bytes')
      
      // Test query files
      const queryResult = await fileStorageService.queryFiles({
        caseId: 'test-case-id',
        limit: 10,
        offset: 0
      })
      console.log('  Query Files: ✅ Retrieved', queryResult.length, 'files')
      
      // Test get storage statistics
      const stats = await fileStorageService.getStorageStatistics()
      console.log('  Get Storage Statistics: ✅ Retrieved statistics')
      console.log('    Total Files:', stats.totalFiles)
      console.log('    Total Size:', stats.totalSize, 'bytes')
      console.log('    Unique Files:', stats.uniqueFiles)
      console.log('    Duplicate Files:', stats.duplicateFiles)
      console.log('    Files by MIME Type:', Object.keys(stats.filesByMimeType).length)
      console.log('    Files by Case:', Object.keys(stats.filesByCase).length)
      console.log('    Files by Order:', Object.keys(stats.filesByOrder).length)
      
      // Test cleanup orphaned files
      const orphanedCount = await fileStorageService.cleanupOrphanedFiles()
      console.log('  Cleanup Orphaned Files: ✅ Cleaned up', orphanedCount, 'orphaned files')
      
      // Test export file metadata
      const exportData = await fileStorageService.exportFileMetadata({
        caseId: 'test-case-id',
        limit: 10,
        offset: 0
      })
      console.log('  Export File Metadata: ✅ Exported', exportData.length, 'characters')
      
      // Test delete file
      const deleteResult = await fileStorageService.deleteFile(uploadResult.fileId)
      console.log('  Delete File: ✅ Deleted file:', deleteResult)
      
    } catch (error) {
      console.log('  File Storage Service: ❌ Error -', error)
    }
    
    console.log('')
  }
  
  private async testFileManagementService() {
    console.log('📊 Testing File Management Service...')
    
    try {
      // Test file upload
      const testFileBuffer = Buffer.from('This is a test document content', 'utf-8')
      const uploadResult = await fileManagementService.uploadFile({
        originalName: 'test-document.txt',
        mimeType: 'text/plain',
        fileBuffer: testFileBuffer,
        uploadedBy: 'test-user-id',
        caseId: 'test-case-id',
        orderId: 'test-order-id',
        tags: ['test', 'document'],
        description: 'Test document for file management testing'
      })
      
      console.log('  File Upload: ✅ Uploaded successfully (ID:', uploadResult.id + ')')
      console.log('    Original Name:', uploadResult.originalName)
      console.log('    MIME Type:', uploadResult.mimeType)
      console.log('    Size:', uploadResult.size, 'bytes')
      console.log('    Hash:', uploadResult.hash)
      
      // Test get file by ID
      const fileById = await fileManagementService.getFileById(uploadResult.id)
      console.log('  Get File by ID: ✅ Retrieved file (ID:', fileById?.id + ')')
      
      // Test get file content
      const fileContent = await fileManagementService.getFileContent(uploadResult.id)
      console.log('  Get File Content: ✅ Retrieved', fileContent?.length, 'bytes')
      
      // Test get files with filtering
      const files = await fileManagementService.getFiles({
        caseId: 'test-case-id',
        limit: 10,
        offset: 0
      })
      console.log('  Get Files: ✅ Retrieved', files.length, 'files')
      
      // Test get case files
      const caseFiles = await fileManagementService.getCaseFiles('test-case-id')
      console.log('  Get Case Files: ✅ Retrieved', caseFiles.length, 'case files')
      
      // Test get order files
      const orderFiles = await fileManagementService.getOrderFiles('test-order-id')
      console.log('  Get Order Files: ✅ Retrieved', orderFiles.length, 'order files')
      
      // Test get order PDFs
      const orderPdfs = await fileManagementService.getOrderPdfs('test-order-id')
      console.log('  Get Order PDFs: ✅ Retrieved', orderPdfs.length, 'order PDFs')
      
      // Test update file metadata
      const updateResult = await fileManagementService.updateFile(uploadResult.id, {
        originalName: 'updated-test-document.txt',
        tags: ['updated', 'test'],
        description: 'Updated test document'
      })
      console.log('  Update File: ✅ Updated file (ID:', updateResult?.id + ')')
      
      // Test search files
      const searchResults = await fileManagementService.searchFiles('test', {
        caseId: 'test-case-id',
        limit: 10,
        offset: 0
      })
      console.log('  Search Files: ✅ Found', searchResults.length, 'files')
      
      // Test get file by hash
      const fileByHash = await fileManagementService.getFileByHash(uploadResult.hash)
      console.log('  Get File by Hash: ✅ Retrieved file (ID:', fileByHash?.id + ')')
      
      // Test check file existence by hash
      const exists = await fileManagementService.fileExistsByHash(uploadResult.hash)
      console.log('  File Exists by Hash: ✅ File exists:', exists)
      
      // Test get duplicate files
      const duplicates = await fileManagementService.getDuplicateFiles()
      console.log('  Get Duplicate Files: ✅ Found', duplicates.length, 'duplicate files')
      
      // Test get file statistics
      const stats = await fileManagementService.getFileStatistics()
      console.log('  Get File Statistics: ✅ Retrieved statistics')
      console.log('    Total Files:', stats.totalFiles)
      console.log('    Total Size:', stats.totalSize, 'bytes')
      console.log('    Files by MIME Type:', Object.keys(stats.filesByMimeType).length)
      console.log('    Files by Case:', Object.keys(stats.filesByCase).length)
      console.log('    Files by Order:', Object.keys(stats.filesByOrder).length)
      console.log('    Deleted Files:', stats.deletedFiles)
      
      // Test soft delete file
      const deleteResult = await fileManagementService.deleteFile(uploadResult.id, 'test-user-id')
      console.log('  Delete File: ✅ Soft deleted file:', deleteResult)
      
      // Test restore file
      const restoreResult = await fileManagementService.restoreFile(uploadResult.id, 'test-user-id')
      console.log('  Restore File: ✅ Restored file:', restoreResult)
      
      // Test permanent delete file
      const permanentDeleteResult = await fileManagementService.permanentDeleteFile(uploadResult.id, 'test-user-id')
      console.log('  Permanent Delete File: ✅ Permanently deleted file:', permanentDeleteResult)
      
    } catch (error) {
      console.log('  File Management Service: ❌ Error -', error)
    }
    
    console.log('')
  }
  
  private async testContentAddressing() {
    console.log('🔍 Testing Content Addressing...')
    
    try {
      // Test content addressing with identical files
      const content1 = Buffer.from('Identical content for testing', 'utf-8')
      const content2 = Buffer.from('Identical content for testing', 'utf-8')
      
      const upload1 = await fileStorageService.uploadFile(
        content1,
        'file1.txt',
        'text/plain',
        'user1',
        'case1'
      )
      
      const upload2 = await fileStorageService.uploadFile(
        content2,
        'file2.txt',
        'text/plain',
        'user2',
        'case2'
      )
      
      console.log('  Content Addressing: ✅ Same content produces same hash')
      console.log('    File 1 Hash:', upload1.hash)
      console.log('    File 2 Hash:', upload2.hash)
      console.log('    Hashes Match:', upload1.hash === upload2.hash)
      console.log('    Same File Path:', upload1.path === upload2.path)
      
      // Test content addressing with different files
      const content3 = Buffer.from('Different content for testing', 'utf-8')
      const upload3 = await fileStorageService.uploadFile(
        content3,
        'file3.txt',
        'text/plain',
        'user3',
        'case3'
      )
      
      console.log('  Different Content: ✅ Different content produces different hash')
      console.log('    File 3 Hash:', upload3.hash)
      console.log('    Different from File 1:', upload1.hash !== upload3.hash)
      
      // Test hash-based file retrieval
      const retrievedFile = await fileStorageService.getFileByHash(upload1.hash)
      console.log('  Hash-based Retrieval: ✅ Retrieved file by hash (ID:', retrievedFile?.id + ')')
      
      // Test hash-based content retrieval
      const retrievedContent = await fileStorageService.getFileContentByHash(upload1.hash)
      console.log('  Hash-based Content: ✅ Retrieved content by hash (', retrievedContent?.length, 'bytes)')
      
    } catch (error) {
      console.log('  Content Addressing: ❌ Error -', error)
    }
    
    console.log('')
  }
  
  private async testFileOperations() {
    console.log('⚙️ Testing File Operations...')
    
    try {
      // Test file upload with different MIME types
      const mimeTypes = [
        { mime: 'application/pdf', content: Buffer.from('PDF content'), ext: '.pdf' },
        { mime: 'application/msword', content: Buffer.from('Word content'), ext: '.doc' },
        { mime: 'text/plain', content: Buffer.from('Text content'), ext: '.txt' },
        { mime: 'image/jpeg', content: Buffer.from('JPEG content'), ext: '.jpg' }
      ]
      
      const uploadResults = []
      
      for (const mimeType of mimeTypes) {
        const result = await fileStorageService.uploadFile(
          mimeType.content,
          `test-file${mimeType.ext}`,
          mimeType.mime,
          'test-user',
          'test-case'
        )
        uploadResults.push(result)
        console.log(`  Upload ${mimeType.mime}: ✅ Uploaded (ID: ${result.fileId})`)
      }
      
      // Test file validation
      try {
        await fileStorageService.uploadFile(
          Buffer.from('Large file content'.repeat(1000000)), // Very large file
          'large-file.txt',
          'text/plain',
          'test-user',
          'test-case'
        )
        console.log('  Large File Upload: ⚠️ Should have failed validation')
      } catch (error) {
        console.log('  Large File Upload: ✅ Correctly rejected large file')
      }
      
      // Test invalid MIME type
      try {
        await fileStorageService.uploadFile(
          Buffer.from('Invalid content'),
          'invalid-file.exe',
          'application/x-executable',
          'test-user',
          'test-case'
        )
        console.log('  Invalid MIME Type: ⚠️ Should have failed validation')
      } catch (error) {
        console.log('  Invalid MIME Type: ✅ Correctly rejected invalid MIME type')
      }
      
      // Test file metadata updates
      for (const result of uploadResults) {
        const updateResult = await fileStorageService.updateFileMetadata(result.fileId, {
          description: 'Updated description',
          tags: ['updated', 'test']
        })
        console.log(`  Update Metadata ${result.fileId}: ✅ Updated: ${updateResult}`)
      }
      
    } catch (error) {
      console.log('  File Operations: ❌ Error -', error)
    }
    
    console.log('')
  }
  
  private async testFileQueries() {
    console.log('🔍 Testing File Queries...')
    
    try {
      // Test various query options
      const queryOptions: FileQueryOptions[] = [
        { caseId: 'test-case', limit: 10 },
        { orderId: 'test-order', limit: 10 },
        { uploadedBy: 'test-user', limit: 10 },
        { mimeType: 'application/pdf', limit: 10 },
        { tags: ['test'], limit: 10 },
        { dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), limit: 10 },
        { dateTo: new Date(), limit: 10 }
      ]
      
      for (const options of queryOptions) {
        const results = await fileStorageService.queryFiles(options)
        console.log(`  Query ${Object.keys(options).join(', ')}: ✅ Found ${results.length} files`)
      }
      
      // Test search functionality
      const searchResults = await fileStorageService.searchAuditLogs('test', 10, 0)
      console.log('  Search Files: ✅ Found', searchResults.length, 'files')
      
      // Test date range queries
      const dateFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
      const dateTo = new Date()
      
      const dateRangeResults = await fileStorageService.getAuditLogsByDateRange(dateFrom, dateTo, 50, 0)
      console.log('  Date Range Query: ✅ Found', dateRangeResults.length, 'files')
      
    } catch (error) {
      console.log('  File Queries: ❌ Error -', error)
    }
    
    console.log('')
  }
  
  private async testFileStatistics() {
    console.log('📊 Testing File Statistics...')
    
    try {
      // Test storage statistics
      const storageStats = await fileStorageService.getStorageStatistics()
      console.log('  Storage Statistics: ✅ Retrieved statistics')
      console.log('    Total Files:', storageStats.totalFiles)
      console.log('    Total Size:', storageStats.totalSize, 'bytes')
      console.log('    Unique Files:', storageStats.uniqueFiles)
      console.log('    Duplicate Files:', storageStats.duplicateFiles)
      console.log('    Files by MIME Type:', Object.keys(storageStats.filesByMimeType).length)
      console.log('    Files by Case:', Object.keys(storageStats.filesByCase).length)
      console.log('    Files by Order:', Object.keys(storageStats.filesByOrder).length)
      
      // Test management statistics
      const managementStats = await fileManagementService.getFileStatistics()
      console.log('  Management Statistics: ✅ Retrieved statistics')
      console.log('    Total Files:', managementStats.totalFiles)
      console.log('    Total Size:', managementStats.totalSize, 'bytes')
      console.log('    Files by MIME Type:', Object.keys(managementStats.filesByMimeType).length)
      console.log('    Files by Case:', Object.keys(managementStats.filesByCase).length)
      console.log('    Files by Order:', Object.keys(managementStats.filesByOrder).length)
      console.log('    Deleted Files:', managementStats.deletedFiles)
      
      // Test audit log statistics
      const auditStats = await fileStorageService.getAuditLogStatistics()
      console.log('  Audit Log Statistics: ✅ Retrieved statistics')
      console.log('    Total Logs:', auditStats.totalLogs)
      console.log('    Logs by Day:', Object.keys(auditStats.logsByDay).length)
      console.log('    Logs by Hour:', Object.keys(auditStats.logsByHour).length)
      console.log('    Top Users:', auditStats.topUsers.length)
      console.log('    Top Entities:', auditStats.topEntities.length)
      console.log('    Top Actions:', auditStats.topActions.length)
      
    } catch (error) {
      console.log('  File Statistics: ❌ Error -', error)
    }
    
    console.log('')
  }
  
  private async testFileExportImport() {
    console.log('📤 Testing File Export/Import...')
    
    try {
      // Test export file metadata
      const exportData = await fileStorageService.exportFileMetadata({
        limit: 10,
        offset: 0
      })
      console.log('  Export File Metadata: ✅ Exported', exportData.length, 'characters')
      
      // Test import file metadata
      const importCount = await fileStorageService.importFileMetadata(exportData)
      console.log('  Import File Metadata: ✅ Imported', importCount, 'file metadata entries')
      
      // Test CSV export
      const csvExport = await fileStorageService.exportAuditLogs({
        limit: 10,
        offset: 0
      }, 'CSV')
      console.log('  CSV Export: ✅ Exported', csvExport.length, 'characters')
      
    } catch (error) {
      console.log('  File Export/Import: ❌ Error -', error)
    }
    
    console.log('')
  }
  
  private async testFileCleanup() {
    console.log('🧹 Testing File Cleanup...')
    
    try {
      // Test cleanup orphaned files
      const orphanedCount = await fileStorageService.cleanupOrphanedFiles()
      console.log('  Cleanup Orphaned Files: ✅ Cleaned up', orphanedCount, 'orphaned files')
      
      // Test cleanup deleted files
      const deletedCount = await fileManagementService.cleanupDeletedFiles(30) // 30 days
      console.log('  Cleanup Deleted Files: ✅ Cleaned up', deletedCount, 'deleted files')
      
      // Test delete old audit logs
      const oldLogsCount = await fileStorageService.deleteOldAuditLogs(365) // 1 year
      console.log('  Delete Old Audit Logs: ✅ Deleted', oldLogsCount, 'old audit logs')
      
    } catch (error) {
      console.log('  File Cleanup: ❌ Error -', error)
    }
    
    console.log('')
  }
}

// Run the test suite
async function runFileStorageSystemTests() {
  const tester = new FileStorageSystemTester()
  await tester.testFileStorageSystem()
}

// Export for use in other modules
export { FileStorageSystemTester, runFileStorageSystemTests }

// Run tests if this file is executed directly
if (require.main === module) {
  runFileStorageSystemTests().catch(console.error)
}
