import { z } from 'zod';
export declare const TeamStatusSchema: z.ZodEnum<["ACTIVE", "INACTIVE", "ARCHIVED"]>;
export type TeamStatus = z.infer<typeof TeamStatusSchema>;
export declare const TeamMemberRoleSchema: z.ZodEnum<["LEAD", "MEMBER", "CONTRIBUTOR"]>;
export type TeamMemberRole = z.infer<typeof TeamMemberRoleSchema>;
export declare const TeamSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["ACTIVE", "INACTIVE", "ARCHIVED"]>>;
    leadId: z.ZodOptional<z.ZodString>;
    department: z.ZodOptional<z.ZodString>;
    color: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
    createdAt: Date;
    updatedAt: Date;
    name: string;
    description?: string | undefined;
    leadId?: string | undefined;
    department?: string | undefined;
    color?: string | undefined;
}, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    status?: "ACTIVE" | "INACTIVE" | "ARCHIVED" | undefined;
    description?: string | undefined;
    leadId?: string | undefined;
    department?: string | undefined;
    color?: string | undefined;
}>;
export declare const TeamMemberSchema: z.ZodObject<{
    id: z.ZodString;
    teamId: z.ZodString;
    userId: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<["LEAD", "MEMBER", "CONTRIBUTOR"]>>;
    joinedAt: z.ZodDate;
    leftAt: z.ZodOptional<z.ZodDate>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    role: "LEAD" | "MEMBER" | "CONTRIBUTOR";
    isActive: boolean;
    teamId: string;
    userId: string;
    joinedAt: Date;
    leftAt?: Date | undefined;
}, {
    id: string;
    teamId: string;
    userId: string;
    joinedAt: Date;
    role?: "LEAD" | "MEMBER" | "CONTRIBUTOR" | undefined;
    isActive?: boolean | undefined;
    leftAt?: Date | undefined;
}>;
export declare const CreateTeamSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["ACTIVE", "INACTIVE", "ARCHIVED"]>>;
    leadId: z.ZodOptional<z.ZodString>;
    department: z.ZodOptional<z.ZodString>;
    color: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "id" | "createdAt" | "updatedAt">, "strip", z.ZodTypeAny, {
    status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
    name: string;
    description?: string | undefined;
    leadId?: string | undefined;
    department?: string | undefined;
    color?: string | undefined;
}, {
    name: string;
    status?: "ACTIVE" | "INACTIVE" | "ARCHIVED" | undefined;
    description?: string | undefined;
    leadId?: string | undefined;
    department?: string | undefined;
    color?: string | undefined;
}>;
export declare const UpdateTeamSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<["ACTIVE", "INACTIVE", "ARCHIVED"]>>>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    name: z.ZodOptional<z.ZodString>;
    leadId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    department: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    color: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    status?: "ACTIVE" | "INACTIVE" | "ARCHIVED" | undefined;
    description?: string | undefined;
    name?: string | undefined;
    leadId?: string | undefined;
    department?: string | undefined;
    color?: string | undefined;
}, {
    status?: "ACTIVE" | "INACTIVE" | "ARCHIVED" | undefined;
    description?: string | undefined;
    name?: string | undefined;
    leadId?: string | undefined;
    department?: string | undefined;
    color?: string | undefined;
}>;
export declare const AddTeamMemberSchema: z.ZodObject<{
    teamId: z.ZodString;
    userId: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<["LEAD", "MEMBER", "CONTRIBUTOR"]>>;
}, "strip", z.ZodTypeAny, {
    role: "LEAD" | "MEMBER" | "CONTRIBUTOR";
    teamId: string;
    userId: string;
}, {
    teamId: string;
    userId: string;
    role?: "LEAD" | "MEMBER" | "CONTRIBUTOR" | undefined;
}>;
export declare const RemoveTeamMemberSchema: z.ZodObject<{
    teamId: z.ZodString;
    userId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    teamId: string;
    userId: string;
}, {
    teamId: string;
    userId: string;
}>;
export declare const TeamWithMembersSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["ACTIVE", "INACTIVE", "ARCHIVED"]>>;
    leadId: z.ZodOptional<z.ZodString>;
    department: z.ZodOptional<z.ZodString>;
    color: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
} & {
    members: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        teamId: z.ZodString;
        userId: z.ZodString;
        role: z.ZodDefault<z.ZodEnum<["LEAD", "MEMBER", "CONTRIBUTOR"]>>;
        joinedAt: z.ZodDate;
        leftAt: z.ZodOptional<z.ZodDate>;
        isActive: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        role: "LEAD" | "MEMBER" | "CONTRIBUTOR";
        isActive: boolean;
        teamId: string;
        userId: string;
        joinedAt: Date;
        leftAt?: Date | undefined;
    }, {
        id: string;
        teamId: string;
        userId: string;
        joinedAt: Date;
        role?: "LEAD" | "MEMBER" | "CONTRIBUTOR" | undefined;
        isActive?: boolean | undefined;
        leftAt?: Date | undefined;
    }>, "many">;
    lead: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        firstName: z.ZodString;
        lastName: z.ZodString;
        email: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    }, {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
    createdAt: Date;
    updatedAt: Date;
    name: string;
    members: {
        id: string;
        role: "LEAD" | "MEMBER" | "CONTRIBUTOR";
        isActive: boolean;
        teamId: string;
        userId: string;
        joinedAt: Date;
        leftAt?: Date | undefined;
    }[];
    description?: string | undefined;
    leadId?: string | undefined;
    department?: string | undefined;
    color?: string | undefined;
    lead?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    } | undefined;
}, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    members: {
        id: string;
        teamId: string;
        userId: string;
        joinedAt: Date;
        role?: "LEAD" | "MEMBER" | "CONTRIBUTOR" | undefined;
        isActive?: boolean | undefined;
        leftAt?: Date | undefined;
    }[];
    status?: "ACTIVE" | "INACTIVE" | "ARCHIVED" | undefined;
    description?: string | undefined;
    leadId?: string | undefined;
    department?: string | undefined;
    color?: string | undefined;
    lead?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    } | undefined;
}>;
export declare const TeamListSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["ACTIVE", "INACTIVE", "ARCHIVED"]>;
    leadId: z.ZodOptional<z.ZodString>;
    department: z.ZodOptional<z.ZodString>;
    memberCount: z.ZodNumber;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
    createdAt: Date;
    name: string;
    memberCount: number;
    description?: string | undefined;
    leadId?: string | undefined;
    department?: string | undefined;
}, {
    id: string;
    status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
    createdAt: Date;
    name: string;
    memberCount: number;
    description?: string | undefined;
    leadId?: string | undefined;
    department?: string | undefined;
}>;
export type Team = z.infer<typeof TeamSchema>;
export type TeamMember = z.infer<typeof TeamMemberSchema>;
export type CreateTeam = z.infer<typeof CreateTeamSchema>;
export type UpdateTeam = z.infer<typeof UpdateTeamSchema>;
export type AddTeamMember = z.infer<typeof AddTeamMemberSchema>;
export type RemoveTeamMember = z.infer<typeof RemoveTeamMemberSchema>;
export type TeamWithMembers = z.infer<typeof TeamWithMembersSchema>;
export type TeamList = z.infer<typeof TeamListSchema>;
//# sourceMappingURL=team.d.ts.map