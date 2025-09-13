'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ECourtsProvider, ECourtsCaseData, ECourtsConfig } from '@/lib/ecourts-provider'

interface Case {
  id: string
  cnrNumber: string
  caseNumber: string // Primary case number (Registration Number)
  filingNumber?: string // Filing Number (alternative)
  title: string
  petitionerName: string
  respondentName: string
  court: string
  courtLocation: string
  hallNumber?: string
  caseType: string
  caseStatus: string
  filingDate: string
  lastHearingDate?: string
  nextHearingDate?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  stage: string
  subjectMatter: string
  reliefSought: string
  caseValue?: number
  jurisdiction: string
  advocates: Array<{
    name: string
    type?: string
    barNumber?: string
    phone?: string
    email?: string
  }>
  judges: Array<{
    name: string
    designation: string
    court: string
  }>
  // Enhanced eCourts data
  parties: Array<{
    name: string
    type: 'PLAINTIFF' | 'PETITIONER' | 'DEFENDANT' | 'RESPONDENT'
  }>
  hearingHistory: Array<{
    date: string
    purpose: string
    judge: string
    status?: string
  }>
  orders: Array<{
    number: number
    name: string
    date: string
    url?: string
  }>
  actsAndSections?: {
    acts: string
    sections: string
  }
  registrationNumber?: string
  registrationDate?: string
  firstHearingDate?: string
  decisionDate?: string
  natureOfDisposal?: string
}

export default function CasesPage() {
  const router = useRouter()
  
  // Default cases
  const defaultCases: Case[] = [
    {
      id: '1',
      cnrNumber: 'DLCT01-001234-2023',
      caseNumber: 'CASE-2024-001',
      title: 'Contract Dispute Resolution',
      petitionerName: 'ABC Corporation',
      respondentName: 'XYZ Limited',
      court: 'High Court of Delhi',
      courtLocation: 'New Delhi',
      hallNumber: 'Hall No. 1',
      caseType: 'CIVIL',
      caseStatus: 'ACTIVE',
      filingDate: '2023-06-15',
      nextHearingDate: '2024-04-15',
      priority: 'HIGH',
      stage: 'Arguments',
      subjectMatter: 'Contract Dispute',
      reliefSought: 'Specific Performance',
      caseValue: 1000000,
      jurisdiction: 'Delhi',
      advocates: [
        {
          name: 'Adv. John Doe',
          type: 'PETITIONER',
          barNumber: 'DL123456',
          phone: '+91-9876543210',
          email: 'john@law.com'
        }
      ],
      judges: [
        {
          name: 'Hon. Justice Smith',
          designation: 'Judge',
          court: 'High Court of Delhi'
        }
      ],
      parties: [
        {
          name: 'ABC Corporation',
          type: 'PLAINTIFF'
        },
        {
          name: 'XYZ Limited',
          type: 'DEFENDANT'
        }
      ],
      hearingHistory: [],
      orders: []
    },
    {
      id: '2',
      cnrNumber: 'MHCT02-002345-2023',
      caseNumber: 'CASE-2024-002',
      title: 'Property Settlement',
      petitionerName: 'DEF Properties',
      respondentName: 'GHI Holdings',
      court: 'Bombay High Court',
      courtLocation: 'Mumbai',
      hallNumber: 'Hall No. 2',
      caseType: 'CIVIL',
      caseStatus: 'ACTIVE',
      filingDate: '2023-08-20',
      nextHearingDate: '2024-04-20',
      priority: 'MEDIUM',
      stage: 'Evidence',
      subjectMatter: 'Property Dispute',
      reliefSought: 'Property Division',
      caseValue: 5000000,
      jurisdiction: 'Mumbai',
      advocates: [
        {
          name: 'Adv. Jane Smith',
          type: 'RESPONDENT',
          barNumber: 'MH789012',
          phone: '+91-9876543211',
          email: 'jane@law.com'
        }
      ],
      judges: [
        {
          name: 'Hon. Justice Brown',
          designation: 'Judge',
          court: 'Bombay High Court'
        }
      ],
      parties: [
        {
          name: 'DEF Properties',
          type: 'PLAINTIFF'
        },
        {
          name: 'GHI Holdings',
          type: 'DEFENDANT'
        }
      ],
      hearingHistory: [],
      orders: []
    }
  ]

  // Load cases from localStorage on component mount
  const [cases, setCases] = useState<Case[]>([])
  
  useEffect(() => {
    const savedCases = localStorage.getItem('legal-cases')
    if (savedCases) {
      setCases(JSON.parse(savedCases))
    } else {
      setCases(defaultCases)
      localStorage.setItem('legal-cases', JSON.stringify(defaultCases))
    }
  }, [])

  // Save cases to localStorage whenever cases change
  useEffect(() => {
    if (cases.length > 0) {
      localStorage.setItem('legal-cases', JSON.stringify(cases))
    }
  }, [cases])

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCNRModal, setShowCNRModal] = useState(false)
  const [editingCase, setEditingCase] = useState<Case | null>(null)
  const [cnrNumber, setCnrNumber] = useState('')
  const [isLoadingCNR, setIsLoadingCNR] = useState(false)
  
  // Advanced search modal state
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const [searchFilters, setSearchFilters] = useState({
    caseNumber: '',
    partyName: '',
    advocateName: '',
    court: '',
    courtType: 'district' as 'district' | 'high' | 'supreme' | 'nclt' | 'cat' | 'consumer',
    filingDateFrom: '',
    filingDateTo: '',
    hearingDateFrom: '',
    hearingDateTo: '',
    caseType: '',
    caseStatus: ''
  })
  const [isLoadingSearch, setIsLoadingSearch] = useState(false)
  const [showCaseDetails, setShowCaseDetails] = useState(false)
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)
  const [newCase, setNewCase] = useState({
    caseNumber: '',
    filingNumber: '',
    title: '',
    petitionerName: '',
    respondentName: '',
    court: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
    stage: ''
  })

  const handleAddCase = () => {
    if (!newCase.caseNumber || !newCase.title || !newCase.petitionerName) {
      alert('Please fill in all required fields')
      return
    }

    const caseToAdd: Case = {
      id: Date.now().toString(),
      cnrNumber: `CNR-${Date.now()}`,
      caseNumber: newCase.caseNumber, // Registration Number (primary)
      filingNumber: newCase.filingNumber || undefined, // Filing Number (optional)
      title: newCase.title,
      petitionerName: newCase.petitionerName,
      respondentName: newCase.respondentName || 'Unknown Respondent',
      court: newCase.court,
      courtLocation: 'Not specified',
      caseType: 'CIVIL',
      caseStatus: 'ACTIVE',
      filingDate: new Date().toISOString().split('T')[0],
      priority: newCase.priority,
      stage: newCase.stage,
      subjectMatter: newCase.title,
      reliefSought: 'Not specified',
      jurisdiction: newCase.court,
      advocates: [],
      judges: [],
      parties: [
        {
          name: newCase.petitionerName,
          type: 'PLAINTIFF'
        },
        {
          name: newCase.respondentName || 'Unknown Respondent',
          type: 'DEFENDANT'
        }
      ],
      hearingHistory: [],
      orders: []
    }

    setCases([...cases, caseToAdd])
    setNewCase({
      caseNumber: '',
      filingNumber: '',
      title: '',
      petitionerName: '',
      respondentName: '',
      court: '',
      priority: 'MEDIUM',
      stage: ''
    })
    setShowAddModal(false)
  }

  // eCourts CNR Import function
  const handleAdvancedSearch = async () => {
    setIsLoadingSearch(true)
    try {
      console.log('🔍 Starting advanced search with filters:', searchFilters)
      
      const config = {
        provider: 'third_party' as const,
        apiKey: 'klc_2cef7fc42178c58211cd8b8b1d23c3206c1e778f13ed566237803d8897a9b104',
        timeout: 30000
      }
      
      const ecourtsProvider = new ECourtsProvider(config)
      const result = await ecourtsProvider.searchCases(searchFilters)
      
      console.log('📊 Advanced search result:', result)
      
      if (result.success && result.data && result.data.length > 0) {
        // Convert search results to Case format and add to cases list
        const newCases: Case[] = result.data.map((caseData, index) => ({
          id: `search-${Date.now()}-${index}`,
          cnrNumber: caseData.cnr,
          caseNumber: caseData.caseNumber || caseData.registrationNumber || `REG-${Date.now()}-${index}`, // Primary: Registration Number
          filingNumber: caseData.filingNumber || undefined, // Optional: Filing Number
          title: caseData.title,
          petitionerName: caseData.parties.find(p => p.type === 'PLAINTIFF' || p.type === 'PETITIONER')?.name || 'Unknown Petitioner',
          respondentName: caseData.parties.find(p => p.type === 'DEFENDANT' || p.type === 'RESPONDENT')?.name || 'Unknown Respondent',
          court: caseData.court,
          courtLocation: caseData.courtLocation,
          hallNumber: caseData.hallNumber || 'Not specified',
          caseType: caseData.caseType,
          caseStatus: caseData.caseStatus,
          filingDate: caseData.filingDate,
          lastHearingDate: caseData.lastHearingDate,
          nextHearingDate: caseData.nextHearingDate,
          priority: 'MEDIUM',
          stage: 'Active',
          subjectMatter: caseData.caseDetails.subjectMatter,
          reliefSought: caseData.caseDetails.reliefSought,
          caseValue: caseData.caseDetails.caseValue,
          jurisdiction: caseData.caseDetails.jurisdiction,
          advocates: caseData.advocates || [],
          judges: caseData.judges || [],
          parties: caseData.parties || [],
          hearingHistory: caseData.hearingHistory || [],
          orders: caseData.orders || []
        }))

        setCases([...cases, ...newCases])
        setShowAdvancedSearch(false)
        
        alert(`✅ Found ${result.total || result.data.length} cases!\n\nAdded ${newCases.length} new cases to your list.\n\nCourt Type: ${searchFilters.courtType.toUpperCase()} COURT`)
      } else if (result.error === 'API_UNAVAILABLE') {
        alert(`⚠️ Court API temporarily unavailable.\n\n${result.message}\n\nPlease try again in a few minutes.`)
      } else if (result.error === 'NOT_IMPLEMENTED') {
        alert(`ℹ️ ${result.message}\n\nPlease use the CNR Import feature for real-time data.`)
      } else {
        alert(`❌ No cases found matching your search criteria.\n\nTry adjusting your search filters or use the CNR Import feature.`)
      }
    } catch (error) {
      console.error('❌ Advanced search error:', error)
      alert(`❌ Error searching cases: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoadingSearch(false)
    }
  }

  const handleCNRImport = async () => {
    if (!cnrNumber || cnrNumber.length !== 16) {
      alert('Please enter a valid CNR number (exactly 16 characters)')
      return
    }

    setIsLoadingCNR(true)
    try {
      console.log('🔍 Starting CNR import for:', cnrNumber)
      
      // Use server-side API route to avoid CORS issues
      console.log('📞 Calling server-side CNR API...')
      const response = await fetch('/api/ecourts/cnr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cnr: cnrNumber })
      })
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`)
      }
      
      const result = await response.json()
      
      console.log('📊 CNR import result:', result)
      console.log('📊 Result success:', result.success)
      console.log('📊 Result error:', result.error)
      console.log('📊 Result message:', result.message)
      
      if (result.success && result.data) {
        // Convert eCourts data to our enhanced case format
        const petitioner = result.data.parties.find((p: any) => p.type === 'PLAINTIFF' || p.type === 'PETITIONER')
        const respondent = result.data.parties.find((p: any) => p.type === 'DEFENDANT' || p.type === 'RESPONDENT')

        const newCase: Case = {
          id: Date.now().toString(),
          cnrNumber: result.data.cnr,
          caseNumber: result.data.caseNumber || result.data.registrationNumber || `REG-${Date.now()}`, // Primary: Registration Number
          filingNumber: result.data.filingNumber || undefined, // Optional: Filing Number
          title: result.data.title,
          petitionerName: petitioner?.name || 'Unknown Petitioner',
          respondentName: respondent?.name || 'Unknown Respondent',
          court: result.data.court,
          courtLocation: result.data.courtLocation,
          hallNumber: result.data.hallNumber || 'Not specified',
          caseType: result.data.caseType,
          caseStatus: result.data.caseStatus,
          filingDate: result.data.filingDate,
          lastHearingDate: result.data.lastHearingDate,
          nextHearingDate: result.data.nextHearingDate,
          priority: 'MEDIUM',
          stage: 'Active',
          subjectMatter: result.data.caseDetails.subjectMatter,
          reliefSought: result.data.caseDetails.reliefSought,
          caseValue: result.data.caseDetails.caseValue,
          jurisdiction: result.data.caseDetails.jurisdiction,
          advocates: result.data.advocates || [],
          judges: result.data.judges || [],
          // Enhanced eCourts data
          parties: result.data.parties || [],
          hearingHistory: result.data.hearingHistory || [],
          orders: result.data.orders || [],
          actsAndSections: result.data.actsAndSections,
          registrationNumber: result.data.registrationNumber,
          registrationDate: result.data.registrationDate,
          firstHearingDate: result.data.firstHearingDate,
          decisionDate: result.data.decisionDate,
          natureOfDisposal: result.data.natureOfDisposal
        }

        setCases([...cases, newCase])
        setCnrNumber('')
        setShowCNRModal(false)
        
        // Show detailed success message
        alert(`✅ Case imported successfully!\n\nReal API Data from Kleopatra\n\nCNR: ${newCase.cnrNumber}\nCase: ${newCase.caseNumber}\nTitle: ${newCase.title}\nCourt: ${newCase.court}\nPetitioner: ${newCase.petitionerName}\nRespondent: ${newCase.respondentName}`)
      } else if (result.requiresCaptcha) {
        alert('⚠️ CAPTCHA required. Please use manual import or try again later.')
      } else if (result.requiresManual) {
        alert('⚠️ Manual intervention required. Please try the manual import option.')
      } else if (result.error === 'API_UNAVAILABLE') {
        alert(`⚠️ Court API temporarily unavailable.\n\n${result.message}\n\nPlease try again in a few minutes.`)
      } else {
        alert(`❌ Error importing case: ${result.error} - ${result.message}`)
      }
    } catch (error) {
      console.error('❌ CNR import error:', error)
      console.error('❌ Error type:', typeof error)
      console.error('❌ Error name:', error instanceof Error ? error.name : 'Unknown')
      console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack')
      alert(`❌ Error importing case: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoadingCNR(false)
    }
  }

  const handleEditCase = (caseToEdit: Case) => {
    setEditingCase(caseToEdit)
    setNewCase({
      caseNumber: caseToEdit.caseNumber,
      filingNumber: caseToEdit.filingNumber || '',
      title: caseToEdit.title,
      petitionerName: caseToEdit.petitionerName,
      respondentName: caseToEdit.respondentName,
      court: caseToEdit.court,
      priority: caseToEdit.priority,
      stage: caseToEdit.stage
    })
    setShowEditModal(true)
  }

  const handleViewDetails = (caseToView: Case) => {
    setSelectedCase(caseToView)
    setShowCaseDetails(true)
  }

  const handleUpdateCase = () => {
    if (!editingCase || !newCase.caseNumber || !newCase.title || !newCase.petitionerName) {
      alert('Please fill in all required fields')
      return
    }

    const updatedCase: Case = {
      ...editingCase,
      caseNumber: newCase.caseNumber,
      filingNumber: newCase.filingNumber || undefined,
      title: newCase.title,
      petitionerName: newCase.petitionerName,
      respondentName: newCase.respondentName,
      court: newCase.court,
      priority: newCase.priority,
      stage: newCase.stage
    }

    setCases(cases.map(c => c.id === editingCase.id ? updatedCase : c))
    setShowEditModal(false)
    setEditingCase(null)
    setNewCase({
      caseNumber: '',
      filingNumber: '',
      title: '',
      petitionerName: '',
      respondentName: '',
      court: '',
      priority: 'MEDIUM',
      stage: ''
    })
  }

  const handleDeleteCase = (caseId: string) => {
    if (confirm('Are you sure you want to delete this case? This action cannot be undone.')) {
      setCases(cases.filter(c => c.id !== caseId))
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
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cases</h1>
              <p className="text-gray-600">Manage your legal cases</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Case
              </button>
              <button
                onClick={() => setShowCNRModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Import by CNR
              </button>
              <button
                onClick={() => setShowAdvancedSearch(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Advanced Search
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Cases</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                List of all legal cases
              </p>
            </div>
            <ul className="divide-y divide-gray-200">
              {cases.map((caseItem) => (
                <li key={caseItem.id} className="hover:bg-gray-50">
                  <div className="px-4 py-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p 
                          onClick={() => router.push(`/cases/${caseItem.id}`)}
                          className="text-sm font-medium text-blue-600 truncate cursor-pointer hover:underline"
                        >
                          {caseItem.caseNumber}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(caseItem.priority)}`}>
                            {caseItem.priority}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <p className="truncate font-medium">{caseItem.title}</p>
                        </div>
                        <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-1 text-sm text-gray-500">
                          <div>
                      <p><span className="font-medium">CNR:</span> {caseItem.cnrNumber || 'Not specified'}</p>
                      <p><span className="font-medium">Reg. No:</span> {caseItem.caseNumber || 'Not specified'}</p>
                      <p><span className="font-medium">Petitioner:</span> {caseItem.petitionerName || 'Not specified'}</p>
                      <p><span className="font-medium">Respondent:</span> {caseItem.respondentName || 'Not specified'}</p>
                            {caseItem.advocates && caseItem.advocates.length > 0 && (
                              <p><span className="font-medium">Advocate:</span> {caseItem.advocates[0].name}</p>
                            )}
                          </div>
                          <div>
                            <p><span className="font-medium">Court:</span> {caseItem.court || 'Not specified'}</p>
                            {caseItem.hallNumber && <p><span className="font-medium">Hall:</span> {caseItem.hallNumber}</p>}
                            <p><span className="font-medium">Type:</span> {caseItem.caseType || 'Not specified'}</p>
                            <p><span className="font-medium">Status:</span> 
                              <span className={`ml-1 px-2 py-1 text-xs rounded-full ${
                                caseItem.caseStatus && caseItem.caseStatus.includes('SUMMONS') ? 'bg-yellow-100 text-yellow-800' :
                                caseItem.caseStatus && caseItem.caseStatus.includes('HEARING') ? 'bg-blue-100 text-blue-800' :
                                caseItem.caseStatus && caseItem.caseStatus.includes('ORDERS') ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {caseItem.caseStatus ? caseItem.caseStatus.replace(/<br>|<b>|<\/b>/g, ' ').trim() : 'Unknown'}
                              </span>
                            </p>
                          </div>
                        </div>
                        {caseItem.subjectMatter && (
                          <div className="mt-1 text-sm text-gray-500">
                            <p><span className="font-medium">Subject:</span> {caseItem.subjectMatter}</p>
                          </div>
                        )}
                        {/* Show additional eCourts data if available */}
                        {(caseItem.actsAndSections || (caseItem.orders && caseItem.orders.length > 0) || (caseItem.hearingHistory && caseItem.hearingHistory.length > 0)) && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {caseItem.actsAndSections && caseItem.actsAndSections.acts && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                📋 {caseItem.actsAndSections.acts}
                              </span>
                            )}
                            {caseItem.orders && caseItem.orders.length > 0 && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                📄 {caseItem.orders.length} Order{caseItem.orders.length > 1 ? 's' : ''}
                              </span>
                            )}
                            {caseItem.hearingHistory && caseItem.hearingHistory.length > 0 && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                ⚖️ {caseItem.hearingHistory.length} Hearing{caseItem.hearingHistory.length > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm text-gray-500 mb-2">
                        {caseItem.nextHearingDate ? `Next Hearing: ${new Date(caseItem.nextHearingDate).toLocaleDateString()}` : 'No upcoming hearings'}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(caseItem)}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleEditCase(caseItem)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCase(caseItem.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      {/* Add Case Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add New Case</h3>
                <button
                  onClick={() => setShowAddModal(false)}
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
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    value={newCase.caseNumber}
                    onChange={(e) => setNewCase({...newCase, caseNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., REG-2024-004"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filing Number
                  </label>
                  <input
                    type="text"
                    value={newCase.filingNumber}
                    onChange={(e) => setNewCase({...newCase, filingNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., FIL-2024-004 (optional)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Case Title *
                  </label>
                  <input
                    type="text"
                    value={newCase.title}
                    onChange={(e) => setNewCase({...newCase, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Contract Dispute Resolution"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Petitioner Name *
                  </label>
                  <input
                    type="text"
                    value={newCase.petitionerName}
                    onChange={(e) => setNewCase({...newCase, petitionerName: e.target.value})}
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
                    value={newCase.court}
                    onChange={(e) => setNewCase({...newCase, court: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., High Court of Delhi"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newCase.priority}
                    onChange={(e) => setNewCase({...newCase, priority: e.target.value as any})}
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
                    value={newCase.stage}
                    onChange={(e) => setNewCase({...newCase, stage: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Preliminary, Arguments, Evidence"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCase}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add Case
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CNR Import Modal */}
      {showCNRModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Import Case by CNR</h3>
                <button
                  onClick={() => {
                    setShowCNRModal(false)
                    setCnrNumber('')
                  }}
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
                    CNR Number *
                  </label>
                  <input
                    type="text"
                    value={cnrNumber}
                    onChange={(e) => setCnrNumber(e.target.value.slice(0, 16))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., KABC010106452025"
                    maxLength={16}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the 16-character CNR number from eCourts
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-800">
                        <strong>eCourts Integration Status:</strong> Real-time data integration with Kleopatra API is active. Your API key is configured and ready to fetch live case data from Indian courts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowCNRModal(false)
                    setCnrNumber('')
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCNRImport}
                  disabled={isLoadingCNR || cnrNumber.length !== 16}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingCNR ? 'Importing...' : 'Import Case'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Case Modal */}
      {showEditModal && editingCase && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Edit Case</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingCase(null)
                    setNewCase({
                      caseNumber: '',
                      filingNumber: '',
                      title: '',
                      petitionerName: '',
                      respondentName: '',
                      court: '',
                      priority: 'MEDIUM',
                      stage: ''
                    })
                  }}
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
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    value={newCase.caseNumber}
                    onChange={(e) => setNewCase({...newCase, caseNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., REG-2024-004"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filing Number
                  </label>
                  <input
                    type="text"
                    value={newCase.filingNumber}
                    onChange={(e) => setNewCase({...newCase, filingNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., FIL-2024-004 (optional)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Case Title *
                  </label>
                  <input
                    type="text"
                    value={newCase.title}
                    onChange={(e) => setNewCase({...newCase, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Contract Dispute Resolution"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Petitioner Name *
                  </label>
                  <input
                    type="text"
                    value={newCase.petitionerName}
                    onChange={(e) => setNewCase({...newCase, petitionerName: e.target.value})}
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
                    value={newCase.court}
                    onChange={(e) => setNewCase({...newCase, court: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., High Court of Delhi"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newCase.priority}
                    onChange={(e) => setNewCase({...newCase, priority: e.target.value as any})}
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
                    value={newCase.stage}
                    onChange={(e) => setNewCase({...newCase, stage: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Preliminary, Arguments, Evidence"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingCase(null)
                    setNewCase({
                      caseNumber: '',
                      filingNumber: '',
                      title: '',
                      petitionerName: '',
                      respondentName: '',
                      court: '',
                      priority: 'MEDIUM',
                      stage: ''
                    })
                  }}
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

      {/* Advanced Search Modal */}
      {showAdvancedSearch && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Advanced Case Search</h3>
                <button
                  onClick={() => setShowAdvancedSearch(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Basic Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Case Number
                    </label>
                    <input
                      type="text"
                      value={searchFilters.caseNumber}
                      onChange={(e) => setSearchFilters({...searchFilters, caseNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., CASE-2024-001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Party Name
                    </label>
                    <input
                      type="text"
                      value={searchFilters.partyName}
                      onChange={(e) => setSearchFilters({...searchFilters, partyName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., ABC Corporation"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Advocate Name
                    </label>
                    <input
                      type="text"
                      value={searchFilters.advocateName}
                      onChange={(e) => setSearchFilters({...searchFilters, advocateName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Adv. John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Court Name
                    </label>
                    <input
                      type="text"
                      value={searchFilters.court}
                      onChange={(e) => setSearchFilters({...searchFilters, court: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., High Court of Delhi"
                    />
                  </div>
                </div>

                {/* Court Type and Status */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Court & Status</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Court Type
                    </label>
                    <select
                      value={searchFilters.courtType}
                      onChange={(e) => setSearchFilters({...searchFilters, courtType: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="district">District Court</option>
                      <option value="high">High Court</option>
                      <option value="supreme">Supreme Court</option>
                      <option value="nclt">NCLT</option>
                      <option value="cat">CAT</option>
                      <option value="consumer">Consumer Forum</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Case Type
                    </label>
                    <select
                      value={searchFilters.caseType}
                      onChange={(e) => setSearchFilters({...searchFilters, caseType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Types</option>
                      <option value="CIVIL">Civil</option>
                      <option value="CRIMINAL">Criminal</option>
                      <option value="WRIT_PETITION">Writ Petition</option>
                      <option value="FAMILY">Family</option>
                      <option value="CONSUMER">Consumer</option>
                      <option value="INSOLVENCY">Insolvency</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Case Status
                    </label>
                    <select
                      value={searchFilters.caseStatus}
                      onChange={(e) => setSearchFilters({...searchFilters, caseStatus: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Status</option>
                      <option value="PENDING">Pending</option>
                      <option value="DISPOSED">Disposed</option>
                      <option value="ADJOURNED">Adjourned</option>
                      <option value="HEARD">Heard</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Date Range Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Filing Date Range</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        From Date
                      </label>
                      <input
                        type="date"
                        value={searchFilters.filingDateFrom}
                        onChange={(e) => setSearchFilters({...searchFilters, filingDateFrom: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        To Date
                      </label>
                      <input
                        type="date"
                        value={searchFilters.filingDateTo}
                        onChange={(e) => setSearchFilters({...searchFilters, filingDateTo: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Hearing Date Range</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        From Date
                      </label>
                      <input
                        type="date"
                        value={searchFilters.hearingDateFrom}
                        onChange={(e) => setSearchFilters({...searchFilters, hearingDateFrom: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        To Date
                      </label>
                      <input
                        type="date"
                        value={searchFilters.hearingDateTo}
                        onChange={(e) => setSearchFilters({...searchFilters, hearingDateTo: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-800">
                      <strong>Advanced Search:</strong> Search across all Indian courts using multiple criteria. Results will be fetched from the Kleopatra API and added to your cases list.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAdvancedSearch(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdvancedSearch}
                  disabled={isLoadingSearch}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoadingSearch ? 'Searching...' : 'Search Cases'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Case Details Modal */}
      {showCaseDetails && selectedCase && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Case Details</h3>
                <button
                  onClick={() => setShowCaseDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Case Header */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Case Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">CNR:</span> {selectedCase.cnrNumber || 'Not specified'}</p>
                      <p><span className="font-medium">Registration No:</span> {selectedCase.caseNumber || 'Not specified'}</p>
                      {selectedCase.filingNumber && (
                        <p><span className="font-medium">Filing No:</span> {selectedCase.filingNumber}</p>
                      )}
                      <p><span className="font-medium">Title:</span> {selectedCase.title || 'Not specified'}</p>
                      <p><span className="font-medium">Court:</span> {selectedCase.court || 'Not specified'}</p>
                      <p><span className="font-medium">Court Location:</span> {selectedCase.courtLocation || 'Not specified'}</p>
                      {selectedCase.hallNumber && <p><span className="font-medium">Hall Number:</span> {selectedCase.hallNumber}</p>}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Case Status</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Type:</span> {selectedCase.caseType || 'Not specified'}</p>
                      <p><span className="font-medium">Status:</span> 
                        <span className={`ml-2 px-3 py-1 text-xs rounded-full ${
                          selectedCase.caseStatus && selectedCase.caseStatus.includes('SUMMONS') ? 'bg-yellow-100 text-yellow-800' :
                          selectedCase.caseStatus && selectedCase.caseStatus.includes('HEARING') ? 'bg-blue-100 text-blue-800' :
                          selectedCase.caseStatus && selectedCase.caseStatus.includes('ORDERS') ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedCase.caseStatus ? selectedCase.caseStatus.replace(/<br>|<b>|<\/b>/g, ' ').trim() : 'Unknown'}
                        </span>
                      </p>
                      <p><span className="font-medium">Priority:</span> 
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getPriorityColor(selectedCase.priority)}`}>
                          {selectedCase.priority}
                        </span>
                      </p>
                      <p><span className="font-medium">Filing Date:</span> {selectedCase.filingDate ? new Date(selectedCase.filingDate).toLocaleDateString() : 'Not specified'}</p>
                      <p><span className="font-medium">Next Hearing:</span> {selectedCase.nextHearingDate ? new Date(selectedCase.nextHearingDate).toLocaleDateString() : 'Not scheduled'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  <button className="py-2 px-1 border-b-2 border-blue-500 font-medium text-sm text-blue-600">
                    Parties
                  </button>
                  <button className="py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
                    Advocates
                  </button>
                  <button className="py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
                    Hearing History
                  </button>
                  <button className="py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
                    Orders
                  </button>
                </nav>
              </div>

              {/* Parties Section */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Parties</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-3">Petitioners/Plaintiffs</h5>
                    <div className="space-y-2">
                      {selectedCase.parties && selectedCase.parties.filter(p => p.type === 'PLAINTIFF' || p.type === 'PETITIONER').map((party, index) => (
                        <div key={index} className="p-3 bg-green-50 rounded-lg">
                          <p className="text-sm font-medium text-green-800">{party.name}</p>
                          <p className="text-xs text-green-600">{party.type}</p>
                        </div>
                      ))}
                      {(!selectedCase.parties || selectedCase.parties.filter(p => p.type === 'PLAINTIFF' || p.type === 'PETITIONER').length === 0) && (
                        <p className="text-sm text-gray-500 italic">No petitioners found</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700 mb-3">Respondents/Defendants</h5>
                    <div className="space-y-2">
                      {selectedCase.parties && selectedCase.parties.filter(p => p.type === 'DEFENDANT' || p.type === 'RESPONDENT').map((party, index) => (
                        <div key={index} className="p-3 bg-red-50 rounded-lg">
                          <p className="text-sm font-medium text-red-800">{party.name}</p>
                          <p className="text-xs text-red-600">{party.type}</p>
                        </div>
                      ))}
                      {(!selectedCase.parties || selectedCase.parties.filter(p => p.type === 'DEFENDANT' || p.type === 'RESPONDENT').length === 0) && (
                        <p className="text-sm text-gray-500 italic">No respondents found</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Advocates Section */}
              {selectedCase.advocates && selectedCase.advocates.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Advocates</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCase.advocates.map((advocate, index) => (
                      <div key={index} className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">{advocate.name}</p>
                        <p className="text-xs text-blue-600">Type: {advocate.type || 'Not specified'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hearing History Section */}
              {selectedCase.hearingHistory && selectedCase.hearingHistory.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Hearing History</h4>
                  <div className="space-y-3">
                    {selectedCase.hearingHistory.slice(0, 5).map((hearing, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{hearing.purpose}</p>
                            <p className="text-xs text-gray-600">Judge: {hearing.judge}</p>
                          </div>
                          <p className="text-xs text-gray-500">{hearing.date ? new Date(hearing.date).toLocaleDateString() : 'Date not available'}</p>
                        </div>
                      </div>
                    ))}
                    {selectedCase.hearingHistory.length > 5 && (
                      <p className="text-sm text-gray-500">... and {selectedCase.hearingHistory.length - 5} more hearings</p>
                    )}
                  </div>
                </div>
              )}

              {/* Orders Section */}
              {selectedCase.orders && selectedCase.orders.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Court Orders</h4>
                  <div className="space-y-3">
                    {selectedCase.orders.map((order, index) => (
                      <div key={index} className="p-4 bg-green-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-green-800">Order #{order.number}</p>
                            <p className="text-xs text-green-600">{order.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-green-500">{order.date ? new Date(order.date).toLocaleDateString() : 'Date not available'}</p>
                            {order.url && (
                              <a href={order.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:text-blue-800">
                                View PDF
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Legal Acts and Sections */}
              {selectedCase.actsAndSections && (selectedCase.actsAndSections.acts || selectedCase.actsAndSections.sections) && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Legal Acts & Sections</h4>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    {selectedCase.actsAndSections.acts && (
                      <p className="text-sm font-medium text-purple-800">{selectedCase.actsAndSections.acts}</p>
                    )}
                    {selectedCase.actsAndSections.sections && (
                      <p className="text-xs text-purple-600 mt-1">Sections: {selectedCase.actsAndSections.sections}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowCaseDetails(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowCaseDetails(false)
                    handleEditCase(selectedCase)
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Edit Case
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}