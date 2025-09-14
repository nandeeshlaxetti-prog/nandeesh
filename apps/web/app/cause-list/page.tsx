'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { ArrowPathIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { DayTabs } from './_components/DayTabs'
import { CauseListTable } from './_components/CauseListTable'
import { mockCauseListData } from './_data/mockCauseList'
import { getISTDate, getDateRange, formatDateForDisplay } from './_utils/date'
import type { CauseListEntry } from './_data/mockCauseList'

export default function CauseListPage() {
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Initialize with today's date
  useEffect(() => {
    const today = getISTDate()
    setSelectedDate(today)
    setIsLoading(false)
  }, [])

  // Get the 5-day date range
  const dateRange = useMemo(() => getDateRange(), [])

  // Get entries for the selected date
  const selectedDateEntries = useMemo(() => {
    return mockCauseListData.filter(entry => entry.dateISO === selectedDate)
  }, [selectedDate])

  // Filter entries
  const filteredEntries = useMemo(() => {
    return selectedDateEntries
  }, [selectedDateEntries])

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  // Get count for each date
  const getDateCount = (date: string) => {
    return mockCauseListData.filter(entry => entry.dateISO === date).length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cause List</h1>
              <p className="text-sm text-gray-600 mt-1">
                View daily cause lists for the next 5 days
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <ArrowPathIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Date Tabs */}
        <div className="mb-6">
          <DayTabs
            dateRange={dateRange}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            getDateCount={getDateCount}
          />
        </div>

        {/* Search and Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Search Bar */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-end">
              <div className="relative w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by Case No., Parties, or Advocate..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="px-6 py-4">
            <CauseListTable
              entries={filteredEntries}
              isLoading={isLoading}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </div>
    </div>
  )
}