# Electron Native Notification System Documentation

This document provides comprehensive documentation for the Electron Native Notification System, including hearing date notifications, SLA breach notifications, review requested notifications, and daily digest notifications with settings toggles.

## Overview

The Electron Native Notification System provides:
- **Native Desktop Notifications**: Using Electron's built-in notification system
- **Hearing Date Notifications**: Notify when new hearings are scheduled
- **SLA Breach Notifications**: Notify when SLA deadlines are breached
- **Review Requested Notifications**: Notify when task reviews are requested
- **Daily Digest Notifications**: Daily summary at 07:30 IST
- **Settings Toggles**: User-configurable notification preferences
- **Action Buttons**: Interactive notification actions
- **Sound Control**: Configurable notification sounds
- **Urgency Levels**: Different urgency levels for different notification types

## System Architecture

### Core Components

#### **Electron Notification Service**
- **Native Integration**: Uses Electron's Notification API
- **Configuration Management**: User-configurable notification settings
- **Type-Specific Notifications**: Specialized notifications for different events
- **Action Handling**: Interactive notification actions
- **Error Handling**: Comprehensive error handling and fallbacks

#### **Notification Types**
- **Hearing Date**: New hearing scheduled notifications
- **SLA Breach**: SLA deadline breach notifications
- **Review Requested**: Task review request notifications
- **Daily Digest**: Daily summary notifications
- **Custom Notifications**: General-purpose notifications
- **System Notifications**: System-level notifications

#### **Settings Integration**
- **Configuration Toggles**: Individual toggles for each notification type
- **Master Toggle**: Enable/disable all notifications
- **Sound Control**: Enable/disable notification sounds
- **Taskbar Integration**: Show notification badges in taskbar
- **Test Functionality**: Test notification functionality

### Data Flow

1. **Event Trigger** → Hearing scheduled, SLA breached, review requested, daily digest
2. **Service Integration** → Automation service, daily digest service, SLA evaluator
3. **Configuration Check** → Check if notification type is enabled
4. **Notification Creation** → Create notification with appropriate data
5. **Native Display** → Display using Electron's native notification system
6. **Action Handling** → Handle user interactions with notifications

## Notification Types

### Hearing Date Notifications

#### **Trigger Events**
- New hearing scheduled
- Hearing date changed
- Hearing rescheduled

#### **Notification Data**
```typescript
interface HearingNotificationData {
  caseNumber: string
  caseTitle: string
  hearingDate: Date
  courtName: string
  hearingType: string
}
```

#### **Notification Content**
- **Title**: "New Hearing Scheduled"
- **Body**: Case details, hearing type, court name, date
- **Actions**: "View Case", "Add to Calendar"
- **Urgency**: Normal
- **Timeout**: Never (requires user action)

#### **Implementation**
```typescript
electronNotificationService.showHearingDateNotification({
  caseNumber: 'CASE-2024-001',
  caseTitle: 'Sample Legal Case',
  hearingDate: new Date('2024-01-15T10:00:00'),
  courtName: 'High Court of Karnataka',
  hearingType: 'FIRST_HEARING'
})
```

### SLA Breach Notifications

#### **Trigger Events**
- SLA deadline breached
- SLA escalation triggered
- Critical SLA breach

#### **Notification Data**
```typescript
interface SLABreachNotificationData {
  entityType: string
  entityId: string
  entityName: string
  breachDate: Date
  slaRule: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}
```

#### **Notification Content**
- **Title**: "SLA Breach - [SEVERITY]"
- **Body**: Entity details, SLA rule, breach date
- **Actions**: "View Details", "Escalate"
- **Urgency**: Critical for high/critical severity
- **Timeout**: Never (requires user action)

#### **Implementation**
```typescript
electronNotificationService.showSLABreachNotification({
  entityType: 'TASK',
  entityId: 'TASK-001',
  entityName: 'Review Contract',
  breachDate: new Date('2024-01-10T09:00:00'),
  slaRule: 'Contract Review SLA',
  severity: 'high'
})
```

### Review Requested Notifications

#### **Trigger Events**
- Task review requested
- Document review needed
- Approval required

#### **Notification Data**
```typescript
interface ReviewNotificationData {
  taskId: string
  taskTitle: string
  reviewerName: string
  dueDate: Date
  priority: 'low' | 'medium' | 'high' | 'urgent'
}
```

#### **Notification Content**
- **Title**: "Review Requested"
- **Body**: Task details, reviewer, due date, priority
- **Actions**: "Review Now", "View Task"
- **Urgency**: Critical for urgent priority
- **Timeout**: Never (requires user action)

#### **Implementation**
```typescript
electronNotificationService.showReviewRequestedNotification({
  taskId: 'TASK-002',
  taskTitle: 'Draft Legal Opinion',
  reviewerName: 'John Doe',
  dueDate: new Date('2024-01-12T17:00:00'),
  priority: 'urgent'
})
```

### Daily Digest Notifications

#### **Trigger Events**
- Daily at 07:30 IST
- Manual digest request
- Scheduled digest job

