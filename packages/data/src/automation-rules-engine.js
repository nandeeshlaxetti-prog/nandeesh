"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.automationRulesEngine = exports.AutomationRulesEngine = void 0;
const index_1 = require("./index");
const task_1 = require("./repositories/task");
const notification_service_1 = require("./notification-service");
/**
 * Automation Rules Engine
 * Handles automation rules for hearing prep, order processing, and blocked task notifications
 */
class AutomationRulesEngine {
    constructor() {
        this.taskRepo = new task_1.TaskRepository();
        this.notificationService = new notification_service_1.NotificationService();
    }
    /**
     * Process automation rules for a given context
     */
    async processAutomationRules(context) {
        try {
            console.log(`🤖 Processing automation rules for ${context.entityType}:${context.entityId}`);
            // Get applicable automation rules
            const applicableRules = await this.getApplicableRules(context);
            // Process each rule
            for (const rule of applicableRules) {
                await this.processRule(rule, context);
            }
            console.log(`✅ Processed ${applicableRules.length} automation rules`);
        }
        catch (error) {
            console.error('Error processing automation rules:', error);
            throw error;
        }
    }
    /**
     * Get applicable automation rules for the context
     */
    async getApplicableRules(context) {
        // For now, we'll use hardcoded rules
        // In a real implementation, these would be stored in the database
        const rules = [
            {
                id: 'hearing-prep-rule',
                name: 'Hearing Preparation Task',
                description: 'Create/update hearing prep task 3 days before hearing',
                trigger: {
                    type: 'HEARING_SCHEDULED',
                    entityType: 'HEARING'
                },
                conditions: [
                    {
                        field: 'scheduledDate',
                        operator: 'GREATER_THAN',
                        value: new Date()
                    }
                ],
                actions: [
                    {
                        type: 'CREATE_TASK',
                        parameters: {
                            title: 'Hearing Preparation',
                            description: 'Prepare for upcoming hearing',
                            category: 'CASE',
                            priority: 'HIGH',
                            dueDateOffset: -3 // 3 days before hearing
                        }
                    }
                ],
                isActive: true,
                priority: 'HIGH',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 'order-pdf-rule',
                name: 'Order PDF Processing',
                description: 'Create task to summarize and circulate order when PDF is added',
                trigger: {
                    type: 'ORDER_PDF_ADDED',
                    entityType: 'ORDER'
                },
                conditions: [
                    {
                        field: 'documentType',
                        operator: 'EQUALS',
                        value: 'ORDER_PDF'
                    }
                ],
                actions: [
                    {
                        type: 'CREATE_TASK',
                        parameters: {
                            title: 'Summarize & Circulate Order',
                            description: 'Summarize the order and circulate to relevant parties',
                            category: 'CASE',
                            priority: 'MEDIUM',
                            dueDateOffset: 1 // 1 day after order PDF added
                        }
                    }
                ],
                isActive: true,
                priority: 'MEDIUM',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 'blocked-task-rule',
                name: 'Blocked Task Notification',
                description: 'Notify assignee and manager when task is blocked for more than 48 hours',
                trigger: {
                    type: 'TASK_BLOCKED',
                    entityType: 'TASK'
                },
                conditions: [
                    {
                        field: 'status',
                        operator: 'EQUALS',
                        value: 'ON_HOLD'
                    },
                    {
                        field: 'blockedDuration',
                        operator: 'GREATER_THAN',
                        value: 48, // 48 hours
                        logicalOperator: 'AND'
                    }
                ],
                actions: [
                    {
                        type: 'SEND_NOTIFICATION',
                        parameters: {
                            recipients: ['assignee', 'manager'],
                            message: 'Task has been blocked for more than 48 hours',
                            priority: 'HIGH'
                        }
                    }
                ],
                isActive: true,
                priority: 'HIGH',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        // Filter rules based on trigger type and conditions
        return rules.filter(rule => {
            // Check if trigger type matches
            if (rule.trigger.type !== this.getTriggerTypeFromContext(context)) {
                return false;
            }
            // Check if conditions are met
            return this.evaluateConditions(rule.conditions, context);
        });
    }
    /**
     * Process a single automation rule
     */
    async processRule(rule, context) {
        try {
            console.log(`🔧 Processing rule: ${rule.name}`);
            // Execute each action in the rule
            for (const action of rule.actions) {
                await this.executeAction(action, context);
            }
            console.log(`✅ Completed rule: ${rule.name}`);
        }
        catch (error) {
            console.error(`Error processing rule ${rule.name}:`, error);
            throw error;
        }
    }
    /**
     * Execute an automation action
     */
    async executeAction(action, context) {
        try {
            console.log(`⚡ Executing action: ${action.type}`);
            switch (action.type) {
                case 'CREATE_TASK':
                    await this.executeCreateTaskAction(action, context);
                    break;
                case 'UPDATE_TASK':
                    await this.executeUpdateTaskAction(action, context);
                    break;
                case 'SEND_NOTIFICATION':
                    await this.executeSendNotificationAction(action, context);
                    break;
                case 'UPDATE_STATUS':
                    await this.executeUpdateStatusAction(action, context);
                    break;
                case 'ASSIGN_TASK':
                    await this.executeAssignTaskAction(action, context);
                    break;
                default:
                    console.warn(`Unknown action type: ${action.type}`);
            }
        }
        catch (error) {
            console.error(`Error executing action ${action.type}:`, error);
            throw error;
        }
    }
    /**
     * Execute CREATE_TASK action
     */
    async executeCreateTaskAction(action, context) {
        const params = action.parameters;
        const entityData = context.entityData;
        // Calculate due date based on offset
        let dueDate;
        if (params.dueDateOffset) {
            const baseDate = this.getBaseDateForDueDate(context);
            if (baseDate) {
                dueDate = new Date(baseDate.getTime() + (params.dueDateOffset * 24 * 60 * 60 * 1000));
            }
        }
        // Determine assignee
        let assignedTo;
        if (context.entityType === 'HEARING' && entityData.case?.assignedLawyerId) {
            assignedTo = entityData.case.assignedLawyerId;
        }
        else if (context.entityType === 'ORDER' && entityData.case?.assignedLawyerId) {
            assignedTo = entityData.case.assignedLawyerId;
        }
        else if (context.userId) {
            assignedTo = context.userId;
        }
        // Create the task
        const task = await this.taskRepo.create({
            title: params.title,
            description: params.description,
            category: params.category || 'CASE',
            priority: params.priority || 'MEDIUM',
            caseId: entityData.caseId || entityData.case?.id,
            assignedTo,
            createdBy: context.userId || 'system',
            dueDate,
            tags: params.tags || [],
            notes: params.notes || `Auto-generated by automation rule: ${context.entityType}`
        });
        console.log(`✅ Created task: ${task.title} (ID: ${task.id})`);
    }
    /**
     * Execute UPDATE_TASK action
     */
    async executeUpdateTaskAction(action, context) {
        const params = action.parameters;
        const taskId = params.taskId || context.entityId;
        if (!taskId) {
            throw new Error('Task ID is required for UPDATE_TASK action');
        }
        // Update the task
        const updatedTask = await this.taskRepo.update(taskId, {
            title: params.title,
            description: params.description,
            status: params.status,
            priority: params.priority,
            assignedTo: params.assignedTo,
            dueDate: params.dueDate,
            notes: params.notes
        });
        console.log(`✅ Updated task: ${updatedTask.title} (ID: ${updatedTask.id})`);
    }
    /**
     * Execute SEND_NOTIFICATION action
     */
    async executeSendNotificationAction(action, context) {
        const params = action.parameters;
        const entityData = context.entityData;
        // Determine recipients
        const recipients = [];
        if (params.recipients.includes('assignee') && entityData.assignedTo) {
            recipients.push(entityData.assignedTo);
        }
        if (params.recipients.includes('manager') && entityData.assignedTo) {
            // Get manager from user data
            const user = await index_1.db.user.findUnique({
                where: { id: entityData.assignedTo },
                include: { employee: { include: { reportingTo: true } } }
            });
            if (user?.employee?.reportingTo?.userId) {
                recipients.push(user.employee.reportingTo.userId);
            }
        }
        // Send notifications
        for (const recipientId of recipients) {
            await this.notificationService.sendNotification({
                userId: recipientId,
                title: params.title || 'Task Notification',
                message: params.message,
                priority: params.priority || 'MEDIUM',
                entityType: context.entityType,
                entityId: context.entityId,
                metadata: {
                    automationRule: true,
                    context: context.entityType
                }
            });
        }
        console.log(`✅ Sent notifications to ${recipients.length} recipients`);
    }
    /**
     * Execute UPDATE_STATUS action
     */
    async executeUpdateStatusAction(action, context) {
        const params = action.parameters;
        const entityId = context.entityId;
        // Update status based on entity type
        switch (context.entityType) {
            case 'TASK':
                await this.taskRepo.updateStatus(entityId, params.status, params.progress, params.notes);
                break;
            case 'CASE':
                await index_1.db.case.update({
                    where: { id: entityId },
                    data: { status: params.status }
                });
                break;
            case 'HEARING':
                await index_1.db.hearing.update({
                    where: { id: entityId },
                    data: { status: params.status }
                });
                break;
            case 'ORDER':
                await index_1.db.order.update({
                    where: { id: entityId },
                    data: { status: params.status }
                });
                break;
        }
        console.log(`✅ Updated ${context.entityType} status to ${params.status}`);
    }
    /**
     * Execute ASSIGN_TASK action
     */
    async executeAssignTaskAction(action, context) {
        const params = action.parameters;
        const taskId = params.taskId || context.entityId;
        if (!taskId) {
            throw new Error('Task ID is required for ASSIGN_TASK action');
        }
        // Assign the task
        const assignedTask = await this.taskRepo.assignTask(taskId, params.assignedTo, params.dueDate);
        console.log(`✅ Assigned task ${assignedTask.title} to ${params.assignedTo}`);
    }
    /**
     * Evaluate automation conditions
     */
    evaluateConditions(conditions, context) {
        if (!conditions || conditions.length === 0) {
            return true;
        }
        let result = true;
        let logicalOperator = 'AND';
        for (const condition of conditions) {
            const conditionResult = this.evaluateCondition(condition, context);
            if (logicalOperator === 'AND') {
                result = result && conditionResult;
            }
            else {
                result = result || conditionResult;
            }
            logicalOperator = condition.logicalOperator || 'AND';
        }
        return result;
    }
    /**
     * Evaluate a single condition
     */
    evaluateCondition(condition, context) {
        const fieldValue = this.getFieldValue(condition.field, context.entityData);
        const conditionValue = condition.value;
        switch (condition.operator) {
            case 'EQUALS':
                return fieldValue === conditionValue;
            case 'NOT_EQUALS':
                return fieldValue !== conditionValue;
            case 'GREATER_THAN':
                return fieldValue > conditionValue;
            case 'LESS_THAN':
                return fieldValue < conditionValue;
            case 'CONTAINS':
                return String(fieldValue).includes(String(conditionValue));
            case 'IN':
                return Array.isArray(conditionValue) && conditionValue.includes(fieldValue);
            case 'NOT_IN':
                return Array.isArray(conditionValue) && !conditionValue.includes(fieldValue);
            default:
                return false;
        }
    }
    /**
     * Get field value from entity data
     */
    getFieldValue(field, entityData) {
        const fieldParts = field.split('.');
        let value = entityData;
        for (const part of fieldParts) {
            if (value && typeof value === 'object') {
                value = value[part];
            }
            else {
                return undefined;
            }
        }
        return value;
    }
    /**
     * Get trigger type from context
     */
    getTriggerTypeFromContext(context) {
        // Map context to trigger type
        switch (context.entityType) {
            case 'HEARING':
                return 'HEARING_SCHEDULED';
            case 'ORDER':
                return 'ORDER_PDF_ADDED';
            case 'TASK':
                return 'TASK_BLOCKED';
            default:
                return 'UNKNOWN';
        }
    }
    /**
     * Get base date for due date calculation
     */
    getBaseDateForDueDate(context) {
        const entityData = context.entityData;
        switch (context.entityType) {
            case 'HEARING':
                return entityData.scheduledDate ? new Date(entityData.scheduledDate) : undefined;
            case 'ORDER':
                return entityData.createdAt ? new Date(entityData.createdAt) : undefined;
            case 'TASK':
                return entityData.dueDate ? new Date(entityData.dueDate) : undefined;
            default:
                return new Date();
        }
    }
    /**
     * Check for blocked tasks and trigger notifications
     */
    async checkBlockedTasks() {
        try {
            console.log('🔍 Checking for blocked tasks...');
            // Get tasks that have been blocked for more than 48 hours
            const blockedTasks = await index_1.db.task.findMany({
                where: {
                    status: 'ON_HOLD',
                    updatedAt: {
                        lt: new Date(Date.now() - 48 * 60 * 60 * 1000) // 48 hours ago
                    }
                },
                include: {
                    assignee: true,
                    case: true
                }
            });
            console.log(`Found ${blockedTasks.length} blocked tasks`);
            // Process each blocked task
            for (const task of blockedTasks) {
                const context = {
                    entityType: 'TASK',
                    entityId: task.id,
                    entityData: {
                        ...task,
                        blockedDuration: this.calculateBlockedDuration(task.updatedAt)
                    },
                    userId: task.assignedTo,
                    timestamp: new Date()
                };
                await this.processAutomationRules(context);
            }
        }
        catch (error) {
            console.error('Error checking blocked tasks:', error);
            throw error;
        }
    }
    /**
     * Calculate blocked duration in hours
     */
    calculateBlockedDuration(updatedAt) {
        const now = new Date();
        const diffMs = now.getTime() - updatedAt.getTime();
        return Math.floor(diffMs / (1000 * 60 * 60)); // Convert to hours
    }
    /**
     * Trigger automation for hearing scheduled
     */
    async triggerHearingScheduled(hearingId) {
        try {
            const hearing = await index_1.db.hearing.findUnique({
                where: { id: hearingId },
                include: {
                    case: {
                        include: {
                            assignedLawyer: true
                        }
                    }
                }
            });
            if (!hearing) {
                throw new Error(`Hearing not found: ${hearingId}`);
            }
            const context = {
                entityType: 'HEARING',
                entityId: hearing.id,
                entityData: hearing,
                userId: hearing.case?.assignedLawyerId,
                timestamp: new Date()
            };
            await this.processAutomationRules(context);
        }
        catch (error) {
            console.error('Error triggering hearing scheduled automation:', error);
            throw error;
        }
    }
    /**
     * Trigger automation for order PDF added
     */
    async triggerOrderPdfAdded(orderId) {
        try {
            const order = await index_1.db.order.findUnique({
                where: { id: orderId },
                include: {
                    case: {
                        include: {
                            assignedLawyer: true
                        }
                    }
                }
            });
            if (!order) {
                throw new Error(`Order not found: ${orderId}`);
            }
            const context = {
                entityType: 'ORDER',
                entityId: order.id,
                entityData: {
                    ...order,
                    documentType: 'ORDER_PDF'
                },
                userId: order.case?.assignedLawyerId,
                timestamp: new Date()
            };
            await this.processAutomationRules(context);
        }
        catch (error) {
            console.error('Error triggering order PDF added automation:', error);
            throw error;
        }
    }
    /**
     * Trigger automation for task blocked
     */
    async triggerTaskBlocked(taskId) {
        try {
            const task = await index_1.db.task.findUnique({
                where: { id: taskId },
                include: {
                    assignee: true,
                    case: true
                }
            });
            if (!task) {
                throw new Error(`Task not found: ${taskId}`);
            }
            const context = {
                entityType: 'TASK',
                entityId: task.id,
                entityData: {
                    ...task,
                    blockedDuration: this.calculateBlockedDuration(task.updatedAt)
                },
                userId: task.assignedTo,
                timestamp: new Date()
            };
            await this.processAutomationRules(context);
        }
        catch (error) {
            console.error('Error triggering task blocked automation:', error);
            throw error;
        }
    }
}
exports.AutomationRulesEngine = AutomationRulesEngine;
// Export singleton instance
exports.automationRulesEngine = new AutomationRulesEngine();
