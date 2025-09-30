# Cases Management System Documentation

This document provides comprehensive documentation for the cases management system in the `apps/web` application. The system provides a complete case management interface with table views, detailed case information, and integration with Electron IPC for external system synchronization.

## Overview

The cases management system provides:
- **Cases Table**: Comprehensive table view with key case information
- **Case Detail Pages**: Detailed case information with tabbed interface
- **Real-time Data**: Live data from the database
- **Electron Integration**: IPC communication for external system sync
- **Responsive Design**: Mobile-friendly interface
- **Security**: User-specific data filtering

## Cases Table

### Table Columns

| Column | Description | Data Source |
|--------|-------------|-------------|
| **Case Number** | Unique case identifier with clickable link | `case.caseNumber` |
| **Court** | Court name where case is filed | `case.courtName` |
| **Stage** | Current case status/stage | `case.status` |
| **Next Hearing** | Date of next scheduled hearing | `hearing.scheduledDate` (earliest) |
| **Last Order** | Date of most recent order/judgment | `order.orderDate` (latest) |
| **Priority** | Case priority level | `case.priority` |
| **Client** | Client name | `client.firstName + lastName` |

### Features

#### **Status Color Coding**
- **Blue**: OPEN cases
- **Yellow**: IN_PROGRESS cases  
- **Gray**: CLOSED cases
- **Red**: SUSPENDED cases

#### **Priority Color Coding**
- **Red**: URGENT priority
- **Orange**: HIGH priority
- **Yellow**: MEDIUM priority
- **Green**: LOW priority

#### **Interactive Elements**
- **Clickable Case Numbers**: Navigate to case detail page
- **Hover Effects**: Row highlighting on hover
- **Responsive Design**: Mobile-friendly table layout

## Case Detail Page

### Page Structure

#### **Header Section**
- **Case Number**: Large, prominent display
- **Case Title**: Descriptive case name
- **Status Badges**: Status, priority, and confidentiality indicators
- **Sync Now Button**: Electron IPC integration for external system sync

#### **Tab Navigation**
Seven comprehensive tabs for different aspects of case management:

1. **Overview** - Basic case information and timeline
2. **Parties** - Case participants and their roles
3. **Hearings** - Court appearances and scheduling
4. **Orders/Judgments** - Legal orders and judgments
5. **Tasks** - Case-related tasks and assignments
6. **Notes** - Case notes and comments
7. **Audit** - Case activity and change history

### Tab Details

#### **Overview Tab**
**Purpose**: Comprehensive case information and timeline

**Information Displayed**:
- **Case Information**: Number, title, type, court details
- **Timeline**: Filing date, expected completion, actual completion
- **Financial**: Case value and currency
- **Description**: Detailed case description
- **Tags**: Categorization tags

**Layout**: Two-column grid with organized information sections

#### **Parties Tab**
**Purpose**: Display all parties involved in the case

**Data Source**: `Party` table filtered by `caseId`

**Information Displayed**:
- **Party Name**: Full name of the party
- **Party Type**: Individual or organization
- **Role**: Plaintiff, defendant, witness, etc.
- **Address**: Contact information
- **Role Badge**: Color-coded role indicators

**Features**:
- **Role Color Coding**: Green (plaintiff), Red (defendant), Gray (other)
- **Responsive Cards**: Clean card layout for each party

#### **Hearings Tab**
**Purpose**: Track all court appearances and hearings

**Data Source**: `Hearing` table filtered by `caseId`

**Information Displayed**:
- **Hearing Number**: Unique hearing identifier
- **Type**: First hearing, arguments, judgment, etc.
- **Description**: Hearing purpose and agenda
- **Schedule**: Date and time
- **Status**: Scheduled, completed, cancelled
- **Judge**: Presiding judge information

**Features**:
- **Status Color Coding**: Blue (scheduled), Green (completed), Gray (cancelled)
- **Chronological Order**: Most recent hearings first
- **Date Formatting**: User-friendly date display

