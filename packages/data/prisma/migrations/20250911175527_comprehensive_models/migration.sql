-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "leadId" TEXT,
    "department" TEXT,
    "color" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "teams_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "team_members" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "team_members_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "team_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "parties" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'INDIVIDUAL',
    "role" TEXT NOT NULL DEFAULT 'PLAINTIFF',
    "caseId" TEXT NOT NULL,
    "contactPerson" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT NOT NULL DEFAULT 'India',
    "pincode" TEXT,
    "registrationNumber" TEXT,
    "panNumber" TEXT,
    "gstNumber" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "parties_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "hearings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL,
    "hearingNumber" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'FIRST_HEARING',
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "scheduledDate" DATETIME NOT NULL,
    "scheduledTime" TEXT NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 60,
    "courtName" TEXT NOT NULL,
    "courtLocation" TEXT,
    "judgeName" TEXT,
    "courtroom" TEXT,
    "description" TEXT,
    "agenda" TEXT,
    "attendees" TEXT NOT NULL DEFAULT '[]',
    "documents" TEXT NOT NULL DEFAULT '[]',
    "outcome" TEXT,
    "nextHearingDate" DATETIME,
    "notes" TEXT,
    "isConfidential" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "hearings_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'FINAL_ORDER',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "courtName" TEXT NOT NULL,
    "judgeName" TEXT,
    "orderDate" DATETIME,
    "effectiveDate" DATETIME,
    "expiryDate" DATETIME,
    "createdBy" TEXT NOT NULL,
    "approvedBy" TEXT,
    "approvedAt" DATETIME,
    "executedBy" TEXT,
    "executedAt" DATETIME,
    "executionNotes" TEXT,
    "attachments" TEXT NOT NULL DEFAULT '[]',
    "isConfidential" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "orders_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "subtasks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "assignedTo" TEXT,
    "createdBy" TEXT NOT NULL,
    "dueDate" DATETIME,
    "completedAt" DATETIME,
    "estimatedHours" REAL,
    "actualHours" REAL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "dependencies" TEXT NOT NULL DEFAULT '[]',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "attachments" TEXT NOT NULL DEFAULT '[]',
    "isConfidential" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "subtasks_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "subtasks_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "subtasks_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "worklogs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "caseId" TEXT,
    "taskId" TEXT,
    "subtaskId" TEXT,
    "type" TEXT NOT NULL DEFAULT 'CASE_WORK',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "date" DATETIME NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "duration" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "activities" TEXT NOT NULL DEFAULT '[]',
    "billableHours" REAL,
    "hourlyRate" REAL,
    "totalAmount" REAL,
    "location" TEXT,
    "isBillable" BOOLEAN NOT NULL DEFAULT true,
    "isOvertime" BOOLEAN NOT NULL DEFAULT false,
    "attachments" TEXT NOT NULL DEFAULT '[]',
    "notes" TEXT,
    "approvedBy" TEXT,
    "approvedAt" DATETIME,
    "rejectionReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "worklogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "worklogs_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "worklogs_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "leave_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'ANNUAL_LEAVE',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "duration" TEXT NOT NULL DEFAULT 'FULL_DAY',
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "totalDays" REAL NOT NULL,
    "reason" TEXT NOT NULL,
    "medicalCertificate" TEXT,
    "emergencyContact" TEXT,
    "emergencyPhone" TEXT,
    "attachments" TEXT NOT NULL DEFAULT '[]',
    "appliedBy" TEXT NOT NULL,
    "appliedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedBy" TEXT,
    "approvedAt" DATETIME,
    "rejectedBy" TEXT,
    "rejectedAt" DATETIME,
    "rejectionReason" TEXT,
    "cancelledBy" TEXT,
    "cancelledAt" DATETIME,
    "cancellationReason" TEXT,
    "notes" TEXT,
    "isEmergency" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "leave_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "leave_requests_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "sessionId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "entityName" TEXT,
    "severity" TEXT NOT NULL DEFAULT 'MEDIUM',
    "description" TEXT NOT NULL,
    "details" TEXT,
    "oldValues" TEXT,
    "newValues" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "location" TEXT,
    "resource" TEXT,
    "method" TEXT,
    "statusCode" INTEGER,
    "responseTime" REAL,
    "errorMessage" TEXT,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "isSensitive" BOOLEAN NOT NULL DEFAULT false,
    "retentionDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_pending_summaries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "pendingCases" INTEGER NOT NULL DEFAULT 0,
    "urgentCases" INTEGER NOT NULL DEFAULT 0,
    "overdueCases" INTEGER NOT NULL DEFAULT 0,
    "pendingTasks" INTEGER NOT NULL DEFAULT 0,
    "urgentTasks" INTEGER NOT NULL DEFAULT 0,
    "overdueTasks" INTEGER NOT NULL DEFAULT 0,
    "personalTasks" INTEGER NOT NULL DEFAULT 0,
    "adminTasks" INTEGER NOT NULL DEFAULT 0,
    "bizDevTasks" INTEGER NOT NULL DEFAULT 0,
    "pendingSubtasks" INTEGER NOT NULL DEFAULT 0,
    "urgentSubtasks" INTEGER NOT NULL DEFAULT 0,
    "overdueSubtasks" INTEGER NOT NULL DEFAULT 0,
    "upcomingHearings" INTEGER NOT NULL DEFAULT 0,
    "hearingsThisWeek" INTEGER NOT NULL DEFAULT 0,
    "hearingsToday" INTEGER NOT NULL DEFAULT 0,
    "pendingOrders" INTEGER NOT NULL DEFAULT 0,
    "ordersToExecute" INTEGER NOT NULL DEFAULT 0,
    "overdueOrders" INTEGER NOT NULL DEFAULT 0,
    "pendingWorklogs" INTEGER NOT NULL DEFAULT 0,
    "worklogsToApprove" INTEGER NOT NULL DEFAULT 0,
    "pendingLeaveRequests" INTEGER NOT NULL DEFAULT 0,
    "leaveRequestsToApprove" INTEGER NOT NULL DEFAULT 0,
    "pendingDocuments" INTEGER NOT NULL DEFAULT 0,
    "documentsToReview" INTEGER NOT NULL DEFAULT 0,
    "teamInvitations" INTEGER NOT NULL DEFAULT 0,
    "pendingTeamTasks" INTEGER NOT NULL DEFAULT 0,
    "totalPendingItems" INTEGER NOT NULL DEFAULT 0,
    "totalUrgentItems" INTEGER NOT NULL DEFAULT 0,
    "totalOverdueItems" INTEGER NOT NULL DEFAULT 0,
    "highPriorityItems" INTEGER NOT NULL DEFAULT 0,
    "mediumPriorityItems" INTEGER NOT NULL DEFAULT 0,
    "lowPriorityItems" INTEGER NOT NULL DEFAULT 0,
    "itemsDueToday" INTEGER NOT NULL DEFAULT 0,
    "itemsDueThisWeek" INTEGER NOT NULL DEFAULT 0,
    "itemsDueThisMonth" INTEGER NOT NULL DEFAULT 0,
    "workloadLevel" TEXT NOT NULL DEFAULT 'MODERATE',
    "estimatedHoursToComplete" REAL,
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_pending_summaries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tasks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL DEFAULT 'CASE',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "caseId" TEXT,
    "assignedTo" TEXT,
    "createdBy" TEXT NOT NULL,
    "dueDate" DATETIME,
    "completedAt" DATETIME,
    "estimatedHours" REAL,
    "actualHours" REAL,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "attachments" TEXT NOT NULL DEFAULT '[]',
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurringPattern" TEXT,
    "parentTaskId" TEXT,
    "dependencies" TEXT NOT NULL DEFAULT '[]',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "isConfidential" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "tasks_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tasks_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tasks_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_tasks" ("assignedTo", "caseId", "completedAt", "createdAt", "createdBy", "description", "dueDate", "id", "priority", "status", "title", "updatedAt") SELECT "assignedTo", "caseId", "completedAt", "createdAt", "createdBy", "description", "dueDate", "id", "priority", "status", "title", "updatedAt" FROM "tasks";
