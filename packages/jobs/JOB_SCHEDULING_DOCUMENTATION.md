# Job Scheduling System Documentation

This document provides comprehensive documentation for the job scheduling system in the `packages/jobs` module. The system uses Bree for reliable job scheduling with timezone support and comprehensive error handling.

## Overview

The job scheduling system provides:
- **Automated Tasks**: Scheduled jobs for routine operations
- **Timezone Support**: All jobs run in IST (Asia/Kolkata) timezone
- **Error Handling**: Comprehensive error logging and recovery
- **Integration**: Seamless integration with Electron main process
- **Monitoring**: Job status tracking and statistics

## Job Schedule

| Job Name | Schedule | Time (IST) | Purpose |
|----------|----------|------------|---------|
| `dailySync` | Daily | 06:30 | Sync case data with external systems (eCourts) |
| `slaCheck` | Daily | 18:00 | Check SLA compliance for cases and tasks |
| `nightlyBackup` | Daily | 23:30 | Create database backup and export data |
| `userPendingRefresh` | Every 5 minutes | Continuous | Refresh user pending summaries for dashboard |

## Job Details

### Daily Sync Job (`dailySync`)

**Schedule**: 06:30 IST (Daily)
**File**: `jobs/daily-sync.js`

#### Purpose
Synchronizes case data with external systems, primarily eCourts, to ensure data consistency and up-to-date information.

#### Features
- **Case Filtering**: Only syncs OPEN and IN_PROGRESS cases
- **Confidentiality Check**: Skips confidential cases
- **Batch Processing**: Processes up to 100 cases per run
- **Rate Limiting**: Adds delays to prevent overwhelming external systems
- **Error Handling**: Continues processing even if individual cases fail
- **Audit Logging**: Creates comprehensive audit logs

#### Process Flow
1. Check if sync is enabled (desktop mode only)
2. Query cases that need syncing
3. For each case:
   - Sync with eCourts API
   - Update last sync timestamp
   - Handle errors gracefully
4. Log results and create audit entry

#### Error Handling
- Individual case failures don't stop the entire job
- Failed cases are logged with error details
- Job-level failures create critical audit logs

### SLA Check Job (`slaCheck`)

**Schedule**: 18:00 IST (Daily)
**File**: `jobs/sla-check.js`

#### Purpose
Monitors SLA compliance for cases and tasks, identifying violations and sending notifications.

#### Features
- **Case SLA Monitoring**: Checks cases against expected completion dates
- **Task SLA Monitoring**: Checks tasks against due dates
- **Violation Detection**: Identifies overdue items
- **Warning System**: Flags items approaching deadlines (3 days)
- **Notification System**: Sends alerts for violations and warnings
- **Audit Logging**: Comprehensive logging of SLA status

#### Process Flow
1. Query overdue cases and tasks
2. Query items approaching deadlines
3. Calculate violation and warning counts
4. Send notifications to assignees
5. Create audit log with detailed statistics

#### SLA Categories
- **Critical Violations**: Items past due date
- **Warnings**: Items due within 3 days
- **By Assignee**: Grouped notifications by responsible person

### Nightly Backup Job (`nightlyBackup`)

**Schedule**: 23:30 IST (Daily)
**File**: `jobs/nightly-backup.js`

#### Purpose
Creates comprehensive database backups and exports data for disaster recovery.

#### Features
- **Database Backup**: SQLite database backup using native commands
- **Data Export**: JSON exports of cases, users, and audit logs
- **Backup Package**: Creates ZIP package with all data
- **Retention Policy**: Keeps backups for 30 days
- **Size Optimization**: Compressed backup packages
- **Manifest Creation**: Backup metadata and statistics

#### Process Flow
1. Create backup directory if needed
2. Backup SQLite database
3. Export case data with relationships
4. Export user data
5. Export audit logs (last 30 days)
6. Create comprehensive backup package
7. Clean up old backups (30+ days)
8. Log results and create audit entry

#### Backup Contents
- `database.db`: Complete SQLite database backup
- `cases.json`: Case data with relationships
- `users.json`: User information
- `audit-logs.json`: System audit logs
- `manifest.json`: Backup metadata and statistics

### User Pending Refresh Job (`userPendingRefresh`)

**Schedule**: Every 5 minutes
**File**: `jobs/user-pending-refresh.js`

#### Purpose
Refreshes user pending summaries for dashboard display, providing real-time workload information.

#### Features
- **Real-time Updates**: Updates every 5 minutes
- **Comprehensive Metrics**: Tracks all pending items
- **Workload Calculation**: Determines workload levels
- **Priority Breakdown**: Categorizes by priority levels
- **Time-based Analysis**: Items due today, this week, this month
- **Efficient Queries**: Optimized database queries

#### Process Flow
1. Get all active internal users (ADMIN, LAWYER, PARALEGAL)
2. For each user, calculate:
   - Case-related pending items
   - Task-related pending items (by category)
   - Subtask pending items
   - Hearing pending items
   - Order pending items
   - Worklog pending items
   - Leave request pending items
   - Document pending items
   - Team-related pending items
3. Calculate totals and workload level
4. Upsert user pending summary

#### Workload Levels
- **LOW**: ≤10 pending items, ≤2 urgent, ≤1 overdue
- **MODERATE**: 11-15 pending items, 3 urgent, 2 overdue
- **HIGH**: 16-20 pending items, 4 urgent, 3 overdue
- **CRITICAL**: >20 pending items, >5 urgent, >3 overdue

## Scheduler Management

### Scheduler Functions

#### `bootSchedulers()`
Initializes and starts all job schedulers.

```typescript
import { bootSchedulers } from 'jobs'

await bootSchedulers()
```

