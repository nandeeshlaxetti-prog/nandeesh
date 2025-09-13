'use client'

export function DashboardCards() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <DashboardCard title="Total Cases" value="3" icon="📁" />
      <DashboardCard title="Pending Tasks" value="5" icon="📋" />
      <DashboardCard title="Upcoming Hearings" value="2" icon="📅" />
      <DashboardCard title="Overdue Items" value="1" icon="⚠️" />
    </div>
  )
}

function DashboardCard({ title, value, icon }: { title: string; value: string | number; icon: string }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="text-2xl">{icon}</span>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-lg font-medium text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}