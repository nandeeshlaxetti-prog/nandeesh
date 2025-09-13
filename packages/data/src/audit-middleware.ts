import { auditLoggingService } from './audit-logging-service'
import { permissionsService } from './permissions-service'

export interface AuditContext {
  userId: string
  ipAddress?: string
  userAgent?: string
  metadata?: Record<string, any>
}

export interface AuditableEntity {
  id: string
  [key: string]: any
}

/**
 * Audit Middleware
 * Provides audit logging functionality for all entity operations
 */
export class AuditMiddleware {
  
  /**
   * Wrap create operation with audit logging
   */
  static async wrapCreate<T extends AuditableEntity>(
    operation: () => Promise<T>,
    entityType: 'CASE' | 'TASK' | 'HEARING' | 'ORDER' | 'DOCUMENT',
    context: AuditContext
  ): Promise<T> {
    try {
      // Execute the operation
      const result = await operation()
      
      // Log the creation
      await auditLoggingService.logEntityCreation(
        context.userId,
        entityType,
        result.id,
        result,
        context.metadata,
        context.ipAddress,
        context.userAgent
      )
      
      return result
      
    } catch (error) {
      console.error(`Error in audited create operation for ${entityType}:`, error)
      throw error
    }
  }

  /**
   * Wrap update operation with audit logging
   */
  static async wrapUpdate<T extends AuditableEntity>(
    operation: () => Promise<T>,
    entityType: 'CASE' | 'TASK' | 'HEARING' | 'ORDER' | 'DOCUMENT',
    entityId: string,
    oldValues: Record<string, any>,
    context: AuditContext
  ): Promise<T> {
    try {
      // Execute the operation
      const result = await operation()
      
      // Calculate changes
      const changes = this.calculateChanges(oldValues, result)
      
      // Log the update
      await auditLoggingService.logEntityUpdate(
        context.userId,
        entityType,
        entityId,
        oldValues,
        result,
        changes,
        context.metadata,
        context.ipAddress,
        context.userAgent
      )
      
      return result
      
    } catch (error) {
      console.error(`Error in audited update operation for ${entityType}:`, error)
      throw error
    }
  }

  /**
   * Wrap delete operation with audit logging
   */
  static async wrapDelete(
    operation: () => Promise<void>,
    entityType: 'CASE' | 'TASK' | 'HEARING' | 'ORDER' | 'DOCUMENT',
    entityId: string,
    oldValues: Record<string, any>,
    context: AuditContext
  ): Promise<void> {
    try {
      // Execute the operation
      await operation()
      
      // Log the deletion
      await auditLoggingService.logEntityDeletion(
        context.userId,
        entityType,
        entityId,
        oldValues,
        context.metadata,
        context.ipAddress,
        context.userAgent
      )
      
    } catch (error) {
      console.error(`Error in audited delete operation for ${entityType}:`, error)
      throw error
    }
  }

  /**
   * Wrap view operation with audit logging
   */
  static async wrapView<T extends AuditableEntity>(
    operation: () => Promise<T | null>,
    entityType: 'CASE' | 'TASK' | 'HEARING' | 'ORDER' | 'DOCUMENT',
    entityId: string,
    context: AuditContext
  ): Promise<T | null> {
    try {
      // Execute the operation
      const result = await operation()
      
      if (result) {
        // Log the view
        await auditLoggingService.logEntityView(
          context.userId,
          entityType,
          entityId,
          context.metadata,
          context.ipAddress,
          context.userAgent
        )
      }
      
      return result
      
    } catch (error) {
      console.error(`Error in audited view operation for ${entityType}:`, error)
      throw error
    }
  }

