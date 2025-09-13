export const testConfig = {
  // Base URLs for different environments
  urls: {
    development: 'http://localhost:3000',
    staging: 'https://staging.lnn-legal.com',
    production: 'https://app.lnn-legal.com'
  },

  // Test data configuration
  testData: {
    // Mock CNR numbers for testing
    mockCNRs: [
      'CNR123456789',
      'CNR987654321',
      'CNR555666777'
    ],

    // Mock case data
    mockCases: [
      {
        cnr: 'CNR123456789',
        caseNumber: 'CASE-2024-001',
        title: 'Contract Dispute Resolution',
        court: 'High Court of Delhi',
        stage: 'Arguments',
        priority: 'HIGH',
        status: 'OPEN',
        parties: ['ABC Corporation', 'XYZ Ltd'],
        hearings: [
          {
            date: '2024-04-15',
            type: 'Arguments',
            status: 'SCHEDULED'
          }
        ]
      },
      {
        cnr: 'CNR987654321',
        caseNumber: 'CASE-2024-002',
        title: 'Property Settlement',
        court: 'Bombay High Court',
        stage: 'Evidence',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        parties: ['John Doe', 'Jane Smith'],
        hearings: [
          {
            date: '2024-04-20',
            type: 'Evidence',
            status: 'SCHEDULED'
          }
        ]
      }
    ],

    // Mock hearing data
    mockHearings: [
      {
        caseId: '1',
        scheduledDate: new Date('2024-04-15'),
        type: 'Arguments',
        courtName: 'High Court of Delhi',
        status: 'SCHEDULED',
        expectedPrepTask: {
          title: 'Hearing Prep - CASE-2024-001',
          dueDate: new Date('2024-04-12'), // 3 days before hearing
          priority: 'HIGH',
          assignee: 'John Doe',
          category: 'Case'
        }
      }
    ],

    // Mock task data
    mockTasks: [
      {
        id: '1',
        title: 'Hearing Prep - CASE-2024-001',
        description: 'Prepare for hearing on 2024-04-15',
        status: 'TODO',
        priority: 'HIGH',
        dueDate: new Date('2024-04-12'),
        assignee: 'John Doe',
        category: 'Case',
        kanbanColumn: 'Backlog'
      },
      {
        id: '2',
        title: 'Summarize & circulate order',
        description: 'Summarize and circulate the latest order',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: new Date('2024-04-16'), // +1 day from order upload
        assignee: 'John Doe',
        category: 'Case',
        kanbanColumn: 'ToDo'
      }
    ]
  },

  // Mock provider configurations
  mockProviders: {
    ecourts: {
      baseUrl: 'https://mock-ecourts.gov.in',
      endpoints: {
        getCaseByCNR: '/api/case/{cnr}',
        searchCases: '/api/search',
        getCauseList: '/api/cause-list',
        downloadOrder: '/api/order/{orderId}/download'
      },
      responses: {
        success: {
          caseData: {
            caseNumber: 'CNR123456789',
            title: 'Mock Case from eCourts',
            court: 'Mock Court',
            stage: 'Preliminary',
            parties: ['Mock Petitioner', 'Mock Respondent'],
            hearings: [
              {
                date: '2024-04-15',
                type: 'Arguments',
                status: 'SCHEDULED'
              }
            ]
          },
          searchResults: [
            {
              caseNumber: 'MOCK-2024-001',
              title: 'Mock Search Result',
              court: 'Mock Court',
              stage: 'Preliminary'
            }
          ]
        },
        error: {
          invalidCNR: 'Invalid CNR number',
          networkError: 'Network connection failed',
          captchaRequired: 'Captcha verification required'
        }
      }
    },

    khc: {
      baseUrl: 'https://mock-khc.kar.nic.in',
      benches: ['bengaluru', 'dharwad', 'kalaburagi'],
      endpoints: {
        getCaseByNumber: '/api/case/{caseNumber}',
        searchCases: '/api/search',
        getCauseList: '/api/cause-list/{bench}/{date}',
        listOrders: '/api/orders/{caseId}',
        downloadOrder: '/api/order/{orderId}/download'
      },
      responses: {
        success: {
          caseData: {
            caseNumber: 'KHC2024001',
            title: 'Mock KHC Case',
            bench: 'bengaluru',
            status: 'ACTIVE'
          },
          causeList: [
            {
              caseNumber: 'KHC-2024-001',
              title: 'Mock Cause List Item',
              time: '10:00 AM',
              court: 'KHC bengaluru'
            }
          ]
        },
        error: {
          caseNotFound: 'Case not found',
          invalidBench: 'Invalid bench specified',
          captchaRequired: 'Captcha verification required'
        }
      }
    }
  },

  // Automation rules configuration
  automationRules: {
    hearingPrepTask: {
      enabled: true,
      daysBeforeHearing: 3,
      taskTitle: 'Hearing Prep - {caseNumber}',
      priority: 'HIGH',
      category: 'Case',
      assignToCaseLawyer: true
    },
    orderProcessing: {
      enabled: true,
      daysAfterUpload: 1,
      taskTitle: 'Summarize & circulate order',
      priority: 'MEDIUM',
      category: 'Case',
      assignToCaseLawyer: true
    },
    blockedTaskNotification: {
      enabled: true,
      hoursThreshold: 48,
      notifyAssignee: true,
      notifyManager: true,
      notificationType: 'desktop'
    },
    slaBreach: {
      enabled: true,
      notificationType: 'desktop',
      escalationLevels: [
        { severity: 'low', notifyAssignee: true },
        { severity: 'medium', notifyAssignee: true, notifyManager: true },
        { severity: 'high', notifyAssignee: true, notifyManager: true, notifyPartner: true }
      ]
    }
  },

  // Backup and restore configuration
  backup: {
    exportPath: '/tmp/backup-test.zip',
    expectedContents: [
      'database.sqlite',
      'files/',
      'metadata.json'
    ],
    metadataSchema: {
      version: 'string',
      timestamp: 'string',
      databaseVersion: 'string',
      fileCount: 'number',
      totalSize: 'number',
      userInfo: 'object'
    }
  },

  // Performance thresholds
  performance: {
    pageLoadTime: 5000, // 5 seconds
    navigationTime: 2000, // 2 seconds
    apiResponseTime: 3000, // 3 seconds
    backupCreationTime: 30000 // 30 seconds
  },

  // Test timeouts
  timeouts: {
    short: 5000,
    medium: 15000,
    long: 30000,
    veryLong: 60000
  },

  // Browser configurations
  browsers: {
    chromium: {
      headless: false,
      slowMo: 100
    },
    firefox: {
      headless: false,
      slowMo: 100
    },
    webkit: {
      headless: false,
      slowMo: 100
    }
  },

  // Environment-specific settings
  environments: {
    development: {
      mockProviders: true,
      skipAuth: true,
      fastMode: true
    },
    staging: {
      mockProviders: false,
      skipAuth: false,
      fastMode: false
    },
    production: {
      mockProviders: false,
      skipAuth: false,
      fastMode: false
    }
  }
}

export default testConfig

