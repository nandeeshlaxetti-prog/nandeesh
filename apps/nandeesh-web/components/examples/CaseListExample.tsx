"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { SharedLayout, CaseList } from "../anim/SharedLayout"

interface CaseItem {
  id: string
  title: string
  status: string
  description?: string
  details?: string
}

const mockCases: CaseItem[] = [
  {
    id: "1",
    title: "Contract Dispute - ABC Corp",
    status: "Active",
    description: "Breach of contract case involving software licensing agreement",
    details: "This case involves a complex software licensing dispute between ABC Corp and XYZ Software. The plaintiff alleges that the defendant failed to deliver the agreed-upon software features within the specified timeframe, resulting in significant business losses."
  },
  {
    id: "2", 
    title: "Employment Law - John Smith",
    status: "Pending",
    description: "Wrongful termination lawsuit",
    details: "Mr. Smith was terminated from his position as Senior Developer after reporting safety violations. This case involves claims of retaliation and wrongful termination under state employment laws."
  },
  {
    id: "3",
    title: "Real Estate - Property Development",
    status: "Settled",
    description: "Zoning dispute resolution",
    details: "Successfully resolved a zoning dispute for a commercial property development project. The case involved negotiations with local planning authorities and community stakeholders."
  }
]

export function CaseListExample() {
  const [selectedCaseId, setSelectedCaseId] = React.useState<string | null>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)

  const selectedCase = selectedCaseId ? mockCases.find(c => c.id === selectedCaseId) : null

  const handleCaseClick = (caseId: string) => {
    setSelectedCaseId(caseId)
    setIsDetailOpen(true)
  }

  const handleClose = () => {
    setIsDetailOpen(false)
    // Small delay before clearing selectedCaseId to allow animation to complete
    setTimeout(() => setSelectedCaseId(null), 200)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Case Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Click on any case to view details with smooth shared element transitions
        </p>
      </div>

      {/* Case List */}
      <CaseList 
        cases={mockCases} 
        onCaseClick={handleCaseClick} 
      />

      {/* Detail Modal */}
      <SharedLayout
        isOpen={isDetailOpen}
        onClose={handleClose}
        layoutId={selectedCaseId || ""}
        title={selectedCase?.title || ""}
      >
        {selectedCase && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                selectedCase.status === 'Active' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : selectedCase.status === 'Pending'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
              }`}>
                {selectedCase.status}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Case ID: {selectedCase.id}
              </span>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedCase.description}
              </p>
            </div>

            {selectedCase.details && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Details
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedCase.details}
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Case Actions
              </h3>
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Edit Case
                </button>
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  Add Document
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  View Timeline
                </button>
              </div>
            </div>
          </div>
        )}
      </SharedLayout>
    </div>
  )
}
