# Enhanced Entity Management & SLA System Documentation

This document provides comprehensive documentation for the enhanced entity management system, including Employee, Team, Project entities, SLA rules table with evaluator, and Case-Team linkage with default assignees.

## Overview

The Enhanced Entity Management & SLA System provides:
- **Employee Management**: Comprehensive employee profiles with hierarchy and skills
- **Team Management**: Team structures with leads and members
- **Project Management**: Project tracking with milestones and deliverables
- **SLA Rules Engine**: JSON-configurable SLA rules with automatic evaluation
- **SLA Evaluator Service**: Real-time SLA compliance monitoring
- **Case-Team Integration**: Cases linked to teams with default assignees
- **Escalation Management**: Automated escalation based on SLA breaches

## System Architecture

### Core Entities

#### **Employee Entity**
- **Purpose**: Comprehensive employee profiles and hierarchy management
- **Features**: Skills, certifications, reporting structure, employment details
- **Relations**: User, reporting hierarchy, team memberships, SLA evaluations

#### **Team Entity**
- **Purpose**: Team organization and management
- **Features**: Team leads, members, departments, SLA rules
- **Relations**: Lead user, team members, cases, projects, SLA rules

#### **Project Entity**
- **Purpose**: Project tracking and management
- **Features**: Milestones, deliverables, risks, budget tracking
- **Relations**: Client, team, manager, cases

#### **SLA Rules Engine**
- **Purpose**: Configurable SLA rules with JSON-based conditions
- **Features**: Entity-specific rules, escalation, notifications
- **Relations**: Teams, evaluations

#### **SLA Evaluator Service**
- **Purpose**: Real-time SLA compliance monitoring
- **Features**: Automatic evaluation, breach detection, escalation
- **Integration**: Database repositories, notification systems

### Data Flow

1. **Entity Creation** → Employee/Team/Project entities created
2. **SLA Rule Definition** → JSON-configured SLA rules created
3. **Case Assignment** → Cases linked to teams with default assignees
4. **SLA Evaluation** → Automatic evaluation triggered on entity changes
5. **Breach Detection** → SLA breaches detected and logged
6. **Escalation** → Automatic escalation based on breach severity
7. **Notification** → Stakeholders notified of breaches and escalations

## Database Schema

### Employee Entity

```sql
CREATE TABLE employees (
  id TEXT PRIMARY KEY,
  employee_id TEXT UNIQUE NOT NULL,
  user_id TEXT UNIQUE NOT NULL,
  department TEXT,
  designation TEXT,
  reporting_manager TEXT,
  employment_type TEXT DEFAULT 'FULL_TIME',
  work_location TEXT,
  work_schedule TEXT, -- JSON
  skills TEXT DEFAULT '[]', -- JSON array
  certifications TEXT DEFAULT '[]', -- JSON array
  experience REAL,
  salary REAL,
  currency TEXT DEFAULT 'INR',
  joining_date DATETIME,
  probation_end_date DATETIME,
  confirmation_date DATETIME,
  last_promotion_date DATETIME,
  next_review_date DATETIME,
  is_active BOOLEAN DEFAULT true,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (reporting_manager) REFERENCES employees(employee_id)
);
```

### Project Entity

```sql
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'PLANNING',
  priority TEXT DEFAULT 'MEDIUM',
  type TEXT DEFAULT 'CLIENT_PROJECT',
  client_id TEXT,
  team_id TEXT,
  manager_id TEXT,
  start_date DATETIME,
  end_date DATETIME,
  estimated_hours REAL,
  actual_hours REAL,
  budget REAL,
  currency TEXT DEFAULT 'INR',
  tags TEXT DEFAULT '[]', -- JSON array
  milestones TEXT DEFAULT '[]', -- JSON array
  deliverables TEXT DEFAULT '[]', -- JSON array
  risks TEXT DEFAULT '[]', -- JSON array
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (client_id) REFERENCES users(id),
  FOREIGN KEY (team_id) REFERENCES teams(id),
  FOREIGN KEY (manager_id) REFERENCES users(id)
);
```

### SLA Rules Entity

