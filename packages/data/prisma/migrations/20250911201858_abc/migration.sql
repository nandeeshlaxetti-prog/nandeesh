-- AlterTable
ALTER TABLE "tasks" ADD COLUMN "recurrenceJSON" TEXT;

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "department" TEXT,
    "designation" TEXT,
    "reportingManager" TEXT,
    "employmentType" TEXT NOT NULL DEFAULT 'FULL_TIME',
    "workLocation" TEXT,
    "workSchedule" TEXT,
    "skills" TEXT NOT NULL DEFAULT '[]',
    "certifications" TEXT NOT NULL DEFAULT '[]',
    "experience" REAL,
    "salary" REAL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "joiningDate" DATETIME,
    "probationEndDate" DATETIME,
    "confirmationDate" DATETIME,
    "lastPromotionDate" DATETIME,
    "nextReviewDate" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "employees_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "employees_reportingManager_fkey" FOREIGN KEY ("reportingManager") REFERENCES "employees" ("employeeId") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PLANNING',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "type" TEXT NOT NULL DEFAULT 'CLIENT_PROJECT',
    "clientId" TEXT,
    "teamId" TEXT,
    "managerId" TEXT,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "estimatedHours" REAL,
    "actualHours" REAL,
    "budget" REAL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "tags" TEXT NOT NULL DEFAULT '[]',
    "milestones" TEXT NOT NULL DEFAULT '[]',
    "deliverables" TEXT NOT NULL DEFAULT '[]',
    "risks" TEXT NOT NULL DEFAULT '[]',
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "projects_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "projects_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "projects_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sla_rules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "entityType" TEXT NOT NULL,
    "entitySubType" TEXT,
    "priority" TEXT,
    "teamId" TEXT,
    "conditions" TEXT NOT NULL,
    "metrics" TEXT NOT NULL,
    "escalationRules" TEXT NOT NULL,
    "notifications" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "sla_rules_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sla_evaluations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "slaRuleId" TEXT NOT NULL,
    "employeeId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "currentValue" REAL,
    "thresholdValue" REAL,
    "breachDate" DATETIME,
    "escalationDate" DATETIME,
    "resolutionDate" DATETIME,
    "notes" TEXT,
    "metadata" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "sla_evaluations_slaRuleId_fkey" FOREIGN KEY ("slaRuleId") REFERENCES "sla_rules" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "sla_evaluations_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees" ("employeeId") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "entityType" TEXT,
    "entityId" TEXT,
    "metadata" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "scheduledAt" DATETIME,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "hash" TEXT NOT NULL,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedBy" TEXT NOT NULL,
    "caseId" TEXT,
    "orderId" TEXT,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "description" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" DATETIME,
    "deletedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "files_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "files_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "files_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "projectId" TEXT,
    "defaultAssigneeId" TEXT,
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
    CONSTRAINT "cases_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "cases_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "cases_defaultAssigneeId_fkey" FOREIGN KEY ("defaultAssigneeId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_cases" ("actualCompletionDate", "assignedLawyerId", "caseNumber", "caseValue", "clientId", "courtLocation", "courtName", "createdAt", "currency", "description", "expectedCompletionDate", "filingDate", "id", "isConfidential", "priority", "status", "tags", "teamId", "title", "type", "updatedAt") SELECT "actualCompletionDate", "assignedLawyerId", "caseNumber", "caseValue", "clientId", "courtLocation", "courtName", "createdAt", "currency", "description", "expectedCompletionDate", "filingDate", "id", "isConfidential", "priority", "status", "tags", "teamId", "title", "type", "updatedAt" FROM "cases";
DROP TABLE "cases";
ALTER TABLE "new_cases" RENAME TO "cases";
CREATE UNIQUE INDEX "cases_caseNumber_key" ON "cases"("caseNumber");
CREATE INDEX "cases_caseNumber_idx" ON "cases"("caseNumber");
CREATE INDEX "cases_clientId_idx" ON "cases"("clientId");
CREATE INDEX "cases_assignedLawyerId_idx" ON "cases"("assignedLawyerId");
CREATE INDEX "cases_teamId_idx" ON "cases"("teamId");
CREATE INDEX "cases_projectId_idx" ON "cases"("projectId");
CREATE INDEX "cases_defaultAssigneeId_idx" ON "cases"("defaultAssigneeId");
CREATE INDEX "cases_status_idx" ON "cases"("status");
CREATE INDEX "cases_priority_idx" ON "cases"("priority");
CREATE INDEX "cases_type_idx" ON "cases"("type");
CREATE INDEX "cases_filingDate_idx" ON "cases"("filingDate");
CREATE INDEX "cases_isConfidential_idx" ON "cases"("isConfidential");
CREATE TABLE "new_team_members" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "team_members_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "team_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "team_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "employees" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_team_members" ("id", "isActive", "joinedAt", "leftAt", "role", "teamId", "userId") SELECT "id", "isActive", "joinedAt", "leftAt", "role", "teamId", "userId" FROM "team_members";
DROP TABLE "team_members";
ALTER TABLE "new_team_members" RENAME TO "team_members";
CREATE INDEX "team_members_teamId_idx" ON "team_members"("teamId");
CREATE INDEX "team_members_userId_idx" ON "team_members"("userId");
CREATE INDEX "team_members_isActive_idx" ON "team_members"("isActive");
CREATE UNIQUE INDEX "team_members_teamId_userId_key" ON "team_members"("teamId", "userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "employees_employeeId_key" ON "employees"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "employees_userId_key" ON "employees"("userId");

-- CreateIndex
CREATE INDEX "employees_employeeId_idx" ON "employees"("employeeId");

-- CreateIndex
CREATE INDEX "employees_userId_idx" ON "employees"("userId");

-- CreateIndex
CREATE INDEX "employees_department_idx" ON "employees"("department");

-- CreateIndex
CREATE INDEX "employees_designation_idx" ON "employees"("designation");

-- CreateIndex
CREATE INDEX "employees_employmentType_idx" ON "employees"("employmentType");

-- CreateIndex
CREATE INDEX "employees_isActive_idx" ON "employees"("isActive");

-- CreateIndex
CREATE INDEX "employees_reportingManager_idx" ON "employees"("reportingManager");

-- CreateIndex
CREATE UNIQUE INDEX "projects_code_key" ON "projects"("code");

-- CreateIndex
CREATE INDEX "projects_code_idx" ON "projects"("code");

-- CreateIndex
CREATE INDEX "projects_status_idx" ON "projects"("status");

-- CreateIndex
CREATE INDEX "projects_priority_idx" ON "projects"("priority");

-- CreateIndex
CREATE INDEX "projects_type_idx" ON "projects"("type");

-- CreateIndex
CREATE INDEX "projects_clientId_idx" ON "projects"("clientId");

-- CreateIndex
CREATE INDEX "projects_teamId_idx" ON "projects"("teamId");

-- CreateIndex
CREATE INDEX "projects_managerId_idx" ON "projects"("managerId");

-- CreateIndex
CREATE INDEX "projects_isActive_idx" ON "projects"("isActive");

-- CreateIndex
CREATE INDEX "sla_rules_entityType_idx" ON "sla_rules"("entityType");

-- CreateIndex
CREATE INDEX "sla_rules_entitySubType_idx" ON "sla_rules"("entitySubType");

-- CreateIndex
CREATE INDEX "sla_rules_priority_idx" ON "sla_rules"("priority");

-- CreateIndex
CREATE INDEX "sla_rules_teamId_idx" ON "sla_rules"("teamId");

-- CreateIndex
CREATE INDEX "sla_rules_isActive_idx" ON "sla_rules"("isActive");

-- CreateIndex
CREATE INDEX "sla_evaluations_entityType_idx" ON "sla_evaluations"("entityType");

-- CreateIndex
CREATE INDEX "sla_evaluations_entityId_idx" ON "sla_evaluations"("entityId");

-- CreateIndex
CREATE INDEX "sla_evaluations_slaRuleId_idx" ON "sla_evaluations"("slaRuleId");

-- CreateIndex
CREATE INDEX "sla_evaluations_employeeId_idx" ON "sla_evaluations"("employeeId");

-- CreateIndex
CREATE INDEX "sla_evaluations_status_idx" ON "sla_evaluations"("status");

-- CreateIndex
CREATE INDEX "sla_evaluations_breachDate_idx" ON "sla_evaluations"("breachDate");

-- CreateIndex
CREATE INDEX "sla_evaluations_escalationDate_idx" ON "sla_evaluations"("escalationDate");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_priority_idx" ON "notifications"("priority");

-- CreateIndex
CREATE INDEX "notifications_entityType_idx" ON "notifications"("entityType");

-- CreateIndex
CREATE INDEX "notifications_entityId_idx" ON "notifications"("entityId");

-- CreateIndex
CREATE INDEX "notifications_isRead_idx" ON "notifications"("isRead");

-- CreateIndex
CREATE INDEX "notifications_scheduledAt_idx" ON "notifications"("scheduledAt");

-- CreateIndex
CREATE INDEX "notifications_expiresAt_idx" ON "notifications"("expiresAt");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "files_hash_key" ON "files"("hash");

-- CreateIndex
CREATE INDEX "files_hash_idx" ON "files"("hash");

-- CreateIndex
CREATE INDEX "files_uploadedBy_idx" ON "files"("uploadedBy");

-- CreateIndex
CREATE INDEX "files_caseId_idx" ON "files"("caseId");

-- CreateIndex
CREATE INDEX "files_orderId_idx" ON "files"("orderId");

-- CreateIndex
CREATE INDEX "files_mimeType_idx" ON "files"("mimeType");

-- CreateIndex
CREATE INDEX "files_uploadedAt_idx" ON "files"("uploadedAt");

-- CreateIndex
CREATE INDEX "files_isDeleted_idx" ON "files"("isDeleted");

-- CreateIndex
CREATE INDEX "files_deletedAt_idx" ON "files"("deletedAt");
