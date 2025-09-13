import { z } from 'zod'

// Base types
export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}

// User related schemas
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(['admin', 'lawyer', 'paralegal', 'client']),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type User = z.infer<typeof UserSchema>

export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export type CreateUser = z.infer<typeof CreateUserSchema>

export const UpdateUserSchema = CreateUserSchema.partial()

export type UpdateUser = z.infer<typeof UpdateUserSchema>

// Case related schemas
export const CaseSchema = z.object({
  id: z.string().uuid(),
  caseNumber: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['open', 'in_progress', 'closed', 'archived']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  clientId: z.string().uuid(),
  assignedLawyerId: z.string().uuid().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Case = z.infer<typeof CaseSchema>

export const CreateCaseSchema = CaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export type CreateCase = z.infer<typeof CreateCaseSchema>

export const UpdateCaseSchema = CreateCaseSchema.partial()

export type UpdateCase = z.infer<typeof UpdateCaseSchema>

// Document related schemas
export const DocumentSchema = z.object({
  id: z.string().uuid(),
  filename: z.string().min(1),
  originalName: z.string().min(1),
  mimeType: z.string(),
  size: z.number().positive(),
  caseId: z.string().uuid(),
  uploadedBy: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Document = z.infer<typeof DocumentSchema>

export const CreateDocumentSchema = DocumentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export type CreateDocument = z.infer<typeof CreateDocumentSchema>

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// Export all schemas for validation
export const schemas = {
  User: UserSchema,
  CreateUser: CreateUserSchema,
  UpdateUser: UpdateUserSchema,
  Case: CaseSchema,
  CreateCase: CreateCaseSchema,
  UpdateCase: UpdateCaseSchema,
  Document: DocumentSchema,
  CreateDocument: CreateDocumentSchema,
} as const