```sql
CREATE TABLE sla_rules (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  entity_type TEXT NOT NULL,
  entity_sub_type TEXT,
  priority TEXT,
  team_id TEXT,
  conditions TEXT NOT NULL, -- JSON
  metrics TEXT NOT NULL, -- JSON
  escalation_rules TEXT NOT NULL, -- JSON
  notifications TEXT NOT NULL, -- JSON
  is_active BOOLEAN DEFAULT true,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (team_id) REFERENCES teams(id)
);
```

### SLA Evaluations Entity

```sql
CREATE TABLE sla_evaluations (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  sla_rule_id TEXT NOT NULL,
  employee_id TEXT,
  status TEXT DEFAULT 'PENDING',
  current_value REAL,
  threshold_value REAL,
  breach_date DATETIME,
  escalation_date DATETIME,
  resolution_date DATETIME,
  notes TEXT,
  metadata TEXT DEFAULT '{}', -- JSON
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (sla_rule_id) REFERENCES sla_rules(id),
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);
```

### Enhanced Case Entity

```sql
ALTER TABLE cases ADD COLUMN project_id TEXT;
ALTER TABLE cases ADD COLUMN default_assignee_id TEXT;

ALTER TABLE cases ADD FOREIGN KEY (project_id) REFERENCES projects(id);
ALTER TABLE cases ADD FOREIGN KEY (default_assignee_id) REFERENCES users(id);
```

## SLA Rules Configuration

### SLA Conditions

```typescript
interface SLAConditions {
  entityType: string
  entitySubType?: string
  priority?: string
  teamId?: string
  customConditions?: Record<string, any>
}
```

### SLA Metrics

```typescript
interface SLAMetrics {
  metricType: 'RESPONSE_TIME' | 'RESOLUTION_TIME' | 'UPTIME' | 'CUSTOM'
  threshold: number
  unit: 'HOURS' | 'DAYS' | 'PERCENTAGE' | 'COUNT'
  calculationMethod: 'SUM' | 'AVERAGE' | 'MAX' | 'MIN' | 'COUNT'
}
```

### Escalation Rules

```typescript
interface SLAEscalationRule {
  level: number
  threshold: number
  action: 'NOTIFY' | 'ASSIGN' | 'ESCALATE' | 'AUTO_RESOLVE'
  recipients: string[]
  message: string
}
```

### Notification Settings

```typescript
interface SLANotificationSettings {
  enabled: boolean
  channels: ('EMAIL' | 'SMS' | 'PUSH' | 'IN_APP')[]
  recipients: string[]
  frequency: 'IMMEDIATE' | 'HOURLY' | 'DAILY' | 'WEEKLY'
}
```

## SLA Evaluator Service

### Core Methods

#### **evaluateSLA**
```typescript
async evaluateSLA(context: SLAEvaluationContext): Promise<SLAEvaluationResult[]>
```

Evaluates SLA compliance for a specific entity.

#### **getEntityEvaluations**
```typescript
async getEntityEvaluations(entityId: string, entityType: string): Promise<SLAEvaluation[]>
```

Gets all SLA evaluations for a specific entity.

#### **getSLABreachSummary**
```typescript
async getSLABreachSummary(teamId?: string, dateRange?: { start: Date; end: Date }): Promise<SLAEvaluation[]>
```

Gets summary of SLA breaches with optional filters.

#### **createDefaultSLARules**
```typescript
async createDefaultSLARules(): Promise<void>
```

Creates default SLA rules for common scenarios.

### Evaluation Process

1. **Context Analysis**: Analyze entity context (type, priority, team)
2. **Rule Matching**: Find applicable SLA rules based on conditions
3. **Metric Calculation**: Calculate current metric values
4. **Status Determination**: Determine SLA status based on thresholds
5. **Breach Detection**: Detect breaches and set breach dates
6. **Escalation**: Trigger escalation based on breach severity
7. **Notification**: Send notifications to stakeholders
8. **Database Storage**: Store evaluation results

## Repository Classes

### EmployeeRepository

