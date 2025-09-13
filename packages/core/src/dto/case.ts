import { z } from 'zod'

// Case Status Enum
export const CaseStatusSchema = z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED', 'ARCHIVED', 'SUSPENDED'])
export type CaseStatus = z.infer<typeof CaseStatusSchema>

// Case Priority Enum
export const CasePrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
export type CasePriority = z.infer<typeof CasePrioritySchema>

// Case Type Enum
export const CaseTypeSchema = z.enum([
  'CIVIL', 'CRIMINAL', 'FAMILY', 'CORPORATE', 'INTELLECTUAL_PROPERTY',
  'LABOR', 'TAX', 'REAL_ESTATE', 'BANKING', 'INSURANCE', 'OTHER'
])
export type CaseType = z.infer<typeof CaseTypeSchema>

// Base Case Schema
export const CaseSchema = z.object({
  id: z.string().cuid(),
  caseNumber: z.string().min(1).max(50),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  status: CaseStatusSchema.default('OPEN'),
  priority: CasePrioritySchema.default('MEDIUM'),
  type: CaseTypeSchema.default('CIVIL'),
  clientId: z.string().cuid(),
  assignedLawyerId: z.string().cuid().optional(),
  teamId: z.string().cuid().optional(),
  courtName: z.string().max(200).optional(),
  courtLocation: z.string().max(200).optional(),
  caseValue: z.number().positive().optional(),
  currency: z.string().length(3).default('INR'), // ISO currency code
  filingDate: z.date().optional(),
  expectedCompletionDate: z.date().optional(),
  actualCompletionDate: z.date().optional(),
  tags: z.array(z.string()).default([]),
  isConfidential: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Create Case Schema
export const CreateCaseSchema = CaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  actualCompletionDate: true,
})

// Update Case Schema
export const UpdateCaseSchema = CreateCaseSchema.partial()

// Case Search Schema
export const CaseSearchSchema = z.object({
  query: z.string().optional(),
  status: CaseStatusSchema.optional(),
  priority: CasePrioritySchema.optional(),
  type: CaseTypeSchema.optional(),
  clientId: z.string().cuid().optional(),
  assignedLawyerId: z.string().cuid().optional(),
  teamId: z.string().cuid().optional(),
  courtName: z.string().optional(),
  tags: z.array(z.string()).optional(),
  filingDateFrom: z.date().optional(),
  filingDateTo: z.date().optional(),
  isConfidential: z.boolean().optional(),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().min(0).default(0),
})

// Case List Schema
export const CaseListSchema = z.object({
  id: z.string().cuid(),
  caseNumber: z.string(),
  title: z.string(),
  status: CaseStatusSchema,
  priority: CasePrioritySchema,
  type: CaseTypeSchema,
  clientId: z.string().cuid(),
  assignedLawyerId: z.string().cuid().optional(),
  courtName: z.string().optional(),
  filingDate: z.date().optional(),
  createdAt: z.date(),
})

// Case with Relations Schema
export const CaseWithRelationsSchema = CaseSchema.extend({
  client: z.object({
    id: z.string().cuid(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
  }),
  assignedLawyer: z.object({
    id: z.string().cuid(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
  }).optional(),
  team: z.object({
    id: z.string().cuid(),
    name: z.string(),
  }).optional(),
})

// Case Statistics Schema
export const CaseStatisticsSchema = z.object({
  total: z.number().int().min(0),
  open: z.number().int().min(0),
  inProgress: z.number().int().min(0),
  closed: z.number().int().min(0),
  archived: z.number().int().min(0),
  byPriority: z.object({
    low: z.number().int().min(0),
    medium: z.number().int().min(0),
    high: z.number().int().min(0),
    urgent: z.number().int().min(0),
  }),
  byType: z.record(z.string(), z.number().int().min(0)),
})

// Export Types
export type Case = z.infer<typeof CaseSchema>
export type CreateCase = z.infer<typeof CreateCaseSchema>
export type UpdateCase = z.infer<typeof UpdateCaseSchema>
export type CaseSearch = z.infer<typeof CaseSearchSchema>
export type CaseList = z.infer<typeof CaseListSchema>
export type CaseWithRelations = z.infer<typeof CaseWithRelationsSchema>
export type CaseStatistics = z.infer<typeof CaseStatisticsSchema>