  /**
   * Wrap assignment operation with audit logging
   */
  static async wrapAssignment<T extends AuditableEntity>(
    operation: () => Promise<T>,
    entityType: 'CASE' | 'TASK' | 'HEARING' | 'ORDER' | 'DOCUMENT',
    entityId: string,
    oldAssignee: string | null,
    newAssignee: string | null,
    context: AuditContext
  ): Promise<T> {
    try {
      // Execute the operation
      const result = await operation()
      
      // Log the assignment
      await auditLoggingService.logEntityAssignment(
        context.userId,
        entityType,
        entityId,
        oldAssignee,
        newAssignee,
        context.metadata,
        context.ipAddress,
        context.userAgent
      )
      
      return result
      
    } catch (error) {
      console.error(`Error in audited assignment operation for ${entityType}:`, error)
      throw error
    }
  }

  /**
   * Wrap status change operation with audit logging
   */
  static async wrapStatusChange<T extends AuditableEntity>(
    operation: () => Promise<T>,
    entityType: 'CASE' | 'TASK' | 'HEARING' | 'ORDER' | 'DOCUMENT',
    entityId: string,
    oldStatus: string,
    newStatus: string,
    context: AuditContext
  ): Promise<T> {
    try {
      // Execute the operation
      const result = await operation()
      
      // Log the status change
      await auditLoggingService.logStatusChange(
        context.userId,
        entityType,
        entityId,
        oldStatus,
        newStatus,
        context.metadata,
        context.ipAddress,
        context.userAgent
      )
      
      return result
      
    } catch (error) {
      console.error(`Error in audited status change operation for ${entityType}:`, error)
      throw error
    }
  }

  /**
   * Calculate changes between old and new values
   */
  private static calculateChanges(oldValues: Record<string, any>, newValues: Record<string, any>): Record<string, { old: any; new: any }> {
    const changes: Record<string, { old: any; new: any }> = {}
    
    // Check all fields in new values
    for (const [key, newValue] of Object.entries(newValues)) {
      const oldValue = oldValues[key]
      
      // Skip if values are the same
      if (JSON.stringify(oldValue) === JSON.stringify(newValue)) {
        continue
      }
      
      changes[key] = {
        old: oldValue,
        new: newValue
      }
    }
    
    // Check for deleted fields
    for (const [key, oldValue] of Object.entries(oldValues)) {
      if (!(key in newValues)) {
        changes[key] = {
          old: oldValue,
          new: undefined
        }
      }
    }
    
    return changes
  }

  /**
   * Create audit context from request
   */
  static createAuditContext(
    userId: string,
    request?: {
      ip?: string
      headers?: Record<string, string>
      body?: any
    }
  ): AuditContext {
    return {
      userId,
      ipAddress: request?.ip,
      userAgent: request?.headers?.['user-agent'],
      metadata: request?.body ? { requestBody: request.body } : undefined
    }
  }

  /**
   * Filter entity data based on permissions
   */
  static async filterEntityData(
    userId: string,
    entityType: 'CASE' | 'TASK' | 'HEARING' | 'ORDER' | 'DOCUMENT',
    entityData: any
  ): Promise<any> {
    try {
      return await permissionsService.filterEntityData(userId, entityType, entityData)
    } catch (error) {
      console.error('Error filtering entity data:', error)
      return entityData
    }
  }

  /**
   * Check permissions before operation
   */
  static async checkPermissions(
    userId: string,
    operation: 'VIEW' | 'EDIT' | 'DELETE',
    entityType: 'CASE' | 'TASK' | 'HEARING' | 'ORDER' | 'DOCUMENT',
    entityId: string
  ): Promise<boolean> {
    try {
      switch (operation) {
        case 'VIEW':
          const viewCheck = await permissionsService.canViewEntity(userId, entityType, entityId)
          return viewCheck.allowed
        case 'EDIT':
          const editCheck = await permissionsService.canEditEntity(userId, entityType, entityId)
          return editCheck.allowed
        case 'DELETE':
          const deleteCheck = await permissionsService.canDeleteEntity(userId, entityType, entityId)
          return deleteCheck.allowed
        default:
          return false
      }
    } catch (error) {
      console.error('Error checking permissions:', error)
      return false
    }
  }

