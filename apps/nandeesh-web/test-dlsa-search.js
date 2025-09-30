const axios = require('axios');

async function searchDLSA() {
  try {
    console.log('🧪 Searching for DLSA (District Legal Services Authority)');
    console.log('🔍 Search Term: DLSA');
    
    // Test 1: Party Name Search for DLSA
    console.log('\n📋 Test 1: Party Name Search for DLSA');
    try {
      const response = await axios.post('http://localhost:3000/api/court/search', {
        mode: 'partyName',
        partyName: 'DLSA',
        stateCode: 'KAR'
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
      
      console.log('✅ Party Name Search Status:', response.status);
      console.log('📊 Response:', JSON.stringify(response.data, null, 2));
      
      if (response.data.ok && response.data.count > 0) {
        console.log('🎉 FOUND DLSA cases via party name search!');
        console.log('📋 Cases Found:', response.data.count);
        response.data.results.forEach((case_, index) => {
          console.log(`\n📄 Case ${index + 1}:`);
          console.log(`   CNR: ${case_.cnr || 'N/A'}`);
          console.log(`   Case Number: ${case_.caseNumber || 'N/A'}`);
          console.log(`   Court: ${case_.courtName || 'N/A'}`);
          console.log(`   Parties: ${case_.parties || 'N/A'}`);
          console.log(`   Stage: ${case_.stage || 'N/A'}`);
        });
        return;
      } else {
        console.log('❌ No DLSA cases found via party name search');
      }
    } catch (error) {
      console.log('⚠️ Party Name Search:', error.response?.status || error.message);
      if (error.response?.data) {
        console.log('📊 Error Data:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
    // Test 2: Try with different states
    console.log('\n📋 Test 2: DLSA Party Name Search in Different States');
    const states = ['KAR', 'MH', 'TN', 'DL', 'UP', 'WB', 'GJ', 'RJ', 'MP', 'BR'];
    
    for (const state of states) {
      try {
        console.log(`\n🔍 Searching DLSA in state: ${state}`);
        
        const response = await axios.post('http://localhost:3000/api/court/search', {
          mode: 'partyName',
          partyName: 'DLSA',
          stateCode: state
        }, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 15000
        });
        
        if (response.data.ok && response.data.count > 0) {
          console.log(`✅ FOUND ${response.data.count} DLSA case(s) in ${state}!`);
          response.data.results.forEach((case_, index) => {
            console.log(`   📄 Case ${index + 1}: ${case_.caseNumber} - ${case_.courtName}`);
          });
          return; // Found results, stop searching
        } else {
          console.log(`❌ No DLSA cases found in ${state}`);
        }
      } catch (error) {
        console.log(`⚠️ Error searching DLSA in ${state}: ${error.response?.status || error.message}`);
      }
    }
    
    // Test 3: Try Advocate Name Search for DLSA
    console.log('\n📋 Test 3: Advocate Name Search for DLSA');
    try {
      const response = await axios.post('http://localhost:3000/api/court/search', {
        mode: 'advocateName',
        advocateName: 'DLSA',
        stateCode: 'KAR'
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
      
      console.log('✅ Advocate Name Search Status:', response.status);
      console.log('📊 Response:', JSON.stringify(response.data, null, 2));
      
      if (response.data.ok && response.data.count > 0) {
        console.log('🎉 FOUND DLSA cases via advocate name search!');
        console.log('📋 Cases Found:', response.data.count);
      } else {
        console.log('❌ No DLSA cases found via advocate name search');
      }
    } catch (error) {
      console.log('⚠️ Advocate Name Search:', error.response?.status || error.message);
    }
    
    // Test 4: Try Case Number Search with DLSA
    console.log('\n📋 Test 4: Case Number Search with DLSA');
    try {
      const response = await axios.post('http://localhost:3000/api/court/search', {
        mode: 'caseNumber',
        caseType: 'CIVIL',
        caseNumber: 'DLSA',
        year: 2024,
        stateCode: 'KAR'
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
      
      console.log('✅ Case Number Search Status:', response.status);
      console.log('📊 Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log('⚠️ Case Number Search:', error.response?.status || error.message);
    }
    
    // Test 5: Try the original ecourts advanced search
    console.log('\n📋 Test 5: Original eCourts Advanced Search for DLSA');
    try {
      const response = await axios.get('http://localhost:3000/api/ecourts/advanced-search', {
        params: {
          searchType: 'partyName',
          partyName: 'DLSA',
          state: 'KAR',
          courtType: 'district'
        },
        timeout: 30000
      });
      
      console.log('✅ eCourts Advanced Search Status:', response.status);
      console.log('📊 Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log('⚠️ eCourts Advanced Search:', error.response?.status || error.message);
    }
    
    // Test 6: Try court-api route
    console.log('\n📋 Test 6: Court API Route for DLSA');
    try {
      const response = await axios.post('http://localhost:3000/api/ecourts/court-api', {
        action: 'search',
        mode: 'partyName',
        partyName: 'DLSA',
        stateCode: 'KAR'
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
      
      console.log('✅ Court API Status:', response.status);
      console.log('📊 Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log('⚠️ Court API:', error.response?.status || error.message);
    }
    
    console.log('\n🎉 DLSA search completed!');
    console.log('💡 Summary:');
    console.log('   - Search Term: DLSA (District Legal Services Authority)');
    console.log('   - Search Modes: Party Name, Advocate Name, Case Number');
    console.log('   - States Tested: Multiple states including KAR, MH, TN, DL, UP, etc.');
    console.log('   - API Endpoints: Multiple endpoints tested');
    
  } catch (error) {
    console.error('❌ DLSA Search Failed:', error.message);
  }
}

searchDLSA();






