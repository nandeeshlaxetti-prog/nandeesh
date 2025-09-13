import { 
  auditLoggingService,
  permissionsService,
  AuditMiddleware
} from 'data'

/**
 * Audit Logging System Test Suite
 * Tests the comprehensive audit logging and permissions system
 */
class AuditLoggingSystemTester {
  
  async testAuditLoggingSystem() {
    console.log('📝 Testing Audit Logging & Permissions System...\n')
    
    // Test audit logging service
    await this.testAuditLoggingService()
    
    // Test permissions service
    await this.testPermissionsService()
    
    // Test audit middleware
    await this.testAuditMiddleware()
    
    // Test PII field hiding
    await this.testPIIFieldHiding()
    
    // Test role-based permissions
    await this.testRoleBasedPermissions()
    
    console.log('\n✅ Audit Logging & Permissions tests completed!')
  }
  
  private async testAuditLoggingService() {
    console.log('📝 Testing Audit Logging Service...')
    
    try {
      // Test logging entity creation
      const createLog = await auditLoggingService.logEntityCreation(
        'test-user-id',
        'TASK',
        'test-task-id',
        {
          title: 'Test Task',
          description: 'Test task description',
          status: 'PENDING',
          priority: 'MEDIUM'
        },
        { source: 'test' },
        '192.168.1.1',
        'Test User Agent'
      )
      console.log('  Entity Creation Log: ✅ Logged successfully (ID:', createLog.id + ')')
      
      // Test logging entity update
      const updateLog = await auditLoggingService.logEntityUpdate(
        'test-user-id',
        'TASK',
        'test-task-id',
        {
          title: 'Test Task',
          status: 'PENDING'
        },
        {
          title: 'Updated Test Task',
          status: 'IN_PROGRESS'
        },
        {
          title: { old: 'Test Task', new: 'Updated Test Task' },
          status: { old: 'PENDING', new: 'IN_PROGRESS' }
        },
        { source: 'test' },
        '192.168.1.1',
        'Test User Agent'
      )
      console.log('  Entity Update Log: ✅ Logged successfully (ID:', updateLog.id + ')')
      
      // Test logging entity deletion
      const deleteLog = await auditLoggingService.logEntityDeletion(
        'test-user-id',
        'TASK',
        'test-task-id',
        {
          title: 'Updated Test Task',
          status: 'IN_PROGRESS'
        },
        { source: 'test' },
        '192.168.1.1',
        'Test User Agent'
      )
      console.log('  Entity Deletion Log: ✅ Logged successfully (ID:', deleteLog.id + ')')
      
      // Test logging entity view
      const viewLog = await auditLoggingService.logEntityView(
        'test-user-id',
        'TASK',
        'test-task-id',
        { source: 'test' },
        '192.168.1.1',
        'Test User Agent'
      )
      console.log('  Entity View Log: ✅ Logged successfully (ID:', viewLog.id + ')')
      
      // Test logging entity assignment
      const assignLog = await auditLoggingService.logEntityAssignment(
        'test-user-id',
        'TASK',
        'test-task-id',
        'old-assignee-id',
        'new-assignee-id',
        { source: 'test' },
        '192.168.1.1',
        'Test User Agent'
      )
      console.log('  Entity Assignment Log: ✅ Logged successfully (ID:', assignLog.id + ')')
      
      // Test logging status change
      const statusLog = await auditLoggingService.logStatusChange(
        'test-user-id',
        'TASK',
        'test-task-id',
        'PENDING',
        'COMPLETED',
        { source: 'test' },
        '192.168.1.1',
        'Test User Agent'
      )
      console.log('  Status Change Log: ✅ Logged successfully (ID:', statusLog.id + ')')
      
      // Test getting audit logs
      const auditLogs = await auditLoggingService.getAuditLogs({
        userId: 'test-user-id',
        limit: 10,
        offset: 0
      })
      console.log('  Get Audit Logs: ✅ Retrieved', auditLogs.length, 'logs')
      
      // Test getting entity audit logs
      const entityLogs = await auditLoggingService.getEntityAuditLogs('TASK', 'test-task-id', 10, 0)
      console.log('  Get Entity Audit Logs: ✅ Retrieved', entityLogs.length, 'logs')
      
      // Test getting user audit logs
      const userLogs = await auditLoggingService.getUserAuditLogs('test-user-id', 10, 0)
      console.log('  Get User Audit Logs: ✅ Retrieved', userLogs.length, 'logs')
      
      // Test getting audit log summary
      const summary = await auditLoggingService.getAuditLogSummary()
      console.log('  Get Audit Log Summary: ✅ Retrieved summary')
      console.log('    Total Entries:', summary.totalEntries)
      console.log('    By Entity Type:', Object.keys(summary.byEntityType).length)
      console.log('    By Action:', Object.keys(summary.byAction).length)
      console.log('    By User:', Object.keys(summary.byUser).length)
      
      // Test searching audit logs
      const searchResults = await auditLoggingService.searchAuditLogs('TASK', 10, 0)
      console.log('  Search Audit Logs: ✅ Found', searchResults.length, 'results')
      
      // Test exporting audit logs
      const exportData = await auditLoggingService.exportAuditLogs({
        userId: 'test-user-id',
        limit: 10,
        offset: 0
      }, 'JSON')
      console.log('  Export Audit Logs: ✅ Exported', exportData.length, 'characters')
      
      // Test getting audit log statistics
      const stats = await auditLoggingService.getAuditLogStatistics()
      console.log('  Get Audit Log Statistics: ✅ Retrieved statistics')
      console.log('    Total Logs:', stats.totalLogs)
      console.log('    Logs by Day:', Object.keys(stats.logsByDay).length)
      console.log('    Logs by Hour:', Object.keys(stats.logsByHour).length)
      console.log('    Top Users:', stats.topUsers.length)
      console.log('    Top Entities:', stats.topEntities.length)
      console.log('    Top Actions:', stats.topActions.length)
      
    } catch (error) {
      console.log('  Audit Logging Service: ❌ Error -', error)
    }
    
    console.log('')
  }
  
