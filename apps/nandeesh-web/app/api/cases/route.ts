import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// GET - Fetch all cases
export async function GET(request: NextRequest) {
  try {
    const cases = await prisma.case.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        parties: true,
        hearings: true,
        orders: true,
        tasks: true,
        documents: true
      }
    })

    // Parse notes field to extract CNR and other metadata
    const enrichedCases = cases.map(caseItem => {
      let metadata = {}
      try {
        if (caseItem.notes) {
          metadata = JSON.parse(caseItem.notes)
        }
      } catch (e) {
        // If notes is not JSON, keep it as is
        metadata = { notes: caseItem.notes }
      }
      
      return {
        ...caseItem,
        cnrNumber: metadata.cnrNumber || '',
        filingNumber: metadata.filingNumber || '',
        registrationNumber: metadata.registrationNumber || '',
        hallNumber: metadata.hallNumber || '',
        petitionerName: metadata.petitionerName || '',
        respondentName: metadata.respondentName || '',
        advocates: metadata.advocates || [],
        judges: metadata.judges || [],
        hearingHistory: metadata.hearingHistory || [],
        actsAndSections: metadata.actsAndSections || {},
        // Keep original notes if it wasn't metadata
        notes: typeof metadata.notes === 'string' ? metadata.notes : undefined
      }
    })

    return NextResponse.json({
      success: true,
      data: enrichedCases,
      total: enrichedCases.length
    })
  } catch (error) {
    console.error('❌ Error fetching cases:', error)
    return NextResponse.json({
      success: false,
      error: 'FETCH_ERROR',
      message: error instanceof Error ? error.message : 'Failed to fetch cases'
    }, { status: 500 })
  }
}

// POST - Create new case(s)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle both single case and bulk case creation
    const casesData = Array.isArray(body) ? body : [body]
    
    console.log(`💾 Saving ${casesData.length} cases to database...`)
    
    const savedCases = []
    const errors = []
    
    for (const caseData of casesData) {
      try {
        // Validate required fields - need at least a title and CNR
        if (!caseData.title && !caseData.cnrNumber) {
          errors.push({
            title: caseData.title || 'Unknown',
            error: 'Title or CNR number is required'
          })
          continue
        }
        
        // Generate a unique case number if not provided (don't use CNR as case number)
        const generatedCaseNumber = caseData.caseNumber || `CASE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        
        // Get or create a system user for imported cases
        let systemUser = await prisma.user.findFirst({
          where: { email: 'system@ecourts.local' }
        })
        
        if (!systemUser) {
          console.log('Creating system user for imported cases...')
          systemUser = await prisma.user.create({
            data: {
              email: 'system@ecourts.local',
              firstName: 'ECourts',
              lastName: 'System',
              role: 'ADMIN',
              status: 'ACTIVE',
              isActive: true
            }
          })
        }
        
        const newCase = await prisma.case.create({
          data: {
            caseNumber: generatedCaseNumber,
            title: caseData.title || 'Untitled Case',
            description: caseData.caseDescription || caseData.subjectMatter || caseData.title || '',
            status: caseData.caseStatus || 'OPEN',
            priority: caseData.priority || 'MEDIUM',
            type: caseData.caseType || 'CIVIL',
            clientId: systemUser.id,
            courtName: caseData.court || 'Unknown Court',
            courtLocation: caseData.courtLocation || '',
            caseValue: caseData.caseValue ? parseFloat(caseData.caseValue) : undefined,
            currency: 'INR',
            filingDate: caseData.filingDate ? new Date(caseData.filingDate) : undefined,
            tags: JSON.stringify(caseData.tags || []),
            isConfidential: false,
            // Store CNR number and other metadata in notes field
            notes: JSON.stringify({
              cnrNumber: caseData.cnrNumber,
              filingNumber: caseData.filingNumber,
              registrationNumber: caseData.registrationNumber,
              hallNumber: caseData.hallNumber,
              petitionerName: caseData.petitionerName,
              respondentName: caseData.respondentName,
              parties: caseData.parties,
              advocates: caseData.advocates,
              judges: caseData.judges,
              hearingHistory: caseData.hearingHistory,
              orders: caseData.orders,
              actsAndSections: caseData.actsAndSections
            })
          }
        })
        
        savedCases.push(newCase)
        console.log(`✅ Saved case to database: ${newCase.title}`)
      } catch (error) {
        console.error('❌ Failed to save case:', error)
        errors.push({
          title: caseData.title,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
    
    return NextResponse.json({
      success: savedCases.length > 0,
      data: savedCases,
      saved: savedCases.length,
      failed: errors.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully saved ${savedCases.length} of ${casesData.length} cases to database`
    })
  } catch (error) {
    console.error('❌ Error creating cases:', error)
    return NextResponse.json({
      success: false,
      error: 'CREATE_ERROR',
      message: error instanceof Error ? error.message : 'Failed to create cases'
    }, { status: 500 })
  }
}

