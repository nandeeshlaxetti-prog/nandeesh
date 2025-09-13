import { Job } from 'bree'
import { db } from 'data'
import { ConfigUtils } from 'core'

/**
 * Daily Sync Job - Runs at 06:30 IST
 * Syncs case data with external systems (eCourts, etc.)
 */
export default async function dailySync(job: Job) {
  console.log(`[${new Date().toISOString()}] Starting daily sync job...`)
  
  try {
    // Get configuration
    const config = ConfigUtils.getConfig()
    
    // Check if sync is enabled
    if (!config.APP_MODE || config.APP_MODE !== 'desktop') {
      console.log('Daily sync skipped - not in desktop mode')
      return
    }

    // Get cases that need syncing
    const casesToSync = await db.case.findMany({
      where: {
        status: { in: ['OPEN', 'IN_PROGRESS'] },
        isConfidential: false,
      },
      include: {
        client: true,
        assignedLawyer: true,
      },
      take: 100, // Limit to prevent overwhelming external systems
    })

    console.log(`Found ${casesToSync.length} cases to sync`)

    let syncedCount = 0
    let errorCount = 0

    for (const caseData of casesToSync) {
      try {
        // Simulate eCourts sync
        await syncCaseWithECourts(caseData)
        
        // Update last sync timestamp
        await db.case.update({
          where: { id: caseData.id },
          data: {
            updatedAt: new Date(),
          },
        })
        
        syncedCount++
        console.log(`Synced case: ${caseData.caseNumber}`)
        
        // Add delay to prevent overwhelming external systems
        await new Promise(resolve => setTimeout(resolve, 100))
        
      } catch (error) {
        errorCount++
        console.error(`Failed to sync case ${caseData.caseNumber}:`, error)
      }
    }

    // Log sync results
    console.log(`Daily sync completed: ${syncedCount} synced, ${errorCount} errors`)
    
    // Create audit log entry
    await db.auditLog.create({
      data: {
        action: 'SYNC',
        entityType: 'SYSTEM',
        entityName: 'Daily Sync Job',
        severity: 'MEDIUM',
        description: `Daily sync completed: ${syncedCount} cases synced, ${errorCount} errors`,
        details: JSON.stringify({
          syncedCount,
          errorCount,
          totalCases: casesToSync.length,
        }),
        createdAt: new Date(),
      },
    })

  } catch (error) {
    console.error('Daily sync job failed:', error)
    
    // Create error audit log
    await db.auditLog.create({
      data: {
        action: 'SYNC',
        entityType: 'SYSTEM',
        entityName: 'Daily Sync Job',
        severity: 'HIGH',
        description: `Daily sync job failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        createdAt: new Date(),
      },
    })
    
    throw error
  }
}

/**
 * Simulate syncing case data with eCourts
 */
async function syncCaseWithECourts(caseData: any): Promise<void> {
  // This is a simulation - in real implementation, this would:
  // 1. Connect to eCourts API
  // 2. Send case data
  // 3. Receive updated case information
  // 4. Update local database
  
  console.log(`Syncing case ${caseData.caseNumber} with eCourts...`)
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 200))
  
  // Simulate occasional failures (5% failure rate)
  if (Math.random() < 0.05) {
    throw new Error('eCourts API temporarily unavailable')
  }
  
  console.log(`Successfully synced case ${caseData.caseNumber}`)
}
