// Test storage API specifically
const storageUrl = 'http://localhost:3000/api/cases/storage'

async function testStorageAPI() {
  try {
    console.log(`🧪 Testing Storage API: ${storageUrl}`)
    
    const response = await fetch(storageUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log(`📊 Status: ${response.status} ${response.statusText}`)
    
    if (response.ok) {
      const data = await response.json()
      console.log(`✅ Success:`, JSON.stringify(data, null, 2))
    } else {
      const text = await response.text()
      console.log(`❌ Error Response Length: ${text.length}`)
      
      // Try to extract error message
      const errorMatch = text.match(/"message":"([^"]+)"/)
      if (errorMatch) {
        console.log(`Error Message: ${errorMatch[1]}`)
      }
      
      // Try to find the stack trace
      const stackMatch = text.match(/"stack":"([^"]+)"/)
      if (stackMatch) {
        const stack = stackMatch[1].replace(/\\n/g, '\n').replace(/\\u001b\[[0-9;]+m/g, '')
        console.log(`Stack Trace:`)
        console.log(stack)
      }
    }
    
  } catch (error) {
    console.log(`❌ Network error:`, error.message)
  }
}

testStorageAPI()
