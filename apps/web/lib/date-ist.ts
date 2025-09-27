/**
 * IST (India Standard Time) date utilities
 * All functions return dates in IST timezone
 */

const IST_OFFSET = 5.5 * 60 * 60 * 1000 // 5.5 hours in milliseconds

/**
 * Get current date in IST
 */
export function todayIST(): Date {
  const now = new Date()
  return new Date(now.getTime() + IST_OFFSET)
}

/**
 * Add days to current IST date
 */
export function addDaysIST(days: number): Date {
  const today = todayIST()
  return new Date(today.getTime() + days * 24 * 60 * 60 * 1000)
}

/**
 * Format date in IST with custom pattern
 * @param date - Date to format
 * @param pattern - Format pattern (default: 'DD/MM/YYYY')
 */
export function formatIST(date: Date, pattern: string = 'DD/MM/YYYY'): string {
  const istDate = new Date(date.getTime() + IST_OFFSET)
  
  const day = istDate.getUTCDate().toString().padStart(2, '0')
  const month = (istDate.getUTCMonth() + 1).toString().padStart(2, '0')
  const year = istDate.getUTCFullYear()
  const hours = istDate.getUTCHours().toString().padStart(2, '0')
  const minutes = istDate.getUTCMinutes().toString().padStart(2, '0')
  const seconds = istDate.getUTCSeconds().toString().padStart(2, '0')
  
  return pattern
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', year.toString())
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * Get IST date for a specific day offset (D-2, D-1, Today, D+1, D+2)
 */
export function getISTDateForOffset(offset: number): Date {
  return addDaysIST(offset)
}

/**
 * Check if date is today in IST
 */
export function isTodayIST(date: Date): boolean {
  const today = todayIST()
  const checkDate = new Date(date.getTime() + IST_OFFSET)
  
  return today.toDateString() === checkDate.toDateString()
}

/**
 * Get relative date string (Today, Yesterday, Tomorrow, or formatted date)
 */
export function getRelativeISTDate(date: Date): string {
  const today = todayIST()
  const checkDate = new Date(date.getTime() + IST_OFFSET)
  const diffDays = Math.floor((checkDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))
  
  switch (diffDays) {
    case 0:
      return 'Today'
    case 1:
      return 'Tomorrow'
    case -1:
      return 'Yesterday'
    default:
      return formatIST(date, 'DD/MM/YYYY')
  }
}

/**
 * Get cause list date labels for tabs
 */
export function getCauseListDateLabels(): Array<{ offset: number; label: string; date: Date }> {
  return [
    { offset: -2, label: 'D-2', date: getISTDateForOffset(-2) },
    { offset: -1, label: 'D-1', date: getISTDateForOffset(-1) },
    { offset: 0, label: 'Today', date: getISTDateForOffset(0) },
    { offset: 1, label: 'D+1', date: getISTDateForOffset(1) },
    { offset: 2, label: 'D+2', date: getISTDateForOffset(2) },
  ]
}
