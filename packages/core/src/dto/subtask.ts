import { z } from 'zod'

// Subtask Status Enum
export const SubtaskStatusSchema = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
export type SubtaskStatus = z.infer<typeof SubtaskStatusSchema>

// Subtask Priority Enum
export const SubtaskPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
export type SubtaskPriority = z.infer<typeof SubtaskPrioritySchema>

// Base Subtask Schema
export const SubtaskSchema = z.object({
  id: z.string().cuid(),
  taskId: z.string().cuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  status: SubtaskStatusSchema.default('PENDING'),
  priority: SubtaskPrioritySchema.default('MEDIUM'),
  assignedTo: z.string().cuid().optional(),
  createdBy: z.string().cuid(),
  dueDate: z.date().optional(),
  completedAt: z.date().optional(),
  estimatedHours: z.number().positive().optional(),
  actualHours: z.number().positive().optional(),
  order: z.number().int().min(0).default(0), // For ordering subtasks
  dependencies: z.array(z.string().cuid()).default([]), // Other subtask IDs this depends on
  progress: z.number().int().min(0).max(100).default(0), // Progress percentage
  notes: z.string().max(500).optional(),
  attachments: z.array(z.string().cuid()).default([]), // Document IDs
  isConfidential: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Create Subtask Schema
export const CreateSubtaskSchema = SubtaskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completedAt: true,
})

// Update Subtask Schema
export const UpdateSubtaskSchema = CreateSubtaskSchema.partial()

// Subtask Search Schema
export const SubtaskSearchSchema = z.object({
  query: z.string().optional(),
  taskId: z.string().cuid().optional(),
  status: SubtaskStatusSchema.optional(),
  priority: SubtaskPrioritySchema.optional(),
  assignedTo: z.string().cuid().optional(),
  createdBy: z.string().cuid().optional(),
  dueDateFrom: z.date().optional(),
  dueDateTo: z.date().optional(),
  isConfidential: z.boolean().optional(),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().min(0).default(0),
})

// Subtask List Schema
export const SubtaskListSchema = z.object({
  id: z.string().cuid(),
  taskId: z.string().cuid(),
  title: z.string(),
  status: SubtaskStatusSchema,
  priority: SubtaskPrioritySchema,
  assignedTo: z.string().cuid().optional(),
  createdBy: z.string().cuid(),
  dueDate: z.date().optional(),
  completedAt: z.date().optional(),
  progress: z.number().int().min(0).max(100),
  order: z.number().int().min(0),
  createdAt: z.date(),
})

// Subtask with Assignee Schema
export const SubtaskWithAssigneeSchema = SubtaskSchema.extend({
  assignee: z.object({
    id: z.string().cuid(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
  }).optional(),
  creator: z.object({
    id: z.string().cuid(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
  }),
})

// Subtask with Task Schema
export const SubtaskWithTaskSchema = SubtaskSchema.extend({
  task: z.object({
    id: z.string().cuid(),
    title: z.string(),
    status: z.string(),
    category: z.string(),
  }),
})

// Subtask Assignment Schema
export const SubtaskAssignmentSchema = z.object({
  subtaskId: z.string().cuid(),
  assignedTo: z.string().cuid(),
  dueDate: z.date().optional(),
  notes: z.string().max(500).optional(),
})

// Subtask Status Update Schema
export const SubtaskStatusUpdateSchema = z.object({
  subtaskId: z.string().cuid(),
  status: SubtaskStatusSchema,
  progress: z.number().int().min(0).max(100).optional(),
  notes: z.string().max(500).optional(),
  actualHours: z.number().positive().optional(),
})

// Subtask Completion Schema
export const SubtaskCompletionSchema = z.object({
  subtaskId: z.string().cuid(),
  completedAt: z.date().default(() => new Date()),
  actualHours: z.number().positive().optional(),
  completionNotes: z.string().max(500).optional(),
})

// Subtask Reorder Schema
export const SubtaskReorderSchema = z.object({
  subtaskId: z.string().cuid(),
  newOrder: z.number().int().min(0),
})

// Subtask Statistics Schema
export const SubtaskStatisticsSchema = z.object({
  total: z.number().int().min(0),
  pending: z.number().int().min(0),
  inProgress: z.number().int().min(0),
  completed: z.number().int().min(0),
  cancelled: z.number().int().min(0),
  overdue: z.number().int().min(0),
  byPriority: z.object({
    low: z.number().int().min(0),
    medium: z.number().int().min(0),
    high: z.number().int().min(0),
    urgent: z.number().int().min(0),
  }),
  averageCompletionTime: z.number().positive().optional(), // In hours
})

// Export Types
export type Subtask = z.infer<typeof SubtaskSchema>
export type CreateSubtask = z.infer<typeof CreateSubtaskSchema>
export type UpdateSubtask = z.infer<typeof UpdateSubtaskSchema>
export type SubtaskSearch = z.infer<typeof SubtaskSearchSchema>
export type SubtaskList = z.infer<typeof SubtaskListSchema>
export type SubtaskWithAssignee = z.infer<typeof SubtaskWithAssigneeSchema>
export type SubtaskWithTask = z.infer<typeof SubtaskWithTaskSchema>
export type SubtaskAssignment = z.infer<typeof SubtaskAssignmentSchema>
export type SubtaskStatusUpdate = z.infer<typeof SubtaskStatusUpdateSchema>
export type SubtaskCompletion = z.infer<typeof SubtaskCompletionSchema>
export type SubtaskReorder = z.infer<typeof SubtaskReorderSchema>
export type SubtaskStatistics = z.infer<typeof SubtaskStatisticsSchema>
