import { 
  automationService,
  automationTriggersService,
  notificationService
} from 'data'

/**
 * Automation System Test Suite
 * Tests the automation rules and notification system
 */
class AutomationSystemTester {
  
  async testAutomationSystem() {
    console.log('🤖 Testing Automation System...\n')
    
    // Test automation service
    await this.testAutomationService()
    
    // Test automation triggers
    await this.testAutomationTriggers()
    
    // Test notification service
    await this.testNotificationService()
    
    // Test automation rules
    await this.testAutomationRules()
    
    console.log('\n✅ Automation System tests completed!')
  }
  
  private async testAutomationService() {
    console.log('🔧 Testing Automation Service...')
    
    try {
      // Test initialization
      await automationService.initialize()
      console.log('  Automation Service: ✅ Initialized successfully')
      
      // Test status
      const status = await automationService.getAutomationStatus()
      console.log('  Status Check: ✅ Service running:', status.isRunning)
      console.log('    Background Processes:', status.backgroundProcesses.length)
      
      // Test notification sending
      await automationService.sendNotification({
        userId: 'test-user-id',
        title: 'Test Notification',
        message: 'This is a test notification from automation system',
        priority: 'MEDIUM',
        entityType: 'SYSTEM',
        metadata: { test: true }
      })
      console.log('  Notification Sending: ✅ Test notification sent')
      
      // Test desktop notification
      await automationService.sendDesktopNotification(
        'test-user-id',
        'Test Desktop Notification',
        'This is a test desktop notification',
        'HIGH'
      )
      console.log('  Desktop Notification: ✅ Test desktop notification sent')
      
    } catch (error) {
      console.log('  Automation Service: ❌ Error -', error)
    }
    
    console.log('')
  }
  
  private async testAutomationTriggers() {
    console.log('🎯 Testing Automation Triggers...')
    
    try {
      // Test hearing scheduled trigger
      await automationTriggersService.triggerHearingScheduled('test-hearing-id')
      console.log('  Hearing Scheduled Trigger: ✅ Triggered successfully')
      
      // Test order PDF added trigger
      await automationTriggersService.triggerOrderPdfAdded('test-order-id')
      console.log('  Order PDF Added Trigger: ✅ Triggered successfully')
      
      // Test task blocked trigger
      await automationTriggersService.triggerTaskBlocked('test-task-id')
      console.log('  Task Blocked Trigger: ✅ Triggered successfully')
      
      // Test case status changed trigger
      await automationTriggersService.triggerCaseStatusChanged('test-case-id', 'OPEN', 'CLOSED')
      console.log('  Case Status Changed Trigger: ✅ Triggered successfully')
      
      // Test task status changed trigger
      await automationTriggersService.triggerTaskStatusChanged('test-task-id', 'PENDING', 'COMPLETED')
      console.log('  Task Status Changed Trigger: ✅ Triggered successfully')
      
      // Test document uploaded trigger
      await automationTriggersService.triggerDocumentUploaded('test-document-id')
      console.log('  Document Uploaded Trigger: ✅ Triggered successfully')
      
      // Test status
      const status = await automationTriggersService.getAutomationTriggersStatus()
      console.log('  Triggers Status: ✅ All triggers active:', status.isActive)
      
    } catch (error) {
      console.log('  Automation Triggers: ❌ Error -', error)
    }
    
    console.log('')
  }
  
  private async testNotificationService() {
    console.log('📧 Testing Notification Service...')
    
    try {
      // Test sending notification
      const notification = await notificationService.sendNotification({
        userId: 'test-user-id',
        title: 'Test Notification',
        message: 'This is a test notification',
        priority: 'MEDIUM',
        entityType: 'TASK',
        entityId: 'test-task-id',
        metadata: { test: true }
      })
      console.log('  Send Notification: ✅ Notification sent (ID:', notification.id + ')')
      
      // Test sending to multiple users
      const notifications = await notificationService.sendNotificationToUsers(
        ['test-user-1', 'test-user-2'],
        {
          title: 'Bulk Test Notification',
          message: 'This is a bulk test notification',
          priority: 'HIGH'
        }
      )
      console.log('  Bulk Notification: ✅ Sent to', notifications.length, 'users')
      
      // Test sending to team
      const teamNotifications = await notificationService.sendNotificationToTeam(
        'test-team-id',
        {
          title: 'Team Test Notification',
          message: 'This is a team test notification',
          priority: 'MEDIUM'
        }
      )
      console.log('  Team Notification: ✅ Sent to team (', teamNotifications.length, 'members)')
      
      // Test desktop notification
      await notificationService.sendDesktopNotification(
        'test-user-id',
        'Test Desktop Notification',
        'This is a test desktop notification',
        'HIGH'
      )
      console.log('  Desktop Notification: ✅ Desktop notification sent')
      
      // Test email notification
      await notificationService.sendEmailNotification(
        'test-user-id',
        'Test Email Notification',
        'This is a test email notification',
        'MEDIUM'
      )
      console.log('  Email Notification: ✅ Email notification sent')
      
      // Test in-app notification
      await notificationService.sendInAppNotification(
        'test-user-id',
        'Test In-App Notification',
        'This is a test in-app notification',
        'LOW'
      )
      console.log('  In-App Notification: ✅ In-app notification sent')
      
      // Test getting user notifications
      const userNotifications = await notificationService.getUserNotifications('test-user-id', 10, 0)
      console.log('  Get User Notifications: ✅ Retrieved', userNotifications.length, 'notifications')
      
      // Test notification count
      const count = await notificationService.getNotificationCount('test-user-id')
      console.log('  Notification Count: ✅ Total:', count.total, 'Unread:', count.unread)
      
      // Test marking as read
      if (userNotifications.length > 0) {
        await notificationService.markNotificationAsRead(userNotifications[0].id)
        console.log('  Mark as Read: ✅ Notification marked as read')
      }
      
      // Test marking all as read
      await notificationService.markAllNotificationsAsRead('test-user-id')
      console.log('  Mark All as Read: ✅ All notifications marked as read')
      
    } catch (error) {
      console.log('  Notification Service: ❌ Error -', error)
    }
    
    console.log('')
  }
  
  private async testAutomationRules() {
    console.log('⚙️ Testing Automation Rules...')
    
    try {
      // Test hearing prep automation
      await automationTriggersService.triggerHearingPrepTask('test-hearing-id')
      console.log('  Hearing Prep Automation: ✅ Hearing prep task triggered')
      
      // Test order processing automation
      await automationTriggersService.triggerOrderProcessingTask('test-order-id')
      console.log('  Order Processing Automation: ✅ Order processing task triggered')
      
      // Test blocked task notification
      await automationTriggersService.triggerBlockedTaskNotification('test-task-id')
      console.log('  Blocked Task Notification: ✅ Blocked task notification triggered')
      
      // Test automation rules engine
      await automationService.testAutomationRules()
      console.log('  Automation Rules Engine: ✅ Rules engine tested')
      
    } catch (error) {
      console.log('  Automation Rules: ❌ Error -', error)
    }
    
    console.log('')
  }
  
  private async testNotificationChannels() {
    console.log('📱 Testing Notification Channels...')
    
    try {
      // Test desktop channel
      await notificationService.sendDesktopNotification(
        'test-user-id',
        'Desktop Channel Test',
        'Testing desktop notification channel',
        'MEDIUM'
      )
      console.log('  Desktop Channel: ✅ Desktop notification sent')
      
      // Test email channel
      await notificationService.sendEmailNotification(
        'test-user-id',
        'Email Channel Test',
        'Testing email notification channel',
        'HIGH'
      )
      console.log('  Email Channel: ✅ Email notification sent')
      
      // Test in-app channel
      await notificationService.sendInAppNotification(
        'test-user-id',
        'In-App Channel Test',
        'Testing in-app notification channel',
        'LOW'
      )
      console.log('  In-App Channel: ✅ In-app notification sent')
      
    } catch (error) {
      console.log('  Notification Channels: ❌ Error -', error)
    }
    
    console.log('')
  }
  
  private async testAutomationWorkflows() {
    console.log('🔄 Testing Automation Workflows...')
    
    try {
      // Test hearing workflow
      console.log('  Testing Hearing Workflow...')
      await this.testHearingWorkflow()
      
      // Test order workflow
      console.log('  Testing Order Workflow...')
      await this.testOrderWorkflow()
      
      // Test task workflow
      console.log('  Testing Task Workflow...')
      await this.testTaskWorkflow()
      
      console.log('  Automation Workflows: ✅ All workflows tested')
      
    } catch (error) {
      console.log('  Automation Workflows: ❌ Error -', error)
    }
    
    console.log('')
  }
  
  private async testHearingWorkflow() {
    try {
      // Simulate hearing scheduled
      await automationTriggersService.triggerHearingScheduled('test-hearing-id')
      
      // Simulate hearing prep task creation
      await automationTriggersService.triggerHearingPrepTask('test-hearing-id')
      
      console.log('    Hearing Workflow: ✅ Completed successfully')
      
    } catch (error) {
      console.log('    Hearing Workflow: ❌ Error -', error)
    }
  }
  
  private async testOrderWorkflow() {
    try {
      // Simulate order PDF added
      await automationTriggersService.triggerOrderPdfAdded('test-order-id')
      
      // Simulate order processing task creation
      await automationTriggersService.triggerOrderProcessingTask('test-order-id')
      
      console.log('    Order Workflow: ✅ Completed successfully')
      
    } catch (error) {
      console.log('    Order Workflow: ❌ Error -', error)
    }
  }
  
  private async testTaskWorkflow() {
    try {
      // Simulate task blocked
      await automationTriggersService.triggerTaskBlocked('test-task-id')
      
      // Simulate blocked task notification
      await automationTriggersService.triggerBlockedTaskNotification('test-task-id')
      
      console.log('    Task Workflow: ✅ Completed successfully')
      
    } catch (error) {
      console.log('    Task Workflow: ❌ Error -', error)
    }
  }
  
  private async testNotificationPreferences() {
    console.log('⚙️ Testing Notification Preferences...')
    
    try {
      // Test getting preferences
      const preferences = await notificationService.getUserNotificationPreferences('test-user-id')
      console.log('  Get Preferences: ✅ Retrieved preferences')
      console.log('    Channels:', preferences.channels.length)
      console.log('    Categories:', Object.keys(preferences.categories).length)
      console.log('    Quiet Hours:', preferences.quietHours.enabled)
      
      // Test updating preferences
      await notificationService.updateUserNotificationPreferences('test-user-id', {
        channels: [
          { type: 'DESKTOP', enabled: true },
          { type: 'EMAIL', enabled: false },
          { type: 'IN_APP', enabled: true },
          { type: 'SMS', enabled: false }
        ]
      })
      console.log('  Update Preferences: ✅ Preferences updated')
      
    } catch (error) {
      console.log('  Notification Preferences: ❌ Error -', error)
    }
    
    console.log('')
  }
  
  private async testScheduledNotifications() {
    console.log('⏰ Testing Scheduled Notifications...')
    
    try {
      // Test scheduling notification
      const scheduledNotification = await notificationService.scheduleNotification(
        {
          userId: 'test-user-id',
          title: 'Scheduled Test Notification',
          message: 'This is a scheduled test notification',
          priority: 'MEDIUM'
        },
        new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
      )
      console.log('  Schedule Notification: ✅ Notification scheduled (ID:', scheduledNotification.id + ')')
      
      // Test processing scheduled notifications
      await notificationService.processScheduledNotifications()
      console.log('  Process Scheduled: ✅ Scheduled notifications processed')
      
    } catch (error) {
      console.log('  Scheduled Notifications: ❌ Error -', error)
    }
    
    console.log('')
  }
  
  private async testBulkOperations() {
    console.log('📦 Testing Bulk Operations...')
    
    try {
      // Test bulk notifications
      const bulkNotifications = await notificationService.sendBulkNotifications([
        {
          userId: 'test-user-1',
          title: 'Bulk Test 1',
          message: 'First bulk test notification',
          priority: 'MEDIUM'
        },
        {
          userId: 'test-user-2',
          title: 'Bulk Test 2',
          message: 'Second bulk test notification',
          priority: 'HIGH'
        },
        {
          userId: 'test-user-3',
          title: 'Bulk Test 3',
          message: 'Third bulk test notification',
          priority: 'LOW'
        }
      ])
      console.log('  Bulk Notifications: ✅ Sent', bulkNotifications.length, 'bulk notifications')
      
    } catch (error) {
      console.log('  Bulk Operations: ❌ Error -', error)
    }
    
    console.log('')
  }
}

// Run the test suite
async function runAutomationSystemTests() {
  const tester = new AutomationSystemTester()
  await tester.testAutomationSystem()
}

// Export for use in other modules
export { AutomationSystemTester, runAutomationSystemTests }

// Run tests if this file is executed directly
if (require.main === module) {
  runAutomationSystemTests().catch(console.error)
}
