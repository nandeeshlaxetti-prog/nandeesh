export type ProjectType = 'Client' | 'Internal' | 'BizDev' | 'Admin';

export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed';

export type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent';

export type Project = {
  id: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  priority: ProjectPriority;
  clientName?: string;
  description?: string;
  assigneeId?: string; // Team member assigned to project
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
};

// Seed data for the projects page
export const seedProjects: Project[] = [
  {
    id: '1',
    name: 'Corporate Merger Documentation',
    type: 'Client',
    status: 'active',
    priority: 'high',
    clientName: 'TechCorp Industries',
    description: 'Legal documentation for merger with subsidiary company',
    assigneeId: '1', // Sarah Johnson (Partner)
    dueDate: '2024-10-15',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-09-13T10:30:00Z'
  },
  {
    id: '2',
    name: 'Employee Handbook Update',
    type: 'Internal',
    status: 'planning',
    priority: 'medium',
    description: 'Update company policies and procedures handbook',
    assigneeId: '3', // Emily Rodriguez (Associate)
    dueDate: '2024-11-01',
    createdAt: '2024-01-20T14:15:00Z',
    updatedAt: '2024-09-13T14:15:00Z'
  },
  {
    id: '3',
    name: 'New Client Acquisition Strategy',
    type: 'BizDev',
    status: 'active',
    priority: 'medium',
    description: 'Develop strategy for expanding client base in tech sector',
    assigneeId: '2', // Michael Chen (Partner)
    dueDate: '2024-12-31',
    createdAt: '2024-02-01T09:45:00Z',
    updatedAt: '2024-09-13T09:45:00Z'
  },
  {
    id: '4',
    name: 'IP Portfolio Management',
    type: 'Client',
    status: 'on-hold',
    priority: 'low',
    clientName: 'InnovateLabs LLC',
    description: 'Manage intellectual property portfolio and filings',
    assigneeId: '4', // David Kim (Associate)
    dueDate: '2024-09-30',
    createdAt: '2024-02-10T16:20:00Z',
    updatedAt: '2024-09-13T16:20:00Z'
  },
  {
    id: '5',
    name: 'System Security Audit',
    type: 'Admin',
    status: 'completed',
    priority: 'high',
    description: 'Conduct comprehensive security audit of internal systems',
    assigneeId: '6', // James Wilson (Clerk)
    dueDate: '2024-08-31',
    createdAt: '2024-02-15T11:00:00Z',
    updatedAt: '2024-09-13T11:00:00Z'
  }
];

export const projectTypeColors = {
  Client: 'bg-blue-100 text-blue-800 border-blue-200',
  Internal: 'bg-green-100 text-green-800 border-green-200',
  BizDev: 'bg-purple-100 text-purple-800 border-purple-200',
  Admin: 'bg-orange-100 text-orange-800 border-orange-200',
} as const;

export const projectStatusColors = {
  planning: 'bg-gray-100 text-gray-800 border-gray-200',
  active: 'bg-blue-100 text-blue-800 border-blue-200',
  'on-hold': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
} as const;

export const projectPriorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
} as const;
