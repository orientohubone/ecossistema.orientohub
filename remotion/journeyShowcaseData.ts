import type {JourneyPhase} from '../src/services/dashboardService';

export const journeyShowcaseData: JourneyPhase[] = [
  {
    id: 1, name: 'Ideação', icon: 'Lightbulb', color: 'from-blue-400 to-blue-600', bgColor: 'bg-blue-500/10',
    status: 'completed', progress: 100, xpEarned: 500, description: 'Validação inicial da sua ideia de negócio',
    missions: [
      {id: 1, title: 'Definir problema a resolver', completed: true, xp: 100, frameworks: [{name: 'Lean Canvas', path: '#'}], tasks: []},
      {id: 2, title: 'Identificar público-alvo', completed: true, xp: 100, frameworks: [{name: 'Mapa de Empatia', path: '#'}], tasks: []},
      {id: 3, title: 'Levantar hipóteses', completed: true, xp: 150, frameworks: [], tasks: []},
    ],
  },
  {
    id: 2, name: 'Validação', icon: 'Target', color: 'from-green-400 to-green-600', bgColor: 'bg-green-500/10',
    status: 'in-progress', progress: 60, xpEarned: 360, description: 'Teste e validação da sua solução no mercado',
    missions: [
      {id: 5, title: 'Criar MVP (Produto Mínimo Viável)', completed: true, xp: 200, frameworks: [{name: 'Startup Enxuta (Lean)', path: '#'}], tasks: []},
      {id: 6, title: 'Entrevistar potenciais clientes', completed: false, xp: 150, frameworks: [{name: 'Jobs to be Done', path: '#'}], tasks: [{name: 'Realizar entrevistas de validação', path: '#'}]},
      {id: 7, title: 'Testar hipóteses principais', completed: false, xp: 200, frameworks: [], tasks: [{name: 'Criar um novo experimento', path: '#'}]},
    ],
  },
  {
    id: 3, name: 'Estruturação', icon: 'Users', color: 'from-purple-400 to-purple-600', bgColor: 'bg-purple-500/10',
    status: 'locked', progress: 0, xpEarned: 0, description: 'Construção da estrutura do negócio',
    missions: [{id: 9, title: 'Formalizar a empresa', completed: false, xp: 200, frameworks: [], tasks: []}],
  },
  {
    id: 4, name: 'Tração', icon: 'TrendingUp', color: 'from-orange-400 to-orange-600', bgColor: 'bg-orange-500/10',
    status: 'locked', progress: 0, xpEarned: 0, description: 'Crescimento e conquista de mercado',
    missions: [{id: 13, title: 'Alcançar primeiros 100 clientes', completed: false, xp: 300, frameworks: [], tasks: []}],
  },
  {
    id: 5, name: 'Escala', icon: 'Rocket', color: 'from-red-400 to-red-600', bgColor: 'bg-red-500/10',
    status: 'locked', progress: 0, xpEarned: 0, description: 'Expansão sustentável do negócio',
    missions: [{id: 17, title: 'Expandir para novos mercados', completed: false, xp: 500, frameworks: [], tasks: []}],
  },
];
