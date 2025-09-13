import { z } from 'zod'

// Order Status Enum
export const OrderStatusSchema = z.enum(['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'EXECUTED', 'CANCELLED'])
export type OrderStatus = z.infer<typeof OrderStatusSchema>

// Order Type Enum
export const OrderTypeSchema = z.enum([
  'INTERIM_ORDER', 'FINAL_ORDER', 'EXECUTION_ORDER', 'STAY_ORDER',
  'INJUNCTION', 'DECREE', 'AWARD', 'SETTLEMENT', 'OTHER'
])
export type OrderType = z.infer<typeof OrderTypeSchema>

// Order Priority Enum
export const OrderPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
export type OrderPriority = z.infer<typeof OrderPrioritySchema>

// Base Order Schema
export const OrderSchema = z.object({
  id: z.string().cuid(),
  caseId: z.string().cuid(),
  orderNumber: z.string().min(1).max(50),
  type: OrderTypeSchema.default('FINAL_ORDER'),
  status: OrderStatusSchema.default('DRAFT'),
  priority: OrderPrioritySchema.default('MEDIUM'),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  content: z.string().min(1), // The actual order content
  courtName: z.string().min(1).max(200),
  judgeName: z.string().max(100).optional(),
  orderDate: z.date().optional(),
  effectiveDate: z.date().optional(),
  expiryDate: z.date().optional(),
  createdBy: z.string().cuid(),
  approvedBy: z.string().cuid().optional(),
  approvedAt: z.date().optional(),
  executedBy: z.string().cuid().optional(),
  executedAt: z.date().optional(),
  executionNotes: z.string().max(1000).optional(),
  attachments: z.array(z.string().cuid()).default([]), // Document IDs
  isConfidential: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Create Order Schema
export const CreateOrderSchema = OrderSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  approvedAt: true,
  executedAt: true,
})

// Update Order Schema
export const UpdateOrderSchema = CreateOrderSchema.partial()

// Order Search Schema
export const OrderSearchSchema = z.object({
  query: z.string().optional(),
  caseId: z.string().cuid().optional(),
  type: OrderTypeSchema.optional(),
  status: OrderStatusSchema.optional(),
  priority: OrderPrioritySchema.optional(),
  courtName: z.string().optional(),
  judgeName: z.string().optional(),
  createdBy: z.string().cuid().optional(),
  orderDateFrom: z.date().optional(),
  orderDateTo: z.date().optional(),
  effectiveDateFrom: z.date().optional(),
  effectiveDateTo: z.date().optional(),
  isConfidential: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().min(0).default(0),
})

// Order List Schema
export const OrderListSchema = z.object({
  id: z.string().cuid(),
  caseId: z.string().cuid(),
  orderNumber: z.string(),
  type: OrderTypeSchema,
  status: OrderStatusSchema,
  priority: OrderPrioritySchema,
  title: z.string(),
  courtName: z.string(),
  orderDate: z.date().optional(),
  effectiveDate: z.date().optional(),
  createdAt: z.date(),
})

// Order with Case Schema
export const OrderWithCaseSchema = OrderSchema.extend({
  case: z.object({
    id: z.string().cuid(),
    caseNumber: z.string(),
    title: z.string(),
    status: z.string(),
  }),
})

// Order with Creator Schema
export const OrderWithCreatorSchema = OrderSchema.extend({
  creator: z.object({
    id: z.string().cuid(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
  }),
})

// Order Approval Schema
export const OrderApprovalSchema = z.object({
  orderId: z.string().cuid(),
  status: z.enum(['APPROVED', 'REJECTED']),
  comments: z.string().max(1000).optional(),
})

// Order Execution Schema
export const OrderExecutionSchema = z.object({
  orderId: z.string().cuid(),
  executionNotes: z.string().max(1000).optional(),
  executedBy: z.string().cuid(),
})

// Order Statistics Schema
export const OrderStatisticsSchema = z.object({
  total: z.number().int().min(0),
  draft: z.number().int().min(0),
  pending: z.number().int().min(0),
  approved: z.number().int().min(0),
  rejected: z.number().int().min(0),
  executed: z.number().int().min(0),
  cancelled: z.number().int().min(0),
  byType: z.record(z.string(), z.number().int().min(0)),
  byPriority: z.object({
    low: z.number().int().min(0),
    medium: z.number().int().min(0),
    high: z.number().int().min(0),
    urgent: z.number().int().min(0),
  }),
})

// Export Types
export type Order = z.infer<typeof OrderSchema>
export type CreateOrder = z.infer<typeof CreateOrderSchema>
export type UpdateOrder = z.infer<typeof UpdateOrderSchema>
export type OrderSearch = z.infer<typeof OrderSearchSchema>
export type OrderList = z.infer<typeof OrderListSchema>
export type OrderWithCase = z.infer<typeof OrderWithCaseSchema>
export type OrderWithCreator = z.infer<typeof OrderWithCreatorSchema>
export type OrderApproval = z.infer<typeof OrderApprovalSchema>
export type OrderExecution = z.infer<typeof OrderExecutionSchema>
export type OrderStatistics = z.infer<typeof OrderStatisticsSchema>