#### **Notification Data**
```typescript
interface DailyDigestData {
  date: Date
  pendingTasks: number
  overdueTasks: number
  upcomingHearings: number
  slaBreaches: number
  reviewsPending: number
}
```

#### **Notification Content**
- **Title**: "Daily Digest"
- **Body**: Summary of pending items and counts
- **Actions**: "View Dashboard", "View Tasks"
- **Urgency**: Normal
- **Timeout**: Default (auto-dismiss)

#### **Implementation**
```typescript
electronNotificationService.showDailyDigestNotification({
  date: new Date(),
  pendingTasks: 5,
  overdueTasks: 2,
  upcomingHearings: 3,
  slaBreaches: 1,
  reviewsPending: 4
})
```

## Configuration Management

### Notification Configuration

```typescript
interface NotificationConfig {
  enabled: boolean              // Master toggle
  hearingDate: boolean         // Hearing date notifications
  slaBreach: boolean           // SLA breach notifications
  reviewRequested: boolean     // Review requested notifications
  dailyDigest: boolean         // Daily digest notifications
  sound: boolean              // Notification sounds
  showInTaskbar: boolean      // Taskbar badges
}
```

### Configuration Methods

#### **Update Configuration**
```typescript
electronNotificationService.updateConfig({
  enabled: true,
  hearingDate: true,
  slaBreach: false,
  reviewRequested: true,
  dailyDigest: true,
  sound: true,
  showInTaskbar: true
})
```

#### **Get Configuration**
```typescript
const config = electronNotificationService.getConfig()
console.log('Current configuration:', config)
```

#### **Check Notification Type Enabled**
```typescript
const hearingEnabled = electronNotificationService.isNotificationTypeEnabled('hearingDate')
const slaEnabled = electronNotificationService.isNotificationTypeEnabled('slaBreach')
```

## IPC Handlers

### Desktop App IPC Handlers

#### **notifications:getConfig**
```typescript
ipcMain.handle('notifications:getConfig', async (event) => {
  try {
    const { electronNotificationService } = await import('./notification-service')
    const config = electronNotificationService.getConfig()
    
    return {
      success: true,
      config,
      message: 'Notification configuration retrieved successfully'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to get notification configuration'
    }
  }
})
```

#### **notifications:updateConfig**
```typescript
ipcMain.handle('notifications:updateConfig', async (event, newConfig) => {
  try {
    const { electronNotificationService } = await import('./notification-service')
    electronNotificationService.updateConfig(newConfig)
    
    return {
      success: true,
      message: 'Notification configuration updated successfully'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to update notification configuration'
    }
  }
})
```

#### **notifications:test**
```typescript
ipcMain.handle('notifications:test', async (event) => {
  try {
    const { electronNotificationService } = await import('./notification-service')
    electronNotificationService.showTestNotification()
    
    return {
      success: true,
      message: 'Test notification sent successfully'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to send test notification'
    }
  }
})
```

#### **notifications:sendHearingDate**
```typescript
ipcMain.handle('notifications:sendHearingDate', async (event, hearingData) => {
  try {
    const { electronNotificationService } = await import('./notification-service')
    electronNotificationService.showHearingDateNotification(hearingData)
    
    return {
      success: true,
      message: 'Hearing date notification sent successfully'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to send hearing date notification'
    }
  }
})
```

## UI Components

### Notification Settings Component

#### **Settings Interface**
```typescript
export const NotificationSettings: React.FC = () => {
  const { showToast } = useToast()
  const [config, setConfig] = useState<NotificationConfig>({
    enabled: true,
    hearingDate: true,
    slaBreach: true,
    reviewRequested: true,
    dailyDigest: true,
    sound: true,
    showInTaskbar: true
  })

  const handleConfigChange = (key: keyof NotificationConfig, value: boolean) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const saveNotificationConfig = async () => {
    try {
      const result = await window.app.invoke('notifications:updateConfig', config)
      
      if (result.success) {
        showToast({
          type: 'success',
          title: 'Notification settings saved',
          message: 'Your notification preferences have been updated successfully'
        })
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error saving notification settings',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      })
    }
  }

  const testNotification = async () => {
    try {
      const result = await window.app.invoke('notifications:test')
      
      if (result.success) {
        showToast({
          type: 'success',
          title: 'Test notification sent',
          message: 'Check your desktop for the test notification'
        })
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error sending test notification',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      })
    }
  }
}
```

#### **Settings UI Features**
- **Master Toggle**: Enable/disable all notifications
- **Individual Toggles**: Enable/disable specific notification types
- **Sound Control**: Enable/disable notification sounds
- **Taskbar Integration**: Show notification badges in taskbar
- **Test Button**: Send test notification
- **Save Button**: Save configuration changes
- **Reset Button**: Reset to default settings

## Service Integration

### Automation Service Integration

#### **Hearing Date Notifications**
```typescript
// In AutomationService
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
```

#### **SLA Breach Notifications**
```typescript
// In AutomationService
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
```

### Daily Digest Service Integration

