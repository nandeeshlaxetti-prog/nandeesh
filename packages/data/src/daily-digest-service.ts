import { userPendingSummaryWorker } from './user-pending-summary-worker'
import { db } from './index'
// import { electronNotificationService } from '../../apps/desktop/src/notification-service'

export interface DigestData {
  userId: string
  userEmail: string
  userName: string
  date: Date
  
  // Personal tasks
  personalTasks: {
    pending: number
    urgent: number
    overdue: number
    dueToday: number
  }
  
  // Admin tasks
  adminTasks: {
    pending: number
    urgent: number
    overdue: number
    dueToday: number
  }
  
  // Case tasks
  caseTasks: {
    pending: number
    urgent: number
    overdue: number
    dueToday: number
  }
  
  // BizDev tasks
  bizDevTasks: {
    pending: number
    urgent: number
    overdue: number
    dueToday: number
  }
  
  // Upcoming hearings
  upcomingHearings: {
    today: number
    thisWeek: number
    total: number
  }
  
  // Leave requests
  leaveRequests: {
    pending: number
    toApprove: number
  }
  
  // Worklogs
  worklogs: {
    pending: number
    toApprove: number
  }
  
  // Overall summary
  totalPendingItems: number
  totalUrgentItems: number
  totalOverdueItems: number
  workloadLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'
  
  // Digest message
  digestMessage: string
  priorityMessage: string
}

/**
 * Daily Digest Service
 * Generates daily personal/admin digest for users
 */
export class DailyDigestService {
  
