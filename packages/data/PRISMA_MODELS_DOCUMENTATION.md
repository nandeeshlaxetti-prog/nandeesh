# Prisma Models Documentation

This document provides comprehensive documentation for all Prisma models in the legal case management system. The models are organized into logical groups and include all necessary relationships, indexes, and constraints.

## Database Schema Overview

The database uses SQLite for development and includes the following main entity groups:

- **User Management**: User, Team, TeamMember
- **Case Management**: Case, Party, Hearing, Order
- **Task Management**: Task, Subtask
- **Work Management**: Worklog, LeaveRequest
- **System Management**: AuditLog, UserPendingSummary, Document

## Model Details

### User Management Models

#### User Model
```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  firstName     String
  lastName      String
  role          String   @default("LAWYER") // ADMIN, LAWYER, PARALEGAL, CLIENT, SUPPORT
  status        String   @default("ACTIVE") // ACTIVE, INACTIVE, SUSPENDED, PENDING
  phone         String?
  address       String?
  dateOfBirth   DateTime?
  joiningDate   DateTime?
  profilePicture String?
  bio           String?
  isActive      Boolean  @default(true)
  lastLoginAt   DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  assignedCases        Case[]           @relation("AssignedLawyer")
  clientCases          Case[]           @relation("ClientCases")
  uploadedDocs         Document[]
  assignedTasks        Task[]           @relation("AssignedTasks")
  createdTasks         Task[]           @relation("CreatedTasks")
  assignedSubtasks     Subtask[]        @relation("AssignedSubtasks")
  createdSubtasks      Subtask[]        @relation("CreatedSubtasks")
  worklogs             Worklog[]
  leaveRequests        LeaveRequest[]
  leaveRequestsToApprove LeaveRequest[] @relation("LeaveApprover")
  auditLogs            AuditLog[]
  teamMemberships      TeamMember[]
  teamsLed             Team[]           @relation("TeamLead")
  userPendingSummaries UserPendingSummary[]

  @@map("users")
  @@index([email])
  @@index([role])
  @@index([status])
  @@index([isActive])
}
```

**Key Features:**
- Role-based access control (ADMIN, LAWYER, PARALEGAL, CLIENT, SUPPORT)
- Status management (ACTIVE, INACTIVE, SUSPENDED, PENDING)
- Comprehensive profile information
- Multiple relationship types for different business functions

#### Team Model
```prisma
model Team {
  id          String   @id @default(cuid())
  name        String
  description String?
  status      String   @default("ACTIVE") // ACTIVE, INACTIVE, ARCHIVED
  leadId      String?
  department  String?
  color       String?  // Hex color code
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  lead    User?        @relation("TeamLead", fields: [leadId], references: [id])
  members TeamMember[]
  cases   Case[]

  @@map("teams")
  @@index([leadId])
  @@index([status])
  @@index([department])
}
```

**Key Features:**
- Team leadership management
- Department organization
- Color coding for visual identification
- Flexible team structure

#### TeamMember Model
```prisma
model TeamMember {
  id       String   @id @default(cuid())
  teamId   String
  userId   String
  role     String   @default("MEMBER") // LEAD, MEMBER, CONTRIBUTOR
  joinedAt DateTime @default(now())
  leftAt   DateTime?
  isActive Boolean  @default(true)

  // Relations
  team Team @relation(fields: [teamId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("team_members")
  @@unique([teamId, userId])
  @@index([teamId])
  @@index([userId])
  @@index([isActive])
}
```

### Case Management Models

