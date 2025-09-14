'use client';

import { useState, useEffect } from 'react';
import { Project, seedProjects, ProjectStatus, ProjectPriority } from '../projects/_types';
import { useTeamManagement } from './useTeamManagement';

const LOCAL_STORAGE_KEY = 'lnn-legal-projects';

export function useProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { employees: teamMembers, isLoaded: teamLoaded } = useTeamManagement();

  useEffect(() => {
    try {
      const storedProjects = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
      } else {
        setProjects(seedProjects);
      }
    } catch (error) {
      console.error("Failed to load projects from localStorage:", error);
      setProjects(seedProjects); // Fallback to seed data
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) { // Only save once loaded to avoid overwriting seed data on first render
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
      } catch (error) {
        console.error("Failed to save projects to localStorage:", error);
      }
    }
  }, [projects, isLoaded]);

  const addProject = (newProject: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const projectWithMetadata: Project = {
      ...newProject,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProjects(prev => [...prev, projectWithMetadata]);
  };

  const updateProject = (projectId: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === projectId
          ? { ...project, ...updates, updatedAt: new Date().toISOString() }
          : project
      )
    );
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  };

  const getProjectsByStatus = (status: ProjectStatus) => {
    return projects.filter(project => project.status === status);
  };

  const getProjectsByPriority = (priority: ProjectPriority) => {
    return projects.filter(project => project.priority === priority);
  };

  const searchProjects = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return projects.filter(project =>
      project.name.toLowerCase().includes(lowercaseQuery) ||
      (project.description && project.description.toLowerCase().includes(lowercaseQuery)) ||
      (project.clientName && project.clientName.toLowerCase().includes(lowercaseQuery))
    );
  };

  const getAvailableAssignees = () => {
    return teamMembers.map(member => ({
      id: member.id,
      name: member.name,
      role: member.role,
      email: member.email
    }));
  };

  const getAssigneeById = (assigneeId: string) => {
    return teamMembers.find(member => member.id === assigneeId);
  };

  return {
    projects,
    isLoaded: isLoaded && teamLoaded,
    teamMembers,
    addProject,
    updateProject,
    deleteProject,
    getProjectsByStatus,
    getProjectsByPriority,
    searchProjects,
    getAvailableAssignees,
    getAssigneeById,
  };
}
