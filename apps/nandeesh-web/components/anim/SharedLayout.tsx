"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { XMarkIcon } from "@heroicons/react/24/outline"

interface SharedLayoutProps {
  isOpen: boolean
  onClose: () => void
  layoutId: string
  title: string
  children: React.ReactNode
}

export function SharedLayout({ isOpen, onClose, layoutId, title, children }: SharedLayoutProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Modal/Drawer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 z-50 bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden"
          >
            {/* Header with shared layoutId */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <motion.h2 
                layoutId={`title-${layoutId}`}
                className="text-2xl font-bold text-gray-900 dark:text-white"
              >
                {title}
              </motion.h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Example usage component for cases
interface CaseItem {
  id: string
  title: string
  status: string
  description?: string
}

interface CaseListProps {
  cases: CaseItem[]
  onCaseClick: (caseId: string) => void
}

export function CaseList({ cases, onCaseClick }: CaseListProps) {
  return (
    <div className="grid gap-4">
      {cases.map((caseItem) => (
        <motion.div
          key={caseItem.id}
          layoutId={`case-${caseItem.id}`}
          onClick={() => onCaseClick(caseItem.id)}
          className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <motion.h3 
                layoutId={`title-${caseItem.id}`}
                className="text-lg font-semibold text-gray-900 dark:text-white"
              >
                {caseItem.title}
              </motion.h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {caseItem.description || 'No description available'}
              </p>
            </div>
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
              {caseItem.status}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
