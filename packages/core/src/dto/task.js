"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskStatisticsSchema = exports.PendingTaskFiltersSchema = exports.TaskCompletionSchema = exports.TaskStatusUpdateSchema = exports.TaskAssignmentSchema = exports.TaskWithCaseSchema = exports.TaskWithAssigneeSchema = exports.TaskListSchema = exports.TaskSearchSchema = exports.UpdateTaskSchema = exports.CreateTaskSchema = exports.TaskSchema = exports.RecurrenceConfigSchema = exports.TaskPrioritySchema = exports.TaskStatusSchema = exports.TaskCategorySchema = void 0;
const zod_1 = require("zod");
// Task Category Enum
exports.TaskCategorySchema = zod_1.z.enum(['CASE', 'PERSONAL', 'ADMIN', 'BIZDEV']);
// Task Status Enum
exports.TaskStatusSchema = zod_1.z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ON_HOLD']);
// Task Priority Enum
exports.TaskPrioritySchema = zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);
// Recurrence Configuration Schema
exports.RecurrenceConfigSchema = zod_1.z.object({
    pattern: zod_1.z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']),
    interval: zod_1.z.number().int().positive().default(1), // Every N days/weeks/months/years
    daysOfWeek: zod_1.z.array(zod_1.z.number().int().min(0).max(6)).optional(), // 0=Sunday, 6=Saturday
    dayOfMonth: zod_1.z.number().int().min(1).max(31).optional(), // For monthly/yearly
    endDate: zod_1.z.date().optional(), // When to stop recurring
    maxOccurrences: zod_1.z.number().int().positive().optional(), // Maximum number of occurrences
    timezone: zod_1.z.string().default('Asia/Kolkata'),
});
// Base Task Schema
exports.TaskSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    title: zod_1.z.string().min(1).max(200),
    description: zod_1.z.string().max(2000).optional(),
    category: exports.TaskCategorySchema.default('CASE'),
    status: exports.TaskStatusSchema.default('PENDING'),
    priority: exports.TaskPrioritySchema.default('MEDIUM'),
    caseId: zod_1.z.string().cuid().optional(), // Required for CASE category
    assignedTo: zod_1.z.string().cuid().optional(),
    createdBy: zod_1.z.string().cuid(),
    dueDate: zod_1.z.date().optional(),
    completedAt: zod_1.z.date().optional(),
    estimatedHours: zod_1.z.number().positive().optional(),
    actualHours: zod_1.z.number().positive().optional(),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    attachments: zod_1.z.array(zod_1.z.string().cuid()).default([]), // Document IDs
    isRecurring: zod_1.z.boolean().default(false),
    recurringPattern: zod_1.z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).optional(),
    recurrenceJSON: zod_1.z.string().optional(), // JSON: detailed recurrence configuration
    parentTaskId: zod_1.z.string().cuid().optional(), // For subtasks
    dependencies: zod_1.z.array(zod_1.z.string().cuid()).default([]), // Task IDs this task depends on
    progress: zod_1.z.number().int().min(0).max(100).default(0), // Progress percentage
    notes: zod_1.z.string().max(1000).optional(),
    isConfidential: zod_1.z.boolean().default(false),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
