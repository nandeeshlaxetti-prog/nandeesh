"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEnhancedCaseSchema = exports.CreateEnhancedCaseSchema = exports.EnhancedCaseSchema = exports.SLAEvaluationContextSchema = exports.SLAEvaluationResultSchema = exports.UpdateSLAEvaluationSchema = exports.CreateSLAEvaluationSchema = exports.SLAEvaluationSchema = exports.UpdateSLARuleSchema = exports.CreateSLARuleSchema = exports.SLARuleSchema = exports.SLANotificationSettingsSchema = exports.SLAEscalationRuleSchema = exports.SLAMetricsSchema = exports.SLAConditionsSchema = exports.UpdateProjectSchema = exports.CreateProjectSchema = exports.ProjectSchema = exports.UpdateEmployeeSchema = exports.CreateEmployeeSchema = exports.EmployeeSchema = void 0;
const zod_1 = require("zod");
// ============================================================================
// EMPLOYEE DTOs
// ============================================================================
exports.EmployeeSchema = zod_1.z.object({
    id: zod_1.z.string(),
    employeeId: zod_1.z.string(),
    userId: zod_1.z.string(),
    department: zod_1.z.string().optional(),
    designation: zod_1.z.string().optional(),
    reportingManager: zod_1.z.string().optional(),
    employmentType: zod_1.z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'CONSULTANT']).default('FULL_TIME'),
    workLocation: zod_1.z.string().optional(),
    workSchedule: zod_1.z.string().optional(), // JSON
    skills: zod_1.z.string().default('[]'), // JSON array
    certifications: zod_1.z.string().default('[]'), // JSON array
    experience: zod_1.z.number().optional(),
    salary: zod_1.z.number().optional(),
    currency: zod_1.z.string().default('INR'),
    joiningDate: zod_1.z.date().optional(),
    probationEndDate: zod_1.z.date().optional(),
    confirmationDate: zod_1.z.date().optional(),
    lastPromotionDate: zod_1.z.date().optional(),
    nextReviewDate: zod_1.z.date().optional(),
    isActive: zod_1.z.boolean().default(true),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date()
});
exports.CreateEmployeeSchema = exports.EmployeeSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true
});
exports.UpdateEmployeeSchema = exports.CreateEmployeeSchema.partial();
// ============================================================================
// PROJECT DTOs
// ============================================================================
exports.ProjectSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    code: zod_1.z.string(),
    status: zod_1.z.enum(['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED']).default('PLANNING'),
    priority: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
    type: zod_1.z.enum(['CLIENT_PROJECT', 'INTERNAL_PROJECT', 'RESEARCH_PROJECT', 'TRAINING_PROJECT', 'OTHER']).default('CLIENT_PROJECT'),
    clientId: zod_1.z.string().optional(),
    teamId: zod_1.z.string().optional(),
    managerId: zod_1.z.string().optional(),
    startDate: zod_1.z.date().optional(),
    endDate: zod_1.z.date().optional(),
    estimatedHours: zod_1.z.number().optional(),
    actualHours: zod_1.z.number().optional(),
    budget: zod_1.z.number().optional(),
    currency: zod_1.z.string().default('INR'),
    tags: zod_1.z.string().default('[]'), // JSON array
    milestones: zod_1.z.string().default('[]'), // JSON array
    deliverables: zod_1.z.string().default('[]'), // JSON array
    risks: zod_1.z.string().default('[]'), // JSON array
    notes: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().default(true),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date()
});
exports.CreateProjectSchema = exports.ProjectSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true
});
exports.UpdateProjectSchema = exports.CreateProjectSchema.partial();
// ============================================================================
// SLA RULE DTOs
// ============================================================================
exports.SLAConditionsSchema = zod_1.z.object({
    entityType: zod_1.z.string(),
    entitySubType: zod_1.z.string().optional(),
    priority: zod_1.z.string().optional(),
    teamId: zod_1.z.string().optional(),
    customConditions: zod_1.z.record(zod_1.z.any()).optional()
});
exports.SLAMetricsSchema = zod_1.z.object({
    metricType: zod_1.z.enum(['RESPONSE_TIME', 'RESOLUTION_TIME', 'UPTIME', 'CUSTOM']),
    threshold: zod_1.z.number(),
    unit: zod_1.z.enum(['HOURS', 'DAYS', 'PERCENTAGE', 'COUNT']),
    calculationMethod: zod_1.z.enum(['SUM', 'AVERAGE', 'MAX', 'MIN', 'COUNT'])
});
exports.SLAEscalationRuleSchema = zod_1.z.object({
    level: zod_1.z.number(),
    threshold: zod_1.z.number(),
    action: zod_1.z.enum(['NOTIFY', 'ASSIGN', 'ESCALATE', 'AUTO_RESOLVE']),
    recipients: zod_1.z.array(zod_1.z.string()),
    message: zod_1.z.string()
});
exports.SLANotificationSettingsSchema = zod_1.z.object({
    enabled: zod_1.z.boolean(),
    channels: zod_1.z.array(zod_1.z.enum(['EMAIL', 'SMS', 'PUSH', 'IN_APP'])),
    recipients: zod_1.z.array(zod_1.z.string()),
    frequency: zod_1.z.enum(['IMMEDIATE', 'HOURLY', 'DAILY', 'WEEKLY'])
});
exports.SLARuleSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    entityType: zod_1.z.string(),
    entitySubType: zod_1.z.string().optional(),
    priority: zod_1.z.string().optional(),
    teamId: zod_1.z.string().optional(),
    conditions: zod_1.z.string(), // JSON
    metrics: zod_1.z.string(), // JSON
    escalationRules: zod_1.z.string(), // JSON
    notifications: zod_1.z.string(), // JSON
    isActive: zod_1.z.boolean().default(true),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date()
});
exports.CreateSLARuleSchema = exports.SLARuleSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true
});
exports.UpdateSLARuleSchema = exports.CreateSLARuleSchema.partial();
// ============================================================================
// SLA EVALUATION DTOs
// ============================================================================
exports.SLAEvaluationSchema = zod_1.z.object({
    id: zod_1.z.string(),
    entityType: zod_1.z.string(),
    entityId: zod_1.z.string(),
    slaRuleId: zod_1.z.string(),
    employeeId: zod_1.z.string().optional(),
    status: zod_1.z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'BREACHED', 'ESCALATED']).default('PENDING'),
    currentValue: zod_1.z.number().optional(),
    thresholdValue: zod_1.z.number().optional(),
    breachDate: zod_1.z.date().optional(),
    escalationDate: zod_1.z.date().optional(),
    resolutionDate: zod_1.z.date().optional(),
    notes: zod_1.z.string().optional(),
    metadata: zod_1.z.string().default('{}'), // JSON
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date()
});
exports.CreateSLAEvaluationSchema = exports.SLAEvaluationSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true
});
exports.UpdateSLAEvaluationSchema = exports.CreateSLAEvaluationSchema.partial();
// ============================================================================
// SLA EVALUATION RESULT DTOs
// ============================================================================
exports.SLAEvaluationResultSchema = zod_1.z.object({
    entityId: zod_1.z.string(),
    entityType: zod_1.z.string(),
    slaRuleId: zod_1.z.string(),
    status: zod_1.z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'BREACHED', 'ESCALATED']),
    currentValue: zod_1.z.number(),
    thresholdValue: zod_1.z.number(),
    breachDate: zod_1.z.date().optional(),
    escalationDate: zod_1.z.date().optional(),
    resolutionDate: zod_1.z.date().optional(),
    notes: zod_1.z.string().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional()
});
exports.SLAEvaluationContextSchema = zod_1.z.object({
    entityId: zod_1.z.string(),
    entityType: zod_1.z.string(),
    entitySubType: zod_1.z.string().optional(),
    priority: zod_1.z.string().optional(),
    teamId: zod_1.z.string().optional(),
    employeeId: zod_1.z.string().optional(),
    customData: zod_1.z.record(zod_1.z.any()).optional()
});
// ============================================================================
// ENHANCED CASE DTOs
// ============================================================================
exports.EnhancedCaseSchema = zod_1.z.object({
    id: zod_1.z.string(),
    caseNumber: zod_1.z.string(),
    title: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    status: zod_1.z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED', 'ARCHIVED', 'SUSPENDED']).default('OPEN'),
    priority: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
    type: zod_1.z.enum(['CIVIL', 'CRIMINAL', 'FAMILY', 'CORPORATE', 'IP', 'LABOR', 'TAX', 'REAL_ESTATE', 'BANKING', 'INSURANCE', 'OTHER']).default('CIVIL'),
    clientId: zod_1.z.string(),
    assignedLawyerId: zod_1.z.string().optional(),
    teamId: zod_1.z.string().optional(),
    projectId: zod_1.z.string().optional(),
    defaultAssigneeId: zod_1.z.string().optional(),
    courtName: zod_1.z.string().optional(),
    courtLocation: zod_1.z.string().optional(),
    caseValue: zod_1.z.number().optional(),
    currency: zod_1.z.string().default('INR'),
    filingDate: zod_1.z.date().optional(),
    expectedCompletionDate: zod_1.z.date().optional(),
    actualCompletionDate: zod_1.z.date().optional(),
    tags: zod_1.z.string().default('[]'), // JSON array
    isConfidential: zod_1.z.boolean().default(false),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date()
});
exports.CreateEnhancedCaseSchema = exports.EnhancedCaseSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true
});
exports.UpdateEnhancedCaseSchema = exports.CreateEnhancedCaseSchema.partial();
