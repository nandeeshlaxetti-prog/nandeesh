/**
 * Entity Navigation Component
 * Shows relationships and quick navigation between related entities
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { unifiedDataService, UnifiedEntity } from '@/lib/unified-data-service'
import { ArrowRightIcon, UserIcon, BriefcaseIcon, FolderIcon, ClipboardDocumentListIcon, PhoneIcon } from '@heroicons/react/24/outline'

interface EntityNavigationProps {
  entityType: string
  entityId: string
  entityName?: string
}

export default function EntityNavigation({ entityType, entityId, entityName }: EntityNavigationProps) {
  const [relatedEntities, setRelatedEntities] = useState<UnifiedEntity[]>([])
  const [navigationSuggestions, setNavigationSuggestions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadRelatedData()
  }, [entityType, entityId])

  const loadRelatedData = async () => {
    try {
      setIsLoading(true)
      
      // Get related entities
      const related = await unifiedDataService.getRelatedEntities(entityType, entityId)
      setRelatedEntities(related)
      
      // Get navigation suggestions
      const suggestions = unifiedDataService.getNavigationSuggestions(entityType, entityId)
      setNavigationSuggestions(suggestions)
      
    } catch (error) {
      console.error('Failed to load related data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'CASE': return <FolderIcon className="h-4 w-4" />
      case 'CLIENT': return <UserIcon className="h-4 w-4" />
      case 'PROJECT': return <BriefcaseIcon className="h-4 w-4" />
      case 'TASK': return <ClipboardDocumentListIcon className="h-4 w-4" />
      case 'CONTACT': return <PhoneIcon className="h-4 w-4" />
      default: return <FolderIcon className="h-4 w-4" />
    }
  }

  const getEntityColor = (type: string) => {
    switch (type) {
      case 'CASE': return 'bg-blue-100 text-blue-800'
      case 'CLIENT': return 'bg-green-100 text-green-800'
      case 'PROJECT': return 'bg-purple-100 text-purple-800'
      case 'TASK': return 'bg-orange-100 text-orange-800'
      case 'CONTACT': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-3"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 rounded w-full"></div>
            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Current Entity Info */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className={`p-2 rounded-lg ${getEntityColor(entityType)}`}>
            {getEntityIcon(entityType)}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{entityName || `${entityType} Details`}</h3>
            <p className="text-sm text-gray-600">{entityType.toLowerCase()} • ID: {entityId}</p>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      {navigationSuggestions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h4 className="font-medium text-gray-900 mb-3">Quick Navigation</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {navigationSuggestions.map((suggestion, index) => (
              <Link
                key={index}
                href={suggestion.href}
                className="flex items-center justify-between p-2 text-sm rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{suggestion.icon}</span>
                  <span className="text-gray-700">{suggestion.label}</span>
                </div>
                {suggestion.count && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {suggestion.count}
                  </span>
                )}
                <ArrowRightIcon className="h-3 w-3 text-gray-400" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Related Entities */}
      {relatedEntities.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h4 className="font-medium text-gray-900 mb-3">Related Items</h4>
          <div className="space-y-2">
            {relatedEntities.slice(0, 5).map((entity, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className={`p-1.5 rounded ${getEntityColor(entity.type)}`}>
                    {getEntityIcon(entity.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {entity.data.title || entity.data.name || 'Untitled'}
                    </p>
                    <p className="text-xs text-gray-600">{entity.type}</p>
                  </div>
                </div>
                <Link
                  href={`/${entity.type.toLowerCase()}s/${entity.data.id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View
                </Link>
              </div>
            ))}
            
            {relatedEntities.length > 5 && (
              <div className="text-center pt-2">
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  View all {relatedEntities.length} related items
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* No Related Items */}
      {!isLoading && relatedEntities.length === 0 && navigationSuggestions.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
          <p className="text-gray-500 text-sm">No related items found</p>
        </div>
      )}
    </div>
  )
}







