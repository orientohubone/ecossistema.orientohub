import { useState, useCallback } from 'react';
import { 
  projectsService, 
  Experiment, 
  CreateExperimentData, 
  UpdateExperimentData 
} from '../services/projectsService';

export const useExperiments = (projectId: number | null) => {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadExperiments = useCallback(async () => {
    if (!projectId) {
      setExperiments([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await projectsService.getExperimentsByProject(projectId);
      setExperiments(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load experiments'));
      console.error('Error loading experiments:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const createExperiment = useCallback(async (data: CreateExperimentData) => {
    try {
      setError(null);
      const newExperiment = await projectsService.createExperiment(data);
      setExperiments(prev => [newExperiment, ...prev]);
      return newExperiment;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create experiment');
      setError(error);
      throw error;
    }
  }, []);

  const updateExperiment = useCallback(async (id: number, data: UpdateExperimentData) => {
    try {
      setError(null);
      const updatedExperiment = await projectsService.updateExperiment(id, data);
      setExperiments(prev => prev.map(e => e.id === id ? updatedExperiment : e));
      return updatedExperiment;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update experiment');
      setError(error);
      throw error;
    }
  }, []);

  const deleteExperiment = useCallback(async (id: number) => {
    try {
      setError(null);
      await projectsService.deleteExperiment(id);
      setExperiments(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete experiment');
      setError(error);
      throw error;
    }
  }, []);

  return {
    experiments,
    loading,
    error,
    createExperiment,
    updateExperiment,
    deleteExperiment,
    refresh: loadExperiments,
  };
};

