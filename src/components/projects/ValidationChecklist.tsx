import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusCircle, CheckSquare, Square, Trash2 } from 'lucide-react';
import { useHypotheses } from '../../hooks/useHypotheses';
import type { Hypothesis } from '../../services/projectsService';

interface Project {
  id: string | number;
  hypotheses: Hypothesis[];
}

interface ValidationChecklistProps {
  project: Project;
  onUpdate: (updatedProject: Project) => void;
}

const ValidationChecklist = ({ project, onUpdate }: ValidationChecklistProps) => {
  const { t } = useTranslation();
  const projectId = typeof project.id === 'string' ? parseInt(project.id) : project.id;
  const { hypotheses, loading, createHypothesis, updateHypothesis, deleteHypothesis, refresh } = useHypotheses(projectId);
  const [newHypothesis, setNewHypothesis] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Sincronizar hipóteses quando mudarem
  useEffect(() => {
    if (hypotheses.length > 0 || project.hypotheses.length === 0) {
      onUpdate({
        ...project,
        hypotheses: hypotheses.map(h => ({
          ...h,
          id: h.id.toString(), // Converter para string para compatibilidade
          experiments: [], // Manter compatibilidade
        })),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hypotheses]);

  const handleAddHypothesis = async () => {
    if (!newHypothesis.trim()) return;

    try {
      await createHypothesis({
        project_id: projectId,
        statement: newHypothesis,
        validated: false,
        confidence: 0,
      });
      setNewHypothesis('');
      setShowForm(false);
      refresh();
    } catch (error) {
      console.error('Error creating hypothesis:', error);
    }
  };

  const handleToggleValidation = async (hypothesisId: string | number) => {
    const id = typeof hypothesisId === 'string' ? parseInt(hypothesisId) : hypothesisId;
    const hypothesis = hypotheses.find(h => h.id === id);
    if (!hypothesis) return;

    try {
      await updateHypothesis(id, {
        validated: !hypothesis.validated,
      });
      refresh();
    } catch (error) {
      console.error('Error updating hypothesis:', error);
    }
  };

  const handleDeleteHypothesis = async (hypothesisId: string | number) => {
    if (!confirm('Tem certeza que deseja excluir esta hipótese?')) return;
    
    const id = typeof hypothesisId === 'string' ? parseInt(hypothesisId) : hypothesisId;
    try {
      await deleteHypothesis(id);
      refresh();
    } catch (error) {
      console.error('Error deleting hypothesis:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t('validation.title')}</h3>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          {t('validation.newHypothesis')}
        </button>
      </div>

      {showForm && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <textarea
            value={newHypothesis}
            onChange={(e) => setNewHypothesis(e.target.value)}
            placeholder={t('validation.hypothesisPlaceholder')}
            className="w-full p-2 border rounded mb-4"
            rows={3}
          />
          <div className="flex space-x-2">
            <button onClick={handleAddHypothesis} className="btn-primary">
              {t('common.save')}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="btn-secondary"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}

      {loading && hypotheses.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Carregando hipóteses...
        </div>
      ) : (
        <div className="space-y-2">
          {hypotheses.map((hypothesis) => (
            <div
              key={hypothesis.id}
              className={`
                flex items-start p-4 rounded-lg
                ${hypothesis.validated
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : 'bg-gray-50 dark:bg-gray-700/50'
                }
              `}
            >
              <button
                onClick={() => handleToggleValidation(hypothesis.id)}
                className="mt-1 mr-4"
                disabled={loading}
              >
                {hypothesis.validated ? (
                  <CheckSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <Square className="w-5 h-5 text-gray-400" />
                )}
              </button>
              <div className="flex-1">
                <p className={hypothesis.validated ? 'text-green-800 dark:text-green-200' : ''}>
                  {hypothesis.statement}
                </p>
                {hypothesis.confidence > 0 && (
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Confiança: {hypothesis.confidence}%
                  </div>
                )}
              </div>
              <button
                onClick={() => handleDeleteHypothesis(hypothesis.id)}
                className="ml-4 text-gray-400 hover:text-red-500"
                disabled={loading}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {hypotheses.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Nenhuma hipótese criada ainda. Adicione uma hipótese para começar a validar.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ValidationChecklist;
