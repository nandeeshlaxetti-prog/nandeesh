import { db } from './index'
import { fileStorageService, FileMetadata, FileUploadResult, FileQueryOptions } from './file-storage-service'
import { AuditMiddleware, AuditContext } from './audit-middleware'

export interface FileRecord {
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
  isDeleted: boolean
  deletedAt?: Date
  deletedBy?: string
}

export interface FileUploadInput {
  originalName: string
  mimeType: string
  size: number
  fileBuffer: Buffer
  uploadedBy: string
  caseId?: string
  orderId?: string
  tags?: string[]
  description?: string
}

export interface FileUpdateInput {
  originalName?: string
  tags?: string[]
  description?: string
}

export interface FileFilterOptions {
  caseId?: string
  orderId?: string
  uploadedBy?: string
  mimeType?: string
  tags?: string[]
  dateFrom?: Date
  dateTo?: Date
  isDeleted?: boolean
  limit?: number
  offset?: number
}

/**
 * File Management Service
 * Integrates file storage with database records
 */
export class FileManagementService {
  
  /**
   * Upload file and create database record
   */
  async uploadFile(
    input: FileUploadInput,
    auditContext?: AuditContext
  ): Promise<FileRecord> {
    try {
      console.log(`📁 Uploading file: ${input.originalName}`)

      // Upload file to storage
      const uploadResult = await fileStorageService.uploadFile(
        input.fileBuffer,
        input.originalName,
        input.mimeType,
        input.uploadedBy,
        input.caseId,
        input.orderId,
        input.tags,
        input.description
      )

      // Create database record
      const fileRecord = await db.file.create({
        data: {
          id: uploadResult.fileId,
          originalName: input.originalName,
          mimeType: input.mimeType,
          size: input.size,
          hash: uploadResult.hash,
          uploadedAt: uploadResult.metadata.uploadedAt,
          uploadedBy: input.uploadedBy,
          caseId: input.caseId,
          orderId: input.orderId,
          tags: input.tags ? JSON.stringify(input.tags) : '[]',
          description: input.description,
          isDeleted: false
        }
      })

      // Log audit entry
      if (auditContext) {
        await AuditMiddleware.logCustomEvent(
          auditContext.userId,
          'DOCUMENT',
          fileRecord.id,
          'CREATE',
          {
            originalName: input.originalName,
            mimeType: input.mimeType,
            size: input.size,
            caseId: input.caseId,
            orderId: input.orderId
          },
          auditContext.ipAddress,
          auditContext.userAgent
        )
      }

      console.log(`✅ File uploaded successfully: ${fileRecord.id}`)

      return this.transformFileRecord(fileRecord)

    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }

  /**
   * Get file by ID
   */
  async getFileById(fileId: string, auditContext?: AuditContext): Promise<FileRecord | null> {
    try {
      const fileRecord = await db.file.findUnique({
        where: { id: fileId }
      })

      if (!fileRecord) {
        return null
      }

      // Log audit entry
      if (auditContext) {
        await AuditMiddleware.logCustomEvent(
          auditContext.userId,
          'DOCUMENT',
          fileId,
          'VIEW',
          {
            originalName: fileRecord.originalName,
            mimeType: fileRecord.mimeType
          },
          auditContext.ipAddress,
          auditContext.userAgent
        )
      }

      return this.transformFileRecord(fileRecord)

    } catch (error) {
      console.error('Error getting file by ID:', error)
      return null
    }
  }

  /**
   * Get file content
   */
  async getFileContent(fileId: string, auditContext?: AuditContext): Promise<Buffer | null> {
    try {
      const fileRecord = await db.file.findUnique({
        where: { id: fileId }
      })

      if (!fileRecord) {
        return null
      }

      // Log audit entry
      if (auditContext) {
        await AuditMiddleware.logCustomEvent(
          auditContext.userId,
          'DOCUMENT',
          fileId,
          'DOWNLOAD',
          {
            originalName: fileRecord.originalName,
            mimeType: fileRecord.mimeType
          },
          auditContext.ipAddress,
          auditContext.userAgent
        )
      }

      return await fileStorageService.getFileContent(fileId)

    } catch (error) {
      console.error('Error getting file content:', error)
      return null
    }
  }

  /**
   * Get files with filtering
   */
  async getFiles(filters: FileFilterOptions, auditContext?: AuditContext): Promise<FileRecord[]> {
    try {
      const where = this.buildWhereClause(filters)

      const fileRecords = await db.file.findMany({
        where,
        orderBy: { uploadedAt: 'desc' },
        skip: filters.offset || 0,
        take: filters.limit || 50
      })

      // Log audit entry
      if (auditContext) {
        await AuditMiddleware.logCustomEvent(
          auditContext.userId,
          'DOCUMENT',
          'multiple',
          'VIEW',
          {
            filterCount: fileRecords.length,
            filters: filters
          },
          auditContext.ipAddress,
          auditContext.userAgent
        )
      }

      return fileRecords.map(record => this.transformFileRecord(record))

    } catch (error) {
      console.error('Error getting files:', error)
      return []
    }
  }

  /**
   * Get files for case
   */
  async getCaseFiles(caseId: string, auditContext?: AuditContext): Promise<FileRecord[]> {
    return this.getFiles({ caseId }, auditContext)
  }

  /**
   * Get files for order
   */
  async getOrderFiles(orderId: string, auditContext?: AuditContext): Promise<FileRecord[]> {
    return this.getFiles({ orderId }, auditContext)
  }

  /**
   * Get PDF files for order
   */
  async getOrderPdfs(orderId: string, auditContext?: AuditContext): Promise<FileRecord[]> {
    return this.getFiles({ orderId, mimeType: 'application/pdf' }, auditContext)
  }

  /**
   * Update file metadata
   */
  async updateFile(
    fileId: string,
    updates: FileUpdateInput,
    auditContext?: AuditContext
  ): Promise<FileRecord | null> {
    try {
      const oldFile = await db.file.findUnique({
        where: { id: fileId }
      })

      if (!oldFile) {
        return null
      }

      const updateData: any = {}
      if (updates.originalName) updateData.originalName = updates.originalName
      if (updates.tags) updateData.tags = JSON.stringify(updates.tags)
      if (updates.description) updateData.description = updates.description

      const fileRecord = await db.file.update({
        where: { id: fileId },
        data: updateData
      })

      // Log audit entry
      if (auditContext) {
        await AuditMiddleware.logCustomEvent(
          auditContext.userId,
          'DOCUMENT',
          fileId,
          'UPDATE',
          {
            oldValues: {
              originalName: oldFile.originalName,
              tags: oldFile.tags,
              description: oldFile.description
            },
            newValues: {
              originalName: updates.originalName,
              tags: updates.tags,
              description: updates.description
            }
          },
          auditContext.ipAddress,
          auditContext.userAgent
        )
      }

      console.log(`📝 File updated: ${fileId}`)

      return this.transformFileRecord(fileRecord)

    } catch (error) {
      console.error('Error updating file:', error)
      return null
    }
  }

  /**
   * Delete file (soft delete)
   */
  async deleteFile(
    fileId: string,
    deletedBy: string,
    auditContext?: AuditContext
  ): Promise<boolean> {
    try {
      const oldFile = await db.file.findUnique({
        where: { id: fileId }
      })

      if (!oldFile) {
        return false
      }

      // Soft delete
      await db.file.update({
        where: { id: fileId },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy
        }
      })

      // Log audit entry
      if (auditContext) {
        await AuditMiddleware.logCustomEvent(
          auditContext.userId,
          'DOCUMENT',
          fileId,
          'DELETE',
          {
            originalName: oldFile.originalName,
            mimeType: oldFile.mimeType,
            size: oldFile.size
          },
          auditContext.ipAddress,
          auditContext.userAgent
        )
      }

      console.log(`🗑️ File deleted: ${fileId}`)

      return true

    } catch (error) {
      console.error('Error deleting file:', error)
      return false
    }
  }

  /**
   * Restore deleted file
   */
  async restoreFile(
    fileId: string,
    restoredBy: string,
    auditContext?: AuditContext
  ): Promise<boolean> {
    try {
      const fileRecord = await db.file.findUnique({
        where: { id: fileId }
      })

      if (!fileRecord || !fileRecord.isDeleted) {
        return false
      }

      await db.file.update({
        where: { id: fileId },
        data: {
          isDeleted: false,
          deletedAt: null,
          deletedBy: null
        }
      })

      // Log audit entry
      if (auditContext) {
        await AuditMiddleware.logCustomEvent(
          auditContext.userId,
          'DOCUMENT',
          fileId,
          'RESTORE',
          {
            originalName: fileRecord.originalName,
            mimeType: fileRecord.mimeType
          },
          auditContext.ipAddress,
          auditContext.userAgent
        )
      }

      console.log(`♻️ File restored: ${fileId}`)

      return true

    } catch (error) {
      console.error('Error restoring file:', error)
      return false
    }
  }

  /**
   * Permanently delete file
   */
  async permanentDeleteFile(
    fileId: string,
    deletedBy: string,
    auditContext?: AuditContext
  ): Promise<boolean> {
    try {
      const fileRecord = await db.file.findUnique({
        where: { id: fileId }
      })

      if (!fileRecord) {
        return false
      }

      // Delete from database
      await db.file.delete({
        where: { id: fileId }
      })

      // Delete from storage
      await fileStorageService.deleteFile(fileId)

      // Log audit entry
      if (auditContext) {
        await AuditMiddleware.logCustomEvent(
          auditContext.userId,
          'DOCUMENT',
          fileId,
          'PERMANENT_DELETE',
          {
            originalName: fileRecord.originalName,
            mimeType: fileRecord.mimeType,
            size: fileRecord.size
          },
          auditContext.ipAddress,
          auditContext.userAgent
        )
      }

      console.log(`💀 File permanently deleted: ${fileId}`)

      return true

    } catch (error) {
      console.error('Error permanently deleting file:', error)
      return false
    }
  }

