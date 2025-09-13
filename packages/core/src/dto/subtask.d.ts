import { z } from 'zod';
export declare const SubtaskStatusSchema: z.ZodEnum<["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]>;
export type SubtaskStatus = z.infer<typeof SubtaskStatusSchema>;
export declare const SubtaskPrioritySchema: z.ZodEnum<["LOW", "MEDIUM", "HIGH", "URGENT"]>;
export type SubtaskPriority = z.infer<typeof SubtaskPrioritySchema>;
export declare const SubtaskSchema: z.ZodObject<{
    id: z.ZodString;
    taskId: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]>>;
    priority: z.ZodDefault<z.ZodEnum<["LOW", "MEDIUM", "HIGH", "URGENT"]>>;
    assignedTo: z.ZodOptional<z.ZodString>;
    createdBy: z.ZodString;
    dueDate: z.ZodOptional<z.ZodDate>;
    completedAt: z.ZodOptional<z.ZodDate>;
    estimatedHours: z.ZodOptional<z.ZodNumber>;
    actualHours: z.ZodOptional<z.ZodNumber>;
    order: z.ZodDefault<z.ZodNumber>;
    dependencies: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    progress: z.ZodDefault<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
    attachments: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    isConfidential: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    order: number;
    id: string;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    createdAt: Date;
    updatedAt: Date;
    title: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    isConfidential: boolean;
    createdBy: string;
    attachments: string[];
    dependencies: string[];
    progress: number;
    taskId: string;
    description?: string | undefined;
    notes?: string | undefined;
    assignedTo?: string | undefined;
    dueDate?: Date | undefined;
    completedAt?: Date | undefined;
    estimatedHours?: number | undefined;
    actualHours?: number | undefined;
}, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    createdBy: string;
    taskId: string;
    order?: number | undefined;
    status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | undefined;
    description?: string | undefined;
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | undefined;
    isConfidential?: boolean | undefined;
    notes?: string | undefined;
    attachments?: string[] | undefined;
    assignedTo?: string | undefined;
    dueDate?: Date | undefined;
    completedAt?: Date | undefined;
    estimatedHours?: number | undefined;
    actualHours?: number | undefined;
    dependencies?: string[] | undefined;
    progress?: number | undefined;
}>;
export declare const CreateSubtaskSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    taskId: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]>>;
    priority: z.ZodDefault<z.ZodEnum<["LOW", "MEDIUM", "HIGH", "URGENT"]>>;
    assignedTo: z.ZodOptional<z.ZodString>;
    createdBy: z.ZodString;
    dueDate: z.ZodOptional<z.ZodDate>;
    completedAt: z.ZodOptional<z.ZodDate>;
    estimatedHours: z.ZodOptional<z.ZodNumber>;
    actualHours: z.ZodOptional<z.ZodNumber>;
    order: z.ZodDefault<z.ZodNumber>;
    dependencies: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    progress: z.ZodDefault<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
    attachments: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    isConfidential: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "id" | "createdAt" | "updatedAt" | "completedAt">, "strip", z.ZodTypeAny, {
    order: number;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    title: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    isConfidential: boolean;
    createdBy: string;
    attachments: string[];
    dependencies: string[];
    progress: number;
    taskId: string;
    description?: string | undefined;
    notes?: string | undefined;
    assignedTo?: string | undefined;
    dueDate?: Date | undefined;
    estimatedHours?: number | undefined;
    actualHours?: number | undefined;
}, {
    title: string;
    createdBy: string;
    taskId: string;
    order?: number | undefined;
    status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | undefined;
    description?: string | undefined;
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | undefined;
    isConfidential?: boolean | undefined;
    notes?: string | undefined;
    attachments?: string[] | undefined;
    assignedTo?: string | undefined;
    dueDate?: Date | undefined;
    estimatedHours?: number | undefined;
    actualHours?: number | undefined;
    dependencies?: string[] | undefined;
    progress?: number | undefined;
}>;
export declare const UpdateSubtaskSchema: z.ZodObject<{
    order: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]>>>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    priority: z.ZodOptional<z.ZodDefault<z.ZodEnum<["LOW", "MEDIUM", "HIGH", "URGENT"]>>>;
    isConfidential: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    createdBy: z.ZodOptional<z.ZodString>;
    attachments: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    assignedTo: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    dueDate: z.ZodOptional<z.ZodOptional<z.ZodDate>>;
    estimatedHours: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    actualHours: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    dependencies: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    progress: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    taskId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    order?: number | undefined;
    status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | undefined;
    title?: string | undefined;
    description?: string | undefined;
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | undefined;
    isConfidential?: boolean | undefined;
    notes?: string | undefined;
    createdBy?: string | undefined;
    attachments?: string[] | undefined;
    assignedTo?: string | undefined;
    dueDate?: Date | undefined;
    estimatedHours?: number | undefined;
    actualHours?: number | undefined;
    dependencies?: string[] | undefined;
    progress?: number | undefined;
    taskId?: string | undefined;
}, {
    order?: number | undefined;
    status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | undefined;
    title?: string | undefined;
    description?: string | undefined;
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | undefined;
    isConfidential?: boolean | undefined;
    notes?: string | undefined;
    createdBy?: string | undefined;
    attachments?: string[] | undefined;
    assignedTo?: string | undefined;
    dueDate?: Date | undefined;
    estimatedHours?: number | undefined;
    actualHours?: number | undefined;
    dependencies?: string[] | undefined;
    progress?: number | undefined;
    taskId?: string | undefined;
}>;
export declare const SubtaskSearchSchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    taskId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]>>;
    priority: z.ZodOptional<z.ZodEnum<["LOW", "MEDIUM", "HIGH", "URGENT"]>>;
    assignedTo: z.ZodOptional<z.ZodString>;
    createdBy: z.ZodOptional<z.ZodString>;
    dueDateFrom: z.ZodOptional<z.ZodDate>;
    dueDateTo: z.ZodOptional<z.ZodDate>;
    isConfidential: z.ZodOptional<z.ZodBoolean>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    offset: number;
    query?: string | undefined;
    status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | undefined;
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | undefined;
    isConfidential?: boolean | undefined;
    createdBy?: string | undefined;
    assignedTo?: string | undefined;
    dueDateFrom?: Date | undefined;
    dueDateTo?: Date | undefined;
    taskId?: string | undefined;
}, {
    query?: string | undefined;
    status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | undefined;
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | undefined;
    isConfidential?: boolean | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
    createdBy?: string | undefined;
    assignedTo?: string | undefined;
    dueDateFrom?: Date | undefined;
    dueDateTo?: Date | undefined;
    taskId?: string | undefined;
}>;
export declare const SubtaskListSchema: z.ZodObject<{
    id: z.ZodString;
    taskId: z.ZodString;
    title: z.ZodString;
    status: z.ZodEnum<["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]>;
    priority: z.ZodEnum<["LOW", "MEDIUM", "HIGH", "URGENT"]>;
    assignedTo: z.ZodOptional<z.ZodString>;
    createdBy: z.ZodString;
    dueDate: z.ZodOptional<z.ZodDate>;
    completedAt: z.ZodOptional<z.ZodDate>;
    progress: z.ZodNumber;
    order: z.ZodNumber;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    order: number;
    id: string;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    createdAt: Date;
    title: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    createdBy: string;
    progress: number;
    taskId: string;
    assignedTo?: string | undefined;
    dueDate?: Date | undefined;
    completedAt?: Date | undefined;
}, {
    order: number;
    id: string;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    createdAt: Date;
    title: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    createdBy: string;
    progress: number;
    taskId: string;
    assignedTo?: string | undefined;
    dueDate?: Date | undefined;
    completedAt?: Date | undefined;
}>;
export declare const SubtaskWithAssigneeSchema: z.ZodObject<{
    id: z.ZodString;
    taskId: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]>>;
    priority: z.ZodDefault<z.ZodEnum<["LOW", "MEDIUM", "HIGH", "URGENT"]>>;
    assignedTo: z.ZodOptional<z.ZodString>;
    createdBy: z.ZodString;
    dueDate: z.ZodOptional<z.ZodDate>;
    completedAt: z.ZodOptional<z.ZodDate>;
    estimatedHours: z.ZodOptional<z.ZodNumber>;
    actualHours: z.ZodOptional<z.ZodNumber>;
    order: z.ZodDefault<z.ZodNumber>;
    dependencies: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    progress: z.ZodDefault<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
    attachments: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    isConfidential: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
} & {
    assignee: z.ZodOptional<z.ZodObject<{
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
    creator: z.ZodObject<{
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
    }>;
}, "strip", z.ZodTypeAny, {
    order: number;
    id: string;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    createdAt: Date;
    updatedAt: Date;
    title: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    isConfidential: boolean;
    createdBy: string;
    attachments: string[];
    creator: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
    dependencies: string[];
    progress: number;
    taskId: string;
    description?: string | undefined;
    notes?: string | undefined;
    assignedTo?: string | undefined;
    dueDate?: Date | undefined;
    completedAt?: Date | undefined;
    estimatedHours?: number | undefined;
    actualHours?: number | undefined;
    assignee?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    } | undefined;
}, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    createdBy: string;
    creator: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
    taskId: string;
    order?: number | undefined;
    status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | undefined;
    description?: string | undefined;
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | undefined;
    isConfidential?: boolean | undefined;
    notes?: string | undefined;
    attachments?: string[] | undefined;
    assignedTo?: string | undefined;
    dueDate?: Date | undefined;
    completedAt?: Date | undefined;
    estimatedHours?: number | undefined;
    actualHours?: number | undefined;
    dependencies?: string[] | undefined;
    progress?: number | undefined;
    assignee?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    } | undefined;
}>;
export declare const SubtaskWithTaskSchema: z.ZodObject<{
    id: z.ZodString;
    taskId: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]>>;
    priority: z.ZodDefault<z.ZodEnum<["LOW", "MEDIUM", "HIGH", "URGENT"]>>;
    assignedTo: z.ZodOptional<z.ZodString>;
    createdBy: z.ZodString;
    dueDate: z.ZodOptional<z.ZodDate>;
    completedAt: z.ZodOptional<z.ZodDate>;
    estimatedHours: z.ZodOptional<z.ZodNumber>;
    actualHours: z.ZodOptional<z.ZodNumber>;
    order: z.ZodDefault<z.ZodNumber>;
    dependencies: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    progress: z.ZodDefault<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
    attachments: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    isConfidential: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
} & {
    task: z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        status: z.ZodString;
        category: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        status: string;
        title: string;
        category: string;
    }, {
        id: string;
        status: string;
        title: string;
        category: string;
    }>;
}, "strip", z.ZodTypeAny, {
    order: number;
    task: {
        id: string;
        status: string;
        title: string;
        category: string;
    };
    id: string;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    createdAt: Date;
    updatedAt: Date;
    title: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    isConfidential: boolean;
    createdBy: string;
    attachments: string[];
    dependencies: string[];
    progress: number;
    taskId: string;
    description?: string | undefined;
    notes?: string | undefined;
    assignedTo?: string | undefined;
    dueDate?: Date | undefined;
    completedAt?: Date | undefined;
    estimatedHours?: number | undefined;
    actualHours?: number | undefined;
}, {
    task: {
        id: string;
        status: string;
        title: string;
        category: string;
    };
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    createdBy: string;
    taskId: string;
    order?: number | undefined;
    status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | undefined;
    description?: string | undefined;
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | undefined;
    isConfidential?: boolean | undefined;
    notes?: string | undefined;
    attachments?: string[] | undefined;
    assignedTo?: string | undefined;
    dueDate?: Date | undefined;
    completedAt?: Date | undefined;
    estimatedHours?: number | undefined;
    actualHours?: number | undefined;
    dependencies?: string[] | undefined;
    progress?: number | undefined;
}>;
export declare const SubtaskAssignmentSchema: z.ZodObject<{
    subtaskId: z.ZodString;
    assignedTo: z.ZodString;
    dueDate: z.ZodOptional<z.ZodDate>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    assignedTo: string;
    subtaskId: string;
    notes?: string | undefined;
    dueDate?: Date | undefined;
}, {
    assignedTo: string;
    subtaskId: string;
    notes?: string | undefined;
    dueDate?: Date | undefined;
}>;
export declare const SubtaskStatusUpdateSchema: z.ZodObject<{
    subtaskId: z.ZodString;
    status: z.ZodEnum<["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]>;
    progress: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
    actualHours: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    subtaskId: string;
    notes?: string | undefined;
    actualHours?: number | undefined;
    progress?: number | undefined;
}, {
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    subtaskId: string;
    notes?: string | undefined;
    actualHours?: number | undefined;
    progress?: number | undefined;
}>;
export declare const SubtaskCompletionSchema: z.ZodObject<{
    subtaskId: z.ZodString;
    completedAt: z.ZodDefault<z.ZodDate>;
    actualHours: z.ZodOptional<z.ZodNumber>;
    completionNotes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    completedAt: Date;
    subtaskId: string;
    actualHours?: number | undefined;
    completionNotes?: string | undefined;
}, {
    subtaskId: string;
    completedAt?: Date | undefined;
    actualHours?: number | undefined;
    completionNotes?: string | undefined;
}>;
export declare const SubtaskReorderSchema: z.ZodObject<{
    subtaskId: z.ZodString;
    newOrder: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    subtaskId: string;
    newOrder: number;
}, {
    subtaskId: string;
    newOrder: number;
}>;
export declare const SubtaskStatisticsSchema: z.ZodObject<{
    total: z.ZodNumber;
    pending: z.ZodNumber;
    inProgress: z.ZodNumber;
    completed: z.ZodNumber;
    cancelled: z.ZodNumber;
    overdue: z.ZodNumber;
    byPriority: z.ZodObject<{
        low: z.ZodNumber;
        medium: z.ZodNumber;
        high: z.ZodNumber;
        urgent: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        low: number;
        medium: number;
        high: number;
        urgent: number;
    }, {
        low: number;
        medium: number;
        high: number;
        urgent: number;
    }>;
    averageCompletionTime: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    total: number;
    inProgress: number;
    byPriority: {
        low: number;
        medium: number;
        high: number;
        urgent: number;
    };
    completed: number;
    cancelled: number;
    overdue: number;
    pending: number;
    averageCompletionTime?: number | undefined;
}, {
    total: number;
    inProgress: number;
    byPriority: {
        low: number;
        medium: number;
        high: number;
        urgent: number;
    };
    completed: number;
    cancelled: number;
    overdue: number;
    pending: number;
    averageCompletionTime?: number | undefined;
}>;
export type Subtask = z.infer<typeof SubtaskSchema>;
export type CreateSubtask = z.infer<typeof CreateSubtaskSchema>;
export type UpdateSubtask = z.infer<typeof UpdateSubtaskSchema>;
export type SubtaskSearch = z.infer<typeof SubtaskSearchSchema>;
export type SubtaskList = z.infer<typeof SubtaskListSchema>;
export type SubtaskWithAssignee = z.infer<typeof SubtaskWithAssigneeSchema>;
export type SubtaskWithTask = z.infer<typeof SubtaskWithTaskSchema>;
export type SubtaskAssignment = z.infer<typeof SubtaskAssignmentSchema>;
export type SubtaskStatusUpdate = z.infer<typeof SubtaskStatusUpdateSchema>;
export type SubtaskCompletion = z.infer<typeof SubtaskCompletionSchema>;
export type SubtaskReorder = z.infer<typeof SubtaskReorderSchema>;
export type SubtaskStatistics = z.infer<typeof SubtaskStatisticsSchema>;
//# sourceMappingURL=subtask.d.ts.map