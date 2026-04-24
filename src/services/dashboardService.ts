import { supabase } from '../config/supabase';
import { projectsService, type ProjectWithRelations } from './projectsService';
import { eventsService } from './eventsService';

// Types para o dashboard
export interface DashboardStats {
  achievements: {
    completed: number;
    total: number;
  };
  streak: number;
  completedGoals: {
    completed: number;
    total: number;
  };
  networking: number;
}

export interface DashboardTask {
  id: string;
  title: string;
  completed: boolean;
  xp: number;
  category: string;
  priority: 'high' | 'medium' | 'low';
  progress?: number;
  project_id?: string | number;
  project_name?: string;
}

export interface DashboardFramework {
  id: string | number;
  name: string;
  progress: number;
  icon: string;
  status: string;
  lastUpdate: string;
  project_id?: string | number;
}

export interface DashboardEvent {
  id: string;
  title: string;
  type: string;
  date: string;
  duration: string;
  avatar?: string;
}

export interface DashboardActivity {
  id: string;
  action: string;
  target: string;
  xp: number;
  time: string;
  icon: any;
}

export interface DashboardRecommendation {
  id: string;
  title: string;
  description: string;
  action: string;
  icon: any;
  color: 'primary' | 'blue' | 'purple';
}

export interface UserProfile {
  name: string;
  avatar: string;
  level: number;
  currentXP: number;
  nextLevelXP: number;
  totalPoints: number;
  rank: string;
  phase: string;
}

export interface DashboardData {
  userProfile: UserProfile;
  stats: DashboardStats;
  tasks: DashboardTask[];
  frameworks: DashboardFramework[];
  events: DashboardEvent[];
  activity: DashboardActivity[];
  recommendations: DashboardRecommendation[];
  phases: Array<{
    id: string;
    name: string;
    icon: any;
    active: boolean;
    completed: boolean;
  }>;
}

export interface JourneyMission {
  id: number;
  title: string;
  completed: boolean;
  xp: number;
  frameworks: Array<{ name: string; path: string }>;
  tasks: Array<{ name: string; path: string }>;
}

export interface JourneyPhase {
  id: number;
  name: string;
  icon: string | any;
  color: string;
  bgColor: string;
  status: 'locked' | 'in-progress' | 'completed';
  progress: number;
  xpEarned: number;
  description: string;
  missions: JourneyMission[];
}

class DashboardService {
  // Calcular XP baseado em atividades do usuário
  private calculateXP(projects: ProjectWithRelations[]): number {
    let xp = 0;
    
    projects.forEach(project => {
      // XP por projeto criado
      xp += 100;
      
      // XP por hipóteses validadas
      xp += project.hypotheses.filter(h => h.validated).length * 50;
      
      // XP por experimentos completados
      xp += project.experiments.filter(e => e.status === 'completed').length * 75;
      
      // XP por entrevistas realizadas
      xp += project.interviews.filter(i => i.status === 'completed').length * 100;
      
      // XP por progresso do projeto
      xp += Math.floor(project.progress / 10) * 25;
    });
    
    return xp;
  }

  // Calcular nível baseado em XP
  private calculateLevel(xp: number): { level: number; currentXP: number; nextLevelXP: number } {
    const level = Math.floor(xp / 1000) + 1;
    const currentXP = xp % 1000;
    const nextLevelXP = 1000;
    
    return { level, currentXP, nextLevelXP };
  }

  // Calcular rank baseado em XP
  private calculateRank(xp: number): string {
    if (xp >= 10000) return 'Diamond';
    if (xp >= 7500) return 'Platinum';
    if (xp >= 5000) return 'Gold';
    if (xp >= 2500) return 'Silver';
    return 'Bronze';
  }

  // Determinar fase atual do usuário baseado nos projetos
  private getCurrentPhase(projects: ProjectWithRelations[]): string {
    if (projects.length === 0) return 'ideation';
    
    // Pegar o projeto mais recente
    const latestProject = projects[0];
    return latestProject.stage;
  }

