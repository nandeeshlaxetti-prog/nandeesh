import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting comprehensive seed...')

  // Clear existing data in reverse dependency order
  await prisma.sLAEvaluation.deleteMany()
  await prisma.sLARule.deleteMany()
  await prisma.userPendingSummary.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.leaveRequest.deleteMany()
  await prisma.worklog.deleteMany()
  await prisma.subtask.deleteMany()
  await prisma.task.deleteMany()
  await prisma.order.deleteMany()
  await prisma.hearing.deleteMany()
  await prisma.party.deleteMany()
  await prisma.document.deleteMany()
  await prisma.case.deleteMany()
  await prisma.project.deleteMany()
  await prisma.employee.deleteMany()
  await prisma.teamMember.deleteMany()
  await prisma.team.deleteMany()
  await prisma.user.deleteMany()

  // Hash passwords for authentication
  const defaultPassword = 'password123'
  const passwordHash = await bcrypt.hash(defaultPassword, 12)

  // Create users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@lnnlegal.com',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      status: 'ACTIVE',
      phone: '+91-9876543210',
      joiningDate: new Date('2020-01-01'),
    },
  })

  const lawyer1 = await prisma.user.create({
    data: {
      email: 'john.doe@lnnlegal.com',
      passwordHash,
      firstName: 'John',
      lastName: 'Doe',
      role: 'LAWYER',
      status: 'ACTIVE',
      phone: '+91-9876543211',
      joiningDate: new Date('2021-03-15'),
    },
  })

  const lawyer2 = await prisma.user.create({
    data: {
      email: 'jane.smith@lnnlegal.com',
      passwordHash,
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'LAWYER',
      status: 'ACTIVE',
      phone: '+91-9876543212',
      joiningDate: new Date('2021-06-01'),
    },
  })

  const paralegal = await prisma.user.create({
    data: {
      email: 'mike.wilson@lnnlegal.com',
      passwordHash,
      firstName: 'Mike',
      lastName: 'Wilson',
      role: 'PARALEGAL',
      status: 'ACTIVE',
      phone: '+91-9876543213',
      joiningDate: new Date('2022-01-10'),
    },
  })

  const client1 = await prisma.user.create({
    data: {
      email: 'client1@example.com',
      firstName: 'Alice',
      lastName: 'Johnson',
      role: 'CLIENT',
      status: 'ACTIVE',
      phone: '+91-9876543214',
    },
  })

  const client2 = await prisma.user.create({
    data: {
      email: 'client2@example.com',
      firstName: 'Bob',
      lastName: 'Brown',
      role: 'CLIENT',
      status: 'ACTIVE',
      phone: '+91-9876543215',
    },
  })

  console.log('Created users:', { admin, lawyer1, lawyer2, paralegal, client1, client2 })

  // Create employees
  const employee1 = await prisma.employee.create({
    data: {
      employeeId: 'EMP001',
      userId: lawyer1.id,
      department: 'LEGAL',
      designation: 'Senior Associate',
      employmentType: 'FULL_TIME',
      workLocation: 'Delhi Office',
      workSchedule: JSON.stringify({
        hours: '9:00-18:00',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        timezone: 'Asia/Kolkata'
      }),
      skills: JSON.stringify(['Contract Law', 'Corporate Law', 'Litigation']),
      certifications: JSON.stringify(['Bar Council of India', 'Corporate Law Certificate']),
      experience: 5.5,
      salary: 150000,
      currency: 'INR',
      joiningDate: new Date('2021-03-15'),
      probationEndDate: new Date('2021-09-15'),
      confirmationDate: new Date('2021-09-15'),
      nextReviewDate: new Date('2024-09-15'),
      isActive: true
    }
  })

  const employee2 = await prisma.employee.create({
    data: {
      employeeId: 'EMP002',
      userId: lawyer2.id,
      department: 'LEGAL',
      designation: 'Associate',
      reportingManager: 'EMP001',
      employmentType: 'FULL_TIME',
      workLocation: 'Mumbai Office',
      workSchedule: JSON.stringify({
        hours: '9:00-18:00',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        timezone: 'Asia/Kolkata'
      }),
      skills: JSON.stringify(['Property Law', 'Real Estate Law', 'Civil Litigation']),
      certifications: JSON.stringify(['Bar Council of India']),
      experience: 3.0,
      salary: 120000,
      currency: 'INR',
      joiningDate: new Date('2021-06-01'),
      probationEndDate: new Date('2021-12-01'),
      confirmationDate: new Date('2021-12-01'),
      nextReviewDate: new Date('2024-12-01'),
      isActive: true
    }
  })

  const employee3 = await prisma.employee.create({
    data: {
      employeeId: 'EMP003',
      userId: paralegal.id,
      department: 'LEGAL',
      designation: 'Paralegal',
      reportingManager: 'EMP001',
      employmentType: 'FULL_TIME',
      workLocation: 'Delhi Office',
      workSchedule: JSON.stringify({
        hours: '9:00-18:00',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        timezone: 'Asia/Kolkata'
      }),
      skills: JSON.stringify(['Legal Research', 'Document Preparation', 'Case Management']),
      certifications: JSON.stringify(['Paralegal Certificate']),
      experience: 2.0,
      salary: 80000,
      currency: 'INR',
      joiningDate: new Date('2022-01-10'),
      probationEndDate: new Date('2022-07-10'),
      confirmationDate: new Date('2022-07-10'),
      nextReviewDate: new Date('2024-07-10'),
      isActive: true
    }
  })

  console.log('Created employees:', { employee1, employee2, employee3 })

  // Create teams
  const corporateTeam = await prisma.team.create({
    data: {
      name: 'Corporate Law Team',
      description: 'Handles corporate legal matters',
      leadId: lawyer1.id,
      department: 'Corporate',
      color: '#3B82F6',
    },
  })

  const litigationTeam = await prisma.team.create({
    data: {
      name: 'Litigation Team',
      description: 'Handles court cases and litigation',
      leadId: lawyer2.id,
      department: 'Litigation',
      color: '#EF4444',
    },
  })

  // Add team members
  await prisma.teamMember.createMany({
    data: [
      { teamId: corporateTeam.id, userId: lawyer1.id, role: 'LEAD' },
      { teamId: corporateTeam.id, userId: paralegal.id, role: 'MEMBER' },
      { teamId: litigationTeam.id, userId: lawyer2.id, role: 'LEAD' },
      { teamId: litigationTeam.id, userId: paralegal.id, role: 'MEMBER' },
    ],
  })

  console.log('Created teams:', { corporateTeam, litigationTeam })

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      name: 'ABC Corporation Legal Support',
      description: 'Ongoing legal support for ABC Corporation',
      code: 'PROJ-ABC-001',
      status: 'ACTIVE',
      priority: 'HIGH',
      type: 'CLIENT_PROJECT',
      clientId: client1.id,
      teamId: corporateTeam.id,
      managerId: lawyer1.id,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      estimatedHours: 200,
      budget: 500000,
      currency: 'INR',
      tags: JSON.stringify(['corporate', 'ongoing', 'high-priority']),
      milestones: JSON.stringify([
        { name: 'Contract Review', dueDate: '2024-03-31', status: 'COMPLETED' },
        { name: 'Legal Compliance Check', dueDate: '2024-06-30', status: 'IN_PROGRESS' },
        { name: 'Annual Review', dueDate: '2024-12-31', status: 'PENDING' }
      ]),
      deliverables: JSON.stringify([
        'Contract templates',
        'Compliance reports',
        'Legal opinions'
      ]),
      risks: JSON.stringify([
        { risk: 'Regulatory changes', impact: 'HIGH', probability: 'MEDIUM' },
        { risk: 'Client budget constraints', impact: 'MEDIUM', probability: 'LOW' }
      ]),
      isActive: true
    }
  })

  const project2 = await prisma.project.create({
    data: {
      name: 'Property Law Research Initiative',
      description: 'Research project on property law developments',
      code: 'PROJ-RES-001',
      status: 'PLANNING',
      priority: 'MEDIUM',
      type: 'RESEARCH_PROJECT',
      teamId: litigationTeam.id,
      managerId: lawyer2.id,
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-08-31'),
      estimatedHours: 80,
      budget: 100000,
      currency: 'INR',
      tags: JSON.stringify(['research', 'property-law', 'internal']),
      milestones: JSON.stringify([
        { name: 'Literature Review', dueDate: '2024-06-15', status: 'PENDING' },
        { name: 'Case Analysis', dueDate: '2024-07-31', status: 'PENDING' },
        { name: 'Report Preparation', dueDate: '2024-08-31', status: 'PENDING' }
      ]),
      deliverables: JSON.stringify([
        'Research report',
        'Case law database',
        'Best practices guide'
      ]),
      isActive: true
    }
  })

  console.log('Created projects:', { project1, project2 })

  // Create cases
  const case1 = await prisma.case.create({
    data: {
      caseNumber: 'CASE-2024-001',
      title: 'Contract Dispute Resolution',
      description: 'Resolution of contract dispute between ABC Corporation and XYZ Ltd.',
      status: 'OPEN',
      priority: 'HIGH',
      type: 'CIVIL',
      clientId: client1.id,
      assignedLawyerId: lawyer1.id,
      teamId: corporateTeam.id,
      projectId: project1.id,
      defaultAssigneeId: lawyer1.id,
      courtName: 'High Court of Delhi',
      courtLocation: 'New Delhi',
      caseValue: 500000,
      currency: 'INR',
      filingDate: new Date('2024-01-15'),
      expectedCompletionDate: new Date('2024-12-31'),
      tags: JSON.stringify(['contract', 'dispute', 'corporate']),
    },
  })

  const case2 = await prisma.case.create({
    data: {
      caseNumber: 'CASE-2024-002',
      title: 'Property Settlement',
      description: 'Property settlement case for residential property in Mumbai.',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      type: 'REAL_ESTATE',
      clientId: client2.id,
      assignedLawyerId: lawyer2.id,
      teamId: litigationTeam.id,
      projectId: project2.id,
      defaultAssigneeId: lawyer2.id,
      courtName: 'Bombay High Court',
      courtLocation: 'Mumbai',
      caseValue: 2500000,
      currency: 'INR',
      filingDate: new Date('2024-02-01'),
      expectedCompletionDate: new Date('2024-11-30'),
      tags: JSON.stringify(['property', 'settlement', 'real-estate']),
    },
  })

  const case3 = await prisma.case.create({
    data: {
      caseNumber: 'CASE-2024-003',
      title: 'Employment Law Matter',
      description: 'Employment termination dispute and compensation claim.',
      status: 'OPEN',
      priority: 'URGENT',
      type: 'LABOR',
      clientId: client1.id,
      assignedLawyerId: lawyer1.id,
      teamId: corporateTeam.id,
      projectId: project1.id,
      defaultAssigneeId: lawyer1.id,
      courtName: 'Labor Court',
      courtLocation: 'Delhi',
      caseValue: 100000,
      currency: 'INR',
      filingDate: new Date('2024-03-01'),
      expectedCompletionDate: new Date('2024-10-31'),
      tags: JSON.stringify(['employment', 'termination', 'labor']),
    },
  })

  console.log('Created cases:', { case1, case2, case3 })

  // Create parties
  await prisma.party.createMany({
    data: [
      {
        name: 'ABC Corporation',
        type: 'COMPANY',
        role: 'PLAINTIFF',
        caseId: case1.id,
        contactPerson: 'John Smith',
        email: 'john@abc.com',
        phone: '+91-9876543220',
        registrationNumber: 'U12345DL2020ABC123',
        panNumber: 'ABCDE1234F',
      },
      {
        name: 'XYZ Limited',
        type: 'COMPANY',
        role: 'DEFENDANT',
        caseId: case1.id,
        contactPerson: 'Jane Doe',
        email: 'jane@xyz.com',
        phone: '+91-9876543221',
        registrationNumber: 'U67890MH2020XYZ456',
        panNumber: 'XYZAB5678G',
      },
      {
        name: 'Bob Brown',
        type: 'INDIVIDUAL',
        role: 'PLAINTIFF',
        caseId: case2.id,
        email: 'bob@example.com',
        phone: '+91-9876543222',
        address: '123 Main Street, Mumbai',
        city: 'Mumbai',
        state: 'Maharashtra',
      },
    ],
  })

  // Create hearings
  const hearing1 = await prisma.hearing.create({
    data: {
      caseId: case1.id,
      hearingNumber: 'H001',
      type: 'FIRST_HEARING',
      status: 'SCHEDULED',
      scheduledDate: new Date('2024-04-15'),
      scheduledTime: '10:30',
      duration: 60,
      courtName: 'High Court of Delhi',
      courtroom: 'Court Room 1',
      judgeName: 'Justice A. Kumar',
      description: 'First hearing for contract dispute case',
      agenda: 'Preliminary hearing and case management',
      attendees: JSON.stringify([lawyer1.id, paralegal.id]),
    },
  })

  const hearing2 = await prisma.hearing.create({
    data: {
      caseId: case2.id,
      hearingNumber: 'H002',
      type: 'ARGUMENTS',
      status: 'SCHEDULED',
      scheduledDate: new Date('2024-04-20'),
      scheduledTime: '14:00',
      duration: 90,
      courtName: 'Bombay High Court',
      courtroom: 'Court Room 3',
      judgeName: 'Justice B. Patel',
      description: 'Arguments hearing for property settlement',
      agenda: 'Arguments on property ownership and settlement terms',
      attendees: JSON.stringify([lawyer2.id]),
    },
  })

  console.log('Created hearings:', { hearing1, hearing2 })

  // Create orders
  const order1 = await prisma.order.create({
    data: {
      caseId: case1.id,
      orderNumber: 'ORD-001',
      type: 'INTERIM_ORDER',
      status: 'APPROVED',
      priority: 'HIGH',
      title: 'Interim Order for Contract Dispute',
      description: 'Interim order to maintain status quo',
      content: 'The court hereby orders that both parties maintain the current status quo until further orders.',
      courtName: 'High Court of Delhi',
      judgeName: 'Justice A. Kumar',
      orderDate: new Date('2024-03-20'),
      effectiveDate: new Date('2024-03-21'),
      createdBy: lawyer1.id,
      approvedBy: admin.id,
      approvedAt: new Date('2024-03-20'),
      tags: JSON.stringify(['interim', 'status-quo']),
    },
  })

  console.log('Created orders:', { order1 })

  // Create tasks with different categories
  const caseTask = await prisma.task.create({
    data: {
      title: 'Review contract documents',
      description: 'Review the contract agreement for ABC Corporation case',
      category: 'CASE',
      status: 'PENDING',
      priority: 'HIGH',
      caseId: case1.id,
      assignedTo: lawyer1.id,
      createdBy: admin.id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      estimatedHours: 8,
      tags: JSON.stringify(['contract', 'review', 'urgent']),
    },
  })

  const personalTask = await prisma.task.create({
    data: {
      title: 'Update professional profile',
      description: 'Update LinkedIn and professional profiles',
      category: 'PERSONAL',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      assignedTo: lawyer1.id,
      createdBy: lawyer1.id,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      estimatedHours: 2,
      progress: 50,
    },
  })

  const adminTask = await prisma.task.create({
    data: {
      title: 'Update office policies',
      description: 'Review and update office policies and procedures',
      category: 'ADMIN',
      status: 'PENDING',
      priority: 'LOW',
      assignedTo: admin.id,
      createdBy: admin.id,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      estimatedHours: 4,
    },
  })

  const bizDevTask = await prisma.task.create({
    data: {
      title: 'Client outreach campaign',
      description: 'Plan and execute client outreach campaign for Q2',
      category: 'BIZDEV',
      status: 'PENDING',
      priority: 'HIGH',
      assignedTo: lawyer2.id,
      createdBy: admin.id,
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days
      estimatedHours: 12,
    },
  })

  const completedTask = await prisma.task.create({
    data: {
      title: 'File initial documents',
      description: 'File initial case documents with the court',
      category: 'CASE',
      status: 'COMPLETED',
      priority: 'URGENT',
      caseId: case1.id,
      assignedTo: paralegal.id,
      createdBy: lawyer1.id,
      completedAt: new Date(),
      actualHours: 3,
      progress: 100,
    },
  })

  console.log('Created tasks:', { caseTask, personalTask, adminTask, bizDevTask, completedTask })

  // Create subtasks
  const subtask1 = await prisma.subtask.create({
    data: {
      taskId: caseTask.id,
      title: 'Read contract terms',
      description: 'Read and understand all contract terms',
      status: 'PENDING',
      priority: 'HIGH',
      assignedTo: lawyer1.id,
      createdBy: admin.id,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
      estimatedHours: 3,
      order: 1,
    },
  })

  const subtask2 = await prisma.subtask.create({
    data: {
      taskId: caseTask.id,
      title: 'Identify legal issues',
      description: 'Identify potential legal issues in the contract',
      status: 'PENDING',
      priority: 'HIGH',
      assignedTo: lawyer1.id,
      createdBy: admin.id,
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days
      estimatedHours: 5,
      order: 2,
      dependencies: JSON.stringify([subtask1.id]),
    },
  })

  console.log('Created subtasks:', { subtask1, subtask2 })

  // Create worklogs
  const worklog1 = await prisma.worklog.create({
    data: {
      userId: lawyer1.id,
      caseId: case1.id,
      taskId: completedTask.id,
      type: 'CASE_WORK',
      status: 'APPROVED',
      date: new Date(),
      startTime: '09:00',
      endTime: '12:00',
      duration: 3,
      description: 'Filed initial case documents with the court',
      activities: JSON.stringify(['Document preparation', 'Court filing', 'Follow-up']),
      billableHours: 3,
      hourlyRate: 2000,
      totalAmount: 6000,
      location: 'High Court of Delhi',
      isBillable: true,
      approvedBy: admin.id,
      approvedAt: new Date(),
    },
  })

  const worklog2 = await prisma.worklog.create({
    data: {
      userId: lawyer2.id,
      type: 'RESEARCH',
      status: 'SUBMITTED',
      date: new Date(),
      startTime: '14:00',
      endTime: '16:00',
      duration: 2,
      description: 'Research on property settlement laws',
      activities: JSON.stringify(['Legal research', 'Case law review']),
      billableHours: 2,
      hourlyRate: 1800,
      totalAmount: 3600,
      isBillable: true,
    },
  })

  console.log('Created worklogs:', { worklog1, worklog2 })

  // Create leave requests
  const leaveRequest1 = await prisma.leaveRequest.create({
    data: {
      userId: lawyer1.id,
      type: 'ANNUAL_LEAVE',
      status: 'APPROVED',
      duration: 'FULL_DAY',
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-05-03'),
      totalDays: 3,
      reason: 'Family vacation',
      appliedBy: lawyer1.id,
      appliedAt: new Date('2024-04-01'),
      approvedBy: admin.id,
      approvedAt: new Date('2024-04-02'),
    },
  })

  const leaveRequest2 = await prisma.leaveRequest.create({
    data: {
      userId: paralegal.id,
      type: 'SICK_LEAVE',
      status: 'PENDING',
      duration: 'FULL_DAY',
      startDate: new Date('2024-04-25'),
      endDate: new Date('2024-04-25'),
      totalDays: 1,
      reason: 'Medical appointment',
      appliedBy: paralegal.id,
      appliedAt: new Date(),
    },
  })

  console.log('Created leave requests:', { leaveRequest1, leaveRequest2 })

  // Create audit logs
  await prisma.auditLog.createMany({
    data: [
      {
        userId: admin.id,
        action: 'CREATE',
        entityType: 'CASE',
        entityId: case1.id,
        entityName: 'Contract Dispute Resolution',
        severity: 'MEDIUM',
        description: 'Created new case: Contract Dispute Resolution',
        ipAddress: '192.168.1.100',
        resource: '/api/cases',
        method: 'POST',
        statusCode: 201,
      },
      {
        userId: lawyer1.id,
        action: 'UPDATE',
        entityType: 'TASK',
        entityId: caseTask.id,
        entityName: 'Review contract documents',
        severity: 'LOW',
        description: 'Updated task status to IN_PROGRESS',
        ipAddress: '192.168.1.101',
        resource: '/api/tasks',
        method: 'PATCH',
        statusCode: 200,
      },
      {
        userId: admin.id,
        action: 'APPROVE',
        entityType: 'WORKLOG',
        entityId: worklog1.id,
        entityName: 'Filed initial case documents',
        severity: 'LOW',
        description: 'Approved worklog for case work',
        ipAddress: '192.168.1.100',
        resource: '/api/worklogs',
        method: 'PATCH',
        statusCode: 200,
      },
    ],
  })

  // Create user pending summaries
  const summary1 = await prisma.userPendingSummary.create({
    data: {
      userId: lawyer1.id,
      date: new Date(),
      pendingCases: 2,
      urgentCases: 1,
      pendingTasks: 3,
      urgentTasks: 1,
      personalTasks: 1,
      adminTasks: 0,
      bizDevTasks: 0,
      pendingSubtasks: 2,
      upcomingHearings: 1,
      hearingsThisWeek: 1,
      hearingsToday: 0,
      pendingOrders: 0,
      ordersToExecute: 0,
      pendingWorklogs: 0,
      worklogsToApprove: 0,
      pendingLeaveRequests: 0,
      leaveRequestsToApprove: 1,
      totalPendingItems: 8,
      totalUrgentItems: 2,
      totalOverdueItems: 0,
      highPriorityItems: 2,
      mediumPriorityItems: 3,
      lowPriorityItems: 3,
      itemsDueToday: 1,
      itemsDueThisWeek: 3,
      itemsDueThisMonth: 5,
      workloadLevel: 'HIGH',
      estimatedHoursToComplete: 15,
    },
  })

  const summary2 = await prisma.userPendingSummary.create({
    data: {
      userId: lawyer2.id,
      date: new Date(),
      pendingCases: 1,
      urgentCases: 0,
      pendingTasks: 1,
      urgentTasks: 0,
      personalTasks: 0,
      adminTasks: 0,
      bizDevTasks: 1,
      pendingSubtasks: 0,
      upcomingHearings: 1,
      hearingsThisWeek: 1,
      hearingsToday: 0,
      pendingOrders: 0,
      ordersToExecute: 0,
      pendingWorklogs: 1,
      worklogsToApprove: 0,
      pendingLeaveRequests: 0,
      leaveRequestsToApprove: 0,
      totalPendingItems: 4,
      totalUrgentItems: 0,
      totalOverdueItems: 0,
      highPriorityItems: 0,
      mediumPriorityItems: 2,
      lowPriorityItems: 2,
      itemsDueToday: 0,
      itemsDueThisWeek: 2,
      itemsDueThisMonth: 3,
      workloadLevel: 'MODERATE',
      estimatedHoursToComplete: 8,
    },
  })

  console.log('Created user pending summaries:', { summary1, summary2 })

  // Create SLA rules
  const slaRule1 = await prisma.sLARule.create({
    data: {
      name: 'Case Response Time - High Priority',
      description: 'High priority cases must be responded to within 4 hours',
      entityType: 'CASE',
      entitySubType: null,
      priority: 'HIGH',
      teamId: null,
      conditions: JSON.stringify({
        entityType: 'CASE',
        priority: 'HIGH'
      }),
      metrics: JSON.stringify({
        metricType: 'RESPONSE_TIME',
        threshold: 4,
        unit: 'HOURS',
        calculationMethod: 'SUM'
      }),
      escalationRules: JSON.stringify([
        {
          level: 1,
          threshold: 4,
          action: 'NOTIFY',
          recipients: ['assignedLawyer'],
          message: 'High priority case response time exceeded'
        },
        {
          level: 2,
          threshold: 8,
          action: 'ESCALATE',
          recipients: ['teamLead'],
          message: 'High priority case response time severely exceeded'
        }
      ]),
      notifications: JSON.stringify({
        enabled: true,
        channels: ['EMAIL', 'IN_APP'],
        recipients: ['assignedLawyer', 'teamLead'],
        frequency: 'IMMEDIATE'
      }),
      isActive: true
    }
  })

  const slaRule2 = await prisma.sLARule.create({
    data: {
      name: 'Task Resolution Time - Medium Priority',
      description: 'Medium priority tasks must be resolved within 3 days',
      entityType: 'TASK',
      entitySubType: null,
      priority: 'MEDIUM',
      teamId: null,
      conditions: JSON.stringify({
        entityType: 'TASK',
        priority: 'MEDIUM'
      }),
      metrics: JSON.stringify({
        metricType: 'RESOLUTION_TIME',
        threshold: 72,
        unit: 'HOURS',
        calculationMethod: 'SUM'
      }),
      escalationRules: JSON.stringify([
        {
          level: 1,
          threshold: 72,
          action: 'NOTIFY',
          recipients: ['assignee'],
          message: 'Medium priority task resolution time exceeded'
        }
      ]),
      notifications: JSON.stringify({
        enabled: true,
        channels: ['IN_APP'],
        recipients: ['assignee'],
        frequency: 'DAILY'
      }),
      isActive: true
    }
  })

  const slaRule3 = await prisma.sLARule.create({
    data: {
      name: 'Hearing Preparation Time',
      description: 'Hearings must be prepared within 2 days',
      entityType: 'HEARING',
      entitySubType: null,
      priority: null,
      teamId: null,
      conditions: JSON.stringify({
        entityType: 'HEARING'
      }),
      metrics: JSON.stringify({
        metricType: 'RESOLUTION_TIME',
        threshold: 48,
        unit: 'HOURS',
        calculationMethod: 'SUM'
      }),
      escalationRules: JSON.stringify([
        {
          level: 1,
          threshold: 48,
          action: 'NOTIFY',
          recipients: ['assignedLawyer'],
          message: 'Hearing preparation time exceeded'
        }
      ]),
      notifications: JSON.stringify({
        enabled: true,
        channels: ['EMAIL', 'IN_APP'],
        recipients: ['assignedLawyer'],
        frequency: 'IMMEDIATE'
      }),
      isActive: true
    }
  })

  console.log('Created SLA rules:', { slaRule1, slaRule2, slaRule3 })

  console.log('Comprehensive seed completed successfully!')
  console.log(`Created on: ${new Date().toISOString()}`)
  console.log('Summary:')
  console.log(`- Users: ${await prisma.user.count()}`)
  console.log(`- Employees: ${await prisma.employee.count()}`)
  console.log(`- Teams: ${await prisma.team.count()}`)
  console.log(`- Projects: ${await prisma.project.count()}`)
  console.log(`- Cases: ${await prisma.case.count()}`)
  console.log(`- Parties: ${await prisma.party.count()}`)
  console.log(`- Hearings: ${await prisma.hearing.count()}`)
  console.log(`- Orders: ${await prisma.order.count()}`)
  console.log(`- Tasks: ${await prisma.task.count()}`)
  console.log(`- Subtasks: ${await prisma.subtask.count()}`)
  console.log(`- Worklogs: ${await prisma.worklog.count()}`)
  console.log(`- Leave Requests: ${await prisma.leaveRequest.count()}`)
  console.log(`- SLA Rules: ${await prisma.sLARule.count()}`)
  console.log(`- SLA Evaluations: ${await prisma.sLAEvaluation.count()}`)
  console.log(`- Audit Logs: ${await prisma.auditLog.count()}`)
  console.log(`- User Pending Summaries: ${await prisma.userPendingSummary.count()}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })