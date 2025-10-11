// Debug the 500 error by checking the actual error response
const localUrl = 'http://localhost:3000'

async function debugError() {
  try {
    console.log(`🔍 Debugging 500 error on: ${localUrl}`)
    
    const response = await fetch(localUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    console.log(`📊 Status: ${response.status} ${response.statusText}`)
    console.log(`📊 Headers:`, Object.fromEntries(response.headers.entries()))
    
    const text = await response.text()
    console.log(`📄 Response Length: ${text.length} characters`)
    
    if (text.includes('error')) {
      console.log('🔍 Found error in response:')
      const errorMatch = text.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i)
      if (errorMatch) {
        console.log(errorMatch[1])
      } else {
        // Look for error in the text
        const lines = text.split('\n')
        const errorLines = lines.filter(line => 
          line.toLowerCase().includes('error') || 
          line.toLowerCase().includes('exception') ||
          line.toLowerCase().includes('failed')
        )
        if (errorLines.length > 0) {
          console.log('Error lines found:')
          errorLines.forEach(line => console.log(line.trim()))
        }
      }
    }
    
  } catch (error) {
    console.log(`❌ Network error:`, error.message)
  }
}

debugError()
