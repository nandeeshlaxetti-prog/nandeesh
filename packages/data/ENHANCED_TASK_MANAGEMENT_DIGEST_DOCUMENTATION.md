# Enhanced Task Management & Daily Digest System Documentation

This document provides comprehensive documentation for the enhanced task management system, including category enums, recurrence JSON configuration, pending tasks filtering, user pending summary refresh worker, and daily digest system with desktop notifications.

## Overview

The Enhanced Task Management & Daily Digest System provides:
- **Enhanced Task Entity**: Category enums (Case|Personal|Admin|BizDev) and recurrence JSON configuration
- **Advanced Task Filtering**: Comprehensive `listPendingForUser` with multiple filter options
- **User Pending Summary Worker**: Automated refresh of user pending summaries
- **Daily Digest Service**: Personal/admin digest generation with desktop notifications
- **Daily Digest Job Scheduler**: Automated scheduling at 07:30 IST
- **Desktop Toast Notifications**: Integrated desktop notifications for digests

## System Architecture

### Core Components

#### **Enhanced Task Entity**
- **Category Enum**: CASE, PERSONAL, ADMIN, BIZDEV
- **Recurrence JSON**: Detailed recurrence configuration
- **Advanced Filtering**: Multiple filter options for pending tasks
- **Priority Management**: Enhanced priority handling

#### **User Pending Summary Worker**
- **Automated Refresh**: Real-time pending summary updates
- **Comprehensive Data**: Cases, tasks, hearings, orders, worklogs, leave requests
- **Workload Calculation**: Automatic workload level determination
- **Performance Optimization**: Efficient database queries

#### **Daily Digest Service**
- **Personal/Admin Focus**: Targeted digest for personal and admin tasks
- **Desktop Notifications**: Toast notifications for desktop users
- **Scheduled Delivery**: Daily delivery at 07:30 IST
- **Rich Content**: Detailed task breakdowns and priorities

#### **Daily Digest Job Scheduler**
- **Cron Scheduling**: Automated scheduling using Bree
- **Timezone Support**: Asia/Kolkata timezone handling
- **Error Handling**: Robust error handling and logging
- **Status Monitoring**: Scheduler status and health monitoring

### Data Flow

1. **Task Creation** → Tasks created with category and recurrence
2. **Pending Summary Refresh** → User pending summaries updated
3. **Digest Generation** → Daily digests generated for all users
4. **Desktop Notification** → Toast notifications sent to desktop
5. **Scheduler Management** → Automated scheduling and monitoring

## Database Schema Updates

### Enhanced Task Entity

```sql
-- Task entity already has category enum
-- Added recurrence JSON field
ALTER TABLE tasks ADD COLUMN recurrence_json TEXT;

-- Indexes for performance
CREATE INDEX idx_tasks_category ON tasks(category);
CREATE INDEX idx_tasks_recurring ON tasks(is_recurring);
CREATE INDEX idx_tasks_recurrence_pattern ON tasks(recurring_pattern);
```

### User Pending Summary Entity

```sql
-- Enhanced with new fields
ALTER TABLE user_pending_summaries ADD COLUMN personal_tasks INTEGER DEFAULT 0;
ALTER TABLE user_pending_summaries ADD COLUMN admin_tasks INTEGER DEFAULT 0;
ALTER TABLE user_pending_summaries ADD COLUMN biz_dev_tasks INTEGER DEFAULT 0;
ALTER TABLE user_pending_summaries ADD COLUMN workload_level TEXT DEFAULT 'MODERATE';
ALTER TABLE user_pending_summaries ADD COLUMN estimated_hours_to_complete REAL;
```

## Enhanced Task DTOs

### Recurrence Configuration

```typescript
interface RecurrenceConfig {
  pattern: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
  interval: number // Every N days/weeks/months/years
  daysOfWeek?: number[] // 0=Sunday, 6=Saturday
  dayOfMonth?: number // For monthly/yearly
  endDate?: Date // When to stop recurring
  maxOccurrences?: number // Maximum number of occurrences
  timezone: string // Default: 'Asia/Kolkata'
}
```

### Pending Task Filters

