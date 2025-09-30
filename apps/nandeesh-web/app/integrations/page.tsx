'use client'

import ECourtsProviderSettings from '@/app/components/ECourtsProviderSettings'

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
            <p className="text-gray-600">Configure external service integrations</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="space-y-6">
            {/* eCourts Integration */}
            <ECourtsProviderSettings />

            {/* Other Integrations Placeholder */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Other Integrations</h3>
              <p className="text-sm text-gray-600 mb-4">
                Additional integrations will be available here
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">📧</div>
                  <h4 className="font-medium text-gray-900">Email Services</h4>
                  <p className="text-sm text-gray-500">SMTP, SendGrid, etc.</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">📱</div>
                  <h4 className="font-medium text-gray-900">SMS Services</h4>
                  <p className="text-sm text-gray-500">Twilio, AWS SNS, etc.</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">☁️</div>
                  <h4 className="font-medium text-gray-900">Cloud Storage</h4>
                  <p className="text-sm text-gray-500">AWS S3, Google Drive, etc.</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">🔐</div>
                  <h4 className="font-medium text-gray-900">Authentication</h4>
                  <p className="text-sm text-gray-500">OAuth, SAML, etc.</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">📊</div>
                  <h4 className="font-medium text-gray-900">Analytics</h4>
                  <p className="text-sm text-gray-500">Google Analytics, etc.</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">💳</div>
                  <h4 className="font-medium text-gray-900">Payments</h4>
                  <p className="text-sm text-gray-500">Stripe, PayPal, etc.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}