import { projectsService } from './projectsService';
import type { ProjectWithRelations } from './projectsService';

export interface InsightMetric {
  id: string;
  title: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: any;
  color: string;
  bgColor: string;
  description: string;
  goal: number;
  status: 'excellent' | 'good' | 'on-track' | 'warning' | 'critical';
}

export interface InsightData {
  metrics: InsightMetric[];
  performanceData: Array<{
    date: string;
    validations: number;
    interviews: number;
    experiments: number;
    progress: number;
  }>;
  projectDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  recommendations: Array<{
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    action: string;
  }>;
}

class InsightsService {
  async getInsightsData(): Promise<InsightData> {
    try {
      const projects = await projectsService.getAll();
      const projectsWithRelations = await Promise.all(
        projects.map((project) => projectsService.getById(project.id))
      );

      const metrics = this.calculateMetrics(projectsWithRelations);
      const performanceData = this.calculatePerformanceData(projectsWithRelations);
      const projectDistribution = this.calculateProjectDistribution(projectsWithRelations);
      const recommendations = this.generateRecommendations(projectsWithRelations);

      return {
        metrics,
        performanceData,
        projectDistribution,
        recommendations
      };
    } catch (error) {
      console.error('Error fetching insights data:', error);
      throw new Error('Não foi possível carregar os dados de insights');
    }
  }

  private calculateMetrics(projects: ProjectWithRelations[]): InsightMetric[] {
    const hypotheses = projects.flatMap((project) => project.hypotheses);
    const experiments = projects.flatMap((project) => project.experiments);
    const interviews = projects.flatMap((project) => project.interviews);
    const validatedHypotheses = hypotheses.filter((hypothesis) => hypothesis.validated);
    const activeActivities = [
      ...experiments.filter((experiment) => experiment.status !== 'completed'),
      ...interviews.filter((interview) => interview.status !== 'completed'),
    ];
    const advancedProjects = projects.filter((project) => project.progress >= 80);
    const streak = this.calculateStreak(projects);

    return [
      {
        id: 'validations',
        title: 'Validações Realizadas',
        value: validatedHypotheses.length,
        ...this.getTrend(validatedHypotheses.map((item) => item.updated_at)),
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-500/10',
        description: 'Hipóteses validadas',
        goal: hypotheses.length,
        status: this.getMetricStatus(validatedHypotheses.length, hypotheses.length)
      },
      {
        id: 'tasks',
        title: 'Atividades em Andamento',
        value: activeActivities.length,
        ...this.getTrend(activeActivities.map((item) => item.updated_at || item.date)),
        color: 'from-purple-500 to-purple-600',
        bgColor: 'bg-purple-500/10',
        description: 'Experimentos e entrevistas abertos',
        goal: experiments.length + interviews.length,
        status: this.getMetricStatus(activeActivities.length, experiments.length + interviews.length)
      },
      {
        id: 'frameworks',
        title: 'Projetos Avançados',
        value: advancedProjects.length,
        ...this.getTrend(advancedProjects.map((project) => project.updated_at)),
        color: 'from-green-500 to-green-600',
        bgColor: 'bg-green-500/10',
        description: 'Projetos com 80% ou mais de progresso',
        goal: projects.length,
        status: this.getMetricStatus(advancedProjects.length, projects.length)
      },
      {
        id: 'streak',
        title: 'Sequência Atual',
        value: streak,
        change: 0,
        trend: 'stable' as const,
        color: 'from-orange-500 to-orange-600',
        bgColor: 'bg-orange-500/10',
        description: 'Dias consecutivos com atividade',
        goal: 7,
        status: this.getMetricStatus(streak, 7)
      },
      {
        id: 'goals',
        title: 'Projetos Concluídos',
        value: advancedProjects.length,
        ...this.getTrend(advancedProjects.map((project) => project.updated_at)),
        color: 'from-pink-500 to-pink-600',
        bgColor: 'bg-pink-500/10',
        description: 'Projetos que atingiram 80% de progresso',
        goal: projects.length,
        status: this.getMetricStatus(advancedProjects.length, projects.length)
      },
      {
        id: 'networking',
        title: 'Entrevistas Realizadas',
        value: interviews.length,
        ...this.getTrend(interviews.map((interview) => interview.updated_at || interview.date)),
        color: 'from-indigo-500 to-indigo-600',
        bgColor: 'bg-indigo-500/10',
        description: 'Conversas registradas com clientes',
        goal: Math.max(interviews.length, 10),
        status: this.getMetricStatus(interviews.length, Math.max(interviews.length, 10))
      }
    ];
  }

