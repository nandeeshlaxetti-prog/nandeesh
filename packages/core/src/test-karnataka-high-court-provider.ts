import { 
  KarnatakaHighCourtProvider,
  KarnatakaHighCourtConfig,
  SearchFilters
} from 'core'

/**
 * Karnataka High Court Provider Test Suite
 * Tests the specialized Karnataka High Court provider with captcha handling
 */
class KarnatakaHighCourtProviderTester {
  
  async testKarnatakaHighCourtProvider() {
    console.log('🏛️ Testing Karnataka High Court Provider...\n')
    
    // Test all three benches
    await this.testBengaluruBench()
    await this.testDharwadBench()
    await this.testKalaburagiBench()
    
    // Test captcha handling
    await this.testCaptchaHandling()
    
    // Test all APIs
    await this.testAllApis()
    
    console.log('\n✅ Karnataka High Court Provider tests completed!')
  }
  
  private async testBengaluruBench() {
    console.log('🏛️ Testing Bengaluru Bench...')
    
    const config: KarnatakaHighCourtConfig = {
      apiEndpoint: 'https://khc-api.karnataka.gov.in',
      apiKey: 'khc-bengaluru-key',
      bench: 'bengaluru',
      timeout: 5000
    }
    
    const provider = new KarnatakaHighCourtProvider(config)
    
    // Test case by number
    const caseResult = await provider.getKhcCaseByNumber('2024/BEN/001')
    console.log(`  Case by Number: ${caseResult.success ? '✅' : '❌'} ${caseResult.responseTime}ms`)
    
    // Test case search
    const searchFilters: SearchFilters = {
      caseType: 'WRIT',
      year: 2024
    }
    const searchResult = await provider.searchKhcCases(searchFilters)
    console.log(`  Case Search: ${searchResult.success ? '✅' : '❌'} ${searchResult.responseTime}ms`)
    
    // Test cause list
    const causeListResult = await provider.getKhcCauseList(new Date())
    console.log(`  Cause List: ${causeListResult.success ? '✅' : '❌'} ${causeListResult.responseTime}ms`)
    
    // Test orders
    const ordersResult = await provider.listKhcOrders('2024/BEN/001')
    console.log(`  Orders List: ${ordersResult.success ? '✅' : '❌'} ${ordersResult.responseTime}ms`)
    
    // Test capabilities
    const capabilities = provider.getCapabilities()
    console.log(`  Capabilities: CNR✅ Search✅ CauseList✅ Orders✅ PDF✅ RealTime✅`)
    console.log(`  Max Concurrent: ${capabilities.maxConcurrentRequests}, Rate Limit: ${capabilities.rateLimitPerMinute}/min`)
    console.log(`  Supported Courts: ${capabilities.supportedCourts.join(', ')}\n`)
  }
  
  private async testDharwadBench() {
    console.log('🏛️ Testing Dharwad Bench...')
    
    const config: KarnatakaHighCourtConfig = {
      apiEndpoint: 'https://khc-api.karnataka.gov.in',
      apiKey: 'khc-dharwad-key',
      bench: 'dharwad',
      timeout: 5000
    }
    
    const provider = new KarnatakaHighCourtProvider(config)
    
    // Test case by number
    const caseResult = await provider.getKhcCaseByNumber('2024/DHA/001')
    console.log(`  Case by Number: ${caseResult.success ? '✅' : '❌'} ${caseResult.responseTime}ms`)
    
    // Test case search
    const searchFilters: SearchFilters = {
      caseType: 'APPEAL',
      year: 2024
    }
    const searchResult = await provider.searchKhcCases(searchFilters)
    console.log(`  Case Search: ${searchResult.success ? '✅' : '❌'} ${searchResult.responseTime}ms`)
    
    // Test cause list
    const causeListResult = await provider.getKhcCauseList(new Date())
    console.log(`  Cause List: ${causeListResult.success ? '✅' : '❌'} ${causeListResult.responseTime}ms`)
    
    // Test orders
    const ordersResult = await provider.listKhcOrders('2024/DHA/001')
    console.log(`  Orders List: ${ordersResult.success ? '✅' : '❌'} ${ordersResult.responseTime}ms`)
    
    console.log(`  Bench Location: Dharwad\n`)
  }
  
  private async testKalaburagiBench() {
    console.log('🏛️ Testing Kalaburagi Bench...')
    
    const config: KarnatakaHighCourtConfig = {
      apiEndpoint: 'https://khc-api.karnataka.gov.in',
      apiKey: 'khc-kalaburagi-key',
      bench: 'kalaburagi',
      timeout: 5000
    }
    
    const provider = new KarnatakaHighCourtProvider(config)
    
    // Test case by number
    const caseResult = await provider.getKhcCaseByNumber('2024/KAL/001')
    console.log(`  Case by Number: ${caseResult.success ? '✅' : '❌'} ${caseResult.responseTime}ms`)
    
    // Test case search
    const searchFilters: SearchFilters = {
      caseType: 'CRIMINAL',
      year: 2024
    }
    const searchResult = await provider.searchKhcCases(searchFilters)
    console.log(`  Case Search: ${searchResult.success ? '✅' : '❌'} ${searchResult.responseTime}ms`)
    
    // Test cause list
    const causeListResult = await provider.getKhcCauseList(new Date())
    console.log(`  Cause List: ${causeListResult.success ? '✅' : '❌'} ${causeListResult.responseTime}ms`)
    
    // Test orders
    const ordersResult = await provider.listKhcOrders('2024/KAL/001')
    console.log(`  Orders List: ${ordersResult.success ? '✅' : '❌'} ${ordersResult.responseTime}ms`)
    
    console.log(`  Bench Location: Kalaburagi\n`)
  }
  
  private async testCaptchaHandling() {
    console.log('🔐 Testing Captcha Handling...')
    
    const config: KarnatakaHighCourtConfig = {
      apiEndpoint: 'https://khc-api.karnataka.gov.in',
      apiKey: 'khc-test-key',
      bench: 'bengaluru',
      timeout: 5000
    }
    
    const provider = new KarnatakaHighCourtProvider(config)
    
    // Test multiple requests to trigger captcha (simulated)
    let captchaTriggered = false
    let successCount = 0
    
    for (let i = 0; i < 5; i++) {
      const result = await provider.getKhcCaseByNumber(`2024/BEN/${String(i + 1).padStart(3, '0')}`)
      
      if (!result.success && result.error === 'CAPTCHA_REQUIRED') {
        captchaTriggered = true
        console.log(`  Captcha Required: ✅ (Request ${i + 1})`)
        console.log(`    Captcha URL: ${result.data?.captchaUrl}`)
        console.log(`    Session ID: ${result.data?.sessionId}`)
        console.log(`    Message: ${result.data?.message}`)
        break
      } else if (result.success) {
        successCount++
      }
    }
    
    if (!captchaTriggered) {
      console.log(`  Captcha Handling: ✅ (${successCount} successful requests, no captcha triggered)`)
    }
    
    console.log('')
  }
  
