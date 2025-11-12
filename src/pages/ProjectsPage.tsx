import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, 
  Target, 
  CheckSquare, 
  Users, 
  PlusCircle, 
  LineChart,
  X,
  Rocket,
  Brain,
  Sparkles,
  TrendingUp,
  MessageSquare,
  FlaskConical,
  Calendar,
  Clock,
  Eye,
  Trash2,
  CheckCircle,
  AlertTriangle,
  BarChart2,
  Bug,
  Flag
} from 'lucide-react';

// Imports dos componentes do projeto
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
  created_at: string;
  hypotheses: Hypothesis[];
  experiments: Experiment[];
  interviews: Interview[];
  tasks: Task[];
  validation_score: number;
  customer_interviews: number;
  validated_assumptions: number;
  pivot_count: number;
}

interface Hypothesis {
  id: string;
  statement: string;
  validated: boolean;
  confidence: number;
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
  success_rate?: number;
}

interface Interview {
  id: string;
  customerName: string;
  date: string;
  script: string;
  responses: Record<string, string>;
  insights: string[];
  status: 'scheduled' | 'completed';
  sentiment?: 'positive' | 'neutral' | 'negative';
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'doing' | 'done';
  dueDate: string;
  assignee?: string;
  priority: 'low' | 'medium' | 'high';
}