DROP TABLE "tasks";
ALTER TABLE "new_tasks" RENAME TO "tasks";
CREATE INDEX "tasks_caseId_idx" ON "tasks"("caseId");
CREATE INDEX "tasks_assignedTo_idx" ON "tasks"("assignedTo");
CREATE INDEX "tasks_createdBy_idx" ON "tasks"("createdBy");
CREATE INDEX "tasks_category_idx" ON "tasks"("category");
CREATE INDEX "tasks_status_idx" ON "tasks"("status");
CREATE INDEX "tasks_priority_idx" ON "tasks"("priority");
CREATE INDEX "tasks_dueDate_idx" ON "tasks"("dueDate");
CREATE INDEX "tasks_isRecurring_idx" ON "tasks"("isRecurring");
CREATE INDEX "tasks_parentTaskId_idx" ON "tasks"("parentTaskId");
CREATE TABLE "new_cases" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "type" TEXT NOT NULL DEFAULT 'CIVIL',
    "clientId" TEXT NOT NULL,
    "assignedLawyerId" TEXT,
    "teamId" TEXT,
    "courtName" TEXT,
    "courtLocation" TEXT,
    "caseValue" REAL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "filingDate" DATETIME,
    "expectedCompletionDate" DATETIME,
    "actualCompletionDate" DATETIME,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "isConfidential" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "cases_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "cases_assignedLawyerId_fkey" FOREIGN KEY ("assignedLawyerId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "cases_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_cases" ("assignedLawyerId", "caseNumber", "clientId", "createdAt", "description", "id", "priority", "status", "title", "updatedAt") SELECT "assignedLawyerId", "caseNumber", "clientId", "createdAt", "description", "id", "priority", "status", "title", "updatedAt" FROM "cases";
DROP TABLE "cases";
ALTER TABLE "new_cases" RENAME TO "cases";
CREATE UNIQUE INDEX "cases_caseNumber_key" ON "cases"("caseNumber");
CREATE INDEX "cases_caseNumber_idx" ON "cases"("caseNumber");
CREATE INDEX "cases_clientId_idx" ON "cases"("clientId");
CREATE INDEX "cases_assignedLawyerId_idx" ON "cases"("assignedLawyerId");
CREATE INDEX "cases_teamId_idx" ON "cases"("teamId");
CREATE INDEX "cases_status_idx" ON "cases"("status");
CREATE INDEX "cases_priority_idx" ON "cases"("priority");
CREATE INDEX "cases_type_idx" ON "cases"("type");
CREATE INDEX "cases_filingDate_idx" ON "cases"("filingDate");
CREATE INDEX "cases_isConfidential_idx" ON "cases"("isConfidential");
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'LAWYER',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "phone" TEXT,
    "address" TEXT,
    "dateOfBirth" DATETIME,
    "joiningDate" DATETIME,
    "profilePicture" TEXT,
    "bio" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_users" ("createdAt", "email", "firstName", "id", "isActive", "lastName", "role", "updatedAt") SELECT "createdAt", "email", "firstName", "id", "isActive", "lastName", "role", "updatedAt" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "users_email_idx" ON "users"("email");
CREATE INDEX "users_role_idx" ON "users"("role");
CREATE INDEX "users_status_idx" ON "users"("status");
CREATE INDEX "users_isActive_idx" ON "users"("isActive");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE INDEX "teams_leadId_idx" ON "teams"("leadId");

-- CreateIndex
CREATE INDEX "teams_status_idx" ON "teams"("status");

-- CreateIndex
CREATE INDEX "teams_department_idx" ON "teams"("department");

-- CreateIndex
CREATE INDEX "team_members_teamId_idx" ON "team_members"("teamId");

-- CreateIndex
CREATE INDEX "team_members_userId_idx" ON "team_members"("userId");

-- CreateIndex
CREATE INDEX "team_members_isActive_idx" ON "team_members"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "team_members_teamId_userId_key" ON "team_members"("teamId", "userId");

-- CreateIndex
CREATE INDEX "parties_caseId_idx" ON "parties"("caseId");

-- CreateIndex
CREATE INDEX "parties_type_idx" ON "parties"("type");

-- CreateIndex
CREATE INDEX "parties_role_idx" ON "parties"("role");

-- CreateIndex
CREATE INDEX "parties_isActive_idx" ON "parties"("isActive");

-- CreateIndex
CREATE INDEX "hearings_caseId_idx" ON "hearings"("caseId");

-- CreateIndex
CREATE INDEX "hearings_scheduledDate_idx" ON "hearings"("scheduledDate");

-- CreateIndex
CREATE INDEX "hearings_nextHearingDate_idx" ON "hearings"("nextHearingDate");

-- CreateIndex
CREATE INDEX "hearings_status_idx" ON "hearings"("status");

-- CreateIndex
CREATE INDEX "hearings_type_idx" ON "hearings"("type");

-- CreateIndex
CREATE INDEX "hearings_courtName_idx" ON "hearings"("courtName");

-- CreateIndex
CREATE INDEX "orders_caseId_idx" ON "orders"("caseId");

