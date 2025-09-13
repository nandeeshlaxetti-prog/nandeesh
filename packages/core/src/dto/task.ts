import { z } from 'zod'

// Task Category Enum
export const TaskCategorySchema = z.enum(['CASE', 'PERSONAL', 'ADMIN', 'BIZDEV'])
export type TaskCategory = z.infer<typeof TaskCategorySchema>

// Task Status Enum
export const TaskStatusSchema = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ON_HOLD'])
export type TaskStatus = z.infer<typeof TaskStatusSchema>

// Task Priority Enum
export const TaskPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
export type TaskPriority = z.infer<typeof TaskPrioritySchema>

// Recurrence Configuration Schema
export const RecurrenceConfigSchema = z.object({
  pattern: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']),
  interval: z.number().int().positive().default(1), // Every N days/weeks/months/years
  daysOfWeek: z.array(z.number().int().min(0).max(6)).optional(), // 0=Sunday, 6=Saturday
  dayOfMonth: z.number().int().min(1).max(31).optional(), // For monthly/yearly
  endDate: z.date().optional(), // When to stop recurring
  maxOccurrences: z.number().int().positive().optional(), // Maximum number of occurrences
  timezone: z.string().default('Asia/Kolkata'),
})
export type RecurrenceConfig = z.infer<typeof RecurrenceConfigSchema>

// Base Task Schema
export const TaskSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  category: TaskCategorySchema.default('CASE'),
  status: TaskStatusSchema.default('PENDING'),
  priority: TaskPrioritySchema.default('MEDIUM'),
  caseId: z.string().cuid().optional(), // Required for CASE category
  assignedTo: z.string().cuid().optional(),
  createdBy: z.string().cuid(),
  dueDate: z.date().optional(),
  completedAt: z.date().optional(),
  estimatedHours: z.number().positive().optional(),
  actualHours: z.number().positive().optional(),
  tags: z.array(z.string()).default([]),
  attachments: z.array(z.string().cuid()).default([]), // Document IDs
  isRecurring: z.boolean().default(false),
  recurringPattern: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).optional(),
  recurrenceJSON: z.string().optional(), // JSON: detailed recurrence configuration
  parentTaskId: z.string().cuid().optional(), // For subtasks
  dependencies: z.array(z.string().cuid()).default([]), // Task IDs this task depends on
  progress: z.number().int().min(0).max(100).default(0), // Progress percentage
  notes: z.string().max(1000).optional(),
  isConfidential: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Create Task Schema
export const CreateTaskSchema = TaskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completedAt: true,
})

// Update Task Schema
export const UpdateTaskSchema = CreateTaskSchema.partial()

// Task Search Schema
export const TaskSearchSchema = z.object({
  query: z.string().optional(),
  category: TaskCategorySchema.optional(),
  status: TaskStatusSchema.optional(),
  priority: TaskPrioritySchema.optional(),
  caseId: z.string().cuid().optional(),
  assignedTo: z.string().cuid().optional(),
  createdBy: z.string().cuid().optional(),
  dueDateFrom: z.date().optional(),
  dueDateTo: z.date().optional(),
  isRecurring: z.boolean().optional(),
  parentTaskId: z.string().cuid().optional(),
  isConfidential: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().min(0).default(0),
})

// Task List Schema
export const TaskListSchema = z.object({
  id: z.string().cuid(),
  title: z.string(),
  category: TaskCategorySchema,
  status: TaskStatusSchema,
  priority: TaskPrioritySchema,
  caseId: z.string().cuid().optional(),
  assignedTo: z.string().cuid().optional(),
  createdBy: z.string().cuid(),
  dueDate: z.date().optional(),
  completedAt: z.date().optional(),
  progress: z.number().int().min(0).max(100),
  createdAt: z.date(),
})

// Task with Assignee Schema
export const TaskWithAssigneeSchema = TaskSchema.extend({
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

// Task with Case Schema
export const TaskWithCaseSchema = TaskSchema.extend({
  case: z.object({
    id: z.string().cuid(),
    caseNumber: z.string(),
    title: z.string(),
    status: z.string(),
  }).optional(),
})

// Task Assignment Schema
export const TaskAssignmentSchema = z.object({
  taskId: z.string().cuid(),
  assignedTo: z.string().cuid(),
  dueDate: z.date().optional(),
  notes: z.string().max(1000).optional(),
})

// Task Status Update Schema
export const TaskStatusUpdateSchema = z.object({
  taskId: z.string().cuid(),
  status: TaskStatusSchema,
  progress: z.number().int().min(0).max(100).optional(),
  notes: z.string().max(1000).optional(),
  actualHours: z.number().positive().optional(),
})

// Task Completion Schema
export const TaskCompletionSchema = z.object({
  taskId: z.string().cuid(),
  completedAt: z.date().default(() => new Date()),
  actualHours: z.number().positive().optional(),
  completionNotes: z.string().max(1000).optional(),
})

// Pending Task Filters Schema
export const PendingTaskFiltersSchema = z.object({
  userId: z.string().cuid(),
  categories: z.array(TaskCategorySchema).optional(),
  priorities: z.array(TaskPrioritySchema).optional(),
  statuses: z.array(TaskStatusSchema).optional(),
  dueDateFrom: z.date().optional(),
  dueDateTo: z.date().optional(),
  overdue: z.boolean().optional(),
  teamId: z.string().cuid().optional(),
  caseId: z.string().cuid().optional(),
  includeCompleted: z.boolean().default(false),
  limit: z.number().int().positive().max(100).default(50),
  offset: z.number().int().min(0).default(0),
})
export type PendingTaskFilters = z.infer<typeof PendingTaskFiltersSchema>

// Task Statistics Schema
export const TaskStatisticsSchema = z.object({
  total: z.number().int().min(0),
  pending: z.number().int().min(0),
  inProgress: z.number().int().min(0),
  completed: z.number().int().min(0),
  cancelled: z.number().int().min(0),
  onHold: z.number().int().min(0),
  overdue: z.number().int().min(0),
  byCategory: z.object({
    case: z.number().int().min(0),
    personal: z.number().int().min(0),
    admin: z.number().int().min(0),
    bizdev: z.number().int().min(0),
  }),
  byPriority: z.object({
    low: z.number().int().min(0),
    medium: z.number().int().min(0),
    high: z.number().int().min(0),
    urgent: z.number().int().min(0),
  }),
})

// Export Types
export type Task = z.infer<typeof TaskSchema>
export type CreateTask = z.infer<typeof CreateTaskSchema>
export type UpdateTask = z.infer<typeof UpdateTaskSchema>
export type TaskSearch = z.infer<typeof TaskSearchSchema>
export type TaskList = z.infer<typeof TaskListSchema>
export type TaskWithAssignee = z.infer<typeof TaskWithAssigneeSchema>
export type TaskWithCase = z.infer<typeof TaskWithCaseSchema>
export type TaskAssignment = z.infer<typeof TaskAssignmentSchema>
export type TaskStatusUpdate = z.infer<typeof TaskStatusUpdateSchema>
export type TaskCompletion = z.infer<typeof TaskCompletionSchema>
export type TaskStatistics = z.infer<typeof TaskStatisticsSchema>
