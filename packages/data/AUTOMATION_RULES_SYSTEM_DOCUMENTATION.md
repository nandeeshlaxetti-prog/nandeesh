# Automation Rules System Documentation

This document provides comprehensive documentation for the Automation Rules System, including hearing preparation automation, order PDF processing automation, blocked task notifications, and the complete notification system.

## Overview

The Automation Rules System provides:
- **Hearing Preparation Automation**: Auto-create/update "Hearing Prep" tasks 3 days before hearings
- **Order PDF Processing Automation**: Auto-create "Summarize & circulate order" tasks 1 day after PDF added
- **Blocked Task Notifications**: Notify assignee & manager when tasks blocked > 48h
- **Comprehensive Notification System**: Desktop, email, in-app, and SMS notifications
- **Automation Rules Engine**: Flexible rule-based automation system
- **Background Processing**: Automated background tasks and monitoring

## System Architecture

### Core Components

#### **Automation Rules Engine**
- **Rule-Based Automation**: Flexible automation rules with conditions and actions
- **Trigger System**: Event-driven automation triggers
- **Condition Evaluation**: Complex condition evaluation with logical operators
- **Action Execution**: Multiple action types (CREATE_TASK, SEND_NOTIFICATION, etc.)
- **Rule Management**: Rule creation, update, and management

#### **Notification Service**
- **Multi-Channel Notifications**: Desktop, email, in-app, and SMS notifications
- **Notification Preferences**: User-configurable notification preferences
- **Scheduled Notifications**: Support for delayed and scheduled notifications
- **Bulk Notifications**: Efficient bulk notification sending
- **Notification Management**: Read/unread status, expiration, and cleanup

#### **Automation Service**
- **Service Orchestration**: Main service for coordinating automation
- **Background Processing**: Automated background tasks and monitoring
- **Event Handling**: Centralized event handling and processing
- **Status Monitoring**: Service status and health monitoring
- **Error Handling**: Robust error handling and logging

#### **Automation Triggers Service**
- **Event Triggers**: Database event-based automation triggers
- **Workflow Automation**: Complete workflow automation
- **Status Change Handling**: Automatic handling of status changes
- **Document Processing**: Automatic document processing triggers
- **Integration Points**: Integration with external systems

### Data Flow

1. **Event Occurrence** → Database event or manual trigger
2. **Trigger Processing** → Automation triggers service processes event
3. **Rule Evaluation** → Automation rules engine evaluates applicable rules
4. **Action Execution** → Rules engine executes automation actions
5. **Notification Delivery** → Notification service delivers notifications
6. **Status Update** → System status and monitoring updated

## Automation Rules

### Rule Structure

```typescript
interface AutomationRule {
  id: string
  name: string
  description: string
  trigger: AutomationTrigger
  conditions: AutomationCondition[]
  actions: AutomationAction[]
  isActive: boolean
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  createdAt: Date
  updatedAt: Date
}
```

### Trigger Types

- **HEARING_SCHEDULED**: Triggered when a hearing is scheduled
- **ORDER_PDF_ADDED**: Triggered when an order PDF is added
- **TASK_BLOCKED**: Triggered when a task is blocked
- **CASE_STATUS_CHANGED**: Triggered when case status changes
- **TASK_STATUS_CHANGED**: Triggered when task status changes

### Condition Operators

- **EQUALS**: Field equals value
- **NOT_EQUALS**: Field not equals value
- **GREATER_THAN**: Field greater than value
- **LESS_THAN**: Field less than value
- **CONTAINS**: Field contains value
- **IN**: Field in array of values
- **NOT_IN**: Field not in array of values

### Action Types

- **CREATE_TASK**: Create a new task
- **UPDATE_TASK**: Update an existing task
- **SEND_NOTIFICATION**: Send a notification
- **UPDATE_STATUS**: Update entity status
- **ASSIGN_TASK**: Assign a task to a user

