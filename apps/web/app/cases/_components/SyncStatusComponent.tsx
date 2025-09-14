'use client';

import React, { useState } from 'react';
import { useBackgroundSync, SyncStatus } from '../hooks/useBackgroundSync';

interface SyncStatusComponentProps {
  className?: string;
  showDetails?: boolean;
}

export function SyncStatusComponent({ className = '', showDetails = false }: SyncStatusComponentProps) {
  const { status, isRunning, startSync, stopSync, performManualSync, setInterval, getIntervalMinutes } = useBackgroundSync();
  const [isExpanded, setIsExpanded] = useState(showDetails);
  const [isManualSyncing, setIsManualSyncing] = useState(false);

  const handleManualSync = async () => {
    setIsManualSyncing(true);
    try {
      await performManualSync();
    } finally {
      setIsManualSyncing(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = () => {
    if (isRunning) return 'text-green-600';
    if (status.lastSync) return 'text-blue-600';
    return 'text-gray-500';
  };

  const getStatusIcon = () => {
    if (isManualSyncing) return '🔄';
    if (isRunning) return '🔄';
    if (status.lastSync) return '✅';
    return '⏸️';
  };

  return (
    <div className={`bg-white rounded-lg border p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getStatusIcon()}</span>
          <h3 className="text-sm font-medium text-gray-900">Background Sync</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${
            isRunning ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          }`}>
            {isRunning ? 'Active' : 'Inactive'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {/* Status Summary */}
      <div className="text-sm text-gray-600 mb-3">
        <div className="flex items-center justify-between">
          <span>Last sync: <span className={getStatusColor()}>{formatDate(status.lastSync)}</span></span>
          {status.nextSync && (
            <span>Next: {formatDate(status.nextSync)}</span>
          )}
        </div>
        <div className="mt-1">
          <span>Cases: {status.totalCases}</span>
          {status.updatedCases > 0 && (
            <span className="ml-3 text-green-600">Updated: {status.updatedCases}</span>
          )}
          {status.failedCases > 0 && (
            <span className="ml-3 text-red-600">Failed: {status.failedCases}</span>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="space-y-4 border-t pt-4">
          {/* Controls */}
          <div className="flex items-center space-x-3">
            {!isRunning ? (
              <button
                onClick={() => startSync(getIntervalMinutes())}
                className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
              >
                Start Sync
              </button>
            ) : (
              <button
                onClick={stopSync}
                className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
              >
                Stop Sync
              </button>
            )}
            
            <button
              onClick={handleManualSync}
              disabled={isManualSyncing}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isManualSyncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>

          {/* Interval Settings */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Sync Interval</label>
            <div className="flex items-center space-x-2">
              <select
                value={getIntervalMinutes()}
                onChange={(e) => setInterval(parseInt(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
                <option value={240}>4 hours</option>
              </select>
              <span className="text-xs text-gray-500">
                {isRunning ? 'Will restart with new interval' : 'Will apply when sync starts'}
              </span>
            </div>
          </div>

          {/* Error Messages */}
          {status.errors.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-red-700">Recent Errors</label>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {status.errors.map((error, index) => (
                  <div key={index} className="text-xs text-red-600 bg-red-50 p-2 rounded">
                    {error}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sync Statistics */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded">
              <div className="font-medium text-gray-700">Total Cases</div>
              <div className="text-lg font-semibold text-gray-900">{status.totalCases}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <div className="font-medium text-gray-700">Last Updated</div>
              <div className="text-sm text-gray-600">{formatDate(status.lastSync)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
