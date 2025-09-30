/**
 * Unified Search Component
 * Search across all entities: Cases, Clients, Partners, Projects, Tasks, Contacts
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { unifiedDataService, UnifiedEntity } from '@/lib/unified-data-service'
import { MagnifyingGlassIcon, XMarkIcon, UserIcon, BriefcaseIcon, FolderIcon, ClipboardDocumentListIcon, PhoneIcon, UserGroupIcon } from '@heroicons/react/24/outline'

export default function UnifiedSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<UnifiedEntity[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (query.trim().length > 2) {
      performSearch(query.trim())
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [query])

  const performSearch = async (searchQuery: string) => {
    try {
      setIsSearching(true)
      const searchResults = await unifiedDataService.searchAllEntities(searchQuery)
      setResults(searchResults)
      setIsOpen(true)
      setSelectedIndex(-1)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleResultClick(results[selectedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleResultClick = (result: UnifiedEntity) => {
    const entityType = result.type.toLowerCase()
    const entityId = result.data.id
    
    // Navigate to the appropriate page
    switch (result.type) {
      case 'CASE':
        router.push(`/cases`)
        break
      case 'CLIENT':
        router.push(`/contacts`)
        break
      case 'PARTNER':
        router.push(`/team`)
        break
      case 'PROJECT':
        router.push(`/projects`)
        break
      case 'TASK':
        router.push(`/tasks`)
        break
      case 'CONTACT':
        router.push(`/contacts`)
        break
      default:
        router.push('/dashboard')
    }
    
    setIsOpen(false)
    setQuery('')
  }

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'CASE': return <FolderIcon className="h-4 w-4" />
      case 'CLIENT': return <UserIcon className="h-4 w-4" />
      case 'PARTNER': return <UserGroupIcon className="h-4 w-4" />
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
      case 'PARTNER': return 'bg-purple-100 text-purple-800'
      case 'PROJECT': return 'bg-orange-100 text-orange-800'
      case 'TASK': return 'bg-yellow-100 text-yellow-800'
      case 'CONTACT': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEntityDisplayName = (entity: UnifiedEntity) => {
    const data = entity.data as any
    return data.title || data.name || data.subject || 'Untitled'
  }

  const getEntityDescription = (entity: UnifiedEntity) => {
    const data = entity.data as any
    switch (entity.type) {
      case 'CASE':
        return data.caseNumber || data.cnrNumber || 'Case'
      case 'CLIENT':
        return data.email || data.company || 'Client'
      case 'PARTNER':
        return data.firm || data.specialization?.[0] || 'Partner'
      case 'PROJECT':
        return data.description || data.type || 'Project'
      case 'TASK':
        return data.description || data.type || 'Task'
      case 'CONTACT':
        return data.email || data.phone || 'Contact'
      default:
        return entity.type
    }
  }

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search cases, clients, projects..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length > 2 && setIsOpen(true)}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {query && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              onClick={() => {
                setQuery('')
                setIsOpen(false)
                inputRef.current?.focus()
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="px-4 py-3 text-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-1">
              {results.map((result, index) => (
                <button
                  key={`${result.type}-${result.data.id}`}
                  onClick={() => handleResultClick(result)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors ${
                    index === selectedIndex ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-1.5 rounded ${getEntityColor(result.type)}`}>
                      {getEntityIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {getEntityDisplayName(result)}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getEntityColor(result.type)}`}>
                          {result.type}
                        </span>
                        <p className="text-xs text-gray-600 truncate">
                          {getEntityDescription(result)}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : query.trim().length > 2 ? (
            <div className="px-4 py-3 text-center">
              <p className="text-sm text-gray-600">No results found for "{query}"</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}







