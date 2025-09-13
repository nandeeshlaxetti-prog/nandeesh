"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPendingSummaryWorker = exports.UserPendingSummaryWorker = void 0;
const index_1 = require("./index");
/**
 * User Pending Summary Refresh Worker
 * Refreshes user pending summaries with current data
 */
class UserPendingSummaryWorker {
    /**
     * Refresh pending summary for a specific user
     */
    async refreshUserPendingSummary(userId, date) {
        const targetDate = date || new Date();
        try {
            // Get all pending data for the user
            const [caseData, taskData, subtaskData, hearingData, orderData, worklogData, leaveData, documentData, teamData] = await Promise.all([
                this.getCasePendingData(userId, targetDate),
                this.getTaskPendingData(userId, targetDate),
                this.getSubtaskPendingData(userId, targetDate),
                this.getHearingPendingData(userId, targetDate),
                this.getOrderPendingData(userId, targetDate),
                this.getWorklogPendingData(userId, targetDate),
                this.getLeavePendingData(userId, targetDate),
                this.getDocumentPendingData(userId, targetDate),
                this.getTeamPendingData(userId, targetDate)
            ]);
            // Calculate overall summary
            const summaryData = {
                userId,
                date: targetDate,
                // Case data
                ...caseData,
                // Task data
                ...taskData,
                // Subtask data
                ...subtaskData,
                // Hearing data
                ...hearingData,
                // Order data
                ...orderData,
                // Worklog data
                ...worklogData,
                // Leave data
                ...leaveData,
                // Document data
                ...documentData,
                // Team data
                ...teamData,
                // Overall summary
                totalPendingItems: caseData.pendingCases + taskData.pendingTasks + subtaskData.pendingSubtasks +
                    orderData.pendingOrders + worklogData.pendingWorklogs + leaveData.pendingLeaveRequests +
                    documentData.pendingDocuments + teamData.teamInvitations + teamData.pendingTeamTasks,
                totalUrgentItems: caseData.urgentCases + taskData.urgentTasks + subtaskData.urgentSubtasks +
                    orderData.overdueOrders + worklogData.worklogsToApprove + leaveData.leaveRequestsToApprove,
                totalOverdueItems: caseData.overdueCases + taskData.overdueTasks + subtaskData.overdueSubtasks +
                    orderData.overdueOrders,
                // Priority breakdown
                highPriorityItems: taskData.urgentTasks + subtaskData.urgentSubtasks,
                mediumPriorityItems: taskData.pendingTasks - taskData.urgentTasks + subtaskData.pendingSubtasks - subtaskData.urgentSubtasks,
                lowPriorityItems: taskData.pendingTasks - taskData.urgentTasks,
                // Time-based breakdown
                itemsDueToday: this.calculateItemsDueToday(taskData, subtaskData, hearingData),
                itemsDueThisWeek: this.calculateItemsDueThisWeek(taskData, subtaskData, hearingData),
                itemsDueThisMonth: this.calculateItemsDueThisMonth(taskData, subtaskData, hearingData),
                // Workload level
                workloadLevel: this.calculateWorkloadLevel(caseData, taskData, subtaskData, hearingData, orderData),
                estimatedHoursToComplete: this.calculateEstimatedHours(taskData, subtaskData)
            };
            // Save or update the summary
            await this.saveUserPendingSummary(summaryData);
            return summaryData;
        }
        catch (error) {
            console.error('Error refreshing user pending summary:', error);
            throw error;
        }
    }
    /**
     * Refresh pending summaries for all active users
     */
    async refreshAllUserPendingSummaries(date) {
        const targetDate = date || new Date();
        try {
            // Get all active users
            const activeUsers = await index_1.db.user.findMany({
                where: {
                    isActive: true,
                    status: 'ACTIVE'
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true
                }
            });
            console.log(`Refreshing pending summaries for ${activeUsers.length} users...`);
            // Refresh summaries for all users
            const refreshPromises = activeUsers.map(user => this.refreshUserPendingSummary(user.id, targetDate));
            await Promise.all(refreshPromises);
            console.log(`Successfully refreshed pending summaries for ${activeUsers.length} users`);
        }
        catch (error) {
            console.error('Error refreshing all user pending summaries:', error);
            throw error;
        }
    }
    /**
     * Get case pending data for a user
     */
    async getCasePendingData(userId, date) {
        const [pendingCases, urgentCases, overdueCases] = await Promise.all([
            index_1.db.case.count({
                where: {
                    assignedLawyerId: userId,
                    status: { in: ['OPEN', 'IN_PROGRESS'] }
                }
            }),
            index_1.db.case.count({
                where: {
                    assignedLawyerId: userId,
                    status: { in: ['OPEN', 'IN_PROGRESS'] },
                    priority: { in: ['HIGH', 'URGENT'] }
                }
            }),
            index_1.db.case.count({
                where: {
                    assignedLawyerId: userId,
                    status: { in: ['OPEN', 'IN_PROGRESS'] },
                    expectedCompletionDate: { lt: date }
                }
            })
        ]);
        return {
            pendingCases,
            urgentCases,
            overdueCases
        };
    }
    /**
     * Get task pending data for a user
     */
    async getTaskPendingData(userId, date) {
        const [pendingTasks, urgentTasks, overdueTasks, personalTasks, adminTasks, bizDevTasks] = await Promise.all([
            index_1.db.task.count({
                where: {
                    assignedTo: userId,
                    status: { in: ['PENDING', 'IN_PROGRESS', 'ON_HOLD'] }
                }
            }),
            index_1.db.task.count({
                where: {
                    assignedTo: userId,
                    status: { in: ['PENDING', 'IN_PROGRESS'] },
                    priority: { in: ['HIGH', 'URGENT'] }
                }
            }),
            index_1.db.task.count({
                where: {
                    assignedTo: userId,
                    status: { in: ['PENDING', 'IN_PROGRESS'] },
                    dueDate: { lt: date }
                }
            }),
            index_1.db.task.count({
                where: {
                    assignedTo: userId,
                    status: { in: ['PENDING', 'IN_PROGRESS', 'ON_HOLD'] },
                    category: 'PERSONAL'
                }
            }),
            index_1.db.task.count({
                where: {
                    assignedTo: userId,
                    status: { in: ['PENDING', 'IN_PROGRESS', 'ON_HOLD'] },
                    category: 'ADMIN'
                }
            }),
            index_1.db.task.count({
                where: {
                    assignedTo: userId,
                    status: { in: ['PENDING', 'IN_PROGRESS', 'ON_HOLD'] },
                    category: 'BIZDEV'
                }
            })
        ]);
        return {
            pendingTasks,
            urgentTasks,
            overdueTasks,
            personalTasks,
            adminTasks,
            bizDevTasks
        };
    }
    /**
     * Get subtask pending data for a user
     */
    async getSubtaskPendingData(userId, date) {
        const [pendingSubtasks, urgentSubtasks, overdueSubtasks] = await Promise.all([
            index_1.db.subtask.count({
                where: {
                    assignedTo: userId,
                    status: { in: ['PENDING', 'IN_PROGRESS'] }
                }
            }),
            index_1.db.subtask.count({
                where: {
                    assignedTo: userId,
                    status: { in: ['PENDING', 'IN_PROGRESS'] },
                    priority: { in: ['HIGH', 'URGENT'] }
                }
            }),
            index_1.db.subtask.count({
                where: {
                    assignedTo: userId,
                    status: { in: ['PENDING', 'IN_PROGRESS'] },
                    dueDate: { lt: date }
                }
            })
        ]);
        return {
            pendingSubtasks,
            urgentSubtasks,
            overdueSubtasks
        };
    }
    /**
     * Get hearing pending data for a user
     */
    async getHearingPendingData(userId, date) {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const [upcomingHearings, hearingsThisWeek, hearingsToday] = await Promise.all([
            index_1.db.hearing.count({
                where: {
                    case: {
                        assignedLawyerId: userId
                    },
                    status: 'SCHEDULED',
                    scheduledDate: { gte: date }
                }
            }),
            index_1.db.hearing.count({
                where: {
                    case: {
                        assignedLawyerId: userId
                    },
                    status: 'SCHEDULED',
                    scheduledDate: { gte: startOfWeek, lte: endOfWeek }
                }
            }),
            index_1.db.hearing.count({
                where: {
                    case: {
                        assignedLawyerId: userId
                    },
                    status: 'SCHEDULED',
                    scheduledDate: { gte: startOfDay, lte: endOfDay }
                }
            })
        ]);
        return {
            upcomingHearings,
            hearingsThisWeek,
            hearingsToday
        };
    }
    /**
     * Get order pending data for a user
     */
    async getOrderPendingData(userId, date) {
        const [pendingOrders, ordersToExecute, overdueOrders] = await Promise.all([
            index_1.db.order.count({
                where: {
                    case: {
                        assignedLawyerId: userId
                    },
                    status: { in: ['DRAFT', 'PENDING'] }
                }
            }),
            index_1.db.order.count({
                where: {
                    case: {
                        assignedLawyerId: userId
                    },
                    status: 'APPROVED',
                    executedAt: null
                }
            }),
            index_1.db.order.count({
                where: {
                    case: {
                        assignedLawyerId: userId
                    },
                    status: 'APPROVED',
                    executedAt: null,
                    effectiveDate: { lt: date }
                }
            })
        ]);
        return {
            pendingOrders,
            ordersToExecute,
            overdueOrders
        };
    }
    /**
     * Get worklog pending data for a user
     */
    async getWorklogPendingData(userId, date) {
        const [pendingWorklogs, worklogsToApprove] = await Promise.all([
            index_1.db.worklog.count({
                where: {
                    userId,
                    status: { in: ['DRAFT', 'SUBMITTED'] }
                }
            }),
            index_1.db.worklog.count({
                where: {
                    userId,
                    status: 'SUBMITTED',
                    approvedBy: null
                }
            })
        ]);
        return {
            pendingWorklogs,
            worklogsToApprove
        };
    }
    /**
     * Get leave pending data for a user
     */
    async getLeavePendingData(userId, date) {
        const [pendingLeaveRequests, leaveRequestsToApprove] = await Promise.all([
            index_1.db.leaveRequest.count({
                where: {
                    userId,
                    status: 'PENDING'
                }
            }),
            index_1.db.leaveRequest.count({
                where: {
                    approvedBy: userId,
                    status: 'PENDING'
                }
            })
        ]);
        return {
            pendingLeaveRequests,
            leaveRequestsToApprove
        };
    }
    /**
     * Get document pending data for a user
     */
    async getDocumentPendingData(userId, date) {
        const [pendingDocuments, documentsToReview] = await Promise.all([
            index_1.db.document.count({
                where: {
                    case: {
                        assignedLawyerId: userId
                    }
                }
            }),
            index_1.db.document.count({
                where: {
                    case: {
                        assignedLawyerId: userId
                    }
                }
            })
        ]);
        return {
            pendingDocuments,
            documentsToReview
        };
    }
    /**
     * Get team pending data for a user
     */
    async getTeamPendingData(userId, date) {
        const [teamInvitations, pendingTeamTasks] = await Promise.all([
            index_1.db.teamMember.count({
                where: {
                    userId,
                    isActive: false
                }
            }),
            index_1.db.task.count({
                where: {
                    case: {
                        team: {
                            members: {
                                some: {
                                    userId,
                                    isActive: true
                                }
                            }
                        }
                    },
                    status: { in: ['PENDING', 'IN_PROGRESS'] }
                }
            })
        ]);
        return {
            teamInvitations,
            pendingTeamTasks
        };
    }
    /**
     * Calculate items due today
     */
    calculateItemsDueToday(taskData, subtaskData, hearingData) {
        return hearingData.hearingsToday + taskData.overdueTasks + subtaskData.overdueSubtasks;
    }
    /**
     * Calculate items due this week
     */
    calculateItemsDueThisWeek(taskData, subtaskData, hearingData) {
        return hearingData.hearingsThisWeek + taskData.pendingTasks + subtaskData.pendingSubtasks;
    }
    /**
     * Calculate items due this month
     */
    calculateItemsDueThisMonth(taskData, subtaskData, hearingData) {
        return hearingData.upcomingHearings + taskData.pendingTasks + subtaskData.pendingSubtasks;
    }
    /**
     * Calculate workload level
     */
    calculateWorkloadLevel(caseData, taskData, subtaskData, hearingData, orderData) {
        const totalItems = caseData.pendingCases + taskData.pendingTasks + subtaskData.pendingSubtasks +
            hearingData.upcomingHearings + orderData.pendingOrders;
        const urgentItems = caseData.urgentCases + taskData.urgentTasks + subtaskData.urgentSubtasks +
            orderData.overdueOrders;
        if (urgentItems > 10 || totalItems > 50) {
            return 'CRITICAL';
        }
        else if (urgentItems > 5 || totalItems > 30) {
            return 'HIGH';
        }
        else if (urgentItems > 2 || totalItems > 15) {
            return 'MODERATE';
        }
        else {
            return 'LOW';
        }
    }
    /**
     * Calculate estimated hours to complete
     */
    calculateEstimatedHours(taskData, subtaskData) {
        // This would need to be calculated based on estimated hours in tasks/subtasks
        // For now, return a simple calculation
        return (taskData.pendingTasks * 2) + (subtaskData.pendingSubtasks * 0.5);
    }
    /**
     * Save user pending summary to database
     */
    async saveUserPendingSummary(data) {
        try {
            await index_1.db.userPendingSummary.upsert({
                where: {
                    userId_date: {
                        userId: data.userId,
                        date: data.date
                    }
                },
                update: {
                    ...data,
                    lastUpdated: new Date()
                },
                create: {
                    ...data,
                    lastUpdated: new Date()
                }
            });
        }
        catch (error) {
            console.error('Error saving user pending summary:', error);
            throw error;
        }
    }
    /**
     * Get user pending summary
     */
    async getUserPendingSummary(userId, date) {
        const targetDate = date || new Date();
        try {
            const summary = await index_1.db.userPendingSummary.findUnique({
                where: {
                    userId_date: {
                        userId,
                        date: targetDate
                    }
                }
            });
            return summary;
        }
        catch (error) {
            console.error('Error getting user pending summary:', error);
            return null;
        }
    }
    /**
     * Get pending summary for multiple users
     */
    async getMultipleUserPendingSummaries(userIds, date) {
        const targetDate = date || new Date();
        try {
            const summaries = await index_1.db.userPendingSummary.findMany({
                where: {
                    userId: { in: userIds },
                    date: targetDate
                }
            });
            return summaries;
        }
        catch (error) {
            console.error('Error getting multiple user pending summaries:', error);
            return [];
        }
    }
}
exports.UserPendingSummaryWorker = UserPendingSummaryWorker;
// Export singleton instance
exports.userPendingSummaryWorker = new UserPendingSummaryWorker();
