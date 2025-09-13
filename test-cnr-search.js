const axios = require('axios');

async function testCNRSearch() {
  const cnr = 'KABR020009202025';
  const apiKey = 'klc_2cef7fc42178c58211cd8b8b1d23c3206c1e778f13ed566237803d8897a9b104';
  
  console.log('🔍 Testing CNR Search for:', cnr);
  
  try {
    const response = await axios.post('https://court-api.kleopatra.io/api/core/live/district-court/case', {
      cnr: cnr
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    console.log('✅ API Response Status:', response.status);
    console.log('📊 Response Data:', JSON.stringify(response.data, null, 2));
    
    if (response.data && Object.keys(response.data).length > 0) {
      console.log('🎉 REAL-TIME DATA SUCCESS!');
      console.log('📋 Case Title:', response.data.title);
      console.log('🏛️ Court:', response.data.status?.courtNumberAndJudge);
      console.log('📅 Next Hearing:', response.data.status?.nextHearingDate);
    } else {
      console.log('⚠️ Empty response - using mock data');
    }
    
  } catch (error) {
    console.log('❌ API Error:', error.response?.status, error.response?.statusText);
    console.log('📝 Error Details:', error.response?.data);
    console.log('🔄 Falling back to mock data');
  }
}

testCNRSearch();

