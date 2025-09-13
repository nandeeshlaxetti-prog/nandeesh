"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slaEvaluationRepository = exports.slaRuleRepository = exports.projectRepository = exports.employeeRepository = exports.SLAEvaluationRepository = exports.SLARuleRepository = exports.ProjectRepository = exports.EmployeeRepository = void 0;
const index_1 = require("../index");
const type_mappers_1 = require("../type-mappers");
/**
 * Employee Repository
 * Handles employee data operations
 */
class EmployeeRepository {
    async create(data) {
        const result = await index_1.db.employee.create({
            data: {
                ...data,
                skills: data.skills || '[]',
                certifications: data.certifications || '[]'
            },
            include: {
                user: true,
                reportingTo: true,
                reports: true
            }
        });
        return (0, type_mappers_1.mapEmployeeFromPrisma)(result);
    }
    async findById(id) {
        const result = await index_1.db.employee.findUnique({
            where: { id },
            include: {
                user: true,
                reportingTo: true,
                reports: true,
                teamMemberships: {
                    include: {
                        team: true
                    }
                }
            }
        });
        return result ? (0, type_mappers_1.mapEmployeeFromPrisma)(result) : null;
    }
    async findByEmployeeId(employeeId) {
        const result = await index_1.db.employee.findUnique({
            where: { employeeId },
            include: {
                user: true,
                reportingTo: true,
                reports: true
            }
        });
        return result ? (0, type_mappers_1.mapEmployeeFromPrisma)(result) : null;
    }
    async findByUserId(userId) {
        return await index_1.db.employee.findUnique({
            where: { userId },
            include: {
                user: true,
                reportingTo: true,
                reports: true
            }
        });
    }
    async findMany(filters) {
        const where = {};
        if (filters?.department) {
            where.department = filters.department;
        }
        if (filters?.designation) {
            where.designation = filters.designation;
        }
        if (filters?.employmentType) {
            where.employmentType = filters.employmentType;
        }
        if (filters?.isActive !== undefined) {
            where.isActive = filters.isActive;
        }
        if (filters?.reportingManager) {
            where.reportingManager = filters.reportingManager;
        }
        const results = await index_1.db.employee.findMany({
            where,
            include: {
                user: true,
                reportingTo: true,
                reports: true
            },
            orderBy: {
                employeeId: 'asc'
            }
        });
        return results.map(result => (0, type_mappers_1.mapEmployeeFromPrisma)(result));
    }
    async update(id, data) {
        return await index_1.db.employee.update({
            where: { id },
            data,
            include: {
                user: true,
                reportingTo: true,
                reports: true
            }
        });
    }
    async delete(id) {
        await index_1.db.employee.delete({
            where: { id }
        });
    }
    async getReportingHierarchy(employeeId) {
        const employee = await this.findByEmployeeId(employeeId);
        if (!employee) {
            return [];
        }
        const hierarchy = [];
        let current = employee;
        // Get all reports recursively
        const getReports = async (emp) => {
            const reports = await index_1.db.employee.findMany({
                where: {
                    reportingManager: emp.employeeId,
                    isActive: true
                },
                include: {
                    user: true,
                    reportingTo: true,
                    reports: true
                }
            });
            for (const report of reports) {
                hierarchy.push(report);
                await getReports(report);
            }
        };
        await getReports(current);
        return hierarchy;
    }
    async getDepartmentEmployees(department) {
        return await index_1.db.employee.findMany({
            where: {
                department,
                isActive: true
            },
            include: {
                user: true,
                reportingTo: true,
                reports: true
            },
            orderBy: {
                employeeId: 'asc'
            }
        });
    }
}
exports.EmployeeRepository = EmployeeRepository;
/**
 * Project Repository
 * Handles project data operations
 */
