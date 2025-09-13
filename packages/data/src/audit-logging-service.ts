import { db } from './index'
import { Prisma } from '@prisma/client'

export interface AuditLogEntry {
  id: string
  userId: string
  entityType: 'CASE' | 'TASK' | 'HEARING' | 'ORDER' | 'DOCUMENT' | 'USER' | 'TEAM'
  entityId: string
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'ASSIGN' | 'STATUS_CHANGE'
  oldValues?: Record<string, any>
  newValues?: Record<string, any>
  changes?: Record<string, { old: any; new: any }>
  metadata?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  timestamp: Date
}

export interface AuditLogCreateInput {
  userId: string
  entityType: 'CASE' | 'TASK' | 'HEARING' | 'ORDER' | 'DOCUMENT' | 'USER' | 'TEAM'
  entityId: string
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'ASSIGN' | 'STATUS_CHANGE'
  oldValues?: Record<string, any>
  newValues?: Record<string, any>
  changes?: Record<string, { old: any; new: any }>
  metadata?: Record<string, any>
  ipAddress?: string
  userAgent?: string
}

export interface AuditLogFilter {
  userId?: string
  entityType?: string
  entityId?: string
  action?: string
  dateFrom?: Date
  dateTo?: Date
  limit?: number
  offset?: number
}

export interface AuditLogSummary {
  totalEntries: number
  byEntityType: Record<string, number>
  byAction: Record<string, number>
  byUser: Record<string, number>
  recentActivity: AuditLogEntry[]
}

/**
 * Audit Logging Service
 * Handles comprehensive audit logging for all entity operations
 */
export class AuditLoggingService {
  
  /**
   * Log an audit entry
   */
  async logAuditEntry(input: AuditLogCreateInput): Promise<AuditLogEntry> {
    try {
      console.log(`📝 Logging audit entry: ${input.action} ${input.entityType}:${input.entityId}`)

      // Create audit log entry
      const auditEntry = await db.auditLog.create({
        data: {
          userId: input.userId,
          entityType: input.entityType,
          entityId: input.entityId,
          action: input.action,
          oldValues: input.oldValues ? JSON.stringify(input.oldValues) : null,
          newValues: input.newValues ? JSON.stringify(input.newValues) : null,
          changes: input.changes ? JSON.stringify(input.changes) : null,
          metadata: input.metadata ? JSON.stringify(input.metadata) : null,
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
          timestamp: new Date()
        }
      })

      console.log(`✅ Audit entry logged (ID: ${auditEntry.id})`)

      return this.transformAuditEntry(auditEntry)

    } catch (error) {
      console.error('Error logging audit entry:', error)
      throw error
    }
  }

