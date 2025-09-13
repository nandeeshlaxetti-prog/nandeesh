# Repository Classes Documentation

This document provides comprehensive documentation for all repository classes in the `packages/data` module. The repositories provide a clean abstraction layer over Prisma with advanced filtering, pagination, and business logic support.

## Overview

The repository pattern provides:
- **Clean Data Access**: Abstracted database operations
- **Advanced Filtering**: Comprehensive filter options for each entity
- **Pagination Support**: Built-in pagination with metadata
- **Business Logic**: Domain-specific methods and operations
- **Type Safety**: Full TypeScript support with proper typing
- **Relationship Loading**: Automatic loading of related entities

## Repository Structure

### Base Repository

All repositories extend from `BaseRepositoryImpl` which provides:

```typescript
interface BaseRepository<T, CreateInput, UpdateInput, FilterOptions> {
  create(data: CreateInput): Promise<T>
  findById(id: string): Promise<T | null>
  findMany(filters?: FilterOptions, pagination?: PaginationOptions): Promise<PaginationResult<T>>
  update(id: string, data: UpdateInput): Promise<T>
  delete(id: string): Promise<void>
  count(filters?: FilterOptions): Promise<number>
}
```

### Pagination Support

```typescript
interface PaginationOptions {
  page?: number
  limit?: number
  offset?: number
}

interface PaginationResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}
```

## Repository Classes

### Case Repository

**File**: `repositories/case.ts`

**Purpose**: Manages case entities with comprehensive filtering and relationship loading.

#### Key Features
- **Advanced Filtering**: Search, status, priority, type, client, lawyer, team, court, tags, date ranges
- **Relationship Loading**: Client, assigned lawyer, team, and counts
- **Business Methods**: Statistics, case number lookup, team/lawyer filtering
- **Financial Tracking**: Case value filtering and currency support

#### Filter Options
```typescript
interface CaseFilterOptions {
  search?: string                    // Search in case number, title, description, court
  status?: string                    // OPEN, IN_PROGRESS, CLOSED, ARCHIVED, SUSPENDED
  priority?: string                  // LOW, MEDIUM, HIGH, URGENT
  type?: string                      // CIVIL, CRIMINAL, FAMILY, CORPORATE, etc.
  clientId?: string                  // Filter by client
  assignedLawyerId?: string          // Filter by assigned lawyer
  teamId?: string                    // Filter by team
  courtName?: string                 // Filter by court name
  tags?: string[]                    // Filter by tags
  isConfidential?: boolean           // Confidential cases only
  filingDateFrom?: Date              // Filing date range
  filingDateTo?: Date
  expectedCompletionDateFrom?: Date  // Expected completion range
  expectedCompletionDateTo?: Date
  caseValueMin?: number              // Case value range
  caseValueMax?: number
  createdFrom?: Date                 // Creation date range
  createdTo?: Date
}
```

#### Usage Examples
```typescript
import { CaseRepository } from 'data'

const caseRepo = new CaseRepository(prisma)

// Find cases by lawyer with pagination
const lawyerCases = await caseRepo.findByLawyer('lawyer-id', {
  page: 1,
  limit: 20
})

// Search cases with filters
const searchResults = await caseRepo.findMany({
  search: 'contract',
  status: 'OPEN',
  priority: 'HIGH',
  teamId: 'team-id'
}, { page: 1, limit: 10 })

// Get case statistics
const stats = await caseRepo.getCaseStatistics({
  assignedLawyerId: 'lawyer-id'
})
```

### Hearing Repository

**File**: `repositories/hearing.ts`

**Purpose**: Manages court hearings with scheduling and case relationship support.

#### Key Features
- **Scheduling Support**: Date/time filtering, upcoming hearings, overdue tracking
- **Court Management**: Court name, judge, courtroom filtering
- **Attendee Tracking**: User ID arrays for attendees
- **Calendar Integration**: Calendar view generation
- **Case Relationships**: Full case information loading

#### Filter Options
```typescript
interface HearingFilterOptions {
  search?: string                    // Search in hearing number, description, agenda, court, judge
  caseId?: string                    // Filter by case
  type?: string                      // FIRST_HEARING, ARGUMENTS, EVIDENCE, etc.
  status?: string                    // SCHEDULED, IN_PROGRESS, COMPLETED, etc.
  courtName?: string                 // Filter by court
  judgeName?: string                 // Filter by judge
  scheduledDateFrom?: Date           // Scheduled date range
  scheduledDateTo?: Date
  nextHearingDateFrom?: Date         // Next hearing date range
  nextHearingDateTo?: Date
  isConfidential?: boolean           // Confidential hearings
  attendeeId?: string                // Filter by attendee
  createdFrom?: Date                 // Creation date range
  createdTo?: Date
}
```

#### Usage Examples
```typescript
import { HearingRepository } from 'data'

const hearingRepo = new HearingRepository(prisma)

// Find upcoming hearings
const upcoming = await hearingRepo.findUpcoming(7) // Next 7 days

// Find overdue hearings
const overdue = await hearingRepo.findOverdue()

// Get hearing calendar
const calendar = await hearingRepo.getHearingCalendar(
  new Date('2024-01-01'),
  new Date('2024-01-31')
)

// Find hearings by case
const caseHearings = await hearingRepo.findByCase('case-id')
```

### Order Repository

**File**: `repositories/order.ts`

**Purpose**: Manages court orders with approval workflow and execution tracking.

#### Key Features
- **Approval Workflow**: Draft → Pending → Approved → Executed
- **Execution Tracking**: Execution notes, executor tracking
- **Court Information**: Court name, judge, order dates
- **Business Methods**: Approval/rejection, execution, expiring orders
- **Priority Management**: Order priority and urgency handling

#### Filter Options
```typescript
interface OrderFilterOptions {
  search?: string                    // Search in order number, title, description, content, court, judge
  caseId?: string                    // Filter by case
  type?: string                      // INTERIM_ORDER, FINAL_ORDER, EXECUTION_ORDER, etc.
  status?: string                    // DRAFT, PENDING, APPROVED, REJECTED, EXECUTED, CANCELLED
  priority?: string                  // LOW, MEDIUM, HIGH, URGENT
  courtName?: string                 // Filter by court
  judgeName?: string                 // Filter by judge
  createdBy?: string                 // Filter by creator
  approvedBy?: string                // Filter by approver
  executedBy?: string                // Filter by executor
  orderDateFrom?: Date               // Order date range
  orderDateTo?: Date
  effectiveDateFrom?: Date            // Effective date range
  effectiveDateTo?: Date
  isConfidential?: boolean           // Confidential orders
  tags?: string[]                    // Filter by tags
  createdFrom?: Date                 // Creation date range
  createdTo?: Date
}
```

#### Usage Examples
```typescript
import { OrderRepository } from 'data'

const orderRepo = new OrderRepository(prisma)

// Approve an order
const approvedOrder = await orderRepo.approveOrder('order-id', 'approver-id', 'Approved notes')

// Find orders expiring soon
const expiring = await orderRepo.findExpiringSoon(7) // Next 7 days

// Find pending orders
const pending = await orderRepo.findPendingApproval()

// Execute an order
const executed = await orderRepo.executeOrder('order-id', 'executor-id', 'Execution notes')
```

### Task Repository

**File**: `repositories/task.ts`

**Purpose**: Manages tasks with category support (CASE, PERSONAL, ADMIN, BIZDEV) and comprehensive filtering.

#### Key Features
- **Category Support**: CASE, PERSONAL, ADMIN, BIZDEV categories
- **Status Flow**: PENDING → IN_PROGRESS → COMPLETED with CANCELLED, ON_HOLD
- **Priority Management**: LOW, MEDIUM, HIGH, URGENT priorities
- **Assignment Tracking**: Assignee and creator relationships
- **Time Tracking**: Estimated vs actual hours
- **Dependencies**: Task dependency management
- **Progress Tracking**: Percentage-based progress
- **Recurring Tasks**: Support for recurring patterns
- **Subtask Support**: Parent-child task relationships

