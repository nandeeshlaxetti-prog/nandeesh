"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPendingSummaryRefreshSchema = exports.UserPendingSummaryStatisticsSchema = exports.UserPendingSummaryDashboardSchema = exports.UserPendingSummaryWithUserSchema = exports.UserPendingSummaryListSchema = exports.UserPendingSummarySearchSchema = exports.UpdateUserPendingSummarySchema = exports.CreateUserPendingSummarySchema = exports.UserPendingSummarySchema = void 0;
const zod_1 = require("zod");
// Base User Pending Summary Schema
exports.UserPendingSummarySchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    userId: zod_1.z.string().cuid(),
    date: zod_1.z.date(),
    // Case-related pending items
    pendingCases: zod_1.z.number().int().min(0).default(0),
    urgentCases: zod_1.z.number().int().min(0).default(0),
    overdueCases: zod_1.z.number().int().min(0).default(0),
    // Task-related pending items
    pendingTasks: zod_1.z.number().int().min(0).default(0),
    urgentTasks: zod_1.z.number().int().min(0).default(0),
    overdueTasks: zod_1.z.number().int().min(0).default(0),
    personalTasks: zod_1.z.number().int().min(0).default(0),
    adminTasks: zod_1.z.number().int().min(0).default(0),
    bizDevTasks: zod_1.z.number().int().min(0).default(0),
    // Subtask-related pending items
    pendingSubtasks: zod_1.z.number().int().min(0).default(0),
    urgentSubtasks: zod_1.z.number().int().min(0).default(0),
    overdueSubtasks: zod_1.z.number().int().min(0).default(0),
    // Hearing-related pending items
    upcomingHearings: zod_1.z.number().int().min(0).default(0),
    hearingsThisWeek: zod_1.z.number().int().min(0).default(0),
    hearingsToday: zod_1.z.number().int().min(0).default(0),
    // Order-related pending items
    pendingOrders: zod_1.z.number().int().min(0).default(0),
    ordersToExecute: zod_1.z.number().int().min(0).default(0),
    overdueOrders: zod_1.z.number().int().min(0).default(0),
    // Worklog-related pending items
    pendingWorklogs: zod_1.z.number().int().min(0).default(0),
    worklogsToApprove: zod_1.z.number().int().min(0).default(0),
    // Leave-related pending items
    pendingLeaveRequests: zod_1.z.number().int().min(0).default(0),
    leaveRequestsToApprove: zod_1.z.number().int().min(0).default(0),
    // Document-related pending items
    pendingDocuments: zod_1.z.number().int().min(0).default(0),
    documentsToReview: zod_1.z.number().int().min(0).default(0),
    // Team-related pending items
    teamInvitations: zod_1.z.number().int().min(0).default(0),
    pendingTeamTasks: zod_1.z.number().int().min(0).default(0),
    // Overall summary
    totalPendingItems: zod_1.z.number().int().min(0).default(0),
    totalUrgentItems: zod_1.z.number().int().min(0).default(0),
    totalOverdueItems: zod_1.z.number().int().min(0).default(0),
    // Priority breakdown
    highPriorityItems: zod_1.z.number().int().min(0).default(0),
    mediumPriorityItems: zod_1.z.number().int().min(0).default(0),
    lowPriorityItems: zod_1.z.number().int().min(0).default(0),
    // Time-based breakdown
    itemsDueToday: zod_1.z.number().int().min(0).default(0),
    itemsDueThisWeek: zod_1.z.number().int().min(0).default(0),
    itemsDueThisMonth: zod_1.z.number().int().min(0).default(0),
    // Workload indicators
    workloadLevel: zod_1.z.enum(['LOW', 'MODERATE', 'HIGH', 'CRITICAL']).default('MODERATE'),
    estimatedHoursToComplete: zod_1.z.number().positive().optional(),
    // Last updated
    lastUpdated: zod_1.z.date(),
    createdAt: zod_1.z.date(),
});
// Create User Pending Summary Schema
exports.CreateUserPendingSummarySchema = exports.UserPendingSummarySchema.omit({
    id: true,
    createdAt: true,
});
// Update User Pending Summary Schema
exports.UpdateUserPendingSummarySchema = exports.CreateUserPendingSummarySchema.partial();
// User Pending Summary Search Schema
exports.UserPendingSummarySearchSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid().optional(),
    dateFrom: zod_1.z.date().optional(),
    dateTo: zod_1.z.date().optional(),
    workloadLevel: zod_1.z.enum(['LOW', 'MODERATE', 'HIGH', 'CRITICAL']).optional(),
    hasOverdueItems: zod_1.z.boolean().optional(),
    hasUrgentItems: zod_1.z.boolean().optional(),
    limit: zod_1.z.number().int().positive().max(100).default(20),
    offset: zod_1.z.number().int().min(0).default(0),
});
// User Pending Summary List Schema
exports.UserPendingSummaryListSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    userId: zod_1.z.string().cuid(),
    date: zod_1.z.date(),
    totalPendingItems: zod_1.z.number().int().min(0),
    totalUrgentItems: zod_1.z.number().int().min(0),
    totalOverdueItems: zod_1.z.number().int().min(0),
    workloadLevel: zod_1.z.enum(['LOW', 'MODERATE', 'HIGH', 'CRITICAL']),
    lastUpdated: zod_1.z.date(),
});
// User Pending Summary with User Schema
exports.UserPendingSummaryWithUserSchema = exports.UserPendingSummarySchema.extend({
    user: zod_1.z.object({
        id: zod_1.z.string().cuid(),
        firstName: zod_1.z.string(),
        lastName: zod_1.z.string(),
        email: zod_1.z.string().email(),
        role: zod_1.z.string(),
    }),
});
// User Pending Summary Dashboard Schema
exports.UserPendingSummaryDashboardSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    userName: zod_1.z.string(),
    userRole: zod_1.z.string(),
    summary: exports.UserPendingSummarySchema,
    recentActivity: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string().cuid(),
        type: zod_1.z.string(),
        title: zod_1.z.string(),
        priority: zod_1.z.string(),
        dueDate: zod_1.z.date().optional(),
        createdAt: zod_1.z.date(),
    })),
    upcomingDeadlines: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string().cuid(),
        type: zod_1.z.string(),
        title: zod_1.z.string(),
        dueDate: zod_1.z.date(),
        priority: zod_1.z.string(),
    })),
});
// User Pending Summary Statistics Schema
exports.UserPendingSummaryStatisticsSchema = zod_1.z.object({
    totalUsers: zod_1.z.number().int().min(0),
    usersWithPendingItems: zod_1.z.number().int().min(0),
    usersWithOverdueItems: zod_1.z.number().int().min(0),
    usersWithUrgentItems: zod_1.z.number().int().min(0),
    averagePendingItemsPerUser: zod_1.z.number().positive(),
    workloadDistribution: zod_1.z.object({
        low: zod_1.z.number().int().min(0),
        moderate: zod_1.z.number().int().min(0),
        high: zod_1.z.number().int().min(0),
        critical: zod_1.z.number().int().min(0),
    }),
    topUsersByPendingItems: zod_1.z.array(zod_1.z.object({
        userId: zod_1.z.string().cuid(),
        userName: zod_1.z.string(),
        pendingItems: zod_1.z.number().int().min(0),
    })),
    mostCommonPendingTypes: zod_1.z.array(zod_1.z.object({
        type: zod_1.z.string(),
        count: zod_1.z.number().int().min(0),
    })),
});
// User Pending Summary Refresh Schema
exports.UserPendingSummaryRefreshSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid().optional(), // If not provided, refreshes all users
    forceRefresh: zod_1.z.boolean().default(false),
});
