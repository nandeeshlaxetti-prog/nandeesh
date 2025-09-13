'use client';

import { useState, useEffect } from 'react';
import { Project, seedProjects } from '../projects/_types';

const LOCAL_STORAGE_KEY = 'lnn-legal-projects';

export function useProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

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

  const addProject = (newProject: Omit<Project, 'id'>) => {
    setProjects(prev => {
      const projectWithId = { ...newProject, id: Date.now().toString() };
      return [...prev, projectWithId];
    });
  };

  const updateProject = (projectId: string, updatedProject: Omit<Project, 'id'>) => {
    setProjects(prev =>
      prev.map(proj =>
        proj.id === projectId ? { ...updatedProject, id: projectId } : proj
      )
    );
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(proj => proj.id !== projectId));
  };

  return { projects, isLoaded, addProject, updateProject, deleteProject };
}
