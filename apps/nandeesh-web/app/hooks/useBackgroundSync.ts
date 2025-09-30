/**
 * React hook for managing background sync
 */

import { useState, useEffect, useCallback } from 'react';
import { backgroundSyncService, SyncStatus, CaseUpdateResult } from '../../lib/background-sync';

export interface UseBackgroundSyncReturn {
  status: SyncStatus;
  isRunning: boolean;
  startSync: (intervalMinutes?: number) => void;
  stopSync: () => void;
  performManualSync: () => Promise<SyncStatus>;
  setInterval: (minutes: number) => void;
  getIntervalMinutes: () => number;
}

export function useBackgroundSync(): UseBackgroundSyncReturn {
  const [status, setStatus] = useState<SyncStatus>(backgroundSyncService.getStatus());

  useEffect(() => {
    // Subscribe to status changes
    const unsubscribe = backgroundSyncService.onStatusChange((newStatus) => {
      setStatus(newStatus);
    });

    // Initialize with current status
    setStatus(backgroundSyncService.getStatus());

    // Cleanup on unmount
    return () => {
      unsubscribe();
      backgroundSyncService.cleanup();
    };
  }, []);

  const startSync = useCallback((intervalMinutes: number = 30) => {
    backgroundSyncService.start(intervalMinutes);
  }, []);

  const stopSync = useCallback(() => {
    backgroundSyncService.stop();
  }, []);

  const performManualSync = useCallback(async (): Promise<SyncStatus> => {
    return await backgroundSyncService.performSync();
  }, []);

  const setInterval = useCallback((minutes: number) => {
    backgroundSyncService.setInterval(minutes);
  }, []);

  const getIntervalMinutes = useCallback(() => {
    return backgroundSyncService.getIntervalMinutes();
  }, []);

  return {
    status,
    isRunning: status.isRunning,
    startSync,
    stopSync,
    performManualSync,
    setInterval,
    getIntervalMinutes
  };
}
