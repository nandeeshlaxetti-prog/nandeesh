import { z } from 'zod'

// Team Status Enum
export const TeamStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED'])
export type TeamStatus = z.infer<typeof TeamStatusSchema>

// Team Member Role Enum
export const TeamMemberRoleSchema = z.enum(['LEAD', 'MEMBER', 'CONTRIBUTOR'])
export type TeamMemberRole = z.infer<typeof TeamMemberRoleSchema>

// Base Team Schema
export const TeamSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  status: TeamStatusSchema.default('ACTIVE'),
  leadId: z.string().cuid().optional(),
  department: z.string().max(100).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(), // Hex color
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Team Member Schema
export const TeamMemberSchema = z.object({
  id: z.string().cuid(),
  teamId: z.string().cuid(),
  userId: z.string().cuid(),
  role: TeamMemberRoleSchema.default('MEMBER'),
  joinedAt: z.date(),
  leftAt: z.date().optional(),
  isActive: z.boolean().default(true),
})

// Create Team Schema
export const CreateTeamSchema = TeamSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

// Update Team Schema
export const UpdateTeamSchema = CreateTeamSchema.partial()

// Add Team Member Schema
export const AddTeamMemberSchema = z.object({
  teamId: z.string().cuid(),
  userId: z.string().cuid(),
  role: TeamMemberRoleSchema.default('MEMBER'),
})

// Remove Team Member Schema
export const RemoveTeamMemberSchema = z.object({
  teamId: z.string().cuid(),
  userId: z.string().cuid(),
})

// Team with Members Schema
export const TeamWithMembersSchema = TeamSchema.extend({
  members: z.array(TeamMemberSchema),
  lead: z.object({
    id: z.string().cuid(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
  }).optional(),
})

// Team List Schema
export const TeamListSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  description: z.string().optional(),
  status: TeamStatusSchema,
  leadId: z.string().cuid().optional(),
  department: z.string().optional(),
  memberCount: z.number().int().min(0),
  createdAt: z.date(),
})

// Export Types
export type Team = z.infer<typeof TeamSchema>
export type TeamMember = z.infer<typeof TeamMemberSchema>
export type CreateTeam = z.infer<typeof CreateTeamSchema>
export type UpdateTeam = z.infer<typeof UpdateTeamSchema>
export type AddTeamMember = z.infer<typeof AddTeamMemberSchema>
export type RemoveTeamMember = z.infer<typeof RemoveTeamMemberSchema>
export type TeamWithMembers = z.infer<typeof TeamWithMembersSchema>
export type TeamList = z.infer<typeof TeamListSchema>
