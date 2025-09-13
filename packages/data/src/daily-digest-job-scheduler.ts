import { dailyDigestService } from './daily-digest-service'
import { userPendingSummaryWorker } from './user-pending-summary-worker'

/**
 * Daily Digest Job Scheduler
 * Schedules and executes daily digest jobs at 07:30 IST
 */
export class DailyDigestJobScheduler {
  
  private isRunning = false
  private intervalId: NodeJS.Timeout | null = null
  
  /**
   * Start the daily digest scheduler
   */
  start(): void {
    if (this.isRunning) {
      console.log('Daily digest scheduler is already running')
      return
    }
    
    console.log('Starting daily digest scheduler...')
    this.isRunning = true
    
    // Schedule the job to run every minute to check for 07:30 IST
    this.intervalId = setInterval(() => {
      this.checkAndRunDigest()
    }, 60000) // Check every minute
    
    console.log('Daily digest scheduler started - will run at 07:30 IST daily')
  }
  
  /**
   * Stop the daily digest scheduler
   */
  stop(): void {
    if (!this.isRunning) {
      console.log('Daily digest scheduler is not running')
      return
    }
    
    console.log('Stopping daily digest scheduler...')
    this.isRunning = false
    
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    
    console.log('Daily digest scheduler stopped')
  }
  
  /**
   * Check if it's time to run the digest and execute if needed
   */
  private async checkAndRunDigest(): Promise<void> {
    try {
      const now = new Date()
      const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}))
      
      // Check if it's 07:30 IST
      if (istTime.getHours() === 7 && istTime.getMinutes() === 30) {
        console.log('🕰️ Time for daily digest! Running at 07:30 IST...')
        await this.runDailyDigest()
      }
    } catch (error) {
      console.error('Error checking digest schedule:', error)
    }
  }
  
  /**
   * Run the daily digest for all users
   */
  async runDailyDigest(): Promise<void> {
    try {
      console.log('📧 Starting daily digest generation...')
      
      // First refresh all user pending summaries
      console.log('🔄 Refreshing user pending summaries...')
      await userPendingSummaryWorker.refreshAllUserPendingSummaries()
      
      // Generate digests for all users
      console.log('📝 Generating digests for all users...')
      const digests = await dailyDigestService.generateAllUserDigests()
      
      console.log(`✅ Generated ${digests.length} digests`)
      
      // Send desktop notifications for each digest
      for (const digest of digests) {
        await this.sendDesktopNotification(digest)
      }
      
      console.log('🎉 Daily digest completed successfully!')
      
    } catch (error) {
      console.error('Error running daily digest:', error)
    }
  }
  
  /**
   * Send desktop notification for a digest
   */
  private async sendDesktopNotification(digest: any): Promise<void> {
    try {
      const notificationMessage = dailyDigestService.formatDigestForNotification(digest)
      
      // This would integrate with Electron's notification system
      // For now, we'll log the notification
      console.log(`📱 Desktop notification for ${digest.userName}:`)
      console.log(notificationMessage)
      
      // In a real implementation, this would send a desktop notification
      // await this.sendElectronNotification(digest.userId, notificationMessage)
      
    } catch (error) {
      console.error(`Error sending notification for user ${digest.userId}:`, error)
    }
  }
  
  /**
   * Send Electron notification (placeholder for future implementation)
   */
  private async sendElectronNotification(userId: string, message: string): Promise<void> {
    // This would integrate with Electron's main process to send notifications
    // For now, it's a placeholder
    
    console.log(`🔔 Electron notification for user ${userId}:`)
    console.log(message)
    
    // Future implementation would:
    // 1. Send IPC message to Electron main process
    // 2. Main process would create desktop notification
    // 3. Notification would appear on user's desktop
  }
  
  /**
   * Run digest for a specific user (for testing)
   */
  async runUserDigest(userId: string): Promise<void> {
    try {
      console.log(`📧 Running digest for user ${userId}...`)
      
      // Refresh user pending summary
      await userPendingSummaryWorker.refreshUserPendingSummary(userId)
      
      // Generate digest
      const digest = await dailyDigestService.generateUserDigest(userId)
      
      if (digest) {
        console.log(`✅ Generated digest for user ${userId}`)
        await this.sendDesktopNotification(digest)
      } else {
        console.log(`❌ No digest generated for user ${userId}`)
      }
      
    } catch (error) {
      console.error(`Error running digest for user ${userId}:`, error)
    }
  }
  
  /**
   * Get scheduler status
   */
  getStatus(): { isRunning: boolean; nextRun?: Date } {
    const status: { isRunning: boolean; nextRun?: Date } = {
      isRunning: this.isRunning
    }
    
    if (this.isRunning) {
      // Calculate next run time (07:30 IST tomorrow)
      const now = new Date()
      const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}))
      
      const nextRun = new Date(istTime)
      nextRun.setHours(7, 30, 0, 0)
      
      // If it's already past 07:30 today, schedule for tomorrow
      if (istTime.getHours() > 7 || (istTime.getHours() === 7 && istTime.getMinutes() >= 30)) {
        nextRun.setDate(nextRun.getDate() + 1)
      }
      
      status.nextRun = nextRun
    }
    
    return status
  }
  
  /**
   * Test the digest system
   */
  async testDigest(): Promise<void> {
    try {
      console.log('🧪 Testing digest system...')
      
      // Test with a sample user (you would replace this with an actual user ID)
      const testUserId = 'test-user-id'
      
      // Generate test digest
      const digest = await dailyDigestService.generateUserDigest(testUserId)
      
      if (digest) {
        console.log('✅ Test digest generated successfully')
        console.log('📝 Test digest content:')
        console.log(dailyDigestService.formatDigestForNotification(digest))
      } else {
        console.log('❌ Test digest generation failed')
      }
      
    } catch (error) {
      console.error('Error testing digest system:', error)
    }
  }
}

// Export singleton instance
export const dailyDigestJobScheduler = new DailyDigestJobScheduler()
