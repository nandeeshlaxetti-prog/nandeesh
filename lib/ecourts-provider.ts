// ECourts Provider - Mock implementation
export interface ECourtsConfig {
  apiUrl: string;
  timeout: number;
  retries: number;
}

export interface ECourtsCaseData {
  cnrNumber: string;
  caseNumber: string;
  caseType: string;
  filingDate: string;
  courtName: string;
  petitioner: string;
  respondent: string;
  status: string;
  nextHearingDate?: string;
  lastOrderDate?: string;
}

export class ECourtsProvider {
  private config: ECourtsConfig;

  constructor(config: ECourtsConfig) {
    this.config = config;
  }

  async searchByCNR(cnrNumber: string): Promise<ECourtsCaseData | null> {
    console.log(`Searching for CNR: ${cnrNumber}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      cnrNumber,
      caseNumber: `CASE-${cnrNumber.slice(-6)}`,
      caseType: 'Civil Suit',
      filingDate: '2023-01-15',
      courtName: 'District Court, Mumbai',
      petitioner: 'John Doe',
      respondent: 'Jane Smith',
      status: 'Active',
      nextHearingDate: '2024-02-15',
      lastOrderDate: '2023-12-15'
    };
  }

  async searchByCaseNumber(caseNumber: string): Promise<ECourtsCaseData[]> {
    console.log(`Searching for case number: ${caseNumber}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [{
      cnrNumber: `CNR-${caseNumber}-001`,
      caseNumber,
      caseType: 'Civil Suit',
      filingDate: '2023-01-15',
      courtName: 'District Court, Mumbai',
      petitioner: 'John Doe',
      respondent: 'Jane Smith',
      status: 'Active',
      nextHearingDate: '2024-02-15',
      lastOrderDate: '2023-12-15'
    }];
  }

  async searchByPartyName(partyName: string): Promise<ECourtsCaseData[]> {
    console.log(`Searching for party: ${partyName}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [{
      cnrNumber: `CNR-${Date.now()}-001`,
      caseNumber: `CASE-${Date.now()}`,
      caseType: 'Civil Suit',
      filingDate: '2023-01-15',
      courtName: 'District Court, Mumbai',
      petitioner: partyName,
      respondent: 'Another Party',
      status: 'Active',
      nextHearingDate: '2024-02-15',
      lastOrderDate: '2023-12-15'
    }];
  }
}

export const defaultECourtsConfig: ECourtsConfig = {
  apiUrl: 'https://api.ecourts.gov.in',
  timeout: 30000,
  retries: 3
};

export const ecourtsProvider = new ECourtsProvider(defaultECourtsConfig);