  /**
   * Log entity creation
   */
  async logEntityCreation(
    userId: string,
    entityType: AuditLogCreateInput['entityType'],
    entityId: string,
    newValues: Record<string, any>,
    metadata?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<AuditLogEntry> {
    return this.logAuditEntry({
      userId,
      entityType,
      entityId,
      action: 'CREATE',
      newValues,
      metadata,
      ipAddress,
      userAgent
    })
  }

  /**
   * Log entity update
   */
  async logEntityUpdate(
    userId: string,
    entityType: AuditLogCreateInput['entityType'],
    entityId: string,
    oldValues: Record<string, any>,
    newValues: Record<string, any>,
    changes: Record<string, { old: any; new: any }>,
    metadata?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<AuditLogEntry> {
    return this.logAuditEntry({
      userId,
      entityType,
      entityId,
      action: 'UPDATE',
      oldValues,
      newValues,
      changes,
      metadata,
      ipAddress,
      userAgent
    })
  }

  /**
   * Log entity deletion
   */
  async logEntityDeletion(
    userId: string,
    entityType: AuditLogCreateInput['entityType'],
    entityId: string,
    oldValues: Record<string, any>,
    metadata?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<AuditLogEntry> {
    return this.logAuditEntry({
      userId,
      entityType,
      entityId,
      action: 'DELETE',
      oldValues,
      metadata,
      ipAddress,
      userAgent
    })
  }

  /**
   * Log entity view
   */
  async logEntityView(
    userId: string,
    entityType: AuditLogCreateInput['entityType'],
    entityId: string,
    metadata?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<AuditLogEntry> {
    return this.logAuditEntry({
      userId,
      entityType,
      entityId,
      action: 'VIEW',
      metadata,
      ipAddress,
      userAgent
    })
  }

  /**
   * Log entity assignment
   */
  async logEntityAssignment(
    userId: string,
    entityType: AuditLogCreateInput['entityType'],
    entityId: string,
    oldAssignee: string | null,
    newAssignee: string | null,
    metadata?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<AuditLogEntry> {
    return this.logAuditEntry({
      userId,
      entityType,
      entityId,
      action: 'ASSIGN',
      oldValues: { assignedTo: oldAssignee },
      newValues: { assignedTo: newAssignee },
      changes: { assignedTo: { old: oldAssignee, new: newAssignee } },
      metadata,
      ipAddress,
      userAgent
    })
  }

  /**
   * Log status change
   */
  async logStatusChange(
    userId: string,
    entityType: AuditLogCreateInput['entityType'],
    entityId: string,
    oldStatus: string,
    newStatus: string,
    metadata?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<AuditLogEntry> {
    return this.logAuditEntry({
      userId,
      entityType,
      entityId,
      action: 'STATUS_CHANGE',
      oldValues: { status: oldStatus },
      newValues: { status: newStatus },
      changes: { status: { old: oldStatus, new: newStatus } },
      metadata,
      ipAddress,
      userAgent
    })
  }

  /**
   * Get audit logs with filtering
   */
  async getAuditLogs(filter: AuditLogFilter): Promise<AuditLogEntry[]> {
    try {
      const where = this.buildWhereClause(filter)
      
      const auditLogs = await db.auditLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip: filter.offset || 0,
        take: filter.limit || 50
      })

      return auditLogs.map(log => this.transformAuditEntry(log))

    } catch (error) {
      console.error('Error getting audit logs:', error)
      return []
    }
  }

  /**
   * Get audit logs for specific entity
   */
  async getEntityAuditLogs(
    entityType: string,
    entityId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<AuditLogEntry[]> {
    try {
      const auditLogs = await db.auditLog.findMany({
        where: {
          entityType,
          entityId
        },
        orderBy: { timestamp: 'desc' },
        skip: offset,
        take: limit
      })

      return auditLogs.map(log => this.transformAuditEntry(log))

    } catch (error) {
      console.error('Error getting entity audit logs:', error)
      return []
    }
  }

  /**
   * Get audit logs for specific user
   */
  async getUserAuditLogs(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<AuditLogEntry[]> {
    try {
      const auditLogs = await db.auditLog.findMany({
        where: { userId },
        orderBy: { timestamp: 'desc' },
        skip: offset,
        take: limit
      })

      return auditLogs.map(log => this.transformAuditEntry(log))

    } catch (error) {
      console.error('Error getting user audit logs:', error)
      return []
    }
  }

  /**
   * Get audit log summary
   */
  async getAuditLogSummary(
    dateFrom?: Date,
    dateTo?: Date
  ): Promise<AuditLogSummary> {
    try {
      const where: Prisma.AuditLogWhereInput = {}
      
      if (dateFrom || dateTo) {
        where.timestamp = {}
        if (dateFrom) where.timestamp.gte = dateFrom
        if (dateTo) where.timestamp.lte = dateTo
      }

      const [
        totalEntries,
        byEntityType,
        byAction,
        byUser,
        recentActivity
      ] = await Promise.all([
        db.auditLog.count({ where }),
        db.auditLog.groupBy({
          by: ['entityType'],
          where,
          _count: { entityType: true }
        }),
        db.auditLog.groupBy({
          by: ['action'],
          where,
          _count: { action: true }
        }),
        db.auditLog.groupBy({
          by: ['userId'],
          where,
          _count: { userId: true }
        }),
        db.auditLog.findMany({
          where,
          orderBy: { timestamp: 'desc' },
          take: 10
        })
      ])

      return {
        totalEntries,
        byEntityType: byEntityType.reduce((acc, item) => ({
          ...acc,
          [item.entityType]: item._count.entityType
        }), {}),
        byAction: byAction.reduce((acc, item) => ({
          ...acc,
          [item.action]: item._count.action
        }), {}),
        byUser: byUser.reduce((acc, item) => ({
          ...acc,
          [item.userId]: item._count.userId
        }), {}),
        recentActivity: recentActivity.map(log => this.transformAuditEntry(log))
      }

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
   * Get audit logs by date range
   */
  async getAuditLogsByDateRange(
    dateFrom: Date,
    dateTo: Date,
    limit: number = 100,
    offset: number = 0
  ): Promise<AuditLogEntry[]> {
    try {
      const auditLogs = await db.auditLog.findMany({
        where: {
          timestamp: {
            gte: dateFrom,
            lte: dateTo
          }
        },
        orderBy: { timestamp: 'desc' },
        skip: offset,
        take: limit
      })

      return auditLogs.map(log => this.transformAuditEntry(log))

    } catch (error) {
      console.error('Error getting audit logs by date range:', error)
      return []
    }
  }

  /**
   * Search audit logs
   */
  async searchAuditLogs(
    query: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<AuditLogEntry[]> {
    try {
      const auditLogs = await db.auditLog.findMany({
        where: {
          OR: [
            { entityType: { contains: query, mode: 'insensitive' } },
            { action: { contains: query, mode: 'insensitive' } },
            { entityId: { contains: query, mode: 'insensitive' } },
            { metadata: { contains: query, mode: 'insensitive' } }
          ]
        },
        orderBy: { timestamp: 'desc' },
        skip: offset,
        take: limit
      })

      return auditLogs.map(log => this.transformAuditEntry(log))

    } catch (error) {
      console.error('Error searching audit logs:', error)
      return []
    }
  }

  /**
   * Delete old audit logs
   */
  async deleteOldAuditLogs(olderThanDays: number = 365): Promise<number> {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays)

      const result = await db.auditLog.deleteMany({
        where: {
          timestamp: {
            lt: cutoffDate
          }
        }
      })

      console.log(`🗑️ Deleted ${result.count} old audit logs`)

      return result.count

    } catch (error) {
      console.error('Error deleting old audit logs:', error)
      throw error
    }
  }

  /**
   * Export audit logs
   */
  async exportAuditLogs(
    filter: AuditLogFilter,
    format: 'JSON' | 'CSV' = 'JSON'
  ): Promise<string> {
    try {
      const auditLogs = await this.getAuditLogs(filter)

      if (format === 'JSON') {
        return JSON.stringify(auditLogs, null, 2)
      } else if (format === 'CSV') {
        return this.convertToCSV(auditLogs)
      }

      throw new Error(`Unsupported format: ${format}`)

    } catch (error) {
      console.error('Error exporting audit logs:', error)
      throw error
    }
  }

  /**
   * Build where clause for filtering
   */
  private buildWhereClause(filter: AuditLogFilter): Prisma.AuditLogWhereInput {
    const where: Prisma.AuditLogWhereInput = {}

    if (filter.userId) {
      where.userId = filter.userId
    }

    if (filter.entityType) {
      where.entityType = filter.entityType
    }

    if (filter.entityId) {
      where.entityId = filter.entityId
    }

    if (filter.action) {
      where.action = filter.action
    }

    if (filter.dateFrom || filter.dateTo) {
      where.timestamp = {}
      if (filter.dateFrom) where.timestamp.gte = filter.dateFrom
      if (filter.dateTo) where.timestamp.lte = filter.dateTo
    }

    return where
  }

  /**
   * Transform audit log from database format
   */
  private transformAuditEntry(auditLog: any): AuditLogEntry {
    return {
      id: auditLog.id,
      userId: auditLog.userId,
      entityType: auditLog.entityType,
      entityId: auditLog.entityId,
      action: auditLog.action,
      oldValues: auditLog.oldValues ? JSON.parse(auditLog.oldValues) : undefined,
      newValues: auditLog.newValues ? JSON.parse(auditLog.newValues) : undefined,
      changes: auditLog.changes ? JSON.parse(auditLog.changes) : undefined,
      metadata: auditLog.metadata ? JSON.parse(auditLog.metadata) : undefined,
      ipAddress: auditLog.ipAddress,
      userAgent: auditLog.userAgent,
      timestamp: auditLog.timestamp
    }
  }

  /**
   * Convert audit logs to CSV format
   */
  private convertToCSV(auditLogs: AuditLogEntry[]): string {
    if (auditLogs.length === 0) {
      return 'No audit logs found'
    }

    const headers = [
      'ID',
      'User ID',
      'Entity Type',
      'Entity ID',
      'Action',
      'Timestamp',
      'IP Address',
      'User Agent'
    ]

    const rows = auditLogs.map(log => [
      log.id,
      log.userId,
      log.entityType,
      log.entityId,
      log.action,
      log.timestamp.toISOString(),
      log.ipAddress || '',
      log.userAgent || ''
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n')

    return csvContent
  }

  /**
   * Get audit log statistics
   */
  async getAuditLogStatistics(
    dateFrom?: Date,
    dateTo?: Date
  ): Promise<{
    totalLogs: number
    logsByDay: Record<string, number>
    logsByHour: Record<string, number>
    topUsers: Array<{ userId: string; count: number }>
    topEntities: Array<{ entityType: string; count: number }>
    topActions: Array<{ action: string; count: number }>
  }> {
    try {
      const where: Prisma.AuditLogWhereInput = {}
      
      if (dateFrom || dateTo) {
        where.timestamp = {}
        if (dateFrom) where.timestamp.gte = dateFrom
        if (dateTo) where.timestamp.lte = dateTo
      }

      const [
        totalLogs,
        logsByDay,
        logsByHour,
        topUsers,
        topEntities,
        topActions
      ] = await Promise.all([
        db.auditLog.count({ where }),
        this.getLogsByDay(where),
        this.getLogsByHour(where),
        this.getTopUsers(where),
        this.getTopEntities(where),
        this.getTopActions(where)
      ])

      return {
        totalLogs,
        logsByDay,
        logsByHour,
        topUsers,
        topEntities,
        topActions
      }

    } catch (error) {
      console.error('Error getting audit log statistics:', error)
      return {
        totalLogs: 0,
        logsByDay: {},
        logsByHour: {},
        topUsers: [],
        topEntities: [],
        topActions: []
      }
    }
  }

  /**
   * Get logs grouped by day
   */
  private async getLogsByDay(where: Prisma.AuditLogWhereInput): Promise<Record<string, number>> {
    const logs = await db.auditLog.findMany({
      where,
      select: { timestamp: true }
    })

    const logsByDay: Record<string, number> = {}
    
    logs.forEach(log => {
      const day = log.timestamp.toISOString().split('T')[0]
      logsByDay[day] = (logsByDay[day] || 0) + 1
    })

    return logsByDay
  }

  /**
   * Get logs grouped by hour
   */
  private async getLogsByHour(where: Prisma.AuditLogWhereInput): Promise<Record<string, number>> {
    const logs = await db.auditLog.findMany({
      where,
      select: { timestamp: true }
    })

    const logsByHour: Record<string, number> = {}
    
    logs.forEach(log => {
      const hour = log.timestamp.getHours().toString().padStart(2, '0')
      logsByHour[hour] = (logsByHour[hour] || 0) + 1
    })

    return logsByHour
  }

  /**
   * Get top users by log count
   */
  private async getTopUsers(where: Prisma.AuditLogWhereInput): Promise<Array<{ userId: string; count: number }>> {
    const users = await db.auditLog.groupBy({
      by: ['userId'],
      where,
      _count: { userId: true },
      orderBy: { _count: { userId: 'desc' } },
      take: 10
    })

    return users.map(user => ({
      userId: user.userId,
      count: user._count.userId
    }))
  }

  /**
   * Get top entities by log count
   */
  private async getTopEntities(where: Prisma.AuditLogWhereInput): Promise<Array<{ entityType: string; count: number }>> {
    const entities = await db.auditLog.groupBy({
      by: ['entityType'],
      where,
      _count: { entityType: true },
      orderBy: { _count: { entityType: 'desc' } },
      take: 10
    })

    return entities.map(entity => ({
      entityType: entity.entityType,
      count: entity._count.entityType
    }))
  }

  /**
   * Get top actions by log count
   */
  private async getTopActions(where: Prisma.AuditLogWhereInput): Promise<Array<{ action: string; count: number }>> {
    const actions = await db.auditLog.groupBy({
      by: ['action'],
      where,
      _count: { action: true },
      orderBy: { _count: { action: 'desc' } },
      take: 10
    })

    return actions.map(action => ({
      action: action.action,
      count: action._count.action
    }))
  }
}

// Export singleton instance
export const auditLoggingService = new AuditLoggingService()