  // Calcular streak de dias consecutivos
  private calculateStreak(projects: ProjectWithRelations[]): number {
    // Simplificado: baseado em atualizações recentes
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      
      const hasActivity = projects.some(project => {
        const projectDate = new Date(project.updated_at);
        return projectDate.toDateString() === checkDate.toDateString();
      });
      
      if (hasActivity) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  }

  // Buscar dados completos do dashboard
  async getDashboardData(): Promise<DashboardData> {
    try {
      // Buscar projetos do usuário
      const projects = await projectsService.getAll();
      
      // Buscar projetos com relações para dados detalhados
      const projectsWithRelations = await Promise.all(
        projects.slice(0, 5).map(project => projectsService.getById(project.id))
      );

      // Calcular XP e nível
      const totalXP = this.calculateXP(projectsWithRelations);
      const { level, currentXP, nextLevelXP } = this.calculateLevel(totalXP);
      const rank = this.calculateRank(totalXP);
      const phase = this.getCurrentPhase(projectsWithRelations);
      const streak = this.calculateStreak(projectsWithRelations);

      // Perfil do usuário
      const { data: { user } } = await supabase.auth.getUser();
      const userProfile: UserProfile = {
        name: user?.user_metadata?.name?.trim() ||
              user?.user_metadata?.full_name?.trim() ||
              user?.email?.split('@')[0] ||
              'Founder',
        avatar: user?.user_metadata?.avatar_url || '',
        level,
        currentXP,
        nextLevelXP,
        totalPoints: totalXP,
        rank,
        phase
      };

      // Estatísticas
      const stats: DashboardStats = {
        achievements: {
          completed: projectsWithRelations.reduce((acc, p) => acc + p.validated_assumptions, 0),
          total: 50
        },
        streak,
        completedGoals: {
          completed: projectsWithRelations.filter(p => p.progress >= 80).length,
          total: projects.length || 25
        },
        networking: projectsWithRelations.reduce((acc, p) => acc + p.customer_interviews, 0)
      };

      // Tarefas (baseadas em projetos e experimentos)
      const tasks: DashboardTask[] = [];
      projectsWithRelations.forEach(project => {
        // Adicionar experimentos como tarefas
        project.experiments.forEach(exp => {
          tasks.push({
            id: `exp-${exp.id}`,
            title: exp.title,
            completed: exp.status === 'completed',
            xp: 75,
            category: 'Experimento',
            priority: exp.status === 'completed' ? 'low' : 'high',
            progress: exp.status === 'completed' ? 100 : exp.status === 'in_progress' ? 50 : 0,
            project_id: project.id,
            project_name: project.name
          });
        });

        // Adicionar entrevistas como tarefas
        project.interviews.forEach(interview => {
          tasks.push({
            id: `int-${interview.id}`,
            title: `Entrevista: ${interview.customer_name || 'Cliente'}`,
            completed: interview.status === 'completed',
            xp: 100,
            category: 'Validação',
            priority: 'high',
            project_id: project.id,
            project_name: project.name
          });
        });
      });

      // Frameworks (baseados em projetos)
      const frameworks: DashboardFramework[] = projectsWithRelations.map(project => ({
        id: project.id,
        name: project.name,
        progress: project.progress,
        icon: '🎯',
        status: project.progress >= 80 ? 'Quase lá!' : project.progress >= 50 ? 'Em andamento' : 'Iniciado',
        lastUpdate: new Date(project.updated_at).toLocaleDateString('pt-BR'),
        project_id: project.id
      }));

      // Eventos (usando o eventsService)
      const events = await eventsService.getUpcoming(3);
      const dashboardEvents: DashboardEvent[] = events.map(event => ({
        id: event.id,
        title: event.title,
        type: event.type.charAt(0).toUpperCase() + event.type.slice(1),
        date: eventsService.formatDate(event.date),
        duration: event.duration,
        avatar: event.mentor_avatar || eventsService.generateAvatar(event.mentor_name || 'Evento')
      }));

      // Atividade recente
      const activity: DashboardActivity[] = [];
      projectsWithRelations.forEach(project => {
        project.experiments
          .filter(exp => exp.status === 'completed')
          .slice(0, 3)
          .forEach(exp => {
            activity.push({
              id: `activity-exp-${exp.id}`,
              action: 'Completou',
              target: exp.title,
              xp: 75,
              time: 'Há 2 horas',
              icon: 'Award' as any
            });
          });
      });

      // Recomendações baseadas no contexto
      const recommendations: DashboardRecommendation[] = [];
      
      if (phase === 'ideation' && projectsWithRelations.length === 0) {
        recommendations.push({
          id: '1',
          title: 'Crie seu primeiro projeto',
          description: 'Comece sua jornada empreendedora criando um novo projeto',
          action: 'Criar projeto',
          icon: 'Target' as any,
          color: 'primary'
        });
      }

      if (projectsWithRelations.some(p => p.hypotheses.length === 0)) {
        recommendations.push({
          id: '2',
          title: 'Formule hipóteses',
          description: 'Valide suas ideias formulando hipóteses testáveis',
          action: 'Começar agora',
          icon: 'Lightbulb' as any,
          color: 'blue'
        });
      }

      if (stats.streak >= 5) {
        recommendations.push({
          id: '3',
          title: 'Continue o bom trabalho!',
          description: `Você está há ${stats.streak} dias consecutivos, mantenha o ritmo`,
          action: 'Ver progresso',
          icon: 'Flame' as any,
          color: 'purple'
        });
      }

      // Fases da jornada
      const phases = [
        { id: 'ideation', name: 'Ideação', icon: 'Lightbulb' as any, active: phase === 'ideation', completed: ['validation', 'mvp', 'traction', 'growth'].includes(phase) },
        { id: 'validation', name: 'Validação', icon: 'Target' as any, active: phase === 'validation', completed: ['mvp', 'traction', 'growth'].includes(phase) },
        { id: 'mvp', name: 'MVP', icon: 'Rocket' as any, active: phase === 'mvp', completed: ['traction', 'growth'].includes(phase) },
        { id: 'traction', name: 'Tração', icon: 'TrendingUp' as any, active: phase === 'traction', completed: phase === 'growth' },
        { id: 'growth', name: 'Crescimento', icon: 'Activity' as any, active: phase === 'growth', completed: false }
      ];

      return {
        userProfile,
        stats,
        tasks: tasks.slice(0, 10), // Limitar para performance
        frameworks: frameworks.slice(0, 4),
        events: dashboardEvents,
        activity: activity.slice(0, 5),
        recommendations: recommendations.slice(0, 3),
        phases
      };

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw new Error('Não foi possível carregar os dados do dashboard');
    }
  }

