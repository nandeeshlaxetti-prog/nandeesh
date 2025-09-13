import { 
  SLAEvaluatorService,
  SLAEvaluationContext,
  SLAEvaluationResult,
  SLAConditions,
  SLAMetrics,
  SLAEscalationRule,
  SLANotificationSettings
} from 'data'

/**
 * SLA Evaluator Test Suite
 * Tests the SLA evaluation functionality
 */
class SLAEvaluatorTester {
  
  async testSLAEvaluator() {
    console.log('📊 Testing SLA Evaluator Service...\n')
    
    // Test basic functionality
    await this.testBasicEvaluation()
    
    // Test different entity types
    await this.testEntityTypeEvaluation()
    
    // Test SLA rule conditions
    await this.testSLAConditions()
    
    // Test metric calculations
    await this.testMetricCalculations()
    
    // Test escalation rules
    await this.testEscalationRules()
    
    // Test breach summary
    await this.testBreachSummary()
    
    console.log('\n✅ SLA Evaluator tests completed!')
  }
  
  private async testBasicEvaluation() {
    console.log('🔧 Testing Basic SLA Evaluation...')
    
    const evaluator = new SLAEvaluatorService()
    
    // Test case evaluation
    const caseContext: SLAEvaluationContext = {
      entityId: 'case-123',
      entityType: 'CASE',
      entitySubType: 'CIVIL',
      priority: 'HIGH',
      teamId: 'team-123',
      employeeId: 'emp-123'
    }
    
    try {
      const results = await evaluator.evaluateSLA(caseContext)
      console.log(`  Case Evaluation: ${results.length > 0 ? '✅' : '❌'} (${results.length} rules applied)`)
      
      if (results.length > 0) {
        results.forEach((result, index) => {
          console.log(`    Rule ${index + 1}: ${result.status} (${result.currentValue}/${result.thresholdValue})`)
        })
      }
    } catch (error) {
      console.log(`  Case Evaluation: ❌ Error - ${error}`)
    }
    
    // Test task evaluation
    const taskContext: SLAEvaluationContext = {
      entityId: 'task-456',
      entityType: 'TASK',
      priority: 'MEDIUM',
      teamId: 'team-123',
      employeeId: 'emp-123'
    }
    
    try {
      const results = await evaluator.evaluateSLA(taskContext)
      console.log(`  Task Evaluation: ${results.length > 0 ? '✅' : '❌'} (${results.length} rules applied)`)
    } catch (error) {
      console.log(`  Task Evaluation: ❌ Error - ${error}`)
    }
    
    console.log('')
  }
  
  private async testEntityTypeEvaluation() {
    console.log('📋 Testing Entity Type Evaluation...')
    
    const evaluator = new SLAEvaluatorService()
    
    const entityTypes = ['CASE', 'TASK', 'HEARING', 'ORDER', 'PROJECT']
    
    for (const entityType of entityTypes) {
      const context: SLAEvaluationContext = {
        entityId: `${entityType.toLowerCase()}-test`,
        entityType,
        priority: 'MEDIUM',
        teamId: 'team-123'
      }
      
      try {
        const results = await evaluator.evaluateSLA(context)
        console.log(`  ${entityType} Evaluation: ${results.length > 0 ? '✅' : '❌'} (${results.length} rules)`)
      } catch (error) {
        console.log(`  ${entityType} Evaluation: ❌ Error - ${error}`)
      }
    }
    
    console.log('')
  }
  
  private async testSLAConditions() {
    console.log('🔍 Testing SLA Conditions...')
    
    const evaluator = new SLAEvaluatorService()
    
    // Test priority-based conditions
    const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']
    
    for (const priority of priorities) {
      const context: SLAEvaluationContext = {
        entityId: 'test-case',
        entityType: 'CASE',
        priority,
        teamId: 'team-123'
      }
      
      try {
        const results = await evaluator.evaluateSLA(context)
        console.log(`  Priority ${priority}: ${results.length > 0 ? '✅' : '❌'} (${results.length} rules)`)
      } catch (error) {
        console.log(`  Priority ${priority}: ❌ Error - ${error}`)
      }
    }
    
    // Test team-specific conditions
    const teamContext: SLAEvaluationContext = {
      entityId: 'team-case',
      entityType: 'CASE',
      priority: 'HIGH',
      teamId: 'corporate-team'
    }
    
    try {
      const results = await evaluator.evaluateSLA(teamContext)
      console.log(`  Team-specific: ${results.length > 0 ? '✅' : '❌'} (${results.length} rules)`)
    } catch (error) {
      console.log(`  Team-specific: ❌ Error - ${error}`)
    }
    
    console.log('')
  }
  
