/**
 * Migration Service
 * Helps users migrate from localStorage to cloud storage
 */

import { cloudStorageService, CloudCase } from './cloud-storage-service'

export interface MigrationStatus {
  isComplete: boolean
  totalCases: number
  migratedCases: number
  failedCases: number
  errors: string[]
  progress: number // 0-100
}

class MigrationService {
  private migrationKey = 'legal-cases-migration-status'

  /**
   * Check if migration is needed
   */
  needsMigration(): boolean {
    const migrationStatus = this.getMigrationStatus()
    return !migrationStatus.isComplete
  }

  /**
   * Get current migration status
   */
  getMigrationStatus(): MigrationStatus {
    try {
      const stored = localStorage.getItem(this.migrationKey)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load migration status:', error)
    }

    return {
      isComplete: false,
      totalCases: 0,
      migratedCases: 0,
      failedCases: 0,
      errors: [],
      progress: 0
    }
  }

  /**
   * Start migration process
   */
  async startMigration(): Promise<MigrationStatus> {
    console.log('🔄 Starting migration from localStorage to cloud storage...')
    
    const status: MigrationStatus = {
      isComplete: false,
      totalCases: 0,
      migratedCases: 0,
      failedCases: 0,
      errors: [],
      progress: 0
    }

    try {
      // Get cases from localStorage
      const localCases = this.getLocalCases()
      status.totalCases = localCases.length

      if (localCases.length === 0) {
        status.isComplete = true
        status.progress = 100
        this.saveMigrationStatus(status)
        return status
      }

      console.log(`📋 Found ${localCases.length} cases to migrate`)

      // Migrate cases one by one
      for (let i = 0; i < localCases.length; i++) {
        const localCase = localCases[i]
        
        try {
          // Convert local case to cloud case format
          const cloudCase: Omit<CloudCase, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'lastUpdatedBy'> = {
            title: localCase.title || 'Untitled Case',
            caseNumber: localCase.caseNumber,
            cnrNumber: localCase.cnrNumber,
            petitionerName: localCase.petitionerName,
            respondentName: localCase.respondentName,
            court: localCase.court,
            courtLocation: localCase.courtLocation,
            subjectMatter: localCase.subjectMatter,
            reliefSought: localCase.reliefSought,
            stage: localCase.stage,
            caseStatus: localCase.caseStatus,
            priority: localCase.priority || 'MEDIUM',
            filingDate: localCase.filingDate,
            nextHearingDate: localCase.nextHearingDate,
            lastHearingDate: localCase.lastHearingDate,
            caseValue: localCase.caseValue,
            assignedTo: localCase.assignedTo,
            notes: localCase.notes,
            documents: localCase.documents,
            // Additional eCourts data
            registrationNumber: localCase.registrationNumber,
            filingNumber: localCase.filingNumber,
            status: localCase.status,
            parties: localCase.parties,
            acts: localCase.acts,
            subMatters: localCase.subMatters,
            iaDetails: localCase.iaDetails,
            categoryDetails: localCase.categoryDetails,
            documentDetails: localCase.documentDetails,
            objections: localCase.objections,
            history: localCase.history,
            orders: localCase.orders,
            firstInformationReport: localCase.firstInformationReport,
            transfer: localCase.transfer
          }

          // Add to cloud storage
          await cloudStorageService.addCase(cloudCase)
          status.migratedCases++
          
          console.log(`✅ Migrated case ${i + 1}/${localCases.length}: ${localCase.title}`)
          
        } catch (error) {
          status.failedCases++
          const errorMsg = `Failed to migrate case "${localCase.title}": ${error}`
          status.errors.push(errorMsg)
          console.error('❌', errorMsg)
        }

        // Update progress
        status.progress = Math.round(((i + 1) / localCases.length) * 100)
        this.saveMigrationStatus(status)

        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      // Mark migration as complete
      status.isComplete = true
      this.saveMigrationStatus(status)

      console.log(`✅ Migration completed: ${status.migratedCases} migrated, ${status.failedCases} failed`)
      
      // Clear old localStorage data after successful migration
      if (status.failedCases === 0) {
        this.clearOldLocalData()
      }

    } catch (error) {
      const errorMsg = `Migration failed: ${error}`
      status.errors.push(errorMsg)
      console.error('❌', errorMsg)
    }

    return status
  }

  /**
   * Get cases from localStorage
   */
  private getLocalCases(): any[] {
    try {
      const stored = localStorage.getItem('legal-cases')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Failed to load local cases:', error)
      return []
    }
  }

  /**
   * Save migration status
   */
  private saveMigrationStatus(status: MigrationStatus): void {
    try {
      localStorage.setItem(this.migrationKey, JSON.stringify(status))
    } catch (error) {
      console.error('Failed to save migration status:', error)
    }
  }

  /**
   * Clear old localStorage data after successful migration
   */
  private clearOldLocalData(): void {
    try {
      localStorage.removeItem('legal-cases')
      localStorage.removeItem('legal-desktop-cases')
      console.log('🗑️ Cleared old localStorage data')
    } catch (error) {
      console.error('Failed to clear old data:', error)
    }
  }

  /**
   * Reset migration status (for testing)
   */
  resetMigration(): void {
    localStorage.removeItem(this.migrationKey)
    console.log('🔄 Migration status reset')
  }

  /**
   * Get migration summary
   */
  getMigrationSummary(): {
    needsMigration: boolean
    localCasesCount: number
    cloudCasesCount: number
    lastMigration: Date | null
  } {
    const migrationStatus = this.getMigrationStatus()
    const localCases = this.getLocalCases()
    
    return {
      needsMigration: this.needsMigration(),
      localCasesCount: localCases.length,
      cloudCasesCount: 0, // Will be updated when we fetch from cloud
      lastMigration: migrationStatus.isComplete ? new Date() : null
    }
  }
}

// Export singleton instance
export const migrationService = new MigrationService()