class ProjectRepository {
    async create(data) {
        return await index_1.db.project.create({
            data: {
                ...data,
                tags: data.tags || '[]',
                milestones: data.milestones || '[]',
                deliverables: data.deliverables || '[]',
                risks: data.risks || '[]'
            },
            include: {
                client: true,
                team: true,
                manager: true,
                cases: true
            }
        });
    }
    async findById(id) {
        return await index_1.db.project.findUnique({
            where: { id },
            include: {
                client: true,
                team: true,
                manager: true,
                cases: true
            }
        });
    }
    async findByCode(code) {
        return await index_1.db.project.findUnique({
            where: { code },
            include: {
                client: true,
                team: true,
                manager: true,
                cases: true
            }
        });
    }
    async findMany(filters) {
        const where = {};
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.priority) {
            where.priority = filters.priority;
        }
        if (filters?.type) {
            where.type = filters.type;
        }
        if (filters?.clientId) {
            where.clientId = filters.clientId;
        }
        if (filters?.teamId) {
            where.teamId = filters.teamId;
        }
        if (filters?.managerId) {
            where.managerId = filters.managerId;
        }
        if (filters?.isActive !== undefined) {
            where.isActive = filters.isActive;
        }
        return await index_1.db.project.findMany({
            where,
            include: {
                client: true,
                team: true,
                manager: true,
                cases: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    async update(id, data) {
        return await index_1.db.project.update({
            where: { id },
            data,
            include: {
                client: true,
                team: true,
                manager: true,
                cases: true
            }
        });
    }
    async delete(id) {
        await index_1.db.project.delete({
            where: { id }
        });
    }
    async getTeamProjects(teamId) {
        return await index_1.db.project.findMany({
            where: {
                teamId,
                isActive: true
            },
            include: {
                client: true,
                team: true,
                manager: true,
                cases: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    async getClientProjects(clientId) {
        return await index_1.db.project.findMany({
            where: {
                clientId,
                isActive: true
            },
            include: {
                client: true,
                team: true,
                manager: true,
                cases: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
}
exports.ProjectRepository = ProjectRepository;
/**
 * SLA Rule Repository
 * Handles SLA rule data operations
 */
class SLARuleRepository {
    async create(data) {
        return await index_1.db.sLARule.create({
            data: {
                ...data,
                conditions: data.conditions || '{}',
                metrics: data.metrics || '{}',
                escalationRules: data.escalationRules || '[]',
                notifications: data.notifications || '{}'
            },
            include: {
                team: true,
                evaluations: true
            }
        });
    }
    async findById(id) {
        return await index_1.db.sLARule.findUnique({
            where: { id },
            include: {
                team: true,
                evaluations: true
            }
        });
    }
    async findMany(filters) {
        const where = {};
        if (filters?.entityType) {
            where.entityType = filters.entityType;
        }
        if (filters?.entitySubType) {
            where.entitySubType = filters.entitySubType;
        }
        if (filters?.priority) {
            where.priority = filters.priority;
        }
        if (filters?.teamId) {
            where.teamId = filters.teamId;
        }
        if (filters?.isActive !== undefined) {
            where.isActive = filters.isActive;
        }
        return await index_1.db.sLARule.findMany({
            where,
            include: {
                team: true,
                evaluations: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    async update(id, data) {
        return await index_1.db.sLARule.update({
            where: { id },
            data,
            include: {
                team: true,
                evaluations: true
            }
        });
    }
    async delete(id) {
        await index_1.db.sLARule.delete({
            where: { id }
        });
    }
    async getApplicableRules(context) {
        const where = {
            isActive: true,
            entityType: context.entityType,
            OR: [
                { entitySubType: null },
                { entitySubType: context.entitySubType }
            ],
            OR: [
                { priority: null },
                { priority: context.priority }
            ],
            OR: [
                { teamId: null },
                { teamId: context.teamId }
            ]
        };
        return await index_1.db.sLARule.findMany({
            where,
            include: {
                team: true
            },
            orderBy: {
                priority: 'desc'
            }
        });
    }
    async getTeamSLARules(teamId) {
        return await index_1.db.sLARule.findMany({
            where: {
                teamId,
                isActive: true
            },
            include: {
                team: true,
                evaluations: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
}
exports.SLARuleRepository = SLARuleRepository;
/**
 * SLA Evaluation Repository
 * Handles SLA evaluation data operations
 */
class SLAEvaluationRepository {
    async create(data) {
        const result = await index_1.db.sLAEvaluation.create({
            data: {
                ...data,
                metadata: data.metadata || '{}'
            },
            include: {
                slaRule: true,
                employee: {
                    include: {
                        user: true
                    }
                }
            }
        });
        return {
            ...result,
            status: result.status,
            notes: result.notes || undefined,
            employeeId: result.employeeId || undefined,
            currentValue: result.currentValue || undefined,
            thresholdValue: result.thresholdValue || undefined,
            breachDate: result.breachDate || undefined,
            escalationDate: result.escalationDate || undefined,
            resolutionDate: result.resolutionDate || undefined
        };
    }
    async findById(id) {
        const result = await index_1.db.sLAEvaluation.findUnique({
            where: { id },
            include: {
                slaRule: true,
                employee: {
                    include: {
                        user: true
                    }
                }
            }
        });
        if (!result)
            return null;
        return {
            ...result,
            status: result.status,
            notes: result.notes || undefined,
            employeeId: result.employeeId || undefined,
            currentValue: result.currentValue || undefined,
            thresholdValue: result.thresholdValue || undefined,
            breachDate: result.breachDate || undefined,
            escalationDate: result.escalationDate || undefined,
            resolutionDate: result.resolutionDate || undefined
        };
    }
    async findMany(filters) {
        const where = {};
        if (filters?.entityType) {
            where.entityType = filters.entityType;
        }
        if (filters?.entityId) {
            where.entityId = filters.entityId;
        }
        if (filters?.slaRuleId) {
            where.slaRuleId = filters.slaRuleId;
        }
        if (filters?.employeeId) {
            where.employeeId = filters.employeeId;
        }
        if (filters?.status) {
            where.status = filters.status;
        }
        const results = await index_1.db.sLAEvaluation.findMany({
            where,
            include: {
                slaRule: true,
                employee: {
                    include: {
                        user: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return results.map(result => ({
            ...result,
            status: result.status,
            notes: result.notes || undefined,
            employeeId: result.employeeId || undefined,
            currentValue: result.currentValue || undefined,
            thresholdValue: result.thresholdValue || undefined,
            breachDate: result.breachDate || undefined,
            escalationDate: result.escalationDate || undefined,
            resolutionDate: result.resolutionDate || undefined
        }));
    }
    async update(id, data) {
        const result = await index_1.db.sLAEvaluation.update({
            where: { id },
            data,
            include: {
                slaRule: true,
                employee: {
                    include: {
                        user: true
                    }
                }
            }
        });
        return {
            ...result,
            status: result.status,
            notes: result.notes || undefined,
            employeeId: result.employeeId || undefined,
            currentValue: result.currentValue || undefined,
            thresholdValue: result.thresholdValue || undefined,
            breachDate: result.breachDate || undefined,
            escalationDate: result.escalationDate || undefined,
            resolutionDate: result.resolutionDate || undefined
        };
    }
    async delete(id) {
        await index_1.db.sLAEvaluation.delete({
            where: { id }
        });
    }
    async getEntityEvaluations(entityId, entityType) {
        const results = await index_1.db.sLAEvaluation.findMany({
            where: {
                entityId,
                entityType
            },
            include: {
                slaRule: true,
                employee: {
                    include: {
                        user: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return results.map(result => ({
            ...result,
            status: result.status,
            notes: result.notes || undefined,
            employeeId: result.employeeId || undefined,
            currentValue: result.currentValue || undefined,
            thresholdValue: result.thresholdValue || undefined,
            breachDate: result.breachDate || undefined,
            escalationDate: result.escalationDate || undefined,
            resolutionDate: result.resolutionDate || undefined
        }));
    }
    async getBreachSummary(filters) {
        const where = {
            status: {
                in: ['BREACHED', 'ESCALATED']
            }
        };
        if (filters?.teamId) {
            where.slaRule = {
                teamId: filters.teamId
            };
        }
        if (filters?.startDate && filters?.endDate) {
            where.createdAt = {
                gte: filters.startDate,
                lte: filters.endDate
            };
        }
        const results = await index_1.db.sLAEvaluation.findMany({
            where,
            include: {
                slaRule: true,
                employee: {
                    include: {
                        user: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return results.map(result => ({
            ...result,
            status: result.status,
            notes: result.notes || undefined,
            employeeId: result.employeeId || undefined,
            currentValue: result.currentValue || undefined,
            thresholdValue: result.thresholdValue || undefined,
            breachDate: result.breachDate || undefined,
            escalationDate: result.escalationDate || undefined,
            resolutionDate: result.resolutionDate || undefined
        }));
    }
}
exports.SLAEvaluationRepository = SLAEvaluationRepository;
// Export repository instances
exports.employeeRepository = new EmployeeRepository();
exports.projectRepository = new ProjectRepository();
exports.slaRuleRepository = new SLARuleRepository();
exports.slaEvaluationRepository = new SLAEvaluationRepository();
