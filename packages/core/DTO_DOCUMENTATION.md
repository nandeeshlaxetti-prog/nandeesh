# DTOs Documentation

This document provides comprehensive documentation for all Data Transfer Objects (DTOs) in the `packages/core` module. All DTOs are built using Zod for runtime validation and TypeScript for compile-time type safety.

## Overview

The DTOs are organized into the following categories:

- **User Management**: User, Team
- **Case Management**: Case, Party, Hearing, Order
- **Task Management**: Task, Subtask
- **Work Management**: Worklog, LeaveRequest
- **System Management**: AuditLog, UserPendingSummary

## User Management DTOs

### User DTO (`dto/user.ts`)

Comprehensive user management with role-based access control.

**Key Features:**
- Role-based access (ADMIN, LAWYER, PARALEGAL, CLIENT, SUPPORT)
- Status management (ACTIVE, INACTIVE, SUSPENDED, PENDING)
- Profile management with optional fields
- Password change validation
- Login credentials validation

**Main Schemas:**
- `UserSchema` - Complete user entity
- `CreateUserSchema` - User creation
- `UpdateUserSchema` - User updates
- `UserLoginSchema` - Authentication
- `UserPasswordChangeSchema` - Password changes

**Example Usage:**
```typescript
import { CreateUserSchema, UserRole } from 'core'

const userData = {
  email: 'lawyer@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'LAWYER' as UserRole,
  phone: '+91-9876543210'
}

const validatedUser = CreateUserSchema.parse(userData)
```

### Team DTO (`dto/team.ts`)

Team management with member roles and department organization.

**Key Features:**
- Team creation and management
- Member role assignment (LEAD, MEMBER, CONTRIBUTOR)
- Department organization
- Color coding for visual identification
- Member lifecycle management

**Main Schemas:**
- `TeamSchema` - Complete team entity
- `TeamMemberSchema` - Team membership
- `AddTeamMemberSchema` - Adding members
- `TeamWithMembersSchema` - Team with member details

## Case Management DTOs

### Case DTO (`dto/case.ts`)

Comprehensive case management system.

**Key Features:**
- Case lifecycle management (OPEN, IN_PROGRESS, CLOSED, ARCHIVED, SUSPENDED)
- Priority levels (LOW, MEDIUM, HIGH, URGENT)
- Case types (CIVIL, CRIMINAL, FAMILY, CORPORATE, etc.)
- Client and lawyer assignment
- Court information tracking
- Financial tracking (case value, currency)
- Tagging system

**Main Schemas:**
- `CaseSchema` - Complete case entity
- `CaseSearchSchema` - Advanced search functionality
- `CaseWithRelationsSchema` - Case with related entities
- `CaseStatisticsSchema` - Case analytics

### Party DTO (`dto/party.ts`)

Party management for cases (plaintiffs, defendants, witnesses, etc.).

**Key Features:**
- Party types (INDIVIDUAL, COMPANY, GOVERNMENT, NGO, OTHER)
- Party roles (PLAINTIFF, DEFENDANT, THIRD_PARTY, WITNESS, EXPERT)
- Contact information management
- Legal entity information (PAN, GST, registration numbers)
- Location tracking

**Main Schemas:**
- `PartySchema` - Complete party entity
- `IndividualPartySchema` - Individual party details
- `CompanyPartySchema` - Company party details
- `PartySearchSchema` - Party search functionality

### Hearing DTO (`dto/hearing.ts`)

Court hearing management and scheduling.

**Key Features:**
- Hearing types (FIRST_HEARING, ARGUMENTS, EVIDENCE, JUDGMENT, etc.)
- Status tracking (SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, POSTPONED)
- Time management with duration tracking
- Court and judge information
- Attendee management
- Document association
- Calendar integration

**Main Schemas:**
- `HearingSchema` - Complete hearing entity
- `HearingCalendarSchema` - Calendar view
- `HearingWithAttendeesSchema` - Hearing with attendee details
- `HearingStatisticsSchema` - Hearing analytics

### Order DTO (`dto/order.ts`)

Court order management and execution tracking.

**Key Features:**
- Order types (INTERIM_ORDER, FINAL_ORDER, EXECUTION_ORDER, etc.)
- Status workflow (DRAFT, PENDING, APPROVED, REJECTED, EXECUTED)
- Approval and execution tracking
- Document attachment support
- Confidentiality management
- Tagging system

**Main Schemas:**
- `OrderSchema` - Complete order entity
- `OrderApprovalSchema` - Approval workflow
- `OrderExecutionSchema` - Execution tracking
- `OrderStatisticsSchema` - Order analytics

## Task Management DTOs

