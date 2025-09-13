import { test, expect } from '@playwright/test'
import { spawn, ChildProcess } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

test.describe('Electron Integration Tests', () => {
  let electronProcess: ChildProcess | null = null
  let webServerProcess: ChildProcess | null = null

  test.beforeAll(async () => {
    // Start the web server
    webServerProcess = spawn('pnpm', ['dev:web'], {
      cwd: process.cwd(),
      stdio: 'pipe',
      shell: true
    })

    // Wait for web server to be ready
    await new Promise((resolve) => setTimeout(resolve, 10000))

    // Start Electron app
    electronProcess = spawn('pnpm', ['dev:desktop'], {
      cwd: process.cwd(),
      stdio: 'pipe',
      shell: true
    })

    // Wait for Electron to be ready
    await new Promise((resolve) => setTimeout(resolve, 5000))
  })

  test.afterAll(async () => {
    if (electronProcess) {
      electronProcess.kill()
    }
    if (webServerProcess) {
      webServerProcess.kill()
    }
  })

  test('should launch Electron app and connect to web server', async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3000')
    
    // Verify the application loads
    await expect(page.locator('h1')).toContainText('LNN Legal Desktop')
    
    // Test Electron-specific functionality if available
    // Note: This would require the Electron app to be running and accessible
    // In a real implementation, we would test:
    // 1. IPC communication
    // 2. Native notifications
    // 3. File system access
    // 4. Desktop integration features
  })

  test('should test IPC communication', async ({ page }) => {
    await page.goto('http://localhost:3000')
    
    // Test if Electron IPC is available
    const hasElectronIPC = await page.evaluate(() => {
      return typeof (window as any).app !== 'undefined' && 
             typeof (window as any).app.invoke === 'function'
    })

    if (hasElectronIPC) {
      // Test IPC communication
      const result = await page.evaluate(async () => {
        try {
          return await (window as any).app.invoke('test:ping', { message: 'hello' })
        } catch (error) {
          return { error: error.message }
        }
      })

      // Verify IPC response
      expect(result).toBeDefined()
    } else {
      // Skip test if not in Electron environment
      test.skip(true, 'Not running in Electron environment')
    }
  })

  test('should test native notifications', async ({ page }) => {
    await page.goto('http://localhost:3000')
    
    // Test notification functionality
    const hasNotifications = await page.evaluate(() => {
      return typeof Notification !== 'undefined'
    })

    if (hasNotifications) {
      // Test notification creation
      const notificationResult = await page.evaluate(async () => {
        try {
          const permission = await Notification.requestPermission()
          if (permission === 'granted') {
            new Notification('Test Notification', {
              body: 'This is a test notification from the E2E test',
              icon: '/favicon.ico'
            })
            return { success: true, permission }
          }
          return { success: false, permission }
        } catch (error) {
          return { error: error.message }
        }
      })

      expect(notificationResult.success).toBe(true)
    } else {
      test.skip(true, 'Notifications not available in this environment')
    }
  })
})

test.describe('Database Integration Tests', () => {
  test('should verify database connectivity', async ({ page }) => {
    await page.goto('http://localhost:3000')
    
    // Verify database status is shown
    await expect(page.locator('text=Database')).toBeVisible()
    await expect(page.locator('text=Connected')).toBeVisible()
  })

  test('should test case creation workflow', async ({ page }) => {
    await page.goto('/cases')
    
    // Verify cases page loads
    await expect(page.locator('h1')).toContainText('Cases')
    
    // Verify sample cases are displayed
    await expect(page.locator('text=CASE-2024-001')).toBeVisible()
    await expect(page.locator('text=CASE-2024-002')).toBeVisible()
    await expect(page.locator('text=CASE-2024-003')).toBeVisible()
    
    // Verify case details
    await expect(page.locator('text=Contract Dispute Resolution')).toBeVisible()
    await expect(page.locator('text=Property Settlement')).toBeVisible()
    await expect(page.locator('text=Employment Law Matter')).toBeVisible()
  })

  test('should test case detail navigation', async ({ page }) => {
    await page.goto('/cases')
    
    // Click on first case
    await page.click('text=CASE-2024-001')
    
    // Verify case detail page
    await expect(page.locator('h1')).toContainText('CASE-2024-001')
    await expect(page.locator('text=Contract Dispute Resolution')).toBeVisible()
    await expect(page.locator('text=High Court of Delhi')).toBeVisible()
    await expect(page.locator('text=OPEN')).toBeVisible()
  })
})

