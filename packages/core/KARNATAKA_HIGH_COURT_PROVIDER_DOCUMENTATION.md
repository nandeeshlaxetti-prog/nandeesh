# Karnataka High Court Provider Documentation

This document provides comprehensive documentation for the Karnataka High Court Provider system, including the specialized provider implementation and captcha handling functionality.

## Overview

The Karnataka High Court Provider system provides:
- **Specialized Provider**: Dedicated provider for Karnataka High Court integration
- **Multi-Bench Support**: Support for Bengaluru, Dharwad, and Kalaburagi benches
- **Captcha Handling**: Automatic captcha detection and in-app BrowserView completion
- **Specialized APIs**: Karnataka High Court specific API methods
- **Standard Compliance**: Implements the standard CourtProvider interface
- **Electron Integration**: Seamless integration with Electron desktop application

## System Architecture

### Core Components

#### **KarnatakaHighCourtProvider Class**
- **Purpose**: Specialized provider for Karnataka High Court system
- **Inheritance**: Implements CourtProvider interface
- **Features**: Multi-bench support, captcha handling, specialized APIs
- **Configuration**: Bench-specific configuration options

#### **KarnatakaHighCourtCaptchaHandler Class**
- **Purpose**: Manages captcha completion in Electron BrowserView
- **Features**: In-app captcha display, user interaction, completion handling
- **Integration**: Seamless integration with main Electron window

#### **Specialized DTOs**
- **KhcCaseResponse**: Karnataka High Court case data structure
- **KhcSearchResponse**: Search results for Karnataka High Court
- **KhcCauseListResponse**: Cause list data for Karnataka High Court
- **KhcOrderResponse**: Order data for Karnataka High Court

### Data Flow

1. **API Request** → Karnataka High Court provider
2. **Captcha Check** → Detect captcha requirement
3. **Captcha Handling** → Open BrowserView if required
4. **User Interaction** → Complete captcha in-app
5. **Request Retry** → Retry original request after captcha completion
6. **Response** → Return typed DTOs

## Provider Configuration

### KarnatakaHighCourtConfig Interface

```typescript
interface KarnatakaHighCourtConfig extends ProviderConfig {
  bench: 'bengaluru' | 'dharwad' | 'kalaburagi'
  captchaHandler?: (captchaUrl: string) => Promise<string>
}
```

### Configuration Options

#### **Required Configuration**
- **`bench`**: Specific bench (bengaluru, dharwad, kalaburagi)
- **`apiEndpoint`**: Karnataka High Court API endpoint
- **`apiKey`**: Authentication key for API access

#### **Optional Configuration**
- **`timeout`**: Request timeout in milliseconds
- **`retryAttempts`**: Number of retry attempts
- **`captchaHandler`**: Custom captcha handler function

### Usage Examples

```typescript
// Bengaluru Bench Configuration
const bengaluruConfig: KarnatakaHighCourtConfig = {
  apiEndpoint: 'https://khc-api.karnataka.gov.in',
  apiKey: 'khc-bengaluru-key',
  bench: 'bengaluru',
  timeout: 5000,
  retryAttempts: 3
}

// Dharwad Bench Configuration
const dharwadConfig: KarnatakaHighCourtConfig = {
  apiEndpoint: 'https://khc-api.karnataka.gov.in',
  apiKey: 'khc-dharwad-key',
  bench: 'dharwad',
  timeout: 5000,
  retryAttempts: 3
}

// Kalaburagi Bench Configuration
const kalaburagiConfig: KarnatakaHighCourtConfig = {
  apiEndpoint: 'https://khc-api.karnataka.gov.in',
  apiKey: 'khc-kalaburagi-key',
  bench: 'kalaburagi',
  timeout: 5000,
  retryAttempts: 3
}
```

## Specialized APIs

### getKhcCaseByNumber

Get case details by Karnataka High Court case number.