```typescript
interface PendingTaskFilters {
  userId: string
  categories?: ('CASE' | 'PERSONAL' | 'ADMIN' | 'BIZDEV')[]
  priorities?: ('LOW' | 'MEDIUM' | 'HIGH' | 'URGENT')[]
  statuses?: ('PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD')[]
  dueDateFrom?: Date
  dueDateTo?: Date
  overdue?: boolean
  teamId?: string
  caseId?: string
  includeCompleted?: boolean
  limit?: number
  offset?: number
}
```

### Digest Data

```typescript
interface DigestData {
  userId: string
  userEmail: string
  userName: string
  date: Date
  
  // Task categories
  personalTasks: TaskSummary
  adminTasks: TaskSummary
  caseTasks: TaskSummary
  bizDevTasks: TaskSummary
  
  // Other pending items
  upcomingHearings: HearingSummary
  leaveRequests: LeaveSummary
  worklogs: WorklogSummary
  
  // Overall summary
  totalPendingItems: number
  totalUrgentItems: number
  totalOverdueItems: number
  workloadLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'
  
  // Messages
  digestMessage: string
  priorityMessage: string
}
```

## Enhanced Task Repository

### Core Methods

#### **listPendingForUser**
```typescript
async listPendingForUser(filters: PendingTaskFilters): Promise<PaginationResult<TaskWithRelations>>
```

Comprehensive pending tasks filtering with multiple options.

#### **Enhanced Task Creation**
```typescript
async create(data: TaskCreateInput): Promise<TaskWithRelations>
```

Supports category enum and recurrence JSON configuration.

### Filtering Capabilities

- **Category Filtering**: Filter by CASE, PERSONAL, ADMIN, BIZDEV
- **Priority Filtering**: Filter by LOW, MEDIUM, HIGH, URGENT
- **Status Filtering**: Filter by task status
- **Date Range Filtering**: Filter by due date ranges
- **Overdue Filtering**: Filter for overdue tasks
- **Team Filtering**: Filter by team through case relationship
- **Case Filtering**: Filter by specific case

## User Pending Summary Worker

### Core Methods

#### **refreshUserPendingSummary**
```typescript
async refreshUserPendingSummary(userId: string, date?: Date): Promise<UserPendingSummaryData>
```

Refreshes pending summary for a specific user.

#### **refreshAllUserPendingSummaries**
```typescript
async refreshAllUserPendingSummaries(date?: Date): Promise<void>
```

Refreshes pending summaries for all active users.

### Data Collection

- **Case Data**: Pending, urgent, overdue cases
- **Task Data**: Pending, urgent, overdue tasks by category
- **Subtask Data**: Pending, urgent, overdue subtasks
- **Hearing Data**: Upcoming, this week, today hearings
- **Order Data**: Pending, to execute, overdue orders
- **Worklog Data**: Pending, to approve worklogs
- **Leave Data**: Pending, to approve leave requests
- **Document Data**: Pending, to review documents
- **Team Data**: Team invitations, pending team tasks

### Workload Calculation

- **Total Items**: Sum of all pending items
- **Urgent Items**: High priority and overdue items
- **Overdue Items**: Past due date items
- **Workload Level**: LOW, MODERATE, HIGH, CRITICAL
- **Estimated Hours**: Estimated completion time

## Daily Digest Service

### Core Methods

#### **generateUserDigest**
```typescript
async generateUserDigest(userId: string, date?: Date): Promise<DigestData | null>
```

Generates digest for a specific user.

#### **generateAllUserDigests**
```typescript
async generateAllUserDigests(date?: Date): Promise<DigestData[]>
```

Generates digests for all active users.

#### **formatDigestForNotification**
```typescript
formatDigestForNotification(digest: DigestData): string
```

Formats digest for desktop notification.

### Digest Content

- **Personal Tasks**: Personal task breakdown
- **Admin Tasks**: Administrative task breakdown
- **Case Tasks**: Case-related task breakdown
- **BizDev Tasks**: Business development task breakdown
- **Hearings**: Upcoming hearings information
- **Leave Requests**: Leave request status
- **Worklogs**: Worklog status
- **Overall Summary**: Total pending, urgent, overdue items
- **Workload Level**: Current workload assessment