#### Case Model
```prisma
model Case {
  id                  String   @id @default(cuid())
  caseNumber          String   @unique
  title               String
  description         String?
  status              String   @default("OPEN") // OPEN, IN_PROGRESS, CLOSED, ARCHIVED, SUSPENDED
  priority            String   @default("MEDIUM") // LOW, MEDIUM, HIGH, URGENT
  type                String   @default("CIVIL") // CIVIL, CRIMINAL, FAMILY, CORPORATE, IP, LABOR, TAX, REAL_ESTATE, BANKING, INSURANCE, OTHER
  clientId            String
  assignedLawyerId    String?
  teamId              String?
  courtName           String?
  courtLocation       String?
  caseValue           Float?
  currency            String   @default("INR")
  filingDate          DateTime?
  expectedCompletionDate DateTime?
  actualCompletionDate DateTime?
  tags                String   @default("[]") // JSON array of strings
  isConfidential      Boolean  @default(false)
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  // Relations
  client         User         @relation("ClientCases", fields: [clientId], references: [id])
  assignedLawyer User?        @relation("AssignedLawyer", fields: [assignedLawyerId], references: [id])
  team           Team?        @relation(fields: [teamId], references: [id])
  documents      Document[]
  tasks          Task[]
  parties        Party[]
  hearings       Hearing[]
  orders         Order[]
  worklogs       Worklog[]

  @@map("cases")
  @@index([caseNumber])
  @@index([clientId])
  @@index([assignedLawyerId])
  @@index([teamId])
  @@index([status])
  @@index([priority])
  @@index([type])
  @@index([filingDate])
  @@index([isConfidential])
}
```

**Key Features:**
- Comprehensive case lifecycle management
- Multiple case types and priorities
- Financial tracking with currency support
- Team and lawyer assignment
- Court information tracking
- Tagging system for categorization

#### Party Model
```prisma
model Party {
  id                String   @id @default(cuid())
  name              String
  type              String   @default("INDIVIDUAL") // INDIVIDUAL, COMPANY, GOVERNMENT, NGO, OTHER
  role              String   @default("PLAINTIFF") // PLAINTIFF, DEFENDANT, THIRD_PARTY, WITNESS, EXPERT, OTHER
  caseId            String
  contactPerson     String?
  email             String?
  phone             String?
  address           String?
  city              String?
  state             String?
  country           String   @default("India")
  pincode           String?
  registrationNumber String?
  panNumber         String?
  gstNumber         String?
  isActive          Boolean  @default(true)
  notes             String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  case Case @relation(fields: [caseId], references: [id], onDelete: Cascade)

  @@map("parties")
  @@index([caseId])
  @@index([type])
  @@index([role])
  @@index([isActive])
}
```

#### Hearing Model
```prisma
model Hearing {
  id                String   @id @default(cuid())
  caseId            String
  hearingNumber     String
  type              String   @default("FIRST_HEARING") // FIRST_HEARING, ARGUMENTS, EVIDENCE, JUDGMENT, EXECUTION, MEDIATION, ARBITRATION, APPEAL, REVIEW, OTHER
  status            String   @default("SCHEDULED") // SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, POSTPONED
  scheduledDate     DateTime
  scheduledTime     String   // HH:MM format
  duration          Int      @default(60) // Duration in minutes
  courtName         String
  courtLocation     String?
  judgeName         String?
  courtroom         String?
  description       String?
  agenda            String?
  attendees         String   @default("[]") // JSON array of user IDs
  documents         String   @default("[]") // JSON array of document IDs
  outcome           String?
  nextHearingDate   DateTime?
  notes             String?
  isConfidential    Boolean  @default(false)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  case Case @relation(fields: [caseId], references: [id], onDelete: Cascade)

  @@map("hearings")
  @@index([caseId])
  @@index([scheduledDate])
  @@index([nextHearingDate]) // Useful index as requested
  @@index([status])
  @@index([type])
  @@index([courtName])
}
```

**Key Features:**
- Comprehensive hearing management
- Time and duration tracking
- Court and judge information
- Attendee management
- Document association
- **Important Index**: `nextHearingDate` for efficient querying

#### Order Model
```prisma
model Order {
  id              String   @id @default(cuid())
  caseId          String
  orderNumber     String
  type            String   @default("FINAL_ORDER") // INTERIM_ORDER, FINAL_ORDER, EXECUTION_ORDER, STAY_ORDER, INJUNCTION, DECREE, AWARD, SETTLEMENT, OTHER
  status          String   @default("DRAFT") // DRAFT, PENDING, APPROVED, REJECTED, EXECUTED, CANCELLED
  priority        String   @default("MEDIUM") // LOW, MEDIUM, HIGH, URGENT
  title           String
  description     String?
  content         String
  courtName       String
  judgeName       String?
  orderDate       DateTime?
  effectiveDate   DateTime?
  expiryDate      DateTime?
  createdBy       String
  approvedBy      String?
  approvedAt      DateTime?
  executedBy      String?
  executedAt      DateTime?
  executionNotes  String?
  attachments     String   @default("[]") // JSON array of document IDs
  isConfidential  Boolean  @default(false)
  tags            String   @default("[]") // JSON array of strings
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  case Case @relation(fields: [caseId], references: [id], onDelete: Cascade)

  @@map("orders")
  @@index([caseId])
  @@index([orderNumber])
  @@index([status])
  @@index([type])
  @@index([priority])
  @@index([orderDate])
  @@index([effectiveDate])
}
```

