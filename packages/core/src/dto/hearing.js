"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HearingStatisticsSchema = exports.HearingCalendarSchema = exports.HearingWithAttendeesSchema = exports.HearingWithCaseSchema = exports.HearingListSchema = exports.HearingSearchSchema = exports.UpdateHearingSchema = exports.CreateHearingSchema = exports.HearingSchema = exports.HearingTypeSchema = exports.HearingStatusSchema = void 0;
const zod_1 = require("zod");
// Hearing Status Enum
exports.HearingStatusSchema = zod_1.z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'POSTPONED']);
// Hearing Type Enum
exports.HearingTypeSchema = zod_1.z.enum([
    'FIRST_HEARING', 'ARGUMENTS', 'EVIDENCE', 'JUDGMENT', 'EXECUTION',
    'MEDIATION', 'ARBITRATION', 'APPEAL', 'REVIEW', 'OTHER'
]);
// Base Hearing Schema
exports.HearingSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    caseId: zod_1.z.string().cuid(),
    hearingNumber: zod_1.z.string().min(1).max(20),
    type: exports.HearingTypeSchema.default('FIRST_HEARING'),
    status: exports.HearingStatusSchema.default('SCHEDULED'),
    scheduledDate: zod_1.z.date(),
    scheduledTime: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM format
    duration: zod_1.z.number().int().positive().default(60), // Duration in minutes
    courtName: zod_1.z.string().min(1).max(200),
    courtLocation: zod_1.z.string().max(200).optional(),
    judgeName: zod_1.z.string().max(100).optional(),
    courtroom: zod_1.z.string().max(50).optional(),
    description: zod_1.z.string().max(1000).optional(),
    agenda: zod_1.z.string().max(2000).optional(),
    attendees: zod_1.z.array(zod_1.z.string().cuid()).default([]), // User IDs
    documents: zod_1.z.array(zod_1.z.string().cuid()).default([]), // Document IDs
    outcome: zod_1.z.string().max(1000).optional(),
    nextHearingDate: zod_1.z.date().optional(),
    notes: zod_1.z.string().max(2000).optional(),
    isConfidential: zod_1.z.boolean().default(false),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
// Create Hearing Schema
exports.CreateHearingSchema = exports.HearingSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
// Update Hearing Schema
exports.UpdateHearingSchema = exports.CreateHearingSchema.partial();
// Hearing Search Schema
exports.HearingSearchSchema = zod_1.z.object({
    query: zod_1.z.string().optional(),
    caseId: zod_1.z.string().cuid().optional(),
    type: exports.HearingTypeSchema.optional(),
    status: exports.HearingStatusSchema.optional(),
    courtName: zod_1.z.string().optional(),
    judgeName: zod_1.z.string().optional(),
    scheduledDateFrom: zod_1.z.date().optional(),
    scheduledDateTo: zod_1.z.date().optional(),
    attendeeId: zod_1.z.string().cuid().optional(),
    isConfidential: zod_1.z.boolean().optional(),
    limit: zod_1.z.number().int().positive().max(100).default(20),
    offset: zod_1.z.number().int().min(0).default(0),
});
// Hearing List Schema
exports.HearingListSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    caseId: zod_1.z.string().cuid(),
    hearingNumber: zod_1.z.string(),
    type: exports.HearingTypeSchema,
    status: exports.HearingStatusSchema,
    scheduledDate: zod_1.z.date(),
    scheduledTime: zod_1.z.string(),
    courtName: zod_1.z.string(),
    judgeName: zod_1.z.string().optional(),
    createdAt: zod_1.z.date(),
});
// Hearing with Case Schema
exports.HearingWithCaseSchema = exports.HearingSchema.extend({
    case: zod_1.z.object({
        id: zod_1.z.string().cuid(),
        caseNumber: zod_1.z.string(),
        title: zod_1.z.string(),
        status: zod_1.z.string(),
    }),
});
// Hearing with Attendees Schema
exports.HearingWithAttendeesSchema = exports.HearingSchema.extend({
    attendeeDetails: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string().cuid(),
        firstName: zod_1.z.string(),
        lastName: zod_1.z.string(),
        email: zod_1.z.string().email(),
        role: zod_1.z.string(),
    })),
});
// Hearing Calendar Schema
exports.HearingCalendarSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    caseId: zod_1.z.string().cuid(),
    hearingNumber: zod_1.z.string(),
    type: exports.HearingTypeSchema,
    status: exports.HearingStatusSchema,
    scheduledDate: zod_1.z.date(),
    scheduledTime: zod_1.z.string(),
    duration: zod_1.z.number().int().positive(),
    courtName: zod_1.z.string(),
    courtroom: zod_1.z.string().optional(),
    caseNumber: zod_1.z.string(),
    caseTitle: zod_1.z.string(),
});
// Hearing Statistics Schema
exports.HearingStatisticsSchema = zod_1.z.object({
    total: zod_1.z.number().int().min(0),
    scheduled: zod_1.z.number().int().min(0),
    completed: zod_1.z.number().int().min(0),
    cancelled: zod_1.z.number().int().min(0),
    postponed: zod_1.z.number().int().min(0),
    upcoming: zod_1.z.number().int().min(0), // Next 7 days
    overdue: zod_1.z.number().int().min(0), // Past scheduled hearings
});
