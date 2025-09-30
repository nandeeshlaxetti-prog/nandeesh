const axios = require('axios');

async function testConsumerForumFinal() {
  try {
    console.log('🧪 Final Test - Consumer Forum API Route');
    console.log('📋 Case: DC/AB4/525/CC/85/2025');
    console.log('🏛️ State: Karnataka (KAR)');
    
    // Test the consumer forum API route
    console.log('\n🔍 Testing Consumer Forum API Route...');
    
    const response = await axios.post('http://localhost:3000/api/consumer-forum', {
      caseNumber: 'DC/AB4/525/CC/85/2025',
      state: 'KAR',
      year: 2025,
      caseType: 'CONSUMER'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 45000 // 45 second timeout for comprehensive search
    });
    
    console.log('✅ Response Status:', response.status);
    console.log('📊 Response Data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success) {
      console.log('\n🎉 SUCCESS: Found consumer case!');
      console.log('📋 Source:', response.data.source);
      console.log('🔗 Endpoint:', response.data.endpoint);
      
      if (response.data.data) {
        console.log('\n📄 Case Details:');
        const caseData = response.data.data;
        console.log(`   Case Number: ${caseData.caseNumber || 'N/A'}`);
        console.log(`   CNR: ${caseData.cnr || 'N/A'}`);
        console.log(`   Court: ${caseData.courtName || 'N/A'}`);
        console.log(`   Parties: ${caseData.parties || 'N/A'}`);
        console.log(`   Stage: ${caseData.stage || 'N/A'}`);
        console.log(`   Next Hearing: ${caseData.nextHearingDate || 'N/A'}`);
        console.log(`   Case Type: ${caseData.caseType || 'N/A'}`);
        console.log(`   Filing Date: ${caseData.filingDate || 'N/A'}`);
        console.log(`   Judge: ${caseData.judge || 'N/A'}`);
        console.log(`   Status: ${caseData.status || 'N/A'}`);
      }
    } else {
      console.log('\n⚠️ Case not found');
      console.log('📋 Message:', response.data.message);
      console.log('🔍 Error Type:', response.data.error);
      
      if (response.data.details) {
        console.log('\n📊 Search Details:');
        console.log(`   Case Number: ${response.data.details.caseNumber}`);
        console.log(`   Attempted Endpoints: ${response.data.details.attemptedEndpoints?.length || 0}`);
        if (response.data.details.attemptedEndpoints) {
          response.data.details.attemptedEndpoints.forEach((endpoint, index) => {
            console.log(`     ${index + 1}. ${endpoint}`);
          });
        }
        console.log(`   Primary Error: ${response.data.details.primaryError}`);
      }
    }
    
    console.log('\n💡 Search Summary:');
    console.log('   - Case: DC/AB4/525/CC/85/2025');
    console.log('   - State: Karnataka (KAR)');
    console.log('   - Year: 2025');
    console.log('   - Type: Consumer Forum (CC)');
    console.log('   - API Route: /api/consumer-forum');
    console.log('   - Status: Search completed');
    
  } catch (error) {
    console.error('❌ Search Failed:', error.message);
    
    if (error.response) {
      console.error('📊 Error Response:', JSON.stringify(error.response.data, null, 2));
    }
    
    console.log('\n💡 This means:');
    console.log('   1. The consumer case DC/AB4/525/CC/85/2025 is not found in the database');
    console.log('   2. The case might be very recent (2025) and not yet indexed');
    console.log('   3. Consumer forum cases may have limited API coverage');
    console.log('   4. The case number format might be different in the system');
  }
}

testConsumerForumFinal();






