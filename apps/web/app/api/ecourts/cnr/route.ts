import { NextRequest, NextResponse } from 'next/server'
import { ECourtsProvider } from '@/lib/ecourts-provider'

export async function POST(request: NextRequest) {
  try {
    const { cnr } = await request.json()
    
    if (!cnr) {
      return NextResponse.json(
        { success: false, error: 'MISSING_CNR', message: 'CNR number is required' },
        { status: 400 }
      )
    }

    // Create eCourts provider with configuration
    const config = {
      provider: 'third_party' as const,
      apiKey: 'klc_2cef7fc42178c58211cd8b8b1d23c3206c1e778f13ed566237803d8897a9b104',
      timeout: 30000
    }

    const ecourtsProvider = new ECourtsProvider(config)
    
    console.log(`🔍 Server-side CNR lookup for: ${cnr}`)
    const result = await ecourtsProvider.getCaseByCNR(cnr)
    
    console.log(`📊 Server-side result: ${result.success ? 'SUCCESS' : 'FAILED'}`)
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('❌ Server-side CNR lookup error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'SERVER_ERROR', 
        message: error instanceof Error ? error.message : 'Unknown server error' 
      },
      { status: 500 }
    )
  }
}
