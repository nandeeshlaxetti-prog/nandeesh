'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAnim } from '@/components/anim/MotionProvider'

interface Case {
  id: string
  title: string
  status: string
  courtName: string
  nextHearingDate: string
}

const mockCases: Case[] = [
  {
    id: '1',
    title: 'Civil Dispute Case',
    status: 'Active',
    courtName: 'District Court, Mumbai',
    nextHearingDate: '2024-02-15'
  },
  {
    id: '2',
    title: 'Criminal Case',
    status: 'Pending',
    courtName: 'High Court, Mumbai',
    nextHearingDate: '2024-02-20'
  },
  {
    id: '3',
    title: 'Family Dispute',
    status: 'Completed',
    courtName: 'Family Court, Mumbai',
    nextHearingDate: '2024-02-25'
  }
]

export function CaseListExample() {
  const [cases, setCases] = useState<Case[]>(mockCases)
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)
  const { enabled } = useAnim()

  const handleCaseClick = (case_: Case) => {
    setSelectedCase(case_)
  }

  const handleCloseDrawer = () => {
    setSelectedCase(null)
  }

  const addCase = () => {
    const newCase: Case = {
      id: Date.now().toString(),
      title: `New Case ${cases.length + 1}`,
      status: 'Active',
      courtName: 'District Court, Mumbai',
      nextHearingDate: '2024-03-01'
    }
    setCases(prev => [...prev, newCase])
  }

  const removeCase = (id: string) => {
    setCases(prev => prev.filter(case_ => case_.id !== id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  if (!enabled) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Animation Demo - Case List
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Animations are disabled. Enable animations to see the interactive demo.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 dark:text-white mb-8"
        >
          Animation Demo - Case List
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Cases ({cases.length})
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addCase}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Case
            </motion.button>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {cases.map((case_, index) => (
                <motion.div
                  key={case_.id}
                  layout
                  layoutId={`case-${case_.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ 
                    duration: 0.3,
                    delay: index * 0.1,
                    layout: { duration: 0.3 }
                  }}
                  onClick={() => handleCaseClick(case_)}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        {case_.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {case_.courtName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Next Hearing: {case_.nextHearingDate}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(case_.status)}`}>
                        {case_.status}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          removeCase(case_.id)
                        }}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        ×
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Drawer */}
        <AnimatePresence>
          {selectedCase && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDrawer}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center p-4"
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-t-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <motion.h3 
                      layoutId={`case-${selectedCase.id}`}
                      className="text-xl font-semibold text-gray-900 dark:text-white"
                    >
                      {selectedCase.title}
                    </motion.h3>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleCloseDrawer}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      ×
                    </motion.button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Court Name
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {selectedCase.courtName}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Status
                      </label>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCase.status)}`}>
                        {selectedCase.status}
                      </span>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Next Hearing Date
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {selectedCase.nextHearingDate}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
