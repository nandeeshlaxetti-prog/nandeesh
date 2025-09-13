# Tasks Management System Documentation

This document provides comprehensive documentation for the Tasks management system in the `apps/web` application. The system provides a Kanban board interface, advanced filtering, My Work section, and quick-add functionality for personal tasks.

## Overview

The Tasks management system provides:
- **Kanban Board**: Visual task management with drag-and-drop functionality
- **Advanced Filters**: Comprehensive filtering by assignee, team, case, category, priority, and due date
- **My Work Section**: Time-based task organization (Overdue, Today, Next 7 Days, Blocked, Reviews Pending)
- **Quick Add**: Personal task creation with comprehensive form
- **Task Details**: Detailed task information and management
- **Responsive Design**: Mobile-friendly interface

## System Architecture

### Core Components

#### **KanbanBoard Component**
- **Purpose**: Visual task management with drag-and-drop
- **Columns**: Backlog, To Do, In Progress, In Review, Ready, Done
- **Features**: Drag-and-drop, priority indicators, due date warnings
- **Responsive**: Horizontal scrolling on mobile

#### **TaskFiltersComponent**
- **Purpose**: Advanced task filtering interface
- **Filters**: Assignee, team, case, category, priority, status, due date range
- **Features**: Active filter display, clear all, dynamic options

#### **MyWorkSection Component**
- **Purpose**: Time-based task organization
- **Sections**: Overdue, Today, Next 7 Days, Blocked, Reviews Pending
- **Features**: Tab navigation, task counts, quick access

#### **AddPersonalTask Component**
- **Purpose**: Quick personal task creation
- **Features**: Modal form, tag management, validation

### Data Flow

1. **Page Load** → Fetch tasks with current filters
2. **Filter Change** → Update filters and refetch tasks
3. **Drag & Drop** → Update task status and refresh
4. **Task Creation** → Create task and refresh list
5. **Task Click** → Show task details modal

## Kanban Board System

### Column Structure

#### **Column Definitions**
```typescript
const COLUMNS = [
  { id: 'BACKLOG', title: 'Backlog', color: 'bg-gray-100' },
  { id: 'TODO', title: 'To Do', color: 'bg-blue-100' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-yellow-100' },
  { id: 'IN_REVIEW', title: 'In Review', color: 'bg-purple-100' },
  { id: 'READY', title: 'Ready', color: 'bg-indigo-100' },
  { id: 'DONE', title: 'Done', color: 'bg-green-100' },
]
```

#### **Column Features**
- **Color Coding**: Distinct colors for each column
- **Task Count**: Shows number of tasks in each column
- **Drop Zones**: Accept dragged tasks from other columns
- **Empty States**: Helpful messages when no tasks

### Task Cards

#### **Card Information**
- **Title**: Task title with line clamping
- **Description**: Optional description with line clamping
- **Priority Badge**: Color-coded priority indicator
- **Category Badge**: Color-coded category indicator
- **Due Date**: Formatted due date with overdue warnings
- **Case Information**: Associated case details
- **Assignee**: User avatar and name

#### **Visual Design**

##### **Priority Colors**
- **LOW**: Gray (bg-gray-100 text-gray-800)
- **MEDIUM**: Blue (bg-blue-100 text-blue-800)
- **HIGH**: Orange (bg-orange-100 text-orange-800)
- **URGENT**: Red (bg-red-100 text-red-800)

##### **Category Colors**
- **CASE**: Blue (bg-blue-100 text-blue-800)
- **PERSONAL**: Green (bg-green-100 text-green-800)
- **ADMIN**: Purple (bg-purple-100 text-purple-800)
- **BIZDEV**: Yellow (bg-yellow-100 text-yellow-800)

### Drag and Drop Functionality

#### **Drag Events**
- **Drag Start**: Sets dragged task and enables move cursor
- **Drag Over**: Highlights target column
- **Drag Leave**: Removes column highlight
- **Drop**: Updates task status and refreshes board

#### **Status Updates**
- **Server Action**: `updateTaskStatus(taskId, newStatus)`
- **Validation**: Ensures task belongs to user
- **Audit Logging**: Records status change
- **Error Handling**: User-friendly error messages

#### **User Experience**
- **Visual Feedback**: Column highlighting during drag
- **Loading States**: Prevents multiple operations
- **Success Feedback**: Automatic board refresh
- **Error Handling**: Clear error messages

## Filter System

### Filter Categories

#### **Basic Filters**
- **Assignee**: Dropdown with all users
- **Team**: Dropdown with all teams
- **Case**: Dropdown with user's cases
- **Category**: Dropdown with task categories
- **Priority**: Dropdown with priority levels
- **Status**: Dropdown with task statuses

#### **Date Filters**
- **Due Date From**: Date picker for start date
- **Due Date To**: Date picker for end date

