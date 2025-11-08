import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusCircle, CheckSquare, Square, Trash2 } from 'lucide-react';

interface Hypothesis {
  id: string;
  statement: string;
  validated: boolean;
  experiments: string[];
}

interface Project {
  id: string;
  hypotheses: Hypothesis[];
}

interface ValidationChecklistProps {
  project: Project;
  onUpdate: (updatedProject: Project) => void;
}

const ValidationChecklist = ({ project, onUpdate }: ValidationChecklistProps) => {
  const { t } = useTranslation();
  const [newHypothesis, setNewHypothesis] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleAddHypothesis = () => {
    if (!newHypothesis.trim()) return;

    const hypothesis: Hypothesis = {
      id: `hyp-${Date.now()}`,
      statement: newHypothesis,
      validated: false,
      experiments: []
    };

    onUpdate({
      ...project,
      hypotheses: [...project.hypotheses, hypothesis]
    });

    setNewHypothesis('');
    setShowForm(false);
  };

  const handleToggleValidation = (hypothesisId: string) => {
    const updatedHypotheses = project.hypotheses.map(h =>
      h.id === hypothesisId ? { ...h, validated: !h.validated } : h
    );

    onUpdate({
      ...project,
      hypotheses: updatedHypotheses
    });
  };

  const handleDeleteHypothesis = (hypothesisId: string) => {
    const updatedHypotheses = project.hypotheses.filter(h => h.id !== hypothesisId);

    onUpdate({
      ...project,
      hypotheses: updatedHypotheses
    });
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

      <div className="space-y-2">
        {project.hypotheses.map((hypothesis) => (
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
              {hypothesis.experiments.length > 0 && (
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {hypothesis.experiments.length} experimentos vinculados
                </div>
              )}
            </div>
            <button
              onClick={() => handleDeleteHypothesis(hypothesis.id)}
              className="ml-4 text-gray-400 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValidationChecklist;