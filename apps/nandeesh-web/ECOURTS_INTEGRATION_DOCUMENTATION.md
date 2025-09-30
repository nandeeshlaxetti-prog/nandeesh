# eCourts API Integration Documentation

## Overview

The eCourts API integration provides comprehensive access to Indian court data through multiple provider options. The system automatically handles fallbacks and provides a unified interface for case data retrieval.

## Provider Types

### 1. Official Government APIs (`official`)
- **NAPIX**: https://napix.gov.in/discover
- **API Setu**: https://apisetu.gov.in/
- **Requirements**: API key, government approval
- **Fallback**: Automatically falls back to manual portals if APIs fail

### 2. Manual Portal Scraping (`manual`)
- **District Portal**: https://services.ecourts.gov.in/
- **High Court Portal**: https://hcservices.ecourts.gov.in/
- **Judgments Portal**: https://judgments.ecourts.gov.in/
- **Requirements**: None (but may encounter CAPTCHA)
- **Limitations**: May require manual intervention for CAPTCHA

### 3. Third-Party APIs (`third_party`)
- **Kleopatra Enterprise API**: https://court-api.kleopatra.io/
  - Complete Indian judicial coverage (700+ District Courts, 25 High Courts, Supreme Court, NCLT, CAT, Consumer Forums)
  - Enterprise-grade with 99.9% uptime, OAuth 2.0 authentication
  - Free for research, journalism, legal education, non-profits
  - Interactive playground for testing
- **Surepass**: https://surepass.io/ecourt-cnr-search-api/
- **Legalkart**: https://www.legalkart.com/api-services
- **Requirements**: API key from service provider
- **Benefits**: More reliable, better support, comprehensive coverage

## Configuration

### Environment Variables

```bash
# Provider type: official, manual, or third_party
ECOURTS_PROVIDER=official

# API key for official or third-party providers
ECOURTS_API_KEY=your_api_key_here

# Timeout for API requests (milliseconds)
ECOURTS_TIMEOUT=30000
```

### Runtime Configuration

```typescript
import { ECourtsProvider, ECourtsConfig } from '@/lib/ecourts-provider'

const config: ECourtsConfig = {
  provider: 'official',
  apiKey: 'your_api_key',
  timeout: 30000
}

const provider = new ECourtsProvider(config)
```

## Usage Examples

### Basic CNR Search

```typescript
const result = await provider.getCaseByCNR('1234567890123456')

if (result.success) {
  console.log('Case found:', result.data)
} else if (result.requiresCaptcha) {
  console.log('CAPTCHA required - manual intervention needed')
} else {
  console.log('Error:', result.error)
}
```

### Provider Switching

```typescript
// Try official first
let provider = new ECourtsProvider({ provider: 'official' })
let result = await provider.getCaseByCNR(cnr)

// Fallback to manual if official fails
if (!result.success && result.requiresManual) {
  provider = new ECourtsProvider({ provider: 'manual' })
  result = await provider.getCaseByCNR(cnr)
}

// Fallback to third-party if manual fails
if (!result.success && result.requiresManual) {
  provider = new ECourtsProvider({ 
    provider: 'third_party',
    apiKey: 'third_party_key'
  })
  result = await provider.getCaseByCNR(cnr)
}
```

## API Methods

### `getCaseByCNR(cnr: string)`
Searches for a case by CNR number.

**Parameters:**
- `cnr`: 16-digit CNR number

**Returns:**
```typescript
{
  success: boolean
  data?: ECourtsCaseData
  error?: string
  message?: string
  requiresCaptcha?: boolean
  requiresManual?: boolean
}
```

### `searchCases(filters)`
Searches for cases with filters.

**Parameters:**
```typescript
{
  caseNumber?: string
  partyName?: string
  advocateName?: string
  court?: string
  year?: number
}
```

### `getCauseList(court: string, date: Date)`
Gets cause list for a specific court and date.

### `getOrders(cnr: string)`
Gets orders for a specific case.

### `downloadOrderPdf(orderId: string)`
Downloads order PDF.

### `testConnection()`
Tests connection to the configured provider.

## Data Structure

### ECourtsCaseData

```typescript
interface ECourtsCaseData {
  cnr: string
  caseNumber: string
  title: string
  court: string
  courtLocation: string
  caseType: string
  caseStatus: string
  filingDate: string
  lastHearingDate?: string
  nextHearingDate?: string
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
    address?: string
  }>
  judges: Array<{
    name: string
    designation: string
    court: string
  }>
  caseDetails: {
    subjectMatter: string
    caseDescription: string
    reliefSought: string
    caseValue?: number
    jurisdiction: string
  }
}
```