#### Filter Options
```typescript
interface TaskFilterOptions {
  search?: string                    // Search in title, description, notes
  category?: string                  // CASE, PERSONAL, ADMIN, BIZDEV
  status?: string                    // PENDING, IN_PROGRESS, COMPLETED, CANCELLED, ON_HOLD
  priority?: string                  // LOW, MEDIUM, HIGH, URGENT
  caseId?: string                    // Filter by case (for CASE category)
  assignedTo?: string                // Filter by assignee
  createdBy?: string                 // Filter by creator
  teamId?: string                    // Filter by team (through case)
  dueDateFrom?: Date                 // Due date range
  dueDateTo?: Date
  isRecurring?: boolean              // Recurring tasks only
  parentTaskId?: string              // Filter by parent task
  isConfidential?: boolean           // Confidential tasks
  tags?: string[]                    // Filter by tags
  createdFrom?: Date                 // Creation date range
  createdTo?: Date
  completedFrom?: Date               // Completion date range
  completedTo?: Date
}
```

#### Usage Examples
```typescript
import { TaskRepository } from 'data'

const taskRepo = new TaskRepository(prisma)

// Find tasks by category
const caseTasks = await taskRepo.findByCategory('CASE')
const personalTasks = await taskRepo.findByCategory('PERSONAL')
const adminTasks = await taskRepo.findByCategory('ADMIN')
const bizDevTasks = await taskRepo.findByCategory('BIZDEV')

// Find overdue tasks
const overdue = await taskRepo.findOverdue()

// Find tasks due soon
const dueSoon = await taskRepo.findDueSoon(3) // Next 3 days

// Assign a task
const assigned = await taskRepo.assignTask('task-id', 'user-id', new Date())

// Complete a task
const completed = await taskRepo.completeTask('task-id', 8, 'Task completed successfully')

// Get user task summary
const summary = await taskRepo.getUserTaskSummary('user-id')
```

### Worklog Repository

**File**: `repositories/worklog.ts`

**Purpose**: Manages time tracking and billing with comprehensive work type support.

#### Key Features
- **Work Types**: CASE_WORK, ADMIN_WORK, RESEARCH, MEETING, TRAVEL, OTHER
- **Time Tracking**: Start/end times, duration, billable hours
- **Billing Support**: Hourly rates, total amounts, overtime tracking
- **Approval Workflow**: Draft → Submitted → Approved → Rejected
- **Activity Tracking**: JSON array of activities performed
- **Location Tracking**: Work location information
- **Worklog Reports**: Comprehensive worklog reports

#### Filter Options
```typescript
interface WorklogFilterOptions {
  search?: string                    // Search in description, notes, location
  userId?: string                    // Filter by user
  caseId?: string                    // Filter by case
  taskId?: string                    // Filter by task
  subtaskId?: string                 // Filter by subtask
  type?: string                      // CASE_WORK, ADMIN_WORK, RESEARCH, etc.
  status?: string                    // DRAFT, SUBMITTED, APPROVED, REJECTED
  dateFrom?: Date                    // Work date range
  dateTo?: Date
  isBillable?: boolean               // Billable work only
  isOvertime?: boolean               // Overtime work only
  approvedBy?: string                 // Filter by approver
  createdFrom?: Date                 // Creation date range
  createdTo?: Date
}
```

#### Usage Examples
```typescript
import { WorklogRepository } from 'data'

const worklogRepo = new WorklogRepository(prisma)

// Find worklogs by user
const userWorklogs = await worklogRepo.findByUser('user-id')

// Find billable worklogs
const billable = await worklogRepo.findBillable()

// Find pending approval
const pending = await worklogRepo.findPendingApproval()

// Approve worklog
const approved = await worklogRepo.approveWorklog('worklog-id', 'approver-id', 'Approved')

// Get worklog statistics
const stats = await worklogRepo.getWorklogStatistics({
  userId: 'user-id',
  dateFrom: new Date('2024-01-01'),
  dateTo: new Date('2024-01-31')
})
```

