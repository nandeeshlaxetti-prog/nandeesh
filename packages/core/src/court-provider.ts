// Court Provider Interface and DTOs
export interface CourtCaseDTO {
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

export interface PartyDTO {
  name: string
  type: 'PLAINTIFF' | 'DEFENDANT' | 'PETITIONER' | 'RESPONDENT' | 'APPELLANT' | 'RESPONDENT_APPEAL'
  address?: string
  phone?: string
  email?: string
}

export interface AdvocateDTO {
  name: string
  barNumber?: string
  phone?: string
  email?: string
  address?: string
}

export interface JudgeDTO {
  name: string
  designation: string
  court?: string
}

export interface CaseDetailsDTO {
  subjectMatter?: string
  caseDescription?: string
  reliefSought?: string
  caseValue?: number
  jurisdiction?: string
}

export interface HearingDTO {
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

export interface OrderDTO {
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

export interface CauseListDTO {
  id: string
  court: string
  date: Date
  items: CauseListItemDTO[]
}

export interface CauseListItemDTO {
  caseNumber: string
  cnr: string
  title: string
  parties: string[]
  advocates: string[]
  hearingTime?: string
  purpose: string
  judge?: JudgeDTO
  itemNumber: number
}

export interface SearchFilters {
  caseNumber?: string
  year?: number
  state?: string
  district?: string
  court?: string
  bench?: string
  partyName?: string
  advocateName?: string
  filingDateFrom?: Date
  filingDateTo?: Date
  caseType?: string
  caseStatus?: string
}

export interface SearchResult {
  cases: CourtCaseDTO[]
  totalCount: number
  hasMore: boolean
  nextPageToken?: string
}

export interface ProviderConfig {
  apiEndpoint?: string
  apiKey?: string
  username?: string
  password?: string
  courtCode?: string
  benchCode?: string
  timeout?: number
  retryAttempts?: number
}

export interface ProviderResponse<T> {
  success: boolean
  data?: T
  error?: string
  responseTime?: number
  provider: string
}

/**
 * Court Provider Interface
 * Defines the contract for all court data providers
 */
export interface CourtProvider {
  readonly name: string
  readonly type: 'DISTRICT_HIGH_COURT' | 'JUDGMENTS' | 'MANUAL_IMPORT' | 'THIRD_PARTY'
  
  /**
   * Get case details by CNR (Case Number Record)
   */
  getCaseByCNR(cnr: string, config?: ProviderConfig): Promise<ProviderResponse<CourtCaseDTO>>
  
  /**
   * Search for cases based on filters
   */
  searchCase(filters: SearchFilters, config?: ProviderConfig): Promise<ProviderResponse<SearchResult>>
  
  /**
   * Get cause list for a specific court and date
   */
  getCauseList(court: string, date: Date, config?: ProviderConfig): Promise<ProviderResponse<CauseListDTO>>
  
  /**
   * List orders for a specific case
   */
  listOrders(cnr: string, config?: ProviderConfig): Promise<ProviderResponse<OrderDTO[]>>
  
  /**
   * Download order PDF
   */
  downloadOrderPdf(orderId: string, config?: ProviderConfig): Promise<ProviderResponse<Buffer>>
  
  /**
   * Test provider connection
   */
  testConnection(config?: ProviderConfig): Promise<ProviderResponse<boolean>>
  
  /**
   * Get provider capabilities
   */
  getCapabilities(): ProviderCapabilities
}

export interface ProviderCapabilities {
  supportsCNRLookup: boolean
  supportsCaseSearch: boolean
  supportsCauseList: boolean
  supportsOrderListing: boolean
  supportsPdfDownload: boolean
  supportsRealTimeSync: boolean
  maxConcurrentRequests: number
  rateLimitPerMinute: number
  supportedCourts: string[]
  supportedCaseTypes: string[]
}

/**
 * Provider Factory
 * Creates provider instances based on type
 */
export class CourtProviderFactory {
  static createProvider(type: string, config?: ProviderConfig): CourtProvider {
    switch (type) {
      case 'DISTRICT_HIGH_COURT':
        return new DistrictHighCourtProvider(config)
      case 'JUDGMENTS':
        return new JudgmentsProvider(config)
      case 'MANUAL_IMPORT':
        return new ManualImportProvider(config)
      case 'THIRD_PARTY':
        return new ThirdPartyProvider(config)
      default:
        throw new Error(`Unknown provider type: ${type}`)
    }
  }
  
  static getAvailableProviders(): string[] {
    return ['DISTRICT_HIGH_COURT', 'JUDGMENTS', 'MANUAL_IMPORT', 'THIRD_PARTY']
  }
}
