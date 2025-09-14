export type ClientType = 'Individual' | 'Company';

export type Client = {
  id: string;
  type: ClientType;
  name: string;            // Individual name or Company name
  contactPerson?: string;  // for Company
  email?: string;
  phone?: string;
  altPhone?: string;
  address1?: string;
  city?: string;
  state?: string;
  pincode?: string;
  pan?: string;
  gstin?: string;
  notes?: string;
  createdAt: string;
};

// Seed data for the contacts page
export const seedClients: Client[] = [
  {
    id: '1',
    type: 'Individual',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91 98765 43210',
    altPhone: '+91 98765 43211',
    address1: '123 MG Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    pan: 'ABCDE1234F',
    notes: 'Regular client, prefers email communication',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    type: 'Company',
    name: 'TechCorp Industries Ltd',
    contactPerson: 'Priya Sharma',
    email: 'legal@techcorp.com',
    phone: '+91 22 1234 5678',
    altPhone: '+91 22 1234 5679',
    address1: '456 Business Park, Sector 5',
    city: 'Gurgaon',
    state: 'Haryana',
    pincode: '122001',
    pan: 'TECH1234567',
    gstin: '06TECH1234567Z1',
    notes: 'Large corporate client, requires detailed documentation',
    createdAt: '2024-01-20T14:15:00Z'
  },
  {
    id: '3',
    type: 'Individual',
    name: 'Dr. Anjali Mehta',
    email: 'anjali.mehta@hospital.com',
    phone: '+91 98765 12345',
    address1: '789 Medical Complex',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    pan: 'MEHTA567890',
    notes: 'Medical professional, needs IP protection',
    createdAt: '2024-02-01T09:45:00Z'
  },
  {
    id: '4',
    type: 'Company',
    name: 'InnovateLabs LLC',
    contactPerson: 'Vikram Singh',
    email: 'legal@innovatelabs.com',
    phone: '+91 11 9876 5432',
    address1: '321 Innovation Hub',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110001',
    pan: 'INNO9876543',
    gstin: '07INNO9876543Z2',
    notes: 'Startup company, needs comprehensive legal support',
    createdAt: '2024-02-10T16:20:00Z'
  },
  {
    id: '5',
    type: 'Individual',
    name: 'Suresh Patel',
    email: 'suresh.patel@business.com',
    phone: '+91 98765 67890',
    altPhone: '+91 98765 67891',
    address1: '654 Commercial Street',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380001',
    pan: 'PATEL3456789',
    notes: 'Business owner, requires contract review services',
    createdAt: '2024-02-15T11:00:00Z'
  },
  {
    id: '6',
    type: 'Company',
    name: 'Global Solutions Inc',
    contactPerson: 'Neha Gupta',
    email: 'legal@globalsolutions.com',
    phone: '+91 44 8765 4321',
    address1: '987 Corporate Plaza',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600001',
    pan: 'GLOBAL2345678',
    notes: 'International company, needs cross-border legal advice',
    createdAt: '2024-02-20T13:30:00Z'
  }
];

export const clientTypeColors = {
  Individual: 'bg-blue-100 text-blue-800 border-blue-200',
  Company: 'bg-green-100 text-green-800 border-green-200',
} as const;

