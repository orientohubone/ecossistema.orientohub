import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusCircle, PlayCircle, CheckCircle, Clock, FlaskConical, ArrowRight } from 'lucide-react';

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
  const fieldClassName = "w-full rounded-xl border border-[#34455a] bg-[#0c121b] px-3 py-2.5 text-white placeholder:text-[#718096] outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20";
  const compactFieldClassName = "rounded-lg border border-[#34455a] bg-[#0c121b] px-3 py-2 text-white outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20";

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
        <div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#9ba9bc]">Teste e evidência</p><h3 className="text-lg font-semibold text-white">{t('experiments.title')}</h3></div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-bold text-[#0c121b] transition-colors hover:bg-primary-400"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          {t('experiments.new')}
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-[#273548] bg-[#151f2b] p-4">
          <div className="space-y-4">
            <input
              type="text"
              placeholder={t('experiments.titlePlaceholder')}
              className={fieldClassName}
              value={newExperiment.title || ''}
              onChange={e => setNewExperiment({ ...newExperiment, title: e.target.value })}
            />
            
            <select
              className={fieldClassName}
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
              className={fieldClassName}
              rows={3}
              value={newExperiment.method || ''}
              onChange={e => setNewExperiment({ ...newExperiment, method: e.target.value })}
            />

            <input
              type="date"
              className={fieldClassName}
              value={newExperiment.date || ''}
              onChange={e => setNewExperiment({ ...newExperiment, date: e.target.value })}
            />

            <div className="flex space-x-2">
              <button onClick={handleAddExperiment} className="btn-primary">
                {t('common.save')}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-[#34455a] px-4 py-2.5 text-sm font-medium text-[#d7e0ea] transition-colors hover:bg-[#0c121b]"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {experiments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-primary-400/35 bg-[#151f2b] px-6 py-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500/15 text-primary-300">
              <FlaskConical className="h-7 w-7" />
            </div>
            <h4 className="mb-2 text-lg font-semibold text-white">
              Pronto para testar uma hipótese?
            </h4>
            <p className="mx-auto mb-5 max-w-lg text-[#9ba9bc]">
              Desenhe um experimento simples, observe os sinais e transforme descobertas em decisões melhores.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-bold text-[#0c121b] transition-colors hover:bg-primary-400"
            >
              Criar primeiro experimento
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        ) : experiments.map((experiment) => {
          const StatusIcon = statusIcons[experiment.status];
          const hypothesis = hypotheses.find(h => h.id === experiment.hypothesis);

          return (
            <div
              key={experiment.id}
              className="rounded-xl border border-[#273548] bg-[#151f2b] p-4"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="mb-1 font-medium text-white">{experiment.title}</h4>
                  {hypothesis && (
                    <p className="text-sm text-[#9ba9bc]">
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
                    className={`${compactFieldClassName} text-sm`}
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
                  <p className="text-[#9ba9bc]">{experiment.method}</p>
                </div>
                
                {experiment.status === 'completed' && (
                  <>  
                    <div>
                      <strong>{t('experiments.results')}:</strong>
                      <p className="text-[#9ba9bc]">{experiment.results}</p>
                    </div>
                    <div>
                      <strong>{t('experiments.learnings')}:</strong>
                      <p className="text-[#9ba9bc]">{experiment.learnings}</p>
                    </div>
                  </>
                )}

                <div className="text-[#718096]">
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
