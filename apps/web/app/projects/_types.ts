export type ProjectType = 'Client' | 'Internal' | 'BizDev' | 'Admin';

export type Project = {
  id: string;
  name: string;
  type: ProjectType;
  clientName?: string;
  description?: string;
  createdAt: string;
};

// Seed data for the projects page
export const seedProjects: Project[] = [
  {
    id: '1',
    name: 'Corporate Merger Documentation',
    type: 'Client',
    clientName: 'TechCorp Industries',
    description: 'Legal documentation for merger with subsidiary company',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Employee Handbook Update',
    type: 'Internal',
    description: 'Update company policies and procedures handbook',
    createdAt: '2024-01-20T14:15:00Z'
  },
  {
    id: '3',
    name: 'New Client Acquisition Strategy',
    type: 'BizDev',
    description: 'Develop strategy for expanding client base in tech sector',
    createdAt: '2024-02-01T09:45:00Z'
  },
  {
    id: '4',
    name: 'IP Portfolio Management',
    type: 'Client',
    clientName: 'InnovateLabs LLC',
    description: 'Manage intellectual property portfolio and filings',
    createdAt: '2024-02-10T16:20:00Z'
  },
  {
    id: '5',
    name: 'System Security Audit',
    type: 'Admin',
    description: 'Conduct comprehensive security audit of internal systems',
    createdAt: '2024-02-15T11:00:00Z'
  }
];

export const projectTypeColors = {
  Client: 'bg-blue-100 text-blue-800 border-blue-200',
  Internal: 'bg-green-100 text-green-800 border-green-200',
  BizDev: 'bg-purple-100 text-purple-800 border-purple-200',
  Admin: 'bg-orange-100 text-orange-800 border-orange-200',
} as const;
