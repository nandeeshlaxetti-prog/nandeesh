'use client';

import { useState, useMemo } from 'react';
import { Project, ProjectType, ProjectStatus, ProjectPriority, projectTypeColors, projectStatusColors, projectPriorityColors } from './_types';
import { useProjectManagement } from '../hooks/useProjectManagement';
import { NewProjectModal } from './_components/NewProjectModal';
import { ProjectTable } from './_components/ProjectTable';

export default function ProjectsPage() {
  const { 
    projects, 
    isLoaded, 
    addProject, 
    updateProject, 
    deleteProject, 
    getAvailableAssignees, 
    getAssigneeById 
  } = useProjectManagement();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ProjectType | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<ProjectPriority | 'All'>('All');

  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Apply search filter
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(lowercaseQuery) ||
        (project.description && project.description.toLowerCase().includes(lowercaseQuery)) ||
        (project.clientName && project.clientName.toLowerCase().includes(lowercaseQuery))
      );
    }

    // Apply type filter
    if (typeFilter !== 'All') {
      filtered = filtered.filter(project => project.type === typeFilter);
    }

    // Apply status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'All') {
      filtered = filtered.filter(project => project.priority === priorityFilter);
    }

    return filtered;
  }, [projects, searchQuery, typeFilter, statusFilter, priorityFilter]);

  const handleAddProject = (projectData: {
    name: string;
    type: ProjectType;
    status: ProjectStatus;
    priority: ProjectPriority;
    clientName?: string;
    description?: string;
    assigneeId?: string;
    dueDate?: string;
  }) => {
    if (editingProject) {
      // Update existing project
      updateProject(editingProject.id, {
        ...projectData,
        updatedAt: new Date().toISOString(),
      });
    } else {
      // Add new project
      addProject(projectData);
    }
    setEditingProject(null);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteProject = (projectId: string) => {
    deleteProject(projectId);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleNewProject = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const getAssigneeName = (assigneeId?: string) => {
    if (!assigneeId) return '';
    const assignee = getAssigneeById(assigneeId);
    return assignee ? assignee.name : 'Unknown';
  };

  if (!isLoaded) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex gap-4">
              <div className="flex-1 h-10 bg-gray-200 rounded"></div>
              <div className="w-48 h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                      <div className="h-6 bg-gray-200 rounded w-6"></div>
                    </div>
                  </div>
                </div>
              ))}
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
              <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
              <p className="text-gray-600 mt-2">
                Manage your projects and track progress across different types of work
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'table'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'cards'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Cards
                </button>
              </div>
              
              <button
                onClick={handleNewProject}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                aria-label="Add new project"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Project
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Enhanced Filters */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <label htmlFor="search" className="sr-only">
                  Search projects
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
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search by project name, client, or description..."
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <label htmlFor="type-filter" className="sr-only">
                  Filter by project type
                </label>
                <select
                  id="type-filter"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as ProjectType | 'All')}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All">All Types</option>
                  <option value="Client">Client</option>
                  <option value="Internal">Internal</option>
                  <option value="BizDev">BizDev</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label htmlFor="status-filter" className="sr-only">
                  Filter by status
                </label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'All')}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Project Count */}
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                Projects ({filteredProjects.length})
              </h2>
              {filteredProjects.length !== projects.length && (
                <p className="text-sm text-gray-500">
                  Showing {filteredProjects.length} of {projects.length} projects
                </p>
              )}
            </div>
          </div>

          {/* Projects Display */}
          {viewMode === 'table' ? (
            <ProjectTable
              projects={filteredProjects}
              onEditProject={handleEditProject}
              onDeleteProject={handleDeleteProject}
              getAssigneeName={getAssigneeName}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery || typeFilter !== 'All' || statusFilter !== 'All'
                      ? 'Try adjusting your filters to see more projects.'
                      : 'Get started by creating your first project.'}
                  </p>
                  {!searchQuery && typeFilter === 'All' && statusFilter === 'All' && (
                    <button
                      onClick={handleNewProject}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Project
                    </button>
                  )}
                </div>
              ) : (
                filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-medium text-gray-900 flex-1 mr-2">
                        {project.name}
                      </h3>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md p-1"
                        aria-label={`Delete ${project.name}`}
                        title="Delete project"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    {project.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {project.description}
                      </p>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Type</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${projectTypeColors[project.type]}`}>
                          {project.type}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Status</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${projectStatusColors[project.status]}`}>
                          {project.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Priority</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${projectPriorityColors[project.priority]}`}>
                          {project.priority}
                        </span>
                      </div>

                      {project.clientName && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Client</span>
                          <span className="text-xs text-gray-700">{project.clientName}</span>
                        </div>
                      )}

                      {project.assigneeId && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Assignee</span>
                          <span className="text-xs text-gray-700">{getAssigneeName(project.assigneeId)}</span>
                        </div>
                      )}

                      {project.dueDate && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Due Date</span>
                          <span className={`text-xs ${
                            new Date(project.dueDate) < new Date() && project.status !== 'completed'
                              ? 'text-red-600 font-medium'
                              : 'text-gray-700'
                          }`}>
                            {new Date(project.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleEditProject(project)}
                        className="w-full text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md py-1"
                      >
                        Edit Project
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      <NewProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddProject={handleAddProject}
        editingProject={editingProject}
        availableAssignees={getAvailableAssignees()}
      />
    </div>
  );
}
