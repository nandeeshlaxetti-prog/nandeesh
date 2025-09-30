export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  projectId?: string;
  tags?: string[];
}

export const statusColors: Record<TaskStatus, string> = {
  todo: 'bg-gray-100 text-gray-800 border-gray-300',
  'in-progress': 'bg-blue-100 text-blue-800 border-blue-300',
  review: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  done: 'bg-green-100 text-green-800 border-green-300',
};

export const priorityColors: Record<TaskPriority, string> = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};
