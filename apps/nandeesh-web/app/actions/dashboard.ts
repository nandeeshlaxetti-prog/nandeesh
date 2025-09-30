'use server'

// Simple working actions for the web app
export async function getSystemStatus() {
  return {
    database: 'connected',
    webServer: 'running',
    electronApp: 'development',
    timestamp: new Date().toISOString()
  }
}

export async function getDashboardData() {
  return {
    totalCases: 3,
    pendingTasks: 5,
    upcomingHearings: 2,
    overdueItems: 1
  }
}