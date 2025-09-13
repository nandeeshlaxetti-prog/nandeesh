import { db } from './index'

export interface NotificationData {
  userId: string
  title: string
  message: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  entityType?: string
  entityId?: string
  metadata?: Record<string, any>
  scheduledAt?: Date
  expiresAt?: Date
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  entityType?: string
  entityId?: string
  metadata?: Record<string, any>
  isRead: boolean
  scheduledAt?: Date
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface NotificationChannel {
  type: 'DESKTOP' | 'EMAIL' | 'SMS' | 'IN_APP'
  enabled: boolean
  settings?: Record<string, any>
}

export interface UserNotificationPreferences {
  userId: string
  channels: NotificationChannel[]
  categories: {
    task: boolean
    hearing: boolean
    order: boolean
    case: boolean
    system: boolean
  }
  quietHours: {
    enabled: boolean
    start: string // HH:MM format
    end: string // HH:MM format
    timezone: string
  }
  frequency: 'IMMEDIATE' | 'HOURLY' | 'DAILY' | 'WEEKLY'
}

/**
 * Notification Service
 * Handles sending notifications through various channels
 */
export class NotificationService {
  
  /**
   * Send notification to user
   */
  async sendNotification(data: NotificationData): Promise<Notification> {
    try {
      console.log(`📧 Sending notification to user ${data.userId}: ${data.title}`)

      // Create notification record
      const notification = await db.notification.create({
        data: {
          userId: data.userId,
          title: data.title,
          message: data.message,
          priority: data.priority,
          entityType: data.entityType,
          entityId: data.entityId,
          metadata: data.metadata ? JSON.stringify(data.metadata) : null,
          scheduledAt: data.scheduledAt,
          expiresAt: data.expiresAt,
          isRead: false
        }
      })

      // Get user notification preferences
      const preferences = await this.getUserNotificationPreferences(data.userId)

      // Send through enabled channels
      await this.sendThroughChannels(notification, preferences)

      console.log(`✅ Notification sent successfully (ID: ${notification.id})`)

      return this.transformNotification(notification)

    } catch (error) {
      console.error('Error sending notification:', error)
      throw error
    }
  }

  /**
   * Send notification to multiple users
   */
  async sendNotificationToUsers(userIds: string[], data: Omit<NotificationData, 'userId'>): Promise<Notification[]> {
    try {
      console.log(`📧 Sending notification to ${userIds.length} users: ${data.title}`)

      const notifications: Notification[] = []

      for (const userId of userIds) {
        const notification = await this.sendNotification({
          ...data,
          userId
        })
        notifications.push(notification)
      }

      console.log(`✅ Notifications sent to ${notifications.length} users`)

      return notifications

    } catch (error) {
      console.error('Error sending notifications to users:', error)
      throw error
    }
  }

  /**
   * Send notification to team members
   */
  async sendNotificationToTeam(teamId: string, data: Omit<NotificationData, 'userId'>): Promise<Notification[]> {
    try {
      console.log(`📧 Sending notification to team ${teamId}: ${data.title}`)

      // Get team members
      const teamMembers = await db.teamMember.findMany({
        where: {
          teamId,
          isActive: true
        },
        select: {
          userId: true
        }
      })

      const userIds = teamMembers.map(member => member.userId)

      return await this.sendNotificationToUsers(userIds, data)

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
      console.log(`🖥️ Sending desktop notification to user ${userId}: ${title}`)

      // This would integrate with Electron's notification system
      // For now, we'll log the notification
      console.log(`🔔 Desktop Notification for User ${userId}:`)
      console.log(`Title: ${title}`)
      console.log(`Message: ${message}`)
      console.log(`Priority: ${priority}`)

      // In a real implementation, this would:
      // 1. Send IPC message to Electron main process
      // 2. Main process would create desktop notification
      // 3. Notification would appear on user's desktop

      // Create notification record
      await this.sendNotification({
        userId,
        title,
        message,
        priority,
        entityType: 'DESKTOP',
        metadata: {
          channel: 'DESKTOP',
          timestamp: new Date().toISOString()
        }
      })

    } catch (error) {
      console.error('Error sending desktop notification:', error)
      throw error
    }
  }

