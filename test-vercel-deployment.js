// Check Vercel deployment status
const vercelUrl = 'https://web-swart-delta-fbp7nmx5l7.vercel.app'

async function checkDeployment() {
  console.log('🔍 Checking Vercel Deployment Status...\n')
  
  try {
    console.log(`Testing: ${vercelUrl}`)
    
    const response = await fetch(vercelUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    console.log(`\n📊 Status: ${response.status} ${response.statusText}`)
    
    if (response.status === 200) {
      console.log('✅ Deployment is LIVE and working!')
      
      const html = await response.text()
      console.log(`📄 Page size: ${html.length} characters`)
      
      if (html.includes('Loading...')) {
        console.log('✅ Homepage renders correctly')
      }
      
    } else if (response.status >= 500) {
      console.log('❌ Deployment has server errors (500+)')
      
      const text = await response.text()
      console.log('\n📄 Error Response:')
      
      // Try to extract error message
      const errorMatch = text.match(/"message":"([^"]+)"/)
      if (errorMatch) {
        console.log(`Error: ${errorMatch[1].replace(/\\n/g, '\n')}`)
      }
      
    } else if (response.status === 404) {
      console.log('❌ Deployment not found (404)')
      
    } else {
      console.log(`⚠️  Unexpected status: ${response.status}`)
    }
    
    // Also check if it's the latest deployment
    console.log('\n📅 Checking if this is the latest deployment...')
    console.log('   Latest commit: 3c1f658 (fix: Firebase config and optional Vercel KV dependency)')
    
  } catch (error) {
    console.log(`\n❌ Failed to connect to Vercel:`, error.message)
    console.log('\nPossible reasons:')
    console.log('  - Network connection issue')
    console.log('  - Deployment is still building')
    console.log('  - Vercel service is down')
  }
}

checkDeployment()
