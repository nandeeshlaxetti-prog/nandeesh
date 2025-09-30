'use client'

import { TeamManagement } from './_components/TeamManagement'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Configure system settings and preferences</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-8">
          {/* Team Management Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <TeamManagement />
          </div>

          {/* System Settings Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">System Settings</h2>
            <p className="text-gray-600">
              Additional system settings and configuration functionality will be implemented here.
            </p>
          </div>

          {/* User Preferences Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">User Preferences</h2>
            <p className="text-gray-600">
              User-specific preferences and customization options will be implemented here.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}