#### **Daily Digest Notifications**
```typescript
// In DailyDigestService
async sendDailyDigestNotification(userId: string, digestData: DigestData): Promise<void> {
  try {
    console.log(`📱 Sending daily digest notification for user ${userId}`)

    // Send Electron notification
    electronNotificationService.showDailyDigestNotification({
      date: digestData.date,
      pendingTasks: digestData.totalPendingItems,
      overdueTasks: digestData.totalOverdueItems,
      upcomingHearings: digestData.upcomingHearings.total,
      slaBreaches: digestData.slaBreaches.total,
      reviewsPending: digestData.reviewsPending.total
    })

    console.log('✅ Daily digest notification sent')
  } catch (error) {
    console.error('Error sending daily digest notification:', error)
    throw error
  }
}
```

#### **Daily Digest Job Integration**
```typescript
// In dailyDigest.js job
// Generate digests for all users
const digests = await dailyDigestService.generateAllUserDigests()

// Send notifications for each digest
for (const digest of digests) {
  try {
    await dailyDigestService.sendDailyDigestNotification(digest.userId, digest)
  } catch (error) {
    console.error(`Failed to send notification for user ${digest.userId}:`, error)
  }
}

console.log(`✅ Daily digest job completed - generated ${digests.length} digests and sent notifications`)
```

## Usage Examples

### Basic Notification Usage

```typescript
// Send custom notification
electronNotificationService.showCustomNotification(
  'Custom Title',
  'Custom message content',
  'normal'
)

// Send system notification
electronNotificationService.showSystemNotification(
  'System is running smoothly',
  'info'
)

// Send test notification
electronNotificationService.showTestNotification()
```

### Configuration Management

```typescript
// Update configuration
electronNotificationService.updateConfig({
  enabled: true,
  hearingDate: true,
  slaBreach: false,
  reviewRequested: true,
  dailyDigest: true,
  sound: true,
  showInTaskbar: true
})

// Get current configuration
const config = electronNotificationService.getConfig()

// Check if specific notification type is enabled
const hearingEnabled = electronNotificationService.isNotificationTypeEnabled('hearingDate')
```

### Service Integration

```typescript
// In automation service
await automationService.sendHearingDateNotification(hearingId)
await automationService.sendSLABreachNotification(slaEvaluationId)
await automationService.sendReviewRequestedNotification(taskId)

// In daily digest service
await dailyDigestService.sendDailyDigestNotification(userId, digestData)
```

### UI Integration

```typescript
// Load notification configuration
const result = await window.app.invoke('notifications:getConfig')
if (result.success) {
  setConfig(result.config)
}

// Save notification configuration
const result = await window.app.invoke('notifications:updateConfig', config)
if (result.success) {
  showToast({
    type: 'success',
    title: 'Notification settings saved',
    message: 'Your notification preferences have been updated successfully'
  })
}

// Test notification
const result = await window.app.invoke('notifications:test')
if (result.success) {
  showToast({
    type: 'success',
    title: 'Test notification sent',
    message: 'Check your desktop for the test notification'
  })
}
```

## Security Considerations

### Notification Permissions

- **System Permissions**: Electron notifications respect system notification permissions
- **User Control**: Users can disable notifications at the application level
- **Privacy**: No sensitive data exposed in notification content
- **Access Control**: Notifications respect user roles and permissions

### Data Protection

- **Minimal Data**: Only necessary data included in notifications
- **No PII**: Personally identifiable information not included in notifications
- **Secure Content**: Notification content validated and sanitized
- **Access Logging**: Notification access logged for security

## Performance Considerations

### Notification Management

- **Rate Limiting**: Prevent notification spam
- **Queue Management**: Queue notifications during high activity
- **Memory Management**: Efficient notification object management
- **Cleanup**: Automatic cleanup of old notifications

### System Integration

- **Native Performance**: Uses Electron's native notification system
- **Minimal Overhead**: Low system resource usage
- **Efficient Display**: Optimized notification rendering
- **Background Processing**: Non-blocking notification processing

## Error Handling

### Notification Errors

- **Permission Errors**: Handle notification permission issues
- **Display Errors**: Handle notification display failures
- **Configuration Errors**: Handle invalid configuration
- **Service Errors**: Handle service integration errors

### Fallback Mechanisms

- **Silent Mode**: Fallback to silent notifications
- **Logging**: Log notification failures
- **Retry Logic**: Retry failed notifications
- **User Feedback**: Inform users of notification issues

## Future Enhancements

### Planned Features

- **Rich Notifications**: Enhanced notification content with images
- **Notification History**: Track notification history
- **Custom Sounds**: User-defined notification sounds
- **Notification Scheduling**: Schedule notifications for later
- **Notification Templates**: Customizable notification templates
- **Multi-language Support**: Localized notification content

### Performance Improvements

- **Batch Notifications**: Batch multiple notifications
- **Smart Filtering**: Intelligent notification filtering
- **Priority Queuing**: Priority-based notification queuing
- **Performance Monitoring**: Notification performance metrics

This Electron Native Notification System provides a robust foundation for desktop notifications while maintaining high performance, security, and user experience standards!