### Message Generation

- **Digest Message**: Friendly morning greeting with task summary
- **Priority Message**: Urgent items requiring attention
- **Notification Format**: Desktop-friendly notification format

## Daily Digest Job Scheduler

### Core Methods

#### **start**
```typescript
start(): void
```

Starts the daily digest scheduler.

#### **stop**
```typescript
stop(): void
```

Stops the daily digest scheduler.

#### **runDailyDigest**
```typescript
async runDailyDigest(): Promise<void>
```

Runs the daily digest for all users.

#### **runUserDigest**
```typescript
async runUserDigest(userId: string): Promise<void>
```

Runs digest for a specific user.

### Scheduling

- **Cron Expression**: `30 7 * * *` (07:30 IST daily)
- **Timezone**: Asia/Kolkata
- **Error Handling**: Robust error handling and logging
- **Status Monitoring**: Scheduler status and health monitoring

### Desktop Notifications

- **Toast Notifications**: Desktop toast notifications
- **Rich Content**: Detailed task breakdowns
- **Priority Highlighting**: Urgent items highlighted
- **User Personalization**: Personalized messages

## Usage Examples

### Enhanced Task Creation

```typescript
import { TaskRepository } from 'data'
import { RecurrenceConfig } from 'core'

const taskRepo = new TaskRepository()

// Create recurring weekly task
const recurrenceConfig: RecurrenceConfig = {
  pattern: 'WEEKLY',
  interval: 1,
  daysOfWeek: [1, 3, 5], // Monday, Wednesday, Friday
  timezone: 'Asia/Kolkata'
}

const task = await taskRepo.create({
  title: 'Weekly Team Meeting',
  description: 'Regular team sync meeting',
  category: 'ADMIN',
  priority: 'MEDIUM',
  assignedTo: 'user-123',
  createdBy: 'user-123',
  isRecurring: true,
  recurringPattern: 'WEEKLY',
  recurrenceJSON: JSON.stringify(recurrenceConfig),
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
})

// Create personal task
const personalTask = await taskRepo.create({
  title: 'Update LinkedIn Profile',
  description: 'Update professional profile',
  category: 'PERSONAL',
  priority: 'LOW',
  assignedTo: 'user-123',
  createdBy: 'user-123',
  dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
})
```

### Pending Tasks Filtering

```typescript
// Get personal tasks only
const personalTasks = await taskRepo.listPendingForUser({
  userId: 'user-123',
  categories: ['PERSONAL'],
  limit: 10,
  offset: 0
})

// Get high priority tasks
const urgentTasks = await taskRepo.listPendingForUser({
  userId: 'user-123',
  priorities: ['HIGH', 'URGENT'],
  limit: 10,
  offset: 0
})

// Get overdue tasks
const overdueTasks = await taskRepo.listPendingForUser({
  userId: 'user-123',
  overdue: true,
  limit: 10,
  offset: 0
})

// Get tasks due this week
const thisWeekTasks = await taskRepo.listPendingForUser({
  userId: 'user-123',
  dueDateFrom: new Date(),
  dueDateTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  limit: 10,
  offset: 0
})
```

### User Pending Summary Management

```typescript
import { userPendingSummaryWorker } from 'data'

// Refresh summary for specific user
const summary = await userPendingSummaryWorker.refreshUserPendingSummary('user-123')

console.log('User Summary:', {
  totalPending: summary.totalPendingItems,
  urgentItems: summary.totalUrgentItems,
  overdueItems: summary.totalOverdueItems,
  personalTasks: summary.personalTasks,
  adminTasks: summary.adminTasks,
  workloadLevel: summary.workloadLevel
})

// Refresh summaries for all users
await userPendingSummaryWorker.refreshAllUserPendingSummaries()

// Get existing summary
const existingSummary = await userPendingSummaryWorker.getUserPendingSummary('user-123')
```

### Daily Digest Generation

