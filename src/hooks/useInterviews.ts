import { useState, useCallback, useEffect } from 'react';
import { 
  projectsService, 
  Interview, 
  CreateInterviewData, 
  UpdateInterviewData 
} from '../services/projectsService';

export const useInterviews = (projectId: number | null) => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadInterviews = useCallback(async () => {
    if (!projectId) {
      setInterviews([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await projectsService.getInterviewsByProject(projectId);
      setInterviews(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load interviews'));
      console.error('Error loading interviews:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const createInterview = useCallback(async (data: CreateInterviewData) => {
    try {
      setError(null);
      const newInterview = await projectsService.createInterview(data);
      setInterviews(prev => [newInterview, ...prev]);
      return newInterview;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create interview');
      setError(error);
      throw error;
    }
  }, []);

  const updateInterview = useCallback(async (id: number, data: UpdateInterviewData) => {
    try {
      setError(null);
      const updatedInterview = await projectsService.updateInterview(id, data);
      setInterviews(prev => prev.map(i => i.id === id ? updatedInterview : i));
      return updatedInterview;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update interview');
      setError(error);
      throw error;
    }
  }, []);

  const deleteInterview = useCallback(async (id: number) => {
    try {
      setError(null);
      await projectsService.deleteInterview(id);
      setInterviews(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete interview');
      setError(error);
      throw error;
    }
  }, []);

  // Load interviews when projectId changes
  useEffect(() => {
    loadInterviews();
  }, [loadInterviews]);

  return {
    interviews,
    loading,
    error,
    createInterview,
    updateInterview,
    deleteInterview,
    refresh: loadInterviews,
  };
};

