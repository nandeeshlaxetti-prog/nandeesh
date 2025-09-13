# Dashboard System Documentation

This document provides comprehensive documentation for the dashboard system in the `apps/web` application. The dashboard provides real-time insights into case management, task tracking, and user productivity.

## Overview

The dashboard system provides:
- **Real-time Metrics**: Live data from the database
- **Server Actions**: Secure server-side data fetching
- **Responsive Design**: Mobile-friendly card layout
- **User-specific Data**: Personalized metrics based on user role
- **Interactive Components**: Dynamic cards with color-coded status

## Dashboard Cards

### 1. Total Matters Card
**Purpose**: Shows the number of active cases assigned to the user
**Data Source**: `Case` table filtered by `assignedLawyerId` and status
**Color**: Blue (neutral)
**Icon**: 📁

```typescript
const totalMatters = await db.case.count({
  where: {
    assignedLawyerId: currentUser.id,
    status: { in: ['OPEN', 'IN_PROGRESS'] },
  },
})
```

### 2. Hearings This Week Card
**Purpose**: Displays scheduled court appearances for the current week
**Data Source**: `Hearing` table filtered by date range
**Color**: Indigo (informational)
**Icon**: ⚖️

```typescript
const hearingsThisWeek = await db.hearing.count({
  where: {
    case: { assignedLawyerId: currentUser.id },
    status: 'SCHEDULED',
    scheduledDate: { gte: startOfWeek, lte: endOfWeek },
  },
})
```

### 3. Overdue Tasks Card
**Purpose**: Shows tasks that are past their due date
**Data Source**: `Task` table filtered by due date
**Color**: Red (if overdue) / Green (if none)
**Icon**: ⏰

```typescript
const overdueTasks = await db.task.count({
  where: {
    assignedTo: currentUser.id,
    status: { in: ['PENDING', 'IN_PROGRESS'] },
    dueDate: { lt: now },
  },
})
```

### 4. SLA Breaches Card
**Purpose**: Indicates cases that are past their expected completion date
**Data Source**: `Case` table filtered by expected completion date
**Color**: Red (if breached) / Green (if none)
**Icon**: 🚨

```typescript
const slaBreaches = await db.case.count({
  where: {
    assignedLawyerId: currentUser.id,
    status: { in: ['OPEN', 'IN_PROGRESS'] },
    expectedCompletionDate: { lt: now },
  },
})
```

### 5. Utilization Card
**Purpose**: Shows billable hours vs total hours worked
**Data Source**: `Worklog` table aggregated over last 30 days
**Color**: Green (≥80%) / Yellow (≥60%) / Red (<60%)
**Icon**: 📊

```typescript
const worklogs = await db.worklog.findMany({
  where: {
    userId: currentUser.id,
    date: { gte: thirtyDaysAgo },
    status: 'APPROVED',
  },
})

const billableHours = worklogs.reduce((sum, log) => sum + (log.billableHours || 0), 0)
const totalHours = worklogs.reduce((sum, log) => sum + log.duration, 0)
const utilizationPercentage = totalHours > 0 ? Math.round((billableHours / totalHours) * 100) : 0
```

### 6. Items Needing Attention Card
**Purpose**: Aggregates urgent tasks, SLA breaches, and pending approvals
**Data Source**: Multiple tables combined
**Color**: Red (>5) / Yellow (>2) / Green (≤2)
**Icon**: 🔔

```typescript
const itemsNeedingAttention = urgentTasks + slaBreaches + pendingWorklogs + pendingLeaveRequests
```

## Server Actions

### `getDashboardStats()`
Fetches all dashboard metrics for the authenticated user.

**Returns**: `DashboardStats` interface
```typescript
interface DashboardStats {
  totalMatters: number
  hearingsThisWeek: number
  overdueTasks: number
  slaBreaches: number
  utilization: {
    billableHours: number
    totalHours: number
    percentage: number
  }
  itemsNeedingAttention: number
}
```