### Task DTO (`dto/task.ts`)

Comprehensive task management with category-based organization.

**Key Features:**
- Task categories: **CASE**, **PERSONAL**, **ADMIN**, **BIZDEV**
- Status tracking (PENDING, IN_PROGRESS, COMPLETED, CANCELLED, ON_HOLD)
- Priority levels (LOW, MEDIUM, HIGH, URGENT)
- Time tracking (estimated vs actual hours)
- Recurring task support
- Dependency management
- Progress tracking
- Subtask support

**Main Schemas:**
- `TaskSchema` - Complete task entity
- `TaskAssignmentSchema` - Task assignment
- `TaskStatusUpdateSchema` - Status updates
- `TaskStatisticsSchema` - Task analytics

**Category Usage:**
```typescript
import { TaskCategory } from 'core'

// Case-related tasks
const caseTask = {
  title: 'Review contract documents',
  category: 'CASE' as TaskCategory,
  caseId: 'case-123'
}

// Personal tasks
const personalTask = {
  title: 'Update professional profile',
  category: 'PERSONAL' as TaskCategory
}

// Administrative tasks
const adminTask = {
  title: 'Update office policies',
  category: 'ADMIN' as TaskCategory
}

// Business development tasks
const bizDevTask = {
  title: 'Client outreach campaign',
  category: 'BIZDEV' as TaskCategory
}
```

### Subtask DTO (`dto/subtask.ts`)

Subtask management for breaking down complex tasks.

**Key Features:**
- Parent task association
- Order management for subtask sequencing
- Dependency tracking between subtasks
- Progress tracking
- Time estimation and tracking
- Assignment management

**Main Schemas:**
- `SubtaskSchema` - Complete subtask entity
- `SubtaskReorderSchema` - Reordering subtasks
- `SubtaskStatisticsSchema` - Subtask analytics

## Work Management DTOs

### Worklog DTO (`dto/worklog.ts`)

Time tracking and billing management.

**Key Features:**
- Work type categorization (CASE_WORK, ADMIN_WORK, RESEARCH, MEETING, TRAVEL)
- Time tracking with start/end times
- Billable hours calculation
- Hourly rate management
- Overtime tracking
- Approval workflow
- Location tracking
- Activity logging

**Main Schemas:**
- `WorklogSchema` - Complete worklog entity
- `WorklogApprovalSchema` - Approval workflow
- `WorklogStatisticsSchema` - Worklog analytics

### LeaveRequest DTO (`dto/leave-request.ts`)

Leave management and approval system.

**Key Features:**
- Leave types (SICK_LEAVE, ANNUAL_LEAVE, MATERNITY_LEAVE, etc.)
- Duration options (FULL_DAY, HALF_DAY_MORNING, HALF_DAY_EVENING, HOURLY)
- Approval workflow
- Emergency leave support
- Medical certificate support
- Leave balance tracking
- Calendar integration

**Main Schemas:**
- `LeaveRequestSchema` - Complete leave request entity
- `LeaveRequestApprovalSchema` - Approval workflow
- `LeaveBalanceSchema` - Leave balance tracking
- `LeaveCalendarSchema` - Calendar view

## System Management DTOs

### AuditLog DTO (`dto/audit-log.ts`)

Comprehensive audit logging for security and compliance.

**Key Features:**
- Action tracking (CREATE, READ, UPDATE, DELETE, LOGIN, etc.)
- Entity type tracking (USER, CASE, TASK, etc.)
- Severity levels (LOW, MEDIUM, HIGH, CRITICAL)
- IP address and user agent tracking
- Performance monitoring (response time)
- Error tracking
- Retention management
- Export functionality

**Main Schemas:**
- `AuditLogSchema` - Complete audit log entity
- `AuditLogStatisticsSchema` - Audit analytics
- `AuditLogExportSchema` - Export functionality
- `AuditLogRetentionSchema` - Retention policies

### UserPendingSummary DTO (`dto/user-pending-summary.ts`)

Dashboard summary for user workload and pending items.

**Key Features:**
- Comprehensive pending item tracking
- Workload level assessment (LOW, MODERATE, HIGH, CRITICAL)
- Category-wise breakdown (cases, tasks, hearings, orders, etc.)
- Priority-based organization
- Time-based filtering (today, this week, this month)
- Overdue item tracking
- Dashboard integration

**Main Schemas:**
- `UserPendingSummarySchema` - Complete summary entity
- `UserPendingSummaryDashboardSchema` - Dashboard view
- `UserPendingSummaryStatisticsSchema` - Summary analytics

## Common Patterns

### Validation Patterns

All DTOs follow consistent validation patterns:

