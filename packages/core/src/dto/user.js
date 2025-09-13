"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPasswordChangeSchema = exports.UserProfileUpdateSchema = exports.UserLoginSchema = exports.UserListSchema = exports.UserResponseSchema = exports.UpdateUserSchema = exports.CreateUserSchema = exports.UserSchema = exports.UserStatusSchema = exports.UserRoleSchema = void 0;
const zod_1 = require("zod");
// User Role Enum
exports.UserRoleSchema = zod_1.z.enum(['ADMIN', 'LAWYER', 'PARALEGAL', 'CLIENT', 'SUPPORT']);
// User Status Enum
exports.UserStatusSchema = zod_1.z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING']);
// Base User Schema
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    email: zod_1.z.string().email(),
    firstName: zod_1.z.string().min(1).max(100),
    lastName: zod_1.z.string().min(1).max(100),
    role: exports.UserRoleSchema.default('LAWYER'),
    status: exports.UserStatusSchema.default('ACTIVE'),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    dateOfBirth: zod_1.z.date().optional(),
    joiningDate: zod_1.z.date().optional(),
    profilePicture: zod_1.z.string().url().optional(),
    bio: zod_1.z.string().max(500).optional(),
    isActive: zod_1.z.boolean().default(true),
    lastLoginAt: zod_1.z.date().optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
// Create User Schema
exports.CreateUserSchema = exports.UserSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    lastLoginAt: true,
});
// Update User Schema
exports.UpdateUserSchema = exports.CreateUserSchema.partial();
// User Response Schema (for API responses)
exports.UserResponseSchema = exports.UserSchema;
// User List Schema (for listing users)
exports.UserListSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    email: zod_1.z.string().email(),
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    role: exports.UserRoleSchema,
    status: exports.UserStatusSchema,
    isActive: zod_1.z.boolean(),
    lastLoginAt: zod_1.z.date().optional(),
    createdAt: zod_1.z.date(),
});
// User Login Schema
exports.UserLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
// User Profile Update Schema
exports.UserProfileUpdateSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).max(100).optional(),
    lastName: zod_1.z.string().min(1).max(100).optional(),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    bio: zod_1.z.string().max(500).optional(),
    profilePicture: zod_1.z.string().url().optional(),
});
// User Password Change Schema
exports.UserPasswordChangeSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(8),
    newPassword: zod_1.z.string().min(8),
    confirmPassword: zod_1.z.string().min(8),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
