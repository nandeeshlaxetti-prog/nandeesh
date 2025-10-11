// Test login page specifically
const localUrl = 'http://localhost:3000/login'

async function testLoginPage() {
  try {
    console.log(`🧪 Testing Login Page: ${localUrl}`)
    
    const response = await fetch(localUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    console.log(`📊 Status: ${response.status} ${response.statusText}`)
    
    const html = await response.text()
    console.log(`📄 HTML Length: ${html.length} characters`)
    
    // Check for key elements
    if (html.includes('Sign in')) {
      console.log('✅ Found "Sign in" text')
    }
    if (html.includes('Welcome back to LNN Legal')) {
      console.log('✅ Found welcome message')
    }
    if (html.includes('email')) {
      console.log('✅ Found email input')
    }
    if (html.includes('password')) {
      console.log('✅ Found password input')
    }
    if (html.includes('Login')) {
      console.log('✅ Found login button')
    }
    
    // Check if navigation is hidden (should be hidden on login page)
    if (!html.includes('Dashboard') && !html.includes('Cases') && !html.includes('Tasks')) {
      console.log('✅ Navigation properly hidden on login page')
    } else {
      console.log('⚠️  Navigation might be showing on login page')
    }
    
  } catch (error) {
    console.log(`❌ Error:`, error.message)
  }
}

testLoginPage()
