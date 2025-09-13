import * as fs from 'fs/promises'
import * as path from 'path'
import * as crypto from 'crypto'
import { existsSync } from 'fs'

export interface FileMetadata {
  id: string
  originalName: string
  mimeType: string
  size: number
  hash: string
  uploadedAt: Date
  uploadedBy: string
  caseId?: string
  orderId?: string
  tags?: string[]
  description?: string
}

export interface FileStorageConfig {
  dataDir: string
  maxFileSize: number // in bytes
  allowedMimeTypes: string[]
  chunkSize: number // for large file handling
}

export interface FileUploadResult {
  fileId: string
  hash: string
  size: number
  path: string
  metadata: FileMetadata
}

export interface FileQueryOptions {
  caseId?: string
  orderId?: string
  uploadedBy?: string
  mimeType?: string
  tags?: string[]
  dateFrom?: Date
  dateTo?: Date
  limit?: number
  offset?: number
}

/**
 * Content-Addressed File Storage Service
 * Stores files using content hashing for deduplication and integrity
 */
export class FileStorageService {
  private config: FileStorageConfig
  private metadataPath: string
  private filesPath: string

  constructor(config: FileStorageConfig) {
    this.config = config
    this.metadataPath = path.join(config.dataDir, 'metadata')
    this.filesPath = path.join(config.dataDir, 'files')
    
    this.ensureDirectories()
  }

  /**
   * Ensure required directories exist
   */
  private async ensureDirectories(): Promise<void> {
    try {
      await fs.mkdir(this.config.dataDir, { recursive: true })
      await fs.mkdir(this.metadataPath, { recursive: true })
      await fs.mkdir(this.filesPath, { recursive: true })
    } catch (error) {
      console.error('Error creating directories:', error)
      throw error
    }
  }

  /**
   * Calculate file hash for content addressing
   */
  private async calculateFileHash(filePath: string): Promise<string> {
    try {
      const fileBuffer = await fs.readFile(filePath)
      return crypto.createHash('sha256').update(fileBuffer).digest('hex')
    } catch (error) {
      console.error('Error calculating file hash:', error)
      throw error
    }
  }

  /**
   * Calculate hash from buffer
   */
  private calculateBufferHash(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex')
  }

  /**
   * Get file path from hash
   */
  private getFilePathFromHash(hash: string): string {
    // Use first 2 characters for directory structure
    const dir1 = hash.substring(0, 2)
    const dir2 = hash.substring(2, 4)
    return path.join(this.filesPath, dir1, dir2, hash)
  }

  /**
   * Get metadata file path
   */
  private getMetadataPath(fileId: string): string {
    return path.join(this.metadataPath, `${fileId}.json`)
  }

  /**
   * Validate file before upload
   */
  private validateFile(file: Buffer, originalName: string, mimeType: string): void {
    // Check file size
    if (file.length > this.config.maxFileSize) {
      throw new Error(`File size exceeds maximum allowed size of ${this.config.maxFileSize} bytes`)
    }

    // Check MIME type
    if (!this.config.allowedMimeTypes.includes(mimeType)) {
      throw new Error(`MIME type ${mimeType} is not allowed`)
    }

    // Check file extension
    const ext = path.extname(originalName).toLowerCase()
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png', '.gif']
    if (!allowedExtensions.includes(ext)) {
      throw new Error(`File extension ${ext} is not allowed`)
    }
  }