```typescript
async getKhcCaseByNumber(caseNumber: string, config?: KarnatakaHighCourtConfig): Promise<ProviderResponse<KhcCaseResponse>>
```

#### **Parameters**
- **`caseNumber`**: Karnataka High Court case number (e.g., "2024/BEN/001")
- **`config`**: Optional configuration override

#### **Returns**
- **`ProviderResponse<KhcCaseResponse>`**: Case details or error response

#### **Example**
```typescript
const provider = new KarnatakaHighCourtProvider(bengaluruConfig)
const result = await provider.getKhcCaseByNumber('2024/BEN/001')

if (result.success) {
  console.log('Case:', result.data)
  console.log('Case Number:', result.data.caseNumber)
  console.log('Title:', result.data.title)
  console.log('Bench:', result.data.bench)
} else {
  console.error('Error:', result.error)
}
```

### searchKhcCases

Search Karnataka High Court cases with filters.

```typescript
async searchKhcCases(filters: SearchFilters, config?: KarnatakaHighCourtConfig): Promise<ProviderResponse<KhcSearchResponse>>
```

#### **Parameters**
- **`filters`**: Search criteria (caseType, year, etc.)
- **`config`**: Optional configuration override

#### **Returns**
- **`ProviderResponse<KhcSearchResponse>`**: Search results or error response

#### **Example**
```typescript
const searchFilters: SearchFilters = {
  caseType: 'WRIT',
  year: 2024,
  court: 'KARNATAKA HIGH COURT - BENGALURU'
}

const result = await provider.searchKhcCases(searchFilters)

if (result.success) {
  console.log('Cases Found:', result.data.totalCount)
  console.log('Cases:', result.data.cases)
} else {
  console.error('Error:', result.error)
}
```

### getKhcCauseList

Get cause list for Karnataka High Court.

```typescript
async getKhcCauseList(date: Date, config?: KarnatakaHighCourtConfig): Promise<ProviderResponse<KhcCauseListResponse>>
```

#### **Parameters**
- **`date`**: Date for cause list
- **`config`**: Optional configuration override

#### **Returns**
- **`ProviderResponse<KhcCauseListResponse>`**: Cause list or error response

#### **Example**
```typescript
const result = await provider.getKhcCauseList(new Date())

if (result.success) {
  console.log('Bench:', result.data.bench)
  console.log('Date:', result.data.date)
  console.log('Items:', result.data.items.length)
} else {
  console.error('Error:', result.error)
}
```

### listKhcOrders

List orders for a Karnataka High Court case.

```typescript
async listKhcOrders(caseNumber: string, config?: KarnatakaHighCourtConfig): Promise<ProviderResponse<KhcOrderResponse[]>>
```

#### **Parameters**
- **`caseNumber`**: Karnataka High Court case number
- **`config`**: Optional configuration override

#### **Returns**
- **`ProviderResponse<KhcOrderResponse[]>`**: Orders list or error response

#### **Example**
```typescript
const result = await provider.listKhcOrders('2024/BEN/001')

if (result.success) {
  console.log('Orders Count:', result.data.length)
  result.data.forEach(order => {
    console.log('Order:', order.orderType)
    console.log('Date:', order.orderDate)
    console.log('PDF URL:', order.pdfUrl)
  })
} else {
  console.error('Error:', result.error)
}
```

## Captcha Handling

### Captcha Detection

The provider automatically detects when captcha verification is required and returns a special response:

```typescript
{
  success: false,
  error: 'CAPTCHA_REQUIRED',
  data: {
    action_required: true,
    captchaUrl: 'https://khc-api.karnataka.gov.in/captcha/session-id',
    sessionId: 'khc-session-123456',
    message: 'CAPTCHA verification required for Karnataka High Court access'
  }
}
```

### In-App BrowserView

The captcha handler creates an in-app BrowserView for captcha completion:

#### **Features**
- **Embedded Display**: Captcha displayed within the main application window
- **User Interaction**: Users can complete captcha without leaving the app
- **Automatic Retry**: Original request is automatically retried after captcha completion
- **Error Handling**: Graceful handling of captcha failures

#### **BrowserView Layout**
- **Position**: Bottom half of the main window
- **Size**: Responsive to main window size
- **Security**: Sandboxed iframe for captcha content
- **Navigation**: Controlled navigation within captcha domain

### Captcha Handler Integration

#### **Electron Main Process**
```typescript
import { KarnatakaHighCourtCaptchaHandler } from './captcha-handler'

// Initialize captcha handler
const captchaHandler = new KarnatakaHighCourtCaptchaHandler(mainWindow)

// Handle captcha requirement
if (!result.success && result.error === 'CAPTCHA_REQUIRED') {
  const captchaResult = await captchaHandler.openCaptcha({
    captchaUrl: result.data.captchaUrl,
    sessionId: result.data.sessionId,
    message: result.data.message
  })
  
  if (captchaResult.success) {
    // Retry original request
    return await provider.getKhcCaseByNumber(caseNumber)
  }
}
```

#### **IPC Handlers**
```typescript
// Karnataka High Court IPC handlers
ipcMain.handle('khc:getCaseByNumber', async (event, caseData) => {
  const provider = new KarnatakaHighCourtProvider({
    bench: caseData.bench || 'bengaluru',
    apiEndpoint: caseData.apiEndpoint,
    apiKey: caseData.apiKey
  })
  
  const result = await provider.getKhcCaseByNumber(caseData.caseNumber)
  
  // Handle captcha requirement
  if (!result.success && result.error === 'CAPTCHA_REQUIRED' && captchaHandler) {
    const captchaResult = await captchaHandler.openCaptcha({
      captchaUrl: result.data.captchaUrl,
      sessionId: result.data.sessionId,
      message: result.data.message
    })
    
    if (captchaResult.success) {
      return await provider.getKhcCaseByNumber(caseData.caseNumber)
    }
  }
  
  return result
})
```

## Data Transfer Objects (DTOs)

### KhcCaseResponse

Karnataka High Court case information.

```typescript
interface KhcCaseResponse {
  caseNumber: string
  title: string
  caseType: string
  filingDate: Date
  status: string
  parties: PartyDTO[]
  advocates: AdvocateDTO[]
  judges?: JudgeDTO[]
  lastHearingDate?: Date
  nextHearingDate?: Date
  bench: string
}
```

### KhcSearchResponse

Search results for Karnataka High Court cases.

```typescript
interface KhcSearchResponse {
  cases: KhcCaseResponse[]
  totalCount: number
  hasMore: boolean
  nextPageToken?: string
}
```

### KhcCauseListResponse

Cause list data for Karnataka High Court.

```typescript
interface KhcCauseListResponse {
  bench: string
  date: Date
  items: KhcCauseListItem[]
}
```

### KhcCauseListItem

Individual cause list item.

```typescript
interface KhcCauseListItem {
  caseNumber: string
  title: string
  parties: string[]
  advocates: string[]
  hearingTime: string
  purpose: string
  judge?: JudgeDTO
  itemNumber: number
}
```

### KhcOrderResponse

Order information for Karnataka High Court.

```typescript
interface KhcOrderResponse {
  orderId: string
  caseNumber: string
  orderDate: Date
  orderType: string
  orderText: string
  judge?: JudgeDTO
  orderNumber?: string
  pdfUrl?: string
  isDownloadable: boolean
}
```

## Bench Support

### Supported Benches

#### **Bengaluru Bench**
- **Code**: `bengaluru`
- **Location**: Bengaluru, Karnataka
- **Case Number Format**: `2024/BEN/001`
- **CNR Format**: `KHCBENGALURU123456`

#### **Dharwad Bench**
- **Code**: `dharwad`
- **Location**: Dharwad, Karnataka
- **Case Number Format**: `2024/DHA/001`
- **CNR Format**: `KHCDHARWAD123456`

