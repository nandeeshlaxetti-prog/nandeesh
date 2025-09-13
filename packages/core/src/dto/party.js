"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyPartySchema = exports.IndividualPartySchema = exports.PartyWithCaseSchema = exports.PartyListSchema = exports.PartySearchSchema = exports.UpdatePartySchema = exports.CreatePartySchema = exports.PartySchema = exports.PartyRoleSchema = exports.PartyTypeSchema = void 0;
const zod_1 = require("zod");
// Party Type Enum
exports.PartyTypeSchema = zod_1.z.enum(['INDIVIDUAL', 'COMPANY', 'GOVERNMENT', 'NGO', 'OTHER']);
// Party Role Enum
exports.PartyRoleSchema = zod_1.z.enum(['PLAINTIFF', 'DEFENDANT', 'THIRD_PARTY', 'WITNESS', 'EXPERT', 'OTHER']);
// Base Party Schema
exports.PartySchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    name: zod_1.z.string().min(1).max(200),
    type: exports.PartyTypeSchema.default('INDIVIDUAL'),
    role: exports.PartyRoleSchema.default('PLAINTIFF'),
    caseId: zod_1.z.string().cuid(),
    contactPerson: zod_1.z.string().max(100).optional(),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().max(500).optional(),
    city: zod_1.z.string().max(100).optional(),
    state: zod_1.z.string().max(100).optional(),
    country: zod_1.z.string().max(100).default('India'),
    pincode: zod_1.z.string().max(10).optional(),
    registrationNumber: zod_1.z.string().max(50).optional(), // For companies
    panNumber: zod_1.z.string().max(10).optional(),
    gstNumber: zod_1.z.string().max(15).optional(),
    isActive: zod_1.z.boolean().default(true),
    notes: zod_1.z.string().max(1000).optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
// Create Party Schema
exports.CreatePartySchema = exports.PartySchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
// Update Party Schema
exports.UpdatePartySchema = exports.CreatePartySchema.partial();
// Party Search Schema
exports.PartySearchSchema = zod_1.z.object({
    query: zod_1.z.string().optional(),
    type: exports.PartyTypeSchema.optional(),
    role: exports.PartyRoleSchema.optional(),
    caseId: zod_1.z.string().cuid().optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().optional(),
    limit: zod_1.z.number().int().positive().max(100).default(20),
    offset: zod_1.z.number().int().min(0).default(0),
});
// Party List Schema
exports.PartyListSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    name: zod_1.z.string(),
    type: exports.PartyTypeSchema,
    role: exports.PartyRoleSchema,
    caseId: zod_1.z.string().cuid(),
    contactPerson: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean(),
    createdAt: zod_1.z.date(),
});
// Party with Case Schema
exports.PartyWithCaseSchema = exports.PartySchema.extend({
    case: zod_1.z.object({
        id: zod_1.z.string().cuid(),
        caseNumber: zod_1.z.string(),
        title: zod_1.z.string(),
        status: zod_1.z.string(),
    }),
});
// Individual Party Schema (for individuals)
exports.IndividualPartySchema = exports.PartySchema.extend({
    type: zod_1.z.literal('INDIVIDUAL'),
    firstName: zod_1.z.string().min(1).max(100),
    lastName: zod_1.z.string().min(1).max(100),
    middleName: zod_1.z.string().max(100).optional(),
    dateOfBirth: zod_1.z.date().optional(),
    gender: zod_1.z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
    occupation: zod_1.z.string().max(100).optional(),
});
// Company Party Schema (for companies)
exports.CompanyPartySchema = exports.PartySchema.extend({
    type: zod_1.z.literal('COMPANY'),
    companyName: zod_1.z.string().min(1).max(200),
    incorporationDate: zod_1.z.date().optional(),
    businessType: zod_1.z.string().max(100).optional(),
    authorizedSignatory: zod_1.z.string().max(100).optional(),
});
