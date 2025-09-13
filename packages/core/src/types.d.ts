import { z } from 'zod';
export interface BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const UserSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    role: z.ZodEnum<["admin", "lawyer", "paralegal", "client"]>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "client" | "admin" | "lawyer" | "paralegal";
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}, {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "client" | "admin" | "lawyer" | "paralegal";
    createdAt: Date;
    updatedAt: Date;
    isActive?: boolean | undefined;
}>;
export type User = z.infer<typeof UserSchema>;
export declare const CreateUserSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    email: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    role: z.ZodEnum<["admin", "lawyer", "paralegal", "client"]>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "id" | "createdAt" | "updatedAt">, "strip", z.ZodTypeAny, {
    email: string;
    firstName: string;
    lastName: string;
    role: "client" | "admin" | "lawyer" | "paralegal";
    isActive: boolean;
}, {
    email: string;
    firstName: string;
    lastName: string;
    role: "client" | "admin" | "lawyer" | "paralegal";
    isActive?: boolean | undefined;
}>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export declare const UpdateUserSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<["admin", "lawyer", "paralegal", "client"]>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    role?: "client" | "admin" | "lawyer" | "paralegal" | undefined;
    isActive?: boolean | undefined;
}, {
    email?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    role?: "client" | "admin" | "lawyer" | "paralegal" | undefined;
    isActive?: boolean | undefined;
}>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export declare const CaseSchema: z.ZodObject<{
    id: z.ZodString;
    caseNumber: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["open", "in_progress", "closed", "archived"]>;
    priority: z.ZodEnum<["low", "medium", "high", "urgent"]>;
    clientId: z.ZodString;
    assignedLawyerId: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    status: "open" | "in_progress" | "closed" | "archived";
    createdAt: Date;
    updatedAt: Date;
    caseNumber: string;
    title: string;
    priority: "low" | "medium" | "high" | "urgent";
    clientId: string;
    description?: string | undefined;
    assignedLawyerId?: string | undefined;
}, {
    id: string;
    status: "open" | "in_progress" | "closed" | "archived";
    createdAt: Date;
    updatedAt: Date;
    caseNumber: string;
    title: string;
    priority: "low" | "medium" | "high" | "urgent";
    clientId: string;
    description?: string | undefined;
    assignedLawyerId?: string | undefined;
}>;
export type Case = z.infer<typeof CaseSchema>;
export declare const CreateCaseSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    caseNumber: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["open", "in_progress", "closed", "archived"]>;
    priority: z.ZodEnum<["low", "medium", "high", "urgent"]>;
    clientId: z.ZodString;
    assignedLawyerId: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "id" | "createdAt" | "updatedAt">, "strip", z.ZodTypeAny, {
    status: "open" | "in_progress" | "closed" | "archived";
    caseNumber: string;
    title: string;
    priority: "low" | "medium" | "high" | "urgent";
    clientId: string;
    description?: string | undefined;
    assignedLawyerId?: string | undefined;
}, {
    status: "open" | "in_progress" | "closed" | "archived";
    caseNumber: string;
    title: string;
    priority: "low" | "medium" | "high" | "urgent";
    clientId: string;
    description?: string | undefined;
    assignedLawyerId?: string | undefined;
}>;
export type CreateCase = z.infer<typeof CreateCaseSchema>;
export declare const UpdateCaseSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["open", "in_progress", "closed", "archived"]>>;
    caseNumber: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    priority: z.ZodOptional<z.ZodEnum<["low", "medium", "high", "urgent"]>>;
    clientId: z.ZodOptional<z.ZodString>;
    assignedLawyerId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    status?: "open" | "in_progress" | "closed" | "archived" | undefined;
    caseNumber?: string | undefined;
    title?: string | undefined;
    description?: string | undefined;
    priority?: "low" | "medium" | "high" | "urgent" | undefined;
    clientId?: string | undefined;
    assignedLawyerId?: string | undefined;
}, {
    status?: "open" | "in_progress" | "closed" | "archived" | undefined;
    caseNumber?: string | undefined;
    title?: string | undefined;
    description?: string | undefined;
    priority?: "low" | "medium" | "high" | "urgent" | undefined;
    clientId?: string | undefined;
    assignedLawyerId?: string | undefined;
}>;
export type UpdateCase = z.infer<typeof UpdateCaseSchema>;
export declare const DocumentSchema: z.ZodObject<{
    id: z.ZodString;
    filename: z.ZodString;
    originalName: z.ZodString;
    mimeType: z.ZodString;
    size: z.ZodNumber;
    caseId: z.ZodString;
    uploadedBy: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    caseId: string;
    uploadedBy: string;
}, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    caseId: string;
    uploadedBy: string;
}>;
export type Document = z.infer<typeof DocumentSchema>;
export declare const CreateDocumentSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    filename: z.ZodString;
    originalName: z.ZodString;
    mimeType: z.ZodString;
    size: z.ZodNumber;
    caseId: z.ZodString;
    uploadedBy: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "id" | "createdAt" | "updatedAt">, "strip", z.ZodTypeAny, {
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    caseId: string;
    uploadedBy: string;
}, {
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    caseId: string;
    uploadedBy: string;
}>;
export type CreateDocument = z.infer<typeof CreateDocumentSchema>;
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export declare const schemas: {
    readonly User: z.ZodObject<{
        id: z.ZodString;
        email: z.ZodString;
        firstName: z.ZodString;
        lastName: z.ZodString;
        role: z.ZodEnum<["admin", "lawyer", "paralegal", "client"]>;
        isActive: z.ZodDefault<z.ZodBoolean>;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: "client" | "admin" | "lawyer" | "paralegal";
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: "client" | "admin" | "lawyer" | "paralegal";
        createdAt: Date;
        updatedAt: Date;
        isActive?: boolean | undefined;
    }>;
    readonly CreateUser: z.ZodObject<Omit<{
        id: z.ZodString;
        email: z.ZodString;
        firstName: z.ZodString;
        lastName: z.ZodString;
        role: z.ZodEnum<["admin", "lawyer", "paralegal", "client"]>;
        isActive: z.ZodDefault<z.ZodBoolean>;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
    }, "id" | "createdAt" | "updatedAt">, "strip", z.ZodTypeAny, {
        email: string;
        firstName: string;
        lastName: string;
        role: "client" | "admin" | "lawyer" | "paralegal";
        isActive: boolean;
    }, {
        email: string;
        firstName: string;
        lastName: string;
        role: "client" | "admin" | "lawyer" | "paralegal";
        isActive?: boolean | undefined;
    }>;
    readonly UpdateUser: z.ZodObject<{
        email: z.ZodOptional<z.ZodString>;
        firstName: z.ZodOptional<z.ZodString>;
        lastName: z.ZodOptional<z.ZodString>;
        role: z.ZodOptional<z.ZodEnum<["admin", "lawyer", "paralegal", "client"]>>;
        isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        email?: string | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        role?: "client" | "admin" | "lawyer" | "paralegal" | undefined;
        isActive?: boolean | undefined;
    }, {
        email?: string | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        role?: "client" | "admin" | "lawyer" | "paralegal" | undefined;
        isActive?: boolean | undefined;
    }>;
    readonly Case: z.ZodObject<{
        id: z.ZodString;
        caseNumber: z.ZodString;
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        status: z.ZodEnum<["open", "in_progress", "closed", "archived"]>;
        priority: z.ZodEnum<["low", "medium", "high", "urgent"]>;
        clientId: z.ZodString;
        assignedLawyerId: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        id: string;
        status: "open" | "in_progress" | "closed" | "archived";
        createdAt: Date;
        updatedAt: Date;
        caseNumber: string;
        title: string;
        priority: "low" | "medium" | "high" | "urgent";
        clientId: string;
        description?: string | undefined;
        assignedLawyerId?: string | undefined;
    }, {
        id: string;
        status: "open" | "in_progress" | "closed" | "archived";
        createdAt: Date;
        updatedAt: Date;
        caseNumber: string;
        title: string;
        priority: "low" | "medium" | "high" | "urgent";
        clientId: string;
        description?: string | undefined;
        assignedLawyerId?: string | undefined;
    }>;
    readonly CreateCase: z.ZodObject<Omit<{
        id: z.ZodString;
        caseNumber: z.ZodString;
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        status: z.ZodEnum<["open", "in_progress", "closed", "archived"]>;
        priority: z.ZodEnum<["low", "medium", "high", "urgent"]>;
        clientId: z.ZodString;
        assignedLawyerId: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
    }, "id" | "createdAt" | "updatedAt">, "strip", z.ZodTypeAny, {
        status: "open" | "in_progress" | "closed" | "archived";
        caseNumber: string;
        title: string;
        priority: "low" | "medium" | "high" | "urgent";
        clientId: string;
        description?: string | undefined;
        assignedLawyerId?: string | undefined;
    }, {
        status: "open" | "in_progress" | "closed" | "archived";
        caseNumber: string;
        title: string;
        priority: "low" | "medium" | "high" | "urgent";
        clientId: string;
        description?: string | undefined;
        assignedLawyerId?: string | undefined;
    }>;
    readonly UpdateCase: z.ZodObject<{
        status: z.ZodOptional<z.ZodEnum<["open", "in_progress", "closed", "archived"]>>;
        caseNumber: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        priority: z.ZodOptional<z.ZodEnum<["low", "medium", "high", "urgent"]>>;
        clientId: z.ZodOptional<z.ZodString>;
        assignedLawyerId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        status?: "open" | "in_progress" | "closed" | "archived" | undefined;
        caseNumber?: string | undefined;
        title?: string | undefined;
        description?: string | undefined;
        priority?: "low" | "medium" | "high" | "urgent" | undefined;
        clientId?: string | undefined;
        assignedLawyerId?: string | undefined;
    }, {
        status?: "open" | "in_progress" | "closed" | "archived" | undefined;
        caseNumber?: string | undefined;
        title?: string | undefined;
        description?: string | undefined;
        priority?: "low" | "medium" | "high" | "urgent" | undefined;
        clientId?: string | undefined;
        assignedLawyerId?: string | undefined;
    }>;
    readonly Document: z.ZodObject<{
        id: z.ZodString;
        filename: z.ZodString;
        originalName: z.ZodString;
        mimeType: z.ZodString;
        size: z.ZodNumber;
        caseId: z.ZodString;
        uploadedBy: z.ZodString;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        caseId: string;
        uploadedBy: string;
    }, {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        caseId: string;
        uploadedBy: string;
    }>;
    readonly CreateDocument: z.ZodObject<Omit<{
        id: z.ZodString;
        filename: z.ZodString;
        originalName: z.ZodString;
        mimeType: z.ZodString;
        size: z.ZodNumber;
        caseId: z.ZodString;
        uploadedBy: z.ZodString;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
    }, "id" | "createdAt" | "updatedAt">, "strip", z.ZodTypeAny, {
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        caseId: string;
        uploadedBy: string;
    }, {
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        caseId: string;
        uploadedBy: string;
    }>;
};
//# sourceMappingURL=types.d.ts.map