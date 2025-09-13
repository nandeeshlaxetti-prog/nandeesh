import { 
  CourtProvider, 
  CourtCaseDTO, 
  SearchResult, 
  CauseListDTO, 
  OrderDTO, 
  SearchFilters, 
  ProviderConfig, 
  ProviderResponse, 
  ProviderCapabilities,
  PartyDTO,
  AdvocateDTO,
  JudgeDTO,
  CaseDetailsDTO,
  HearingDTO,
  CauseListItemDTO
} from '../court-provider'

/**
 * Manual Import Provider
 * Implements manual data entry and import functionality
 */
export interface ManualImportConfig extends ProviderConfig {
  officialPortalUrl?: string
  domParser?: (html: string) => CourtCaseDTO[]
  syncStatusCallback?: (status: 'pending' | 'action_required' | 'completed' | 'failed') => void
}

export interface ManualFetchModalData {
  caseNumber: string
  cnr: string
  portalUrl: string
  message: string
  syncStatus: 'pending' | 'action_required' | 'completed' | 'failed'
}

export class ManualImportProvider implements CourtProvider {
  readonly name = 'Manual Import Provider'
  readonly type = 'MANUAL_IMPORT' as const
  
  private config: ManualImportConfig
  private importedCases: Map<string, CourtCaseDTO> = new Map()
  private importedOrders: Map<string, OrderDTO[]> = new Map()
  private syncStatuses: Map<string, 'pending' | 'action_required' | 'completed' | 'failed'> = new Map()
  
  constructor(config?: ManualImportConfig) {
    this.config = config || {}
    this.initializeSampleData()
  }
  
  async getCaseByCNR(cnr: string, config?: ProviderConfig): Promise<ProviderResponse<CourtCaseDTO>> {
    const startTime = Date.now()
    const effectiveConfig = { ...this.config, ...config } as ManualImportConfig
    
    try {
      // Validate CNR format
      if (!this.isValidCNR(cnr)) {
        return {
          success: false,
          error: 'Invalid CNR format',
          provider: this.name
        }
      }
      
      // Simulate manual lookup delay
      await this.simulateManualDelay(200, 500)
      
      // Check if case exists in imported data
      const caseData = this.importedCases.get(cnr)
      
      if (!caseData) {
        // Check if this is a captcha/blocked scenario (simulate 30% chance)
        if (Math.random() < 0.3) {
          // Set sync status to action_required
          this.syncStatuses.set(cnr, 'action_required')
          this.updateSyncStatus('action_required')
          
          return {
            success: false,
            error: 'MANUAL_FETCH_REQUIRED',
            data: {
              action_required: true,
              caseNumber: this.generateCaseNumber(cnr),
              cnr: cnr,
              portalUrl: effectiveConfig.officialPortalUrl || 'https://ecourts.gov.in',
              message: 'Manual fetch required due to captcha/blocking. Please complete the process in the official portal.',
              syncStatus: 'action_required'
            } as any,
            responseTime: Date.now() - startTime,
            provider: this.name
          }
        }
        
        return {
          success: false,
          error: 'Case not found in imported data. Please import the case first.',
          responseTime: Date.now() - startTime,
          provider: this.name
        }
      }
      
      return {
        success: true,
        data: caseData,
        responseTime: Date.now() - startTime,
        provider: this.name
      }
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: Date.now() - startTime,
        provider: this.name
      }
    }
  }
  
  async searchCase(filters: SearchFilters, config?: ProviderConfig): Promise<ProviderResponse<SearchResult>> {
    const startTime = Date.now()
    const effectiveConfig = { ...this.config, ...config }
    
    try {
      // Simulate manual search delay
      await this.simulateManualDelay(300, 800)
      
      // Search through imported cases
      let matchingCases: CourtCaseDTO[] = []
      
      for (const caseData of this.importedCases.values()) {
        let matches = true
        
        // Apply filters
        if (filters.caseNumber && !caseData.caseNumber.toLowerCase().includes(filters.caseNumber.toLowerCase())) {
          matches = false
        }
        
        if (filters.year && new Date(caseData.filingDate).getFullYear() !== filters.year) {
          matches = false
        }
        
        if (filters.court && !caseData.court.toLowerCase().includes(filters.court.toLowerCase())) {
          matches = false
        }
        
        if (filters.caseType && caseData.caseType !== filters.caseType) {
          matches = false
        }
        
        if (filters.caseStatus && caseData.caseStatus !== filters.caseStatus) {
          matches = false
        }
        
        if (filters.partyName) {
          const partyNames = caseData.parties.map(p => p.name.toLowerCase())
          if (!partyNames.some(name => name.includes(filters.partyName!.toLowerCase()))) {
            matches = false
          }
        }
        
        if (filters.advocateName) {
          const advocateNames = caseData.advocates.map(a => a.name.toLowerCase())
          if (!advocateNames.some(name => name.includes(filters.advocateName!.toLowerCase()))) {
            matches = false
          }
        }
        
        if (matches) {
          matchingCases.push(caseData)
        }
      }
      
      const searchResult: SearchResult = {
        cases: matchingCases,
        totalCount: matchingCases.length,
        hasMore: false,
        nextPageToken: undefined
      }
      
      return {
        success: true,
        data: searchResult,
        responseTime: Date.now() - startTime,
        provider: this.name
      }
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: Date.now() - startTime,
        provider: this.name
      }
    }
  }
  
  async getCauseList(court: string, date: Date, config?: ProviderConfig): Promise<ProviderResponse<CauseListDTO>> {
    const startTime = Date.now()
    const effectiveConfig = { ...this.config, ...config }
    
    try {
      // Simulate manual cause list creation
      await this.simulateManualDelay(400, 700)
      
      // Generate cause list from imported cases for the specified date
      const items: CauseListItemDTO[] = []
      let itemNumber = 1
      
      for (const caseData of this.importedCases.values()) {
        // Check if case has hearing on the specified date
        if (caseData.nextHearingDate && 
            caseData.nextHearingDate.toDateString() === date.toDateString() &&
            caseData.court.toLowerCase().includes(court.toLowerCase())) {
          
          items.push({
            caseNumber: caseData.caseNumber,
            cnr: caseData.cnr,
            title: caseData.title,
            parties: caseData.parties.map(p => p.name),
            advocates: caseData.advocates.map(a => a.name),
            hearingTime: '10:00', // Default time for manual entries
            purpose: 'Hearing',
            judge: caseData.judges?.[0],
            itemNumber: itemNumber++
          })
        }
      }
      
      const causeList: CauseListDTO = {
        id: `manual-cause-list-${court}-${date.toISOString().split('T')[0]}`,
        court,
        date,
        items
      }
      
      return {
        success: true,
        data: causeList,
        responseTime: Date.now() - startTime,
        provider: this.name
      }
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: Date.now() - startTime,
        provider: this.name
      }
    }
  }
  
  async listOrders(cnr: string, config?: ProviderConfig): Promise<ProviderResponse<OrderDTO[]>> {
    const startTime = Date.now()
    const effectiveConfig = { ...this.config, ...config }
    
    try {
      // Simulate manual order lookup
      await this.simulateManualDelay(200, 400)
      
      // Get orders for the case
      const orders = this.importedOrders.get(cnr) || []
      
      return {
        success: true,
        data: orders,
        responseTime: Date.now() - startTime,
        provider: this.name
      }
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: Date.now() - startTime,
        provider: this.name
      }
    }
  }
  
  async downloadOrderPdf(orderId: string, config?: ProviderConfig): Promise<ProviderResponse<Buffer>> {
    const startTime = Date.now()
    const effectiveConfig = { ...this.config, ...config }
    
    try {
      // Manual import doesn't support PDF download
      return {
        success: false,
        error: 'PDF download not supported in manual import mode. Please upload PDF files manually.',
        responseTime: Date.now() - startTime,
        provider: this.name
      }
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: Date.now() - startTime,
        provider: this.name
      }
    }
  }
  
  async testConnection(config?: ProviderConfig): Promise<ProviderResponse<boolean>> {
    const startTime = Date.now()
    const effectiveConfig = { ...this.config, ...config }
    
    try {
      // Manual import doesn't require external connection
      await this.simulateManualDelay(100, 200)
      
      return {
        success: true,
        data: true,
        responseTime: Date.now() - startTime,
        provider: this.name
      }
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: Date.now() - startTime,
        provider: this.name
      }
    }
  }
  
  getCapabilities(): ProviderCapabilities {
    return {
      supportsCNRLookup: true,
      supportsCaseSearch: true,
      supportsCauseList: true,
      supportsOrderListing: true,
      supportsPdfDownload: false, // Manual import doesn't support PDF download
      supportsRealTimeSync: false, // Manual import is not real-time
      maxConcurrentRequests: 100, // High limit for manual operations
      rateLimitPerMinute: 1000, // High limit for manual operations
      supportedCourts: ['ALL'], // Manual import supports all courts
      supportedCaseTypes: ['ALL'] // Manual import supports all case types
    }
  }
  
  // Additional methods for manual import functionality
  
  /**
   * Import a case manually
   */
  async importCase(caseData: CourtCaseDTO): Promise<ProviderResponse<boolean>> {
    try {
      this.importedCases.set(caseData.cnr, caseData)
      this.syncStatuses.set(caseData.cnr, 'completed')
      this.updateSyncStatus('completed')
      return {
        success: true,
        data: true,
        provider: this.name
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: this.name
      }
    }
  }
  
  /**
   * Parse HTML from official portal and convert to DTOs
   */
  async parsePortalHtml(html: string, cnr: string): Promise<ProviderResponse<CourtCaseDTO>> {
    try {
      // Set sync status to pending during parsing
      this.syncStatuses.set(cnr, 'pending')
      this.updateSyncStatus('pending')
      
      // Use custom DOM parser if provided, otherwise use default
      let caseData: CourtCaseDTO
      
      if (this.config.domParser) {
        const parsedCases = this.config.domParser(html)
        caseData = parsedCases[0] || this.createDefaultCaseFromCnr(cnr)
      } else {
        caseData = this.parseHtmlToCase(html, cnr)
      }
      
      // Import the parsed case
      await this.importCase(caseData)
      
      return {
        success: true,
        data: caseData,
        provider: this.name
      }
    } catch (error) {
      this.syncStatuses.set(cnr, 'failed')
      this.updateSyncStatus('failed')
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to parse portal HTML',
        provider: this.name
      }
    }
  }
  
  /**
   * Get sync status for a case
   */
  getSyncStatus(cnr: string): 'pending' | 'action_required' | 'completed' | 'failed' {
    return this.syncStatuses.get(cnr) || 'pending'
  }
  
  /**
   * Update sync status and notify callback
   */
  private updateSyncStatus(status: 'pending' | 'action_required' | 'completed' | 'failed'): void {
    if (this.config.syncStatusCallback) {
      this.config.syncStatusCallback(status)
    }
  }
  
  /**
   * Parse HTML to case DTO (default implementation)
   */
  private parseHtmlToCase(html: string, cnr: string): CourtCaseDTO {
    // This is a mock implementation - in real scenario, you would parse actual HTML
    // For now, we'll create a case based on the CNR and some mock data
    
    return {
      cnr,
      caseNumber: this.generateCaseNumber(cnr),
      title: 'Parsed Case from Portal',
      court: 'DISTRICT COURT',
      courtLocation: 'Sample Location',
      caseType: 'CIVIL',
      caseStatus: 'PENDING',
      filingDate: new Date(),
      nextHearingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      parties: [
        {
          name: 'Parsed Plaintiff',
          type: 'PLAINTIFF',
          address: 'Parsed Address',
          phone: '+91-9876543210',
          email: 'plaintiff@example.com'
        },
        {
          name: 'Parsed Defendant',
          type: 'DEFENDANT',
          address: 'Parsed Address',
          phone: '+91-9876543211',
          email: 'defendant@example.com'
        }
      ],
      advocates: [
        {
          name: 'Adv. Parsed Advocate',
          barNumber: 'PARSED123456',
          phone: '+91-9876543212',
          email: 'advocate@example.com',
          address: 'Parsed Legal Office'
        }
      ],
      judges: [
        {
          name: 'Hon. Parsed Judge',
          designation: 'District Judge',
          court: 'DISTRICT COURT'
        }
      ],
      caseDetails: {
        subjectMatter: 'Parsed Subject Matter',
        caseDescription: 'Case parsed from official portal',
        reliefSought: 'Parsed relief',
        caseValue: 100000,
        jurisdiction: 'District Court'
      }
    }
  }
  
  /**
   * Create default case from CNR when parsing fails
   */
  private createDefaultCaseFromCnr(cnr: string): CourtCaseDTO {
    return {
      cnr,
      caseNumber: this.generateCaseNumber(cnr),
      title: 'Default Case from CNR',
      court: 'DISTRICT COURT',
      courtLocation: 'Default Location',
      caseType: 'CIVIL',
      caseStatus: 'PENDING',
      filingDate: new Date(),
      nextHearingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      parties: [
        {
          name: 'Default Plaintiff',
          type: 'PLAINTIFF'
        },
        {
          name: 'Default Defendant',
          type: 'DEFENDANT'
        }
      ],
      advocates: [
        {
          name: 'Adv. Default Advocate',
          barNumber: 'DEFAULT123456'
        }
      ]
    }
  }
  
  /**
   * Import orders for a case
   */
  async importOrders(cnr: string, orders: OrderDTO[]): Promise<ProviderResponse<boolean>> {
    try {
      this.importedOrders.set(cnr, orders)
      return {
        success: true,
        data: true,
        provider: this.name
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: this.name
      }
    }
  }
  
  /**
   * Get all imported cases
   */
  async getAllImportedCases(): Promise<CourtCaseDTO[]> {
    return Array.from(this.importedCases.values())
  }
  
  /**
   * Clear all imported data
   */
  async clearImportedData(): Promise<void> {
    this.importedCases.clear()
    this.importedOrders.clear()
  }
  
  // Helper methods
  private isValidCNR(cnr: string): boolean {
    // Basic CNR validation
    return /^[A-Z0-9]{10,20}$/i.test(cnr)
  }
  
  private async simulateManualDelay(min: number, max: number): Promise<void> {
    const delay = min + Math.random() * (max - min)
    await new Promise(resolve => setTimeout(resolve, delay))
  }
  
  private initializeSampleData(): void {
    // Initialize with some sample imported cases
    const sampleCases: CourtCaseDTO[] = [
      {
        cnr: 'MANUAL001',
        caseNumber: '2024/MAN/001',
        title: 'Sample Manual Case 1 vs Respondent 1',
        court: 'DISTRICT COURT',
        courtLocation: 'Sample District',
        caseType: 'CIVIL',
        caseStatus: 'PENDING',
        filingDate: new Date('2024-01-15'),
        nextHearingDate: new Date('2024-02-15'),
        parties: [
          { name: 'Manual Plaintiff 1', type: 'PLAINTIFF' },
          { name: 'Manual Defendant 1', type: 'DEFENDANT' }
        ],
        advocates: [
          { name: 'Adv. Manual Advocate 1', barNumber: 'MAN001' }
        ],
        judges: [
          { name: 'Hon. Manual Judge 1', designation: 'District Judge', court: 'DISTRICT COURT' }
        ]
      },
      {
        cnr: 'MANUAL002',
        caseNumber: '2024/MAN/002',
        title: 'Sample Manual Case 2 vs Respondent 2',
        court: 'HIGH COURT',
        courtLocation: 'Sample State',
        caseType: 'CRIMINAL',
        caseStatus: 'PENDING',
        filingDate: new Date('2024-01-20'),
        nextHearingDate: new Date('2024-02-20'),
        parties: [
          { name: 'Manual Petitioner 2', type: 'PETITIONER' },
          { name: 'Manual Respondent 2', type: 'RESPONDENT' }
        ],
        advocates: [
          { name: 'Adv. Manual Advocate 2', barNumber: 'MAN002' }
        ],
        judges: [
          { name: 'Hon. Manual Judge 2', designation: 'Justice', court: 'HIGH COURT' }
        ]
      }
    ]
    
    // Add sample cases to imported data
    sampleCases.forEach(caseData => {
      this.importedCases.set(caseData.cnr, caseData)
    })
    
    // Add sample orders
    const sampleOrders: OrderDTO[] = [
      {
        id: 'order-manual-001',
        caseId: 'MANUAL001',
        cnr: 'MANUAL001',
        orderDate: new Date('2024-01-20'),
        orderType: 'Interim Order',
        orderText: 'This is a sample interim order for manual case 1.',
        judge: { name: 'Hon. Manual Judge 1', designation: 'District Judge', court: 'DISTRICT COURT' },
        orderNumber: 'ORD-MAN-001',
        isDownloadable: false
      }
    ]
    
    this.importedOrders.set('MANUAL001', sampleOrders)
  }
}
