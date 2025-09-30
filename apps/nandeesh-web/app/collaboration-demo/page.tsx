/**
 * Multi-User Collaboration Demo
 * This page demonstrates how multiple users can collaborate in real-time
 */

'use client'

import { useState, useEffect } from 'react'
import { cloudStorageService, UserActivity } from '@/lib/cloud-storage-service'
import { UserIcon, CloudIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export default function CollaborationDemo() {
  const [activities, setActivities] = useState<UserActivity[]>([])
  const [activeUsers, setActiveUsers] = useState(0)
  const [currentUser, setCurrentUser] = useState(cloudStorageService.getCurrentUser())
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    // Subscribe to activities
    const unsubscribeActivities = cloudStorageService.onActivity((activity) => {
      setActivities(prev => [activity, ...prev.slice(0, 19)]) // Keep last 20 activities
    })

    // Subscribe to user presence
    const unsubscribePresence = cloudStorageService.onPresenceChange((userCount) => {
      setActiveUsers(userCount)
    })

    // Check online status
    const checkStatus = () => {
      const status = cloudStorageService.getSyncStatus()
      setIsOnline(status.isOnline)
    }
    
    checkStatus()
    const interval = setInterval(checkStatus, 5000)

    return () => {
      unsubscribeActivities()
      unsubscribePresence()
      clearInterval(interval)
    }
  }, [])

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return '➕'
      case 'UPDATE': return '✏️'
      case 'DELETE': return '🗑️'
      case 'VIEW': return '👁️'
      default: return '📝'
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'text-green-600'
      case 'UPDATE': return 'text-blue-600'
      case 'DELETE': return 'text-red-600'
      case 'VIEW': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Real-time Collaboration Demo</h1>
              <p className="text-gray-600 mt-1">See how multiple users collaborate in real-time</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Online Status */}
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                isOnline ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
              }`}>
                <CloudIcon className="h-4 w-4" />
                <span>{isOnline ? 'Online' : 'Offline'}</span>
              </div>
              
              {/* Active Users */}
              <div className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                <UserIcon className="h-4 w-4" />
                <span>{activeUsers} user{activeUsers !== 1 ? 's' : ''} online</span>
              </div>
              
              {/* Current User */}
              <div className="text-sm text-gray-600">
                You are: <span className="font-medium">{currentUser.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">How to Test Multi-User Collaboration:</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>1. <strong>Open multiple browser tabs</strong> or <strong>different browsers</strong> to this page</p>
            <p>2. <strong>Go to the Cases page</strong> and add, edit, or delete cases</p>
            <p>3. <strong>Watch this page</strong> to see real-time activity updates</p>
            <p>4. <strong>See user presence</strong> - the active user count updates automatically</p>
            <p>5. <strong>All changes sync instantly</strong> across all connected users</p>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Live Activity Feed</h2>
            <p className="text-sm text-gray-600">Real-time updates from all users</p>
          </div>
          
          <div className="p-6">
            {activities.length === 0 ? (
              <div className="text-center py-8">
                <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No activity yet. Start collaborating to see live updates!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg">{getActionIcon(activity.action)}</div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{activity.userName}</span>
                        <span className={`text-sm font-medium ${getActionColor(activity.action)}`}>
                          {activity.action.toLowerCase()}d
                        </span>
                        <span className="font-medium text-gray-900">{activity.entityName}</span>
                      </div>
                      
                      {activity.details && (
                        <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>{activity.entityType}</span>
                        <span>•</span>
                        <span>{new Date(activity.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    {activity.userId === currentUser.id && (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Features List */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Real-time Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span>Live case updates across all users</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span>User presence indicators</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span>Activity feed with timestamps</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span>Automatic conflict resolution</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Collaboration Benefits</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span>No data duplication between users</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span>Instant synchronization</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span>Offline support with auto-sync</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span>Centralized data storage</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}








