# Court Provider System Documentation

This document provides comprehensive documentation for the Court Provider system in the `packages/core` package. The system provides a unified interface for integrating with different court data sources and services.

## Overview

The Court Provider system provides:
- **Unified Interface**: Single interface for all court data operations
- **Multiple Providers**: Support for different court data sources
- **Typed DTOs**: Strongly typed data transfer objects
- **Factory Pattern**: Easy provider instantiation
- **Comprehensive Testing**: Complete test suite for all providers
- **Extensible Design**: Easy to add new providers

## System Architecture

### Core Components

#### **CourtProvider Interface**
- **Purpose**: Defines the contract for all court data providers
- **Methods**: `getCaseByCNR`, `searchCase`, `getCauseList`, `listOrders`, `downloadOrderPdf`, `testConnection`, `getCapabilities`
- **Properties**: `name`, `type`

#### **Provider Implementations**
- **DistrictHighCourtProvider**: Integration with district and high court systems
- **JudgmentsProvider**: Integration with judgments and case law databases
- **ManualImportProvider**: Manual data entry and import functionality
- **ThirdPartyProvider**: Integration with third-party court data services

#### **Data Transfer Objects (DTOs)**
- **CourtCaseDTO**: Complete case information
- **PartyDTO**: Party information with types
- **AdvocateDTO**: Advocate details
- **JudgeDTO**: Judge information
- **HearingDTO**: Hearing details
- **OrderDTO**: Order information
- **CauseListDTO**: Cause list data
- **SearchResult**: Search results with pagination

### Data Flow

1. **Provider Selection** → Choose appropriate provider type
2. **Configuration** → Set up provider-specific configuration
3. **Data Request** → Call provider methods
4. **Data Processing** → Provider processes request
5. **Response** → Return typed DTOs
6. **Error Handling** → Handle errors gracefully

## Provider Types

### District High Court Provider

#### **Purpose**
Integration with district and high court systems for real-time case data.

#### **Features**
- **CNR Lookup**: Get case details by CNR
- **Case Search**: Search cases with multiple filters
- **Cause List**: Get daily cause lists
- **Order Listing**: List all orders for a case
- **PDF Download**: Download order PDFs
- **Real-time Sync**: Live data synchronization

#### **Configuration**
```typescript
const config: ProviderConfig = {
  apiEndpoint: 'https://district-court-api.example.com',
  apiKey: 'district-api-key-123',
  username: 'court_user', // Optional for official providers
  password: 'court_pass', // Optional for official providers
  courtCode: 'DISTRICT_COURT',
  benchCode: 'MAIN_BENCH', // Optional
  timeout: 5000,
  retryAttempts: 3
}
```

#### **Capabilities**
- **CNR Lookup**: ✅ Supported
- **Case Search**: ✅ Supported
- **Cause List**: ✅ Supported
- **Order Listing**: ✅ Supported
- **PDF Download**: ✅ Supported
- **Real-time Sync**: ✅ Supported
- **Max Concurrent Requests**: 10
- **Rate Limit**: 60 requests/minute
- **Supported Courts**: District Court, High Court, Sessions Court
- **Supported Case Types**: Civil, Criminal, Writ, Appeal

#### **Use Cases**
- **Real-time Case Tracking**: Live case status updates
- **Daily Cause Lists**: Current day's hearing schedule
- **Order Management**: Download and manage court orders
- **Case Search**: Find cases by multiple criteria

### Judgments Provider

#### **Purpose**
Integration with judgments and case law databases for historical case data.

#### **Features**
- **CNR Lookup**: Get judgment details by CNR
- **Case Search**: Search historical cases
- **Historical Cause Lists**: Past cause lists
- **Order Listing**: List judgment orders
- **PDF Download**: Download judgment PDFs
- **Historical Data**: Focus on disposed cases

#### **Configuration**
```typescript
const config: ProviderConfig = {
  apiEndpoint: 'https://judgments-api.example.com',
  apiKey: 'judgments-api-key-456',
  courtCode: 'SUPREME_COURT',
  timeout: 10000,
  retryAttempts: 2
}
```

#### **Capabilities**
- **CNR Lookup**: ✅ Supported
- **Case Search**: ✅ Supported
- **Cause List**: ✅ Supported (Historical only)
- **Order Listing**: ✅ Supported
- **PDF Download**: ✅ Supported
- **Real-time Sync**: ❌ Not supported (Historical data)
- **Max Concurrent Requests**: 5
- **Rate Limit**: 30 requests/minute
- **Supported Courts**: Supreme Court, High Court, Constitutional Court
- **Supported Case Types**: Constitutional, Criminal, Civil, Writ, Appeal