## Specific Automation Rules

### 1. Hearing Preparation Automation

#### **Rule Configuration**
```typescript
{
  id: 'hearing-prep-rule',
  name: 'Hearing Preparation Task',
  description: 'Create/update hearing prep task 3 days before hearing',
  trigger: {
    type: 'HEARING_SCHEDULED',
    entityType: 'HEARING'
  },
  conditions: [
    {
      field: 'scheduledDate',
      operator: 'GREATER_THAN',
      value: new Date()
    }
  ],
  actions: [
    {
      type: 'CREATE_TASK',
      parameters: {
        title: 'Hearing Preparation',
        description: 'Prepare for upcoming hearing',
        category: 'CASE',
        priority: 'HIGH',
        dueDateOffset: -3 // 3 days before hearing
      }
    }
  ]
}
```

#### **Implementation Details**
- **Trigger**: When hearing is scheduled
- **Condition**: Hearing date is in the future
- **Action**: Create "Hearing Preparation" task
- **Due Date**: 3 days before hearing date
- **Assignee**: Assigned lawyer from the case
- **Priority**: High priority
- **Category**: Case-related task

#### **Usage Example**
```typescript
// Trigger hearing prep automation
await automationTriggersService.triggerHearingScheduled('hearing-id')

// Or trigger directly
await automationTriggersService.triggerHearingPrepTask('hearing-id')
```

### 2. Order PDF Processing Automation

#### **Rule Configuration**
```typescript
{
  id: 'order-pdf-rule',
  name: 'Order PDF Processing',
  description: 'Create task to summarize and circulate order when PDF is added',
  trigger: {
    type: 'ORDER_PDF_ADDED',
    entityType: 'ORDER'
  },
  conditions: [
    {
      field: 'documentType',
      operator: 'EQUALS',
      value: 'ORDER_PDF'
    }
  ],
  actions: [
    {
      type: 'CREATE_TASK',
      parameters: {
        title: 'Summarize & Circulate Order',
        description: 'Summarize the order and circulate to relevant parties',
        category: 'CASE',
        priority: 'MEDIUM',
        dueDateOffset: 1 // 1 day after order PDF added
      }
    }
  ]
}
```

#### **Implementation Details**
- **Trigger**: When order PDF is added
- **Condition**: Document type is ORDER_PDF
- **Action**: Create "Summarize & Circulate Order" task
- **Due Date**: 1 day after PDF added
- **Assignee**: Assigned lawyer from the case
- **Priority**: Medium priority
- **Category**: Case-related task

#### **Usage Example**
```typescript
// Trigger order PDF automation
await automationTriggersService.triggerOrderPdfAdded('order-id')

// Or trigger directly
await automationTriggersService.triggerOrderProcessingTask('order-id')
```

### 3. Blocked Task Notification Automation

#### **Rule Configuration**
```typescript
{
  id: 'blocked-task-rule',
  name: 'Blocked Task Notification',
  description: 'Notify assignee and manager when task is blocked for more than 48 hours',
  trigger: {
    type: 'TASK_BLOCKED',
    entityType: 'TASK'
  },
  conditions: [
    {
      field: 'status',
      operator: 'EQUALS',
      value: 'ON_HOLD'
    },
    {
      field: 'blockedDuration',
      operator: 'GREATER_THAN',
      value: 48, // 48 hours
      logicalOperator: 'AND'
    }
  ],
  actions: [
    {
      type: 'SEND_NOTIFICATION',
      parameters: {
        recipients: ['assignee', 'manager'],
        message: 'Task has been blocked for more than 48 hours',
        priority: 'HIGH'
      }
    }
  ]
}
```

#### **Implementation Details**
- **Trigger**: When task is blocked
- **Condition**: Task status is ON_HOLD and blocked for > 48 hours
- **Action**: Send notification to assignee and manager
- **Recipients**: Task assignee and their manager
- **Priority**: High priority
- **Message**: Custom message about blocked duration

