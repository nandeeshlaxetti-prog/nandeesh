const axios = require('axios');

async function testCollectorAPI() {
  try {
    console.log('🧪 Testing Official Collector API Integration...');
    
    // Test 1: Collector Authentication
    console.log('\n📋 Test 1: Collector Authentication');
    try {
      const authResponse = await axios.post('http://localhost:3000/api/ecourts/court-api', {
        action: 'collector',
        collectorAction: 'auth'
      });
      console.log('✅ Auth Response:', authResponse.status);
      console.log('📊 Auth Data:', JSON.stringify(authResponse.data, null, 2));
    } catch (error) {
      console.log('⚠️ Auth Test:', error.response?.status || error.message);
    }
    
    // Test 2: Instance Status
    console.log('\n📋 Test 2: Instance Status');
    try {
      const instanceResponse = await axios.post('http://localhost:3000/api/ecourts/court-api', {
        action: 'collector',
        collectorAction: 'instances'
      });
      console.log('✅ Instance Response:', instanceResponse.status);
      console.log('📊 Instance Data:', JSON.stringify(instanceResponse.data, null, 2));
    } catch (error) {
      console.log('⚠️ Instance Test:', error.response?.status || error.message);
    }
    
    // Test 3: Collector CNR Search
    console.log('\n📋 Test 3: Collector CNR Search');
    try {
      const cnrResponse = await axios.post('http://localhost:3000/api/ecourts/court-api', {
        action: 'collector',
        collectorAction: 'cnr',
        cnr: '1234567890123456'
      });
      console.log('✅ CNR Response:', cnrResponse.status);
      console.log('📊 CNR Data:', JSON.stringify(cnrResponse.data, null, 2));
    } catch (error) {
      console.log('⚠️ CNR Test:', error.response?.status || error.message);
    }
    
    // Test 4: Collector Advocate Search
    console.log('\n📋 Test 4: Collector Advocate Search');
    try {
      const advocateResponse = await axios.post('http://localhost:3000/api/ecourts/court-api', {
        action: 'collector',
        collectorAction: 'search',
        mode: 'advocateName',
        advocateName: 'Test Advocate',
        stateCode: 'KAR'
      });
      console.log('✅ Advocate Response:', advocateResponse.status);
      console.log('📊 Advocate Data:', JSON.stringify(advocateResponse.data, null, 2));
    } catch (error) {
      console.log('⚠️ Advocate Test:', error.response?.status || error.message);
    }
    
    console.log('\n🎉 Collector API tests completed!');
    console.log('💡 Note: 404/500 errors are expected if endpoints are not available or API key is missing');
    
  } catch (error) {
    console.error('❌ Test Failed:', error.message);
  }
}

testCollectorAPI();





