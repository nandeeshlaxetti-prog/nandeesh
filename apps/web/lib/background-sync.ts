/**
 * Background Sync Service for Cases
 * Handles periodic updates of case data in the background
 */

import { serviceWorkerManager } from './service-worker-manager';

export interface SyncStatus {
  isRunning: boolean;
  lastSync: Date | null;
  nextSync: Date | null;
  totalCases: number;
  updatedCases: number;
  failedCases: number;
  errors: string[];
}

export interface CaseUpdateResult {
  cnr: string;
  success: boolean;
  updated: boolean;
  error?: string;
  newData?: any;
}

class BackgroundSyncService {
  private syncInterval: NodeJS.Timeout | null = null;
  private isRunning = false;
  private lastSync: Date | null = null;
  private syncIntervalMs = 30 * 60 * 1000; // 30 minutes default
  private statusCallbacks: ((status: SyncStatus) => void)[] = [];

  constructor() {
    // Initialize with saved settings
    this.loadSettings();
    
    // Register service worker
    this.initializeServiceWorker();
    
    // Listen for service worker messages
    this.setupServiceWorkerListeners();
  }

  /**
   * Start background sync
   */
  start(intervalMinutes: number = 30): void {
    if (this.isRunning) {
      console.log('🔄 Background sync already running');
      return;
    }

    this.syncIntervalMs = intervalMinutes * 60 * 1000;
    this.isRunning = true;
    
    console.log(`🔄 Starting background sync every ${intervalMinutes} minutes`);
    
    // Run initial sync
    this.performSync();
    
    // Set up periodic sync
    this.syncInterval = setInterval(() => {
      this.performSync();
    }, this.syncIntervalMs);

    this.saveSettings();
    this.notifyStatusChange();
  }

  /**
   * Stop background sync
   */
  stop(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    
    this.isRunning = false;
    console.log('⏹️ Background sync stopped');
    
    this.saveSettings();
    this.notifyStatusChange();
  }

  /**
   * Perform manual sync
   */
  async performSync(): Promise<SyncStatus> {
    if (!this.isRunning && this.syncInterval) {
      // Only allow manual sync if background sync is enabled
      return this.getStatus();
    }

    console.log('🔄 Performing background sync...');
    
    const startTime = new Date();
    const status: SyncStatus = {
      isRunning: true,
      lastSync: startTime,
      nextSync: new Date(startTime.getTime() + this.syncIntervalMs),
      totalCases: 0,
      updatedCases: 0,
      failedCases: 0,
      errors: []
    };

    try {
      // Get all stored cases
      const storedCases = this.getStoredCases();
      status.totalCases = storedCases.length;

      if (storedCases.length === 0) {
        console.log('📋 No cases to sync');
        this.lastSync = startTime;
        this.notifyStatusChange();
        return status;
      }

      console.log(`📋 Syncing ${storedCases.length} cases...`);

      // Update cases in batches to avoid overwhelming the API
      const batchSize = 5;
      const batches = this.chunkArray(storedCases, batchSize);

      for (const batch of batches) {
        const batchPromises = batch.map(caseItem => this.updateCase(caseItem));
        const batchResults = await Promise.allSettled(batchPromises);

        batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled' && result.value.success) {
            if (result.value.updated) {
              status.updatedCases++;
            }
          } else {
            status.failedCases++;
            const error = result.status === 'rejected' 
              ? result.reason?.message || 'Unknown error'
              : result.value.error || 'Update failed';
            status.errors.push(`${batch[index].cnrNumber}: ${error}`);
          }
        });

