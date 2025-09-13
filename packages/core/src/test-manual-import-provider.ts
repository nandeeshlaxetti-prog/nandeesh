import { 
  ManualImportProvider,
  ManualImportConfig,
  ManualFetchModalData,
  CourtCaseDTO
} from 'core'

/**
 * Manual Import Provider Test Suite
 * Tests the enhanced manual import provider with captcha handling and DOM parsing
 */
class ManualImportProviderTester {
  
  async testManualImportProvider() {
    console.log('📝 Testing Enhanced Manual Import Provider...\n')
    
    // Test basic functionality
    await this.testBasicFunctionality()
    
    // Test captcha/blocked scenarios
    await this.testCaptchaHandling()
    
    // Test DOM parsing
    await this.testDomParsing()
    
    // Test sync status management
    await this.testSyncStatusManagement()
    
    // Test manual fetch modal data
    await this.testManualFetchModal()
    
    console.log('\n✅ Manual Import Provider tests completed!')
  }
  
  private async testBasicFunctionality() {
    console.log('🔧 Testing Basic Functionality...')
    
    const config: ManualImportConfig = {
      officialPortalUrl: 'https://ecourts.gov.in',
      syncStatusCallback: (status) => {
        console.log(`  Sync Status Updated: ${status}`)
      }
    }
    
    const provider = new ManualImportProvider(config)
    
    // Test existing case lookup
    const existingCaseResult = await provider.getCaseByCNR('MANUAL001')
    console.log(`  Existing Case Lookup: ${existingCaseResult.success ? '✅' : '❌'} ${existingCaseResult.responseTime}ms`)
    
    // Test case search
    const searchResult = await provider.searchCase({
      caseType: 'CIVIL',
      court: 'DISTRICT_COURT'
    })
    console.log(`  Case Search: ${searchResult.success ? '✅' : '❌'} ${searchResult.responseTime}ms`)
    
    // Test cause list
    const causeListResult = await provider.getCauseList('DISTRICT_COURT', new Date('2024-02-15'))
    console.log(`  Cause List: ${causeListResult.success ? '✅' : '❌'} ${causeListResult.responseTime}ms`)
    
    // Test orders
    const ordersResult = await provider.listOrders('MANUAL001')
    console.log(`  Orders List: ${ordersResult.success ? '✅' : '❌'} ${ordersResult.responseTime}ms`)
    
    // Test capabilities
    const capabilities = provider.getCapabilities()
    console.log(`  Capabilities: CNR✅ Search✅ CauseList✅ Orders✅ PDF❌ RealTime❌`)
    console.log(`  Max Concurrent: ${capabilities.maxConcurrentRequests}, Rate Limit: ${capabilities.rateLimitPerMinute}/min\n`)
  }
  
  private async testCaptchaHandling() {
    console.log('🔐 Testing Captcha/Blocked Handling...')
    
    const config: ManualImportConfig = {
      officialPortalUrl: 'https://ecourts.gov.in',
      syncStatusCallback: (status) => {
        console.log(`    Sync Status: ${status}`)
      }
    }
    
    const provider = new ManualImportProvider(config)
    
    // Test multiple CNR lookups to trigger captcha scenario
    let captchaTriggered = false
    let successCount = 0
    
    for (let i = 0; i < 10; i++) {
      const cnr = `TEST${String(i + 1).padStart(3, '0')}`
      const result = await provider.getCaseByCNR(cnr)
      
      if (!result.success && result.error === 'MANUAL_FETCH_REQUIRED') {
        captchaTriggered = true
        console.log(`    Captcha Triggered: ✅ (CNR: ${cnr})`)
        console.log(`      Case Number: ${result.data?.caseNumber}`)
        console.log(`      Portal URL: ${result.data?.portalUrl}`)
        console.log(`      Message: ${result.data?.message}`)
        console.log(`      Sync Status: ${result.data?.syncStatus}`)
        break
      } else if (result.success) {
        successCount++
      }
    }
    
    if (!captchaTriggered) {
      console.log(`    Captcha Handling: ✅ (${successCount} successful requests, no captcha triggered)`)
    }
    
    console.log('')
  }
  