### LeaveRequest Repository

**File**: `repositories/leave-request.ts`

**Purpose**: Manages leave requests with approval workflow and calendar integration.

#### Key Features
- **Leave Types**: SICK_LEAVE, ANNUAL_LEAVE, MATERNITY_LEAVE, PATERNITY_LEAVE, etc.
- **Duration Support**: FULL_DAY, HALF_DAY_MORNING, HALF_DAY_EVENING, HOURLY
- **Approval Workflow**: PENDING → APPROVED/REJECTED → CANCELLED
- **Emergency Leave**: Emergency leave support
- **Medical Certificates**: Document attachment support
- **Overlap Detection**: Prevent overlapping leave requests
- **Calendar Integration**: Leave calendar generation
- **Leave Balance**: User leave summary and statistics

#### Filter Options
```typescript
interface LeaveRequestFilterOptions {
  search?: string                    // Search in reason, notes, emergency contact
  userId?: string                    // Filter by user
  type?: string                      // SICK_LEAVE, ANNUAL_LEAVE, etc.
  status?: string                    // PENDING, APPROVED, REJECTED, CANCELLED
  duration?: string                  // FULL_DAY, HALF_DAY_MORNING, etc.
  startDateFrom?: Date               // Start date range
  startDateTo?: Date
  endDateFrom?: Date                 // End date range
  endDateTo?: Date
  appliedBy?: string                 // Filter by applicant
  approvedBy?: string                // Filter by approver
  isEmergency?: boolean              // Emergency leave only
  createdFrom?: Date                 // Creation date range
  createdTo?: Date
}
```

#### Usage Examples
```typescript
import { LeaveRequestRepository } from 'data'

const leaveRepo = new LeaveRequestRepository(prisma)

// Find leave requests by user
const userLeaves = await leaveRepo.findByUser('user-id')

// Find pending approval
const pending = await leaveRepo.findPendingApproval()

// Check for overlapping leaves
const overlapping = await leaveRepo.findOverlapping(
  'user-id',
  new Date('2024-05-01'),
  new Date('2024-05-05')
)

// Approve leave request
const approved = await leaveRepo.approveLeaveRequest('leave-id', 'approver-id', 'Approved')

// Reject leave request
const rejected = await leaveRepo.rejectLeaveRequest('leave-id', 'approver-id', 'Insufficient notice')

// Get leave calendar
const calendar = await leaveRepo.getLeaveCalendar(
  new Date('2024-01-01'),
  new Date('2024-01-31')
)

// Get user leave summary
const summary = await leaveRepo.getUserLeaveSummary('user-id', 2024)
```

## Common Patterns

### Pagination Usage

```typescript
// Basic pagination
const result = await repository.findMany({}, { page: 1, limit: 20 })

// Access pagination metadata
console.log(`Page ${result.pagination.page} of ${result.pagination.totalPages}`)
console.log(`Total items: ${result.pagination.total}`)
console.log(`Has next page: ${result.pagination.hasNext}`)
```

### Filtering Usage

```typescript
// Simple filters
const cases = await caseRepo.findMany({
  status: 'OPEN',
  priority: 'HIGH'
})

// Complex filters with date ranges
const tasks = await taskRepo.findMany({
  category: 'CASE',
  assignedTo: 'user-id',
  dueDateFrom: new Date(),
  dueDateTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
})

// Search with filters
const hearings = await hearingRepo.findMany({
  search: 'contract',
  status: 'SCHEDULED',
  courtName: 'High Court'
})
```

### Relationship Loading

All repositories automatically load related entities:

