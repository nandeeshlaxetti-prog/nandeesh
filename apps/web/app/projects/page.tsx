'use client';

import { useState, useMemo } from 'react';
import { Project, ProjectType } from './_types';
import { NewProjectModal } from './_components/NewProjectModal';
import { ProjectTable } from './_components/ProjectTable';
import { useProjectManagement } from '../hooks/useProjectManagement';

export default function ProjectsPage() {
  const { projects, isLoaded, addProject, updateProject, deleteProject } = useProjectManagement();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [typeFilter, setTypeFilter] = useState<ProjectType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesType = typeFilter === 'All' || project.type === typeFilter;
      const matchesSearch = searchQuery === '' || 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.clientName && project.clientName.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesType && matchesSearch;
    });
  }, [projects, typeFilter, searchQuery]);

  const handleAddProject = (project: Project) => {
    if (editingProject) {
      // Update existing project
      updateProject(project.id, {
        name: project.name,
        type: project.type,
        clientName: project.clientName,
        description: project.description,
        createdAt: project.createdAt,
      });
    } else {
      // Add new project
      addProject({
        name: project.name,
        type: project.type,
        clientName: project.clientName,
        description: project.description,
        createdAt: project.createdAt,
      });
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
    <div className="max-w-screen-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-2">
            Manage your projects and track progress across different types of work.
          </p>
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

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
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
                placeholder="Search by project name or client..."
              />
            </div>
          </div>
          <div className="sm:w-48">
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
        </div>
      </div>

      {/* Projects Table */}
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">
            Projects ({filteredProjects.length})
          </h2>
          {filteredProjects.length > 0 && (
            <p className="text-sm text-gray-500">
              Showing {filteredProjects.length} of {projects.length} projects
            </p>
          )}
        </div>
      </div>

      <ProjectTable
        projects={filteredProjects}
        onEditProject={handleEditProject}
        onDeleteProject={handleDeleteProject}
      />

      {/* Modal */}
      <NewProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddProject={handleAddProject}
        editingProject={editingProject}
      />
    </div>
  );
}