#### **Use Cases**
- **Case Law Research**: Find relevant judgments
- **Legal Precedents**: Historical case analysis
- **Judgment Analysis**: Study court decisions
- **Legal Research**: Comprehensive case law database

### Manual Import Provider

#### **Purpose**
Manual data entry and import functionality for cases not available through APIs.

#### **Features**
- **CNR Lookup**: Get manually imported case details
- **Case Search**: Search through imported cases
- **Cause List**: Generate cause lists from imported data
- **Order Listing**: List imported orders
- **Manual Import**: Add cases manually
- **Data Management**: Manage imported case data

#### **Configuration**
```typescript
const config: ProviderConfig = {
  // No external API configuration required
  timeout: 1000,
  retryAttempts: 1
}
```

#### **Capabilities**
- **CNR Lookup**: ✅ Supported
- **Case Search**: ✅ Supported
- **Cause List**: ✅ Supported
- **Order Listing**: ✅ Supported
- **PDF Download**: ❌ Not supported (Manual upload required)
- **Real-time Sync**: ❌ Not supported (Manual process)
- **Max Concurrent Requests**: 100
- **Rate Limit**: 1000 requests/minute
- **Supported Courts**: All courts
- **Supported Case Types**: All case types

#### **Use Cases**
- **Legacy Cases**: Import old case data
- **Offline Cases**: Cases not available online
- **Custom Data**: Specialized case information
- **Data Migration**: Import from other systems

#### **Additional Methods**
- **`importCase(caseData)`**: Import a new case
- **`importOrders(cnr, orders)`**: Import orders for a case
- **`getAllImportedCases()`**: Get all imported cases
- **`clearImportedData()`**: Clear all imported data

### Third Party Provider

#### **Purpose**
Integration with third-party court data services and commercial providers.

#### **Features**
- **CNR Lookup**: Get case details from third-party service
- **Case Search**: Search cases through third-party API
- **Cause List**: Get cause lists from third-party service
- **Order Listing**: List orders from third-party service
- **PDF Download**: Download PDFs from third-party service
- **Commercial Integration**: Integration with commercial services

#### **Configuration**
```typescript
const config: ProviderConfig = {
  apiEndpoint: 'https://third-party-api.example.com',
  apiKey: 'third-party-api-key-789',
  courtCode: 'THIRD_PARTY_COURT',
  timeout: 8000,
  retryAttempts: 3
}
```

#### **Capabilities**
- **CNR Lookup**: ✅ Supported
- **Case Search**: ✅ Supported
- **Cause List**: ✅ Supported
- **Order Listing**: ✅ Supported
- **PDF Download**: ✅ Supported
- **Real-time Sync**: ✅ Supported
- **Max Concurrent Requests**: 15
- **Rate Limit**: 100 requests/minute
- **Supported Courts**: Third Party Court, Commercial Court, Family Court, Labor Court
- **Supported Case Types**: Civil, Criminal, Commercial, Family, Labor, Consumer

#### **Use Cases**
- **Commercial Services**: Integration with paid services
- **Specialized Courts**: Commercial, family, labor courts
- **Enhanced Features**: Additional services and features
- **Multi-court Support**: Support for multiple court types

## Data Transfer Objects (DTOs)

### CourtCaseDTO

Complete case information structure.

```typescript
interface CourtCaseDTO {
  cnr: string
  caseNumber: string
  title: string
  court: string
  courtLocation: string
  caseType: string
  caseStatus: string
  filingDate: Date
  lastHearingDate?: Date
  nextHearingDate?: Date
  parties: PartyDTO[]
  advocates: AdvocateDTO[]
  judges?: JudgeDTO[]
  caseDetails?: CaseDetailsDTO
}
```

### PartyDTO

Party information with types.

```typescript
interface PartyDTO {
  name: string
  type: 'PLAINTIFF' | 'DEFENDANT' | 'PETITIONER' | 'RESPONDENT' | 'APPELLANT' | 'RESPONDENT_APPEAL'
  address?: string
  phone?: string
  email?: string
}
```

### AdvocateDTO

Advocate details.

```typescript
interface AdvocateDTO {
  name: string
  barNumber?: string
  phone?: string
  email?: string
  address?: string
}
```

### JudgeDTO

Judge information.

```typescript
interface JudgeDTO {
  name: string
  designation: string
  court?: string
}
```

### HearingDTO

Hearing details.

