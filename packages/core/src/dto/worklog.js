"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorklogStatisticsSchema = exports.WorklogBulkUpdateSchema = exports.WorklogApprovalSchema = exports.WorklogWithTaskSchema = exports.WorklogWithCaseSchema = exports.WorklogWithUserSchema = exports.WorklogListSchema = exports.WorklogSearchSchema = exports.UpdateWorklogSchema = exports.CreateWorklogSchema = exports.WorklogSchema = exports.WorklogStatusSchema = exports.WorklogTypeSchema = void 0;
const zod_1 = require("zod");
// Worklog Type Enum
exports.WorklogTypeSchema = zod_1.z.enum(['CASE_WORK', 'ADMIN_WORK', 'RESEARCH', 'MEETING', 'TRAVEL', 'OTHER']);
// Worklog Status Enum
exports.WorklogStatusSchema = zod_1.z.enum(['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED']);
// Base Worklog Schema
exports.WorklogSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    userId: zod_1.z.string().cuid(),
    caseId: zod_1.z.string().cuid().optional(),
    taskId: zod_1.z.string().cuid().optional(),
    subtaskId: zod_1.z.string().cuid().optional(),
    type: exports.WorklogTypeSchema.default('CASE_WORK'),
    status: exports.WorklogStatusSchema.default('DRAFT'),
    date: zod_1.z.date(),
    startTime: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM format
    endTime: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM format
    duration: zod_1.z.number().positive(), // Duration in hours
    description: zod_1.z.string().min(1).max(2000),
    activities: zod_1.z.array(zod_1.z.string()).default([]), // List of activities performed
    billableHours: zod_1.z.number().positive().optional(),
    hourlyRate: zod_1.z.number().positive().optional(),
    totalAmount: zod_1.z.number().positive().optional(),
    location: zod_1.z.string().max(200).optional(),
    isBillable: zod_1.z.boolean().default(true),
    isOvertime: zod_1.z.boolean().default(false),
    attachments: zod_1.z.array(zod_1.z.string().cuid()).default([]), // Document IDs
    notes: zod_1.z.string().max(1000).optional(),
    approvedBy: zod_1.z.string().cuid().optional(),
    approvedAt: zod_1.z.date().optional(),
    rejectionReason: zod_1.z.string().max(500).optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
// Create Worklog Schema
exports.CreateWorklogSchema = exports.WorklogSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    approvedAt: true,
});
// Update Worklog Schema
exports.UpdateWorklogSchema = exports.CreateWorklogSchema.partial();
// Worklog Search Schema
exports.WorklogSearchSchema = zod_1.z.object({
    query: zod_1.z.string().optional(),
    userId: zod_1.z.string().cuid().optional(),
    caseId: zod_1.z.string().cuid().optional(),
    taskId: zod_1.z.string().cuid().optional(),
    subtaskId: zod_1.z.string().cuid().optional(),
    type: exports.WorklogTypeSchema.optional(),
    status: exports.WorklogStatusSchema.optional(),
    dateFrom: zod_1.z.date().optional(),
    dateTo: zod_1.z.date().optional(),
    isBillable: zod_1.z.boolean().optional(),
    isOvertime: zod_1.z.boolean().optional(),
    approvedBy: zod_1.z.string().cuid().optional(),
    limit: zod_1.z.number().int().positive().max(100).default(20),
    offset: zod_1.z.number().int().min(0).default(0),
});
// Worklog List Schema
exports.WorklogListSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    userId: zod_1.z.string().cuid(),
    caseId: zod_1.z.string().cuid().optional(),
    taskId: zod_1.z.string().cuid().optional(),
    type: exports.WorklogTypeSchema,
    status: exports.WorklogStatusSchema,
    date: zod_1.z.date(),
    duration: zod_1.z.number().positive(),
    description: zod_1.z.string(),
    billableHours: zod_1.z.number().positive().optional(),
    totalAmount: zod_1.z.number().positive().optional(),
    isBillable: zod_1.z.boolean(),
    createdAt: zod_1.z.date(),
});
// Worklog with User Schema
exports.WorklogWithUserSchema = exports.WorklogSchema.extend({
    user: zod_1.z.object({
        id: zod_1.z.string().cuid(),
        firstName: zod_1.z.string(),
        lastName: zod_1.z.string(),
        email: zod_1.z.string().email(),
    }),
});
// Worklog with Case Schema
exports.WorklogWithCaseSchema = exports.WorklogSchema.extend({
    case: zod_1.z.object({
        id: zod_1.z.string().cuid(),
        caseNumber: zod_1.z.string(),
        title: zod_1.z.string(),
    }).optional(),
});
// Worklog with Task Schema
exports.WorklogWithTaskSchema = exports.WorklogSchema.extend({
    task: zod_1.z.object({
        id: zod_1.z.string().cuid(),
        title: zod_1.z.string(),
        category: zod_1.z.string(),
    }).optional(),
});
// Worklog Approval Schema
exports.WorklogApprovalSchema = zod_1.z.object({
    worklogId: zod_1.z.string().cuid(),
    status: zod_1.z.enum(['APPROVED', 'REJECTED']),
    notes: zod_1.z.string().max(500).optional(),
});
// Worklog Bulk Update Schema
exports.WorklogBulkUpdateSchema = zod_1.z.object({
    worklogIds: zod_1.z.array(zod_1.z.string().cuid()),
    status: exports.WorklogStatusSchema.optional(),
    isBillable: zod_1.z.boolean().optional(),
    approvedBy: zod_1.z.string().cuid().optional(),
});
// Worklog Statistics Schema
exports.WorklogStatisticsSchema = zod_1.z.object({
    totalHours: zod_1.z.number().positive(),
    billableHours: zod_1.z.number().positive(),
    nonBillableHours: zod_1.z.number().positive(),
    overtimeHours: zod_1.z.number().positive(),
    totalAmount: zod_1.z.number().positive(),
    byType: zod_1.z.record(zod_1.z.string(), zod_1.z.number().positive()),
    byStatus: zod_1.z.object({
        draft: zod_1.z.number().int().min(0),
        submitted: zod_1.z.number().int().min(0),
        approved: zod_1.z.number().int().min(0),
        rejected: zod_1.z.number().int().min(0),
    }),
    averageDailyHours: zod_1.z.number().positive(),
    mostProductiveDay: zod_1.z.string().optional(),
});