#### **Usage Example**
```typescript
// Trigger blocked task automation
await automationTriggersService.triggerTaskBlocked('task-id')

// Or trigger directly
await automationTriggersService.triggerBlockedTaskNotification('task-id')
```

## Notification System

### Notification Channels

#### **Desktop Notifications**
- **Platform**: Electron desktop notifications
- **Content**: Rich content with titles and messages
- **Priority**: Visual priority indicators
- **Actions**: Click actions and dismiss options

#### **Email Notifications**
- **Provider**: Integration with email service (SendGrid, AWS SES)
- **Content**: HTML and text email content
- **Templates**: Customizable email templates
- **Delivery**: Reliable email delivery

#### **In-App Notifications**
- **Platform**: Web application notifications
- **Content**: Real-time in-app notifications
- **Persistence**: Stored in database
- **Management**: Read/unread status

#### **SMS Notifications**
- **Provider**: Integration with SMS service
- **Content**: Text message notifications
- **Delivery**: Reliable SMS delivery
- **Cost**: Cost-effective messaging

### Notification Preferences

#### **User Preferences**
```typescript
interface UserNotificationPreferences {
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
```

#### **Channel Configuration**
```typescript
interface NotificationChannel {
  type: 'DESKTOP' | 'EMAIL' | 'SMS' | 'IN_APP'
  enabled: boolean
  settings?: Record<string, any>
}
```

### Notification Management

#### **Sending Notifications**
```typescript
// Send to single user
await notificationService.sendNotification({
  userId: 'user-id',
  title: 'Task Notification',
  message: 'Your task has been updated',
  priority: 'MEDIUM',
  entityType: 'TASK',
  entityId: 'task-id'
})

// Send to multiple users
await notificationService.sendNotificationToUsers(['user-1', 'user-2'], {
  title: 'Team Notification',
  message: 'Important team update',
  priority: 'HIGH'
})

// Send to team
await notificationService.sendNotificationToTeam('team-id', {
  title: 'Team Notification',
  message: 'Important team update',
  priority: 'HIGH'
})
```

#### **Notification Retrieval**
```typescript
// Get user notifications
const notifications = await notificationService.getUserNotifications('user-id', 50, 0)

// Get notification count
const count = await notificationService.getNotificationCount('user-id')

// Mark as read
await notificationService.markNotificationAsRead('notification-id')

// Mark all as read
await notificationService.markAllNotificationsAsRead('user-id')
```

## Database Schema

### Notification Table

```sql
CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT DEFAULT 'MEDIUM',
  entity_type TEXT,
  entity_id TEXT,
  metadata TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  scheduled_at DATETIME,
  expires_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_priority ON notifications(priority);
CREATE INDEX idx_notifications_entity_type ON notifications(entity_type);
CREATE INDEX idx_notifications_entity_id ON notifications(entity_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_scheduled_at ON notifications(scheduled_at);
CREATE INDEX idx_notifications_expires_at ON notifications(expires_at);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

## Usage Examples

### Basic Automation Setup

```typescript
import { automationService } from 'data'

// Initialize automation service
await automationService.initialize()

// Send notification
await automationService.sendNotification({
  userId: 'user-id',
  title: 'Task Update',
  message: 'Your task has been updated',
  priority: 'MEDIUM'
})

// Send desktop notification
await automationService.sendDesktopNotification(
  'user-id',
  'Desktop Alert',
  'Important desktop notification',
  'HIGH'
)
```

### Hearing Preparation Automation

```typescript
import { automationTriggersService } from 'data'

// Trigger hearing prep automation
await automationTriggersService.triggerHearingScheduled('hearing-id')

// Or trigger directly
await automationTriggersService.triggerHearingPrepTask('hearing-id')
```

### Order PDF Processing Automation

```typescript
import { automationTriggersService } from 'data'

