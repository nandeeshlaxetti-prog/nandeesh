import { z } from 'zod'

// User Role Enum
export const UserRoleSchema = z.enum(['ADMIN', 'LAWYER', 'PARALEGAL', 'CLIENT', 'SUPPORT'])
export type UserRole = z.infer<typeof UserRoleSchema>

// User Status Enum
export const UserStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING'])
export type UserStatus = z.infer<typeof UserStatusSchema>

// Base User Schema
export const UserSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  role: UserRoleSchema.default('LAWYER'),
  status: UserStatusSchema.default('ACTIVE'),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.date().optional(),
  joiningDate: z.date().optional(),
  profilePicture: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  isActive: z.boolean().default(true),
  lastLoginAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Create User Schema
export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
})

// Update User Schema
export const UpdateUserSchema = CreateUserSchema.partial()

// User Response Schema (for API responses)
export const UserResponseSchema = UserSchema

// User List Schema (for listing users)
export const UserListSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: UserRoleSchema,
  status: UserStatusSchema,
  isActive: z.boolean(),
  lastLoginAt: z.date().optional(),
  createdAt: z.date(),
})

// User Login Schema
export const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

// User Profile Update Schema
export const UserProfileUpdateSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().max(500).optional(),
  profilePicture: z.string().url().optional(),
})

// User Password Change Schema
export const UserPasswordChangeSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Export Types
export type User = z.infer<typeof UserSchema>
export type CreateUser = z.infer<typeof CreateUserSchema>
export type UpdateUser = z.infer<typeof UpdateUserSchema>
export type UserResponse = z.infer<typeof UserResponseSchema>
export type UserList = z.infer<typeof UserListSchema>
export type UserLogin = z.infer<typeof UserLoginSchema>
export type UserProfileUpdate = z.infer<typeof UserProfileUpdateSchema>
export type UserPasswordChange = z.infer<typeof UserPasswordChangeSchema>
