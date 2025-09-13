import { z } from 'zod'

// Base User Pending Summary Schema
export const UserPendingSummarySchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid(),
  date: z.date(),
  
  // Case-related pending items
  pendingCases: z.number().int().min(0).default(0),
  urgentCases: z.number().int().min(0).default(0),
  overdueCases: z.number().int().min(0).default(0),
  
  // Task-related pending items
  pendingTasks: z.number().int().min(0).default(0),
  urgentTasks: z.number().int().min(0).default(0),
  overdueTasks: z.number().int().min(0).default(0),
  personalTasks: z.number().int().min(0).default(0),
  adminTasks: z.number().int().min(0).default(0),
  bizDevTasks: z.number().int().min(0).default(0),
  
  // Subtask-related pending items
  pendingSubtasks: z.number().int().min(0).default(0),
  urgentSubtasks: z.number().int().min(0).default(0),
  overdueSubtasks: z.number().int().min(0).default(0),
  
  // Hearing-related pending items
  upcomingHearings: z.number().int().min(0).default(0),
  hearingsThisWeek: z.number().int().min(0).default(0),
  hearingsToday: z.number().int().min(0).default(0),
  
  // Order-related pending items
  pendingOrders: z.number().int().min(0).default(0),
  ordersToExecute: z.number().int().min(0).default(0),
  overdueOrders: z.number().int().min(0).default(0),
  
  // Worklog-related pending items
  pendingWorklogs: z.number().int().min(0).default(0),
  worklogsToApprove: z.number().int().min(0).default(0),
  
  // Leave-related pending items
  pendingLeaveRequests: z.number().int().min(0).default(0),
  leaveRequestsToApprove: z.number().int().min(0).default(0),
  
  // Document-related pending items
  pendingDocuments: z.number().int().min(0).default(0),
  documentsToReview: z.number().int().min(0).default(0),
  
  // Team-related pending items
  teamInvitations: z.number().int().min(0).default(0),
  pendingTeamTasks: z.number().int().min(0).default(0),
  
  // Overall summary
  totalPendingItems: z.number().int().min(0).default(0),
  totalUrgentItems: z.number().int().min(0).default(0),
  totalOverdueItems: z.number().int().min(0).default(0),
  
  // Priority breakdown
  highPriorityItems: z.number().int().min(0).default(0),
  mediumPriorityItems: z.number().int().min(0).default(0),
  lowPriorityItems: z.number().int().min(0).default(0),
  
  // Time-based breakdown
  itemsDueToday: z.number().int().min(0).default(0),
  itemsDueThisWeek: z.number().int().min(0).default(0),
  itemsDueThisMonth: z.number().int().min(0).default(0),
  
  // Workload indicators
  workloadLevel: z.enum(['LOW', 'MODERATE', 'HIGH', 'CRITICAL']).default('MODERATE'),
  estimatedHoursToComplete: z.number().positive().optional(),
  
  // Last updated
  lastUpdated: z.date(),
  createdAt: z.date(),
})

// Create User Pending Summary Schema
export const CreateUserPendingSummarySchema = UserPendingSummarySchema.omit({
  id: true,
  createdAt: true,
})

// Update User Pending Summary Schema
export const UpdateUserPendingSummarySchema = CreateUserPendingSummarySchema.partial()

// User Pending Summary Search Schema
export const UserPendingSummarySearchSchema = z.object({
  userId: z.string().cuid().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  workloadLevel: z.enum(['LOW', 'MODERATE', 'HIGH', 'CRITICAL']).optional(),
  hasOverdueItems: z.boolean().optional(),
  hasUrgentItems: z.boolean().optional(),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().min(0).default(0),
})

// User Pending Summary List Schema
export const UserPendingSummaryListSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid(),
  date: z.date(),
  totalPendingItems: z.number().int().min(0),
  totalUrgentItems: z.number().int().min(0),
  totalOverdueItems: z.number().int().min(0),
  workloadLevel: z.enum(['LOW', 'MODERATE', 'HIGH', 'CRITICAL']),
  lastUpdated: z.date(),
})

// User Pending Summary with User Schema
export const UserPendingSummaryWithUserSchema = UserPendingSummarySchema.extend({
  user: z.object({
    id: z.string().cuid(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    role: z.string(),
  }),
})

// User Pending Summary Dashboard Schema
export const UserPendingSummaryDashboardSchema = z.object({
  userId: z.string().cuid(),
  userName: z.string(),
  userRole: z.string(),
  summary: UserPendingSummarySchema,
  recentActivity: z.array(z.object({
    id: z.string().cuid(),
    type: z.string(),
    title: z.string(),
    priority: z.string(),
    dueDate: z.date().optional(),
    createdAt: z.date(),
  })),
  upcomingDeadlines: z.array(z.object({
    id: z.string().cuid(),
    type: z.string(),
    title: z.string(),
    dueDate: z.date(),
    priority: z.string(),
  })),
})

// User Pending Summary Statistics Schema
export const UserPendingSummaryStatisticsSchema = z.object({
  totalUsers: z.number().int().min(0),
  usersWithPendingItems: z.number().int().min(0),
  usersWithOverdueItems: z.number().int().min(0),
  usersWithUrgentItems: z.number().int().min(0),
  averagePendingItemsPerUser: z.number().positive(),
  workloadDistribution: z.object({
    low: z.number().int().min(0),
    moderate: z.number().int().min(0),
    high: z.number().int().min(0),
    critical: z.number().int().min(0),
  }),
  topUsersByPendingItems: z.array(z.object({
    userId: z.string().cuid(),
    userName: z.string(),
    pendingItems: z.number().int().min(0),
  })),
  mostCommonPendingTypes: z.array(z.object({
    type: z.string(),
    count: z.number().int().min(0),
  })),
})

// User Pending Summary Refresh Schema
export const UserPendingSummaryRefreshSchema = z.object({
  userId: z.string().cuid().optional(), // If not provided, refreshes all users
  forceRefresh: z.boolean().default(false),
})

// Export Types
export type UserPendingSummary = z.infer<typeof UserPendingSummarySchema>
export type CreateUserPendingSummary = z.infer<typeof CreateUserPendingSummarySchema>
export type UpdateUserPendingSummary = z.infer<typeof UpdateUserPendingSummarySchema>
export type UserPendingSummarySearch = z.infer<typeof UserPendingSummarySearchSchema>
export type UserPendingSummaryList = z.infer<typeof UserPendingSummaryListSchema>
export type UserPendingSummaryWithUser = z.infer<typeof UserPendingSummaryWithUserSchema>
export type UserPendingSummaryDashboard = z.infer<typeof UserPendingSummaryDashboardSchema>
export type UserPendingSummaryStatistics = z.infer<typeof UserPendingSummaryStatisticsSchema>
export type UserPendingSummaryRefresh = z.infer<typeof UserPendingSummaryRefreshSchema>
