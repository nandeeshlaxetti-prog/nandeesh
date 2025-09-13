import { db } from './index'
import { Prisma } from '@prisma/client'

export interface SLAConditions {
  entityType: string
  entitySubType?: string
  priority?: string
  teamId?: string
  customConditions?: Record<string, any>
}

export interface SLAMetrics {
  metricType: string // 'RESPONSE_TIME', 'RESOLUTION_TIME', 'UPTIME', 'CUSTOM'
  threshold: number
  unit: string // 'HOURS', 'DAYS', 'PERCENTAGE', 'COUNT'
  calculationMethod: string // 'SUM', 'AVERAGE', 'MAX', 'MIN', 'COUNT'
}

export interface SLAEscalationRule {
  level: number
  threshold: number
  action: string // 'NOTIFY', 'ASSIGN', 'ESCALATE', 'AUTO_RESOLVE'
  recipients: string[] // User IDs or roles
  message: string
}

export interface SLANotificationSettings {
  enabled: boolean
  channels: string[] // 'EMAIL', 'SMS', 'PUSH', 'IN_APP'
  recipients: string[] // User IDs or roles
  frequency: string // 'IMMEDIATE', 'HOURLY', 'DAILY', 'WEEKLY'
}

export interface SLAEvaluationResult {
  entityId: string
  entityType: string
  slaRuleId: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BREACHED' | 'ESCALATED'
  currentValue: number
  thresholdValue: number
  breachDate?: Date
  escalationDate?: Date
  resolutionDate?: Date
  notes?: string
  metadata?: Record<string, any>
}

export interface SLAEvaluationContext {
  entityId: string
  entityType: string
  entitySubType?: string
  priority?: string
  teamId?: string
  employeeId?: string
  customData?: Record<string, any>
}

/**
 * SLA Evaluator Service
 * Evaluates SLA compliance for various entities
 */
export class SLAEvaluatorService {
  
  /**
   * Evaluate SLA for a specific entity
   */
  async evaluateSLA(context: SLAEvaluationContext): Promise<SLAEvaluationResult[]> {
    try {
      // Find applicable SLA rules
      const applicableRules = await this.findApplicableRules(context)
      
      if (applicableRules.length === 0) {
        return []
      }
      
      const results: SLAEvaluationResult[] = []
      
      for (const rule of applicableRules) {
        const result = await this.evaluateRule(rule, context)
        if (result) {
          results.push(result)
          
          // Save evaluation to database
          await this.saveEvaluation(result, context.employeeId)
        }
      }
      
      return results
      
    } catch (error) {
      console.error('Error evaluating SLA:', error)
      throw error
    }
  }
  
  /**
   * Find applicable SLA rules for the context
   */
  private async findApplicableRules(context: SLAEvaluationContext) {
    const whereConditions: Prisma.SLARuleWhereInput = {
      isActive: true,
      entityType: context.entityType,
      AND: [
        {
          OR: [
            { entitySubType: null },
            { entitySubType: context.entitySubType }
          ]
        },
        {
          OR: [
            { priority: null },
            { priority: context.priority }
          ]
        },
        {
          OR: [
            { teamId: null },
            { teamId: context.teamId }
          ]
        }
      ]
    }
    
    return await db.sLARule.findMany({
      where: whereConditions,
      include: {
        team: true
      }
    })
  }
  
  /**
   * Evaluate a specific SLA rule
   */
  private async evaluateRule(rule: any, context: SLAEvaluationContext): Promise<SLAEvaluationResult | null> {
    try {
      const conditions = JSON.parse(rule.conditions) as SLAConditions
      const metrics = JSON.parse(rule.metrics) as SLAMetrics
      
      // Check if conditions are met
      if (!this.checkConditions(conditions, context)) {
        return null
      }
      
      // Calculate current metric value
      const currentValue = await this.calculateMetric(metrics, context)
      
      // Determine status
      const status = this.determineStatus(currentValue, metrics.threshold)
      
      const result: SLAEvaluationResult = {
        entityId: context.entityId,
        entityType: context.entityType,
        slaRuleId: rule.id,
        status,
        currentValue,
        thresholdValue: metrics.threshold,
        metadata: {
          ruleName: rule.name,
          metricType: metrics.metricType,
          unit: metrics.unit
        }
      }
      
      // Set breach/escalation dates
      if (status === 'BREACHED') {
        result.breachDate = new Date()
      } else if (status === 'ESCALATED') {
        result.escalationDate = new Date()
      } else if (status === 'COMPLETED') {
        result.resolutionDate = new Date()
      }
      
      return result
      
    } catch (error) {
      console.error('Error evaluating rule:', error)
      return null
    }
  }
  
