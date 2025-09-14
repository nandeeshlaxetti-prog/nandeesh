/*
  Warnings:

  - A unique constraint covering the columns `[orderNumber]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,date]` on the table `user_pending_summaries` will be added. If there are existing duplicate values, this will fail.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
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
    "recurrenceJSON" TEXT,
    "parentTaskId" TEXT,
    "dependencies" TEXT NOT NULL DEFAULT '[]',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "isConfidential" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "tasks_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tasks_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tasks_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tasks_parentTaskId_fkey" FOREIGN KEY ("parentTaskId") REFERENCES "tasks" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_tasks" ("actualHours", "assignedTo", "attachments", "caseId", "category", "completedAt", "createdAt", "createdBy", "dependencies", "description", "dueDate", "estimatedHours", "id", "isConfidential", "isRecurring", "notes", "parentTaskId", "priority", "progress", "recurrenceJSON", "recurringPattern", "status", "tags", "title", "updatedAt") SELECT "actualHours", "assignedTo", "attachments", "caseId", "category", "completedAt", "createdAt", "createdBy", "dependencies", "description", "dueDate", "estimatedHours", "id", "isConfidential", "isRecurring", "notes", "parentTaskId", "priority", "progress", "recurrenceJSON", "recurringPattern", "status", "tags", "title", "updatedAt" FROM "tasks";
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
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "user_pending_summaries_userId_date_key" ON "user_pending_summaries"("userId", "date");
