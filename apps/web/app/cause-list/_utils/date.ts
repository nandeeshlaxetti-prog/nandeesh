/**
 * Get current date in IST (Indian Standard Time) as YYYY-MM-DD string
 */
export function getISTDate(): string {
  const now = new Date()
  
  // Convert to IST (UTC+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000 // 5 hours 30 minutes in milliseconds
  const istTime = new Date(now.getTime() + istOffset)
  
  return istTime.toISOString().split('T')[0]
}

/**
 * Get start of day in IST timezone
 */
export function startOfDayIST(date: Date): Date {
  const istOffset = 5.5 * 60 * 60 * 1000
  const istTime = new Date(date.getTime() + istOffset)
  istTime.setUTCHours(0, 0, 0, 0)
  return new Date(istTime.getTime() - istOffset)
}

/**
 * Convert date to IST timezone
 */
export function toIST(date: Date): Date {
  const istOffset = 5.5 * 60 * 60 * 1000
  return new Date(date.getTime() + istOffset)
}

/**
 * Get a date range of 5 days: D-2, D-1, Today, D+1, D+2
 */
export function getDateRange(): string[] {
  const today = new Date()
  const dates: string[] = []
  
  // Generate dates for D-2, D-1, Today, D+1, D+2
  for (let i = -2; i <= 2; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    dates.push(date.toISOString().split('T')[0])
  }
  
  return dates
}

/**
 * Format a date string (YYYY-MM-DD) for display in dd-MMM-yyyy format
 */
export function formatDateForDisplay(dateString: string): string {
  const date = new Date(dateString)
  
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]
  
  const day = date.getDate().toString().padStart(2, '0')
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  
  return `${day}-${month}-${year}`
}

/**
 * Get a human-readable label for a date relative to today
 */
export function getDateLabel(dateString: string): string {
  const today = new Date().toISOString().split('T')[0]
  const targetDate = new Date(dateString)
  const todayDate = new Date(today)
  
  const diffTime = targetDate.getTime() - todayDate.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === -1) return 'D-1'
  if (diffDays === -2) return 'D-2'
  if (diffDays === 1) return 'D+1'
  if (diffDays === 2) return 'D+2'
  
  return `D${diffDays > 0 ? '+' : ''}${diffDays}`
}

/**
 * Check if a date is today
 */
export function isToday(dateString: string): boolean {
  const today = new Date().toISOString().split('T')[0]
  return dateString === today
}

/**
 * Get the day of week for a date string
 */
export function getDayOfWeek(dateString: string): string {
  const date = new Date(dateString)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return days[date.getDay()]
}