// Create Task Schema
exports.CreateTaskSchema = exports.TaskSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    completedAt: true,
});
// Update Task Schema
exports.UpdateTaskSchema = exports.CreateTaskSchema.partial();
// Task Search Schema
exports.TaskSearchSchema = zod_1.z.object({
    query: zod_1.z.string().optional(),
    category: exports.TaskCategorySchema.optional(),
    status: exports.TaskStatusSchema.optional(),
    priority: exports.TaskPrioritySchema.optional(),
    caseId: zod_1.z.string().cuid().optional(),
    assignedTo: zod_1.z.string().cuid().optional(),
    createdBy: zod_1.z.string().cuid().optional(),
    dueDateFrom: zod_1.z.date().optional(),
    dueDateTo: zod_1.z.date().optional(),
    isRecurring: zod_1.z.boolean().optional(),
    parentTaskId: zod_1.z.string().cuid().optional(),
    isConfidential: zod_1.z.boolean().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    limit: zod_1.z.number().int().positive().max(100).default(20),
    offset: zod_1.z.number().int().min(0).default(0),
});
// Task List Schema
exports.TaskListSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    title: zod_1.z.string(),
    category: exports.TaskCategorySchema,
    status: exports.TaskStatusSchema,
    priority: exports.TaskPrioritySchema,
    caseId: zod_1.z.string().cuid().optional(),
    assignedTo: zod_1.z.string().cuid().optional(),
    createdBy: zod_1.z.string().cuid(),
    dueDate: zod_1.z.date().optional(),
    completedAt: zod_1.z.date().optional(),
    progress: zod_1.z.number().int().min(0).max(100),
    createdAt: zod_1.z.date(),
});
// Task with Assignee Schema
exports.TaskWithAssigneeSchema = exports.TaskSchema.extend({
    assignee: zod_1.z.object({
        id: zod_1.z.string().cuid(),
        firstName: zod_1.z.string(),
        lastName: zod_1.z.string(),
        email: zod_1.z.string().email(),
    }).optional(),
    creator: zod_1.z.object({
        id: zod_1.z.string().cuid(),
        firstName: zod_1.z.string(),
        lastName: zod_1.z.string(),
        email: zod_1.z.string().email(),
    }),
});
// Task with Case Schema
exports.TaskWithCaseSchema = exports.TaskSchema.extend({
    case: zod_1.z.object({
        id: zod_1.z.string().cuid(),
        caseNumber: zod_1.z.string(),
        title: zod_1.z.string(),
        status: zod_1.z.string(),
    }).optional(),
});
// Task Assignment Schema
exports.TaskAssignmentSchema = zod_1.z.object({
    taskId: zod_1.z.string().cuid(),
    assignedTo: zod_1.z.string().cuid(),
    dueDate: zod_1.z.date().optional(),
    notes: zod_1.z.string().max(1000).optional(),
});
// Task Status Update Schema
exports.TaskStatusUpdateSchema = zod_1.z.object({
    taskId: zod_1.z.string().cuid(),
    status: exports.TaskStatusSchema,
    progress: zod_1.z.number().int().min(0).max(100).optional(),
    notes: zod_1.z.string().max(1000).optional(),
    actualHours: zod_1.z.number().positive().optional(),
});
// Task Completion Schema
exports.TaskCompletionSchema = zod_1.z.object({
    taskId: zod_1.z.string().cuid(),
    completedAt: zod_1.z.date().default(() => new Date()),
    actualHours: zod_1.z.number().positive().optional(),
    completionNotes: zod_1.z.string().max(1000).optional(),
});
// Pending Task Filters Schema
exports.PendingTaskFiltersSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    categories: zod_1.z.array(exports.TaskCategorySchema).optional(),
    priorities: zod_1.z.array(exports.TaskPrioritySchema).optional(),
    statuses: zod_1.z.array(exports.TaskStatusSchema).optional(),
    dueDateFrom: zod_1.z.date().optional(),
    dueDateTo: zod_1.z.date().optional(),
    overdue: zod_1.z.boolean().optional(),
    teamId: zod_1.z.string().cuid().optional(),
    caseId: zod_1.z.string().cuid().optional(),
    includeCompleted: zod_1.z.boolean().default(false),
    limit: zod_1.z.number().int().positive().max(100).default(50),
    offset: zod_1.z.number().int().min(0).default(0),
});
// Task Statistics Schema
exports.TaskStatisticsSchema = zod_1.z.object({
    total: zod_1.z.number().int().min(0),
    pending: zod_1.z.number().int().min(0),
    inProgress: zod_1.z.number().int().min(0),
    completed: zod_1.z.number().int().min(0),
    cancelled: zod_1.z.number().int().min(0),
    onHold: zod_1.z.number().int().min(0),
    overdue: zod_1.z.number().int().min(0),
    byCategory: zod_1.z.object({
        case: zod_1.z.number().int().min(0),
        personal: zod_1.z.number().int().min(0),
        admin: zod_1.z.number().int().min(0),
        bizdev: zod_1.z.number().int().min(0),
    }),
    byPriority: zod_1.z.object({
        low: zod_1.z.number().int().min(0),
        medium: zod_1.z.number().int().min(0),
        high: zod_1.z.number().int().min(0),
        urgent: zod_1.z.number().int().min(0),
    }),
});
