import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart2, 
  CheckSquare, 
  FileText, 
  Target, 
  Award, 
  Zap, 
  Layout, 
  Users, 
  MessageSquare, 
  Lightbulb, 
  Building2, 
  Brain, 
  Target as TargetIcon, 
  Briefcase, 
  GitBranch, 
  LineChart,
  Plus,
  Search,
  Filter,
  Eye,
  Play,
  Bookmark,
  Share2,
  X,
  Sparkles,
  TrendingUp,
  Layers,
  ExternalLink
} from 'lucide-react';
import FrameworkModal from '../components/modals/FrameworkModal';

interface Framework {
  id: string;
  name: string;
  description: string;
  progress: number;
  icon: any;
  comments: number;
  content?: string;
  canvaUrl?: string;
}

interface RecommendedTemplate {
  id: string;
  name: string;
  description: string;
  type: 'canvas' | 'matrix' | 'map';
  content: string;
}

interface CustomFramework extends Framework {
  type: string;
  createdAt: string;
}

const FrameworksPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<RecommendedTemplate | null>(null);
  const [showNewFrameworkModal, setShowNewFrameworkModal] = useState(false);
  const [showFrameworkModal, setShowFrameworkModal] = useState(false);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Estados para o formulário de novo framework
  const [newFrameworkName, setNewFrameworkName] = useState('');
  const [newFrameworkDescription, setNewFrameworkDescription] = useState('');
  const [newFrameworkType, setNewFrameworkType] = useState('canvas');
  const [newFrameworkCanvaUrl, setNewFrameworkCanvaUrl] = useState('');
  const [initialNewFrameworkData, setInitialNewFrameworkData] = useState<any>(null);
  const [, setProgressVersion] = useState(0);
  const [customFrameworks, setCustomFrameworks] = useState<CustomFramework[]>(() => {
    try {
      const saved = localStorage.getItem('orientohub:custom-frameworks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const refreshProgress = () => setProgressVersion((version) => version + 1);
    window.addEventListener('orientohub:framework-progress-updated', refreshProgress);
    return () => window.removeEventListener('orientohub:framework-progress-updated', refreshProgress);
  }, []);

  const frameworks: Framework[] = [
    {
      id: 'customer-development',
      name: 'Customer Development',
      description: 'Metodologia de Steve Blank para validação de problema e produto.',
      progress: 0,
      icon: Users,
      comments: 0,
      content: `
        <h2>Customer Development</h2>
        <p>Metodologia criada por Steve Blank para validar se o problema existe e se o produto realmente resolve.</p>
        
        <h3>Fases:</h3>
        
        <h4>1. Customer Discovery</h4>
        <ul>
          <li>Identificação do problema</li>
          <li>Definição de personas</li>
          <li>Hipóteses iniciais</li>
          <li>Entrevistas com potenciais clientes</li>
        </ul>
        
        <h4>2. Customer Validation</h4>
        <ul>
          <li>Desenvolvimento da proposta de valor</li>
          <li>Criação do MVP</li>
          <li>Testes com early adopters</li>
          <li>Validação do modelo de negócio</li>
        </ul>
        
        <h4>3. Customer Creation</h4>
        <ul>
          <li>Estratégia de go-to-market</li>
          <li>Definição dos canais de aquisição</li>
          <li>Escalabilidade do negócio</li>
          <li>Métricas de crescimento</li>
        </ul>
        
        <h4>4. Company Building</h4>
        <ul>
          <li>Estruturação da empresa</li>
          <li>Processos e procedimentos</li>
          <li>Cultura organizacional</li>
          <li>Planejamento estratégico</li>
        </ul>
        
        <h3>Ferramentas Complementares:</h3>
        <ul>
          <li>Lean Canvas</li>
          <li>Mapa de Empatia</li>
          <li>Value Proposition Canvas</li>
          <li>Customer Journey Map</li>
        </ul>
      `,
    },
    {
      id: 'design-thinking',
      name: 'Design Thinking',
      description: 'Metodologia de solução centrada no usuário através de cinco etapas iterativas.',
      progress: 0,
      icon: Brain,
      comments: 0,
      content: `
        <h2>Design Thinking</h2>
        <p>Metodologia de inovação centrada no usuário que busca soluções criativas para problemas complexos.</p>

        <h3>Etapas:</h3>

        <h4>1. Empatia (Imersão)</h4>
        <ul>
          <li>Observação do usuário</li>
          <li>Entrevistas em profundidade</li>
          <li>Imersão no contexto</li>
          <li>Documentação de insights</li>
        </ul>

        <h4>2. Definição</h4>
        <ul>
          <li>Síntese das descobertas</li>
          <li>Identificação do problema real</li>
          <li>Criação de personas</li>
          <li>Definição do desafio</li>
        </ul>

        <h4>3. Ideação</h4>
        <ul>
          <li>Brainstorming estruturado</li>
          <li>Técnicas de criatividade</li>
          <li>Divergência controlada</li>
          <li>Seleção de ideias</li>
        </ul>

        <h4>4. Prototipagem</h4>
        <ul>
          <li>Protótipos rápidos</li>
          <li>MVP (Minimum Viable Product)</li>
          <li>Iterações constantes</li>
          <li>Feedback inicial</li>
        </ul>

        <h4>5. Teste</h4>
        <ul>
          <li>Validação com usuários</li>
          <li>Coleta de feedback</li>
          <li>Refinamento da solução</li>
          <li>Implementação de melhorias</li>
        </ul>
      `,
    },
    {
      id: 'okrs',
      name: 'OKRs (Objectives and Key Results)',
      description: 'Framework para alinhamento estratégico e execução focada em resultados mensuráveis.',
      progress: 0,
      icon: TargetIcon,
      comments: 0,
      content: `
        <h2>OKRs (Objectives and Key Results)</h2>
        <p>Sistema de definição e acompanhamento de metas que conecta objetivos ambiciosos a resultados mensuráveis.</p>

        <h3>Componentes:</h3>

        <h4>1. Objetivos</h4>
        <ul>
          <li>Qualitativos e inspiradores</li>
          <li>Ambiciosos e desafiadores</li>
          <li>Alinhados com a visão</li>
          <li>Timeboxed (geralmente trimestral)</li>
        </ul>

        <h4>2. Resultados-Chave</h4>
        <ul>
          <li>Quantitativos e mensuráveis</li>
          <li>Verificáveis objetivamente</li>
          <li>Time-bound (prazo definido)</li>
          <li>3-5 KRs por objetivo</li>
        </ul>

        <h3>Boas Práticas:</h3>
        <ul>
          <li>Definir metas ambiciosas (70% é bom)</li>
          <li>Revisar regularmente</li>
          <li>Manter transparência</li>
          <li>Alinhar times e indivíduos</li>
        </ul>

        <h3>Ciclo de OKRs:</h3>
        <ol>
          <li>Planejamento</li>
          <li>Alinhamento</li>
          <li>Execução</li>
          <li>Acompanhamento</li>
          <li>Retrospectiva</li>
        </ol>
      `,
    },
    {
      id: 'jtbd',
      name: 'Jobs to be Done',
      description: 'Framework para entender o verdadeiro trabalho que o cliente quer realizar.',
      progress: 0,
      icon: Briefcase,
      comments: 0,
      content: `
        <h2>Jobs to be Done (JTBD)</h2>
        <p>Metodologia que foca no "trabalho" que o cliente quer realizar, não apenas no produto ou serviço.</p>

        <h3>Conceitos Fundamentais:</h3>

        <h4>1. Job Statement</h4>
        <ul>
          <li>Verbo de ação</li>
          <li>Objeto da transformação</li>
          <li>Contexto</li>
          <li>Resultado esperado</li>
        </ul>

        <h4>2. Dimensões do Job</h4>
        <ul>
          <li>Funcional</li>
          <li>Emocional</li>
          <li>Social</li>
        </ul>

        <h4>3. Forças do Progresso</h4>
        <ul>
          <li>Push (situação atual)</li>
          <li>Pull (nova solução)</li>
          <li>Anxiety (preocupações)</li>
          <li>Habit (status quo)</li>
        </ul>

        <h3>Ferramentas de Pesquisa:</h3>
        <ul>
          <li>Entrevistas estruturadas</li>
          <li>Timeline interviews</li>
          <li>Forces diagram</li>
          <li>Job map</li>
        </ul>
      `,
    },
    {
      id: 'safe-scrum',
      name: 'SAFe / Scrum / Agile',
      description: 'Frameworks ágeis para gestão adaptativa de produto e desenvolvimento.',
      progress: 0,
      icon: GitBranch,
      comments: 0,
      content: `
        <h2>SAFe / Scrum / Agile</h2>
        <p>Conjunto de metodologias ágeis para gestão de produto e desenvolvimento de software.</p>

        <h3>Scrum Framework:</h3>

        <h4>1. Papéis</h4>
        <ul>
          <li>Product Owner</li>
          <li>Scrum Master</li>
          <li>Development Team</li>
        </ul>

        <h4>2. Cerimônias</h4>
        <ul>
          <li>Sprint Planning</li>
          <li>Daily Scrum</li>
          <li>Sprint Review</li>
          <li>Sprint Retrospective</li>
        </ul>

        <h4>3. Artefatos</h4>
        <ul>
          <li>Product Backlog</li>
          <li>Sprint Backlog</li>
          <li>Increment</li>
        </ul>

        <h3>SAFe (Scaled Agile Framework):</h3>
        <ul>
          <li>Portfolio Level</li>
          <li>Large Solution Level</li>
          <li>Program Level</li>
          <li>Team Level</li>
        </ul>

        <h3>Princípios Ágeis:</h3>
        <ul>
          <li>Entrega incremental</li>
          <li>Feedback contínuo</li>
          <li>Adaptação à mudança</li>
          <li>Colaboração constante</li>
        </ul>
      `,
    },
    {
      id: 'pmf',
      name: 'Product-Market Fit',
      description: 'Framework para validar o encaixe entre produto e mercado.',
      progress: 0,
      icon: LineChart,
      comments: 0,
      content: `
        <h2>Product-Market Fit (PMF)</h2>
        <p>Framework para identificar e validar o encaixe entre seu produto e o mercado.</p>

        <h3>Indicadores de PMF:</h3>

        <h4>1. Métricas Qualitativas</h4>
        <ul>
          <li>NPS (Net Promoter Score)</li>
          <li>Pesquisa de satisfação</li>
          <li>"Very disappointed" score</li>
          <li>Feedback espontâneo</li>
        </ul>

        <h4>2. Métricas Quantitativas</h4>
        <ul>
          <li>Retenção de cohorts</li>
          <li>Crescimento orgânico</li>
          <li>Taxa de conversão</li>
          <li>Lifetime Value (LTV)</li>
        </ul>

        <h4>3. Sinais de PMF</h4>
        <ul>
          <li>Crescimento via word-of-mouth</li>
          <li>Vendas mais fáceis</li>
          <li>Uso consistente</li>
          <li>Demanda crescente</li>
        </ul>

        <h3>Processo de Validação:</h3>
        <ol>
          <li>Definir métricas-chave</li>
          <li>Coletar dados</li>
          <li>Analisar resultados</li>
          <li>Iterar produto</li>
          <li>Validar novamente</li>
        </ol>
      `,
    },
    {
      id: 'bmc',
      name: t('frameworks.bmc'),
      description: 'Visualize e estruture seu modelo de negócios de forma clara e objetiva.',
      progress: 80,
      icon: Layout,
      comments: 3,
      content: `
        <h2>Business Model Canvas</h2>
        <p>O Business Model Canvas é uma ferramenta estratégica que permite desenvolver e esboçar modelos de negócio novos ou existentes.</p>
        
        <h3>Componentes Principais:</h3>
        <ul>
          <li>Proposta de Valor</li>
          <li>Segmentos de Clientes</li>
          <li>Canais</li>
          <li>Relacionamento com Clientes</li>
          <li>Fontes de Receita</li>
          <li>Recursos Principais</li>
          <li>Atividades-Chave</li>
          <li>Parcerias Principais</li>
          <li>Estrutura de Custos</li>
        </ul>
        
        <h3>Como Utilizar:</h3>
        <ol>
          <li>Comece pela Proposta de Valor</li>
          <li>Identifique seus Segmentos de Clientes</li>
          <li>Estabeleça os Canais de distribuição</li>
          <li>Defina o Relacionamento com Clientes</li>
          <li>Determine as Fontes de Receita</li>
          <li>Liste os Recursos Principais</li>
          <li>Descreva as Atividades-Chave</li>
          <li>Identifique as Parcerias Principais</li>
          <li>Calcule a Estrutura de Custos</li>
        </ol>
      `,
    },
    {
      id: 'empathy-map',
      name: t('frameworks.empathyMap'),
      description: 'Entenda profundamente as necessidades e desejos dos seus clientes.',
      progress: 60,
      icon: Users,
      comments: 3,
      content: `
        <h2>Mapa de Empatia</h2>
        <p>O Mapa de Empatia é uma ferramenta que ajuda a desenvolver uma compreensão profunda dos clientes.</p>
        
        <h3>Elementos do Mapa:</h3>
        <ul>
          <li>O que pensa e sente?</li>
          <li>O que vê?</li>
          <li>O que ouve?</li>
          <li>O que fala e faz?</li>
          <li>Dores</li>
          <li>Ganhos</li>
        </ul>
        
        <h3>Como Aplicar:</h3>
        <ol>
          <li>Defina a persona</li>
          <li>Observe o contexto</li>
          <li>Registre percepções</li>
          <li>Identifique padrões</li>
          <li>Gere insights</li>
        </ol>
      `,
    },
    {
      id: 'customer-journey',
      name: t('frameworks.customerJourney'),
      description: 'Mapeie a jornada completa do seu cliente e identifique pontos de melhoria.',
      progress: 30,
      icon: Target,
      comments: 3,
    },
    {
      id: 'value-proposition',
      name: t('frameworks.valueProposition'),
      description: 'Defina claramente o valor que sua solução entrega aos clientes.',
      progress: 45,
      icon: Lightbulb,
      comments: 3,
    },
    {
      id: 'lean-canvas',
      name: t('frameworks.leanCanvas'),
      description: 'Documente e valide suas hipóteses de negócio de forma ágil.',
      progress: 20,
      icon: BarChart2,
      comments: 3,
    },
  ];

  // Templates recomendados com dados completos
  const recommendedTemplates: RecommendedTemplate[] = [
    {
      id: 'startup-enxuta',
      name: 'Startup Enxuta',
      description: 'Template otimizado para startups que seguem a metodologia Lean Startup, focando em validação rápida e iteração contínua.',
      type: 'canvas',
      content: `
        <h2>Template: Startup Enxuta</h2>
        <p>Este template é baseado na metodologia Lean Startup de Eric Ries, focando em construir-medir-aprender.</p>
        
        <h3>Componentes Principais:</h3>
        <ul>
          <li><strong>Problema:</strong> Qual problema você está resolvendo?</li>
          <li><strong>Solução:</strong> Como você resolve este problema?</li>
          <li><strong>Proposta de Valor Única:</strong> Por que você é diferente?</li>
          <li><strong>Vantagem Competitiva:</strong> O que te protege da concorrência?</li>
          <li><strong>Segmentos de Clientes:</strong> Quem são seus early adopters?</li>
          <li><strong>Métricas-Chave:</strong> Como você mede o sucesso?</li>
          <li><strong>Canais:</strong> Como você alcança seus clientes?</li>
          <li><strong>Estrutura de Custos:</strong> Quais são seus principais custos?</li>
          <li><strong>Fontes de Receita:</strong> Como você ganha dinheiro?</li>
        </ul>
        
        <h3>Metodologia:</h3>
        <ol>
          <li>Identifique o problema</li>
          <li>Crie hipóteses</li>
          <li>Construa um MVP</li>
          <li>Meça os resultados</li>
          <li>Aprenda e itere</li>
        </ol>
      `
    },
    {
      id: 'saas-b2b',
      name: 'SaaS B2B',
      description: 'Template especializado para Software as a Service voltado para empresas, com foco em métricas SaaS e vendas B2B.',
      type: 'matrix',
      content: `
        <h2>Template: SaaS B2B</h2>
        <p>Template especializado para negócios SaaS B2B, focando em métricas específicas e modelo de assinatura.</p>
        
        <h3>Métricas SaaS Essenciais:</h3>
        <ul>
          <li><strong>MRR (Monthly Recurring Revenue):</strong> Receita recorrente mensal</li>
          <li><strong>ARR (Annual Recurring Revenue):</strong> Receita recorrente anual</li>
          <li><strong>CAC (Customer Acquisition Cost):</strong> Custo de aquisição de cliente</li>
          <li><strong>LTV (Lifetime Value):</strong> Valor do tempo de vida do cliente</li>
          <li><strong>Churn Rate:</strong> Taxa de cancelamento</li>
          <li><strong>NPS (Net Promoter Score):</strong> Satisfação do cliente</li>
        </ul>
        
        <h3>Funil de Vendas B2B:</h3>
        <ol>
          <li>Lead Generation</li>
          <li>Lead Qualification</li>
          <li>Demo/Trial</li>
          <li>Proposta</li>
          <li>Negociação</li>
          <li>Fechamento</li>
          <li>Onboarding</li>
          <li>Success & Expansion</li>
        </ol>
        
        <h3>Modelo de Precificação:</h3>
        <ul>
          <li>Freemium</li>
          <li>Tiered Pricing</li>
          <li>Usage-based</li>
          <li>Per-seat</li>
        </ul>
      `
    },
    {
      id: 'marketplace',
      name: 'Marketplace',
      description: 'Template para plataformas que conectam dois ou mais grupos de usuários, focando no problema do ovo e da galinha.',
      type: 'map',
      content: `
        <h2>Template: Marketplace</h2>
        <p>Template para negócios de marketplace, focando na criação de valor para múltiplos lados da plataforma.</p>
        
        <h3>Lados do Marketplace:</h3>
        <ul>
          <li><strong>Lado da Oferta:</strong> Quem oferece produtos/serviços?</li>
          <li><strong>Lado da Demanda:</strong> Quem consome produtos/serviços?</li>
          <li><strong>Facilitador:</strong> Como a plataforma conecta os lados?</li>
        </ul>
        
        <h3>Problema do Ovo e da Galinha:</h3>
        <ol>
          <li>Identifique qual lado priorizar primeiro</li>
          <li>Crie incentivos para o lado inicial</li>
          <li>Use estratégias de "fake it till you make it"</li>
          <li>Construa densidade em nichos específicos</li>
          <li>Expanda gradualmente</li>
        </ol>
        
        <h3>Métricas de Marketplace:</h3>
        <ul>
          <li>GMV (Gross Merchandise Value)</li>
          <li>Take Rate (% de comissão)</li>
          <li>Liquidity (oferta vs demanda)</li>
          <li>Repeat Usage Rate</li>
          <li>Time to First Transaction</li>
        </ul>
        
        <h3>Estratégias de Monetização:</h3>
        <ul>
          <li>Comissão por transação</li>
          <li>Taxa de listagem</li>
          <li>Assinatura premium</li>
          <li>Publicidade</li>
          <li>Serviços adicionais</li>
        </ul>
      `
    }
  ];

  const handleNewFramework = (template?: any) => {
    if (template) {
      setNewFrameworkName(template.name);
      setNewFrameworkDescription(template.description);
      setNewFrameworkType(template.type);
      setNewFrameworkCanvaUrl('');
      setInitialNewFrameworkData(template);
    } else {
      setNewFrameworkName('');
      setNewFrameworkDescription('');
      setNewFrameworkType('canvas');
      setNewFrameworkCanvaUrl('');
      setInitialNewFrameworkData(null);
    }
    setShowNewFrameworkModal(true);
  };

  const handleContinue = (framework: Framework) => {
    // Começar é uma jornada de trabalho, não uma prévia: abre em tela cheia.
    sessionStorage.setItem('currentFramework', framework.name);
    navigate(`/dashboard/frameworks/${framework.id}/game`);
  };

  const handleComments = (frameworkId: string) => {
    setShowComments(frameworkId);
  };

  const handleCreateFramework = () => {
    const newFramework: CustomFramework = {
      id: `custom-${Date.now()}`,
      name: newFrameworkName,
      description: newFrameworkDescription,
      type: newFrameworkType,
      content: initialNewFrameworkData?.content || `<h2>${newFrameworkName}</h2><p>${newFrameworkDescription}</p><h3>Como aplicar</h3><ol><li>Defina o objetivo que deseja alcançar.</li><li>Preencha o framework com o time.</li><li>Registre decisões e próximos passos.</li></ol>`,
      canvaUrl: newFrameworkCanvaUrl.trim() || undefined,
      progress: 0,
      icon: FileText,
      comments: 0,
      createdAt: new Date().toISOString(),
    };

    setCustomFrameworks((current) => {
      const updated = [newFramework, ...current];
      localStorage.setItem('orientohub:custom-frameworks', JSON.stringify(updated));
      return updated;
    });
    
    setShowNewFrameworkModal(false);
    setNewFrameworkName('');
    setNewFrameworkDescription('');
    setNewFrameworkType('canvas');
    setNewFrameworkCanvaUrl('');
    setInitialNewFrameworkData(null);
    
  };

  const handleDeleteCustomFramework = (id: string) => {
    setCustomFrameworks((current) => {
      const updated = current.filter((framework) => framework.id !== id);
      localStorage.setItem('orientohub:custom-frameworks', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    if (!showNewFrameworkModal) {
      setNewFrameworkName('');
      setNewFrameworkDescription('');
      setNewFrameworkType('canvas');
      setNewFrameworkCanvaUrl('');
      setInitialNewFrameworkData(null);
    }
  }, [showNewFrameworkModal]);

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-500';
    if (progress >= 50) return 'text-primary-500';
    if (progress >= 20) return 'text-blue-500';
    return 'text-gray-500';
  };

  const frameworksWithProgress = frameworks.map((framework) => {
    const savedValue = localStorage.getItem(`orientohub:framework-progress:${framework.id}`);
    const saved = Number(savedValue);
    return savedValue !== null && Number.isFinite(saved) ? { ...framework, progress: saved } : framework;
  });

  const filteredFrameworks = frameworksWithProgress.filter(framework => {
    const matchesSearch = framework.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         framework.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>Frameworks - Orientohub</title>
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
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                  <Layers className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold flex items-center gap-2">
                    Frameworks Estratégicos
                    <Sparkles className="w-6 h-6 text-primary-500" />
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Metodologias validadas para estruturar seu negócio
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleNewFramework()}
              className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-black font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-primary-500/30"
            >
              <Plus className="w-5 h-5" />
              Novo Framework
            </button>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { 
                label: 'Total de Frameworks', 
                value: frameworksWithProgress.length, 
                icon: Layers, 
                color: 'from-gray-600 to-gray-700', 
                bgColor: 'bg-gray-500/10' 
              },
              { 
                label: 'Em Progresso', 
                value: frameworksWithProgress.filter(f => f.progress > 0 && f.progress < 100).length, 
                icon: TrendingUp, 
                color: 'from-primary-400 to-primary-600', 
                bgColor: 'bg-primary-500/10' 
              },
              { 
                label: 'Concluídos', 
                value: frameworksWithProgress.filter(f => f.progress === 100).length, 
                icon: CheckSquare, 
                color: 'from-green-500 to-green-600', 
                bgColor: 'bg-green-500/10' 
              },
              { 
                label: 'Templates Disponíveis', 
                value: recommendedTemplates.length, 
                icon: FileText, 
                color: 'from-blue-500 to-blue-600', 
                bgColor: 'bg-blue-500/10' 
              }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-all group"
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

          {/* Search */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar frameworks..."
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Frameworks Grid */}
          <div>
            <h2 className="text-xl font-bold mb-6">Frameworks Disponíveis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFrameworks.map((framework, index) => (
                <FrameworkCard
                  key={framework.id}
                  framework={framework}
                  index={index}
                  onContinue={handleContinue}
                  onComments={handleComments}
                  getProgressColor={getProgressColor}
                />
              ))}
            </div>
          </div>

          {/* Templates Section */}
          <div className="mt-12">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Templates Recomendados</h2>
              <p className="mt-1 text-sm text-[#9ba9bc]">Comece com uma estrutura pronta e adapte-a à realidade do seu negócio.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedTemplates.map((template, index) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  index={index}
                  onUseTemplate={handleNewFramework}
                  onPreview={setSelectedTemplate}
                />
              ))}
            </div>
          </div>

          {/* Seção de Frameworks Personalizados */}
          <div className="mt-12">
            <div className="mb-6"><h2 className="text-xl font-bold">Meus Frameworks Personalizados</h2></div>
            {customFrameworks.length ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {customFrameworks.map((framework) => (
                  <CustomFrameworkCard key={framework.id} framework={framework} onOpen={() => { setSelectedFramework(framework); setShowFrameworkModal(true); }} onDelete={() => handleDeleteCustomFramework(framework.id)} />
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-[#273548] bg-[#101722] p-6 shadow-[0_12px_28px_rgba(0,0,0,0.16)] sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#34455a] bg-[#0c121b] text-primary-300"><FileText className="h-6 w-6" /></div>
                    <div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary-300">Sua biblioteca</p><h3 className="mt-1 text-xl font-bold text-white">Crie um framework para o seu jeito de trabalhar</h3><p className="mt-2 max-w-xl text-sm leading-relaxed text-[#9ba9bc]">Registre processos próprios, transforme aprendizados em rotinas e mantenha uma estrutura que o seu time possa reutilizar.</p></div>
                  </div>
                  <button onClick={() => handleNewFramework()} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-primary-400"><Plus className="h-4 w-4" /> Criar framework</button>
                </div>
                <div className="mt-6 grid gap-3 border-t border-[#273548] pt-5 sm:grid-cols-3">
                  {['Comece por um template', 'Ajuste para o seu contexto', 'Use como referência do time'].map((step, index) => <div key={step} className="flex items-center gap-3 text-sm text-gray-300"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#1b2635] text-xs font-bold text-primary-300">{index + 1}</span>{step}</div>)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <TemplateSetupModal
        isOpen={showNewFrameworkModal}
        template={initialNewFrameworkData}
        name={newFrameworkName}
        description={newFrameworkDescription}
        type={newFrameworkType}
        canvaUrl={newFrameworkCanvaUrl}
        onClose={() => setShowNewFrameworkModal(false)}
        onNameChange={setNewFrameworkName}
        onDescriptionChange={setNewFrameworkDescription}
        onTypeChange={setNewFrameworkType}
        onCanvaUrlChange={setNewFrameworkCanvaUrl}
        onSubmit={handleCreateFramework}
      />

      {/* Framework Details Modal */}
      <FrameworkModal
        isOpen={showFrameworkModal}
        onClose={() => setShowFrameworkModal(false)}
        title={selectedFramework?.name || ''}
        enableGamification={!selectedFramework?.id.startsWith('custom-')}
      >
        {selectedFramework?.content ? <div className="space-y-6"><div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: selectedFramework.content }} />{selectedFramework.canvaUrl && <CanvaMaterialPreview url={selectedFramework.canvaUrl} />}</div> : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Conteúdo em desenvolvimento...
            </p>
          </div>
        )}
      </FrameworkModal>

      <TemplatePreviewModal
        template={selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
        onUseTemplate={(template) => {
          setSelectedTemplate(null);
          handleNewFramework(template);
        }}
      />
    </>
  );
};

// Framework Card Component
interface FrameworkCardProps {
  framework: Framework;
  index: number;
  onContinue: (framework: Framework) => void;
  onComments: (id: string) => void;
  getProgressColor: (progress: number) => string;
}

const FrameworkCard = ({ framework, index, onContinue, onComments, getProgressColor }: FrameworkCardProps) => {
  const Icon = framework.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group overflow-hidden rounded-2xl border border-[#273548] bg-[#101722] shadow-[0_12px_28px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-400/70 hover:shadow-[0_20px_38px_rgba(0,0,0,0.28)]"
    >
      {/* Header */}
      <div className="border-b border-[#273548] bg-[#151f2b]">
        <div className="p-5 sm:p-6 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#34455a] bg-[#0c121b] shadow-inner shadow-black/20">
              <Icon className="h-6 w-6 text-primary-300" />
            </div>
            <div>
              <h3 className="mb-2 text-lg font-bold text-white">{framework.name}</h3>
              <span className={`inline-block rounded-full border border-[#34455a] bg-[#0c121b] px-2.5 py-1 text-xs font-bold ${getProgressColor(framework.progress)}`}>
                {framework.progress}% completo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-5 p-5 sm:p-6">
        <p className="line-clamp-2 text-sm leading-relaxed text-[#9ba9bc]">
          {framework.description}
        </p>

        {/* Progress */}
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-[#9ba9bc]">Progresso</span>
            <span className={`font-bold ${getProgressColor(framework.progress)}`}>{framework.progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#0c121b]">
            <motion.div
              className={`h-full rounded-full ${
                framework.progress >= 80 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                framework.progress >= 50 ? 'bg-gradient-to-r from-primary-400 to-primary-600' :
                framework.progress >= 20 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                'bg-gradient-to-r from-gray-400 to-gray-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${framework.progress}%` }}
              transition={{ duration: 1, delay: 0.2 + index * 0.05 }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 border-t border-[#273548] pt-4">
          <button
            onClick={() => onContinue(framework)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 font-bold text-black transition-all hover:bg-primary-400"
          >
            <Play className="w-4 h-4" />
            {framework.progress > 0 ? 'Continuar' : 'Começar'}
          </button>
          
          <button
            onClick={() => onComments(framework.id)}
            className="flex items-center gap-2 rounded-xl border border-[#34455a] bg-[#1b2635] px-4 py-2.5 text-gray-300 transition-all hover:border-[#4c6078] hover:bg-[#233043]"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">{framework.comments}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const CustomFrameworkCard = ({ framework, onOpen, onDelete }: { framework: CustomFramework; onOpen: () => void; onDelete: () => void }) => (
  <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-primary-400 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
    <div className="flex items-start justify-between gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-500/12 text-primary-500"><FileText className="h-5 w-5" /></div>
      <button onClick={onDelete} aria-label={`Excluir ${framework.name}`} className="rounded-lg p-1.5 text-gray-400 opacity-0 transition hover:bg-red-500/10 hover:text-red-500 group-hover:opacity-100"><X className="h-4 w-4" /></button>
    </div>
    <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.12em] text-primary-500">{framework.type}</p>
    <h3 className="mt-1 text-lg font-bold text-gray-900 dark:text-white">{framework.name}</h3>
    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{framework.description}</p>
    <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700"><span className="text-xs text-gray-500">Criado em {new Date(framework.createdAt).toLocaleDateString('pt-BR')}</span><button onClick={onOpen} className="text-sm font-bold text-primary-500 transition hover:text-primary-400">Abrir estrutura</button></div>
  </motion.article>
);

const getCanvaEmbedUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith('canva.com')) return null;
    return /[?&]embed(?:=|&|$)/.test(url) ? url : `${url}${url.includes('?') ? '&' : '?'}embed`;
  } catch {
    return null;
  }
};

const CanvaMaterialPreview = ({ url }: { url: string }) => {
  const embedUrl = getCanvaEmbedUrl(url);
  return <section className="not-prose overflow-hidden rounded-2xl border border-primary-400/25 bg-[#101722]">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#273548] bg-[#151f2b] px-4 py-3">
      <div><p className="text-sm font-bold text-white">Material complementar</p><p className="mt-0.5 text-xs text-[#9ba9bc]">Referência visual disponível no Canva.</p></div>
      <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-3 py-2 text-xs font-bold text-black transition hover:bg-primary-400"><ExternalLink className="h-3.5 w-3.5" />Abrir no Canva</a>
    </div>
    {embedUrl ? <iframe src={embedUrl} title="Prévia do material no Canva" className="h-[430px] w-full bg-white" allowFullScreen /> : <div className="p-5 text-sm text-[#9ba9bc]">A prévia não está disponível para este link, mas o material pode ser aberto no Canva.</div>}
  </section>;
};

const TemplateSetupModal = ({
  isOpen,
  template,
  name,
  description,
  type,
  canvaUrl,
  onClose,
  onNameChange,
  onDescriptionChange,
  onTypeChange,
  onCanvaUrlChange,
  onSubmit,
}: {
  isOpen: boolean;
  template: RecommendedTemplate | null;
  name: string;
  description: string;
  type: string;
  canvaUrl: string;
  onClose: () => void;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onCanvaUrlChange: (value: string) => void;
  onSubmit: () => void;
}) => {
  const outline = template
    ? Array.from(new DOMParser().parseFromString(template.content, 'text/html').querySelectorAll('h3')).map((heading) => heading.textContent?.trim()).filter(Boolean)
    : [];
  const canSubmit = name.trim().length > 0 && description.trim().length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
          <motion.div role="dialog" aria-modal="true" aria-labelledby="template-setup-title" className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-gray-700 bg-[#101722] shadow-2xl sm:rounded-3xl" initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.98 }} onMouseDown={(event) => event.stopPropagation()}>
            <header className="flex items-start justify-between gap-4 border-b border-gray-700 bg-[#151f2b] px-6 py-6 sm:px-8">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary-300">{template ? 'Personalize antes de criar' : 'Novo framework'}</p>
                <h2 id="template-setup-title" className="mt-1 text-2xl font-bold text-white">{template ? `Use o template ${template.name}` : 'Crie do seu jeito'}</h2>
                <p className="mt-2 text-sm text-gray-400">{template ? 'A base já está pronta. Ajuste apenas o que fizer sentido para o seu contexto.' : 'Dê um nome, descreva o objetivo e escolha o formato.'}</p>
              </div>
              <button onClick={onClose} aria-label="Fechar criação de framework" className="rounded-xl p-2 text-gray-300 transition hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button>
            </header>

            <div className="grid gap-5 p-5 sm:grid-cols-[1fr_0.75fr] sm:p-7">
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-100">Nome do framework</label>
                  <input value={name} onChange={(event) => onNameChange(event.target.value)} placeholder="Ex.: Canvas de validação" className="w-full rounded-xl border border-gray-600 bg-[#0c121b] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/15" autoFocus />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-100">Para que ele serve?</label>
                  <textarea value={description} onChange={(event) => onDescriptionChange(event.target.value)} rows={4} placeholder="Descreva em poucas linhas o resultado que este framework ajuda a alcançar." className="w-full resize-none rounded-xl border border-gray-600 bg-[#0c121b] px-4 py-3 text-sm leading-relaxed text-white outline-none transition placeholder:text-gray-500 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/15" />
                  <p className="mt-2 text-xs text-gray-500">Escreva pensando em quem vai usar o framework depois.</p>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-100">Formato de trabalho</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[['canvas', 'Canvas'], ['map', 'Mapa'], ['matrix', 'Matriz'], ['checklist', 'Checklist']].map(([value, label]) => (
                      <button key={value} type="button" onClick={() => onTypeChange(value)} className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${type === value ? 'border-primary-400 bg-primary-400/12 text-primary-200' : 'border-gray-700 bg-[#0c121b] text-gray-400 hover:border-gray-500 hover:text-gray-200'}`}>{label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-100">Material complementar no Canva <span className="font-normal text-gray-500">(opcional)</span></label>
                  <input value={canvaUrl} onChange={(event) => onCanvaUrlChange(event.target.value)} type="url" placeholder="Cole o link de visualização do Canva" className="w-full rounded-xl border border-gray-600 bg-[#0c121b] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/15" />
                  <p className="mt-2 text-xs text-gray-500">O link ficará disponível como referência clicável para quem usar este framework.</p>
                </div>
              </div>

              <aside className="rounded-2xl border border-primary-400/20 bg-primary-400/[0.06] p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-400/15 text-primary-300"><FileText className="h-5 w-5" /></div>
                <h3 className="mt-4 text-base font-bold text-white">{template ? 'O que vem na base' : 'Próximo passo'}</h3>
                {template ? (
                  <>
                    <p className="mt-2 text-sm leading-relaxed text-gray-300">{template.description}</p>
                    <div className="mt-4 space-y-2 border-t border-primary-400/15 pt-4">
                      {outline.map((item, index) => <div key={item} className="flex gap-2 text-sm text-gray-300"><span className="font-bold text-primary-300">{String(index + 1).padStart(2, '0')}</span>{item}</div>)}
                    </div>
                  </>
                ) : <p className="mt-2 text-sm leading-relaxed text-gray-300">Você poderá começar pelo formato escolhido e evoluir o conteúdo conforme aprende com o negócio.</p>}
              </aside>
            </div>

            <footer className="flex flex-col-reverse gap-3 border-t border-gray-700 bg-[#0c121b] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <button onClick={onClose} className="rounded-xl px-4 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/8 hover:text-white">Cancelar</button>
              <button onClick={onSubmit} disabled={!canSubmit} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-40"><Plus className="h-4 w-4" />{template ? 'Criar a partir do template' : 'Criar framework'}</button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const TemplatePreviewModal = ({
  template,
  onClose,
  onUseTemplate,
}: {
  template: RecommendedTemplate | null;
  onClose: () => void;
  onUseTemplate: (template: RecommendedTemplate) => void;
}) => {
  if (!template) return null;

  const documentContent = new DOMParser().parseFromString(template.content, 'text/html');
  const intro = documentContent.querySelector('p')?.textContent?.trim() || template.description;
  const sections = Array.from(documentContent.querySelectorAll('h3')).map((heading) => {
    const next = heading.nextElementSibling;
    return {
      title: heading.textContent?.trim() || '',
      items: next ? Array.from(next.querySelectorAll('li')).map((item) => item.textContent?.trim() || '').filter(Boolean) : [],
      ordered: next?.tagName === 'OL',
    };
  }).filter((section) => section.items.length > 0);

  const [foundation, application] = sections;
  const typeLabels: Record<RecommendedTemplate['type'], string> = {
    canvas: 'Canvas estratégico',
    matrix: 'Matriz de decisão',
    map: 'Mapa de operação',
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[70] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={onClose}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="template-preview-title"
          className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-t-3xl border border-gray-700 bg-[#101722] shadow-2xl sm:rounded-3xl"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <div className="relative overflow-hidden border-b border-gray-700/80 bg-[radial-gradient(circle_at_top_right,_rgba(250,204,21,0.2),_transparent_36%),linear-gradient(135deg,_#182432,_#101722)] px-6 py-7 sm:px-9">
            <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full border-[18px] border-primary-400/15" />
            <div className="relative flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-primary-400/30 bg-primary-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-primary-300">Prévia do template</span>
                  <span className="rounded-full bg-white/8 px-3 py-1 text-xs font-medium text-gray-300">{typeLabels[template.type]}</span>
                </div>
                <h2 id="template-preview-title" className="text-2xl font-bold text-white sm:text-3xl">{template.name}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base">{intro}</p>
              </div>
              <button onClick={onClose} aria-label="Fechar prévia" className="rounded-xl p-2 text-gray-300 transition hover:bg-white/10 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-[1.1fr_0.9fr] sm:p-7">
            <section className="rounded-2xl border border-gray-700 bg-[#0c121b] p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-400/12 text-primary-300"><Layout className="h-5 w-5" /></div>
                <div><p className="text-sm font-bold text-white">{foundation?.title || 'O que você vai estruturar'}</p><p className="text-xs text-gray-400">Preencha com informações reais do seu negócio.</p></div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {(foundation?.items || []).map((item, index) => (
                  <div key={item} className="flex gap-3 rounded-xl border border-gray-700/80 bg-gray-800/40 p-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-400/15 text-[11px] font-bold text-primary-300">{index + 1}</span>
                    <span className="text-sm leading-snug text-gray-200">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-gray-700 bg-[#0c121b] p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/10 text-blue-300"><Play className="h-5 w-5" /></div>
                <div><p className="text-sm font-bold text-white">{application?.title || 'Como aplicar'}</p><p className="text-xs text-gray-400">Comece simples e evolua a partir do aprendizado.</p></div>
              </div>
              <ol className="space-y-3">
                {(application?.items || ['Escolha um problema ou oportunidade real para trabalhar.', 'Preencha o template com o time e registre as hipóteses.', 'Defina uma ação de validação antes de seguir para a próxima etapa.']).map((item, index) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-gray-300"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-400/10 text-xs font-bold text-blue-300">{index + 1}</span>{item}</li>
                ))}
              </ol>
            </section>
          </div>

          <div className="flex flex-col gap-3 border-t border-gray-700 bg-[#0c121b] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <p className="text-xs leading-relaxed text-gray-400">Ao usar o template, você poderá ajustar nome, descrição e formato antes de criar seu framework.</p>
            <button onClick={() => onUseTemplate(template)} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-primary-400">
              <Plus className="h-4 w-4" /> Usar este template
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Template Card Component
interface TemplateCardProps {
  template: RecommendedTemplate;
  index: number;
  onUseTemplate: (template: RecommendedTemplate) => void;
  onPreview: (template: RecommendedTemplate) => void;
}

const TemplateCard = ({ template, index, onUseTemplate, onPreview }: TemplateCardProps) => {
  const getTypeColor = (type: string) => {
    const types: Record<string, any> = {
      canvas: { bg: 'border border-blue-400/20 bg-blue-400/10', text: 'text-blue-300', icon: Layout },
      matrix: { bg: 'border border-emerald-400/20 bg-emerald-400/10', text: 'text-emerald-300', icon: BarChart2 },
      map: { bg: 'border border-purple-400/20 bg-purple-400/10', text: 'text-purple-300', icon: GitBranch }
    };
    return types[type] || types.canvas;
  };

  const typeInfo = getTypeColor(template.type);
  const TypeIcon = typeInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
      className="group rounded-2xl border border-[#273548] bg-[#101722] p-5 shadow-[0_12px_28px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-400/70 hover:shadow-[0_20px_38px_rgba(0,0,0,0.28)]"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-white">{template.name}</h3>
        <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium ${typeInfo.bg} ${typeInfo.text}`}>
          <TypeIcon className="h-3.5 w-3.5" /> {template.type}
        </span>
      </div>
      <p className="mb-5 text-sm leading-relaxed text-[#9ba9bc]">
        {template.description}
      </p>
      <div className="flex gap-2">
        <button 
          onClick={() => onUseTemplate(template)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-bold text-black transition-all hover:bg-primary-400"
        >
          <Plus className="w-4 h-4" />
          Usar template
        </button>
        <button 
          onClick={() => onPreview(template)}
          className="flex items-center gap-2 rounded-xl border border-[#34455a] bg-[#1b2635] px-4 py-2.5 text-sm font-medium text-gray-300 transition-all hover:border-[#4c6078] hover:bg-[#233043]"
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>
      </div>
    </motion.div>
  );
};

export default FrameworksPage;
