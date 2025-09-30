'use client'

import React from 'react'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import type { CauseListEntry } from '../_data/mockCauseList'

interface CauseListTableProps {
  entries: CauseListEntry[]
  isLoading: boolean
  searchQuery: string
}

export function CauseListTable({ 
  entries, 
  isLoading, 
  searchQuery
}: CauseListTableProps) {
  // Filter entries based on search query
  const filteredEntries = entries.filter(entry => {
    if (!searchQuery.trim()) return true
    
    const query = searchQuery.toLowerCase()
    return (
      entry.caseNumber.toLowerCase().includes(query) ||
      entry.parties?.toLowerCase().includes(query) ||
      entry.advocate?.toLowerCase().includes(query)
    )
  })

  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-48"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </td>
    </tr>
  )

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Case No.
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parties
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Court/Bench
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Purpose
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Advocate
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonRow key={index} />
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (filteredEntries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-sm">
          No items for this day.
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Time
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Case No.
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Parties
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Court/Bench
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Item
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Purpose
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Advocate
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredEntries.map((entry, index) => (
            <tr 
              key={entry.id} 
              className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
            >
              <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                {entry.timeSlot || '-'}
              </td>
              <td 
                className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap"
                title={entry.caseNumber}
              >
                {entry.caseNumber}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                <div className="max-w-xs">
                  {entry.parties || '-'}
                </div>
              </td>
              <td 
                className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap"
                title={entry.bench || 'Not specified'}
              >
                {entry.bench || '-'}
              </td>
              <td 
                className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap"
                title={entry.itemNo || 'Not specified'}
              >
                {entry.itemNo || '-'}
              </td>
              <td 
                className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap"
                title={entry.purpose || 'Not specified'}
              >
                {entry.purpose || '-'}
              </td>
              <td 
                className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap"
                title={entry.advocate || 'Not specified'}
              >
                {entry.advocate || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
