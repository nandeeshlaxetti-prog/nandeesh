import { z } from 'zod'

// ============================================================================
// EMPLOYEE DTOs
// ============================================================================

export const EmployeeSchema = z.object({
  id: z.string(),
  employeeId: z.string(),
  userId: z.string(),
  department: z.string().optional(),
  designation: z.string().optional(),
  reportingManager: z.string().optional(),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'CONSULTANT']).default('FULL_TIME'),
  workLocation: z.string().optional(),
  workSchedule: z.string().optional(), // JSON
  skills: z.string().default('[]'), // JSON array
  certifications: z.string().default('[]'), // JSON array
  experience: z.number().optional(),
  salary: z.number().optional(),
  currency: z.string().default('INR'),
  joiningDate: z.date().optional(),
  probationEndDate: z.date().optional(),
  confirmationDate: z.date().optional(),
  lastPromotionDate: z.date().optional(),
  nextReviewDate: z.date().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const CreateEmployeeSchema = EmployeeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

export const UpdateEmployeeSchema = CreateEmployeeSchema.partial()

export type Employee = z.infer<typeof EmployeeSchema>
export type CreateEmployee = z.infer<typeof CreateEmployeeSchema>
export type UpdateEmployee = z.infer<typeof UpdateEmployeeSchema>

// ============================================================================
// PROJECT DTOs
// ============================================================================

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  code: z.string(),
  status: z.enum(['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED']).default('PLANNING'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  type: z.enum(['CLIENT_PROJECT', 'INTERNAL_PROJECT', 'RESEARCH_PROJECT', 'TRAINING_PROJECT', 'OTHER']).default('CLIENT_PROJECT'),
  clientId: z.string().optional(),
  teamId: z.string().optional(),
  managerId: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  estimatedHours: z.number().optional(),
  actualHours: z.number().optional(),
  budget: z.number().optional(),
  currency: z.string().default('INR'),
  tags: z.string().default('[]'), // JSON array
  milestones: z.string().default('[]'), // JSON array
  deliverables: z.string().default('[]'), // JSON array
  risks: z.string().default('[]'), // JSON array
  notes: z.string().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const CreateProjectSchema = ProjectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

export const UpdateProjectSchema = CreateProjectSchema.partial()

export type Project = z.infer<typeof ProjectSchema>
export type CreateProject = z.infer<typeof CreateProjectSchema>
export type UpdateProject = z.infer<typeof UpdateProjectSchema>

// ============================================================================
// SLA RULE DTOs
// ============================================================================

export const SLAConditionsSchema = z.object({
  entityType: z.string(),
  entitySubType: z.string().optional(),
  priority: z.string().optional(),
  teamId: z.string().optional(),
  customConditions: z.record(z.any()).optional()
})

export const SLAMetricsSchema = z.object({
  metricType: z.enum(['RESPONSE_TIME', 'RESOLUTION_TIME', 'UPTIME', 'CUSTOM']),
  threshold: z.number(),
  unit: z.enum(['HOURS', 'DAYS', 'PERCENTAGE', 'COUNT']),
  calculationMethod: z.enum(['SUM', 'AVERAGE', 'MAX', 'MIN', 'COUNT'])
})

export const SLAEscalationRuleSchema = z.object({
  level: z.number(),
  threshold: z.number(),
  action: z.enum(['NOTIFY', 'ASSIGN', 'ESCALATE', 'AUTO_RESOLVE']),
  recipients: z.array(z.string()),
  message: z.string()
})

export const SLANotificationSettingsSchema = z.object({
  enabled: z.boolean(),
  channels: z.array(z.enum(['EMAIL', 'SMS', 'PUSH', 'IN_APP'])),
  recipients: z.array(z.string()),
  frequency: z.enum(['IMMEDIATE', 'HOURLY', 'DAILY', 'WEEKLY'])
})

export const SLARuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  entityType: z.string(),
  entitySubType: z.string().optional(),
  priority: z.string().optional(),
  teamId: z.string().optional(),
  conditions: z.string(), // JSON
  metrics: z.string(), // JSON
  escalationRules: z.string(), // JSON
  notifications: z.string(), // JSON
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const CreateSLARuleSchema = SLARuleSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

export const UpdateSLARuleSchema = CreateSLARuleSchema.partial()

export type SLAConditions = z.infer<typeof SLAConditionsSchema>
export type SLAMetrics = z.infer<typeof SLAMetricsSchema>
export type SLAEscalationRule = z.infer<typeof SLAEscalationRuleSchema>
export type SLANotificationSettings = z.infer<typeof SLANotificationSettingsSchema>
export type SLARule = z.infer<typeof SLARuleSchema>
export type CreateSLARule = z.infer<typeof CreateSLARuleSchema>
export type UpdateSLARule = z.infer<typeof UpdateSLARuleSchema>

// ============================================================================
// SLA EVALUATION DTOs
// ============================================================================

export const SLAEvaluationSchema = z.object({
  id: z.string(),
  entityType: z.string(),
  entityId: z.string(),
  slaRuleId: z.string(),
  employeeId: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'BREACHED', 'ESCALATED']).default('PENDING'),
  currentValue: z.number().optional(),
  thresholdValue: z.number().optional(),
  breachDate: z.date().optional(),
  escalationDate: z.date().optional(),
  resolutionDate: z.date().optional(),
  notes: z.string().optional(),
  metadata: z.string().default('{}'), // JSON
  createdAt: z.date(),
  updatedAt: z.date()
})