**Features**:
- Configures Bree with all jobs
- Sets IST timezone for all jobs
- Passes configuration to workers
- Starts all scheduled jobs
- Comprehensive logging

#### `stopSchedulers()`
Stops all job schedulers gracefully.

```typescript
import { stopSchedulers } from 'jobs'

await stopSchedulers()
```

**Features**:
- Graceful shutdown of all jobs
- Cleans up worker processes
- Comprehensive logging

#### `getSchedulerStatus()`
Returns current scheduler status and job information.

```typescript
import { getSchedulerStatus } from 'jobs'

const status = getSchedulerStatus()
console.log(status.running) // true/false
console.log(status.jobs)    // Array of job info
```

#### `runJob(jobName: string)`
Manually runs a specific job.

```typescript
import { runJob } from 'jobs'

await runJob('dailySync')
```

#### `getJobStatistics()`
Returns job statistics and next run times.

```typescript
import { getJobStatistics } from 'jobs'

const stats = await getJobStatistics()
```

## Integration

### Electron Integration

The job schedulers are automatically started when the Electron app is ready:

```typescript
// apps/desktop/src/main.ts
import { bootSchedulers, stopSchedulers } from 'jobs'

app.whenReady().then(async () => {
  createWindow()
  
  // Start job schedulers
  try {
    await bootSchedulers()
    console.log('Job schedulers started successfully')
  } catch (error) {
    console.error('Failed to start job schedulers:', error)
  }
})

app.on('window-all-closed', async () => {
  // Stop job schedulers before quitting
  try {
    await stopSchedulers()
    console.log('Job schedulers stopped successfully')
  } catch (error) {
    console.error('Failed to stop job schedulers:', error)
  }
  
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
```

### Configuration

Jobs respect the application configuration:

```typescript
// Only run in desktop mode
if (!config.APP_MODE || config.APP_MODE !== 'desktop') {
  console.log('Job skipped - not in desktop mode')
  return
}
```

## Error Handling

### Job-Level Error Handling
Each job includes comprehensive error handling:

```typescript
try {
  // Job logic
} catch (error) {
  console.error('Job failed:', error)
  
  // Create error audit log
  await db.auditLog.create({
    data: {
      action: 'JOB_ERROR',
      entityType: 'SYSTEM',
      entityName: 'Job Name',
      severity: 'HIGH',
      description: `Job failed: ${error.message}`,
      errorMessage: error.message,
      createdAt: new Date(),
    },
  })
  
  throw error
}
```

### Scheduler-Level Error Handling
The scheduler handles job failures gracefully:

- Individual job failures don't affect other jobs
- Failed jobs are logged with detailed error information
- Scheduler continues running even if jobs fail
- Manual job execution available for recovery

## Monitoring and Logging

### Audit Logging
All jobs create comprehensive audit logs:

```typescript
await db.auditLog.create({
  data: {
    action: 'JOB_COMPLETED',
    entityType: 'SYSTEM',
    entityName: 'Job Name',
    severity: 'MEDIUM',
    description: 'Job completed successfully',
    details: JSON.stringify({
      processedItems: count,
      errors: errorCount,
      duration: 'execution time',
    }),
    createdAt: new Date(),
  },
})
```

### Console Logging
Jobs provide detailed console output:

```
[2024-01-15T06:30:00.000Z] Starting daily sync job...
Found 25 cases to sync
Synced case: CASE-2024-001
Synced case: CASE-2024-002
Daily sync completed: 25 synced, 0 errors
```

### Job Statistics
The system tracks job performance:

- Execution times
- Success/failure rates
- Items processed
- Error counts
- Next run times

## Best Practices

### Job Design
1. **Idempotent Operations**: Jobs should be safe to run multiple times
2. **Error Recovery**: Handle errors gracefully without stopping other jobs
3. **Resource Management**: Use appropriate delays and limits
4. **Audit Logging**: Log all significant operations
5. **Configuration Awareness**: Respect application settings

### Performance Considerations
1. **Batch Processing**: Process items in reasonable batches
2. **Rate Limiting**: Add delays for external API calls
3. **Database Optimization**: Use efficient queries
4. **Memory Management**: Avoid loading large datasets into memory
5. **Cleanup**: Clean up temporary files and old data

### Monitoring
1. **Regular Checks**: Monitor job execution logs
2. **Error Alerts**: Set up alerts for job failures
3. **Performance Metrics**: Track job execution times
4. **Resource Usage**: Monitor system resources during job execution
5. **Backup Verification**: Verify backup integrity

## Troubleshooting

### Common Issues

#### Jobs Not Starting
- Check if APP_MODE is set to 'desktop'
- Verify Bree configuration
- Check console logs for initialization errors

#### Job Failures
- Review audit logs for error details
- Check database connectivity
- Verify external API availability
- Review job-specific error handling

#### Performance Issues
- Monitor system resources during job execution
- Check database query performance
- Review batch sizes and delays
- Monitor external API response times

### Debugging
1. **Enable Debug Logging**: Set log level to debug
2. **Manual Execution**: Use `runJob()` to test jobs manually
3. **Audit Log Review**: Check audit logs for detailed error information
4. **Resource Monitoring**: Monitor CPU, memory, and disk usage
5. **Database Analysis**: Check database performance and locks

## Security Considerations

### Data Protection
- Jobs respect confidentiality settings
- Sensitive data is excluded from exports
- Backup files are stored securely
- Audit logs track all data access

### Access Control
- Jobs run with appropriate permissions
- External API calls use secure authentication
- File operations respect system permissions
- Database access follows security policies

This comprehensive job scheduling system provides reliable, automated operations for the legal case management application with full monitoring, error handling, and integration capabilities.
