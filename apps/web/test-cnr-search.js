const axios = require('axios');

async function searchCNR() {
  try {
    console.log('🧪 Searching for CNR Number');
    console.log('📋 CNR: KAUP210030062022');
    
    // Test 1: CNR Search via Simplified Court Search API
    console.log('\n📋 Test 1: CNR Search via Simplified Court Search API');
    try {
      const response = await axios.post('http://localhost:3000/api/court/search', {
        cnr: 'KAUP210030062022'
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
      
      console.log('✅ Simplified API Status:', response.status);
      console.log('📊 Response:', JSON.stringify(response.data, null, 2));
      
      if (response.data.ok && response.data.data) {
        console.log('🎉 FOUND CNR via Simplified API!');
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
        console.log(`   Filing Date: ${caseData.filingDate || 'N/A'}`);
        console.log(`   Status: ${caseData.status || 'N/A'}`);
        return;
      } else {
        console.log('❌ CNR not found via Simplified API');
      }
    } catch (error) {
      console.log('⚠️ Simplified API:', error.response?.status || error.message);
      if (error.response?.data) {
        console.log('📊 Error Data:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
    // Test 2: CNR Search via Original eCourts API
    console.log('\n📋 Test 2: CNR Search via Original eCourts API');
    try {
      const response = await axios.get('http://localhost:3000/api/ecourts/cnr', {
        params: {
          cnr: 'KAUP210030062022'
        },
        timeout: 30000
      });
      
      console.log('✅ eCourts API Status:', response.status);
      console.log('📊 Response:', JSON.stringify(response.data, null, 2));
      
      if (response.data.success && response.data.data) {
        console.log('🎉 FOUND CNR via eCourts API!');
        const caseData = response.data.data;
        console.log('\n📄 Case Details:');
        console.log(`   CNR: ${caseData.cnr || 'N/A'}`);
        console.log(`   Title: ${caseData.title || 'N/A'}`);
        console.log(`   Case Number: ${caseData.caseNumber || 'N/A'}`);
        console.log(`   Court: ${caseData.courtName || 'N/A'}`);
        console.log(`   Judge: ${caseData.judge || 'N/A'}`);
        console.log(`   Parties: ${caseData.parties || 'N/A'}`);
        console.log(`   Stage: ${caseData.stage || 'N/A'}`);
        console.log(`   Next Hearing: ${caseData.nextHearingDate || 'N/A'}`);
        return;
      } else {
        console.log('❌ CNR not found via eCourts API');
      }
    } catch (error) {
      console.log('⚠️ eCourts API:', error.response?.status || error.message);
      if (error.response?.data) {
        console.log('📊 Error Data:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
    // Test 3: CNR Search via Court API Route
    console.log('\n📋 Test 3: CNR Search via Court API Route');
    try {
      const response = await axios.post('http://localhost:3000/api/ecourts/court-api', {
        action: 'cnr',
        cnr: 'KAUP210030062022'
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
      
      console.log('✅ Court API Status:', response.status);
      console.log('📊 Response:', JSON.stringify(response.data, null, 2));
      
      if (response.data.success && response.data.data) {
        console.log('🎉 FOUND CNR via Court API!');
        const caseData = response.data.data;
        console.log('\n📄 Case Details:');
        console.log(`   CNR: ${caseData.cnr || 'N/A'}`);
        console.log(`   Case Number: ${caseData.caseNumber || 'N/A'}`);
        console.log(`   Court: ${caseData.courtName || 'N/A'}`);
        console.log(`   Parties: ${caseData.parties || 'N/A'}`);
        return;
      } else {
        console.log('❌ CNR not found via Court API');
      }
    } catch (error) {
      console.log('⚠️ Court API:', error.response?.status || error.message);
      if (error.response?.data) {
        console.log('📊 Error Data:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
    // Test 4: Try advanced search with CNR as case number
    console.log('\n📋 Test 4: Advanced Search with CNR as Case Number');
    try {
      const response = await axios.post('http://localhost:3000/api/court/search', {
        mode: 'caseNumber',
        caseType: 'CIVIL',
        caseNumber: 'KAUP210030062022',
        year: 2022,
        stateCode: 'KAR'
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
      
      console.log('✅ Advanced Search Status:', response.status);
      console.log('📊 Response:', JSON.stringify(response.data, null, 2));
      
      if (response.data.ok && response.data.count > 0) {
        console.log('🎉 FOUND case via Advanced Search!');
        console.log('📋 Cases Found:', response.data.count);
        response.data.results.forEach((case_, index) => {
          console.log(`\n📄 Case ${index + 1}:`);
          console.log(`   CNR: ${case_.cnr || 'N/A'}`);
          console.log(`   Case Number: ${case_.caseNumber || 'N/A'}`);
          console.log(`   Court: ${case_.courtName || 'N/A'}`);
        });
        return;
      } else {
        console.log('❌ No cases found via Advanced Search');
      }
    } catch (error) {
      console.log('⚠️ Advanced Search:', error.response?.status || error.message);
      if (error.response?.data) {
        console.log('📊 Error Data:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
    // Test 5: Try different case types with the CNR
    console.log('\n📋 Test 5: Try Different Case Types');
    const caseTypes = ['CIVIL', 'CRIMINAL', 'FAMILY', 'CONSUMER', 'NCLT', 'CAT'];
    
    for (const caseType of caseTypes) {
      try {
        console.log(`\n🔍 Trying case type: ${caseType}`);
        
        const response = await axios.post('http://localhost:3000/api/court/search', {
          mode: 'caseNumber',
          caseType: caseType,
          caseNumber: 'KAUP210030062022',
          year: 2022,
          stateCode: 'KAR'
        }, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 15000
        });
        
        if (response.data.ok && response.data.count > 0) {
          console.log(`✅ FOUND case with type: ${caseType}`);
          console.log('📋 Cases Found:', response.data.count);
          response.data.results.forEach((case_, index) => {
            console.log(`   📄 Case ${index + 1}: ${case_.caseNumber} - ${case_.courtName}`);
          });
          return; // Found results, stop searching
        } else {
          console.log(`❌ No cases found for type: ${caseType}`);
        }
      } catch (error) {
        console.log(`⚠️ Error searching case type ${caseType}: ${error.response?.status || error.message}`);
      }
    }
    
    console.log('\n🎉 CNR search completed!');
    console.log('💡 Summary:');
    console.log('   - CNR: KAUP210030062022');
    console.log('   - Search Methods: Direct CNR search, Advanced search, Multiple case types');
    console.log('   - API Endpoints: Multiple endpoints tested');
    console.log('   - Status: CNR not found in available databases');
    
    console.log('\n🔍 Analysis of CNR:');
    console.log('   - KA = Karnataka state code');
    console.log('   - UP = Could be Udupi or Uttar Pradesh district');
    console.log('   - 21 = Year 2021');
    console.log('   - 003006 = Case number');
    console.log('   - 2022 = Additional year reference');
    
    console.log('\n💡 Possible reasons for not finding the CNR:');
    console.log('   1. CNR might be from a court not covered by the API');
    console.log('   2. Case might be from 2021 but not yet indexed');
    console.log('   3. CNR format might be different in the system');
    console.log('   4. Case might be disposed or archived');
    
  } catch (error) {
    console.error('❌ CNR Search Failed:', error.message);
  }
}

searchCNR();