### Task Management Models

#### Task Model (With Categories)
```prisma
model Task {
  id              String   @id @default(cuid())
  title           String
  description     String?
  category        String   @default("CASE") // CASE, PERSONAL, ADMIN, BIZDEV
  status          String   @default("PENDING") // PENDING, IN_PROGRESS, COMPLETED, CANCELLED, ON_HOLD
  priority        String   @default("MEDIUM") // LOW, MEDIUM, HIGH, URGENT
  caseId          String?
  assignedTo      String?
  createdBy       String
  dueDate         DateTime?
  completedAt     DateTime?
  estimatedHours  Float?
  actualHours     Float?
  tags            String   @default("[]") // JSON array of strings
  attachments     String   @default("[]") // JSON array of document IDs
  isRecurring     Boolean  @default(false)
  recurringPattern String? // DAILY, WEEKLY, MONTHLY, YEARLY
  parentTaskId    String?
  dependencies    String   @default("[]") // JSON array of task IDs
  progress        Int      @default(0) // Progress percentage (0-100)
  notes           String?
  isConfidential  Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  case        Case?     @relation(fields: [caseId], references: [id], onDelete: SetNull)
  assignee    User?     @relation("AssignedTasks", fields: [assignedTo], references: [id])
  creator     User      @relation("CreatedTasks", fields: [createdBy], references: [id])
  subtasks    Subtask[]
  worklogs    Worklog[]

  @@map("tasks")
  @@index([caseId])
  @@index([assignedTo]) // Useful index as requested (assigneeId)
  @@index([createdBy])
  @@index([category])
  @@index([status])
  @@index([priority])
  @@index([dueDate])
  @@index([isRecurring])
  @@index([parentTaskId])
}
```

**Key Features:**
- **Task Categories**: CASE, PERSONAL, ADMIN, BIZDEV (as requested)
- **Status Flow**: PENDING → IN_PROGRESS → COMPLETED (with CANCELLED, ON_HOLD options)
- **Priority Levels**: LOW, MEDIUM, HIGH, URGENT
- **Time Tracking**: Estimated vs actual hours
- **Recurring Tasks**: Support for recurring patterns
- **Dependencies**: Task dependency management
- **Progress Tracking**: Percentage-based progress
- **Important Index**: `assignedTo` (assigneeId) for efficient querying

#### Subtask Model
```prisma
model Subtask {
  id              String   @id @default(cuid())
  taskId          String
  title           String
  description     String?
  status          String   @default("PENDING") // PENDING, IN_PROGRESS, COMPLETED, CANCELLED
  priority        String   @default("MEDIUM") // LOW, MEDIUM, HIGH, URGENT
  assignedTo      String?
  createdBy       String
  dueDate         DateTime?
  completedAt     DateTime?
  estimatedHours  Float?
  actualHours     Float?
  order           Int      @default(0) // For ordering subtasks
  dependencies    String   @default("[]") // JSON array of subtask IDs
  progress        Int      @default(0) // Progress percentage (0-100)
  notes           String?
  attachments     String   @default("[]") // JSON array of document IDs
  isConfidential  Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  task     Task @relation(fields: [taskId], references: [id], onDelete: Cascade)
  assignee User? @relation("AssignedSubtasks", fields: [assignedTo], references: [id])
  creator  User  @relation("CreatedSubtasks", fields: [createdBy], references: [id])

  @@map("subtasks")
  @@index([taskId])
  @@index([assignedTo]) // Useful index as requested (assigneeId)
  @@index([createdBy])
  @@index([status])
  @@index([priority])
  @@index([dueDate])
  @@index([order])
}
```

### Work Management Models

