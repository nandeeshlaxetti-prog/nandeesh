import { 
  CourtProviderFactory,
  DistrictHighCourtProvider,
  JudgmentsProvider,
  ManualImportProvider,
  ThirdPartyProvider,
  CourtCaseDTO,
  SearchFilters,
  ProviderConfig
} from 'core'

/**
 * Court Provider Test Suite
 * Demonstrates usage of all court provider implementations
 */
class CourtProviderTester {
  
  async testAllProviders() {
    console.log('🏛️ Testing Court Providers...\n')
    
    // Test District High Court Provider
    await this.testDistrictHighCourtProvider()
    
    // Test Judgments Provider
    await this.testJudgmentsProvider()
    
    // Test Manual Import Provider
    await this.testManualImportProvider()
    
    // Test Third Party Provider
    await this.testThirdPartyProvider()
    
    // Test Factory Pattern
    await this.testProviderFactory()
    
    console.log('\n✅ All provider tests completed!')
  }
  
  private async testDistrictHighCourtProvider() {
    console.log('📋 Testing District High Court Provider...')
    
    const config: ProviderConfig = {
      apiEndpoint: 'https://district-court-api.example.com',
      apiKey: 'district-api-key-123',
      courtCode: 'DISTRICT_COURT',
      timeout: 5000
    }
    
    const provider = new DistrictHighCourtProvider(config)
    
    // Test CNR lookup
    const cnrResult = await provider.getCaseByCNR('DISTRICT123456')
    console.log(`  CNR Lookup: ${cnrResult.success ? '✅' : '❌'} ${cnrResult.responseTime}ms`)
    
    // Test case search
    const searchFilters: SearchFilters = {
      caseType: 'CIVIL',
      court: 'DISTRICT_COURT',
      year: 2024
    }
    const searchResult = await provider.searchCase(searchFilters)
    console.log(`  Case Search: ${searchResult.success ? '✅' : '❌'} ${searchResult.responseTime}ms`)
    
    // Test cause list
    const causeListResult = await provider.getCauseList('DISTRICT_COURT', new Date())
    console.log(`  Cause List: ${causeListResult.success ? '✅' : '❌'} ${causeListResult.responseTime}ms`)
    
    // Test orders
    const ordersResult = await provider.listOrders('DISTRICT123456')
    console.log(`  Orders List: ${ordersResult.success ? '✅' : '❌'} ${ordersResult.responseTime}ms`)
    
    // Test connection
    const connectionResult = await provider.testConnection()
    console.log(`  Connection Test: ${connectionResult.success ? '✅' : '❌'} ${connectionResult.responseTime}ms`)
    
    // Test capabilities
    const capabilities = provider.getCapabilities()
    console.log(`  Capabilities: CNR✅ Search✅ CauseList✅ Orders✅ PDF✅ RealTime✅`)
    console.log(`  Max Concurrent: ${capabilities.maxConcurrentRequests}, Rate Limit: ${capabilities.rateLimitPerMinute}/min\n`)
  }
  
