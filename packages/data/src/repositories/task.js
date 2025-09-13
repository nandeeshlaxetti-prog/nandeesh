"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
const base_1 = require("./base");
const audit_middleware_1 = require("../audit-middleware");
class TaskRepository extends base_1.BaseRepositoryImpl {
    async create(data, auditContext) {
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
            });
            return this.transformTask(taskData);
        };
        if (auditContext) {
            return await audit_middleware_1.AuditMiddleware.wrapCreate(createOperation, 'TASK', auditContext);
        }
        else {
            return await createOperation();
        }
    }
    async findById(id, auditContext) {
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
            });
            return taskData ? this.transformTask(taskData) : null;
        };
        if (auditContext) {
            return await audit_middleware_1.AuditMiddleware.wrapView(findOperation, 'TASK', id, auditContext);
        }
        else {
            return await findOperation();
        }
    }
    async findMany(filters, pagination) {
        const { page, limit, offset } = this.buildPaginationOptions(pagination);
        const where = this.buildWhereClause(filters);
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
        ]);
        const transformedTasks = tasks.map(taskData => this.transformTask(taskData));
        return (0, base_1.createPaginationResult)(transformedTasks, total, page, limit);
    }
    async update(id, data, auditContext) {
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
        });
        if (!oldTask) {
            throw new Error(`Task not found: ${id}`);
        }
        const updateOperation = async () => {
            const updateData = {
                ...data,
                tags: data.tags ? JSON.stringify(data.tags) : undefined,
                attachments: data.attachments ? JSON.stringify(data.attachments) : undefined,
                dependencies: data.dependencies ? JSON.stringify(data.dependencies) : undefined,
            };
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
            });
            return this.transformTask(taskData);
        };
        if (auditContext) {
            return await audit_middleware_1.AuditMiddleware.wrapUpdate(updateOperation, 'TASK', id, this.transformTask(oldTask), auditContext);
        }
        else {
            return await updateOperation();
        }
    }
    async delete(id, auditContext) {
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
        });
        if (!oldTask) {
            throw new Error(`Task not found: ${id}`);
        }
        const deleteOperation = async () => {
            await this.prisma.task.delete({
                where: { id },
            });
        };
        if (auditContext) {
            await audit_middleware_1.AuditMiddleware.wrapDelete(deleteOperation, 'TASK', id, this.transformTask(oldTask), auditContext);
        }
        else {
            await deleteOperation();
        }
    }
    async count(filters) {
        const where = this.buildWhereClause(filters);
        return this.prisma.task.count({ where });
    }
    // Additional methods specific to Task repository
    async findByAssignee(assignedTo, pagination) {
        return this.findMany({ assignedTo }, pagination);
    }
    async findByCreator(createdBy, pagination) {
        return this.findMany({ createdBy }, pagination);
    }
    async findByCase(caseId, pagination) {
        return this.findMany({ caseId }, pagination);
    }
    async findByCategory(category, pagination) {
        return this.findMany({ category }, pagination);
    }
    async findByStatus(status, pagination) {
        return this.findMany({ status }, pagination);
    }
    async findByPriority(priority, pagination) {
        return this.findMany({ priority }, pagination);
    }
    async findOverdue(pagination) {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return this.findMany({
            dueDateTo: today,
            OR: [
                { status: 'PENDING' },
                { status: 'IN_PROGRESS' }
            ],
        }, pagination);
    }
    async findDueSoon(days = 3, pagination) {
        const fromDate = new Date();
        const toDate = new Date();
        toDate.setDate(toDate.getDate() + days);
        return this.findMany({
            dueDateFrom: fromDate,
            dueDateTo: toDate,
            OR: [
                { status: 'PENDING' },
                { status: 'IN_PROGRESS' }
            ],
        }, pagination);
    }
    async findRecurring(pagination) {
        return this.findMany({ isRecurring: true }, pagination);
    }
    async findSubtasks(parentTaskId, pagination) {
        return this.findMany({ parentTaskId }, pagination);
    }
    async assignTask(id, assignedTo, dueDate, auditContext) {
        // Get old values for audit logging
        const oldTask = await this.prisma.task.findUnique({
            where: { id },
            select: { assignedTo: true }
        });
        if (!oldTask) {
            throw new Error(`Task not found: ${id}`);
        }
        const assignOperation = async () => {
            return this.update(id, {
                assignedTo,
                dueDate,
                status: 'PENDING',
            });
        };
        if (auditContext) {
            return await audit_middleware_1.AuditMiddleware.wrapAssignment(assignOperation, 'TASK', id, oldTask.assignedTo, assignedTo, auditContext);
        }
        else {
            return await assignOperation();
        }
    }
    async updateStatus(id, status, progress, notes, auditContext) {
        // Get old values for audit logging
        const oldTask = await this.prisma.task.findUnique({
            where: { id },
            select: { status: true }
        });
        if (!oldTask) {
            throw new Error(`Task not found: ${id}`);
        }
        const updateData = { status };
        if (progress !== undefined)
            updateData.progress = progress;
        if (notes)
            updateData.notes = notes;
        if (status === 'COMPLETED') {
            updateData.completedAt = new Date();
        }
        const updateOperation = async () => {
            return this.update(id, updateData);
        };
        if (auditContext) {
            return await audit_middleware_1.AuditMiddleware.wrapStatusChange(updateOperation, 'TASK', id, oldTask.status, status, auditContext);
        }
        else {
            return await updateOperation();
        }
    }
    async completeTask(id, actualHours, notes, auditContext) {
        const completeOperation = async () => {
            return this.update(id, {
                status: 'COMPLETED',
                completedAt: new Date(),
                progress: 100,
                actualHours,
                notes,
            });
        };
        if (auditContext) {
            return await audit_middleware_1.AuditMiddleware.wrapStatusChange(completeOperation, 'TASK', id, 'IN_PROGRESS', // Assuming task was in progress
            'COMPLETED', auditContext);
        }
        else {
            return await completeOperation();
        }
    }
    async getTaskStatistics(filters) {
        const where = this.buildWhereClause(filters);
        const [total, byStatus, byPriority, byCategory, overdue, completed,] = await Promise.all([
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
        ]);
        return {
            total,
            byStatus: byStatus.reduce((acc, item) => ({ ...acc, [item.status]: item._count.status }), {}),
            byPriority: byPriority.reduce((acc, item) => ({ ...acc, [item.priority]: item._count.priority }), {}),
            byCategory: byCategory.reduce((acc, item) => ({ ...acc, [item.category]: item._count.category }), {}),
            overdue,
            completed,
        };
    }
    async getUserTaskSummary(userId) {
        const [total, pending, inProgress, completed, overdue, byCategory,] = await Promise.all([
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
        ]);
        return {
            total,
            pending,
            inProgress,
            completed,
            overdue,
            byCategory: byCategory.reduce((acc, item) => ({ ...acc, [item.category]: item._count.category }), {}),
        };
    }
    async listPendingForUser(filters) {
        const { page, limit, offset } = this.buildPaginationOptions({
            page: Math.floor((filters.offset || 0) / (filters.limit || 50)) + 1,
            limit: filters.limit || 50
        });
        const where = {
            assignedTo: filters.userId
        };
        // Category filter
        if (filters.categories && filters.categories.length > 0) {
            where.category = { in: filters.categories };
        }
        // Priority filter
        if (filters.priorities && filters.priorities.length > 0) {
            where.priority = { in: filters.priorities };
        }
        // Status filter
        if (filters.statuses && filters.statuses.length > 0) {
            where.status = { in: filters.statuses };
        }
        else if (!filters.includeCompleted) {
            where.status = { in: ['PENDING', 'IN_PROGRESS', 'ON_HOLD'] };
        }
        // Overdue filter
        if (filters.overdue) {
            where.dueDate = { lt: new Date() };
            where.status = { in: ['PENDING', 'IN_PROGRESS'] };
        }
        // Due date range filter
        if (filters.dueDateFrom || filters.dueDateTo) {
            where.dueDate = {};
            if (filters.dueDateFrom)
                where.dueDate.gte = filters.dueDateFrom;
            if (filters.dueDateTo)
                where.dueDate.lte = filters.dueDateTo;
        }
        // Team filter (through case)
        if (filters.teamId) {
            where.case = {
                teamId: filters.teamId
            };
        }
        // Case filter
        if (filters.caseId) {
            where.caseId = filters.caseId;
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
        ]);
        const transformedTasks = tasks.map(taskData => this.transformTask(taskData));
        return (0, base_1.createPaginationResult)(transformedTasks, total, page, limit);
    }
    buildWhereClause(filters) {
        if (!filters)
            return {};
        const where = {};
        // Search filter
        if (filters.search) {
            where.OR = [
                { title: { contains: filters.search } },
                { description: { contains: filters.search } },
                { notes: { contains: filters.search } },
            ];
        }
        // Category filter
        if (filters.category) {
            where.category = filters.category;
        }
        // Status filter
        if (filters.status) {
            where.status = filters.status;
        }
        // Priority filter
        if (filters.priority) {
            where.priority = filters.priority;
        }
        // Case filter
        if (filters.caseId) {
            where.caseId = filters.caseId;
        }
        // Assignee filter
        if (filters.assignedTo) {
            where.assignedTo = filters.assignedTo;
        }
        // Creator filter
        if (filters.createdBy) {
            where.createdBy = filters.createdBy;
        }
        // Team filter (through case)
        if (filters.teamId) {
            where.case = {
                teamId: filters.teamId,
            };
        }
        // Recurring filter
        if (filters.isRecurring !== undefined) {
            where.isRecurring = filters.isRecurring;
        }
        // Parent task filter
        if (filters.parentTaskId) {
            where.parentTaskId = filters.parentTaskId;
        }
        // Confidential filter
        if (filters.isConfidential !== undefined) {
            where.isConfidential = filters.isConfidential;
        }
        // Tags filter
        if (filters.tags && filters.tags.length > 0) {
            where.tags = {
                contains: JSON.stringify(filters.tags),
            };
        }
        // Due date range filter
        if (filters.dueDateFrom || filters.dueDateTo) {
            where.dueDate = {};
            if (filters.dueDateFrom)
                where.dueDate.gte = filters.dueDateFrom;
            if (filters.dueDateTo)
                where.dueDate.lte = filters.dueDateTo;
        }
        // Created date range filter
        if (filters.createdFrom || filters.createdTo) {
            where.createdAt = {};
            if (filters.createdFrom)
                where.createdAt.gte = filters.createdFrom;
            if (filters.createdTo)
                where.createdAt.lte = filters.createdTo;
        }
        // Completed date range filter
        if (filters.completedFrom || filters.completedTo) {
            where.completedAt = {};
            if (filters.completedFrom)
                where.completedAt.gte = filters.completedFrom;
            if (filters.completedTo)
                where.completedAt.lte = filters.completedTo;
        }
        return where;
    }
    transformTask(taskData) {
        return {
            ...taskData,
            tags: taskData.tags ? JSON.parse(taskData.tags) : [],
            attachments: taskData.attachments ? JSON.parse(taskData.attachments) : [],
            dependencies: taskData.dependencies ? JSON.parse(taskData.dependencies) : [],
        };
    }
}
exports.TaskRepository = TaskRepository;
