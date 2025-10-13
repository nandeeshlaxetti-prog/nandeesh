// Check what's causing the loading issue
const url = 'https://web-swart-delta-fbp7nmx5l7.vercel.app'

async function checkLoadingIssue() {
  console.log('\n🔍 Investigating Loading Issue...\n')
  
  try {
    // Test homepage
    console.log('1️⃣ Testing Homepage...')
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })
    
    console.log(`   Status: ${response.status}`)
    
    const html = await response.text()
    console.log(`   HTML Length: ${html.length} characters`)
    
    // Check what's in the HTML
    if (html.includes('Loading...')) {
      console.log('   ✅ Found "Loading..." text')
    }
    
    if (html.includes('dashboard')) {
      console.log('   ⚠️  Contains dashboard reference')
    }
    
    if (html.includes('login')) {
      console.log('   ⚠️  Contains login reference')
    }
    
    // Check for Firebase initialization
    if (html.includes('firebase')) {
      console.log('   📱 Firebase scripts detected')
    }
    
    // Check for errors in the page
    if (html.includes('error')) {
      console.log('   ❌ Error found in page')
      const errorMatch = html.match(/error[^<]*</i)
      if (errorMatch) {
        console.log(`      ${errorMatch[0]}`)
      }
    }
    
    // Check the actual page scripts
    const scriptMatches = html.match(/<script[^>]*src="([^"]+)"/gi)
    if (scriptMatches) {
      console.log(`\n   📦 Found ${scriptMatches.length} script tags`)
    }
    
    // Check for hydration or React errors
    if (html.includes('hydration') || html.includes('Hydration')) {
      console.log('   ⚠️  Hydration-related content found')
    }
    
    console.log('\n2️⃣ Testing Login Page...')
    const loginResponse = await fetch(`${url}/login`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })
    
    console.log(`   Status: ${loginResponse.status}`)
    const loginHtml = await loginResponse.text()
    console.log(`   HTML Length: ${loginHtml.length} characters`)
    
    if (loginHtml.includes('Sign in')) {
      console.log('   ✅ Login form found')
    }
    
    // Check console logs endpoint
    console.log('\n3️⃣ Checking Recent Logs...')
    console.log('   Run this command to see deployment logs:')
    console.log('   vercel logs https://web-aghhtnvfg-nandeeshs-projects-8f92dec2.vercel.app')
    
    console.log('\n💡 Possible Issues:')
    console.log('   1. Auth state stuck in loading (isLoading: true)')
    console.log('   2. Firebase not initializing properly')
    console.log('   3. Redirect loop between / and /login')
    console.log('   4. Client-side hydration error')
    
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}`)
  }
}

checkLoadingIssue()



