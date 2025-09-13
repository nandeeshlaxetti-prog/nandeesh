import { Job } from 'bree'
import { db } from 'data'
import { ConfigUtils } from 'core'

/**
 * User Pending Refresh Job - Runs every 5 minutes
 * Refreshes user pending summaries for dashboard
 */
export default async function userPendingRefresh(job: Job) {
  console.log(`[${new Date().toISOString()}] Starting user pending refresh job...`)
  
  try {
    // Get configuration
    const config = ConfigUtils.getConfig()
    
    // Check if refresh is enabled
    if (!config.APP_MODE || config.APP_MODE !== 'desktop') {
      console.log('User pending refresh skipped - not in desktop mode')
      return
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    // Get all active users
    const users = await db.user.findMany({
      where: {
        isActive: true,
        role: { in: ['ADMIN', 'LAWYER', 'PARALEGAL'] }, // Only internal users
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    })

    console.log(`Refreshing pending summaries for ${users.length} users`)

    let updatedCount = 0
    let errorCount = 0

    for (const user of users) {
      try {
        await refreshUserPendingSummary(user.id, today)
        updatedCount++
      } catch (error) {
        errorCount++
        console.error(`Failed to refresh pending summary for user ${user.id}:`, error)
      }
    }

    console.log(`User pending refresh completed: ${updatedCount} updated, ${errorCount} errors`)

  } catch (error) {
    console.error('User pending refresh job failed:', error)
    
    // Create error audit log
    await db.auditLog.create({
      data: {
        action: 'REFRESH',
        entityType: 'SYSTEM',
        entityName: 'User Pending Refresh Job',
        severity: 'MEDIUM',
        description: `User pending refresh job failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        createdAt: new Date(),
      },
    })
    
    throw error
  }
}

/**
 * Refresh pending summary for a specific user
 */
async function refreshUserPendingSummary(userId: string, date: Date): Promise<void> {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

  // Get case-related pending items
  const [pendingCases, urgentCases, overdueCases] = await Promise.all([
    db.case.count({
      where: {
        assignedLawyerId: userId,
        status: { in: ['OPEN', 'IN_PROGRESS'] },
      },
    }),
    db.case.count({
      where: {
        assignedLawyerId: userId,
        status: { in: ['OPEN', 'IN_PROGRESS'] },
        priority: 'URGENT',
      },
    }),
    db.case.count({
      where: {
        assignedLawyerId: userId,
        status: { in: ['OPEN', 'IN_PROGRESS'] },
        expectedCompletionDate: { lt: now },
      },
    }),
  ])

  // Get task-related pending items
  const [pendingTasks, urgentTasks, overdueTasks, personalTasks, adminTasks, bizDevTasks] = await Promise.all([
    db.task.count({
      where: {
        assignedTo: userId,
        status: { in: ['PENDING', 'IN_PROGRESS'] },
      },
    }),
    db.task.count({
      where: {
        assignedTo: userId,
        status: { in: ['PENDING', 'IN_PROGRESS'] },
        priority: 'URGENT',
      },
    }),
    db.task.count({
      where: {
        assignedTo: userId,
        status: { in: ['PENDING', 'IN_PROGRESS'] },
        dueDate: { lt: now },
      },
    }),
    db.task.count({
      where: {
        assignedTo: userId,
        status: { in: ['PENDING', 'IN_PROGRESS'] },
        category: 'PERSONAL',
      },
    }),
    db.task.count({
      where: {
        assignedTo: userId,
        status: { in: ['PENDING', 'IN_PROGRESS'] },
        category: 'ADMIN',
      },
    }),
    db.task.count({
      where: {
        assignedTo: userId,
        status: { in: ['PENDING', 'IN_PROGRESS'] },
        category: 'BIZDEV',
      },
    }),
  ])

  // Get subtask-related pending items
  const [pendingSubtasks, urgentSubtasks, overdueSubtasks] = await Promise.all([
    db.subtask.count({
      where: {
        assignedTo: userId,
        status: { in: ['PENDING', 'IN_PROGRESS'] },
      },
    }),
    db.subtask.count({
      where: {
        assignedTo: userId,
        status: { in: ['PENDING', 'IN_PROGRESS'] },
        priority: 'URGENT',
      },
    }),
    db.subtask.count({
      where: {
        assignedTo: userId,
        status: { in: ['PENDING', 'IN_PROGRESS'] },
        dueDate: { lt: now },
      },
    }),
  ])

  // Get hearing-related pending items
  const [upcomingHearings, hearingsThisWeek, hearingsToday] = await Promise.all([
    db.hearing.count({
      where: {
        case: {
          assignedLawyerId: userId,
        },
        status: 'SCHEDULED',
        scheduledDate: { gte: now },
      },
    }),
    db.hearing.count({
      where: {
        case: {
          assignedLawyerId: userId,
        },
        status: 'SCHEDULED',
        scheduledDate: { gte: today, lt: nextWeek },
      },
    }),
    db.hearing.count({
      where: {
        case: {
          assignedLawyerId: userId,
        },
        status: 'SCHEDULED',
        scheduledDate: { gte: today, lt: tomorrow },
      },
    }),
  ])

  // Get order-related pending items
  const [pendingOrders, ordersToExecute, overdueOrders] = await Promise.all([
    db.order.count({
      where: {
        case: {
          assignedLawyerId: userId,
        },
        status: { in: ['DRAFT', 'PENDING'] },
      },
    }),
    db.order.count({
      where: {
        case: {
          assignedLawyerId: userId,
        },
        status: 'APPROVED',
      },
    }),
    db.order.count({
      where: {
        case: {
          assignedLawyerId: userId,
        },
        status: 'APPROVED',
        effectiveDate: { lt: now },
      },
    }),
  ])

  // Get worklog-related pending items
  const [pendingWorklogs, worklogsToApprove] = await Promise.all([
    db.worklog.count({
      where: {
        userId,
        status: 'DRAFT',
      },
    }),
    db.worklog.count({
      where: {
        userId,
        status: 'SUBMITTED',
      },
    }),
  ])

  // Get leave-related pending items
  const [pendingLeaveRequests, leaveRequestsToApprove] = await Promise.all([
    db.leaveRequest.count({
      where: {
        userId,
        status: 'PENDING',
      },
    }),
    db.leaveRequest.count({
      where: {
        approvedBy: userId,
        status: 'PENDING',
      },
    }),
  ])

  // Get document-related pending items
  const [pendingDocuments, documentsToReview] = await Promise.all([
    db.document.count({
      where: {
        case: {
          assignedLawyerId: userId,
        },
        // Add document status field when available
      },
    }),
    0, // Placeholder for documents to review
  ])

  // Get team-related pending items
  const [teamInvitations, pendingTeamTasks] = await Promise.all([
    0, // Placeholder for team invitations
    db.task.count({
      where: {
        case: {
          team: {
            members: {
              some: {
                userId,
                isActive: true,
              },
            },
          },
        },
        status: { in: ['PENDING', 'IN_PROGRESS'] },
      },
    }),
  ])

  // Calculate totals
  const totalPendingItems = pendingCases + pendingTasks + pendingSubtasks + pendingOrders + 
                           pendingWorklogs + pendingLeaveRequests + pendingDocuments + teamInvitations + pendingTeamTasks
  
  const totalUrgentItems = urgentCases + urgentTasks + urgentSubtasks
  
  const totalOverdueItems = overdueCases + overdueTasks + overdueSubtasks + overdueOrders

  // Calculate priority breakdown
  const [highPriorityItems, mediumPriorityItems, lowPriorityItems] = await Promise.all([
    db.task.count({
      where: {
        assignedTo: userId,
        status: { in: ['PENDING', 'IN_PROGRESS'] },
        priority: 'HIGH',
      },
    }) + db.task.count({
      where: {
        assignedTo: userId,
        status: { in: ['PENDING', 'IN_PROGRESS'] },
        priority: 'URGENT',
      },
    }),
    db.task.count({
      where: {
        assignedTo: userId,
        status: { in: ['PENDING', 'IN_PROGRESS'] },
        priority: 'MEDIUM',
      },
    }),
    db.task.count({
      where: {
        assignedTo: userId,
        status: { in: ['PENDING', 'IN_PROGRESS'] },
        priority: 'LOW',
      },
    }),
  ])

  // Calculate time-based breakdown
  const [itemsDueToday, itemsDueThisWeek, itemsDueThisMonth] = await Promise.all([
    db.task.count({
      where: {
        assignedTo: userId,
        status: { in: ['PENDING', 'IN_PROGRESS'] },
        dueDate: { gte: today, lt: tomorrow },
      },
    }),
    db.task.count({
      where: {
        assignedTo: userId,
        status: { in: ['PENDING', 'IN_PROGRESS'] },
        dueDate: { gte: today, lt: nextWeek },
      },
    }),
    db.task.count({
      where: {
        assignedTo: userId,
        status: { in: ['PENDING', 'IN_PROGRESS'] },
        dueDate: { gte: today, lt: nextMonth },
      },
    }),
  ])

  // Calculate workload level
  let workloadLevel = 'LOW'
  if (totalPendingItems > 20 || totalUrgentItems > 5 || totalOverdueItems > 3) {
    workloadLevel = 'CRITICAL'
  } else if (totalPendingItems > 15 || totalUrgentItems > 3 || totalOverdueItems > 2) {
    workloadLevel = 'HIGH'
  } else if (totalPendingItems > 10 || totalUrgentItems > 2 || totalOverdueItems > 1) {
    workloadLevel = 'MODERATE'
  }

  // Calculate estimated hours to complete
  const estimatedHours = await db.task.aggregate({
    where: {
      assignedTo: userId,
      status: { in: ['PENDING', 'IN_PROGRESS'] },
    },
    _sum: {
      estimatedHours: true,
    },
  })

  // Upsert user pending summary
  await db.userPendingSummary.upsert({
    where: {
      userId_date: {
        userId,
        date,
      },
    },
    update: {
      pendingCases,
      urgentCases,
      overdueCases,
      pendingTasks,
      urgentTasks,
      overdueTasks,
      personalTasks,
      adminTasks,
      bizDevTasks,
      pendingSubtasks,
      urgentSubtasks,
      overdueSubtasks,
      upcomingHearings,
      hearingsThisWeek,
      hearingsToday,
      pendingOrders,
      ordersToExecute,
      overdueOrders,
      pendingWorklogs,
      worklogsToApprove,
      pendingLeaveRequests,
      leaveRequestsToApprove,
      pendingDocuments,
      documentsToReview,
      teamInvitations,
      pendingTeamTasks,
      totalPendingItems,
      totalUrgentItems,
      totalOverdueItems,
      highPriorityItems,
      mediumPriorityItems,
      lowPriorityItems,
      itemsDueToday,
      itemsDueThisWeek,
      itemsDueThisMonth,
      workloadLevel,
      estimatedHoursToComplete: estimatedHours._sum.estimatedHours || 0,
      lastUpdated: now,
    },
    create: {
      userId,
      date,
      pendingCases,
      urgentCases,
      overdueCases,
      pendingTasks,
      urgentTasks,
      overdueTasks,
      personalTasks,
      adminTasks,
      bizDevTasks,
      pendingSubtasks,
      urgentSubtasks,
      overdueSubtasks,
      upcomingHearings,
      hearingsThisWeek,
      hearingsToday,
      pendingOrders,
      ordersToExecute,
      overdueOrders,
      pendingWorklogs,
      worklogsToApprove,
      pendingLeaveRequests,
      leaveRequestsToApprove,
      pendingDocuments,
      documentsToReview,
      teamInvitations,
      pendingTeamTasks,
      totalPendingItems,
      totalUrgentItems,
      totalOverdueItems,
      highPriorityItems,
      mediumPriorityItems,
      lowPriorityItems,
      itemsDueToday,
      itemsDueThisWeek,
      itemsDueThisMonth,
      workloadLevel,
      estimatedHoursToComplete: estimatedHours._sum.estimatedHours || 0,
      lastUpdated: now,
    },
  })
}