  private calculatePerformanceData(projects: ProjectWithRelations[]) {
    const hypotheses = projects.flatMap((project) => project.hypotheses);
    const experiments = projects.flatMap((project) => project.experiments);
    const interviews = projects.flatMap((project) => project.interviews);
    const today = new Date();

    return Array.from({ length: 30 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (29 - index));
      const dateKey = date.toISOString().slice(0, 10);
      const countOnDate = (items: Array<{ created_at?: string; updated_at?: string; date?: string }>) =>
        items.filter((item) => (item.updated_at || item.created_at || item.date || '').slice(0, 10) === dateKey).length;
      const updatedProjects = projects.filter((project) => project.updated_at.slice(0, 10) === dateKey);

      return {
        date: dateKey,
        validations: countOnDate(hypotheses.filter((hypothesis) => hypothesis.validated)),
        interviews: countOnDate(interviews),
        experiments: countOnDate(experiments),
        progress: updatedProjects.length
          ? Math.round(updatedProjects.reduce((total, project) => total + project.progress, 0) / updatedProjects.length)
          : 0,
      };
    });
  }

  private calculateProjectDistribution(projects: ProjectWithRelations[]) {
    const stages = [
      { key: 'ideation', name: 'Ideação', color: '#8B5CF6' },
      { key: 'validation', name: 'Validação', color: '#3B82F6' },
      { key: 'mvp', name: 'MVP', color: '#EAB308' },
      { key: 'traction', name: 'Tração', color: '#F97316' },
      { key: 'growth', name: 'Crescimento', color: '#22C55E' },
    ];

    return stages
      .map((stage) => ({
        name: stage.name,
        value: projects.filter((project) => project.stage === stage.key).length,
        color: stage.color,
      }))
      .filter((stage) => stage.value > 0);
  }

  private generateRecommendations(projects: ProjectWithRelations[]) {
    const recommendations: InsightData['recommendations'] = [];
    const hypotheses = projects.flatMap((project) => project.hypotheses);
    const experiments = projects.flatMap((project) => project.experiments);
    const interviews = projects.flatMap((project) => project.interviews);
    const pendingActivities = [
      ...experiments.filter((experiment) => experiment.status !== 'completed'),
      ...interviews.filter((interview) => interview.status !== 'completed'),
    ];

    if (projects.length === 0) {
      recommendations.push({
        id: 'create-project',
        title: 'Crie seu primeiro projeto',
        description: 'Registre uma ideia para começar a acompanhar validações, experimentos e progresso.',
        priority: 'high',
        action: 'Criar projeto',
      });
    }

    if (pendingActivities.length > 5) {
      recommendations.push({
        id: 'pending-tasks',
        title: 'Atividades aguardando atenção',
        description: `Você tem ${pendingActivities.length} experimentos ou entrevistas em aberto. Priorize os próximos aprendizados.`,
        priority: 'high' as const,
        action: 'Revisar projetos'
      });
    }

    if (projects.length > 0 && hypotheses.length === 0) {
      recommendations.push({
        id: 'create-hypothesis',
        title: 'Formule uma hipótese',
        description: 'Transforme a principal suposição do projeto em uma hipótese testável.',
        priority: 'medium' as const,
        action: 'Abrir projeto'
      });
    }

    if (hypotheses.length > 0 && !hypotheses.some((hypothesis) => hypothesis.validated)) {
      recommendations.push({
        id: 'validate-hypothesis',
        title: 'Valide sua primeira hipótese',
        description: 'Use entrevistas e experimentos para transformar suposições em evidências.',
        priority: 'medium' as const,
        action: 'Iniciar validação'
      });
    }

    if (projects.length > 0 && projects.every((project) => project.progress >= 80)) {
      recommendations.push({
        id: 'excellent-progress',
        title: 'Excelente Progresso!',
        description: 'Todos os seus projetos estão em estágio avançado. Continue acompanhando os próximos marcos.',
        priority: 'low' as const,
        action: 'Ver progresso'
      });
    }

    return recommendations;
  }

  private getTrend(dates: string[]) {
    const now = Date.now();
    const currentWindow = 30 * 24 * 60 * 60 * 1000;
    const previousWindow = currentWindow * 2;
    const current = dates.filter((date) => now - new Date(date).getTime() <= currentWindow).length;
    const previous = dates.filter((date) => {
      const age = now - new Date(date).getTime();
      return age > currentWindow && age <= previousWindow;
    }).length;
    const change = previous === 0 ? (current > 0 ? 100 : 0) : Math.round(((current - previous) / previous) * 100);

    return {
      change,
      trend: (change > 0 ? 'up' : change < 0 ? 'down' : 'stable') as 'up' | 'down' | 'stable',
    };
  }

  private getMetricStatus(current: number, goal: number): 'excellent' | 'good' | 'on-track' | 'warning' | 'critical' {
    if (goal <= 0) return current > 0 ? 'excellent' : 'on-track';
    const percentage = (current / goal) * 100;
    
    if (percentage >= 100) return 'excellent';
    if (percentage >= 80) return 'good';
    if (percentage >= 60) return 'on-track';
    if (percentage >= 40) return 'warning';
    return 'critical';
  }

  private calculateStreak(projects: ProjectWithRelations[]): number {
    const activityDays = new Set(
      projects.flatMap((project) => [
        project.created_at,
        project.updated_at,
        ...project.hypotheses.map((item) => item.updated_at),
        ...project.experiments.map((item) => item.updated_at),
        ...project.interviews.map((item) => item.updated_at || item.date),
      ]).map((date) => new Date(date).toDateString())
    );
    let streak = 0;
    for (let offset = 0; offset < 30; offset += 1) {
      const date = new Date();
      date.setDate(date.getDate() - offset);
      if (!activityDays.has(date.toDateString())) {
        if (offset === 0) return 0;
        break;
      }
      streak += 1;
    }
    return streak;
  }
}

export const insightsService = new InsightsService();