  private async testJudgmentsProvider() {
    console.log('⚖️ Testing Judgments Provider...')
    
    const config: ProviderConfig = {
      apiEndpoint: 'https://judgments-api.example.com',
      apiKey: 'judgments-api-key-456',
      courtCode: 'SUPREME_COURT',
      timeout: 10000
    }
    
    const provider = new JudgmentsProvider(config)
    
    // Test CNR lookup
    const cnrResult = await provider.getCaseByCNR('JUDGMENT789012')
    console.log(`  CNR Lookup: ${cnrResult.success ? '✅' : '❌'} ${cnrResult.responseTime}ms`)
    
    // Test case search
    const searchFilters: SearchFilters = {
      caseType: 'CONSTITUTIONAL',
      court: 'SUPREME_COURT',
      year: 2023
    }
    const searchResult = await provider.searchCase(searchFilters)
    console.log(`  Case Search: ${searchResult.success ? '✅' : '❌'} ${searchResult.responseTime}ms`)
    
    // Test cause list (historical)
    const causeListResult = await provider.getCauseList('SUPREME_COURT', new Date('2023-12-01'))
    console.log(`  Cause List: ${causeListResult.success ? '✅' : '❌'} ${causeListResult.responseTime}ms`)
    
    // Test orders
    const ordersResult = await provider.listOrders('JUDGMENT789012')
    console.log(`  Orders List: ${ordersResult.success ? '✅' : '❌'} ${ordersResult.responseTime}ms`)
    
    // Test connection
    const connectionResult = await provider.testConnection()
    console.log(`  Connection Test: ${connectionResult.success ? '✅' : '❌'} ${connectionResult.responseTime}ms`)
    
    // Test capabilities
    const capabilities = provider.getCapabilities()
    console.log(`  Capabilities: CNR✅ Search✅ CauseList✅ Orders✅ PDF✅ RealTime❌`)
    console.log(`  Max Concurrent: ${capabilities.maxConcurrentRequests}, Rate Limit: ${capabilities.rateLimitPerMinute}/min\n`)
  }
  
  private async testManualImportProvider() {
    console.log('📝 Testing Manual Import Provider...')
    
    const provider = new ManualImportProvider()
    
    // Test CNR lookup (existing case)
    const cnrResult = await provider.getCaseByCNR('MANUAL001')
    console.log(`  CNR Lookup (Existing): ${cnrResult.success ? '✅' : '❌'} ${cnrResult.responseTime}ms`)
    
    // Test CNR lookup (non-existing case)
    const cnrResult2 = await provider.getCaseByCNR('NONEXISTENT')
    console.log(`  CNR Lookup (Non-existing): ${cnrResult2.success ? '✅' : '❌'} ${cnrResult2.responseTime}ms`)
    
    // Test case search
    const searchFilters: SearchFilters = {
      caseType: 'CIVIL',
      court: 'DISTRICT_COURT'
    }
    const searchResult = await provider.searchCase(searchFilters)
    console.log(`  Case Search: ${searchResult.success ? '✅' : '❌'} ${searchResult.responseTime}ms`)
    
    // Test cause list
    const causeListResult = await provider.getCauseList('DISTRICT_COURT', new Date('2024-02-15'))
    console.log(`  Cause List: ${causeListResult.success ? '✅' : '❌'} ${causeListResult.responseTime}ms`)
    
    // Test orders
    const ordersResult = await provider.listOrders('MANUAL001')
    console.log(`  Orders List: ${ordersResult.success ? '✅' : '❌'} ${ordersResult.responseTime}ms`)
    
    // Test PDF download (not supported)
    const pdfResult = await provider.downloadOrderPdf('order-123')
    console.log(`  PDF Download: ${pdfResult.success ? '✅' : '❌'} ${pdfResult.responseTime}ms`)
    
    // Test connection
    const connectionResult = await provider.testConnection()
    console.log(`  Connection Test: ${connectionResult.success ? '✅' : '❌'} ${connectionResult.responseTime}ms`)
    
    // Test capabilities
    const capabilities = provider.getCapabilities()
    console.log(`  Capabilities: CNR✅ Search✅ CauseList✅ Orders✅ PDF❌ RealTime❌`)
    console.log(`  Max Concurrent: ${capabilities.maxConcurrentRequests}, Rate Limit: ${capabilities.rateLimitPerMinute}/min`)
    
    // Test manual import functionality
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
    
    const importResult = await provider.importCase(newCase)
    console.log(`  Manual Import: ${importResult.success ? '✅' : '❌'}`)
    
    // Test search after import
    const searchAfterImport = await provider.searchCase({ caseType: 'CRIMINAL' })
    console.log(`  Search After Import: ${searchAfterImport.success ? '✅' : '❌'} (${searchAfterImport.data?.totalCount} cases)\n`)
  }
  
