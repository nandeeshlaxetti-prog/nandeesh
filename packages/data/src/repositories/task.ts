import { PrismaClient, Task, Prisma } from '@prisma/client'
import { BaseRepositoryImpl, PaginationOptions, PaginationResult, createPaginationResult } from './base'
import { AuditMiddleware, AuditContext } from '../audit-middleware'

export interface TaskCreateInput {
  title: string
  description?: string
  category?: string
  status?: string
  priority?: string
  caseId?: string
  assignedTo?: string
  createdBy: string
  dueDate?: Date
  estimatedHours?: number
  tags?: string[]
  attachments?: string[]
  isRecurring?: boolean
  recurringPattern?: string
  parentTaskId?: string
  dependencies?: string[]
  progress?: number
  notes?: string
  isConfidential?: boolean
}

export interface TaskUpdateInput extends Partial<TaskCreateInput> {
  completedAt?: Date
  actualHours?: number
}

export interface TaskFilterOptions {
  search?: string
  category?: string
  status?: string
  priority?: string
  caseId?: string
  assignedTo?: string
  createdBy?: string
  teamId?: string
  dueDateFrom?: Date
  dueDateTo?: Date
  OR?: Array<{
    status?: string
    [key: string]: any
  }>
  isRecurring?: boolean
  parentTaskId?: string
  isConfidential?: boolean
  tags?: string[]
  createdFrom?: Date
  createdTo?: Date
  completedFrom?: Date
  completedTo?: Date
}

export interface TaskWithRelations extends Task {
  case?: {
    id: string
    caseNumber: string
    title: string
    status: string
    client: {
      id: string
      firstName: string
      lastName: string
    }
  }
  assignee?: {
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
  }
  creator: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  parentTask?: {
    id: string
    title: string
    status: string
  }
  subtasks?: Array<{
    id: string
    title: string
    status: string
    progress: number
  }>
  _count?: {
    subtasks: number
  }
}

export class TaskRepository extends BaseRepositoryImpl<
  TaskWithRelations,
  TaskCreateInput,
  TaskUpdateInput,
  TaskFilterOptions
