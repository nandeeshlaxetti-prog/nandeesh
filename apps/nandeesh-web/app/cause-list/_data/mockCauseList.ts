export type CauseListEntry = {
  id: string
  dateISO: string        // yyyy-mm-dd in IST
  court?: string         // e.g., "Karnataka HC, Bengaluru"
  bench?: string         // e.g., "Court Hall 12"
  listNo?: string        // e.g., "List 3"
  itemNo?: string        // e.g., "Item 27"
  caseNumber: string     // e.g., "WP 12345/2024"
  parties?: string       // short caption
  advocate?: string      // "A. Nandeesh" etc.
  purpose?: string       // "For Hearing", "Admission"
  timeSlot?: string      // e.g., "10:30 AM"
}

// Helper function to get date string for a given offset from today
const getDateString = (daysOffset: number): string => {
  const date = new Date()
  date.setDate(date.getDate() + daysOffset)
  return date.toISOString().split('T')[0]
}

// Generate mock data for 5 days
export const mockCauseListData: CauseListEntry[] = [
  // D-2 (2 days ago)
  {
    id: '1',
    dateISO: getDateString(-2),
    court: 'Karnataka HC, Bengaluru',
    bench: 'Court Hall 12',
    listNo: 'List 1',
    itemNo: 'Item 5',
    caseNumber: 'WP 12345/2024',
    parties: 'John Doe vs State of Karnataka',
    advocate: 'A. Nandeesh',
    purpose: 'For Hearing',
    timeSlot: '10:30 AM'
  },
  {
    id: '2',
    dateISO: getDateString(-2),
    court: 'Karnataka HC, Bengaluru',
    bench: 'Court Hall 15',
    listNo: 'List 2',
    itemNo: 'Item 12',
    caseNumber: 'WP 12346/2024',
    parties: 'ABC Corporation vs XYZ Ltd',
    advocate: 'B. Kumar',
    purpose: 'Admission',
    timeSlot: '11:15 AM'
  },

  // D-1 (yesterday)
  {
    id: '3',
    dateISO: getDateString(-1),
    court: 'Karnataka HC, Bengaluru',
    bench: 'Court Hall 8',
    listNo: 'List 1',
    itemNo: 'Item 3',
    caseNumber: 'WP 12347/2024',
    parties: 'Smith vs Johnson',
    advocate: 'C. Sharma',
    purpose: 'For Hearing',
    timeSlot: '09:45 AM'
  },
  {
    id: '4',
    dateISO: getDateString(-1),
    court: 'Karnataka HC, Bengaluru',
    bench: 'Court Hall 10',
    listNo: 'List 2',
    itemNo: 'Item 8',
    caseNumber: 'WP 12348/2024',
    parties: 'Municipal Corporation vs Property Owner',
    advocate: 'D. Patel',
    purpose: 'For Orders',
    timeSlot: '02:30 PM'
  },
  {
    id: '5',
    dateISO: getDateString(-1),
    court: 'Karnataka HC, Bengaluru',
    bench: 'Court Hall 12',
    listNo: 'List 3',
    itemNo: 'Item 15',
    caseNumber: 'WP 12349/2024',
    parties: 'Employee Union vs Management',
    advocate: 'E. Singh',
    purpose: 'For Arguments',
    timeSlot: '03:45 PM'
  },

  // Today
  {
    id: '6',
    dateISO: getDateString(0),
    court: 'Karnataka HC, Bengaluru',
    bench: 'Court Hall 5',
    listNo: 'List 1',
    itemNo: 'Item 2',
    caseNumber: 'WP 12350/2024',
    parties: 'Environmental Group vs Industrial Company',
    advocate: 'F. Reddy',
    purpose: 'For Hearing',
    timeSlot: '10:00 AM'
  },
  {
    id: '7',
    dateISO: getDateString(0),
    court: 'Karnataka HC, Bengaluru',
    bench: 'Court Hall 8',
    listNo: 'List 1',
    itemNo: 'Item 7',
    caseNumber: 'WP 12351/2024',
    parties: 'Student vs University',
    advocate: 'G. Verma',
    purpose: 'For Arguments',
    timeSlot: '11:30 AM'
  },
  {
    id: '8',
    dateISO: getDateString(0),
    court: 'Karnataka HC, Bengaluru',
    bench: 'Court Hall 12',
    listNo: 'List 2',
    itemNo: 'Item 4',
    caseNumber: 'WP 12352/2024',
    parties: 'Taxpayer vs Revenue Department',
    advocate: 'H. Gupta',
    purpose: 'For Orders',
    timeSlot: '01:15 PM'
  },
  {
    id: '9',
    dateISO: getDateString(0),
    court: 'Karnataka HC, Bengaluru',
    bench: 'Court Hall 15',
    listNo: 'List 2',
    itemNo: 'Item 9',
    caseNumber: 'WP 12353/2024',
    parties: 'Consumer vs Service Provider',
    advocate: 'I. Joshi',
    purpose: 'For Hearing',
    timeSlot: '02:45 PM'
  },
  {
    id: '10',
    dateISO: getDateString(0),
    court: 'Karnataka HC, Bengaluru',
    bench: 'Court Hall 18',
    listNo: 'List 3',
    itemNo: 'Item 6',
    caseNumber: 'WP 12354/2024',
    parties: 'Landlord vs Tenant',
    advocate: 'J. Agarwal',
    purpose: 'For Arguments',
    timeSlot: '04:00 PM'
  },

  // D+1 (tomorrow)
  {
    id: '11',
    dateISO: getDateString(1),
    court: 'Karnataka HC, Bengaluru',
    bench: 'Court Hall 6',
    listNo: 'List 1',
    itemNo: 'Item 1',
    caseNumber: 'WP 12355/2024',
    parties: 'Bank vs Default Borrower',
    advocate: 'K. Malhotra',
    purpose: 'For Hearing',
    timeSlot: '09:30 AM'
  },
  {
    id: '12',
    dateISO: getDateString(1),
    court: 'Karnataka HC, Bengaluru',
    bench: 'Court Hall 9',
    listNo: 'List 1',
    itemNo: 'Item 5',
    caseNumber: 'WP 12356/2024',
    parties: 'Insurance Company vs Policy Holder',
    advocate: 'L. Iyer',
    purpose: 'For Arguments',
    timeSlot: '10:45 AM'
  },
  {
    id: '13',
    dateISO: getDateString(1),
    court: 'Karnataka HC, Bengaluru',
    bench: 'Court Hall 11',
    listNo: 'List 2',
    itemNo: 'Item 3',
    caseNumber: 'WP 12357/2024',
    parties: 'Contractor vs Government Department',
    advocate: 'M. Nair',
    purpose: 'For Orders',
    timeSlot: '12:00 PM'
  },
  {
    id: '14',
    dateISO: getDateString(1),
    court: 'Karnataka HC, Bengaluru',
    bench: 'Court Hall 14',
    listNo: 'List 2',
    itemNo: 'Item 8',
    caseNumber: 'WP 12358/2024',
    parties: 'Media House vs Regulatory Authority',
    advocate: 'N. Oberoi',
    purpose: 'For Hearing',
    timeSlot: '01:30 PM'
  },

  // D+2 (day after tomorrow)
  {
    id: '15',
    dateISO: getDateString(2),
    court: 'Karnataka HC, Bengaluru',
    bench: 'Court Hall 7',
    listNo: 'List 1',
    itemNo: 'Item 2',
    caseNumber: 'WP 12359/2024',
    parties: 'Healthcare Provider vs Patient',
    advocate: 'O. Prasad',
    purpose: 'For Hearing',
    timeSlot: '09:15 AM'
  },
  {
    id: '16',
    dateISO: getDateString(2),
    court: 'Karnataka HC, Bengaluru',
    bench: 'Court Hall 10',
    listNo: 'List 1',
    itemNo: 'Item 6',
    caseNumber: 'WP 12360/2024',
    parties: 'Educational Institution vs Student',
    advocate: 'P. Rao',
    purpose: 'For Arguments',
    timeSlot: '10:30 AM'
  },
  {
    id: '17',
    dateISO: getDateString(2),
    court: 'Karnataka HC, Bengaluru',
    bench: 'Court Hall 13',
    listNo: 'List 2',
    itemNo: 'Item 4',
    caseNumber: 'WP 12361/2024',
    parties: 'Technology Company vs Competitor',
    advocate: 'Q. Saxena',
    purpose: 'For Orders',
    timeSlot: '11:45 AM'
  },
  {
    id: '18',
    dateISO: getDateString(2),
    court: 'Karnataka HC, Bengaluru',
    bench: 'Court Hall 16',
    listNo: 'List 2',
    itemNo: 'Item 7',
    caseNumber: 'WP 12362/2024',
    parties: 'Non-Profit Organization vs Government',
    advocate: 'R. Tiwari',
    purpose: 'For Hearing',
    timeSlot: '02:15 PM'
  },
  {
    id: '19',
    dateISO: getDateString(2),
    court: 'Karnataka HC, Bengaluru',
    bench: 'Court Hall 19',
    listNo: 'List 3',
    itemNo: 'Item 3',
    caseNumber: 'WP 12363/2024',
    parties: 'Real Estate Developer vs Buyers',
    advocate: 'S. Yadav',
    purpose: 'For Arguments',
    timeSlot: '03:30 PM'
  },
  {
    id: '20',
    dateISO: getDateString(2),
    court: 'Karnataka HC, Bengaluru',
    bench: 'Court Hall 20',
    listNo: 'List 3',
    itemNo: 'Item 9',
    caseNumber: 'WP 12364/2024',
    parties: 'Transport Company vs Regulatory Body',
    advocate: 'T. Choudhary',
    purpose: 'For Orders',
    timeSlot: '04:45 PM'
  }
]