  // Atualizar progresso de tarefa/experimento
  async updateTaskProgress(taskId: string, progress: number): Promise<void> {
    try {
      // Extrair tipo e ID do taskId
      const [type, id] = taskId.split('-');
      
      if (type === 'exp') {
        await projectsService.updateExperiment(parseInt(id), {
          status: progress >= 100 ? 'completed' : progress > 0 ? 'in_progress' : 'planned'
        });
      } else if (type === 'int') {
        await projectsService.updateInterview(parseInt(id), {
          status: progress >= 100 ? 'completed' : 'scheduled'
        });
      }
      // Implementar outros tipos conforme necessário
    } catch (error) {
      console.error('Error updating task progress:', error);
      throw new Error('Não foi possível atualizar o progresso da tarefa');
    }
  }

  // Buscar dados da Jornada Empreendedora amarrados ao banco
  async getJourneyData(): Promise<JourneyPhase[]> {
    try {
      const projects = await projectsService.getAll();
      const activeProject = projects.length > 0 ? await projectsService.getById(projects[0].id) : null;
      
      const hasProject = !!activeProject;
      const stage = activeProject ? activeProject.stage : 'ideation';
      const hasHypotheses = activeProject ? activeProject.hypotheses?.length > 0 : false;
      const hasMVP = activeProject ? activeProject.experiments?.some(e => e.title.includes('MVP') || e.method?.includes('MVP')) : false;
      const interviewsCount = activeProject ? (activeProject.interviews?.length || 0) : 0;
      const hasExperiments = activeProject ? activeProject.experiments?.length > 0 : false;

      const ideationProgress = hasProject ? (hasHypotheses ? 100 : 50) : 0;
      const ideationStatus = stage !== 'ideation' && hasProject ? 'completed' : 'in-progress';
      
      const validationProgress = activeProject ? Math.min(100, Math.floor(((hasMVP ? 25 : 0) + (interviewsCount * 5) + (hasExperiments ? 25 : 0)))) : 0;
      const validationStatus = stage === 'validation' ? 'in-progress' : (stage !== 'ideation' && stage !== 'validation' ? 'completed' : 'locked');
      
      return [
        {
          id: 1,
          name: 'Ideação',
          icon: 'Lightbulb',
          color: 'from-blue-400 to-blue-600',
          bgColor: 'bg-blue-500/10',
          status: ideationStatus,
          progress: ideationProgress,
          xpEarned: (hasProject ? 100 : 0) + (hasProject ? 100 : 0) + (hasHypotheses ? 150 : 0) + (hasHypotheses ? 150 : 0),
          description: 'Validação inicial da sua ideia de negócio',
          missions: [
            { 
              id: 1, 
              title: 'Definir problema a resolver', 
              completed: hasProject, 
              xp: 100,
              frameworks: [{ name: 'Lean Canvas', path: '/dashboard/frameworks' }, { name: 'Customer Development', path: '/dashboard/frameworks' }],
              tasks: [{ name: 'Criar primeiro projeto', path: '/dashboard/projects/novo' }]
            },
            { 
              id: 2, 
              title: 'Identificar público-alvo', 
              completed: hasProject, 
              xp: 100,
              frameworks: [{ name: 'Mapa de Empatia', path: '/dashboard/frameworks' }],
              tasks: [{ name: 'Preencher descrição do projeto', path: '/dashboard/projects' }]
            },
            { 
              id: 3, 
              title: 'Levantamento de hipóteses', 
              completed: hasHypotheses, 
              xp: 150,
              frameworks: [],
              tasks: [{ name: 'Escrever primeira hipótese validável no painel', path: '/dashboard/projects' }]
            },
            { 
              id: 4, 
              title: 'Proposta de valor única', 
              completed: hasHypotheses, 
              xp: 150,
              frameworks: [{ name: 'Value Proposition Canvas', path: '/dashboard/frameworks' }],
              tasks: [{ name: 'Adicionar nível de confiança na hipótese', path: '/dashboard/projects' }]
            }
          ]
        },
        {
          id: 2,
          name: 'Validação',
          icon: 'Target',
          color: 'from-green-400 to-green-600',
          bgColor: 'bg-green-500/10',
          status: validationStatus,
          progress: validationProgress,
          xpEarned: (hasMVP ? 200 : 0) + (interviewsCount >= 10 ? 150 : interviewsCount * 15) + (hasExperiments ? 200 : 0),
          description: 'Teste e validação da sua solução no mercado',
          missions: [
            { 
              id: 5, 
              title: 'Criar MVP (Produto Mínimo Viável)', 
              completed: hasMVP, 
              xp: 200,
              frameworks: [{ name: 'Startup Enxuta (Lean)', path: '/dashboard/frameworks' }],
              tasks: [{ name: 'Criar funcionalidade básica no experimento', path: '/dashboard/projects' }]
            },
            { 
              id: 6, 
              title: 'Entrevistar potenciais clientes', 
              completed: interviewsCount >= 10, 
              xp: 150,
              frameworks: [{ name: 'Jobs to be Done', path: '/dashboard/frameworks' }],
              tasks: [{ name: `Realizar mais contatos (${interviewsCount}/10)`, path: '/dashboard/projects' }]
            },
            { 
              id: 7, 
              title: 'Testar hipóteses principais', 
              completed: hasExperiments, 
              xp: 200,
              frameworks: [],
              tasks: [{ name: 'Criar 1 Novo Experimento', path: '/dashboard/projects' }]
            },
            { 
              id: 8, 
              title: 'Ajustar produto baseado em feedback', 
              completed: interviewsCount > 0 && hasExperiments, 
              xp: 150,
              frameworks: [{ name: 'Product-Market Fit', path: '/dashboard/frameworks' }],
              tasks: [{ name: 'Preencher aba insights', path: '/dashboard/insights' }]
            }
          ]
        },
        {
          id: 3,
          name: 'Estruturação',
          icon: 'Users',
          color: 'from-purple-400 to-purple-600',
          bgColor: 'bg-purple-500/10',
          status: ['mvp', 'traction', 'growth'].includes(stage) ? 'in-progress' : 'locked',
          progress: 0,
          xpEarned: 0,
          description: 'Construção da estrutura do negócio',
          missions: [
            { id: 9, title: 'Formalizar a empresa', completed: false, xp: 200, frameworks: [], tasks: [] },
            { id: 10, title: 'Montar time inicial', completed: false, xp: 250, frameworks: [], tasks: [] },
            { id: 11, title: 'Definir processos operacionais', completed: false, xp: 200, frameworks: [{ name: 'OKRs', path: '/dashboard/frameworks' }], tasks: [] },
            { id: 12, title: 'Criar modelo de negócio', completed: false, xp: 250, frameworks: [{ name: 'Business Model Canvas', path: '/dashboard/frameworks' }], tasks: [] }
          ]
        },
        {
          id: 4,
          name: 'Tração',
          icon: 'TrendingUp',
          color: 'from-orange-400 to-orange-600',
          bgColor: 'bg-orange-500/10',
          status: ['traction', 'growth'].includes(stage) ? 'in-progress' : 'locked',
          progress: 0,
          xpEarned: 0,
          description: 'Crescimento e conquista de mercado',
          missions: [
            { id: 13, title: 'Alcançar primeiros 100 clientes', completed: false, xp: 300, frameworks: [], tasks: [] },
            { id: 14, title: 'Estabelecer canais de aquisição', completed: false, xp: 250, frameworks: [], tasks: [] },
            { id: 15, title: 'Otimizar funil de vendas', completed: false, xp: 200, frameworks: [{ name: 'SaaS B2B Estratégia', path: '/dashboard/frameworks' }], tasks: [] },
            { id: 16, title: 'Atingir Product-Market Fit', completed: false, xp: 350, frameworks: [{ name: 'PMF Survey', path: '/dashboard/frameworks' }], tasks: [] }
          ]
        },
        {
          id: 5,
          name: 'Escala',
          icon: 'Rocket',
          color: 'from-red-400 to-red-600',
          bgColor: 'bg-red-500/10',
          status: stage === 'growth' ? 'in-progress' : 'locked',
          progress: 0,
          xpEarned: 0,
          description: 'Crescimento exponencial e expansão',
          missions: [
            { id: 17, title: 'Captar investimento Anjo/Seed', completed: false, xp: 400, frameworks: [], tasks: [] },
            { id: 18, title: 'Expandir equipe', completed: false, xp: 300, frameworks: [{ name: 'SAFe / Scrum / Agile', path: '/dashboard/frameworks' }], tasks: [] },
            { id: 19, title: 'Escalar operações', completed: false, xp: 350, frameworks: [], tasks: [] },
            { id: 20, title: 'Expandir novos mercados', completed: false, xp: 450, frameworks: [], tasks: [] }
          ]
        }
      ];
    } catch (error) {
      console.error('Error fetching journey data:', error);
      throw new Error('Não foi possível carregar a jornada');
    }
  }

  // Buscar estatísticas em tempo real
  async getRealTimeStats(): Promise<DashboardStats> {
    const data = await this.getDashboardData();
    return data.stats;
  }
}

export const dashboardService = new DashboardService();
