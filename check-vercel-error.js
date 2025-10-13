// Check what error is happening on Vercel
const url = 'https://nandeesh-j0ir0my67-nandeeshs-projects-8f92dec2.vercel.app'

async function checkError() {
  console.log('\n🔍 Checking Vercel deployment...\n')
  
  try {
    const response = await fetch(url)
    const html = await response.text()
    
    console.log('Status:', response.status)
    console.log('HTML length:', html.length)
    
    // Check for specific error patterns
    if (html.includes('Application error')) {
      console.log('\n❌ Found "Application error" in HTML')
    }
    
    if (html.includes('hydration')) {
      console.log('⚠️  Hydration error detected')
    }
    
    // Extract any error messages
    const errorMatch = html.match(/error[^<]{0,100}/gi)
    if (errorMatch) {
      console.log('\n📋 Error snippets:')
      errorMatch.slice(0, 5).forEach(err => console.log('  -', err))
    }
    
    // Check if it's trying to load client-side JS
    const scriptMatches = html.match(/_next\/static\/[^"]+/g)
    if (scriptMatches) {
      console.log(`\n📦 Found ${scriptMatches.length} Next.js scripts`)
      console.log('First script:', scriptMatches[0])
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message)
  }
}

checkError()