```typescript
class EmployeeRepository {
  async create(data: CreateEmployee): Promise<Employee>
  async findById(id: string): Promise<Employee | null>
  async findByEmployeeId(employeeId: string): Promise<Employee | null>
  async findByUserId(userId: string): Promise<Employee | null>
  async findMany(filters?: EmployeeFilters): Promise<Employee[]>
  async update(id: string, data: UpdateEmployee): Promise<Employee>
  async delete(id: string): Promise<void>
  async getReportingHierarchy(employeeId: string): Promise<Employee[]>
  async getDepartmentEmployees(department: string): Promise<Employee[]>
}
```

### ProjectRepository

```typescript
class ProjectRepository {
  async create(data: CreateProject): Promise<Project>
  async findById(id: string): Promise<Project | null>
  async findByCode(code: string): Promise<Project | null>
  async findMany(filters?: ProjectFilters): Promise<Project[]>
  async update(id: string, data: UpdateProject): Promise<Project>
  async delete(id: string): Promise<void>
  async getTeamProjects(teamId: string): Promise<Project[]>
  async getClientProjects(clientId: string): Promise<Project[]>
}
```

### SLARuleRepository

```typescript
class SLARuleRepository {
  async create(data: CreateSLARule): Promise<SLARule>
  async findById(id: string): Promise<SLARule | null>
  async findMany(filters?: SLARuleFilters): Promise<SLARule[]>
  async update(id: string, data: UpdateSLARule): Promise<SLARule>
  async delete(id: string): Promise<void>
  async getApplicableRules(context: EvaluationContext): Promise<SLARule[]>
  async getTeamSLARules(teamId: string): Promise<SLARule[]>
}
```

### SLAEvaluationRepository

```typescript
class SLAEvaluationRepository {
  async create(data: CreateSLAEvaluation): Promise<SLAEvaluation>
  async findById(id: string): Promise<SLAEvaluation | null>
  async findMany(filters?: SLAEvaluationFilters): Promise<SLAEvaluation[]>
  async update(id: string, data: UpdateSLAEvaluation): Promise<SLAEvaluation>
  async delete(id: string): Promise<void>
  async getEntityEvaluations(entityId: string, entityType: string): Promise<SLAEvaluation[]>
  async getBreachSummary(filters?: BreachSummaryFilters): Promise<SLAEvaluation[]>
}
```

## Usage Examples

### Employee Management

```typescript
import { employeeRepository } from 'data'

// Create employee
const employee = await employeeRepository.create({
  employeeId: 'EMP001',
  userId: 'user-123',
  department: 'LEGAL',
  designation: 'Senior Associate',
  employmentType: 'FULL_TIME',
  workLocation: 'Delhi Office',
  skills: JSON.stringify(['Contract Law', 'Corporate Law']),
  experience: 5.5,
  salary: 150000
})

// Get reporting hierarchy
const hierarchy = await employeeRepository.getReportingHierarchy('EMP001')
console.log('Reporting hierarchy:', hierarchy)
```

### Project Management

```typescript
import { projectRepository } from 'data'

// Create project
const project = await projectRepository.create({
  name: 'ABC Corporation Legal Support',
  code: 'PROJ-ABC-001',
  status: 'ACTIVE',
  priority: 'HIGH',
  type: 'CLIENT_PROJECT',
  clientId: 'client-123',
  teamId: 'team-123',
  managerId: 'manager-123',
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-12-31'),
  budget: 500000,
  milestones: JSON.stringify([
    { name: 'Contract Review', dueDate: '2024-03-31', status: 'COMPLETED' }
  ])
})

// Get team projects
const teamProjects = await projectRepository.getTeamProjects('team-123')
console.log('Team projects:', teamProjects)
```

### SLA Rule Configuration

```typescript
import { slaRuleRepository } from 'data'

// Create SLA rule
const slaRule = await slaRuleRepository.create({
  name: 'Case Response Time - High Priority',
  description: 'High priority cases must be responded to within 4 hours',
  entityType: 'CASE',
  priority: 'HIGH',
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
    }
  ]),
  notifications: JSON.stringify({
    enabled: true,
    channels: ['EMAIL', 'IN_APP'],
    recipients: ['assignedLawyer'],
    frequency: 'IMMEDIATE'
  })
})
```

### SLA Evaluation