  /**
   * Get file statistics
   */
  async getFileStatistics(): Promise<{
    totalFiles: number
    totalSize: number
    filesByMimeType: Record<string, number>
    filesByCase: Record<string, number>
    filesByOrder: Record<string, number>
    deletedFiles: number
    storageStats: any
  }> {
    try {
      const [
        totalFiles,
        deletedFiles,
        filesByMimeType,
        filesByCase,
        filesByOrder,
        storageStats
      ] = await Promise.all([
        db.file.count({ where: { isDeleted: false } }),
        db.file.count({ where: { isDeleted: true } }),
        this.getFilesByMimeType(),
        this.getFilesByCase(),
        this.getFilesByOrder(),
        fileStorageService.getStorageStatistics()
      ])

      const totalSize = await this.getTotalSize()

      return {
        totalFiles,
        totalSize,
        filesByMimeType,
        filesByCase,
        filesByOrder,
        deletedFiles,
        storageStats
      }

    } catch (error) {
      console.error('Error getting file statistics:', error)
      return {
        totalFiles: 0,
        totalSize: 0,
        filesByMimeType: {},
        filesByCase: {},
        filesByOrder: {},
        deletedFiles: 0,
        storageStats: {}
      }
    }
  }

  /**
   * Search files
   */
  async searchFiles(
    query: string,
    filters: FileFilterOptions = {},
    auditContext?: AuditContext
  ): Promise<FileRecord[]> {
    try {
      const where = {
        ...this.buildWhereClause(filters),
        OR: [
          { originalName: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { tags: { contains: query, mode: 'insensitive' } }
        ]
      }

      const fileRecords = await db.file.findMany({
        where,
        orderBy: { uploadedAt: 'desc' },
        skip: filters.offset || 0,
        take: filters.limit || 50
      })

      // Log audit entry
      if (auditContext) {
        await AuditMiddleware.logCustomEvent(
          auditContext.userId,
          'DOCUMENT',
          'search',
          'SEARCH',
          {
            query,
            resultCount: fileRecords.length
          },
          auditContext.ipAddress,
          auditContext.userAgent
        )
      }

      return fileRecords.map(record => this.transformFileRecord(record))

    } catch (error) {
      console.error('Error searching files:', error)
      return []
    }
  }

  /**
   * Get file by hash
   */
  async getFileByHash(hash: string): Promise<FileRecord | null> {
    try {
      const fileRecord = await db.file.findFirst({
        where: { hash }
      })

      return fileRecord ? this.transformFileRecord(fileRecord) : null

    } catch (error) {
      console.error('Error getting file by hash:', error)
      return null
    }
  }

  /**
   * Check if file exists by hash
   */
  async fileExistsByHash(hash: string): Promise<boolean> {
    try {
      const count = await db.file.count({
        where: { hash, isDeleted: false }
      })

      return count > 0

    } catch (error) {
      console.error('Error checking file existence:', error)
      return false
    }
  }

  /**
   * Get duplicate files
   */
  async getDuplicateFiles(): Promise<FileRecord[]> {
    try {
      const duplicates = await db.file.groupBy({
        by: ['hash'],
        where: { isDeleted: false },
        having: {
          hash: {
            _count: {
              gt: 1
            }
          }
        }
      })

      const duplicateFiles: FileRecord[] = []

      for (const duplicate of duplicates) {
        const files = await db.file.findMany({
          where: { hash: duplicate.hash, isDeleted: false }
        })

        duplicateFiles.push(...files.map(record => this.transformFileRecord(record)))
      }

      return duplicateFiles

    } catch (error) {
      console.error('Error getting duplicate files:', error)
      return []
    }
  }

  /**
   * Clean up deleted files
   */
  async cleanupDeletedFiles(olderThanDays: number = 30): Promise<number> {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays)

      const deletedFiles = await db.file.findMany({
        where: {
          isDeleted: true,
          deletedAt: {
            lt: cutoffDate
          }
        }
      })

      let cleanedCount = 0

      for (const file of deletedFiles) {
        await this.permanentDeleteFile(file.id, 'system')
        cleanedCount++
      }

      console.log(`🧹 Cleaned up ${cleanedCount} deleted files`)

      return cleanedCount

    } catch (error) {
      console.error('Error cleaning up deleted files:', error)
      return 0
    }
  }

  /**
   * Build where clause for filtering
   */
  private buildWhereClause(filters: FileFilterOptions): any {
    const where: any = {}

    if (filters.caseId) where.caseId = filters.caseId
    if (filters.orderId) where.orderId = filters.orderId
    if (filters.uploadedBy) where.uploadedBy = filters.uploadedBy
    if (filters.mimeType) where.mimeType = filters.mimeType
    if (filters.dateFrom || filters.dateTo) {
      where.uploadedAt = {}
      if (filters.dateFrom) where.uploadedAt.gte = filters.dateFrom
      if (filters.dateTo) where.uploadedAt.lte = filters.dateTo
    }
    if (filters.isDeleted !== undefined) where.isDeleted = filters.isDeleted

    return where
  }

  /**
   * Transform file record from database format
   */
  private transformFileRecord(record: any): FileRecord {
    return {
      id: record.id,
      originalName: record.originalName,
      mimeType: record.mimeType,
      size: record.size,
      hash: record.hash,
      uploadedAt: record.uploadedAt,
      uploadedBy: record.uploadedBy,
      caseId: record.caseId,
      orderId: record.orderId,
      tags: record.tags ? JSON.parse(record.tags) : [],
      description: record.description,
      isDeleted: record.isDeleted,
      deletedAt: record.deletedAt,
      deletedBy: record.deletedBy
    }
  }

  /**
   * Get files by MIME type
   */
  private async getFilesByMimeType(): Promise<Record<string, number>> {
    try {
      const result = await db.file.groupBy({
        by: ['mimeType'],
        where: { isDeleted: false },
        _count: { mimeType: true }
      })

      return result.reduce((acc, item) => ({
        ...acc,
        [item.mimeType]: item._count.mimeType
      }), {})

    } catch (error) {
      console.error('Error getting files by MIME type:', error)
      return {}
    }
  }

  /**
   * Get files by case
   */
  private async getFilesByCase(): Promise<Record<string, number>> {
    try {
      const result = await db.file.groupBy({
        by: ['caseId'],
        where: { isDeleted: false, caseId: { not: null } },
        _count: { caseId: true }
      })

      return result.reduce((acc, item) => ({
        ...acc,
        [item.caseId!]: item._count.caseId
      }), {})

    } catch (error) {
      console.error('Error getting files by case:', error)
      return {}
    }
  }

  /**
   * Get files by order
   */
  private async getFilesByOrder(): Promise<Record<string, number>> {
    try {
      const result = await db.file.groupBy({
        by: ['orderId'],
        where: { isDeleted: false, orderId: { not: null } },
        _count: { orderId: true }
      })

      return result.reduce((acc, item) => ({
        ...acc,
        [item.orderId!]: item._count.orderId
      }), {})

    } catch (error) {
      console.error('Error getting files by order:', error)
      return {}
    }
  }

  /**
   * Get total size of all files
   */
  private async getTotalSize(): Promise<number> {
    try {
      const result = await db.file.aggregate({
        where: { isDeleted: false },
        _sum: { size: true }
      })

      return result._sum.size || 0

    } catch (error) {
      console.error('Error getting total size:', error)
      return 0
    }
  }
}

// Export singleton instance
export const fileManagementService = new FileManagementService()