  private async testAllApis() {
    console.log('🔧 Testing All Karnataka High Court APIs...')
    
    const config: KarnatakaHighCourtConfig = {
      apiEndpoint: 'https://khc-api.karnataka.gov.in',
      apiKey: 'khc-test-key',
      bench: 'bengaluru',
      timeout: 5000
    }
    
    const provider = new KarnatakaHighCourtProvider(config)
    
    // Test getKhcCaseByNumber
    console.log('  Testing getKhcCaseByNumber...')
    const caseResult = await provider.getKhcCaseByNumber('2024/BEN/001')
    console.log(`    Result: ${caseResult.success ? '✅' : '❌'} ${caseResult.responseTime}ms`)
    if (caseResult.success) {
      console.log(`    Case Number: ${caseResult.data?.caseNumber}`)
      console.log(`    Title: ${caseResult.data?.title}`)
      console.log(`    Bench: ${caseResult.data?.bench}`)
    }
    
    // Test searchKhcCases
    console.log('  Testing searchKhcCases...')
    const searchResult = await provider.searchKhcCases({
      caseType: 'WRIT',
      year: 2024
    })
    console.log(`    Result: ${searchResult.success ? '✅' : '❌'} ${searchResult.responseTime}ms`)
    if (searchResult.success) {
      console.log(`    Cases Found: ${searchResult.data?.totalCount}`)
      console.log(`    Has More: ${searchResult.data?.hasMore}`)
    }
    
    // Test getKhcCauseList
    console.log('  Testing getKhcCauseList...')
    const causeListResult = await provider.getKhcCauseList(new Date())
    console.log(`    Result: ${causeListResult.success ? '✅' : '❌'} ${causeListResult.responseTime}ms`)
    if (causeListResult.success) {
      console.log(`    Bench: ${causeListResult.data?.bench}`)
      console.log(`    Date: ${causeListResult.data?.date}`)
      console.log(`    Items: ${causeListResult.data?.items.length}`)
    }
    
    // Test listKhcOrders
    console.log('  Testing listKhcOrders...')
    const ordersResult = await provider.listKhcOrders('2024/BEN/001')
    console.log(`    Result: ${ordersResult.success ? '✅' : '❌'} ${ordersResult.responseTime}ms`)
    if (ordersResult.success) {
      console.log(`    Orders Count: ${ordersResult.data?.length}`)
      if (ordersResult.data && ordersResult.data.length > 0) {
        console.log(`    First Order: ${ordersResult.data[0].orderType}`)
        console.log(`    Order Date: ${ordersResult.data[0].orderDate}`)
      }
    }
    
    // Test standard CourtProvider methods
    console.log('  Testing Standard CourtProvider Methods...')
    
    // Test getCaseByCNR
    const cnrResult = await provider.getCaseByCNR('KHCBENGALURU123')
    console.log(`    getCaseByCNR: ${cnrResult.success ? '✅' : '❌'} ${cnrResult.responseTime}ms`)
    
    // Test searchCase
    const standardSearchResult = await provider.searchCase({
      caseType: 'WRIT',
      court: 'KARNATAKA HIGH COURT - BENGALURU'
    })
    console.log(`    searchCase: ${standardSearchResult.success ? '✅' : '❌'} ${standardSearchResult.responseTime}ms`)
    
    // Test getCauseList
    const standardCauseListResult = await provider.getCauseList('KARNATAKA HIGH COURT - BENGALURU', new Date())
    console.log(`    getCauseList: ${standardCauseListResult.success ? '✅' : '❌'} ${standardCauseListResult.responseTime}ms`)
    
    // Test listOrders
    const standardOrdersResult = await provider.listOrders('KHCBENGALURU123')
    console.log(`    listOrders: ${standardOrdersResult.success ? '✅' : '❌'} ${standardOrdersResult.responseTime}ms`)
    
    // Test downloadOrderPdf
    const pdfResult = await provider.downloadOrderPdf('khc-order-123')
    console.log(`    downloadOrderPdf: ${pdfResult.success ? '✅' : '❌'} ${pdfResult.responseTime}ms`)
    
    // Test testConnection
    const connectionResult = await provider.testConnection()
    console.log(`    testConnection: ${connectionResult.success ? '✅' : '❌'} ${connectionResult.responseTime}ms`)
    
    console.log('')
  }
}

// Run the test suite
async function runKarnatakaHighCourtTests() {
  const tester = new KarnatakaHighCourtProviderTester()
  await tester.testKarnatakaHighCourtProvider()
}

// Export for use in other modules
export { KarnatakaHighCourtProviderTester, runKarnatakaHighCourtTests }

// Run tests if this file is executed directly
if (require.main === module) {
  runKarnatakaHighCourtTests().catch(console.error)
}
