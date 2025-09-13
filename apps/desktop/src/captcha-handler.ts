import { BrowserView, BrowserWindow, ipcMain } from 'electron'
import { URL } from 'url'

export interface CaptchaHandler {
  captchaUrl: string
  sessionId: string
  message: string
}

export interface CaptchaResult {
  success: boolean
  sessionId?: string
  error?: string
}

/**
 * Karnataka High Court Captcha Handler
 * Manages in-app BrowserView for captcha completion
 */
export class KarnatakaHighCourtCaptchaHandler {
  private captchaView: BrowserView | null = null
  private mainWindow: BrowserWindow
  private pendingCaptcha: CaptchaHandler | null = null
  private captchaResolve: ((result: CaptchaResult) => void) | null = null
  
  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow
    this.setupIpcHandlers()
  }
  
  /**
   * Open captcha in BrowserView
   */
  async openCaptcha(captchaHandler: CaptchaHandler): Promise<CaptchaResult> {
    return new Promise((resolve) => {
      this.pendingCaptcha = captchaHandler
      this.captchaResolve = resolve
      
      this.createCaptchaView()
      this.loadCaptchaPage()
    })
  }
  
  /**
   * Close captcha BrowserView
   */
  closeCaptcha() {
    if (this.captchaView) {
      this.mainWindow.removeBrowserView(this.captchaView)
      this.captchaView.destroy()
      this.captchaView = null
    }
    
    if (this.captchaResolve) {
      this.captchaResolve({
        success: false,
        error: 'Captcha cancelled by user'
      })
      this.captchaResolve = null
    }
    
    this.pendingCaptcha = null
  }
  
  /**
   * Create BrowserView for captcha
   */
  private createCaptchaView() {
    if (this.captchaView) {
      this.mainWindow.removeBrowserView(this.captchaView)
      this.captchaView.destroy()
    }
    
    this.captchaView = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        webSecurity: true
      }
    })
    
    // Set view bounds (bottom half of window)
    const bounds = this.mainWindow.getBounds()
    this.captchaView.setBounds({
      x: 0,
      y: bounds.height / 2,
      width: bounds.width,
      height: bounds.height / 2
    })
    
    this.mainWindow.setBrowserView(this.captchaView)
    
    // Setup event listeners
    this.setupCaptchaViewEvents()
  }
  
  /**
   * Load captcha page
   */
  private loadCaptchaPage() {
    if (!this.captchaView || !this.pendingCaptcha) return
    
    // Create captcha page HTML
    const captchaPageHtml = this.createCaptchaPageHtml()
    
    this.captchaView.webContents.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(captchaPageHtml)}`)
  }
  
  /**
   * Create captcha page HTML
   */
  private createCaptchaPageHtml(): string {
    if (!this.pendingCaptcha) return ''
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Karnataka High Court - CAPTCHA Verification</title>
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
            align-items: center;
            justify-content: center;
            color: #333;
          }
          
          .captcha-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            text-align: center;
          }
          
          .captcha-header {
            margin-bottom: 2rem;
          }
          
          .captcha-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 0.5rem;
          }
          
          .captcha-subtitle {
            color: #718096;
            font-size: 0.9rem;
          }
          
          .captcha-message {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1.5rem;
            font-size: 0.9rem;
            color: #4a5568;
          }
          
          .captcha-iframe {
            width: 100%;
            height: 300px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            margin-bottom: 1.5rem;
          }
          
          .captcha-actions {
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
        <div class="captcha-container">
          <div class="captcha-header">
            <h1 class="captcha-title">🏛️ Karnataka High Court</h1>
            <p class="captcha-subtitle">CAPTCHA Verification Required</p>
          </div>
          
          <div class="captcha-message">
            ${this.pendingCaptcha.message}
          </div>
          
          <div class="error" id="error-message"></div>
          <div class="success" id="success-message"></div>
          
          <iframe 
            class="captcha-iframe" 
            src="${this.pendingCaptcha.captchaUrl}"
            title="CAPTCHA Verification"
            sandbox="allow-scripts allow-same-origin allow-forms"
          ></iframe>
          
          <div class="captcha-actions">
            <button class="btn btn-primary" onclick="completeCaptcha()">
              Complete Verification
            </button>
            <button class="btn btn-secondary" onclick="cancelCaptcha()">
              Cancel
            </button>
          </div>
          
          <div class="loading" id="loading">
            <div class="spinner"></div>
            <p>Processing verification...</p>
          </div>
        </div>
        
        <script>
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
            document.querySelector('.captcha-actions').style.display = 'none';
          }
          
          function hideLoading() {
            document.getElementById('loading').style.display = 'none';
            document.querySelector('.captcha-actions').style.display = 'flex';
          }
          
          async function completeCaptcha() {
            try {
              showLoading();
              
              // Simulate captcha completion
              await new Promise(resolve => setTimeout(resolve, 2000));
              
              // Send completion signal to main process
              window.electronAPI?.sendCaptchaCompletion({
                success: true,
                sessionId: '${this.pendingCaptcha?.sessionId}'
              });
              
              showSuccess('CAPTCHA verification completed successfully!');
              
              // Close after 2 seconds
              setTimeout(() => {
                window.electronAPI?.closeCaptcha();
              }, 2000);
              
            } catch (error) {
              hideLoading();
              showError('Failed to complete CAPTCHA verification. Please try again.');
            }
          }
          
          function cancelCaptcha() {
            window.electronAPI?.sendCaptchaCompletion({
              success: false,
              error: 'Cancelled by user'
            });
            window.electronAPI?.closeCaptcha();
          }
          
          // Listen for messages from main process
          window.addEventListener('message', (event) => {
            if (event.data.type === 'captcha-complete') {
              completeCaptcha();
            }
          });
        </script>
      </body>
      </html>
    `
  }
  
  /**
   * Setup captcha view events
   */
  private setupCaptchaViewEvents() {
    if (!this.captchaView) return
    
    this.captchaView.webContents.on('did-finish-load', () => {
      console.log('Captcha page loaded')
    })
    
    this.captchaView.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.error('Captcha page failed to load:', errorDescription)
      if (this.captchaResolve) {
        this.captchaResolve({
          success: false,
          error: `Failed to load captcha page: ${errorDescription}`
        })
        this.captchaResolve = null
      }
    })
    
    this.captchaView.webContents.on('will-navigate', (event, navigationUrl) => {
      // Allow navigation within the captcha domain
      const url = new URL(navigationUrl)
      if (!url.hostname.includes('karnataka.gov.in')) {
        event.preventDefault()
      }
    })
  }
  
  /**
   * Setup IPC handlers
   */
  private setupIpcHandlers() {
    // Handle captcha completion
    ipcMain.handle('captcha-complete', (event, result: CaptchaResult) => {
      if (this.captchaResolve) {
        this.captchaResolve(result)
        this.captchaResolve = null
      }
      
      if (result.success) {
        // Close captcha view after successful completion
        setTimeout(() => {
          this.closeCaptcha()
        }, 1000)
      }
      
      return { success: true }
    })
    
    // Handle captcha cancellation
    ipcMain.handle('captcha-cancel', () => {
      this.closeCaptcha()
      return { success: true }
    })
  }
  
  /**
   * Cleanup resources
   */
  destroy() {
    this.closeCaptcha()
  }
}