-- CreateIndex
CREATE INDEX "orders_orderNumber_idx" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_type_idx" ON "orders"("type");

-- CreateIndex
CREATE INDEX "orders_priority_idx" ON "orders"("priority");

-- CreateIndex
CREATE INDEX "orders_orderDate_idx" ON "orders"("orderDate");

-- CreateIndex
CREATE INDEX "orders_effectiveDate_idx" ON "orders"("effectiveDate");

-- CreateIndex
CREATE INDEX "subtasks_taskId_idx" ON "subtasks"("taskId");

-- CreateIndex
CREATE INDEX "subtasks_assignedTo_idx" ON "subtasks"("assignedTo");

-- CreateIndex
CREATE INDEX "subtasks_createdBy_idx" ON "subtasks"("createdBy");

-- CreateIndex
CREATE INDEX "subtasks_status_idx" ON "subtasks"("status");

-- CreateIndex
CREATE INDEX "subtasks_priority_idx" ON "subtasks"("priority");

-- CreateIndex
CREATE INDEX "subtasks_dueDate_idx" ON "subtasks"("dueDate");

-- CreateIndex
CREATE INDEX "subtasks_order_idx" ON "subtasks"("order");

-- CreateIndex
CREATE INDEX "worklogs_userId_idx" ON "worklogs"("userId");

-- CreateIndex
CREATE INDEX "worklogs_caseId_idx" ON "worklogs"("caseId");

-- CreateIndex
CREATE INDEX "worklogs_taskId_idx" ON "worklogs"("taskId");

-- CreateIndex
CREATE INDEX "worklogs_subtaskId_idx" ON "worklogs"("subtaskId");

-- CreateIndex
CREATE INDEX "worklogs_date_idx" ON "worklogs"("date");

-- CreateIndex
CREATE INDEX "worklogs_status_idx" ON "worklogs"("status");

-- CreateIndex
CREATE INDEX "worklogs_type_idx" ON "worklogs"("type");

-- CreateIndex
CREATE INDEX "worklogs_isBillable_idx" ON "worklogs"("isBillable");

-- CreateIndex
CREATE INDEX "leave_requests_userId_idx" ON "leave_requests"("userId");

-- CreateIndex
CREATE INDEX "leave_requests_status_idx" ON "leave_requests"("status");

-- CreateIndex
CREATE INDEX "leave_requests_type_idx" ON "leave_requests"("type");

-- CreateIndex
CREATE INDEX "leave_requests_startDate_idx" ON "leave_requests"("startDate");

-- CreateIndex
CREATE INDEX "leave_requests_endDate_idx" ON "leave_requests"("endDate");

-- CreateIndex
CREATE INDEX "leave_requests_appliedBy_idx" ON "leave_requests"("appliedBy");

-- CreateIndex
CREATE INDEX "leave_requests_approvedBy_idx" ON "leave_requests"("approvedBy");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_idx" ON "audit_logs"("entityType");

-- CreateIndex
CREATE INDEX "audit_logs_entityId_idx" ON "audit_logs"("entityId");

-- CreateIndex
CREATE INDEX "audit_logs_severity_idx" ON "audit_logs"("severity");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_isSensitive_idx" ON "audit_logs"("isSensitive");

-- CreateIndex
CREATE INDEX "user_pending_summaries_userId_idx" ON "user_pending_summaries"("userId");

-- CreateIndex
CREATE INDEX "user_pending_summaries_date_idx" ON "user_pending_summaries"("date");

-- CreateIndex
CREATE INDEX "user_pending_summaries_workloadLevel_idx" ON "user_pending_summaries"("workloadLevel");

-- CreateIndex
CREATE INDEX "user_pending_summaries_totalPendingItems_idx" ON "user_pending_summaries"("totalPendingItems");

-- CreateIndex
CREATE INDEX "user_pending_summaries_totalUrgentItems_idx" ON "user_pending_summaries"("totalUrgentItems");

-- CreateIndex
CREATE INDEX "user_pending_summaries_totalOverdueItems_idx" ON "user_pending_summaries"("totalOverdueItems");

-- CreateIndex
CREATE INDEX "documents_caseId_idx" ON "documents"("caseId");

-- CreateIndex
CREATE INDEX "documents_uploadedBy_idx" ON "documents"("uploadedBy");

-- CreateIndex
CREATE INDEX "documents_mimeType_idx" ON "documents"("mimeType");