  /**
   * Upload file with content addressing
   */
  async uploadFile(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    uploadedBy: string,
    caseId?: string,
    orderId?: string,
    tags?: string[],
    description?: string
  ): Promise<FileUploadResult> {
    try {
      console.log(`📁 Uploading file: ${originalName} (${fileBuffer.length} bytes)`)

      // Validate file
      this.validateFile(fileBuffer, originalName, mimeType)

      // Calculate content hash
      const hash = this.calculateBufferHash(fileBuffer)
      console.log(`🔍 File hash: ${hash}`)

      // Check if file already exists
      const existingFile = await this.getFileByHash(hash)
      if (existingFile) {
        console.log(`♻️ File already exists, reusing: ${hash}`)
        
        // Create new metadata entry for this upload
        const fileId = crypto.randomUUID()
        const metadata: FileMetadata = {
          id: fileId,
          originalName,
          mimeType,
          size: fileBuffer.length,
          hash,
          uploadedAt: new Date(),
          uploadedBy,
          caseId,
          orderId,
          tags,
          description
        }

        await this.saveMetadata(metadata)
        
        return {
          fileId,
          hash,
          size: fileBuffer.length,
          path: this.getFilePathFromHash(hash),
          metadata
        }
      }

      // Store file with content addressing
      const filePath = this.getFilePathFromHash(hash)
      await fs.mkdir(path.dirname(filePath), { recursive: true })
      await fs.writeFile(filePath, fileBuffer)

      // Create metadata
      const fileId = crypto.randomUUID()
      const metadata: FileMetadata = {
        id: fileId,
        originalName,
        mimeType,
        size: fileBuffer.length,
        hash,
        uploadedAt: new Date(),
        uploadedBy,
        caseId,
        orderId,
        tags,
        description
      }

      await this.saveMetadata(metadata)

      console.log(`✅ File uploaded successfully: ${fileId}`)

      return {
        fileId,
        hash,
        size: fileBuffer.length,
        path: filePath,
        metadata
      }

    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }

  /**
   * Get file by hash
   */
  async getFileByHash(hash: string): Promise<FileMetadata | null> {
    try {
      const filePath = this.getFilePathFromHash(hash)
      
      if (!existsSync(filePath)) {
        return null
      }

      // Find metadata by hash
      const metadataFiles = await fs.readdir(this.metadataPath)
      
      for (const metadataFile of metadataFiles) {
        if (metadataFile.endsWith('.json')) {
          const metadataPath = path.join(this.metadataPath, metadataFile)
          const metadataContent = await fs.readFile(metadataPath, 'utf-8')
          const metadata: FileMetadata = JSON.parse(metadataContent)
          
          if (metadata.hash === hash) {
            return metadata
          }
        }
      }

      return null

    } catch (error) {
      console.error('Error getting file by hash:', error)
      return null
    }
  }

  /**
   * Get file by ID
   */
  async getFileById(fileId: string): Promise<FileMetadata | null> {
    try {
      const metadataPath = this.getMetadataPath(fileId)
      
      if (!existsSync(metadataPath)) {
        return null
      }

      const metadataContent = await fs.readFile(metadataPath, 'utf-8')
      return JSON.parse(metadataContent)

    } catch (error) {
      console.error('Error getting file by ID:', error)
      return null
    }
  }

  /**
   * Get file content
   */
  async getFileContent(fileId: string): Promise<Buffer | null> {
    try {
      const metadata = await this.getFileById(fileId)
      if (!metadata) {
        return null
      }

      const filePath = this.getFilePathFromHash(metadata.hash)
      
      if (!existsSync(filePath)) {
        return null
      }

      return await fs.readFile(filePath)

    } catch (error) {
      console.error('Error getting file content:', error)
      return null
    }
  }

  /**
   * Get file content by hash
   */
  async getFileContentByHash(hash: string): Promise<Buffer | null> {
    try {
      const filePath = this.getFilePathFromHash(hash)
      
      if (!existsSync(filePath)) {
        return null
      }

      return await fs.readFile(filePath)

    } catch (error) {
      console.error('Error getting file content by hash:', error)
      return null
    }
  }

  /**
   * Save metadata
   */
  private async saveMetadata(metadata: FileMetadata): Promise<void> {
    try {
      const metadataPath = this.getMetadataPath(metadata.id)
      await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2))
    } catch (error) {
      console.error('Error saving metadata:', error)
      throw error
    }
  }

  /**
   * Query files with filters
   */
  async queryFiles(options: FileQueryOptions): Promise<FileMetadata[]> {
    try {
      const metadataFiles = await fs.readdir(this.metadataPath)
      const files: FileMetadata[] = []

      for (const metadataFile of metadataFiles) {
        if (metadataFile.endsWith('.json')) {
          const metadataPath = path.join(this.metadataPath, metadataFile)
          const metadataContent = await fs.readFile(metadataPath, 'utf-8')
          const metadata: FileMetadata = JSON.parse(metadataContent)

          // Apply filters
          if (options.caseId && metadata.caseId !== options.caseId) continue
          if (options.orderId && metadata.orderId !== options.orderId) continue
          if (options.uploadedBy && metadata.uploadedBy !== options.uploadedBy) continue
          if (options.mimeType && metadata.mimeType !== options.mimeType) continue
          if (options.tags && !options.tags.some(tag => metadata.tags?.includes(tag))) continue
          if (options.dateFrom && metadata.uploadedAt < options.dateFrom) continue
          if (options.dateTo && metadata.uploadedAt > options.dateTo) continue

          files.push(metadata)
        }
      }

      // Sort by upload date (newest first)
      files.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())

      // Apply pagination
      const offset = options.offset || 0
      const limit = options.limit || 50
      
      return files.slice(offset, offset + limit)

    } catch (error) {
      console.error('Error querying files:', error)
      return []
    }
  }

  /**
   * Get files for case
   */
  async getCaseFiles(caseId: string): Promise<FileMetadata[]> {
    return this.queryFiles({ caseId })
  }

  /**
   * Get files for order
   */
  async getOrderFiles(orderId: string): Promise<FileMetadata[]> {
    return this.queryFiles({ orderId })
  }

  /**
   * Get PDF files for order
   */
  async getOrderPdfs(orderId: string): Promise<FileMetadata[]> {
    return this.queryFiles({ orderId, mimeType: 'application/pdf' })
  }

  /**
   * Delete file
   */
  async deleteFile(fileId: string): Promise<boolean> {
    try {
      const metadata = await this.getFileById(fileId)
      if (!metadata) {
        return false
      }

      // Delete metadata
      const metadataPath = this.getMetadataPath(fileId)
      await fs.unlink(metadataPath)

      // Check if any other metadata references this hash
      const otherFiles = await this.queryFiles({})
      const hashStillReferenced = otherFiles.some(file => file.hash === metadata.hash)

      if (!hashStillReferenced) {
        // Delete the actual file if no other references
        const filePath = this.getFilePathFromHash(metadata.hash)
        if (existsSync(filePath)) {
          await fs.unlink(filePath)
        }
      }

      console.log(`🗑️ File deleted: ${fileId}`)
      return true

    } catch (error) {
      console.error('Error deleting file:', error)
      return false
    }
  }

  /**
   * Update file metadata
   */
  async updateFileMetadata(fileId: string, updates: Partial<FileMetadata>): Promise<boolean> {
    try {
      const metadata = await this.getFileById(fileId)
      if (!metadata) {
        return false
      }

      const updatedMetadata = { ...metadata, ...updates }
      await this.saveMetadata(updatedMetadata)

      console.log(`📝 File metadata updated: ${fileId}`)
      return true

    } catch (error) {
      console.error('Error updating file metadata:', error)
      return false
    }
  }

  /**
   * Get storage statistics
   */
  async getStorageStatistics(): Promise<{
    totalFiles: number
    totalSize: number
    uniqueFiles: number
    duplicateFiles: number
    filesByMimeType: Record<string, number>
    filesByCase: Record<string, number>
    filesByOrder: Record<string, number>
  }> {
    try {
      const metadataFiles = await fs.readdir(this.metadataPath)
      const files: FileMetadata[] = []
      const uniqueHashes = new Set<string>()
      const filesByMimeType: Record<string, number> = {}
      const filesByCase: Record<string, number> = {}
      const filesByOrder: Record<string, number> = {}

      let totalSize = 0

      for (const metadataFile of metadataFiles) {
        if (metadataFile.endsWith('.json')) {
          const metadataPath = path.join(this.metadataPath, metadataFile)
          const metadataContent = await fs.readFile(metadataPath, 'utf-8')
          const metadata: FileMetadata = JSON.parse(metadataContent)

          files.push(metadata)
          uniqueHashes.add(metadata.hash)
          totalSize += metadata.size

          // Count by MIME type
          filesByMimeType[metadata.mimeType] = (filesByMimeType[metadata.mimeType] || 0) + 1

          // Count by case
          if (metadata.caseId) {
            filesByCase[metadata.caseId] = (filesByCase[metadata.caseId] || 0) + 1
          }

          // Count by order
          if (metadata.orderId) {
            filesByOrder[metadata.orderId] = (filesByOrder[metadata.orderId] || 0) + 1
          }
        }
      }

      return {
        totalFiles: files.length,
        totalSize,
        uniqueFiles: uniqueHashes.size,
        duplicateFiles: files.length - uniqueHashes.size,
        filesByMimeType,
        filesByCase,
        filesByOrder
      }

    } catch (error) {
      console.error('Error getting storage statistics:', error)
      return {
        totalFiles: 0,
        totalSize: 0,
        uniqueFiles: 0,
        duplicateFiles: 0,
        filesByMimeType: {},
        filesByCase: {},
        filesByOrder: {}
      }
    }
  }

  /**
   * Clean up orphaned files
   */
  async cleanupOrphanedFiles(): Promise<number> {
    try {
      const metadataFiles = await fs.readdir(this.metadataPath)
      const referencedHashes = new Set<string>()

      // Collect all referenced hashes
      for (const metadataFile of metadataFiles) {
        if (metadataFile.endsWith('.json')) {
          const metadataPath = path.join(this.metadataPath, metadataFile)
          const metadataContent = await fs.readFile(metadataPath, 'utf-8')
          const metadata: FileMetadata = JSON.parse(metadataContent)
          referencedHashes.add(metadata.hash)
        }
      }

      // Find orphaned files
      const filesDir = await fs.readdir(this.filesPath)
      let orphanedCount = 0

      for (const dir1 of filesDir) {
        const dir1Path = path.join(this.filesPath, dir1)
        const dir1Contents = await fs.readdir(dir1Path)
        
        for (const dir2 of dir1Contents) {
          const dir2Path = path.join(dir1Path, dir2)
          const dir2Contents = await fs.readdir(dir2Path)
          
          for (const file of dir2Contents) {
            const filePath = path.join(dir2Path, file)
            const hash = file
            
            if (!referencedHashes.has(hash)) {
              await fs.unlink(filePath)
              orphanedCount++
              console.log(`🧹 Cleaned up orphaned file: ${hash}`)
            }
          }
        }
      }

      console.log(`🧹 Cleaned up ${orphanedCount} orphaned files`)
      return orphanedCount

    } catch (error) {
      console.error('Error cleaning up orphaned files:', error)
      return 0
    }
  }

  /**
   * Export file metadata
   */
  async exportFileMetadata(options: FileQueryOptions): Promise<string> {
    try {
      const files = await this.queryFiles(options)
      return JSON.stringify(files, null, 2)
    } catch (error) {
      console.error('Error exporting file metadata:', error)
      return '[]'
    }
  }

  /**
   * Import file metadata
   */
  async importFileMetadata(metadataJson: string): Promise<number> {
    try {
      const files: FileMetadata[] = JSON.parse(metadataJson)
      let importedCount = 0

      for (const file of files) {
        await this.saveMetadata(file)
        importedCount++
      }

      console.log(`📥 Imported ${importedCount} file metadata entries`)
      return importedCount

    } catch (error) {
      console.error('Error importing file metadata:', error)
      return 0
    }
  }
}

// Default configuration
const defaultConfig: FileStorageConfig = {
  dataDir: process.env.DATA_DIR || path.join(process.cwd(), 'data'),
  maxFileSize: 100 * 1024 * 1024, // 100MB
  allowedMimeTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif'
  ],
  chunkSize: 1024 * 1024 // 1MB
}

// Export singleton instance
export const fileStorageService = new FileStorageService(defaultConfig)
