import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import * as path from 'path'
import * as fs from 'fs'
import { ConfigUtils } from 'core'
import { bootSchedulers, stopSchedulers } from 'jobs'
import { KarnatakaHighCourtCaptchaHandler } from './captcha-handler'
import { OfficialPortalHandler } from './portal-handler'

const isDev = process.env.NODE_ENV === 'development'

// Single instance lock
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, focus our window instead
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

let mainWindow: BrowserWindow | null = null
let captchaHandler: KarnatakaHighCourtCaptchaHandler | null = null
let portalHandler: OfficialPortalHandler | null = null

function createWindow(): void {
  // Check if icon exists
  const iconPath = path.join(__dirname, '../assets/icon.png')
  const iconExists = fs.existsSync(iconPath)

  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
    },
    titleBarStyle: 'hiddenInset',
    show: false,
    ...(iconExists && { icon: iconPath }),
  })

  // Load the app
  if (isDev) {
    const apiUrl = ConfigUtils.getApiUrl()
    mainWindow.loadURL(apiUrl)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../web/out/index.html'))
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
    
    // Initialize handlers
    if (mainWindow) {
      captchaHandler = new KarnatakaHighCourtCaptchaHandler(mainWindow)
      portalHandler = new OfficialPortalHandler(mainWindow)
    }
    
    // Focus on the window
    if (isDev) {
      mainWindow?.webContents.openDevTools()
    }
  })

  // Handle window closed
  mainWindow.on('closed', () => {
    // Cleanup handlers
    if (captchaHandler) {
      captchaHandler.destroy()
      captchaHandler = null
    }
    if (portalHandler) {
      portalHandler.destroy()
      portalHandler = null
    }
    mainWindow = null
  })

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    require('electron').shell.openExternal(url)
    return { action: 'deny' }
  })
}

