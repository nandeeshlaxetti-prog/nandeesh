/**
 * Type mappers to convert between Prisma-generated types and core package types
 */

// Employee type mappings
export function mapEmployeeFromPrisma(prismaEmployee: any): any {
  return {
    ...prismaEmployee,
    employmentType: prismaEmployee.employmentType as "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN" | "CONSULTANT",
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
  }
}

// Project type mappings
export function mapProjectFromPrisma(prismaProject: any): any {
  return {
    ...prismaProject,
    status: prismaProject.status as "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "CANCELLED",
    type: prismaProject.type as "CLIENT_PROJECT" | "INTERNAL_PROJECT" | "RESEARCH_PROJECT" | "TRAINING_PROJECT" | "OTHER",
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
  }
}

// SLA Rule type mappings
export function mapSLARuleFromPrisma(prismaRule: any): any {
  return {
    ...prismaRule,
    description: prismaRule.description || undefined,
    entitySubType: prismaRule.entitySubType || undefined,
    priority: prismaRule.priority || undefined,
    teamId: prismaRule.teamId || undefined
  }
}

// SLA Evaluation type mappings
export function mapSLAEvaluationFromPrisma(prismaEvaluation: any): any {
  return {
    ...prismaEvaluation,
    status: prismaEvaluation.status as "PENDING" | "IN_PROGRESS" | "COMPLETED" | "BREACHED" | "ESCALATED",
    employeeId: prismaEvaluation.employeeId || undefined,
    currentValue: prismaEvaluation.currentValue || undefined,
    thresholdValue: prismaEvaluation.thresholdValue || undefined,
    breachDate: prismaEvaluation.breachDate || undefined,
    escalationDate: prismaEvaluation.escalationDate || undefined,
    resolutionDate: prismaEvaluation.resolutionDate || undefined,
    notes: prismaEvaluation.notes || undefined
  }
}

// Generic null to undefined converter
export function convertNullToUndefined<T>(obj: T): T {
  if (obj === null) return undefined as T
  if (typeof obj === 'object' && obj !== null) {
    const result = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result[key] = convertNullToUndefined(obj[key])
      }
    }
    return result
  }
  return obj
}
