import axios from 'axios'
import * as cheerio from 'cheerio'

export type ECourtsProviderType = 'official' | 'manual' | 'third_party'

export interface ECourtsConfig {
  provider: ECourtsProviderType
  apiKey?: string
  baseUrl?: string
  timeout?: number
}

export interface ECourtsCaseData {
  cnr: string
  caseNumber: string
  filingNumber?: string
  title: string
  court: string
  courtLocation: string
  hallNumber?: string
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
    type?: string
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
  hearingHistory: Array<{
    date: string
    purpose: string
    judge: string
    status?: string
  }>
  orders: Array<{
    number: number
    name: string
    date: string
    url?: string
  }>
  actsAndSections?: {
    acts: string
    sections: string
  }
  registrationNumber?: string
  registrationDate?: string
  firstHearingDate?: string
  decisionDate?: string
  natureOfDisposal?: string
  caseDetails: {
    subjectMatter: string
    caseDescription: string
    reliefSought: string
    caseValue?: number
    jurisdiction: string
  }
}

export interface ECourtsResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  requiresCaptcha?: boolean
  requiresManual?: boolean
}

export interface SearchFilters {
  cnr?: string
  caseNumber?: string
  partyName?: string
  advocateName?: string
  court?: string
  courtType?: 'district' | 'high' | 'supreme' | 'nclt' | 'cat' | 'consumer'
  filingDateFrom?: string
  filingDateTo?: string
  hearingDateFrom?: string
  hearingDateTo?: string
  caseType?: string
  caseStatus?: string
  limit?: number
  offset?: number
}

export interface SearchResult {
  success: boolean
  data?: ECourtsCaseData[]
  total?: number
  page?: number
  limit?: number
  error?: string
  message?: string
}

export class ECourtsProvider {
  private config: ECourtsConfig
  private timeout = 30000

  // Official API endpoints
  private readonly OFFICIAL_ENDPOINTS = {
    NAPIX: 'https://napix.gov.in/api/ecourts',
    API_SETU: 'https://apisetu.gov.in/api/ecourts',
    DISTRICT_PORTAL: 'https://services.ecourts.gov.in/',
    HIGH_COURT_PORTAL: 'https://hcservices.ecourts.gov.in/',
    JUDGMENTS_PORTAL: 'https://judgments.ecourts.gov.in/'
  }

  // Third-party API endpoints
  private readonly THIRD_PARTY_ENDPOINTS = {
    KLEOPATRA: 'https://court-api.kleopatra.io',
    SUREPASS: 'https://surepass.io/api/ecourt-cnr-search',
    LEGALKART: 'https://www.legalkart.com/api/ecourts'
  }

  constructor(config?: ECourtsConfig) {
    this.config = {
      provider: config?.provider || (process.env.ECOURTS_PROVIDER as ECourtsProviderType) || 'official',
      apiKey: config?.apiKey || process.env.ECOURTS_API_KEY,
      baseUrl: config?.baseUrl,
      timeout: config?.timeout || 30000
    }
  }

  /**
   * Determine court type based on CNR pattern
   */
  private determineCourtType(cnr: string): 'district' | 'high' | 'supreme' | 'nclt' | 'consumer' {
    const upperCnr = cnr.toUpperCase()
    
    // High Court patterns (DLHC, KAHC, etc.)
    if (upperCnr.includes('HC') || upperCnr.startsWith('DLHC') || upperCnr.startsWith('KAHC')) {
      return 'high'
    }
    
    // Supreme Court patterns
    if (upperCnr.includes('SC') || upperCnr.startsWith('DLSC')) {
      return 'supreme'
    }
    
    // NCLT patterns
    if (upperCnr.includes('NCLT') || upperCnr.includes('NCLAT')) {
      return 'nclt'
    }
    
    // Consumer Forum patterns
    if (upperCnr.includes('CF') || upperCnr.includes('CONSUMER')) {
      return 'consumer'
    }
    
    // Default to district court
    return 'district'
  }

