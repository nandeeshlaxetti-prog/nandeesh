import { db } from '../index'
import { Prisma } from '@prisma/client'
import { Employee, CreateEmployee, UpdateEmployee } from 'core'
import { Project, CreateProject, UpdateProject } from 'core'
import { SLARule, CreateSLARule, UpdateSLARule } from 'core'
import { SLAEvaluation, CreateSLAEvaluation, UpdateSLAEvaluation } from 'core'
import { mapEmployeeFromPrisma, mapProjectFromPrisma, mapSLARuleFromPrisma, mapSLAEvaluationFromPrisma } from '../type-mappers'

/**
 * Employee Repository
 * Handles employee data operations
 */
export class EmployeeRepository {
  
  async create(data: CreateEmployee): Promise<Employee> {
    const result = await db.employee.create({
      data: {
        ...data,
        skills: data.skills || '[]',
        certifications: data.certifications || '[]'
      },
      include: {
        user: true,
        reportingTo: true,
        reports: true
      }
    })
    
    return mapEmployeeFromPrisma(result)
  }
  
  async findById(id: string): Promise<Employee | null> {
    const result = await db.employee.findUnique({
      where: { id },
      include: {
        user: true,
        reportingTo: true,
        reports: true,
        teamMemberships: {
          include: {
            team: true
          }
        }
      }
    })
    
    return result ? mapEmployeeFromPrisma(result) : null
  }
  
  async findByEmployeeId(employeeId: string): Promise<Employee | null> {
    const result = await db.employee.findUnique({
      where: { employeeId },
      include: {
        user: true,
        reportingTo: true,
        reports: true
      }
    })
    
    return result ? mapEmployeeFromPrisma(result) : null
  }
  
  async findByUserId(userId: string): Promise<Employee | null> {
    return await db.employee.findUnique({
      where: { userId },
      include: {
        user: true,
        reportingTo: true,
        reports: true
      }
    })
  }
  
  async findMany(filters?: {
    department?: string
    designation?: string
    employmentType?: string
    isActive?: boolean
    reportingManager?: string
  }): Promise<Employee[]> {
    const where: Prisma.EmployeeWhereInput = {}
    
    if (filters?.department) {
      where.department = filters.department
    }
    if (filters?.designation) {
      where.designation = filters.designation
    }
    if (filters?.employmentType) {
      where.employmentType = filters.employmentType
    }
    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive
    }
    if (filters?.reportingManager) {
      where.reportingManager = filters.reportingManager
    }
    
    const results = await db.employee.findMany({
      where,
      include: {
        user: true,
        reportingTo: true,
        reports: true
      },
      orderBy: {
        employeeId: 'asc'
      }
    })
    
    return results.map(result => mapEmployeeFromPrisma(result))
  }
  
  async update(id: string, data: UpdateEmployee): Promise<Employee> {
    return await db.employee.update({
      where: { id },
      data,
      include: {
        user: true,
        reportingTo: true,
        reports: true
      }
    })
  }
  
  async delete(id: string): Promise<void> {
    await db.employee.delete({
      where: { id }
    })
  }
  
  async getReportingHierarchy(employeeId: string): Promise<Employee[]> {
    const employee = await this.findByEmployeeId(employeeId)
    if (!employee) {
      return []
    }
    
    const hierarchy: Employee[] = []
    let current = employee
    
    // Get all reports recursively
    const getReports = async (emp: Employee) => {
      const reports = await db.employee.findMany({
        where: {
          reportingManager: emp.employeeId,
          isActive: true
        },
        include: {
          user: true,
          reportingTo: true,
          reports: true
        }
      })
      
      for (const report of reports) {
        hierarchy.push(report)
        await getReports(report)
      }
    }
    
    await getReports(current)
    return hierarchy
  }
  
  async getDepartmentEmployees(department: string): Promise<Employee[]> {
    return await db.employee.findMany({
      where: {
        department,
        isActive: true
      },
      include: {
        user: true,
        reportingTo: true,
        reports: true
      },
      orderBy: {
        employeeId: 'asc'
      }
    })
  }
}

