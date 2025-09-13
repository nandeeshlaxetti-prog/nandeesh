'use client'

interface CaseListItem {
  id: string
  caseNumber: string
  title: string
  court: string
  stage: string
  nextHearingDate: Date | null
  lastOrderDate: Date | null
  status: string
  priority: string
}

interface CasesTableProps {
  cases: CaseListItem[]
  loading?: boolean
}

export function CasesTable({ cases, loading = false }: CasesTableProps) {
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Cases</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          List of all legal cases
        </p>
      </div>
      <ul className="divide-y divide-gray-200">
        {cases.map((caseItem) => (
          <li key={caseItem.id}>
            <div className="px-4 py-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-blue-600 truncate">
                    {caseItem.caseNumber}
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      caseItem.priority === 'HIGH' || caseItem.priority === 'URGENT'
                        ? 'bg-red-100 text-red-800'
                        : caseItem.priority === 'MEDIUM'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {caseItem.priority}
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <p className="truncate">{caseItem.title}</p>
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <p>{caseItem.court}</p>
                    <span className="mx-2">•</span>
                    <p>{caseItem.stage}</p>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                {caseItem.nextHearingDate && (
                  <p className="text-sm text-gray-500">
                    Next Hearing: {caseItem.nextHearingDate.toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}