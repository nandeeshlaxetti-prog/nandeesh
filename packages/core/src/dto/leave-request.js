"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveStatisticsSchema = exports.LeaveCalendarSchema = exports.LeaveBalanceSchema = exports.LeaveRequestCancellationSchema = exports.LeaveRequestApprovalSchema = exports.LeaveRequestWithApproverSchema = exports.LeaveRequestWithUserSchema = exports.LeaveRequestListSchema = exports.LeaveRequestSearchSchema = exports.UpdateLeaveRequestSchema = exports.CreateLeaveRequestSchema = exports.LeaveRequestSchema = exports.LeaveDurationSchema = exports.LeaveStatusSchema = exports.LeaveTypeSchema = void 0;
const zod_1 = require("zod");
// Leave Type Enum
exports.LeaveTypeSchema = zod_1.z.enum([
    'SICK_LEAVE', 'ANNUAL_LEAVE', 'CASUAL_LEAVE', 'MATERNITY_LEAVE',
    'PATERNITY_LEAVE', 'BEREAVEMENT_LEAVE', 'COMPENSATORY_LEAVE',
    'SABBATICAL', 'UNPAID_LEAVE', 'OTHER'
]);
// Leave Status Enum
exports.LeaveStatusSchema = zod_1.z.enum(['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']);
// Leave Duration Enum
exports.LeaveDurationSchema = zod_1.z.enum(['FULL_DAY', 'HALF_DAY_MORNING', 'HALF_DAY_EVENING', 'HOURLY']);
// Base Leave Request Schema
exports.LeaveRequestSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    userId: zod_1.z.string().cuid(),
    type: exports.LeaveTypeSchema.default('ANNUAL_LEAVE'),
    status: exports.LeaveStatusSchema.default('PENDING'),
    duration: exports.LeaveDurationSchema.default('FULL_DAY'),
    startDate: zod_1.z.date(),
    endDate: zod_1.z.date(),
    startTime: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(), // HH:MM format
    endTime: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(), // HH:MM format
    totalDays: zod_1.z.number().positive(),
    reason: zod_1.z.string().min(1).max(1000),
    medicalCertificate: zod_1.z.string().cuid().optional(), // Document ID
    emergencyContact: zod_1.z.string().max(200).optional(),
    emergencyPhone: zod_1.z.string().optional(),
    attachments: zod_1.z.array(zod_1.z.string().cuid()).default([]), // Document IDs
    appliedBy: zod_1.z.string().cuid(), // Who applied (could be different from userId)
    appliedAt: zod_1.z.date(),
    approvedBy: zod_1.z.string().cuid().optional(),
    approvedAt: zod_1.z.date().optional(),
    rejectedBy: zod_1.z.string().cuid().optional(),
    rejectedAt: zod_1.z.date().optional(),
    rejectionReason: zod_1.z.string().max(500).optional(),
    cancelledBy: zod_1.z.string().cuid().optional(),
    cancelledAt: zod_1.z.date().optional(),
    cancellationReason: zod_1.z.string().max(500).optional(),
    notes: zod_1.z.string().max(1000).optional(),
    isEmergency: zod_1.z.boolean().default(false),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
// Create Leave Request Schema
exports.CreateLeaveRequestSchema = exports.LeaveRequestSchema.omit({
    id: true,
    appliedAt: true,
    approvedAt: true,
    rejectedAt: true,
    cancelledAt: true,
    createdAt: true,
    updatedAt: true,
});
// Update Leave Request Schema
exports.UpdateLeaveRequestSchema = exports.CreateLeaveRequestSchema.partial();
// Leave Request Search Schema
exports.LeaveRequestSearchSchema = zod_1.z.object({
    query: zod_1.z.string().optional(),
    userId: zod_1.z.string().cuid().optional(),
    type: exports.LeaveTypeSchema.optional(),
    status: exports.LeaveStatusSchema.optional(),
    duration: exports.LeaveDurationSchema.optional(),
    startDateFrom: zod_1.z.date().optional(),
    startDateTo: zod_1.z.date().optional(),
    endDateFrom: zod_1.z.date().optional(),
    endDateTo: zod_1.z.date().optional(),
    appliedBy: zod_1.z.string().cuid().optional(),
    approvedBy: zod_1.z.string().cuid().optional(),
    isEmergency: zod_1.z.boolean().optional(),
    limit: zod_1.z.number().int().positive().max(100).default(20),
    offset: zod_1.z.number().int().min(0).default(0),
});
// Leave Request List Schema
exports.LeaveRequestListSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    userId: zod_1.z.string().cuid(),
    type: exports.LeaveTypeSchema,
    status: exports.LeaveStatusSchema,
    duration: exports.LeaveDurationSchema,
    startDate: zod_1.z.date(),
    endDate: zod_1.z.date(),
    totalDays: zod_1.z.number().positive(),
    reason: zod_1.z.string(),
    appliedAt: zod_1.z.date(),
    approvedAt: zod_1.z.date().optional(),
    rejectedAt: zod_1.z.date().optional(),
    isEmergency: zod_1.z.boolean(),
});
// Leave Request with User Schema
exports.LeaveRequestWithUserSchema = exports.LeaveRequestSchema.extend({
    user: zod_1.z.object({
        id: zod_1.z.string().cuid(),
        firstName: zod_1.z.string(),
        lastName: zod_1.z.string(),
        email: zod_1.z.string().email(),
    }),
});
// Leave Request with Approver Schema
exports.LeaveRequestWithApproverSchema = exports.LeaveRequestSchema.extend({
    approver: zod_1.z.object({
        id: zod_1.z.string().cuid(),
        firstName: zod_1.z.string(),
        lastName: zod_1.z.string(),
        email: zod_1.z.string().email(),
    }).optional(),
});
// Leave Request Approval Schema
exports.LeaveRequestApprovalSchema = zod_1.z.object({
    leaveRequestId: zod_1.z.string().cuid(),
    status: zod_1.z.enum(['APPROVED', 'REJECTED']),
    notes: zod_1.z.string().max(500).optional(),
});
// Leave Request Cancellation Schema
exports.LeaveRequestCancellationSchema = zod_1.z.object({
    leaveRequestId: zod_1.z.string().cuid(),
    reason: zod_1.z.string().max(500),
});
// Leave Balance Schema
exports.LeaveBalanceSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    leaveType: exports.LeaveTypeSchema,
    totalDays: zod_1.z.number().int().min(0),
    usedDays: zod_1.z.number().int().min(0),
    remainingDays: zod_1.z.number().int().min(0),
    pendingDays: zod_1.z.number().int().min(0),
});
// Leave Calendar Schema
exports.LeaveCalendarSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    userId: zod_1.z.string().cuid(),
    type: exports.LeaveTypeSchema,
    status: exports.LeaveStatusSchema,
    startDate: zod_1.z.date(),
    endDate: zod_1.z.date(),
    duration: exports.LeaveDurationSchema,
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
});
// Leave Statistics Schema
exports.LeaveStatisticsSchema = zod_1.z.object({
    totalRequests: zod_1.z.number().int().min(0),
    pending: zod_1.z.number().int().min(0),
    approved: zod_1.z.number().int().min(0),
    rejected: zod_1.z.number().int().min(0),
    cancelled: zod_1.z.number().int().min(0),
    byType: zod_1.z.record(zod_1.z.string(), zod_1.z.number().int().min(0)),
    byDuration: zod_1.z.object({
        fullDay: zod_1.z.number().int().min(0),
        halfDayMorning: zod_1.z.number().int().min(0),
        halfDayEvening: zod_1.z.number().int().min(0),
        hourly: zod_1.z.number().int().min(0),
    }),
    averageDaysPerRequest: zod_1.z.number().positive(),
    mostCommonLeaveType: zod_1.z.string().optional(),
});
