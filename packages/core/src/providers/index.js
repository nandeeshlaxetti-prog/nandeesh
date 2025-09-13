"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KarnatakaHighCourtProvider = exports.ThirdPartyProvider = exports.ManualImportProvider = exports.JudgmentsProvider = exports.DistrictHighCourtProvider = void 0;
// Export all court providers
var district_high_court_provider_1 = require("./providers/district-high-court-provider");
Object.defineProperty(exports, "DistrictHighCourtProvider", { enumerable: true, get: function () { return district_high_court_provider_1.DistrictHighCourtProvider; } });
var judgments_provider_1 = require("./providers/judgments-provider");
Object.defineProperty(exports, "JudgmentsProvider", { enumerable: true, get: function () { return judgments_provider_1.JudgmentsProvider; } });
var manual_import_provider_1 = require("./providers/manual-import-provider");
Object.defineProperty(exports, "ManualImportProvider", { enumerable: true, get: function () { return manual_import_provider_1.ManualImportProvider; } });
var third_party_provider_1 = require("./providers/third-party-provider");
Object.defineProperty(exports, "ThirdPartyProvider", { enumerable: true, get: function () { return third_party_provider_1.ThirdPartyProvider; } });
var karnataka_high_court_provider_1 = require("./providers/karnataka-high-court-provider");
Object.defineProperty(exports, "KarnatakaHighCourtProvider", { enumerable: true, get: function () { return karnataka_high_court_provider_1.KarnatakaHighCourtProvider; } });
// Export court provider interface and types
__exportStar(require("./court-provider"), exports);
