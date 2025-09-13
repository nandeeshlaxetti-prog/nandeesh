import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('app', {
  // Generic invoke method for IPC communication
  invoke: (channel: string, payload?: any) => {
    // Whitelist channels for security
    const validChannels = [
      // App controls
      'app:getVersion',
      'app:quit',
      'app:minimize',
      'app:maximize',
      'app:close',
      'app:showMessageBox',
      'app:showOpenDialog',
      'app:showSaveDialog',
      
      // Cases operations
      'cases:addByCnr',
      'cases:search',
      
      // eCourts operations
      'ecourts:syncNow',
      
      // Karnataka High Court operations
      'khc:getCaseByNumber',
      'khc:searchCases',
      'khc:getCauseList',
      'khc:listOrders',
      
      // Manual Import operations
      'manual:getCaseByCNR',
      'manual:parsePortalHtml',
      'manual:getSyncStatus',
      
      // Tasks operations
      'tasks:create',
      'tasks:list',
      'tasks:transition',
      
      // Office operations
      'office:listPendingForUser',
      'office:createPersonalTask',
      
      // Files operations
      'files:openPdf',
      
      // Backup operations
      'backup:exportNow',
      'backup:restoreFromZip',
    ]
    
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, payload)
    } else {
      throw new Error(`Invalid IPC channel: ${channel}`)
    }
  },

  // Convenience methods for common operations
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  quit: () => ipcRenderer.invoke('app:quit'),
  minimize: () => ipcRenderer.invoke('app:minimize'),
  maximize: () => ipcRenderer.invoke('app:maximize'),
  close: () => ipcRenderer.invoke('app:close'),
  
  // Dialog methods
  showMessageBox: (options: any) => ipcRenderer.invoke('app:showMessageBox', options),
  showOpenDialog: (options: any) => ipcRenderer.invoke('app:showOpenDialog', options),
  showSaveDialog: (options: any) => ipcRenderer.invoke('app:showSaveDialog', options),

  // Cases API
  cases: {
    addByCnr: (cnrData: any) => ipcRenderer.invoke('cases:addByCnr', cnrData),
    search: (searchParams: any) => ipcRenderer.invoke('cases:search', searchParams),
  },

  // eCourts API
  ecourts: {
    syncNow: (syncParams: any) => ipcRenderer.invoke('ecourts:syncNow', syncParams),
  },

  // Karnataka High Court API
  khc: {
    getCaseByNumber: (caseData: any) => ipcRenderer.invoke('khc:getCaseByNumber', caseData),
    searchCases: (searchData: any) => ipcRenderer.invoke('khc:searchCases', searchData),
    getCauseList: (causeListData: any) => ipcRenderer.invoke('khc:getCauseList', causeListData),
    listOrders: (ordersData: any) => ipcRenderer.invoke('khc:listOrders', ordersData),
  },

  // Manual Import API
  manual: {
    getCaseByCNR: (caseData: any) => ipcRenderer.invoke('manual:getCaseByCNR', caseData),
    parsePortalHtml: (parseData: any) => ipcRenderer.invoke('manual:parsePortalHtml', parseData),
    getSyncStatus: (statusData: any) => ipcRenderer.invoke('manual:getSyncStatus', statusData),
  },

  // Tasks API
  tasks: {
    create: (taskData: any) => ipcRenderer.invoke('tasks:create', taskData),
    list: (listParams: any) => ipcRenderer.invoke('tasks:list', listParams),
    transition: (transitionData: any) => ipcRenderer.invoke('tasks:transition', transitionData),
  },

  // Office API
  office: {
    listPendingForUser: (userParams: any) => ipcRenderer.invoke('office:listPendingForUser', userParams),
    createPersonalTask: (taskData: any) => ipcRenderer.invoke('office:createPersonalTask', taskData),
  },

  // Files API
  files: {
    openPdf: (fileData: any) => ipcRenderer.invoke('files:openPdf', fileData),
  },

  // Backup API
  backup: {
    exportNow: (exportParams: any) => ipcRenderer.invoke('backup:exportNow', exportParams),
    restoreFromZip: (restoreParams: any) => ipcRenderer.invoke('backup:restoreFromZip', restoreParams),
  },
})

// Type definitions for the exposed API
declare global {
  interface Window {
    app: {
      invoke: (channel: string, payload?: any) => Promise<any>
      
      // App controls
      getVersion: () => Promise<string>
      quit: () => Promise<void>
      minimize: () => Promise<void>
      maximize: () => Promise<void>
      close: () => Promise<void>
      showMessageBox: (options: any) => Promise<any>
      showOpenDialog: (options: any) => Promise<any>
      showSaveDialog: (options: any) => Promise<any>

      // Cases API
      cases: {
        addByCnr: (cnrData: any) => Promise<any>
        search: (searchParams: any) => Promise<any>
      }

      // eCourts API
      ecourts: {
        syncNow: (syncParams: any) => Promise<any>
      }

      // Karnataka High Court API
      khc: {
        getCaseByNumber: (caseData: any) => Promise<any>
        searchCases: (searchData: any) => Promise<any>
        getCauseList: (causeListData: any) => Promise<any>
        listOrders: (ordersData: any) => Promise<any>
      }

      // Manual Import API
      manual: {
        getCaseByCNR: (caseData: any) => Promise<any>
        parsePortalHtml: (parseData: any) => Promise<any>
        getSyncStatus: (statusData: any) => Promise<any>
      }

      // Tasks API
      tasks: {
        create: (taskData: any) => Promise<any>
        list: (listParams: any) => Promise<any>
        transition: (transitionData: any) => Promise<any>
      }

      // Office API
      office: {
        listPendingForUser: (userParams: any) => Promise<any>
        createPersonalTask: (taskData: any) => Promise<any>
      }

      // Files API
      files: {
        openPdf: (fileData: any) => Promise<any>
      }

      // Backup API
      backup: {
        exportNow: (exportParams: any) => Promise<any>
        restoreFromZip: (restoreParams: any) => Promise<any>
      }
    }
  }
}
