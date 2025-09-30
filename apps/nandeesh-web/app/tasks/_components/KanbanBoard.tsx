'use client';

import { Task, TaskStatus, statusColors } from '../_types';
import { TaskCard } from './TaskCard';

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  getAssigneeName: (assigneeId?: string) => string;
}

const statusLabels: Record<TaskStatus, string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  review: 'Review',
  done: 'Done',
};

export function KanbanBoard({ tasks, onUpdateTask, onDeleteTask, getAssigneeName }: KanbanBoardProps) {
  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  const statuses: TaskStatus[] = ['todo', 'in-progress', 'review', 'done'];

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Task Board</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statuses.map((status) => {
          const statusTasks = getTasksByStatus(status);
          
          return (
            <div key={status} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`text-sm font-medium px-3 py-1 rounded-full border ${statusColors[status]}`}>
                  {statusLabels[status]}
                </h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {statusTasks.length}
                </span>
              </div>
              
              <div className="space-y-3 min-h-[200px]">
                {statusTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No tasks
                  </div>
                ) : (
                  statusTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdateTask={onUpdateTask}
                      onDeleteTask={onDeleteTask}
                      getAssigneeName={getAssigneeName}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