export const CreateSLAEvaluationSchema = SLAEvaluationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

export const UpdateSLAEvaluationSchema = CreateSLAEvaluationSchema.partial()

export type SLAEvaluation = z.infer<typeof SLAEvaluationSchema>
export type CreateSLAEvaluation = z.infer<typeof CreateSLAEvaluationSchema>
export type UpdateSLAEvaluation = z.infer<typeof UpdateSLAEvaluationSchema>

// ============================================================================
// SLA EVALUATION RESULT DTOs
// ============================================================================

export const SLAEvaluationResultSchema = z.object({
  entityId: z.string(),
  entityType: z.string(),
  slaRuleId: z.string(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'BREACHED', 'ESCALATED']),
  currentValue: z.number(),
  thresholdValue: z.number(),
  breachDate: z.date().optional(),
  escalationDate: z.date().optional(),
  resolutionDate: z.date().optional(),
  notes: z.string().optional(),
  metadata: z.record(z.any()).optional()
})

export const SLAEvaluationContextSchema = z.object({
  entityId: z.string(),
  entityType: z.string(),
  entitySubType: z.string().optional(),
  priority: z.string().optional(),
  teamId: z.string().optional(),
  employeeId: z.string().optional(),
  customData: z.record(z.any()).optional()
})

export type SLAEvaluationResult = z.infer<typeof SLAEvaluationResultSchema>
export type SLAEvaluationContext = z.infer<typeof SLAEvaluationContextSchema>

// ============================================================================
// ENHANCED CASE DTOs
// ============================================================================

export const EnhancedCaseSchema = z.object({
  id: z.string(),
  caseNumber: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED', 'ARCHIVED', 'SUSPENDED']).default('OPEN'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  type: z.enum(['CIVIL', 'CRIMINAL', 'FAMILY', 'CORPORATE', 'IP', 'LABOR', 'TAX', 'REAL_ESTATE', 'BANKING', 'INSURANCE', 'OTHER']).default('CIVIL'),
  clientId: z.string(),
  assignedLawyerId: z.string().optional(),
  teamId: z.string().optional(),
  projectId: z.string().optional(),
  defaultAssigneeId: z.string().optional(),
  courtName: z.string().optional(),
  courtLocation: z.string().optional(),
  caseValue: z.number().optional(),
  currency: z.string().default('INR'),
  filingDate: z.date().optional(),
  expectedCompletionDate: z.date().optional(),
  actualCompletionDate: z.date().optional(),
  tags: z.string().default('[]'), // JSON array
  isConfidential: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const CreateEnhancedCaseSchema = EnhancedCaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

export const UpdateEnhancedCaseSchema = CreateEnhancedCaseSchema.partial()

export type EnhancedCase = z.infer<typeof EnhancedCaseSchema>
export type CreateEnhancedCase = z.infer<typeof CreateEnhancedCaseSchema>
export type UpdateEnhancedCase = z.infer<typeof UpdateEnhancedCaseSchema>