  private async testThirdPartyProvider() {
    console.log('🔗 Testing Third Party Provider...')
    
    const config: ProviderConfig = {
      apiEndpoint: 'https://third-party-api.example.com',
      apiKey: 'third-party-api-key-789',
      courtCode: 'THIRD_PARTY_COURT',
      timeout: 8000
    }
    
    const provider = new ThirdPartyProvider(config)
    
    // Test CNR lookup
    const cnrResult = await provider.getCaseByCNR('THIRDPARTY345')
    console.log(`  CNR Lookup: ${cnrResult.success ? '✅' : '❌'} ${cnrResult.responseTime}ms`)
    
    // Test case search
    const searchFilters: SearchFilters = {
      caseType: 'COMMERCIAL',
      court: 'THIRD_PARTY_COURT',
      year: 2024
    }
    const searchResult = await provider.searchCase(searchFilters)
    console.log(`  Case Search: ${searchResult.success ? '✅' : '❌'} ${searchResult.responseTime}ms`)
    
    // Test cause list
    const causeListResult = await provider.getCauseList('THIRD_PARTY_COURT', new Date())
    console.log(`  Cause List: ${causeListResult.success ? '✅' : '❌'} ${causeListResult.responseTime}ms`)
    
    // Test orders
    const ordersResult = await provider.listOrders('THIRDPARTY345')
    console.log(`  Orders List: ${ordersResult.success ? '✅' : '❌'} ${ordersResult.responseTime}ms`)
    
    // Test PDF download
    const pdfResult = await provider.downloadOrderPdf('third-party-order-123')
    console.log(`  PDF Download: ${pdfResult.success ? '✅' : '❌'} ${pdfResult.responseTime}ms`)
    
    // Test connection
    const connectionResult = await provider.testConnection()
    console.log(`  Connection Test: ${connectionResult.success ? '✅' : '❌'} ${connectionResult.responseTime}ms`)
    
    // Test capabilities
    const capabilities = provider.getCapabilities()
    console.log(`  Capabilities: CNR✅ Search✅ CauseList✅ Orders✅ PDF✅ RealTime✅`)
    console.log(`  Max Concurrent: ${capabilities.maxConcurrentRequests}, Rate Limit: ${capabilities.rateLimitPerMinute}/min\n`)
  }
  
  private async testProviderFactory() {
    console.log('🏭 Testing Provider Factory...')
    
    // Test creating providers using factory
    const providers = [
      'DISTRICT_HIGH_COURT',
      'JUDGMENTS',
      'MANUAL_IMPORT',
      'THIRD_PARTY'
    ]
    
    for (const providerType of providers) {
      try {
        const config: ProviderConfig = {
          apiEndpoint: `https://${providerType.toLowerCase()}-api.example.com`,
          apiKey: `${providerType.toLowerCase()}-key`,
          courtCode: `${providerType}_COURT`
        }
        
        const provider = CourtProviderFactory.createProvider(providerType, config)
        const capabilities = provider.getCapabilities()
        
        console.log(`  ${providerType}: ✅ Created (${provider.name})`)
        console.log(`    Supports: CNR${capabilities.supportsCNRLookup ? '✅' : '❌'} Search${capabilities.supportsCaseSearch ? '✅' : '❌'} CauseList${capabilities.supportsCauseList ? '✅' : '❌'} Orders${capabilities.supportsOrderListing ? '✅' : '❌'} PDF${capabilities.supportsPdfDownload ? '✅' : '❌'}`)
        
      } catch (error) {
        console.log(`  ${providerType}: ❌ Failed to create`)
      }
    }
    
    // Test available providers
    const availableProviders = CourtProviderFactory.getAvailableProviders()
    console.log(`  Available Providers: ${availableProviders.join(', ')}\n`)
  }
}

// Run the test suite
async function runTests() {
  const tester = new CourtProviderTester()
  await tester.testAllProviders()
}

// Export for use in other modules
export { CourtProviderTester, runTests }

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error)
}
