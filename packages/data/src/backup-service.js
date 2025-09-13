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
exports.backupService = exports.BackupService = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
const fs_1 = require("fs");
const child_process_1 = require("child_process");
const util_1 = require("util");
const index_1 = require("./index");
const file_storage_service_1 = require("./file-storage-service");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
/**
 * Backup Service
 * Handles database and file backup/restore operations
 */
class BackupService {
    constructor(config) {
        this.config = config;
        this.ensureDirectories();
    }
    /**
     * Ensure required directories exist
     */
    async ensureDirectories() {
        try {
            await fs.mkdir(this.config.backupDir, { recursive: true });
        }
        catch (error) {
            console.error('Error creating backup directory:', error);
            throw error;
        }
    }
    /**
     * Export backup as ZIP file
     */
    async exportNow(options = {}) {
        try {
            console.log('🔄 Starting backup export...');
            const backupId = crypto.randomUUID();
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupFileName = `backup-${timestamp}-${backupId.substring(0, 8)}.zip`;
            const backupFilePath = path.join(this.config.backupDir, backupFileName);
            // Create temporary directory for backup contents
            const tempDir = path.join(this.config.backupDir, `temp-${backupId}`);
            await fs.mkdir(tempDir, { recursive: true });
            try {
                // Export database
                if (options.includeDatabase !== false) {
                    await this.exportDatabase(tempDir);
                }
                // Export files
                if (options.includeFiles !== false) {
                    await this.exportFiles(tempDir);
                }
                // Export metadata
                if (options.includeMetadata !== false) {
                    await this.exportMetadata(tempDir);
                }
                // Create ZIP file
                const compressionLevel = options.compressionLevel || this.config.compressionLevel;
                await this.createZipFile(tempDir, backupFilePath, compressionLevel);
                // Calculate checksum
                const checksum = await this.calculateFileChecksum(backupFilePath);
                // Get file stats
                const stats = await fs.stat(backupFilePath);
                // Get metadata
                const metadata = await this.getBackupMetadata();
                console.log('✅ Backup export completed successfully');
                return {
                    backupId,
                    filePath: backupFilePath,
                    size: stats.size,
                    createdAt: new Date(),
                    checksum,
                    metadata
                };
            }
            finally {
                // Clean up temporary directory
                await this.cleanupDirectory(tempDir);
            }
        }
        catch (error) {
            console.error('Error during backup export:', error);
            throw error;
        }
    }
    /**
     * Restore from ZIP file
     */
    async restoreFromZip(zipFilePath) {
        try {
            console.log('🔄 Starting backup restore...');
            const restoreId = crypto.randomUUID();
            const errors = [];
            // Verify ZIP file exists and is valid
            if (!(0, fs_1.existsSync)(zipFilePath)) {
                throw new Error(`Backup file not found: ${zipFilePath}`);
            }
            // Verify ZIP file integrity
            const isValidZip = await this.verifyZipFile(zipFilePath);
            if (!isValidZip) {
                throw new Error('Invalid or corrupted backup file');
            }
            // Create temporary directory for restore
            const tempDir = path.join(this.config.backupDir, `restore-${restoreId}`);
            await fs.mkdir(tempDir, { recursive: true });
            try {
                // Extract ZIP file
                await this.extractZipFile(zipFilePath, tempDir);
                // Read backup metadata
                const metadata = await this.readBackupMetadata(tempDir);
                // Stop background jobs
                console.log('⏸️ Stopping background jobs...');
                await this.stopBackgroundJobs();
                // Restore database
                if (metadata.includeDatabase) {
                    try {
                        await this.restoreDatabase(tempDir);
                        console.log('✅ Database restored successfully');
                    }
                    catch (error) {
                        const errorMsg = `Database restore failed: ${error}`;
                        console.error(errorMsg);
                        errors.push(errorMsg);
                    }
                }
                // Restore files
                if (metadata.includeFiles) {
                    try {
                        await this.restoreFiles(tempDir);
                        console.log('✅ Files restored successfully');
                    }
                    catch (error) {
                        const errorMsg = `Files restore failed: ${error}`;
                        console.error(errorMsg);
                        errors.push(errorMsg);
                    }
                }
                // Restore metadata
                if (metadata.includeMetadata) {
                    try {
                        await this.restoreMetadata(tempDir);
                        console.log('✅ Metadata restored successfully');
                    }
                    catch (error) {
                        const errorMsg = `Metadata restore failed: ${error}`;
                        console.error(errorMsg);
                        errors.push(errorMsg);
                    }
                }
                // Verify integrity
                console.log('🔍 Verifying restore integrity...');
                const integrityCheck = await this.verifyRestoreIntegrity(tempDir, metadata);
                if (!integrityCheck.valid) {
                    errors.push(`Integrity check failed: ${integrityCheck.errors.join(', ')}`);
                }
                // Restart background jobs
                console.log('▶️ Restarting background jobs...');
                await this.restartBackgroundJobs();
                console.log('✅ Backup restore completed');
                return {
                    restoreId,
                    success: errors.length === 0,
                    restoredAt: new Date(),
                    metadata: {
                        databaseVersion: metadata.databaseVersion,
                        fileCount: metadata.fileCount,
                        totalFileSize: metadata.totalFileSize,
                        userCount: metadata.userCount,
                        caseCount: metadata.caseCount,
                        taskCount: metadata.taskCount
                    },
                    errors
                };
            }
            finally {
                // Clean up temporary directory
                await this.cleanupDirectory(tempDir);
            }
        }
        catch (error) {
            console.error('Error during backup restore:', error);
            throw error;
        }
    }
    /**
     * Export database to SQL file
     */
    async exportDatabase(tempDir) {
        try {
            console.log('📊 Exporting database...');
            const dbPath = path.join(this.config.dataDir, 'database.sqlite');
            const exportPath = path.join(tempDir, 'database.sqlite');
            if ((0, fs_1.existsSync)(dbPath)) {
                await fs.copyFile(dbPath, exportPath);
                console.log('✅ Database exported successfully');
            }
            else {
                console.log('⚠️ Database file not found, skipping database export');
            }
        }
        catch (error) {
            console.error('Error exporting database:', error);
            throw error;
        }
    }
    /**
     * Export files directory
     */
    async exportFiles(tempDir) {
        try {
            console.log('📁 Exporting files...');
            const filesDir = path.join(this.config.dataDir, 'files');
            const metadataDir = path.join(this.config.dataDir, 'metadata');
            const exportFilesDir = path.join(tempDir, 'files');
            const exportMetadataDir = path.join(tempDir, 'metadata');
            if ((0, fs_1.existsSync)(filesDir)) {
                await this.copyDirectory(filesDir, exportFilesDir);
                console.log('✅ Files directory exported successfully');
            }
            if ((0, fs_1.existsSync)(metadataDir)) {
                await this.copyDirectory(metadataDir, exportMetadataDir);
                console.log('✅ Metadata directory exported successfully');
            }
        }
        catch (error) {
            console.error('Error exporting files:', error);
            throw error;
        }
    }
    /**
     * Export metadata JSON
     */
    async exportMetadata(tempDir) {
        try {
            console.log('📋 Exporting metadata...');
            const metadata = await this.getBackupMetadata();
            const metadataPath = path.join(tempDir, 'backup-metadata.json');
            await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
            console.log('✅ Metadata exported successfully');
        }
        catch (error) {
            console.error('Error exporting metadata:', error);
            throw error;
        }
    }
    /**
     * Create ZIP file from directory
     */
    async createZipFile(sourceDir, zipPath, compressionLevel = 6) {
        try {
            console.log('📦 Creating ZIP file...');
            // Use 7zip or zip command if available, otherwise use Node.js zip library
            try {
                // Try 7zip first
                await execAsync(`7z a -tzip -mx${compressionLevel} "${zipPath}" "${sourceDir}/*"`);
                console.log('✅ ZIP file created with 7zip');
            }
            catch (error) {
                try {
                    // Try zip command
                    await execAsync(`zip -r -${compressionLevel} "${zipPath}" "${sourceDir}"`);
                    console.log('✅ ZIP file created with zip command');
                }
                catch (error) {
                    // Fallback to Node.js implementation
                    await this.createZipFileNode(sourceDir, zipPath, compressionLevel);
                    console.log('✅ ZIP file created with Node.js');
                }
            }
        }
        catch (error) {
            console.error('Error creating ZIP file:', error);
            throw error;
        }
    }
    /**
     * Create ZIP file using Node.js (fallback)
     */
    async createZipFileNode(sourceDir, zipPath, compressionLevel) {
        // This is a simplified implementation
        // In production, you'd want to use a proper ZIP library like 'archiver'
        const { createWriteStream } = require('fs');
        const archiver = require('archiver');
        return new Promise((resolve, reject) => {
            const output = createWriteStream(zipPath);
            const archive = archiver('zip', {
                zlib: { level: compressionLevel }
            });
            output.on('close', () => resolve());
            archive.on('error', (err) => reject(err));
            archive.pipe(output);
            archive.directory(sourceDir, false);
            archive.finalize();
        });
    }
    /**
     * Extract ZIP file
     */
    async extractZipFile(zipPath, extractDir) {
        try {
            console.log('📦 Extracting ZIP file...');
            // Try 7zip first
            try {
                await execAsync(`7z x "${zipPath}" -o"${extractDir}" -y`);
                console.log('✅ ZIP file extracted with 7zip');
            }
            catch (error) {
                try {
                    // Try unzip command
                    await execAsync(`unzip "${zipPath}" -d "${extractDir}"`);
                    console.log('✅ ZIP file extracted with unzip command');
                }
                catch (error) {
                    // Fallback to Node.js implementation
                    await this.extractZipFileNode(zipPath, extractDir);
                    console.log('✅ ZIP file extracted with Node.js');
                }
            }
        }
        catch (error) {
            console.error('Error extracting ZIP file:', error);
            throw error;
        }
    }
    /**
     * Extract ZIP file using Node.js (fallback)
     */
    async extractZipFileNode(zipPath, extractDir) {
        const yauzl = require('yauzl');
        const { createWriteStream } = require('fs');
        return new Promise((resolve, reject) => {
            yauzl.open(zipPath, { lazyEntries: true }, (err, zipfile) => {
                if (err)
                    return reject(err);
                zipfile.readEntry();
                zipfile.on('entry', (entry) => {
                    if (/\/$/.test(entry.fileName)) {
                        // Directory entry
                        zipfile.readEntry();
                    }
                    else {
                        // File entry
                        zipfile.openReadStream(entry, (err, readStream) => {
                            if (err)
                                return reject(err);
                            const outputPath = path.join(extractDir, entry.fileName);
                            const outputStream = createWriteStream(outputPath);
                            readStream.pipe(outputStream);
                            readStream.on('end', () => zipfile.readEntry());
                        });
                    }
                });
                zipfile.on('end', () => resolve());
            });
        });
    }
    /**
     * Restore database from SQL file
     */
    async restoreDatabase(tempDir) {
        try {
            console.log('📊 Restoring database...');
            const dbPath = path.join(this.config.dataDir, 'database.sqlite');
            const backupDbPath = path.join(tempDir, 'database.sqlite');
            if ((0, fs_1.existsSync)(backupDbPath)) {
                // Backup current database
                const backupPath = `${dbPath}.backup.${Date.now()}`;
                if ((0, fs_1.existsSync)(dbPath)) {
                    await fs.copyFile(dbPath, backupPath);
                }
                // Restore database
                await fs.copyFile(backupDbPath, dbPath);
                console.log('✅ Database restored successfully');
            }
            else {
                console.log('⚠️ Database backup not found, skipping database restore');
            }
        }
        catch (error) {
            console.error('Error restoring database:', error);
            throw error;
        }
    }
    /**
     * Restore files directory
     */
    async restoreFiles(tempDir) {
        try {
            console.log('📁 Restoring files...');
            const filesDir = path.join(this.config.dataDir, 'files');
            const metadataDir = path.join(this.config.dataDir, 'metadata');
            const backupFilesDir = path.join(tempDir, 'files');
            const backupMetadataDir = path.join(tempDir, 'metadata');
            // Backup current files
            const backupFilesPath = `${filesDir}.backup.${Date.now()}`;
            const backupMetadataPath = `${metadataDir}.backup.${Date.now()}`;
            if ((0, fs_1.existsSync)(filesDir)) {
                await this.copyDirectory(filesDir, backupFilesPath);
            }
            if ((0, fs_1.existsSync)(metadataDir)) {
                await this.copyDirectory(metadataDir, backupMetadataPath);
            }
            // Restore files
            if ((0, fs_1.existsSync)(backupFilesDir)) {
                await fs.rm(filesDir, { recursive: true, force: true });
                await this.copyDirectory(backupFilesDir, filesDir);
                console.log('✅ Files directory restored successfully');
            }
            if ((0, fs_1.existsSync)(backupMetadataDir)) {
                await fs.rm(metadataDir, { recursive: true, force: true });
                await this.copyDirectory(backupMetadataDir, metadataDir);
                console.log('✅ Metadata directory restored successfully');
            }
        }
        catch (error) {
            console.error('Error restoring files:', error);
            throw error;
        }
    }
    /**
     * Restore metadata
     */
    async restoreMetadata(tempDir) {
        try {
            console.log('📋 Restoring metadata...');
            const metadataPath = path.join(tempDir, 'backup-metadata.json');
            if ((0, fs_1.existsSync)(metadataPath)) {
                const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf-8'));
                console.log('✅ Metadata restored successfully');
                console.log('  Backup version:', metadata.version);
                console.log('  Created at:', metadata.createdAt);
                console.log('  File count:', metadata.fileCount);
            }
            else {
                console.log('⚠️ Metadata backup not found, skipping metadata restore');
            }
        }
        catch (error) {
            console.error('Error restoring metadata:', error);
            throw error;
        }
    }
    /**
     * Get backup metadata
     */
    async getBackupMetadata() {
        try {
            // Get database statistics
            const [userCount, caseCount, taskCount, hearingCount, orderCount] = await Promise.all([
                index_1.db.user.count(),
                index_1.db.case.count(),
                index_1.db.task.count(),
                index_1.db.hearing.count(),
                index_1.db.order.count()
            ]);
            // Get file statistics
            const fileStats = await file_storage_service_1.fileStorageService.getStorageStatistics();
            return {
                version: '1.0.0',
                createdAt: new Date(),
                appVersion: '1.0.0', // TODO: Get from package.json
                databaseVersion: '1.0.0', // TODO: Get from database schema
                fileCount: fileStats.totalFiles,
                totalFileSize: fileStats.totalSize,
                userCount,
                caseCount,
                taskCount,
                hearingCount,
                orderCount,
                checksum: '', // Will be calculated after ZIP creation
                compressionLevel: this.config.compressionLevel,
                includeFiles: this.config.includeFiles,
                includeDatabase: this.config.includeDatabase,
                includeMetadata: this.config.includeMetadata
            };
        }
        catch (error) {
            console.error('Error getting backup metadata:', error);
            throw error;
        }
    }
    /**
     * Read backup metadata from restored files
     */
    async readBackupMetadata(tempDir) {
        try {
            const metadataPath = path.join(tempDir, 'backup-metadata.json');
            if ((0, fs_1.existsSync)(metadataPath)) {
                const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf-8'));
                return metadata;
            }
            else {
                throw new Error('Backup metadata not found');
            }
        }
        catch (error) {
            console.error('Error reading backup metadata:', error);
            throw error;
        }
    }
    /**
     * Verify ZIP file integrity
     */
    async verifyZipFile(zipPath) {
        try {
            // Try to test ZIP file with 7zip
            try {
                await execAsync(`7z t "${zipPath}"`);
                return true;
            }
            catch (error) {
                // Try with zip command
                try {
                    await execAsync(`unzip -t "${zipPath}"`);
                    return true;
                }
                catch (error) {
                    return false;
                }
            }
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Verify restore integrity
     */
    async verifyRestoreIntegrity(tempDir, metadata) {
        const errors = [];
        try {
            // Verify database
            if (metadata.includeDatabase) {
                const dbPath = path.join(this.config.dataDir, 'database.sqlite');
                if (!(0, fs_1.existsSync)(dbPath)) {
                    errors.push('Database file not found after restore');
                }
            }
            // Verify files
            if (metadata.includeFiles) {
                const filesDir = path.join(this.config.dataDir, 'files');
                if (!(0, fs_1.existsSync)(filesDir)) {
                    errors.push('Files directory not found after restore');
                }
            }
            // Verify metadata
            if (metadata.includeMetadata) {
                const metadataDir = path.join(this.config.dataDir, 'metadata');
                if (!(0, fs_1.existsSync)(metadataDir)) {
                    errors.push('Metadata directory not found after restore');
                }
            }
            return {
                valid: errors.length === 0,
                errors
            };
        }
        catch (error) {
            errors.push(`Integrity check failed: ${error}`);
            return {
                valid: false,
                errors
            };
        }
    }
    /**
     * Stop background jobs
     */
    async stopBackgroundJobs() {
        try {
            // Import job scheduler
            const { stopSchedulers } = await Promise.resolve().then(() => __importStar(require('jobs')));
            await stopSchedulers();
            console.log('✅ Background jobs stopped');
        }
        catch (error) {
            console.error('Error stopping background jobs:', error);
            // Don't throw error, continue with restore
        }
    }
    /**
     * Restart background jobs
     */
    async restartBackgroundJobs() {
        try {
            // Import job scheduler
            const { bootSchedulers } = await Promise.resolve().then(() => __importStar(require('jobs')));
            await bootSchedulers();
            console.log('✅ Background jobs restarted');
        }
        catch (error) {
            console.error('Error restarting background jobs:', error);
            // Don't throw error, restore is still considered successful
        }
    }
    /**
     * Calculate file checksum
     */
    async calculateFileChecksum(filePath) {
        try {
            const fileBuffer = await fs.readFile(filePath);
            return crypto.createHash('sha256').update(fileBuffer).digest('hex');
        }
        catch (error) {
            console.error('Error calculating file checksum:', error);
            return '';
        }
    }
    /**
     * Copy directory recursively
     */
    async copyDirectory(source, destination) {
        try {
            await fs.mkdir(destination, { recursive: true });
            const entries = await fs.readdir(source, { withFileTypes: true });
            for (const entry of entries) {
                const sourcePath = path.join(source, entry.name);
                const destPath = path.join(destination, entry.name);
                if (entry.isDirectory()) {
                    await this.copyDirectory(sourcePath, destPath);
                }
                else {
                    await fs.copyFile(sourcePath, destPath);
                }
            }
        }
        catch (error) {
            console.error('Error copying directory:', error);
            throw error;
        }
    }
    /**
     * Clean up directory
     */
    async cleanupDirectory(dirPath) {
        try {
            if ((0, fs_1.existsSync)(dirPath)) {
                await fs.rm(dirPath, { recursive: true, force: true });
            }
        }
        catch (error) {
            console.error('Error cleaning up directory:', error);
            // Don't throw error, cleanup is not critical
        }
    }
    /**
     * List available backups
     */
    async listBackups() {
        try {
            const files = await fs.readdir(this.config.backupDir);
            const backups = [];
            for (const file of files) {
                if (file.endsWith('.zip') && file.startsWith('backup-')) {
                    const filePath = path.join(this.config.backupDir, file);
                    const stats = await fs.stat(filePath);
                    backups.push({
                        fileName: file,
                        filePath,
                        size: stats.size,
                        createdAt: stats.birthtime,
                        checksum: await this.calculateFileChecksum(filePath)
                    });
                }
            }
            return backups.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        }
        catch (error) {
            console.error('Error listing backups:', error);
            return [];
        }
    }
    /**
     * Delete backup file
     */
    async deleteBackup(fileName) {
        try {
            const filePath = path.join(this.config.backupDir, fileName);
            if ((0, fs_1.existsSync)(filePath)) {
                await fs.unlink(filePath);
                console.log(`🗑️ Backup deleted: ${fileName}`);
                return true;
            }
            return false;
        }
        catch (error) {
            console.error('Error deleting backup:', error);
            return false;
        }
    }
    /**
     * Get backup statistics
     */
    async getBackupStatistics() {
        try {
            const backups = await this.listBackups();
            if (backups.length === 0) {
                return {
                    totalBackups: 0,
                    totalSize: 0,
                    oldestBackup: null,
                    newestBackup: null,
                    averageSize: 0
                };
            }
            const totalSize = backups.reduce((sum, backup) => sum + backup.size, 0);
            const oldestBackup = backups[backups.length - 1]?.createdAt || null;
            const newestBackup = backups[0]?.createdAt || null;
            const averageSize = totalSize / backups.length;
            return {
                totalBackups: backups.length,
                totalSize,
                oldestBackup,
                newestBackup,
                averageSize
            };
        }
        catch (error) {
            console.error('Error getting backup statistics:', error);
            return {
                totalBackups: 0,
                totalSize: 0,
                oldestBackup: null,
                newestBackup: null,
                averageSize: 0
            };
        }
    }
}
exports.BackupService = BackupService;
// Default configuration
const defaultConfig = {
    dataDir: process.env.DATA_DIR || path.join(process.cwd(), 'data'),
    backupDir: path.join(process.env.DATA_DIR || process.cwd(), 'backups'),
    maxBackupSize: 1024 * 1024 * 1024, // 1GB
    compressionLevel: 6,
    includeFiles: true,
    includeDatabase: true,
    includeMetadata: true
};
// Export singleton instance
exports.backupService = new BackupService(defaultConfig);
