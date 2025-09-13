import { PrismaClient, Case, Prisma } from '@prisma/client'
import { BaseRepositoryImpl, PaginationOptions, PaginationResult, createPaginationResult } from './base'

export interface CaseCreateInput {
  caseNumber: string
  title: string
  description?: string
  status?: string
  priority?: string
  type?: string
  clientId: string
  assignedLawyerId?: string
  teamId?: string
  courtName?: string
  courtLocation?: string
  caseValue?: number
  currency?: string
  filingDate?: Date
  expectedCompletionDate?: Date
  tags?: string[]
  isConfidential?: boolean
}

export interface CaseUpdateInput extends Partial<CaseCreateInput> {
  actualCompletionDate?: Date
}

export interface CaseFilterOptions {
  search?: string
  status?: string
  priority?: string
  type?: string
  clientId?: string
  assignedLawyerId?: string
  teamId?: string
  courtName?: string
  tags?: string[]
  isConfidential?: boolean
  filingDateFrom?: Date
  filingDateTo?: Date
  expectedCompletionDateFrom?: Date
  expectedCompletionDateTo?: Date
  caseValueMin?: number
  caseValueMax?: number
  createdFrom?: Date
  createdTo?: Date
}

export interface CaseWithRelations extends Case {
  client: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  assignedLawyer?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  team?: {
    id: string
    name: string
    department?: string
  }
  _count?: {
    parties: number
    hearings: number
    orders: number
    tasks: number
    documents: number
  }
}

export class CaseRepository extends BaseRepositoryImpl<
  CaseWithRelations,
  CaseCreateInput,
  CaseUpdateInput,
  CaseFilterOptions
