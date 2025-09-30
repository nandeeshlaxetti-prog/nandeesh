import { NextRequest, NextResponse } from 'next/server'
import { 
  getCaseByCnr, 
  searchAdvanced, 
  Phoenix, 
  normalizeToTable,
  AdvancedSearchParams,
  SearchMode 
} from '@/lib/court-api'
import { z } from 'zod'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

// Validation schemas
const CnrSearchSchema = z.object({
  cnr: z.string().regex(/^\d{16}$/, 'CNR must be 16 digits')
})

const AdvancedSearchSchema = z.object({
  mode: z.enum(['caseNumber', 'partyName', 'advocateName', 'fir', 'filingNumber']),
  stateCode: z.string().optional(),
  districtCode: z.string().optional(),
  courtComplexId: z.string().optional(),
  courtId: z.string().optional(),
  benchLevel: z.enum(['DISTRICT', 'HIGH_COURT', 'TRIBUNAL', 'SUPREME']).optional(),
  
  // Mode-specific fields
  caseType: z.string().optional(),
  caseNumber: z.string().optional(),
  year: z.number().optional(),
  partyName: z.string().optional(),
  advocateName: z.string().optional(),
  firNumber: z.string().optional(),
  policeStation: z.string().optional(),
  filingNumber: z.string().optional(),
})