  /**
   * Check if SLA conditions are met
   */
  private checkConditions(conditions: SLAConditions, context: SLAEvaluationContext): boolean {
    // Check entity type
    if (conditions.entityType !== context.entityType) {
      return false
    }
    
    // Check entity subtype
    if (conditions.entitySubType && conditions.entitySubType !== context.entitySubType) {
      return false
    }
    
    // Check priority
    if (conditions.priority && conditions.priority !== context.priority) {
      return false
    }
    
    // Check team
    if (conditions.teamId && conditions.teamId !== context.teamId) {
      return false
    }
    
    // Check custom conditions
    if (conditions.customConditions) {
      for (const [key, value] of Object.entries(conditions.customConditions)) {
        if (context.customData?.[key] !== value) {
          return false
        }
      }
    }
    
    return true
  }
  
  /**
   * Calculate metric value for the entity
   */
  private async calculateMetric(metrics: SLAMetrics, context: SLAEvaluationContext): Promise<number> {
    switch (metrics.metricType) {
      case 'RESPONSE_TIME':
        return await this.calculateResponseTime(context)
      
      case 'RESOLUTION_TIME':
        return await this.calculateResolutionTime(context)
      
      case 'UPTIME':
        return await this.calculateUptime(context)
      
      case 'CUSTOM':
        return await this.calculateCustomMetric(metrics, context)
      
      default:
        throw new Error(`Unknown metric type: ${metrics.metricType}`)
    }
  }
  
  /**
   * Calculate response time metric
   */
  private async calculateResponseTime(context: SLAEvaluationContext): Promise<number> {
    const entity = await this.getEntity(context.entityId, context.entityType)
    
    if (!entity) {
      return 0
    }
    
    const createdAt = entity.createdAt
    const now = new Date()
    
    // Calculate hours since creation
    const diffMs = now.getTime() - createdAt.getTime()
    return diffMs / (1000 * 60 * 60) // Convert to hours
  }
  
  /**
   * Calculate resolution time metric
   */
  private async calculateResolutionTime(context: SLAEvaluationContext): Promise<number> {
    const entity = await this.getEntity(context.entityId, context.entityType)
    
    if (!entity) {
      return 0
    }
    
    // Check if entity is resolved
    const resolvedAt = entity.actualCompletionDate || entity.completedAt || entity.resolutionDate
    
    if (!resolvedAt) {
      // Not resolved yet, calculate time since creation
      const createdAt = entity.createdAt
      const now = new Date()
      const diffMs = now.getTime() - createdAt.getTime()
      return diffMs / (1000 * 60 * 60) // Convert to hours
    }
    
    // Calculate resolution time
    const createdAt = entity.createdAt
    const diffMs = resolvedAt.getTime() - createdAt.getTime()
    return diffMs / (1000 * 60 * 60) // Convert to hours
  }
  
  /**
   * Calculate uptime metric
   */
  private async calculateUptime(context: SLAEvaluationContext): Promise<number> {
    // For uptime, we'll calculate based on entity status
    const entity = await this.getEntity(context.entityId, context.entityType)
    
    if (!entity) {
      return 0
    }
    
    // Simple uptime calculation based on status
    const activeStatuses = ['OPEN', 'IN_PROGRESS', 'ACTIVE', 'PENDING']
    const isActive = activeStatuses.includes(entity.status)
    
    return isActive ? 100 : 0 // Return percentage
  }
  
  /**
   * Calculate custom metric
   */
  private async calculateCustomMetric(metrics: SLAMetrics, context: SLAEvaluationContext): Promise<number> {
    // This would be implemented based on specific custom metric requirements
    // For now, return a default value
    return 0
  }
  
  /**
   * Get entity by ID and type
   */
  private async getEntity(entityId: string, entityType: string): Promise<any> {
    switch (entityType) {
      case 'CASE':
        return await db.case.findUnique({ where: { id: entityId } })
      
      case 'TASK':
        return await db.task.findUnique({ where: { id: entityId } })
      
      case 'HEARING':
        return await db.hearing.findUnique({ where: { id: entityId } })
      
      case 'ORDER':
        return await db.order.findUnique({ where: { id: entityId } })
      
      case 'PROJECT':
        return await db.project.findUnique({ where: { id: entityId } })
      
      default:
        throw new Error(`Unknown entity type: ${entityType}`)
    }
  }
  
  /**
   * Determine SLA status based on current value and threshold
   */
  private determineStatus(currentValue: number, threshold: number): 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BREACHED' | 'ESCALATED' {
    if (currentValue <= threshold * 0.8) {
      return 'COMPLETED'
    } else if (currentValue <= threshold) {
      return 'IN_PROGRESS'
    } else if (currentValue <= threshold * 1.2) {
      return 'BREACHED'
    } else {
      return 'ESCALATED'
    }
  }
  
  /**
   * Save SLA evaluation to database
   */
  private async saveEvaluation(result: SLAEvaluationResult, employeeId?: string) {
    try {
      await db.sLAEvaluation.create({
        data: {
          entityType: result.entityType,
          entityId: result.entityId,
          slaRuleId: result.slaRuleId,
          employeeId: employeeId,
          status: result.status,
          currentValue: result.currentValue,
          thresholdValue: result.thresholdValue,
          breachDate: result.breachDate,
          escalationDate: result.escalationDate,
          resolutionDate: result.resolutionDate,
          notes: result.notes,
          metadata: JSON.stringify(result.metadata || {})
        }
      })
    } catch (error) {
      console.error('Error saving SLA evaluation:', error)
    }
  }
  
  /**
   * Get SLA evaluations for an entity
   */
  async getEntityEvaluations(entityId: string, entityType: string) {
    return await db.sLAEvaluation.findMany({
      where: {
        entityId,
        entityType
      },
      include: {
        slaRule: true,
        employee: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }
  
  /**
   * Get SLA breach summary
   */
  async getSLABreachSummary(teamId?: string, dateRange?: { start: Date; end: Date }) {
    const whereConditions: Prisma.SLAEvaluationWhereInput = {
      status: {
        in: ['BREACHED', 'ESCALATED']
      }
    }
    
    if (teamId) {
      whereConditions.slaRule = {
        teamId
      }
    }
    
    if (dateRange) {
      whereConditions.createdAt = {
        gte: dateRange.start,
        lte: dateRange.end
      }
    }
    
    return await db.sLAEvaluation.findMany({
      where: whereConditions,
      include: {
        slaRule: true,
        employee: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }
  
  /**
   * Create default SLA rules
   */
  async createDefaultSLARules() {
    const defaultRules = [
      {
        name: 'Case Response Time - High Priority',
        description: 'High priority cases must be responded to within 4 hours',
        entityType: 'CASE',
        entitySubType: null,
        priority: 'HIGH',
        teamId: null,
        conditions: JSON.stringify({
          entityType: 'CASE',
          priority: 'HIGH'
        }),
        metrics: JSON.stringify({
          metricType: 'RESPONSE_TIME',
          threshold: 4,
          unit: 'HOURS',
          calculationMethod: 'SUM'
        }),
        escalationRules: JSON.stringify([
          {
            level: 1,
            threshold: 4,
            action: 'NOTIFY',
            recipients: ['assignedLawyer'],
            message: 'High priority case response time exceeded'
          },
          {
            level: 2,
            threshold: 8,
            action: 'ESCALATE',
            recipients: ['teamLead'],
            message: 'High priority case response time severely exceeded'
          }
        ]),
        notifications: JSON.stringify({
          enabled: true,
          channels: ['EMAIL', 'IN_APP'],
          recipients: ['assignedLawyer', 'teamLead'],
          frequency: 'IMMEDIATE'
        })
      },
      {
        name: 'Task Resolution Time - Medium Priority',
        description: 'Medium priority tasks must be resolved within 3 days',
        entityType: 'TASK',
        entitySubType: null,
        priority: 'MEDIUM',
        teamId: null,
        conditions: JSON.stringify({
          entityType: 'TASK',
          priority: 'MEDIUM'
        }),
        metrics: JSON.stringify({
          metricType: 'RESOLUTION_TIME',
          threshold: 72,
          unit: 'HOURS',
          calculationMethod: 'SUM'
        }),
        escalationRules: JSON.stringify([
          {
            level: 1,
            threshold: 72,
            action: 'NOTIFY',
            recipients: ['assignee'],
            message: 'Medium priority task resolution time exceeded'
          }
        ]),
        notifications: JSON.stringify({
          enabled: true,
          channels: ['IN_APP'],
          recipients: ['assignee'],
          frequency: 'DAILY'
        })
      },
      {
        name: 'Hearing Preparation Time',
        description: 'Hearings must be prepared within 2 days',
        entityType: 'HEARING',
        entitySubType: null,
        priority: null,
        teamId: null,
        conditions: JSON.stringify({
          entityType: 'HEARING'
        }),
        metrics: JSON.stringify({
          metricType: 'RESOLUTION_TIME',
          threshold: 48,
          unit: 'HOURS',
          calculationMethod: 'SUM'
        }),
        escalationRules: JSON.stringify([
          {
            level: 1,
            threshold: 48,
            action: 'NOTIFY',
            recipients: ['assignedLawyer'],
            message: 'Hearing preparation time exceeded'
          }
        ]),
        notifications: JSON.stringify({
          enabled: true,
          channels: ['EMAIL', 'IN_APP'],
          recipients: ['assignedLawyer'],
          frequency: 'IMMEDIATE'
        })
      }
    ]
    
    for (const rule of defaultRules) {
      try {
        await db.sLARule.create({
          data: rule
        })
      } catch (error) {
        console.error('Error creating default SLA rule:', error)
      }
    }
  }
}

// Export singleton instance
export const slaEvaluator = new SLAEvaluatorService()
