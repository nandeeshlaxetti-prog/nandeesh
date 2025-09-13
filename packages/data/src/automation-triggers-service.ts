import { automationService } from './automation-service'
import { db } from './index'

/**
 * Automation Triggers Service
 * Handles triggering automation rules based on database events
 */
export class AutomationTriggersService {
  
  /**
   * Trigger hearing scheduled automation
   */
  async triggerHearingScheduled(hearingId: string): Promise<void> {
    try {
      console.log(`🎯 Triggering hearing scheduled automation: ${hearingId}`)
      
      await automationService.handleHearingScheduled(hearingId)
      
    } catch (error) {
      console.error(`Error triggering hearing scheduled automation:`, error)
      throw error
    }
  }

  /**
   * Trigger order PDF added automation
   */
  async triggerOrderPdfAdded(orderId: string): Promise<void> {
    try {
      console.log(`🎯 Triggering order PDF added automation: ${orderId}`)
      
      await automationService.handleOrderPdfAdded(orderId)
      
    } catch (error) {
      console.error(`Error triggering order PDF added automation:`, error)
      throw error
    }
  }

  /**
   * Trigger task blocked automation
   */
  async triggerTaskBlocked(taskId: string): Promise<void> {
    try {
      console.log(`🎯 Triggering task blocked automation: ${taskId}`)
      
      await automationService.handleTaskBlocked(taskId)
      
    } catch (error) {
      console.error(`Error triggering task blocked automation:`, error)
      throw error
    }
  }

  /**
   * Trigger case status changed automation
   */
  async triggerCaseStatusChanged(caseId: string, oldStatus: string, newStatus: string): Promise<void> {
    try {
      console.log(`🎯 Triggering case status changed automation: ${caseId} (${oldStatus} → ${newStatus})`)
      
      // Get case data
      const caseData = await db.case.findUnique({
        where: { id: caseId },
        include: {
          assignedLawyer: true,
          team: true
        }
      })

      if (!caseData) {
        throw new Error(`Case not found: ${caseId}`)
      }

      // Trigger automation based on status change
      if (newStatus === 'CLOSED' && oldStatus !== 'CLOSED') {
        // Case closed - create follow-up tasks
        await this.createCaseClosedTasks(caseData)
      } else if (newStatus === 'ON_HOLD' && oldStatus !== 'ON_HOLD') {
        // Case on hold - notify stakeholders
        await this.notifyCaseOnHold(caseData)
      }
      
    } catch (error) {
      console.error(`Error triggering case status changed automation:`, error)
      throw error
    }
  }

  /**
   * Trigger task status changed automation
   */
  async triggerTaskStatusChanged(taskId: string, oldStatus: string, newStatus: string): Promise<void> {
    try {
      console.log(`🎯 Triggering task status changed automation: ${taskId} (${oldStatus} → ${newStatus})`)
      
      // Get task data
      const taskData = await db.task.findUnique({
        where: { id: taskId },
        include: {
          assignee: true,
          creator: true,
          case: true
        }
      })

      if (!taskData) {
        throw new Error(`Task not found: ${taskId}`)
      }

      // Trigger automation based on status change
      if (newStatus === 'ON_HOLD' && oldStatus !== 'ON_HOLD') {
        // Task blocked - trigger blocked task automation
        await this.triggerTaskBlocked(taskId)
      } else if (newStatus === 'COMPLETED' && oldStatus !== 'COMPLETED') {
        // Task completed - notify stakeholders
        await this.notifyTaskCompleted(taskData)
      } else if (newStatus === 'IN_PROGRESS' && oldStatus === 'PENDING') {
        // Task started - update progress
        await this.updateTaskProgress(taskData)
      }
      
    } catch (error) {
      console.error(`Error triggering task status changed automation:`, error)
      throw error
    }
  }

  /**
   * Trigger document uploaded automation
   */
  async triggerDocumentUploaded(documentId: string): Promise<void> {
    try {
      console.log(`🎯 Triggering document uploaded automation: ${documentId}`)
      
      // Get document data
      const document = await db.document.findUnique({
        where: { id: documentId },
        include: {
          case: true,
          uploader: true
        }
      })

      if (!document) {
        throw new Error(`Document not found: ${documentId}`)
      }

      // Check if it's an order PDF
      if (document.mimeType === 'application/pdf' && document.filename.toLowerCase().includes('order')) {
        // Find associated order
        const order = await db.order.findFirst({
          where: {
            caseId: document.caseId,
            title: {
              contains: 'Order',
              mode: 'insensitive'
            }
          }
        })

        if (order) {
          await this.triggerOrderPdfAdded(order.id)
        }
      }
      
    } catch (error) {
      console.error(`Error triggering document uploaded automation:`, error)
      throw error
    }
  }

