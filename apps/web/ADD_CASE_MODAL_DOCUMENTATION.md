# Add Case Modal System Documentation

This document provides comprehensive documentation for the Add Case modal system in the `apps/web` application. The system provides two methods for adding cases: CNR import and advanced search, with comprehensive case creation including parties and hearings.

## Overview

The Add Case modal system provides:
- **CNR Import**: Import case data using Case Number Registry
- **Advanced Search**: Search for cases using multiple criteria
- **Case Preview**: Preview case data before creation
- **Comprehensive Creation**: Create cases with parties and hearings
- **Real-time Validation**: Form validation and error handling
- **Responsive Design**: Mobile-friendly modal interface

## Modal Structure

### Header Section
- **Title**: "Add New Case"
- **Tab Navigation**: Switch between CNR import and advanced search
- **Close Button**: Cancel and close modal

### Tab System
Two main tabs for different case addition methods:

1. **Import by CNR**: Direct CNR number import
2. **Advanced Search**: Multi-criteria case search

## CNR Import Tab

### Purpose
Import case data directly using a Case Number Registry (CNR) number.

### Features

#### **CNR Input**
- **Input Field**: Text input for CNR number
- **Validation**: Basic CNR format validation (minimum 10 characters)
- **Import Button**: Triggers case data import
- **Loading State**: Shows "Importing..." during API call

#### **Import Process**
1. **CNR Validation**: Validates CNR format
2. **API Call**: Calls external CNR service (simulated)
3. **Data Processing**: Processes returned case data
4. **Preview Display**: Shows case preview for confirmation
5. **Case Creation**: Creates case with all related data

#### **CNR Data Structure**
```typescript
interface CNRData {
  caseNumber: string
  title: string
  court: string
  courtLocation: string
  filingDate: string
  caseType: string
  caseStatus: string
  parties: Array<{
    name: string
    type: 'PLAINTIFF' | 'DEFENDANT' | 'PETITIONER' | 'RESPONDENT'
    address?: string
    phone?: string
    email?: string
  }>
  advocates: Array<{
    name: string
    barNumber?: string
    phone?: string
    email?: string
  }>
  hearings?: Array<{
    hearingNumber: string
    type: string
    scheduledDate: string
    scheduledTime: string
    judgeName?: string
    courtroom?: string
  }>
}
```

### Implementation Details

#### **Server Action: `importCaseByCNR(cnr: string)`**
- **Authentication**: Requires authenticated user
- **Validation**: CNR format validation
- **API Simulation**: Mock external API call
- **Error Handling**: Comprehensive error management
- **Response**: Returns structured case data

#### **Client-side Integration**
- **State Management**: React state for CNR input and data
- **Loading States**: Loading indicators during import
- **Error Handling**: User-friendly error messages
- **Preview Display**: Case preview component

## Advanced Search Tab

### Purpose
Search for cases using multiple criteria and select from results.

### Search Criteria

#### **Available Filters**
- **Case Number**: Partial or exact case number match
- **Year**: Case filing year
- **Court**: Court name (partial match)
- **Party Name**: Party name search
- **Advocate Name**: Advocate name search

#### **Search Interface**
- **Form Layout**: Grid layout for search fields
- **Search Button**: Triggers case search
- **Loading State**: Shows "Searching..." during search
- **Results Display**: Shows search results in cards

### Search Process
1. **Filter Collection**: Collects all search criteria
2. **API Call**: Calls search service (simulated)
3. **Result Filtering**: Filters results based on criteria
4. **Results Display**: Shows matching cases
5. **Case Selection**: User selects case from results
6. **Preview Display**: Shows selected case preview
7. **Case Creation**: Creates case with selected data

### Implementation Details

#### **Server Action: `searchCases(filters: CaseSearchFilters)`**
- **Authentication**: Requires authenticated user
- **Filter Processing**: Processes search criteria
- **Mock Search**: Simulates external database search
- **Result Filtering**: Filters results based on criteria
- **Response**: Returns array of matching cases

#### **Search Filters Interface**
```typescript
interface CaseSearchFilters {
  caseNumber?: string
  year?: number
  court?: string
  partyName?: string
  advocateName?: string
}
```

## Case Preview Component

### Purpose
Display case information before creation for user confirmation.

### Features

#### **Information Display**
- **Case Information**: Number, title, court, type
- **Parties**: All parties with role indicators
- **Hearings**: Scheduled hearings (if any)
- **Create Button**: Confirms case creation

#### **Visual Design**
- **Card Layout**: Clean card-based design
- **Color Coding**: Party role color indicators
- **Responsive**: Mobile-friendly layout
- **Loading States**: Creation progress indication

#### **Party Role Indicators**
- **Green**: Plaintiff/Petitioner
- **Red**: Defendant/Respondent
- **Gray**: Other roles

### Implementation
- **Reusable Component**: Used by both CNR and search flows
- **Data Binding**: Accepts CNRData interface
- **Action Handling**: Handles case creation
- **State Management**: Manages creation loading state

## Case Creation Process

### Comprehensive Creation
When a case is created, the system creates:

1. **Case Record**: Main case information
2. **Parties**: All case parties with roles
3. **Hearings**: Scheduled hearings (if any)
4. **Audit Log**: Creation activity log

