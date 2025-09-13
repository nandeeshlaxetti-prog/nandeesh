'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogoWithText } from './components/Logo'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <LogoWithText size="lg" />
              <p className="text-gray-600 mt-2">Legal Practice Management System</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Status: <span className="text-green-600 font-medium">Connected</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome to LNN Legal Desktop</h2>
              <p className="text-gray-600 mb-4">
                Your comprehensive legal practice management system is ready to use.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900">Database</h3>
                  <p className="text-blue-700 text-sm">✅ Connected and seeded</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900">Web App</h3>
                  <p className="text-green-700 text-sm">✅ Running on localhost</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-900">Electron</h3>
                  <p className="text-purple-700 text-sm">⚠️ Development mode</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button 
                  onClick={() => handleNavigation('/cases')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">📁</div>
                    <div className="font-medium text-gray-900">Cases</div>
                    <div className="text-sm text-gray-500">Manage legal cases</div>
                  </div>
                </button>
                
                <button 
                  onClick={() => handleNavigation('/tasks')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">📋</div>
                    <div className="font-medium text-gray-900">Tasks</div>
                    <div className="text-sm text-gray-500">Track tasks and deadlines</div>
                  </div>
                </button>
                
                <button 
                  onClick={() => handleNavigation('/cause-list')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">📅</div>
                    <div className="font-medium text-gray-900">Hearings</div>
                    <div className="text-sm text-gray-500">Court schedules</div>
                  </div>
                </button>
                
                <button 
                  onClick={() => handleNavigation('/settings')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">⚙️</div>
                    <div className="font-medium text-gray-900">Settings</div>
                    <div className="text-sm text-gray-500">Configure system</div>
                  </div>
                </button>
              </div>

              {/* Additional Navigation */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <button 
                  onClick={() => handleNavigation('/projects')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors cursor-pointer"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">📊</div>
                    <div className="font-medium text-gray-900">Projects</div>
                    <div className="text-sm text-gray-500">Project management</div>
                  </div>
                </button>
                
                <button 
                  onClick={() => handleNavigation('/team')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors cursor-pointer"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">👥</div>
                    <div className="font-medium text-gray-900">Team</div>
                    <div className="text-sm text-gray-500">Team management</div>
                  </div>
                </button>
                
                <button 
                  onClick={() => handleNavigation('/integrations')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors cursor-pointer"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🔗</div>
                    <div className="font-medium text-gray-900">Integrations</div>
                    <div className="text-sm text-gray-500">Court providers</div>
                  </div>
                </button>
                
                <button 
                  onClick={() => handleNavigation('/my-work')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors cursor-pointer"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">👤</div>
                    <div className="font-medium text-gray-900">My Work</div>
                    <div className="text-sm text-gray-500">Personal dashboard</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white overflow-hidden shadow rounded-lg mt-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Database Connection</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✅ Connected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Sample Data</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✅ Seeded
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Web Server</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✅ Running
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Electron App</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    ⚠️ Development Mode
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}