> {
  async create(data: CaseCreateInput): Promise<CaseWithRelations> {
    const caseData = await this.prisma.case.create({
      data: {
        ...data,
        tags: data.tags ? JSON.stringify(data.tags) : '[]',
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignedLawyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
            department: true,
          },
        },
        _count: {
          select: {
            parties: true,
            hearings: true,
            orders: true,
            tasks: true,
            documents: true,
          },
        },
      },
    })

    return this.transformCase(caseData)
  }

  async findById(id: string): Promise<CaseWithRelations | null> {
    const caseData = await this.prisma.case.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignedLawyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
            department: true,
          },
        },
        _count: {
          select: {
            parties: true,
            hearings: true,
            orders: true,
            tasks: true,
            documents: true,
          },
        },
      },
    })

    return caseData ? this.transformCase(caseData) : null
  }

  async findMany(
    filters?: CaseFilterOptions,
    pagination?: PaginationOptions
  ): Promise<PaginationResult<CaseWithRelations>> {
    const { page, limit, offset } = this.buildPaginationOptions(pagination)
    
    const where = this.buildWhereClause(filters)
    
    const [cases, total] = await Promise.all([
      this.prisma.case.findMany({
        where,
        include: {
          client: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          assignedLawyer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          team: {
            select: {
              id: true,
              name: true,
              department: true,
            },
          },
          _count: {
            select: {
              parties: true,
              hearings: true,
              orders: true,
              tasks: true,
              documents: true,
            },
          },
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' },
        ],
        skip: offset,
        take: limit,
      }),
      this.prisma.case.count({ where }),
    ])

    const transformedCases = cases.map(caseData => this.transformCase(caseData))
    
    return createPaginationResult(transformedCases, total, page, limit)
  }

  async update(id: string, data: CaseUpdateInput): Promise<CaseWithRelations> {
    const updateData: Prisma.CaseUpdateInput = {
      ...data,
      tags: data.tags ? JSON.stringify(data.tags) : undefined,
    }

    const caseData = await this.prisma.case.update({
      where: { id },
      data: updateData,
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignedLawyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
            department: true,
          },
        },
        _count: {
          select: {
            parties: true,
            hearings: true,
            orders: true,
            tasks: true,
            documents: true,
          },
        },
      },
    })

    return this.transformCase(caseData)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.case.delete({
      where: { id },
    })
  }

  async count(filters?: CaseFilterOptions): Promise<number> {
    const where = this.buildWhereClause(filters)
    return this.prisma.case.count({ where })
  }

  // Additional methods specific to Case repository
  async findByCaseNumber(caseNumber: string): Promise<CaseWithRelations | null> {
    const caseData = await this.prisma.case.findUnique({
      where: { caseNumber },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignedLawyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
            department: true,
          },
        },
        _count: {
          select: {
            parties: true,
            hearings: true,
            orders: true,
            tasks: true,
            documents: true,
          },
        },
      },
    })

    return caseData ? this.transformCase(caseData) : null
  }

  async findByClient(clientId: string, pagination?: PaginationOptions): Promise<PaginationResult<CaseWithRelations>> {
    return this.findMany({ clientId }, pagination)
  }

  async findByLawyer(lawyerId: string, pagination?: PaginationOptions): Promise<PaginationResult<CaseWithRelations>> {
    return this.findMany({ assignedLawyerId: lawyerId }, pagination)
  }

  async findByTeam(teamId: string, pagination?: PaginationOptions): Promise<PaginationResult<CaseWithRelations>> {
    return this.findMany({ teamId }, pagination)
  }

  async getCaseStatistics(filters?: CaseFilterOptions) {
    const where = this.buildWhereClause(filters)
    
    const [
      total,
      byStatus,
      byPriority,
      byType,
      byTeam,
    ] = await Promise.all([
      this.prisma.case.count({ where }),
      this.prisma.case.groupBy({
        by: ['status'],
        where,
        _count: { status: true },
      }),
      this.prisma.case.groupBy({
        by: ['priority'],
        where,
        _count: { priority: true },
      }),
      this.prisma.case.groupBy({
        by: ['type'],
        where,
        _count: { type: true },
      }),
      this.prisma.case.groupBy({
        by: ['teamId'],
        where: { ...where, teamId: { not: null } },
        _count: { teamId: true },
      }),
    ])

    return {
      total,
      byStatus: byStatus.reduce((acc, item) => ({ ...acc, [item.status]: item._count.status }), {}),
      byPriority: byPriority.reduce((acc, item) => ({ ...acc, [item.priority]: item._count.priority }), {}),
      byType: byType.reduce((acc, item) => ({ ...acc, [item.type]: item._count.type }), {}),
      byTeam: byTeam.reduce((acc, item) => ({ ...acc, [item.teamId!]: item._count.teamId }), {}),
    }
  }

  private buildWhereClause(filters?: CaseFilterOptions): Prisma.CaseWhereInput {
    if (!filters) return {}

    const where: Prisma.CaseWhereInput = {}

    // Search filter
    if (filters.search) {
      where.OR = [
        { caseNumber: { contains: filters.search, mode: 'insensitive' } },
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { courtName: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    // Status filter
    if (filters.status) {
      where.status = filters.status
    }

    // Priority filter
    if (filters.priority) {
      where.priority = filters.priority
    }

    // Type filter
    if (filters.type) {
      where.type = filters.type
    }

    // Client filter
    if (filters.clientId) {
      where.clientId = filters.clientId
    }

    // Lawyer filter
    if (filters.assignedLawyerId) {
      where.assignedLawyerId = filters.assignedLawyerId
    }

    // Team filter
    if (filters.teamId) {
      where.teamId = filters.teamId
    }

    // Court filter
    if (filters.courtName) {
      where.courtName = { contains: filters.courtName, mode: 'insensitive' }
    }

    // Confidential filter
    if (filters.isConfidential !== undefined) {
      where.isConfidential = filters.isConfidential
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      where.tags = {
        contains: JSON.stringify(filters.tags),
      }
    }

    // Date range filters
    if (filters.filingDateFrom || filters.filingDateTo) {
      where.filingDate = {}
      if (filters.filingDateFrom) where.filingDate.gte = filters.filingDateFrom
      if (filters.filingDateTo) where.filingDate.lte = filters.filingDateTo
    }

    if (filters.expectedCompletionDateFrom || filters.expectedCompletionDateTo) {
      where.expectedCompletionDate = {}
      if (filters.expectedCompletionDateFrom) where.expectedCompletionDate.gte = filters.expectedCompletionDateFrom
      if (filters.expectedCompletionDateTo) where.expectedCompletionDate.lte = filters.expectedCompletionDateTo
    }

    // Case value range filter
    if (filters.caseValueMin !== undefined || filters.caseValueMax !== undefined) {
      where.caseValue = {}
      if (filters.caseValueMin !== undefined) where.caseValue.gte = filters.caseValueMin
      if (filters.caseValueMax !== undefined) where.caseValue.lte = filters.caseValueMax
    }

    // Created date range filter
    if (filters.createdFrom || filters.createdTo) {
      where.createdAt = {}
      if (filters.createdFrom) where.createdAt.gte = filters.createdFrom
      if (filters.createdTo) where.createdAt.lte = filters.createdTo
    }

    return where
  }

  private transformCase(caseData: any): CaseWithRelations {
    return {
      ...caseData,
      tags: caseData.tags ? JSON.parse(caseData.tags) : [],
    }
  }
}
