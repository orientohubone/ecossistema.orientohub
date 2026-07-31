import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusCircle, CheckSquare, Square, Trash2, Lightbulb, ArrowRight } from 'lucide-react';
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
  const projectId = project.id;
  const { hypotheses, loading, createHypothesis, updateHypothesis, deleteHypothesis, refresh } = useHypotheses(projectId);
  const [newHypothesis, setNewHypothesis] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const fieldClassName = "w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors";

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
    const statement = newHypothesis.trim();
    if (!statement || isSaving) return;

    try {
      setIsSaving(true);
      setFormError(null);
      await createHypothesis({
        project_id: projectId,
        statement,
        validated: false,
        confidence: 0,
      });
      setNewHypothesis('');
      setShowForm(false);
      refresh();
    } catch (error) {
      console.error('Error creating hypothesis:', error);
      setFormError(error instanceof Error ? error.message : 'Não foi possível salvar a hipótese.');
    } finally {
      setIsSaving(false);
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
            className={`${fieldClassName} mb-4`}
            rows={3}
          />
          {formError && (
            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
              {formError}
            </p>
          )}
          <div className="flex space-x-2">
            <button onClick={handleAddHypothesis} disabled={isSaving || !newHypothesis.trim()} className="btn-primary disabled:cursor-not-allowed disabled:opacity-50">
              {t('common.save')}
            </button>
            <button
              onClick={() => setShowForm(false)}
              disabled={isSaving}
              className="btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
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
            <div className="rounded-2xl border-2 border-dashed border-primary-300/70 bg-gradient-to-br from-primary-50 via-white to-blue-50 px-6 py-10 text-center dark:border-primary-700/60 dark:from-primary-950/30 dark:via-gray-800/70 dark:to-blue-950/20">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500/15 shadow-sm">
                <Lightbulb className="h-7 w-7 text-primary-500" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">Vamos transformar uma ideia em aprendizado?</h4>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                Registre uma suposição importante sobre o seu projeto. Depois, você poderá testá-la, acompanhar a confiança e validar com evidências reais.
              </p>
              <button
                onClick={() => {
                  setFormError(null);
                  setShowForm(true);
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-bold text-black shadow-lg shadow-primary-500/20 transition-all hover:bg-primary-600 hover:shadow-primary-500/30"
              >
                <PlusCircle className="h-4 w-4" />
                Criar primeira hipótese
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ValidationChecklist;
