import Bree from 'bree'
import path from 'path'
import { ConfigUtils } from 'core'

const __dirname = path.dirname(__filename)

let bree: Bree | null = null

/**
 * Boot all schedulers
 */
export async function bootSchedulers(): Promise<void> {
  try {
    console.log('Starting job schedulers...')
    
    // Get configuration
    const config = {
      APP_MODE: ConfigUtils.isDesktop() ? 'desktop' : 'web',
      DATA_DIR: ConfigUtils.getDataDir(),
      DESKTOP_RUNTIME: ConfigUtils.isDesktop()
    }
    
    // Check if job scheduling is enabled
    if (!ConfigUtils.isDesktop()) {
      console.log('Job schedulers skipped - not in desktop mode')
      return
    }

    // Initialize Bree with jobs
    bree = new Bree({
      root: path.join(__dirname, 'jobs'),
      defaultExtension: 'js',
      jobs: [
        {
          name: 'dailySync',
          cron: '30 6 * * *', // 06:30 IST (assuming IST is UTC+5:30)
          timezone: 'Asia/Kolkata',
        },
        {
          name: 'slaCheck',
          cron: '0 18 * * *', // 18:00 IST
          timezone: 'Asia/Kolkata',
        },
        {
          name: 'nightlyBackup',
          cron: '30 23 * * *', // 23:30 IST
          timezone: 'Asia/Kolkata',
        },
        {
          name: 'userPendingRefresh',
          cron: '*/5 * * * *', // Every 5 minutes
          timezone: 'Asia/Kolkata',
        },
        {
          name: 'dailyDigest',
          cron: '30 7 * * *', // 07:30 IST
          timezone: 'Asia/Kolkata',
        },
      ],
      worker: {
        workerData: {
          // Pass configuration to workers
          config: {
            APP_MODE: config.APP_MODE,
            DATA_DIR: config.DATA_DIR,
            DESKTOP_RUNTIME: config.DESKTOP_RUNTIME,
          },
        },
      },
      logger: {
        info: (message: string) => console.log(`[BREE] ${message}`),
        warn: (message: string) => console.warn(`[BREE] ${message}`),
        error: (message: string) => console.error(`[BREE] ${message}`),
      },
    })

    // Start the scheduler
    await bree.start()

    console.log('Job schedulers started successfully')
    console.log('Scheduled jobs:')
    console.log('- dailySync: 06:30 IST (daily sync with external systems)')
    console.log('- slaCheck: 18:00 IST (SLA compliance check)')
    console.log('- nightlyBackup: 23:30 IST (database backup)')
    console.log('- userPendingRefresh: Every 5 minutes (refresh user pending summaries)')
    console.log('- dailyDigest: 07:30 IST (personal/admin digest with desktop notifications)')

  } catch (error) {
    console.error('Failed to start job schedulers:', error)
    throw error
  }
}

/**
 * Stop all schedulers
 */
export async function stopSchedulers(): Promise<void> {
  try {
    if (bree) {
      console.log('Stopping job schedulers...')
      await bree.stop()
      bree = null
      console.log('Job schedulers stopped successfully')
    }
  } catch (error) {
    console.error('Failed to stop job schedulers:', error)
    throw error
  }
}

/**
 * Get scheduler status
 */
export function getSchedulerStatus(): { running: boolean; jobs: any[] } {
  if (!bree) {
    return { running: false, jobs: [] }
  }

  const jobs = bree.config.jobs?.map(job => ({
    name: job.name,
    cron: job.cron,
    timezone: job.timezone,
    running: bree?.workers.has(job.name) || false,
  })) || []

  return {
    running: true,
    jobs,
  }
}

/**
 * Run a specific job manually
 */
export async function runJob(jobName: string): Promise<void> {
  if (!bree) {
    throw new Error('Scheduler not initialized')
  }

  try {
    console.log(`Manually running job: ${jobName}`)
    await bree.run(jobName)
    console.log(`Job ${jobName} completed successfully`)
  } catch (error) {
    console.error(`Failed to run job ${jobName}:`, error)
    throw error
  }
}

/**
 * Get job statistics
 */
export async function getJobStatistics(): Promise<any> {
  try {
    // This would typically query a job statistics table
    // For now, return basic information
    return {
      totalJobs: 5,
      runningJobs: bree ? bree.workers.size : 0,
      lastRun: {
        dailySync: 'Not available',
        slaCheck: 'Not available',
        nightlyBackup: 'Not available',
        userPendingRefresh: 'Not available',
        dailyDigest: 'Not available',
      },
      nextRun: {
        dailySync: '06:30 IST tomorrow',
        slaCheck: '18:00 IST today',
        nightlyBackup: '23:30 IST today',
        userPendingRefresh: 'Every 5 minutes',
        dailyDigest: '07:30 IST tomorrow',
      },
    }
  } catch (error) {
    console.error('Failed to get job statistics:', error)
    return null
  }
}