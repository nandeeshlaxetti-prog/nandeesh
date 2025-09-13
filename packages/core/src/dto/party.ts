import { z } from 'zod'

// Party Type Enum
export const PartyTypeSchema = z.enum(['INDIVIDUAL', 'COMPANY', 'GOVERNMENT', 'NGO', 'OTHER'])
export type PartyType = z.infer<typeof PartyTypeSchema>

// Party Role Enum
export const PartyRoleSchema = z.enum(['PLAINTIFF', 'DEFENDANT', 'THIRD_PARTY', 'WITNESS', 'EXPERT', 'OTHER'])
export type PartyRole = z.infer<typeof PartyRoleSchema>

// Base Party Schema
export const PartySchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1).max(200),
  type: PartyTypeSchema.default('INDIVIDUAL'),
  role: PartyRoleSchema.default('PLAINTIFF'),
  caseId: z.string().cuid(),
  contactPerson: z.string().max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).default('India'),
  pincode: z.string().max(10).optional(),
  registrationNumber: z.string().max(50).optional(), // For companies
  panNumber: z.string().max(10).optional(),
  gstNumber: z.string().max(15).optional(),
  isActive: z.boolean().default(true),
  notes: z.string().max(1000).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Create Party Schema
export const CreatePartySchema = PartySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

// Update Party Schema
export const UpdatePartySchema = CreatePartySchema.partial()

// Party Search Schema
export const PartySearchSchema = z.object({
  query: z.string().optional(),
  type: PartyTypeSchema.optional(),
  role: PartyRoleSchema.optional(),
  caseId: z.string().cuid().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  isActive: z.boolean().optional(),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().min(0).default(0),
})

// Party List Schema
export const PartyListSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  type: PartyTypeSchema,
  role: PartyRoleSchema,
  caseId: z.string().cuid(),
  contactPerson: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.date(),
})

// Party with Case Schema
export const PartyWithCaseSchema = PartySchema.extend({
  case: z.object({
    id: z.string().cuid(),
    caseNumber: z.string(),
    title: z.string(),
    status: z.string(),
  }),
})

// Individual Party Schema (for individuals)
export const IndividualPartySchema = PartySchema.extend({
  type: z.literal('INDIVIDUAL'),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  middleName: z.string().max(100).optional(),
  dateOfBirth: z.date().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  occupation: z.string().max(100).optional(),
})

// Company Party Schema (for companies)
export const CompanyPartySchema = PartySchema.extend({
  type: z.literal('COMPANY'),
  companyName: z.string().min(1).max(200),
  incorporationDate: z.date().optional(),
  businessType: z.string().max(100).optional(),
  authorizedSignatory: z.string().max(100).optional(),
})

// Export Types
export type Party = z.infer<typeof PartySchema>
export type CreateParty = z.infer<typeof CreatePartySchema>
export type UpdateParty = z.infer<typeof UpdatePartySchema>
export type PartySearch = z.infer<typeof PartySearchSchema>
export type PartyList = z.infer<typeof PartyListSchema>
export type PartyWithCase = z.infer<typeof PartyWithCaseSchema>
export type IndividualParty = z.infer<typeof IndividualPartySchema>
export type CompanyParty = z.infer<typeof CompanyPartySchema>