  /**
   * Create case closed tasks
   */
  private async createCaseClosedTasks(caseData: any): Promise<void> {
    try {
      console.log(`📝 Creating case closed tasks for case: ${caseData.id}`)
      
      // Create case closure task
      await automationService.sendNotification({
        userId: caseData.assignedLawyerId || 'system',
        title: 'Case Closure Tasks',
        message: `Case ${caseData.caseNumber} has been closed. Please complete closure tasks.`,
        priority: 'MEDIUM',
        entityType: 'CASE',
        entityId: caseData.id,
        metadata: {
          automation: true,
          caseStatus: 'CLOSED'
        }
      })
      
    } catch (error) {
      console.error('Error creating case closed tasks:', error)
    }
  }

  /**
   * Notify case on hold
   */
  private async notifyCaseOnHold(caseData: any): Promise<void> {
    try {
      console.log(`📧 Notifying case on hold: ${caseData.id}`)
      
      // Notify assigned lawyer
      if (caseData.assignedLawyerId) {
        await automationService.sendNotification({
          userId: caseData.assignedLawyerId,
          title: 'Case On Hold',
          message: `Case ${caseData.caseNumber} has been put on hold.`,
          priority: 'MEDIUM',
          entityType: 'CASE',
          entityId: caseData.id,
          metadata: {
            automation: true,
            caseStatus: 'ON_HOLD'
          }
        })
      }
      
      // Notify team members if case has a team
      if (caseData.teamId) {
        await automationService.sendNotificationToTeam(caseData.teamId, {
          title: 'Case On Hold',
          message: `Case ${caseData.caseNumber} has been put on hold.`,
          priority: 'MEDIUM',
          entityType: 'CASE',
          entityId: caseData.id,
          metadata: {
            automation: true,
            caseStatus: 'ON_HOLD'
          }
        })
      }
      
    } catch (error) {
      console.error('Error notifying case on hold:', error)
    }
  }

  /**
   * Notify task completed
   */
  private async notifyTaskCompleted(taskData: any): Promise<void> {
    try {
      console.log(`📧 Notifying task completed: ${taskData.id}`)
      
      // Notify task creator
      if (taskData.createdBy && taskData.createdBy !== taskData.assignedTo) {
        await automationService.sendNotification({
          userId: taskData.createdBy,
          title: 'Task Completed',
          message: `Task "${taskData.title}" has been completed by ${taskData.assignee?.firstName} ${taskData.assignee?.lastName}.`,
          priority: 'LOW',
          entityType: 'TASK',
          entityId: taskData.id,
          metadata: {
            automation: true,
            taskStatus: 'COMPLETED'
          }
        })
      }
      
      // Notify team lead if task is part of a case
      if (taskData.case?.teamId) {
        const team = await db.team.findUnique({
          where: { id: taskData.case.teamId },
          include: { lead: true }
        })
        
        if (team?.leadId && team.leadId !== taskData.assignedTo) {
          await automationService.sendNotification({
            userId: team.leadId,
            title: 'Task Completed',
            message: `Task "${taskData.title}" in case ${taskData.case.caseNumber} has been completed.`,
            priority: 'LOW',
            entityType: 'TASK',
            entityId: taskData.id,
            metadata: {
              automation: true,
              taskStatus: 'COMPLETED'
            }
          })
        }
      }
      
    } catch (error) {
      console.error('Error notifying task completed:', error)
    }
  }

  /**
   * Update task progress
   */
  private async updateTaskProgress(taskData: any): Promise<void> {
    try {
      console.log(`📊 Updating task progress: ${taskData.id}`)
      
      // Update task progress to 10% when started
      await db.task.update({
        where: { id: taskData.id },
        data: { progress: 10 }
      })
      
    } catch (error) {
      console.error('Error updating task progress:', error)
    }
  }

  /**
   * Trigger hearing prep task creation
   */
  async triggerHearingPrepTask(hearingId: string): Promise<void> {
    try {
      console.log(`📝 Triggering hearing prep task creation: ${hearingId}`)
      
      // Get hearing data
      const hearing = await db.hearing.findUnique({
        where: { id: hearingId },
        include: {
          case: {
            include: {
              assignedLawyer: true
            }
          }
        }
      })

      if (!hearing) {
        throw new Error(`Hearing not found: ${hearingId}`)
      }

      // Calculate due date (3 days before hearing)
      const hearingDate = new Date(hearing.scheduledDate)
      const dueDate = new Date(hearingDate.getTime() - (3 * 24 * 60 * 60 * 1000))

      // Create hearing prep task
      const task = await db.task.create({
        data: {
          title: 'Hearing Preparation',
          description: `Prepare for hearing scheduled on ${hearingDate.toLocaleDateString()}`,
          category: 'CASE',
          priority: 'HIGH',
          caseId: hearing.caseId,
          assignedTo: hearing.case?.assignedLawyerId,
          createdBy: 'system',
          dueDate,
          tags: JSON.stringify(['hearing', 'preparation', 'automation']),
          notes: `Auto-generated hearing prep task for hearing on ${hearingDate.toLocaleDateString()}`
        }
      })

      console.log(`✅ Created hearing prep task: ${task.id}`)
      
    } catch (error) {
      console.error('Error triggering hearing prep task:', error)
      throw error
    }
  }

