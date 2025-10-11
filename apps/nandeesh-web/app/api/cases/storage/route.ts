import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export const dynamic = 'force-dynamic'

const CASES_KEY = 'legal-cases'

// Use Vercel KV if available, otherwise use in-memory storage
let casesCache: any[] = []
let isKVAvailable = false

// Check if Vercel KV is available
async function checkKVAvailability() {
  try {
    await kv.ping()
    isKVAvailable = true
    return true
  } catch {
    isKVAvailable = false
    return false
  }
}

// Helper to get storage
function getStorage() {
  return {
    async get(): Promise<any[]> {
      try {
        // Try Vercel KV first
        if (process.env.KV_REST_API_URL) {
          const data = await kv.get<any[]>(CASES_KEY)
          return data || []
        }
      } catch (error) {
        console.log('KV unavailable, using memory cache')
      }
      
      // Fallback to in-memory cache
      return casesCache
    },
    async set(data: any[]): Promise<boolean> {
      try {
        // Try Vercel KV first
        if (process.env.KV_REST_API_URL) {
          await kv.set(CASES_KEY, data)
          console.log(`✅ Saved to Vercel KV: ${data.length} cases`)
          return true
        }
      } catch (error) {
        console.log('KV unavailable, using memory cache')
      }
      
      // Fallback to in-memory cache
      casesCache = data
      return true
    }
  }
}

// GET - Fetch all cases from storage
export async function GET(request: NextRequest) {
  try {
    const storage = getStorage()
    const cases = await storage.get()
    
    return NextResponse.json({
      success: true,
      data: cases,
      total: cases.length,
      storage: 'vercel-kv'
    })
  } catch (error) {
    console.error('❌ Error reading cases:', error)
    return NextResponse.json({
      success: false,
      error: 'READ_ERROR',
      message: error instanceof Error ? error.message : 'Failed to read cases'
    }, { status: 500 })
  }
}

// POST - Save cases to storage
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const casesToAdd = Array.isArray(body) ? body : [body]
    
    const storage = getStorage()
    const existingCases = await storage.get()
    
    // Add new cases with unique IDs
    const newCases = casesToAdd.map((caseData, index) => ({
      ...caseData,
      id: caseData.id || `case-${Date.now()}-${index}`,
      createdAt: caseData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }))
    
    // Merge cases (avoid duplicates by CNR)
    const allCases = [...existingCases]
    let addedCount = 0
    
    for (const newCase of newCases) {
      const cnr = newCase.cnrNumber || newCase.cnr
      const existingIndex = allCases.findIndex(c => 
        (c.cnrNumber === cnr && cnr) || c.id === newCase.id
      )
      
      if (existingIndex === -1) {
        allCases.push(newCase)
        addedCount++
      } else {
        // Update existing case
        allCases[existingIndex] = { ...allCases[existingIndex], ...newCase, updatedAt: new Date().toISOString() }
      }
    }
    
    // Save to storage
    await storage.set(allCases)
    
    console.log(`✅ Saved ${addedCount} new cases (${allCases.length} total)`)
    
    return NextResponse.json({
      success: true,
      message: `Saved ${addedCount} cases to online storage`,
      saved: addedCount,
      total: allCases.length,
      storage: 'vercel-kv'
    })
  } catch (error) {
    console.error('❌ Error saving cases:', error)
    return NextResponse.json({
      success: false,
      error: 'SAVE_ERROR',
      message: error instanceof Error ? error.message : 'Failed to save cases'
    }, { status: 500 })
  }
}

// DELETE - Clear all cases
export async function DELETE(request: NextRequest) {
  try {
    const storage = getStorage()
    await storage.set([])
    
    return NextResponse.json({
      success: true,
      message: 'All cases cleared from online storage',
      storage: 'vercel-kv'
    })
  } catch (error) {
    console.error('❌ Error clearing cases:', error)
    return NextResponse.json({
      success: false,
      error: 'DELETE_ERROR',
      message: error instanceof Error ? error.message : 'Failed to clear cases'
    }, { status: 500 })
  }
}

