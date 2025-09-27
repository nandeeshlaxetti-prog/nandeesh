/**
 * Service Worker Registration Utility
 */

export class ServiceWorkerManager {
  private static instance: ServiceWorkerManager;
  private registration: ServiceWorkerRegistration | null = null;

  private constructor() {}

  static getInstance(): ServiceWorkerManager {
    if (!ServiceWorkerManager.instance) {
      ServiceWorkerManager.instance = new ServiceWorkerManager();
    }
    return ServiceWorkerManager.instance;
  }

  /**
   * Register service worker
   */
  async register(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      console.log('❌ Service Worker not supported');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('✅ Service Worker registered:', this.registration);

      // Listen for updates
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration!.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('🔄 New service worker available');
              // Notify user about update
              this.notifyUpdate();
            }
          });
        }
      });

      return true;
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
      return false;
    }
  }

  /**
   * Unregister service worker
   */
  async unregister(): Promise<boolean> {
    if (!this.registration) {
      return false;
    }

    try {
      const result = await this.registration.unregister();
      console.log('✅ Service Worker unregistered:', result);
      this.registration = null;
      return result;
    } catch (error) {
      console.error('❌ Service Worker unregistration failed:', error);
      return false;
    }
  }

  /**
   * Check if service worker is supported
   */
  isSupported(): boolean {
    return 'serviceWorker' in navigator;
  }

  /**
   * Check if periodic sync is supported
   */
  isPeriodicSyncSupported(): boolean {
    return 'serviceWorker' in navigator && 
           'periodicSync' in window.ServiceWorkerRegistration.prototype;
  }

  /**
   * Register periodic background sync
   */
  async registerPeriodicSync(tag: string, options: { minInterval: number }): Promise<boolean> {
    if (!this.isPeriodicSyncSupported()) {
      console.log('❌ Periodic sync not supported');
      return false;
    }

    if (!this.registration) {
      console.log('❌ Service Worker not registered');
      return false;
    }

    try {
      await this.registration.periodicSync.register(tag, options);
      console.log('✅ Periodic sync registered:', tag);
      return true;
    } catch (error) {
      console.error('❌ Periodic sync registration failed:', error);
      return false;
    }
  }

  /**
   * Unregister periodic background sync
   */
  async unregisterPeriodicSync(tag: string): Promise<boolean> {
    if (!this.isPeriodicSyncSupported() || !this.registration) {
      return false;
    }

    try {
      await this.registration.periodicSync.unregister(tag);
      console.log('✅ Periodic sync unregistered:', tag);
      return true;
    } catch (error) {
      console.error('❌ Periodic sync unregistration failed:', error);
      return false;
    }
  }

  /**
   * Send message to service worker
   */
  async sendMessage(message: any): Promise<void> {
    if (!navigator.serviceWorker.controller) {
      console.log('❌ No service worker controller');
      return;
    }

    try {
      navigator.serviceWorker.controller.postMessage(message);
    } catch (error) {
      console.error('❌ Failed to send message to service worker:', error);
    }
  }

  /**
   * Listen for messages from service worker
   */
  onMessage(callback: (event: MessageEvent) => void): () => void {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || !navigator?.serviceWorker) {
      return () => {}; // Return empty cleanup function
    }

    const messageHandler = (event: MessageEvent) => {
      callback(event);
    };

    if (typeof navigator !== 'undefined' && navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener('message', messageHandler);
    }

    // Return cleanup function
    return () => {
      if (typeof navigator !== 'undefined' && navigator.serviceWorker) {
        navigator.serviceWorker.removeEventListener('message', messageHandler);
      }
    };
  }

  /**
   * Notify user about service worker update
   */
  private notifyUpdate(): void {
    // You can implement a custom notification system here
    // For now, we'll just log it
    console.log('🔄 Service Worker update available');
    
    // Example: Show a toast notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('App Update Available', {
        body: 'A new version of the app is available. Refresh to update.',
        icon: '/icon-192x192.png'
      });
    }
  }

  /**
   * Get service worker registration
   */
  getRegistration(): ServiceWorkerRegistration | null {
    return this.registration;
  }
}

// Export singleton instance
export const serviceWorkerManager = ServiceWorkerManager.getInstance();