#### **Orders/Judgments Tab**
**Purpose**: Track legal orders and judgments

**Data Source**: `Order` table filtered by `caseId`

**Information Displayed**:
- **Order Number**: Unique order identifier
- **Type**: Interim order, final judgment, etc.
- **Title**: Order title and description
- **Date**: Order date and effective date
- **Status**: Draft, pending, approved, executed
- **Content**: Order details and requirements

**Features**:
- **Status Color Coding**: Green (approved), Yellow (pending), Gray (draft)
- **Chronological Order**: Most recent orders first
- **Detailed Information**: Comprehensive order details

#### **Tasks Tab**
**Purpose**: Manage case-related tasks and assignments

**Data Source**: `Task` table filtered by `caseId`

**Information Displayed**:
- **Task Title**: Task name and description
- **Assignee**: Person responsible for the task
- **Status**: Pending, in progress, completed, cancelled
- **Priority**: Urgent, high, medium, low
- **Due Date**: Task deadline
- **Progress**: Completion percentage

**Features**:
- **Status Color Coding**: Green (completed), Blue (in progress), Yellow (pending)
- **Priority Indicators**: Color-coded priority levels
- **Assignee Information**: Full name display

#### **Notes Tab**
**Purpose**: Case notes and comments (placeholder for future implementation)

**Current Status**: Placeholder with future implementation message

**Planned Features**:
- **Rich Text Editor**: Formatted note creation
- **Note Categories**: Different types of notes
- **Timestamps**: Note creation and modification times
- **User Attribution**: Note author tracking

#### **Audit Tab**
**Purpose**: Track all case-related activities and changes

**Data Source**: `AuditLog` table filtered by `caseId`

**Information Displayed**:
- **Action**: Type of action performed
- **Description**: Detailed action description
- **Details**: Additional action information
- **Timestamp**: When the action occurred
- **Severity**: Action importance level

**Features**:
- **Severity Color Coding**: Red (high), Yellow (medium), Green (low)
- **Chronological Order**: Most recent activities first
- **Comprehensive Logging**: All case-related activities

## Server Actions

### `getCasesList()`
Fetches all cases assigned to the authenticated user.

**Returns**: `CaseListItem[]` interface
```typescript
interface CaseListItem {
  id: string
  caseNumber: string
  title: string
  court: string
  stage: string
  nextHearingDate: Date | null
  lastOrderDate: Date | null
  status: string
  priority: string
  assignedLawyer: { firstName: string, lastName: string } | null
  client: { firstName: string, lastName: string } | null
}
```

**Security**: 
- Requires authenticated user
- Filters by `assignedLawyerId`
- Handles errors gracefully

### `getCaseDetail(caseId: string)`
Fetches comprehensive case information.

**Returns**: `CaseDetail` interface with full case information including relationships

**Security**:
- Requires authenticated user
- Verifies user access to specific case
- Includes related data (lawyer, client, team)

### Tab-specific Actions
- `getCaseParties(caseId)` - Fetches case parties
- `getCaseHearings(caseId)` - Fetches case hearings
- `getCaseOrders(caseId)` - Fetches case orders
- `getCaseTasks(caseId)` - Fetches case tasks
- `getCaseAuditLogs(caseId)` - Fetches case audit logs

**Security**: All tab actions verify user access to the case before fetching data

## Electron Integration

### Sync Now Button
**Purpose**: Synchronize case data with external systems (eCourts)

**Implementation**:
```typescript
const handleSyncNow = async () => {
  try {
    if (typeof window !== 'undefined' && (window as any).app) {
      await (window as any).app.invoke('ecourts.syncNow', { caseId })
      alert('Sync initiated successfully!')
    } else {
      alert('Sync functionality is only available in the desktop application')
    }
  } catch (error) {
    console.error('Sync error:', error)
    alert('Failed to initiate sync')
  }
}
```

