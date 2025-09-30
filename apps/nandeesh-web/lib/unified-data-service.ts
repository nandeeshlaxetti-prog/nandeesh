/**
 * Unified Data Service
 * Seamless integration between all pages: Cases, Clients, Partners, Projects, Tasks, etc.
 */

import { cloudStorageService, CloudCase } from './cloud-storage-service'

// Unified Entity Types
export interface UnifiedClient {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  company?: string
  type: 'INDIVIDUAL' | 'CORPORATE' | 'GOVERNMENT' | 'NGO'
  status: 'ACTIVE' | 'INACTIVE' | 'PROSPECT'
  primaryContact?: string
  notes?: string
  cases?: string[] // Case IDs
  projects?: string[] // Project IDs
  createdAt: Date
  updatedAt: Date
  createdBy: string
  lastUpdatedBy: string
}

export interface UnifiedPartner {
  id: string
  name: string
  email?: string
  phone?: string
  firm?: string
  specialization?: string[]
  type: 'LAWYER' | 'CONSULTANT' | 'EXPERT_WITNESS' | 'INVESTIGATOR' | 'OTHER'
  status: 'ACTIVE' | 'INACTIVE' | 'BLACKLISTED'
  rating?: number
  cases?: string[] // Case IDs
  projects?: string[] // Project IDs
  notes?: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
  lastUpdatedBy: string
}

export interface UnifiedProject {
  id: string
  name: string
  description?: string
  clientId?: string // Reference to client
  cases?: string[] // Case IDs
  partners?: string[] // Partner IDs
  teamMembers?: string[] // User IDs
  type: 'LITIGATION' | 'TRANSACTION' | 'COMPLIANCE' | 'CONSULTATION' | 'OTHER'
  status: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  startDate?: Date
  endDate?: Date
  budget?: number
  actualCost?: number
  tasks?: string[] // Task IDs
  documents?: string[]
  notes?: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
  lastUpdatedBy: string
}

export interface UnifiedTask {
  id: string
  title: string
  description?: string
  type: 'CASE_WORK' | 'CLIENT_MEETING' | 'COURT_HEARING' | 'DOCUMENT_REVIEW' | 'RESEARCH' | 'OTHER'
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'CANCELLED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  assignedTo?: string // User ID
  caseId?: string // Reference to case
  projectId?: string // Reference to project
  clientId?: string // Reference to client
  dueDate?: Date
  completedDate?: Date
  estimatedHours?: number
  actualHours?: number
  notes?: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
  lastUpdatedBy: string
}

export interface UnifiedContact {
  id: string
  name: string
  email?: string
  phone?: string
  company?: string
  position?: string
  type: 'CLIENT' | 'PARTNER' | 'WITNESS' | 'EXPERT' | 'OPPOSING_COUNSEL' | 'COURT_STAFF' | 'OTHER'
  relationshipTo?: string // Case, Project, or Client ID
  relationshipType?: 'CASE' | 'PROJECT' | 'CLIENT' | 'GENERAL'
  notes?: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
  lastUpdatedBy: string
}

// Unified Entity Type
export type UnifiedEntity = 
  | { type: 'CASE'; data: CloudCase }
  | { type: 'CLIENT'; data: UnifiedClient }
  | { type: 'PARTNER'; data: UnifiedPartner }
  | { type: 'PROJECT'; data: UnifiedProject }
  | { type: 'TASK'; data: UnifiedTask }
  | { type: 'CONTACT'; data: UnifiedContact }

// Relationship mappings
export interface EntityRelationship {
  fromId: string
  fromType: string
  toId: string
  toType: string
  relationshipType: 'BELONGS_TO' | 'ASSIGNED_TO' | 'RELATED_TO' | 'PARENT_OF' | 'CHILD_OF'
  createdAt: Date
}

