"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseStatisticsSchema = exports.CaseWithRelationsSchema = exports.CaseListSchema = exports.CaseSearchSchema = exports.UpdateCaseSchema = exports.CreateCaseSchema = exports.CaseSchema = exports.CaseTypeSchema = exports.CasePrioritySchema = exports.CaseStatusSchema = void 0;
const zod_1 = require("zod");
// Case Status Enum
exports.CaseStatusSchema = zod_1.z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED', 'ARCHIVED', 'SUSPENDED']);
// Case Priority Enum
exports.CasePrioritySchema = zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);
// Case Type Enum
exports.CaseTypeSchema = zod_1.z.enum([
    'CIVIL', 'CRIMINAL', 'FAMILY', 'CORPORATE', 'INTELLECTUAL_PROPERTY',
    'LABOR', 'TAX', 'REAL_ESTATE', 'BANKING', 'INSURANCE', 'OTHER'
]);
// Base Case Schema
exports.CaseSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    caseNumber: zod_1.z.string().min(1).max(50),
    title: zod_1.z.string().min(1).max(200),
    description: zod_1.z.string().max(2000).optional(),
    status: exports.CaseStatusSchema.default('OPEN'),
    priority: exports.CasePrioritySchema.default('MEDIUM'),
    type: exports.CaseTypeSchema.default('CIVIL'),
    clientId: zod_1.z.string().cuid(),
    assignedLawyerId: zod_1.z.string().cuid().optional(),
    teamId: zod_1.z.string().cuid().optional(),
    courtName: zod_1.z.string().max(200).optional(),
    courtLocation: zod_1.z.string().max(200).optional(),
    caseValue: zod_1.z.number().positive().optional(),
    currency: zod_1.z.string().length(3).default('INR'), // ISO currency code
    filingDate: zod_1.z.date().optional(),
    expectedCompletionDate: zod_1.z.date().optional(),
    actualCompletionDate: zod_1.z.date().optional(),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    isConfidential: zod_1.z.boolean().default(false),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
// Create Case Schema
exports.CreateCaseSchema = exports.CaseSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    actualCompletionDate: true,
});
// Update Case Schema
exports.UpdateCaseSchema = exports.CreateCaseSchema.partial();
// Case Search Schema
exports.CaseSearchSchema = zod_1.z.object({
    query: zod_1.z.string().optional(),
    status: exports.CaseStatusSchema.optional(),
    priority: exports.CasePrioritySchema.optional(),
    type: exports.CaseTypeSchema.optional(),
    clientId: zod_1.z.string().cuid().optional(),
    assignedLawyerId: zod_1.z.string().cuid().optional(),
    teamId: zod_1.z.string().cuid().optional(),
    courtName: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    filingDateFrom: zod_1.z.date().optional(),
    filingDateTo: zod_1.z.date().optional(),
    isConfidential: zod_1.z.boolean().optional(),
    limit: zod_1.z.number().int().positive().max(100).default(20),
    offset: zod_1.z.number().int().min(0).default(0),
});
// Case List Schema
exports.CaseListSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    caseNumber: zod_1.z.string(),
    title: zod_1.z.string(),
    status: exports.CaseStatusSchema,
    priority: exports.CasePrioritySchema,
    type: exports.CaseTypeSchema,
    clientId: zod_1.z.string().cuid(),
    assignedLawyerId: zod_1.z.string().cuid().optional(),
    courtName: zod_1.z.string().optional(),
    filingDate: zod_1.z.date().optional(),
    createdAt: zod_1.z.date(),
});
// Case with Relations Schema
exports.CaseWithRelationsSchema = exports.CaseSchema.extend({
    client: zod_1.z.object({
        id: zod_1.z.string().cuid(),
        firstName: zod_1.z.string(),
        lastName: zod_1.z.string(),
        email: zod_1.z.string().email(),
    }),
    assignedLawyer: zod_1.z.object({
        id: zod_1.z.string().cuid(),
        firstName: zod_1.z.string(),
        lastName: zod_1.z.string(),
        email: zod_1.z.string().email(),
    }).optional(),
    team: zod_1.z.object({
        id: zod_1.z.string().cuid(),
        name: zod_1.z.string(),
    }).optional(),
});
// Case Statistics Schema
exports.CaseStatisticsSchema = zod_1.z.object({
    total: zod_1.z.number().int().min(0),
    open: zod_1.z.number().int().min(0),
    inProgress: zod_1.z.number().int().min(0),
    closed: zod_1.z.number().int().min(0),
    archived: zod_1.z.number().int().min(0),
    byPriority: zod_1.z.object({
        low: zod_1.z.number().int().min(0),
        medium: zod_1.z.number().int().min(0),
        high: zod_1.z.number().int().min(0),
        urgent: zod_1.z.number().int().min(0),
    }),
    byType: zod_1.z.record(zod_1.z.string(), zod_1.z.number().int().min(0)),
});
