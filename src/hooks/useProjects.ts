import { useState, useEffect, useCallback } from 'react';
import { projectsService, Project, ProjectWithRelations, CreateProjectData, UpdateProjectData } from '../services/projectsService';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectsService.getAll();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load projects'));
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const createProject = useCallback(async (data: CreateProjectData) => {
    try {
      setError(null);
      const newProject = await projectsService.create(data);
      setProjects(prev => [newProject, ...prev]);
      return newProject;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create project');
      setError(error);
      throw error;
    }
  }, []);

  const updateProject = useCallback(async (id: number, data: UpdateProjectData) => {
    try {
      setError(null);
      const updatedProject = await projectsService.update(id, data);
      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
      return updatedProject;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update project');
      setError(error);
      throw error;
    }
  }, []);

  const deleteProject = useCallback(async (id: number) => {
    try {
      setError(null);
      await projectsService.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete project');
      setError(error);
      throw error;
    }
  }, []);

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refresh: loadProjects,
  };
};

export const useProject = (id: number | null) => {
  const [project, setProject] = useState<ProjectWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadProject = useCallback(async () => {
    if (!id) {
      setProject(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await projectsService.getById(id);
      setProject(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load project'));
      console.error('Error loading project:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  return {
    project,
    loading,
    error,
    refresh: loadProject,
  };
};