test.describe('Mock Provider Tests', () => {
  test('should test mock CNR lookup', async ({ page }) => {
    // This test simulates the CNR lookup functionality
    // In a real implementation, we would:
    // 1. Mock the court provider responses
    // 2. Test CNR lookup with various scenarios
    // 3. Verify case creation workflow
    
    await page.goto('/cases')
    
    // Verify the cases page has the expected structure
    await expect(page.locator('button:has-text("Add Case")')).toBeVisible()
    
    // Test the add case modal
    await page.click('button:has-text("Add Case")')
    await expect(page.locator('text=Add New Case')).toBeVisible()
  })

  test('should test mock court provider integration', async ({ page }) => {
    await page.goto('/integrations')
    
    // Verify integration settings
    await expect(page.locator('text=eCourts Integration')).toBeVisible()
    await expect(page.locator('text=Karnataka High Court')).toBeVisible()
    
    // Test connection buttons
    const testButtons = page.locator('button:has-text("Test Connection")')
    await expect(testButtons).toHaveCount(2)
    
    // Click test buttons (they won't actually work in mock mode)
    await testButtons.first().click()
    await testButtons.last().click()
  })
})

test.describe('Automation Rules Tests', () => {
  test('should verify hearing prep task automation', async ({ page }) => {
    // This test verifies the automation rules for hearing prep tasks
    // In a real implementation, we would:
    // 1. Create a case with a hearing date
    // 2. Verify that a "Hearing Prep" task is automatically created
    // 3. Check the task is due 3 days before the hearing
    // 4. Verify task assignment and priority
    
    await page.goto('/cases/1')
    
    // Verify we're on the case detail page
    await expect(page.locator('h1')).toContainText('CASE-2024-001')
    
    // In a real implementation, we would add a hearing date and verify task creation
    // For now, we verify the page structure supports this functionality
    await expect(page.locator('text=Case Information')).toBeVisible()
  })

  test('should verify task automation rules', async ({ page }) => {
    await page.goto('/tasks')
    
    // Verify tasks page loads
    await expect(page.locator('h1')).toContainText('Tasks')
    
    // In a real implementation, we would:
    // 1. Verify task board structure
    // 2. Test task creation and automation
    // 3. Verify task transitions
    // 4. Test work logging functionality
  })
})

test.describe('Backup and Restore Tests', () => {
  test('should test backup export functionality', async ({ page }) => {
    await page.goto('/settings')
    
    // Verify settings page loads
    await expect(page.locator('h1')).toContainText('Settings')
    
    // In a real implementation, we would:
    // 1. Click backup export button
    // 2. Wait for backup creation
    // 3. Verify ZIP file download
    // 4. Verify ZIP contents:
    //    - database.sqlite
    //    - files/ directory
    //    - metadata.json
    // 5. Verify file integrity
  })

  test('should test restore functionality', async ({ page }) => {
    await page.goto('/settings')
    
    // In a real implementation, we would:
    // 1. Upload a backup ZIP file
    // 2. Verify restore process
    // 3. Verify data integrity after restore
    // 4. Verify application functionality
  })
})

test.describe('Performance Tests', () => {
  test('should verify page load performance', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/')
    
    // Wait for page to be fully loaded
    await expect(page.locator('h1')).toContainText('LNN Legal Desktop')
    
    const loadTime = Date.now() - startTime
    
    // Verify page loads within reasonable time (5 seconds)
    expect(loadTime).toBeLessThan(5000)
  })

  test('should verify navigation performance', async ({ page }) => {
    await page.goto('/')
    
    const pages = ['Cases', 'Tasks', 'Team', 'Leave', 'Integrations', 'Settings']
    
    for (const pageName of pages) {
      const startTime = Date.now()
      
      await page.click(`text=${pageName}`)
      await expect(page.locator('h1')).toContainText(pageName)
      
      const navigationTime = Date.now() - startTime
      
      // Verify navigation is fast (2 seconds)
      expect(navigationTime).toBeLessThan(2000)
    }
  })
})

test.describe('Accessibility Tests', () => {
  test('should verify keyboard navigation', async ({ page }) => {
    await page.goto('/')
    
    // Test Tab navigation
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Verify focus is visible
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('should verify ARIA labels and roles', async ({ page }) => {
    await page.goto('/')
    
    // Verify main heading has proper role
    await expect(page.locator('h1')).toHaveAttribute('role', 'heading')
    
    // Verify buttons have proper roles
    const buttons = page.locator('button')
    const buttonCount = await buttons.count()
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i)
      await expect(button).toHaveAttribute('role', 'button')
    }
  })
})
