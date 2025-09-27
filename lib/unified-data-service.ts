// Unified Data Service - Mock implementation
export interface UnifiedCase {
  id: string;
  cnrNumber: string;
  caseNumber: string;
  title: string;
  status: string;
  courtName: string;
  filingDate: string;
  lastHearingDate?: string;
  nextHearingDate?: string;
  source: 'local' | 'cloud' | 'ecourts';
  isSynced: boolean;
}

export interface UnifiedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
}

export interface UnifiedStats {
  totalCases: number;
  activeCases: number;
  pendingCases: number;
  completedCases: number;
  totalUsers: number;
  activeUsers: number;
  lastSyncTime: string;
}

export class UnifiedDataService {
  private cases: UnifiedCase[] = [];
  private users: UnifiedUser[] = [];
  private lastSyncTime: string = new Date().toISOString();

  async initialize(): Promise<void> {
    console.log('Initializing unified data service...');
    await this.loadMockData();
  }

  private async loadMockData(): Promise<void> {
    this.cases = [
      {
        id: '1',
        cnrNumber: 'CNR-001',
        caseNumber: 'CASE-001',
        title: 'Civil Dispute Case',
        status: 'Active',
        courtName: 'District Court, Mumbai',
        filingDate: '2023-01-15',
        lastHearingDate: '2024-01-10',
        nextHearingDate: '2024-02-15',
        source: 'local',
        isSynced: true
      },
      {
        id: '2',
        cnrNumber: 'CNR-002',
        caseNumber: 'CASE-002',
        title: 'Criminal Case',
        status: 'Pending',
        courtName: 'High Court, Mumbai',
        filingDate: '2023-02-20',
        source: 'cloud',
        isSynced: false
      },
      {
        id: '3',
        cnrNumber: 'CNR-003',
        caseNumber: 'CASE-003',
        title: 'Family Dispute',
        status: 'Completed',
        courtName: 'Family Court, Mumbai',
        filingDate: '2022-12-10',
        lastHearingDate: '2023-12-15',
        source: 'ecourts',
        isSynced: true
      }
    ];

    this.users = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        isActive: true,
        lastLogin: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'user',
        isActive: true,
        lastLogin: '2024-01-14T15:30:00Z'
      }
    ];
  }

  async getCases(): Promise<UnifiedCase[]> {
    console.log('Fetching unified cases...');
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.cases];
  }

  async getCaseById(id: string): Promise<UnifiedCase | null> {
    console.log(`Fetching case by ID: ${id}`);
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.cases.find(case_ => case_.id === id) || null;
  }

  async getCasesByStatus(status: string): Promise<UnifiedCase[]> {
    console.log(`Fetching cases by status: ${status}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.cases.filter(case_ => case_.status === status);
  }

  async addCase(caseData: Omit<UnifiedCase, 'id'>): Promise<UnifiedCase> {
    console.log('Adding new case...');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newCase: UnifiedCase = {
      ...caseData,
      id: Date.now().toString()
    };
    
    this.cases.push(newCase);
    return newCase;
  }

  async updateCase(id: string, updates: Partial<UnifiedCase>): Promise<UnifiedCase | null> {
    console.log(`Updating case: ${id}`);
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.cases.findIndex(case_ => case_.id === id);
    if (index === -1) return null;
    
    this.cases[index] = { ...this.cases[index], ...updates };
    return this.cases[index];
  }

  async deleteCase(id: string): Promise<boolean> {
    console.log(`Deleting case: ${id}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.cases.findIndex(case_ => case_.id === id);
    if (index === -1) return false;
    
    this.cases.splice(index, 1);
    return true;
  }

  async getUsers(): Promise<UnifiedUser[]> {
    console.log('Fetching unified users...');
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.users];
  }

  async getUserById(id: string): Promise<UnifiedUser | null> {
    console.log(`Fetching user by ID: ${id}`);
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.users.find(user => user.id === id) || null;
  }

  async addUser(userData: Omit<UnifiedUser, 'id'>): Promise<UnifiedUser> {
    console.log('Adding new user...');
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newUser: UnifiedUser = {
      ...userData,
      id: Date.now().toString()
    };
    
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: string, updates: Partial<UnifiedUser>): Promise<UnifiedUser | null> {
    console.log(`Updating user: ${id}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return null;
    
    this.users[index] = { ...this.users[index], ...updates };
    return this.users[index];
  }

  async getStats(): Promise<UnifiedStats> {
    console.log('Fetching unified stats...');
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      totalCases: this.cases.length,
      activeCases: this.cases.filter(c => c.status === 'Active').length,
      pendingCases: this.cases.filter(c => c.status === 'Pending').length,
      completedCases: this.cases.filter(c => c.status === 'Completed').length,
      totalUsers: this.users.length,
      activeUsers: this.users.filter(u => u.isActive).length,
      lastSyncTime: this.lastSyncTime
    };
  }

  async syncAll(): Promise<boolean> {
    console.log('Syncing all data...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    this.lastSyncTime = new Date().toISOString();
    return true;
  }
}

export const unifiedDataService = new UnifiedDataService();