// Trigger order PDF automation
await automationTriggersService.triggerOrderPdfAdded('order-id')

// Or trigger directly
await automationTriggersService.triggerOrderProcessingTask('order-id')
```

### Blocked Task Notification

```typescript
import { automationTriggersService } from 'data'

// Trigger blocked task automation
await automationTriggersService.triggerTaskBlocked('task-id')

// Or trigger directly
await automationTriggersService.triggerBlockedTaskNotification('task-id')
```

### Notification Management

```typescript
import { notificationService } from 'data'

// Send notification
const notification = await notificationService.sendNotification({
  userId: 'user-id',
  title: 'Test Notification',
  message: 'This is a test notification',
  priority: 'MEDIUM'
})

// Get user notifications
const notifications = await notificationService.getUserNotifications('user-id')

// Mark as read
await notificationService.markNotificationAsRead(notification.id)

// Get notification count
const count = await notificationService.getNotificationCount('user-id')
```

### Automation Rules Engine

```typescript
import { automationRulesEngine } from 'data'

// Process automation rules
await automationRulesEngine.processAutomationRules({
  entityType: 'HEARING',
  entityId: 'hearing-id',
  entityData: hearingData,
  userId: 'user-id',
  timestamp: new Date()
})

// Check blocked tasks
await automationRulesEngine.checkBlockedTasks()
```

## Background Processing

### Automated Tasks

#### **Blocked Task Checker**
- **Frequency**: Every hour
- **Purpose**: Check for tasks blocked > 48 hours
- **Action**: Send notifications to assignee and manager

#### **Scheduled Notification Processor**
- **Frequency**: Every 5 minutes
- **Purpose**: Process scheduled notifications
- **Action**: Send notifications when scheduled time arrives

#### **Expired Notification Cleanup**
- **Frequency**: Daily
- **Purpose**: Clean up expired notifications
- **Action**: Delete expired notification records

### Service Management

```typescript
// Get automation status
const status = await automationService.getAutomationStatus()

// Test automation rules
await automationService.testAutomationRules()

// Shutdown service
await automationService.shutdown()
```

## Testing

### Test Suite

```typescript
import { AutomationSystemTester } from 'data'

// Run comprehensive tests
const tester = new AutomationSystemTester()
await tester.testAutomationSystem()
```

### Test Coverage

- **Automation Service**: Service initialization and management
- **Automation Triggers**: All trigger types and workflows
- **Notification Service**: All notification channels and management
- **Automation Rules**: Rule evaluation and execution
- **Background Processing**: Automated background tasks
- **Error Handling**: Error scenarios and recovery

## Security Considerations

### Data Security

- **Input Validation**: All inputs validated using Zod schemas
- **User Authorization**: User-specific data access control
- **Notification Privacy**: Personal notification data protection
- **Audit Logging**: All automation operations logged

### Performance Considerations

### Optimization

- **Database Indexing**: Optimized indexes for notification queries
- **Background Processing**: Non-blocking background tasks
- **Bulk Operations**: Efficient bulk notification sending
- **Caching**: Notification preference caching

## Future Enhancements

### Planned Features

- **AI-Powered Automation**: Machine learning-based automation rules
- **Advanced Workflows**: Complex multi-step automation workflows
- **Integration APIs**: External system integration for automation
- **Custom Rule Builder**: Visual rule builder interface
- **Advanced Analytics**: Automation performance analytics
- **Mobile Notifications**: Push notifications for mobile devices

### Performance Improvements

- **Real-Time Processing**: Real-time automation processing
- **Distributed Processing**: Distributed automation processing
- **Advanced Caching**: Redis-based caching for automation
- **Optimized Queries**: Query optimization for large-scale operations

This Automation Rules System provides a comprehensive solution for automating legal practice workflows while maintaining high performance and security standards. The system is designed to be extensible and can accommodate future enhancements and custom automation rules.
