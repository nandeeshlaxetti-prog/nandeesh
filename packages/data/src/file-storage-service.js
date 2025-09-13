"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileStorageService = exports.FileStorageService = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
const fs_1 = require("fs");
/**
 * Content-Addressed File Storage Service
 * Stores files using content hashing for deduplication and integrity
 */
class FileStorageService {
    constructor(config) {
        this.config = config;
        this.metadataPath = path.join(config.dataDir, 'metadata');
        this.filesPath = path.join(config.dataDir, 'files');
        this.ensureDirectories();
    }
    /**
     * Ensure required directories exist
     */
    async ensureDirectories() {
        try {
            await fs.mkdir(this.config.dataDir, { recursive: true });
            await fs.mkdir(this.metadataPath, { recursive: true });
            await fs.mkdir(this.filesPath, { recursive: true });
        }
        catch (error) {
            console.error('Error creating directories:', error);
            throw error;
        }
    }
    /**
     * Calculate file hash for content addressing
     */
    async calculateFileHash(filePath) {
        try {
            const fileBuffer = await fs.readFile(filePath);
            return crypto.createHash('sha256').update(fileBuffer).digest('hex');
        }
        catch (error) {
            console.error('Error calculating file hash:', error);
            throw error;
        }
    }
    /**
     * Calculate hash from buffer
     */
    calculateBufferHash(buffer) {
        return crypto.createHash('sha256').update(buffer).digest('hex');
    }
    /**
     * Get file path from hash
     */
    getFilePathFromHash(hash) {
        // Use first 2 characters for directory structure
        const dir1 = hash.substring(0, 2);
        const dir2 = hash.substring(2, 4);
        return path.join(this.filesPath, dir1, dir2, hash);
    }
    /**
     * Get metadata file path
     */
    getMetadataPath(fileId) {
        return path.join(this.metadataPath, `${fileId}.json`);
    }
    /**
     * Validate file before upload
     */
    validateFile(file, originalName, mimeType) {
        // Check file size
        if (file.length > this.config.maxFileSize) {
            throw new Error(`File size exceeds maximum allowed size of ${this.config.maxFileSize} bytes`);
        }
        // Check MIME type
        if (!this.config.allowedMimeTypes.includes(mimeType)) {
            throw new Error(`MIME type ${mimeType} is not allowed`);
        }
        // Check file extension
        const ext = path.extname(originalName).toLowerCase();
        const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png', '.gif'];
        if (!allowedExtensions.includes(ext)) {
            throw new Error(`File extension ${ext} is not allowed`);
        }
    }
    /**
     * Upload file with content addressing
     */
    async uploadFile(fileBuffer, originalName, mimeType, uploadedBy, caseId, orderId, tags, description) {
        try {
            console.log(`📁 Uploading file: ${originalName} (${fileBuffer.length} bytes)`);
            // Validate file
            this.validateFile(fileBuffer, originalName, mimeType);
            // Calculate content hash
            const hash = this.calculateBufferHash(fileBuffer);
            console.log(`🔍 File hash: ${hash}`);
            // Check if file already exists
            const existingFile = await this.getFileByHash(hash);
            if (existingFile) {
                console.log(`♻️ File already exists, reusing: ${hash}`);
                // Create new metadata entry for this upload
                const fileId = crypto.randomUUID();
                const metadata = {
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
                };
                await this.saveMetadata(metadata);
                return {
                    fileId,
                    hash,
                    size: fileBuffer.length,
                    path: this.getFilePathFromHash(hash),
                    metadata
                };
            }
            // Store file with content addressing
            const filePath = this.getFilePathFromHash(hash);
            await fs.mkdir(path.dirname(filePath), { recursive: true });
            await fs.writeFile(filePath, fileBuffer);
            // Create metadata
            const fileId = crypto.randomUUID();
            const metadata = {
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
            };
            await this.saveMetadata(metadata);
            console.log(`✅ File uploaded successfully: ${fileId}`);
            return {
                fileId,
                hash,
                size: fileBuffer.length,
                path: filePath,
                metadata
            };
        }
        catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }
    /**
     * Get file by hash
     */
    async getFileByHash(hash) {
        try {
            const filePath = this.getFilePathFromHash(hash);
            if (!(0, fs_1.existsSync)(filePath)) {
                return null;
            }
            // Find metadata by hash
            const metadataFiles = await fs.readdir(this.metadataPath);
            for (const metadataFile of metadataFiles) {
                if (metadataFile.endsWith('.json')) {
                    const metadataPath = path.join(this.metadataPath, metadataFile);
                    const metadataContent = await fs.readFile(metadataPath, 'utf-8');
                    const metadata = JSON.parse(metadataContent);
                    if (metadata.hash === hash) {
                        return metadata;
                    }
                }
            }
            return null;
        }
        catch (error) {
            console.error('Error getting file by hash:', error);
            return null;
        }
    }
    /**
     * Get file by ID
     */
    async getFileById(fileId) {
        try {
            const metadataPath = this.getMetadataPath(fileId);
            if (!(0, fs_1.existsSync)(metadataPath)) {
                return null;
            }
            const metadataContent = await fs.readFile(metadataPath, 'utf-8');
            return JSON.parse(metadataContent);
        }
        catch (error) {
            console.error('Error getting file by ID:', error);
            return null;
        }
    }
    /**
     * Get file content
     */
    async getFileContent(fileId) {
        try {
            const metadata = await this.getFileById(fileId);
            if (!metadata) {
                return null;
            }
            const filePath = this.getFilePathFromHash(metadata.hash);
            if (!(0, fs_1.existsSync)(filePath)) {
                return null;
            }
            return await fs.readFile(filePath);
        }
        catch (error) {
            console.error('Error getting file content:', error);
            return null;
        }
    }
    /**
     * Get file content by hash
     */
    async getFileContentByHash(hash) {
        try {
            const filePath = this.getFilePathFromHash(hash);
            if (!(0, fs_1.existsSync)(filePath)) {
                return null;
            }
            return await fs.readFile(filePath);
        }
        catch (error) {
            console.error('Error getting file content by hash:', error);
            return null;
        }
    }
    /**
     * Save metadata
     */
    async saveMetadata(metadata) {
        try {
            const metadataPath = this.getMetadataPath(metadata.id);
            await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
        }
        catch (error) {
            console.error('Error saving metadata:', error);
            throw error;
        }
    }
    /**
     * Query files with filters
     */
    async queryFiles(options) {
        try {
            const metadataFiles = await fs.readdir(this.metadataPath);
            const files = [];
            for (const metadataFile of metadataFiles) {
                if (metadataFile.endsWith('.json')) {
                    const metadataPath = path.join(this.metadataPath, metadataFile);
                    const metadataContent = await fs.readFile(metadataPath, 'utf-8');
                    const metadata = JSON.parse(metadataContent);
                    // Apply filters
                    if (options.caseId && metadata.caseId !== options.caseId)
                        continue;
                    if (options.orderId && metadata.orderId !== options.orderId)
                        continue;
                    if (options.uploadedBy && metadata.uploadedBy !== options.uploadedBy)
                        continue;
                    if (options.mimeType && metadata.mimeType !== options.mimeType)
                        continue;
                    if (options.tags && !options.tags.some(tag => metadata.tags?.includes(tag)))
                        continue;
                    if (options.dateFrom && metadata.uploadedAt < options.dateFrom)
                        continue;
                    if (options.dateTo && metadata.uploadedAt > options.dateTo)
                        continue;
                    files.push(metadata);
                }
            }
            // Sort by upload date (newest first)
            files.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
            // Apply pagination
            const offset = options.offset || 0;
            const limit = options.limit || 50;
            return files.slice(offset, offset + limit);
        }
        catch (error) {
            console.error('Error querying files:', error);
            return [];
        }
    }
    /**
     * Get files for case
     */
    async getCaseFiles(caseId) {
        return this.queryFiles({ caseId });
    }
    /**
     * Get files for order
     */
    async getOrderFiles(orderId) {
        return this.queryFiles({ orderId });
    }
    /**
     * Get PDF files for order
     */
    async getOrderPdfs(orderId) {
        return this.queryFiles({ orderId, mimeType: 'application/pdf' });
    }
    /**
     * Delete file
     */
    async deleteFile(fileId) {
        try {
            const metadata = await this.getFileById(fileId);
            if (!metadata) {
                return false;
            }
            // Delete metadata
            const metadataPath = this.getMetadataPath(fileId);
            await fs.unlink(metadataPath);
            // Check if any other metadata references this hash
            const otherFiles = await this.queryFiles({});
            const hashStillReferenced = otherFiles.some(file => file.hash === metadata.hash);
            if (!hashStillReferenced) {
                // Delete the actual file if no other references
                const filePath = this.getFilePathFromHash(metadata.hash);
                if ((0, fs_1.existsSync)(filePath)) {
                    await fs.unlink(filePath);
                }
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
     * Update file metadata
     */
    async updateFileMetadata(fileId, updates) {
        try {
            const metadata = await this.getFileById(fileId);
            if (!metadata) {
                return false;
            }
            const updatedMetadata = { ...metadata, ...updates };
            await this.saveMetadata(updatedMetadata);
            console.log(`📝 File metadata updated: ${fileId}`);
            return true;
        }
        catch (error) {
            console.error('Error updating file metadata:', error);
            return false;
        }
    }
    /**
     * Get storage statistics
     */
    async getStorageStatistics() {
        try {
            const metadataFiles = await fs.readdir(this.metadataPath);
            const files = [];
            const uniqueHashes = new Set();
            const filesByMimeType = {};
            const filesByCase = {};
            const filesByOrder = {};
            let totalSize = 0;
            for (const metadataFile of metadataFiles) {
                if (metadataFile.endsWith('.json')) {
                    const metadataPath = path.join(this.metadataPath, metadataFile);
                    const metadataContent = await fs.readFile(metadataPath, 'utf-8');
                    const metadata = JSON.parse(metadataContent);
                    files.push(metadata);
                    uniqueHashes.add(metadata.hash);
                    totalSize += metadata.size;
                    // Count by MIME type
                    filesByMimeType[metadata.mimeType] = (filesByMimeType[metadata.mimeType] || 0) + 1;
                    // Count by case
                    if (metadata.caseId) {
                        filesByCase[metadata.caseId] = (filesByCase[metadata.caseId] || 0) + 1;
                    }
                    // Count by order
                    if (metadata.orderId) {
                        filesByOrder[metadata.orderId] = (filesByOrder[metadata.orderId] || 0) + 1;
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
            };
        }
        catch (error) {
            console.error('Error getting storage statistics:', error);
            return {
                totalFiles: 0,
                totalSize: 0,
                uniqueFiles: 0,
                duplicateFiles: 0,
                filesByMimeType: {},
                filesByCase: {},
                filesByOrder: {}
            };
        }
    }
    /**
     * Clean up orphaned files
     */
    async cleanupOrphanedFiles() {
        try {
            const metadataFiles = await fs.readdir(this.metadataPath);
            const referencedHashes = new Set();
            // Collect all referenced hashes
            for (const metadataFile of metadataFiles) {
                if (metadataFile.endsWith('.json')) {
                    const metadataPath = path.join(this.metadataPath, metadataFile);
                    const metadataContent = await fs.readFile(metadataPath, 'utf-8');
                    const metadata = JSON.parse(metadataContent);
                    referencedHashes.add(metadata.hash);
                }
            }
            // Find orphaned files
            const filesDir = await fs.readdir(this.filesPath);
            let orphanedCount = 0;
            for (const dir1 of filesDir) {
                const dir1Path = path.join(this.filesPath, dir1);
                const dir1Contents = await fs.readdir(dir1Path);
                for (const dir2 of dir1Contents) {
                    const dir2Path = path.join(dir1Path, dir2);
                    const dir2Contents = await fs.readdir(dir2Path);
                    for (const file of dir2Contents) {
                        const filePath = path.join(dir2Path, file);
                        const hash = file;
                        if (!referencedHashes.has(hash)) {
                            await fs.unlink(filePath);
                            orphanedCount++;
                            console.log(`🧹 Cleaned up orphaned file: ${hash}`);
                        }
                    }
                }
            }
            console.log(`🧹 Cleaned up ${orphanedCount} orphaned files`);
            return orphanedCount;
        }
        catch (error) {
            console.error('Error cleaning up orphaned files:', error);
            return 0;
        }
    }
    /**
     * Export file metadata
     */
    async exportFileMetadata(options) {
        try {
            const files = await this.queryFiles(options);
            return JSON.stringify(files, null, 2);
        }
        catch (error) {
            console.error('Error exporting file metadata:', error);
            return '[]';
        }
    }
    /**
     * Import file metadata
     */
    async importFileMetadata(metadataJson) {
        try {
            const files = JSON.parse(metadataJson);
            let importedCount = 0;
            for (const file of files) {
                await this.saveMetadata(file);
                importedCount++;
            }
            console.log(`📥 Imported ${importedCount} file metadata entries`);
            return importedCount;
        }
        catch (error) {
            console.error('Error importing file metadata:', error);
            return 0;
        }
    }
}
exports.FileStorageService = FileStorageService;
// Default configuration
const defaultConfig = {
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
};
// Export singleton instance
exports.fileStorageService = new FileStorageService(defaultConfig);
