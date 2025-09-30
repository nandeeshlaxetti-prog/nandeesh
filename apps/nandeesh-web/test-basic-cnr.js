const axios = require('axios');

async function basicCNRSearch() {
  try {
    console.log('🧪 Basic CNR Search');
    console.log('📋 CNR: KABR020009202025');
    
    const cnr = 'KABR020009202025';
    console.log(`📏 CNR length: ${cnr.length} characters`);
    
    // Test 1: Basic CNR Search via Simplified Court Search API
    console.log('\n📋 Test 1: Basic CNR Search');
    try {
      const response = await axios.post('http://localhost:3000/api/court/search', {
        cnr: cnr
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
      
      console.log('✅ API Status:', response.status);
      console.log('📊 Response:', JSON.stringify(response.data, null, 2));
      
      if (response.data.ok && response.data.data) {
        console.log('🎉 CNR FOUND!');
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
        console.log('❌ CNR not found');
      }
    } catch (error) {
      console.log('⚠️ API Error:', error.response?.status || error.message);
      if (error.response?.data) {
        console.log('📊 Error Details:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
    console.log('\n🎉 Basic CNR search completed!');
    console.log('💡 Summary:');
    console.log(`   - CNR: ${cnr}`);
    console.log(`   - Length: ${cnr.length} characters`);
    console.log(`   - API Status: ${error?.response?.status || 'Unknown'}`);
    
  } catch (error) {
    console.error('❌ Basic CNR Search Failed:', error.message);
  }
}

basicCNRSearch();






