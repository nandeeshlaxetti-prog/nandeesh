'use client';

import { useState } from 'react';
import { Employee, FilterType, Role } from './types';
import { RoleBadge } from './_components/RoleBadge';
import { useTeamManagement } from '../hooks/useTeamManagement';

export default function TeamPage() {
  const { employees, isLoaded } = useTeamManagement();
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  const filters: FilterType[] = ['All', 'Partner', 'Associate', 'Clerk', 'Intern'];

  const filteredEmployees = employees.filter(employee => 
    activeFilter === 'All' || employee.role === activeFilter
  );

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </header>
        <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse">
            <div className="flex gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                View team members and their roles. To add or remove team members, go to Settings.
              </p>
            </div>
            <a
              href="/settings"
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              aria-label="Manage team members in Settings"
            >
              Manage Team
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                activeFilter === filter
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEmployees.map((employee) => (
            <div key={employee.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {employee.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{employee.name}</h3>
                  <RoleBadge role={employee.role as Role} />
                </div>
              </div>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p>{employee.email}</p>
                {employee.phone && <p>{employee.phone}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No team members found for the selected filter.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}