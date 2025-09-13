import { Notification, nativeImage } from 'electron'
import * as path from 'path'

export interface NotificationConfig {
  enabled: boolean
  hearingDate: boolean
  slaBreach: boolean
  reviewRequested: boolean
  dailyDigest: boolean
  sound: boolean
  showInTaskbar: boolean
}

export interface NotificationData {
  title: string
  body: string
  icon?: string
  sound?: boolean
  urgency?: 'low' | 'normal' | 'critical'
  actions?: Array<{
    type: 'button'
    text: string
  }>
  timeoutType?: 'default' | 'never'
}

export interface HearingNotificationData {
  caseNumber: string
  caseTitle: string
  hearingDate: Date
  courtName: string
  hearingType: string
}

export interface SLABreachNotificationData {
  entityType: string
  entityId: string
  entityName: string
  breachDate: Date
  slaRule: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export interface ReviewNotificationData {
  taskId: string
  taskTitle: string
  reviewerName: string
  dueDate: Date
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

export interface DailyDigestData {
  date: Date
  pendingTasks: number
  overdueTasks: number
  upcomingHearings: number
  slaBreaches: number
  reviewsPending: number
}

/**
 * Electron Native Notification Service
 * Handles desktop notifications for various events
 */
export class ElectronNotificationService {
  private config: NotificationConfig
  private appIcon: string

  constructor(config: NotificationConfig) {
    this.config = config
    this.appIcon = this.getAppIcon()
  }

  /**
   * Get application icon for notifications
   */
  private getAppIcon(): string {
    try {
      // Try to get the app icon
      const iconPath = path.join(__dirname, '../assets/icon.png')
      return iconPath
    } catch (error) {
      console.error('Error getting app icon:', error)
      return ''
    }
  }

  /**
   * Update notification configuration
   */
  updateConfig(config: Partial<NotificationConfig>): void {
    this.config = { ...this.config, ...config }
  }

  /**
   * Check if notifications are enabled
   */
  isEnabled(): boolean {
    return this.config.enabled
  }

  /**
   * Check if specific notification type is enabled
   */
  isNotificationTypeEnabled(type: keyof Omit<NotificationConfig, 'enabled' | 'sound' | 'showInTaskbar'>): boolean {
    return this.config.enabled && this.config[type]
  }

  /**
   * Show a basic notification
   */
  showNotification(data: NotificationData): void {
    if (!this.isEnabled()) {
      console.log('Notifications are disabled')
      return
    }

    try {
      const notification = new Notification({
        title: data.title,
        body: data.body,
        icon: data.icon || this.appIcon,
        sound: data.sound !== false && this.config.sound,
        urgency: data.urgency || 'normal',
        actions: data.actions,
        timeoutType: data.timeoutType || 'default',
        silent: !this.config.sound
      })

      notification.show()

      // Handle notification events
      notification.on('click', () => {
        console.log('Notification clicked:', data.title)
        // TODO: Focus main window or open specific page
      })

      notification.on('close', () => {
        console.log('Notification closed:', data.title)
      })

      notification.on('action', (event, index) => {
        console.log('Notification action clicked:', index, data.title)
        // TODO: Handle notification actions
      })

    } catch (error) {
      console.error('Error showing notification:', error)
    }
  }

  /**
   * Show hearing date notification
   */
  showHearingDateNotification(data: HearingNotificationData): void {
    if (!this.isNotificationTypeEnabled('hearingDate')) {
      return
    }

    const title = 'New Hearing Scheduled'
    const body = `Case ${data.caseNumber}: ${data.caseTitle}\nHearing: ${data.hearingType}\nCourt: ${data.courtName}\nDate: ${data.hearingDate.toLocaleDateString()}`
    
    this.showNotification({
      title,
      body,
      urgency: 'normal',
      actions: [
        { type: 'button', text: 'View Case' },
        { type: 'button', text: 'Add to Calendar' }
      ],
      timeoutType: 'never'
    })

    console.log('📅 Hearing date notification sent:', data.caseNumber)
  }

  /**
   * Show SLA breach notification
   */
  showSLABreachNotification(data: SLABreachNotificationData): void {
    if (!this.isNotificationTypeEnabled('slaBreach')) {
      return
    }

    const title = `SLA Breach - ${data.severity.toUpperCase()}`
    const body = `${data.entityType}: ${data.entityName}\nSLA Rule: ${data.slaRule}\nBreach Date: ${data.breachDate.toLocaleDateString()}`
    
    const urgency = data.severity === 'critical' ? 'critical' : 
                   data.severity === 'high' ? 'critical' : 'normal'

    this.showNotification({
      title,
      body,
      urgency,
      actions: [
        { type: 'button', text: 'View Details' },
        { type: 'button', text: 'Escalate' }
      ],
      timeoutType: 'never'
    })

    console.log('⚠️ SLA breach notification sent:', data.entityName)
  }

  /**
   * Show review requested notification
   */
  showReviewRequestedNotification(data: ReviewNotificationData): void {
    if (!this.isNotificationTypeEnabled('reviewRequested')) {
      return
    }

    const title = 'Review Requested'
    const body = `Task: ${data.taskTitle}\nReviewer: ${data.reviewerName}\nDue: ${data.dueDate.toLocaleDateString()}\nPriority: ${data.priority.toUpperCase()}`
    
    const urgency = data.priority === 'urgent' ? 'critical' : 
                   data.priority === 'high' ? 'critical' : 'normal'

    this.showNotification({
      title,
      body,
      urgency,
      actions: [
        { type: 'button', text: 'Review Now' },
        { type: 'button', text: 'View Task' }
      ],
      timeoutType: 'never'
    })

    console.log('👀 Review requested notification sent:', data.taskTitle)
  }

  /**
   * Show daily digest notification
   */
  showDailyDigestNotification(data: DailyDigestData): void {
    if (!this.isNotificationTypeEnabled('dailyDigest')) {
      return
    }

    const title = 'Daily Digest'
    const body = `Pending Tasks: ${data.pendingTasks}\nOverdue Tasks: ${data.overdueTasks}\nUpcoming Hearings: ${data.upcomingHearings}\nSLA Breaches: ${data.slaBreaches}\nReviews Pending: ${data.reviewsPending}`
    
    this.showNotification({
      title,
      body,
      urgency: 'normal',
      actions: [
        { type: 'button', text: 'View Dashboard' },
        { type: 'button', text: 'View Tasks' }
      ],
      timeoutType: 'default'
    })

    console.log('📊 Daily digest notification sent:', data.date.toLocaleDateString())
  }

  /**
   * Show custom notification
   */
  showCustomNotification(title: string, body: string, urgency: 'low' | 'normal' | 'critical' = 'normal'): void {
    this.showNotification({
      title,
      body,
      urgency
    })
  }

  /**
   * Show system notification
   */
  showSystemNotification(message: string, type: 'info' | 'warning' | 'error' = 'info'): void {
    const title = type === 'error' ? 'System Error' : 
                 type === 'warning' ? 'System Warning' : 'System Info'
    
    const urgency = type === 'error' ? 'critical' : 
                   type === 'warning' ? 'normal' : 'low'

    this.showNotification({
      title,
      body: message,
      urgency
    })
  }

  /**
   * Test notification
   */
  showTestNotification(): void {
    this.showNotification({
      title: 'Test Notification',
      body: 'This is a test notification to verify the notification system is working correctly.',
      urgency: 'normal',
      actions: [
        { type: 'button', text: 'OK' }
      ]
    })
  }

  /**
   * Clear all notifications
   */
  clearAllNotifications(): void {
    // Note: Electron doesn't provide a direct way to clear all notifications
    // This is a placeholder for future implementation
    console.log('Clear all notifications requested')
  }

  /**
   * Get notification configuration
   */
  getConfig(): NotificationConfig {
    return { ...this.config }
  }

  /**
   * Check if system supports notifications
   */
  isSupported(): boolean {
    return Notification.isSupported()
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<boolean> {
    try {
      // Electron notifications don't require explicit permission on most platforms
      // This is a placeholder for platforms that do require permission
      return true
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }

  /**
   * Get notification statistics
   */
  getStatistics(): {
    totalNotifications: number
    notificationsByType: Record<string, number>
    lastNotification: Date | null
  } {
    // This would typically be stored in a database or persistent storage
    // For now, return mock data
    return {
      totalNotifications: 0,
      notificationsByType: {},
      lastNotification: null
    }
  }
}

// Default configuration
const defaultConfig: NotificationConfig = {
  enabled: true,
  hearingDate: true,
  slaBreach: true,
  reviewRequested: true,
  dailyDigest: true,
  sound: true,
  showInTaskbar: true
}

// Export singleton instance
export const electronNotificationService = new ElectronNotificationService(defaultConfig)
