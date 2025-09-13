import { PrismaClient, Order, Prisma } from '@prisma/client'
import { BaseRepositoryImpl, PaginationOptions, PaginationResult, createPaginationResult } from './base'

export interface OrderCreateInput {
  caseId: string
  orderNumber: string
  type?: string
  status?: string
  priority?: string
  title: string
  description?: string
  content: string
  courtName: string
  judgeName?: string
  orderDate?: Date
  effectiveDate?: Date
  expiryDate?: Date
  createdBy: string
  attachments?: string[]
  isConfidential?: boolean
  tags?: string[]
}

export interface OrderUpdateInput extends Partial<OrderCreateInput> {
  approvedBy?: string
  approvedAt?: Date
  executedBy?: string
  executedAt?: Date
  executionNotes?: string
}

export interface OrderFilterOptions {
  search?: string
  caseId?: string
  type?: string
  status?: string
  priority?: string
  courtName?: string
  judgeName?: string
  createdBy?: string
  approvedBy?: string
  executedBy?: string
  orderDateFrom?: Date
  orderDateTo?: Date
  effectiveDateFrom?: Date
  effectiveDateTo?: Date
  isConfidential?: boolean
  tags?: string[]
  createdFrom?: Date
  createdTo?: Date
}

export interface OrderWithRelations extends Order {
  case: {
    id: string
    caseNumber: string
    title: string
    status: string
    client: {
      id: string
      firstName: string
      lastName: string
    }
    assignedLawyer?: {
      id: string
      firstName: string
      lastName: string
    }
  }
  creator: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  approver?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  executor?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

export class OrderRepository extends BaseRepositoryImpl<
  OrderWithRelations,
  OrderCreateInput,
  OrderUpdateInput,
  OrderFilterOptions
> {
  async create(data: OrderCreateInput): Promise<OrderWithRelations> {
    const orderData = await this.prisma.order.create({
      data: {
        ...data,
        attachments: data.attachments ? JSON.stringify(data.attachments) : '[]',
        tags: data.tags ? JSON.stringify(data.tags) : '[]',
      },
      include: {
        case: {
          select: {
            id: true,
            caseNumber: true,
            title: true,
            status: true,
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            assignedLawyer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    })

    return this.transformOrder(orderData)
  }

  async findById(id: string): Promise<OrderWithRelations | null> {
    const orderData = await this.prisma.order.findUnique({
      where: { id },
      include: {
        case: {
          select: {
            id: true,
            caseNumber: true,
            title: true,
            status: true,
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            assignedLawyer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    })

    return orderData ? this.transformOrder(orderData) : null
  }

  async findMany(
    filters?: OrderFilterOptions,
    pagination?: PaginationOptions
  ): Promise<PaginationResult<OrderWithRelations>> {
    const { page, limit, offset } = this.buildPaginationOptions(pagination)
    
    const where = this.buildWhereClause(filters)
    
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          case: {
            select: {
              id: true,
              caseNumber: true,
              title: true,
              status: true,
              client: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
              assignedLawyer: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
        orderBy: [
          { priority: 'desc' },
          { orderDate: 'desc' },
          { createdAt: 'desc' },
        ],
        skip: offset,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ])

    const transformedOrders = orders.map(orderData => this.transformOrder(orderData))
    
    return createPaginationResult(transformedOrders, total, page, limit)
  }

  async update(id: string, data: OrderUpdateInput): Promise<OrderWithRelations> {
    const updateData: Prisma.OrderUpdateInput = {
      ...data,
      attachments: data.attachments ? JSON.stringify(data.attachments) : undefined,
      tags: data.tags ? JSON.stringify(data.tags) : undefined,
    }

    const orderData = await this.prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        case: {
          select: {
            id: true,
            caseNumber: true,
            title: true,
            status: true,
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            assignedLawyer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    })

    return this.transformOrder(orderData)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.order.delete({
      where: { id },
    })
  }

  async count(filters?: OrderFilterOptions): Promise<number> {
    const where = this.buildWhereClause(filters)
    return this.prisma.order.count({ where })
  }

  // Additional methods specific to Order repository
  async findByCase(caseId: string, pagination?: PaginationOptions): Promise<PaginationResult<OrderWithRelations>> {
    return this.findMany({ caseId }, pagination)
  }

  async findByOrderNumber(orderNumber: string): Promise<OrderWithRelations | null> {
    const orderData = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        case: {
          select: {
            id: true,
            caseNumber: true,
            title: true,
            status: true,
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            assignedLawyer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    })

    return orderData ? this.transformOrder(orderData) : null
  }

  async findPendingApproval(pagination?: PaginationOptions): Promise<PaginationResult<OrderWithRelations>> {
    return this.findMany({ status: 'PENDING' }, pagination)
  }

  async findApproved(pagination?: PaginationOptions): Promise<PaginationResult<OrderWithRelations>> {
    return this.findMany({ status: 'APPROVED' }, pagination)
  }

  async findExecuted(pagination?: PaginationOptions): Promise<PaginationResult<OrderWithRelations>> {
    return this.findMany({ status: 'EXECUTED' }, pagination)
  }

  async findByCreator(createdBy: string, pagination?: PaginationOptions): Promise<PaginationResult<OrderWithRelations>> {
    return this.findMany({ createdBy }, pagination)
  }

  async findByApprover(approvedBy: string, pagination?: PaginationOptions): Promise<PaginationResult<OrderWithRelations>> {
    return this.findMany({ approvedBy }, pagination)
  }

  async findByExecutor(executedBy: string, pagination?: PaginationOptions): Promise<PaginationResult<OrderWithRelations>> {
    return this.findMany({ executedBy }, pagination)
  }

  async findExpiringSoon(days: number = 7, pagination?: PaginationOptions): Promise<PaginationResult<OrderWithRelations>> {
    const fromDate = new Date()
    const toDate = new Date()
    toDate.setDate(toDate.getDate() + days)

    return this.findMany({
      effectiveDateFrom: fromDate,
      effectiveDateTo: toDate,
      status: 'APPROVED',
    }, pagination)
  }

  async approveOrder(id: string, approvedBy: string, notes?: string): Promise<OrderWithRelations> {
    return this.update(id, {
      status: 'APPROVED',
      approvedBy,
      approvedAt: new Date(),
      executionNotes: notes,
    })
  }

  async rejectOrder(id: string, rejectedBy: string, reason: string): Promise<OrderWithRelations> {
    return this.update(id, {
      status: 'REJECTED',
      approvedBy: rejectedBy,
      approvedAt: new Date(),
      executionNotes: reason,
    })
  }

  async executeOrder(id: string, executedBy: string, notes?: string): Promise<OrderWithRelations> {
    return this.update(id, {
      status: 'EXECUTED',
      executedBy,
      executedAt: new Date(),
      executionNotes: notes,
    })
  }

  async getOrderStatistics(filters?: OrderFilterOptions) {
    const where = this.buildWhereClause(filters)
    
    const [
      total,
      byStatus,
      byType,
      byPriority,
      byCourt,
    ] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.groupBy({
        by: ['status'],
        where,
        _count: { status: true },
      }),
      this.prisma.order.groupBy({
        by: ['type'],
        where,
        _count: { type: true },
      }),
      this.prisma.order.groupBy({
        by: ['priority'],
        where,
        _count: { priority: true },
      }),
      this.prisma.order.groupBy({
        by: ['courtName'],
        where,
        _count: { courtName: true },
      }),
    ])

    return {
      total,
      byStatus: byStatus.reduce((acc, item) => ({ ...acc, [item.status]: item._count.status }), {}),
      byType: byType.reduce((acc, item) => ({ ...acc, [item.type]: item._count.type }), {}),
      byPriority: byPriority.reduce((acc, item) => ({ ...acc, [item.priority]: item._count.priority }), {}),
      byCourt: byCourt.reduce((acc, item) => ({ ...acc, [item.courtName]: item._count.courtName }), {}),
    }
  }

  private buildWhereClause(filters?: OrderFilterOptions): Prisma.OrderWhereInput {
    if (!filters) return {}

    const where: Prisma.OrderWhereInput = {}

    // Search filter
    if (filters.search) {
      where.OR = [
        { orderNumber: { contains: filters.search } },
        { title: { contains: filters.search } },
        { description: { contains: filters.search } },
        { content: { contains: filters.search } },
        { courtName: { contains: filters.search } },
        { judgeName: { contains: filters.search } },
      ]
    }

    // Case filter
    if (filters.caseId) {
      where.caseId = filters.caseId
    }

    // Type filter
    if (filters.type) {
      where.type = filters.type
    }

    // Status filter
    if (filters.status) {
      where.status = filters.status
    }

    // Priority filter
    if (filters.priority) {
      where.priority = filters.priority
    }

    // Court filter
    if (filters.courtName) {
      where.courtName = { contains: filters.courtName }
    }

    // Judge filter
    if (filters.judgeName) {
      where.judgeName = { contains: filters.judgeName }
    }

    // Creator filter
    if (filters.createdBy) {
      where.createdBy = filters.createdBy
    }

    // Approver filter
    if (filters.approvedBy) {
      where.approvedBy = filters.approvedBy
    }

    // Executor filter
    if (filters.executedBy) {
      where.executedBy = filters.executedBy
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

    // Order date range filter
    if (filters.orderDateFrom || filters.orderDateTo) {
      where.orderDate = {}
      if (filters.orderDateFrom) where.orderDate.gte = filters.orderDateFrom
      if (filters.orderDateTo) where.orderDate.lte = filters.orderDateTo
    }

    // Effective date range filter
    if (filters.effectiveDateFrom || filters.effectiveDateTo) {
      where.effectiveDate = {}
      if (filters.effectiveDateFrom) where.effectiveDate.gte = filters.effectiveDateFrom
      if (filters.effectiveDateTo) where.effectiveDate.lte = filters.effectiveDateTo
    }

    // Created date range filter
    if (filters.createdFrom || filters.createdTo) {
      where.createdAt = {}
      if (filters.createdFrom) where.createdAt.gte = filters.createdFrom
      if (filters.createdTo) where.createdAt.lte = filters.createdTo
    }

    return where
  }

  private transformOrder(orderData: any): OrderWithRelations {
    return {
      ...orderData,
      attachments: orderData.attachments ? JSON.parse(orderData.attachments) : [],
      tags: orderData.tags ? JSON.parse(orderData.tags) : [],
    }
  }
}
