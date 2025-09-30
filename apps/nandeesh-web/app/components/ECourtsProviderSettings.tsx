'use client'

import { useState, useEffect } from 'react'
import { ECourtsProvider, ECourtsConfig, ECourtsProviderType } from '@/lib/ecourts-provider'

export default function ECourtsProviderSettings() {
  const [provider, setProvider] = useState<ECourtsProviderType>('official')
  const [apiKey, setApiKey] = useState('')
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Load saved settings
    const savedProvider = localStorage.getItem('ecourts-provider') as ECourtsProviderType
    const savedApiKey = localStorage.getItem('ecourts-api-key')
    
    // Set default to third_party with Kleopatra API key
    if (!savedProvider) {
      setProvider('third_party')
    } else {
      setProvider(savedProvider)
    }
    
    if (!savedApiKey) {
      setApiKey('klc_2cef7fc42178c58211cd8b8b1d23c3206c1e778f13ed566237803d8897a9b104')
    } else {
      setApiKey(savedApiKey)
    }
  }, [])

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      // Save to localStorage
      localStorage.setItem('ecourts-provider', provider)
      localStorage.setItem('ecourts-api-key', apiKey)
      
      setTestResult('Settings saved successfully!')
      setTimeout(() => setTestResult(''), 3000)
    } catch (error) {
      setTestResult('Error saving settings')
    } finally {
      setIsSaving(false)
    }
  }

  const handleTestConnection = async () => {
    setIsTesting(true)
    setTestResult('')
    
    try {
      const config: ECourtsConfig = {
        provider,
        apiKey: apiKey || undefined,
        timeout: 10000
      }
      
      const ecourtsProvider = new ECourtsProvider(config)
      const result = await ecourtsProvider.testConnection()
      
      if (result.success) {
        setTestResult(`✅ Connection successful: ${result.message}`)
      } else {
        setTestResult(`❌ Connection failed: ${result.message}`)
      }
    } catch (error) {
      setTestResult(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsTesting(false)
    }
  }

  const getProviderDescription = (providerType: ECourtsProviderType) => {
    switch (providerType) {
      case 'official':
        return 'Official government APIs (NAPIX, API Setu) - Requires API key and approval'
      case 'manual':
        return 'Manual portal scraping - May require CAPTCHA handling'
      case 'third_party':
        return 'Third-party APIs (Kleopatra Enterprise API, Surepass, Legalkart) - Requires API key'
      default:
        return ''
    }
  }

  const getProviderEndpoints = (providerType: ECourtsProviderType) => {
    switch (providerType) {
      case 'official':
        return [
          'NAPIX: https://napix.gov.in/discover',
          'API Setu: https://apisetu.gov.in/',
          'District Portal: https://services.ecourts.gov.in/',
          'High Court Portal: https://hcservices.ecourts.gov.in/'
        ]
      case 'manual':
        return [
          'District Portal: https://services.ecourts.gov.in/',
          'High Court Portal: https://hcservices.ecourts.gov.in/',
          'Judgments Portal: https://judgments.ecourts.gov.in/'
        ]
      case 'third_party':
        return [
          'Kleopatra Enterprise API: https://court-api.kleopatra.io/',
          'Surepass CNR API: https://surepass.io/ecourt-cnr-search-api/',
          'Legalkart APIs: https://www.legalkart.com/api-services'
        ]
      default:
        return []
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">eCourts API Provider Settings</h3>
        <p className="text-sm text-gray-600">
          Configure how your application connects to eCourts data sources
        </p>
      </div>

      <div className="space-y-6">
        {/* Provider Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Provider Type
          </label>
          <div className="space-y-3">
            {(['official', 'manual', 'third_party'] as ECourtsProviderType[]).map((providerType) => (
              <div key={providerType} className="flex items-start">
                <input
                  type="radio"
                  id={providerType}
                  name="provider"
                  value={providerType}
                  checked={provider === providerType}
                  onChange={(e) => setProvider(e.target.value as ECourtsProviderType)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <div className="ml-3">
                  <label htmlFor={providerType} className="text-sm font-medium text-gray-700 capitalize">
                    {providerType.replace('_', ' ')}
                  </label>
                  <p className="text-xs text-gray-500">
                    {getProviderDescription(providerType)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Key */}
        {(provider === 'official' || provider === 'third_party') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your API key"
            />
            <p className="text-xs text-gray-500 mt-1">
              Required for {provider === 'official' ? 'official government APIs' : 'third-party APIs'}
            </p>
          </div>
        )}

        {/* Endpoints Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Endpoints
          </label>
          <div className="bg-gray-50 rounded-md p-3">
            <ul className="text-sm text-gray-600 space-y-1">
              {getProviderEndpoints(provider).map((endpoint, index) => (
                <li key={index} className="font-mono text-xs">
                  {endpoint}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Test Result */}
        {testResult && (
          <div className={`p-3 rounded-md ${
            testResult.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            <p className="text-sm">{testResult}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleTestConnection}
            disabled={isTesting}
            className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isTesting ? 'Testing...' : 'Test Connection'}
          </button>
          
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        {/* Kleopatra API Special Info */}
        {provider === 'third_party' && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-purple-900 mb-2">🚀 Kleopatra Enterprise API Features:</h4>
            <div className="text-sm text-purple-800 space-y-2">
              <p><strong>Complete Coverage:</strong> District Courts (700+), High Courts (25), Supreme Court, NCLT, CAT, Consumer Forums</p>
              <p><strong>Real-time Data:</strong> Live case tracking, hearing schedules, judgment downloads</p>
              <p><strong>Enterprise Grade:</strong> 99.9% uptime, OAuth 2.0, RESTful API with OpenAPI spec</p>
              <p><strong>Free for Research:</strong> Academic research, journalism, legal education, non-profits</p>
              <p><strong>Interactive Playground:</strong> Test endpoints at <a href="https://court-api.kleopatra.io/" target="_blank" rel="noopener noreferrer" className="underline">court-api.kleopatra.io</a></p>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Setup Instructions:</h4>
          <div className="text-sm text-blue-800 space-y-2">
            <p><strong>Official APIs:</strong> Register at NAPIX or API Setu, get approval, and obtain API key</p>
            <p><strong>Manual Portals:</strong> No setup required, but may encounter CAPTCHA challenges</p>
            <p><strong>Third-party APIs:</strong> Sign up with service providers and get API keys</p>
            <p><strong>Kleopatra API:</strong> Visit <a href="https://court-api.kleopatra.io/" target="_blank" rel="noopener noreferrer" className="underline">court-api.kleopatra.io</a> for free access</p>
          </div>
        </div>
      </div>
    </div>
  )
}
