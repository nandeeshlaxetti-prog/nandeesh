'use client';

import { TaskPriority, TaskStatus } from '../_types';

interface TaskFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  priorityFilter: TaskPriority | 'all';
  onPriorityFilterChange: (priority: TaskPriority | 'all') => void;
  statusFilter: TaskStatus | 'all';
  onStatusFilterChange: (status: TaskStatus | 'all') => void;
}

export function TaskFilters({
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityFilterChange,
  statusFilter,
  onStatusFilterChange,
}: TaskFiltersProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">
            Search tasks
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search tasks..."
            />
          </div>
        </div>

        {/* Priority Filter */}
        <div className="lg:w-48">
          <label htmlFor="priority-filter" className="sr-only">
            Filter by priority
          </label>
          <select
            id="priority-filter"
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value as TaskPriority | 'all')}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="lg:w-48">
          <label htmlFor="status-filter" className="sr-only">
            Filter by status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as TaskStatus | 'all')}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>
    </div>
  );
}