```typescript
import { dailyDigestService } from 'data'

// Generate digest for specific user
const digest = await dailyDigestService.generateUserDigest('user-123')

if (digest) {
  console.log('Digest for', digest.userName)
  console.log('Personal Tasks:', digest.personalTasks.pending)
  console.log('Admin Tasks:', digest.adminTasks.pending)
  console.log('Case Tasks:', digest.caseTasks.pending)
  console.log('BizDev Tasks:', digest.bizDevTasks.pending)
  console.log('Total Pending:', digest.totalPendingItems)
  console.log('Workload Level:', digest.workloadLevel)
  console.log('Digest Message:', digest.digestMessage)
  console.log('Priority Message:', digest.priorityMessage)
  
  // Format for desktop notification
  const notificationMessage = dailyDigestService.formatDigestForNotification(digest)
  console.log('Notification Message:', notificationMessage)
}

// Generate digests for all users
const allDigests = await dailyDigestService.generateAllUserDigests()
console.log(`Generated ${allDigests.length} digests`)
```

### Daily Digest Job Scheduler

```typescript
import { dailyDigestJobScheduler } from 'data'

// Start the scheduler
dailyDigestJobScheduler.start()

// Check scheduler status
const status = dailyDigestJobScheduler.getStatus()
console.log('Scheduler running:', status.isRunning)
console.log('Next run:', status.nextRun)

// Run digest for specific user
await dailyDigestJobScheduler.runUserDigest('user-123')

// Test the digest system
await dailyDigestJobScheduler.testDigest()

// Stop the scheduler
dailyDigestJobScheduler.stop()
```

## Job Scheduling Integration

### Bree Job Configuration

```typescript
// In packages/jobs/src/scheduler.ts
{
  name: 'dailyDigest',
  cron: '30 7 * * *', // 07:30 IST
  timezone: 'Asia/Kolkata',
}
```

### Job Worker

```javascript
// In packages/jobs/src/jobs/dailyDigest.js
import { dailyDigestService } from 'data'

async function runDailyDigestJob() {
  try {
    console.log('🕰️ Starting daily digest job at 07:30 IST...')
    
    const digests = await dailyDigestService.generateAllUserDigests()
    
    console.log(`✅ Daily digest job completed - generated ${digests.length} digests`)
    
    // Send desktop notifications
    for (const digest of digests) {
      await sendDesktopNotification(digest)
    }
    
  } catch (error) {
    console.error('❌ Daily digest job failed:', error)
  }
}
```

## Testing

### Test Suite

```typescript
import { PendingTasksTester, runPendingTasksTests } from 'data'

// Run comprehensive tests
await runPendingTasksTests()

// Run specific tests
const tester = new PendingTasksTester()
await tester.testPendingTasksFunctionality()
```

### Test Coverage

- **Enhanced Task Repository**: Task creation with categories and recurrence
- **Pending Tasks Filtering**: All filter combinations
- **User Pending Summary Worker**: Summary refresh and retrieval
- **Daily Digest Service**: Digest generation and formatting
- **Daily Digest Job Scheduler**: Scheduler management and testing
- **Recurrence Configuration**: All recurrence patterns

## Security Considerations

### Data Security

- **Input Validation**: All inputs validated using Zod schemas
- **User Authorization**: User-specific data access control
- **Data Privacy**: Personal task data protection
- **Audit Logging**: All digest operations logged

### Performance Considerations

### Optimization

- **Database Indexing**: Optimized indexes for task queries
- **Caching**: Pending summary caching for performance
- **Batch Processing**: Batch digest generation
- **Background Processing**: Non-blocking digest generation

## Future Enhancements

### Planned Features

- **AI-Powered Task Prioritization**: Machine learning-based task prioritization
- **Smart Recurrence**: Intelligent recurrence pattern suggestions
- **Advanced Analytics**: Task completion analytics and reporting
- **Mobile Notifications**: Push notifications for mobile devices
- **Integration APIs**: External system integration for task data
- **Custom Digest Templates**: User-customizable digest templates

### Performance Improvements

- **Real-Time Updates**: Real-time pending summary updates
- **Distributed Processing**: Distributed digest generation
- **Advanced Caching**: Redis-based caching for digests
- **Optimized Queries**: Query optimization for large-scale operations

This Enhanced Task Management & Daily Digest System provides a comprehensive solution for task management, pending item tracking, and daily digest delivery while maintaining high performance and security standards.
