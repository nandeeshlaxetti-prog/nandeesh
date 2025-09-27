/**
 * Firebase Configuration Helper
 * This component helps users set up Firebase configuration
 */

'use client'

import { useState } from 'react'
import { CloudIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { isFirebaseConfigured, getFirebaseConfig } from '@/lib/firebase-config'

export default function FirebaseConfigHelper() {
  const [showConfig, setShowConfig] = useState(false)
  const config = getFirebaseConfig()
  const isConfigured = isFirebaseConfigured()

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <CloudIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-lg font-medium text-gray-900">Firebase Configuration</h2>
        </div>
        
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
          isConfigured 
            ? 'bg-green-100 text-green-800' 
            : 'bg-orange-100 text-orange-800'
        }`}>
          {isConfigured ? (
            <CheckCircleIcon className="h-4 w-4" />
          ) : (
            <ExclamationTriangleIcon className="h-4 w-4" />
          )}
          <span>{isConfigured ? 'Configured' : 'Not Configured'}</span>
        </div>
      </div>

      {!isConfigured ? (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-900 mb-2">Firebase Setup Required</h3>
                <p className="text-sm text-blue-800 mb-3">
                  To enable cloud storage and real-time collaboration, you need to configure Firebase.
                </p>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><strong>Steps:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Firebase Console</a></li>
                    <li>Create a new project</li>
                    <li>Enable Firestore Database</li>
                    <li>Add a web app and copy the configuration</li>
                    <li>Create a <code className="bg-blue-100 px-1 rounded">.env.local</code> file with your config</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            {showConfig ? 'Hide' : 'Show'} Configuration Template
          </button>

          {showConfig && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Environment Variables Template</h4>
              <p className="text-xs text-gray-600 mb-3">
                Create a <code className="bg-gray-200 px-1 rounded">.env.local</code> file in <code className="bg-gray-200 px-1 rounded">apps/web/</code> with these variables:
              </p>
              <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
{`# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcdef
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX`}
              </pre>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-green-900 mb-2">Firebase Configured Successfully</h3>
                <p className="text-sm text-green-800">
                  Your Firebase project is connected and ready for cloud storage and real-time collaboration.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Project Info</h4>
              <div className="space-y-1 text-xs text-gray-600">
                <p><strong>Project ID:</strong> {config.projectId}</p>
                <p><strong>Auth Domain:</strong> {config.authDomain}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Features Enabled</h4>
              <div className="space-y-1 text-xs text-gray-600">
                <p>✅ Cloud Storage</p>
                <p>✅ Real-time Sync</p>
                <p>✅ Multi-user Collaboration</p>
                <p>✅ Offline Support</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}




