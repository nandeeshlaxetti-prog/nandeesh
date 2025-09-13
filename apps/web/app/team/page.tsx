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
      <div className="max-w-screen-2xl mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="flex gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 bg-gray-200 rounded w-20"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className="h-6 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team</h1>
          <p className="text-gray-600 mt-2">
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

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              activeFilter === filter
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
            aria-label={`Filter by ${filter}`}
            aria-pressed={activeFilter === filter}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredEmployees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="space-y-3">
              {/* Name */}
              <h3 className="text-lg font-semibold text-gray-900">
                {employee.name}
              </h3>

              {/* Role Badge */}
              <RoleBadge 
                role={employee.role} 
                showPrimary={employee.role === 'Partner'} 
              />

              {/* Email */}
              {employee.email && (
                <p className="text-sm text-gray-600">
                  {employee.email}
                </p>
              )}

              {/* Role Display (Read-only) */}
              <div className="text-sm text-gray-500">
                Role: <span className="font-medium">{employee.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No team members found for the selected filter.
          </p>
        </div>
      )}
    </div>
  );
}
