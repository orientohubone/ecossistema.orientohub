import { useState } from 'react';
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

  const handleNewFramework = () => {
    setShowNewFrameworkModal(true);
  };

  const handleContinue = (framework: Framework) => {
    setSelectedFramework(framework);
    setShowFrameworkModal(true);
  };

  const handleComments = (frameworkId: string) => {
    setShowComments(frameworkId);
  };

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
            {['Startup Enxuta', 'SaaS B2B', 'Marketplace'].map((template, index) => (
              <motion.div
                key={template}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              >
                <h3 className="font-medium mb-2">{template}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Template otimizado para {template.toLowerCase()}.
                </p>
                <button 
                  onClick={() => alert(`Usar template: ${template}`)}
                  className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                >
                  Usar template
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* New Framework Modal */}
      <FrameworkModal
        isOpen={showNewFrameworkModal}
        onClose={() => setShowNewFrameworkModal(false)}
        title="Novo Framework"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome do Framework</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
              placeholder="Ex: Canvas de Validação"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
              placeholder="Descreva o objetivo e uso do framework..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700">
              <option value="canvas">Canvas</option>
              <option value="map">Mapa</option>
              <option value="matrix">Matriz</option>
              <option value="checklist">Checklist</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowNewFrameworkModal(false)}
              className="btn-outline"
            >
              Cancelar
            </button>
            <button className="btn-primary">
              Criar Framework
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