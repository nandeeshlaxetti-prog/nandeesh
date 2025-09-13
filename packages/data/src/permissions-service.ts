import { db } from './index'

export interface UserPermissions {
  userId: string
  role: 'ADMIN' | 'PARTNER' | 'LAWYER' | 'PARALEGAL' | 'CLIENT' | 'SUPPORT'
  teams: string[]
  cases: string[]
  canViewAll: boolean
  canEditAll: boolean
  canDeleteAll: boolean
  canViewPII: boolean
  canEditPII: boolean
  canViewAuditLogs: boolean
  canExportData: boolean
  canManageUsers: boolean
  canManageTeams: boolean
  canManageCases: boolean
  canManageTasks: boolean
  canManageHearings: boolean
  canManageOrders: boolean
  canManageDocuments: boolean
}

export interface PermissionCheck {
  allowed: boolean
  reason?: string
  scopedData?: boolean
  hiddenFields?: string[]
}

export interface PIIFieldConfig {
  field: string
  hideForRoles: string[]
  maskForRoles: string[]
  maskPattern?: string
}

/**
 * Permissions Service
 * Handles role-based permissions and PII field hiding
 */
export class PermissionsService {
  
  private piiFieldConfigs: PIIFieldConfig[] = [
    // User PII fields
    { field: 'email', hideForRoles: ['CLIENT'], maskForRoles: ['PARALEGAL'] },
    { field: 'phone', hideForRoles: ['CLIENT'], maskForRoles: ['PARALEGAL'] },
    { field: 'address', hideForRoles: ['CLIENT'], maskForRoles: ['PARALEGAL'] },
    { field: 'dateOfBirth', hideForRoles: ['CLIENT'], maskForRoles: ['PARALEGAL'] },
    { field: 'salary', hideForRoles: ['CLIENT', 'PARALEGAL'], maskForRoles: ['LAWYER'] },
    { field: 'passwordHash', hideForRoles: ['CLIENT', 'PARALEGAL', 'LAWYER'], maskForRoles: [] },
    
    // Case PII fields
    { field: 'clientId', hideForRoles: [], maskForRoles: ['PARALEGAL'] },
    { field: 'caseValue', hideForRoles: ['CLIENT'], maskForRoles: ['PARALEGAL'] },
    { field: 'isConfidential', hideForRoles: ['CLIENT'], maskForRoles: ['PARALEGAL'] },
    
    // Document PII fields
    { field: 'uploadedBy', hideForRoles: [], maskForRoles: ['PARALEGAL'] },
    { field: 'mimeType', hideForRoles: [], maskForRoles: ['PARALEGAL'] },
    
    // Task PII fields
    { field: 'assignedTo', hideForRoles: [], maskForRoles: ['PARALEGAL'] },
    { field: 'createdBy', hideForRoles: [], maskForRoles: ['PARALEGAL'] },
    { field: 'isConfidential', hideForRoles: ['CLIENT'], maskForRoles: ['PARALEGAL'] },
    
    // Hearing PII fields
    { field: 'scheduledDate', hideForRoles: [], maskForRoles: ['PARALEGAL'] },
    { field: 'location', hideForRoles: [], maskForRoles: ['PARALEGAL'] },
    
    // Order PII fields
    { field: 'orderNumber', hideForRoles: [], maskForRoles: ['PARALEGAL'] },
    { field: 'orderDate', hideForRoles: [], maskForRoles: ['PARALEGAL'] },
    { field: 'effectiveDate', hideForRoles: [], maskForRoles: ['PARALEGAL'] }
  ]

