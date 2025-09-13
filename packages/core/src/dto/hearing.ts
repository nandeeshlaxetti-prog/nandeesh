import { z } from 'zod'

// Hearing Status Enum
export const HearingStatusSchema = z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'POSTPONED'])
export type HearingStatus = z.infer<typeof HearingStatusSchema>

// Hearing Type Enum
export const HearingTypeSchema = z.enum([
  'FIRST_HEARING', 'ARGUMENTS', 'EVIDENCE', 'JUDGMENT', 'EXECUTION',
  'MEDIATION', 'ARBITRATION', 'APPEAL', 'REVIEW', 'OTHER'
])
export type HearingType = z.infer<typeof HearingTypeSchema>

// Base Hearing Schema
export const HearingSchema = z.object({
  id: z.string().cuid(),
  caseId: z.string().cuid(),
  hearingNumber: z.string().min(1).max(20),
  type: HearingTypeSchema.default('FIRST_HEARING'),
  status: HearingStatusSchema.default('SCHEDULED'),
  scheduledDate: z.date(),
  scheduledTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM format
  duration: z.number().int().positive().default(60), // Duration in minutes
  courtName: z.string().min(1).max(200),
  courtLocation: z.string().max(200).optional(),
  judgeName: z.string().max(100).optional(),
  courtroom: z.string().max(50).optional(),
  description: z.string().max(1000).optional(),
  agenda: z.string().max(2000).optional(),
  attendees: z.array(z.string().cuid()).default([]), // User IDs
  documents: z.array(z.string().cuid()).default([]), // Document IDs
  outcome: z.string().max(1000).optional(),
  nextHearingDate: z.date().optional(),
  notes: z.string().max(2000).optional(),
  isConfidential: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Create Hearing Schema
export const CreateHearingSchema = HearingSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

// Update Hearing Schema
export const UpdateHearingSchema = CreateHearingSchema.partial()

// Hearing Search Schema
export const HearingSearchSchema = z.object({
  query: z.string().optional(),
  caseId: z.string().cuid().optional(),
  type: HearingTypeSchema.optional(),
  status: HearingStatusSchema.optional(),
  courtName: z.string().optional(),
  judgeName: z.string().optional(),
  scheduledDateFrom: z.date().optional(),
  scheduledDateTo: z.date().optional(),
  attendeeId: z.string().cuid().optional(),
  isConfidential: z.boolean().optional(),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().min(0).default(0),
})

// Hearing List Schema
export const HearingListSchema = z.object({
  id: z.string().cuid(),
  caseId: z.string().cuid(),
  hearingNumber: z.string(),
  type: HearingTypeSchema,
  status: HearingStatusSchema,
  scheduledDate: z.date(),
  scheduledTime: z.string(),
  courtName: z.string(),
  judgeName: z.string().optional(),
  createdAt: z.date(),
})

// Hearing with Case Schema
export const HearingWithCaseSchema = HearingSchema.extend({
  case: z.object({
    id: z.string().cuid(),
    caseNumber: z.string(),
    title: z.string(),
    status: z.string(),
  }),
})

// Hearing with Attendees Schema
export const HearingWithAttendeesSchema = HearingSchema.extend({
  attendeeDetails: z.array(z.object({
    id: z.string().cuid(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    role: z.string(),
  })),
})

// Hearing Calendar Schema
export const HearingCalendarSchema = z.object({
  id: z.string().cuid(),
  caseId: z.string().cuid(),
  hearingNumber: z.string(),
  type: HearingTypeSchema,
  status: HearingStatusSchema,
  scheduledDate: z.date(),
  scheduledTime: z.string(),
  duration: z.number().int().positive(),
  courtName: z.string(),
  courtroom: z.string().optional(),
  caseNumber: z.string(),
  caseTitle: z.string(),
})

// Hearing Statistics Schema
export const HearingStatisticsSchema = z.object({
  total: z.number().int().min(0),
  scheduled: z.number().int().min(0),
  completed: z.number().int().min(0),
  cancelled: z.number().int().min(0),
  postponed: z.number().int().min(0),
  upcoming: z.number().int().min(0), // Next 7 days
  overdue: z.number().int().min(0), // Past scheduled hearings
})

// Export Types
export type Hearing = z.infer<typeof HearingSchema>
export type CreateHearing = z.infer<typeof CreateHearingSchema>
export type UpdateHearing = z.infer<typeof UpdateHearingSchema>
export type HearingSearch = z.infer<typeof HearingSearchSchema>
export type HearingList = z.infer<typeof HearingListSchema>
export type HearingWithCase = z.infer<typeof HearingWithCaseSchema>
export type HearingWithAttendees = z.infer<typeof HearingWithAttendeesSchema>
export type HearingCalendar = z.infer<typeof HearingCalendarSchema>
export type HearingStatistics = z.infer<typeof HearingStatisticsSchema>
