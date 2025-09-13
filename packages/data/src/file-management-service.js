"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileManagementService = exports.FileManagementService = void 0;
const index_1 = require("./index");
const file_storage_service_1 = require("./file-storage-service");
const audit_middleware_1 = require("./audit-middleware");
/**
 * File Management Service
 * Integrates file storage with database records
 */
class FileManagementService {
    /**
     * Upload file and create database record
     */
    async uploadFile(input, auditContext) {
        try {
            console.log(`📁 Uploading file: ${input.originalName}`);
            // Upload file to storage
            const uploadResult = await file_storage_service_1.fileStorageService.uploadFile(input.fileBuffer, input.originalName, input.mimeType, input.uploadedBy, input.caseId, input.orderId, input.tags, input.description);
            // Create database record
            const fileRecord = await index_1.db.file.create({
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
            });
            // Log audit entry
            if (auditContext) {
                await audit_middleware_1.AuditMiddleware.logCustomEvent(auditContext.userId, 'DOCUMENT', fileRecord.id, 'CREATE', {
                    originalName: input.originalName,
                    mimeType: input.mimeType,
                    size: input.size,
                    caseId: input.caseId,
                    orderId: input.orderId
                }, auditContext.ipAddress, auditContext.userAgent);
            }
            console.log(`✅ File uploaded successfully: ${fileRecord.id}`);
            return this.transformFileRecord(fileRecord);
        }
        catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }
    /**
     * Get file by ID
     */
    async getFileById(fileId, auditContext) {
        try {
            const fileRecord = await index_1.db.file.findUnique({
                where: { id: fileId }
            });
            if (!fileRecord) {
                return null;
            }
            // Log audit entry
            if (auditContext) {
                await audit_middleware_1.AuditMiddleware.logCustomEvent(auditContext.userId, 'DOCUMENT', fileId, 'VIEW', {
                    originalName: fileRecord.originalName,
                    mimeType: fileRecord.mimeType
                }, auditContext.ipAddress, auditContext.userAgent);
            }
            return this.transformFileRecord(fileRecord);
        }
        catch (error) {
            console.error('Error getting file by ID:', error);
            return null;
        }
    }
    /**
     * Get file content
     */
    async getFileContent(fileId, auditContext) {
        try {
            const fileRecord = await index_1.db.file.findUnique({
                where: { id: fileId }
            });
            if (!fileRecord) {
                return null;
            }
            // Log audit entry
            if (auditContext) {
                await audit_middleware_1.AuditMiddleware.logCustomEvent(auditContext.userId, 'DOCUMENT', fileId, 'DOWNLOAD', {
                    originalName: fileRecord.originalName,
                    mimeType: fileRecord.mimeType
                }, auditContext.ipAddress, auditContext.userAgent);
            }
            return await file_storage_service_1.fileStorageService.getFileContent(fileId);
        }
        catch (error) {
            console.error('Error getting file content:', error);
            return null;
        }
    }
    /**
     * Get files with filtering
     */
    async getFiles(filters, auditContext) {
        try {
            const where = this.buildWhereClause(filters);
            const fileRecords = await index_1.db.file.findMany({
                where,
                orderBy: { uploadedAt: 'desc' },
                skip: filters.offset || 0,
                take: filters.limit || 50
            });
            // Log audit entry
            if (auditContext) {
                await audit_middleware_1.AuditMiddleware.logCustomEvent(auditContext.userId, 'DOCUMENT', 'multiple', 'VIEW', {
                    filterCount: fileRecords.length,
                    filters: filters
                }, auditContext.ipAddress, auditContext.userAgent);
            }
            return fileRecords.map(record => this.transformFileRecord(record));
        }
        catch (error) {
            console.error('Error getting files:', error);
            return [];
        }
    }
    /**
     * Get files for case
     */
    async getCaseFiles(caseId, auditContext) {
        return this.getFiles({ caseId }, auditContext);
    }
    /**
     * Get files for order
     */
    async getOrderFiles(orderId, auditContext) {
        return this.getFiles({ orderId }, auditContext);
    }
    /**
     * Get PDF files for order
     */
    async getOrderPdfs(orderId, auditContext) {
        return this.getFiles({ orderId, mimeType: 'application/pdf' }, auditContext);
    }
    /**
     * Update file metadata
     */
    async updateFile(fileId, updates, auditContext) {
        try {
            const oldFile = await index_1.db.file.findUnique({
                where: { id: fileId }
            });
            if (!oldFile) {
                return null;
            }
            const updateData = {};
            if (updates.originalName)
                updateData.originalName = updates.originalName;
            if (updates.tags)
                updateData.tags = JSON.stringify(updates.tags);
            if (updates.description)
                updateData.description = updates.description;
            const fileRecord = await index_1.db.file.update({
                where: { id: fileId },
                data: updateData
            });
            // Log audit entry
            if (auditContext) {
                await audit_middleware_1.AuditMiddleware.logCustomEvent(auditContext.userId, 'DOCUMENT', fileId, 'UPDATE', {
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
                }, auditContext.ipAddress, auditContext.userAgent);
            }
            console.log(`📝 File updated: ${fileId}`);
            return this.transformFileRecord(fileRecord);
        }
        catch (error) {
            console.error('Error updating file:', error);
            return null;
        }
    }
    /**
     * Delete file (soft delete)
     */
    async deleteFile(fileId, deletedBy, auditContext) {
        try {
            const oldFile = await index_1.db.file.findUnique({
                where: { id: fileId }
            });
            if (!oldFile) {
                return false;
            }
            // Soft delete
            await index_1.db.file.update({
                where: { id: fileId },
                data: {
                    isDeleted: true,
                    deletedAt: new Date(),
                    deletedBy
                }
            });
            // Log audit entry
            if (auditContext) {
                await audit_middleware_1.AuditMiddleware.logCustomEvent(auditContext.userId, 'DOCUMENT', fileId, 'DELETE', {
                    originalName: oldFile.originalName,
                    mimeType: oldFile.mimeType,
                    size: oldFile.size
                }, auditContext.ipAddress, auditContext.userAgent);
            }
            console.log(`🗑️ File deleted: ${fileId}`);
            return true;
        }
        catch (error) {
            console.error('Error deleting file:', error);
            return false;
        }
    }
    /**
     * Restore deleted file
     */
    async restoreFile(fileId, restoredBy, auditContext) {
        try {
            const fileRecord = await index_1.db.file.findUnique({
                where: { id: fileId }
            });
            if (!fileRecord || !fileRecord.isDeleted) {
                return false;
            }
            await index_1.db.file.update({
                where: { id: fileId },
                data: {
                    isDeleted: false,
                    deletedAt: null,
                    deletedBy: null
                }
            });
            // Log audit entry
            if (auditContext) {
                await audit_middleware_1.AuditMiddleware.logCustomEvent(auditContext.userId, 'DOCUMENT', fileId, 'RESTORE', {
                    originalName: fileRecord.originalName,
                    mimeType: fileRecord.mimeType
                }, auditContext.ipAddress, auditContext.userAgent);
            }
            console.log(`♻️ File restored: ${fileId}`);
            return true;
        }
        catch (error) {
            console.error('Error restoring file:', error);
            return false;
        }
    }
    /**
     * Permanently delete file
     */
    async permanentDeleteFile(fileId, deletedBy, auditContext) {
        try {
            const fileRecord = await index_1.db.file.findUnique({
                where: { id: fileId }
            });
            if (!fileRecord) {
                return false;
            }
            // Delete from database
            await index_1.db.file.delete({
                where: { id: fileId }
            });
            // Delete from storage
            await file_storage_service_1.fileStorageService.deleteFile(fileId);
            // Log audit entry
            if (auditContext) {
                await audit_middleware_1.AuditMiddleware.logCustomEvent(auditContext.userId, 'DOCUMENT', fileId, 'PERMANENT_DELETE', {
                    originalName: fileRecord.originalName,
                    mimeType: fileRecord.mimeType,
                    size: fileRecord.size
                }, auditContext.ipAddress, auditContext.userAgent);
            }
            console.log(`💀 File permanently deleted: ${fileId}`);
            return true;
        }
        catch (error) {
            console.error('Error permanently deleting file:', error);
            return false;
        }
    }
    /**
     * Get file statistics
     */
    async getFileStatistics() {
        try {
            const [totalFiles, deletedFiles, filesByMimeType, filesByCase, filesByOrder, storageStats] = await Promise.all([
                index_1.db.file.count({ where: { isDeleted: false } }),
                index_1.db.file.count({ where: { isDeleted: true } }),
                this.getFilesByMimeType(),
                this.getFilesByCase(),
                this.getFilesByOrder(),
                file_storage_service_1.fileStorageService.getStorageStatistics()
            ]);
            const totalSize = await this.getTotalSize();
            return {
                totalFiles,
                totalSize,
                filesByMimeType,
                filesByCase,
                filesByOrder,
                deletedFiles,
                storageStats
            };
        }
        catch (error) {
            console.error('Error getting file statistics:', error);
            return {
                totalFiles: 0,
                totalSize: 0,
                filesByMimeType: {},
                filesByCase: {},
                filesByOrder: {},
                deletedFiles: 0,
                storageStats: {}
            };
        }
    }
    /**
     * Search files
     */
    async searchFiles(query, filters = {}, auditContext) {
        try {
            const where = {
                ...this.buildWhereClause(filters),
                OR: [
                    { originalName: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                    { tags: { contains: query, mode: 'insensitive' } }
                ]
            };
            const fileRecords = await index_1.db.file.findMany({
                where,
                orderBy: { uploadedAt: 'desc' },
                skip: filters.offset || 0,
                take: filters.limit || 50
            });
            // Log audit entry
            if (auditContext) {
                await audit_middleware_1.AuditMiddleware.logCustomEvent(auditContext.userId, 'DOCUMENT', 'search', 'SEARCH', {
                    query,
                    resultCount: fileRecords.length
                }, auditContext.ipAddress, auditContext.userAgent);
            }
            return fileRecords.map(record => this.transformFileRecord(record));
        }
        catch (error) {
            console.error('Error searching files:', error);
            return [];
        }
    }
    /**
     * Get file by hash
     */
    async getFileByHash(hash) {
        try {
            const fileRecord = await index_1.db.file.findFirst({
                where: { hash }
            });
            return fileRecord ? this.transformFileRecord(fileRecord) : null;
        }
        catch (error) {
            console.error('Error getting file by hash:', error);
            return null;
        }
    }
    /**
     * Check if file exists by hash
     */
    async fileExistsByHash(hash) {
        try {
            const count = await index_1.db.file.count({
                where: { hash, isDeleted: false }
            });
            return count > 0;
        }
        catch (error) {
            console.error('Error checking file existence:', error);
            return false;
        }
    }
    /**
     * Get duplicate files
     */
    async getDuplicateFiles() {
        try {
            const duplicates = await index_1.db.file.groupBy({
                by: ['hash'],
                where: { isDeleted: false },
                having: {
                    hash: {
                        _count: {
                            gt: 1
                        }
                    }
                }
            });
            const duplicateFiles = [];
            for (const duplicate of duplicates) {
                const files = await index_1.db.file.findMany({
                    where: { hash: duplicate.hash, isDeleted: false }
                });
                duplicateFiles.push(...files.map(record => this.transformFileRecord(record)));
            }
            return duplicateFiles;
        }
        catch (error) {
            console.error('Error getting duplicate files:', error);
            return [];
        }
    }
    /**
     * Clean up deleted files
     */
    async cleanupDeletedFiles(olderThanDays = 30) {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
            const deletedFiles = await index_1.db.file.findMany({
                where: {
                    isDeleted: true,
                    deletedAt: {
                        lt: cutoffDate
                    }
                }
            });
            let cleanedCount = 0;
            for (const file of deletedFiles) {
                await this.permanentDeleteFile(file.id, 'system');
                cleanedCount++;
            }
            console.log(`🧹 Cleaned up ${cleanedCount} deleted files`);
            return cleanedCount;
        }
        catch (error) {
            console.error('Error cleaning up deleted files:', error);
            return 0;
        }
    }
    /**
     * Build where clause for filtering
     */
    buildWhereClause(filters) {
        const where = {};
        if (filters.caseId)
            where.caseId = filters.caseId;
        if (filters.orderId)
            where.orderId = filters.orderId;
        if (filters.uploadedBy)
            where.uploadedBy = filters.uploadedBy;
        if (filters.mimeType)
            where.mimeType = filters.mimeType;
        if (filters.dateFrom || filters.dateTo) {
            where.uploadedAt = {};
            if (filters.dateFrom)
                where.uploadedAt.gte = filters.dateFrom;
            if (filters.dateTo)
                where.uploadedAt.lte = filters.dateTo;
        }
        if (filters.isDeleted !== undefined)
            where.isDeleted = filters.isDeleted;
        return where;
    }
    /**
     * Transform file record from database format
     */
    transformFileRecord(record) {
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
        };
    }
    /**
     * Get files by MIME type
     */
    async getFilesByMimeType() {
        try {
            const result = await index_1.db.file.groupBy({
                by: ['mimeType'],
                where: { isDeleted: false },
                _count: { mimeType: true }
            });
            return result.reduce((acc, item) => ({
                ...acc,
                [item.mimeType]: item._count.mimeType
            }), {});
        }
        catch (error) {
            console.error('Error getting files by MIME type:', error);
            return {};
        }
    }
    /**
     * Get files by case
     */
    async getFilesByCase() {
        try {
            const result = await index_1.db.file.groupBy({
                by: ['caseId'],
                where: { isDeleted: false, caseId: { not: null } },
                _count: { caseId: true }
            });
            return result.reduce((acc, item) => ({
                ...acc,
                [item.caseId]: item._count.caseId
            }), {});
        }
        catch (error) {
            console.error('Error getting files by case:', error);
            return {};
        }
    }
    /**
     * Get files by order
     */
    async getFilesByOrder() {
        try {
            const result = await index_1.db.file.groupBy({
                by: ['orderId'],
                where: { isDeleted: false, orderId: { not: null } },
                _count: { orderId: true }
            });
            return result.reduce((acc, item) => ({
                ...acc,
                [item.orderId]: item._count.orderId
            }), {});
        }
        catch (error) {
            console.error('Error getting files by order:', error);
            return {};
        }
    }
    /**
     * Get total size of all files
     */
    async getTotalSize() {
        try {
            const result = await index_1.db.file.aggregate({
                where: { isDeleted: false },
                _sum: { size: true }
            });
            return result._sum.size || 0;
        }
        catch (error) {
            console.error('Error getting total size:', error);
            return 0;
        }
    }
}
exports.FileManagementService = FileManagementService;
// Export singleton instance
exports.fileManagementService = new FileManagementService();