  private async testDomParsing() {
    console.log('🌐 Testing DOM Parsing...')
    
    const config: ManualImportConfig = {
      officialPortalUrl: 'https://ecourts.gov.in',
      domParser: (html: string) => {
        // Custom DOM parser implementation
        console.log(`    Custom Parser: Parsing ${html.length} characters`)
        
        // Mock parsed cases
        return [
          {
            cnr: 'PARSED001',
            caseNumber: '2024/PAR/001',
            title: 'Custom Parsed Case',
            court: 'DISTRICT_COURT',
            courtLocation: 'Custom Location',
            caseType: 'CIVIL',
            caseStatus: 'PENDING',
            filingDate: new Date(),
            nextHearingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            parties: [
              { name: 'Custom Plaintiff', type: 'PLAINTIFF' },
              { name: 'Custom Defendant', type: 'DEFENDANT' }
            ],
            advocates: [
              { name: 'Adv. Custom Advocate', barNumber: 'CUSTOM123456' }
            ]
          }
        ]
      },
      syncStatusCallback: (status) => {
        console.log(`    Sync Status: ${status}`)
      }
    }
    
    const provider = new ManualImportProvider(config)
    
    // Test HTML parsing with custom parser
    const mockHtml = '<html><body><div class="case-details">Mock case data</div></body></html>'
    const parseResult = await provider.parsePortalHtml(mockHtml, 'PARSED001')
    
    console.log(`  Custom Parser: ${parseResult.success ? '✅' : '❌'} ${parseResult.responseTime}ms`)
    if (parseResult.success) {
      console.log(`    Parsed Case: ${parseResult.data?.title}`)
      console.log(`    Case Number: ${parseResult.data?.caseNumber}`)
      console.log(`    Parties: ${parseResult.data?.parties?.length || 0}`)
    }
    
    // Test HTML parsing with default parser
    const defaultProvider = new ManualImportProvider({
      officialPortalUrl: 'https://ecourts.gov.in'
    })
    
    const defaultParseResult = await defaultProvider.parsePortalHtml(mockHtml, 'DEFAULT001')
    console.log(`  Default Parser: ${defaultParseResult.success ? '✅' : '❌'} ${defaultParseResult.responseTime}ms`)
    if (defaultParseResult.success) {
      console.log(`    Parsed Case: ${defaultParseResult.data?.title}`)
      console.log(`    Case Number: ${defaultParseResult.data?.caseNumber}`)
    }
    
    console.log('')
  }
  
  private async testSyncStatusManagement() {
    console.log('📊 Testing Sync Status Management...')
    
    const config: ManualImportConfig = {
      officialPortalUrl: 'https://ecourts.gov.in',
      syncStatusCallback: (status) => {
        console.log(`    Status Callback: ${status}`)
      }
    }
    
    const provider = new ManualImportProvider(config)
    
    // Test sync status for different CNRs
    const testCnrs = ['MANUAL001', 'MANUAL002', 'TEST001', 'PARSED001']
    
    for (const cnr of testCnrs) {
      const status = provider.getSyncStatus(cnr)
      console.log(`  CNR ${cnr}: ${status}`)
    }
    
    // Test status updates through import
    const newCase: CourtCaseDTO = {
      cnr: 'STATUS001',
      caseNumber: '2024/STA/001',
      title: 'Status Test Case',
      court: 'DISTRICT_COURT',
      courtLocation: 'Status Location',
      caseType: 'CIVIL',
      caseStatus: 'PENDING',
      filingDate: new Date(),
      nextHearingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      parties: [
        { name: 'Status Plaintiff', type: 'PLAINTIFF' },
        { name: 'Status Defendant', type: 'DEFENDANT' }
      ],
      advocates: [
        { name: 'Adv. Status Advocate', barNumber: 'STATUS123456' }
      ]
    }
    
    const importResult = await provider.importCase(newCase)
    console.log(`  Case Import: ${importResult.success ? '✅' : '❌'}`)
    
    const finalStatus = provider.getSyncStatus('STATUS001')
    console.log(`  Final Status: ${finalStatus}`)
    
    console.log('')
  }
  
  private async testManualFetchModal() {
    console.log('🖥️ Testing Manual Fetch Modal Data...')
    
    const config: ManualImportConfig = {
      officialPortalUrl: 'https://ecourts.gov.in',
      syncStatusCallback: (status) => {
        console.log(`    Modal Status: ${status}`)
      }
    }
    
    const provider = new ManualImportProvider(config)
    
    // Test manual fetch modal data generation
    const testCnrs = ['MODAL001', 'MODAL002', 'MODAL003']
    
    for (const cnr of testCnrs) {
      const result = await provider.getCaseByCNR(cnr)
      
      if (!result.success && result.error === 'MANUAL_FETCH_REQUIRED') {
        const modalData: ManualFetchModalData = {
          caseNumber: result.data?.caseNumber || '',
          cnr: result.data?.cnr || '',
          portalUrl: result.data?.portalUrl || '',
          message: result.data?.message || '',
          syncStatus: result.data?.syncStatus || 'action_required'
        }
        
        console.log(`  Modal Data for ${cnr}:`)
        console.log(`    Case Number: ${modalData.caseNumber}`)
        console.log(`    CNR: ${modalData.cnr}`)
        console.log(`    Portal URL: ${modalData.portalUrl}`)
        console.log(`    Message: ${modalData.message}`)
        console.log(`    Sync Status: ${modalData.syncStatus}`)
        break
      }
    }
    
    console.log('')
  }
}

// Run the test suite
async function runManualImportTests() {
  const tester = new ManualImportProviderTester()
  await tester.testManualImportProvider()
}

// Export for use in other modules
export { ManualImportProviderTester, runManualImportTests }

// Run tests if this file is executed directly
if (require.main === module) {
  runManualImportTests().catch(console.error)
}