const PhoenixMetadataSchema = z.object({
  type: z.enum(['states', 'districts', 'complexes', 'courts']),
  stateCode: z.string().optional(),
  districtCode: z.string().optional(),
  courtComplexId: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const action = searchParams.get('action')

    console.log(`🔍 Court API GET request - Action: ${action}`)

    switch (action) {
      case 'collector':
        const collectorAction = searchParams.get('collectorAction')
        console.log(`🔍 Collector API - Action: ${collectorAction}`)
        
        switch (collectorAction) {
          case 'auth':
            const authResult = await Collector.authenticate()
            return NextResponse.json({
              success: true,
              data: authResult,
              message: 'Collector authentication completed successfully'
            })
            
          case 'instances':
            const instanceResult = await Collector.getInstanceStatus()
            return NextResponse.json({
              success: true,
              data: instanceResult,
              message: 'Instance status retrieved successfully'
            })
            
          case 'cnr':
            const cnrParams = CnrSearchSchema.parse({
              cnr: searchParams.get('cnr')
            })
            const collectorCnrResult = await Collector.getCaseByCnr(cnrParams.cnr)
            return NextResponse.json({
              success: true,
              data: collectorCnrResult,
              message: 'Collector CNR search completed successfully'
            })
            
          case 'search':
            const collectorSearchParams = AdvancedSearchSchema.parse({
              mode: searchParams.get('mode') as SearchMode,
              stateCode: searchParams.get('stateCode') || undefined,
              districtCode: searchParams.get('districtCode') || undefined,
              courtComplexId: searchParams.get('courtComplexId') || undefined,
              courtId: searchParams.get('courtId') || undefined,
              benchLevel: searchParams.get('benchLevel') as any || undefined,
              
              caseType: searchParams.get('caseType') || undefined,
              caseNumber: searchParams.get('caseNumber') || undefined,
              year: searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined,
              partyName: searchParams.get('partyName') || undefined,
              advocateName: searchParams.get('advocateName') || undefined,
              firNumber: searchParams.get('firNumber') || undefined,
              policeStation: searchParams.get('policeStation') || undefined,
              filingNumber: searchParams.get('filingNumber') || undefined,
            })
            
            const collectorSearchResult = await Collector.searchAdvanced(collectorSearchParams)
            const collectorNormalizedResults = normalizeToTable(collectorSearchResult)
            
            return NextResponse.json({
              success: true,
              data: collectorNormalizedResults,
              total: collectorNormalizedResults.length,
              message: 'Collector advanced search completed successfully'
            })
            
          default:
            return NextResponse.json({
              success: false,
              error: 'Invalid collector action. Use: auth, instances, cnr, or search'
            }, { status: 400 })
        }
        
      case 'cnr':
        const cnrParams = CnrSearchSchema.parse({
          cnr: searchParams.get('cnr')
        })
        
        console.log(`🔍 CNR search for: ${cnrParams.cnr}`)
        const cnrResult = await getCaseByCnr(cnrParams.cnr)
        
        return NextResponse.json({
          success: true,
          data: cnrResult,
          message: 'CNR search completed successfully'
        })

      case 'search':
        const searchParams_parsed = AdvancedSearchSchema.parse({
          mode: searchParams.get('mode') as SearchMode,
          stateCode: searchParams.get('stateCode') || undefined,
          districtCode: searchParams.get('districtCode') || undefined,
          courtComplexId: searchParams.get('courtComplexId') || undefined,
          courtId: searchParams.get('courtId') || undefined,
          benchLevel: searchParams.get('benchLevel') as any || undefined,
          
          caseType: searchParams.get('caseType') || undefined,
          caseNumber: searchParams.get('caseNumber') || undefined,
          year: searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined,
          partyName: searchParams.get('partyName') || undefined,
          advocateName: searchParams.get('advocateName') || undefined,
          firNumber: searchParams.get('firNumber') || undefined,
          policeStation: searchParams.get('policeStation') || undefined,
          filingNumber: searchParams.get('filingNumber') || undefined,
        })
        
        console.log(`🔍 Advanced search - Mode: ${searchParams_parsed.mode}`)
        const searchResult = await searchAdvanced(searchParams_parsed)
        const normalizedResults = normalizeToTable(searchResult)
        
        return NextResponse.json({
          success: true,
          data: normalizedResults,
          total: normalizedResults.length,
          message: 'Advanced search completed successfully'
        })

      case 'phoenix':
        const phoenixParams = PhoenixMetadataSchema.parse({
          type: searchParams.get('type'),
          stateCode: searchParams.get('stateCode') || undefined,
          districtCode: searchParams.get('districtCode') || undefined,
          courtComplexId: searchParams.get('courtComplexId') || undefined,
        })
        
        console.log(`🔍 Phoenix metadata - Type: ${phoenixParams.type}`)
        let phoenixResult: any
        
        switch (phoenixParams.type) {
          case 'states':
            phoenixResult = await Phoenix.states()
            break
          case 'districts':
            if (!phoenixParams.stateCode) {
              return NextResponse.json({
                success: false,
                error: 'stateCode is required for districts lookup'
              }, { status: 400 })
            }
            phoenixResult = await Phoenix.districts(phoenixParams.stateCode)
            break
          case 'complexes':
            if (!phoenixParams.districtCode) {
              return NextResponse.json({
                success: false,
                error: 'districtCode is required for complexes lookup'
              }, { status: 400 })
            }
            phoenixResult = await Phoenix.complexes(phoenixParams.districtCode)
            break
          case 'courts':
            if (!phoenixParams.courtComplexId) {
              return NextResponse.json({
                success: false,
                error: 'courtComplexId is required for courts lookup'
              }, { status: 400 })
            }
            phoenixResult = await Phoenix.courts(phoenixParams.courtComplexId)
            break
        }
        
        return NextResponse.json({
          success: true,
          data: phoenixResult,
          message: `Phoenix ${phoenixParams.type} lookup completed successfully`
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: cnr, search, or phoenix'
        }, { status: 400 })
    }

  } catch (error) {
    console.error('❌ Court API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Invalid request parameters',
        details: error.errors
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: error instanceof Error ? error.message : 'Court API request failed'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const action = body.action

    console.log(`🔍 Court API POST request - Action: ${action}`)

    switch (action) {
      case 'collector':
        const collectorAction = body.collectorAction
        console.log(`🔍 Collector API - Action: ${collectorAction}`)
        
        switch (collectorAction) {
          case 'auth':
            const authResult = await Collector.authenticate()
            return NextResponse.json({
              success: true,
              data: authResult,
              message: 'Collector authentication completed successfully'
            })
            
          case 'instances':
            const instanceResult = await Collector.getInstanceStatus()
            return NextResponse.json({
              success: true,
              data: instanceResult,
              message: 'Instance status retrieved successfully'
            })
            
          case 'cnr':
            const cnrParams = CnrSearchSchema.parse(body)
            const collectorCnrResult = await Collector.getCaseByCnr(cnrParams.cnr)
            return NextResponse.json({
              success: true,
              data: collectorCnrResult,
              message: 'Collector CNR search completed successfully'
            })
            
          case 'search':
            const collectorSearchParams = AdvancedSearchSchema.parse(body)
            const collectorSearchResult = await Collector.searchAdvanced(collectorSearchParams)
            const collectorNormalizedResults = normalizeToTable(collectorSearchResult)
            
            return NextResponse.json({
              success: true,
              data: collectorNormalizedResults,
              total: collectorNormalizedResults.length,
              message: 'Collector advanced search completed successfully'
            })
            
          default:
            return NextResponse.json({
              success: false,
              error: 'Invalid collector action. Use: auth, instances, cnr, or search'
            }, { status: 400 })
        }
        
      case 'cnr':
        const cnrParams = CnrSearchSchema.parse(body)
        
        console.log(`🔍 CNR search for: ${cnrParams.cnr}`)
        const cnrResult = await getCaseByCnr(cnrParams.cnr)
        
        return NextResponse.json({
          success: true,
          data: cnrResult,
          message: 'CNR search completed successfully'
        })

      case 'search':
        const searchParams_parsed = AdvancedSearchSchema.parse(body)
        
        console.log(`🔍 Advanced search - Mode: ${searchParams_parsed.mode}`)
        const searchResult = await searchAdvanced(searchParams_parsed)
        const normalizedResults = normalizeToTable(searchResult)
        
        return NextResponse.json({
          success: true,
          data: normalizedResults,
          total: normalizedResults.length,
          message: 'Advanced search completed successfully'
        })

      case 'phoenix':
        const phoenixParams = PhoenixMetadataSchema.parse(body)
        
        console.log(`🔍 Phoenix metadata - Type: ${phoenixParams.type}`)
        let phoenixResult: any
        
        switch (phoenixParams.type) {
          case 'states':
            phoenixResult = await Phoenix.states()
            break
          case 'districts':
            if (!phoenixParams.stateCode) {
              return NextResponse.json({
                success: false,
                error: 'stateCode is required for districts lookup'
              }, { status: 400 })
            }
            phoenixResult = await Phoenix.districts(phoenixParams.stateCode)
            break
          case 'complexes':
            if (!phoenixParams.districtCode) {
              return NextResponse.json({
                success: false,
                error: 'districtCode is required for complexes lookup'
              }, { status: 400 })
            }
            phoenixResult = await Phoenix.complexes(phoenixParams.districtCode)
            break
          case 'courts':
            if (!phoenixParams.courtComplexId) {
              return NextResponse.json({
                success: false,
                error: 'courtComplexId is required for courts lookup'
              }, { status: 400 })
            }
            phoenixResult = await Phoenix.courts(phoenixParams.courtComplexId)
            break
        }
        
        return NextResponse.json({
          success: true,
          data: phoenixResult,
          message: `Phoenix ${phoenixParams.type} lookup completed successfully`
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: cnr, search, or phoenix'
        }, { status: 400 })
    }

  } catch (error) {
    console.error('❌ Court API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Invalid request parameters',
        details: error.errors
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: error instanceof Error ? error.message : 'Court API request failed'
    }, { status: 500 })
  }
}
