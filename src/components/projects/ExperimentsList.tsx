import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusCircle, PlayCircle, CheckCircle, Clock } from 'lucide-react';

interface Experiment {
  id: string;
  title: string;
  hypothesis: string;
  method: string;
  results: string;
  learnings: string;
  status: 'planned' | 'in_progress' | 'completed';
  date: string;
}

interface Hypothesis {
  id: string;
  statement: string;
  validated: boolean;
  experiments: string[];
}

interface ExperimentsListProps {
  experiments: Experiment[];
  hypotheses: Hypothesis[];
  onUpdate: (experiments: Experiment[]) => void;
}

const ExperimentsList = ({ experiments, hypotheses, onUpdate }: ExperimentsListProps) => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [newExperiment, setNewExperiment] = useState<Partial<Experiment>>({});

  const statusIcons = {
    planned: Clock,
    in_progress: PlayCircle,
    completed: CheckCircle
  };

  const handleAddExperiment = () => {
    if (!newExperiment.title || !newExperiment.hypothesis) return;

    const experiment: Experiment = {
      id: `exp-${Date.now()}`,
      title: newExperiment.title,
      hypothesis: newExperiment.hypothesis,
      method: newExperiment.method || '',
      results: newExperiment.results || '',
      learnings: newExperiment.learnings || '',
      status: 'planned',
      date: newExperiment.date || new Date().toISOString().split('T')[0]
    };

    onUpdate([...experiments, experiment]);
    setNewExperiment({});
    setShowForm(false);
  };

  const handleUpdateStatus = (experimentId: string, newStatus: Experiment['status']) => {
    const updatedExperiments = experiments.map(exp =>
      exp.id === experimentId ? { ...exp, status: newStatus } : exp
    );
    onUpdate(updatedExperiments);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t('experiments.title')}</h3>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          {t('experiments.new')}
        </button>
      </div>

      {showForm && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="space-y-4">
            <input
              type="text"
              placeholder={t('experiments.titlePlaceholder')}
              className="w-full p-2 border rounded"
              value={newExperiment.title || ''}
              onChange={e => setNewExperiment({ ...newExperiment, title: e.target.value })}
            />
            
            <select
              className="w-full p-2 border rounded"
              value={newExperiment.hypothesis || ''}
              onChange={e => setNewExperiment({ ...newExperiment, hypothesis: e.target.value })}
            >
              <option value="">{t('experiments.selectHypothesis')}</option>
              {hypotheses.map(h => (
                <option key={h.id} value={h.id}>{h.statement}</option>
              ))}
            </select>

            <textarea
              placeholder={t('experiments.methodPlaceholder')}
              className="w-full p-2 border rounded"
              rows={3}
              value={newExperiment.method || ''}
              onChange={e => setNewExperiment({ ...newExperiment, method: e.target.value })}
            />

            <input
              type="date"
              className="w-full p-2 border rounded"
              value={newExperiment.date || ''}
              onChange={e => setNewExperiment({ ...newExperiment, date: e.target.value })}
            />

            <div className="flex space-x-2">
              <button onClick={handleAddExperiment} className="btn-primary">
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
        </div>
      )}

      <div className="space-y-4">
        {experiments.map((experiment) => {
          const StatusIcon = statusIcons[experiment.status];
          const hypothesis = hypotheses.find(h => h.id === experiment.hypothesis);

          return (
            <div
              key={experiment.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-medium mb-1">{experiment.title}</h4>
                  {hypothesis && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t('experiments.linkedTo')}: {hypothesis.statement}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <StatusIcon className={`w-5 h-5 ${
                    experiment.status === 'completed'
                      ? 'text-green-500'
                      : experiment.status === 'in_progress'
                      ? 'text-blue-500'
                      : 'text-gray-400'
                  }`} />
                  <select
                    value={experiment.status}
                    onChange={(e) => handleUpdateStatus(experiment.id, e.target.value as Experiment['status'])}
                    className="text-sm border rounded p-1"
                  >
                    <option value="planned">{t('experiments.status.planned')}</option>
                    <option value="in_progress">{t('experiments.status.inProgress')}</option>
                    <option value="completed">{t('experiments.status.completed')}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <strong>{t('experiments.method')}:</strong>
                  <p className="text-gray-600 dark:text-gray-300">{experiment.method}</p>
                </div>
                
                {experiment.status === 'completed' && (
                  <>  
                    <div>
                      <strong>{t('experiments.results')}:</strong>
                      <p className="text-gray-600 dark:text-gray-300">{experiment.results}</p>
                    </div>
                    <div>
                      <strong>{t('experiments.learnings')}:</strong>
                      <p className="text-gray-600 dark:text-gray-300">{experiment.learnings}</p>
                    </div>
                  </>
                )}

                <div className="text-gray-500">
                  {new Date(experiment.date).toLocaleDateString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExperimentsList;