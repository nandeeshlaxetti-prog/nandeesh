"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatisticsSchema = exports.OrderExecutionSchema = exports.OrderApprovalSchema = exports.OrderWithCreatorSchema = exports.OrderWithCaseSchema = exports.OrderListSchema = exports.OrderSearchSchema = exports.UpdateOrderSchema = exports.CreateOrderSchema = exports.OrderSchema = exports.OrderPrioritySchema = exports.OrderTypeSchema = exports.OrderStatusSchema = void 0;
const zod_1 = require("zod");
// Order Status Enum
exports.OrderStatusSchema = zod_1.z.enum(['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'EXECUTED', 'CANCELLED']);
// Order Type Enum
exports.OrderTypeSchema = zod_1.z.enum([
    'INTERIM_ORDER', 'FINAL_ORDER', 'EXECUTION_ORDER', 'STAY_ORDER',
    'INJUNCTION', 'DECREE', 'AWARD', 'SETTLEMENT', 'OTHER'
]);
// Order Priority Enum
exports.OrderPrioritySchema = zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);
// Base Order Schema
exports.OrderSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    caseId: zod_1.z.string().cuid(),
    orderNumber: zod_1.z.string().min(1).max(50),
    type: exports.OrderTypeSchema.default('FINAL_ORDER'),
    status: exports.OrderStatusSchema.default('DRAFT'),
    priority: exports.OrderPrioritySchema.default('MEDIUM'),
    title: zod_1.z.string().min(1).max(200),
    description: zod_1.z.string().max(2000).optional(),
    content: zod_1.z.string().min(1), // The actual order content
    courtName: zod_1.z.string().min(1).max(200),
    judgeName: zod_1.z.string().max(100).optional(),
    orderDate: zod_1.z.date().optional(),
    effectiveDate: zod_1.z.date().optional(),
    expiryDate: zod_1.z.date().optional(),
    createdBy: zod_1.z.string().cuid(),
    approvedBy: zod_1.z.string().cuid().optional(),
    approvedAt: zod_1.z.date().optional(),
    executedBy: zod_1.z.string().cuid().optional(),
    executedAt: zod_1.z.date().optional(),
    executionNotes: zod_1.z.string().max(1000).optional(),
    attachments: zod_1.z.array(zod_1.z.string().cuid()).default([]), // Document IDs
    isConfidential: zod_1.z.boolean().default(false),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
// Create Order Schema
exports.CreateOrderSchema = exports.OrderSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    approvedAt: true,
    executedAt: true,
});
// Update Order Schema
exports.UpdateOrderSchema = exports.CreateOrderSchema.partial();
// Order Search Schema
exports.OrderSearchSchema = zod_1.z.object({
    query: zod_1.z.string().optional(),
    caseId: zod_1.z.string().cuid().optional(),
    type: exports.OrderTypeSchema.optional(),
    status: exports.OrderStatusSchema.optional(),
    priority: exports.OrderPrioritySchema.optional(),
    courtName: zod_1.z.string().optional(),
    judgeName: zod_1.z.string().optional(),
    createdBy: zod_1.z.string().cuid().optional(),
    orderDateFrom: zod_1.z.date().optional(),
    orderDateTo: zod_1.z.date().optional(),
    effectiveDateFrom: zod_1.z.date().optional(),
    effectiveDateTo: zod_1.z.date().optional(),
    isConfidential: zod_1.z.boolean().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    limit: zod_1.z.number().int().positive().max(100).default(20),
    offset: zod_1.z.number().int().min(0).default(0),
});
// Order List Schema
exports.OrderListSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    caseId: zod_1.z.string().cuid(),
    orderNumber: zod_1.z.string(),
    type: exports.OrderTypeSchema,
    status: exports.OrderStatusSchema,
    priority: exports.OrderPrioritySchema,
    title: zod_1.z.string(),
    courtName: zod_1.z.string(),
    orderDate: zod_1.z.date().optional(),
    effectiveDate: zod_1.z.date().optional(),
    createdAt: zod_1.z.date(),
});
// Order with Case Schema
exports.OrderWithCaseSchema = exports.OrderSchema.extend({
    case: zod_1.z.object({
        id: zod_1.z.string().cuid(),
        caseNumber: zod_1.z.string(),
        title: zod_1.z.string(),
        status: zod_1.z.string(),
    }),
});
// Order with Creator Schema
exports.OrderWithCreatorSchema = exports.OrderSchema.extend({
    creator: zod_1.z.object({
        id: zod_1.z.string().cuid(),
        firstName: zod_1.z.string(),
        lastName: zod_1.z.string(),
        email: zod_1.z.string().email(),
    }),
});
// Order Approval Schema
exports.OrderApprovalSchema = zod_1.z.object({
    orderId: zod_1.z.string().cuid(),
    status: zod_1.z.enum(['APPROVED', 'REJECTED']),
    comments: zod_1.z.string().max(1000).optional(),
});
// Order Execution Schema
exports.OrderExecutionSchema = zod_1.z.object({
    orderId: zod_1.z.string().cuid(),
    executionNotes: zod_1.z.string().max(1000).optional(),
    executedBy: zod_1.z.string().cuid(),
});
// Order Statistics Schema
exports.OrderStatisticsSchema = zod_1.z.object({
    total: zod_1.z.number().int().min(0),
    draft: zod_1.z.number().int().min(0),
    pending: zod_1.z.number().int().min(0),
    approved: zod_1.z.number().int().min(0),
    rejected: zod_1.z.number().int().min(0),
    executed: zod_1.z.number().int().min(0),
    cancelled: zod_1.z.number().int().min(0),
    byType: zod_1.z.record(zod_1.z.string(), zod_1.z.number().int().min(0)),
    byPriority: zod_1.z.object({
        low: zod_1.z.number().int().min(0),
        medium: zod_1.z.number().int().min(0),
        high: zod_1.z.number().int().min(0),
        urgent: zod_1.z.number().int().min(0),
    }),
});
