import { z } from 'zod'

// Validation utilities
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`)
    }
    throw error
  }
}

export function safeValidateData<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => e.message).join(', ') }
    }
    return { success: false, error: 'Unknown validation error' }
  }
}

// Date utilities
export function formatDate(date: Date, timezone: string = 'Asia/Kolkata'): string {
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: timezone,
  })
}

export function formatDateTime(date: Date, timezone: string = 'Asia/Kolkata'): string {
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone,
  })
}

export function formatTime(date: Date, timezone: string = 'Asia/Kolkata'): string {
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone,
  })
}

export function getCurrentDate(timezone: string = 'Asia/Kolkata'): Date {
  const now = new Date()
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000)
  const targetTime = new Date(utc + (getTimezoneOffset(timezone) * 60000))
  return targetTime
}

export function getTimezoneOffset(timezone: string): number {
  const now = new Date()
  const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000))
  const target = new Date(utc.toLocaleString('en-US', { timeZone: timezone }))
  return (target.getTime() - utc.getTime()) / 60000
}

export function convertToTimezone(date: Date, timezone: string = 'Asia/Kolkata'): Date {
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000)
  return new Date(utc + (getTimezoneOffset(timezone) * 60000))
}

export function isToday(date: Date, timezone: string = 'Asia/Kolkata'): boolean {
  const today = getCurrentDate(timezone)
  const targetDate = convertToTimezone(date, timezone)
  return targetDate.toDateString() === today.toDateString()
}

export function isThisWeek(date: Date, timezone: string = 'Asia/Kolkata'): boolean {
  const now = getCurrentDate(timezone)
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const targetDate = convertToTimezone(date, timezone)
  return targetDate >= weekAgo && targetDate <= now
}

export function isThisMonth(date: Date, timezone: string = 'Asia/Kolkata'): boolean {
  const now = getCurrentDate(timezone)
  const targetDate = convertToTimezone(date, timezone)
  return targetDate.getMonth() === now.getMonth() && 
         targetDate.getFullYear() === now.getFullYear()
}

export function getStartOfDay(date: Date, timezone: string = 'Asia/Kolkata'): Date {
  const targetDate = convertToTimezone(date, timezone)
  targetDate.setHours(0, 0, 0, 0)
  return targetDate
}

export function getEndOfDay(date: Date, timezone: string = 'Asia/Kolkata'): Date {
  const targetDate = convertToTimezone(date, timezone)
  targetDate.setHours(23, 59, 59, 999)
  return targetDate
}

export function getStartOfWeek(date: Date, timezone: string = 'Asia/Kolkata'): Date {
  const targetDate = convertToTimezone(date, timezone)
  const day = targetDate.getDay()
  const diff = targetDate.getDate() - day + (day === 0 ? -6 : 1) // Monday as start of week
  const startOfWeek = new Date(targetDate.setDate(diff))
  return getStartOfDay(startOfWeek, timezone)
}

export function getEndOfWeek(date: Date, timezone: string = 'Asia/Kolkata'): Date {
  const startOfWeek = getStartOfWeek(date, timezone)
  const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000)
  return getEndOfDay(endOfWeek, timezone)
}

export function getStartOfMonth(date: Date, timezone: string = 'Asia/Kolkata'): Date {
  const targetDate = convertToTimezone(date, timezone)
  const startOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1)
  return getStartOfDay(startOfMonth, timezone)
}

export function getEndOfMonth(date: Date, timezone: string = 'Asia/Kolkata'): Date {
  const targetDate = convertToTimezone(date, timezone)
  const endOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0)
  return getEndOfDay(endOfMonth, timezone)
}

export function addDays(date: Date, days: number, timezone: string = 'Asia/Kolkata'): Date {
  const targetDate = convertToTimezone(date, timezone)
  targetDate.setDate(targetDate.getDate() + days)
  return targetDate
}

export function addMonths(date: Date, months: number, timezone: string = 'Asia/Kolkata'): Date {
  const targetDate = convertToTimezone(date, timezone)
  targetDate.setMonth(targetDate.getMonth() + months)
  return targetDate
}

export function addYears(date: Date, years: number, timezone: string = 'Asia/Kolkata'): Date {
  const targetDate = convertToTimezone(date, timezone)
  targetDate.setFullYear(targetDate.getFullYear() + years)
  return targetDate
}

export function getDaysDifference(date1: Date, date2: Date, timezone: string = 'Asia/Kolkata'): number {
  const d1 = convertToTimezone(date1, timezone)
  const d2 = convertToTimezone(date2, timezone)
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function isWeekend(date: Date, timezone: string = 'Asia/Kolkata'): boolean {
  const targetDate = convertToTimezone(date, timezone)
  const day = targetDate.getDay()
  return day === 0 || day === 6 // Sunday or Saturday
}

export function isBusinessDay(date: Date, timezone: string = 'Asia/Kolkata'): boolean {
  return !isWeekend(date, timezone)
}

export function getNextBusinessDay(date: Date, timezone: string = 'Asia/Kolkata'): Date {
  let nextDay = addDays(date, 1, timezone)
  while (!isBusinessDay(nextDay, timezone)) {
    nextDay = addDays(nextDay, 1, timezone)
  }
  return nextDay
}

export function getPreviousBusinessDay(date: Date, timezone: string = 'Asia/Kolkata'): Date {
  let prevDay = addDays(date, -1, timezone)
  while (!isBusinessDay(prevDay, timezone)) {
    prevDay = addDays(prevDay, -1, timezone)
  }
  return prevDay
}

// Timezone constants
export const TIMEZONES = {
  KOLKATA: 'Asia/Kolkata',
  UTC: 'UTC',
  NEW_YORK: 'America/New_York',
  LONDON: 'Europe/London',
  TOKYO: 'Asia/Tokyo',
  SYDNEY: 'Australia/Sydney',
} as const

export const DEFAULT_TIMEZONE = TIMEZONES.KOLKATA

// String utilities
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Array utilities
export function groupBy<T, K extends string | number | symbol>(
  array: T[],
  key: (item: T) => K
): Record<K, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = key(item)
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(item)
    return groups
  }, {} as Record<K, T[]>)
}

export function unique<T>(array: T[]): T[] {
  return [...new Set(array)]
}

export function sortBy<T>(array: T[], key: (item: T) => string | number): T[] {
  return [...array].sort((a, b) => {
    const aKey = key(a)
    const bKey = key(b)
    if (aKey < bKey) return -1
    if (aKey > bKey) return 1
    return 0
  })
}

// Object utilities
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj }
  keys.forEach(key => delete result[key])
  return result
}

export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  return result
}

// Error utilities
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function createError(message: string, code: string, statusCode?: number): AppError {
  return new AppError(message, code, statusCode)
}

// Constants
export const ROLES = {
  ADMIN: 'admin',
  LAWYER: 'lawyer',
  PARALEGAL: 'paralegal',
  CLIENT: 'client',
} as const

export const CASE_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  CLOSED: 'closed',
  ARCHIVED: 'archived',
} as const

export const CASE_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const
