import { z } from 'zod'

// Audit Action Enum
export const AuditActionSchema = z.enum([
  'CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT',
  'APPROVE', 'REJECT', 'ASSIGN', 'UNASSIGN', 'EXPORT', 'IMPORT',
  'UPLOAD', 'DOWNLOAD', 'SHARE', 'ARCHIVE', 'RESTORE', 'OTHER'
])
export type AuditAction = z.infer<typeof AuditActionSchema>

// Audit Entity Type Enum
export const AuditEntityTypeSchema = z.enum([
  'USER', 'TEAM', 'CASE', 'PARTY', 'HEARING', 'ORDER',
  'TASK', 'SUBTASK', 'WORKLOG', 'LEAVE_REQUEST', 'DOCUMENT',
  'SYSTEM', 'CONFIGURATION', 'OTHER'
])
export type AuditEntityType = z.infer<typeof AuditEntityTypeSchema>

// Audit Severity Enum
export const AuditSeveritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
export type AuditSeverity = z.infer<typeof AuditSeveritySchema>

// Base Audit Log Schema
export const AuditLogSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid().optional(), // User who performed the action
  sessionId: z.string().optional(),
  action: AuditActionSchema,
  entityType: AuditEntityTypeSchema,
  entityId: z.string().cuid().optional(), // ID of the affected entity
  entityName: z.string().max(200).optional(), // Name/title of the affected entity
  severity: AuditSeveritySchema.default('MEDIUM'),
  description: z.string().min(1).max(1000),
  details: z.record(z.any()).optional(), // Additional details as JSON
  oldValues: z.record(z.any()).optional(), // Previous values (for updates)
  newValues: z.record(z.any()).optional(), // New values (for updates)
  ipAddress: z.string().ip().optional(),
  userAgent: z.string().max(500).optional(),
  location: z.string().max(200).optional(),
  resource: z.string().max(200).optional(), // Resource/endpoint accessed
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).optional(),
  statusCode: z.number().int().min(100).max(599).optional(),
  responseTime: z.number().positive().optional(), // Response time in ms
  errorMessage: z.string().max(1000).optional(),
  tags: z.array(z.string()).default([]),
  isSensitive: z.boolean().default(false),
  retentionDate: z.date().optional(), // When this log should be deleted
  createdAt: z.date(),
})

// Create Audit Log Schema
export const CreateAuditLogSchema = AuditLogSchema.omit({
  id: true,
  createdAt: true,
})

// Audit Log Search Schema
export const AuditLogSearchSchema = z.object({
  query: z.string().optional(),
  userId: z.string().cuid().optional(),
  action: AuditActionSchema.optional(),
  entityType: AuditEntityTypeSchema.optional(),
  entityId: z.string().cuid().optional(),
  severity: AuditSeveritySchema.optional(),
  ipAddress: z.string().ip().optional(),
  resource: z.string().optional(),
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).optional(),
  statusCode: z.number().int().min(100).max(599).optional(),
  isSensitive: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  limit: z.number().int().positive().max(1000).default(50),
  offset: z.number().int().min(0).default(0),
})

// Audit Log List Schema
export const AuditLogListSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid().optional(),
  action: AuditActionSchema,
  entityType: AuditEntityTypeSchema,
  entityId: z.string().cuid().optional(),
  entityName: z.string().max(200).optional(),
  severity: AuditSeveritySchema,
  description: z.string(),
  ipAddress: z.string().ip().optional(),
  resource: z.string().max(200).optional(),
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).optional(),
  statusCode: z.number().int().min(100).max(599).optional(),
  createdAt: z.date(),
})

// Audit Log with User Schema
export const AuditLogWithUserSchema = AuditLogSchema.extend({
  user: z.object({
    id: z.string().cuid(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
  }).optional(),
})

// Audit Log Statistics Schema
export const AuditLogStatisticsSchema = z.object({
  totalLogs: z.number().int().min(0),
  byAction: z.record(z.string(), z.number().int().min(0)),
  byEntityType: z.record(z.string(), z.number().int().min(0)),
  bySeverity: z.object({
    low: z.number().int().min(0),
    medium: z.number().int().min(0),
    high: z.number().int().min(0),
    critical: z.number().int().min(0),
  }),
  byStatusCode: z.record(z.string(), z.number().int().min(0)),
  averageResponseTime: z.number().positive().optional(),
  errorRate: z.number().min(0).max(1), // Percentage of errors
  topUsers: z.array(z.object({
    userId: z.string().cuid(),
    firstName: z.string(),
    lastName: z.string(),
    actionCount: z.number().int().min(0),
  })),
  topResources: z.array(z.object({
    resource: z.string(),
    requestCount: z.number().int().min(0),
  })),
})

// Audit Log Export Schema
export const AuditLogExportSchema = z.object({
  format: z.enum(['CSV', 'JSON', 'XLSX']).default('CSV'),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  filters: AuditLogSearchSchema.omit({
    limit: true,
    offset: true,
  }).optional(),
  includeSensitive: z.boolean().default(false),
})

// Audit Log Retention Schema
export const AuditLogRetentionSchema = z.object({
  entityType: AuditEntityTypeSchema,
  retentionDays: z.number().int().positive(),
  isActive: z.boolean().default(true),
})

// Export Types
export type AuditLog = z.infer<typeof AuditLogSchema>
export type CreateAuditLog = z.infer<typeof CreateAuditLogSchema>
export type AuditLogSearch = z.infer<typeof AuditLogSearchSchema>
export type AuditLogList = z.infer<typeof AuditLogListSchema>
export type AuditLogWithUser = z.infer<typeof AuditLogWithUserSchema>
export type AuditLogStatistics = z.infer<typeof AuditLogStatisticsSchema>
export type AuditLogExport = z.infer<typeof AuditLogExportSchema>
export type AuditLogRetention = z.infer<typeof AuditLogRetentionSchema>