  /**
   * Generate digest for a specific user
   */
  async generateUserDigest(userId: string, date?: Date): Promise<DigestData | null> {
    const targetDate = date || new Date()
    
    try {
      // Get user information
      const user = await db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          isActive: true,
          status: true
        }
      })
      
      if (!user || !user.isActive || user.status !== 'ACTIVE') {
        return null
      }
      
      // Get user pending summary
      const pendingSummary = await userPendingSummaryWorker.getUserPendingSummary(userId, targetDate)
      
      if (!pendingSummary) {
        // Refresh the summary if it doesn't exist
        await userPendingSummaryWorker.refreshUserPendingSummary(userId, targetDate)
        const refreshedSummary = await userPendingSummaryWorker.getUserPendingSummary(userId, targetDate)
        if (!refreshedSummary) {
          return null
        }
      }
      
      const summary = pendingSummary || await userPendingSummaryWorker.getUserPendingSummary(userId, targetDate)
      
      // Get detailed task data
      const taskData = await this.getDetailedTaskData(userId, targetDate)
      
      // Generate digest data
      const digestData: DigestData = {
        userId: user.id,
        userEmail: user.email,
        userName: `${user.firstName} ${user.lastName}`,
        date: targetDate,
        
        // Personal tasks
        personalTasks: {
          pending: summary?.personalTasks || 0,
          urgent: taskData.personal.urgent,
          overdue: taskData.personal.overdue,
          dueToday: taskData.personal.dueToday
        },
        
        // Admin tasks
        adminTasks: {
          pending: summary?.adminTasks || 0,
          urgent: taskData.admin.urgent,
          overdue: taskData.admin.overdue,
          dueToday: taskData.admin.dueToday
        },
        
        // Case tasks
        caseTasks: {
          pending: (summary?.pendingTasks || 0) - (summary?.personalTasks || 0) - (summary?.adminTasks || 0) - (summary?.bizDevTasks || 0),
          urgent: taskData.case.urgent,
          overdue: taskData.case.overdue,
          dueToday: taskData.case.dueToday
        },
        
        // BizDev tasks
        bizDevTasks: {
          pending: summary?.bizDevTasks || 0,
          urgent: taskData.bizDev.urgent,
          overdue: taskData.bizDev.overdue,
          dueToday: taskData.bizDev.dueToday
        },
        
        // Upcoming hearings
        upcomingHearings: {
          today: summary?.hearingsToday || 0,
          thisWeek: summary?.hearingsThisWeek || 0,
          total: summary?.upcomingHearings || 0
        },
        
        // Leave requests
        leaveRequests: {
          pending: summary?.pendingLeaveRequests || 0,
          toApprove: summary?.leaveRequestsToApprove || 0
        },
        
        // Worklogs
        worklogs: {
          pending: summary?.pendingWorklogs || 0,
          toApprove: summary?.worklogsToApprove || 0
        },
        
        // Overall summary
        totalPendingItems: summary?.totalPendingItems || 0,
        totalUrgentItems: summary?.totalUrgentItems || 0,
        totalOverdueItems: summary?.totalOverdueItems || 0,
        workloadLevel: (summary?.workloadLevel as any) || 'MODERATE',
        
        // Digest messages
        digestMessage: this.generateDigestMessage(summary, taskData),
        priorityMessage: this.generatePriorityMessage(summary, taskData)
      }
      
      return digestData
      
    } catch (error) {
      console.error('Error generating user digest:', error)
      return null
    }
  }
  
  /**
   * Generate digests for all active users
   */
  async generateAllUserDigests(date?: Date): Promise<DigestData[]> {
    const targetDate = date || new Date()
    
    try {
      // Get all active users
      const activeUsers = await db.user.findMany({
        where: {
          isActive: true,
          status: 'ACTIVE'
        },
        select: {
          id: true
        }
      })
      
      console.log(`Generating digests for ${activeUsers.length} users...`)
      
      // Generate digests for all users
      const digestPromises = activeUsers.map(user => 
        this.generateUserDigest(user.id, targetDate)
      )
      
      const digests = await Promise.all(digestPromises)
      
      // Filter out null results
      const validDigests = digests.filter((digest): digest is DigestData => digest !== null)
      
      console.log(`Successfully generated ${validDigests.length} digests`)
      
      return validDigests
      
    } catch (error) {
      console.error('Error generating all user digests:', error)
      return []
    }
  }
  
  /**
   * Get detailed task data for a user
   */
  private async getDetailedTaskData(userId: string, date: Date) {
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    
    const [
      personalTasks,
      adminTasks,
      caseTasks,
      bizDevTasks
    ] = await Promise.all([
      // Personal tasks
      Promise.all([
        db.task.count({
          where: {
            assignedTo: userId,
            category: 'PERSONAL',
            status: { in: ['PENDING', 'IN_PROGRESS', 'ON_HOLD'] }
          }
        }),
        db.task.count({
          where: {
            assignedTo: userId,
            category: 'PERSONAL',
            status: { in: ['PENDING', 'IN_PROGRESS'] },
            priority: { in: ['HIGH', 'URGENT'] }
          }
        }),
        db.task.count({
          where: {
            assignedTo: userId,
            category: 'PERSONAL',
            status: { in: ['PENDING', 'IN_PROGRESS'] },
            dueDate: { lt: date }
          }
        }),
        db.task.count({
          where: {
            assignedTo: userId,
            category: 'PERSONAL',
            status: { in: ['PENDING', 'IN_PROGRESS'] },
            dueDate: { lte: today }
          }
        })
      ]),
      
      // Admin tasks
      Promise.all([
        db.task.count({
          where: {
            assignedTo: userId,
            category: 'ADMIN',
            status: { in: ['PENDING', 'IN_PROGRESS', 'ON_HOLD'] }
          }
        }),
        db.task.count({
          where: {
            assignedTo: userId,
            category: 'ADMIN',
            status: { in: ['PENDING', 'IN_PROGRESS'] },
            priority: { in: ['HIGH', 'URGENT'] }
          }
        }),
        db.task.count({
          where: {
            assignedTo: userId,
            category: 'ADMIN',
            status: { in: ['PENDING', 'IN_PROGRESS'] },
            dueDate: { lt: date }
          }
        }),
        db.task.count({
          where: {
            assignedTo: userId,
            category: 'ADMIN',
            status: { in: ['PENDING', 'IN_PROGRESS'] },
            dueDate: { lte: today }
          }
        })
      ]),
      
      // Case tasks
      Promise.all([
        db.task.count({
          where: {
            assignedTo: userId,
            category: 'CASE',
            status: { in: ['PENDING', 'IN_PROGRESS', 'ON_HOLD'] }
          }
        }),
        db.task.count({
          where: {
            assignedTo: userId,
            category: 'CASE',
            status: { in: ['PENDING', 'IN_PROGRESS'] },
            priority: { in: ['HIGH', 'URGENT'] }
          }
        }),
        db.task.count({
          where: {
            assignedTo: userId,
            category: 'CASE',
            status: { in: ['PENDING', 'IN_PROGRESS'] },
            dueDate: { lt: date }
          }
        }),
        db.task.count({
          where: {
            assignedTo: userId,
            category: 'CASE',
            status: { in: ['PENDING', 'IN_PROGRESS'] },
            dueDate: { lte: today }
          }
        })
      ]),
      
      // BizDev tasks
      Promise.all([
        db.task.count({
          where: {
            assignedTo: userId,
            category: 'BIZDEV',
            status: { in: ['PENDING', 'IN_PROGRESS', 'ON_HOLD'] }
          }
        }),
        db.task.count({
          where: {
            assignedTo: userId,
            category: 'BIZDEV',
            status: { in: ['PENDING', 'IN_PROGRESS'] },
            priority: { in: ['HIGH', 'URGENT'] }
          }
        }),
        db.task.count({
          where: {
            assignedTo: userId,
            category: 'BIZDEV',
            status: { in: ['PENDING', 'IN_PROGRESS'] },
            dueDate: { lt: date }
          }
        }),
        db.task.count({
          where: {
            assignedTo: userId,
            category: 'BIZDEV',
            status: { in: ['PENDING', 'IN_PROGRESS'] },
            dueDate: { lte: today }
          }
        })
      ])
    ])
    
    return {
      personal: {
        pending: personalTasks[0],
        urgent: personalTasks[1],
        overdue: personalTasks[2],
        dueToday: personalTasks[3]
      },
      admin: {
        pending: adminTasks[0],
        urgent: adminTasks[1],
        overdue: adminTasks[2],
        dueToday: adminTasks[3]
      },
      case: {
        pending: caseTasks[0],
        urgent: caseTasks[1],
        overdue: caseTasks[2],
        dueToday: caseTasks[3]
      },
      bizDev: {
        pending: bizDevTasks[0],
        urgent: bizDevTasks[1],
        overdue: bizDevTasks[2],
        dueToday: bizDevTasks[3]
      }
    }
  }
  
  /**
   * Generate digest message
   */
  private generateDigestMessage(summary: any, taskData: any): string {
    const messages = []
    
    // Personal tasks
    if (summary.personalTasks > 0) {
      messages.push(`${summary.personalTasks} personal task${summary.personalTasks > 1 ? 's' : ''}`)
    }
    
    // Admin tasks
    if (summary.adminTasks > 0) {
      messages.push(`${summary.adminTasks} admin task${summary.adminTasks > 1 ? 's' : ''}`)
    }
    
    // Case tasks
    const caseTasks = summary.pendingTasks - summary.personalTasks - summary.adminTasks - summary.bizDevTasks
    if (caseTasks > 0) {
      messages.push(`${caseTasks} case task${caseTasks > 1 ? 's' : ''}`)
    }
    
    // BizDev tasks
    if (summary.bizDevTasks > 0) {
      messages.push(`${summary.bizDevTasks} business development task${summary.bizDevTasks > 1 ? 's' : ''}`)
    }
    
    // Hearings
    if (summary.hearingsToday > 0) {
      messages.push(`${summary.hearingsToday} hearing${summary.hearingsToday > 1 ? 's' : ''} today`)
    }
    
    // Leave requests
    if (summary.pendingLeaveRequests > 0) {
      messages.push(`${summary.pendingLeaveRequests} pending leave request${summary.pendingLeaveRequests > 1 ? 's' : ''}`)
    }
    
    if (messages.length === 0) {
      return "You have no pending items today. Great job!"
    }
    
    return `Good morning! You have ${messages.join(', ')} pending.`
  }
  
  /**
   * Generate priority message
   */
  private generatePriorityMessage(summary: any, taskData: any): string {
    const urgentItems = []
    
    // Urgent tasks
    if (summary.urgentTasks > 0) {
      urgentItems.push(`${summary.urgentTasks} urgent task${summary.urgentTasks > 1 ? 's' : ''}`)
    }
    
    // Overdue items
    if (summary.totalOverdueItems > 0) {
      urgentItems.push(`${summary.totalOverdueItems} overdue item${summary.totalOverdueItems > 1 ? 's' : ''}`)
    }
    
    // Hearings today
    if (summary.hearingsToday > 0) {
      urgentItems.push(`${summary.hearingsToday} hearing${summary.hearingsToday > 1 ? 's' : ''} today`)
    }
    
    if (urgentItems.length === 0) {
      return "No urgent items requiring immediate attention."
    }
    
    return `Priority: ${urgentItems.join(', ')} need immediate attention.`
  }
  
  /**
   * Format digest for desktop notification
   */
  formatDigestForNotification(digest: DigestData): string {
    const lines = []
    
    lines.push(`📅 Daily Digest - ${digest.date.toLocaleDateString()}`)
    lines.push(`👋 Good morning, ${digest.userName}!`)
    lines.push('')
    
    // Personal tasks
    if (digest.personalTasks.pending > 0) {
      lines.push(`📝 Personal Tasks: ${digest.personalTasks.pending}`)
      if (digest.personalTasks.urgent > 0) {
        lines.push(`  ⚠️ ${digest.personalTasks.urgent} urgent`)
      }
      if (digest.personalTasks.overdue > 0) {
        lines.push(`  🔴 ${digest.personalTasks.overdue} overdue`)
      }
      if (digest.personalTasks.dueToday > 0) {
        lines.push(`  📅 ${digest.personalTasks.dueToday} due today`)
      }
    }
    
    // Admin tasks
    if (digest.adminTasks.pending > 0) {
      lines.push(`⚙️ Admin Tasks: ${digest.adminTasks.pending}`)
      if (digest.adminTasks.urgent > 0) {
        lines.push(`  ⚠️ ${digest.adminTasks.urgent} urgent`)
      }
      if (digest.adminTasks.overdue > 0) {
        lines.push(`  🔴 ${digest.adminTasks.overdue} overdue`)
      }
      if (digest.adminTasks.dueToday > 0) {
        lines.push(`  📅 ${digest.adminTasks.dueToday} due today`)
      }
    }
    
    // Case tasks
    if (digest.caseTasks.pending > 0) {
      lines.push(`⚖️ Case Tasks: ${digest.caseTasks.pending}`)
      if (digest.caseTasks.urgent > 0) {
        lines.push(`  ⚠️ ${digest.caseTasks.urgent} urgent`)
      }
      if (digest.caseTasks.overdue > 0) {
        lines.push(`  🔴 ${digest.caseTasks.overdue} overdue`)
      }
      if (digest.caseTasks.dueToday > 0) {
        lines.push(`  📅 ${digest.caseTasks.dueToday} due today`)
      }
    }
    
    // BizDev tasks
    if (digest.bizDevTasks.pending > 0) {
      lines.push(`💼 BizDev Tasks: ${digest.bizDevTasks.pending}`)
      if (digest.bizDevTasks.urgent > 0) {
        lines.push(`  ⚠️ ${digest.bizDevTasks.urgent} urgent`)
      }
      if (digest.bizDevTasks.overdue > 0) {
        lines.push(`  🔴 ${digest.bizDevTasks.overdue} overdue`)
      }
      if (digest.bizDevTasks.dueToday > 0) {
        lines.push(`  📅 ${digest.bizDevTasks.dueToday} due today`)
      }
    }
    
    // Hearings
    if (digest.upcomingHearings.today > 0) {
      lines.push(`🏛️ Hearings Today: ${digest.upcomingHearings.today}`)
    }
    if (digest.upcomingHearings.thisWeek > 0) {
      lines.push(`📅 Hearings This Week: ${digest.upcomingHearings.thisWeek}`)
    }
    
    // Leave requests
    if (digest.leaveRequests.pending > 0) {
      lines.push(`🏖️ Leave Requests: ${digest.leaveRequests.pending} pending`)
    }
    if (digest.leaveRequests.toApprove > 0) {
      lines.push(`✅ Leave Approvals: ${digest.leaveRequests.toApprove} to approve`)
    }
    
    // Worklogs
    if (digest.worklogs.pending > 0) {
      lines.push(`⏰ Worklogs: ${digest.worklogs.pending} pending`)
    }
    if (digest.worklogs.toApprove > 0) {
      lines.push(`✅ Worklog Approvals: ${digest.worklogs.toApprove} to approve`)
    }
    
    lines.push('')
    lines.push(`📊 Total: ${digest.totalPendingItems} pending items`)
    lines.push(`⚠️ Urgent: ${digest.totalUrgentItems} items`)
    lines.push(`🔴 Overdue: ${digest.totalOverdueItems} items`)
    lines.push(`📈 Workload: ${digest.workloadLevel}`)
    
    return lines.join('\n')
  }

  /**
   * Send daily digest notification
   */
  async sendDailyDigestNotification(userId: string, digestData: DigestData): Promise<void> {
    try {
      console.log(`📱 Sending daily digest notification for user ${userId}`)

      // Send Electron notification
      // electronNotificationService.showDailyDigestNotification({
      //   date: digestData.date,
      //   pendingTasks: digestData.totalPendingItems,
      //   overdueTasks: digestData.totalOverdueItems,
      //   upcomingHearings: digestData.upcomingHearings.total,
      //   slaBreaches: 0, // digestData.slaBreaches?.total || 0,
      //   reviewsPending: 0 // digestData.reviewsPending?.total || 0
      // })
      console.log('Daily digest notification skipped - service not available')

      console.log('✅ Daily digest notification sent')

    } catch (error) {
      console.error('Error sending daily digest notification:', error)
      throw error
    }
  }
}

// Export singleton instance
export const dailyDigestService = new DailyDigestService()
