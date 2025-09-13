import { z } from 'zod';
export declare function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T;
export declare function safeValidateData<T>(schema: z.ZodSchema<T>, data: unknown): {
    success: true;
    data: T;
} | {
    success: false;
    error: string;
};
export declare function formatDate(date: Date, timezone?: string): string;
export declare function formatDateTime(date: Date, timezone?: string): string;
export declare function formatTime(date: Date, timezone?: string): string;
export declare function getCurrentDate(timezone?: string): Date;
export declare function getTimezoneOffset(timezone: string): number;
export declare function convertToTimezone(date: Date, timezone?: string): Date;
export declare function isToday(date: Date, timezone?: string): boolean;
export declare function isThisWeek(date: Date, timezone?: string): boolean;
export declare function isThisMonth(date: Date, timezone?: string): boolean;
export declare function getStartOfDay(date: Date, timezone?: string): Date;
export declare function getEndOfDay(date: Date, timezone?: string): Date;
export declare function getStartOfWeek(date: Date, timezone?: string): Date;
export declare function getEndOfWeek(date: Date, timezone?: string): Date;
export declare function getStartOfMonth(date: Date, timezone?: string): Date;
export declare function getEndOfMonth(date: Date, timezone?: string): Date;
export declare function addDays(date: Date, days: number, timezone?: string): Date;
export declare function addMonths(date: Date, months: number, timezone?: string): Date;
export declare function addYears(date: Date, years: number, timezone?: string): Date;
export declare function getDaysDifference(date1: Date, date2: Date, timezone?: string): number;
export declare function isWeekend(date: Date, timezone?: string): boolean;
export declare function isBusinessDay(date: Date, timezone?: string): boolean;
export declare function getNextBusinessDay(date: Date, timezone?: string): Date;
export declare function getPreviousBusinessDay(date: Date, timezone?: string): Date;
export declare const TIMEZONES: {
    readonly KOLKATA: "Asia/Kolkata";
    readonly UTC: "UTC";
    readonly NEW_YORK: "America/New_York";
    readonly LONDON: "Europe/London";
    readonly TOKYO: "Asia/Tokyo";
    readonly SYDNEY: "Australia/Sydney";
};
export declare const DEFAULT_TIMEZONE: "Asia/Kolkata";
export declare function capitalize(str: string): string;
export declare function truncate(str: string, length: number): string;
export declare function slugify(str: string): string;
export declare function groupBy<T, K extends string | number | symbol>(array: T[], key: (item: T) => K): Record<K, T[]>;
export declare function unique<T>(array: T[]): T[];
export declare function sortBy<T>(array: T[], key: (item: T) => string | number): T[];
export declare function omit<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
export declare function pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
export declare class AppError extends Error {
    code: string;
    statusCode: number;
    constructor(message: string, code: string, statusCode?: number);
}
export declare function createError(message: string, code: string, statusCode?: number): AppError;
export declare const ROLES: {
    readonly ADMIN: "admin";
    readonly LAWYER: "lawyer";
    readonly PARALEGAL: "paralegal";
    readonly CLIENT: "client";
};
export declare const CASE_STATUS: {
    readonly OPEN: "open";
    readonly IN_PROGRESS: "in_progress";
    readonly CLOSED: "closed";
    readonly ARCHIVED: "archived";
};
export declare const CASE_PRIORITY: {
    readonly LOW: "low";
    readonly MEDIUM: "medium";
    readonly HIGH: "high";
    readonly URGENT: "urgent";
};
//# sourceMappingURL=utils.d.ts.map