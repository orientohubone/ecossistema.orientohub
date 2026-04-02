import { useState, useEffect, useCallback } from 'react';
import { projectsService, Project, ProjectWithRelations, CreateProjectData, UpdateProjectData } from '../services/projectsService';
import { getCachedValue, getOrLoadCachedValue, invalidateCache, setCachedValue } from '../lib/memoryCache';

export const useProjects = () => {
  const cachedProjects = getCachedValue<Project[]>('projects:list');
  const [projects, setProjects] = useState<Project[]>(cachedProjects || []);
  const [loading, setLoading] = useState(!cachedProjects);
  const [error, setError] = useState<Error | null>(null);

  const loadProjects = useCallback(async (forceRefresh = false) => {
    try {
      if (forceRefresh || !cachedProjects) {
        setLoading(true);
      }

      setError(null);

      const data = await getOrLoadCachedValue(
        'projects:list',
        45_000,
        () => projectsService.getAll(),
        { forceRefresh }
      );

      setProjects(data);
      setCachedValue('projects:list', data, 45_000);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load projects'));
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  }, [cachedProjects]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const createProject = useCallback(async (data: CreateProjectData) => {
    try {
      setError(null);
      const newProject = await projectsService.create(data);
      const updatedProjects = [newProject, ...projects];
      setProjects(updatedProjects);
      setCachedValue('projects:list', updatedProjects, 45_000);
      invalidateCache(/^projects:detail:/);
      invalidateCache('dashboard:');
      invalidateCache('insights:');
      return newProject;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create project');
      setError(error);
      throw error;
    }
  }, [projects]);

  const updateProject = useCallback(async (id: number | string, data: UpdateProjectData) => {
    try {
      setError(null);
      const updatedProject = await projectsService.update(id, data);
      const updatedProjects = projects.map((project) => {
        const pid = typeof project.id === 'number' ? project.id.toString() : project.id;
        const uid = typeof id === 'number' ? id.toString() : id;
        return pid === uid ? updatedProject : project;
      });

      setProjects(updatedProjects);
      setCachedValue('projects:list', updatedProjects, 45_000);
      invalidateCache(`projects:detail:${id}`);
      invalidateCache('dashboard:');
      invalidateCache('insights:');
      return updatedProject;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update project');
      setError(error);
      throw error;
    }
  }, [projects]);

  const deleteProject = useCallback(async (id: number | string) => {
    try {
      if (!id || (typeof id === 'number' && (isNaN(id) || id <= 0))) {
        throw new Error(`ID de projeto invÃ¡lido: ${id}`);
      }

      setError(null);
      console.log('Deleting project from hook, ID:', id);
      await projectsService.delete(id);

      const updatedProjects = projects.filter((project) => {
        const pid = typeof project.id === 'number' ? project.id.toString() : project.id;
        const uid = typeof id === 'number' ? id.toString() : id;
        return pid !== uid;
      });

      setProjects(updatedProjects);
      setCachedValue('projects:list', updatedProjects, 45_000);
      invalidateCache(`projects:detail:${id}`);
      invalidateCache('dashboard:');
      invalidateCache('insights:');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete project');
      setError(error);
      throw error;
    }
  }, [projects]);

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refresh: () => loadProjects(true),
  };
};

export const useProject = (id: number | string | null) => {
  const cacheKey = id ? `projects:detail:${id}` : null;
  const cachedProject = cacheKey ? getCachedValue<ProjectWithRelations>(cacheKey) : null;
  const [project, setProject] = useState<ProjectWithRelations | null>(cachedProject);
  const [loading, setLoading] = useState(id ? !cachedProject : false);
  const [error, setError] = useState<Error | null>(null);

  const loadProject = useCallback(async (forceRefresh = false) => {
    if (!id) {
      setProject(null);
      setLoading(false);
      return;
    }

    try {
      if (forceRefresh || !cachedProject) {
        setLoading(true);
      }

      setError(null);

      const data = await getOrLoadCachedValue(
        `projects:detail:${id}`,
        45_000,
        () => projectsService.getById(id),
        { forceRefresh }
      );

      setProject(data);
      setCachedValue(`projects:detail:${id}`, data, 45_000);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load project'));
      console.error('Error loading project:', err);
    } finally {
      setLoading(false);
    }
  }, [cachedProject, id]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  return {
    project,
    loading,
    error,
    refresh: () => loadProject(true),
  };
};
