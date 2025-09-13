# IPC API Documentation

The LNN Legal Desktop application exposes a comprehensive IPC (Inter-Process Communication) API for secure communication between the renderer process (web UI) and the main process (Electron backend).

## Security Features

- ✅ **Channel Whitelist**: Only predefined channels are allowed
- ✅ **Context Isolation**: Renderer process cannot access Node.js APIs directly
- ✅ **Type Safety**: Full TypeScript support with type definitions
- ✅ **Error Handling**: Consistent error responses across all endpoints

## API Structure

All IPC calls are available through `window.app` in the renderer process:

```typescript
// Generic invoke method
window.app.invoke(channel: string, payload?: any): Promise<any>

// Convenience methods for common operations
window.app.getVersion(): Promise<string>
window.app.quit(): Promise<void>
// ... etc
```

## API Endpoints

### App Controls

#### `app:getVersion`
Get the application version.

```typescript
const version = await window.app.getVersion()
// Returns: "1.0.0"
```

#### `app:quit`
Quit the application.

```typescript
await window.app.quit()
```

#### `app:minimize`
Minimize the application window.

```typescript
await window.app.minimize()
```

#### `app:maximize`
Maximize or restore the application window.

```typescript
await window.app.maximize()
```

#### `app:close`
Close the application window.

```typescript
await window.app.close()
```

#### `app:showMessageBox`
Show a native message box dialog.

```typescript
const result = await window.app.showMessageBox({
  type: 'info',
  title: 'Confirmation',
  message: 'Are you sure?',
  buttons: ['Yes', 'No']
})
```

#### `app:showOpenDialog`
Show a native file open dialog.

```typescript
const result = await window.app.showOpenDialog({
  properties: ['openFile'],
  filters: [
    { name: 'Documents', extensions: ['pdf', 'doc', 'docx'] }
  ]
})
```

#### `app:showSaveDialog`
Show a native file save dialog.

```typescript
const result = await window.app.showSaveDialog({
  defaultPath: 'backup.zip',
  filters: [
    { name: 'ZIP Files', extensions: ['zip'] }
  ]
})
```

### Cases Operations

#### `cases:addByCnr`
Add a new case using CNR (Case Number Registry) data.

```typescript
const result = await window.app.cases.addByCnr({
  cnrNumber: 'CNR123456789',
  title: 'Contract Dispute',
  description: 'Contract dispute resolution case',
  clientId: 'client-123',
  assignedLawyerId: 'lawyer-456'
})

// Returns: { success: true, data: { id, caseNumber, title, ... } }
```

#### `cases:search`
Search for cases with various criteria.

```typescript
const result = await window.app.cases.search({
  query: 'contract',
  status: 'OPEN',
  priority: 'HIGH',
  assignedLawyer: 'lawyer-456'
})

// Returns: { success: true, data: [case1, case2, ...] }
```

### eCourts Operations

#### `ecourts:syncNow`
Synchronize with eCourts system.

```typescript
const result = await window.app.ecourts.syncNow({
  courtCode: 'DL01',
  syncType: 'full', // 'full' | 'incremental'
  dateRange: {
    from: '2024-01-01',
    to: '2024-12-31'
  }
})

// Returns: { success: true, data: { syncedCases, updatedCases, newCases, errors, lastSync } }
```

### Tasks Operations

#### `tasks:create`
Create a new task.

```typescript
const result = await window.app.tasks.create({
  title: 'Review contract documents',
  description: 'Review the contract agreement for ABC Corporation case',
  caseId: 'case-123',
  assignedTo: 'lawyer-456',
  priority: 'HIGH',
  dueDate: '2024-02-15'
})

// Returns: { success: true, data: { id, title, status, ... } }
```

#### `tasks:list`
List tasks with optional filtering.

```typescript
const result = await window.app.tasks.list({
  assignedTo: 'lawyer-456',
  status: 'PENDING',
  priority: 'HIGH',
  limit: 50,
  offset: 0
})

// Returns: { success: true, data: [task1, task2, ...] }
```

#### `tasks:transition`
Transition a task to a new status.

```typescript
const result = await window.app.tasks.transition({
  taskId: 'task-123',
  newStatus: 'IN_PROGRESS',
  userId: 'user-456',
  notes: 'Started working on the task'
})

// Returns: { success: true, data: { id, status, updatedAt, transitionedBy } }
```

### Office Operations

#### `office:listPendingForUser`
Get all pending items for a specific user.

```typescript
const result = await window.app.office.listPendingForUser({
  userId: 'user-123',
  includeTasks: true,
  includeCases: true,
  includeHearings: true
})

// Returns: { success: true, data: { tasks: [...], cases: [...], hearings: [...] } }
```

#### `office:createPersonalTask`
Create a personal task for a user.

```typescript
const result = await window.app.office.createPersonalTask({
  title: 'Prepare for meeting',
  description: 'Prepare agenda for client meeting',
  priority: 'MEDIUM',
  dueDate: '2024-02-20',
  userId: 'user-123'
})

// Returns: { success: true, data: { id, title, status, createdBy, ... } }
```

### Files Operations

#### `files:openPdf`
Open a PDF file in the default system viewer.

```typescript
const result = await window.app.files.openPdf({
  filePath: '/path/to/document.pdf',
  caseId: 'case-123',
  documentId: 'doc-456'
})

// Returns: { success: true, data: { filePath, opened, timestamp } }
```

### Backup Operations

#### `backup:exportNow`
Export a backup of the application data.

```typescript
const result = await window.app.backup.exportNow({
  includeCases: true,
  includeTasks: true,
  includeDocuments: true,
  includeSettings: true,
  compressionLevel: 'high'
})

// Returns: { success: true, data: { backupId, filePath, size, createdAt, status } }
```

#### `backup:restoreFromZip`
Restore application data from a backup ZIP file.

```typescript
const result = await window.app.backup.restoreFromZip({
  filePath: '/path/to/backup.zip',
  restoreOptions: {
    overwriteExisting: true,
    restoreCases: true,
    restoreTasks: true,
    restoreDocuments: true
  }
})

// Returns: { success: true, data: { restoreId, filePath, restoredAt, status, restoredItems } }
```

## Error Handling

All IPC calls return a consistent response format:

```typescript
// Success response
{
  success: true,
  data: any
}

// Error response
{
  success: false,
  error: string
}
```

### Example Error Handling

```typescript
try {
  const result = await window.app.cases.addByCnr(cnrData)
  
  if (result.success) {
    console.log('Case created:', result.data)
  } else {
    console.error('Error:', result.error)
  }
} catch (error) {
  console.error('IPC Error:', error)
}
```

## Usage Examples

### React Component Example

```typescript
import React, { useState, useEffect } from 'react'

const CasesPage: React.FC = () => {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(false)

  const searchCases = async (query: string) => {
    setLoading(true)
    try {
      const result = await window.app.cases.search({ query })
      if (result.success) {
        setCases(result.data)
      } else {
        console.error('Search failed:', result.error)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const addCaseByCnr = async (cnrData: any) => {
    try {
      const result = await window.app.cases.addByCnr(cnrData)
      if (result.success) {
        // Refresh cases list
        await searchCases('')
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      alert(`Error: ${error}`)
    }
  }

  return (
    <div>
      {/* Your UI components */}
    </div>
  )
}
```

### Task Management Example

```typescript
const TaskManager = {
  async createTask(taskData: any) {
    const result = await window.app.tasks.create(taskData)
    return result
  },

  async listTasks(filters: any) {
    const result = await window.app.tasks.list(filters)
    return result
  },

  async transitionTask(taskId: string, newStatus: string, userId: string) {
    const result = await window.app.tasks.transition({
      taskId,
      newStatus,
      userId
    })
    return result
  }
}
```

## Development Notes

### Adding New IPC Handlers

1. **Add handler in main.ts**:
   ```typescript
   ipcMain.handle('new:operation', async (event, data) => {
     try {
       // Implementation
       return { success: true, data: result }
     } catch (error) {
       return { success: false, error: error.message }
     }
   })
   ```

2. **Add to preload.ts whitelist**:
   ```typescript
   const validChannels = [
     // ... existing channels
     'new:operation',
   ]
   ```

3. **Add convenience method**:
   ```typescript
   newOperation: (data: any) => ipcRenderer.invoke('new:operation', data),
   ```

4. **Update TypeScript definitions**:
   ```typescript
   newOperation: (data: any) => Promise<any>
   ```

### Testing IPC Calls

```typescript
// Test in browser console
window.app.getVersion().then(console.log)
window.app.cases.search({ query: 'test' }).then(console.log)
```

## Security Considerations

- All IPC channels are whitelisted for security
- Sensitive operations require proper authentication
- File operations are sandboxed to prevent unauthorized access
- Error messages don't expose internal implementation details

## Performance Notes

- IPC calls are asynchronous and non-blocking
- Large data transfers should be chunked for better performance
- Consider caching frequently accessed data in the renderer process
- Use pagination for large result sets