## Error Handling

The system provides comprehensive error handling with specific error types:

- `INVALID_CNR`: CNR format is invalid
- `OFFICIAL_API_ERROR`: Official APIs are not accessible
- `MANUAL_PORTAL_ERROR`: Manual portals are not accessible
- `THIRD_PARTY_API_ERROR`: Third-party APIs are not accessible
- `CAPTCHA_REQUIRED`: CAPTCHA intervention needed
- `NETWORK_ERROR`: Network connectivity issues
- `PARSING_ERROR`: Data parsing failed

## UI Components

### Cases Page Integration

The cases page includes:
- **Add Case** button (blue) - Manual case entry
- **Import by CNR** button (green) - eCourts integration
- CNR import modal with validation
- Real-time provider status feedback

### Integrations Page

The integrations page provides:
- Provider selection (official/manual/third_party)
- API key configuration
- Connection testing
- Endpoint information
- Setup instructions

## Testing

### Manual Testing

1. **Start the application**: `pnpm dev:web`
2. **Navigate to Cases**: `http://localhost:3000/cases`
3. **Test CNR Import**: Click green "Import by CNR" button
4. **Enter CNR**: Use any 16-digit number (e.g., `1234567890123456`)
5. **Check Results**: Verify case data is imported

### Provider Testing

1. **Navigate to Integrations**: `http://localhost:3000/integrations`
2. **Select Provider**: Choose official/manual/third_party
3. **Configure API Key**: If required
4. **Test Connection**: Click "Test Connection" button
5. **Save Settings**: Click "Save Settings"

## Production Deployment

### Environment Setup

1. **Set Environment Variables**:
   ```bash
   ECOURTS_PROVIDER=official
   ECOURTS_API_KEY=your_production_api_key
   ECOURTS_TIMEOUT=30000
   ```

2. **API Key Management**:
   - Store API keys securely
   - Use environment variables
   - Never commit keys to version control

3. **Rate Limiting**:
   - Implement request throttling
   - Monitor API usage
   - Handle rate limit errors gracefully

### Monitoring

- Monitor API response times
- Track error rates by provider
- Log CAPTCHA requirements
- Monitor API key usage

## Troubleshooting

### Common Issues

1. **403 Forbidden**: API key invalid or expired
2. **CAPTCHA Required**: Manual intervention needed
3. **Timeout Errors**: Increase timeout or check network
4. **Parsing Errors**: API response format changed

### Debug Mode

Enable debug logging by setting:
```bash
DEBUG=ecourts:*
```

## Kleopatra API Integration

### Overview
[Kleopatra Court API](https://court-api.kleopatra.io/) is a comprehensive enterprise-grade API for Indian Courts that provides:

- **Complete Coverage**: 700+ District Courts, 25 High Courts, Supreme Court, NCLT, CAT, Consumer Forums
- **Real-time Data**: Live case tracking, hearing schedules, judgment downloads
- **Enterprise Features**: 99.9% uptime, OAuth 2.0, RESTful API with OpenAPI specification
- **Free Access**: Available for academic research, journalism, legal education, non-profits

### API Endpoints

```typescript
// Kleopatra API endpoints for different court types
const kleopatraEndpoints = [
  'https://court-api.kleopatra.io/api/v1/district-courts/cases/{cnr}',
  'https://court-api.kleopatra.io/api/v1/high-courts/cases/{cnr}',
  'https://court-api.kleopatra.io/api/v1/supreme-court/cases/{cnr}',
  'https://court-api.kleopatra.io/api/v1/nclt/cases/{cnr}',
  'https://court-api.kleopatra.io/api/v1/consumer-forum/cases/{cnr}'
]
```

### Authentication
```typescript
const headers = {
  'Authorization': `Bearer ${apiKey}`,
  'Content-Type': 'application/json',
  'X-API-Version': 'v1'
}
```

### Testing
- **Interactive Playground**: https://court-api.kleopatra.io/
- **Health Check**: `GET /api/v1/health`
- **Documentation**: Available on their website with OpenAPI spec

## Future Enhancements

- [ ] Real-time case status updates
- [ ] Bulk case import functionality
- [ ] Advanced search filters
- [ ] Case document management
- [ ] Hearing notifications
- [ ] Order tracking
- [ ] Multi-language support
- [ ] Mobile app integration

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review error messages and logs
3. Test with different providers
4. Contact API service providers for key issues
