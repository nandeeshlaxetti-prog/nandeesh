'use server'

// Simple working actions for cases
export interface CaseListItem {
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

export async function getCasesList(): Promise<CaseListItem[]> {
  // Return mock data for now
  return [
    {
      id: '1',
      caseNumber: 'CASE-2024-001',
      title: 'Contract Dispute Resolution',
      court: 'High Court of Delhi',
      stage: 'Arguments',
      nextHearingDate: new Date('2024-04-15'),
      lastOrderDate: new Date('2024-03-20'),
      status: 'OPEN',
      priority: 'HIGH'
    },
    {
      id: '2',
      caseNumber: 'CASE-2024-002',
      title: 'Property Settlement',
      court: 'Bombay High Court',
      stage: 'Evidence',
      nextHearingDate: new Date('2024-04-20'),
      lastOrderDate: null,
      status: 'IN_PROGRESS',
      priority: 'MEDIUM'
    },
    {
      id: '3',
      caseNumber: 'CASE-2024-003',
      title: 'Employment Law Matter',
      court: 'Labor Court',
      stage: 'Preliminary',
      nextHearingDate: null,
      lastOrderDate: null,
      status: 'OPEN',
      priority: 'URGENT'
    }
  ]
}

export async function getCaseDetail(caseId: string) {
  // Return mock case detail
  return {
    id: caseId,
    caseNumber: 'CASE-2024-001',
    title: 'Contract Dispute Resolution',
    description: 'Resolution of contract dispute between ABC Corporation and XYZ Ltd.',
    status: 'OPEN',
    priority: 'HIGH',
    courtName: 'High Court of Delhi',
    filingDate: new Date('2024-01-15'),
    expectedCompletionDate: new Date('2024-12-31'),
    assignedLawyer: {
      name: 'John Doe'
    },
    client: {
      name: 'ABC Corporation'
    }
  }
}