**Features**:
- **Environment Detection**: Checks for Electron environment
- **IPC Communication**: Uses `window.app.invoke()` for Electron communication
- **Error Handling**: Graceful error handling and user feedback
- **User Feedback**: Success and error notifications

**IPC Channel**: `ecourts.syncNow`
**Payload**: `{ caseId: string }`

## Security Implementation

### Authentication
- All server actions require authenticated user
- User-specific data filtering prevents data leakage
- Session validation on every request

### Data Access Control
- Users only see cases assigned to them
- Case detail access verification
- Tab-specific data access control
- Secure database queries with proper where clauses

### Error Handling
- Comprehensive try-catch blocks
- User-friendly error messages
- Graceful degradation on failures
- No sensitive information in error messages

## Performance Optimizations

### Database Queries
- Efficient queries with proper indexing
- Minimal data fetching (only required fields)
- Optimized joins and relationships
- Proper pagination for large datasets

### Client-side Optimizations
- Lazy loading of tab content
- Efficient React state management
- Memoization to prevent unnecessary re-renders
- Loading states for better perceived performance

### Caching Strategy
- Server-side data processing
- Client-side state management
- Optimized re-renders
- Efficient data fetching patterns

## Responsive Design

### Breakpoints
- **Mobile**: Single column layout, stacked cards
- **Tablet**: Two column layout, optimized spacing
- **Desktop**: Full table layout, side-by-side tabs

### Table Responsiveness
- **Horizontal Scroll**: On smaller screens
- **Stacked Cards**: Mobile-friendly alternative
- **Touch-friendly**: Appropriate touch targets
- **Readable Text**: Proper font sizes and spacing

### Tab Navigation
- **Responsive Tabs**: Horizontal scroll on mobile
- **Touch-friendly**: Appropriate tab sizes
- **Clear Indicators**: Active tab highlighting
- **Smooth Transitions**: Animated tab changes

## User Experience Features

### Loading States
- **Skeleton Loading**: Realistic content placeholders
- **Progressive Loading**: Tab content loads on demand
- **Loading Messages**: User-friendly loading text
- **Smooth Transitions**: No jarring content changes

### Error Handling
- **Error Boundaries**: Graceful error display
- **User-friendly Messages**: Clear error communication
- **Retry Capability**: Easy error recovery
- **Fallback Content**: Graceful degradation

### Interactive Elements
- **Hover Effects**: Visual feedback on interactions
- **Click Feedback**: Clear click indicators
- **Status Indicators**: Color-coded status information
- **Progress Indicators**: Task and case progress

## Future Enhancements

### Planned Features
- **Real-time Updates**: WebSocket integration for live updates
- **Advanced Filtering**: Enhanced case filtering and search
- **Bulk Operations**: Multi-case operations and updates
- **Export Functionality**: Case data export capabilities
- **Notes System**: Rich text notes with categories
- **Document Management**: File uploads and document management

### Performance Improvements
- **Virtual Scrolling**: For large case lists
- **Data Caching**: Advanced caching strategies
- **Background Sync**: Automatic data synchronization
- **Offline Support**: Offline case viewing capabilities

## Troubleshooting

### Common Issues

#### Cases Not Loading
- Check user authentication status
- Verify database connection
- Check server action errors
- Validate user permissions

#### Case Detail Access Issues
- Verify case assignment to user
- Check case ID validity
- Validate user session
- Review access control logic

#### Sync Button Not Working
- Verify Electron environment
- Check IPC channel configuration
- Validate case ID parameter
- Review Electron main process setup

### Debugging Steps
1. Check browser console for errors
2. Verify server action execution
3. Monitor database query performance
4. Test with different user roles
5. Validate data filtering logic
6. Check Electron IPC communication

This cases management system provides a comprehensive interface for legal case management with real-time data, secure access control, and seamless Electron integration for external system synchronization.
