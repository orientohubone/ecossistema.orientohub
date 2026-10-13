import type {DashboardData} from '../src/services/dashboardService';
import founderAvatar from '../public/fernando.jpg';

export const dashboardShowcaseData: DashboardData = {
  userProfile: {
    name: 'Fernando', avatar: founderAvatar, level: 6, currentXP: 720, nextLevelXP: 1000,
    totalPoints: 4720, rank: 'Ouro', phase: 'validation',
  },
  stats: {
    achievements: {completed: 8, total: 12},
    streak: 12,
    completedGoals: {completed: 7, total: 10},
    networking: 34,
  },
  tasks: [
    {id: 'task-validation', title: 'Concluir entrevistas de validação', completed: false, xp: 100, category: 'Validação', priority: 'high', progress: 80, project_id: 1, project_name: 'OrientoHub'},
    {id: 'task-canvas', title: 'Revisar proposta de valor', completed: false, xp: 80, category: 'Estratégia', priority: 'medium', progress: 55, project_id: 1, project_name: 'OrientoHub'},
    {id: 'task-mvp', title: 'Definir métricas do MVP', completed: true, xp: 120, category: 'Produto', priority: 'low', progress: 100, project_id: 1, project_name: 'OrientoHub'},
  ],
  frameworks: [
    {id: 'lean-canvas', name: 'Lean Canvas', progress: 42, icon: 'FileText', status: 'Em andamento', lastUpdate: 'Atualizado hoje', project_id: 1},
    {id: 'value-proposition', name: 'Proposta de Valor', progress: 68, icon: 'Target', status: 'Em andamento', lastUpdate: 'Atualizado ontem', project_id: 1},
  ],
  events: [
    {id: 'event-mentoria', title: 'Mentoria de validação', type: 'Mentoria', date: 'Hoje, 16:00', duration: '45 min', avatar: founderAvatar},
    {id: 'event-demo', title: 'Demo Day da comunidade', type: 'Evento', date: 'Quinta, 19:00', duration: '90 min', avatar: founderAvatar},
  ],
  activity: [
    {id: 'activity-1', action: 'Framework atualizado', target: 'Lean Canvas', xp: 40, time: 'Há 2h', icon: 'FileText'},
    {id: 'activity-2', action: 'Nova hipótese registrada', target: 'Aquisição B2B', xp: 30, time: 'Ontem', icon: 'Lightbulb'},
    {id: 'activity-3', action: 'Conquista desbloqueada', target: 'Validador', xp: 75, time: 'Há 2 dias', icon: 'Trophy'},
  ],
  recommendations: [
    {id: 'rec-1', title: 'Avance na validação', description: 'Conclua as entrevistas para consolidar seus aprendizados.', action: 'Ver progresso', icon: 'Target', color: 'primary'},
    {id: 'rec-2', title: 'Organize os próximos testes', description: 'Transforme hipóteses em experimentos mensuráveis.', action: 'Começar agora', icon: 'Lightbulb', color: 'blue'},
  ],
  phases: [
    {id: 'ideation', name: 'Ideação', icon: 'Lightbulb', active: false, completed: true},
    {id: 'validation', name: 'Validação', icon: 'Target', active: true, completed: false},
    {id: 'structure', name: 'Estruturação', icon: 'Users', active: false, completed: false},
    {id: 'traction', name: 'Tração', icon: 'TrendingUp', active: false, completed: false},
    {id: 'scale', name: 'Escala', icon: 'Rocket', active: false, completed: false},
  ],
};
