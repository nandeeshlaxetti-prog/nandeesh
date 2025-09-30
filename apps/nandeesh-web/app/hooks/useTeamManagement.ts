'use client';

import { useState, useEffect } from 'react';
import { Employee, Role, seedEmployees } from '../team/types';

const STORAGE_KEY = 'lnn-legal-team-members';

export function useTeamManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedEmployees = JSON.parse(stored);
        setEmployees(parsedEmployees);
      } else {
        // Initialize with seed data if no stored data
        setEmployees(seedEmployees);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedEmployees));
      }
    } catch (error) {
      console.error('Error loading team data:', error);
      // Fallback to seed data
      setEmployees(seedEmployees);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever employees change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
      } catch (error) {
        console.error('Error saving team data:', error);
      }
    }
  }, [employees, isLoaded]);

  const addMember = (newMember: Employee) => {
    setEmployees(prev => [...prev, newMember]);
  };

  const updateMemberRole = (employeeId: string, newRole: Role) => {
    setEmployees(prev => 
      prev.map(emp => 
        emp.id === employeeId ? { ...emp, role: newRole } : emp
      )
    );
  };

  const removeMember = (employeeId: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
  };

  const resetToDefault = () => {
    setEmployees(seedEmployees);
  };

  return {
    employees,
    isLoaded,
    addMember,
    updateMemberRole,
    removeMember,
    resetToDefault,
  };
}