  private async testMetricCalculations() {
    console.log('📈 Testing Metric Calculations...')
    
    const evaluator = new SLAEvaluatorService()
    
    // Test response time calculation
    const responseTimeContext: SLAEvaluationContext = {
      entityId: 'response-test',
      entityType: 'CASE',
      priority: 'HIGH'
    }
    
    try {
      const results = await evaluator.evaluateSLA(responseTimeContext)
      console.log(`  Response Time: ${results.length > 0 ? '✅' : '❌'} (${results.length} calculations)`)
      
      if (results.length > 0) {
        results.forEach((result, index) => {
          console.log(`    Calculation ${index + 1}: ${result.currentValue} hours (threshold: ${result.thresholdValue})`)
        })
      }
    } catch (error) {
      console.log(`  Response Time: ❌ Error - ${error}`)
    }
    
    // Test resolution time calculation
    const resolutionTimeContext: SLAEvaluationContext = {
      entityId: 'resolution-test',
      entityType: 'TASK',
      priority: 'MEDIUM'
    }
    
    try {
      const results = await evaluator.evaluateSLA(resolutionTimeContext)
      console.log(`  Resolution Time: ${results.length > 0 ? '✅' : '❌'} (${results.length} calculations)`)
    } catch (error) {
      console.log(`  Resolution Time: ❌ Error - ${error}`)
    }
    
    // Test uptime calculation
    const uptimeContext: SLAEvaluationContext = {
      entityId: 'uptime-test',
      entityType: 'PROJECT',
      priority: 'HIGH'
    }
    
    try {
      const results = await evaluator.evaluateSLA(uptimeContext)
      console.log(`  Uptime: ${results.length > 0 ? '✅' : '❌'} (${results.length} calculations)`)
    } catch (error) {
      console.log(`  Uptime: ❌ Error - ${error}`)
    }
    
    console.log('')
  }
  
  private async testEscalationRules() {
    console.log('🚨 Testing Escalation Rules...')
    
    const evaluator = new SLAEvaluatorService()
    
    // Test escalation for high priority cases
    const escalationContext: SLAEvaluationContext = {
      entityId: 'escalation-test',
      entityType: 'CASE',
      priority: 'HIGH',
      teamId: 'team-123',
      employeeId: 'emp-123'
    }
    
    try {
      const results = await evaluator.evaluateSLA(escalationContext)
      console.log(`  Escalation Test: ${results.length > 0 ? '✅' : '❌'} (${results.length} evaluations)`)
      
      if (results.length > 0) {
        results.forEach((result, index) => {
          console.log(`    Evaluation ${index + 1}: ${result.status}`)
          if (result.breachDate) {
            console.log(`      Breach Date: ${result.breachDate}`)
          }
          if (result.escalationDate) {
            console.log(`      Escalation Date: ${result.escalationDate}`)
          }
        })
      }
    } catch (error) {
      console.log(`  Escalation Test: ❌ Error - ${error}`)
    }
    
    console.log('')
  }
  
  private async testBreachSummary() {
    console.log('📊 Testing Breach Summary...')
    
    const evaluator = new SLAEvaluatorService()
    
    try {
      // Test breach summary without filters
      const allBreaches = await evaluator.getSLABreachSummary()
      console.log(`  All Breaches: ${allBreaches.length > 0 ? '✅' : '❌'} (${allBreaches.length} breaches)`)
      
      // Test breach summary with team filter
      const teamBreaches = await evaluator.getSLABreachSummary('team-123')
      console.log(`  Team Breaches: ${teamBreaches.length > 0 ? '✅' : '❌'} (${teamBreaches.length} breaches)`)
      
      // Test breach summary with date range
      const dateRangeBreaches = await evaluator.getSLABreachSummary(undefined, {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        end: new Date()
      })
      console.log(`  Date Range Breaches: ${dateRangeBreaches.length > 0 ? '✅' : '❌'} (${dateRangeBreaches.length} breaches)`)
      
    } catch (error) {
      console.log(`  Breach Summary: ❌ Error - ${error}`)
    }
    
    console.log('')
  }
  
  private async testEntityEvaluations() {
    console.log('🔍 Testing Entity Evaluations...')
    
    const evaluator = new SLAEvaluatorService()
    
    const testEntities = [
      { id: 'case-123', type: 'CASE' },
      { id: 'task-456', type: 'TASK' },
      { id: 'hearing-789', type: 'HEARING' }
    ]
    
    for (const entity of testEntities) {
      try {
        const evaluations = await evaluator.getEntityEvaluations(entity.id, entity.type)
        console.log(`  ${entity.type} ${entity.id}: ${evaluations.length > 0 ? '✅' : '❌'} (${evaluations.length} evaluations)`)
      } catch (error) {
        console.log(`  ${entity.type} ${entity.id}: ❌ Error - ${error}`)
      }
    }
    
    console.log('')
  }
  
  private async testDefaultSLARules() {
    console.log('⚙️ Testing Default SLA Rules Creation...')
    
    const evaluator = new SLAEvaluatorService()
    
    try {
      await evaluator.createDefaultSLARules()
      console.log('  Default SLA Rules: ✅ Created successfully')
    } catch (error) {
      console.log(`  Default SLA Rules: ❌ Error - ${error}`)
    }
    
    console.log('')
  }
}

// Run the test suite
async function runSLAEvaluatorTests() {
  const tester = new SLAEvaluatorTester()
  await tester.testSLAEvaluator()
}

// Export for use in other modules
export { SLAEvaluatorTester, runSLAEvaluatorTests }

// Run tests if this file is executed directly
if (require.main === module) {
  runSLAEvaluatorTests().catch(console.error)
}