```typescript
interface HearingDTO {
  id: string
  caseId: string
  cnr: string
  hearingDate: Date
  hearingTime?: string
  purpose: string
  status: 'SCHEDULED' | 'HELD' | 'ADJOURNED' | 'CANCELLED'
  judge?: JudgeDTO
  remarks?: string
  nextHearingDate?: Date
  orders?: OrderDTO[]
}
```

### OrderDTO

Order information.

```typescript
interface OrderDTO {
  id: string
  caseId: string
  cnr: string
  orderDate: Date
  orderType: string
  orderText: string
  judge?: JudgeDTO
  orderNumber?: string
  pdfUrl?: string
  isDownloadable: boolean
}
```

### CauseListDTO

Cause list data.

```typescript
interface CauseListDTO {
  id: string
  court: string
  date: Date
  items: CauseListItemDTO[]
}
```

### SearchResult

Search results with pagination.

```typescript
interface SearchResult {
  cases: CourtCaseDTO[]
  totalCount: number
  hasMore: boolean
  nextPageToken?: string
}
```

## Provider Factory

### CourtProviderFactory

Factory class for creating provider instances.

```typescript
class CourtProviderFactory {
  static createProvider(type: string, config?: ProviderConfig): CourtProvider
  static getAvailableProviders(): string[]
}
```

### Usage Examples

```typescript
// Create a district high court provider
const districtProvider = CourtProviderFactory.createProvider('DISTRICT_HIGH_COURT', {
  apiEndpoint: 'https://district-court-api.example.com',
  apiKey: 'district-key',
  courtCode: 'DISTRICT_COURT'
})

// Create a judgments provider
const judgmentsProvider = CourtProviderFactory.createProvider('JUDGMENTS', {
  apiEndpoint: 'https://judgments-api.example.com',
  apiKey: 'judgments-key',
  courtCode: 'SUPREME_COURT'
})

// Create a manual import provider
const manualProvider = CourtProviderFactory.createProvider('MANUAL_IMPORT')

// Create a third-party provider
const thirdPartyProvider = CourtProviderFactory.createProvider('THIRD_PARTY', {
  apiEndpoint: 'https://third-party-api.example.com',
  apiKey: 'third-party-key',
  courtCode: 'THIRD_PARTY_COURT'
})

// Get available provider types
const availableProviders = CourtProviderFactory.getAvailableProviders()
// Returns: ['DISTRICT_HIGH_COURT', 'JUDGMENTS', 'MANUAL_IMPORT', 'THIRD_PARTY']
```

## Usage Examples

### Basic Usage

```typescript
import { 
  CourtProviderFactory, 
  DistrictHighCourtProvider,
  SearchFilters 
} from 'core'

// Create provider
const provider = CourtProviderFactory.createProvider('DISTRICT_HIGH_COURT', {
  apiEndpoint: 'https://district-court-api.example.com',
  apiKey: 'district-key',
  courtCode: 'DISTRICT_COURT'
})

// Get case by CNR
const caseResult = await provider.getCaseByCNR('DISTRICT123456')
if (caseResult.success) {
  console.log('Case:', caseResult.data)
} else {
  console.error('Error:', caseResult.error)
}

// Search cases
const searchFilters: SearchFilters = {
  caseType: 'CIVIL',
  court: 'DISTRICT_COURT',
  year: 2024
}
const searchResult = await provider.searchCase(searchFilters)
if (searchResult.success) {
  console.log('Search Results:', searchResult.data?.cases)
}

// Get cause list
const causeListResult = await provider.getCauseList('DISTRICT_COURT', new Date())
if (causeListResult.success) {
  console.log('Cause List:', causeListResult.data)
}

// List orders
const ordersResult = await provider.listOrders('DISTRICT123456')
if (ordersResult.success) {
  console.log('Orders:', ordersResult.data)
}

// Download PDF
const pdfResult = await provider.downloadOrderPdf('order-123')
if (pdfResult.success) {
  console.log('PDF Buffer:', pdfResult.data)
}

// Test connection
const connectionResult = await provider.testConnection()
if (connectionResult.success) {
  console.log('Connection successful')
} else {
  console.error('Connection failed:', connectionResult.error)
}
```

### Advanced Usage

