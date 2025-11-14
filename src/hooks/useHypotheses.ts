import { useState, useCallback, useEffect } from 'react';
import { 
  projectsService, 
  Hypothesis, 
  CreateHypothesisData, 
  UpdateHypothesisData 
} from '../services/projectsService';

export const useHypotheses = (projectId: number | null) => {
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadHypotheses = useCallback(async () => {
    if (!projectId) {
      setHypotheses([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await projectsService.getHypothesesByProject(projectId);
      setHypotheses(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load hypotheses'));
      console.error('Error loading hypotheses:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const createHypothesis = useCallback(async (data: CreateHypothesisData) => {
    try {
      setError(null);
      const newHypothesis = await projectsService.createHypothesis(data);
      setHypotheses(prev => [newHypothesis, ...prev]);
      return newHypothesis;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create hypothesis');
      setError(error);
      throw error;
    }
  }, []);

  const updateHypothesis = useCallback(async (id: number, data: UpdateHypothesisData) => {
    try {
      setError(null);
      const updatedHypothesis = await projectsService.updateHypothesis(id, data);
      setHypotheses(prev => prev.map(h => h.id === id ? updatedHypothesis : h));
      return updatedHypothesis;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update hypothesis');
      setError(error);
      throw error;
    }
  }, []);

  const deleteHypothesis = useCallback(async (id: number) => {
    try {
      setError(null);
      await projectsService.deleteHypothesis(id);
      setHypotheses(prev => prev.filter(h => h.id !== id));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete hypothesis');
      setError(error);
      throw error;
    }
  }, []);

  // Load hypotheses when projectId changes
  useEffect(() => {
    loadHypotheses();
  }, [loadHypotheses]);

  return {
    hypotheses,
    loading,
    error,
    createHypothesis,
    updateHypothesis,
    deleteHypothesis,
    refresh: loadHypotheses,
  };
};

