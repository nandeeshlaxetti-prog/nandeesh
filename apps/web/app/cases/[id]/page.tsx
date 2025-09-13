'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Case {
  id: string
  caseNumber: string
  title: string
  clientName: string
  court: string
  status: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  nextHearing?: string
  stage: string
  description?: string
  assignedLawyer?: string
  createdAt?: string
  updatedAt?: string
}

// Sample case data (in a real app, this would come from an API)
const sampleCases: Case[] = [
  {
    id: '1',
    caseNumber: 'CASE-2024-001',
    title: 'Contract Dispute Resolution',
    clientName: 'ABC Corp',
    court: 'High Court of Delhi',
    status: 'ACTIVE',
    priority: 'HIGH',
    nextHearing: '4/15/2024',
    stage: 'Arguments',
    description: 'Resolution of contract dispute between ABC Corporation and XYZ Ltd regarding payment terms and delivery schedules.',
    assignedLawyer: 'John Doe',
    createdAt: '2024-01-15',
    updatedAt: '2024-04-01'
  },
  {
    id: '2',
    caseNumber: 'CASE-2024-002',
    title: 'Property Settlement',
    clientName: 'XYZ Ltd',
    court: 'Bombay High Court',
    status: 'ACTIVE',
    priority: 'MEDIUM',
    nextHearing: '4/20/2024',
    stage: 'Evidence',
    description: 'Property settlement dispute involving commercial real estate transaction and title issues.',
    assignedLawyer: 'Jane Smith',
    createdAt: '2024-02-01',
    updatedAt: '2024-03-28'
  },
  {
    id: '3',
    caseNumber: 'CASE-2024-003',
    title: 'Employment Law Matter',
    clientName: 'DEF Inc',
    court: 'Labor Court',
    status: 'ACTIVE',
    priority: 'URGENT',
    stage: 'Preliminary',
    description: 'Employment termination dispute involving wrongful dismissal and compensation claims.',
    assignedLawyer: 'Mike Johnson',
    createdAt: '2024-03-10',
    updatedAt: '2024-04-05'
  }
]

export default function CaseDetailPage({ params }: { params: { id: string } }) {
  const caseId = params.id
  const router = useRouter()
  const [caseData, setCaseData] = useState<Case | null>(null)
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingData, setEditingData] = useState({
    caseNumber: '',
    title: '',
    clientName: '',
    court: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
    stage: '',
    description: '',
    assignedLawyer: ''
  })

  useEffect(() => {
    // Load case from localStorage
    const fetchCase = async () => {
      setLoading(true)
      const savedCases = localStorage.getItem('legal-cases')
      if (savedCases) {
        const cases = JSON.parse(savedCases)
        const foundCase = cases.find((c: Case) => c.id === caseId)
        setCaseData(foundCase || null)
      } else {
        // Fallback to sample cases if localStorage is empty
        const foundCase = sampleCases.find(c => c.id === caseId)
        setCaseData(foundCase || null)
      }
      setLoading(false)
    }
    
    fetchCase()
  }, [caseId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Case Not Found</h1>
          <p className="text-gray-600 mb-4">The case you're looking for doesn't exist.</p>
          <button 
            onClick={() => router.push('/cases')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Cases
          </button>
        </div>
      </div>
    )
  }

  const handleEditCase = () => {
    if (!caseData) return
    
    setEditingData({
      caseNumber: caseData.caseNumber,
      title: caseData.title,
      clientName: caseData.clientName,
      court: caseData.court || '',
      priority: caseData.priority,
      stage: caseData.stage || '',
      description: caseData.description || '',
      assignedLawyer: caseData.assignedLawyer || ''
    })
    setShowEditModal(true)
  }

  const handleUpdateCase = () => {
    if (!caseData || !editingData.caseNumber || !editingData.title || !editingData.clientName) {
      alert('Please fill in all required fields')
      return
    }

    const updatedCase: Case = {
      ...caseData,
      caseNumber: editingData.caseNumber,
      title: editingData.title,
      clientName: editingData.clientName,
      court: editingData.court,
      priority: editingData.priority,
      stage: editingData.stage,
      description: editingData.description,
      assignedLawyer: editingData.assignedLawyer,
      updatedAt: new Date().toISOString()
    }

    // Update localStorage
    const savedCases = localStorage.getItem('legal-cases')
    if (savedCases) {
      const cases = JSON.parse(savedCases)
      const updatedCases = cases.map((c: Case) => c.id === caseData.id ? updatedCase : c)
      localStorage.setItem('legal-cases', JSON.stringify(updatedCases))
    }

    setCaseData(updatedCase)
    setShowEditModal(false)
  }

  const handleDeleteCase = () => {
    if (confirm('Are you sure you want to delete this case? This action cannot be undone.')) {
      // Update localStorage
      const savedCases = localStorage.getItem('legal-cases')
      if (savedCases) {
        const cases = JSON.parse(savedCases)
        const updatedCases = cases.filter((c: Case) => c.id !== caseData?.id)
        localStorage.setItem('legal-cases', JSON.stringify(updatedCases))
      }
      
      router.push('/cases')
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800'
      case 'HIGH': return 'bg-red-100 text-red-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'LOW': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/cases')}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{caseData.caseNumber}</h1>
                <p className="text-gray-600">{caseData.title}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getPriorityColor(caseData.priority)}`}>
                {caseData.priority}
              </span>
              <button 
                onClick={handleEditCase}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Edit Case
              </button>
              <button 
                onClick={handleDeleteCase}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Delete Case
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Case Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Detailed information about this case
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Case Number</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {caseData.caseNumber}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Title</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {caseData.title}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Client</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {caseData.clientName}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {caseData.description || 'No description available'}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Court</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {caseData.court || 'Not specified'}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {caseData.status}
                    </span>
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Current Stage</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {caseData.stage || 'Not specified'}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Next Hearing</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {caseData.nextHearing || 'No upcoming hearings'}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Assigned Lawyer</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {caseData.assignedLawyer || 'Not assigned'}
                  </dd>
                </div>
                {caseData.createdAt && (
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Created</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {new Date(caseData.createdAt).toLocaleDateString()}
                    </dd>
                  </div>
                )}
                {caseData.updatedAt && (
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {new Date(caseData.updatedAt).toLocaleDateString()}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Case Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Edit Case</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Case Number *
                  </label>
                  <input
                    type="text"
                    value={editingData.caseNumber}
                    onChange={(e) => setEditingData({...editingData, caseNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., CASE-2024-004"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Case Title *
                  </label>
                  <input
                    type="text"
                    value={editingData.title}
                    onChange={(e) => setEditingData({...editingData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Contract Dispute Resolution"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    value={editingData.clientName}
                    onChange={(e) => setEditingData({...editingData, clientName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., ABC Corporation"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Court
                  </label>
                  <input
                    type="text"
                    value={editingData.court}
                    onChange={(e) => setEditingData({...editingData, court: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., High Court of Delhi"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={editingData.priority}
                    onChange={(e) => setEditingData({...editingData, priority: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Stage
                  </label>
                  <input
                    type="text"
                    value={editingData.stage}
                    onChange={(e) => setEditingData({...editingData, stage: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Preliminary, Arguments, Evidence"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editingData.description}
                    onChange={(e) => setEditingData({...editingData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Case description..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned Lawyer
                  </label>
                  <input
                    type="text"
                    value={editingData.assignedLawyer}
                    onChange={(e) => setEditingData({...editingData, assignedLawyer: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., John Doe"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateCase}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Update Case
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}