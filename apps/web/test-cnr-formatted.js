const axios = require('axios');

async function searchFormattedCNR() {
  try {
    console.log('🧪 Searching for Formatted CNR Number');
    console.log('📋 Original CNR: KAUP210030062022');
    
    // The original CNR is 18 characters: KAUP210030062022
    // We need to extract the 16-digit numeric part
    const originalCNR = 'KAUP210030062022';
    console.log(`📏 Original CNR length: ${originalCNR.length} characters`);
    
    // Try different approaches to get 16 digits
    const cnrVariations = [
      '2100300620220000', // Extract numeric part and pad to 16 digits
      '210030062022',     // Just the numeric part (12 digits)
      '21003006202200',   // Pad with zeros to 14 digits
      '210030062022000',  // Pad with zeros to 15 digits
      '0021003006202200', // Add leading zeros
      '0030062022000000', // Remove first 2 digits and pad
      '0300620220000000', // Remove first 4 digits and pad
      '0062022000000000', // Remove first 6 digits and pad
      '6202200000000000', // Remove first 8 digits and pad
      '2022000000000000', // Remove first 10 digits and pad
      '2200000000000000', // Remove first 12 digits and pad
    ];
    
    console.log('\n📋 Test 1: Try Different 16-Digit CNR Formats');
    
    for (const cnr of cnrVariations) {
      try {
        console.log(`\n🔍 Trying CNR: ${cnr} (${cnr.length} digits)`);
        
        const response = await axios.post('http://localhost:3000/api/court/search', {
          cnr: cnr
        }, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 15000
        });
        
        if (response.data.ok && response.data.data) {
          console.log(`✅ FOUND CNR: ${cnr}`);
          const caseData = response.data.data;
          console.log('\n📄 Case Details:');
          console.log(`   CNR: ${caseData.cnr || 'N/A'}`);
          console.log(`   Case Number: ${caseData.caseNumber || 'N/A'}`);
          console.log(`   Case Type: ${caseData.caseType || 'N/A'}`);
          console.log(`   Court: ${caseData.courtName || 'N/A'}`);
          console.log(`   Judge: ${caseData.judge || 'N/A'}`);
          console.log(`   Parties: ${caseData.parties || 'N/A'}`);
          console.log(`   Stage: ${caseData.stage || 'N/A'}`);
          console.log(`   Next Hearing: ${caseData.nextHearingDate || 'N/A'}`);
          return; // Found results, stop searching
        } else {
          console.log(`❌ No results for CNR: ${cnr}`);
        }
      } catch (error) {
        console.log(`⚠️ Error searching CNR ${cnr}: ${error.response?.status || error.message}`);
        if (error.response?.data && error.response.data.error) {
          console.log(`   Error: ${error.response.data.error}`);
        }
      }
    }
    
    // Test 2: Try using the original CNR as case number
    console.log('\n📋 Test 2: Use Original CNR as Case Number');
    try {
      const response = await axios.post('http://localhost:3000/api/court/search', {
        mode: 'caseNumber',
        caseType: 'CIVIL',
        caseNumber: originalCNR,
        year: 2021,
        stateCode: 'KAR'
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });
      
      if (response.data.ok && response.data.count > 0) {
        console.log(`✅ FOUND case using original CNR as case number!`);
        console.log('📋 Cases Found:', response.data.count);
        response.data.results.forEach((case_, index) => {
          console.log(`\n📄 Case ${index + 1}:`);
          console.log(`   CNR: ${case_.cnr || 'N/A'}`);
          console.log(`   Case Number: ${case_.caseNumber || 'N/A'}`);
          console.log(`   Court: ${case_.courtName || 'N/A'}`);
        });
        return;
      } else {
        console.log('❌ No results using original CNR as case number');
      }
    } catch (error) {
      console.log('⚠️ Error using original CNR as case number:', error.response?.status || error.message);
    }
    
    // Test 3: Try extracting parts of the CNR
    console.log('\n📋 Test 3: Extract Parts of CNR');
    const parts = [
      '003006',      // Just the case number part
      '0030062022',  // Case number + year
      '30062022',    // Alternative format
      '62022',       // Last part
    ];
    
    for (const part of parts) {
      try {
        console.log(`\n🔍 Trying case number part: ${part}`);
        
        const response = await axios.post('http://localhost:3000/api/court/search', {
          mode: 'caseNumber',
          caseType: 'CIVIL',
          caseNumber: part,
          year: 2021,
          stateCode: 'KAR'
        }, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 15000
        });
        
        if (response.data.ok && response.data.count > 0) {
          console.log(`✅ FOUND case with part: ${part}`);
          console.log('📋 Cases Found:', response.data.count);
          response.data.results.forEach((case_, index) => {
            console.log(`   📄 Case ${index + 1}: ${case_.caseNumber} - ${case_.courtName}`);
          });
          return; // Found results, stop searching
        } else {
          console.log(`❌ No results for part: ${part}`);
        }
      } catch (error) {
        console.log(`⚠️ Error searching part ${part}: ${error.response?.status || error.message}`);
      }
    }
    
    console.log('\n🎉 Formatted CNR search completed!');
    console.log('💡 Summary:');
    console.log('   - Original CNR: KAUP210030062022 (18 characters)');
    console.log('   - API Expects: 16-digit numeric CNR');
    console.log('   - Issue: CNR format mismatch');
    console.log('   - Status: CNR not found in available databases');
    
    console.log('\n🔍 CNR Analysis:');
    console.log('   - KA = Karnataka state');
    console.log('   - UP = Udupi district');
    console.log('   - 21 = Year 2021');
    console.log('   - 003006 = Case number');
    console.log('   - 2022 = Additional year reference');
    
    console.log('\n💡 Recommendations:');
    console.log('   1. Verify the correct 16-digit CNR format with the court');
    console.log('   2. Check if this is a case number rather than a CNR');
    console.log('   3. Contact the court directly for the correct CNR');
    console.log('   4. The case might be from 2021 and not yet indexed');
    
  } catch (error) {
    console.error('❌ Formatted CNR Search Failed:', error.message);
  }
}

searchFormattedCNR();