### Database Transaction
All case creation operations are wrapped in a database transaction to ensure data consistency.

#### **Transaction Steps**
1. **Case Creation**: Creates main case record
2. **Party Creation**: Creates all party records
3. **Hearing Creation**: Creates hearing records (if any)
4. **Audit Log**: Creates audit log entry
5. **Commit**: Commits all changes or rolls back on error

### Data Mapping
CNR data is mapped to internal case structure:

```typescript
const createData = {
  caseNumber: caseData.caseNumber,
  title: caseData.title,
  description: `Imported case from ${activeTab === 'cnr' ? 'CNR' : 'search'}`,
  type: caseData.caseType,
  courtName: caseData.court,
  courtLocation: caseData.courtLocation,
  filingDate: new Date(caseData.filingDate),
  priority: 'MEDIUM',
  isConfidential: false,
  tags: ['imported'],
  parties: caseData.parties,
  hearings: caseData.hearings?.map(h => ({
    hearingNumber: h.hearingNumber,
    type: h.type,
    scheduledDate: new Date(h.scheduledDate),
    scheduledTime: h.scheduledTime,
    judgeName: h.judgeName,
    courtroom: h.courtroom,
    description: `${h.type} hearing`
  }))
}
```

## Server Actions

### `importCaseByCNR(cnr: string)`
Imports case data using CNR number.

**Parameters**:
- `cnr`: Case Number Registry number

**Returns**: `CNRData | null`

**Features**:
- CNR format validation
- Mock external API call
- Structured data response
- Error handling

### `searchCases(filters: CaseSearchFilters)`
Searches for cases using multiple criteria.

**Parameters**:
- `filters`: Search criteria object

**Returns**: `CNRData[]`

**Features**:
- Multi-criteria filtering
- Mock search implementation
- Result filtering
- Error handling

### `createCase(caseData: CreateCaseData)`
Creates a new case with all related data.

**Parameters**:
- `caseData`: Complete case creation data

**Returns**: `{ success: boolean; caseId?: string; error?: string }`

**Features**:
- Database transaction
- Duplicate case number check
- Comprehensive data creation
- Audit logging

## User Experience Features

### Loading States
- **CNR Import**: "Importing..." button state
- **Search**: "Searching..." button state
- **Case Creation**: "Creating Case..." button state
- **Progress Indicators**: Visual loading feedback

### Error Handling
- **Input Validation**: CNR format validation
- **API Errors**: Network and service errors
- **Creation Errors**: Duplicate case numbers
- **User Feedback**: Clear error messages

### Success Flow
- **Success Notification**: "Case created successfully!"
- **Modal Closure**: Automatic modal closure
- **List Refresh**: Cases list updates automatically
- **Navigation**: Optional navigation to new case

### Responsive Design
- **Mobile Layout**: Stacked form fields
- **Tablet Layout**: Two-column grid
- **Desktop Layout**: Full-width modal
- **Touch-friendly**: Appropriate touch targets

## Security Implementation

### Authentication
- All server actions require authenticated user
- User-specific case assignment
- Session validation on every request

### Data Validation
- CNR format validation
- Input sanitization
- SQL injection prevention
- XSS protection

### Access Control
- Users can only create cases for themselves
- Case assignment to current user
- Secure database transactions

## Performance Optimizations

### Client-side
- **Lazy Loading**: Modal content loads on demand
- **State Management**: Efficient React state
- **Memoization**: Prevents unnecessary re-renders
- **Loading States**: Better perceived performance

### Server-side
- **Database Transactions**: Atomic operations
- **Efficient Queries**: Optimized database operations
- **Error Handling**: Graceful error management
- **Mock Delays**: Realistic API simulation

## Integration Points

### Cases Page Integration
- **Add Button**: Prominent "Add Case" button
- **Modal Trigger**: Opens modal on click
- **Success Callback**: Refreshes cases list
- **Error Handling**: Modal error display

### Database Integration
- **Case Table**: Main case records
- **Party Table**: Case parties
- **Hearing Table**: Scheduled hearings
- **Audit Log**: Activity tracking

## Future Enhancements

### Planned Features
- **Real CNR API**: Integration with actual CNR service
- **Bulk Import**: Multiple case import
- **Template System**: Case creation templates
- **Validation Rules**: Advanced validation
- **File Upload**: Document attachment
- **Auto-save**: Draft case saving

### Performance Improvements
- **Caching**: Search result caching
- **Pagination**: Large result sets
- **Background Processing**: Async case creation
- **Progress Tracking**: Creation progress

## Troubleshooting

### Common Issues

#### CNR Import Fails
- Check CNR format (minimum 10 characters)
- Verify network connection
- Check external service availability
- Review error messages

#### Search Returns No Results
- Verify search criteria
- Check spelling of search terms
- Try broader search terms
- Review search filters

#### Case Creation Fails
- Check for duplicate case numbers
- Verify required fields
- Check database connection
- Review error messages

### Debugging Steps
1. Check browser console for errors
2. Verify server action execution
3. Monitor database operations
4. Test with different data sets
5. Validate user permissions
6. Check network connectivity

This Add Case modal system provides a comprehensive interface for importing and creating cases with full data integrity, user-friendly experience, and robust error handling.