class UnifiedDataService {
  private collections = {
    cases: 'cases',
    clients: 'clients',
    partners: 'partners',
    projects: 'projects',
    tasks: 'tasks',
    contacts: 'contacts',
    relationships: 'relationships'
  }

  /**
   * Get all entities of a specific type
   */
  async getEntities<T>(entityType: keyof typeof this.collections): Promise<T[]> {
    try {
      if (entityType === 'cases') {
        return await cloudStorageService.getAllCases() as T[]
      }
      
      // For other entity types, use similar pattern as cases
      // For now, return empty array as placeholder
      return []
    } catch (error) {
      console.error(`Failed to fetch ${entityType}:`, error)
      return []
    }
  }

  /**
   * Get entity by ID
   */
  async getEntityById<T>(entityType: keyof typeof this.collections, id: string): Promise<T | null> {
    try {
      if (entityType === 'cases') {
        return await cloudStorageService.getCaseById(id) as T
      }
      
      // For other entity types, implement similar pattern
      return null
    } catch (error) {
      console.error(`Failed to fetch ${entityType} with ID ${id}:`, error)
      return null
    }
  }

  /**
   * Create a new entity
   */
  async createEntity<T>(entityType: keyof typeof this.collections, data: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'lastUpdatedBy'>): Promise<string> {
    try {
      if (entityType === 'cases') {
        return await cloudStorageService.addCase(data as any)
      }
      
      // For other entity types, implement similar pattern
      return 'temp-' + Date.now()
    } catch (error) {
      console.error(`Failed to create ${entityType}:`, error)
      throw error
    }
  }

  /**
   * Update an entity
   */
  async updateEntity<T>(entityType: keyof typeof this.collections, id: string, updates: Partial<T>): Promise<boolean> {
    try {
      if (entityType === 'cases') {
        return await cloudStorageService.updateCase(id, updates as any)
      }
      
      // For other entity types, implement similar pattern
      return true
    } catch (error) {
      console.error(`Failed to update ${entityType} with ID ${id}:`, error)
      return false
    }
  }

  /**
   * Delete an entity
   */
  async deleteEntity(entityType: keyof typeof this.collections, id: string): Promise<boolean> {
    try {
      if (entityType === 'cases') {
        return await cloudStorageService.deleteCase(id)
      }
      
      // For other entity types, implement similar pattern
      return true
    } catch (error) {
      console.error(`Failed to delete ${entityType} with ID ${id}:`, error)
      return false
    }
  }

  /**
   * Search across all entities
   */
  async searchAllEntities(query: string): Promise<UnifiedEntity[]> {
    try {
      const results: UnifiedEntity[] = []
      
      // Search cases
      const cases = await cloudStorageService.searchCases({ query })
      cases.forEach(caseItem => {
        results.push({ type: 'CASE', data: caseItem })
      })

      // Search other entity types (implement similar patterns)
      // For now, just return cases
      
      return results
    } catch (error) {
      console.error('Failed to search entities:', error)
      return []
    }
  }

  /**
   * Get related entities
   */
  async getRelatedEntities(entityType: string, entityId: string): Promise<UnifiedEntity[]> {
    try {
      const related: UnifiedEntity[] = []
      
      if (entityType === 'CLIENT') {
        // Get cases for this client
        const allCases = await cloudStorageService.getAllCases()
        const clientCases = allCases.filter(caseItem => caseItem.clientId === entityId)
        clientCases.forEach(caseItem => {
          related.push({ type: 'CASE', data: caseItem })
        })
      }
      
      if (entityType === 'CASE') {
        // Get client for this case
        const caseData = await cloudStorageService.getCaseById(entityId)
        if (caseData && caseData.clientId) {
          const client = await this.getEntityById<UnifiedClient>('clients', caseData.clientId)
          if (client) {
            related.push({ type: 'CLIENT', data: client })
          }
        }
      }
      
      return related
    } catch (error) {
      console.error('Failed to get related entities:', error)
      return []
    }
  }

