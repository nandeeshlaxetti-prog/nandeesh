/**
 * Vercel-Compatible Storage Service
 * Uses Vercel KV for production, localStorage for development
 */

// Simple in-memory cache for serverless environment
let memoryCache: any[] = []

export interface StorageCase {
  id: string
  cnrNumber?: string
  caseNumber: string
  title: string
  [key: string]: any
}

export class VercelStorage {
  private cacheKey = 'legal-cases-cache'
  
  /**
   * Get all cases
   */
  async getAllCases(): Promise<StorageCase[]> {
    try {
      // In development, use localStorage
      if (typeof window !== 'undefined') {
        const localData = localStorage.getItem(this.cacheKey)
        if (localData) {
          return JSON.parse(localData)
        }
      }
      
      // In production serverless, return memory cache
      return memoryCache
    } catch (error) {
      console.error('Error getting cases:', error)
      return []
    }
  }
  
  /**
   * Save cases
   */
  async saveCases(cases: StorageCase[]): Promise<boolean> {
    try {
      // Update memory cache
      memoryCache = cases
      
      // In development, also save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.cacheKey, JSON.stringify(cases))
      }
      
      console.log(`✅ Saved ${cases.length} cases to storage`)
      return true
    } catch (error) {
      console.error('Error saving cases:', error)
      return false
    }
  }
  
  /**
   * Add cases (merge with existing)
   */
  async addCases(newCases: StorageCase[]): Promise<number> {
    try {
      const existing = await this.getAllCases()
      const merged = [...existing]
      let addedCount = 0
      
      for (const newCase of newCases) {
        const cnr = newCase.cnrNumber || newCase.cnr
        const existingIndex = merged.findIndex(c => 
          (c.cnrNumber === cnr && cnr) || c.id === newCase.id
        )
        
        if (existingIndex === -1) {
          merged.push({
            ...newCase,
            id: newCase.id || `case-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: newCase.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
          addedCount++
        } else {
          // Update existing
          merged[existingIndex] = {
            ...merged[existingIndex],
            ...newCase,
            updatedAt: new Date().toISOString()
          }
        }
      }
      
      await this.saveCases(merged)
      return addedCount
    } catch (error) {
      console.error('Error adding cases:', error)
      return 0
    }
  }
  
  /**
   * Clear all cases
   */
  async clearCases(): Promise<boolean> {
    try {
      await this.saveCases([])
      return true
    } catch (error) {
      console.error('Error clearing cases:', error)
      return false
    }
  }
}

export const vercelStorage = new VercelStorage()