        // Add delay between batches to be respectful to the API
        if (batches.indexOf(batch) < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      console.log(`✅ Sync completed: ${status.updatedCases} updated, ${status.failedCases} failed`);
      
    } catch (error) {
      console.error('❌ Background sync failed:', error);
      status.errors.push(`Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    this.lastSync = startTime;
    this.notifyStatusChange();
    return status;
  }

  /**
   * Update a single case
   */
  private async updateCase(caseItem: any): Promise<CaseUpdateResult> {
    try {
      const response = await fetch('/api/ecourts/cnr/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cnr: caseItem.cnrNumber })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'API request failed');
      }

      // Check if data has changed
      const hasChanges = this.hasCaseDataChanged(caseItem, result.data);
      
      if (hasChanges) {
        // Update the stored case
        this.updateStoredCase(caseItem.id, result.data);
        console.log(`🔄 Updated case: ${caseItem.cnrNumber}`);
      }

      return {
        cnr: caseItem.cnrNumber,
        success: true,
        updated: hasChanges
      };

    } catch (error) {
      console.error(`❌ Failed to update case ${caseItem.cnrNumber}:`, error);
      return {
        cnr: caseItem.cnrNumber,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Check if case data has changed
   */
  private hasCaseDataChanged(oldCase: any, newData: any): boolean {
    // Compare key fields that might change
    const fieldsToCompare = [
      'title',
      'caseNumber',
      'registrationNumber',
      'filingNumber',
      'status',
      'nextHearingDate',
      'caseStage',
      'courtNumberAndJudge'
    ];

    return fieldsToCompare.some(field => {
      const oldValue = oldCase[field];
      const newValue = newData[field];
      
      // Handle nested objects
      if (typeof oldValue === 'object' && typeof newValue === 'object') {
        return JSON.stringify(oldValue) !== JSON.stringify(newValue);
      }
      
      return oldValue !== newValue;
    });
  }

  /**
   * Get stored cases from localStorage
   */
  private getStoredCases(): any[] {
    try {
      if (typeof window === 'undefined' || !localStorage) {
        return [];
      }
      const stored = localStorage.getItem('legal-cases');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('❌ Failed to load stored cases:', error);
      return [];
    }
  }

  /**
   * Update a stored case
   */
  private updateStoredCase(caseId: string, newData: any): void {
    try {
      const storedCases = this.getStoredCases();
      const caseIndex = storedCases.findIndex(c => c.id === caseId);
      
      if (caseIndex !== -1) {
        // Merge new data with existing case
        storedCases[caseIndex] = {
          ...storedCases[caseIndex],
          ...newData,
          id: caseId, // Preserve the original ID
          lastUpdated: new Date().toISOString()
        };
        
        if (typeof window !== 'undefined' && localStorage) {
          localStorage.setItem('legal-cases', JSON.stringify(storedCases));
        }
      }
    } catch (error) {
      console.error('❌ Failed to update stored case:', error);
    }
  }

  /**
   * Get current sync status
   */
  getStatus(): SyncStatus {
    return {
      isRunning: this.isRunning,
      lastSync: this.lastSync,
      nextSync: this.isRunning && this.lastSync 
        ? new Date(this.lastSync.getTime() + this.syncIntervalMs)
        : null,
      totalCases: this.getStoredCases().length,
      updatedCases: 0,
      failedCases: 0,
      errors: []
    };
  }

  /**
   * Subscribe to status changes
   */
  onStatusChange(callback: (status: SyncStatus) => void): () => void {
    this.statusCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.statusCallbacks.indexOf(callback);
      if (index > -1) {
        this.statusCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Notify status change subscribers
   */
  private notifyStatusChange(): void {
    const status = this.getStatus();
    this.statusCallbacks.forEach(callback => callback(status));
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings(): void {
    try {
      const settings = {
        isRunning: this.isRunning,
        syncIntervalMs: this.syncIntervalMs,
        lastSync: this.lastSync?.toISOString()
      };
      if (typeof window !== 'undefined' && localStorage) {
        localStorage.setItem('legal-desktop-sync-settings', JSON.stringify(settings));
      }
    } catch (error) {
      console.error('❌ Failed to save sync settings:', error);
    }
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings(): void {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined' || !localStorage) {
        return;
      }
      
      const stored = localStorage.getItem('legal-desktop-sync-settings');
      if (stored) {
        const settings = JSON.parse(stored);
        this.isRunning = settings.isRunning || false;
        this.syncIntervalMs = settings.syncIntervalMs || 30 * 60 * 1000;
        this.lastSync = settings.lastSync ? new Date(settings.lastSync) : null;
      }
    } catch (error) {
      console.error('❌ Failed to load sync settings:', error);
    }
  }

  /**
   * Utility function to chunk array into smaller arrays
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Set sync interval
   */
  setInterval(minutes: number): void {
    this.syncIntervalMs = minutes * 60 * 1000;
    
    if (this.isRunning) {
      // Restart with new interval
      this.stop();
      this.start(minutes);
    } else {
      this.saveSettings();
    }
  }

  /**
   * Get sync interval in minutes
   */
  getIntervalMinutes(): number {
    return this.syncIntervalMs / (60 * 1000);
  }

  /**
   * Initialize service worker
   */
  private async initializeServiceWorker(): Promise<void> {
    try {
      await serviceWorkerManager.register();
      
      // Register periodic sync if supported
      if (serviceWorkerManager.isPeriodicSyncSupported()) {
        await serviceWorkerManager.registerPeriodicSync('case-updates', {
          minInterval: this.syncIntervalMs
        });
      }
    } catch (error) {
      console.error('❌ Failed to initialize service worker:', error);
    }
  }

  /**
   * Setup service worker message listeners
   */
  private setupServiceWorkerListeners(): void {
    const unsubscribe = serviceWorkerManager.onMessage((event) => {
      const { type, data, error } = event.data;
      
      switch (type) {
        case 'SYNC_COMPLETED':
          console.log('✅ Background sync completed:', data);
          this.handleSyncCompleted(data);
          break;
          
        case 'SYNC_FAILED':
          console.error('❌ Background sync failed:', error);
          this.handleSyncFailed(error);
          break;
      }
    });

    // Store unsubscribe function for cleanup
    this.serviceWorkerUnsubscribe = unsubscribe;
  }

  /**
   * Handle sync completed from service worker
   */
  private handleSyncCompleted(data: any): void {
    this.lastSync = new Date();
    this.notifyStatusChange();
  }

  /**
   * Handle sync failed from service worker
   */
  private handleSyncFailed(error: string): void {
    console.error('❌ Service worker sync failed:', error);
    this.notifyStatusChange();
  }

  /**
   * Cleanup service worker listeners
   */
  private serviceWorkerUnsubscribe?: () => void;

  /**
   * Cleanup method
   */
  cleanup(): void {
    if (this.serviceWorkerUnsubscribe) {
      this.serviceWorkerUnsubscribe();
    }
  }
}

// Export singleton instance
export const backgroundSyncService = new BackgroundSyncService();