```typescript
import { slaEvaluator } from 'data'

// Evaluate SLA for a case
const context = {
  entityId: 'case-123',
  entityType: 'CASE',
  priority: 'HIGH',
  teamId: 'team-123',
  employeeId: 'emp-123'
}

const results = await slaEvaluator.evaluateSLA(context)
console.log('SLA evaluation results:', results)

// Get breach summary
const breaches = await slaEvaluator.getSLABreachSummary('team-123')
console.log('SLA breaches:', breaches)
```

### Case-Team Integration

```typescript
import { caseRepository } from 'data'

// Create case with team and default assignee
const case = await caseRepository.create({
  caseNumber: 'CASE-2024-001',
  title: 'Contract Dispute Resolution',
  status: 'OPEN',
  priority: 'HIGH',
  type: 'CIVIL',
  clientId: 'client-123',
  assignedLawyerId: 'lawyer-123',
  teamId: 'team-123',
  projectId: 'project-123',
  defaultAssigneeId: 'lawyer-123',
  courtName: 'High Court of Delhi',
  caseValue: 500000
})

// Get team cases
const teamCases = await caseRepository.findMany({
  teamId: 'team-123'
})
console.log('Team cases:', teamCases)
```

## Default SLA Rules

The system includes default SLA rules for common scenarios:

### Case Response Time Rules
- **High Priority Cases**: 4-hour response time
- **Medium Priority Cases**: 24-hour response time
- **Low Priority Cases**: 72-hour response time

### Task Resolution Rules
- **High Priority Tasks**: 24-hour resolution time
- **Medium Priority Tasks**: 72-hour resolution time
- **Low Priority Tasks**: 168-hour resolution time

### Hearing Preparation Rules
- **All Hearings**: 48-hour preparation time
- **Urgent Hearings**: 24-hour preparation time

### Order Execution Rules
- **High Priority Orders**: 24-hour execution time
- **Medium Priority Orders**: 72-hour execution time

## Testing

### Test Suite

The system includes comprehensive test suites:

```typescript
import { SLAEvaluatorTester, runSLAEvaluatorTests } from 'data'

// Run SLA evaluator tests
await runSLAEvaluatorTests()

// Run specific tests
const tester = new SLAEvaluatorTester()
await tester.testSLAEvaluator()
```

### Test Coverage

- **Basic Evaluation**: SLA evaluation for different entity types
- **Entity Type Evaluation**: Evaluation for all supported entity types
- **SLA Conditions**: Testing of various SLA conditions
- **Metric Calculations**: Testing of different metric calculations
- **Escalation Rules**: Testing of escalation mechanisms
- **Breach Summary**: Testing of breach summary functionality

## Security Considerations

### Data Security

- **Input Validation**: All inputs validated using Zod schemas
- **JSON Parsing**: Safe JSON parsing for configuration data
- **Access Control**: Role-based access control for SLA management
- **Audit Logging**: All SLA evaluations logged for audit

### Performance Considerations

### Optimization

- **Database Indexing**: Optimized indexes for SLA queries
- **Caching**: SLA rule caching for performance
- **Batch Processing**: Batch SLA evaluation for multiple entities
- **Background Processing**: Non-blocking SLA evaluation

## Future Enhancements

### Planned Features

- **AI-Powered SLA**: Machine learning-based SLA prediction
- **Dynamic Thresholds**: Adaptive SLA thresholds based on historical data
- **Advanced Analytics**: SLA performance analytics and reporting
- **Integration APIs**: External system integration for SLA data
- **Mobile Notifications**: Push notifications for SLA breaches
- **Dashboard Integration**: SLA dashboard with real-time monitoring

### Performance Improvements

- **Real-Time Evaluation**: Real-time SLA evaluation using WebSockets
- **Distributed Processing**: Distributed SLA evaluation across multiple nodes
- **Advanced Caching**: Redis-based caching for SLA rules and evaluations
- **Optimized Queries**: Query optimization for large-scale SLA evaluation

This Enhanced Entity Management & SLA System provides a comprehensive solution for employee management, team organization, project tracking, and SLA compliance monitoring while maintaining high performance and security standards.