#### **Kalaburagi Bench**
- **Code**: `kalaburagi`
- **Location**: Kalaburagi, Karnataka
- **Case Number Format**: `2024/KAL/001`
- **CNR Format**: `KHCKALABURAGI123456`

### Bench-Specific Configuration

```typescript
// Create provider for specific bench
const bengaluruProvider = new KarnatakaHighCourtProvider({
  bench: 'bengaluru',
  apiEndpoint: 'https://khc-api.karnataka.gov.in',
  apiKey: 'khc-bengaluru-key'
})

const dharwadProvider = new KarnatakaHighCourtProvider({
  bench: 'dharwad',
  apiEndpoint: 'https://khc-api.karnataka.gov.in',
  apiKey: 'khc-dharwad-key'
})

const kalaburagiProvider = new KarnatakaHighCourtProvider({
  bench: 'kalaburagi',
  apiEndpoint: 'https://khc-api.karnataka.gov.in',
  apiKey: 'khc-kalaburagi-key'
})
```

## Standard CourtProvider Compliance

The Karnataka High Court provider implements the standard CourtProvider interface:

### Standard Methods

#### **getCaseByCNR**
```typescript
async getCaseByCNR(cnr: string, config?: ProviderConfig): Promise<ProviderResponse<CourtCaseDTO>>
```

#### **searchCase**
```typescript
async searchCase(filters: SearchFilters, config?: ProviderConfig): Promise<ProviderResponse<SearchResult>>
```

#### **getCauseList**
```typescript
async getCauseList(court: string, date: Date, config?: ProviderConfig): Promise<ProviderResponse<CauseListDTO>>
```

#### **listOrders**
```typescript
async listOrders(cnr: string, config?: ProviderConfig): Promise<ProviderResponse<OrderDTO[]>>
```

#### **downloadOrderPdf**
```typescript
async downloadOrderPdf(orderId: string, config?: ProviderConfig): Promise<ProviderResponse<Buffer>>
```

#### **testConnection**
```typescript
async testConnection(config?: ProviderConfig): Promise<ProviderResponse<boolean>>
```

#### **getCapabilities**
```typescript
getCapabilities(): ProviderCapabilities
```

### Capabilities

```typescript
{
  supportsCNRLookup: true,
  supportsCaseSearch: true,
  supportsCauseList: true,
  supportsOrderListing: true,
  supportsPdfDownload: true,
  supportsRealTimeSync: true,
  maxConcurrentRequests: 8,
  rateLimitPerMinute: 40,
  supportedCourts: [
    'KARNATAKA HIGH COURT - BENGALURU',
    'KARNATAKA HIGH COURT - DHARWAD',
    'KARNATAKA HIGH COURT - KALABURAGI'
  ],
  supportedCaseTypes: ['WRIT', 'APPEAL', 'CRIMINAL', 'CIVIL', 'CONSTITUTIONAL']
}
```

## Usage Examples

### Basic Usage

```typescript
import { KarnatakaHighCourtProvider } from 'core'

// Create provider
const provider = new KarnatakaHighCourtProvider({
  bench: 'bengaluru',
  apiEndpoint: 'https://khc-api.karnataka.gov.in',
  apiKey: 'khc-bengaluru-key'
})

// Get case by number
const caseResult = await provider.getKhcCaseByNumber('2024/BEN/001')
if (caseResult.success) {
  console.log('Case:', caseResult.data)
}

// Search cases
const searchResult = await provider.searchKhcCases({
  caseType: 'WRIT',
  year: 2024
})
if (searchResult.success) {
  console.log('Search Results:', searchResult.data.cases)
}

// Get cause list
const causeListResult = await provider.getKhcCauseList(new Date())
if (causeListResult.success) {
  console.log('Cause List:', causeListResult.data)
}

// List orders
const ordersResult = await provider.listKhcOrders('2024/BEN/001')
if (ordersResult.success) {
  console.log('Orders:', ordersResult.data)
}
```

### Electron Integration

```typescript
// In renderer process
const result = await window.app.khc.getCaseByNumber({
  caseNumber: '2024/BEN/001',
  bench: 'bengaluru',
  apiEndpoint: 'https://khc-api.karnataka.gov.in',
  apiKey: 'khc-bengaluru-key'
})

if (result.success) {
  console.log('Case:', result.data)
} else if (result.error === 'CAPTCHA_REQUIRED') {
  console.log('Captcha required:', result.data.message)
  // Captcha will be handled automatically by the main process
}
```

### Captcha Handling

```typescript
// Captcha handling is automatic in Electron
const provider = new KarnatakaHighCourtProvider(config)

try {
  const result = await provider.getKhcCaseByNumber('2024/BEN/001')
  
  if (!result.success && result.error === 'CAPTCHA_REQUIRED') {
    // In Electron, captcha will be handled automatically
    // In other environments, you can implement custom captcha handling
    console.log('Captcha required:', result.data.message)
    
    if (config.captchaHandler) {
      const captchaSolution = await config.captchaHandler(result.data.captchaUrl)
      // Retry request with captcha solution
      return await provider.getKhcCaseByNumber('2024/BEN/001')
    }
  }
  
  return result
} catch (error) {
  console.error('Error:', error)
}
```

## Testing

### Test Suite

The system includes a comprehensive test suite:

```typescript
import { KarnatakaHighCourtProviderTester, runKarnatakaHighCourtTests } from 'core'

// Run all tests
await runKarnatakaHighCourtTests()

// Or run specific tests
const tester = new KarnatakaHighCourtProviderTester()
await tester.testKarnatakaHighCourtProvider()
```

### Test Coverage

- **Bench Testing**: All three benches (Bengaluru, Dharwad, Kalaburagi)
- **API Testing**: All specialized APIs
- **Captcha Testing**: Captcha detection and handling
- **Standard Compliance**: Standard CourtProvider methods
- **Error Handling**: Error scenarios and edge cases
- **Performance**: Response time and performance metrics

## Security Considerations

### API Key Management

- Store API keys securely
- Use environment variables
- Rotate keys regularly
- Monitor key usage

### Captcha Security

- Sandboxed iframe for captcha content
- Controlled navigation within captcha domain
- Secure session management
- Automatic cleanup of captcha sessions

### Data Validation

- Validate all input parameters
- Sanitize user inputs
- Check case number formats
- Validate date ranges

## Performance Considerations

### Response Times

- **Case Lookup**: 1000-2000ms
- **Case Search**: 1500-2500ms
- **Cause List**: 800-1500ms
- **Orders List**: 600-1200ms
- **PDF Download**: 2000-4000ms

### Rate Limits

- **Max Concurrent Requests**: 8
- **Rate Limit**: 40 requests/minute
- **Captcha Threshold**: 20% chance (configurable)

### Optimization

- **Connection Reuse**: Reuse connections where possible
- **Request Batching**: Batch multiple requests
- **Caching**: Cache frequently accessed data
- **Retry Logic**: Implement exponential backoff

## Future Enhancements

### Planned Features

- **Real API Integration**: Integration with actual Karnataka High Court APIs
- **Advanced Captcha Handling**: Support for different captcha types
- **Batch Operations**: Support for bulk operations
- **Real-time Updates**: WebSocket support for live updates
- **Analytics**: Usage analytics and reporting
- **Custom Bench Support**: Support for additional benches

### Performance Improvements

- **Connection Pooling**: Reuse connections
- **Request Batching**: Batch multiple requests
- **Compression**: Compress large responses
- **CDN Integration**: Use CDN for static resources

This Karnataka High Court Provider system provides a comprehensive, specialized solution for integrating with the Karnataka High Court system while maintaining compatibility with the standard CourtProvider interface and providing seamless captcha handling through Electron's BrowserView.