```typescript
// Case with client, lawyer, team, and counts
const case = await caseRepo.findById('case-id')
console.log(case.client.firstName)        // Client info
console.log(case.assignedLawyer?.email)   // Lawyer info
console.log(case.team?.name)              // Team info
console.log(case._count.parties)          // Related counts

// Task with case, assignee, creator, and subtasks
const task = await taskRepo.findById('task-id')
console.log(task.case?.caseNumber)        // Case info
console.log(task.assignee?.firstName)     // Assignee info
console.log(task.creator.email)           // Creator info
console.log(task.subtasks.length)         // Subtasks
```

### Business Logic Methods

Each repository provides domain-specific methods:

```typescript
// Case repository
const stats = await caseRepo.getCaseStatistics()
const byLawyer = await caseRepo.findByLawyer('lawyer-id')

// Task repository
const overdue = await taskRepo.findOverdue()
const summary = await taskRepo.getUserTaskSummary('user-id')

// Worklog repository
const stats = await worklogRepo.getWorklogStatistics({ userId: 'user-id', dateFrom: startDate, dateTo: endDate })

// Leave repository
const overlapping = await leaveRepo.findOverlapping('user-id', startDate, endDate)
```

## Error Handling

All repositories use Prisma's error handling:

```typescript
try {
  const case = await caseRepo.create(caseData)
} catch (error) {
  if (error.code === 'P2002') {
    // Unique constraint violation
    console.error('Case number already exists')
  } else if (error.code === 'P2003') {
    // Foreign key constraint violation
    console.error('Invalid client or lawyer ID')
  } else {
    console.error('Unexpected error:', error.message)
  }
}
```

## Performance Considerations

### Indexing
All repositories are optimized to use the database indexes:
- `caseId` indexes for efficient case-related queries
- `assignedTo` (assigneeId) indexes for user-related queries
- `nextHearingDate` index for hearing queries
- Date range indexes for time-based filtering

### Query Optimization
- **Selective Loading**: Only load necessary fields in includes
- **Efficient Ordering**: Use indexed fields for ordering
- **Pagination**: Limit result sets with proper pagination
- **Filter Optimization**: Use indexed fields in where clauses

### Caching Considerations
```typescript
// Consider caching for frequently accessed data
const userTaskSummary = await taskRepo.getUserTaskSummary('user-id')
// Cache this result for 5 minutes

const caseStatistics = await caseRepo.getCaseStatistics()
// Cache this result for 1 hour
```

## Best Practices

1. **Use Specific Methods**: Prefer specific methods over generic findMany when possible
2. **Limit Result Sets**: Always use pagination for large datasets
3. **Use Filters**: Apply appropriate filters to reduce query scope
4. **Handle Errors**: Implement proper error handling for database operations
5. **Cache Statistics**: Cache expensive statistics and summary operations
6. **Validate Input**: Validate input data before passing to repositories
7. **Use Transactions**: Use transactions for complex operations involving multiple entities

## Integration Examples

### Service Layer Integration
```typescript
class CaseService {
  constructor(private caseRepo: CaseRepository) {}

  async getLawyerCases(lawyerId: string, filters: CaseFilterOptions) {
    return this.caseRepo.findByLawyer(lawyerId, { page: 1, limit: 20 })
  }

  async createCase(caseData: CaseCreateInput) {
    // Business logic validation
    if (caseData.caseValue && caseData.caseValue < 0) {
      throw new Error('Case value cannot be negative')
    }
    
    return this.caseRepo.create(caseData)
  }
}
```

### API Integration
```typescript
// Express.js route handler
app.get('/api/cases', async (req, res) => {
  const filters = {
    status: req.query.status,
    priority: req.query.priority,
    assignedLawyerId: req.query.lawyerId,
  }
  
  const pagination = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 20,
  }
  
  const result = await caseRepo.findMany(filters, pagination)
  res.json(result)
})
```

This comprehensive repository system provides a robust foundation for data access in the legal case management application with full type safety, advanced filtering, pagination support, and business logic encapsulation.
