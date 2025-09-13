"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorklogRepository = void 0;
const base_1 = require("./base");
class WorklogRepository extends base_1.BaseRepositoryImpl {
    async create(data) {
        const worklogData = await this.prisma.worklog.create({
            data: {
                ...data,
                activities: data.activities ? JSON.stringify(data.activities) : '[]',
                attachments: data.attachments ? JSON.stringify(data.attachments) : '[]',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                    },
                },
                case: {
                    select: {
                        id: true,
                        caseNumber: true,
                        title: true,
                        status: true,
                    },
                },
                task: {
                    select: {
                        id: true,
                        title: true,
                        category: true,
                        status: true,
                    },
                },
            },
        });
        return this.transformWorklog(worklogData);
    }
    async findById(id) {
        const worklogData = await this.prisma.worklog.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                    },
                },
                case: {
                    select: {
                        id: true,
                        caseNumber: true,
                        title: true,
                        status: true,
                    },
                },
                task: {
                    select: {
                        id: true,
                        title: true,
                        category: true,
                        status: true,
                    },
                },
            },
        });
        return worklogData ? this.transformWorklog(worklogData) : null;
    }
    async findMany(filters, pagination) {
        const { page, limit, offset } = this.buildPaginationOptions(pagination);
        const where = this.buildWhereClause(filters);
        const [worklogs, total] = await Promise.all([
            this.prisma.worklog.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            role: true,
                        },
                    },
                    case: {
                        select: {
                            id: true,
                            caseNumber: true,
                            title: true,
                            status: true,
                        },
                    },
                    task: {
                        select: {
                            id: true,
                            title: true,
                            category: true,
                            status: true,
                        },
                    },
                },
                orderBy: [
                    { date: 'desc' },
                    { startTime: 'desc' },
                ],
                skip: offset,
                take: limit,
            }),
            this.prisma.worklog.count({ where }),
        ]);
        const transformedWorklogs = worklogs.map(worklogData => this.transformWorklog(worklogData));
        return (0, base_1.createPaginationResult)(transformedWorklogs, total, page, limit);
    }
    async update(id, data) {
        const updateData = {
            ...data,
            activities: data.activities ? JSON.stringify(data.activities) : undefined,
            attachments: data.attachments ? JSON.stringify(data.attachments) : undefined,
        };
        const worklogData = await this.prisma.worklog.update({
            where: { id },
            data: updateData,
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                    },
                },
                case: {
                    select: {
                        id: true,
                        caseNumber: true,
                        title: true,
                        status: true,
                    },
                },
                task: {
                    select: {
                        id: true,
                        title: true,
                        category: true,
                        status: true,
                    },
                },
            },
        });
        return this.transformWorklog(worklogData);
    }
    async delete(id) {
        await this.prisma.worklog.delete({
            where: { id },
        });
    }
    async count(filters) {
        const where = this.buildWhereClause(filters);
        return this.prisma.worklog.count({ where });
    }
    // Additional methods specific to Worklog repository
    async findByUser(userId, pagination) {
        return this.findMany({ userId }, pagination);
    }
    async findByCase(caseId, pagination) {
        return this.findMany({ caseId }, pagination);
    }
    async findByTask(taskId, pagination) {
        return this.findMany({ taskId }, pagination);
    }
    async findBySubtask(subtaskId, pagination) {
        return this.findMany({ subtaskId }, pagination);
    }
    async findByType(type, pagination) {
        return this.findMany({ type }, pagination);
    }
    async findByStatus(status, pagination) {
        return this.findMany({ status }, pagination);
    }
    async findPendingApproval(pagination) {
        return this.findMany({ status: 'SUBMITTED' }, pagination);
    }
    async findApproved(pagination) {
        return this.findMany({ status: 'APPROVED' }, pagination);
    }
    async findBillable(pagination) {
        return this.findMany({ isBillable: true }, pagination);
    }
    async findOvertime(pagination) {
        return this.findMany({ isOvertime: true }, pagination);
    }
    async findByDateRange(startDate, endDate, pagination) {
        return this.findMany({
            dateFrom: startDate,
            dateTo: endDate,
        }, pagination);
    }
    async approveWorklog(id, approvedBy, notes) {
        return this.update(id, {
            status: 'APPROVED',
            approvedBy,
            approvedAt: new Date(),
            notes,
        });
    }
    async rejectWorklog(id, approvedBy, reason) {
        return this.update(id, {
            status: 'REJECTED',
            approvedBy,
            approvedAt: new Date(),
            rejectionReason: reason,
        });
    }
    async getWorklogStatistics(filters) {
        const where = this.buildWhereClause(filters);
        const [total, byStatus, byType, totalHours, billableHours, totalAmount,] = await Promise.all([
            this.prisma.worklog.count({ where }),
            this.prisma.worklog.groupBy({
                by: ['status'],
                where,
                _count: { status: true },
            }),
            this.prisma.worklog.groupBy({
                by: ['type'],
                where,
                _count: { type: true },
            }),
            this.prisma.worklog.aggregate({
                where,
                _sum: { duration: true },
            }),
            this.prisma.worklog.aggregate({
                where: { ...where, isBillable: true },
                _sum: { billableHours: true },
            }),
            this.prisma.worklog.aggregate({
                where: { ...where, isBillable: true },
                _sum: { totalAmount: true },
            }),
        ]);
        return {
            total,
            byStatus: byStatus.reduce((acc, item) => ({ ...acc, [item.status]: item._count.status }), {}),
            byType: byType.reduce((acc, item) => ({ ...acc, [item.type]: item._count.type }), {}),
            totalHours: totalHours._sum.duration || 0,
            billableHours: billableHours._sum.billableHours || 0,
            totalAmount: totalAmount._sum.totalAmount || 0,
        };
    }
    async getUserWorklogSummary(userId, startDate, endDate) {
        const where = { userId };
        if (startDate || endDate) {
            where.date = {};
            if (startDate)
                where.date.gte = startDate;
            if (endDate)
                where.date.lte = endDate;
        }
        const [total, totalHours, billableHours, totalAmount, byType, byStatus,] = await Promise.all([
            this.prisma.worklog.count({ where }),
            this.prisma.worklog.aggregate({
                where,
                _sum: { duration: true },
            }),
            this.prisma.worklog.aggregate({
                where: { ...where, isBillable: true },
                _sum: { billableHours: true },
            }),
            this.prisma.worklog.aggregate({
                where: { ...where, isBillable: true },
                _sum: { totalAmount: true },
            }),
            this.prisma.worklog.groupBy({
                by: ['type'],
                where,
                _count: { type: true },
            }),
            this.prisma.worklog.groupBy({
                by: ['status'],
                where,
                _count: { status: true },
            }),
        ]);
        return {
            total,
            totalHours: totalHours._sum.duration || 0,
            billableHours: billableHours._sum.billableHours || 0,
            totalAmount: totalAmount._sum.totalAmount || 0,
            byType: byType.reduce((acc, item) => ({ ...acc, [item.type]: item._count.type }), {}),
            byStatus: byStatus.reduce((acc, item) => ({ ...acc, [item.status]: item._count.status }), {}),
        };
    }
    async generateTimesheet(userId, startDate, endDate) {
        const worklogs = await this.prisma.worklog.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
                status: 'APPROVED',
            },
            include: {
                case: {
                    select: {
                        id: true,
                        caseNumber: true,
                        title: true,
                    },
                },
                task: {
                    select: {
                        id: true,
                        title: true,
                        category: true,
                    },
                },
            },
            orderBy: [
                { date: 'asc' },
                { startTime: 'asc' },
            ],
        });
        const totalHours = worklogs.reduce((sum, log) => sum + log.duration, 0);
        const billableHours = worklogs.reduce((sum, log) => sum + (log.billableHours || 0), 0);
        const totalAmount = worklogs.reduce((sum, log) => sum + (log.totalAmount || 0), 0);
        return {
            userId,
            startDate,
            endDate,
            worklogs: worklogs.map(log => this.transformWorklog(log)),
            totalHours,
            billableHours,
            totalAmount,
        };
    }
    buildWhereClause(filters) {
        if (!filters)
            return {};
        const where = {};
        // Search filter
        if (filters.search) {
            where.OR = [
                { description: { contains: filters.search } },
                { notes: { contains: filters.search } },
                { location: { contains: filters.search } },
            ];
        }
        // User filter
        if (filters.userId) {
            where.userId = filters.userId;
        }
        // Case filter
        if (filters.caseId) {
            where.caseId = filters.caseId;
        }
        // Task filter
        if (filters.taskId) {
            where.taskId = filters.taskId;
        }
        // Subtask filter
        if (filters.subtaskId) {
            where.subtaskId = filters.subtaskId;
        }
        // Type filter
        if (filters.type) {
            where.type = filters.type;
        }
        // Status filter
        if (filters.status) {
            where.status = filters.status;
        }
        // Billable filter
        if (filters.isBillable !== undefined) {
            where.isBillable = filters.isBillable;
        }
        // Overtime filter
        if (filters.isOvertime !== undefined) {
            where.isOvertime = filters.isOvertime;
        }
        // Approver filter
        if (filters.approvedBy) {
            where.approvedBy = filters.approvedBy;
        }
        // Date range filter
        if (filters.dateFrom || filters.dateTo) {
            where.date = {};
            if (filters.dateFrom)
                where.date.gte = filters.dateFrom;
            if (filters.dateTo)
                where.date.lte = filters.dateTo;
        }
        // Created date range filter
        if (filters.createdFrom || filters.createdTo) {
            where.createdAt = {};
            if (filters.createdFrom)
                where.createdAt.gte = filters.createdFrom;
            if (filters.createdTo)
                where.createdAt.lte = filters.createdTo;
        }
        return where;
    }
    transformWorklog(worklogData) {
        return {
            ...worklogData,
            activities: worklogData.activities ? JSON.parse(worklogData.activities) : [],
            attachments: worklogData.attachments ? JSON.parse(worklogData.attachments) : [],
        };
    }
}
exports.WorklogRepository = WorklogRepository;
