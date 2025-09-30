const axios = require('axios');

async function testRealAdvocate() {
  try {
    console.log('🧪 Testing with Real Advocate Number 2271...');
    
    // Test with the real advocate number you mentioned
    const response = await axios.post('http://localhost:3000/api/ecourts/advocate', {
      searchType: 'number',
      courtType: 'district',
      advocateNumber: '2271',
      state: 'KAR',
      year: '2021',
      complex: 'bangalore'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    console.log('✅ Response Status:', response.status);
    console.log('📊 Response Data:', JSON.stringify(response.data, null, 2));
    
    if (response.status === 200 && response.data.success) {
      console.log('🎉 SUCCESS: Found cases for advocate number 2271!');
      console.log('📋 Case Title:', response.data.data.title || 'Case found');
    } else if (response.status === 404) {
      console.log('⚠️ No cases found for advocate 2271 - this might mean:');
      console.log('   - Advocate 2271 has no cases in the system');
      console.log('   - The advocate number might be from a different year');
      console.log('   - The advocate might be from a different state');
    }
    
  } catch (error) {
    console.error('❌ Test Failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
}

testRealAdvocate();





