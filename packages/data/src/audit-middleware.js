"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditMiddleware = void 0;
const audit_logging_service_1 = require("./audit-logging-service");
const permissions_service_1 = require("./permissions-service");
/**
 * Audit Middleware
 * Provides audit logging functionality for all entity operations
 */
class AuditMiddleware {
    /**
     * Wrap create operation with audit logging
     */
    static async wrapCreate(operation, entityType, context) {
        try {
            // Execute the operation
            const result = await operation();
            // Log the creation
            await audit_logging_service_1.auditLoggingService.logEntityCreation(context.userId, entityType, result.id, result, context.metadata, context.ipAddress, context.userAgent);
            return result;
        }
        catch (error) {
            console.error(`Error in audited create operation for ${entityType}:`, error);
            throw error;
        }
    }
    /**
     * Wrap update operation with audit logging
     */
    static async wrapUpdate(operation, entityType, entityId, oldValues, context) {
        try {
            // Execute the operation
            const result = await operation();
            // Calculate changes
            const changes = this.calculateChanges(oldValues, result);
            // Log the update
            await audit_logging_service_1.auditLoggingService.logEntityUpdate(context.userId, entityType, entityId, oldValues, result, changes, context.metadata, context.ipAddress, context.userAgent);
            return result;
        }
        catch (error) {
            console.error(`Error in audited update operation for ${entityType}:`, error);
            throw error;
        }
    }
    /**
     * Wrap delete operation with audit logging
     */
    static async wrapDelete(operation, entityType, entityId, oldValues, context) {
        try {
            // Execute the operation
            await operation();
            // Log the deletion
            await audit_logging_service_1.auditLoggingService.logEntityDeletion(context.userId, entityType, entityId, oldValues, context.metadata, context.ipAddress, context.userAgent);
        }
        catch (error) {
            console.error(`Error in audited delete operation for ${entityType}:`, error);
            throw error;
        }
    }
    /**
     * Wrap view operation with audit logging
     */
    static async wrapView(operation, entityType, entityId, context) {
        try {
            // Execute the operation
            const result = await operation();
            if (result) {
                // Log the view
                await audit_logging_service_1.auditLoggingService.logEntityView(context.userId, entityType, entityId, context.metadata, context.ipAddress, context.userAgent);
            }
            return result;
        }
        catch (error) {
            console.error(`Error in audited view operation for ${entityType}:`, error);
            throw error;
        }
    }
    /**
     * Wrap assignment operation with audit logging
     */
    static async wrapAssignment(operation, entityType, entityId, oldAssignee, newAssignee, context) {
        try {
            // Execute the operation
            const result = await operation();
            // Log the assignment
            await audit_logging_service_1.auditLoggingService.logEntityAssignment(context.userId, entityType, entityId, oldAssignee, newAssignee, context.metadata, context.ipAddress, context.userAgent);
            return result;
        }
        catch (error) {
            console.error(`Error in audited assignment operation for ${entityType}:`, error);
            throw error;
        }
    }
    /**
     * Wrap status change operation with audit logging
     */
    static async wrapStatusChange(operation, entityType, entityId, oldStatus, newStatus, context) {
        try {
            // Execute the operation
            const result = await operation();
            // Log the status change
            await audit_logging_service_1.auditLoggingService.logStatusChange(context.userId, entityType, entityId, oldStatus, newStatus, context.metadata, context.ipAddress, context.userAgent);
            return result;
        }
        catch (error) {
            console.error(`Error in audited status change operation for ${entityType}:`, error);
            throw error;
        }
    }
    /**
     * Calculate changes between old and new values
     */
    static calculateChanges(oldValues, newValues) {
        const changes = {};
        // Check all fields in new values
        for (const [key, newValue] of Object.entries(newValues)) {
            const oldValue = oldValues[key];
            // Skip if values are the same
            if (JSON.stringify(oldValue) === JSON.stringify(newValue)) {
                continue;
            }
            changes[key] = {
                old: oldValue,
                new: newValue
            };
        }
        // Check for deleted fields
        for (const [key, oldValue] of Object.entries(oldValues)) {
            if (!(key in newValues)) {
                changes[key] = {
                    old: oldValue,
                    new: undefined
                };
            }
        }
        return changes;
    }
    /**
     * Create audit context from request
     */
    static createAuditContext(userId, request) {
        return {
            userId,
            ipAddress: request?.ip,
            userAgent: request?.headers?.['user-agent'],
            metadata: request?.body ? { requestBody: request.body } : undefined
        };
    }
    /**
     * Filter entity data based on permissions
     */
    static async filterEntityData(userId, entityType, entityData) {
        try {
            return await permissions_service_1.permissionsService.filterEntityData(userId, entityType, entityData);
        }
        catch (error) {
            console.error('Error filtering entity data:', error);
            return entityData;
        }
    }
    /**
     * Check permissions before operation
     */
    static async checkPermissions(userId, operation, entityType, entityId) {
        try {
            switch (operation) {
                case 'VIEW':
                    const viewCheck = await permissions_service_1.permissionsService.canViewEntity(userId, entityType, entityId);
                    return viewCheck.allowed;
                case 'EDIT':
                    const editCheck = await permissions_service_1.permissionsService.canEditEntity(userId, entityType, entityId);
                    return editCheck.allowed;
                case 'DELETE':
                    const deleteCheck = await permissions_service_1.permissionsService.canDeleteEntity(userId, entityType, entityId);
                    return deleteCheck.allowed;
                default:
                    return false;
            }
        }
        catch (error) {
            console.error('Error checking permissions:', error);
            return false;
        }
    }
    /**
     * Get user permissions
     */
    static async getUserPermissions(userId) {
        try {
            return await permissions_service_1.permissionsService.getUserPermissions(userId);
        }
        catch (error) {
            console.error('Error getting user permissions:', error);
            return null;
        }
    }
    /**
     * Log custom audit event
     */
    static async logCustomEvent(userId, entityType, entityId, action, metadata, ipAddress, userAgent) {
        try {
            await audit_logging_service_1.auditLoggingService.logAuditEntry({
                userId,
                entityType,
                entityId,
                action: action,
                metadata,
                ipAddress,
                userAgent
            });
        }
        catch (error) {
            console.error('Error logging custom event:', error);
        }
    }
    /**
     * Batch log multiple events
     */
    static async batchLogEvents(events) {
        try {
            const promises = events.map(event => audit_logging_service_1.auditLoggingService.logAuditEntry({
                userId: event.userId,
                entityType: event.entityType,
                entityId: event.entityId,
                action: event.action,
                metadata: event.metadata,
                ipAddress: event.ipAddress,
                userAgent: event.userAgent
            }));
            await Promise.all(promises);
        }
        catch (error) {
            console.error('Error batch logging events:', error);
        }
    }
    /**
     * Get audit logs for entity
     */
    static async getEntityAuditLogs(entityType, entityId, userId, limit = 50, offset = 0) {
        try {
            // Check if user can view audit logs
            const canView = await permissions_service_1.permissionsService.canViewAuditLogs(userId);
            if (!canView) {
                throw new Error('User cannot view audit logs');
            }
            const auditLogs = await audit_logging_service_1.auditLoggingService.getEntityAuditLogs(entityType, entityId, limit, offset);
            // Filter audit logs based on permissions
            return await permissions_service_1.permissionsService.filterAuditLogData(userId, auditLogs);
        }
        catch (error) {
            console.error('Error getting entity audit logs:', error);
            return [];
        }
    }
    /**
     * Get user audit logs
     */
    static async getUserAuditLogs(userId, limit = 50, offset = 0) {
        try {
            const auditLogs = await audit_logging_service_1.auditLoggingService.getUserAuditLogs(userId, limit, offset);
            // Filter audit logs based on permissions
            return await permissions_service_1.permissionsService.filterAuditLogData(userId, auditLogs);
        }
        catch (error) {
            console.error('Error getting user audit logs:', error);
            return [];
        }
    }
    /**
     * Get audit log summary
     */
    static async getAuditLogSummary(userId, dateFrom, dateTo) {
        try {
            // Check if user can view audit logs
            const canView = await permissions_service_1.permissionsService.canViewAuditLogs(userId);
            if (!canView) {
                throw new Error('User cannot view audit logs');
            }
            const summary = await audit_logging_service_1.auditLoggingService.getAuditLogSummary(dateFrom, dateTo);
            // Filter audit logs based on permissions
            summary.recentActivity = await permissions_service_1.permissionsService.filterAuditLogData(userId, summary.recentActivity);
            return summary;
        }
        catch (error) {
            console.error('Error getting audit log summary:', error);
            return {
                totalEntries: 0,
                byEntityType: {},
                byAction: {},
                byUser: {},
                recentActivity: []
            };
        }
    }
    /**
     * Export audit logs
     */
    static async exportAuditLogs(userId, filter, format = 'JSON') {
        try {
            // Check if user can export data
            const canExport = await permissions_service_1.permissionsService.canExportData(userId);
            if (!canExport) {
                throw new Error('User cannot export data');
            }
            return await audit_logging_service_1.auditLoggingService.exportAuditLogs(filter, format);
        }
        catch (error) {
            console.error('Error exporting audit logs:', error);
            throw error;
        }
    }
}
exports.AuditMiddleware = AuditMiddleware;
