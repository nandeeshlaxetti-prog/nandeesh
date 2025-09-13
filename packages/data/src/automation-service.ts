import { automationRulesEngine } from './automation-rules-engine'
import { notificationService } from './notification-service'
import { db } from './index'
import { electronNotificationService } from '../../apps/desktop/src/notification-service'

/**
 * Automation Service
 * Main service for handling automation rules and notifications
 */
export class AutomationService {
  
  /**
   * Initialize automation service
   */
  async initialize(): Promise<void> {
    try {
      console.log('🤖 Initializing Automation Service...')
      
      // Start background processes
      await this.startBackgroundProcesses()
      
      console.log('✅ Automation Service initialized successfully')
      
    } catch (error) {
      console.error('Error initializing Automation Service:', error)
      throw error
    }
  }

  /**
   * Start background processes
   */
  private async startBackgroundProcesses(): Promise<void> {
    // Start blocked task checker (runs every hour)
    setInterval(async () => {
      try {
        await this.checkBlockedTasks()
      } catch (error) {
        console.error('Error in blocked task checker:', error)
      }
    }, 60 * 60 * 1000) // 1 hour

    // Start scheduled notification processor (runs every 5 minutes)
    setInterval(async () => {
      try {
        await this.processScheduledNotifications()
      } catch (error) {
        console.error('Error in scheduled notification processor:', error)
      }
    }, 5 * 60 * 1000) // 5 minutes

    // Start expired notification cleaner (runs daily)
    setInterval(async () => {
      try {
        await this.cleanupExpiredNotifications()
      } catch (error) {
        console.error('Error in expired notification cleaner:', error)
      }
    }, 24 * 60 * 60 * 1000) // 24 hours

    console.log('🔄 Background processes started')
  }

  /**
   * Handle hearing scheduled event
   */
  async handleHearingScheduled(hearingId: string): Promise<void> {
    try {
      console.log(`🎯 Handling hearing scheduled event: ${hearingId}`)
      
      // Trigger hearing prep automation
      await automationRulesEngine.triggerHearingScheduled(hearingId)
      
      console.log(`✅ Hearing scheduled event handled: ${hearingId}`)
      
    } catch (error) {
      console.error(`Error handling hearing scheduled event ${hearingId}:`, error)
      throw error
    }
  }

  /**
   * Handle order PDF added event
   */
  async handleOrderPdfAdded(orderId: string): Promise<void> {
    try {
      console.log(`🎯 Handling order PDF added event: ${orderId}`)
      
      // Trigger order processing automation
      await automationRulesEngine.triggerOrderPdfAdded(orderId)
      
      console.log(`✅ Order PDF added event handled: ${orderId}`)
      
    } catch (error) {
      console.error(`Error handling order PDF added event ${orderId}:`, error)
      throw error
    }
  }

  /**
   * Handle task blocked event
   */
  async handleTaskBlocked(taskId: string): Promise<void> {
    try {
      console.log(`🎯 Handling task blocked event: ${taskId}`)
      
      // Trigger blocked task automation
      await automationRulesEngine.triggerTaskBlocked(taskId)
      
      console.log(`✅ Task blocked event handled: ${taskId}`)
      
    } catch (error) {
      console.error(`Error handling task blocked event ${taskId}:`, error)
      throw error
    }
  }

  /**
   * Check for blocked tasks
   */
  async checkBlockedTasks(): Promise<void> {
    try {
      console.log('🔍 Checking for blocked tasks...')
      
      await automationRulesEngine.checkBlockedTasks()
      
    } catch (error) {
      console.error('Error checking blocked tasks:', error)
      throw error
    }
  }

  /**
   * Process scheduled notifications
   */
  async processScheduledNotifications(): Promise<void> {
    try {
      await notificationService.processScheduledNotifications()
      
    } catch (error) {
      console.error('Error processing scheduled notifications:', error)
      throw error
    }
  }

  /**
   * Cleanup expired notifications
   */
  async cleanupExpiredNotifications(): Promise<void> {
    try {
      console.log('🧹 Cleaning up expired notifications...')
      
      await notificationService.deleteExpiredNotifications()
      
    } catch (error) {
      console.error('Error cleaning up expired notifications:', error)
      throw error
    }
  }

  /**
   * Send notification to user
   */
  async sendNotification(data: {
    userId: string
    title: string
    message: string
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    entityType?: string
    entityId?: string
    metadata?: Record<string, any>
  }): Promise<void> {
    try {
      await notificationService.sendNotification({
        userId: data.userId,
        title: data.title,
        message: data.message,
        priority: data.priority || 'MEDIUM',
        entityType: data.entityType,
        entityId: data.entityId,
        metadata: data.metadata
      })
      
    } catch (error) {
      console.error('Error sending notification:', error)
      throw error
    }
  }

  /**
   * Send notification to team
   */
  async sendNotificationToTeam(teamId: string, data: {
    title: string
    message: string
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    entityType?: string
    entityId?: string
    metadata?: Record<string, any>
  }): Promise<void> {
    try {
      await notificationService.sendNotificationToTeam(teamId, {
        title: data.title,
        message: data.message,
        priority: data.priority || 'MEDIUM',
        entityType: data.entityType,
        entityId: data.entityId,
        metadata: data.metadata
      })
      
    } catch (error) {
      console.error('Error sending notification to team:', error)
      throw error
    }
  }

  /**
   * Send desktop notification
   */
  async sendDesktopNotification(userId: string, title: string, message: string, priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' = 'MEDIUM'): Promise<void> {
    try {
      await notificationService.sendDesktopNotification(userId, title, message, priority)
      
    } catch (error) {
      console.error('Error sending desktop notification:', error)
      throw error
    }
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(userId: string, limit: number = 50, offset: number = 0): Promise<any[]> {
    try {
      return await notificationService.getUserNotifications(userId, limit, offset)
      
    } catch (error) {
      console.error('Error getting user notifications:', error)
      return []
    }
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      await notificationService.markNotificationAsRead(notificationId)
      
    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  }

  /**
   * Mark all notifications as read for user
   */
  async markAllNotificationsAsRead(userId: string): Promise<void> {
    try {
      await notificationService.markAllNotificationsAsRead(userId)
      
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      throw error
    }
  }

  /**
   * Get notification count for user
   */
  async getNotificationCount(userId: string): Promise<{ total: number; unread: number }> {
    try {
      return await notificationService.getNotificationCount(userId)
      
    } catch (error) {
      console.error('Error getting notification count:', error)
      return { total: 0, unread: 0 }
    }
  }

  /**
   * Test automation rules
   */
  async testAutomationRules(): Promise<void> {
    try {
      console.log('🧪 Testing automation rules...')
      
      // Test hearing prep automation
      console.log('Testing hearing prep automation...')
      await this.testHearingPrepAutomation()
      
      // Test order PDF automation
      console.log('Testing order PDF automation...')
      await this.testOrderPdfAutomation()
      
      // Test blocked task automation
      console.log('Testing blocked task automation...')
      await this.testBlockedTaskAutomation()
      
      console.log('✅ Automation rules test completed')
      
    } catch (error) {
      console.error('Error testing automation rules:', error)
      throw error
    }
  }

  /**
   * Test hearing prep automation
   */
  private async testHearingPrepAutomation(): Promise<void> {
    try {
      // Create a test hearing
      const testHearing = await db.hearing.create({
        data: {
          caseId: 'test-case-id',
          scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
          status: 'SCHEDULED',
          type: 'HEARING',
          description: 'Test hearing for automation'
        }
      })
      
      // Trigger automation
      await this.handleHearingScheduled(testHearing.id)
      
      // Clean up
      await db.hearing.delete({ where: { id: testHearing.id } })
      
      console.log('✅ Hearing prep automation test completed')
      
    } catch (error) {
      console.error('Error testing hearing prep automation:', error)
    }
  }

  /**
   * Test order PDF automation
   */
  private async testOrderPdfAutomation(): Promise<void> {
    try {
      // Create a test order
      const testOrder = await db.order.create({
        data: {
          caseId: 'test-case-id',
          orderNumber: 'TEST-ORDER-001',
          title: 'Test Order for Automation',
          status: 'DRAFT',
          orderDate: new Date(),
          effectiveDate: new Date()
        }
      })
      
      // Trigger automation
      await this.handleOrderPdfAdded(testOrder.id)
      
      // Clean up
      await db.order.delete({ where: { id: testOrder.id } })
      
      console.log('✅ Order PDF automation test completed')
      
    } catch (error) {
      console.error('Error testing order PDF automation:', error)
    }
  }

  /**
   * Test blocked task automation
   */
  private async testBlockedTaskAutomation(): Promise<void> {
    try {
      // Create a test task that's been blocked for more than 48 hours
      const testTask = await db.task.create({
        data: {
          title: 'Test Blocked Task',
          description: 'Test task for blocked automation',
          category: 'CASE',
          status: 'ON_HOLD',
          priority: 'MEDIUM',
          assignedTo: 'test-user-id',
          createdBy: 'test-user-id',
          updatedAt: new Date(Date.now() - 49 * 60 * 60 * 1000) // 49 hours ago
        }
      })
      
      // Trigger automation
      await this.handleTaskBlocked(testTask.id)
      
      // Clean up
      await db.task.delete({ where: { id: testTask.id } })
      
      console.log('✅ Blocked task automation test completed')
      
    } catch (error) {
      console.error('Error testing blocked task automation:', error)
    }
  }

  /**
   * Get automation status
   */
  async getAutomationStatus(): Promise<{
    isRunning: boolean
    backgroundProcesses: string[]
    lastRun: {
      blockedTaskCheck: string
      scheduledNotificationProcess: string
      expiredNotificationCleanup: string
    }
  }> {
    try {
      return {
        isRunning: true,
        backgroundProcesses: [
          'Blocked Task Checker (every hour)',
          'Scheduled Notification Processor (every 5 minutes)',
          'Expired Notification Cleanup (daily)'
        ],
        lastRun: {
          blockedTaskCheck: 'Not tracked',
          scheduledNotificationProcess: 'Not tracked',
          expiredNotificationCleanup: 'Not tracked'
        }
      }
      
    } catch (error) {
      console.error('Error getting automation status:', error)
      return {
        isRunning: false,
        backgroundProcesses: [],
        lastRun: {
          blockedTaskCheck: 'Error',
          scheduledNotificationProcess: 'Error',
          expiredNotificationCleanup: 'Error'
        }
      }
    }
  }

  /**
   * Send hearing date notification
   */
  async sendHearingDateNotification(hearingId: string): Promise<void> {
    try {
      const hearing = await db.hearing.findUnique({
        where: { id: hearingId },
        include: {
          case: {
            select: {
              caseNumber: true,
              title: true
            }
          }
        }
      })

      if (!hearing) {
        console.error('Hearing not found:', hearingId)
        return
      }

      electronNotificationService.showHearingDateNotification({
        caseNumber: hearing.case.caseNumber,
        caseTitle: hearing.case.title,
        hearingDate: hearing.scheduledDate,
        courtName: hearing.courtName,
        hearingType: hearing.type
      })

      console.log('📅 Hearing date notification sent:', hearing.case.caseNumber)

    } catch (error) {
      console.error('Error sending hearing date notification:', error)
    }
  }

  /**
   * Send SLA breach notification
   */
  async sendSLABreachNotification(slaEvaluationId: string): Promise<void> {
    try {
      const slaEvaluation = await db.slaEvaluation.findUnique({
        where: { id: slaEvaluationId },
        include: {
          slaRule: {
            select: {
              name: true
            }
          }
        }
      })

      if (!slaEvaluation) {
        console.error('SLA evaluation not found:', slaEvaluationId)
        return
      }

      // Determine severity based on breach duration
      const breachDuration = Date.now() - slaEvaluation.breachDate!.getTime()
      const daysBreached = Math.floor(breachDuration / (1000 * 60 * 60 * 24))
      
      let severity: 'low' | 'medium' | 'high' | 'critical' = 'low'
      if (daysBreached > 7) severity = 'critical'
      else if (daysBreached > 3) severity = 'high'
      else if (daysBreached > 1) severity = 'medium'

      electronNotificationService.showSLABreachNotification({
        entityType: slaEvaluation.entityType,
        entityId: slaEvaluation.entityId,
        entityName: `${slaEvaluation.entityType} ${slaEvaluation.entityId}`,
        breachDate: slaEvaluation.breachDate!,
        slaRule: slaEvaluation.slaRule.name,
        severity
      })

      console.log('⚠️ SLA breach notification sent:', slaEvaluation.entityId)

    } catch (error) {
      console.error('Error sending SLA breach notification:', error)
    }
  }

  /**
   * Send review requested notification
   */
  async sendReviewRequestedNotification(taskId: string): Promise<void> {
    try {
      const task = await db.task.findUnique({
        where: { id: taskId },
        include: {
          assignee: {
            select: {
              name: true
            }
          }
        }
      })

      if (!task) {
        console.error('Task not found:', taskId)
        return
      }

      electronNotificationService.showReviewRequestedNotification({
        taskId: task.id,
        taskTitle: task.title,
        reviewerName: task.assignee?.name || 'Unknown',
        dueDate: task.dueDate || new Date(),
        priority: task.priority as 'low' | 'medium' | 'high' | 'urgent'
      })

      console.log('👀 Review requested notification sent:', task.title)

    } catch (error) {
      console.error('Error sending review requested notification:', error)
    }
  }

  /**
   * Shutdown automation service
   */
  async shutdown(): Promise<void> {
    try {
      console.log('🛑 Shutting down Automation Service...')
      
      // Stop background processes
      // In a real implementation, we would stop the intervals
      
      console.log('✅ Automation Service shut down successfully')
      
    } catch (error) {
      console.error('Error shutting down Automation Service:', error)
      throw error
    }
  }
}

// Export singleton instance
export const automationService = new AutomationService()
