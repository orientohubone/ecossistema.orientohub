import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tooltip from '@radix-ui/react-tooltip';
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
  ArrowLeft,
  Pencil
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
import { solutionsService } from '../services/solutionsService';

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
  const [projectToConvert, setProjectToConvert] = useState<Project | null>(null);
  const [conversionData, setConversionData] = useState({ solution_url: '', git_url: '' });
  const [isConverting, setIsConverting] = useState(false);

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

  const handleOpenConversion = (project: Project) => {
    setProjectToConvert(project);
    setConversionData({ solution_url: '', git_url: '' });
    setErrorMessage(null);
  };

  const handleConvertProject = async () => {
    if (!projectToConvert || !conversionData.solution_url.trim()) return;

    const stageMap: Record<Project['stage'], 'Ideação' | 'Validação' | 'MVP' | 'Tração' | 'Crescimento'> = {
      ideation: 'Ideação',
      validation: 'Validação',
      mvp: 'MVP',
      traction: 'Tração',
      growth: 'Crescimento',
    };

    try {
      setIsConverting(true);
      setErrorMessage(null);

      await solutionsService.create({
        user_id: projectToConvert.user_id,
        name: projectToConvert.name,
        description: projectToConvert.description,
        solution_url: conversionData.solution_url.trim(),
        git_url: conversionData.git_url.trim() || null,
        stage: stageMap[projectToConvert.stage],
        logo_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(projectToConvert.name)}&background=FFD700&color=000&bold=true`,
      });

      setProjectToConvert(null);
      navigate('/dashboard/solutions');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Não foi possível converter o projeto em solução';
      setErrorMessage(message);
    } finally {
      setIsConverting(false);
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

      <div className="min-h-screen bg-[#0c121b]">
        <div className="container-custom py-8 space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#34455a] bg-[#151f2b]">
                  <Lightbulb className="h-6 w-6 text-primary-300" />
                </div>
                <div>
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-primary-300">Laboratório de validação</p>
                  <h1 className="flex items-center gap-2 text-3xl font-bold text-white">
                    Meus Projetos
                    <Brain className="h-6 w-6 text-primary-300" />
                  </h1>
                  <p className="text-[#9ba9bc]">
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
              <div className="hidden rounded-xl border border-[#34455a] bg-[#151f2b] px-4 py-2 lg:block">
                <p className="text-sm font-medium text-[#b8c4d4]">
                  <strong className="text-primary-300">Projetos</strong> são ideias em validação. Quando validadas, viram <strong className="text-primary-300">Soluções</strong>.
                </p>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-2.5 font-bold text-black transition-all hover:bg-primary-400"
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
              className="rounded-2xl border border-[#273548] bg-[#101722] p-8 text-center shadow-[0_12px_28px_rgba(0,0,0,0.16)] sm:p-12"
            >
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#34455a] bg-[#0c121b]">
                <Lightbulb className="h-9 w-9 text-primary-300" />
              </div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-primary-300">Seu ponto de partida</p>
              <h2 className="mb-3 text-2xl font-bold text-white">Transforme uma ideia em aprendizado real</h2>
              <p className="mx-auto mb-7 max-w-md text-sm leading-relaxed text-[#9ba9bc]">
                Comece criando seu primeiro projeto de validação. Teste suas hipóteses, faça entrevistas e descubra se sua ideia tem mercado!
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 font-bold text-black transition-all hover:bg-primary-400"
              >
                <Lightbulb className="w-5 h-5" />
                Criar Primeiro Projeto
              </button>

              {/* Diferença entre Projeto e Solução */}
              <div className="mx-auto mt-10 max-w-4xl">
                <h3 className="mb-5 text-lg font-bold text-white">Como funciona</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-2xl border border-[#34455a] bg-[#151f2b] p-5 text-left">
                    <div className="flex items-center gap-3 mb-4">
                      <Lightbulb className="h-7 w-7 text-blue-300" />
                      <h4 className="text-xl font-bold text-white">Projeto</h4>
                    </div>
                    <ul className="space-y-2 text-sm text-[#b8c4d4]">
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

                  <div className="rounded-2xl border border-[#34455a] bg-[#151f2b] p-5 text-left">
                    <div className="flex items-center gap-3 mb-4">
                      <Rocket className="h-7 w-7 text-primary-300" />
                      <h4 className="text-xl font-bold text-white">Solução</h4>
                    </div>
                    <ul className="space-y-2 text-sm text-[#b8c4d4]">
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
                    className="group rounded-2xl border border-[#273548] bg-[#101722] p-5 shadow-[0_12px_28px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-400/70 hover:shadow-[0_20px_38px_rgba(0,0,0,0.28)]"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#34455a] bg-[#0c121b] transition-transform group-hover:scale-105">
                        <Icon className={`h-5 w-5 ${stat.bgColor.includes('blue') ? 'text-blue-300' : stat.bgColor.includes('purple') ? 'text-purple-300' : stat.bgColor.includes('green') ? 'text-emerald-300' : 'text-primary-300'}`} />
                      </div>
                    </div>
                    <p className="mb-1 text-sm text-[#9ba9bc]">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
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
                  onConvert={() => handleOpenConversion(project)}
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

      <ConvertProjectModal
        project={projectToConvert}
        conversionData={conversionData}
        setConversionData={setConversionData}
        isConverting={isConverting}
        onClose={() => setProjectToConvert(null)}
        onSave={handleConvertProject}
      />
    </>
  );
};

// Project Card Component
interface ProjectCardProps {
  project: Project;
  index: number;
  onViewDetails: () => void;
  onConvert: () => void;
  onDelete: () => void;
  getStageInfo: (stage: Project['stage']) => any;
  getValidationHealthColor: (score: number) => string;
  getValidationHealthLabel: (score: number) => string;
}

const ProjectCard = ({ 
  project, 
  index, 
  onViewDetails, 
  onConvert,
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
      className="group overflow-hidden rounded-2xl border border-[#273548] bg-[#101722] shadow-[0_12px_28px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-400/70 hover:shadow-[0_20px_38px_rgba(0,0,0,0.28)]"
    >
      {/* Header */}
      <div className="border-b border-[#273548] bg-[#151f2b]">
        <div className="flex items-start justify-between p-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#34455a] bg-[#0c121b]">
              <StageIcon className="h-5 w-5 text-primary-300" />
            </div>
            <div className="min-w-0">
              <h3 className="mb-2 line-clamp-1 text-lg font-bold text-white">{project.name}</h3>
              <span className="inline-block rounded-full border border-primary-400/25 bg-primary-400/10 px-2.5 py-1 text-[11px] font-bold text-primary-300">
                {stageInfo.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 p-4">
        <p className="line-clamp-2 text-sm leading-relaxed text-[#9ba9bc]">
          {project.description}
        </p>

        {/* Validation Health */}
        <div className="flex items-center justify-between rounded-xl border border-[#273548] bg-[#0c121b] p-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#151f2b]">
              <Target className={`w-4 h-4 ${getValidationHealthColor(validationScore)}`} />
            </div>
            <div>
              <p className="text-xs text-[#9ba9bc]">Status de validação</p>
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
              <div key={i} className="rounded-xl border border-[#273548] bg-[#0c121b] p-2.5 text-center">
                <Icon className={`w-4 h-4 ${stat.color} mx-auto mb-1`} />
                <p className="mb-1 text-[11px] text-[#9ba9bc]">{stat.label}</p>
                <p className="text-base font-bold text-white">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-[#9ba9bc]">Progresso geral</span>
            <span className="font-bold text-primary-300">{project.progress}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-[#0c121b]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600"
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              transition={{ duration: 1, delay: 0.2 + index * 0.05 }}
            />
          </div>
        </div>

        {/* Next Actions */}
        {project.tasks.filter(t => t.status !== 'done').length > 0 && (
          <div className="rounded-xl border border-blue-400/25 bg-blue-400/10 p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <p className="text-sm font-medium text-blue-200">
                Próximas ações
              </p>
            </div>
            <p className="text-xs text-blue-300">
              {project.tasks.filter(t => t.status !== 'done').length} tarefa{project.tasks.filter(t => t.status !== 'done').length > 1 ? 's' : ''} pendente{project.tasks.filter(t => t.status !== 'done').length > 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 border-t border-[#273548] pt-4">
          <button
            onClick={onViewDetails}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-500 px-3.5 py-2.5 text-sm font-bold text-black transition-all hover:bg-primary-400"
          >
            <Eye className="w-4 h-4" />
            Ver Detalhes
          </button>

          <Tooltip.Root delayDuration={100}>
            <Tooltip.Trigger asChild>
              <button
                onClick={onConvert}
                aria-label={`Promover ${project.name} a solução`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-primary-400/25 bg-primary-400/10 px-2.5 py-2 text-xs font-semibold text-primary-300 transition-all hover:bg-primary-400/18"
              >
                <Rocket className="w-4 h-4" />
                <span>Promover</span>
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                side="top"
                sideOffset={10}
                className="z-50 rounded-lg border border-primary-500 bg-gray-900 px-3 py-2 text-sm font-medium text-white shadow-xl animate-fadein"
                style={{
                  boxShadow: '0 8px 32px 0 rgba(31, 41, 55, 0.25), 0 1.5px 4px 0 rgba(0,0,0,0.10)',
                  transition: 'opacity 0.18s cubic-bezier(0.4,0,0.2,1)'
                }}
              >
                Promover a solução
                <Tooltip.Arrow className="fill-primary-500" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
          
          <button
            onClick={onDelete}
            className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-red-300 transition-all hover:bg-red-400/18"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

interface ConvertProjectModalProps {
  project: Project | null;
  conversionData: { solution_url: string; git_url: string };
  setConversionData: (data: { solution_url: string; git_url: string }) => void;
  isConverting: boolean;
  onClose: () => void;
  onSave: () => void;
}

const ConvertProjectModal = ({
  project,
  conversionData,
  setConversionData,
  isConverting,
  onClose,
  onSave,
}: ConvertProjectModalProps) => {
  if (!project) return null;

  const fieldClassName = 'w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          className="w-full max-w-lg rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-800"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500/15">
                <Rocket className="h-6 w-6 text-primary-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Promover a solução</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {project.name} será criado na área de Soluções com os dados já validados.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
              aria-label="Fechar conversão"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-5 rounded-xl border border-primary-200 bg-primary-50 p-3 text-sm text-primary-900 dark:border-primary-800 dark:bg-primary-900/20 dark:text-primary-200">
            O projeto original continuará disponível em Projetos para preservar seu histórico de validação.
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="solution-url" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                URL do produto <span className="text-red-500">*</span>
              </label>
              <input
                id="solution-url"
                type="url"
                required
                value={conversionData.solution_url}
                onChange={(event) => setConversionData({ ...conversionData, solution_url: event.target.value })}
                className={fieldClassName}
                placeholder="https://minha-solucao.com.br"
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="solution-github" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Repositório GitHub <span className="font-normal text-gray-400">(opcional)</span>
              </label>
              <input
                id="solution-github"
                type="url"
                value={conversionData.git_url}
                onChange={(event) => setConversionData({ ...conversionData, git_url: event.target.value })}
                className={fieldClassName}
                placeholder="https://github.com/organização/repositório"
              />
            </div>

            <div className="flex gap-3 border-t border-gray-200 pt-5 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                disabled={isConverting}
                className="flex-1 rounded-xl border-2 border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={isConverting || !conversionData.solution_url.trim()}
                className="flex-1 rounded-xl bg-primary-500 px-4 py-2.5 font-bold text-black transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isConverting ? 'Convertendo...' : 'Criar solução'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
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
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: project.name,
    description: project.description || '',
    stage: project.stage,
  });

  useEffect(() => {
    setLocalProject(project);
    if (!isEditing) {
      setEditForm({
        name: project.name,
        description: project.description || '',
        stage: project.stage,
      });
    }
  }, [project, isEditing]);

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

  const handleOpenEdit = () => {
    setEditForm({
      name: localProject.name,
      description: localProject.description || '',
      stage: localProject.stage,
    });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const name = editForm.name.trim();
    if (!name) return;

    handleUpdateProject({
      name,
      description: editForm.description.trim(),
      stage: editForm.stage,
    });
    setIsEditing(false);
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
    <div className="dark min-h-screen bg-[#0c121b] text-white">
      <div className="container-custom space-y-6 py-6 md:py-8">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#9ba9bc] transition-colors hover:text-primary-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para projetos
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenEdit}
              className="inline-flex items-center gap-2 rounded-xl border border-[#34455a] bg-[#151f2b] px-3 py-2 text-primary-300 transition-all hover:border-primary-500/50 hover:bg-primary-500/10"
            >
              <Pencil className="w-4 h-4" />
              Editar projeto
            </button>
            <button
              onClick={onDelete}
              className="inline-flex items-center gap-2 rounded-xl border border-red-400/25 bg-red-400/10 px-3 py-2 text-red-300 transition-all hover:bg-red-400/20"
            >
              <Trash2 className="w-4 h-4" />
              Excluir projeto
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex min-h-[calc(100vh-12rem)] w-full flex-col overflow-hidden rounded-2xl border border-[#273548] bg-[#101722]"
        >
          {/* Header */}
          <div className="relative min-h-[164px] overflow-hidden border-b border-[#273548] bg-[#151f2b]">
            <div className="absolute inset-0 opacity-25">
              <div className={`absolute -right-12 -top-16 h-64 w-64 rounded-full bg-gradient-to-br ${stageInfo.color} blur-3xl`} />
            </div>
            
            <div className="relative z-10 p-5 md:p-6 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 min-w-0">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-primary-400/20 bg-primary-500/10 md:h-14 md:w-14">
                  <StageIcon className="h-7 w-7 text-primary-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary-300">Projeto em {stageInfo.label}</p>
                  <h2 className="mb-1 line-clamp-1 text-xl font-bold text-white md:text-2xl">{localProject.name}</h2>
                  <p className="max-w-4xl line-clamp-2 text-sm text-[#9ba9bc] md:text-base">{localProject.description || 'Adicione uma descrição para manter o contexto da execução.'}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full border border-primary-400/25 bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-200">
                      {stageInfo.label}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-[#34455a] bg-[#0c121b]/75 px-3 py-1 text-xs font-medium text-[#d7e0ea]">
                      Progresso: {localProject.progress}%
                    </span>
                    <span className="inline-flex items-center rounded-full border border-[#34455a] bg-[#0c121b]/75 px-3 py-1 text-xs font-medium text-[#d7e0ea]">
                      Validacao: {localProject.validation_score}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex-shrink-0 border-b border-[#273548] bg-[#101722]">
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
                        ? 'bg-primary-500 text-[#0c121b] shadow-lg shadow-primary-500/15'
                        : 'text-[#9ba9bc] hover:bg-[#151f2b] hover:text-white'
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
          <div className="min-h-0 flex-1 overflow-y-auto p-5 md:p-6">
            {activeTab === 'overview' && (
              <div className="space-y-5">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                  {[
                    {
                      label: 'Hipóteses Validadas', 
                      value: `${localProject.hypotheses.filter(h => h.validated).length}/${localProject.hypotheses.length}`, 
                      icon: CheckSquare,
                      color: 'text-emerald-300',
                      bgColor: 'bg-emerald-400/10 border-emerald-400/20'
                    },
                    { 
                      label: 'Experimentos', 
                      value: localProject.experiments.length, 
                      icon: FlaskConical,
                      color: 'text-primary-300',
                      bgColor: 'bg-primary-500/10 border-primary-400/20'
                    },
                    { 
                      label: 'Entrevistas', 
                      value: localProject.customer_interviews, 
                      icon: MessageSquare,
                      color: 'text-violet-300',
                      bgColor: 'bg-violet-400/10 border-violet-400/20'
                    },
                    { 
                      label: 'Tarefas Concluídas', 
                      value: `${localProject.tasks.filter(t => t.status === 'done').length}/${localProject.tasks.length}`, 
                      icon: CheckSquare,
                      color: 'text-amber-300',
                      bgColor: 'bg-amber-400/10 border-amber-400/20'
                    }
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <div key={i} className={`rounded-xl border p-3.5 text-center ${stat.bgColor}`}>
                        <Icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                        <p className="mb-1 text-xl font-bold text-white md:text-2xl">{stat.value}</p>
                        <p className="text-xs text-[#9ba9bc]">{stat.label}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-4">
                  {/* Validation Health */}
                  <div className="rounded-xl border border-[#273548] bg-[#151f2b] p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#9ba9bc]">Sinal de aprendizado</p>
                        <h3 className="mb-2 text-base font-bold text-white md:text-lg">Saúde da validação</h3>
                        <p className={`text-2xl md:text-3xl font-bold ${getValidationHealthColor(localProject.validation_score)}`}>
                          {getValidationHealthLabel(localProject.validation_score)} ({localProject.validation_score}%)
                        </p>
                        <p className="mt-2 text-sm text-[#9ba9bc]">
                          Acompanhe o nível de validação e identifique rapidamente onde evoluir.
                        </p>
                      </div>
                      <div className="w-24 h-24 md:w-28 md:h-28 flex-shrink-0">
                        <svg className="transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="text-[#273548]"
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
                  <div className="rounded-xl border border-[#273548] bg-[#151f2b] p-5">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#9ba9bc]">Execução</p>
                          <h3 className="font-bold text-white">Progresso geral</h3>
                        </div>
                        <span className="text-2xl font-bold text-primary-300">{localProject.progress}%</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-[#0c121b]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary-300 to-primary-500 transition-all"
                          style={{ width: `${localProject.progress}%` }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="rounded-xl border border-[#273548] bg-[#0c121b] p-3">
                          <p className="mb-1 text-xs text-[#9ba9bc]">Hipóteses</p>
                          <p className="font-semibold text-white">{localProject.hypotheses.length}</p>
                        </div>
                        <div className="rounded-xl border border-[#273548] bg-[#0c121b] p-3">
                          <p className="mb-1 text-xs text-[#9ba9bc]">Tarefas</p>
                          <p className="font-semibold text-white">{localProject.tasks.length}</p>
                        </div>
                        <div className="rounded-xl border border-[#273548] bg-[#0c121b] p-3">
                          <p className="mb-1 text-xs text-[#9ba9bc]">Experimentos</p>
                          <p className="font-semibold text-white">{localProject.experiments.length}</p>
                        </div>
                        <div className="rounded-xl border border-[#273548] bg-[#0c121b] p-3">
                          <p className="mb-1 text-xs text-[#9ba9bc]">Entrevistas</p>
                          <p className="font-semibold text-white">{localProject.customer_interviews}</p>
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

        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
              onClick={() => setIsEditing(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                className="w-full max-w-lg rounded-2xl border border-[#34455a] bg-[#101722] p-6 shadow-2xl"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">Editar projeto</h3>
                    <p className="mt-1 text-sm text-[#9ba9bc]">
                      Atualize as informações principais do projeto.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-lg p-2 text-[#9ba9bc] transition-colors hover:bg-[#151f2b] hover:text-white"
                    aria-label="Fechar edição"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label htmlFor="project-edit-name" className="mb-2 block text-sm font-medium text-[#d7e0ea]">
                      Nome do projeto
                    </label>
                    <input
                      id="project-edit-name"
                      type="text"
                      value={editForm.name}
                      onChange={(event) => setEditForm({ ...editForm, name: event.target.value })}
                      className="w-full rounded-xl border border-[#34455a] bg-[#0c121b] px-4 py-2.5 text-white outline-none transition-colors placeholder:text-[#718096] focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label htmlFor="project-edit-description" className="mb-2 block text-sm font-medium text-[#d7e0ea]">
                      Descrição
                    </label>
                    <textarea
                      id="project-edit-description"
                      value={editForm.description}
                      onChange={(event) => setEditForm({ ...editForm, description: event.target.value })}
                      rows={4}
                      className="w-full resize-y rounded-xl border border-[#34455a] bg-[#0c121b] px-4 py-2.5 text-white outline-none transition-colors placeholder:text-[#718096] focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="project-edit-stage" className="mb-2 block text-sm font-medium text-[#d7e0ea]">
                      Estágio atual
                    </label>
                    <select
                      id="project-edit-stage"
                      value={editForm.stage}
                      onChange={(event) => setEditForm({ ...editForm, stage: event.target.value as Project['stage'] })}
                      className="w-full rounded-xl border border-[#34455a] bg-[#0c121b] px-4 py-2.5 text-white outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    >
                      <option value="ideation">Ideação</option>
                      <option value="validation">Validação</option>
                      <option value="mvp">MVP</option>
                      <option value="traction">Tração</option>
                      <option value="growth">Crescimento</option>
                    </select>
                  </div>

                  <div className="flex gap-3 border-t border-[#273548] pt-5">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 rounded-xl border border-[#34455a] px-4 py-2.5 font-medium text-[#d7e0ea] transition-colors hover:bg-[#151f2b]"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      disabled={!editForm.name.trim()}
                      className="flex-1 rounded-xl bg-primary-500 px-4 py-2.5 font-bold text-[#0c121b] transition-colors hover:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Salvar alterações
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProjectsPage;