### Filter Options

#### **Dynamic Options**
- **Users**: Fetched from database
- **Teams**: Fetched from database
- **Cases**: User's assigned cases only
- **Categories**: Static list (CASE, PERSONAL, ADMIN, BIZDEV)
- **Priorities**: Static list (LOW, MEDIUM, HIGH, URGENT)

#### **Filter State Management**
- **Active Filters**: Visual display with remove buttons
- **Clear All**: One-click filter reset
- **Real-time Updates**: Immediate filter application

### Filter Implementation

#### **Server-side Filtering**
- **Where Clause**: Dynamic Prisma where clause
- **User Scoping**: Only user's tasks
- **Date Range**: Proper date filtering
- **Performance**: Efficient database queries

#### **Client-side Features**
- **Loading States**: Filter options loading
- **Error Handling**: Graceful error management
- **Responsive Design**: Mobile-friendly layout

## My Work Section

### Time-based Organization

#### **Filter Categories**
- **Overdue**: Tasks past due date
- **Today**: Tasks due today
- **Next 7 Days**: Tasks due in next week
- **Blocked**: Tasks with BLOCKED status
- **Reviews Pending**: Tasks with IN_REVIEW status

#### **Tab Navigation**
- **Active Tab**: Highlighted current filter
- **Task Counts**: Shows count for each category
- **Smooth Transitions**: Tab switching animation

### Task Display

#### **Task Cards**
- **Compact Layout**: Optimized for list view
- **Priority Indicators**: Color-coded priority badges
- **Category Badges**: Color-coded category indicators
- **Due Date**: Formatted due date information
- **Case Information**: Associated case details
- **User Avatar**: Assignee identification

#### **Empty States**
- **No Tasks**: Helpful empty state messages
- **Success Messages**: "You're all caught up!"
- **Visual Icons**: Appropriate empty state icons

### Data Processing

#### **Date Calculations**
- **Overdue**: Tasks with due date < today
- **Today**: Tasks with due date = today
- **Next 7 Days**: Tasks with due date in next week
- **Status-based**: Tasks with specific statuses

#### **Performance**
- **Single Query**: Fetch all tasks once
- **Client Filtering**: Filter by criteria
- **Efficient Sorting**: Priority and date sorting

## Quick Add System

### Personal Task Creation

#### **Form Fields**
- **Title**: Required task title
- **Description**: Optional task description
- **Priority**: Priority selection (LOW, MEDIUM, HIGH, URGENT)
- **Category**: Category selection (PERSONAL, ADMIN, BIZDEV)
- **Due Date**: Optional due date
- **Tags**: Dynamic tag management

#### **Tag Management**
- **Add Tags**: Enter tag and press Enter
- **Remove Tags**: Click × to remove tag
- **Tag Display**: Visual tag chips
- **Validation**: Prevent duplicate tags

### Form Validation

#### **Required Fields**
- **Title**: Must not be empty
- **Validation**: Client-side validation
- **Error Messages**: Clear error feedback

#### **Optional Fields**
- **Description**: Optional textarea
- **Due Date**: Optional date picker
- **Tags**: Optional tag collection

### Submission Process

#### **Server Action**
- **Function**: `createPersonalTask(taskData)`
- **Validation**: Server-side validation
- **Database**: Create task record
- **Audit Log**: Log task creation

#### **User Experience**
- **Loading States**: "Creating..." button state
- **Success Feedback**: Success message and modal close
- **Error Handling**: Error message display
- **Form Reset**: Clear form after success

## Server Actions

### Task Management Actions

#### **`getTasksForKanban(filters)`**
Fetches tasks for Kanban board with filtering.

**Parameters**:
- `filters`: TaskFilters object

**Returns**: `{ [status: string]: Task[] }`

**Features**:
- User-specific task filtering
- Comprehensive where clause building
- Efficient database queries
- Status-based grouping

#### **`getMyWorkTasks(filters)`**
Fetches tasks organized by time-based criteria.

**Parameters**:
- `filters`: MyWorkFilters object

**Returns**: Time-based task organization

**Features**:
- Date-based filtering
- Status-based filtering
- Efficient data processing
- User-specific data

#### **`updateTaskStatus(taskId, newStatus)`**
Updates task status for drag-and-drop.

**Parameters**:
- `taskId`: Task ID
- `newStatus`: New status value

**Returns**: Success/error response

**Features**:
- User authorization
- Status validation
- Audit logging
- Error handling

#### **`createPersonalTask(taskData)`**
Creates a new personal task.

**Parameters**:
- `taskData`: CreatePersonalTaskData object

**Returns**: Success with task ID or error

**Features**:
- Form validation
- Database creation
- Audit logging
- Error handling

