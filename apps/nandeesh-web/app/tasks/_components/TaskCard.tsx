'use client';

import { Task, statusColors, priorityColors } from '../_types';

interface TaskCardProps {
  task: Task;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  getAssigneeName: (assigneeId?: string) => string;
}

export function TaskCard({ task, onUpdateTask, onDeleteTask, getAssigneeName }: TaskCardProps) {
  const handleStatusChange = (newStatus: string) => {
    onUpdateTask(task.id, { status: newStatus as Task['status'] });
  };

  const handlePriorityChange = (newPriority: string) => {
    onUpdateTask(task.id, { priority: newPriority as Task['priority'] });
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      onDeleteTask(task.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div className={`bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow ${
      isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-sm font-medium text-gray-900 flex-1 mr-2">
          {task.title}
        </h3>
        <button
          onClick={handleDelete}
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
        {/* Status */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className={`w-full px-2 py-1 text-xs font-medium rounded-full border ${statusColors[task.status]}`}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Priority</label>
          <select
            value={task.priority}
            onChange={(e) => handlePriorityChange(e.target.value)}
            className={`w-full px-2 py-1 text-xs font-medium rounded-full ${priorityColors[task.priority]}`}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {/* Assignee */}
        {task.assigneeId && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Assignee</label>
            <p className="text-sm text-gray-700">{getAssigneeName(task.assigneeId)}</p>
          </div>
        )}

        {/* Due Date */}
        {task.dueDate && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Due Date</label>
            <p className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
              {formatDate(task.dueDate)}
              {isOverdue && ' (Overdue)'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