  /**
   * Get user permissions
   */
  async getUserPermissions(userId: string): Promise<UserPermissions> {
    try {
      const user = await db.user.findUnique({
        where: { id: userId },
        include: {
          teamMemberships: {
            include: {
              team: true
            }
          },
          assignedCases: {
            select: { id: true }
          },
          clientCases: {
            select: { id: true }
          }
        }
      })

      if (!user) {
        throw new Error(`User not found: ${userId}`)
      }

      const role = user.role as UserPermissions['role']
      const teams = user.teamMemberships.map(membership => membership.teamId)
      const cases = [...user.assignedCases.map(c => c.id), ...user.clientCases.map(c => c.id)]

      // Determine permissions based on role
      const permissions: UserPermissions = {
        userId,
        role,
        teams,
        cases,
        canViewAll: role === 'ADMIN' || role === 'PARTNER',
        canEditAll: role === 'ADMIN' || role === 'PARTNER',
        canDeleteAll: role === 'ADMIN',
        canViewPII: role === 'ADMIN' || role === 'PARTNER' || role === 'LAWYER',
        canEditPII: role === 'ADMIN' || role === 'PARTNER',
        canViewAuditLogs: role === 'ADMIN' || role === 'PARTNER',
        canExportData: role === 'ADMIN' || role === 'PARTNER',
        canManageUsers: role === 'ADMIN',
        canManageTeams: role === 'ADMIN' || role === 'PARTNER',
        canManageCases: role === 'ADMIN' || role === 'PARTNER' || role === 'LAWYER',
        canManageTasks: role === 'ADMIN' || role === 'PARTNER' || role === 'LAWYER',
        canManageHearings: role === 'ADMIN' || role === 'PARTNER' || role === 'LAWYER',
        canManageOrders: role === 'ADMIN' || role === 'PARTNER' || role === 'LAWYER',
        canManageDocuments: role === 'ADMIN' || role === 'PARTNER' || role === 'LAWYER'
      }

      return permissions

    } catch (error) {
      console.error('Error getting user permissions:', error)
      throw error
    }
  }

  /**
   * Check if user can view entity
   */
  async canViewEntity(
    userId: string,
    entityType: 'CASE' | 'TASK' | 'HEARING' | 'ORDER' | 'DOCUMENT',
    entityId: string
  ): Promise<PermissionCheck> {
    try {
      const permissions = await this.getUserPermissions(userId)

      // Partners and admins can view all
      if (permissions.canViewAll) {
        return { allowed: true }
      }

      // Check entity-specific permissions
      const entity = await this.getEntityWithRelations(entityType, entityId)
      if (!entity) {
        return { allowed: false, reason: 'Entity not found' }
      }

      // Check if user has access to the entity
      const hasAccess = await this.checkEntityAccess(userId, entityType, entity, permissions)
      
      if (!hasAccess) {
        return { allowed: false, reason: 'Access denied' }
      }

      return { allowed: true, scopedData: true }

    } catch (error) {
      console.error('Error checking view permission:', error)
      return { allowed: false, reason: 'Permission check failed' }
    }
  }

  /**
   * Check if user can edit entity
   */
  async canEditEntity(
    userId: string,
    entityType: 'CASE' | 'TASK' | 'HEARING' | 'ORDER' | 'DOCUMENT',
    entityId: string
  ): Promise<PermissionCheck> {
    try {
      const permissions = await this.getUserPermissions(userId)

      // Partners and admins can edit all
      if (permissions.canEditAll) {
        return { allowed: true }
      }

      // Check entity-specific permissions
      const entity = await this.getEntityWithRelations(entityType, entityId)
      if (!entity) {
        return { allowed: false, reason: 'Entity not found' }
      }

      // Check if user has access to the entity
      const hasAccess = await this.checkEntityAccess(userId, entityType, entity, permissions)
      
      if (!hasAccess) {
        return { allowed: false, reason: 'Access denied' }
      }

      // Check role-specific edit permissions
      if (!this.canRoleEditEntity(permissions.role, entityType)) {
        return { allowed: false, reason: 'Role cannot edit this entity type' }
      }

      return { allowed: true, scopedData: true }

    } catch (error) {
      console.error('Error checking edit permission:', error)
      return { allowed: false, reason: 'Permission check failed' }
    }
  }

  /**
   * Check if user can delete entity
   */
  async canDeleteEntity(
    userId: string,
    entityType: 'CASE' | 'TASK' | 'HEARING' | 'ORDER' | 'DOCUMENT',
    entityId: string
  ): Promise<PermissionCheck> {
    try {
      const permissions = await this.getUserPermissions(userId)

      // Only admins can delete
      if (!permissions.canDeleteAll) {
        return { allowed: false, reason: 'Only admins can delete entities' }
      }

      return { allowed: true }

    } catch (error) {
      console.error('Error checking delete permission:', error)
      return { allowed: false, reason: 'Permission check failed' }
    }
  }

  /**
   * Filter entity data based on user permissions
   */
  async filterEntityData(
    userId: string,
    entityType: 'CASE' | 'TASK' | 'HEARING' | 'ORDER' | 'DOCUMENT',
    entityData: any
  ): Promise<any> {
    try {
      const permissions = await this.getUserPermissions(userId)
      const hiddenFields = this.getHiddenFields(permissions.role, entityType)

      // Remove hidden fields
      const filteredData = { ...entityData }
      hiddenFields.forEach(field => {
        delete filteredData[field]
      })

      // Mask sensitive fields if needed
      const maskedData = this.maskSensitiveFields(filteredData, permissions.role, entityType)

      return maskedData

    } catch (error) {
      console.error('Error filtering entity data:', error)
      return entityData
    }
  }

