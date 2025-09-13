"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveRequestRepository = void 0;
const base_1 = require("./base");
class LeaveRequestRepository extends base_1.BaseRepositoryImpl {
    async create(data) {
        const leaveRequestData = await this.prisma.leaveRequest.create({
            data: {
                ...data,
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
                approver: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
        return this.transformLeaveRequest(leaveRequestData);
    }
    async findById(id) {
        const leaveRequestData = await this.prisma.leaveRequest.findUnique({
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
                approver: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
        return leaveRequestData ? this.transformLeaveRequest(leaveRequestData) : null;
    }
    async findMany(filters, pagination) {
        const { page, limit, offset } = this.buildPaginationOptions(pagination);
        const where = this.buildWhereClause(filters);
        const [leaveRequests, total] = await Promise.all([
            this.prisma.leaveRequest.findMany({
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
                    approver: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                },
                orderBy: [
                    { startDate: 'desc' },
                    { appliedAt: 'desc' },
                ],
                skip: offset,
                take: limit,
            }),
            this.prisma.leaveRequest.count({ where }),
        ]);
        const transformedLeaveRequests = leaveRequests.map(leaveRequestData => this.transformLeaveRequest(leaveRequestData));
        return (0, base_1.createPaginationResult)(transformedLeaveRequests, total, page, limit);
    }
    async update(id, data) {
        const updateData = {
            ...data,
            attachments: data.attachments ? JSON.stringify(data.attachments) : undefined,
        };
        const leaveRequestData = await this.prisma.leaveRequest.update({
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
                approver: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
        return this.transformLeaveRequest(leaveRequestData);
    }
    async delete(id) {
        await this.prisma.leaveRequest.delete({
            where: { id },
        });
    }
    async count(filters) {
        const where = this.buildWhereClause(filters);
        return this.prisma.leaveRequest.count({ where });
    }
    // Additional methods specific to LeaveRequest repository
    async findByUser(userId, pagination) {
        return this.findMany({ userId }, pagination);
    }
    async findByType(type, pagination) {
        return this.findMany({ type }, pagination);
    }
    async findByStatus(status, pagination) {
        return this.findMany({ status }, pagination);
    }
    async findPendingApproval(pagination) {
        return this.findMany({ status: 'PENDING' }, pagination);
    }
    async findApproved(pagination) {
        return this.findMany({ status: 'APPROVED' }, pagination);
    }
    async findRejected(pagination) {
        return this.findMany({ status: 'REJECTED' }, pagination);
    }
    async findCancelled(pagination) {
        return this.findMany({ status: 'CANCELLED' }, pagination);
    }
    async findByApprover(approvedBy, pagination) {
        return this.findMany({ approvedBy }, pagination);
    }
    async findEmergency(pagination) {
        return this.findMany({ isEmergency: true }, pagination);
    }
    async findOverlapping(userId, startDate, endDate, excludeId) {
        const where = {
            userId,
            status: { in: ['PENDING', 'APPROVED'] },
            OR: [
                {
                    startDate: { lte: endDate },
                    endDate: { gte: startDate },
                },
            ],
        };
        if (excludeId) {
            where.id = { not: excludeId };
        }
        const leaveRequests = await this.prisma.leaveRequest.findMany({
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
                approver: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
        return leaveRequests.map(leaveRequestData => this.transformLeaveRequest(leaveRequestData));
    }
    async approveLeaveRequest(id, approvedBy, notes) {
        return this.update(id, {
            status: 'APPROVED',
            approvedBy,
            approvedAt: new Date(),
            notes,
        });
    }
    async rejectLeaveRequest(id, rejectedBy, reason) {
        return this.update(id, {
            status: 'REJECTED',
            rejectedBy,
            rejectedAt: new Date(),
            rejectionReason: reason,
        });
    }
    async cancelLeaveRequest(id, cancelledBy, reason) {
        return this.update(id, {
            status: 'CANCELLED',
            cancelledBy,
            cancelledAt: new Date(),
            cancellationReason: reason,
        });
    }
    async getLeaveRequestStatistics(filters) {
        const where = this.buildWhereClause(filters);
        const [total, byStatus, byType, byDuration, emergency,] = await Promise.all([
            this.prisma.leaveRequest.count({ where }),
            this.prisma.leaveRequest.groupBy({
                by: ['status'],
                where,
                _count: { status: true },
            }),
            this.prisma.leaveRequest.groupBy({
                by: ['type'],
                where,
                _count: { type: true },
            }),
            this.prisma.leaveRequest.groupBy({
                by: ['duration'],
                where,
                _count: { duration: true },
            }),
            this.prisma.leaveRequest.count({
                where: { ...where, isEmergency: true },
            }),
        ]);
        return {
            total,
            byStatus: byStatus.reduce((acc, item) => ({ ...acc, [item.status]: item._count.status }), {}),
            byType: byType.reduce((acc, item) => ({ ...acc, [item.type]: item._count.type }), {}),
            byDuration: byDuration.reduce((acc, item) => ({ ...acc, [item.duration]: item._count.duration }), {}),
            emergency,
        };
    }
    async getUserLeaveSummary(userId, year) {
        const where = { userId };
        if (year) {
            const startOfYear = new Date(year, 0, 1);
            const endOfYear = new Date(year, 11, 31);
            where.startDate = { gte: startOfYear, lte: endOfYear };
        }
        const [total, approved, pending, rejected, cancelled, byType, totalDays,] = await Promise.all([
            this.prisma.leaveRequest.count({ where }),
            this.prisma.leaveRequest.count({ where: { ...where, status: 'APPROVED' } }),
            this.prisma.leaveRequest.count({ where: { ...where, status: 'PENDING' } }),
            this.prisma.leaveRequest.count({ where: { ...where, status: 'REJECTED' } }),
            this.prisma.leaveRequest.count({ where: { ...where, status: 'CANCELLED' } }),
            this.prisma.leaveRequest.groupBy({
                by: ['type'],
                where: { ...where, status: 'APPROVED' },
                _count: { type: true },
            }),
            this.prisma.leaveRequest.aggregate({
                where: { ...where, status: 'APPROVED' },
                _sum: { totalDays: true },
            }),
        ]);
        return {
            total,
            approved,
            pending,
            rejected,
            cancelled,
            byType: byType.reduce((acc, item) => ({ ...acc, [item.type]: item._count.type }), {}),
            totalDays: totalDays._sum.totalDays || 0,
        };
    }
    async getLeaveCalendar(startDate, endDate, filters) {
        const where = this.buildWhereClause({
            ...filters,
            startDateFrom: startDate,
            startDateTo: endDate,
            status: 'APPROVED',
        });
        const leaveRequests = await this.prisma.leaveRequest.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        role: true,
                    },
                },
            },
            orderBy: [
                { startDate: 'asc' },
            ],
        });
        return leaveRequests.map(leaveRequest => ({
            id: leaveRequest.id,
            userId: leaveRequest.userId,
            type: leaveRequest.type,
            status: leaveRequest.status,
            startDate: leaveRequest.startDate,
            endDate: leaveRequest.endDate,
            duration: leaveRequest.duration,
            firstName: leaveRequest.user.firstName,
            lastName: leaveRequest.user.lastName,
            userRole: leaveRequest.user.role,
        }));
    }
    buildWhereClause(filters) {
        if (!filters)
            return {};
        const where = {};
        // Search filter
        if (filters.search) {
            where.OR = [
                { reason: { contains: filters.search } },
                { notes: { contains: filters.search } },
                { emergencyContact: { contains: filters.search } },
            ];
        }
        // User filter
        if (filters.userId) {
            where.userId = filters.userId;
        }
        // Type filter
        if (filters.type) {
            where.type = filters.type;
        }
        // Status filter
        if (filters.status) {
            where.status = filters.status;
        }
        // Duration filter
        if (filters.duration) {
            where.duration = filters.duration;
        }
        // Applied by filter
        if (filters.appliedBy) {
            where.appliedBy = filters.appliedBy;
        }
        // Approved by filter
        if (filters.approvedBy) {
            where.approvedBy = filters.approvedBy;
        }
        // Emergency filter
        if (filters.isEmergency !== undefined) {
            where.isEmergency = filters.isEmergency;
        }
        // Start date range filter
        if (filters.startDateFrom || filters.startDateTo) {
            where.startDate = {};
            if (filters.startDateFrom)
                where.startDate.gte = filters.startDateFrom;
            if (filters.startDateTo)
                where.startDate.lte = filters.startDateTo;
        }
        // End date range filter
        if (filters.endDateFrom || filters.endDateTo) {
            where.endDate = {};
            if (filters.endDateFrom)
                where.endDate.gte = filters.endDateFrom;
            if (filters.endDateTo)
                where.endDate.lte = filters.endDateTo;
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
    transformLeaveRequest(leaveRequestData) {
        return {
            ...leaveRequestData,
            attachments: leaveRequestData.attachments ? JSON.parse(leaveRequestData.attachments) : [],
        };
    }
}
exports.LeaveRequestRepository = LeaveRequestRepository;
