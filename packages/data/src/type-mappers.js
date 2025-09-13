"use strict";
/**
 * Type mappers to convert between Prisma-generated types and core package types
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapEmployeeFromPrisma = mapEmployeeFromPrisma;
exports.mapProjectFromPrisma = mapProjectFromPrisma;
exports.mapSLARuleFromPrisma = mapSLARuleFromPrisma;
exports.mapSLAEvaluationFromPrisma = mapSLAEvaluationFromPrisma;
exports.convertNullToUndefined = convertNullToUndefined;
// Employee type mappings
function mapEmployeeFromPrisma(prismaEmployee) {
    return {
        ...prismaEmployee,
        employmentType: prismaEmployee.employmentType,
        department: prismaEmployee.department || undefined,
        designation: prismaEmployee.designation || undefined,
        reportingManager: prismaEmployee.reportingManager || undefined,
        workLocation: prismaEmployee.workLocation || undefined,
        workSchedule: prismaEmployee.workSchedule || undefined,
        experience: prismaEmployee.experience || undefined,
        salary: prismaEmployee.salary || undefined,
        joiningDate: prismaEmployee.joiningDate || undefined,
        probationEndDate: prismaEmployee.probationEndDate || undefined,
        confirmationDate: prismaEmployee.confirmationDate || undefined,
        lastPromotionDate: prismaEmployee.lastPromotionDate || undefined,
        nextReviewDate: prismaEmployee.nextReviewDate || undefined
    };
}
// Project type mappings
function mapProjectFromPrisma(prismaProject) {
    return {
        ...prismaProject,
        status: prismaProject.status,
        type: prismaProject.type,
        description: prismaProject.description || undefined,
        clientId: prismaProject.clientId || undefined,
        teamId: prismaProject.teamId || undefined,
        managerId: prismaProject.managerId || undefined,
        startDate: prismaProject.startDate || undefined,
        endDate: prismaProject.endDate || undefined,
        estimatedHours: prismaProject.estimatedHours || undefined,
        actualHours: prismaProject.actualHours || undefined,
        budget: prismaProject.budget || undefined,
        notes: prismaProject.notes || undefined
    };
}
// SLA Rule type mappings
function mapSLARuleFromPrisma(prismaRule) {
    return {
        ...prismaRule,
        description: prismaRule.description || undefined,
        entitySubType: prismaRule.entitySubType || undefined,
        priority: prismaRule.priority || undefined,
        teamId: prismaRule.teamId || undefined
    };
}
// SLA Evaluation type mappings
function mapSLAEvaluationFromPrisma(prismaEvaluation) {
    return {
        ...prismaEvaluation,
        status: prismaEvaluation.status,
        employeeId: prismaEvaluation.employeeId || undefined,
        currentValue: prismaEvaluation.currentValue || undefined,
        thresholdValue: prismaEvaluation.thresholdValue || undefined,
        breachDate: prismaEvaluation.breachDate || undefined,
        escalationDate: prismaEvaluation.escalationDate || undefined,
        resolutionDate: prismaEvaluation.resolutionDate || undefined,
        notes: prismaEvaluation.notes || undefined
    };
}
// Generic null to undefined converter
function convertNullToUndefined(obj) {
    if (obj === null)
        return undefined;
    if (typeof obj === 'object' && obj !== null) {
        const result = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                result[key] = convertNullToUndefined(obj[key]);
            }
        }
        return result;
    }
    return obj;
}