  /**
   * Filter audit log data based on user permissions
   */
  async filterAuditLogData(
    userId: string,
    auditLogs: any[]
  ): Promise<any[]> {
    try {
      const permissions = await this.getUserPermissions(userId)

      // Partners can see all audit logs
      if (permissions.canViewAuditLogs) {
        return auditLogs
      }

      // Others can only see their own audit logs
      return auditLogs.filter(log => log.userId === userId)

    } catch (error) {
      console.error('Error filtering audit log data:', error)
      return []
    }
  }

  /**
   * Get hidden fields for role and entity type
   */
  private getHiddenFields(role: string, entityType: string): string[] {
    return this.piiFieldConfigs
      .filter(config => config.hideForRoles.includes(role))
      .map(config => config.field)
  }

  /**
   * Mask sensitive fields for role and entity type
   */
  private maskSensitiveFields(data: any, role: string, entityType: string): any {
    const maskedData = { ...data }

    this.piiFieldConfigs
      .filter(config => config.maskForRoles.includes(role))
      .forEach(config => {
        if (maskedData[config.field]) {
          maskedData[config.field] = this.maskValue(maskedData[config.field], config.maskPattern)
        }
      })

    return maskedData
  }

  /**
   * Mask a value with pattern
   */
  private maskValue(value: any, pattern?: string): string {
    if (typeof value !== 'string') {
      return '***'
    }

    if (pattern) {
      return pattern.replace(/\*/g, '*')
    }

    // Default masking
    if (value.length <= 4) {
      return '***'
    }

    return value.substring(0, 2) + '***' + value.substring(value.length - 2)
  }

  /**
   * Check if role can edit entity type
   */
  private canRoleEditEntity(role: string, entityType: string): boolean {
    switch (role) {
      case 'ADMIN':
        return true
      case 'PARTNER':
        return true
      case 'LAWYER':
        return ['CASE', 'TASK', 'HEARING', 'ORDER', 'DOCUMENT'].includes(entityType)
      case 'PARALEGAL':
        return ['TASK', 'DOCUMENT'].includes(entityType)
      case 'CLIENT':
        return false
      case 'SUPPORT':
        return false
      default:
        return false
    }
  }

  /**
   * Get entity with relations for permission checking
   */
  private async getEntityWithRelations(entityType: string, entityId: string): Promise<any> {
    switch (entityType) {
      case 'CASE':
        return await db.case.findUnique({
          where: { id: entityId },
          include: {
            assignedLawyer: true,
            team: true,
            client: true
          }
        })
      case 'TASK':
        return await db.task.findUnique({
          where: { id: entityId },
          include: {
            case: {
              include: {
                assignedLawyer: true,
                team: true
              }
            },
            assignee: true
          }
        })
      case 'HEARING':
        return await db.hearing.findUnique({
          where: { id: entityId },
          include: {
            case: {
              include: {
                assignedLawyer: true,
                team: true
              }
            }
          }
        })
      case 'ORDER':
        return await db.order.findUnique({
          where: { id: entityId },
          include: {
            case: {
              include: {
                assignedLawyer: true,
                team: true
              }
            }
          }
        })
      case 'DOCUMENT':
        return await db.document.findUnique({
          where: { id: entityId },
          include: {
            case: {
              include: {
                assignedLawyer: true,
                team: true
              }
            },
            uploader: true
          }
        })
      default:
        return null
    }
  }

  /**
   * Check if user has access to entity
   */
  private async checkEntityAccess(
    userId: string,
    entityType: string,
    entity: any,
    permissions: UserPermissions
  ): Promise<boolean> {
    // Check if user is directly assigned
    if (entity.assignedLawyerId === userId || entity.assignedTo === userId || entity.uploadedBy === userId) {
      return true
    }

    // Check if user is the client
    if (entity.clientId === userId) {
      return true
    }

    // Check team access
    if (entity.teamId && permissions.teams.includes(entity.teamId)) {
      return true
    }

    // Check case access
    if (entity.caseId && permissions.cases.includes(entity.caseId)) {
      return true
    }

    // Check if user is team lead
    if (entity.team?.leadId === userId) {
      return true
    }

    return false
  }

