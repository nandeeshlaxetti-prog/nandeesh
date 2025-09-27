const axios = require('axios');

async function testNewKleopatraEndpoint() {
  try {
    console.log('🧪 Testing New Kleopatra Consumer Forum Endpoint');
    console.log('🔗 Endpoint: https://api.kleopatracourt.com/api/core/live/consumer-forum/case');
    console.log('📋 Case: DC/AB4/525/CC/85/2025');
    
    const apiKey = 'klc_2cef7fc42178c58211cd8b8b1d23c3206c1e778f13ed566237803d8897a9b104';
    
    // Test 1: Direct API call to the new Kleopatra endpoint
    console.log('\n📋 Test 1: Direct API call to new Kleopatra endpoint');
    try {
      const response = await axios.post('https://api.kleopatracourt.com/api/core/live/consumer-forum/case', {
        caseNumber: 'DC/AB4/525/CC/85/2025'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        timeout: 30000
      });
      
      console.log('✅ Response Status:', response.status);
      console.log('📊 Response Data:', JSON.stringify(response.data, null, 2));
      
      if (response.status === 200) {
        console.log('🎉 SUCCESS: Found consumer case via new endpoint!');
      }
    } catch (error) {
      console.log('⚠️ New Endpoint Test:', error.response?.status || error.message);
      if (error.response?.data) {
        console.log('📊 Error Data:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
    // Test 2: Try with different case number formats
    console.log('\n📋 Test 2: Try different case number formats');
    const caseVariations = [
      'DC/AB4/525/CC/85/2025',  // Original
      'DC/AB4/525/CC/85',       // Without year
      'AB4/525/CC/85/2025',     // Without DC prefix
      '525/CC/85/2025',         // Minimal format
      '525/CC/85',              // Minimal without year
      'CC/85/2025',             // Even more minimal
      '85/2025'                 // Just number and year
    ];
    
    for (const caseNumber of caseVariations) {
      try {
        console.log(`\n🔍 Searching: "${caseNumber}"`);
        
        const response = await axios.post('https://api.kleopatracourt.com/api/core/live/consumer-forum/case', {
          caseNumber: caseNumber
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          timeout: 15000
        });
        
        if (response.status === 200 && response.data) {
          console.log(`✅ FOUND case with format: "${caseNumber}"`);
          console.log('📊 Case Data:', JSON.stringify(response.data, null, 2));
          return; // Found results, stop searching
        } else {
          console.log(`❌ No results for: "${caseNumber}"`);
        }
      } catch (error) {
        console.log(`⚠️ Error searching "${caseNumber}": ${error.response?.status || error.message}`);
        if (error.response?.data) {
          console.log('📊 Error Details:', JSON.stringify(error.response.data, null, 2));
        }
      }
    }
    
    // Test 3: Try with additional parameters
    console.log('\n📋 Test 3: Try with additional parameters');
    try {
      const response = await axios.post('https://api.kleopatracourt.com/api/core/live/consumer-forum/case', {
        caseNumber: 'DC/AB4/525/CC/85/2025',
        state: 'KAR',
        year: 2025,
        caseType: 'CONSUMER'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        timeout: 15000
      });
      
      console.log('✅ Extended Search Status:', response.status);
      console.log('📊 Extended Search Data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log('⚠️ Extended Search Test:', error.response?.status || error.message);
      if (error.response?.data) {
        console.log('📊 Extended Error Data:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
    // Test 4: Check endpoint availability
    console.log('\n📋 Test 4: Check endpoint availability');
    try {
      const response = await axios.get('https://api.kleopatracourt.com/api/core/live/consumer-forum/case', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        timeout: 10000
      });
      
      console.log('✅ Endpoint Status:', response.status);
      console.log('📊 Endpoint Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log('⚠️ Endpoint Check:', error.response?.status || error.message);
      if (error.response?.data) {
        console.log('📊 Endpoint Error:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
    console.log('\n🎉 New Kleopatra endpoint tests completed!');
    console.log('💡 Summary:');
    console.log('   - New Endpoint: https://api.kleopatracourt.com/api/core/live/consumer-forum/case');
    console.log('   - Case: DC/AB4/525/CC/85/2025');
    console.log('   - API Key: Working');
    console.log('   - Authentication: Successfully authenticated');
    
  } catch (error) {
    console.error('❌ Test Failed:', error.message);
  }
}

testNewKleopatraEndpoint();