/**
 * Project Repository
 * Handles project data operations
 */
export class ProjectRepository {
  
  async create(data: CreateProject): Promise<Project> {
    return await db.project.create({
      data: {
        ...data,
        tags: data.tags || '[]',
        milestones: data.milestones || '[]',
        deliverables: data.deliverables || '[]',
        risks: data.risks || '[]'
      },
      include: {
        client: true,
        team: true,
        manager: true,
        cases: true
      }
    })
  }
  
  async findById(id: string): Promise<Project | null> {
    return await db.project.findUnique({
      where: { id },
      include: {
        client: true,
        team: true,
        manager: true,
        cases: true
      }
    })
  }
  
  async findByCode(code: string): Promise<Project | null> {
    return await db.project.findUnique({
      where: { code },
      include: {
        client: true,
        team: true,
        manager: true,
        cases: true
      }
    })
  }
  
  async findMany(filters?: {
    status?: string
    priority?: string
    type?: string
    clientId?: string
    teamId?: string
    managerId?: string
    isActive?: boolean
  }): Promise<Project[]> {
    const where: Prisma.ProjectWhereInput = {}
    
    if (filters?.status) {
      where.status = filters.status as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BREACHED' | 'ESCALATED'
    }
    if (filters?.priority) {
      where.priority = filters.priority
    }
    if (filters?.type) {
      where.type = filters.type
    }
    if (filters?.clientId) {
      where.clientId = filters.clientId
    }
    if (filters?.teamId) {
      where.teamId = filters.teamId
    }
    if (filters?.managerId) {
      where.managerId = filters.managerId
    }
    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive
    }
    
    return await db.project.findMany({
      where,
      include: {
        client: true,
        team: true,
        manager: true,
        cases: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }
  
  async update(id: string, data: UpdateProject): Promise<Project> {
    return await db.project.update({
      where: { id },
      data,
      include: {
        client: true,
        team: true,
        manager: true,
        cases: true
      }
    })
  }
  
  async delete(id: string): Promise<void> {
    await db.project.delete({
      where: { id }
    })
  }
  
  async getTeamProjects(teamId: string): Promise<Project[]> {
    return await db.project.findMany({
      where: {
        teamId,
        isActive: true
      },
      include: {
        client: true,
        team: true,
        manager: true,
        cases: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }
  
  async getClientProjects(clientId: string): Promise<Project[]> {
    return await db.project.findMany({
      where: {
        clientId,
        isActive: true
      },
      include: {
        client: true,
        team: true,
        manager: true,
        cases: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }
}

/**
 * SLA Rule Repository
 * Handles SLA rule data operations
 */
export class SLARuleRepository {
  
  async create(data: CreateSLARule): Promise<SLARule> {
    const result = await db.sLARule.create({
      data: {
        ...data,
        description: data.description || undefined,
        conditions: data.conditions || '{}',
        metrics: data.metrics || '{}',
        escalationRules: data.escalationRules || '[]',
        notifications: data.notifications || '{}'
      },
      include: {
        team: true,
        evaluations: true
      }
    })
    
    return {
      ...result,
      description: result.description || undefined
    } as SLARule
  }
  
  async findById(id: string): Promise<SLARule | null> {
    const result = await db.sLARule.findUnique({
      where: { id },
      include: {
        team: true,
        evaluations: true
      }
    })
    
    if (!result) return null
    
    return {
      ...result,
      description: result.description || undefined
    } as SLARule
  }
  
  async findMany(filters?: {
    entityType?: string
    entitySubType?: string
    priority?: string
    teamId?: string
    isActive?: boolean
  }): Promise<SLARule[]> {
    const where: Prisma.SLARuleWhereInput = {}
    
    if (filters?.entityType) {
      where.entityType = filters.entityType
    }
    if (filters?.entitySubType) {
      where.entitySubType = filters.entitySubType
    }
    if (filters?.priority) {
      where.priority = filters.priority
    }
    if (filters?.teamId) {
      where.teamId = filters.teamId
    }
    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive
    }
    
    const results = await db.sLARule.findMany({
      where,
      include: {
        team: true,
        evaluations: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return results.map(result => ({
      ...result,
      description: result.description || undefined
    })) as SLARule[]
  }
  
  async update(id: string, data: UpdateSLARule): Promise<SLARule> {
    const result = await db.sLARule.update({
      where: { id },
      data: {
        ...data,
        description: data.description || undefined
      },
      include: {
        team: true,
        evaluations: true
      }
    })
    
    return {
      ...result,
      description: result.description || undefined
    } as SLARule
  }
  
  async delete(id: string): Promise<void> {
    await db.sLARule.delete({
      where: { id }
    })
  }
  
  async getApplicableRules(context: {
    entityType: string
    entitySubType?: string
    priority?: string
    teamId?: string
  }): Promise<SLARule[]> {
    const where: Prisma.SLARuleWhereInput = {
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
    
    const results = await db.sLARule.findMany({
      where,
      include: {
        team: true
      },
      orderBy: {
        priority: 'desc'
      }
    })
    
    return results.map(result => ({
      ...result,
      description: result.description || undefined
    })) as SLARule[]
  }
  
  async getTeamSLARules(teamId: string): Promise<SLARule[]> {
    const results = await db.sLARule.findMany({
      where: {
        teamId,
        isActive: true
      },
      include: {
        team: true,
        evaluations: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return results.map(result => ({
      ...result,
      description: result.description || undefined
    })) as SLARule[]
  }
}

/**
 * SLA Evaluation Repository
 * Handles SLA evaluation data operations
 */
export class SLAEvaluationRepository {
  
  async create(data: CreateSLAEvaluation): Promise<SLAEvaluation> {
    const result = await db.sLAEvaluation.create({
      data: {
        ...data,
        metadata: data.metadata || '{}'
      },
      include: {
        slaRule: true,
        employee: {
          include: {
            user: true
          }
        }
      }
    })
    
    return {
      ...result,
      status: result.status as "PENDING" | "IN_PROGRESS" | "COMPLETED" | "BREACHED" | "ESCALATED",
      notes: result.notes || undefined,
      employeeId: result.employeeId || undefined,
      currentValue: result.currentValue || undefined,
      thresholdValue: result.thresholdValue || undefined,
      breachDate: result.breachDate || undefined,
      escalationDate: result.escalationDate || undefined,
      resolutionDate: result.resolutionDate || undefined
    }
  }
  
  async findById(id: string): Promise<SLAEvaluation | null> {
    const result = await db.sLAEvaluation.findUnique({
      where: { id },
      include: {
        slaRule: true,
        employee: {
          include: {
            user: true
          }
        }
      }
    })
    
    if (!result) return null
    
    return {
      ...result,
      status: result.status as "PENDING" | "IN_PROGRESS" | "COMPLETED" | "BREACHED" | "ESCALATED",
      notes: result.notes || undefined,
      employeeId: result.employeeId || undefined,
      currentValue: result.currentValue || undefined,
      thresholdValue: result.thresholdValue || undefined,
      breachDate: result.breachDate || undefined,
      escalationDate: result.escalationDate || undefined,
      resolutionDate: result.resolutionDate || undefined
    }
  }
  
  async findMany(filters?: {
    entityType?: string
    entityId?: string
    slaRuleId?: string
    employeeId?: string
    status?: string
  }): Promise<SLAEvaluation[]> {
    const where: Prisma.SLAEvaluationWhereInput = {}
    
    if (filters?.entityType) {
      where.entityType = filters.entityType
    }
    if (filters?.entityId) {
      where.entityId = filters.entityId
    }
    if (filters?.slaRuleId) {
      where.slaRuleId = filters.slaRuleId
    }
    if (filters?.employeeId) {
      where.employeeId = filters.employeeId
    }
    if (filters?.status) {
      where.status = filters.status as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BREACHED' | 'ESCALATED'
    }
    
    const results = await db.sLAEvaluation.findMany({
      where,
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
    
    return results.map(result => ({
      ...result,
      status: result.status as "PENDING" | "IN_PROGRESS" | "COMPLETED" | "BREACHED" | "ESCALATED",
      notes: result.notes || undefined,
      employeeId: result.employeeId || undefined,
      currentValue: result.currentValue || undefined,
      thresholdValue: result.thresholdValue || undefined,
      breachDate: result.breachDate || undefined,
      escalationDate: result.escalationDate || undefined,
      resolutionDate: result.resolutionDate || undefined
    }))
  }
  
  async update(id: string, data: UpdateSLAEvaluation): Promise<SLAEvaluation> {
    const result = await db.sLAEvaluation.update({
      where: { id },
      data,
      include: {
        slaRule: true,
        employee: {
          include: {
            user: true
          }
        }
      }
    })
    
    return {
      ...result,
      status: result.status as "PENDING" | "IN_PROGRESS" | "COMPLETED" | "BREACHED" | "ESCALATED",
      notes: result.notes || undefined,
      employeeId: result.employeeId || undefined,
      currentValue: result.currentValue || undefined,
      thresholdValue: result.thresholdValue || undefined,
      breachDate: result.breachDate || undefined,
      escalationDate: result.escalationDate || undefined,
      resolutionDate: result.resolutionDate || undefined
    }
  }
  
  async delete(id: string): Promise<void> {
    await db.sLAEvaluation.delete({
      where: { id }
    })
  }
  
  async getEntityEvaluations(entityId: string, entityType: string): Promise<SLAEvaluation[]> {
    const results = await db.sLAEvaluation.findMany({
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
    
    return results.map(result => ({
      ...result,
      status: result.status as "PENDING" | "IN_PROGRESS" | "COMPLETED" | "BREACHED" | "ESCALATED",
      notes: result.notes || undefined,
      employeeId: result.employeeId || undefined,
      currentValue: result.currentValue || undefined,
      thresholdValue: result.thresholdValue || undefined,
      breachDate: result.breachDate || undefined,
      escalationDate: result.escalationDate || undefined,
      resolutionDate: result.resolutionDate || undefined
    }))
  }
  
  async getBreachSummary(filters?: {
    teamId?: string
    startDate?: Date
    endDate?: Date
  }): Promise<SLAEvaluation[]> {
    const where: Prisma.SLAEvaluationWhereInput = {
      status: {
        in: ['BREACHED', 'ESCALATED']
      }
    }
    
    if (filters?.teamId) {
      where.slaRule = {
        teamId: filters.teamId
      }
    }
    
    if (filters?.startDate && filters?.endDate) {
      where.createdAt = {
        gte: filters.startDate,
        lte: filters.endDate
      }
    }
    
    const results = await db.sLAEvaluation.findMany({
      where,
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
    
    return results.map(result => ({
      ...result,
      status: result.status as "PENDING" | "IN_PROGRESS" | "COMPLETED" | "BREACHED" | "ESCALATED",
      notes: result.notes || undefined,
      employeeId: result.employeeId || undefined,
      currentValue: result.currentValue || undefined,
      thresholdValue: result.thresholdValue || undefined,
      breachDate: result.breachDate || undefined,
      escalationDate: result.escalationDate || undefined,
      resolutionDate: result.resolutionDate || undefined
    }))
  }
}

// Export repository instances
export const employeeRepository = new EmployeeRepository()
export const projectRepository = new ProjectRepository()
export const slaRuleRepository = new SLARuleRepository()
export const slaEvaluationRepository = new SLAEvaluationRepository()
