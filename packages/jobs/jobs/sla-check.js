import { Job } from 'bree'
import { db } from 'data'
import { ConfigUtils } from 'core'

/**
 * SLA Check Job - Runs at 18:00 IST
 * Checks SLA compliance for cases and tasks
 */
export default async function slaCheck(job: Job) {
  console.log(`[${new Date().toISOString()}] Starting SLA check job...`)
  
  try {
    // Get configuration
    const config = ConfigUtils.getConfig()
    
    // Check if SLA checking is enabled
    if (!config.APP_MODE || config.APP_MODE !== 'desktop') {
      console.log('SLA check skipped - not in desktop mode')
      return
    }

    const now = new Date()
    const slaViolations = []
    const slaWarnings = []

    // Check case SLA violations
    const overdueCases = await db.case.findMany({
      where: {
        status: { in: ['OPEN', 'IN_PROGRESS'] },
        expectedCompletionDate: { lt: now },
      },
      include: {
        client: true,
        assignedLawyer: true,
      },
    })

    for (const caseData of overdueCases) {
      const daysOverdue = Math.floor((now.getTime() - caseData.expectedCompletionDate!.getTime()) / (1000 * 60 * 60 * 24))
      
      slaViolations.push({
        type: 'CASE',
        id: caseData.id,
        caseNumber: caseData.caseNumber,
        title: caseData.title,
        assignedLawyer: caseData.assignedLawyer?.firstName + ' ' + caseData.assignedLawyer?.lastName,
        daysOverdue,
        expectedCompletionDate: caseData.expectedCompletionDate,
      })
    }

    // Check task SLA violations
    const overdueTasks = await db.task.findMany({
      where: {
        status: { in: ['PENDING', 'IN_PROGRESS'] },
        dueDate: { lt: now },
      },
      include: {
        assignee: true,
        case: {
          select: {
            caseNumber: true,
            title: true,
          },
        },
      },
    })

    for (const taskData of overdueTasks) {
      const daysOverdue = Math.floor((now.getTime() - taskData.dueDate!.getTime()) / (1000 * 60 * 60 * 24))
      
      slaViolations.push({
        type: 'TASK',
        id: taskData.id,
        title: taskData.title,
        category: taskData.category,
        assignee: taskData.assignee?.firstName + ' ' + taskData.assignee?.lastName,
        caseNumber: taskData.case?.caseNumber,
        daysOverdue,
        dueDate: taskData.dueDate,
      })
    }

    // Check SLA warnings (approaching due dates)
    const warningThreshold = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000) // 3 days from now

    const warningCases = await db.case.findMany({
      where: {
        status: { in: ['OPEN', 'IN_PROGRESS'] },
        expectedCompletionDate: { 
          gte: now,
          lte: warningThreshold,
        },
      },
      include: {
        assignedLawyer: true,
      },
    })

    for (const caseData of warningCases) {
      const daysUntilDue = Math.floor((caseData.expectedCompletionDate!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      
      slaWarnings.push({
        type: 'CASE',
        id: caseData.id,
        caseNumber: caseData.caseNumber,
        title: caseData.title,
        assignedLawyer: caseData.assignedLawyer?.firstName + ' ' + caseData.assignedLawyer?.lastName,
        daysUntilDue,
        expectedCompletionDate: caseData.expectedCompletionDate,
      })
    }

    const warningTasks = await db.task.findMany({
      where: {
        status: { in: ['PENDING', 'IN_PROGRESS'] },
        dueDate: { 
          gte: now,
          lte: warningThreshold,
        },
      },
      include: {
        assignee: true,
        case: {
          select: {
            caseNumber: true,
          },
        },
      },
    })

    for (const taskData of warningTasks) {
      const daysUntilDue = Math.floor((taskData.dueDate!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      
      slaWarnings.push({
        type: 'TASK',
        id: taskData.id,
        title: taskData.title,
        category: taskData.category,
        assignee: taskData.assignee?.firstName + ' ' + taskData.assignee?.lastName,
        caseNumber: taskData.case?.caseNumber,
        daysUntilDue,
        dueDate: taskData.dueDate,
      })
    }

    // Log SLA check results
    console.log(`SLA check completed: ${slaViolations.length} violations, ${slaWarnings.length} warnings`)
    
    // Create audit log entry
    await db.auditLog.create({
      data: {
        action: 'SLA_CHECK',
        entityType: 'SYSTEM',
        entityName: 'SLA Check Job',
        severity: slaViolations.length > 0 ? 'HIGH' : 'MEDIUM',
        description: `SLA check completed: ${slaViolations.length} violations, ${slaWarnings.length} warnings`,
        details: JSON.stringify({
          violations: slaViolations,
          warnings: slaWarnings,
          totalViolations: slaViolations.length,
          totalWarnings: slaWarnings.length,
        }),
        createdAt: new Date(),
      },
    })

    // Send notifications for critical violations
    if (slaViolations.length > 0) {
      await sendSLAViolationNotifications(slaViolations)
    }

    // Send warnings for approaching deadlines
    if (slaWarnings.length > 0) {
      await sendSLAWarningNotifications(slaWarnings)
    }

  } catch (error) {
    console.error('SLA check job failed:', error)
    
    // Create error audit log
    await db.auditLog.create({
      data: {
        action: 'SLA_CHECK',
        entityType: 'SYSTEM',
        entityName: 'SLA Check Job',
        severity: 'CRITICAL',
        description: `SLA check job failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        createdAt: new Date(),
      },
    })
    
    throw error
  }
}

/**
 * Send SLA violation notifications
 */
async function sendSLAViolationNotifications(violations: any[]): Promise<void> {
  console.log(`Sending SLA violation notifications for ${violations.length} violations`)
  
  // Group violations by assignee
  const violationsByAssignee = violations.reduce((acc, violation) => {
    const assignee = violation.assignedLawyer || violation.assignee || 'Unassigned'
    if (!acc[assignee]) {
      acc[assignee] = []
    }
    acc[assignee].push(violation)
    return acc
  }, {})

  // Send notifications (simulation)
  for (const [assignee, assigneeViolations] of Object.entries(violationsByAssignee)) {
    console.log(`Notifying ${assignee} about ${assigneeViolations.length} SLA violations`)
    
    // In real implementation, this would:
    // 1. Find user by name
    // 2. Send email notification
    // 3. Create in-app notification
    // 4. Send Slack/Teams message if configured
  }
}

/**
 * Send SLA warning notifications
 */
async function sendSLAWarningNotifications(warnings: any[]): Promise<void> {
  console.log(`Sending SLA warning notifications for ${warnings.length} warnings`)
  
  // Group warnings by assignee
  const warningsByAssignee = warnings.reduce((acc, warning) => {
    const assignee = warning.assignedLawyer || warning.assignee || 'Unassigned'
    if (!acc[assignee]) {
      acc[assignee] = []
    }
    acc[assignee].push(warning)
    return acc
  }, {})

  // Send notifications (simulation)
  for (const [assignee, assigneeWarnings] of Object.entries(warningsByAssignee)) {
    console.log(`Notifying ${assignee} about ${assigneeWarnings.length} approaching deadlines`)
    
    // In real implementation, this would send warning notifications
  }
}
