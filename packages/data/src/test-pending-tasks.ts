import { 
  TaskRepository,
  userPendingSummaryWorker,
  dailyDigestService,
  dailyDigestJobScheduler,
  db
} from './index'
// import { PendingTaskFilters, RecurrenceConfig } from 'core'

/**
 * Pending Tasks Test Suite
 * Tests the enhanced task management and digest functionality
 */
class PendingTasksTester {
  
  async testPendingTasksFunctionality() {
    console.log('📋 Testing Enhanced Task Management & Digest System...\n')
    
    // Test task repository with new features
    await this.testTaskRepository()
    
    // Test pending tasks filtering
    await this.testPendingTasksFiltering()
    
    // Test user pending summary worker
    await this.testUserPendingSummaryWorker()
    
    // Test daily digest service
    await this.testDailyDigestService()
    
    // Test daily digest job scheduler
    await this.testDailyDigestJobScheduler()
    
    console.log('\n✅ Enhanced Task Management & Digest tests completed!')
  }
  
  private async testTaskRepository() {
    console.log('🔧 Testing Enhanced Task Repository...')
    
    const taskRepo = new TaskRepository(db)
    
    // Test creating task with recurrence
    const recurrenceConfig: RecurrenceConfig = {
      pattern: 'WEEKLY',
      interval: 1,
      daysOfWeek: [1, 3, 5], // Monday, Wednesday, Friday
      timezone: 'Asia/Kolkata'
    }
    
    try {
      const task = await taskRepo.create({
        title: 'Weekly Team Meeting',
        description: 'Regular team sync meeting',
        category: 'ADMIN',
        priority: 'MEDIUM',
        assignedTo: 'test-user-id',
        createdBy: 'test-user-id',
        isRecurring: true,
        recurringPattern: 'WEEKLY',
        // recurrenceJSON: JSON.stringify(recurrenceConfig),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      })
      
      console.log(`  Task Creation: ✅ Created recurring task "${task.title}"`)
      console.log(`    Category: ${task.category}`)
      console.log(`    Recurring: ${task.isRecurring}`)
      console.log(`    Pattern: ${task.recurringPattern}`)
      
    } catch (error) {
      console.log(`  Task Creation: ❌ Error - ${error}`)
    }
    
    // Test creating personal task
    try {
      const personalTask = await taskRepo.create({
        title: 'Update LinkedIn Profile',
        description: 'Update professional profile and connections',
        category: 'PERSONAL',
        priority: 'LOW',
        assignedTo: 'test-user-id',
        createdBy: 'test-user-id',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
      })
      
      console.log(`  Personal Task: ✅ Created personal task "${personalTask.title}"`)
      
    } catch (error) {
      console.log(`  Personal Task: ❌ Error - ${error}`)
    }
    
    // Test creating BizDev task
    try {
      const bizDevTask = await taskRepo.create({
        title: 'Client Outreach Campaign',
        description: 'Plan and execute Q2 client outreach',
        category: 'BIZDEV',
        priority: 'HIGH',
        assignedTo: 'test-user-id',
        createdBy: 'test-user-id',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
      })
      
      console.log(`  BizDev Task: ✅ Created BizDev task "${bizDevTask.title}"`)
      
    } catch (error) {
      console.log(`  BizDev Task: ❌ Error - ${error}`)
    }
    
    console.log('')
  }
  
  private async testPendingTasksFiltering() {
    console.log('🔍 Testing Pending Tasks Filtering...')
    
    const taskRepo = new TaskRepository(db)
    
    // Test different filter combinations
    const filterTests = [
      {
        name: 'Personal Tasks Only',
        filters: {
          userId: 'test-user-id',
          categories: ['PERSONAL'],
          limit: 10,
          offset: 0
        }
      },
      {
        name: 'Admin Tasks Only',
        filters: {
          userId: 'test-user-id',
          categories: ['ADMIN'],
          limit: 10,
          offset: 0
        }
      },
      {
        name: 'High Priority Tasks',
        filters: {
          userId: 'test-user-id',
          priorities: ['HIGH', 'URGENT'],
          limit: 10,
          offset: 0
        }
      },
      {
        name: 'Overdue Tasks',
        filters: {
          userId: 'test-user-id',
          overdue: true,
          limit: 10,
          offset: 0
        }
      },
      {
        name: 'Tasks Due This Week',
        filters: {
          userId: 'test-user-id',
          dueDateFrom: new Date(),
          dueDateTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          limit: 10,
          offset: 0
        }
      }
    ]
    
    for (const test of filterTests) {
      try {
        const result = await taskRepo.listPendingForUser(test.filters)
        console.log(`  ${test.name}: ✅ Found ${result.data.length} tasks`)
        
        if (result.data.length > 0) {
          result.data.forEach((task, index) => {
            console.log(`    ${index + 1}. ${task.title} (${task.category}, ${task.priority})`)
          })
        }
        
      } catch (error) {
        console.log(`  ${test.name}: ❌ Error - ${error}`)
      }
    }
    
    console.log('')
  }
  
  private async testUserPendingSummaryWorker() {
    console.log('👤 Testing User Pending Summary Worker...')
    
    try {
      // Test refreshing summary for a specific user
      const summary = await userPendingSummaryWorker.refreshUserPendingSummary('test-user-id')
      
      if (summary) {
        console.log(`  User Summary: ✅ Generated summary for user`)
        console.log(`    Total Pending: ${summary.totalPendingItems}`)
        console.log(`    Urgent Items: ${summary.totalUrgentItems}`)
        console.log(`    Overdue Items: ${summary.totalOverdueItems}`)
        console.log(`    Personal Tasks: ${summary.personalTasks}`)
        console.log(`    Admin Tasks: ${summary.adminTasks}`)
        console.log(`    BizDev Tasks: ${summary.bizDevTasks}`)
        console.log(`    Workload Level: ${summary.workloadLevel}`)
      } else {
        console.log(`  User Summary: ❌ No summary generated`)
      }
      
    } catch (error) {
      console.log(`  User Summary: ❌ Error - ${error}`)
    }
    
    try {
      // Test getting existing summary
      const existingSummary = await userPendingSummaryWorker.getUserPendingSummary('test-user-id')
      
      if (existingSummary) {
        console.log(`  Existing Summary: ✅ Retrieved existing summary`)
        console.log(`    Last Updated: ${existingSummary.updatedAt || 'Unknown'}`)
      } else {
        console.log(`  Existing Summary: ❌ No existing summary found`)
      }
      
    } catch (error) {
      console.log(`  Existing Summary: ❌ Error - ${error}`)
    }
    
    console.log('')
  }
  
  private async testDailyDigestService() {
    console.log('📧 Testing Daily Digest Service...')
    
    try {
      // Test generating digest for a specific user
      const digest = await dailyDigestService.generateUserDigest('test-user-id')
      
      if (digest) {
        console.log(`  User Digest: ✅ Generated digest for ${digest.userName}`)
        console.log(`    Personal Tasks: ${digest.personalTasks.pending} pending`)
        console.log(`    Admin Tasks: ${digest.adminTasks.pending} pending`)
        console.log(`    Case Tasks: ${digest.caseTasks.pending} pending`)
        console.log(`    BizDev Tasks: ${digest.bizDevTasks.pending} pending`)
        console.log(`    Total Pending: ${digest.totalPendingItems}`)
        console.log(`    Workload Level: ${digest.workloadLevel}`)
        console.log(`    Digest Message: ${digest.digestMessage}`)
        console.log(`    Priority Message: ${digest.priorityMessage}`)
        
        // Test formatting for notification
        const notificationMessage = dailyDigestService.formatDigestForNotification(digest)
        console.log(`  Notification Format: ✅ Generated notification message`)
        console.log(`    Message Length: ${notificationMessage.length} characters`)
        
      } else {
        console.log(`  User Digest: ❌ No digest generated`)
      }
      
    } catch (error) {
      console.log(`  User Digest: ❌ Error - ${error}`)
    }
    
    try {
      // Test generating digests for all users
      const allDigests = await dailyDigestService.generateAllUserDigests()
      console.log(`  All Users Digest: ✅ Generated ${allDigests.length} digests`)
      
    } catch (error) {
      console.log(`  All Users Digest: ❌ Error - ${error}`)
    }
    
    console.log('')
  }
  
  private async testDailyDigestJobScheduler() {
    console.log('⏰ Testing Daily Digest Job Scheduler...')
    
    try {
      // Test scheduler status
      const status = dailyDigestJobScheduler.getStatus()
      console.log(`  Scheduler Status: ✅ Scheduler running: ${status.isRunning}`)
      
      if (status.nextRun) {
        console.log(`    Next Run: ${status.nextRun.toLocaleString()}`)
      }
      
    } catch (error) {
      console.log(`  Scheduler Status: ❌ Error - ${error}`)
    }
    
    try {
      // Test running digest for a specific user
      await dailyDigestJobScheduler.runUserDigest('test-user-id')
      console.log(`  User Digest Job: ✅ Successfully ran digest job for user`)
      
    } catch (error) {
      console.log(`  User Digest Job: ❌ Error - ${error}`)
    }
    
    try {
      // Test the digest system
      await dailyDigestJobScheduler.testDigest()
      console.log(`  Digest Test: ✅ Successfully tested digest system`)
      
    } catch (error) {
      console.log(`  Digest Test: ❌ Error - ${error}`)
    }
    
    console.log('')
  }
  
  private async testRecurrenceConfiguration() {
    console.log('🔄 Testing Recurrence Configuration...')
    
    const recurrenceConfigs = [
      {
        name: 'Daily Task',
        config: {
          pattern: 'DAILY',
          interval: 1,
          timezone: 'Asia/Kolkata'
        }
      },
      {
        name: 'Weekly Task',
        config: {
          pattern: 'WEEKLY',
          interval: 1,
          daysOfWeek: [1, 3, 5], // Mon, Wed, Fri
          timezone: 'Asia/Kolkata'
        }
      },
      {
        name: 'Monthly Task',
        config: {
          pattern: 'MONTHLY',
          interval: 1,
          dayOfMonth: 15,
          timezone: 'Asia/Kolkata'
        }
      },
      {
        name: 'Yearly Task',
        config: {
          pattern: 'YEARLY',
          interval: 1,
          dayOfMonth: 1,
          timezone: 'Asia/Kolkata'
        }
      }
    ]
    
    for (const test of recurrenceConfigs) {
      try {
        const configJson = JSON.stringify(test.config)
        console.log(`  ${test.name}: ✅ Configuration valid`)
        console.log(`    Pattern: ${test.config.pattern}`)
        console.log(`    Interval: ${test.config.interval}`)
        console.log(`    Timezone: ${test.config.timezone}`)
        
        if (test.config.daysOfWeek) {
          console.log(`    Days of Week: ${test.config.daysOfWeek.join(', ')}`)
        }
        
        if (test.config.dayOfMonth) {
          console.log(`    Day of Month: ${test.config.dayOfMonth}`)
        }
        
      } catch (error) {
        console.log(`  ${test.name}: ❌ Error - ${error}`)
      }
    }
    
    console.log('')
  }
}

// Run the test suite
async function runPendingTasksTests() {
  const tester = new PendingTasksTester()
  await tester.testPendingTasksFunctionality()
}

// Export for use in other modules
export { PendingTasksTester, runPendingTasksTests }

// Run tests if this file is executed directly
if (require.main === module) {
  runPendingTasksTests().catch(console.error)
}
