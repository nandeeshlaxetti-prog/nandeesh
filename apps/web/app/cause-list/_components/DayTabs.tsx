'use client'

import React from 'react'
import { formatDateForDisplay } from '../_utils/date'

interface DayTabsProps {
  dateRange: string[]
  selectedDate: string
  onDateSelect: (date: string) => void
  getDateCount: (date: string) => number
}

export function DayTabs({ dateRange, selectedDate, onDateSelect, getDateCount }: DayTabsProps) {
  const getTabLabel = (date: string, index: number) => {
    const today = new Date().toISOString().split('T')[0]
    const diff = new Date(date).getTime() - new Date(today).getTime()
    const daysDiff = Math.round(diff / (1000 * 60 * 60 * 24))
    
    if (daysDiff === 0) return 'Today'
    if (daysDiff === -1) return 'D-1'
    if (daysDiff === -2) return 'D-2'
    if (daysDiff === 1) return 'D+1'
    if (daysDiff === 2) return 'D+2'
    
    return `D${daysDiff > 0 ? '+' : ''}${daysDiff}`
  }

  return (
    <div className="inline-flex gap-2">
      {dateRange.map((date, index) => {
        const isSelected = date === selectedDate
        const count = getDateCount(date)
        const label = getTabLabel(date, index)
        
        return (
          <button
            key={date}
            onClick={() => onDateSelect(date)}
            className={`
              inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium transition-colors
              ${isSelected 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-700'
              }
            `}
            aria-selected={isSelected}
          >
            <span>{label}</span>
            <span className="text-xs text-gray-500">
              {formatDateForDisplay(date)}
            </span>
            <span className={`
              rounded bg-neutral-100 text-neutral-700 text-xs px-2 py-0.5
              ${isSelected ? 'bg-blue-200 text-blue-800' : ''}
            `}>
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}

