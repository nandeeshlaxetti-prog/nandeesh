"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourtProviderFactory = void 0;
// Court Provider Interface and DTOs
const district_high_court_provider_1 = require("./providers/district-high-court-provider");
const judgments_provider_1 = require("./providers/judgments-provider");
const manual_import_provider_1 = require("./providers/manual-import-provider");
const third_party_provider_1 = require("./providers/third-party-provider");
/**
 * Provider Factory
 * Creates provider instances based on type
 */
class CourtProviderFactory {
    static createProvider(type, config) {
        switch (type) {
            case 'DISTRICT_HIGH_COURT':
                return new district_high_court_provider_1.DistrictHighCourtProvider(config);
            case 'JUDGMENTS':
                return new judgments_provider_1.JudgmentsProvider(config);
            case 'MANUAL_IMPORT':
                return new manual_import_provider_1.ManualImportProvider(config);
            case 'THIRD_PARTY':
                return new third_party_provider_1.ThirdPartyProvider(config);
            default:
                throw new Error(`Unknown provider type: ${type}`);
        }
    }
    static getAvailableProviders() {
        return ['DISTRICT_HIGH_COURT', 'JUDGMENTS', 'MANUAL_IMPORT', 'THIRD_PARTY'];
    }
}
exports.CourtProviderFactory = CourtProviderFactory;