#### **`getTaskDetails(taskId)`**
Fetches detailed task information.

**Parameters**:
- `taskId`: Task ID

**Returns**: Task object or null

**Features**:
- User authorization
- Related data inclusion
- Error handling

#### **`getFilterOptions()`**
Fetches available filter options.

**Returns**: Filter options object

**Features**:
- User-specific data
- Efficient queries
- Cached options

### Data Structures

#### **Task Interface**
```typescript
interface Task {
  id: string
  title: string
  description?: string
  status: string
  priority: string
  category: string
  dueDate?: Date
  assignedUserId?: string
  assignedUser?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  caseId?: string
  case?: {
    id: string
    caseNumber: string
    title: string
  }
  teamId?: string
  team?: {
    id: string
    name: string
  }
  tags: string[]
  createdAt: Date
  updatedAt: Date
}
```

#### **Filter Interfaces**
```typescript
interface TaskFilters {
  assignee?: string
  team?: string
  case?: string
  category?: string
  priority?: string
  dueDateFrom?: string
  dueDateTo?: string
  status?: string
}

interface MyWorkFilters {
  overdue?: boolean
  today?: boolean
  next7Days?: boolean
  blocked?: boolean
  reviewsPending?: boolean
}
```

## User Experience Features

### Loading States

#### **Page Loading**
- **Skeleton Cards**: Animated placeholder cards
- **Loading Indicators**: Spinner animations
- **Progressive Loading**: Load content as available

#### **Action Loading**
- **Button States**: Disabled during operations
- **Loading Text**: "Creating...", "Updating..."
- **Prevent Multiple**: Disable buttons during operations

### Error Handling

#### **User-friendly Messages**
- **Clear Errors**: Specific error descriptions
- **Action Guidance**: What user should do
- **Recovery Options**: Retry or alternative actions

#### **Error States**
- **Network Errors**: Connection issues
- **Validation Errors**: Form validation failures
- **Permission Errors**: Access denied messages

### Responsive Design

#### **Mobile Optimizations**
- **Horizontal Scroll**: Kanban board scrolling
- **Touch-friendly**: Appropriate touch targets
- **Stacked Layout**: Vertical filter layout
- **Modal Sizing**: Proper modal sizing

#### **Desktop Features**
- **Multi-column**: Efficient space usage
- **Hover Effects**: Interactive elements
- **Keyboard Navigation**: Accessibility support

## Security Implementation

### Authentication
- **User Verification**: All actions require authenticated user
- **Session Validation**: Secure session management
- **User Scoping**: Tasks scoped to current user

### Authorization
- **Task Ownership**: Users can only access their tasks
- **Filter Scoping**: User-specific filter options
- **Action Validation**: Verify task ownership before updates

### Data Security
- **Input Validation**: Server-side validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Safe data rendering

## Performance Optimizations

### Client-side Optimizations
- **Component Memoization**: Prevent unnecessary re-renders
- **State Management**: Efficient state updates
- **Loading States**: Better perceived performance
- **Responsive Design**: Optimized for all devices

### Server-side Optimizations
- **Efficient Queries**: Optimized database operations
- **User Scoping**: Limit data to user's tasks
- **Index Usage**: Proper database indexing
- **Error Handling**: Graceful error management

## Integration Points

### Database Integration
- **Task Table**: Main task records
- **User Table**: Assignee information
- **Case Table**: Case associations
- **Team Table**: Team associations
- **Audit Log**: Activity tracking

### Component Integration
- **Shared State**: Coordinated state management
- **Event Handling**: Component communication
- **Data Flow**: Efficient data passing
- **Error Propagation**: Error handling chain

## Future Enhancements

### Planned Features
- **Real-time Updates**: Live task updates
- **Bulk Operations**: Multiple task operations
- **Advanced Filtering**: More filter options
- **Task Templates**: Predefined task templates
- **Time Tracking**: Task time tracking
- **Notifications**: Task notifications

### Performance Improvements
- **Caching**: Task data caching
- **Pagination**: Large task sets
- **Background Sync**: Async operations
- **Optimistic Updates**: Immediate UI updates

## Troubleshooting

### Common Issues

#### **Tasks Not Loading**
- Check user authentication
- Verify database connection
- Review filter parameters
- Check error messages

#### **Drag and Drop Not Working**
- Verify browser support
- Check JavaScript errors
- Review task permissions
- Test with different tasks

#### **Filters Not Working**
- Check filter state management
- Verify server action execution
- Review filter logic
- Test with different data

### Debugging Steps
1. Check browser console for errors
2. Verify server action execution
3. Monitor database operations
4. Test with different filter combinations
5. Validate user permissions
6. Check network connectivity

This Tasks management system provides a comprehensive interface for task management with professional Kanban board, advanced filtering, and efficient workflow management.
