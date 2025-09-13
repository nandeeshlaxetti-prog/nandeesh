"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemas = exports.CreateDocumentSchema = exports.DocumentSchema = exports.UpdateCaseSchema = exports.CreateCaseSchema = exports.CaseSchema = exports.UpdateUserSchema = exports.CreateUserSchema = exports.UserSchema = void 0;
const zod_1 = require("zod");
// User related schemas
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    email: zod_1.z.string().email(),
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
    role: zod_1.z.enum(['admin', 'lawyer', 'paralegal', 'client']),
    isActive: zod_1.z.boolean().default(true),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.CreateUserSchema = exports.UserSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.UpdateUserSchema = exports.CreateUserSchema.partial();
// Case related schemas
exports.CaseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    caseNumber: zod_1.z.string().min(1),
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    status: zod_1.z.enum(['open', 'in_progress', 'closed', 'archived']),
    priority: zod_1.z.enum(['low', 'medium', 'high', 'urgent']),
    clientId: zod_1.z.string().uuid(),
    assignedLawyerId: zod_1.z.string().uuid().optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.CreateCaseSchema = exports.CaseSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.UpdateCaseSchema = exports.CreateCaseSchema.partial();
// Document related schemas
exports.DocumentSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    filename: zod_1.z.string().min(1),
    originalName: zod_1.z.string().min(1),
    mimeType: zod_1.z.string(),
    size: zod_1.z.number().positive(),
    caseId: zod_1.z.string().uuid(),
    uploadedBy: zod_1.z.string().uuid(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.CreateDocumentSchema = exports.DocumentSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
// Export all schemas for validation
exports.schemas = {
    User: exports.UserSchema,
    CreateUser: exports.CreateUserSchema,
    UpdateUser: exports.UpdateUserSchema,
    Case: exports.CaseSchema,
    CreateCase: exports.CreateCaseSchema,
    UpdateCase: exports.UpdateCaseSchema,
    Document: exports.DocumentSchema,
    CreateDocument: exports.CreateDocumentSchema,
};
