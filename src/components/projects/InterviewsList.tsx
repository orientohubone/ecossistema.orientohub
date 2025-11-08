import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusCircle, Calendar, Check, Clock } from 'lucide-react';

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
        <h3 className="text-lg font-semibold">{t('interviews.title')}</h3>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          {t('interviews.new')}
        </button>
      </div>

      {showForm && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="space-y-4">
            <input
              type="text"
              placeholder={t('interviews.customerName')}
              className="w-full p-2 border rounded"
              value={newInterview.customerName || ''}
              onChange={e => setNewInterview({ ...newInterview, customerName: e.target.value })}
            />

            <input
              type="date"
              className="w-full p-2 border rounded"
              value={newInterview.date || ''}
              onChange={e => setNewInterview({ ...newInterview, date: e.target.value })}
            />

            <textarea
              placeholder={t('interviews.script')}
              className="w-full p-2 border rounded"
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
                className="btn-secondary"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {interviews.map((interview) => (
          <div
            key={interview.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-medium mb-1">{interview.customerName}</h4>
                <div className="flex items-center text-sm text-gray-500">
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
                  className="text-sm border rounded p-1"
                >
                  <option value="scheduled">{t('interviews.status.scheduled')}</option>
                  <option value="completed">{t('interviews.status.completed')}</option>
                </select>
              </div>
            </div>

            {interview.script && (
              <div className="mb-4">
                <h5 className="font-medium mb-2">{t('interviews.script')}</h5>
                <div className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">
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
                        <div className="text-gray-600 dark:text-gray-300">{response}</div>
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
                        className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded"
                      >
                        {insight}
                      </div>
                    ))}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder={t('interviews.newInsight')}
                        className="flex-1 text-sm p-2 border rounded"
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
                        className="btn-secondary text-sm"
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