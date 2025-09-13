"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootSchedulers = bootSchedulers;
exports.stopSchedulers = stopSchedulers;
exports.getSchedulerStatus = getSchedulerStatus;
exports.runJob = runJob;
exports.getJobStatistics = getJobStatistics;
const bree_1 = __importDefault(require("bree"));
const path_1 = __importDefault(require("path"));
const core_1 = require("core");
const __dirname = path_1.default.dirname(__filename);
let bree = null;
/**
 * Boot all schedulers
 */
async function bootSchedulers() {
    try {
        console.log('Starting job schedulers...');
        // Get configuration
        const config = {
            APP_MODE: core_1.ConfigUtils.isDesktop() ? 'desktop' : 'web',
            DATA_DIR: core_1.ConfigUtils.getDataDir(),
            DESKTOP_RUNTIME: core_1.ConfigUtils.isDesktop()
        };
        // Check if job scheduling is enabled
        if (!core_1.ConfigUtils.isDesktop()) {
            console.log('Job schedulers skipped - not in desktop mode');
            return;
        }
        // Initialize Bree with jobs
        bree = new bree_1.default({
            root: path_1.default.join(__dirname, 'jobs'),
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
                info: (message) => console.log(`[BREE] ${message}`),
                warn: (message) => console.warn(`[BREE] ${message}`),
                error: (message) => console.error(`[BREE] ${message}`),
            },
        });
        // Start the scheduler
        await bree.start();
        console.log('Job schedulers started successfully');
        console.log('Scheduled jobs:');
        console.log('- dailySync: 06:30 IST (daily sync with external systems)');
        console.log('- slaCheck: 18:00 IST (SLA compliance check)');
        console.log('- nightlyBackup: 23:30 IST (database backup)');
        console.log('- userPendingRefresh: Every 5 minutes (refresh user pending summaries)');
        console.log('- dailyDigest: 07:30 IST (personal/admin digest with desktop notifications)');
    }
    catch (error) {
        console.error('Failed to start job schedulers:', error);
        throw error;
    }
}
/**
 * Stop all schedulers
 */
async function stopSchedulers() {
    try {
        if (bree) {
            console.log('Stopping job schedulers...');
            await bree.stop();
            bree = null;
            console.log('Job schedulers stopped successfully');
        }
    }
    catch (error) {
        console.error('Failed to stop job schedulers:', error);
        throw error;
    }
}
/**
 * Get scheduler status
 */
function getSchedulerStatus() {
    if (!bree) {
        return { running: false, jobs: [] };
    }
    const jobs = bree.config.jobs?.map(job => ({
        name: job.name,
        cron: job.cron,
        timezone: job.timezone,
        running: bree?.workers.has(job.name) || false,
    })) || [];
    return {
        running: true,
        jobs,
    };
}
/**
 * Run a specific job manually
 */
async function runJob(jobName) {
    if (!bree) {
        throw new Error('Scheduler not initialized');
    }
    try {
        console.log(`Manually running job: ${jobName}`);
        await bree.run(jobName);
        console.log(`Job ${jobName} completed successfully`);
    }
    catch (error) {
        console.error(`Failed to run job ${jobName}:`, error);
        throw error;
    }
}
/**
 * Get job statistics
 */
async function getJobStatistics() {
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
        };
    }
    catch (error) {
        console.error('Failed to get job statistics:', error);
        return null;
    }
}
