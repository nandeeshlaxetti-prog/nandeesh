# Audit Logging & Permissions System Documentation

This document provides comprehensive documentation for the Audit Logging & Permissions System, including comprehensive audit logging for all Case/Task/Hearing/Order writes, role-based permissions, and PII field hiding based on user roles.

## Overview

The Audit Logging & Permissions System provides:
- **Comprehensive Audit Logging**: Log all Case/Task/Hearing/Order writes with detailed change tracking
- **Role-Based Permissions**: Partners see all; others scoped by team/case
- **PII Field Hiding**: Hide sensitive fields based on user role
- **Audit Middleware**: Seamless integration with repositories
- **Permission Enforcement**: Automatic permission checking and data filtering
- **Audit Query Service**: Advanced querying and reporting capabilities
- **Export Functionality**: Export audit logs in multiple formats

## System Architecture

### Core Components

#### **Audit Logging Service**
- **Comprehensive Logging**: Log all entity operations (CREATE, UPDATE, DELETE, VIEW, ASSIGN, STATUS_CHANGE)
- **Change Tracking**: Detailed tracking of field-level changes
- **Metadata Support**: Rich metadata and context information
- **Query Capabilities**: Advanced querying and filtering
- **Export Functionality**: JSON and CSV export capabilities
- **Statistics**: Audit log statistics and analytics

#### **Permissions Service**
- **Role-Based Access Control**: ADMIN, PARTNER, LAWYER, PARALEGAL, CLIENT, SUPPORT roles
- **Entity-Level Permissions**: View, edit, delete permissions per entity type
- **Team/Case Scoping**: Access scoped by team and case membership
- **PII Field Management**: Configurable PII field hiding and masking
- **Permission Inheritance**: Hierarchical permission inheritance
- **Accessible Entities**: Get user's accessible entities

#### **Audit Middleware**
- **Seamless Integration**: Easy integration with existing repositories
- **Automatic Logging**: Automatic audit logging for all operations
- **Permission Checking**: Built-in permission checking
- **Data Filtering**: Automatic PII field filtering
- **Context Management**: Request context and metadata handling
- **Batch Operations**: Support for batch audit logging

### Data Flow

1. **Entity Operation** → Repository method called
2. **Permission Check** → Check user permissions for operation
3. **Data Filtering** → Filter PII fields based on user role
4. **Operation Execution** → Execute the actual operation
5. **Audit Logging** → Log the operation with detailed changes
6. **Response Filtering** → Filter response data based on permissions

## Audit Logging

### Audit Log Structure

```typescript
interface AuditLogEntry {
  id: string
  userId: string
  entityType: 'CASE' | 'TASK' | 'HEARING' | 'ORDER' | 'DOCUMENT' | 'USER' | 'TEAM'
  entityId: string
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'ASSIGN' | 'STATUS_CHANGE'
  oldValues?: Record<string, any>
  newValues?: Record<string, any>
  changes?: Record<string, { old: any; new: any }>
  metadata?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  timestamp: Date
}
```

### Audit Actions

#### **CREATE**
- **Trigger**: When new entity is created
- **Data**: New entity values
- **Use Case**: Track entity creation

#### **UPDATE**
- **Trigger**: When entity is updated
- **Data**: Old values, new values, field-level changes
- **Use Case**: Track entity modifications

#### **DELETE**
- **Trigger**: When entity is deleted
- **Data**: Old entity values
- **Use Case**: Track entity deletion

#### **VIEW**
- **Trigger**: When entity is viewed
- **Data**: View metadata
- **Use Case**: Track entity access

#### **ASSIGN**
- **Trigger**: When entity is assigned to user
- **Data**: Old assignee, new assignee
- **Use Case**: Track assignment changes

#### **STATUS_CHANGE**
- **Trigger**: When entity status changes
- **Data**: Old status, new status
- **Use Case**: Track status transitions

### Audit Logging Examples

#### **Entity Creation**
```typescript
await auditLoggingService.logEntityCreation(
  'user-id',
  'TASK',
  'task-id',
  {
    title: 'New Task',
    description: 'Task description',
    status: 'PENDING',
    priority: 'MEDIUM'
  },
  { source: 'web-app' },
  '192.168.1.1',
  'Mozilla/5.0...'
)
```

#### **Entity Update**
```typescript
await auditLoggingService.logEntityUpdate(
  'user-id',
  'TASK',
  'task-id',
  { title: 'Old Task', status: 'PENDING' },
  { title: 'Updated Task', status: 'IN_PROGRESS' },
  {
    title: { old: 'Old Task', new: 'Updated Task' },
    status: { old: 'PENDING', new: 'IN_PROGRESS' }
  },
  { source: 'web-app' },
  '192.168.1.1',
  'Mozilla/5.0...'
)
```

#### **Entity Assignment**
```typescript
await auditLoggingService.logEntityAssignment(
  'user-id',
  'TASK',
  'task-id',
  'old-assignee-id',
  'new-assignee-id',
  { source: 'web-app' },
  '192.168.1.1',
  'Mozilla/5.0...'
)
```

## Role-Based Permissions

### User Roles

#### **ADMIN**
- **View All**: Can view all entities
- **Edit All**: Can edit all entities
- **Delete All**: Can delete all entities
- **View PII**: Can view all PII fields
- **Edit PII**: Can edit all PII fields
- **View Audit Logs**: Can view all audit logs
- **Export Data**: Can export all data
- **Manage Users**: Can manage user accounts
- **Manage Teams**: Can manage teams

#### **PARTNER**
- **View All**: Can view all entities
- **Edit All**: Can edit all entities
- **Delete All**: Cannot delete entities
- **View PII**: Can view all PII fields
- **Edit PII**: Can edit all PII fields
- **View Audit Logs**: Can view all audit logs
- **Export Data**: Can export all data
- **Manage Users**: Cannot manage user accounts
- **Manage Teams**: Can manage teams

#### **LAWYER**
- **View All**: Cannot view all entities (scoped by team/case)
- **Edit All**: Cannot edit all entities (scoped by team/case)
- **Delete All**: Cannot delete entities
- **View PII**: Can view PII fields
- **Edit PII**: Cannot edit PII fields
- **View Audit Logs**: Cannot view audit logs
- **Export Data**: Cannot export data
- **Manage Users**: Cannot manage user accounts
- **Manage Teams**: Cannot manage teams

#### **PARALEGAL**
- **View All**: Cannot view all entities (scoped by team/case)
- **Edit All**: Cannot edit all entities (scoped by team/case)
- **Delete All**: Cannot delete entities
- **View PII**: Cannot view PII fields
- **Edit PII**: Cannot edit PII fields
- **View Audit Logs**: Cannot view audit logs
- **Export Data**: Cannot export data
- **Manage Users**: Cannot manage user accounts
- **Manage Teams**: Cannot manage teams

#### **CLIENT**
- **View All**: Cannot view all entities (scoped to own cases)
- **Edit All**: Cannot edit entities
- **Delete All**: Cannot delete entities
- **View PII**: Cannot view PII fields
- **Edit PII**: Cannot edit PII fields
- **View Audit Logs**: Cannot view audit logs
- **Export Data**: Cannot export data
- **Manage Users**: Cannot manage user accounts
- **Manage Teams**: Cannot manage teams

#### **SUPPORT**
- **View All**: Cannot view all entities (scoped by team/case)
- **Edit All**: Cannot edit entities
- **Delete All**: Cannot delete entities
- **View PII**: Cannot view PII fields
- **Edit PII**: Cannot edit PII fields
- **View Audit Logs**: Cannot view audit logs
- **Export Data**: Cannot export data
- **Manage Users**: Cannot manage user accounts
- **Manage Teams**: Cannot manage teams

### Permission Checking

#### **Entity Access**
```typescript
// Check if user can view entity
const canView = await permissionsService.canViewEntity('user-id', 'TASK', 'task-id')

// Check if user can edit entity
const canEdit = await permissionsService.canEditEntity('user-id', 'TASK', 'task-id')

// Check if user can delete entity
const canDelete = await permissionsService.canDeleteEntity('user-id', 'TASK', 'task-id')
```

#### **Special Permissions**
```typescript
// Check if user can view audit logs
const canViewAuditLogs = await permissionsService.canViewAuditLogs('user-id')

// Check if user can export data
const canExportData = await permissionsService.canExportData('user-id')

// Check if user can manage users
const canManageUsers = await permissionsService.canManageUsers('user-id')

// Check if user can manage teams
const canManageTeams = await permissionsService.canManageTeams('user-id')
```

## PII Field Hiding

### PII Field Configuration

```typescript
interface PIIFieldConfig {
  field: string
  hideForRoles: string[]
  maskForRoles: string[]
  maskPattern?: string
}
```

### Default PII Fields

#### **User PII Fields**
- **email**: Hidden for CLIENT, masked for PARALEGAL
- **phone**: Hidden for CLIENT, masked for PARALEGAL
- **address**: Hidden for CLIENT, masked for PARALEGAL
- **dateOfBirth**: Hidden for CLIENT, masked for PARALEGAL
- **salary**: Hidden for CLIENT and PARALEGAL, masked for LAWYER
- **passwordHash**: Hidden for CLIENT, PARALEGAL, and LAWYER