  /**
   * Get user permissions
   */
  static async getUserPermissions(userId: string) {
    try {
      return await permissionsService.getUserPermissions(userId)
    } catch (error) {
      console.error('Error getting user permissions:', error)
      return null
    }
  }

  /**
   * Log custom audit event
   */
  static async logCustomEvent(
    userId: string,
    entityType: 'CASE' | 'TASK' | 'HEARING' | 'ORDER' | 'DOCUMENT',
    entityId: string,
    action: string,
    metadata?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      await auditLoggingService.logAuditEntry({
        userId,
        entityType,
        entityId,
        action: action as any,
        metadata,
        ipAddress,
        userAgent
      })
    } catch (error) {
      console.error('Error logging custom event:', error)
    }
  }

  /**
   * Batch log multiple events
   */
  static async batchLogEvents(
    events: Array<{
      userId: string
      entityType: 'CASE' | 'TASK' | 'HEARING' | 'ORDER' | 'DOCUMENT'
      entityId: string
      action: string
      metadata?: Record<string, any>
      ipAddress?: string
      userAgent?: string
    }>
  ): Promise<void> {
    try {
      const promises = events.map(event =>
        auditLoggingService.logAuditEntry({
          userId: event.userId,
          entityType: event.entityType,
          entityId: event.entityId,
          action: event.action as any,
          metadata: event.metadata,
          ipAddress: event.ipAddress,
          userAgent: event.userAgent
        })
      )
      
      await Promise.all(promises)
    } catch (error) {
      console.error('Error batch logging events:', error)
    }
  }

  /**
   * Get audit logs for entity
   */
  static async getEntityAuditLogs(
    entityType: string,
    entityId: string,
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<any[]> {
    try {
      // Check if user can view audit logs
      const canView = await permissionsService.canViewAuditLogs(userId)
      if (!canView) {
        throw new Error('User cannot view audit logs')
      }

      const auditLogs = await auditLoggingService.getEntityAuditLogs(entityType, entityId, limit, offset)
      
      // Filter audit logs based on permissions
      return await permissionsService.filterAuditLogData(userId, auditLogs)
    } catch (error) {
      console.error('Error getting entity audit logs:', error)
      return []
    }
  }

  /**
   * Get user audit logs
   */
  static async getUserAuditLogs(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<any[]> {
    try {
      const auditLogs = await auditLoggingService.getUserAuditLogs(userId, limit, offset)
      
      // Filter audit logs based on permissions
      return await permissionsService.filterAuditLogData(userId, auditLogs)
    } catch (error) {
      console.error('Error getting user audit logs:', error)
      return []
    }
  }

  /**
   * Get audit log summary
   */
  static async getAuditLogSummary(
    userId: string,
    dateFrom?: Date,
    dateTo?: Date
  ): Promise<any> {
    try {
      // Check if user can view audit logs
      const canView = await permissionsService.canViewAuditLogs(userId)
      if (!canView) {
        throw new Error('User cannot view audit logs')
      }

      const summary = await auditLoggingService.getAuditLogSummary(dateFrom, dateTo)
      
      // Filter audit logs based on permissions
      summary.recentActivity = await permissionsService.filterAuditLogData(userId, summary.recentActivity)
      
      return summary
    } catch (error) {
      console.error('Error getting audit log summary:', error)
      return {
        totalEntries: 0,
        byEntityType: {},
        byAction: {},
        byUser: {},
        recentActivity: []
      }
    }
  }

  /**
   * Export audit logs
   */
  static async exportAuditLogs(
    userId: string,
    filter: any,
    format: 'JSON' | 'CSV' = 'JSON'
  ): Promise<string> {
    try {
      // Check if user can export data
      const canExport = await permissionsService.canExportData(userId)
      if (!canExport) {
        throw new Error('User cannot export data')
      }

      return await auditLoggingService.exportAuditLogs(filter, format)
    } catch (error) {
      console.error('Error exporting audit logs:', error)
      throw error
    }
  }
}

// Export for use in repositories
export { AuditMiddleware }
