'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogoWithText } from './Logo'

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()

  const navigationItems = [
    { name: 'Dashboard', href: '/', icon: '🏠' },
    { name: 'Cases', href: '/cases', icon: '📁' },
    { name: 'Tasks', href: '/tasks', icon: '📋' },
    { name: 'Projects', href: '/projects', icon: '📊' },
    { name: 'Clients', href: '/contacts', icon: '👤' },
    { name: 'Team', href: '/team', icon: '👥' },
    { name: 'Integrations', href: '/integrations', icon: '🔗' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ]

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
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

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => {
                // Simple mobile menu toggle - you can enhance this later
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

