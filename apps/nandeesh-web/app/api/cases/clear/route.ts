import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// DELETE - Clear all cases and related data
export async function DELETE(request: NextRequest) {
  try {
    console.log('🗑️  Clearing all cases from the database...')
    
    // Delete all related data first (due to foreign key constraints)
    
    // Delete hearings
    const hearings = await prisma.hearing.deleteMany({})
    console.log(`✅ Deleted ${hearings.count} hearings`)
    
    // Delete orders
    const orders = await prisma.order.deleteMany({})
    console.log(`✅ Deleted ${orders.count} orders`)
    
    // Delete parties
    const parties = await prisma.party.deleteMany({})
    console.log(`✅ Deleted ${parties.count} parties`)
    
    // Delete tasks
    const tasks = await prisma.task.deleteMany({})
    console.log(`✅ Deleted ${tasks.count} tasks`)
    
    // Delete subtasks
    const subtasks = await prisma.subtask.deleteMany({})
    console.log(`✅ Deleted ${subtasks.count} subtasks`)
    
    // Delete documents
    const documents = await prisma.document.deleteMany({})
    console.log(`✅ Deleted ${documents.count} documents`)
    
    // Finally delete all cases
    const cases = await prisma.case.deleteMany({})
    console.log(`✅ Deleted ${cases.count} cases`)
    
    return NextResponse.json({
      success: true,
      message: `Successfully deleted all cases and related data`,
      deleted: {
        cases: cases.count,
        hearings: hearings.count,
        orders: orders.count,
        parties: parties.count,
        tasks: tasks.count,
        subtasks: subtasks.count,
        documents: documents.count
      }
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

