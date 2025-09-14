'use client';

import { useState, useMemo } from 'react';
import { TaskPriority, TaskStatus } from './_types';
import { useTaskManagement } from '../hooks/useTaskManagement';
import { AddTaskModal } from './_components/AddTaskModal';
import { KanbanBoard } from './_components/KanbanBoard';
import { TaskFilters } from './_components/TaskFilters';

export default function TasksPage() {
  const { tasks, isLoaded, addTask, updateTask, deleteTask, getAvailableAssignees, getAssigneeById } = useTaskManagement();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Apply search filter
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(lowercaseQuery) ||
        (task.description && task.description.toLowerCase().includes(lowercaseQuery)) ||
        (task.assignee && task.assignee.toLowerCase().includes(lowercaseQuery))
      );
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    return filtered;
  }, [tasks, searchQuery, priorityFilter, statusFilter]);

  const handleAddTask = (taskData: {
    title: string;
    description?: string;
    priority: TaskPriority;
    assigneeId?: string;
    dueDate?: string;
  }) => {
    addTask({
      ...taskData,
      status: 'todo', // New tasks start as 'todo'
    });
  };

  const handleUpdateTask = (taskId: string, updates: Partial<any>) => {
    updateTask(taskId, updates);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  const getAssigneeName = (assigneeId?: string) => {
    if (!assigneeId) return '';
    const assignee = getAssigneeById(assigneeId);
    return assignee ? assignee.name : 'Unknown';
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-screen-2xl mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex gap-4">
                <div className="flex-1 h-10 bg-gray-200 rounded"></div>
                <div className="w-48 h-10 bg-gray-200 rounded"></div>
                <div className="w-48 h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    <div className="space-y-3">
                      <div className="bg-gray-200 rounded-lg p-4 h-32"></div>
                      <div className="bg-gray-200 rounded-lg p-4 h-32"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
              <p className="text-gray-600 mt-2">
                Manage your tasks and deadlines efficiently
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'kanban'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Kanban
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  List
                </button>
              </div>
              
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                aria-label="Add new task"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Task
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Filters */}
          <TaskFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />

          {/* Task Count */}
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                Tasks ({filteredTasks.length})
              </h2>
              {filteredTasks.length !== tasks.length && (
                <p className="text-sm text-gray-500">
                  Showing {filteredTasks.length} of {tasks.length} tasks
                </p>
              )}
            </div>
          </div>

          {/* Task Board/List */}
          {viewMode === 'kanban' ? (
            <KanbanBoard
              tasks={filteredTasks}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              getAssigneeName={getAssigneeName}
            />
          ) : (
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Task List</h2>
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery || priorityFilter !== 'all' || statusFilter !== 'all'
                      ? 'Try adjusting your filters to see more tasks.'
                      : 'Get started by creating your first task.'}
                  </p>
                  {!searchQuery && priorityFilter === 'all' && statusFilter === 'all' && (
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Task
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-sm font-medium text-gray-900 flex-1 mr-2">
                          {task.title}
                        </h3>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md p-1"
                          aria-label={`Delete ${task.title}`}
                          title="Delete task"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {task.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Status</span>
                          <select
                            value={task.status}
                            onChange={(e) => handleUpdateTask(task.id, { status: e.target.value as TaskStatus })}
                            className="text-xs px-2 py-1 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="todo">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="review">Review</option>
                            <option value="done">Done</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Priority</span>
                          <select
                            value={task.priority}
                            onChange={(e) => handleUpdateTask(task.id, { priority: e.target.value as TaskPriority })}
                            className="text-xs px-2 py-1 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </div>

                        {task.assigneeId && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Assignee</span>
                            <span className="text-xs text-gray-700">{getAssigneeName(task.assigneeId)}</span>
                          </div>
                        )}

                        {task.dueDate && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Due Date</span>
                            <span className={`text-xs ${
                              new Date(task.dueDate) < new Date() && task.status !== 'done'
                                ? 'text-red-600 font-medium'
                                : 'text-gray-700'
                            }`}>
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTask={handleAddTask}
        availableAssignees={getAvailableAssignees()}
      />
    </div>
  );
}