  /**
   * Trigger order processing task creation
   */
  async triggerOrderProcessingTask(orderId: string): Promise<void> {
    try {
      console.log(`📝 Triggering order processing task creation: ${orderId}`)
      
      // Get order data
      const order = await db.order.findUnique({
        where: { id: orderId },
        include: {
          case: {
            include: {
              assignedLawyer: true
            }
          }
        }
      })

      if (!order) {
        throw new Error(`Order not found: ${orderId}`)
      }

      // Calculate due date (1 day after order PDF added)
      const dueDate = new Date(Date.now() + (1 * 24 * 60 * 60 * 1000))

      // Create order processing task
      const task = await db.task.create({
        data: {
          title: 'Summarize & Circulate Order',
          description: `Summarize order ${order.orderNumber} and circulate to relevant parties`,
          category: 'CASE',
          priority: 'MEDIUM',
          caseId: order.caseId,
          assignedTo: order.case?.assignedLawyerId,
          createdBy: 'system',
          dueDate,
          tags: JSON.stringify(['order', 'processing', 'automation']),
          notes: `Auto-generated order processing task for order ${order.orderNumber}`
        }
      })

      console.log(`✅ Created order processing task: ${task.id}`)
      
    } catch (error) {
      console.error('Error triggering order processing task:', error)
      throw error
    }
  }

  /**
   * Trigger blocked task notification
   */
  async triggerBlockedTaskNotification(taskId: string): Promise<void> {
    try {
      console.log(`📧 Triggering blocked task notification: ${taskId}`)
      
      // Get task data
      const task = await db.task.findUnique({
        where: { id: taskId },
        include: {
          assignee: {
            include: {
              employee: {
                include: {
                  reportingTo: true
                }
              }
            }
          },
          case: true
        }
      })

      if (!task) {
        throw new Error(`Task not found: ${taskId}`)
      }

      // Calculate blocked duration
      const blockedDuration = Math.floor((Date.now() - task.updatedAt.getTime()) / (1000 * 60 * 60))

      // Notify assignee
      if (task.assignedTo) {
        await automationService.sendNotification({
          userId: task.assignedTo,
          title: 'Task Blocked for Extended Period',
          message: `Task "${task.title}" has been blocked for ${blockedDuration} hours. Please review and take action.`,
          priority: 'HIGH',
          entityType: 'TASK',
          entityId: task.id,
          metadata: {
            automation: true,
            blockedDuration,
            taskStatus: 'ON_HOLD'
          }
        })
      }

      // Notify manager
      if (task.assignee?.employee?.reportingTo?.userId) {
        await automationService.sendNotification({
          userId: task.assignee.employee.reportingTo.userId,
          title: 'Team Member Task Blocked',
          message: `Task "${task.title}" assigned to ${task.assignee.firstName} ${task.assignee.lastName} has been blocked for ${blockedDuration} hours.`,
          priority: 'HIGH',
          entityType: 'TASK',
          entityId: task.id,
          metadata: {
            automation: true,
            blockedDuration,
            taskStatus: 'ON_HOLD',
            assigneeId: task.assignedTo
          }
        })
      }
      
    } catch (error) {
      console.error('Error triggering blocked task notification:', error)
      throw error
    }
  }

  /**
   * Get automation triggers status
   */
  async getAutomationTriggersStatus(): Promise<{
    isActive: boolean
    triggers: {
      hearingScheduled: boolean
      orderPdfAdded: boolean
      taskBlocked: boolean
      caseStatusChanged: boolean
      taskStatusChanged: boolean
      documentUploaded: boolean
    }
  }> {
    try {
      return {
        isActive: true,
        triggers: {
          hearingScheduled: true,
          orderPdfAdded: true,
          taskBlocked: true,
          caseStatusChanged: true,
          taskStatusChanged: true,
          documentUploaded: true
        }
      }
      
    } catch (error) {
      console.error('Error getting automation triggers status:', error)
      return {
        isActive: false,
        triggers: {
          hearingScheduled: false,
          orderPdfAdded: false,
          taskBlocked: false,
          caseStatusChanged: false,
          taskStatusChanged: false,
          documentUploaded: false
        }
      }
    }
  }
}

// Export singleton instance
export const automationTriggersService = new AutomationTriggersService()
