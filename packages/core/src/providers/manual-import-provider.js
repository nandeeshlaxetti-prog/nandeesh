"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManualImportProvider = void 0;
class ManualImportProvider {
    constructor(config) {
        this.name = 'Manual Import Provider';
        this.type = 'MANUAL_IMPORT';
        this.importedCases = new Map();
        this.importedOrders = new Map();
        this.syncStatuses = new Map();
        this.config = config || {};
        this.initializeSampleData();
    }
    async getCaseByCNR(cnr, config) {
        const startTime = Date.now();
        const effectiveConfig = { ...this.config, ...config };
        try {
            // Validate CNR format
            if (!this.isValidCNR(cnr)) {
                return {
                    success: false,
                    error: 'Invalid CNR format',
                    provider: this.name
                };
            }
            // Simulate manual lookup delay
            await this.simulateManualDelay(200, 500);
            // Check if case exists in imported data
            const caseData = this.importedCases.get(cnr);
            if (!caseData) {
                // Check if this is a captcha/blocked scenario (simulate 30% chance)
                if (Math.random() < 0.3) {
                    // Set sync status to action_required
                    this.syncStatuses.set(cnr, 'action_required');
                    this.updateSyncStatus('action_required');
                    return {
                        success: false,
                        error: 'MANUAL_FETCH_REQUIRED',
                        data: {
                            action_required: true,
                            caseNumber: this.generateCaseNumber(cnr),
                            cnr: cnr,
                            portalUrl: effectiveConfig.officialPortalUrl || 'https://ecourts.gov.in',
                            message: 'Manual fetch required due to captcha/blocking. Please complete the process in the official portal.',
                            syncStatus: 'action_required'
                        },
                        responseTime: Date.now() - startTime,
                        provider: this.name
                    };
                }
                return {
                    success: false,
                    error: 'Case not found in imported data. Please import the case first.',
                    responseTime: Date.now() - startTime,
                    provider: this.name
                };
            }
            return {
                success: true,
                data: caseData,
                responseTime: Date.now() - startTime,
                provider: this.name
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                responseTime: Date.now() - startTime,
                provider: this.name
            };
        }
    }
    async searchCase(filters, config) {
        const startTime = Date.now();
        const effectiveConfig = { ...this.config, ...config };
        try {
            // Simulate manual search delay
            await this.simulateManualDelay(300, 800);
            // Search through imported cases
            let matchingCases = [];
            for (const caseData of this.importedCases.values()) {
                let matches = true;
                // Apply filters
                if (filters.caseNumber && !caseData.caseNumber.toLowerCase().includes(filters.caseNumber.toLowerCase())) {
                    matches = false;
                }
                if (filters.year && new Date(caseData.filingDate).getFullYear() !== filters.year) {
                    matches = false;
                }
                if (filters.court && !caseData.court.toLowerCase().includes(filters.court.toLowerCase())) {
                    matches = false;
                }
                if (filters.caseType && caseData.caseType !== filters.caseType) {
                    matches = false;
                }
                if (filters.caseStatus && caseData.caseStatus !== filters.caseStatus) {
                    matches = false;
                }
                if (filters.partyName) {
                    const partyNames = caseData.parties.map(p => p.name.toLowerCase());
                    if (!partyNames.some(name => name.includes(filters.partyName.toLowerCase()))) {
                        matches = false;
                    }
                }
                if (filters.advocateName) {
                    const advocateNames = caseData.advocates.map(a => a.name.toLowerCase());
                    if (!advocateNames.some(name => name.includes(filters.advocateName.toLowerCase()))) {
                        matches = false;
                    }
                }
                if (matches) {
                    matchingCases.push(caseData);
                }
            }
            const searchResult = {
                cases: matchingCases,
                totalCount: matchingCases.length,
                hasMore: false,
                nextPageToken: undefined
            };
            return {
                success: true,
                data: searchResult,
                responseTime: Date.now() - startTime,
                provider: this.name
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                responseTime: Date.now() - startTime,
                provider: this.name
            };
        }
    }
    async getCauseList(court, date, config) {
        const startTime = Date.now();
        const effectiveConfig = { ...this.config, ...config };
        try {
            // Simulate manual cause list creation
            await this.simulateManualDelay(400, 700);
            // Generate cause list from imported cases for the specified date
            const items = [];
            let itemNumber = 1;
            for (const caseData of this.importedCases.values()) {
                // Check if case has hearing on the specified date
                if (caseData.nextHearingDate &&
                    caseData.nextHearingDate.toDateString() === date.toDateString() &&
                    caseData.court.toLowerCase().includes(court.toLowerCase())) {
                    items.push({
                        caseNumber: caseData.caseNumber,
                        cnr: caseData.cnr,
                        title: caseData.title,
                        parties: caseData.parties.map(p => p.name),
                        advocates: caseData.advocates.map(a => a.name),
                        hearingTime: '10:00', // Default time for manual entries
                        purpose: 'Hearing',
                        judge: caseData.judges?.[0],
                        itemNumber: itemNumber++
                    });
                }
            }
            const causeList = {
                id: `manual-cause-list-${court}-${date.toISOString().split('T')[0]}`,
                court,
                date,
                items
            };
            return {
                success: true,
                data: causeList,
                responseTime: Date.now() - startTime,
                provider: this.name
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                responseTime: Date.now() - startTime,
                provider: this.name
            };
        }
    }
    async listOrders(cnr, config) {
        const startTime = Date.now();
        const effectiveConfig = { ...this.config, ...config };
        try {
            // Simulate manual order lookup
            await this.simulateManualDelay(200, 400);
            // Get orders for the case
            const orders = this.importedOrders.get(cnr) || [];
            return {
                success: true,
                data: orders,
                responseTime: Date.now() - startTime,
                provider: this.name
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                responseTime: Date.now() - startTime,
                provider: this.name
            };
        }
    }
    async downloadOrderPdf(orderId, config) {
        const startTime = Date.now();
        const effectiveConfig = { ...this.config, ...config };
        try {
            // Manual import doesn't support PDF download
            return {
                success: false,
                error: 'PDF download not supported in manual import mode. Please upload PDF files manually.',
                responseTime: Date.now() - startTime,
                provider: this.name
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                responseTime: Date.now() - startTime,
                provider: this.name
            };
        }
    }
    async testConnection(config) {
        const startTime = Date.now();
        const effectiveConfig = { ...this.config, ...config };
        try {
            // Manual import doesn't require external connection
            await this.simulateManualDelay(100, 200);
            return {
                success: true,
                data: true,
                responseTime: Date.now() - startTime,
                provider: this.name
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                responseTime: Date.now() - startTime,
                provider: this.name
            };
        }
    }
    getCapabilities() {
        return {
            supportsCNRLookup: true,
            supportsCaseSearch: true,
            supportsCauseList: true,
            supportsOrderListing: true,
            supportsPdfDownload: false, // Manual import doesn't support PDF download
            supportsRealTimeSync: false, // Manual import is not real-time
            maxConcurrentRequests: 100, // High limit for manual operations
            rateLimitPerMinute: 1000, // High limit for manual operations
            supportedCourts: ['ALL'], // Manual import supports all courts
            supportedCaseTypes: ['ALL'] // Manual import supports all case types
        };
    }
    // Additional methods for manual import functionality
    /**
     * Import a case manually
     */
    async importCase(caseData) {
        try {
            this.importedCases.set(caseData.cnr, caseData);
            this.syncStatuses.set(caseData.cnr, 'completed');
            this.updateSyncStatus('completed');
            return {
                success: true,
                data: true,
                provider: this.name
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                provider: this.name
            };
        }
    }
    /**
     * Parse HTML from official portal and convert to DTOs
     */
    async parsePortalHtml(html, cnr) {
        try {
            // Set sync status to pending during parsing
            this.syncStatuses.set(cnr, 'pending');
            this.updateSyncStatus('pending');
            // Use custom DOM parser if provided, otherwise use default
            let caseData;
            if (this.config.domParser) {
                const parsedCases = this.config.domParser(html);
                caseData = parsedCases[0] || this.createDefaultCaseFromCnr(cnr);
            }
            else {
                caseData = this.parseHtmlToCase(html, cnr);
            }
            // Import the parsed case
            await this.importCase(caseData);
            return {
                success: true,
                data: caseData,
                provider: this.name
            };
        }
        catch (error) {
            this.syncStatuses.set(cnr, 'failed');
            this.updateSyncStatus('failed');
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to parse portal HTML',
                provider: this.name
            };
        }
    }
    /**
     * Get sync status for a case
     */
    getSyncStatus(cnr) {
        return this.syncStatuses.get(cnr) || 'pending';
    }
    /**
     * Update sync status and notify callback
     */
    updateSyncStatus(status) {
        if (this.config.syncStatusCallback) {
            this.config.syncStatusCallback(status);
        }
    }
    /**
     * Parse HTML to case DTO (default implementation)
     */
    parseHtmlToCase(html, cnr) {
        // This is a mock implementation - in real scenario, you would parse actual HTML
        // For now, we'll create a case based on the CNR and some mock data
        return {
            cnr,
            caseNumber: this.generateCaseNumber(cnr),
            title: 'Parsed Case from Portal',
            court: 'DISTRICT COURT',
            courtLocation: 'Sample Location',
            caseType: 'CIVIL',
            caseStatus: 'PENDING',
            filingDate: new Date(),
            nextHearingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            parties: [
                {
                    name: 'Parsed Plaintiff',
                    type: 'PLAINTIFF',
                    address: 'Parsed Address',
                    phone: '+91-9876543210',
                    email: 'plaintiff@example.com'
                },
                {
                    name: 'Parsed Defendant',
                    type: 'DEFENDANT',
                    address: 'Parsed Address',
                    phone: '+91-9876543211',
                    email: 'defendant@example.com'
                }
            ],
            advocates: [
                {
                    name: 'Adv. Parsed Advocate',
                    barNumber: 'PARSED123456',
                    phone: '+91-9876543212',
                    email: 'advocate@example.com',
                    address: 'Parsed Legal Office'
                }
            ],
            judges: [
                {
                    name: 'Hon. Parsed Judge',
                    designation: 'District Judge',
                    court: 'DISTRICT COURT'
                }
            ],
            caseDetails: {
                subjectMatter: 'Parsed Subject Matter',
                caseDescription: 'Case parsed from official portal',
                reliefSought: 'Parsed relief',
                caseValue: 100000,
                jurisdiction: 'District Court'
            }
        };
    }
    /**
     * Create default case from CNR when parsing fails
     */
    createDefaultCaseFromCnr(cnr) {
        return {
            cnr,
            caseNumber: this.generateCaseNumber(cnr),
            title: 'Default Case from CNR',
            court: 'DISTRICT COURT',
            courtLocation: 'Default Location',
            caseType: 'CIVIL',
            caseStatus: 'PENDING',
            filingDate: new Date(),
            nextHearingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            parties: [
                {
                    name: 'Default Plaintiff',
                    type: 'PLAINTIFF'
                },
                {
                    name: 'Default Defendant',
                    type: 'DEFENDANT'
                }
            ],
            advocates: [
                {
                    name: 'Adv. Default Advocate',
                    barNumber: 'DEFAULT123456'
                }
            ]
        };
    }
    /**
     * Import orders for a case
     */
    async importOrders(cnr, orders) {
        try {
            this.importedOrders.set(cnr, orders);
            return {
                success: true,
                data: true,
                provider: this.name
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                provider: this.name
            };
        }
    }
    /**
     * Get all imported cases
     */
    async getAllImportedCases() {
        return Array.from(this.importedCases.values());
    }
    /**
     * Clear all imported data
     */
    async clearImportedData() {
        this.importedCases.clear();
        this.importedOrders.clear();
    }
    // Helper methods
    isValidCNR(cnr) {
        // Basic CNR validation
        return /^[A-Z0-9]{10,20}$/i.test(cnr);
    }
    async simulateManualDelay(min, max) {
        const delay = min + Math.random() * (max - min);
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    initializeSampleData() {
        // Initialize with some sample imported cases
        const sampleCases = [
            {
                cnr: 'MANUAL001',
                caseNumber: '2024/MAN/001',
                title: 'Sample Manual Case 1 vs Respondent 1',
                court: 'DISTRICT COURT',
                courtLocation: 'Sample District',
                caseType: 'CIVIL',
                caseStatus: 'PENDING',
                filingDate: new Date('2024-01-15'),
                nextHearingDate: new Date('2024-02-15'),
                parties: [
                    { name: 'Manual Plaintiff 1', type: 'PLAINTIFF' },
                    { name: 'Manual Defendant 1', type: 'DEFENDANT' }
                ],
                advocates: [
                    { name: 'Adv. Manual Advocate 1', barNumber: 'MAN001' }
                ],
                judges: [
                    { name: 'Hon. Manual Judge 1', designation: 'District Judge', court: 'DISTRICT COURT' }
                ]
            },
            {
                cnr: 'MANUAL002',
                caseNumber: '2024/MAN/002',
                title: 'Sample Manual Case 2 vs Respondent 2',
                court: 'HIGH COURT',
                courtLocation: 'Sample State',
                caseType: 'CRIMINAL',
                caseStatus: 'PENDING',
                filingDate: new Date('2024-01-20'),
                nextHearingDate: new Date('2024-02-20'),
                parties: [
                    { name: 'Manual Petitioner 2', type: 'PETITIONER' },
                    { name: 'Manual Respondent 2', type: 'RESPONDENT' }
                ],
                advocates: [
                    { name: 'Adv. Manual Advocate 2', barNumber: 'MAN002' }
                ],
                judges: [
                    { name: 'Hon. Manual Judge 2', designation: 'Justice', court: 'HIGH COURT' }
                ]
            }
        ];
        // Add sample cases to imported data
        sampleCases.forEach(caseData => {
            this.importedCases.set(caseData.cnr, caseData);
        });
        // Add sample orders
        const sampleOrders = [
            {
                id: 'order-manual-001',
                caseId: 'MANUAL001',
                cnr: 'MANUAL001',
                orderDate: new Date('2024-01-20'),
                orderType: 'Interim Order',
                orderText: 'This is a sample interim order for manual case 1.',
                judge: { name: 'Hon. Manual Judge 1', designation: 'District Judge', court: 'DISTRICT COURT' },
                orderNumber: 'ORD-MAN-001',
                isDownloadable: false
            }
        ];
        this.importedOrders.set('MANUAL001', sampleOrders);
    }
    generateCaseNumber(cnr) {
        // Generate a case number based on CNR
        // Extract year and create a formatted case number
        const year = new Date().getFullYear();
        const cnrSuffix = cnr.substring(cnr.length - 4) || '0001';
        return `${year}/MANUAL/${cnrSuffix}`;
    }
}
exports.ManualImportProvider = ManualImportProvider;
