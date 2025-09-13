export type Role = 'Partner' | 'Associate' | 'Clerk' | 'Intern';

export type Employee = {
  id: string;
  name: string;
  role: Role;
  email?: string;
};

export type FilterType = 'All' | Role;

// Seed data for the team page
export const seedEmployees: Employee[] = [
  // Partners
  { id: '1', name: 'Sarah Johnson', role: 'Partner', email: 'sarah.johnson@lnnlegal.com' },
  { id: '2', name: 'Michael Chen', role: 'Partner', email: 'michael.chen@lnnlegal.com' },
  
  // Associates
  { id: '3', name: 'Emily Rodriguez', role: 'Associate', email: 'emily.rodriguez@lnnlegal.com' },
  { id: '4', name: 'David Kim', role: 'Associate', email: 'david.kim@lnnlegal.com' },
  { id: '5', name: 'Lisa Thompson', role: 'Associate', email: 'lisa.thompson@lnnlegal.com' },
  
  // Clerks
  { id: '6', name: 'James Wilson', role: 'Clerk', email: 'james.wilson@lnnlegal.com' },
  { id: '7', name: 'Maria Garcia', role: 'Clerk', email: 'maria.garcia@lnnlegal.com' },
  
  // Interns
  { id: '8', name: 'Alex Patel', role: 'Intern', email: 'alex.patel@lnnlegal.com' },
  { id: '9', name: 'Sophie Brown', role: 'Intern', email: 'sophie.brown@lnnlegal.com' },
];

export const roleColors = {
  Partner: 'bg-purple-100 text-purple-800 border-purple-200',
  Associate: 'bg-blue-100 text-blue-800 border-blue-200',
  Clerk: 'bg-green-100 text-green-800 border-green-200',
  Intern: 'bg-orange-100 text-orange-800 border-orange-200',
} as const;