// This method will be called when Electron has finished initialization
app.whenReady().then(async () => {
  createWindow()

  // Start job schedulers
  try {
    await bootSchedulers()
    console.log('Job schedulers started successfully')
  } catch (error) {
    console.error('Failed to start job schedulers:', error)
  }

  app.on('activate', () => {
    // On macOS, re-create window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Quit when all windows are closed
app.on('window-all-closed', async () => {
  // Stop job schedulers before quitting
  try {
    await stopSchedulers()
    console.log('Job schedulers stopped successfully')
  } catch (error) {
    console.error('Failed to stop job schedulers:', error)
  }

  // On macOS, keep app running even when all windows are closed
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC handlers
ipcMain.handle('app:getVersion', () => {
  return app.getVersion()
})

ipcMain.handle('app:quit', () => {
  app.quit()
})

ipcMain.handle('app:minimize', () => {
  mainWindow?.minimize()
})

ipcMain.handle('app:maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow?.maximize()
  }
})

ipcMain.handle('app:close', () => {
  mainWindow?.close()
})

ipcMain.handle('app:showMessageBox', async (event, options) => {
  const result = await dialog.showMessageBox(mainWindow!, options)
  return result
})

ipcMain.handle('app:showOpenDialog', async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow!, options)
  return result
})

ipcMain.handle('app:showSaveDialog', async (event, options) => {
  const result = await dialog.showSaveDialog(mainWindow!, options)
  return result
})

// Cases IPC handlers
ipcMain.handle('cases:addByCnr', async (event, cnrData) => {
  try {
    // TODO: Implement case addition by CNR
    console.log('Adding case by CNR:', cnrData)
    
    // Stub implementation - call data service
    const { db } = await import('data')
    
    // Mock case creation
    const newCase = {
      id: `case-${Date.now()}`,
      caseNumber: cnrData.cnrNumber,
      title: cnrData.title || 'Case from CNR',
      description: cnrData.description,
      status: 'OPEN',
      priority: 'MEDIUM',
      clientId: cnrData.clientId,
      assignedLawyerId: cnrData.assignedLawyerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    return { success: true, data: newCase }
  } catch (error) {
    console.error('Error adding case by CNR:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
})

ipcMain.handle('cases:search', async (event, searchParams) => {
  try {
    console.log('Searching cases:', searchParams)
    
    // Stub implementation - call data service
    const { db } = await import('data')
    
    // Mock search results
    const mockCases = [
      {
        id: '1',
        caseNumber: 'CASE-2024-001',
        title: 'Contract Dispute Resolution',
        client: 'ABC Corporation',
        status: 'OPEN',
        priority: 'HIGH',
        createdAt: new Date(),
      },
      {
        id: '2',
        caseNumber: 'CASE-2024-002',
        title: 'Property Settlement',
        client: 'Jane Smith',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        createdAt: new Date(),
      },
    ]
    
    return { success: true, data: mockCases }
  } catch (error) {
    console.error('Error searching cases:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
})

// eCourts IPC handlers
ipcMain.handle('ecourts:syncNow', async (event, syncParams) => {
  try {
    console.log('Syncing with eCourts:', syncParams)
    
    // Stub implementation - call core service
    const { ConfigUtils } = await import('core')
    
    // Mock sync process
    const syncResult = {
      syncedCases: 5,
      updatedCases: 2,
      newCases: 1,
      errors: [],
      lastSync: new Date(),
    }
    
    return { success: true, data: syncResult }
  } catch (error) {
    console.error('Error syncing with eCourts:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
})

// Karnataka High Court IPC handlers
ipcMain.handle('khc:getCaseByNumber', async (event, caseData) => {
  try {
    console.log('Getting Karnataka High Court case by number:', caseData)
    
    // Import Karnataka High Court provider
    const { KarnatakaHighCourtProvider } = await import('core')
    
    const provider = new KarnatakaHighCourtProvider({
      bench: caseData.bench || 'bengaluru',
      apiEndpoint: caseData.apiEndpoint,
      apiKey: caseData.apiKey
    })
    
    const result = await provider.getKhcCaseByNumber(caseData.caseNumber, {
      bench: caseData.bench || 'bengaluru'
    })
    
    // Handle captcha requirement
    if (!result.success && result.error === 'CAPTCHA_REQUIRED' && captchaHandler) {
      const captchaResult = await captchaHandler.openCaptcha({
        captchaUrl: result.data?.captchaUrl || '',
        sessionId: result.data?.sessionId || '',
        message: result.data?.message || 'CAPTCHA verification required'
      })
      
      if (captchaResult.success) {
        // Retry the request after captcha completion
        return await provider.getKhcCaseByNumber(caseData.caseNumber, {
          bench: caseData.bench || 'bengaluru'
        })
      }
    }
    
    return result
  } catch (error) {
    console.error('Error getting Karnataka High Court case:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
})

ipcMain.handle('khc:searchCases', async (event, searchData) => {
  try {
    console.log('Searching Karnataka High Court cases:', searchData)
    
    // Import Karnataka High Court provider
    const { KarnatakaHighCourtProvider } = await import('core')
    
    const provider = new KarnatakaHighCourtProvider({
      bench: searchData.bench || 'bengaluru',
      apiEndpoint: searchData.apiEndpoint,
      apiKey: searchData.apiKey
    })
    
    const result = await provider.searchKhcCases(searchData.filters, {
      bench: searchData.bench || 'bengaluru'
    })
    
    // Handle captcha requirement
    if (!result.success && result.error === 'CAPTCHA_REQUIRED' && captchaHandler) {
      const captchaResult = await captchaHandler.openCaptcha({
        captchaUrl: result.data?.captchaUrl || '',
        sessionId: result.data?.sessionId || '',
        message: result.data?.message || 'CAPTCHA verification required'
      })
      
      if (captchaResult.success) {
        // Retry the request after captcha completion
        return await provider.searchKhcCases(searchData.filters, {
          bench: searchData.bench || 'bengaluru'
        })
      }
    }
    
    return result
  } catch (error) {
    console.error('Error searching Karnataka High Court cases:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
})

ipcMain.handle('khc:getCauseList', async (event, causeListData) => {
  try {
    console.log('Getting Karnataka High Court cause list:', causeListData)
    
    // Import Karnataka High Court provider
    const { KarnatakaHighCourtProvider } = await import('core')
    
    const provider = new KarnatakaHighCourtProvider({
      bench: causeListData.bench || 'bengaluru',
      apiEndpoint: causeListData.apiEndpoint,
      apiKey: causeListData.apiKey
    })
    
    const result = await provider.getKhcCauseList(new Date(causeListData.date), {
      bench: causeListData.bench || 'bengaluru'
    })
    
    // Handle captcha requirement
    if (!result.success && result.error === 'CAPTCHA_REQUIRED' && captchaHandler) {
      const captchaResult = await captchaHandler.openCaptcha({
        captchaUrl: result.data?.captchaUrl || '',
        sessionId: result.data?.sessionId || '',
        message: result.data?.message || 'CAPTCHA verification required'
      })
      
      if (captchaResult.success) {
        // Retry the request after captcha completion
        return await provider.getKhcCauseList(new Date(causeListData.date), {
          bench: causeListData.bench || 'bengaluru'
        })
      }
    }
    
    return result
  } catch (error) {
    console.error('Error getting Karnataka High Court cause list:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
})

ipcMain.handle('khc:listOrders', async (event, ordersData) => {
  try {
    console.log('Listing Karnataka High Court orders:', ordersData)
    
    // Import Karnataka High Court provider
    const { KarnatakaHighCourtProvider } = await import('core')
    
    const provider = new KarnatakaHighCourtProvider({
      bench: ordersData.bench || 'bengaluru',
      apiEndpoint: ordersData.apiEndpoint,
      apiKey: ordersData.apiKey
    })
    
    const result = await provider.listKhcOrders(ordersData.caseNumber, {
      bench: ordersData.bench || 'bengaluru'
    })
    
    // Handle captcha requirement
    if (!result.success && result.error === 'CAPTCHA_REQUIRED' && captchaHandler) {
      const captchaResult = await captchaHandler.openCaptcha({
        captchaUrl: result.data?.captchaUrl || '',
        sessionId: result.data?.sessionId || '',
        message: result.data?.message || 'CAPTCHA verification required'
      })
      
      if (captchaResult.success) {
        // Retry the request after captcha completion
        return await provider.listKhcOrders(ordersData.caseNumber, {
          bench: ordersData.bench || 'bengaluru'
        })
      }
    }
    
    return result
  } catch (error) {
    console.error('Error listing Karnataka High Court orders:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
})

// Manual Import IPC handlers
ipcMain.handle('manual:getCaseByCNR', async (event, caseData) => {
  try {
    console.log('Getting case by CNR (Manual Import):', caseData)
    
    // Import Manual Import provider
    const { ManualImportProvider } = await import('core')
    
    const provider = new ManualImportProvider({
      officialPortalUrl: caseData.portalUrl || 'https://ecourts.gov.in',
      syncStatusCallback: (status) => {
        console.log('Sync status updated:', status)
      }
    })
    
    const result = await provider.getCaseByCNR(caseData.cnr)
    
    // Handle manual fetch requirement
    if (!result.success && result.error === 'MANUAL_FETCH_REQUIRED' && portalHandler) {
      const portalResult = await portalHandler.openPortal({
        portalUrl: result.data?.portalUrl || 'https://ecourts.gov.in',
        caseNumber: result.data?.caseNumber || '',
        cnr: result.data?.cnr || '',
        message: result.data?.message || 'Manual fetch required'
      })
      
      if (portalResult.success && portalResult.caseData) {
        // Parse and import the case data
        const parseResult = await provider.parsePortalHtml(portalResult.html || '', caseData.cnr)
        
        if (parseResult.success) {
          return {
            success: true,
            data: parseResult.data,
            message: 'Case imported successfully from portal'
          }
        }
      }
    }
    
    return result
  } catch (error) {
    console.error('Error in manual import:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
})

ipcMain.handle('manual:parsePortalHtml', async (event, parseData) => {
  try {
    console.log('Parsing portal HTML:', parseData)
    
    // Import Manual Import provider
    const { ManualImportProvider } = await import('core')
    
    const provider = new ManualImportProvider({
      domParser: parseData.domParser,
      syncStatusCallback: (status) => {
        console.log('Sync status updated:', status)
      }
    })
    
    const result = await provider.parsePortalHtml(parseData.html, parseData.cnr)
    
    return result
  } catch (error) {
    console.error('Error parsing portal HTML:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
})

ipcMain.handle('manual:getSyncStatus', async (event, statusData) => {
  try {
    console.log('Getting sync status:', statusData)
    
    // Import Manual Import provider
    const { ManualImportProvider } = await import('core')
    
    const provider = new ManualImportProvider()
    const status = provider.getSyncStatus(statusData.cnr)
    
    return {
      success: true,
      data: { status }
    }
  } catch (error) {
    console.error('Error getting sync status:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
})

// Tasks IPC handlers
ipcMain.handle('tasks:create', async (event, taskData) => {
  try {
    console.log('Creating task:', taskData)
    
    // Stub implementation - call data service
    const { db } = await import('data')
    
    // Mock task creation
    const newTask = {
      id: `task-${Date.now()}`,
      title: taskData.title,
      description: taskData.description,
      caseId: taskData.caseId,
      assignedTo: taskData.assignedTo,
      priority: taskData.priority || 'MEDIUM',
      status: 'PENDING',
      dueDate: taskData.dueDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    return { success: true, data: newTask }
  } catch (error) {
    console.error('Error creating task:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
})

ipcMain.handle('tasks:list', async (event, listParams) => {
  try {
    console.log('Listing tasks:', listParams)
    
    // Stub implementation - call data service
    const { db } = await import('data')
    
    // Mock task list
    const mockTasks = [
      {
        id: '1',
        title: 'Review contract documents',
        description: 'Review the contract agreement for ABC Corporation case',
        caseId: 'CASE-2024-001',
        assignedTo: 'John Doe',
        priority: 'HIGH',
        status: 'PENDING',
        dueDate: new Date(),
        createdAt: new Date(),
      },
      {
        id: '2',
        title: 'Prepare client meeting',
        description: 'Prepare agenda and materials for client meeting',
        caseId: 'CASE-2024-002',
        assignedTo: 'John Doe',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        dueDate: new Date(),
        createdAt: new Date(),
      },
    ]
    
    return { success: true, data: mockTasks }
  } catch (error) {
    console.error('Error listing tasks:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
})

ipcMain.handle('tasks:transition', async (event, transitionData) => {
  try {
    console.log('Transitioning task:', transitionData)
    
    // Stub implementation - call data service
    const { db } = await import('data')
    
    // Mock task transition
    const updatedTask = {
      id: transitionData.taskId,
      status: transitionData.newStatus,
      updatedAt: new Date(),
      transitionedBy: transitionData.userId,
    }
    
    return { success: true, data: updatedTask }
  } catch (error) {
    console.error('Error transitioning task:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
})

// Office IPC handlers
ipcMain.handle('office:listPendingForUser', async (event, userParams) => {
  try {
    console.log('Listing pending items for user:', userParams)
    
    // Stub implementation - call data service
    const { db } = await import('data')
    
    // Mock pending items
    const pendingItems = {
      tasks: [
        {
          id: '1',
          title: 'Review contract documents',
          priority: 'HIGH',
          dueDate: new Date(),
        },
      ],
      cases: [
        {
          id: '1',
          caseNumber: 'CASE-2024-001',
          title: 'Contract Dispute Resolution',
          priority: 'HIGH',
        },
      ],
      hearings: [
        {
          id: '1',
          caseNumber: 'CASE-2024-001',
          court: 'High Court of Delhi',
          date: new Date(),
          time: '10:30 AM',
        },
      ],
    }
    
    return { success: true, data: pendingItems }
  } catch (error) {
    console.error('Error listing pending items:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
})

ipcMain.handle('office:createPersonalTask', async (event, taskData) => {
  try {
    console.log('Creating personal task:', taskData)
    
    // Stub implementation - call data service
    const { db } = await import('data')
    
    // Mock personal task creation
    const newPersonalTask = {
      id: `personal-task-${Date.now()}`,
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority || 'MEDIUM',
      status: 'PENDING',
      dueDate: taskData.dueDate,
      createdBy: taskData.userId,
      createdAt: new Date(),
    }
    
    return { success: true, data: newPersonalTask }
  } catch (error) {
    console.error('Error creating personal task:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
})

// Files IPC handlers
ipcMain.handle('files:openPdf', async (event, fileData) => {
  try {
    console.log('Opening PDF:', fileData)
    
    // Import file management service
    const { fileManagementService } = await import('data')
    
    // Get file content
    const fileContent = await fileManagementService.getFileContent(fileData.fileId)
    
    if (!fileContent) {
      throw new Error('File not found')
    }
    
    // Create temporary file for PDF viewer
    const tempDir = require('os').tmpdir()
    const tempFilePath = path.join(tempDir, `pdf-${fileData.fileId}.pdf`)
    
    // Write file content to temporary file
    require('fs').writeFileSync(tempFilePath, fileContent)
    
    // Open PDF in embedded viewer
    const pdfWindow = new BrowserWindow({
      width: 1000,
      height: 800,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      },
      title: `PDF Viewer - ${fileData.fileName || 'Document'}`
    })
    
    // Load PDF viewer HTML
    const pdfViewerHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>PDF Viewer</title>
        <style>
          body { margin: 0; padding: 0; background: #f5f5f5; }
          .pdf-container { width: 100%; height: 100vh; }
          .pdf-viewer { width: 100%; height: 100%; border: none; }
          .toolbar { 
            background: #333; 
            color: white; 
            padding: 10px; 
            display: flex; 
            align-items: center; 
            gap: 10px;
          }
          .toolbar button {
            background: #555;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
          }
          .toolbar button:hover {
            background: #666;
          }
        </style>
      </head>
      <body>
        <div class="toolbar">
          <button onclick="window.history.back()">← Back</button>
          <button onclick="window.print()">Print</button>
          <button onclick="downloadPdf()">Download</button>
          <span id="fileName">${fileData.fileName || 'Document'}</span>
        </div>
        <div class="pdf-container">
          <iframe class="pdf-viewer" src="file://${tempFilePath}"></iframe>
        </div>
        <script>
          function downloadPdf() {
            const link = document.createElement('a');
            link.href = 'file://${tempFilePath}';
            link.download = '${fileData.fileName || 'document.pdf'}';
            link.click();
          }
        </script>
      </body>
      </html>
    `
    
    pdfWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(pdfViewerHtml)}`)
    
    // Clean up temporary file when window is closed
    pdfWindow.on('closed', () => {
      try {
        require('fs').unlinkSync(tempFilePath)
      } catch (error) {
        console.error('Error cleaning up temporary file:', error)
      }
    })
    
    return {
      success: true,
      fileId: fileData.fileId,
      fileName: fileData.fileName,
      tempFilePath,
      message: 'PDF opened in embedded viewer'
    }
    
  } catch (error) {
    console.error('Error opening PDF:', error)
  }
})

// Additional file handlers
ipcMain.handle('files:upload', async (event, uploadData) => {
  try {
    console.log('Uploading file:', uploadData)
    
    // Import file management service
    const { fileManagementService } = await import('data')
    
    // Convert base64 to buffer if needed
    let fileBuffer: Buffer
    if (uploadData.fileData.startsWith('data:')) {
      const base64Data = uploadData.fileData.split(',')[1]
      fileBuffer = Buffer.from(base64Data, 'base64')
    } else {
      fileBuffer = Buffer.from(uploadData.fileData, 'base64')
    }
    
    // Upload file
    const result = await fileManagementService.uploadFile({
      originalName: uploadData.fileName,
      mimeType: uploadData.mimeType,
      fileBuffer,
      uploadedBy: uploadData.uploadedBy,
      caseId: uploadData.caseId,
      orderId: uploadData.orderId,
      tags: uploadData.tags,
      description: uploadData.description
    })
    
    return {
      success: true,
      fileId: result.id,
      fileName: result.originalName,
      size: result.size,
      message: 'File uploaded successfully'
    }
    
  } catch (error) {
    console.error('Error uploading file:', error)
    return {
      success: false,
      error: error.message,
      message: 'Failed to upload file'
    }
  }
})

ipcMain.handle('files:getCaseFiles', async (event, caseData) => {
  try {
    console.log('Getting case files:', caseData)
    
    // Import file management service
    const { fileManagementService } = await import('data')
    
    // Get case files
    const files = await fileManagementService.getCaseFiles(caseData.caseId)
    
    return {
      success: true,
      files: files.map(file => ({
        id: file.id,
        originalName: file.originalName,
        mimeType: file.mimeType,
        size: file.size,
        uploadedAt: file.uploadedAt,
        uploadedBy: file.uploadedBy,
        tags: file.tags,
        description: file.description
      })),
      message: 'Case files retrieved successfully'
    }
    
  } catch (error) {
    console.error('Error getting case files:', error)
    return {
      success: false,
      error: error.message,
      message: 'Failed to get case files'
    }
  }
})

ipcMain.handle('files:getOrderPdfs', async (event, orderData) => {
  try {
    console.log('Getting order PDFs:', orderData)
    
    // Import file management service
    const { fileManagementService } = await import('data')
    
    // Get order PDFs
    const pdfs = await fileManagementService.getOrderPdfs(orderData.orderId)
    
    return {
      success: true,
      pdfs: pdfs.map(file => ({
        id: file.id,
        originalName: file.originalName,
        size: file.size,
        uploadedAt: file.uploadedAt,
        uploadedBy: file.uploadedBy
      })),
      message: 'Order PDFs retrieved successfully'
    }
    
  } catch (error) {
    console.error('Error getting order PDFs:', error)
    return {
      success: false,
      error: error.message,
      message: 'Failed to get order PDFs'
    }
  }
})

// Backup IPC handlers
ipcMain.handle('backup:exportNow', async (event, exportParams) => {
  try {
    console.log('Starting backup export:', exportParams)
    
    // Import backup service
    const { backupService } = await import('data')
    
    // Export backup
    const result = await backupService.exportNow({
      includeFiles: exportParams.includeFiles !== false,
      includeDatabase: exportParams.includeDatabase !== false,
      includeMetadata: exportParams.includeMetadata !== false,
      compressionLevel: exportParams.compressionLevel || 6
    })
    
    return {
      success: true,
      backupId: result.backupId,
      filePath: result.filePath,
      size: result.size,
      createdAt: result.createdAt,
      checksum: result.checksum,
      metadata: result.metadata,
      message: 'Backup exported successfully'
    }
    
  } catch (error) {
    console.error('Error exporting backup:', error)
    return {
      success: false,
      error: error.message,
      message: 'Failed to export backup'
    }
  }
})

ipcMain.handle('backup:restoreFromZip', async (event, restoreParams) => {
  try {
    console.log('Starting backup restore:', restoreParams)
    
    // Import backup service
    const { backupService } = await import('data')
    
    // Restore from ZIP
    const result = await backupService.restoreFromZip(restoreParams.filePath)
    
    return {
      success: result.success,
      restoreId: result.restoreId,
      restoredAt: result.restoredAt,
      metadata: result.metadata,
      errors: result.errors,
      message: result.success ? 'Backup restored successfully' : 'Backup restore completed with errors'
    }
    
  } catch (error) {
    console.error('Error restoring backup:', error)
    return {
      success: false,
      error: error.message,
      message: 'Failed to restore backup'
    }
  }
})

ipcMain.handle('backup:listBackups', async (event) => {
  try {
    console.log('Listing backups')
    
    // Import backup service
    const { backupService } = await import('data')
    
    // List backups
    const backups = await backupService.listBackups()
    
    return {
      success: true,
      backups: backups.map(backup => ({
        fileName: backup.fileName,
        filePath: backup.filePath,
        size: backup.size,
        createdAt: backup.createdAt,
        checksum: backup.checksum
      })),
      message: 'Backups listed successfully'
    }
    
  } catch (error) {
    console.error('Error listing backups:', error)
    return {
      success: false,
      error: error.message,
      message: 'Failed to list backups'
    }
  }
})

ipcMain.handle('backup:deleteBackup', async (event, deleteParams) => {
  try {
    console.log('Deleting backup:', deleteParams)
    
    // Import backup service
    const { backupService } = await import('data')
    
    // Delete backup
    const result = await backupService.deleteBackup(deleteParams.fileName)
    
    return {
      success: result,
      message: result ? 'Backup deleted successfully' : 'Backup not found'
    }
    
  } catch (error) {
    console.error('Error deleting backup:', error)
    return {
      success: false,
      error: error.message,
      message: 'Failed to delete backup'
    }
  }
})

ipcMain.handle('backup:getStatistics', async (event) => {
  try {
    console.log('Getting backup statistics')
    
    // Import backup service
    const { backupService } = await import('data')
    
    // Get statistics
    const stats = await backupService.getBackupStatistics()
    
    return {
      success: true,
      statistics: stats,
      message: 'Backup statistics retrieved successfully'
    }
    
  } catch (error) {
    console.error('Error getting backup statistics:', error)
    return {
      success: false,
      error: error.message,
      message: 'Failed to get backup statistics'
    }
  }
})

// Notification IPC handlers
ipcMain.handle('notifications:getConfig', async (event) => {
  try {
    console.log('Getting notification configuration')
    
    // Import notification service
    const { electronNotificationService } = await import('./notification-service')
    
    // Get configuration
    const config = electronNotificationService.getConfig()
    
    return {
      success: true,
      config,
      message: 'Notification configuration retrieved successfully'
    }
    
  } catch (error) {
    console.error('Error getting notification configuration:', error)
    return {
      success: false,
      error: error.message,
      message: 'Failed to get notification configuration'
    }
  }
})

ipcMain.handle('notifications:updateConfig', async (event, newConfig) => {
  try {
    console.log('Updating notification configuration:', newConfig)
    
    // Import notification service
    const { electronNotificationService } = await import('./notification-service')
    
    // Update configuration
    electronNotificationService.updateConfig(newConfig)
    
    return {
      success: true,
      message: 'Notification configuration updated successfully'
    }
    
  } catch (error) {
    console.error('Error updating notification configuration:', error)
    return {
      success: false,
      error: error.message,
      message: 'Failed to update notification configuration'
    }
  }
})

ipcMain.handle('notifications:test', async (event) => {
  try {
    console.log('Sending test notification')
    
    // Import notification service
    const { electronNotificationService } = await import('./notification-service')
    
    // Send test notification
    electronNotificationService.showTestNotification()
    
    return {
      success: true,
      message: 'Test notification sent successfully'
    }
    
  } catch (error) {
    console.error('Error sending test notification:', error)
    return {
      success: false,
      error: error.message,
      message: 'Failed to send test notification'
    }
  }
})

ipcMain.handle('notifications:sendHearingDate', async (event, hearingData) => {
  try {
    console.log('Sending hearing date notification:', hearingData)
    
    // Import notification service
    const { electronNotificationService } = await import('./notification-service')
    
    // Send hearing date notification
    electronNotificationService.showHearingDateNotification(hearingData)
    
    return {
      success: true,
      message: 'Hearing date notification sent successfully'
    }
    
  } catch (error) {
    console.error('Error sending hearing date notification:', error)
    return {
      success: false,
      error: error.message,
      message: 'Failed to send hearing date notification'
    }
  }
})

ipcMain.handle('notifications:sendSLABreach', async (event, slaData) => {
  try {
    console.log('Sending SLA breach notification:', slaData)
    
    // Import notification service
    const { electronNotificationService } = await import('./notification-service')
    
    // Send SLA breach notification
    electronNotificationService.showSLABreachNotification(slaData)
    
    return {
      success: true,
      message: 'SLA breach notification sent successfully'
    }
    
  } catch (error) {
    console.error('Error sending SLA breach notification:', error)
    return {
      success: false,
      error: error.message,
      message: 'Failed to send SLA breach notification'
    }
  }
})

ipcMain.handle('notifications:sendReviewRequested', async (event, reviewData) => {
  try {
    console.log('Sending review requested notification:', reviewData)
    
    // Import notification service
    const { electronNotificationService } = await import('./notification-service')
    
    // Send review requested notification
    electronNotificationService.showReviewRequestedNotification(reviewData)
    
    return {
      success: true,
      message: 'Review requested notification sent successfully'
    }
    
  } catch (error) {
    console.error('Error sending review requested notification:', error)
    return {
      success: false,
      error: error.message,
      message: 'Failed to send review requested notification'
    }
  }
})

ipcMain.handle('notifications:sendDailyDigest', async (event, digestData) => {
  try {
    console.log('Sending daily digest notification:', digestData)
    
    // Import notification service
    const { electronNotificationService } = await import('./notification-service')
    
    // Send daily digest notification
    electronNotificationService.showDailyDigestNotification(digestData)
    
    return {
      success: true,
      message: 'Daily digest notification sent successfully'
    }
    
  } catch (error) {
    console.error('Error sending daily digest notification:', error)
    return {
      success: false,
      error: error.message,
      message: 'Failed to send daily digest notification'
    }
  }
})

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault()
    require('electron').shell.openExternal(navigationUrl)
  })
})