#### Worklog Model
```prisma
model Worklog {
  id              String   @id @default(cuid())
  userId          String
  caseId          String?
  taskId          String?
  subtaskId       String?
  type            String   @default("CASE_WORK") // CASE_WORK, ADMIN_WORK, RESEARCH, MEETING, TRAVEL, OTHER
  status          String   @default("DRAFT") // DRAFT, SUBMITTED, APPROVED, REJECTED
  date            DateTime
  startTime       String   // HH:MM format
  endTime         String   // HH:MM format
  duration        Float    // Duration in hours
  description     String
  activities      String   @default("[]") // JSON array of activities
  billableHours   Float?
  hourlyRate      Float?
  totalAmount     Float?
  location        String?
  isBillable      Boolean  @default(true)
  isOvertime      Boolean  @default(false)
  attachments     String   @default("[]") // JSON array of document IDs
  notes           String?
  approvedBy      String?
  approvedAt      DateTime?
  rejectionReason String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  user    User  @relation(fields: [userId], references: [id])
  case    Case? @relation(fields: [caseId], references: [id], onDelete: SetNull)
  task    Task? @relation(fields: [taskId], references: [id], onDelete: SetNull)

  @@map("worklogs")
  @@index([userId])
  @@index([caseId])
  @@index([taskId])
  @@index([subtaskId])
  @@index([date])
  @@index([status])
  @@index([type])
  @@index([isBillable])
}
```

#### LeaveRequest Model
```prisma
model LeaveRequest {
  id                  String   @id @default(cuid())
  userId              String
  type                String   @default("ANNUAL_LEAVE") // SICK_LEAVE, ANNUAL_LEAVE, CASUAL_LEAVE, MATERNITY_LEAVE, PATERNITY_LEAVE, BEREAVEMENT_LEAVE, COMPENSATORY_LEAVE, SABBATICAL, UNPAID_LEAVE, OTHER
  status              String   @default("PENDING") // PENDING, APPROVED, REJECTED, CANCELLED
  duration            String   @default("FULL_DAY") // FULL_DAY, HALF_DAY_MORNING, HALF_DAY_EVENING, HOURLY
  startDate           DateTime
  endDate             DateTime
  startTime           String?  // HH:MM format
  endTime             String?  // HH:MM format
  totalDays           Float
  reason              String
  medicalCertificate  String?  // Document ID
  emergencyContact    String?
  emergencyPhone      String?
  attachments         String   @default("[]") // JSON array of document IDs
  appliedBy           String
  appliedAt           DateTime @default(now())
  approvedBy          String?
  approvedAt          DateTime?
  rejectedBy          String?
  rejectedAt          DateTime?
  rejectionReason     String?
  cancelledBy         String?
  cancelledAt         DateTime?
  cancellationReason  String?
  notes               String?
  isEmergency         Boolean  @default(false)
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  // Relations
  user     User  @relation(fields: [userId], references: [id])
  approver User? @relation("LeaveApprover", fields: [approvedBy], references: [id])

  @@map("leave_requests")
  @@index([userId])
  @@index([status])
  @@index([type])
  @@index([startDate])
  @@index([endDate])
  @@index([appliedBy])
  @@index([approvedBy])
}
```

### System Management Models

#### AuditLog Model
```prisma
model AuditLog {
  id            String   @id @default(cuid())
  userId        String?
  sessionId     String?
  action        String   // CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT, APPROVE, REJECT, ASSIGN, UNASSIGN, EXPORT, IMPORT, UPLOAD, DOWNLOAD, SHARE, ARCHIVE, RESTORE, OTHER
  entityType    String   // USER, TEAM, CASE, PARTY, HEARING, ORDER, TASK, SUBTASK, WORKLOG, LEAVE_REQUEST, DOCUMENT, SYSTEM, CONFIGURATION, OTHER
  entityId      String?
  entityName    String?
  severity      String   @default("MEDIUM") // LOW, MEDIUM, HIGH, CRITICAL
  description   String
  details       String?  // JSON details
  oldValues     String?  // JSON old values
  newValues     String?  // JSON new values
  ipAddress     String?
  userAgent     String?
  location      String?
  resource      String?
  method        String?  // GET, POST, PUT, PATCH, DELETE
  statusCode    Int?
  responseTime  Float?   // Response time in ms
  errorMessage  String?
  tags          String   @default("[]") // JSON array of strings
  isSensitive   Boolean  @default(false)
  retentionDate DateTime?
  createdAt     DateTime @default(now())

  // Relations
  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@map("audit_logs")
  @@index([userId])
  @@index([action])
  @@index([entityType])
  @@index([entityId])
  @@index([severity])
  @@index([createdAt])
  @@index([isSensitive])
}
```

