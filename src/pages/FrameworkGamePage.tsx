import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Star, Target, CheckCircle, Play, ArrowRight, Info } from 'lucide-react';

interface GameStep {
  id: number;
  title: string;
  description: string;
  points: number;
  challenge: string;
  instructions: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

const FrameworkGamePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [framework, setFramework] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [level, setLevel] = useState(1);
  const [points, setPoints] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userNotes, setUserNotes] = useState<string>('');
  const [stepCompleted, setStepCompleted] = useState(false);

  // Define game steps based on framework
  const getGameSteps = (frameworkName: string): GameStep[] => {
    const baseSteps: Record<string, GameStep[]> = {
      'Business Model Canvas': [
        {
          id: 1,
          title: 'Defina sua Proposta de Valor',
          description: 'Identifique o valor único que sua solução oferece aos clientes.',
          points: 50,
          challenge: 'Escreva em uma frase clara qual problema você resolve e como.',
          instructions: 'Saia da plataforma e dedique 15-30 minutos para refletir sobre seu negócio. Escreva em um papel ou documento a proposta de valor da sua startup. Quando terminar, volte aqui e marque como concluído.'
        },
        {
          id: 2,
          title: 'Identifique Segmentos de Clientes',
          description: 'Defina quem são seus clientes-alvo de forma específica.',
          points: 40,
          challenge: 'Liste 3 personas detalhadas dos seus clientes ideais.',
          instructions: 'Crie um documento separado e desenvolva 3 personas completas com idade, profissão, dores, necessidades e comportamentos. Use ferramentas como papel, Word ou Notion.'
        },
        {
          id: 3,
          title: 'Mapeie Canais de Distribuição',
          description: 'Determine como você vai alcançar seus clientes.',
          points: 40,
          challenge: 'Identifique 5 canais diferentes para chegar aos seus clientes.',
          instructions: 'Pesquise e liste canais como redes sociais, parcerias, vendas diretas, etc. Anote onde seus clientes estão presentes e como você pode alcançá-los.'
        },
        {
          id: 4,
          title: 'Estruture Fontes de Receita',
          description: 'Defina como sua startup vai gerar dinheiro.',
          points: 60,
          challenge: 'Crie pelo menos 2 modelos de monetização diferentes.',
          instructions: 'Desenvolva modelos como assinatura, venda única, freemium, etc. Calcule preços estimados e justifique cada modelo escolhido.'
        },
        {
          id: 5,
          title: 'Calcule Estrutura de Custos',
          description: 'Identifique todos os custos necessários para operar.',
          points: 50,
          challenge: 'Liste custos fixos e variáveis com valores estimados.',
          instructions: 'Crie uma planilha com todos os custos: pessoal, tecnologia, marketing, operacional. Separe entre fixos e variáveis e estime valores mensais.'
        }
      ],
      'Customer Development': [
        {
          id: 1,
          title: 'Customer Discovery - Identificação do Problema',
          description: 'Valide se o problema que você identificou realmente existe.',
          points: 60,
          challenge: 'Realize 5 entrevistas com potenciais clientes sobre o problema.',
          instructions: 'Saia e converse com pessoas do seu público-alvo. Prepare um roteiro de perguntas sobre as dores que elas enfrentam. Documente as respostas e insights.'
        },
        {
          id: 2,
          title: 'Customer Discovery - Definição de Personas',
          description: 'Crie personas baseadas nas entrevistas realizadas.',
          points: 40,
          challenge: 'Desenvolva 2-3 personas detalhadas baseadas nos dados coletados.',
          instructions: 'Use os insights das entrevistas para criar personas realistas. Inclua dados demográficos, comportamentos, motivações e frustrações específicas.'
        },
        {
          id: 3,
          title: 'Customer Validation - MVP Conceitual',
          description: 'Crie uma versão inicial da sua solução para testar.',
          points: 80,
          challenge: 'Desenvolva um protótipo ou mockup da sua solução.',
          instructions: 'Crie um protótipo simples usando ferramentas como Figma, papel, ou até mesmo uma apresentação. O objetivo é ter algo tangível para mostrar aos clientes.'
        },
        {
          id: 4,
          title: 'Customer Validation - Teste com Early Adopters',
          description: 'Valide sua solução com clientes dispostos a testar.',
          points: 70,
          challenge: 'Teste seu MVP com 3-5 early adopters e colete feedback.',
          instructions: 'Encontre pessoas dispostas a testar sua solução. Apresente o protótipo, observe como elas interagem e documente todo o feedback recebido.'
        },
        {
          id: 5,
          title: 'Customer Creation - Estratégia Go-to-Market',
          description: 'Defina como você vai lançar e escalar sua solução.',
          points: 60,
          challenge: 'Crie um plano de lançamento com canais e métricas definidas.',
          instructions: 'Desenvolva uma estratégia completa de lançamento: canais de aquisição, métricas de sucesso, cronograma e orçamento inicial de marketing.'
        }
      ],
      'Mapa de Empatia': [
        {
          id: 1,
          title: 'O que o cliente pensa e sente?',
          description: 'Explore as emoções e pensamentos do seu cliente.',
          points: 40,
          challenge: 'Liste 5 preocupações e 5 aspirações do seu cliente.',
          instructions: 'Converse com clientes ou faça pesquisas online. Documente medos, preocupações, sonhos e aspirações. Use entrevistas ou questionários para coletar esses dados.'
        },
        {
          id: 2,
          title: 'O que o cliente vê?',
          description: 'Identifique o ambiente e influências visuais.',
          points: 30,
          challenge: 'Descreva o ambiente onde seu cliente toma decisões.',
          instructions: 'Observe ou pergunte sobre o ambiente físico e digital do cliente. Que sites visitam? Que ambientes frequentam? Que influências visuais recebem?'
        },
        {
          id: 3,
          title: 'O que o cliente ouve?',
          description: 'Mapeie as influências auditivas e opiniões.',
          points: 30,
          challenge: 'Identifique quem influencia as decisões do seu cliente.',
          instructions: 'Descubra quais pessoas, mídias, podcasts, ou fontes de informação seu cliente consome. Quem são os influenciadores na vida dele?'
        },
        {
          id: 4,
          title: 'O que o cliente fala e faz?',
          description: 'Observe comportamentos e atitudes públicas.',
          points: 40,
          challenge: 'Documente 3 comportamentos típicos do seu cliente.',
          instructions: 'Observe comportamentos reais ou pergunte sobre rotinas diárias. Como agem em público? Que linguagem usam? Quais são seus hábitos?'
        },
        {
          id: 5,
          title: 'Dores e Ganhos',
          description: 'Identifique frustrações e benefícios desejados.',
          points: 60,
          challenge: 'Liste 3 principais dores e 3 ganhos esperados.',
          instructions: 'Compile todas as informações coletadas para identificar as principais frustrações e os benefícios que seu cliente mais valoriza. Priorize por importância.'
        }
      ],
      'Design Thinking': [
        {
          id: 1,
          title: 'Empatia - Imersão no Usuário',
          description: 'Compreenda profundamente as necessidades dos usuários.',
          points: 50,
          challenge: 'Realize observações e entrevistas com 3-5 usuários.',
          instructions: 'Saia e observe usuários em seu ambiente natural. Faça entrevistas abertas sobre suas experiências, frustrações e necessidades. Documente tudo sem julgamentos.'
        },
        {
          id: 2,
          title: 'Definição - Síntese do Problema',
          description: 'Defina claramente o problema a ser resolvido.',
          points: 40,
          challenge: 'Crie uma declaração de problema clara e específica.',
          instructions: 'Analise os dados coletados na fase de empatia. Identifique padrões e defina o problema real. Escreva uma frase que capture a essência do desafio.'
        },
        {
          id: 3,
          title: 'Ideação - Geração de Soluções',
          description: 'Gere o máximo de ideias possíveis para resolver o problema.',
          points: 60,
          challenge: 'Conduza uma sessão de brainstorming e gere 20+ ideias.',
          instructions: 'Use técnicas como brainstorming, mapas mentais ou SCAMPER. Foque na quantidade, não na qualidade. Anote todas as ideias, mesmo as mais malucas.'
        },
        {
          id: 4,
          title: 'Prototipagem - Materialização das Ideias',
          description: 'Crie protótipos rápidos das melhores ideias.',
          points: 70,
          challenge: 'Desenvolva 2-3 protótipos simples das melhores ideias.',
          instructions: 'Use materiais simples como papel, cartolina, ou ferramentas digitais como Figma. O objetivo é tornar as ideias tangíveis rapidamente.'
        },
        {
          id: 5,
          title: 'Teste - Validação com Usuários',
          description: 'Teste os protótipos com usuários reais.',
          points: 80,
          challenge: 'Teste os protótipos com 3-5 usuários e colete feedback.',
          instructions: 'Apresente os protótipos aos usuários. Observe como interagem, que dificuldades encontram e que sugestões fazem. Documente tudo para iterações futuras.'
        }
      ],
      'OKRs (Objectives and Key Results)': [
        {
          id: 1,
          title: 'Definição de Objetivos',
          description: 'Estabeleça objetivos ambiciosos e inspiradores.',
          points: 50,
          challenge: 'Defina 3-5 objetivos qualitativos para o próximo trimestre.',
          instructions: 'Escreva objetivos que sejam ambiciosos, inspiradores e alinhados com a visão da empresa. Cada objetivo deve ser qualitativo e motivador.'
        },
        {
          id: 2,
          title: 'Criação de Key Results',
          description: 'Estabeleça resultados-chave mensuráveis para cada objetivo.',
          points: 60,
          challenge: 'Crie 3-5 Key Results mensuráveis para cada objetivo.',
          instructions: 'Para cada objetivo, defina 3-5 resultados-chave que sejam específicos, mensuráveis, atingíveis, relevantes e temporais (SMART).'
        },
        {
          id: 3,
          title: 'Alinhamento de Times',
          description: 'Alinhe os OKRs com toda a equipe.',
          points: 40,
          challenge: 'Apresente e alinhe os OKRs com sua equipe.',
          instructions: 'Organize uma reunião para apresentar os OKRs. Explique como cada pessoa contribui para os objetivos e colete feedback da equipe.'
        },
        {
          id: 4,
          title: 'Sistema de Acompanhamento',
          description: 'Estabeleça um processo de monitoramento regular.',
          points: 50,
          challenge: 'Crie um sistema de acompanhamento semanal dos OKRs.',
          instructions: 'Defina como e quando você vai acompanhar o progresso. Crie um dashboard simples ou planilha para monitorar os Key Results semanalmente.'
        },
        {
          id: 5,
          title: 'Retrospectiva e Ajustes',
          description: 'Avalie os resultados e faça ajustes necessários.',
          points: 60,
          challenge: 'Conduza uma retrospectiva dos OKRs do período anterior.',
          instructions: 'Analise o que funcionou, o que não funcionou e por quê. Documente lições aprendidas e ajuste os próximos OKRs baseado nos insights obtidos.'
        }
      ],
      'Jobs to be Done': [
        {
          id: 1,
          title: 'Identificação do Job Statement',
          description: 'Defina claramente o "trabalho" que o cliente quer realizar.',
          points: 50,
          challenge: 'Escreva o Job Statement principal do seu cliente.',
          instructions: 'Use a fórmula: "Quando [situação], eu quero [motivação], para que eu possa [resultado esperado]". Seja específico sobre o contexto e resultado.'
        },
        {
          id: 2,
          title: 'Mapeamento das Dimensões',
          description: 'Explore as dimensões funcional, emocional e social do job.',
          points: 60,
          challenge: 'Mapeie as 3 dimensões do job do seu cliente.',
          instructions: 'Documente: 1) Funcional (o que precisa ser feito), 2) Emocional (como quer se sentir), 3) Social (como quer ser percebido). Entreviste clientes para validar.'
        },
        {
          id: 3,
          title: 'Análise das Forças do Progresso',
          description: 'Identifique as forças que motivam ou impedem a mudança.',
          points: 70,
          challenge: 'Mapeie as 4 forças: Push, Pull, Anxiety e Habit.',
          instructions: 'Identifique: Push (problemas atuais), Pull (atração da nova solução), Anxiety (medos sobre mudança), Habit (resistência ao status quo).'
        },
        {
          id: 4,
          title: 'Entrevistas Timeline',
          description: 'Conduza entrevistas para entender a jornada de decisão.',
          points: 80,
          challenge: 'Realize 3-5 entrevistas timeline com clientes.',
          instructions: 'Entreviste clientes sobre a primeira vez que pensaram em resolver o problema até a decisão final. Foque nos momentos de progresso e estagnação.'
        },
        {
          id: 5,
          title: 'Job Map Detalhado',
          description: 'Crie um mapa detalhado de todos os passos do job.',
          points: 60,
          challenge: 'Desenvolva um job map com todos os micro-jobs.',
          instructions: 'Quebre o job principal em etapas menores. Para cada etapa, identifique necessidades não atendidas e oportunidades de inovação.'
        }
      ],
      'SAFe / Scrum / Agile': [
        {
          id: 1,
          title: 'Definição de Papéis',
          description: 'Estabeleça claramente os papéis da equipe ágil.',
          points: 40,
          challenge: 'Defina Product Owner, Scrum Master e Development Team.',
          instructions: 'Identifique quem assumirá cada papel na sua equipe. Documente responsabilidades específicas e como cada papel contribui para o sucesso do projeto.'
        },
        {
          id: 2,
          title: 'Criação do Product Backlog',
          description: 'Desenvolva e priorize o backlog do produto.',
          points: 60,
          challenge: 'Crie um backlog com pelo menos 20 user stories priorizadas.',
          instructions: 'Escreva user stories no formato "Como [usuário], eu quero [funcionalidade] para [benefício]". Priorize usando técnicas como MoSCoW ou Value vs Effort.'
        },
        {
          id: 3,
          title: 'Planejamento da Sprint',
          description: 'Conduza uma sessão de planejamento de sprint.',
          points: 50,
          challenge: 'Planeje sua primeira sprint com objetivos claros.',
          instructions: 'Selecione user stories do backlog para a sprint. Defina o objetivo da sprint, estime esforços e crie tarefas específicas para cada story.'
        },
        {
          id: 4,
          title: 'Implementação de Cerimônias',
          description: 'Execute as cerimônias ágeis durante uma semana.',
          points: 70,
          challenge: 'Conduza Daily Scrum, Sprint Review e Retrospective.',
          instructions: 'Durante uma semana, faça dailies de 15min, uma review para demonstrar o trabalho feito e uma retrospectiva para melhorias contínuas.'
        },
        {
          id: 5,
          title: 'Métricas e Melhoria Contínua',
          description: 'Implemente métricas para acompanhar o progresso.',
          points: 60,
          challenge: 'Defina e acompanhe 3-5 métricas ágeis importantes.',
          instructions: 'Escolha métricas como velocity, burndown, lead time, cycle time. Crie um dashboard simples e use os dados para melhorar o processo.'
        }
      ],
      'Product-Market Fit': [
        {
          id: 1,
          title: 'Definição de Métricas PMF',
          description: 'Estabeleça métricas para medir o Product-Market Fit.',
          points: 50,
          challenge: 'Defina 5 métricas-chave para avaliar seu PMF.',
          instructions: 'Escolha métricas como NPS, retenção, crescimento orgânico, "very disappointed" score. Defina como e quando vai medir cada uma.'
        },
        {
          id: 2,
          title: 'Pesquisa de Satisfação',
          description: 'Conduza pesquisas para entender a satisfação dos clientes.',
          points: 60,
          challenge: 'Realize pesquisa com 20+ clientes sobre satisfação.',
          instructions: 'Crie um questionário focado na pergunta "O quão decepcionado você ficaria se não pudesse mais usar nosso produto?". Inclua perguntas sobre valor percebido.'
        },
        {
          id: 3,
          title: 'Análise de Retenção',
          description: 'Analise padrões de retenção e churn dos usuários.',
          points: 70,
          challenge: 'Analise a retenção por cohorts dos últimos 3 meses.',
          instructions: 'Crie uma análise de cohort para entender como diferentes grupos de usuários se comportam ao longo do tempo. Identifique padrões de retenção e churn.'
        },
        {
          id: 4,
          title: 'Identificação de Early Adopters',
          description: 'Identifique e analise seus early adopters mais engajados.',
          points: 60,
          challenge: 'Identifique e entreviste 5 early adopters.',
          instructions: 'Encontre usuários que mais usam e amam seu produto. Entreviste-os para entender por que são tão engajados e que valor específico encontram.'
        },
        {
          id: 5,
          title: 'Plano de Otimização PMF',
          description: 'Crie um plano para melhorar o Product-Market Fit.',
          points: 80,
          challenge: 'Desenvolva um plano de ação baseado nos dados coletados.',
          instructions: 'Analise todos os dados coletados. Identifique gaps no PMF e crie um plano específico com ações, responsáveis e prazos para melhorar o fit.'
        }
      ],
      'Jornada do Cliente': [
        {
          id: 1,
          title: 'Mapeamento de Touchpoints',
          description: 'Identifique todos os pontos de contato com o cliente.',
          points: 50,
          challenge: 'Liste todos os touchpoints da jornada do cliente.',
          instructions: 'Mapeie desde o primeiro contato até o pós-venda. Inclua canais digitais, físicos, atendimento, produto. Seja exaustivo na identificação.'
        },
        {
          id: 2,
          title: 'Definição de Personas',
          description: 'Crie personas detalhadas para mapear jornadas específicas.',
          points: 40,
          challenge: 'Desenvolva 2-3 personas principais com jornadas distintas.',
          instructions: 'Para cada persona, documente dados demográficos, comportamentos, motivações e como cada uma interage diferentemente com sua solução.'
        },
        {
          id: 3,
          title: 'Mapeamento de Emoções',
          description: 'Identifique as emoções do cliente em cada etapa.',
          points: 60,
          challenge: 'Mapeie emoções positivas e negativas em cada touchpoint.',
          instructions: 'Para cada ponto da jornada, identifique como o cliente se sente. Use entrevistas ou pesquisas para validar as emoções mapeadas.'
        },
        {
          id: 4,
          title: 'Identificação de Pain Points',
          description: 'Encontre os principais pontos de dor na jornada.',
          points: 70,
          challenge: 'Identifique e priorize os 5 maiores pain points.',
          instructions: 'Analise onde os clientes mais sofrem ou abandonam a jornada. Use dados quantitativos (analytics) e qualitativos (feedback) para identificar problemas.'
        },
        {
          id: 5,
          title: 'Plano de Otimização',
          description: 'Crie um plano para melhorar a experiência do cliente.',
          points: 80,
          challenge: 'Desenvolva soluções específicas para cada pain point.',
          instructions: 'Para cada problema identificado, proponha soluções concretas. Priorize por impacto e esforço. Crie um roadmap de melhorias da experiência.'
        }
      ],
      'Proposta de Valor': [
        {
          id: 1,
          title: 'Análise do Perfil do Cliente',
          description: 'Entenda profundamente as necessidades do cliente.',
          points: 50,
          challenge: 'Mapeie jobs, pains e gains do seu cliente.',
          instructions: 'Liste os trabalhos que seu cliente precisa fazer, as dores que enfrenta e os ganhos que deseja. Use entrevistas e observação para validar.'
        },
        {
          id: 2,
          title: 'Definição da Proposta de Valor',
          description: 'Articule claramente como você cria valor.',
          points: 60,
          challenge: 'Defina produtos/serviços, pain relievers e gain creators.',
          instructions: 'Liste seus produtos/serviços, como eles aliviam dores específicas e como criam ganhos para o cliente. Seja específico e mensurável.'
        },
        {
          id: 3,
          title: 'Teste de Fit',
          description: 'Valide se há encaixe entre proposta e necessidades.',
          points: 70,
          challenge: 'Teste o fit da proposta com 5-10 clientes potenciais.',
          instructions: 'Apresente sua proposta de valor para clientes potenciais. Observe reações, faça perguntas sobre relevância e colete feedback específico.'
        },
        {
          id: 4,
          title: 'Refinamento da Mensagem',
          description: 'Refine a comunicação da proposta de valor.',
          points: 50,
          challenge: 'Crie 3 versões diferentes da mensagem de valor.',
          instructions: 'Desenvolva diferentes formas de comunicar sua proposta. Teste com diferentes audiências e veja qual ressoa melhor com cada segmento.'
        },
        {
          id: 5,
          title: 'Validação Quantitativa',
          description: 'Valide a proposta com dados quantitativos.',
          points: 80,
          challenge: 'Conduza teste A/B ou pesquisa quantitativa.',
          instructions: 'Use landing pages, anúncios ou pesquisas para testar diferentes versões da proposta. Meça conversões, interesse e intenção de compra.'
        }
      ],
      'Lean Canvas': [
        {
          id: 1,
          title: 'Identificação do Problema',
          description: 'Defina claramente os problemas que você resolve.',
          points: 50,
          challenge: 'Liste os 3 principais problemas do seu cliente.',
          instructions: 'Identifique problemas reais e urgentes. Valide com entrevistas que esses problemas realmente existem e são importantes para seu público-alvo.'
        },
        {
          id: 2,
          title: 'Definição da Solução',
          description: 'Articule sua solução de forma simples e clara.',
          points: 40,
          challenge: 'Descreva sua solução em 3 funcionalidades principais.',
          instructions: 'Foque nas funcionalidades essenciais que resolvem os problemas identificados. Evite complexidade desnecessária neste momento inicial.'
        },
        {
          id: 3,
          title: 'Métricas-Chave',
          description: 'Defina como você vai medir o sucesso.',
          points: 60,
          challenge: 'Identifique 3-5 métricas que indicam sucesso.',
          instructions: 'Escolha métricas que realmente importam para seu negócio: aquisição, ativação, retenção, receita, referência. Defina como vai medir cada uma.'
        },
        {
          id: 4,
          title: 'Vantagem Competitiva',
          description: 'Identifique o que te diferencia da concorrência.',
          points: 70,
          challenge: 'Defina sua vantagem competitiva única.',
          instructions: 'Analise concorrentes diretos e indiretos. Identifique o que você faz diferente ou melhor. Foque em vantagens difíceis de copiar.'
        },
        {
          id: 5,
          title: 'Modelo de Receita',
          description: 'Defina como sua startup vai gerar receita.',
          points: 60,
          challenge: 'Estruture seu modelo de receita com preços.',
          instructions: 'Defina como vai cobrar (assinatura, venda única, freemium, etc.), quanto vai cobrar e justifique os preços baseado no valor entregue.'
        }
      ]
    };

    return baseSteps[frameworkName] || [
      {
        id: 1,
        title: 'Primeiro Passo',
        description: 'Complete o primeiro desafio do framework.',
        points: 50,
        challenge: 'Inicie sua jornada no framework selecionado.',
        instructions: 'Comece explorando os conceitos básicos do framework escolhido e aplique-os ao seu contexto de negócio.'
      }
    ];
  };

  const [gameSteps, setGameSteps] = useState<GameStep[]>([]);

  useEffect(() => {
    const currentFramework = sessionStorage.getItem('currentFramework');
    if (!currentFramework) {
      navigate('/dashboard/frameworks');
      return;
    }
    setFramework(currentFramework);
    setGameSteps(getGameSteps(currentFramework));
    
    // Initialize achievements
    setAchievements([
      {
        id: 'first_step',
        title: 'Primeiro Passo',
        description: 'Complete sua primeira etapa',
        unlocked: false,
        icon: '🎯'
      },
      {
        id: 'points_100',
        title: 'Centurião',
        description: 'Atinja 100 pontos',
        unlocked: false,
        icon: '💯'
      },
      {
        id: 'half_complete',
        title: 'Meio Caminho',
        description: 'Complete 50% do framework',
        unlocked: false,
        icon: '⚡'
      },
      {
        id: 'framework_master',
        title: 'Mestre do Framework',
        description: 'Complete todas as etapas',
        unlocked: false,
        icon: '🏆'
      }
    ]);
  }, [navigate]);

  const startChallenge = () => {
    setCurrentStepIndex(0);
    setStepCompleted(false);
    setUserNotes('');
    updateProgress(1, gameSteps.length);
  };

  const nextStep = () => {
    if (!stepCompleted) return;

    if (currentStepIndex < gameSteps.length - 1) {
      const currentStep = gameSteps[currentStepIndex];
      const newPoints = points + currentStep.points;
      const newCompletedSteps = [...completedSteps, currentStep.id];
      
      setPoints(newPoints);
      setCompletedSteps(newCompletedSteps);
      setCurrentStepIndex(currentStepIndex + 1);
      setStepCompleted(false);
      setUserNotes('');
      updateProgress(currentStepIndex + 2, gameSteps.length);
      
      // Check for level up
      const newLevel = Math.floor(newPoints / 200) + 1;
      if (newLevel > level) {
        setLevel(newLevel);
      }
      
      // Check achievements
      checkAchievements(newPoints, newCompletedSteps, gameSteps.length);
    } else {
      // Complete the last step
      const currentStep = gameSteps[currentStepIndex];
      const newPoints = points + currentStep.points;
      const newCompletedSteps = [...completedSteps, currentStep.id];
      
      setPoints(newPoints);
      setCompletedSteps(newCompletedSteps);
      setProgress(100);
      
      // Check final achievements
      checkAchievements(newPoints, newCompletedSteps, gameSteps.length);
    }
  };

  const updateProgress = (completed: number, total: number) => {
    const progressPercentage = Math.round((completed / total) * 100);
    setProgress(progressPercentage);
  };

  const checkAchievements = (currentPoints: number, completed: number[], totalSteps: number) => {
    setAchievements(prev => prev.map(achievement => {
      if (achievement.id === 'first_step' && completed.length >= 1) {
        return { ...achievement, unlocked: true };
      }
      if (achievement.id === 'points_100' && currentPoints >= 100) {
        return { ...achievement, unlocked: true };
      }
      if (achievement.id === 'half_complete' && completed.length >= Math.ceil(totalSteps / 2)) {
        return { ...achievement, unlocked: true };
      }
      if (achievement.id === 'framework_master' && completed.length === totalSteps) {
        return { ...achievement, unlocked: true };
      }
      return achievement;
    }));
  };

  const getCurrentStep = () => {
    if (currentStepIndex >= 0 && currentStepIndex < gameSteps.length) {
      return gameSteps[currentStepIndex];
    }
    return null;
  };

  const isGameComplete = () => {
    return completedSteps.length === gameSteps.length;
  };

  const handleStepCompletion = () => {
    setStepCompleted(!stepCompleted);
  };

  if (!framework) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{framework} - Modo Gamificado | Orientohub</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard/frameworks')}
              className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold">{framework} - Modo Gamificado</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-200 px-3 py-1 rounded-full">
              <Trophy size={16} />
              <span className="font-medium">{points} pontos</span>
            </div>
            <div className="flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-200 px-3 py-1 rounded-full">
              <Star size={16} />
              <span className="font-medium">Nível {level}</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Seu Progresso</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">{progress}% completo</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-primary-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {completedSteps.length} de {gameSteps.length} etapas concluídas
          </div>
        </div>

        {/* Game Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Challenge */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Target className="h-6 w-6 text-primary-500" />
              <h2 className="text-lg font-semibold">
                {currentStepIndex === -1 ? 'Desafio Atual' : 'Etapa Atual'}
              </h2>
            </div>
            
            {currentStepIndex === -1 ? (
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Como funciona o modo gamificado?</h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Cada etapa apresenta um desafio prático para ser executado fora da plataforma. 
                        Você realizará atividades reais do seu negócio e voltará para marcar como concluído e ganhar pontos.
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Complete as etapas do framework de forma interativa e ganhe pontos por cada realização.
                </p>
                <button onClick={startChallenge} className="btn-primary w-full">
                  <Play size={20} className="mr-2" />
                  Começar Desafio
                </button>
              </div>
            ) : isGameComplete() ? (
              <div className="space-y-4 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-primary-500">Parabéns!</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Você completou todo o framework {framework}!
                </p>
                <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
                  <p className="font-medium">Total de pontos ganhos: {points}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Nível alcançado: {level}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {(() => {
                  const currentStep = getCurrentStep();
                  return currentStep ? (
                    <>
                      <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
                        <h3 className="font-bold text-primary-800 dark:text-primary-200 mb-2">
                          {currentStep.title}
                        </h3>
                        <p className="text-sm text-primary-700 dark:text-primary-300 mb-3">
                          {currentStep.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium bg-primary-200 dark:bg-primary-800 text-primary-800 dark:text-primary-200 px-2 py-1 rounded">
                            +{currentStep.points} pontos
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">🎯 Desafio:</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          {currentStep.challenge}
                        </p>
                      </div>

                      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                        <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">📋 Como executar:</h4>
                        <p className="text-sm text-orange-700 dark:text-orange-300">
                          {currentStep.instructions}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-medium">
                          Resumo do que você fez (opcional):
                        </label>
                        <textarea
                          value={userNotes}
                          onChange={(e) => setUserNotes(e.target.value)}
                          placeholder="Descreva brevemente o que você realizou nesta etapa..."
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                          rows={3}
                        />
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <input
                          type="checkbox"
                          id="step-completed"
                          checked={stepCompleted}
                          onChange={handleStepCompletion}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                        />
                        <label htmlFor="step-completed" className="text-sm font-medium">
                          Marquei como concluído - realizei a atividade fora da plataforma
                        </label>
                      </div>

                      <button 
                        onClick={nextStep} 
                        disabled={!stepCompleted}
                        className={`w-full ${stepCompleted ? 'btn-primary' : 'btn-outline opacity-50 cursor-not-allowed'}`}
                      >
                        {currentStepIndex === gameSteps.length - 1 ? (
                          <>
                            <CheckCircle size={20} className="mr-2" />
                            Finalizar Framework
                          </>
                        ) : (
                          <>
                            <ArrowRight size={20} className="mr-2" />
                            Próximo Passo
                          </>
                        )}
                      </button>
                    </>
                  ) : null;
                })()}
              </div>
            )}
          </motion.div>

          {/* Achievements */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Trophy className="h-6 w-6 text-primary-500" />
              <h2 className="text-lg font-semibold">Conquistas</h2>
            </div>
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                    achievement.unlocked
                      ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
                      : 'bg-gray-50 dark:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                      {achievement.icon}
                    </div>
                    <div>
                      <h3 className={`font-medium ${achievement.unlocked ? 'text-primary-800 dark:text-primary-200' : ''}`}>
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    achievement.unlocked
                      ? 'bg-primary-200 dark:bg-primary-800 text-primary-800 dark:text-primary-200'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {achievement.unlocked ? 'Desbloqueada' : 'Bloqueada'}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Steps Overview */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold mb-4">Etapas do Framework</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gameSteps.map((step, index) => (
              <div
                key={step.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  completedSteps.includes(step.id)
                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                    : currentStepIndex === index
                    ? 'border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-900/20'
                    : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Etapa {index + 1}</span>
                  {completedSteps.includes(step.id) && (
                    <CheckCircle size={16} className="text-green-500" />
                  )}
                </div>
                <h3 className="font-medium text-sm mb-1">{step.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {step.description}
                </p>
                <span className="text-xs font-medium bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-200 px-2 py-1 rounded">
                  +{step.points} pts
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default FrameworkGamePage;