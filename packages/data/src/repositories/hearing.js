"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HearingRepository = void 0;
const base_1 = require("./base");
class HearingRepository extends base_1.BaseRepositoryImpl {
    async create(data) {
        const hearingData = await this.prisma.hearing.create({
            data: {
                ...data,
                attendees: data.attendees ? JSON.stringify(data.attendees) : '[]',
                documents: data.documents ? JSON.stringify(data.documents) : '[]',
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
        });
        return this.transformHearing(hearingData);
    }
    async findById(id) {
        const hearingData = await this.prisma.hearing.findUnique({
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
        });
        return hearingData ? this.transformHearing(hearingData) : null;
    }
    async findMany(filters, pagination) {
        const { page, limit, offset } = this.buildPaginationOptions(pagination);
        const where = this.buildWhereClause(filters);
        const [hearings, total] = await Promise.all([
            this.prisma.hearing.findMany({
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
                    { scheduledDate: 'asc' },
                    { scheduledTime: 'asc' },
                ],
                skip: offset,
                take: limit,
            }),
            this.prisma.hearing.count({ where }),
        ]);
        const transformedHearings = hearings.map(hearingData => this.transformHearing(hearingData));
        return (0, base_1.createPaginationResult)(transformedHearings, total, page, limit);
    }
    async update(id, data) {
        const updateData = {
            ...data,
            attendees: data.attendees ? JSON.stringify(data.attendees) : undefined,
            documents: data.documents ? JSON.stringify(data.documents) : undefined,
        };
        const hearingData = await this.prisma.hearing.update({
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
        });
        return this.transformHearing(hearingData);
    }
    async delete(id) {
        await this.prisma.hearing.delete({
            where: { id },
        });
    }
    async count(filters) {
        const where = this.buildWhereClause(filters);
        return this.prisma.hearing.count({ where });
    }
    // Additional methods specific to Hearing repository
    async findByCase(caseId, pagination) {
        return this.findMany({ caseId }, pagination);
    }
    async findUpcoming(days = 7, pagination) {
        const fromDate = new Date();
        const toDate = new Date();
        toDate.setDate(toDate.getDate() + days);
        return this.findMany({
            scheduledDateFrom: fromDate,
            scheduledDateTo: toDate,
            status: 'SCHEDULED',
        }, pagination);
    }
    async findOverdue(pagination) {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return this.findMany({
            scheduledDateTo: today,
            status: 'SCHEDULED',
        }, pagination);
    }
    async findByAttendee(attendeeId, pagination) {
        return this.findMany({ attendeeId }, pagination);
    }
    async findByCourt(courtName, pagination) {
        return this.findMany({ courtName }, pagination);
    }
    async getHearingStatistics(filters) {
        const where = this.buildWhereClause(filters);
        const [total, byStatus, byType, byCourt, upcoming, overdue,] = await Promise.all([
            this.prisma.hearing.count({ where }),
            this.prisma.hearing.groupBy({
                by: ['status'],
                where,
                _count: { status: true },
            }),
            this.prisma.hearing.groupBy({
                by: ['type'],
                where,
                _count: { type: true },
            }),
            this.prisma.hearing.groupBy({
                by: ['courtName'],
                where,
                _count: { courtName: true },
            }),
            this.prisma.hearing.count({
                where: {
                    ...where,
                    scheduledDate: { gte: new Date() },
                    status: 'SCHEDULED',
                },
            }),
            this.prisma.hearing.count({
                where: {
                    ...where,
                    scheduledDate: { lt: new Date() },
                    status: 'SCHEDULED',
                },
            }),
        ]);
        return {
            total,
            byStatus: byStatus.reduce((acc, item) => ({ ...acc, [item.status]: item._count.status }), {}),
            byType: byType.reduce((acc, item) => ({ ...acc, [item.type]: item._count.type }), {}),
            byCourt: byCourt.reduce((acc, item) => ({ ...acc, [item.courtName]: item._count.courtName }), {}),
            upcoming,
            overdue,
        };
    }
    async getHearingCalendar(startDate, endDate, filters) {
        const where = this.buildWhereClause({
            ...filters,
            scheduledDateFrom: startDate,
            scheduledDateTo: endDate,
        });
        const hearings = await this.prisma.hearing.findMany({
            where,
            include: {
                case: {
                    select: {
                        id: true,
                        caseNumber: true,
                        title: true,
                        status: true,
                    },
                },
            },
            orderBy: [
                { scheduledDate: 'asc' },
                { scheduledTime: 'asc' },
            ],
        });
        return hearings.map(hearing => ({
            id: hearing.id,
            caseId: hearing.caseId,
            hearingNumber: hearing.hearingNumber,
            type: hearing.type,
            status: hearing.status,
            scheduledDate: hearing.scheduledDate,
            scheduledTime: hearing.scheduledTime,
            duration: hearing.duration,
            courtName: hearing.courtName,
            courtroom: hearing.courtroom,
            caseNumber: hearing.case.caseNumber,
            caseTitle: hearing.case.title,
        }));
    }
    buildWhereClause(filters) {
        if (!filters)
            return {};
        const where = {};
        // Search filter
        if (filters.search) {
            where.OR = [
                { hearingNumber: { contains: filters.search } },
                { description: { contains: filters.search } },
                { agenda: { contains: filters.search } },
                { courtName: { contains: filters.search } },
                { judgeName: { contains: filters.search } },
            ];
        }
        // Case filter
        if (filters.caseId) {
            where.caseId = filters.caseId;
        }
        // Type filter
        if (filters.type) {
            where.type = filters.type;
        }
        // Status filter
        if (filters.status) {
            where.status = filters.status;
        }
        // Court filter
        if (filters.courtName) {
            where.courtName = { contains: filters.courtName };
        }
        // Judge filter
        if (filters.judgeName) {
            where.judgeName = { contains: filters.judgeName };
        }
        // Confidential filter
        if (filters.isConfidential !== undefined) {
            where.isConfidential = filters.isConfidential;
        }
        // Attendee filter
        if (filters.attendeeId) {
            where.attendees = {
                contains: filters.attendeeId,
            };
        }
        // Scheduled date range filter
        if (filters.scheduledDateFrom || filters.scheduledDateTo) {
            where.scheduledDate = {};
            if (filters.scheduledDateFrom)
                where.scheduledDate.gte = filters.scheduledDateFrom;
            if (filters.scheduledDateTo)
                where.scheduledDate.lte = filters.scheduledDateTo;
        }
        // Next hearing date range filter
        if (filters.nextHearingDateFrom || filters.nextHearingDateTo) {
            where.nextHearingDate = {};
            if (filters.nextHearingDateFrom)
                where.nextHearingDate.gte = filters.nextHearingDateFrom;
            if (filters.nextHearingDateTo)
                where.nextHearingDate.lte = filters.nextHearingDateTo;
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
    transformHearing(hearingData) {
        return {
            ...hearingData,
            attendees: hearingData.attendees ? JSON.parse(hearingData.attendees) : [],
            documents: hearingData.documents ? JSON.parse(hearingData.documents) : [],
        };
    }
}
exports.HearingRepository = HearingRepository;
