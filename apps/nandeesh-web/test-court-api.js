// Test file to demonstrate court API usage
// This can be run with: node test-court-api.js

const { runCourtSearch } = require('./lib/court-client.ts');

async function testCourtAPI() {
  console.log('Testing Court API...\n');

  // Test 1: CNR Search
  console.log('1. Testing CNR Search:');
  try {
    const cnrResult = await runCourtSearch({ cnr: "1234567890123456" });
    console.log('CNR Result:', JSON.stringify(cnrResult, null, 2));
  } catch (error) {
    console.log('CNR Error:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: Advanced Search - Party Name
  console.log('2. Testing Advanced Search (Party Name):');
  try {
    const partyResult = await runCourtSearch({
      mode: "partyName",
      partyName: "John Doe",
      stateCode: "KA", // Karnataka
      districtCode: "BLR" // Bangalore
    });
    console.log('Party Search Result:', JSON.stringify(partyResult, null, 2));
  } catch (error) {
    console.log('Party Search Error:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 3: Advanced Search - Case Number
  console.log('3. Testing Advanced Search (Case Number):');
  try {
    const caseResult = await runCourtSearch({
      mode: "caseNumber",
      caseType: "CRL",
      caseNumber: "123",
      year: 2023,
      stateCode: "KA",
      districtCode: "BLR"
    });
    console.log('Case Number Search Result:', JSON.stringify(caseResult, null, 2));
  } catch (error) {
    console.log('Case Number Search Error:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 4: Advanced Search - Advocate Name
  console.log('4. Testing Advanced Search (Advocate Name):');
  try {
    const advocateResult = await runCourtSearch({
      mode: "advocateName",
      advocateName: "Smith",
      stateCode: "KA"
    });
    console.log('Advocate Search Result:', JSON.stringify(advocateResult, null, 2));
  } catch (error) {
    console.log('Advocate Search Error:', error.message);
  }
}

// Example usage in a React component:
console.log(`
Example usage in your Advanced Search form:

import { runCourtSearch } from '@/lib/court-client';

// In your form submission handler:
const handleSearch = async (formData) => {
  const payload = {
    mode: "partyName",
    partyName: formData.get("partyName"),
    stateCode: formData.get("stateCode") || undefined,
    districtCode: formData.get("districtCode") || undefined,
  };
  
  try {
    const { results } = await runCourtSearch(payload);
    // Render results in your table
    console.log('Search results:', results);
  } catch (error) {
    console.error('Search failed:', error.message);
  }
};

// Available search modes:
// - "caseNumber": requires caseType, caseNumber, year + court scope
// - "partyName": requires partyName + optional court scope
// - "advocateName": requires advocateName + optional court scope  
// - "fir": requires firNumber or policeStation + optional court scope
// - "filingNumber": requires filingNumber + optional court scope

// Court scope options (optional):
// - stateCode: e.g., "KA" for Karnataka
// - districtCode: e.g., "BLR" for Bangalore
// - courtComplexId: specific court complex ID
// - courtId: specific court ID
// - benchLevel: "DISTRICT" | "HIGH_COURT" | "TRIBUNAL" | "SUPREME"
`);

// Uncomment to run tests (requires Next.js server to be running):
// testCourtAPI();