> {
  async create(data: TaskCreateInput, auditContext?: AuditContext): Promise<TaskWithRelations> {
    const createOperation = async () => {
      const taskData = await this.prisma.task.create({
        data: {
          ...data,
          tags: data.tags ? JSON.stringify(data.tags) : '[]',
          attachments: data.attachments ? JSON.stringify(data.attachments) : '[]',
          dependencies: data.dependencies ? JSON.stringify(data.dependencies) : '[]',
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
            },
          },
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            },
          },
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          parentTask: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
          subtasks: {
            select: {
              id: true,
              title: true,
              status: true,
              progress: true,
            },
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: {
              subtasks: true,
            },
          },
        },
      })

      return this.transformTask(taskData)
    }

    if (auditContext) {
      return await AuditMiddleware.wrapCreate(
        createOperation,
        'TASK',
        auditContext
      )
    } else {
      return await createOperation()
    }
  }

  async findById(id: string, auditContext?: AuditContext): Promise<TaskWithRelations | null> {
    const findOperation = async () => {
      const taskData = await this.prisma.task.findUnique({
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
            },
          },
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            },
          },
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          parentTask: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
          subtasks: {
            select: {
              id: true,
              title: true,
              status: true,
              progress: true,
            },
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: {
              subtasks: true,
            },
          },
        },
      })

      return taskData ? this.transformTask(taskData) : null
    }

    if (auditContext) {
      return await AuditMiddleware.wrapView(
        findOperation,
        'TASK',
        id,
        auditContext
      )
    } else {
      return await findOperation()
    }
  }

  async findMany(
    filters?: TaskFilterOptions,
    pagination?: PaginationOptions
  ): Promise<PaginationResult<TaskWithRelations>> {
    const { page, limit, offset } = this.buildPaginationOptions(pagination)
    
    const where = this.buildWhereClause(filters)
    
    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
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
            },
          },
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            },
          },
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          parentTask: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
          subtasks: {
            select: {
              id: true,
              title: true,
              status: true,
              progress: true,
            },
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: {
              subtasks: true,
            },
          },
        },
        orderBy: [
          { priority: 'desc' },
          { dueDate: 'asc' },
          { createdAt: 'desc' },
        ],
        skip: offset,
        take: limit,
      }),
      this.prisma.task.count({ where }),
    ])

    const transformedTasks = tasks.map(taskData => this.transformTask(taskData))
    
    return createPaginationResult(transformedTasks, total, page, limit)
  }

  async update(id: string, data: TaskUpdateInput, auditContext?: AuditContext): Promise<TaskWithRelations> {
    // Get old values for audit logging
    const oldTask = await this.prisma.task.findUnique({
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
          },
        },
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        // parentTask: {
        //   select: {
        //     id: true,
        //     title: true,
        //     status: true,
        //   },
        // },
        subtasks: {
          select: {
            id: true,
            title: true,
            status: true,
            progress: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            subtasks: true,
          },
        },
      },
    })

    if (!oldTask) {
      throw new Error(`Task not found: ${id}`)
    }

    const updateOperation = async () => {
      const updateData: Prisma.TaskUpdateInput = {
        ...data,
        tags: data.tags ? JSON.stringify(data.tags) : undefined,
        attachments: data.attachments ? JSON.stringify(data.attachments) : undefined,
        dependencies: data.dependencies ? JSON.stringify(data.dependencies) : undefined,
      }

      const taskData = await this.prisma.task.update({
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
            },
          },
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            },
          },
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          parentTask: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
          subtasks: {
            select: {
              id: true,
              title: true,
              status: true,
              progress: true,
            },
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: {
              subtasks: true,
            },
          },
        },
      })

      return this.transformTask(taskData)
    }

    if (auditContext) {
      return await AuditMiddleware.wrapUpdate(
        updateOperation,
        'TASK',
        id,
        this.transformTask(oldTask),
        auditContext
      )
    } else {
      return await updateOperation()
    }
  }

  async delete(id: string, auditContext?: AuditContext): Promise<void> {
    // Get old values for audit logging
    const oldTask = await this.prisma.task.findUnique({
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
          },
        },
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        // parentTask: {
        //   select: {
        //     id: true,
        //     title: true,
        //     status: true,
        //   },
        // },
        subtasks: {
          select: {
            id: true,
            title: true,
            status: true,
            progress: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            subtasks: true,
          },
        },
      },
    })

    if (!oldTask) {
      throw new Error(`Task not found: ${id}`)
    }

    const deleteOperation = async () => {
      await this.prisma.task.delete({
        where: { id },
      })
    }

    if (auditContext) {
      await AuditMiddleware.wrapDelete(
        deleteOperation,
        'TASK',
        id,
        this.transformTask(oldTask),
        auditContext
      )
    } else {
      await deleteOperation()
    }
  }

  async count(filters?: TaskFilterOptions): Promise<number> {
    const where = this.buildWhereClause(filters)
    return this.prisma.task.count({ where })
  }

  // Additional methods specific to Task repository
  async findByAssignee(assignedTo: string, pagination?: PaginationOptions): Promise<PaginationResult<TaskWithRelations>> {
    return this.findMany({ assignedTo }, pagination)
  }

  async findByCreator(createdBy: string, pagination?: PaginationOptions): Promise<PaginationResult<TaskWithRelations>> {
    return this.findMany({ createdBy }, pagination)
  }

  async findByCase(caseId: string, pagination?: PaginationOptions): Promise<PaginationResult<TaskWithRelations>> {
    return this.findMany({ caseId }, pagination)
  }

  async findByCategory(category: string, pagination?: PaginationOptions): Promise<PaginationResult<TaskWithRelations>> {
    return this.findMany({ category }, pagination)
  }

  async findByStatus(status: string, pagination?: PaginationOptions): Promise<PaginationResult<TaskWithRelations>> {
    return this.findMany({ status }, pagination)
  }

  async findByPriority(priority: string, pagination?: PaginationOptions): Promise<PaginationResult<TaskWithRelations>> {
    return this.findMany({ priority }, pagination)
  }

  async findOverdue(pagination?: PaginationOptions): Promise<PaginationResult<TaskWithRelations>> {
    const today = new Date()
    today.setHours(23, 59, 59, 999)

    return this.findMany({
      dueDateTo: today,
      OR: [
        { status: 'PENDING' },
        { status: 'IN_PROGRESS' }
      ],
    }, pagination)
  }

  async findDueSoon(days: number = 3, pagination?: PaginationOptions): Promise<PaginationResult<TaskWithRelations>> {
    const fromDate = new Date()
    const toDate = new Date()
    toDate.setDate(toDate.getDate() + days)

    return this.findMany({
      dueDateFrom: fromDate,
      dueDateTo: toDate,
      OR: [
        { status: 'PENDING' },
        { status: 'IN_PROGRESS' }
      ],
    }, pagination)
  }

  async findRecurring(pagination?: PaginationOptions): Promise<PaginationResult<TaskWithRelations>> {
    return this.findMany({ isRecurring: true }, pagination)
  }

  async findSubtasks(parentTaskId: string, pagination?: PaginationOptions): Promise<PaginationResult<TaskWithRelations>> {
    return this.findMany({ parentTaskId }, pagination)
  }

  async assignTask(id: string, assignedTo: string, dueDate?: Date, auditContext?: AuditContext): Promise<TaskWithRelations> {
    // Get old values for audit logging
    const oldTask = await this.prisma.task.findUnique({
      where: { id },
      select: { assignedTo: true }
    })

    if (!oldTask) {
      throw new Error(`Task not found: ${id}`)
    }

    const assignOperation = async () => {
      return this.update(id, {
        assignedTo,
        dueDate,
        status: 'PENDING',
      })
    }

    if (auditContext) {
      return await AuditMiddleware.wrapAssignment(
        assignOperation,
        'TASK',
        id,
        oldTask.assignedTo,
        assignedTo,
        auditContext
      )
    } else {
      return await assignOperation()
    }
  }

  async updateStatus(id: string, status: string, progress?: number, notes?: string, auditContext?: AuditContext): Promise<TaskWithRelations> {
    // Get old values for audit logging
    const oldTask = await this.prisma.task.findUnique({
      where: { id },
      select: { status: true }
    })

    if (!oldTask) {
      throw new Error(`Task not found: ${id}`)
    }

    const updateData: TaskUpdateInput = { status }
    
    if (progress !== undefined) updateData.progress = progress
    if (notes) updateData.notes = notes
    
    if (status === 'COMPLETED') {
      updateData.completedAt = new Date()
    }

    const updateOperation = async () => {
      return this.update(id, updateData)
    }

    if (auditContext) {
      return await AuditMiddleware.wrapStatusChange(
        updateOperation,
        'TASK',
        id,
        oldTask.status,
        status,
        auditContext
      )
    } else {
      return await updateOperation()
    }
  }

  async completeTask(id: string, actualHours?: number, notes?: string, auditContext?: AuditContext): Promise<TaskWithRelations> {
    const completeOperation = async () => {
      return this.update(id, {
        status: 'COMPLETED',
        completedAt: new Date(),
        progress: 100,
        actualHours,
        notes,
      })
    }

    if (auditContext) {
      return await AuditMiddleware.wrapStatusChange(
        completeOperation,
        'TASK',
        id,
        'IN_PROGRESS', // Assuming task was in progress
        'COMPLETED',
        auditContext
      )
    } else {
      return await completeOperation()
    }
  }

  async getTaskStatistics(filters?: TaskFilterOptions) {
    const where = this.buildWhereClause(filters)
    
    const [
      total,
      byStatus,
      byPriority,
      byCategory,
      overdue,
      completed,
    ] = await Promise.all([
      this.prisma.task.count({ where }),
      this.prisma.task.groupBy({
        by: ['status'],
        where,
        _count: { status: true },
      }),
      this.prisma.task.groupBy({
        by: ['priority'],
        where,
        _count: { priority: true },
      }),
      this.prisma.task.groupBy({
        by: ['category'],
        where,
        _count: { category: true },
      }),
      this.prisma.task.count({
        where: {
          ...where,
          dueDate: { lt: new Date() },
          status: { in: ['PENDING', 'IN_PROGRESS'] },
        },
      }),
      this.prisma.task.count({
        where: {
          ...where,
          status: 'COMPLETED',
        },
      }),
    ])

    return {
      total,
      byStatus: byStatus.reduce((acc, item) => ({ ...acc, [item.status]: item._count.status }), {}),
      byPriority: byPriority.reduce((acc, item) => ({ ...acc, [item.priority]: item._count.priority }), {}),
      byCategory: byCategory.reduce((acc, item) => ({ ...acc, [item.category]: item._count.category }), {}),
      overdue,
      completed,
    }
  }

  async getUserTaskSummary(userId: string) {
    const [
      total,
      pending,
      inProgress,
      completed,
      overdue,
      byCategory,
    ] = await Promise.all([
      this.prisma.task.count({ where: { assignedTo: userId } }),
      this.prisma.task.count({ where: { assignedTo: userId, status: 'PENDING' } }),
      this.prisma.task.count({ where: { assignedTo: userId, status: 'IN_PROGRESS' } }),
      this.prisma.task.count({ where: { assignedTo: userId, status: 'COMPLETED' } }),
      this.prisma.task.count({
        where: {
          assignedTo: userId,
          dueDate: { lt: new Date() },
          status: { in: ['PENDING', 'IN_PROGRESS'] },
        },
      }),
      this.prisma.task.groupBy({
        by: ['category'],
        where: { assignedTo: userId },
        _count: { category: true },
      }),
    ])

    return {
      total,
      pending,
      inProgress,
      completed,
      overdue,
      byCategory: byCategory.reduce((acc, item) => ({ ...acc, [item.category]: item._count.category }), {}),
    }
  }

  async listPendingForUser(filters: {
    userId: string
    categories?: string[]
    priorities?: string[]
    statuses?: string[]
    dueDateFrom?: Date
    dueDateTo?: Date
    overdue?: boolean
    teamId?: string
    caseId?: string
    includeCompleted?: boolean
    limit?: number
    offset?: number
  }): Promise<PaginationResult<TaskWithRelations>> {
    const { page, limit, offset } = this.buildPaginationOptions({
      page: Math.floor((filters.offset || 0) / (filters.limit || 50)) + 1,
      limit: filters.limit || 50
    })

    const where: Prisma.TaskWhereInput = {
      assignedTo: filters.userId
    }

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      where.category = { in: filters.categories }
    }

    // Priority filter
    if (filters.priorities && filters.priorities.length > 0) {
      where.priority = { in: filters.priorities }
    }

    // Status filter
    if (filters.statuses && filters.statuses.length > 0) {
      where.status = { in: filters.statuses }
    } else if (!filters.includeCompleted) {
      where.status = { in: ['PENDING', 'IN_PROGRESS', 'ON_HOLD'] }
    }

    // Overdue filter
    if (filters.overdue) {
      where.dueDate = { lt: new Date() }
      where.status = { in: ['PENDING', 'IN_PROGRESS'] }
    }

    // Due date range filter
    if (filters.dueDateFrom || filters.dueDateTo) {
      where.dueDate = {}
      if (filters.dueDateFrom) where.dueDate.gte = filters.dueDateFrom
      if (filters.dueDateTo) where.dueDate.lte = filters.dueDateTo
    }

    // Team filter (through case)
    if (filters.teamId) {
      where.case = {
        teamId: filters.teamId
      }
    }

    // Case filter
    if (filters.caseId) {
      where.caseId = filters.caseId
    }

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
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
            },
          },
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            },
          },
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          parentTask: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
          subtasks: {
            select: {
              id: true,
              title: true,
              status: true,
              progress: true,
            },
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: {
              subtasks: true,
            },
          },
        },
        orderBy: [
          { priority: 'desc' },
          { dueDate: 'asc' },
          { createdAt: 'desc' },
        ],
        skip: offset,
        take: limit,
      }),
      this.prisma.task.count({ where })
    ])

    const transformedTasks = tasks.map(taskData => this.transformTask(taskData))
    
    return createPaginationResult(transformedTasks, total, page, limit)
  }

  private buildWhereClause(filters?: TaskFilterOptions): Prisma.TaskWhereInput {
    if (!filters) return {}

    const where: Prisma.TaskWhereInput = {}

    // Search filter
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { description: { contains: filters.search } },
        { notes: { contains: filters.search } },
      ]
    }

    // Category filter
    if (filters.category) {
      where.category = filters.category
    }

    // Status filter
    if (filters.status) {
      where.status = filters.status
    }

    // Priority filter
    if (filters.priority) {
      where.priority = filters.priority
    }

    // Case filter
    if (filters.caseId) {
      where.caseId = filters.caseId
    }

    // Assignee filter
    if (filters.assignedTo) {
      where.assignedTo = filters.assignedTo
    }

    // Creator filter
    if (filters.createdBy) {
      where.createdBy = filters.createdBy
    }

    // Team filter (through case)
    if (filters.teamId) {
      where.case = {
        teamId: filters.teamId,
      }
    }

    // Recurring filter
    if (filters.isRecurring !== undefined) {
      where.isRecurring = filters.isRecurring
    }

    // Parent task filter
    if (filters.parentTaskId) {
      where.parentTaskId = filters.parentTaskId
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

    // Due date range filter
    if (filters.dueDateFrom || filters.dueDateTo) {
      where.dueDate = {}
      if (filters.dueDateFrom) where.dueDate.gte = filters.dueDateFrom
      if (filters.dueDateTo) where.dueDate.lte = filters.dueDateTo
    }

    // Created date range filter
    if (filters.createdFrom || filters.createdTo) {
      where.createdAt = {}
      if (filters.createdFrom) where.createdAt.gte = filters.createdFrom
      if (filters.createdTo) where.createdAt.lte = filters.createdTo
    }

    // Completed date range filter
    if (filters.completedFrom || filters.completedTo) {
      where.completedAt = {}
      if (filters.completedFrom) where.completedAt.gte = filters.completedFrom
      if (filters.completedTo) where.completedAt.lte = filters.completedTo
    }

    return where
  }

  private transformTask(taskData: any): TaskWithRelations {
    return {
      ...taskData,
      tags: taskData.tags ? JSON.parse(taskData.tags) : [],
      attachments: taskData.attachments ? JSON.parse(taskData.attachments) : [],
      dependencies: taskData.dependencies ? JSON.parse(taskData.dependencies) : [],
    }
  }
}
