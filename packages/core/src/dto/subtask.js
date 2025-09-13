"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubtaskStatisticsSchema = exports.SubtaskReorderSchema = exports.SubtaskCompletionSchema = exports.SubtaskStatusUpdateSchema = exports.SubtaskAssignmentSchema = exports.SubtaskWithTaskSchema = exports.SubtaskWithAssigneeSchema = exports.SubtaskListSchema = exports.SubtaskSearchSchema = exports.UpdateSubtaskSchema = exports.CreateSubtaskSchema = exports.SubtaskSchema = exports.SubtaskPrioritySchema = exports.SubtaskStatusSchema = void 0;
const zod_1 = require("zod");
// Subtask Status Enum
exports.SubtaskStatusSchema = zod_1.z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']);
// Subtask Priority Enum
exports.SubtaskPrioritySchema = zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);
// Base Subtask Schema
exports.SubtaskSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    taskId: zod_1.z.string().cuid(),
    title: zod_1.z.string().min(1).max(200),
    description: zod_1.z.string().max(1000).optional(),
    status: exports.SubtaskStatusSchema.default('PENDING'),
    priority: exports.SubtaskPrioritySchema.default('MEDIUM'),
    assignedTo: zod_1.z.string().cuid().optional(),
    createdBy: zod_1.z.string().cuid(),
    dueDate: zod_1.z.date().optional(),
    completedAt: zod_1.z.date().optional(),
    estimatedHours: zod_1.z.number().positive().optional(),
    actualHours: zod_1.z.number().positive().optional(),
    order: zod_1.z.number().int().min(0).default(0), // For ordering subtasks
    dependencies: zod_1.z.array(zod_1.z.string().cuid()).default([]), // Other subtask IDs this depends on
    progress: zod_1.z.number().int().min(0).max(100).default(0), // Progress percentage
    notes: zod_1.z.string().max(500).optional(),
    attachments: zod_1.z.array(zod_1.z.string().cuid()).default([]), // Document IDs
    isConfidential: zod_1.z.boolean().default(false),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
// Create Subtask Schema
exports.CreateSubtaskSchema = exports.SubtaskSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    completedAt: true,
});
// Update Subtask Schema
exports.UpdateSubtaskSchema = exports.CreateSubtaskSchema.partial();
// Subtask Search Schema
exports.SubtaskSearchSchema = zod_1.z.object({
    query: zod_1.z.string().optional(),
    taskId: zod_1.z.string().cuid().optional(),
    status: exports.SubtaskStatusSchema.optional(),
    priority: exports.SubtaskPrioritySchema.optional(),
    assignedTo: zod_1.z.string().cuid().optional(),
    createdBy: zod_1.z.string().cuid().optional(),
    dueDateFrom: zod_1.z.date().optional(),
    dueDateTo: zod_1.z.date().optional(),
    isConfidential: zod_1.z.boolean().optional(),
    limit: zod_1.z.number().int().positive().max(100).default(20),
    offset: zod_1.z.number().int().min(0).default(0),
});
// Subtask List Schema
exports.SubtaskListSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    taskId: zod_1.z.string().cuid(),
    title: zod_1.z.string(),
    status: exports.SubtaskStatusSchema,
    priority: exports.SubtaskPrioritySchema,
    assignedTo: zod_1.z.string().cuid().optional(),
    createdBy: zod_1.z.string().cuid(),
    dueDate: zod_1.z.date().optional(),
    completedAt: zod_1.z.date().optional(),
    progress: zod_1.z.number().int().min(0).max(100),
    order: zod_1.z.number().int().min(0),
    createdAt: zod_1.z.date(),
});
// Subtask with Assignee Schema
exports.SubtaskWithAssigneeSchema = exports.SubtaskSchema.extend({
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
// Subtask with Task Schema
exports.SubtaskWithTaskSchema = exports.SubtaskSchema.extend({
    task: zod_1.z.object({
        id: zod_1.z.string().cuid(),
        title: zod_1.z.string(),
        status: zod_1.z.string(),
        category: zod_1.z.string(),
    }),
});
// Subtask Assignment Schema
exports.SubtaskAssignmentSchema = zod_1.z.object({
    subtaskId: zod_1.z.string().cuid(),
    assignedTo: zod_1.z.string().cuid(),
    dueDate: zod_1.z.date().optional(),
    notes: zod_1.z.string().max(500).optional(),
});
// Subtask Status Update Schema
exports.SubtaskStatusUpdateSchema = zod_1.z.object({
    subtaskId: zod_1.z.string().cuid(),
    status: exports.SubtaskStatusSchema,
    progress: zod_1.z.number().int().min(0).max(100).optional(),
    notes: zod_1.z.string().max(500).optional(),
    actualHours: zod_1.z.number().positive().optional(),
});
// Subtask Completion Schema
exports.SubtaskCompletionSchema = zod_1.z.object({
    subtaskId: zod_1.z.string().cuid(),
    completedAt: zod_1.z.date().default(() => new Date()),
    actualHours: zod_1.z.number().positive().optional(),
    completionNotes: zod_1.z.string().max(500).optional(),
});
// Subtask Reorder Schema
exports.SubtaskReorderSchema = zod_1.z.object({
    subtaskId: zod_1.z.string().cuid(),
    newOrder: zod_1.z.number().int().min(0),
});
// Subtask Statistics Schema
exports.SubtaskStatisticsSchema = zod_1.z.object({
    total: zod_1.z.number().int().min(0),
    pending: zod_1.z.number().int().min(0),
    inProgress: zod_1.z.number().int().min(0),
    completed: zod_1.z.number().int().min(0),
    cancelled: zod_1.z.number().int().min(0),
    overdue: zod_1.z.number().int().min(0),
    byPriority: zod_1.z.object({
        low: zod_1.z.number().int().min(0),
        medium: zod_1.z.number().int().min(0),
        high: zod_1.z.number().int().min(0),
        urgent: zod_1.z.number().int().min(0),
    }),
    averageCompletionTime: zod_1.z.number().positive().optional(), // In hours
});
