import { parentPort, workerData } from 'worker_threads'
import { dailyDigestService } from 'data'

/**
 * Daily Digest Job Worker
 * Runs daily at 07:30 IST to generate personal/admin digests
 */
async function runDailyDigestJob() {
  try {
    console.log('🕰️ Starting daily digest job at 07:30 IST...')
    
    // Get configuration from worker data
    const config = workerData?.config || {}
    console.log('Job configuration:', config)
    
    // Generate digests for all users
    const digests = await dailyDigestService.generateAllUserDigests()
    
    // Send notifications for each digest
    for (const digest of digests) {
      try {
        await dailyDigestService.sendDailyDigestNotification(digest.userId, digest)
      } catch (error) {
        console.error(`Failed to send notification for user ${digest.userId}:`, error)
      }
    }
    
    console.log(`✅ Daily digest job completed - generated ${digests.length} digests and sent notifications`)
    
    // Send success message to parent
    if (parentPort) {
      parentPort.postMessage({
        success: true,
        message: `Daily digest completed - ${digests.length} digests generated`,
        timestamp: new Date().toISOString(),
        digestsCount: digests.length
      })
    }
    
  } catch (error) {
    console.error('❌ Daily digest job failed:', error)
    
    // Send error message to parent
    if (parentPort) {
      parentPort.postMessage({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
    }
  }
}

// Run the job
runDailyDigestJob()
