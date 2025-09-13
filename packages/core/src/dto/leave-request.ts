import { z } from 'zod'

// Leave Type Enum
export const LeaveTypeSchema = z.enum([
  'SICK_LEAVE', 'ANNUAL_LEAVE', 'CASUAL_LEAVE', 'MATERNITY_LEAVE',
  'PATERNITY_LEAVE', 'BEREAVEMENT_LEAVE', 'COMPENSATORY_LEAVE',
  'SABBATICAL', 'UNPAID_LEAVE', 'OTHER'
])
export type LeaveType = z.infer<typeof LeaveTypeSchema>

// Leave Status Enum
export const LeaveStatusSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'])
export type LeaveStatus = z.infer<typeof LeaveStatusSchema>

// Leave Duration Enum
export const LeaveDurationSchema = z.enum(['FULL_DAY', 'HALF_DAY_MORNING', 'HALF_DAY_EVENING', 'HOURLY'])
export type LeaveDuration = z.infer<typeof LeaveDurationSchema>

// Base Leave Request Schema
export const LeaveRequestSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid(),
  type: LeaveTypeSchema.default('ANNUAL_LEAVE'),
  status: LeaveStatusSchema.default('PENDING'),
  duration: LeaveDurationSchema.default('FULL_DAY'),
  startDate: z.date(),
  endDate: z.date(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(), // HH:MM format
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(), // HH:MM format
  totalDays: z.number().positive(),
  reason: z.string().min(1).max(1000),
  medicalCertificate: z.string().cuid().optional(), // Document ID
  emergencyContact: z.string().max(200).optional(),
  emergencyPhone: z.string().optional(),
  attachments: z.array(z.string().cuid()).default([]), // Document IDs
  appliedBy: z.string().cuid(), // Who applied (could be different from userId)
  appliedAt: z.date(),
  approvedBy: z.string().cuid().optional(),
  approvedAt: z.date().optional(),
  rejectedBy: z.string().cuid().optional(),
  rejectedAt: z.date().optional(),
  rejectionReason: z.string().max(500).optional(),
  cancelledBy: z.string().cuid().optional(),
  cancelledAt: z.date().optional(),
  cancellationReason: z.string().max(500).optional(),
  notes: z.string().max(1000).optional(),
  isEmergency: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Create Leave Request Schema
export const CreateLeaveRequestSchema = LeaveRequestSchema.omit({
  id: true,
  appliedAt: true,
  approvedAt: true,
  rejectedAt: true,
  cancelledAt: true,
  createdAt: true,
  updatedAt: true,
})

// Update Leave Request Schema
export const UpdateLeaveRequestSchema = CreateLeaveRequestSchema.partial()

// Leave Request Search Schema
export const LeaveRequestSearchSchema = z.object({
  query: z.string().optional(),
  userId: z.string().cuid().optional(),
  type: LeaveTypeSchema.optional(),
  status: LeaveStatusSchema.optional(),
  duration: LeaveDurationSchema.optional(),
  startDateFrom: z.date().optional(),
  startDateTo: z.date().optional(),
  endDateFrom: z.date().optional(),
  endDateTo: z.date().optional(),
  appliedBy: z.string().cuid().optional(),
  approvedBy: z.string().cuid().optional(),
  isEmergency: z.boolean().optional(),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().min(0).default(0),
})

// Leave Request List Schema
export const LeaveRequestListSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid(),
  type: LeaveTypeSchema,
  status: LeaveStatusSchema,
  duration: LeaveDurationSchema,
  startDate: z.date(),
  endDate: z.date(),
  totalDays: z.number().positive(),
  reason: z.string(),
  appliedAt: z.date(),
  approvedAt: z.date().optional(),
  rejectedAt: z.date().optional(),
  isEmergency: z.boolean(),
})

// Leave Request with User Schema
export const LeaveRequestWithUserSchema = LeaveRequestSchema.extend({
  user: z.object({
    id: z.string().cuid(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
  }),
})

// Leave Request with Approver Schema
export const LeaveRequestWithApproverSchema = LeaveRequestSchema.extend({
  approver: z.object({
    id: z.string().cuid(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
  }).optional(),
})

// Leave Request Approval Schema
export const LeaveRequestApprovalSchema = z.object({
  leaveRequestId: z.string().cuid(),
  status: z.enum(['APPROVED', 'REJECTED']),
  notes: z.string().max(500).optional(),
})

// Leave Request Cancellation Schema
export const LeaveRequestCancellationSchema = z.object({
  leaveRequestId: z.string().cuid(),
  reason: z.string().max(500),
})

// Leave Balance Schema
export const LeaveBalanceSchema = z.object({
  userId: z.string().cuid(),
  leaveType: LeaveTypeSchema,
  totalDays: z.number().int().min(0),
  usedDays: z.number().int().min(0),
  remainingDays: z.number().int().min(0),
  pendingDays: z.number().int().min(0),
})

// Leave Calendar Schema
export const LeaveCalendarSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid(),
  type: LeaveTypeSchema,
  status: LeaveStatusSchema,
  startDate: z.date(),
  endDate: z.date(),
  duration: LeaveDurationSchema,
  firstName: z.string(),
  lastName: z.string(),
})

// Leave Statistics Schema
export const LeaveStatisticsSchema = z.object({
  totalRequests: z.number().int().min(0),
  pending: z.number().int().min(0),
  approved: z.number().int().min(0),
  rejected: z.number().int().min(0),
  cancelled: z.number().int().min(0),
  byType: z.record(z.string(), z.number().int().min(0)),
  byDuration: z.object({
    fullDay: z.number().int().min(0),
    halfDayMorning: z.number().int().min(0),
    halfDayEvening: z.number().int().min(0),
    hourly: z.number().int().min(0),
  }),
  averageDaysPerRequest: z.number().positive(),
  mostCommonLeaveType: z.string().optional(),
})

// Export Types
export type LeaveRequest = z.infer<typeof LeaveRequestSchema>
export type CreateLeaveRequest = z.infer<typeof CreateLeaveRequestSchema>
export type UpdateLeaveRequest = z.infer<typeof UpdateLeaveRequestSchema>
export type LeaveRequestSearch = z.infer<typeof LeaveRequestSearchSchema>
export type LeaveRequestList = z.infer<typeof LeaveRequestListSchema>
export type LeaveRequestWithUser = z.infer<typeof LeaveRequestWithUserSchema>
export type LeaveRequestWithApprover = z.infer<typeof LeaveRequestWithApproverSchema>
export type LeaveRequestApproval = z.infer<typeof LeaveRequestApprovalSchema>
export type LeaveRequestCancellation = z.infer<typeof LeaveRequestCancellationSchema>
export type LeaveBalance = z.infer<typeof LeaveBalanceSchema>
export type LeaveCalendar = z.infer<typeof LeaveCalendarSchema>
export type LeaveStatistics = z.infer<typeof LeaveStatisticsSchema>