#### **Case PII Fields**
- **clientId**: Masked for PARALEGAL
- **caseValue**: Hidden for CLIENT, masked for PARALEGAL
- **isConfidential**: Hidden for CLIENT, masked for PARALEGAL

#### **Document PII Fields**
- **uploadedBy**: Masked for PARALEGAL
- **mimeType**: Masked for PARALEGAL

#### **Task PII Fields**
- **assignedTo**: Masked for PARALEGAL
- **createdBy**: Masked for PARALEGAL
- **isConfidential**: Hidden for CLIENT, masked for PARALEGAL

#### **Hearing PII Fields**
- **scheduledDate**: Masked for PARALEGAL
- **location**: Masked for PARALEGAL

#### **Order PII Fields**
- **orderNumber**: Masked for PARALEGAL
- **orderDate**: Masked for PARALEGAL
- **effectiveDate**: Masked for PARALEGAL

### PII Field Management

#### **Filter Entity Data**
```typescript
const filteredData = await permissionsService.filterEntityData(
  'user-id',
  'TASK',
  {
    id: 'task-id',
    title: 'Test Task',
    email: 'test@example.com',
    phone: '123-456-7890',
    isConfidential: true
  }
)
```

#### **Update PII Configuration**
```typescript
permissionsService.updatePIIFieldConfig({
  field: 'customField',
  hideForRoles: ['CLIENT'],
  maskForRoles: ['PARALEGAL'],
  maskPattern: '***'
})
```

#### **Get PII Configuration**
```typescript
const piiConfigs = permissionsService.getPIIFieldConfigs()
```

## Audit Middleware

### Repository Integration

#### **Task Repository Example**
```typescript
export class TaskRepository {
  async create(data: TaskCreateInput, auditContext?: AuditContext): Promise<TaskWithRelations> {
    const createOperation = async () => {
      // Actual create operation
      return await this.prisma.task.create({ data })
    }

    if (auditContext) {
      return await AuditMiddleware.wrapCreate(
        createOperation,
        'TASK',
        auditContext
      )
    } else {
      return await createOperation()
    }
  }

  async update(id: string, data: TaskUpdateInput, auditContext?: AuditContext): Promise<TaskWithRelations> {
    // Get old values for audit logging
    const oldTask = await this.prisma.task.findUnique({ where: { id } })

    const updateOperation = async () => {
      // Actual update operation
      return await this.prisma.task.update({ where: { id }, data })
    }

    if (auditContext) {
      return await AuditMiddleware.wrapUpdate(
        updateOperation,
        'TASK',
        id,
        oldTask,
        auditContext
      )
    } else {
      return await updateOperation()
    }
  }
}
```

### Audit Context Creation

```typescript
const auditContext = AuditMiddleware.createAuditContext('user-id', {
  ip: '192.168.1.1',
  headers: { 'user-agent': 'Mozilla/5.0...' },
  body: { requestData: 'value' }
})
```

### Permission Checking

```typescript
// Check permissions before operation
const canView = await AuditMiddleware.checkPermissions('user-id', 'VIEW', 'TASK', 'task-id')
const canEdit = await AuditMiddleware.checkPermissions('user-id', 'EDIT', 'TASK', 'task-id')
const canDelete = await AuditMiddleware.checkPermissions('user-id', 'DELETE', 'TASK', 'task-id')
```

### Data Filtering

```typescript
// Filter entity data based on permissions
const filteredData = await AuditMiddleware.filterEntityData('user-id', 'TASK', entityData)
```

## Audit Query Service

### Basic Queries

#### **Get Audit Logs**
```typescript
const auditLogs = await auditLoggingService.getAuditLogs({
  userId: 'user-id',
  entityType: 'TASK',
  action: 'UPDATE',
  dateFrom: new Date('2024-01-01'),
  dateTo: new Date('2024-12-31'),
  limit: 50,
  offset: 0
})
```

#### **Get Entity Audit Logs**
```typescript
const entityLogs = await auditLoggingService.getEntityAuditLogs('TASK', 'task-id', 50, 0)
```

#### **Get User Audit Logs**
```typescript
const userLogs = await auditLoggingService.getUserAuditLogs('user-id', 50, 0)
```

### Advanced Queries

#### **Search Audit Logs**
```typescript
const searchResults = await auditLoggingService.searchAuditLogs('TASK', 50, 0)
```

#### **Get Audit Log Summary**
```typescript
const summary = await auditLoggingService.getAuditLogSummary(
  new Date('2024-01-01'),
  new Date('2024-12-31')
)
```

