'use client'

import React from 'react'
import { formatIST } from '@/lib/date-ist'

interface DateLabel {
  offset: number
  label: string
  date: Date
}

interface DayTabsProps {
  dateLabels: DateLabel[]
  selectedOffset: number
  onOffsetSelect: (offset: number) => void
  getDateCount: (offset: number) => number
}

export function DayTabs({ dateLabels, selectedOffset, onOffsetSelect, getDateCount }: DayTabsProps) {
  return (
    <div className="inline-flex gap-2">
      {dateLabels.map(({ offset, label, date }) => {
        const isSelected = offset === selectedOffset
        const count = getDateCount(offset)
        
        return (
          <button
            key={offset}
            onClick={() => onOffsetSelect(offset)}
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
              {formatIST(date, 'DD/MM')}
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











