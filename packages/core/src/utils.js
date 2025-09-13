"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CASE_PRIORITY = exports.CASE_STATUS = exports.ROLES = exports.AppError = exports.DEFAULT_TIMEZONE = exports.TIMEZONES = void 0;
exports.validateData = validateData;
exports.safeValidateData = safeValidateData;
exports.formatDate = formatDate;
exports.formatDateTime = formatDateTime;
exports.formatTime = formatTime;
exports.getCurrentDate = getCurrentDate;
exports.getTimezoneOffset = getTimezoneOffset;
exports.convertToTimezone = convertToTimezone;
exports.isToday = isToday;
exports.isThisWeek = isThisWeek;
exports.isThisMonth = isThisMonth;
exports.getStartOfDay = getStartOfDay;
exports.getEndOfDay = getEndOfDay;
exports.getStartOfWeek = getStartOfWeek;
exports.getEndOfWeek = getEndOfWeek;
exports.getStartOfMonth = getStartOfMonth;
exports.getEndOfMonth = getEndOfMonth;
exports.addDays = addDays;
exports.addMonths = addMonths;
exports.addYears = addYears;
exports.getDaysDifference = getDaysDifference;
exports.isWeekend = isWeekend;
exports.isBusinessDay = isBusinessDay;
exports.getNextBusinessDay = getNextBusinessDay;
exports.getPreviousBusinessDay = getPreviousBusinessDay;
exports.capitalize = capitalize;
exports.truncate = truncate;
exports.slugify = slugify;
exports.groupBy = groupBy;
exports.unique = unique;
exports.sortBy = sortBy;
exports.omit = omit;
exports.pick = pick;
exports.createError = createError;
const zod_1 = require("zod");
// Validation utilities
function validateData(schema, data) {
    try {
        return schema.parse(data);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
        }
        throw error;
    }
}
function safeValidateData(schema, data) {
    try {
        const result = schema.parse(data);
        return { success: true, data: result };
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return { success: false, error: error.errors.map(e => e.message).join(', ') };
        }
        return { success: false, error: 'Unknown validation error' };
    }
}
// Date utilities
function formatDate(date, timezone = 'Asia/Kolkata') {
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: timezone,
    });
}
function formatDateTime(date, timezone = 'Asia/Kolkata') {
    return date.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: timezone,
    });
}
function formatTime(date, timezone = 'Asia/Kolkata') {
    return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: timezone,
    });
}
function getCurrentDate(timezone = 'Asia/Kolkata') {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const targetTime = new Date(utc + (getTimezoneOffset(timezone) * 60000));
    return targetTime;
}
function getTimezoneOffset(timezone) {
    const now = new Date();
    const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
    const target = new Date(utc.toLocaleString('en-US', { timeZone: timezone }));
    return (target.getTime() - utc.getTime()) / 60000;
}
function convertToTimezone(date, timezone = 'Asia/Kolkata') {
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    return new Date(utc + (getTimezoneOffset(timezone) * 60000));
}
function isToday(date, timezone = 'Asia/Kolkata') {
    const today = getCurrentDate(timezone);
    const targetDate = convertToTimezone(date, timezone);
    return targetDate.toDateString() === today.toDateString();
}
function isThisWeek(date, timezone = 'Asia/Kolkata') {
    const now = getCurrentDate(timezone);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const targetDate = convertToTimezone(date, timezone);
    return targetDate >= weekAgo && targetDate <= now;
}
function isThisMonth(date, timezone = 'Asia/Kolkata') {
    const now = getCurrentDate(timezone);
    const targetDate = convertToTimezone(date, timezone);
    return targetDate.getMonth() === now.getMonth() &&
        targetDate.getFullYear() === now.getFullYear();
}
function getStartOfDay(date, timezone = 'Asia/Kolkata') {
    const targetDate = convertToTimezone(date, timezone);
    targetDate.setHours(0, 0, 0, 0);
    return targetDate;
}
function getEndOfDay(date, timezone = 'Asia/Kolkata') {
    const targetDate = convertToTimezone(date, timezone);
    targetDate.setHours(23, 59, 59, 999);
    return targetDate;
}
function getStartOfWeek(date, timezone = 'Asia/Kolkata') {
    const targetDate = convertToTimezone(date, timezone);
    const day = targetDate.getDay();
    const diff = targetDate.getDate() - day + (day === 0 ? -6 : 1); // Monday as start of week
    const startOfWeek = new Date(targetDate.setDate(diff));
    return getStartOfDay(startOfWeek, timezone);
}
function getEndOfWeek(date, timezone = 'Asia/Kolkata') {
    const startOfWeek = getStartOfWeek(date, timezone);
    const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);
    return getEndOfDay(endOfWeek, timezone);
}
function getStartOfMonth(date, timezone = 'Asia/Kolkata') {
    const targetDate = convertToTimezone(date, timezone);
    const startOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    return getStartOfDay(startOfMonth, timezone);
}
function getEndOfMonth(date, timezone = 'Asia/Kolkata') {
    const targetDate = convertToTimezone(date, timezone);
    const endOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
    return getEndOfDay(endOfMonth, timezone);
}
function addDays(date, days, timezone = 'Asia/Kolkata') {
    const targetDate = convertToTimezone(date, timezone);
    targetDate.setDate(targetDate.getDate() + days);
    return targetDate;
}
function addMonths(date, months, timezone = 'Asia/Kolkata') {
    const targetDate = convertToTimezone(date, timezone);
    targetDate.setMonth(targetDate.getMonth() + months);
    return targetDate;
}
function addYears(date, years, timezone = 'Asia/Kolkata') {
    const targetDate = convertToTimezone(date, timezone);
    targetDate.setFullYear(targetDate.getFullYear() + years);
    return targetDate;
}
function getDaysDifference(date1, date2, timezone = 'Asia/Kolkata') {
    const d1 = convertToTimezone(date1, timezone);
    const d2 = convertToTimezone(date2, timezone);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
function isWeekend(date, timezone = 'Asia/Kolkata') {
    const targetDate = convertToTimezone(date, timezone);
    const day = targetDate.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
}
function isBusinessDay(date, timezone = 'Asia/Kolkata') {
    return !isWeekend(date, timezone);
}
function getNextBusinessDay(date, timezone = 'Asia/Kolkata') {
    let nextDay = addDays(date, 1, timezone);
    while (!isBusinessDay(nextDay, timezone)) {
        nextDay = addDays(nextDay, 1, timezone);
    }
    return nextDay;
}
function getPreviousBusinessDay(date, timezone = 'Asia/Kolkata') {
    let prevDay = addDays(date, -1, timezone);
    while (!isBusinessDay(prevDay, timezone)) {
        prevDay = addDays(prevDay, -1, timezone);
    }
    return prevDay;
}
// Timezone constants
exports.TIMEZONES = {
    KOLKATA: 'Asia/Kolkata',
    UTC: 'UTC',
    NEW_YORK: 'America/New_York',
    LONDON: 'Europe/London',
    TOKYO: 'Asia/Tokyo',
    SYDNEY: 'Australia/Sydney',
};
exports.DEFAULT_TIMEZONE = exports.TIMEZONES.KOLKATA;
// String utilities
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
function truncate(str, length) {
    if (str.length <= length)
        return str;
    return str.slice(0, length) + '...';
}
function slugify(str) {
    return str
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
// Array utilities
function groupBy(array, key) {
    return array.reduce((groups, item) => {
        const groupKey = key(item);
        if (!groups[groupKey]) {
            groups[groupKey] = [];
        }
        groups[groupKey].push(item);
        return groups;
    }, {});
}
function unique(array) {
    return [...new Set(array)];
}
function sortBy(array, key) {
    return [...array].sort((a, b) => {
        const aKey = key(a);
        const bKey = key(b);
        if (aKey < bKey)
            return -1;
        if (aKey > bKey)
            return 1;
        return 0;
    });
}
// Object utilities
function omit(obj, keys) {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
}
function pick(obj, keys) {
    const result = {};
    keys.forEach(key => {
        if (key in obj) {
            result[key] = obj[key];
        }
    });
    return result;
}
// Error utilities
class AppError extends Error {
    constructor(message, code, statusCode = 500) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.name = 'AppError';
    }
}
exports.AppError = AppError;
function createError(message, code, statusCode) {
    return new AppError(message, code, statusCode);
}
// Constants
exports.ROLES = {
    ADMIN: 'admin',
    LAWYER: 'lawyer',
    PARALEGAL: 'paralegal',
    CLIENT: 'client',
};
exports.CASE_STATUS = {
    OPEN: 'open',
    IN_PROGRESS: 'in_progress',
    CLOSED: 'closed',
    ARCHIVED: 'archived',
};
exports.CASE_PRIORITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent',
};