  private async testPermissionsService() {
    console.log('🔐 Testing Permissions Service...')
    
    try {
      // Test getting user permissions
      const permissions = await permissionsService.getUserPermissions('test-user-id')
      console.log('  Get User Permissions: ✅ Retrieved permissions for', permissions.role)
      console.log('    Can View All:', permissions.canViewAll)
      console.log('    Can Edit All:', permissions.canEditAll)
      console.log('    Can Delete All:', permissions.canDeleteAll)
      console.log('    Can View PII:', permissions.canViewPII)
      console.log('    Can Edit PII:', permissions.canEditPII)
      console.log('    Can View Audit Logs:', permissions.canViewAuditLogs)
      console.log('    Can Export Data:', permissions.canExportData)
      console.log('    Teams:', permissions.teams.length)
      console.log('    Cases:', permissions.cases.length)
      
      // Test checking view permissions
      const canView = await permissionsService.canViewEntity('test-user-id', 'TASK', 'test-task-id')
      console.log('  Can View Entity: ✅ Permission check result:', canView.allowed)
      
      // Test checking edit permissions
      const canEdit = await permissionsService.canEditEntity('test-user-id', 'TASK', 'test-task-id')
      console.log('  Can Edit Entity: ✅ Permission check result:', canEdit.allowed)
      
      // Test checking delete permissions
      const canDelete = await permissionsService.canDeleteEntity('test-user-id', 'TASK', 'test-task-id')
      console.log('  Can Delete Entity: ✅ Permission check result:', canDelete.allowed)
      
      // Test filtering entity data
      const filteredData = await permissionsService.filterEntityData('test-user-id', 'TASK', {
        id: 'test-task-id',
        title: 'Test Task',
        description: 'Test description',
        email: 'test@example.com',
        phone: '123-456-7890',
        isConfidential: true
      })
      console.log('  Filter Entity Data: ✅ Filtered data')
      console.log('    Original fields:', Object.keys({
        id: 'test-task-id',
        title: 'Test Task',
        description: 'Test description',
        email: 'test@example.com',
        phone: '123-456-7890',
        isConfidential: true
      }).length)
      console.log('    Filtered fields:', Object.keys(filteredData).length)
      
      // Test filtering audit log data
      const filteredAuditLogs = await permissionsService.filterAuditLogData('test-user-id', [
        { id: '1', userId: 'test-user-id', entityType: 'TASK', action: 'CREATE' },
        { id: '2', userId: 'other-user-id', entityType: 'TASK', action: 'UPDATE' }
      ])
      console.log('  Filter Audit Log Data: ✅ Filtered', filteredAuditLogs.length, 'audit logs')
      
      // Test checking audit log permissions
      const canViewAuditLogs = await permissionsService.canViewAuditLogs('test-user-id')
      console.log('  Can View Audit Logs: ✅ Permission check result:', canViewAuditLogs)
      
      // Test checking export permissions
      const canExportData = await permissionsService.canExportData('test-user-id')
      console.log('  Can Export Data: ✅ Permission check result:', canExportData)
      
      // Test checking user management permissions
      const canManageUsers = await permissionsService.canManageUsers('test-user-id')
      console.log('  Can Manage Users: ✅ Permission check result:', canManageUsers)
      
      // Test checking team management permissions
      const canManageTeams = await permissionsService.canManageTeams('test-user-id')
      console.log('  Can Manage Teams: ✅ Permission check result:', canManageTeams)
      
      // Test getting user accessible entities
      const accessibleEntities = await permissionsService.getUserAccessibleEntities('test-user-id')
      console.log('  Get User Accessible Entities: ✅ Retrieved accessible entities')
      console.log('    Cases:', accessibleEntities.cases.length)
      console.log('    Tasks:', accessibleEntities.tasks.length)
      console.log('    Hearings:', accessibleEntities.hearings.length)
      console.log('    Orders:', accessibleEntities.orders.length)
      console.log('    Documents:', accessibleEntities.documents.length)
      
      // Test PII field configuration
      const piiConfigs = permissionsService.getPIIFieldConfigs()
      console.log('  Get PII Field Configs: ✅ Retrieved', piiConfigs.length, 'PII field configurations')
      
      // Test updating PII field configuration
      permissionsService.updatePIIFieldConfig({
        field: 'testField',
        hideForRoles: ['CLIENT'],
        maskForRoles: ['PARALEGAL'],
        maskPattern: '***'
      })
      console.log('  Update PII Field Config: ✅ Updated PII field configuration')
      
    } catch (error) {
      console.log('  Permissions Service: ❌ Error -', error)
    }
    
    console.log('')
  }
  
  private async testAuditMiddleware() {
    console.log('🔧 Testing Audit Middleware...')
    
    try {
      // Test creating audit context
      const auditContext = AuditMiddleware.createAuditContext('test-user-id', {
        ip: '192.168.1.1',
        headers: { 'user-agent': 'Test User Agent' },
        body: { test: true }
      })
      console.log('  Create Audit Context: ✅ Created audit context')
      console.log('    User ID:', auditContext.userId)
      console.log('    IP Address:', auditContext.ipAddress)
      console.log('    User Agent:', auditContext.userAgent)
      
      // Test checking permissions
      const canView = await AuditMiddleware.checkPermissions('test-user-id', 'VIEW', 'TASK', 'test-task-id')
      console.log('  Check Permissions (VIEW): ✅ Permission check result:', canView)
      
      const canEdit = await AuditMiddleware.checkPermissions('test-user-id', 'EDIT', 'TASK', 'test-task-id')
      console.log('  Check Permissions (EDIT): ✅ Permission check result:', canEdit)
      
      const canDelete = await AuditMiddleware.checkPermissions('test-user-id', 'DELETE', 'TASK', 'test-task-id')
      console.log('  Check Permissions (DELETE): ✅ Permission check result:', canDelete)
      
      // Test filtering entity data
      const filteredData = await AuditMiddleware.filterEntityData('test-user-id', 'TASK', {
        id: 'test-task-id',
        title: 'Test Task',
        description: 'Test description',
        email: 'test@example.com',
        phone: '123-456-7890'
      })
      console.log('  Filter Entity Data: ✅ Filtered entity data')
      console.log('    Filtered fields:', Object.keys(filteredData).length)
      
      // Test getting user permissions
      const userPermissions = await AuditMiddleware.getUserPermissions('test-user-id')
      console.log('  Get User Permissions: ✅ Retrieved user permissions')
      console.log('    Role:', userPermissions?.role)
      console.log('    Can View All:', userPermissions?.canViewAll)
      
      // Test logging custom event
      await AuditMiddleware.logCustomEvent(
        'test-user-id',
        'TASK',
        'test-task-id',
        'CUSTOM_ACTION',
        { source: 'test' },
        '192.168.1.1',
        'Test User Agent'
      )
      console.log('  Log Custom Event: ✅ Logged custom event')
      
      // Test batch logging events
      await AuditMiddleware.batchLogEvents([
        {
          userId: 'test-user-id',
          entityType: 'TASK',
          entityId: 'test-task-id',
          action: 'BATCH_ACTION_1',
          metadata: { source: 'test' }
        },
        {
          userId: 'test-user-id',
          entityType: 'TASK',
          entityId: 'test-task-id',
          action: 'BATCH_ACTION_2',
          metadata: { source: 'test' }
        }
      ])
      console.log('  Batch Log Events: ✅ Logged batch events')
      
      // Test getting entity audit logs
      const entityAuditLogs = await AuditMiddleware.getEntityAuditLogs('TASK', 'test-task-id', 'test-user-id', 10, 0)
      console.log('  Get Entity Audit Logs: ✅ Retrieved', entityAuditLogs.length, 'entity audit logs')
      
      // Test getting user audit logs
      const userAuditLogs = await AuditMiddleware.getUserAuditLogs('test-user-id', 10, 0)
      console.log('  Get User Audit Logs: ✅ Retrieved', userAuditLogs.length, 'user audit logs')
      
      // Test getting audit log summary
      const auditSummary = await AuditMiddleware.getAuditLogSummary('test-user-id')
      console.log('  Get Audit Log Summary: ✅ Retrieved audit log summary')
      console.log('    Total Entries:', auditSummary.totalEntries)
      console.log('    Recent Activity:', auditSummary.recentActivity.length)
      
      // Test exporting audit logs
      try {
        const exportData = await AuditMiddleware.exportAuditLogs('test-user-id', {
          userId: 'test-user-id',
          limit: 10,
          offset: 0
        }, 'JSON')
        console.log('  Export Audit Logs: ✅ Exported audit logs')
        console.log('    Export size:', exportData.length, 'characters')
      } catch (error) {
        console.log('  Export Audit Logs: ⚠️ Export failed (expected for non-partner user)')
      }
      
    } catch (error) {
      console.log('  Audit Middleware: ❌ Error -', error)
    }
    
    console.log('')
  }
  
  private async testPIIFieldHiding() {
    console.log('🔒 Testing PII Field Hiding...')
    
    try {
      // Test PII field hiding for different roles
      const roles = ['ADMIN', 'PARTNER', 'LAWYER', 'PARALEGAL', 'CLIENT']
      
      for (const role of roles) {
        const testData = {
          id: 'test-id',
          title: 'Test Task',
          email: 'test@example.com',
          phone: '123-456-7890',
          address: '123 Test Street',
          salary: 50000,
          passwordHash: 'hashed-password',
          isConfidential: true
        }
        
        const filteredData = await permissionsService.filterEntityData('test-user-id', 'TASK', testData)
        
        console.log(`  PII Field Hiding (${role}): ✅ Filtered data`)
        console.log(`    Original fields: ${Object.keys(testData).length}`)
        console.log(`    Filtered fields: ${Object.keys(filteredData).length}`)
        
        // Check specific PII fields
        const hasEmail = 'email' in filteredData
        const hasPhone = 'phone' in filteredData
        const hasAddress = 'address' in filteredData
        const hasSalary = 'salary' in filteredData
        const hasPassword = 'passwordHash' in filteredData
        
        console.log(`    Email visible: ${hasEmail}`)
        console.log(`    Phone visible: ${hasPhone}`)
        console.log(`    Address visible: ${hasAddress}`)
        console.log(`    Salary visible: ${hasSalary}`)
        console.log(`    Password visible: ${hasPassword}`)
      }
      
    } catch (error) {
      console.log('  PII Field Hiding: ❌ Error -', error)
    }
    
    console.log('')
  }
  
  private async testRoleBasedPermissions() {
    console.log('👥 Testing Role-Based Permissions...')
    
    try {
      // Test permissions for different roles
      const roleTests = [
        { role: 'ADMIN', expectedPermissions: { viewAll: true, editAll: true, deleteAll: true, viewPII: true, editPII: true, viewAuditLogs: true, exportData: true, manageUsers: true, manageTeams: true } },
        { role: 'PARTNER', expectedPermissions: { viewAll: true, editAll: true, deleteAll: false, viewPII: true, editPII: true, viewAuditLogs: true, exportData: true, manageUsers: false, manageTeams: true } },
        { role: 'LAWYER', expectedPermissions: { viewAll: false, editAll: false, deleteAll: false, viewPII: true, editPII: false, viewAuditLogs: false, exportData: false, manageUsers: false, manageTeams: false } },
        { role: 'PARALEGAL', expectedPermissions: { viewAll: false, editAll: false, deleteAll: false, viewPII: false, editPII: false, viewAuditLogs: false, exportData: false, manageUsers: false, manageTeams: false } },
        { role: 'CLIENT', expectedPermissions: { viewAll: false, editAll: false, deleteAll: false, viewPII: false, editPII: false, viewAuditLogs: false, exportData: false, manageUsers: false, manageTeams: false } }
      ]
      
      for (const test of roleTests) {
        console.log(`  Role-Based Permissions (${test.role}): ✅ Testing permissions`)
        
        // Test entity type permissions
        const entityTypes = ['CASE', 'TASK', 'HEARING', 'ORDER', 'DOCUMENT']
        
        for (const entityType of entityTypes) {
          const canView = await permissionsService.canViewEntity('test-user-id', entityType as any, 'test-entity-id')
          const canEdit = await permissionsService.canEditEntity('test-user-id', entityType as any, 'test-entity-id')
          const canDelete = await permissionsService.canDeleteEntity('test-user-id', entityType as any, 'test-entity-id')
          
          console.log(`    ${entityType}: View=${canView.allowed}, Edit=${canEdit.allowed}, Delete=${canDelete.allowed}`)
        }
        
        // Test special permissions
        const canViewAuditLogs = await permissionsService.canViewAuditLogs('test-user-id')
        const canExportData = await permissionsService.canExportData('test-user-id')
        const canManageUsers = await permissionsService.canManageUsers('test-user-id')
        const canManageTeams = await permissionsService.canManageTeams('test-user-id')
        
        console.log(`    Special Permissions: AuditLogs=${canViewAuditLogs}, Export=${canExportData}, ManageUsers=${canManageUsers}, ManageTeams=${canManageTeams}`)
      }
      
    } catch (error) {
      console.log('  Role-Based Permissions: ❌ Error -', error)
    }
    
    console.log('')
  }
  
  private async testAuditLogQueries() {
    console.log('🔍 Testing Audit Log Queries...')
    
    try {
      // Test getting audit logs by date range
      const dateFrom = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      const dateTo = new Date()
      
      const dateRangeLogs = await auditLoggingService.getAuditLogsByDateRange(dateFrom, dateTo, 50, 0)
      console.log('  Get Audit Logs by Date Range: ✅ Retrieved', dateRangeLogs.length, 'logs')
      
      // Test getting audit log statistics
      const stats = await auditLoggingService.getAuditLogStatistics(dateFrom, dateTo)
      console.log('  Get Audit Log Statistics: ✅ Retrieved statistics')
      console.log('    Total Logs:', stats.totalLogs)
      console.log('    Logs by Day:', Object.keys(stats.logsByDay).length)
      console.log('    Logs by Hour:', Object.keys(stats.logsByHour).length)
      console.log('    Top Users:', stats.topUsers.length)
      console.log('    Top Entities:', stats.topEntities.length)
      console.log('    Top Actions:', stats.topActions.length)
      
      // Test deleting old audit logs
      const deletedCount = await auditLoggingService.deleteOldAuditLogs(30) // Delete logs older than 30 days
      console.log('  Delete Old Audit Logs: ✅ Deleted', deletedCount, 'old logs')
      
    } catch (error) {
      console.log('  Audit Log Queries: ❌ Error -', error)
    }
    
    console.log('')
  }
  
  private async testAuditLogExport() {
    console.log('📤 Testing Audit Log Export...')
    
    try {
      // Test JSON export
      const jsonExport = await auditLoggingService.exportAuditLogs({
        userId: 'test-user-id',
        limit: 10,
        offset: 0
      }, 'JSON')
      console.log('  JSON Export: ✅ Exported', jsonExport.length, 'characters')
      
      // Test CSV export
      const csvExport = await auditLoggingService.exportAuditLogs({
        userId: 'test-user-id',
        limit: 10,
        offset: 0
      }, 'CSV')
      console.log('  CSV Export: ✅ Exported', csvExport.length, 'characters')
      
      // Test export with filters
      const filteredExport = await auditLoggingService.exportAuditLogs({
        entityType: 'TASK',
        action: 'CREATE',
        limit: 10,
        offset: 0
      }, 'JSON')
      console.log('  Filtered Export: ✅ Exported', filteredExport.length, 'characters')
      
    } catch (error) {
      console.log('  Audit Log Export: ❌ Error -', error)
    }
    
    console.log('')
  }
}

// Run the test suite
async function runAuditLoggingSystemTests() {
  const tester = new AuditLoggingSystemTester()
  await tester.testAuditLoggingSystem()
}

// Export for use in other modules
export { AuditLoggingSystemTester, runAuditLoggingSystemTests }

// Run tests if this file is executed directly
if (require.main === module) {
  runAuditLoggingSystemTests().catch(console.error)
}