  /**
   * Send email notification
   */
  async sendEmailNotification(userId: string, title: string, message: string, priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' = 'MEDIUM'): Promise<void> {
    try {
      console.log(`📧 Sending email notification to user ${userId}: ${title}`)

      // Get user email
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { email: true, firstName: true, lastName: true }
      })

      if (!user) {
        throw new Error(`User not found: ${userId}`)
      }

      // This would integrate with an email service (e.g., SendGrid, AWS SES)
      // For now, we'll log the email
      console.log(`📧 Email Notification:`)
      console.log(`To: ${user.email} (${user.firstName} ${user.lastName})`)
      console.log(`Subject: ${title}`)
      console.log(`Body: ${message}`)
      console.log(`Priority: ${priority}`)

      // Create notification record
      await this.sendNotification({
        userId,
        title,
        message,
        priority,
        entityType: 'EMAIL',
        metadata: {
          channel: 'EMAIL',
          recipient: user.email,
          timestamp: new Date().toISOString()
        }
      })

    } catch (error) {
      console.error('Error sending email notification:', error)
      throw error
    }
  }

  /**
   * Send in-app notification
   */
  async sendInAppNotification(userId: string, title: string, message: string, priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' = 'MEDIUM'): Promise<void> {
    try {
      console.log(`📱 Sending in-app notification to user ${userId}: ${title}`)

      // Create notification record
      await this.sendNotification({
        userId,
        title,
        message,
        priority,
        entityType: 'IN_APP',
        metadata: {
          channel: 'IN_APP',
          timestamp: new Date().toISOString()
        }
      })

    } catch (error) {
      console.error('Error sending in-app notification:', error)
      throw error
    }
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(userId: string, limit: number = 50, offset: number = 0): Promise<Notification[]> {
    try {
      const notifications = await db.notification.findMany({
        where: {
          userId,
          expiresAt: {
            gte: new Date()
          }
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ],
        skip: offset,
        take: limit
      })

      return notifications.map(notification => this.transformNotification(notification))

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
      await db.notification.update({
        where: { id: notificationId },
        data: { isRead: true }
      })

      console.log(`✅ Marked notification ${notificationId} as read`)

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
      await db.notification.updateMany({
        where: {
          userId,
          isRead: false
        },
        data: { isRead: true }
      })

      console.log(`✅ Marked all notifications as read for user ${userId}`)

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
      const [total, unread] = await Promise.all([
        db.notification.count({
          where: {
            userId,
            expiresAt: {
              gte: new Date()
            }
          }
        }),
        db.notification.count({
          where: {
            userId,
            isRead: false,
            expiresAt: {
              gte: new Date()
            }
          }
        })
      ])

      return { total, unread }

    } catch (error) {
      console.error('Error getting notification count:', error)
      return { total: 0, unread: 0 }
    }
  }

  /**
   * Delete expired notifications
   */
  async deleteExpiredNotifications(): Promise<void> {
    try {
      const result = await db.notification.deleteMany({
        where: {
          expiresAt: {
            lt: new Date()
          }
        }
      })

      console.log(`🗑️ Deleted ${result.count} expired notifications`)

    } catch (error) {
      console.error('Error deleting expired notifications:', error)
      throw error
    }
  }

  /**
   * Get user notification preferences
   */
  async getUserNotificationPreferences(userId: string): Promise<UserNotificationPreferences> {
    try {
      // For now, return default preferences
      // In a real implementation, these would be stored in the database
      return {
        userId,
        channels: [
          { type: 'DESKTOP', enabled: true },
          { type: 'EMAIL', enabled: true },
          { type: 'IN_APP', enabled: true },
          { type: 'SMS', enabled: false }
        ],
        categories: {
          task: true,
          hearing: true,
          order: true,
          case: true,
          system: true
        },
        quietHours: {
          enabled: false,
          start: '22:00',
          end: '08:00',
          timezone: 'Asia/Kolkata'
        },
        frequency: 'IMMEDIATE'
      }

    } catch (error) {
      console.error('Error getting user notification preferences:', error)
      throw error
    }
  }

  /**
   * Update user notification preferences
   */
  async updateUserNotificationPreferences(userId: string, preferences: Partial<UserNotificationPreferences>): Promise<void> {
    try {
      // This would update preferences in the database
      // For now, we'll just log the update
      console.log(`📝 Updated notification preferences for user ${userId}`)

    } catch (error) {
      console.error('Error updating user notification preferences:', error)
      throw error
    }
  }

  /**
   * Send through enabled channels
   */
  private async sendThroughChannels(notification: any, preferences: UserNotificationPreferences): Promise<void> {
    const { channels, categories, quietHours } = preferences

    // Check if we're in quiet hours
    if (quietHours.enabled && this.isInQuietHours(quietHours)) {
      console.log('🔇 Skipping notification due to quiet hours')
      return
    }

    // Check if category is enabled
    if (notification.entityType && !categories[notification.entityType.toLowerCase()]) {
      console.log(`🔇 Skipping notification due to disabled category: ${notification.entityType}`)
      return
    }

    // Send through enabled channels
    for (const channel of channels) {
      if (!channel.enabled) continue

      try {
        switch (channel.type) {
          case 'DESKTOP':
            await this.sendDesktopNotification(notification.userId, notification.title, notification.message, notification.priority)
            break
          case 'EMAIL':
            await this.sendEmailNotification(notification.userId, notification.title, notification.message, notification.priority)
            break
          case 'IN_APP':
            await this.sendInAppNotification(notification.userId, notification.title, notification.message, notification.priority)
            break
          case 'SMS':
            // SMS implementation would go here
            console.log(`📱 SMS notification would be sent to user ${notification.userId}`)
            break
        }
      } catch (error) {
        console.error(`Error sending notification through ${channel.type}:`, error)
      }
    }
  }

  /**
   * Check if current time is in quiet hours
   */
  private isInQuietHours(quietHours: UserNotificationPreferences['quietHours']): boolean {
    if (!quietHours.enabled) return false

    const now = new Date()
    const currentTime = now.toLocaleTimeString('en-US', {
      hour12: false,
      timeZone: quietHours.timezone
    })

    const startTime = quietHours.start
    const endTime = quietHours.end

    // Simple time comparison (doesn't handle跨天的情况)
    return currentTime >= startTime && currentTime <= endTime
  }

  /**
   * Transform notification from database format
   */
  private transformNotification(notification: any): Notification {
    return {
      id: notification.id,
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      priority: notification.priority,
      entityType: notification.entityType,
      entityId: notification.entityId,
      metadata: notification.metadata ? JSON.parse(notification.metadata) : undefined,
      isRead: notification.isRead,
      scheduledAt: notification.scheduledAt,
      expiresAt: notification.expiresAt,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt
    }
  }

  /**
   * Send bulk notifications
   */
  async sendBulkNotifications(notifications: NotificationData[]): Promise<Notification[]> {
    try {
      console.log(`📧 Sending ${notifications.length} bulk notifications`)

      const results: Notification[] = []

      for (const notificationData of notifications) {
        const notification = await this.sendNotification(notificationData)
        results.push(notification)
      }

      console.log(`✅ Sent ${results.length} bulk notifications`)

      return results

    } catch (error) {
      console.error('Error sending bulk notifications:', error)
      throw error
    }
  }

  /**
   * Schedule notification
   */
  async scheduleNotification(data: NotificationData, scheduledAt: Date): Promise<Notification> {
    try {
      console.log(`⏰ Scheduling notification for ${scheduledAt.toISOString()}: ${data.title}`)

      const notification = await this.sendNotification({
        ...data,
        scheduledAt
      })

      console.log(`✅ Scheduled notification (ID: ${notification.id})`)

      return notification

    } catch (error) {
      console.error('Error scheduling notification:', error)
      throw error
    }
  }

  /**
   * Process scheduled notifications
   */
  async processScheduledNotifications(): Promise<void> {
    try {
      console.log('⏰ Processing scheduled notifications...')

      const now = new Date()
      const scheduledNotifications = await db.notification.findMany({
        where: {
          scheduledAt: {
            lte: now
          },
          isRead: false,
          expiresAt: {
            gte: now
          }
        }
      })

      console.log(`Found ${scheduledNotifications.length} scheduled notifications`)

      for (const notification of scheduledNotifications) {
        // Get user preferences and send through channels
        const preferences = await this.getUserNotificationPreferences(notification.userId)
        await this.sendThroughChannels(notification, preferences)
      }

      console.log(`✅ Processed ${scheduledNotifications.length} scheduled notifications`)

    } catch (error) {
      console.error('Error processing scheduled notifications:', error)
      throw error
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService()