#### UserPendingSummary Model
```prisma
model UserPendingSummary {
  id                    String   @id @default(cuid())
  userId                String
  date                  DateTime
  
  // Case-related pending items
  pendingCases          Int      @default(0)
  urgentCases           Int      @default(0)
  overdueCases          Int      @default(0)
  
  // Task-related pending items
  pendingTasks          Int      @default(0)
  urgentTasks           Int      @default(0)
  overdueTasks          Int      @default(0)
  personalTasks         Int      @default(0)
  adminTasks            Int      @default(0)
  bizDevTasks           Int      @default(0)
  
  // Subtask-related pending items
  pendingSubtasks       Int      @default(0)
  urgentSubtasks        Int      @default(0)
  overdueSubtasks       Int      @default(0)
  
  // Hearing-related pending items
  upcomingHearings      Int      @default(0)
  hearingsThisWeek      Int      @default(0)
  hearingsToday         Int      @default(0)
  
  // Order-related pending items
  pendingOrders         Int      @default(0)
  ordersToExecute       Int      @default(0)
  overdueOrders         Int      @default(0)
  
  // Worklog-related pending items
  pendingWorklogs       Int      @default(0)
  worklogsToApprove     Int      @default(0)
  
  // Leave-related pending items
  pendingLeaveRequests  Int      @default(0)
  leaveRequestsToApprove Int     @default(0)
  
  // Document-related pending items
  pendingDocuments      Int      @default(0)
  documentsToReview     Int      @default(0)
  
  // Team-related pending items
  teamInvitations       Int      @default(0)
  pendingTeamTasks      Int      @default(0)
  
  // Overall summary
  totalPendingItems     Int      @default(0)
  totalUrgentItems      Int      @default(0)
  totalOverdueItems     Int      @default(0)
  
  // Priority breakdown
  highPriorityItems     Int      @default(0)
  mediumPriorityItems   Int      @default(0)
  lowPriorityItems      Int      @default(0)
  
  // Time-based breakdown
  itemsDueToday         Int      @default(0)
  itemsDueThisWeek      Int      @default(0)
  itemsDueThisMonth     Int      @default(0)
  
  // Workload indicators
  workloadLevel         String   @default("MODERATE") // LOW, MODERATE, HIGH, CRITICAL
  estimatedHoursToComplete Float?
  
  // Last updated
  lastUpdated           DateTime @default(now())
  createdAt             DateTime @default(now())

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_pending_summaries")
  @@index([userId])
  @@index([date])
  @@index([workloadLevel])
  @@index([totalPendingItems])
  @@index([totalUrgentItems])
  @@index([totalOverdueItems])
}
```

## Key Indexes (As Requested)

The following important indexes have been implemented for optimal query performance:

### 1. CaseId Indexes
- `Case.caseId` - For efficient case-related queries
- `Task.caseId` - For tasks related to specific cases
- `Party.caseId` - For parties in specific cases
- `Hearing.caseId` - For hearings related to cases
- `Order.caseId` - For orders related to cases
- `Worklog.caseId` - For worklogs related to cases

### 2. AssigneeId Indexes
- `Task.assignedTo` - For tasks assigned to specific users
- `Subtask.assignedTo` - For subtasks assigned to specific users

### 3. NextHearingDate Index
- `Hearing.nextHearingDate` - For efficient querying of upcoming hearings

## Relationships Overview

### User Relationships
- **One-to-Many**: Users can be assigned to multiple cases as lawyers
- **One-to-Many**: Users can have multiple cases as clients
- **One-to-Many**: Users can be assigned multiple tasks
- **One-to-Many**: Users can create multiple tasks
- **One-to-Many**: Users can have multiple worklogs
- **One-to-Many**: Users can have multiple leave requests
- **One-to-Many**: Users can approve multiple leave requests
- **One-to-Many**: Users can lead multiple teams
- **Many-to-Many**: Users can be members of multiple teams

### Case Relationships
- **Many-to-One**: Cases belong to one client
- **Many-to-One**: Cases can be assigned to one lawyer
- **Many-to-One**: Cases can belong to one team
- **One-to-Many**: Cases can have multiple parties
- **One-to-Many**: Cases can have multiple hearings
- **One-to-Many**: Cases can have multiple orders
- **One-to-Many**: Cases can have multiple tasks
- **One-to-Many**: Cases can have multiple worklogs
- **One-to-Many**: Cases can have multiple documents

