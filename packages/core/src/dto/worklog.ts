import { z } from 'zod'

// Worklog Type Enum
export const WorklogTypeSchema = z.enum(['CASE_WORK', 'ADMIN_WORK', 'RESEARCH', 'MEETING', 'TRAVEL', 'OTHER'])
export type WorklogType = z.infer<typeof WorklogTypeSchema>

// Worklog Status Enum
export const WorklogStatusSchema = z.enum(['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED'])
export type WorklogStatus = z.infer<typeof WorklogStatusSchema>

// Base Worklog Schema
export const WorklogSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid(),
  caseId: z.string().cuid().optional(),
  taskId: z.string().cuid().optional(),
  subtaskId: z.string().cuid().optional(),
  type: WorklogTypeSchema.default('CASE_WORK'),
  status: WorklogStatusSchema.default('DRAFT'),
  date: z.date(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM format
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM format
  duration: z.number().positive(), // Duration in hours
  description: z.string().min(1).max(2000),
  activities: z.array(z.string()).default([]), // List of activities performed
  billableHours: z.number().positive().optional(),
  hourlyRate: z.number().positive().optional(),
  totalAmount: z.number().positive().optional(),
  location: z.string().max(200).optional(),
  isBillable: z.boolean().default(true),
  isOvertime: z.boolean().default(false),
  attachments: z.array(z.string().cuid()).default([]), // Document IDs
  notes: z.string().max(1000).optional(),
  approvedBy: z.string().cuid().optional(),
  approvedAt: z.date().optional(),
  rejectionReason: z.string().max(500).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Create Worklog Schema
export const CreateWorklogSchema = WorklogSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  approvedAt: true,
})

// Update Worklog Schema
export const UpdateWorklogSchema = CreateWorklogSchema.partial()

// Worklog Search Schema
export const WorklogSearchSchema = z.object({
  query: z.string().optional(),
  userId: z.string().cuid().optional(),
  caseId: z.string().cuid().optional(),
  taskId: z.string().cuid().optional(),
  subtaskId: z.string().cuid().optional(),
  type: WorklogTypeSchema.optional(),
  status: WorklogStatusSchema.optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  isBillable: z.boolean().optional(),
  isOvertime: z.boolean().optional(),
  approvedBy: z.string().cuid().optional(),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().min(0).default(0),
})

// Worklog List Schema
export const WorklogListSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid(),
  caseId: z.string().cuid().optional(),
  taskId: z.string().cuid().optional(),
  type: WorklogTypeSchema,
  status: WorklogStatusSchema,
  date: z.date(),
  duration: z.number().positive(),
  description: z.string(),
  billableHours: z.number().positive().optional(),
  totalAmount: z.number().positive().optional(),
  isBillable: z.boolean(),
  createdAt: z.date(),
})

// Worklog with User Schema
export const WorklogWithUserSchema = WorklogSchema.extend({
  user: z.object({
    id: z.string().cuid(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
  }),
})

// Worklog with Case Schema
export const WorklogWithCaseSchema = WorklogSchema.extend({
  case: z.object({
    id: z.string().cuid(),
    caseNumber: z.string(),
    title: z.string(),
  }).optional(),
})

// Worklog with Task Schema
export const WorklogWithTaskSchema = WorklogSchema.extend({
  task: z.object({
    id: z.string().cuid(),
    title: z.string(),
    category: z.string(),
  }).optional(),
})

// Worklog Approval Schema
export const WorklogApprovalSchema = z.object({
  worklogId: z.string().cuid(),
  status: z.enum(['APPROVED', 'REJECTED']),
  notes: z.string().max(500).optional(),
})

// Worklog Bulk Update Schema
export const WorklogBulkUpdateSchema = z.object({
  worklogIds: z.array(z.string().cuid()),
  status: WorklogStatusSchema.optional(),
  isBillable: z.boolean().optional(),
  approvedBy: z.string().cuid().optional(),
})

// Worklog Statistics Schema
export const WorklogStatisticsSchema = z.object({
  totalHours: z.number().positive(),
  billableHours: z.number().positive(),
  nonBillableHours: z.number().positive(),
  overtimeHours: z.number().positive(),
  totalAmount: z.number().positive(),
  byType: z.record(z.string(), z.number().positive()),
  byStatus: z.object({
    draft: z.number().int().min(0),
    submitted: z.number().int().min(0),
    approved: z.number().int().min(0),
    rejected: z.number().int().min(0),
  }),
  averageDailyHours: z.number().positive(),
  mostProductiveDay: z.string().optional(),
})

// Export Types
export type Worklog = z.infer<typeof WorklogSchema>
export type CreateWorklog = z.infer<typeof CreateWorklogSchema>
export type UpdateWorklog = z.infer<typeof UpdateWorklogSchema>
export type WorklogSearch = z.infer<typeof WorklogSearchSchema>
export type WorklogList = z.infer<typeof WorklogListSchema>
export type WorklogWithUser = z.infer<typeof WorklogWithUserSchema>
export type WorklogWithCase = z.infer<typeof WorklogWithCaseSchema>
export type WorklogWithTask = z.infer<typeof WorklogWithTaskSchema>
export type WorklogApproval = z.infer<typeof WorklogApprovalSchema>
export type WorklogBulkUpdate = z.infer<typeof WorklogBulkUpdateSchema>
export type WorklogStatistics = z.infer<typeof WorklogStatisticsSchema>