```typescript
// Required fields with defaults
const schema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1).max(100),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Optional fields
const schema = z.object({
  description: z.string().max(500).optional(),
  phone: z.string().optional(),
})

// Conditional validation
const schema = z.object({
  type: z.enum(['INDIVIDUAL', 'COMPANY']),
  firstName: z.string().optional(),
  companyName: z.string().optional(),
}).refine((data) => {
  if (data.type === 'INDIVIDUAL') {
    return data.firstName !== undefined
  }
  if (data.type === 'COMPANY') {
    return data.companyName !== undefined
  }
  return true
})
```

### Search Patterns

Most DTOs include comprehensive search functionality:

```typescript
const searchSchema = z.object({
  query: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().min(0).default(0),
})
```

### Statistics Patterns

Analytics and reporting schemas:

```typescript
const statisticsSchema = z.object({
  total: z.number().int().min(0),
  byStatus: z.record(z.string(), z.number().int().min(0)),
  byType: z.record(z.string(), z.number().int().min(0)),
  averageValue: z.number().positive().optional(),
})
```

## Usage Examples

### Creating a Case with Related Entities

```typescript
import { 
  CreateCaseSchema, 
  CreatePartySchema, 
  CreateTaskSchema,
  TaskCategory 
} from 'core'

// Create a case
const caseData = {
  caseNumber: 'CASE-2024-001',
  title: 'Contract Dispute Resolution',
  description: 'Resolution of contract dispute between ABC Corp and XYZ Ltd',
  type: 'CIVIL',
  priority: 'HIGH',
  clientId: 'client-123',
  assignedLawyerId: 'lawyer-456',
  courtName: 'High Court of Delhi',
  caseValue: 500000,
  currency: 'INR'
}

const validatedCase = CreateCaseSchema.parse(caseData)

// Create parties
const plaintiffData = {
  name: 'ABC Corporation',
  type: 'COMPANY',
  role: 'PLAINTIFF',
  caseId: validatedCase.id,
  contactPerson: 'John Smith',
  email: 'john@abc.com',
  registrationNumber: 'U12345DL2020ABC123'
}

const defendantData = {
  name: 'XYZ Limited',
  type: 'COMPANY',
  role: 'DEFENDANT',
  caseId: validatedCase.id,
  contactPerson: 'Jane Doe',
  email: 'jane@xyz.com'
}

// Create tasks
const taskData = {
  title: 'Review contract documents',
  description: 'Review the contract agreement for ABC Corporation case',
  category: 'CASE' as TaskCategory,
  priority: 'HIGH',
  caseId: validatedCase.id,
  assignedTo: 'lawyer-456',
  createdBy: 'admin-789',
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  estimatedHours: 8
}
```

### User Pending Summary Dashboard

```typescript
import { UserPendingSummaryDashboardSchema } from 'core'

const dashboardData = {
  userId: 'user-123',
  userName: 'John Doe',
  userRole: 'LAWYER',
  summary: {
    pendingCases: 5,
    urgentCases: 2,
    pendingTasks: 12,
    urgentTasks: 3,
    upcomingHearings: 2,
    totalPendingItems: 19,
    workloadLevel: 'HIGH' as const
  },
  recentActivity: [
    {
      id: 'task-1',
      type: 'TASK',
      title: 'Review contract documents',
      priority: 'HIGH',
      dueDate: new Date(),
      createdAt: new Date()
    }
  ],
  upcomingDeadlines: [
    {
      id: 'hearing-1',
      type: 'HEARING',
      title: 'First hearing - Contract dispute',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      priority: 'URGENT'
    }
  ]
}

const validatedDashboard = UserPendingSummaryDashboardSchema.parse(dashboardData)
```

## Best Practices

1. **Always validate input data** using Zod schemas before processing
2. **Use specific schemas** for different operations (Create, Update, Search)
3. **Leverage TypeScript types** for compile-time type safety
4. **Handle optional fields** appropriately in your application logic
5. **Use enums** for consistent status and type values
6. **Implement proper error handling** for validation failures
7. **Consider performance** when using complex search schemas
8. **Maintain data consistency** across related entities

## Error Handling

```typescript
import { z } from 'zod'
import { CreateUserSchema } from 'core'

try {
  const user = CreateUserSchema.parse(userData)
  // Process valid user data
} catch (error) {
  if (error instanceof z.ZodError) {
    // Handle validation errors
    console.error('Validation errors:', error.errors)
  } else {
    // Handle other errors
    console.error('Unexpected error:', error)
  }
}
```

This comprehensive DTO system provides a robust foundation for the legal case management application with full type safety, runtime validation, and extensive functionality for all business entities.
