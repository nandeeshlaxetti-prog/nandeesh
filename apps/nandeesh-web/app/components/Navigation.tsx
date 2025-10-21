'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogoWithText } from './Logo'
import UnifiedSearch from './UnifiedSearch'
// Removed unused auth-related imports
import { ThemeToggle } from '../../components/theme-toggle'

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  // Authentication disabled - no auth state needed

  // Don't show navigation on login page or root page
  if (pathname === '/login' || pathname === '/') {
    return null
  }

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { name: 'Cases', href: '/cases', icon: '📁' },
    { name: 'Tasks', href: '/tasks', icon: '📋' },
    { name: 'Projects', href: '/projects', icon: '📊' },
    { name: 'Clients', href: '/contacts', icon: '👤' },
    { name: 'Team', href: '/team', icon: '👥' },
    { name: 'Integrations', href: '/integrations', icon: '🔗' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ]

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <LogoWithText size="md" />
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Unified Search */}
          <div className="hidden md:block">
            <UnifiedSearch />
          </div>

          {/* User Menu / Mobile menu button */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Authentication disabled - no user menu needed */}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => {
                  const mobileMenu = document.getElementById('mobile-menu')
                  if (mobileMenu) {
                    mobileMenu.classList.toggle('hidden')
                  }
                }}
                className="text-gray-600 hover:text-gray-900 p-2"
              >
                <span className="text-xl">☰</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div id="mobile-menu" className="hidden md:hidden border-t">
          <div className="py-2 space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