**Security**: 
- Requires authenticated user
- Filters data by user ID
- Handles errors gracefully

### `getRecentActivity()`
Fetches recent cases, tasks, and hearings for the user.

**Returns**: Recent activity data
```typescript
{
  recentCases: Array<{ id, caseNumber, title, createdAt }>
  recentTasks: Array<{ id, title, status, createdAt }>
  recentHearings: Array<{ id, hearingNumber, type, scheduledDate, case }>
}
```

## Components

### `DashboardCard`
Reusable card component for displaying metrics.

**Props**:
- `title`: Card title
- `value`: Main metric value
- `subtitle`: Optional description
- `icon`: Emoji icon
- `color`: Color theme (blue, green, yellow, red, purple, indigo)
- `trend`: Optional trend indicator

### `RecentActivity`
Displays recent user activity with categorized sections.

**Features**:
- Recent cases with case numbers
- Recent tasks with status badges
- Recent hearings with scheduling info
- Empty state handling
- Responsive design

### `LoadingComponents`
Provides loading states for better UX.

**Components**:
- `LoadingCard`: Individual card skeleton
- `LoadingGrid`: Grid of loading cards

## Data Flow

1. **User Authentication**: Dashboard checks for authenticated user
2. **Server Actions**: Calls `getDashboardStats()` and `getRecentActivity()`
3. **Database Queries**: Server actions query database with user-specific filters
4. **Data Processing**: Calculations performed on server side
5. **Component Rendering**: Cards render with processed data
6. **Error Handling**: Graceful error states and loading indicators

## Security Considerations

### Authentication
- All server actions require authenticated user
- User-specific data filtering prevents data leakage
- Session validation on every request

### Data Access
- Users only see their assigned cases and tasks
- Role-based filtering where applicable
- Secure database queries with proper where clauses

### Error Handling
- Comprehensive try-catch blocks
- User-friendly error messages
- Graceful degradation on failures

## Performance Optimizations

### Database Queries
- Efficient count queries for metrics
- Proper indexing on filtered fields
- Minimal data fetching (only required fields)

### Caching
- Server-side data processing
- Client-side state management
- Optimized re-renders

### Loading States
- Skeleton loading components
- Progressive data loading
- Smooth transitions

## Responsive Design

### Breakpoints
- Mobile: Single column layout
- Tablet: Two column layout
- Desktop: Three column layout

### Card Layout
- Consistent card heights
- Responsive grid system
- Mobile-friendly touch targets

## Color Coding System

### Status Colors
- **Green**: Good status, no issues
- **Yellow**: Warning, attention needed
- **Red**: Critical, immediate action required
- **Blue**: Informational, neutral
- **Indigo**: Special categories
- **Purple**: Administrative functions

### Usage Guidelines
- Use green for positive metrics
- Use red for overdue/critical items
- Use yellow for warnings
- Use blue for general information

## Future Enhancements

### Planned Features
- Real-time updates via WebSocket
- Customizable dashboard layout
- Export dashboard data
- Advanced filtering options
- Trend analysis and charts

### Performance Improvements
- Data caching strategies
- Lazy loading for large datasets
- Optimistic updates
- Background data refresh

## Troubleshooting

### Common Issues

#### Data Not Loading
- Check user authentication status
- Verify database connection
- Check server action errors
- Validate user permissions

#### Performance Issues
- Monitor database query performance
- Check for N+1 query problems
- Optimize data fetching patterns
- Implement proper indexing

#### UI Issues
- Verify responsive breakpoints
- Check color contrast ratios
- Validate loading states
- Test error boundaries

### Debugging
1. Check browser console for errors
2. Verify server action execution
3. Monitor database query performance
4. Test with different user roles
5. Validate data filtering logic

This dashboard system provides a comprehensive overview of user productivity and case management status, with real-time data and intuitive visual indicators for quick decision-making.
