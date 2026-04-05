import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
  Flag,
  ArrowLeft
} from 'lucide-react';

// Imports dos componentes do projeto
import KanbanBoard from '../components/projects/KanbanBoard';
import ExperimentsList from '../components/projects/ExperimentsList';
import InterviewsList from '../components/projects/InterviewsList';
import ValidationChecklist from '../components/projects/ValidationChecklist';
import DashboardPageSkeleton from '../components/ui/DashboardPageSkeleton';

// Imports dos hooks e serviços
import { useProjects, useProject } from '../hooks/useProjects';
import { ProjectWithRelations } from '../services/projectsService';
import type { Hypothesis, Experiment, Interview } from '../services/projectsService';
import { diagnoseProjectsTable } from '../config/supabase';

// Interface adaptada para compatibilidade com componentes existentes
interface Project extends ProjectWithRelations {
  // Mantém compatibilidade com componentes que esperam string IDs
  id: string | number;
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
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { projects: dbProjects, loading, error, createProject, updateProject, deleteProject, refresh } = useProjects();
  const currentProjectId = projectId || null;
  const { project: selectedProjectData, loading: loadingProject } = useProject(currentProjectId);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    stage: 'ideation' as const,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Converter projetos do banco para formato compatível com componentes
  // Para a lista, não precisamos carregar todas as relações (melhor performance)
  const projects: Project[] = dbProjects.map((p, index) => {
    // Debug: Log do projeto antes da conversão
    if (index === 0) {
      console.log('First project before mapping:', {
        id: p.id,
        idType: typeof p.id,
        name: p.name,
        user_id: p.user_id,
        fullProject: p
      });
    }
    
    // O ID pode ser número (SERIAL) ou string (UUID) - aceitar ambos
    // Converter para string para compatibilidade com componentes
    const projectId = typeof p.id === 'number' ? p.id.toString() : p.id;
    
    // Validar se o ID existe
    if (!projectId) {
      console.error('⚠️ ID de projeto está vazio:', {
        id: p.id,
        type: typeof p.id,
        projectName: p.name
      });
    }
    
    return {
      ...p,
      id: projectId, // Já é string (UUID ou número convertido)
      hypotheses: [],
      experiments: [],
      interviews: [],
      tasks: [],
      customer_interviews: 0,
      validated_assumptions: 0,
      pivot_count: 0,
    };
  });

  // Converter projeto selecionado com todos os dados carregados
  const selectedProject: Project | null = selectedProjectData ? {
    ...selectedProjectData,
    id: typeof selectedProjectData.id === 'number' ? selectedProjectData.id.toString() : selectedProjectData.id,
    // Garantir que arrays estejam presentes
    hypotheses: selectedProjectData.hypotheses || [],
    experiments: selectedProjectData.experiments || [],
    interviews: selectedProjectData.interviews || [],
    tasks: selectedProjectData.tasks || [],
  } : null;
  