  /**
   * Search for a case by CNR number
   */
  async getCaseByCNR(cnr: string): Promise<ECourtsResponse<ECourtsCaseData>> {
    try {
      // Validate CNR format (exactly 16 characters, can contain letters and digits)
      if (!/^[A-Za-z0-9\-]{16}$/.test(cnr)) {
        return {
          success: false,
          error: 'INVALID_CNR',
          message: 'CNR must be exactly 16 characters and contain only letters, digits, and hyphens'
        }
      }

      // Determine court type based on CNR pattern
      const courtType = this.determineCourtType(cnr)
      console.log(`🔍 Detected court type: ${courtType} for CNR: ${cnr}`)

      switch (this.config.provider) {
        case 'official':
          return await this.getCaseFromOfficialAPI(cnr)
        case 'manual':
          return await this.getCaseFromManualPortal(cnr)
        case 'third_party':
          return await this.getCaseFromThirdPartyAPI(cnr, courtType)
        default:
          return {
            success: false,
            error: 'INVALID_PROVIDER',
            message: 'Invalid provider specified'
          }
      }
      
    } catch (error) {
      console.error('Error fetching case by CNR:', error)
      return {
        success: false,
        error: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Try official government APIs (NAPIX, API Setu)
   */
  private async getCaseFromOfficialAPI(cnr: string): Promise<ECourtsResponse<ECourtsCaseData>> {
    try {
      // Try NAPIX API first
      if (this.config.apiKey) {
        try {
          const napixResponse = await axios.get(`${this.OFFICIAL_ENDPOINTS.NAPIX}/cases/${cnr}`, {
            headers: {
              'Authorization': `Bearer ${this.config.apiKey}`,
              'Content-Type': 'application/json'
            },
            timeout: this.config.timeout
          })

          if (napixResponse.data) {
            return {
              success: true,
              data: this.mapOfficialResponseToCaseData(napixResponse.data, cnr)
            }
          }
        } catch (napixError) {
          console.log('NAPIX API failed, trying API Setu...')
        }

        // Try API Setu as fallback
        try {
          const apiSetuResponse = await axios.get(`${this.OFFICIAL_ENDPOINTS.API_SETU}/cases/${cnr}`, {
            headers: {
              'X-API-KEY': this.config.apiKey,
              'Content-Type': 'application/json'
            },
            timeout: this.config.timeout
          })

          if (apiSetuResponse.data) {
            return {
              success: true,
              data: this.mapOfficialResponseToCaseData(apiSetuResponse.data, cnr)
            }
          }
        } catch (apiSetuError) {
          console.log('API Setu failed, falling back to manual portal...')
        }
      }

      // If no API key or official APIs fail, fall back to manual portal
      return await this.getCaseFromManualPortal(cnr)

    } catch (error) {
      console.error('Official API error:', error)
      return {
        success: false,
        error: 'OFFICIAL_API_ERROR',
        message: 'Official APIs are not accessible. Please use manual or third-party provider.',
        requiresManual: true
      }
    }
  }

  /**
   * Try manual portal scraping (with CAPTCHA handling)
   */
  private async getCaseFromManualPortal(cnr: string): Promise<ECourtsResponse<ECourtsCaseData>> {
    try {
      // Try district portal first
      const districtResponse = await this.scrapeDistrictPortal(cnr)
      if (districtResponse.success) {
        return districtResponse
      }

      // Try high court portal
      const highCourtResponse = await this.scrapeHighCourtPortal(cnr)
      if (highCourtResponse.success) {
        return highCourtResponse
      }

      // If both fail, return CAPTCHA required
      return {
        success: false,
        error: 'CAPTCHA_REQUIRED',
        message: 'Manual intervention required due to CAPTCHA or access restrictions',
        requiresCaptcha: true,
        requiresManual: true
      }

    } catch (error) {
      console.error('Manual portal error:', error)
      return {
        success: false,
        error: 'MANUAL_PORTAL_ERROR',
        message: 'Manual portals are not accessible',
        requiresManual: true
      }
    }
  }

  /**
   * Try third-party APIs with correct Kleopatra endpoint
   */
  private async getCaseFromThirdPartyAPI(cnr: string, courtType: 'district' | 'high' | 'supreme' | 'nclt' | 'consumer' = 'district'): Promise<ECourtsResponse<ECourtsCaseData>> {
    try {
      // Try Kleopatra API with correct endpoint
      if (this.config.apiKey) {
        try {
          console.log('🔍 Attempting Kleopatra API with key:', this.config.apiKey.substring(0, 10) + '...')
          
          // Determine the correct endpoint based on court type
          const endpointMap: Record<string, string> = {
            'district': 'district-court',
            'high': 'high-court', 
            'supreme': 'supreme-court',
            'nclt': 'nclt',
            'consumer': 'consumer-forum'
          }
          
          const kleopatraEndpoint = `${this.THIRD_PARTY_ENDPOINTS.KLEOPATRA}/api/core/live/${endpointMap[courtType]}/case`
          
          console.log(`🔍 Using ${courtType} court Kleopatra endpoint:`, kleopatraEndpoint)
          console.log('📤 Sending CNR:', cnr)
          
          const kleopatraResponse = await axios.post(kleopatraEndpoint, {
            cnr: cnr
          }, {
            headers: {
              'Authorization': `Bearer ${this.config.apiKey}`,
              'Content-Type': 'application/json'
            },
            timeout: 30000 // 30 seconds timeout for browser environment
          })

          console.log('✅ Kleopatra API success:', kleopatraResponse.status)
          console.log('📊 Response data:', kleopatraResponse.data)
          console.log('📊 Response headers:', kleopatraResponse.headers)
          
          // Check for different response formats
          if (kleopatraResponse.data && typeof kleopatraResponse.data === 'object' && Object.keys(kleopatraResponse.data).length > 0) {
            // Check for common case data fields
            if (kleopatraResponse.data.title || kleopatraResponse.data.parties || kleopatraResponse.data.cnr) {
              console.log('✅ Response validation passed - mapping data...')
              return {
                success: true,
                data: this.mapKleopatraResponseToCaseData(kleopatraResponse.data, cnr)
              }
            }
            
            // Check if response is an array with case data
            if (Array.isArray(kleopatraResponse.data) && kleopatraResponse.data.length > 0) {
              return {
                success: true,
                data: this.mapKleopatraResponseToCaseData(kleopatraResponse.data[0], cnr)
              }
            }
          }
          
          console.log(`⚠️ Empty or invalid response from ${courtType} court API - trying other court types`)
          console.log('ℹ️ Note: eCourts official servers are currently experiencing issues')
          
          // Try other court types as fallback
          const fallbackCourtTypes = ['district', 'high', 'supreme', 'nclt', 'consumer'].filter(type => type !== courtType)
          
          for (const fallbackCourtType of fallbackCourtTypes) {
            try {
              console.log(`🔍 Trying fallback ${fallbackCourtType} court endpoint`)
              const fallbackEndpoint = `${this.THIRD_PARTY_ENDPOINTS.KLEOPATRA}/api/core/live/${endpointMap[fallbackCourtType]}/case`
              
              const altResponse = await axios.post(fallbackEndpoint, {
                cnr: cnr
              }, {
                headers: {
                  'Authorization': `Bearer ${this.config.apiKey}`,
                  'Content-Type': 'application/json'
                },
                timeout: 30000 // 30 seconds timeout for browser environment
              })

              console.log(`✅ Fallback ${fallbackCourtType} court endpoint success:`, altResponse.status)
              console.log('📊 Response data:', altResponse.data)
              
              if (altResponse.data && Object.keys(altResponse.data).length > 0) {
                return {
                  success: true,
                  data: this.mapKleopatraResponseToCaseData(altResponse.data, cnr)
                }
              } else {
                console.log(`⚠️ Empty response from fallback ${fallbackCourtType} court endpoint`)
              }
            } catch (altError) {
              console.log(`⚠️ Fallback ${fallbackCourtType} court endpoint failed:`, altError instanceof Error ? altError.message : 'Unknown error')
              continue
            }
          }
          
        } catch (kleopatraError) {
          console.log('❌ Kleopatra API failed:', kleopatraError instanceof Error ? kleopatraError.message : 'Unknown error')
          
          // Log detailed error information
          if (kleopatraError instanceof Error) {
            console.log('❌ Error details:', {
              message: kleopatraError.message,
              name: kleopatraError.name,
              stack: kleopatraError.stack
            })
          }
          
          // Check if it's an axios error with response data
          if (kleopatraError && typeof kleopatraError === 'object' && 'response' in kleopatraError) {
            const axiosError = kleopatraError as any
            console.log('❌ Axios error response:', {
              status: axiosError.response?.status,
              statusText: axiosError.response?.statusText,
              data: axiosError.response?.data,
              headers: axiosError.response?.headers
            })
          }
          
          // If all endpoints fail, return error
          console.log('❌ All Kleopatra endpoints failed - eCourts servers may be down')
          return {
            success: false,
            error: 'API_UNAVAILABLE',
            message: 'Court API endpoints are currently unavailable. Please try again later.'
          }
        }

        // Try Surepass API
        try {
          const surepassResponse = await axios.post(`${this.THIRD_PARTY_ENDPOINTS.SUREPASS}`, {
            cnr: cnr
          }, {
            headers: {
              'Authorization': `Bearer ${this.config.apiKey}`,
              'Content-Type': 'application/json'
            },
            timeout: this.config.timeout
          })

          if (surepassResponse.data) {
            return {
              success: true,
              data: this.mapThirdPartyResponseToCaseData(surepassResponse.data, cnr)
            }
          }
        } catch (surepassError) {
          console.log('Surepass API failed, trying Legalkart...')
        }

        // Try Legalkart API
        try {
          const legalkartResponse = await axios.get(`${this.THIRD_PARTY_ENDPOINTS.LEGALKART}/cnr/${cnr}`, {
            headers: {
              'X-API-KEY': this.config.apiKey,
              'Content-Type': 'application/json'
            },
            timeout: this.config.timeout
          })

          if (legalkartResponse.data) {
            return {
              success: true,
              data: this.mapThirdPartyResponseToCaseData(legalkartResponse.data, cnr)
            }
          }
        } catch (legalkartError) {
          console.log('Legalkart API failed')
        }
      }

      // If all third-party APIs fail, return error
      return {
        success: false,
        error: 'THIRD_PARTY_API_ERROR',
        message: 'All third-party APIs are not accessible. Please check API keys or try manual provider.',
        requiresManual: true
      }

    } catch (error) {
      console.error('Third-party API error:', error)
      return {
        success: false,
        error: 'THIRD_PARTY_API_ERROR',
        message: 'Third-party APIs are not accessible',
        requiresManual: true
      }
    }
  }

  /**
   * Scrape district portal
   */
  private async scrapeDistrictPortal(cnr: string): Promise<ECourtsResponse<ECourtsCaseData>> {
    try {
      const response = await axios.get(this.OFFICIAL_ENDPOINTS.DISTRICT_PORTAL, {
        timeout: this.config.timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })

      // Check if CAPTCHA is required
      const $ = cheerio.load(response.data)
      if ($('img[src*="captcha"]').length > 0 || $('input[name*="captcha"]').length > 0) {
        return {
          success: false,
          error: 'CAPTCHA_REQUIRED',
          message: 'CAPTCHA required on district portal',
          requiresCaptcha: true
        }
      }

      // If no CAPTCHA, try to parse case data
      // This would need to be implemented based on actual portal structure
      return {
        success: false,
        error: 'PARSING_ERROR',
        message: 'Unable to parse district portal data'
      }

    } catch (error) {
      return {
        success: false,
        error: 'DISTRICT_PORTAL_ERROR',
        message: 'District portal not accessible'
      }
    }
  }

  /**
   * Scrape high court portal
   */
  private async scrapeHighCourtPortal(cnr: string): Promise<ECourtsResponse<ECourtsCaseData>> {
    try {
      const response = await axios.get(this.OFFICIAL_ENDPOINTS.HIGH_COURT_PORTAL, {
        timeout: this.config.timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })

      // Check if CAPTCHA is required
      const $ = cheerio.load(response.data)
      if ($('img[src*="captcha"]').length > 0 || $('input[name*="captcha"]').length > 0) {
        return {
          success: false,
          error: 'CAPTCHA_REQUIRED',
          message: 'CAPTCHA required on high court portal',
          requiresCaptcha: true
        }
      }

      return {
        success: false,
        error: 'PARSING_ERROR',
        message: 'Unable to parse high court portal data'
      }

    } catch (error) {
      return {
        success: false,
        error: 'HIGH_COURT_PORTAL_ERROR',
        message: 'High court portal not accessible'
      }
    }
  }

  /**
   * Map official API response to our case data format
   */
  private mapOfficialResponseToCaseData(apiData: any, cnr: string): ECourtsCaseData {
    return {
      cnr,
      caseNumber: apiData.caseNumber || `CASE-${cnr.slice(-6)}`,
      title: apiData.title || apiData.caseTitle || 'Unknown Case',
      court: apiData.court || apiData.courtName || 'Unknown Court',
      courtLocation: apiData.courtLocation || apiData.location || 'Unknown Location',
      hallNumber: apiData.hallNumber || apiData.hall || 'Not specified',
      caseType: apiData.caseType || 'CIVIL',
      caseStatus: apiData.status || apiData.caseStatus || 'PENDING',
      filingDate: apiData.filingDate || apiData.dateOfFiling || '',
      lastHearingDate: apiData.lastHearingDate,
      nextHearingDate: apiData.nextHearingDate,
      parties: apiData.parties || [],
      advocates: apiData.advocates || [],
      judges: apiData.judges || [],
      hearingHistory: [],
      orders: [],
      caseDetails: {
        subjectMatter: apiData.subjectMatter || '',
        caseDescription: apiData.description || '',
        reliefSought: apiData.reliefSought || '',
        caseValue: apiData.caseValue,
        jurisdiction: apiData.jurisdiction || ''
      }
    }
  }

  /**
   * Map Kleopatra API response to our case data format
   */
  private mapKleopatraResponseToCaseData(apiData: any, cnr: string): ECourtsCaseData {
    const caseData = apiData.data || apiData
    
    // Extract parties information from the nested structure
    const petitioners = caseData.parties?.petitioners || []
    const respondents = caseData.parties?.respondents || []
    const petitionerAdvocates = caseData.parties?.petitionerAdvocates || []
    const respondentAdvocates = caseData.parties?.respondentAdvocates || []
    
    // Format parties array for the expected structure
    const formattedParties = [
      ...petitioners.map((name: string) => ({ type: 'PLAINTIFF', name })),
      ...respondents.map((name: string) => ({ type: 'DEFENDANT', name }))
    ]
    
    // Format advocates array
    const formattedAdvocates = [
      ...petitionerAdvocates.map((name: string) => ({ type: 'PETITIONER', name })),
      ...respondentAdvocates.map((name: string) => ({ type: 'RESPONDENT', name }))
    ]
    
    // Extract hearing history
    const hearingHistory = caseData.history?.hearings || caseData.hearingHistory || []
    const formattedHearingHistory = hearingHistory.map((hearing: any) => ({
      date: hearing.date || hearing.hearingDate || '',
      purpose: hearing.purpose || hearing.subject || hearing.description || 'Hearing',
      judge: hearing.judge || hearing.judgeName || 'Unknown Judge',
      status: hearing.status || hearing.outcome || ''
    }))

    // Extract orders
    const orders = caseData.orders || []
    const formattedOrders = orders.map((order: any, index: number) => ({
      number: order.orderNumber || order.number || index + 1,
      name: order.orderName || order.name || order.description || `Order ${index + 1}`,
      date: order.orderDate || order.date || '',
      url: order.url || order.pdfUrl || order.downloadUrl
    }))

    // Extract acts and sections
    const actsAndSections = caseData.actsAndSections || {}
    const formattedActsAndSections = actsAndSections.acts || actsAndSections.sections ? {
      acts: actsAndSections.acts || actsAndSections.actName || '',
      sections: actsAndSections.sections || actsAndSections.sectionNumbers || ''
    } : undefined

    return {
      cnr,
      caseNumber: caseData.registrationNumber || caseData.regNumber || caseData.caseNumber || caseData.case_number || `REG-${cnr.slice(-6)}`,
      filingNumber: caseData.filingNumber || caseData.filingNo || caseData.details?.filingNumber || caseData.filing_number || undefined,
      title: caseData.title || caseData.case_title || caseData.subject_matter || 'Unknown Case',
      court: caseData.status?.courtNumberAndJudge || caseData.court_name || caseData.court || caseData.jurisdiction || 'Unknown Court',
      courtLocation: caseData.location || caseData.court_location || caseData.district || 'Bengaluru Rural',
      hallNumber: caseData.hall_number || caseData.hall || caseData.court_hall || 'Not specified',
      caseType: caseData.details?.type || caseData.case_type || caseData.type || caseData.category || 'CIVIL',
      caseStatus: caseData.status?.caseStage || caseData.status || caseData.case_status || caseData.current_status || 'PENDING',
      filingDate: caseData.details?.filingDate || caseData.details?.registrationDate || caseData.filing_date || caseData.date_of_filing || caseData.registration_date || '',
      lastHearingDate: caseData.status?.firstHearingDate || caseData.last_hearing_date || caseData.previous_hearing_date,
      nextHearingDate: caseData.status?.nextHearingDate || caseData.next_hearing_date || caseData.upcoming_hearing_date,
      parties: formattedParties,
      advocates: formattedAdvocates,
      judges: caseData.judges || caseData.bench || caseData.magistrate || [],
      hearingHistory: formattedHearingHistory,
      orders: formattedOrders,
      actsAndSections: formattedActsAndSections,
      registrationNumber: caseData.registrationNumber || caseData.regNumber || '',
      registrationDate: caseData.registrationDate || caseData.regDate || '',
      firstHearingDate: caseData.firstHearingDate || caseData.firstHearing?.date || '',
      decisionDate: caseData.decisionDate || caseData.disposalDate || '',
      natureOfDisposal: caseData.natureOfDisposal || caseData.disposalType || '',
      caseDetails: {
        subjectMatter: caseData.title || caseData.subject_matter || caseData.subjectMatter || caseData.nature_of_case || '',
        caseDescription: caseData.description || caseData.case_description || caseData.facts || '',
        reliefSought: caseData.relief_sought || caseData.reliefSought || caseData.prayer || '',
        caseValue: caseData.case_value || caseData.caseValue || caseData.amount_involved,
        jurisdiction: caseData.jurisdiction || caseData.territorial_jurisdiction || ''
      }
    }
  }

  /**
   * Map third-party API response to our case data format
   */
  private mapThirdPartyResponseToCaseData(apiData: any, cnr: string): ECourtsCaseData {
    return {
      cnr,
      caseNumber: apiData.registrationNumber || apiData.caseNumber || apiData.case_number || `REG-${cnr.slice(-6)}`,
      filingNumber: apiData.filingNumber || apiData.filingNo || apiData.filing_number || undefined,
      title: apiData.title || apiData.case_title || 'Unknown Case',
      court: apiData.court || apiData.court_name || 'Unknown Court',
      courtLocation: apiData.location || apiData.court_location || 'Unknown Location',
      caseType: apiData.type || apiData.case_type || 'CIVIL',
      caseStatus: apiData.status || apiData.case_status || 'PENDING',
      filingDate: apiData.filing_date || apiData.date_of_filing || '',
      lastHearingDate: apiData.last_hearing_date,
      nextHearingDate: apiData.next_hearing_date,
      parties: apiData.parties || [],
      advocates: apiData.advocates || [],
      judges: apiData.judges || [],
      hearingHistory: [],
      orders: [],
      caseDetails: {
        subjectMatter: apiData.subject_matter || apiData.subjectMatter || '',
        caseDescription: apiData.description || apiData.case_description || '',
        reliefSought: apiData.relief_sought || apiData.reliefSought || '',
        caseValue: apiData.case_value || apiData.caseValue,
        jurisdiction: apiData.jurisdiction || ''
      }
    }
  }

  /**
   * Search for cases with filters
   */
  async searchCases(filters: SearchFilters): Promise<SearchResult> {
    try {
      console.log('🔍 Starting comprehensive case search with filters:', filters)
      
      switch (this.config.provider) {
        case 'official':
          return await this.searchFromOfficialAPI(filters)
        case 'manual':
          return await this.searchFromManualPortal(filters)
        case 'third_party':
          return await this.searchFromThirdPartyAPI(filters)
        default:
          return {
            success: false,
            error: 'INVALID_PROVIDER',
            message: 'Invalid provider specified'
          }
      }
    } catch (error) {
      console.error('Error searching cases:', error)
      return {
        success: false,
        error: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Search by CNR (existing method, kept for backward compatibility)
   */
  async searchByCNR(cnr: string): Promise<ECourtsResponse<ECourtsCaseData>> {
    return this.getCaseByCNR(cnr)
  }

  /**
   * Search by case number
   */
  async searchByCaseNumber(caseNumber: string, courtType: string = 'district'): Promise<SearchResult> {
    return this.searchCases({
      caseNumber,
      courtType: courtType as any,
      limit: 10
    })
  }

  /**
   * Search by party name
   */
  async searchByPartyName(partyName: string, courtType?: string): Promise<SearchResult> {
    return this.searchCases({
      partyName,
      courtType: courtType as any,
      limit: 20
    })
  }

  /**
   * Search by advocate name
   */
  async searchByAdvocate(advocateName: string, courtType?: string): Promise<SearchResult> {
    return this.searchCases({
      advocateName,
      courtType: courtType as any,
      limit: 20
    })
  }

  /**
   * Search by court and date range
   */
  async searchByCourtAndDate(court: string, dateFrom: string, dateTo: string, courtType?: string): Promise<SearchResult> {
    return this.searchCases({
      court,
      filingDateFrom: dateFrom,
      filingDateTo: dateTo,
      courtType: courtType as any,
      limit: 50
    })
  }

  /**
   * Get cause list for a specific court and date
   */
  async getCauseList(court: string, date: Date): Promise<ECourtsResponse<any[]>> {
    try {
      // Mock cause list data
      return {
        success: true,
        data: [
          {
            caseNumber: 'CASE-2024-001',
            title: 'Contract Dispute Resolution',
            parties: ['ABC Corp', 'XYZ Ltd'],
            advocates: ['Adv. John Doe'],
            judges: ['Hon. Justice Smith'],
            hearingTime: '10:30 AM',
            caseType: 'CIVIL'
          }
        ]
      }
    } catch (error) {
      console.error('Error fetching cause list:', error)
      return {
        success: false,
        error: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Get orders for a specific case
   */
  async getOrders(cnr: string): Promise<ECourtsResponse<any[]>> {
    try {
      // Mock orders data
      return {
        success: true,
        data: [
          {
            orderId: 'ORD-001',
            orderDate: '2024-01-15',
            orderType: 'Interim Order',
            orderText: 'Interim relief granted to the petitioner...',
            judge: 'Hon. Justice Smith',
            caseNumber: `CASE-${cnr.slice(-6)}`
          }
        ]
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      return {
        success: false,
        error: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Download order PDF
   */
  async downloadOrderPdf(orderId: string): Promise<ECourtsResponse<Buffer>> {
    try {
      // Mock PDF download
      return {
        success: true,
        data: Buffer.from('Mock PDF content')
      }
    } catch (error) {
      console.error('Error downloading order PDF:', error)
      return {
        success: false,
        error: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Test connection to eCourts
   */
  async testConnection(): Promise<ECourtsResponse<boolean>> {
    try {
      // Test based on provider type
      switch (this.config.provider) {
        case 'official':
          return await this.testOfficialConnection()
        case 'manual':
          return await this.testManualConnection()
        case 'third_party':
          return await this.testThirdPartyConnection()
        default:
          return {
            success: false,
            error: 'INVALID_PROVIDER',
            message: 'Invalid provider specified'
          }
      }
    } catch (error) {
      console.error('Error testing connection:', error)
      return {
        success: false,
        error: 'CONNECTION_ERROR',
        message: error instanceof Error ? error.message : 'Connection failed'
      }
    }
  }

  private async testOfficialConnection(): Promise<ECourtsResponse<boolean>> {
    try {
      // Test NAPIX connection
      await axios.get(this.OFFICIAL_ENDPOINTS.NAPIX, { timeout: 5000 })
      return {
        success: true,
        data: true,
        message: 'Official APIs accessible'
      }
    } catch (error) {
      return {
        success: false,
        error: 'OFFICIAL_API_ERROR',
        message: 'Official APIs not accessible'
      }
    }
  }

  private async testManualConnection(): Promise<ECourtsResponse<boolean>> {
    try {
      // Test district portal connection
      await axios.get(this.OFFICIAL_ENDPOINTS.DISTRICT_PORTAL, { timeout: 5000 })
      return {
        success: true,
        data: true,
        message: 'Manual portals accessible'
      }
    } catch (error) {
      return {
        success: false,
        error: 'MANUAL_PORTAL_ERROR',
        message: 'Manual portals not accessible'
      }
    }
  }

  private async testThirdPartyConnection(): Promise<ECourtsResponse<boolean>> {
    try {
      // Test Kleopatra connection
      const testResponse = await axios.get(`${this.THIRD_PARTY_ENDPOINTS.KLEOPATRA}/health`, { 
        timeout: 5000,
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (testResponse.status === 200) {
        return {
          success: true,
          data: true,
          message: 'Kleopatra API accessible - Enterprise-grade Indian Courts API'
        }
      }
      
      return {
        success: false,
        error: 'THIRD_PARTY_API_ERROR',
        message: 'Kleopatra API not accessible'
      }
    } catch (error) {
      return {
        success: false,
        error: 'THIRD_PARTY_API_ERROR',
        message: `Kleopatra API not accessible: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Test API connectivity and discover working endpoints
   */
  async testApiConnectivity(): Promise<{ success: boolean; workingEndpoints: string[]; error?: string }> {
    const workingEndpoints: string[] = []
    
    if (!this.config.apiKey) {
      return { success: false, workingEndpoints, error: 'No API key provided' }
    }

    try {
      console.log('🔍 Testing Kleopatra API connectivity...')
      
      // Test basic connectivity with correct endpoints
        const courtTypes = ['district', 'high', 'supreme', 'nclt', 'consumer']
        const endpointMap: Record<string, string> = {
          'district': 'district-court',
          'high': 'high-court', 
          'supreme': 'supreme-court',
          'nclt': 'nclt',
          'consumer': 'consumer-forum'
        }
        const testEndpoints = courtTypes.map(courtType => 
          `${this.THIRD_PARTY_ENDPOINTS.KLEOPATRA}/api/core/live/${endpointMap[courtType]}/case`
        )

      for (const endpoint of testEndpoints) {
        try {
          const response = await axios.post(endpoint, {
            cnr: 'test'
          }, {
            headers: {
              'Authorization': `Bearer ${this.config.apiKey}`,
              'Content-Type': 'application/json'
            },
            timeout: 5000
          })
          
          if (response.status === 200 || response.status === 404) {
            // 404 means endpoint exists but resource not found (which is expected for test)
            workingEndpoints.push(endpoint)
            console.log('✅ Working endpoint:', endpoint, response.status)
          }
        } catch (error) {
          console.log('⚠️ Endpoint not working:', endpoint, error instanceof Error ? error.message : 'Unknown error')
        }
      }

      return {
        success: workingEndpoints.length > 0,
        workingEndpoints,
        error: workingEndpoints.length === 0 ? 'No working endpoints found' : undefined
      }
    } catch (error) {
      return {
        success: false,
        workingEndpoints,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Mock case data for testing
   */
  private getMockCaseData(cnr: string): ECourtsResponse<ECourtsCaseData> {
    const upperCnr = cnr.toUpperCase()
    const isHighCourt = upperCnr.includes('HC') || upperCnr.startsWith('DLHC') || upperCnr.startsWith('KAHC')
    
    const courtInfo = isHighCourt ? {
      court: 'Karnataka High Court',
      courtLocation: 'Bengaluru, Karnataka',
      hallNumber: 'Court Hall No. 1',
      caseType: 'WRIT_PETITION',
      title: 'Constitutional Matter - Writ Petition'
    } : {
      court: 'District and Sessions Court Bengaluru',
      courtLocation: 'Bengaluru, Karnataka', 
      hallNumber: 'Hall No. 1',
      caseType: 'CIVIL',
      title: 'Contract Dispute Resolution'
    }
    
    return {
      success: true,
      data: {
        cnr,
        caseNumber: `REG-${cnr.slice(-6)}`,
        filingNumber: `FIL-${cnr.slice(-6)}`,
        title: courtInfo.title,
        court: courtInfo.court,
        courtLocation: courtInfo.courtLocation,
        hallNumber: courtInfo.hallNumber,
        caseType: courtInfo.caseType,
        caseStatus: 'PENDING',
        filingDate: '2023-06-15',
        lastHearingDate: '2024-01-10',
        nextHearingDate: '2024-03-15',
        parties: [
          {
            name: 'ABC Corporation',
            type: 'PLAINTIFF',
            address: 'Bengaluru, Karnataka, India',
            phone: '+91-9876543210',
            email: 'abc@corp.com'
          },
          {
            name: 'XYZ Limited',
            type: 'DEFENDANT',
            address: 'Mumbai, Maharashtra, India',
            phone: '+91-9876543211',
            email: 'xyz@ltd.com'
          }
        ],
        advocates: [
          {
            name: 'Adv. John Doe',
            barNumber: 'KA123456',
            phone: '+91-9876543212',
            email: 'john@law.com',
            address: 'Bengaluru Legal Office'
          }
        ],
        judges: [
          {
            name: 'Hon. Justice Smith',
            designation: 'District Judge',
            court: 'District and Sessions Court Bengaluru'
          }
        ],
        hearingHistory: [],
        orders: [],
        caseDetails: {
          subjectMatter: 'Contract Dispute',
          caseDescription: 'Dispute regarding contract terms and conditions',
          reliefSought: 'Specific performance and damages',
          caseValue: 1000000,
          jurisdiction: 'Bengaluru'
        }
      }
    }
  }

  /**
   * Search from official eCourts API
   */
  private async searchFromOfficialAPI(filters: SearchFilters): Promise<SearchResult> {
    // Implementation for official eCourts API
    console.log('🔍 Searching from official eCourts API (not implemented)')
    return {
      success: false,
      error: 'NOT_IMPLEMENTED',
      message: 'Official eCourts API integration not yet implemented'
    }
  }

  /**
   * Search from manual portal (web scraping)
   */
  private async searchFromManualPortal(filters: SearchFilters): Promise<SearchResult> {
    // Implementation for manual portal scraping
    console.log('🔍 Searching from manual portal (not implemented)')
    return {
      success: false,
      error: 'NOT_IMPLEMENTED',
      message: 'Manual portal scraping not yet implemented'
    }
  }

  /**
   * Search from third-party APIs (Kleopatra, etc.)
   */
  private async searchFromThirdPartyAPI(filters: SearchFilters): Promise<SearchResult> {
    try {
      if (!this.config.apiKey) {
        return {
          success: false,
          error: 'NO_API_KEY',
          message: 'API key required for third-party search'
        }
      }

      console.log('🔍 Searching from third-party API with filters:', filters)

      // Determine court type from filters or use default
      const courtType = filters.courtType || 'district'
      
      // Map court types to endpoints
      const endpointMap: Record<string, string> = {
        'district': 'district-court',
        'high': 'high-court',
        'supreme': 'supreme-court',
        'nclt': 'nclt',
        'cat': 'cat',
        'consumer': 'consumer-forum'
      }

      const searchEndpoint = `${this.THIRD_PARTY_ENDPOINTS.KLEOPATRA}/api/core/live/${endpointMap[courtType]}/search`

      // Build search payload based on available filters
      const searchPayload: any = {}

      if (filters.caseNumber) searchPayload.case_number = filters.caseNumber
      if (filters.partyName) searchPayload.party_name = filters.partyName
      if (filters.advocateName) searchPayload.advocate_name = filters.advocateName
      if (filters.court) searchPayload.court = filters.court
      if (filters.caseType) searchPayload.case_type = filters.caseType
      if (filters.caseStatus) searchPayload.case_status = filters.caseStatus
      if (filters.filingDateFrom) searchPayload.filing_date_from = filters.filingDateFrom
      if (filters.filingDateTo) searchPayload.filing_date_to = filters.filingDateTo
      if (filters.hearingDateFrom) searchPayload.hearing_date_from = filters.hearingDateFrom
      if (filters.hearingDateTo) searchPayload.hearing_date_to = filters.hearingDateTo
      if (filters.limit) searchPayload.limit = filters.limit
      if (filters.offset) searchPayload.offset = filters.offset

      console.log('📤 Sending search request to:', searchEndpoint)
      console.log('📤 Search payload:', searchPayload)

      const response = await axios.post(searchEndpoint, searchPayload, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: this.config.timeout
      })

      console.log('✅ Search API response:', response.status)
      console.log('📊 Search response data:', response.data)

      if (response.data && Array.isArray(response.data)) {
        const cases = response.data.map((caseData: any) => 
          this.mapKleopatraResponseToCaseData(caseData, caseData.cnr || 'UNKNOWN')
        )

        return {
          success: true,
          data: cases,
          total: cases.length,
          page: 1,
          limit: filters.limit || 20
        }
      } else if (response.data && response.data.cases && Array.isArray(response.data.cases)) {
        const cases = response.data.cases.map((caseData: any) => 
          this.mapKleopatraResponseToCaseData(caseData, caseData.cnr || 'UNKNOWN')
        )

        return {
          success: true,
          data: cases,
          total: response.data.total || cases.length,
          page: response.data.page || 1,
          limit: response.data.limit || filters.limit || 20
        }
      } else {
        console.log('⚠️ No cases found in search results')
        return {
          success: true,
          data: [],
          total: 0,
          page: 1,
          limit: filters.limit || 20
        }
      }

    } catch (error) {
      console.log('❌ Third-party search API failed:', error instanceof Error ? error.message : 'Unknown error')
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any
        console.log('❌ Axios error response:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          headers: axiosError.response?.headers
        })
      }

          // Return error instead of mock data
          console.log('❌ All search endpoints failed')
          return {
            success: false,
            error: 'API_UNAVAILABLE',
            message: 'All court API endpoints are currently unavailable. Please try again later.'
          }
    }
  }

  /**
   * Mock search results for testing
   */
  private getMockSearchResults(filters: SearchFilters): SearchResult {
    const mockCases: ECourtsCaseData[] = [
      {
        cnr: '1234567890123456',
        caseNumber: 'CASE-2024-001',
        title: 'Contract Dispute Resolution',
        court: 'High Court of Delhi',
        courtLocation: 'New Delhi',
        caseType: 'CIVIL',
        caseStatus: 'PENDING',
        filingDate: '2023-06-15',
        nextHearingDate: '2024-03-15',
        parties: [
          {
            name: 'ABC Corporation',
            type: 'PLAINTIFF'
          },
          {
            name: 'XYZ Limited',
            type: 'DEFENDANT'
          }
        ],
        advocates: [
          {
            name: 'Adv. John Doe'
          }
        ],
        judges: [
          {
            name: 'Hon. Justice Smith',
            designation: 'Judge',
            court: 'High Court of Delhi'
          }
        ],
        hearingHistory: [],
        orders: [],
        caseDetails: {
          subjectMatter: 'Contract Dispute',
          caseDescription: 'Dispute regarding contract terms',
          reliefSought: 'Specific performance',
          jurisdiction: 'Delhi'
        }
      }
    ]

    // Filter results based on search criteria
    let filteredCases = mockCases

    if (filters.partyName) {
      filteredCases = filteredCases.filter(caseData =>
        caseData.parties.some(party =>
          party.name.toLowerCase().includes(filters.partyName!.toLowerCase())
        )
      )
    }

    if (filters.caseNumber) {
      filteredCases = filteredCases.filter(caseData =>
        caseData.caseNumber.toLowerCase().includes(filters.caseNumber!.toLowerCase())
      )
    }

    if (filters.court) {
      filteredCases = filteredCases.filter(caseData =>
        caseData.court.toLowerCase().includes(filters.court!.toLowerCase())
      )
    }

    return {
      success: true,
      data: filteredCases,
      total: filteredCases.length,
      page: 1,
      limit: filters.limit || 20
    }
  }
}