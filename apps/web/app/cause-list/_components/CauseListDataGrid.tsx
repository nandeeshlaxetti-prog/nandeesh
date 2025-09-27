'use client'

import React, { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataGrid } from '@/components/datagrid/DataGrid'
import type { CauseListEntry } from '../_data/mockCauseList'

interface CauseListDataGridProps {
  entries: CauseListEntry[]
  isLoading: boolean
}

export function CauseListDataGrid({ 
  entries, 
  isLoading 
}: CauseListDataGridProps) {
  // Define columns exactly as specified: Sl. No. | Case No. | Case Title | Court Hall No. | Case Stage
  const columns: ColumnDef<CauseListEntry>[] = useMemo(() => [
    {
      accessorKey: 'slNo',
      header: 'Sl. No.',
      cell: ({ row }) => (
        <span className="font-medium text-muted-foreground">
          {row.index + 1}
        </span>
      ),
      size: 80,
    },
    {
      accessorKey: 'caseNumber',
      header: 'Case No.',
      cell: ({ getValue }) => (
        <span className="font-mono text-sm">
          {getValue() as string}
        </span>
      ),
      size: 150,
    },
    {
      accessorKey: 'parties',
      header: 'Case Title',
      cell: ({ getValue }) => {
        const parties = getValue() as string
        return (
          <div className="max-w-xs">
            <span 
              className="text-sm text-foreground"
              title={parties}
            >
              {parties || '-'}
            </span>
          </div>
        )
      },
      size: 300,
    },
    {
      accessorKey: 'bench',
      header: 'Court Hall No.',
      cell: ({ getValue }) => {
        const bench = getValue() as string
        return (
          <span 
            className="text-sm text-foreground"
            title={bench}
          >
            {bench || '-'}
          </span>
        )
      },
      size: 150,
    },
    {
      accessorKey: 'purpose',
      header: 'Case Stage',
      cell: ({ getValue }) => {
        const purpose = getValue() as string
        return (
          <span 
            className="text-sm text-foreground"
            title={purpose}
          >
            {purpose || '-'}
          </span>
        )
      },
      size: 150,
    },
  ], [])

  return (
    <DataGrid
      columns={columns}
      data={entries}
      isLoading={isLoading}
      emptyText="No cases scheduled for this day"
      emptyDescription="There are no cases listed for the selected date."
      initialSort={{ id: 'slNo', desc: false }}
      height={500}
    />
  )
}
