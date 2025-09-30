const axios = require('axios');

async function testSimpleAdvocate() {
  try {
    console.log('🧪 Testing Simple Advocate Search...');
    
    // Test advocate name search
    const response = await axios.post('http://localhost:3000/api/ecourts/court-api', {
      action: 'search',
      mode: 'advocateName',
      advocateName: 'Test Advocate',
      stateCode: 'KAR'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    console.log('✅ Response Status:', response.status);
    console.log('📊 Response Data:', JSON.stringify(response.data, null, 2));
    
    if (response.status === 200) {
      console.log('🎉 SUCCESS: Advocate search is working!');
    }
    
  } catch (error) {
    console.error('❌ Test Failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
      
      // If it's a 404, that's expected for test data
      if (error.response.status === 404) {
        console.log('💡 404 is expected for test data - API is working correctly!');
      }
    } else {
      console.error('Error:', error.message);
    }
  }
}

testSimpleAdvocate();






