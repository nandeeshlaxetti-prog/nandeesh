"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"
import { ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/cn"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Empty } from "@/components/ui/empty"

export interface DataGridProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  onRowClick?: (row: TData) => void
  emptyText?: string
  emptyDescription?: string
  initialSort?: { id: string; desc?: boolean }
  className?: string
  height?: number
}

function SkeletonRows({ columns }: { columns: number }) {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: columns }).map((_, j) => (
            <TableCell key={j}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

export function DataGrid<TData, TValue>({
  columns,
  data,
  isLoading = false,
  onRowClick,
  emptyText = "No data available",
  emptyDescription,
  initialSort,
  className,
  height = 400,
}: DataGridProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>(
    initialSort ? [{ id: initialSort.id, desc: initialSort.desc ?? false }] : []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  const { rows } = table.getRowModel()

  const parentRef = React.useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40, // Estimated row height
    overscan: 5,
  })

  if (isLoading) {
    return (
      <div className={cn("rounded-md border", className)}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-10">
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <SkeletonRows columns={columns.length} />
          </TableBody>
        </Table>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className={cn("rounded-md border", className)}>
        <Empty
          title={emptyText}
          description={emptyDescription}
          className="min-h-[200px]"
        />
      </div>
    )
  }

  return (
    <div className={cn("rounded-md border", className)}>
      <div
        ref={parentRef}
        className="overflow-auto"
        style={{ height: `${height}px` }}
      >
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "h-10 select-none",
                      header.column.getCanSort() && "cursor-pointer hover:bg-muted/50"
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center space-x-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <div className="flex flex-col">
                          {header.column.getIsSorted() === "asc" ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <div className="h-3 w-3" />
                          )}
                        </div>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index]
              return (
                <TableRow
                  key={row.id}
                  className={cn(
                    "hover:bg-muted/50",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(row.original)}
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
