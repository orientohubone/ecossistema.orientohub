import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusCircle, Calendar, Check, Clock, MessageSquare, ArrowRight } from 'lucide-react';

interface Interview {
  id: string;
  customerName: string;
  date: string;
  script: string;
  responses: Record<string, string>;
  insights: string[];
  status: 'scheduled' | 'completed';
}

interface InterviewsListProps {
  interviews: Interview[];
  onUpdate: (interviews: Interview[]) => void;
}

const InterviewsList = ({ interviews, onUpdate }: InterviewsListProps) => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [newInterview, setNewInterview] = useState<Partial<Interview>>({});
  const [currentInsight, setCurrentInsight] = useState('');
  const fieldClassName = "w-full rounded-xl border border-[#34455a] bg-[#0c121b] px-3 py-2.5 text-white placeholder:text-[#718096] outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20";
  const compactFieldClassName = "rounded-lg border border-[#34455a] bg-[#0c121b] px-3 py-2 text-white outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20";

  const handleAddInterview = () => {
    if (!newInterview.customerName || !newInterview.date) return;

    const interview: Interview = {
      id: `int-${Date.now()}`,
      customerName: newInterview.customerName,
      date: newInterview.date,
      script: newInterview.script || '',
      responses: {},
      insights: [],
      status: 'scheduled'
    };

    onUpdate([...interviews, interview]);
    setNewInterview({});
    setShowForm(false);
  };

  const handleAddInsight = (interviewId: string) => {
    if (!currentInsight.trim()) return;

    const updatedInterviews = interviews.map(interview => {
      if (interview.id === interviewId) {
        return {
          ...interview,
          insights: [...interview.insights, currentInsight]
        };
      }
      return interview;
    });

    onUpdate(updatedInterviews);
    setCurrentInsight('');
  };

  const handleUpdateStatus = (interviewId: string, newStatus: Interview['status']) => {
    const updatedInterviews = interviews.map(interview =>
      interview.id === interviewId ? { ...interview, status: newStatus } : interview
    );
    onUpdate(updatedInterviews);
  };

  const handleUpdateResponse = (interviewId: string, question: string, response: string) => {
    const updatedInterviews = interviews.map(interview => {
      if (interview.id === interviewId) {
        return {
          ...interview,
          responses: {
            ...interview.responses,
            [question]: response
          }
        };
      }
      return interview;
    });
    
    onUpdate(updatedInterviews);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#9ba9bc]">Voz do cliente</p><h3 className="text-lg font-semibold text-white">{t('interviews.title')}</h3></div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-bold text-[#0c121b] transition-colors hover:bg-primary-400"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          {t('interviews.new')}
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-[#273548] bg-[#151f2b] p-4">
          <div className="space-y-4">
            <input
              type="text"
              placeholder={t('interviews.customerName')}
              className={fieldClassName}
              value={newInterview.customerName || ''}
              onChange={e => setNewInterview({ ...newInterview, customerName: e.target.value })}
            />

            <input
              type="date"
              className={fieldClassName}
              value={newInterview.date || ''}
              onChange={e => setNewInterview({ ...newInterview, date: e.target.value })}
            />

            <textarea
              placeholder={t('interviews.script')}
              className={fieldClassName}
              rows={4}
              value={newInterview.script || ''}
              onChange={e => setNewInterview({ ...newInterview, script: e.target.value })}
            />

            <div className="flex space-x-2">
              <button onClick={handleAddInterview} className="btn-primary">
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
        {interviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-primary-400/35 bg-[#151f2b] px-6 py-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500/15 text-primary-300">
              <MessageSquare className="h-7 w-7" />
            </div>
            <h4 className="mb-2 text-lg font-semibold text-white">
              Vamos ouvir quem importa?
            </h4>
            <p className="mx-auto mb-5 max-w-lg text-[#9ba9bc]">
              Agende uma conversa com um cliente e descubra sinais reais para orientar os próximos passos.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-bold text-[#0c121b] transition-colors hover:bg-primary-400"
            >
              Agendar primeira entrevista
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        ) : interviews.map((interview) => (
          <div
            key={interview.id}
            className="rounded-xl border border-[#273548] bg-[#151f2b] p-4"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="mb-1 font-medium text-white">{interview.customerName}</h4>
                <div className="flex items-center text-sm text-[#9ba9bc]">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(interview.date).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {interview.status === 'completed' ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Clock className="w-5 h-5 text-blue-500" />
                )}
                <select
                  value={interview.status}
                  onChange={(e) => handleUpdateStatus(interview.id, e.target.value as Interview['status'])}
                  className={`${compactFieldClassName} text-sm`}
                >
                  <option value="scheduled">{t('interviews.status.scheduled')}</option>
                  <option value="completed">{t('interviews.status.completed')}</option>
                </select>
              </div>
            </div>

            {interview.script && (
              <div className="mb-4">
                <h5 className="font-medium mb-2">{t('interviews.script')}</h5>
                <div className="whitespace-pre-line text-sm text-[#9ba9bc]">
                  {interview.script}
                </div>
              </div>
            )}

            {interview.status === 'completed' && (
              <>
                <div className="mb-4">
                  <h5 className="font-medium mb-2">{t('interviews.responses')}</h5>
                  <div className="space-y-2">
                    {Object.entries(interview.responses).map(([question, response]) => (
                      <div key={question} className="text-sm">
                        <div className="font-medium">{question}</div>
                        <div className="text-[#9ba9bc]">{response}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">{t('interviews.insights')}</h5>
                  <div className="space-y-2">
                    {interview.insights.map((insight, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-[#273548] bg-[#0c121b] p-2 text-sm text-[#d7e0ea]"
                      >
                        {insight}
                      </div>
                    ))}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder={t('interviews.newInsight')}
                        className={`flex-1 text-sm ${compactFieldClassName}`}
                        value={currentInsight}
                        onChange={(e) => setCurrentInsight(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddInsight(interview.id);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleAddInsight(interview.id)}
                        className="rounded-lg border border-[#34455a] px-3 py-2 text-sm font-medium text-[#d7e0ea] transition-colors hover:bg-[#0c121b]"
                      >
                        {t('common.add')}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewsList;