### Task Relationships
- **Many-to-One**: Tasks can belong to one case
- **Many-to-One**: Tasks can be assigned to one user
- **Many-to-One**: Tasks are created by one user
- **One-to-Many**: Tasks can have multiple subtasks
- **One-to-Many**: Tasks can have multiple worklogs

## Data Types and Constraints

### String Fields
- **IDs**: All use `cuid()` for unique, URL-safe identifiers
- **Enums**: Stored as strings with comments indicating allowed values
- **JSON Arrays**: Stored as JSON strings for tags, attendees, dependencies, etc.

### DateTime Fields
- **Timestamps**: All models include `createdAt` and `updatedAt`
- **Business Dates**: Separate fields for business-relevant dates
- **Time Fields**: Stored as strings in HH:MM format

### Boolean Fields
- **Status Flags**: Used for active/inactive, confidential, billable, etc.
- **Default Values**: Sensible defaults for most boolean fields

### Numeric Fields
- **Progress**: Integer percentages (0-100)
- **Hours**: Float values for precise time tracking
- **Amounts**: Float values for financial calculations
- **Counts**: Integer values for summary counts

## Migration History

The database has been migrated with the following key migrations:

1. **Initial Migration**: Basic User, Case, Document, Task models
2. **Comprehensive Models Migration**: All models with full relationships and indexes

## Usage Examples

### Creating a Case with Related Entities

```typescript
// Create a case
const case = await prisma.case.create({
  data: {
    caseNumber: 'CASE-2024-001',
    title: 'Contract Dispute Resolution',
    description: 'Resolution of contract dispute',
    status: 'OPEN',
    priority: 'HIGH',
    type: 'CIVIL',
    clientId: client.id,
    assignedLawyerId: lawyer.id,
    teamId: team.id,
    courtName: 'High Court of Delhi',
    caseValue: 500000,
    currency: 'INR',
    filingDate: new Date(),
    tags: JSON.stringify(['contract', 'dispute']),
  },
})

// Create parties for the case
await prisma.party.createMany({
  data: [
    {
      name: 'ABC Corporation',
      type: 'COMPANY',
      role: 'PLAINTIFF',
      caseId: case.id,
      contactPerson: 'John Smith',
      email: 'john@abc.com',
    },
    {
      name: 'XYZ Limited',
      type: 'COMPANY',
      role: 'DEFENDANT',
      caseId: case.id,
      contactPerson: 'Jane Doe',
      email: 'jane@xyz.com',
    },
  ],
})

// Create tasks for the case
const task = await prisma.task.create({
  data: {
    title: 'Review contract documents',
    description: 'Review the contract agreement',
    category: 'CASE',
    status: 'PENDING',
    priority: 'HIGH',
    caseId: case.id,
    assignedTo: lawyer.id,
    createdBy: admin.id,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    estimatedHours: 8,
    tags: JSON.stringify(['contract', 'review']),
  },
})
```

### Querying with Indexes

```typescript
// Efficient case queries using indexes
const casesByLawyer = await prisma.case.findMany({
  where: { assignedLawyerId: lawyerId },
  include: { client: true, assignedLawyer: true },
})

// Efficient task queries using indexes
const tasksByAssignee = await prisma.task.findMany({
  where: { assignedTo: userId },
  include: { case: true, assignee: true },
})

// Efficient hearing queries using indexes
const upcomingHearings = await prisma.hearing.findMany({
  where: {
    nextHearingDate: {
      gte: new Date(),
      lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  },
  include: { case: true },
})
```

## Best Practices

1. **Use Indexes**: Always use the provided indexes for efficient queries
2. **JSON Fields**: Parse JSON fields when reading, stringify when writing
3. **Relationships**: Use Prisma's include/select for related data
4. **Cascading Deletes**: Be aware of cascade delete relationships
5. **Soft Deletes**: Consider using status fields instead of hard deletes
6. **Data Validation**: Validate data before database operations
7. **Transaction Usage**: Use transactions for complex operations

This comprehensive Prisma schema provides a robust foundation for the legal case management system with full relationship support, efficient indexing, and comprehensive business logic support.
