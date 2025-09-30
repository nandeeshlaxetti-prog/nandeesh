'use client'

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-900">LNN Legal</h2>
          </div>
          <nav className="mt-4">
            <a href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Dashboard</a>
            <a href="/cases" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Cases</a>
            <a href="/tasks" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Tasks</a>
            <a href="/team" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Team</a>
            <a href="/integrations" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Integrations</a>
            <a href="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Settings</a>
          </nav>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}