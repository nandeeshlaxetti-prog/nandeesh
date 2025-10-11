import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - Returns a script to clear localStorage
export async function GET(request: NextRequest) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Clear All Cases</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .container {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    button {
      background: #ef4444;
      color: white;
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 500;
    }
    button:hover {
      background: #dc2626;
    }
    .success {
      background: #10b981;
      color: white;
      padding: 12px;
      border-radius: 6px;
      margin-top: 20px;
      display: none;
    }
    .info {
      background: #3b82f6;
      color: white;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🗑️ Clear All Cases</h1>
    
    <div class="info">
      ⚠️ This will permanently delete all cases from:
      <ul>
        <li>Database</li>
        <li>localStorage</li>
        <li>Cloud storage</li>
      </ul>
      This action cannot be undone!
    </div>
    
    <button onclick="clearAll()">Delete All Cases</button>
    
    <div id="result" class="success"></div>
  </div>
  
  <script>
    async function clearAll() {
      if (!confirm('Are you sure you want to delete ALL cases? This cannot be undone!')) {
        return;
      }
      
      const result = document.getElementById('result');
      result.style.display = 'block';
      result.textContent = '🔄 Clearing...';
      
      try {
        // 1. Clear localStorage
        localStorage.removeItem('legal-cases');
        localStorage.removeItem('legal-cases-migration-status');
        console.log('✅ localStorage cleared');
        
        // 2. Clear database via API
        const response = await fetch('/api/cases/clear', {
          method: 'DELETE'
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Database cleared:', data);
          
          result.textContent = \`✅ Success! Deleted \${data.deleted?.cases || 0} cases from database and cleared localStorage. Refresh the page to see changes.\`;
        } else {
          result.textContent = '⚠️ Database cleared or was already empty. localStorage has been cleared.';
        }
        
        // Auto redirect after 3 seconds
        setTimeout(() => {
          window.location.href = '/cases';
        }, 3000);
        
      } catch (error) {
        console.error('Error:', error);
        result.textContent = '⚠️ localStorage cleared. Database may be unavailable.';
      }
    }
  </script>
</body>
</html>
  `
  
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}

