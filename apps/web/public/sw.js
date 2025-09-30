/**
 * Service Worker for Background Sync
 * Handles case updates even when the application is not active
 */

const CACHE_NAME = 'legal-desktop-sync-v1';
const SYNC_TAG = 'case-sync';

// Install event
self.addEventListener('install', (event) => {
  console.log('🔄 Service Worker installing...');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Background sync event
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync event:', event.tag);
  
  if (event.tag === SYNC_TAG) {
    event.waitUntil(performBackgroundSync());
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  console.log('🔄 Periodic sync event:', event.tag);
  
  if (event.tag === 'case-updates') {
    event.waitUntil(performBackgroundSync());
  }
});

// Message event for communication with main thread
self.addEventListener('message', (event) => {
  console.log('📨 Service Worker received message:', event.data);
  
  if (event.data.type === 'START_SYNC') {
    event.waitUntil(performBackgroundSync());
  } else if (event.data.type === 'REGISTER_PERIODIC_SYNC') {
    registerPeriodicSync();
  }
});

/**
 * Perform background sync
 */
async function performBackgroundSync() {
  try {
    console.log('🔄 Starting background sync...');
    
    // Get stored cases
    const storedCases = await getStoredCases();
    
    if (storedCases.length === 0) {
      console.log('📋 No cases to sync');
      return;
    }

    console.log(`📋 Syncing ${storedCases.length} cases...`);

    // Update cases in batches
    const batchSize = 3; // Smaller batches for background sync
    const batches = chunkArray(storedCases, batchSize);
    
    let updatedCount = 0;
    let failedCount = 0;
    const errors = [];

    for (const batch of batches) {
      const batchPromises = batch.map(caseItem => updateCase(caseItem));
      const batchResults = await Promise.allSettled(batchPromises);

      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.success) {
          if (result.value.updated) {
            updatedCount++;
          }
        } else {
          failedCount++;
          const error = result.status === 'rejected' 
            ? result.reason?.message || 'Unknown error'
            : result.value.error || 'Update failed';
          errors.push(`${batch[index].cnrNumber}: ${error}`);
        }
      });

      // Add delay between batches
      if (batches.indexOf(batch) < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    console.log(`✅ Background sync completed: ${updatedCount} updated, ${failedCount} failed`);
    
    // Notify all clients about sync completion
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETED',
        data: {
          updatedCount,
          failedCount,
          errors,
          timestamp: new Date().toISOString()
        }
      });
    });

  } catch (error) {
    console.error('❌ Background sync failed:', error);
    
    // Notify clients about sync failure
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_FAILED',
        error: error.message
      });
    });
  }
}

/**
 * Update a single case
 */
async function updateCase(caseItem) {
  try {
    const response = await fetch('/api/ecourts/cnr', {
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
    const hasChanges = hasCaseDataChanged(caseItem, result.data);
    
    if (hasChanges) {
      // Update the stored case
      await updateStoredCase(caseItem.id, result.data);
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
      error: error.message
    };
  }
}

/**
 * Check if case data has changed
 */
function hasCaseDataChanged(oldCase, newData) {
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
    
    if (typeof oldValue === 'object' && typeof newValue === 'object') {
      return JSON.stringify(oldValue) !== JSON.stringify(newValue);
    }
    
    return oldValue !== newValue;
  });
}

/**
 * Get stored cases from IndexedDB
 */
async function getStoredCases() {
  try {
    // For now, we'll use a simple approach
    // In a real implementation, you'd use IndexedDB
    return [];
  } catch (error) {
    console.error('❌ Failed to load stored cases:', error);
    return [];
  }
}

/**
 * Update a stored case
 */
async function updateStoredCase(caseId, newData) {
  try {
    // For now, we'll use a simple approach
    // In a real implementation, you'd use IndexedDB
    console.log(`📝 Updating case ${caseId} with new data`);
  } catch (error) {
    console.error('❌ Failed to update stored case:', error);
  }
}

/**
 * Register periodic background sync
 */
async function registerPeriodicSync() {
  if ('serviceWorker' in navigator && 'periodicSync' in window.ServiceWorkerRegistration.prototype) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.periodicSync.register('case-updates', {
        minInterval: 30 * 60 * 1000 // 30 minutes minimum
      });
      console.log('✅ Periodic sync registered');
    } catch (error) {
      console.error('❌ Failed to register periodic sync:', error);
    }
  }
}

/**
 * Utility function to chunk array
 */
function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}














