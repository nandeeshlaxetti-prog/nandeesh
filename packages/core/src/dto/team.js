"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamListSchema = exports.TeamWithMembersSchema = exports.RemoveTeamMemberSchema = exports.AddTeamMemberSchema = exports.UpdateTeamSchema = exports.CreateTeamSchema = exports.TeamMemberSchema = exports.TeamSchema = exports.TeamMemberRoleSchema = exports.TeamStatusSchema = void 0;
const zod_1 = require("zod");
// Team Status Enum
exports.TeamStatusSchema = zod_1.z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']);
// Team Member Role Enum
exports.TeamMemberRoleSchema = zod_1.z.enum(['LEAD', 'MEMBER', 'CONTRIBUTOR']);
// Base Team Schema
exports.TeamSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    name: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().max(500).optional(),
    status: exports.TeamStatusSchema.default('ACTIVE'),
    leadId: zod_1.z.string().cuid().optional(),
    department: zod_1.z.string().max(100).optional(),
    color: zod_1.z.string().regex(/^#[0-9A-F]{6}$/i).optional(), // Hex color
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
// Team Member Schema
exports.TeamMemberSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    teamId: zod_1.z.string().cuid(),
    userId: zod_1.z.string().cuid(),
    role: exports.TeamMemberRoleSchema.default('MEMBER'),
    joinedAt: zod_1.z.date(),
    leftAt: zod_1.z.date().optional(),
    isActive: zod_1.z.boolean().default(true),
});
// Create Team Schema
exports.CreateTeamSchema = exports.TeamSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
// Update Team Schema
exports.UpdateTeamSchema = exports.CreateTeamSchema.partial();
// Add Team Member Schema
exports.AddTeamMemberSchema = zod_1.z.object({
    teamId: zod_1.z.string().cuid(),
    userId: zod_1.z.string().cuid(),
    role: exports.TeamMemberRoleSchema.default('MEMBER'),
});
// Remove Team Member Schema
exports.RemoveTeamMemberSchema = zod_1.z.object({
    teamId: zod_1.z.string().cuid(),
    userId: zod_1.z.string().cuid(),
});
// Team with Members Schema
exports.TeamWithMembersSchema = exports.TeamSchema.extend({
    members: zod_1.z.array(exports.TeamMemberSchema),
    lead: zod_1.z.object({
        id: zod_1.z.string().cuid(),
        firstName: zod_1.z.string(),
        lastName: zod_1.z.string(),
        email: zod_1.z.string().email(),
    }).optional(),
});
// Team List Schema
exports.TeamListSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    status: exports.TeamStatusSchema,
    leadId: zod_1.z.string().cuid().optional(),
    department: zod_1.z.string().optional(),
    memberCount: zod_1.z.number().int().min(0),
    createdAt: zod_1.z.date(),
});