  const handleCreateProject = async () => {
    if (!newProject.name.trim()) {
      setErrorMessage('Nome do projeto é obrigatório');
      return;
    }

    try {
      setErrorMessage(null);
      await createProject({
        name: newProject.name,
        description: newProject.description || undefined,
        stage: newProject.stage,
      });
      setNewProject({
        name: '',
        description: '',
        stage: 'ideation',
      });
      setShowAddModal(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar projeto';
      setErrorMessage(errorMessage);
      console.error('Error creating project:', err);
      
      // Se for erro relacionado a tabela, RLS ou permissão, executar diagnóstico
      if (errorMessage.includes('tabela') || errorMessage.includes('migração') || 
          errorMessage.includes('permissão') || errorMessage.includes('RLS') ||
          errorMessage.includes('Permission denied')) {
        
        // Executar diagnóstico em background
        diagnoseProjectsTable().then(diagnostics => {
          console.log('Diagnóstico completo:', diagnostics);
          
          // Determinar mensagem baseada no diagnóstico
          let diagnosticMessage = '';
          if (diagnostics.tableExists?.exists === false) {
            diagnosticMessage = 'A tabela "projects" não foi encontrada no banco de dados.';
          } else if (diagnostics.tableExists?.error?.includes('Permission denied') || 
                     diagnostics.tableExists?.error?.includes('RLS')) {
            diagnosticMessage = 'A tabela existe, mas as políticas de segurança (RLS) estão bloqueando o acesso.';
          } else if (!diagnostics.authentication?.authenticated) {
            diagnosticMessage = 'Você não está autenticado. Por favor, faça login novamente.';
          } else {
            diagnosticMessage = 'Erro ao acessar a tabela. Verifique o console para mais detalhes.';
          }
          
          setTimeout(() => {
            alert(
              '⚠️ Erro ao Criar Projeto\n\n' +
              errorMessage + '\n\n' +
              '📊 Diagnóstico:\n' +
              diagnosticMessage + '\n\n' +
              '💡 Soluções:\n' +
              '1. Verifique se a migração foi executada corretamente no Supabase\n' +
              '2. Verifique as políticas RLS (Row Level Security) no Supabase Dashboard\n' +
              '3. Verifique se você está autenticado corretamente\n' +
              '4. Veja o console do navegador (F12) para mais detalhes técnicos'
            );
          }, 500);
        }).catch(diagError => {
          console.error('Erro ao executar diagnóstico:', diagError);
        });
      }
    }
  };

  const handleDeleteProject = async (id: string | number) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return;
    
    try {
      // O ID pode ser número (SERIAL) ou string (UUID) - usar diretamente
      const projectId: number | string = id;
      
      // Validar se o ID existe
      if (!projectId || (typeof projectId === 'number' && (isNaN(projectId) || projectId <= 0))) {
        throw new Error(`ID de projeto inválido: ${id}`);
      }
      
      console.log('Deleting project with ID:', projectId, 'Type:', typeof projectId);
      await deleteProject(projectId);
      
      // Comparar IDs para fechar modal se necessário
      if (currentProjectId) {
        const selectedIdStr = typeof currentProjectId === 'number' ? currentProjectId.toString() : currentProjectId;
        const deleteIdStr = typeof projectId === 'number' ? projectId.toString() : projectId;
        
        if (selectedIdStr === deleteIdStr) {
          navigate('/dashboard/projects');
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao excluir projeto';
      setErrorMessage(errorMsg);
      console.error('Error deleting project:', err);
      console.error('ID recebido:', id, 'Tipo:', typeof id, 'Valor completo:', JSON.stringify(id));
    }
  };

  const handleViewDetails = (project: Project) => {
    // O ID pode ser número (SERIAL) ou string (UUID) - aceitar ambos
    const projectId: number | string = project.id;
    
    // Validar se o ID existe
    if (!projectId || (typeof projectId === 'number' && (isNaN(projectId) || projectId <= 0))) {
      console.error('ID de projeto inválido ao visualizar detalhes:', project.id, 'Tipo:', typeof project.id);
      setErrorMessage(`ID de projeto inválido: ${project.id}`);
      return;
    }
    
    console.log('Viewing project details with ID:', projectId, 'Type:', typeof projectId);
    navigate(`/dashboard/projects/${projectId}`);
  };

  const handleUpdateProject = async (updatedProject: Project) => {
    try {
      // O ID pode ser número (SERIAL) ou string (UUID) - usar diretamente
      const projectId: number | string = updatedProject.id;
      
      // Validar se o ID existe
      if (!projectId || (typeof projectId === 'number' && (isNaN(projectId) || projectId <= 0))) {
        throw new Error(`ID de projeto inválido: ${updatedProject.id}`);
      }
      
      await updateProject(projectId, {
        name: updatedProject.name,
        description: updatedProject.description || undefined,
        stage: updatedProject.stage,
        progress: updatedProject.progress,
        validation_score: updatedProject.validation_score,
      });
      
      // Refresh project data se for o projeto selecionado
      if (currentProjectId) {
        const selectedIdStr = typeof currentProjectId === 'number' ? currentProjectId.toString() : currentProjectId;
        const updateIdStr = typeof projectId === 'number' ? projectId.toString() : projectId;
        if (selectedIdStr === updateIdStr) {
          refresh();
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao atualizar projeto';
      setErrorMessage(errorMsg);
      console.error('Error updating project:', err);
      console.error('ID recebido:', updatedProject.id, 'Tipo:', typeof updatedProject.id);
    }
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

  if (loading && projects.length === 0) {
    return <DashboardPageSkeleton cards={4} columns={2} />;
  }

  if (currentProjectId) {
    if (loadingProject) {
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

    if (!selectedProject) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="container-custom py-8 space-y-6">
            <button
              onClick={() => navigate('/dashboard/projects')}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para projetos
            </button>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8 text-center">
              <h1 className="text-2xl font-bold mb-2">Projeto nao encontrado</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Nao foi possivel carregar este projeto.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        <Helmet>
          <title>{selectedProject.name} - Projeto - Orientohub</title>
        </Helmet>

        <ProjectDetailsPage
          project={selectedProject}
          onBack={() => navigate('/dashboard/projects')}
          onDelete={() => handleDeleteProject(selectedProject.id)}
          getStageInfo={getStageInfo}
          getValidationHealthColor={getValidationHealthColor}
          getValidationHealthLabel={getValidationHealthLabel}
          onUpdate={handleUpdateProject}
        />
      </>
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

            {/* Error Message */}
            {errorMessage && (
              <div className="w-full lg:w-auto p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <p className="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
                  <button
                    onClick={() => setErrorMessage(null)}
                    className="ml-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

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
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
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
      className="group bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 overflow-hidden transition-all duration-300 hover:shadow-xl"
    >
      {/* Header */}
      <div className="relative h-24 bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 overflow-hidden border-b-2 border-gray-200 dark:border-gray-700">
        <div className="absolute inset-0 opacity-40">
          <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${stageInfo.color} rounded-full blur-3xl`} />
        </div>
        
        <div className="relative z-10 p-4 flex items-start justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-11 h-11 ${stageInfo.bgColor} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
              <StageIcon className={`w-5 h-5 bg-gradient-to-br ${stageInfo.color} bg-clip-text`} style={{ WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{project.name}</h3>
              <span className={`inline-block bg-gradient-to-r ${stageInfo.color} text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg`}>
                {stageInfo.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3.5">
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {project.description}
        </p>

        {/* Validation Health */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
              <Target className={`w-4 h-4 ${getValidationHealthColor(validationScore)}`} />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Status de Validacao</p>
              <p className={`text-base font-bold ${getValidationHealthColor(validationScore)}`}>
                {getValidationHealthLabel(validationScore)} ({validationScore}%)
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { icon: CheckSquare, label: 'Hipóteses', value: `${project.hypotheses.filter(h => h.validated).length}/${project.hypotheses.length}`, color: 'text-green-500' },
            { icon: FlaskConical, label: 'Experimentos', value: project.experiments.length, color: 'text-blue-500' },
            { icon: MessageSquare, label: 'Entrevistas', value: project.customer_interviews, color: 'text-purple-500' }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="text-center p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <Icon className={`w-4 h-4 ${stat.color} mx-auto mb-1`} />
                <p className="text-[11px] text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-base font-bold">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-gray-600 dark:text-gray-400">Progresso Geral</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">{project.progress}%</span>
          </div>
          <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
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
            <div className="flex items-center gap-2 mb-1.5">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                Proximas Acoes
              </p>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              {project.tasks.filter(t => t.status !== 'done').length} tarefa{project.tasks.filter(t => t.status !== 'done').length > 1 ? 's' : ''} pendente{project.tasks.filter(t => t.status !== 'done').length > 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onViewDetails}
            className="flex-1 px-3.5 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Ver Detalhes
          </button>
          
          <button
            onClick={onDelete}
            className="px-3 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl transition-all"
          >
            <Trash2 className="w-4 h-4" />
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

  const fieldClassName = "w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors";

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
                className={fieldClassName}
                placeholder="Ex: App de Delivery para Pets"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Descrição *</label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                rows={3}
                className={fieldClassName}
                placeholder="Descreva sua ideia em poucas palavras..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Estágio Atual</label>
              <select
                value={newProject.stage}
                onChange={(e) => setNewProject({ ...newProject, stage: e.target.value })}
                className={fieldClassName}
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
interface ProjectDetailsPageProps {
  project: Project;
  onBack: () => void;
  onDelete: () => void;
  getStageInfo: (stage: Project['stage']) => any;
  getValidationHealthColor: (score: number) => string;
  getValidationHealthLabel: (score: number) => string;
  onUpdate: (updatedProject: Project) => void;
}

const ProjectDetailsPage = ({ 
  project, 
  onBack,
  onDelete,
  getStageInfo,
  getValidationHealthColor,
  getValidationHealthLabel,
  onUpdate
}: ProjectDetailsPageProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const activeTab = (
    tabParam === 'kanban' ||
    tabParam === 'validation' ||
    tabParam === 'experiments' ||
    tabParam === 'interviews'
  ) ? tabParam : 'overview';
  const [localProject, setLocalProject] = useState(project);

  useEffect(() => {
    setLocalProject(project);
  }, [project]);

  const stageInfo = getStageInfo(localProject.stage);
  const StageIcon = stageInfo.icon;

  const handleUpdateProject = (updates: Partial<Project>) => {
    const updatedProject = { ...localProject, ...updates };
    setLocalProject(updatedProject);

    const shouldPersistProject =
      'name' in updates ||
      'description' in updates ||
      'stage' in updates ||
      'progress' in updates ||
      'validation_score' in updates;

    if (shouldPersistProject) {
      onUpdate(updatedProject);
    }
  };

  const handleTabChange = (tab: 'overview' | 'kanban' | 'validation' | 'experiments' | 'interviews') => {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      if (tab === 'overview') {
        nextParams.delete('tab');
      } else {
        nextParams.set('tab', tab);
      }
      return nextParams;
    }, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container-custom py-6 md:py-8 space-y-6">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para projetos
          </button>

          <button
            onClick={onDelete}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Excluir projeto
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl w-full min-h-[calc(100vh-12rem)] overflow-hidden border-2 border-gray-200 dark:border-gray-700 flex flex-col"
        >
          {/* Header */}
          <div className="relative min-h-[136px] bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 overflow-hidden border-b-2 border-gray-200 dark:border-gray-700">
            <div className="absolute inset-0 opacity-40">
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${stageInfo.color} rounded-full blur-3xl`} />
            </div>
            
            <div className="relative z-10 p-5 md:p-6 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 min-w-0">
                <div className={`w-12 h-12 md:w-14 md:h-14 ${stageInfo.bgColor} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <StageIcon className={`w-7 h-7 bg-gradient-to-br ${stageInfo.color} bg-clip-text`} style={{ WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{localProject.name}</h2>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 line-clamp-2 max-w-4xl">{localProject.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className={`inline-flex items-center rounded-full bg-gradient-to-r ${stageInfo.color} text-white text-xs font-semibold px-3 py-1`}>
                      {stageInfo.label}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 text-xs font-medium px-3 py-1 border border-gray-200 dark:border-gray-600">
                      Progresso: {localProject.progress}%
                    </span>
                    <span className="inline-flex items-center rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 text-xs font-medium px-3 py-1 border border-gray-200 dark:border-gray-600">
                      Validacao: {localProject.validation_score}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex-shrink-0">
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
                    onClick={() => handleTabChange(tab.id as 'overview' | 'kanban' | 'validation' | 'experiments' | 'interviews')}
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
          <div className="flex-1 min-h-0 overflow-y-auto p-5 md:p-6">
            {activeTab === 'overview' && (
              <div className="space-y-5">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
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
                      <div key={i} className={`p-3.5 ${stat.bgColor} rounded-xl text-center border-2 border-gray-200 dark:border-gray-700`}>
                        <Icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                        <p className="text-xl md:text-2xl font-bold mb-1">{stat.value}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-4">
                  {/* Validation Health */}
                  <div className="p-5 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-base md:text-lg mb-2">Saude da Validacao</h3>
                        <p className={`text-2xl md:text-3xl font-bold ${getValidationHealthColor(localProject.validation_score)}`}>
                          {getValidationHealthLabel(localProject.validation_score)} ({localProject.validation_score}%)
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          Acompanhe o nivel de validacao do projeto e identifique rapidamente onde precisamos evoluir.
                        </p>
                      </div>
                      <div className="w-24 h-24 md:w-28 md:h-28 flex-shrink-0">
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
                  <div className="p-5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold">Progresso Geral</h3>
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{localProject.progress}%</span>
                      </div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all"
                          style={{ width: `${localProject.progress}%` }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="rounded-xl bg-gray-50 dark:bg-gray-700/50 p-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Hipoteses</p>
                          <p className="font-semibold">{localProject.hypotheses.length}</p>
                        </div>
                        <div className="rounded-xl bg-gray-50 dark:bg-gray-700/50 p-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tarefas</p>
                          <p className="font-semibold">{localProject.tasks.length}</p>
                        </div>
                        <div className="rounded-xl bg-gray-50 dark:bg-gray-700/50 p-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Experimentos</p>
                          <p className="font-semibold">{localProject.experiments.length}</p>
                        </div>
                        <div className="rounded-xl bg-gray-50 dark:bg-gray-700/50 p-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Entrevistas</p>
                          <p className="font-semibold">{localProject.customer_interviews}</p>
                        </div>
                      </div>
                    </div>
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
                  setLocalProject((currentProject) => ({
                    ...currentProject,
                    hypotheses: updatedProject.hypotheses,
                  }));
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
      </div>
    </div>
  );
};

export default ProjectsPage;
