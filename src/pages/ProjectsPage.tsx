import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Lightbulb, Target, CheckSquare, Calendar, Users, 
  PlusCircle, FileText, LineChart 
} from 'lucide-react';
import ProjectModal from '../components/modals/ProjectModal';
import KanbanBoard from '../components/projects/KanbanBoard';
import ExperimentsList from '../components/projects/ExperimentsList';
import InterviewsList from '../components/projects/InterviewsList';
import ValidationChecklist from '../components/projects/ValidationChecklist';

interface Project {
  id: string;
  name: string;
  description: string;
  stage: 'ideation' | 'validation' | 'mvp' | 'traction' | 'growth';
  progress: number;
  hypotheses: Hypothesis[];
  experiments: Experiment[];
  interviews: Interview[];
  tasks: Task[];
}

interface Hypothesis {
  id: string;
  statement: string;
  validated: boolean;
  experiments: string[];
}

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

interface Interview {
  id: string;
  customerName: string;
  date: string;
  script: string;
  responses: Record<string, string>;
  insights: string[];
  status: 'scheduled' | 'completed';
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'doing' | 'done';
  dueDate: string;
  assignee?: string;
}

const ProjectsPage = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'validation' | 'kanban' | 'experiments' | 'interviews'>('overview');

  const handleCreateProject = (projectData: Omit<Project, 'id' | 'progress' | 'hypotheses' | 'experiments' | 'interviews' | 'tasks'>) => {
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      progress: 0,
      hypotheses: [],
      experiments: [],
      interviews: [],
      tasks: []
    };
    setProjects([...projects, newProject]);
    setShowProjectModal(false);
  };

  const calculateProgress = (project: Project) => {
    const validatedHypotheses = project.hypotheses.filter(h => h.validated).length;
    const totalHypotheses = project.hypotheses.length;
    const completedExperiments = project.experiments.filter(e => e.status === 'completed').length;
    const totalExperiments = project.experiments.length;
    const completedTasks = project.tasks.filter(t => t.status === 'done').length;
    const totalTasks = project.tasks.length;
    const completedInterviews = project.interviews.filter(i => i.status === 'completed').length;
    const totalInterviews = project.interviews.length;

    const metrics = [
      totalHypotheses > 0 ? (validatedHypotheses / totalHypotheses) : 0,
      totalExperiments > 0 ? (completedExperiments / totalExperiments) : 0,
      totalTasks > 0 ? (completedTasks / totalTasks) : 0,
      totalInterviews > 0 ? (completedInterviews / totalInterviews) : 0
    ];

    const validMetrics = metrics.filter(m => m > 0);
    const progress = validMetrics.length > 0
      ? Math.round((validMetrics.reduce((a, b) => a + b) / validMetrics.length) * 100)
      : 0;

    return progress;
  };

  const handleProjectUpdate = (updatedProject: Project) => {
    const progress = calculateProgress(updatedProject);
    const finalProject = { ...updatedProject, progress };
    
    setProjects(projects.map(p => 
      p.id === updatedProject.id ? finalProject : p
    ));
  };

  return (
    <>
      <Helmet>
        <title>{t('projects.title')} | Orientohub</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t('projects.title')}</h1>
          <button 
            onClick={() => setShowProjectModal(true)}
            className="btn-primary"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            {t('projects.new')}
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
              {t('projects.empty.title')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {t('projects.empty.description')}
            </p>
            <button 
              onClick={() => setShowProjectModal(true)}
              className="btn-primary"
            >
              {t('projects.empty.cta')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {project.description}
                </p>
                
                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{t(`projects.stages.${project.stage}`)}</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <CheckSquare className="w-4 h-4 mr-2 text-primary-500" />
                      <span>{project.hypotheses.filter(h => h.validated).length}/{project.hypotheses.length} validadas</span>
                    </div>
                    <div className="flex items-center">
                      <Target className="w-4 h-4 mr-2 text-primary-500" />
                      <span>{project.experiments.length} experimentos</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedProject(project)}
                    className="w-full btn-secondary"
                  >
                    {t('projects.manage')}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSelectedProject(null)} />
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">{selectedProject.name}</h2>
                  <button onClick={() => setSelectedProject(null)} className="text-gray-500">×</button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                  <nav className="-mb-px flex space-x-8">
                    {(['overview', 'validation', 'kanban', 'experiments', 'interviews'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`
                          py-4 px-1 border-b-2 font-medium text-sm
                          ${activeTab === tab
                            ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }
                        `}
                      >
                        {t(`projects.tabs.${tab}`)}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="py-4">
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <CheckSquare className="w-4 h-4 mr-2 text-primary-500" />
                            <h4 className="text-sm font-medium">{t('projects.overview.hypotheses')}</h4>
                          </div>
                          <p className="text-2xl font-bold">
                            {selectedProject.hypotheses.filter(h => h.validated).length}/{selectedProject.hypotheses.length}
                          </p>
                          <p className="text-sm text-gray-500">Validadas</p>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <Target className="w-4 h-4 mr-2 text-primary-500" />
                            <h4 className="text-sm font-medium">{t('projects.overview.experiments')}</h4>
                          </div>
                          <p className="text-2xl font-bold">
                            {selectedProject.experiments.filter(e => e.status === 'completed').length}/{selectedProject.experiments.length}
                          </p>
                          <p className="text-sm text-gray-500">Concluídos</p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <Users className="w-4 h-4 mr-2 text-primary-500" />
                            <h4 className="text-sm font-medium">{t('projects.overview.interviews')}</h4>
                          </div>
                          <p className="text-2xl font-bold">
                            {selectedProject.interviews.filter(i => i.status === 'completed').length}/{selectedProject.interviews.length}
                          </p>
                          <p className="text-sm text-gray-500">Realizadas</p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <CheckSquare className="w-4 h-4 mr-2 text-primary-500" />
                            <h4 className="text-sm font-medium">{t('projects.overview.tasks')}</h4>
                          </div>
                          <p className="text-2xl font-bold">
                            {selectedProject.tasks.filter(t => t.status === 'done').length}/{selectedProject.tasks.length}
                          </p>
                          <p className="text-sm text-gray-500">Concluídas</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium mb-2">{t('projects.overview.progress')}</h4>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                          <div
                            className="bg-primary-500 h-4 rounded-full"
                            style={{ width: `${selectedProject.progress}%` }}
                          />
                        </div>
                        <div className="mt-2 flex justify-between text-sm text-gray-500">
                          <span>{t('projects.overview.started')}</span>
                          <span>{selectedProject.progress}% {t('projects.overview.complete')}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'validation' && (
                    <ValidationChecklist
                      project={selectedProject}
                      onUpdate={(updatedProject) => handleProjectUpdate(updatedProject)}
                    />
                  )}

                  {activeTab === 'kanban' && (
                    <KanbanBoard
                      tasks={selectedProject.tasks}
                      onUpdate={(updatedTasks) => {
                        const updatedProject = {
                          ...selectedProject,
                          tasks: updatedTasks
                        };
                        handleProjectUpdate(updatedProject);
                      }}
                    />
                  )}

                  {activeTab === 'experiments' && (
                    <ExperimentsList
                      experiments={selectedProject.experiments}
                      hypotheses={selectedProject.hypotheses}
                      onUpdate={(updatedExperiments) => {
                        const updatedProject = {
                          ...selectedProject,
                          experiments: updatedExperiments
                        };
                        handleProjectUpdate(updatedProject);
                      }}
                    />
                  )}

                  {activeTab === 'interviews' && (
                    <InterviewsList
                      interviews={selectedProject.interviews}
                      onUpdate={(updatedInterviews) => {
                        const updatedProject = {
                          ...selectedProject,
                          interviews: updatedInterviews
                        };
                        handleProjectUpdate(updatedProject);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onSave={handleCreateProject}
      />
    </>
  );
};

export default ProjectsPage;
