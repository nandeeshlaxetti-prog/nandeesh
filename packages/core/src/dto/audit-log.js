"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogRetentionSchema = exports.AuditLogExportSchema = exports.AuditLogStatisticsSchema = exports.AuditLogWithUserSchema = exports.AuditLogListSchema = exports.AuditLogSearchSchema = exports.CreateAuditLogSchema = exports.AuditLogSchema = exports.AuditSeveritySchema = exports.AuditEntityTypeSchema = exports.AuditActionSchema = void 0;
const zod_1 = require("zod");
// Audit Action Enum
exports.AuditActionSchema = zod_1.z.enum([
    'CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT',
    'APPROVE', 'REJECT', 'ASSIGN', 'UNASSIGN', 'EXPORT', 'IMPORT',
    'UPLOAD', 'DOWNLOAD', 'SHARE', 'ARCHIVE', 'RESTORE', 'OTHER'
]);
// Audit Entity Type Enum
exports.AuditEntityTypeSchema = zod_1.z.enum([
    'USER', 'TEAM', 'CASE', 'PARTY', 'HEARING', 'ORDER',
    'TASK', 'SUBTASK', 'WORKLOG', 'LEAVE_REQUEST', 'DOCUMENT',
    'SYSTEM', 'CONFIGURATION', 'OTHER'
]);
// Audit Severity Enum
exports.AuditSeveritySchema = zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
// Base Audit Log Schema
exports.AuditLogSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    userId: zod_1.z.string().cuid().optional(), // User who performed the action
    sessionId: zod_1.z.string().optional(),
    action: exports.AuditActionSchema,
    entityType: exports.AuditEntityTypeSchema,
    entityId: zod_1.z.string().cuid().optional(), // ID of the affected entity
    entityName: zod_1.z.string().max(200).optional(), // Name/title of the affected entity
    severity: exports.AuditSeveritySchema.default('MEDIUM'),
    description: zod_1.z.string().min(1).max(1000),
    details: zod_1.z.record(zod_1.z.any()).optional(), // Additional details as JSON
    oldValues: zod_1.z.record(zod_1.z.any()).optional(), // Previous values (for updates)
    newValues: zod_1.z.record(zod_1.z.any()).optional(), // New values (for updates)
    ipAddress: zod_1.z.string().ip().optional(),
    userAgent: zod_1.z.string().max(500).optional(),
    location: zod_1.z.string().max(200).optional(),
    resource: zod_1.z.string().max(200).optional(), // Resource/endpoint accessed
    method: zod_1.z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).optional(),
    statusCode: zod_1.z.number().int().min(100).max(599).optional(),
    responseTime: zod_1.z.number().positive().optional(), // Response time in ms
    errorMessage: zod_1.z.string().max(1000).optional(),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    isSensitive: zod_1.z.boolean().default(false),
    retentionDate: zod_1.z.date().optional(), // When this log should be deleted
    createdAt: zod_1.z.date(),
});
// Create Audit Log Schema
exports.CreateAuditLogSchema = exports.AuditLogSchema.omit({
    id: true,
    createdAt: true,
});
// Audit Log Search Schema
exports.AuditLogSearchSchema = zod_1.z.object({
    query: zod_1.z.string().optional(),
    userId: zod_1.z.string().cuid().optional(),
    action: exports.AuditActionSchema.optional(),
    entityType: exports.AuditEntityTypeSchema.optional(),
    entityId: zod_1.z.string().cuid().optional(),
    severity: exports.AuditSeveritySchema.optional(),
    ipAddress: zod_1.z.string().ip().optional(),
    resource: zod_1.z.string().optional(),
    method: zod_1.z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).optional(),
    statusCode: zod_1.z.number().int().min(100).max(599).optional(),
    isSensitive: zod_1.z.boolean().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    dateFrom: zod_1.z.date().optional(),
    dateTo: zod_1.z.date().optional(),
    limit: zod_1.z.number().int().positive().max(1000).default(50),
    offset: zod_1.z.number().int().min(0).default(0),
});
// Audit Log List Schema
exports.AuditLogListSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    userId: zod_1.z.string().cuid().optional(),
    action: exports.AuditActionSchema,
    entityType: exports.AuditEntityTypeSchema,
    entityId: zod_1.z.string().cuid().optional(),
    entityName: zod_1.z.string().max(200).optional(),
    severity: exports.AuditSeveritySchema,
    description: zod_1.z.string(),
    ipAddress: zod_1.z.string().ip().optional(),
    resource: zod_1.z.string().max(200).optional(),
    method: zod_1.z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).optional(),
    statusCode: zod_1.z.number().int().min(100).max(599).optional(),
    createdAt: zod_1.z.date(),
});
// Audit Log with User Schema
exports.AuditLogWithUserSchema = exports.AuditLogSchema.extend({
    user: zod_1.z.object({
        id: zod_1.z.string().cuid(),
        firstName: zod_1.z.string(),
        lastName: zod_1.z.string(),
        email: zod_1.z.string().email(),
    }).optional(),
});
// Audit Log Statistics Schema
exports.AuditLogStatisticsSchema = zod_1.z.object({
    totalLogs: zod_1.z.number().int().min(0),
    byAction: zod_1.z.record(zod_1.z.string(), zod_1.z.number().int().min(0)),
    byEntityType: zod_1.z.record(zod_1.z.string(), zod_1.z.number().int().min(0)),
    bySeverity: zod_1.z.object({
        low: zod_1.z.number().int().min(0),
        medium: zod_1.z.number().int().min(0),
        high: zod_1.z.number().int().min(0),
        critical: zod_1.z.number().int().min(0),
    }),
    byStatusCode: zod_1.z.record(zod_1.z.string(), zod_1.z.number().int().min(0)),
    averageResponseTime: zod_1.z.number().positive().optional(),
    errorRate: zod_1.z.number().min(0).max(1), // Percentage of errors
    topUsers: zod_1.z.array(zod_1.z.object({
        userId: zod_1.z.string().cuid(),
        firstName: zod_1.z.string(),
        lastName: zod_1.z.string(),
        actionCount: zod_1.z.number().int().min(0),
    })),
    topResources: zod_1.z.array(zod_1.z.object({
        resource: zod_1.z.string(),
        requestCount: zod_1.z.number().int().min(0),
    })),
});
// Audit Log Export Schema
exports.AuditLogExportSchema = zod_1.z.object({
    format: zod_1.z.enum(['CSV', 'JSON', 'XLSX']).default('CSV'),
    dateFrom: zod_1.z.date().optional(),
    dateTo: zod_1.z.date().optional(),
    filters: exports.AuditLogSearchSchema.omit({
        limit: true,
        offset: true,
    }).optional(),
    includeSensitive: zod_1.z.boolean().default(false),
});
// Audit Log Retention Schema
exports.AuditLogRetentionSchema = zod_1.z.object({
    entityType: exports.AuditEntityTypeSchema,
    retentionDays: zod_1.z.number().int().positive(),
    isActive: zod_1.z.boolean().default(true),
});