#### **Get Audit Log Statistics**
```typescript
const stats = await auditLoggingService.getAuditLogStatistics(
  new Date('2024-01-01'),
  new Date('2024-12-31')
)
```

### Export Functionality

#### **JSON Export**
```typescript
const jsonExport = await auditLoggingService.exportAuditLogs({
  userId: 'user-id',
  limit: 100,
  offset: 0
}, 'JSON')
```

#### **CSV Export**
```typescript
const csvExport = await auditLoggingService.exportAuditLogs({
  userId: 'user-id',
  limit: 100,
  offset: 0
}, 'CSV')
```

## Database Schema

### Audit Log Table

```sql
CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL,
  old_values TEXT,
  new_values TEXT,
  changes TEXT,
  metadata TEXT,
  ip_address TEXT,
  user_agent TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_logs_ip_address ON audit_logs(ip_address);
```

## Usage Examples

### Basic Audit Logging

```typescript
import { auditLoggingService } from 'data'

// Log entity creation
await auditLoggingService.logEntityCreation(
  'user-id',
  'TASK',
  'task-id',
  { title: 'New Task', status: 'PENDING' },
  { source: 'web-app' },
  '192.168.1.1',
  'Mozilla/5.0...'
)

// Log entity update
await auditLoggingService.logEntityUpdate(
  'user-id',
  'TASK',
  'task-id',
  { title: 'Old Task', status: 'PENDING' },
  { title: 'Updated Task', status: 'IN_PROGRESS' },
  {
    title: { old: 'Old Task', new: 'Updated Task' },
    status: { old: 'PENDING', new: 'IN_PROGRESS' }
  },
  { source: 'web-app' },
  '192.168.1.1',
  'Mozilla/5.0...'
)
```

### Permission Checking

```typescript
import { permissionsService } from 'data'

// Check if user can view entity
const canView = await permissionsService.canViewEntity('user-id', 'TASK', 'task-id')
if (!canView.allowed) {
  throw new Error('Access denied')
}

// Check if user can edit entity
const canEdit = await permissionsService.canEditEntity('user-id', 'TASK', 'task-id')
if (!canEdit.allowed) {
  throw new Error('Edit permission denied')
}

// Filter entity data
const filteredData = await permissionsService.filterEntityData('user-id', 'TASK', entityData)
```

### Audit Middleware Usage

```typescript
import { AuditMiddleware } from 'data'

// Create audit context
const auditContext = AuditMiddleware.createAuditContext('user-id', {
  ip: '192.168.1.1',
  headers: { 'user-agent': 'Mozilla/5.0...' },
  body: { requestData: 'value' }
})

// Use in repository
const taskRepo = new TaskRepository()
const task = await taskRepo.create(taskData, auditContext)
```

### Audit Log Queries

```typescript
import { auditLoggingService } from 'data'

// Get audit logs with filtering
const auditLogs = await auditLoggingService.getAuditLogs({
  userId: 'user-id',
  entityType: 'TASK',
  action: 'UPDATE',
  dateFrom: new Date('2024-01-01'),
  dateTo: new Date('2024-12-31'),
  limit: 50,
  offset: 0
})

// Get audit log summary
const summary = await auditLoggingService.getAuditLogSummary()

// Export audit logs
const exportData = await auditLoggingService.exportAuditLogs({
  userId: 'user-id',
  limit: 100,
  offset: 0
}, 'JSON')
```

## Security Considerations

### Data Security

- **Input Validation**: All inputs validated using Zod schemas
- **User Authorization**: User-specific data access control
- **PII Protection**: Automatic PII field hiding and masking
- **Audit Logging**: All operations logged for compliance
- **Permission Enforcement**: Strict permission checking

### Performance Considerations

### Optimization

- **Database Indexing**: Optimized indexes for audit log queries
- **Data Filtering**: Efficient PII field filtering
- **Batch Operations**: Support for batch audit logging
- **Caching**: Permission and PII configuration caching

## Future Enhancements

### Planned Features

- **Advanced Analytics**: Audit log analytics and reporting
- **Real-Time Monitoring**: Real-time audit log monitoring
- **Compliance Reporting**: Automated compliance reporting
- **Data Retention**: Automated data retention policies
- **Advanced Permissions**: More granular permission controls
- **Audit Log Encryption**: Encrypted audit log storage

### Performance Improvements

- **Distributed Logging**: Distributed audit log storage
- **Advanced Caching**: Redis-based caching for permissions
- **Query Optimization**: Advanced query optimization
- **Compression**: Audit log data compression

This Audit Logging & Permissions System provides a comprehensive solution for audit logging and access control while maintaining high performance and security standards. The system is designed to be extensible and can accommodate future enhancements and custom requirements.
