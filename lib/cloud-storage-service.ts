// Cloud Storage Service - Mock implementation
export interface CloudCase {
  id: string;
  cnrNumber: string;
  caseNumber: string;
  title: string;
  status: string;
  lastModified: string;
  size: number;
  isSynced: boolean;
}

export interface CloudSyncStatus {
  isOnline: boolean;
  lastSyncTime: string;
  pendingUploads: number;
  pendingDownloads: number;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  details: string;
}

export class CloudStorageService {
  private isConnected: boolean = true;
  private lastSyncTime: string = new Date().toISOString();

  async connect(): Promise<boolean> {
    console.log('Connecting to cloud storage...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.isConnected = true;
    return true;
  }

  async getCases(): Promise<CloudCase[]> {
    console.log('Fetching cloud cases...');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: '1',
        cnrNumber: 'CNR-001',
        caseNumber: 'CASE-001',
        title: 'Sample Case 1',
        status: 'Active',
        lastModified: '2024-01-15T10:00:00Z',
        size: 1024,
        isSynced: true
      },
      {
        id: '2',
        cnrNumber: 'CNR-002',
        caseNumber: 'CASE-002',
        title: 'Sample Case 2',
        status: 'Pending',
        lastModified: '2024-01-14T15:30:00Z',
        size: 2048,
        isSynced: false
      }
    ];
  }

  async uploadCase(caseData: CloudCase): Promise<boolean> {
    console.log(`Uploading case: ${caseData.id}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }

  async downloadCase(caseId: string): Promise<CloudCase | null> {
    console.log(`Downloading case: ${caseId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      id: caseId,
      cnrNumber: `CNR-${caseId}`,
      caseNumber: `CASE-${caseId}`,
      title: `Downloaded Case ${caseId}`,
      status: 'Active',
      lastModified: new Date().toISOString(),
      size: 1024,
      isSynced: true
    };
  }

  getSyncStatus(): CloudSyncStatus {
    return {
      isOnline: this.isConnected,
      lastSyncTime: this.lastSyncTime,
      pendingUploads: 2,
      pendingDownloads: 1
    };
  }

  async getUserActivity(): Promise<UserActivity[]> {
    console.log('Fetching user activity...');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: '1',
        userId: 'user-1',
        action: 'CASE_UPLOADED',
        timestamp: '2024-01-15T10:00:00Z',
        details: 'Uploaded case CNR-001'
      },
      {
        id: '2',
        userId: 'user-1',
        action: 'CASE_MODIFIED',
        timestamp: '2024-01-14T15:30:00Z',
        details: 'Modified case CNR-002'
      }
    ];
  }

  async syncAll(): Promise<boolean> {
    console.log('Syncing all data...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    this.lastSyncTime = new Date().toISOString();
    return true;
  }
}

export const cloudStorageService = new CloudStorageService();