  /**
   * Create relationship between entities
   */
  async createRelationship(
    fromType: string,
    fromId: string,
    toType: string,
    toId: string,
    relationshipType: EntityRelationship['relationshipType']
  ): Promise<boolean> {
    try {
      const relationship: Omit<EntityRelationship, 'createdAt'> = {
        fromId,
        fromType,
        toId,
        toType,
        relationshipType
      }
      
      // Store relationship in cloud storage
      // Implementation depends on your storage strategy
      
      return true
    } catch (error) {
      console.error('Failed to create relationship:', error)
      return false
    }
  }

  /**
   * Get dashboard summary with interconnected data
   */
  async getDashboardSummary(): Promise<{
    totalCases: number
    totalClients: number
    totalProjects: number
    totalTasks: number
    recentActivities: any[]
    upcomingDeadlines: any[]
    activeCollaborations: any[]
  }> {
    try {
      const [cases, clients, projects, tasks] = await Promise.all([
        this.getEntities<CloudCase>('cases'),
        this.getEntities<UnifiedClient>('clients'),
        this.getEntities<UnifiedProject>('projects'),
        this.getEntities<UnifiedTask>('tasks')
      ])

      return {
        totalCases: cases.length,
        totalClients: clients.length,
        totalProjects: projects.length,
        totalTasks: tasks.length,
        recentActivities: [], // Implement based on activity logs
        upcomingDeadlines: [], // Implement based on task/case deadlines
        activeCollaborations: [] // Implement based on shared entities
      }
    } catch (error) {
      console.error('Failed to get dashboard summary:', error)
      return {
        totalCases: 0,
        totalClients: 0,
        totalProjects: 0,
        totalTasks: 0,
        recentActivities: [],
        upcomingDeadlines: [],
        activeCollaborations: []
      }
    }
  }

  /**
   * Subscribe to changes across all entities
   */
  subscribeToChanges(callback: (changes: { type: string; action: string; data: any }) => void): () => void {
    // Use the existing cloud storage subscription for cases
    const unsubscribeCases = cloudStorageService.subscribeToCases((cases) => {
      callback({ type: 'CASES', action: 'UPDATE', data: cases })
    })

    // Add subscriptions for other entity types when implemented
    
    return () => {
      unsubscribeCases()
      // Unsubscribe from other entity types
    }
  }

  /**
   * Get entity navigation suggestions
   */
  getNavigationSuggestions(currentEntityType: string, currentEntityId: string): {
    label: string
    href: string
    icon: string
    count?: number
  }[] {
    const suggestions = []

    if (currentEntityType === 'CASE') {
      suggestions.push(
        { label: 'View Client', href: `/clients/${currentEntityId}`, icon: '👤' },
        { label: 'Related Tasks', href: `/tasks?caseId=${currentEntityId}`, icon: '📋' },
        { label: 'Project Timeline', href: `/projects?caseId=${currentEntityId}`, icon: '📊' }
      )
    }

    if (currentEntityType === 'CLIENT') {
      suggestions.push(
        { label: 'Client Cases', href: `/cases?clientId=${currentEntityId}`, icon: '📁' },
        { label: 'Client Projects', href: `/projects?clientId=${currentEntityId}`, icon: '📊' },
        { label: 'Contact Details', href: `/contacts?clientId=${currentEntityId}`, icon: '📞' }
      )
    }

    if (currentEntityType === 'PROJECT') {
      suggestions.push(
        { label: 'Project Cases', href: `/cases?projectId=${currentEntityId}`, icon: '📁' },
        { label: 'Project Tasks', href: `/tasks?projectId=${currentEntityId}`, icon: '📋' },
        { label: 'Team Members', href: `/team?projectId=${currentEntityId}`, icon: '👥' }
      )
    }

    return suggestions
  }
}

// Export singleton instance
export const unifiedDataService = new UnifiedDataService()








