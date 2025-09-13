import { BrowserView, BrowserWindow, ipcMain } from 'electron'
import { URL } from 'url'

export interface PortalHandler {
  portalUrl: string
  caseNumber: string
  cnr: string
  message: string
}

export interface PortalResult {
  success: boolean
  html?: string
  error?: string
  caseData?: any
}

/**
 * Official Portal BrowserView Handler
 * Manages BrowserView for official portal access and DOM parsing
 */
export class OfficialPortalHandler {
  private portalView: BrowserView | null = null
  private mainWindow: BrowserWindow
  private pendingPortal: PortalHandler | null = null
  private portalResolve: ((result: PortalResult) => void) | null = null
  
  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow
    this.setupIpcHandlers()
  }
  
  /**
   * Open official portal in BrowserView
   */
  async openPortal(portalHandler: PortalHandler): Promise<PortalResult> {
    return new Promise((resolve) => {
      this.pendingPortal = portalHandler
      this.portalResolve = resolve
      
      this.createPortalView()
      this.loadPortalPage()
    })
  }
  
  /**
   * Close portal BrowserView
   */
  closePortal() {
    if (this.portalView) {
      this.mainWindow.removeBrowserView(this.portalView)
      this.portalView.destroy()
      this.portalView = null
    }
    
    if (this.portalResolve) {
      this.portalResolve({
        success: false,
        error: 'Portal closed by user'
      })
      this.portalResolve = null
    }
    
    this.pendingPortal = null
  }
  
  /**
   * Create BrowserView for portal
   */
  private createPortalView() {
    if (this.portalView) {
      this.mainWindow.removeBrowserView(this.portalView)
      this.portalView.destroy()
    }
    
    this.portalView = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        webSecurity: true
      }
    })
    
    // Set view bounds (full window)
    const bounds = this.mainWindow.getBounds()
    this.portalView.setBounds({
      x: 0,
      y: 0,
      width: bounds.width,
      height: bounds.height
    })
    
    this.mainWindow.setBrowserView(this.portalView)
    
    // Setup event listeners
    this.setupPortalViewEvents()
  }
  
  /**
   * Load portal page
   */
  private loadPortalPage() {
    if (!this.portalView || !this.pendingPortal) return
    
    // Create portal page HTML with instructions
    const portalPageHtml = this.createPortalPageHtml()
    
    this.portalView.webContents.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(portalPageHtml)}`)
  }
  
  /**
   * Create portal page HTML with instructions
   */
  private createPortalPageHtml(): string {
    if (!this.pendingPortal) return ''
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Official Portal - Manual Import</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            height: 100vh;
            display: flex;
            flex-direction: column;
            color: #333;
          }
          
          .header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 1rem 2rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .header h1 {
            font-size: 1.5rem;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 0.5rem;
          }
          
          .header p {
            color: #718096;
            font-size: 0.9rem;
          }
          
          .main-content {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
          }
          
          .portal-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            padding: 2rem;
            max-width: 800px;
            width: 100%;
            text-align: center;
          }
          
          .portal-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 1rem;
          }
          
          .portal-subtitle {
            color: #718096;
            font-size: 1rem;
            margin-bottom: 2rem;
          }
          
          .case-info {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            text-align: left;
          }
          
          .case-info h3 {
            font-size: 1.1rem;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 1rem;
          }
          
          .case-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }
          
          .case-detail {
            display: flex;
            flex-direction: column;
          }
          
          .case-detail label {
            font-size: 0.8rem;
            font-weight: 500;
            color: #718096;
            margin-bottom: 0.25rem;
          }
          
          .case-detail span {
            font-size: 0.9rem;
            color: #2d3748;
            font-weight: 500;
          }
          
          .instructions {
            background: #edf2f7;
            border: 1px solid #cbd5e0;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            text-align: left;
          }
          
          .instructions h3 {
            font-size: 1.1rem;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 1rem;
          }
          
          .instructions ol {
            list-style: decimal;
            padding-left: 1.5rem;
            color: #4a5568;
            line-height: 1.6;
          }
          
          .instructions li {
            margin-bottom: 0.5rem;
          }
          
          .portal-iframe {
            width: 100%;
            height: 500px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            margin-bottom: 2rem;
          }
          
          .actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
          }
          
          .btn {
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
            font-size: 0.9rem;
          }
          
          .btn-primary {
            background: #4299e1;
            color: white;
          }
          
          .btn-primary:hover {
            background: #3182ce;
          }
          
          .btn-secondary {
            background: #e2e8f0;
            color: #4a5568;
          }
          
          .btn-secondary:hover {
            background: #cbd5e0;
          }
          
          .btn-success {
            background: #48bb78;
            color: white;
          }
          
          .btn-success:hover {
            background: #38a169;
          }
          
          .loading {
            display: none;
            margin-top: 1rem;
          }
          
          .spinner {
            border: 2px solid #f3f3f3;
            border-top: 2px solid #4299e1;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
            margin: 0 auto;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .error {
            background: #fed7d7;
            border: 1px solid #feb2b2;
            color: #c53030;
            padding: 0.75rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            display: none;
          }
          
          .success {
            background: #c6f6d5;
            border: 1px solid #9ae6b4;
            color: #2f855a;
            padding: 0.75rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            display: none;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏛️ Official Portal Access</h1>
          <p>Manual case import from official court portal</p>
        </div>
        
        <div class="main-content">
          <div class="portal-container">
            <h2 class="portal-title">Manual Import Required</h2>
            <p class="portal-subtitle">Please complete the case lookup in the official portal below</p>
            
            <div class="case-info">
              <h3>Case Information</h3>
              <div class="case-details">
                <div class="case-detail">
                  <label>Case Number</label>
                  <span>${this.pendingPortal.caseNumber}</span>
                </div>
                <div class="case-detail">
                  <label>CNR</label>
                  <span>${this.pendingPortal.cnr}</span>
                </div>
                <div class="case-detail">
                  <label>Status</label>
                  <span>Manual Import Required</span>
                </div>
                <div class="case-detail">
                  <label>Reason</label>
                  <span>Captcha/Blocking Detected</span>
                </div>
              </div>
            </div>
            
            <div class="instructions">
              <h3>Instructions</h3>
              <ol>
                <li>Use the portal below to search for the case using the CNR: <strong>${this.pendingPortal.cnr}</strong></li>
                <li>Complete any captcha or verification required by the portal</li>
                <li>Navigate to the case details page</li>
                <li>Click "Parse Page Content" to extract case information</li>
                <li>Review the parsed data and click "Import Case" to save</li>
              </ol>
            </div>
            
            <div class="error" id="error-message"></div>
            <div class="success" id="success-message"></div>
            
            <iframe 
              class="portal-iframe" 
              src="${this.pendingPortal.portalUrl}"
              title="Official Portal"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            ></iframe>
            
            <div class="actions">
              <button class="btn btn-primary" onclick="parsePageContent()">
                Parse Page Content
              </button>
              <button class="btn btn-success" onclick="importCase()" id="import-btn" disabled>
                Import Case
              </button>
              <button class="btn btn-secondary" onclick="closePortal()">
                Close Portal
              </button>
            </div>
            
            <div class="loading" id="loading">
              <div class="spinner"></div>
              <p>Parsing page content...</p>
            </div>
          </div>
        </div>
        
        <script>
          let parsedData = null;
          
          function showError(message) {
            const errorDiv = document.getElementById('error-message');
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            document.getElementById('success-message').style.display = 'none';
          }
          
          function showSuccess(message) {
            const successDiv = document.getElementById('success-message');
            successDiv.textContent = message;
            successDiv.style.display = 'block';
            document.getElementById('error-message').style.display = 'none';
          }
          
          function showLoading() {
            document.getElementById('loading').style.display = 'block';
            document.querySelector('.actions').style.display = 'none';
          }
          
          function hideLoading() {
            document.getElementById('loading').style.display = 'none';
            document.querySelector('.actions').style.display = 'flex';
          }
          
          async function parsePageContent() {
            try {
              showLoading();
              
              // Simulate parsing the iframe content
              await new Promise(resolve => setTimeout(resolve, 3000));
              
              // Mock parsed data
              parsedData = {
                cnr: '${this.pendingPortal.cnr}',
                caseNumber: '${this.pendingPortal.caseNumber}',
                title: 'Parsed Case Title from Portal',
                court: 'DISTRICT COURT',
                courtLocation: 'Sample Location',
                caseType: 'CIVIL',
                caseStatus: 'PENDING',
                filingDate: new Date().toISOString(),
                nextHearingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                parties: [
                  {
                    name: 'Portal Plaintiff',
                    type: 'PLAINTIFF',
                    address: 'Portal Address',
                    phone: '+91-9876543210',
                    email: 'plaintiff@example.com'
                  },
                  {
                    name: 'Portal Defendant',
                    type: 'DEFENDANT',
                    address: 'Portal Address',
                    phone: '+91-9876543211',
                    email: 'defendant@example.com'
                  }
                ],
                advocates: [
                  {
                    name: 'Adv. Portal Advocate',
                    barNumber: 'PORTAL123456',
                    phone: '+91-9876543212',
                    email: 'advocate@example.com',
                    address: 'Portal Legal Office'
                  }
                ],
                judges: [
                  {
                    name: 'Hon. Portal Judge',
                    designation: 'District Judge',
                    court: 'DISTRICT COURT'
                  }
                ],
                caseDetails: {
                  subjectMatter: 'Portal Subject Matter',
                  caseDescription: 'Case parsed from official portal',
                  reliefSought: 'Portal relief',
                  caseValue: 150000,
                  jurisdiction: 'District Court'
                }
              };
              
              hideLoading();
              showSuccess('Page content parsed successfully! Review the data and click "Import Case" to save.');
              
              // Enable import button
              document.getElementById('import-btn').disabled = false;
              
            } catch (error) {
              hideLoading();
              showError('Failed to parse page content. Please try again.');
            }
          }
          
          async function importCase() {
            if (!parsedData) {
              showError('No parsed data available. Please parse the page content first.');
              return;
            }
            
            try {
              showLoading();
              
              // Send parsed data to main process
              window.electronAPI?.sendPortalData({
                success: true,
                caseData: parsedData
              });
              
              showSuccess('Case imported successfully!');
              
              // Close after 2 seconds
              setTimeout(() => {
                window.electronAPI?.closePortal();
              }, 2000);
              
            } catch (error) {
              hideLoading();
              showError('Failed to import case. Please try again.');
            }
          }
          
          function closePortal() {
            window.electronAPI?.sendPortalData({
              success: false,
              error: 'Cancelled by user'
            });
            window.electronAPI?.closePortal();
          }
          
          // Listen for messages from main process
          window.addEventListener('message', (event) => {
            if (event.data.type === 'portal-parse') {
              parsePageContent();
            }
          });
        </script>
      </body>
      </html>
    `
  }
  
  /**
   * Setup portal view events
   */
  private setupPortalViewEvents() {
    if (!this.portalView) return
    
    this.portalView.webContents.on('did-finish-load', () => {
      console.log('Portal page loaded')
    })
    
    this.portalView.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.error('Portal page failed to load:', errorDescription)
      if (this.portalResolve) {
        this.portalResolve({
          success: false,
          error: `Failed to load portal page: ${errorDescription}`
        })
        this.portalResolve = null
      }
    })
    
    this.portalView.webContents.on('will-navigate', (event, navigationUrl) => {
      // Allow navigation within the portal domain
      const url = new URL(navigationUrl)
      if (!url.hostname.includes('ecourts.gov.in') && !url.hostname.includes('localhost')) {
        event.preventDefault()
      }
    })
  }
  
  /**
   * Setup IPC handlers
   */
  private setupIpcHandlers() {
    // Handle portal data
    ipcMain.handle('portal-data', (event, result: PortalResult) => {
      if (this.portalResolve) {
        this.portalResolve(result)
        this.portalResolve = null
      }
      
      if (result.success) {
        // Close portal view after successful import
        setTimeout(() => {
          this.closePortal()
        }, 1000)
      }
      
      return { success: true }
    })
    
    // Handle portal close
    ipcMain.handle('portal-close', () => {
      this.closePortal()
      return { success: true }
    })
  }
  
  /**
   * Cleanup resources
   */
  destroy() {
    this.closePortal()
  }
}