const ProjectsPage = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    stage: 'ideation' as const,
    target_customer: '',
    problem_statement: '',
    solution_hypothesis: ''
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    // Mock data
    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'App de Delivery para Pets',
        description: 'Plataforma para conectar tutores de pets a serviços de entrega de ração e produtos',
        stage: 'validation',
        progress: 65,
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        validation_score: 72,
        customer_interviews: 12,
        validated_assumptions: 8,
        pivot_count: 1,
        hypotheses: [
          { 
            id: '1', 
            statement: 'Tutores preferem comprar online do que em lojas físicas', 
            validated: true,
            confidence: 85,
            experiments: ['exp1', 'exp2'] 
          },
          { 
            id: '2', 
            statement: 'Clientes pagariam 15% a mais por entrega rápida', 
            validated: false,
            confidence: 45,
            experiments: ['exp3'] 
          }
        ],
        experiments: [
          {
            id: 'exp1',
            title: 'Landing Page com pré-cadastro',
            hypothesis: 'Tutores preferem comprar online',
            method: 'Landing page + Google Ads',
            results: '150 inscrições em 7 dias, taxa de conversão 8%',
            learnings: 'Público está interessado, mas preço é sensível',
            status: 'completed',
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            success_rate: 75
          }
        ],
        interviews: [
          {
            id: 'int1',
            customerName: 'Maria Silva',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            script: 'Roteiro sobre hábitos de compra',
            responses: {
              'frequencia': 'Semanal',
              'gasto_medio': 'R$ 200/mês'
            },
            insights: [
              'Prefere comprar em grandes quantidades',
              'Valoriza entrega rápida',
              'Precisa de variedade de marcas'
            ],
            status: 'completed',
            sentiment: 'positive'
          }
        ],
        tasks: [
          {
            id: 'task1',
            title: 'Validar precificação com 10 clientes',
            description: 'Realizar entrevistas para entender disposição a pagar',
            status: 'doing',
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'high'
          },
          {
            id: 'task2',
            title: 'Criar protótipo no Figma',
            description: 'Wireframes de baixa fidelidade',
            status: 'done',
            dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'medium'
          },
          {
            id: 'task3',
            title: 'Analisar concorrentes',
            description: 'Mapear 5 principais concorrentes',
            status: 'todo',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'medium'
          }
        ]
      }
    ];

    setProjects(mockProjects);
  };

  const handleCreateProject = () => {
    if (!newProject.name || !newProject.description) return;

    const project: Project = {
      id: `proj-${Date.now()}`,
      name: newProject.name,
      description: newProject.description,
      stage: newProject.stage,
      progress: 0,
      created_at: new Date().toISOString(),
      validation_score: 0,
      customer_interviews: 0,
      validated_assumptions: 0,
      pivot_count: 0,
      hypotheses: [],
      experiments: [],
      interviews: [],
      tasks: []
    };

    setProjects([...projects, project]);
    setNewProject({
      name: '',
      description: '',
      stage: 'ideation',
      target_customer: '',
      problem_statement: '',
      solution_hypothesis: ''
    });
    setShowAddModal(false);
  };

  const handleDeleteProject = (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return;
    setProjects(projects.filter(p => p.id !== id));
    if (selectedProject?.id === id) {
      setShowDetailsModal(false);
      setSelectedProject(null);
    }
  };

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setShowDetailsModal(true);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(projects.map(p => 
      p.id === updatedProject.id ? updatedProject : p
    ));
    setSelectedProject(updatedProject);
  };

  const getStageInfo = (stage: Project['stage']) => {
    const stages = {
      ideation: { label: 'Ideação', color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-500/10', icon: Lightbulb },
      validation: { label: 'Validação', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-500/10', icon: Target },
      mvp: { label: 'MVP', color: 'from-yellow-500 to-yellow-600', bgColor: 'bg-yellow-500/10', icon: Rocket },
      traction: { label: 'Tração', color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-500/10', icon: TrendingUp },
      growth: { label: 'Crescimento', color: 'from-green-500 to-green-600', bgColor: 'bg-green-500/10', icon: LineChart }
    };
    return stages[stage];
  };

  const getValidationHealthColor = (score: number) => {
    if (score >= 75) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getValidationHealthLabel = (score: number) => {
    if (score >= 75) return 'Bem Validado';
    if (score >= 50) return 'Em Validação';
    return 'Precisa Validar';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Meus Projetos - Orientohub</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container-custom py-8 space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold flex items-center gap-2">
                    Meus Projetos
                    <Brain className="w-6 h-6 text-blue-500" />
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Valide suas ideias antes de construir
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl">
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  💡 <strong>Projetos</strong> são ideias em validação. Quando validadas, vire <strong>Solução</strong>!
                </p>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30"
              >
                <PlusCircle className="w-5 h-5" />
                Novo Projeto
              </button>
            </div>
          </motion.div>

          {/* Empty State */}
          {projects.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="w-16 h-16 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Nenhum projeto criado</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Comece criando seu primeiro projeto de validação. Teste suas hipóteses, faça entrevistas e descubra se sua ideia tem mercado!
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all inline-flex items-center gap-2 shadow-lg shadow-blue-500/30"
              >
                <Lightbulb className="w-5 h-5" />
                Criar Primeiro Projeto
              </button>

              {/* Diferença entre Projeto e Solução */}
              <div className="mt-12 max-w-4xl mx-auto">
                <h3 className="text-lg font-bold mb-6">Qual a diferença?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl text-left">
                    <div className="flex items-center gap-3 mb-4">
                      <Lightbulb className="w-8 h-8 text-blue-500" />
                      <h4 className="text-xl font-bold">Projeto</h4>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Validação de ideias e hipóteses</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Entrevistas com clientes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Experimentos e testes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Sem código ainda</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Foco em aprendizado</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-200 dark:border-primary-800 rounded-xl text-left">
                    <div className="flex items-center gap-3 mb-4">
                      <Rocket className="w-8 h-8 text-primary-500" />
                      <h4 className="text-xl font-bold">Solução</h4>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                        <span>Produto em desenvolvimento</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                        <span>Código no GitHub</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                        <span>Deploy e infraestrutura</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                        <span>Usuários reais</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                        <span>Foco em crescimento</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Overview Stats */}
          {projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { 
                  label: 'Total de Projetos', 
                  value: projects.length, 
                  icon: Lightbulb,
                  color: 'from-blue-500 to-blue-600',
                  bgColor: 'bg-blue-500/10'
                },
                { 
                  label: 'Em Validação', 
                  value: projects.filter(p => p.stage === 'validation').length,
                  icon: Target,
                  color: 'from-purple-500 to-purple-600',
                  bgColor: 'bg-purple-500/10'
                },
                { 
                  label: 'Entrevistas Feitas', 
                  value: projects.reduce((acc, p) => acc + p.customer_interviews, 0),
                  icon: MessageSquare,
                  color: 'from-green-500 to-green-600',
                  bgColor: 'bg-green-500/10'
                },
                { 
                  label: 'Hipóteses Validadas', 
                  value: projects.reduce((acc, p) => acc + p.validated_assumptions, 0),
                  icon: CheckSquare,
                  color: 'from-primary-400 to-primary-600',
                  bgColor: 'bg-primary-500/10'
                }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-6 h-6 bg-gradient-to-br ${stat.color} bg-clip-text`} style={{ WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Projects Grid */}
          {projects.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onViewDetails={() => handleViewDetails(project)}
                  onDelete={() => handleDeleteProject(project.id)}
                  getStageInfo={getStageInfo}
                  getValidationHealthColor={getValidationHealthColor}
                  getValidationHealthLabel={getValidationHealthLabel}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Project Modal */}
      <AddProjectModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        newProject={newProject}
        setNewProject={setNewProject}
        onSave={handleCreateProject}
      />

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          show={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedProject(null);
          }}
          getStageInfo={getStageInfo}
          getValidationHealthColor={getValidationHealthColor}
          getValidationHealthLabel={getValidationHealthLabel}
          onUpdate={handleUpdateProject}
        />
      )}
    </>
  );
};

// Project Card Component
interface ProjectCardProps {
  project: Project;
  index: number;
  onViewDetails: () => void;
  onDelete: () => void;
  getStageInfo: (stage: Project['stage']) => any;
  getValidationHealthColor: (score: number) => string;
  getValidationHealthLabel: (score: number) => string;
}

const ProjectCard = ({ 
  project, 
  index, 
  onViewDetails, 
  onDelete,
  getStageInfo,
  getValidationHealthColor,
  getValidationHealthLabel
}: ProjectCardProps) => {
  const stageInfo = getStageInfo(project.stage);
  const StageIcon = stageInfo.icon;
  const validationScore = project.validation_score;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 overflow-hidden transition-all duration-300 hover:shadow-2xl"
    >
      {/* Header */}
      <div className="relative h-32 bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 overflow-hidden border-b-2 border-gray-200 dark:border-gray-700">
        <div className="absolute inset-0 opacity-40">
          <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${stageInfo.color} rounded-full blur-3xl`} />
        </div>
        
        <div className="relative z-10 p-6 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 ${stageInfo.bgColor} rounded-xl flex items-center justify-center shadow-lg`}>
              <StageIcon className={`w-7 h-7 bg-gradient-to-br ${stageInfo.color} bg-clip-text`} style={{ WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{project.name}</h3>
              <span className={`inline-block bg-gradient-to-r ${stageInfo.color} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                {stageInfo.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
          {project.description}
        </p>

        {/* Validation Health */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
              <Target className={`w-5 h-5 ${getValidationHealthColor(validationScore)}`} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Status de Validação</p>
              <p className={`text-lg font-bold ${getValidationHealthColor(validationScore)}`}>
                {getValidationHealthLabel(validationScore)} ({validationScore}%)
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: CheckSquare, label: 'Hipóteses', value: `${project.hypotheses.filter(h => h.validated).length}/${project.hypotheses.length}`, color: 'text-green-500' },
            { icon: FlaskConical, label: 'Experimentos', value: project.experiments.length, color: 'text-blue-500' },
            { icon: MessageSquare, label: 'Entrevistas', value: project.customer_interviews, color: 'text-purple-500' }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <Icon className={`w-5 h-5 ${stat.color} mx-auto mb-1`} />
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-lg font-bold">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-400">Progresso Geral</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">{project.progress}%</span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              transition={{ duration: 1, delay: 0.2 + index * 0.05 }}
            />
          </div>
        </div>

        {/* Next Actions */}
        {project.tasks.filter(t => t.status !== 'done').length > 0 && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                Próximas Ações
              </p>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {project.tasks.filter(t => t.status !== 'done').length} tarefa{project.tasks.filter(t => t.status !== 'done').length > 1 ? 's' : ''} pendente{project.tasks.filter(t => t.status !== 'done').length > 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onViewDetails}
            className="flex-1 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Ver Detalhes
          </button>
          
          <button
            onClick={onDelete}
            className="px-4 py-2.5 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl transition-all"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Add Project Modal
interface AddProjectModalProps {
  show: boolean;
  onClose: () => void;
  newProject: any;
  setNewProject: (project: any) => void;
  onSave: () => void;
}

const AddProjectModal = ({ show, onClose, newProject, setNewProject, onSave }: AddProjectModalProps) => {
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Novo Projeto</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Comece validando sua ideia
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Nome do Projeto *</label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-0 bg-white dark:bg-gray-900"
                placeholder="Ex: App de Delivery para Pets"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Descrição *</label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-0 bg-white dark:bg-gray-900"
                placeholder="Descreva sua ideia em poucas palavras..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Estágio Atual</label>
              <select
                value={newProject.stage}
                onChange={(e) => setNewProject({ ...newProject, stage: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-0 bg-white dark:bg-gray-900"
              >
                <option value="ideation">💡 Ideação</option>
                <option value="validation">🎯 Validação</option>
                <option value="mvp">🚀 MVP</option>
                <option value="traction">📈 Tração</option>
                <option value="growth">🌱 Crescimento</option>
              </select>
            </div>

            <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={onSave}
                disabled={!newProject.name || !newProject.description}
                className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-5 h-5" />
                Criar Projeto
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Project Details Modal
interface ProjectDetailsModalProps {
  project: Project;
  show: boolean;
  onClose: () => void;
  getStageInfo: (stage: Project['stage']) => any;
  getValidationHealthColor: (score: number) => string;
  getValidationHealthLabel: (score: number) => string;
  onUpdate: (updatedProject: Project) => void;
}

const ProjectDetailsModal = ({ 
  project, 
  show, 
  onClose,
  getStageInfo,
  getValidationHealthColor,
  getValidationHealthLabel,
  onUpdate
}: ProjectDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'kanban' | 'validation' | 'experiments' | 'interviews'>('overview');
  const [localProject, setLocalProject] = useState(project);
  
  if (!show) return null;

  const stageInfo = getStageInfo(localProject.stage);
  const StageIcon = stageInfo.icon;

  const handleUpdateProject = (updates: Partial<Project>) => {
    const updatedProject = { ...localProject, ...updates };
    setLocalProject(updatedProject);
    onUpdate(updatedProject);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border-2 border-gray-200 dark:border-gray-700"
        >
          {/* Header */}
          <div className="relative h-32 bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 overflow-hidden border-b-2 border-gray-200 dark:border-gray-700">
            <div className="absolute inset-0 opacity-40">
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${stageInfo.color} rounded-full blur-3xl`} />
            </div>
            
            <div className="relative z-10 p-6 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 ${stageInfo.bgColor} rounded-xl flex items-center justify-center shadow-lg`}>
                  <StageIcon className={`w-7 h-7 bg-gradient-to-br ${stageInfo.color} bg-clip-text`} style={{ WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{localProject.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{localProject.description}</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-900 dark:text-white" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex gap-1 p-2 overflow-x-auto">
              {[
                { id: 'overview', label: 'Visão Geral', icon: BarChart2 },
                { id: 'kanban', label: 'Kanban', icon: CheckSquare },
                { id: 'validation', label: 'Validação', icon: Target },
                { id: 'experiments', label: 'Experimentos', icon: FlaskConical },
                { id: 'interviews', label: 'Entrevistas', icon: MessageSquare }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { 
                      label: 'Hipóteses Validadas', 
                      value: `${localProject.hypotheses.filter(h => h.validated).length}/${localProject.hypotheses.length}`, 
                      icon: CheckSquare,
                      color: 'text-green-500',
                      bgColor: 'bg-green-500/10'
                    },
                    { 
                      label: 'Experimentos', 
                      value: localProject.experiments.length, 
                      icon: FlaskConical,
                      color: 'text-blue-500',
                      bgColor: 'bg-blue-500/10'
                    },
                    { 
                      label: 'Entrevistas', 
                      value: localProject.customer_interviews, 
                      icon: MessageSquare,
                      color: 'text-purple-500',
                      bgColor: 'bg-purple-500/10'
                    },
                    { 
                      label: 'Tarefas Concluídas', 
                      value: `${localProject.tasks.filter(t => t.status === 'done').length}/${localProject.tasks.length}`, 
                      icon: CheckSquare,
                      color: 'text-primary-500',
                      bgColor: 'bg-primary-500/10'
                    }
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <div key={i} className={`p-4 ${stat.bgColor} rounded-xl text-center border-2 border-gray-200 dark:border-gray-700`}>
                        <Icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                        <p className="text-2xl font-bold mb-1">{stat.value}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Validation Health */}
                <div className="p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg mb-2">Saúde da Validação</h3>
                      <p className={`text-3xl font-bold ${getValidationHealthColor(localProject.validation_score)}`}>
                        {getValidationHealthLabel(localProject.validation_score)} ({localProject.validation_score}%)
                      </p>
                    </div>
                    <div className="w-32 h-32">
                      <svg className="transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="text-gray-200 dark:text-gray-700"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeDasharray={`${localProject.validation_score}, 100`}
                          className={getValidationHealthColor(localProject.validation_score)}
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold">Progresso Geral</h3>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{localProject.progress}%</span>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all"
                      style={{ width: `${localProject.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'kanban' && (
              <KanbanBoard
                tasks={localProject.tasks}
                onUpdate={(updatedTasks) => {
                  handleUpdateProject({ tasks: updatedTasks });
                }}
              />
            )}

            {activeTab === 'validation' && (
              <ValidationChecklist
                project={localProject}
                onUpdate={(updatedProject) => {
                  handleUpdateProject(updatedProject);
                }}
              />
            )}

            {activeTab === 'experiments' && (
              <ExperimentsList
                experiments={localProject.experiments}
                hypotheses={localProject.hypotheses}
                onUpdate={(updatedExperiments) => {
                  handleUpdateProject({ experiments: updatedExperiments });
                }}
              />
            )}

            {activeTab === 'interviews' && (
              <InterviewsList
                interviews={localProject.interviews}
                onUpdate={(updatedInterviews) => {
                  handleUpdateProject({ interviews: updatedInterviews });
                }}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectsPage;
