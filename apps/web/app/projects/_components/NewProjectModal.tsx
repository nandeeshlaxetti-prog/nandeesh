'use client';

import { useState, useEffect } from 'react';
import { Project, ProjectType, ProjectStatus, ProjectPriority } from '../_types';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (project: {
    name: string;
    type: ProjectType;
    status: ProjectStatus;
    priority: ProjectPriority;
    clientName?: string;
    description?: string;
    assigneeId?: string;
    dueDate?: string;
  }) => void;
  editingProject?: Project | null;
  availableAssignees: Array<{
    id: string;
    name: string;
    role: string;
    email?: string;
  }>;
}

export function NewProjectModal({ isOpen, onClose, onAddProject, editingProject, availableAssignees }: NewProjectModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<ProjectType>('Client');
  const [status, setStatus] = useState<ProjectStatus>('planning');
  const [priority, setPriority] = useState<ProjectPriority>('medium');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (editingProject) {
      setName(editingProject.name);
      setType(editingProject.type);
      setStatus(editingProject.status);
      setPriority(editingProject.priority);
      setClientName(editingProject.clientName || '');
      setDescription(editingProject.description || '');
      setAssigneeId(editingProject.assigneeId || '');
      setDueDate(editingProject.dueDate || '');
    } else {
      setName('');
      setType('Client');
      setStatus('planning');
      setPriority('medium');
      setClientName('');
      setDescription('');
      setAssigneeId('');
      setDueDate('');
    }
  }, [editingProject, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddProject({
      name: name.trim(),
      type,
      status,
      priority,
      clientName: clientName.trim() || undefined,
      description: description.trim() || undefined,
      assigneeId: assigneeId || undefined,
      dueDate: dueDate || undefined,
    });

    // Reset form
    setName('');
    setType('Client');
    setStatus('planning');
    setPriority('medium');
    setClientName('');
    setDescription('');
    setAssigneeId('');
    setDueDate('');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" className="text-lg font-semibold text-gray-900 mb-4">
          {editingProject ? 'Edit Project' : 'Add New Project'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Project Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter project name"
              required
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Project Type *
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as ProjectType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Client">Client</option>
              <option value="Internal">Internal</option>
              <option value="BizDev">BizDev</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority *
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as ProjectPriority)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
              Client Name
            </label>
            <input
              id="clientName"
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter client name (optional)"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter project description (optional)"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-1">
              Assignee
            </label>
            <select
              id="assignee"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a team member (optional)</option>
              {availableAssignees.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} - {member.role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {editingProject ? 'Update Project' : 'Add Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
