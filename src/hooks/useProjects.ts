import { useState, useEffect } from 'react';
import { initialProjects } from '../lib/initialData';
import type { Project } from '../lib/types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('videoProjects');
    if (!saved) {
      // Initialize with test data if no projects exist
      localStorage.setItem('videoProjects', JSON.stringify(initialProjects));
      return initialProjects;
    }
    return JSON.parse(saved);
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('videoProjects');
      if (saved) {
        setProjects(JSON.parse(saved));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject = {
      ...project,
      id: crypto.randomUUID(),
    };

    setProjects(prev => {
      const updated = [...prev, newProject];
      localStorage.setItem('videoProjects', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteProject = (id: string) => {
    setProjects(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem('videoProjects', JSON.stringify(updated));
      return updated;
    });
  };

  return { projects, addProject, deleteProject };
};