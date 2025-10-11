// Test local application functionality
const localUrl = 'http://localhost:3000'

async function testLocalApp() {
  try {
    console.log(`🧪 Testing Local Application: ${localUrl}`)
    
    // Test homepage
    const response = await fetch(localUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    console.log(`📊 Homepage Status: ${response.status} ${response.statusText}`)
    
    const html = await response.text()
    console.log(`📄 HTML Length: ${html.length} characters`)
    
    if (html.includes('Loading...')) {
      console.log('✅ Homepage: Found "Loading..." - Working!')
    } else if (html.includes('Sign in')) {
      console.log('✅ Homepage: Found "Sign in" - Redirected to login!')
    }
    
    // Test login page directly
    const loginResponse = await fetch(`${localUrl}/login`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    console.log(`📊 Login Page Status: ${loginResponse.status} ${loginResponse.statusText}`)
    
    const loginHtml = await loginResponse.text()
    
    if (loginHtml.includes('Sign in')) {
      console.log('✅ Login Page: Found "Sign in" form - Working!')
    } else if (loginHtml.includes('Create Account')) {
      console.log('✅ Login Page: Found "Create Account" form - Working!')
    }
    
    // Test storage API
    try {
      const storageResponse = await fetch(`${localUrl}/api/cases/storage`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      console.log(`📊 Storage API Status: ${storageResponse.status} ${storageResponse.statusText}`)
      
      if (storageResponse.ok) {
        const storageData = await storageResponse.json()
        console.log(`✅ Storage API: Working! Storage type: ${storageData.storage}`)
        console.log(`📊 Cases count: ${storageData.total || 0}`)
      }
    } catch (error) {
      console.log(`⚠️  Storage API: ${error.message}`)
    }
    
  } catch (error) {
    console.log(`❌ Error testing local app:`, error.message)
  }
}

testLocalApp()