```typescript
import { 
  CourtProviderFactory,
  ManualImportProvider,
  CourtCaseDTO,
  OrderDTO
} from 'core'

// Manual import provider usage
const manualProvider = new ManualImportProvider()

// Import a new case
const newCase: CourtCaseDTO = {
  cnr: 'MANUAL003',
  caseNumber: '2024/MAN/003',
  title: 'New Manual Case vs New Respondent',
  court: 'HIGH_COURT',
  courtLocation: 'New Location',
  caseType: 'CRIMINAL',
  caseStatus: 'PENDING',
  filingDate: new Date('2024-02-01'),
  nextHearingDate: new Date('2024-03-01'),
  parties: [
    { name: 'New Plaintiff', type: 'PLAINTIFF' },
    { name: 'New Defendant', type: 'DEFENDANT' }
  ],
  advocates: [
    { name: 'Adv. New Advocate', barNumber: 'NEW001' }
  ]
}

const importResult = await manualProvider.importCase(newCase)
if (importResult.success) {
  console.log('Case imported successfully')
}

// Import orders for the case
const orders: OrderDTO[] = [
  {
    id: 'order-manual-003-1',
    caseId: 'MANUAL003',
    cnr: 'MANUAL003',
    orderDate: new Date('2024-02-05'),
    orderType: 'Interim Order',
    orderText: 'This is an interim order for the manual case.',
    orderNumber: 'ORD-MAN-003-1',
    isDownloadable: false
  }
]

const ordersImportResult = await manualProvider.importOrders('MANUAL003', orders)
if (ordersImportResult.success) {
  console.log('Orders imported successfully')
}

// Get all imported cases
const allCases = await manualProvider.getAllImportedCases()
console.log('All imported cases:', allCases)
```

### Error Handling

```typescript
import { CourtProviderFactory } from 'core'

const provider = CourtProviderFactory.createProvider('DISTRICT_HIGH_COURT', {
  apiEndpoint: 'https://district-court-api.example.com',
  apiKey: 'district-key'
})

try {
  const result = await provider.getCaseByCNR('INVALID_CNR')
  
  if (!result.success) {
    console.error('Provider Error:', result.error)
    console.error('Provider:', result.provider)
    console.error('Response Time:', result.responseTime)
    return
  }
  
  console.log('Case Data:', result.data)
  
} catch (error) {
  console.error('Unexpected Error:', error)
}
```

## Testing

### Test Suite

The system includes a comprehensive test suite (`test-court-providers.ts`) that tests all providers:

```typescript
import { CourtProviderTester, runTests } from 'core'

// Run all tests
await runTests()

// Or run specific tests
const tester = new CourtProviderTester()
await tester.testAllProviders()
```

### Test Coverage

- **Provider Creation**: Test factory pattern
- **CNR Lookup**: Test case retrieval by CNR
- **Case Search**: Test search functionality
- **Cause Lists**: Test cause list generation
- **Order Listing**: Test order retrieval
- **PDF Download**: Test PDF download (where supported)
- **Connection Testing**: Test provider connectivity
- **Capabilities**: Test provider capabilities
- **Error Handling**: Test error scenarios
- **Manual Import**: Test manual import functionality

## Performance Considerations

### Response Times

- **District High Court Provider**: 800-2000ms
- **Judgments Provider**: 1200-2500ms
- **Manual Import Provider**: 200-800ms
- **Third Party Provider**: 1000-3000ms

### Rate Limits

- **District High Court Provider**: 60 requests/minute
- **Judgments Provider**: 30 requests/minute
- **Manual Import Provider**: 1000 requests/minute
- **Third Party Provider**: 100 requests/minute

### Concurrent Requests

- **District High Court Provider**: 10 concurrent requests
- **Judgments Provider**: 5 concurrent requests
- **Manual Import Provider**: 100 concurrent requests
- **Third Party Provider**: 15 concurrent requests

## Security Considerations

### API Key Management

- Store API keys securely
- Use environment variables
- Rotate keys regularly
- Monitor key usage

### Data Validation

- Validate all input parameters
- Sanitize user inputs
- Check CNR formats
- Validate date ranges

### Error Handling

- Don't expose sensitive information in errors
- Log errors securely
- Handle timeouts gracefully
- Implement retry logic

## Future Enhancements

### Planned Features

- **Caching Layer**: Add caching for frequently accessed data
- **Batch Operations**: Support for bulk operations
- **Real-time Updates**: WebSocket support for live updates
- **Advanced Search**: More sophisticated search capabilities
- **Data Export**: Export data in various formats
- **Analytics**: Usage analytics and reporting
- **Custom Providers**: Plugin system for custom providers

### Performance Improvements

- **Connection Pooling**: Reuse connections
- **Request Batching**: Batch multiple requests
- **Compression**: Compress large responses
- **CDN Integration**: Use CDN for static resources

This Court Provider system provides a comprehensive, extensible solution for integrating with various court data sources while maintaining a consistent interface and strong typing throughout the application.