  /**
   * Check if user can view audit logs
   */
  async canViewAuditLogs(userId: string): Promise<boolean> {
    try {
      const permissions = await this.getUserPermissions(userId)
      return permissions.canViewAuditLogs
    } catch (error) {
      console.error('Error checking audit log permission:', error)
      return false
    }
  }

  /**
   * Check if user can export data
   */
  async canExportData(userId: string): Promise<boolean> {
    try {
      const permissions = await this.getUserPermissions(userId)
      return permissions.canExportData
    } catch (error) {
      console.error('Error checking export permission:', error)
      return false
    }
  }

  /**
   * Check if user can manage users
   */
  async canManageUsers(userId: string): Promise<boolean> {
    try {
      const permissions = await this.getUserPermissions(userId)
      return permissions.canManageUsers
    } catch (error) {
      console.error('Error checking user management permission:', error)
      return false
    }
  }

  /**
   * Check if user can manage teams
   */
  async canManageTeams(userId: string): Promise<boolean> {
    try {
      const permissions = await this.getUserPermissions(userId)
      return permissions.canManageTeams
    } catch (error) {
      console.error('Error checking team management permission:', error)
      return false
    }
  }

  /**
   * Get user's accessible entities
   */
  async getUserAccessibleEntities(userId: string): Promise<{
    cases: string[]
    tasks: string[]
    hearings: string[]
    orders: string[]
    documents: string[]
  }> {
    try {
      const permissions = await this.getUserPermissions(userId)

      if (permissions.canViewAll) {
        // Partners and admins can see all
        const [cases, tasks, hearings, orders, documents] = await Promise.all([
          db.case.findMany({ select: { id: true } }),
          db.task.findMany({ select: { id: true } }),
          db.hearing.findMany({ select: { id: true } }),
          db.order.findMany({ select: { id: true } }),
          db.document.findMany({ select: { id: true } })
        ])

        return {
          cases: cases.map(c => c.id),
          tasks: tasks.map(t => t.id),
          hearings: hearings.map(h => h.id),
          orders: orders.map(o => o.id),
          documents: documents.map(d => d.id)
        }
      }

      // Get user's accessible entities
      const [cases, tasks, hearings, orders, documents] = await Promise.all([
        db.case.findMany({
          where: {
            OR: [
              { assignedLawyerId: userId },
              { clientId: userId },
              { teamId: { in: permissions.teams } }
            ]
          },
          select: { id: true }
        }),
        db.task.findMany({
          where: {
            OR: [
              { assignedTo: userId },
              { createdBy: userId },
              { case: { teamId: { in: permissions.teams } } }
            ]
          },
          select: { id: true }
        }),
        db.hearing.findMany({
          where: {
            case: {
              OR: [
                { assignedLawyerId: userId },
                { clientId: userId },
                { teamId: { in: permissions.teams } }
              ]
            }
          },
          select: { id: true }
        }),
        db.order.findMany({
          where: {
            case: {
              OR: [
                { assignedLawyerId: userId },
                { clientId: userId },
                { teamId: { in: permissions.teams } }
              ]
            }
          },
          select: { id: true }
        }),
        db.document.findMany({
          where: {
            OR: [
              { uploadedBy: userId },
              { case: { teamId: { in: permissions.teams } } }
            ]
          },
          select: { id: true }
        })
      ])

      return {
        cases: cases.map(c => c.id),
        tasks: tasks.map(t => t.id),
        hearings: hearings.map(h => h.id),
        orders: orders.map(o => o.id),
        documents: documents.map(d => d.id)
      }

    } catch (error) {
      console.error('Error getting user accessible entities:', error)
      return {
        cases: [],
        tasks: [],
        hearings: [],
        orders: [],
        documents: []
      }
    }
  }

  /**
   * Update PII field configuration
   */
  updatePIIFieldConfig(config: PIIFieldConfig): void {
    const existingIndex = this.piiFieldConfigs.findIndex(c => c.field === config.field)
    if (existingIndex >= 0) {
      this.piiFieldConfigs[existingIndex] = config
    } else {
      this.piiFieldConfigs.push(config)
    }
  }

  /**
   * Get PII field configuration
   */
  getPIIFieldConfigs(): PIIFieldConfig[] {
    return [...this.piiFieldConfigs]
  }
}

// Export singleton instance
export const permissionsService = new PermissionsService()
