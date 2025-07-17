import { useState } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { BarChart2, CheckSquare, FileText, Target, Award, Zap, Layout, Users, MessageSquare, Lightbulb, Building2, Brain, Target as TargetIcon, Briefcase, GitBranch, LineChart } from 'lucide-react';
import FrameworkModal from '../components/modals/FrameworkModal';

interface Framework {
  id: string;
  name: string;
  description: string;
  progress: number;
  icon: any;
  comments: number;
  content?: string;
}

const FrameworksPage = () => {
  const { t } = useTranslation();
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null);
  const [showNewFrameworkModal, setShowNewFrameworkModal] = useState(false);
  const [showFrameworkModal, setShowFrameworkModal] = useState(false);
  const [showComments, setShowComments] = useState<string | null>(null);
  
  // Estados para o formulário de novo framework
  const [newFrameworkName, setNewFrameworkName] = useState('');
  const [newFrameworkDescription, setNewFrameworkDescription] = useState('');
  const [newFrameworkType, setNewFrameworkType] = useState('canvas');
  const [initialNewFrameworkData, setInitialNewFrameworkData] = useState<any>(null);

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
  const recommendedTemplates = [
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
      // Preencher formulário com dados do template
      setNewFrameworkName(template.name);
      setNewFrameworkDescription(template.description);
      setNewFrameworkType(template.type);
      setInitialNewFrameworkData(template);
    } else {
      // Limpar formulário para novo framework
      setNewFrameworkName('');
      setNewFrameworkDescription('');
      setNewFrameworkType('canvas');
      setInitialNewFrameworkData(null);
    }
    setShowNewFrameworkModal(true);
  };

  const handleContinue = (framework: Framework) => {
    setSelectedFramework(framework);
    setShowFrameworkModal(true);
  };

  const handleComments = (frameworkId: string) => {
    setShowComments(frameworkId);
  };

  const handleCreateFramework = () => {
    // Aqui você pode implementar a lógica para salvar o framework
    const newFramework = {
      name: newFrameworkName,
      description: newFrameworkDescription,
      type: newFrameworkType,
      content: initialNewFrameworkData?.content || '',
      createdAt: new Date().toISOString(),
    };
    
    console.log('Novo framework criado:', newFramework);
    
    // Fechar modal e limpar formulário
    setShowNewFrameworkModal(false);
    setNewFrameworkName('');
    setNewFrameworkDescription('');
    setNewFrameworkType('canvas');
    setInitialNewFrameworkData(null);
    
    // Aqui você pode adicionar uma notificação de sucesso
    alert('Framework criado com sucesso!');
  };

  // Limpar formulário quando modal for fechado
  useEffect(() => {
    if (!showNewFrameworkModal) {
      setNewFrameworkName('');
      setNewFrameworkDescription('');
      setNewFrameworkType('canvas');
      setInitialNewFrameworkData(null);
    }
  }, [showNewFrameworkModal]);

  return (
    <>
      <Helmet>
        <title>Frameworks | Orientohub</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Frameworks</h1>
          <button 
            onClick={handleNewFramework}
            className="btn-primary"
          >
            Novo Framework
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {frameworks.map((framework) => {
            const Icon = framework.icon;
            return (
              <motion.div
                key={framework.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <span className="text-sm font-medium bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-200 py-1 px-2 rounded-full">
                      {framework.progress}% completo
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{framework.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {framework.description}
                  </p>
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${framework.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={() => handleContinue(framework)}
                      className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                    >
                      Continuar
                    </button>
                    <button
                      onClick={() => handleComments(framework.id)}
                      className="flex items-center text-gray-500 dark:text-gray-400 text-sm hover:text-primary-500 dark:hover:text-primary-400"
                    >
                      <MessageSquare size={16} className="mr-1" />
                      <span>{framework.comments} comentários</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Templates Section */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6">Templates Recomendados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">{template.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    template.type === 'canvas' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                    template.type === 'matrix' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                    'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                  }`}>
                    {template.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {template.description}
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleNewFramework(template)}
                    className="flex-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 bg-primary-50 dark:bg-primary-900/20 px-3 py-2 rounded-md transition-colors"
                  >
                    Usar template
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedFramework({
                        id: template.id,
                        name: template.name,
                        description: template.description,
                        progress: 0,
                        icon: FileText,
                        comments: 0,
                        content: template.content
                      });
                      setShowFrameworkModal(true);
                    }}
                    className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 px-3 py-2 rounded-md transition-colors"
                  >
                    Preview
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Seção de Frameworks Personalizados */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Meus Frameworks Personalizados</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Em breve - funcionalidade de salvar frameworks personalizados
            </span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
              Nenhum framework personalizado ainda
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Crie seus próprios frameworks personalizados usando os templates como base
            </p>
            <button 
              onClick={() => handleNewFramework()}
              className="btn-primary"
                >
              Criar Primeiro Framework
            </button>
          </div>
        </div>
      </div>

      {/* New Framework Modal */}
      <FrameworkModal
        isOpen={showNewFrameworkModal}
        onClose={() => setShowNewFrameworkModal(false)}
        title={initialNewFrameworkData ? `Criar Framework: ${initialNewFrameworkData.name}` : "Novo Framework"}
      >
        <div className="space-y-4">
          {initialNewFrameworkData && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                📋 Template Selecionado: {initialNewFrameworkData.name}
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Este framework será criado baseado no template selecionado. Você pode personalizar os campos abaixo.
              </p>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-1">Nome do Framework</label>
            <input
              type="text"
              value={newFrameworkName}
              onChange={(e) => setNewFrameworkName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
              placeholder="Ex: Canvas de Validação"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              rows={3}
              value={newFrameworkDescription}
              onChange={(e) => setNewFrameworkDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
              placeholder="Descreva o objetivo e uso do framework..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <select 
              value={newFrameworkType}
              onChange={(e) => setNewFrameworkType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
            >
              <option value="canvas">Canvas</option>
              <option value="map">Mapa</option>
              <option value="matrix">Matriz</option>
              <option value="checklist">Checklist</option>
            </select>
          </div>
          
          {initialNewFrameworkData && (
            <div>
              <label className="block text-sm font-medium mb-2">Preview do Conteúdo</label>
              <div className="max-h-40 overflow-y-auto bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md border">
                <div 
                  className="prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: initialNewFrameworkData.content }}
                />
              </motion.div>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowNewFrameworkModal(false)}
              className="btn-outline"
            >
              Cancelar
            </button>
            <button 
              onClick={handleCreateFramework}
              disabled={!newFrameworkName.trim() || !newFrameworkDescription.trim()}
              className={`btn-primary ${
                !newFrameworkName.trim() || !newFrameworkDescription.trim() 
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
              }`}
            >
              {initialNewFrameworkData ? 'Criar com Template' : 'Criar Framework'}
            </button>
          </div>
        </div>
      </FrameworkModal>

      {/* Framework Details Modal */}
      <FrameworkModal
        isOpen={showFrameworkModal}
        onClose={() => setShowFrameworkModal(false)}
        title={selectedFramework?.name || ''}
      >
        {selectedFramework?.content ? (
          <div 
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: selectedFramework.content }}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Conteúdo em desenvolvimento...
            </p>
          </div>
        )}
      </FrameworkModal>
    </>
  );
};

export default FrameworksPage;