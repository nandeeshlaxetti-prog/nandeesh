const axios = require('axios');

async function testWithAPIKey() {
  try {
    console.log('🧪 Testing Advocate Search with Your API Key...');
    
    // Test 1: Advocate Name Search
    console.log('\n📋 Test 1: Advocate Name Search');
    try {
      const advocateResponse = await axios.post('http://localhost:3000/api/ecourts/court-api', {
        action: 'search',
        mode: 'advocateName',
        advocateName: 'John Doe',
        stateCode: 'KAR'
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
      
      console.log('✅ Advocate Search Response:', advocateResponse.status);
      console.log('📊 Advocate Search Data:', JSON.stringify(advocateResponse.data, null, 2));
      
      if (advocateResponse.status === 200) {
        console.log('🎉 SUCCESS: Advocate search is working with your API key!');
      }
    } catch (error) {
      console.log('⚠️ Advocate Search Test:', error.response?.status || error.message);
      if (error.response?.data) {
        console.log('📊 Error Data:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
    // Test 2: CNR Search
    console.log('\n📋 Test 2: CNR Search');
    try {
      const cnrResponse = await axios.post('http://localhost:3000/api/ecourts/court-api', {
        action: 'cnr',
        cnr: '1234567890123456'
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
      
      console.log('✅ CNR Search Response:', cnrResponse.status);
      console.log('📊 CNR Search Data:', JSON.stringify(cnrResponse.data, null, 2));
    } catch (error) {
      console.log('⚠️ CNR Search Test:', error.response?.status || error.message);
      if (error.response?.data) {
        console.log('📊 Error Data:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
    // Test 3: Party Name Search
    console.log('\n📋 Test 3: Party Name Search');
    try {
      const partyResponse = await axios.post('http://localhost:3000/api/ecourts/court-api', {
        action: 'search',
        mode: 'partyName',
        partyName: 'Test Party',
        stateCode: 'KAR'
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
      
      console.log('✅ Party Search Response:', partyResponse.status);
      console.log('📊 Party Search Data:', JSON.stringify(partyResponse.data, null, 2));
    } catch (error) {
      console.log('⚠️ Party Search Test:', error.response?.status || error.message);
      if (error.response?.data) {
        console.log('📊 Error Data:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
    // Test 4: Phoenix States Lookup
    console.log('\n📋 Test 4: Phoenix States Lookup');
    try {
      const statesResponse = await axios.get('http://localhost:3000/api/ecourts/court-api?action=phoenix&type=states', {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
      
      console.log('✅ States Response:', statesResponse.status);
      console.log('📊 States Data:', JSON.stringify(statesResponse.data, null, 2));
    } catch (error) {
      console.log('⚠️ States Test:', error.response?.status || error.message);
      if (error.response?.data) {
        console.log('📊 Error Data:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
    console.log('\n🎉 All tests completed with your API key!');
    console.log('💡 If you see 404 errors, that means the API is working but no results found for test data');
    console.log('💡 If you see 401 errors, there might be an authentication issue');
    console.log('💡 If you see 500 errors, there might be a server or endpoint issue');
    
  } catch (error) {
    console.error('❌ Test Failed:', error.message);
  }
}

testWithAPIKey();






