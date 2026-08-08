import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Trophy, 
  Star, 
  Target, 
  CheckCircle, 
  Play, 
  ArrowRight, 
  Info,
  Sparkles,
  Zap,
  Award,
  TrendingUp,
  Circle,
  CheckCircle2,
  Gamepad
} from 'lucide-react';
import DashboardPageSkeleton from '../components/ui/DashboardPageSkeleton';

interface GameStep {
  id: number;
  title: string;
  description: string;
  points: number;
  challenge: string;
  instructions: string;
  example?: string;
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
  const [notesByStep, setNotesByStep] = useState<Record<number, string>>({});
  const [noteSaved, setNoteSaved] = useState(false);
  const [stepCompleted, setStepCompleted] = useState(false);

  const frameworkNamesById: Record<string, string> = {
    'customer-development': 'Customer Development', 'design-thinking': 'Design Thinking', okrs: 'OKRs (Objectives and Key Results)', jtbd: 'Jobs to be Done',
    'safe-scrum': 'SAFe / Scrum / Agile', pmf: 'Product-Market Fit', bmc: 'Business Model Canvas', 'empathy-map': 'Mapa de Empatia',
    'customer-journey': 'Jornada do Cliente', 'value-proposition': 'Proposta de Valor', 'lean-canvas': 'Lean Canvas',
  };

  // [Todo o código de getGameSteps permanece igual - mantendo a lógica de dados intacta]
  const getGameSteps = (frameworkName: string): GameStep[] => {
    const baseSteps: Record<string, GameStep[]> = {
      'Business Model Canvas': [
        {
          id: 1,
          title: 'Defina sua Proposta de Valor',
          description: 'Identifique o valor único que sua solução oferece aos clientes.',
          points: 50,
          challenge: 'Escreva em uma frase clara qual problema você resolve e como.',
          instructions: 'Saia da plataforma e dedique 15-30 minutos para refletir sobre seu negócio. Escreva em um papel ou documento a proposta de valor da sua startup. Quando terminar, volte aqui e marque como concluído.',
          example: 'Exemplo: “Ajudamos gestores de RH de empresas em crescimento a reduzir o tempo de contratação com uma triagem inteligente de candidatos.”'
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
        { id: 1, title: 'Customer Discovery', description: 'Valide se o problema é real para um segmento específico.', points: 40, challenge: 'Defina uma hipótese de problema e um perfil de cliente.', instructions: 'Escreva o segmento, a situação em que o problema acontece e por que ele é relevante.', example: 'Exemplo: “Gestores de clínicas perdem tempo confirmando consultas por WhatsApp.”' },
        { id: 2, title: 'Entrevistas de descoberta', description: 'Confronte sua hipótese com conversas reais.', points: 50, challenge: 'Planeje cinco entrevistas sem apresentar sua solução.', instructions: 'Crie perguntas sobre comportamentos atuais, frequência do problema e alternativas já usadas.' },
        { id: 3, title: 'Customer Validation', description: 'Transforme os achados em uma proposta testável.', points: 60, challenge: 'Defina a oferta, o canal e o sinal de validação.', instructions: 'Descreva uma proposta de valor e a ação concreta que provará interesse real, como uma pré-venda ou agendamento.' },
      ],
      'Design Thinking': [
        { id: 1, title: 'Empatia', description: 'Entenda o contexto e as necessidades das pessoas envolvidas.', points: 40, challenge: 'Escolha um público e registre três observações ou falas reais.', instructions: 'Observe ou entreviste usuários. Foque no que fazem, sentem e tentam resolver.' },
        { id: 2, title: 'Definição do desafio', description: 'Sintetize aprendizados em um problema claro.', points: 50, challenge: 'Escreva uma pergunta “Como poderíamos...?”.', instructions: 'Conecte pessoa, necessidade e insight em uma pergunta ampla o suficiente para gerar alternativas.' },
        { id: 3, title: 'Ideação e protótipo', description: 'Gere alternativas e escolha o menor teste possível.', points: 60, challenge: 'Liste cinco ideias e escolha uma para prototipar.', instructions: 'Selecione a ideia pelo impacto e esforço. Descreva um protótipo simples e quem dará feedback.' },
      ],
      'OKRs (Objectives and Key Results)': [
        { id: 1, title: 'Defina o objetivo', description: 'Crie uma direção qualitativa, clara e inspiradora.', points: 40, challenge: 'Escreva um objetivo para o próximo ciclo.', instructions: 'Evite números no objetivo. Explique a mudança desejada e para quem ela importa.' },
        { id: 2, title: 'Crie resultados-chave', description: 'Converta o objetivo em medidas verificáveis.', points: 50, challenge: 'Defina de três a cinco resultados-chave.', instructions: 'Cada KR deve ter ponto de partida, meta e prazo. Prefira métricas de resultado a listas de tarefas.' },
        { id: 3, title: 'Cadência de acompanhamento', description: 'Transforme OKRs em execução semanal.', points: 60, challenge: 'Defina check-in, responsável e iniciativas.', instructions: 'Escolha uma frequência de revisão e registre as iniciativas que podem mover cada resultado-chave.' },
      ],
      'Jobs to be Done': [
        { id: 1, title: 'Encontre o job', description: 'Identifique o progresso que o cliente busca fazer.', points: 40, challenge: 'Escreva um job statement com contexto e resultado.', instructions: 'Use a estrutura: quando [situação], quero [motivação], para que [progresso esperado].' },
        { id: 2, title: 'Mapeie as forças', description: 'Entenda o que impulsiona e o que trava a mudança.', points: 50, challenge: 'Liste push, pull, ansiedade e hábito.', instructions: 'Registre evidências para cada força com base em uma situação real de compra ou abandono.' },
        { id: 3, title: 'Desenhe a oportunidade', description: 'Conecte o job a uma melhoria mensurável.', points: 60, challenge: 'Defina uma oportunidade de produto e um teste.', instructions: 'Escolha a etapa do job mais mal atendida e descreva como validar se sua proposta melhora o progresso.' },
      ],
      'SAFe / Scrum / Agile': [
        { id: 1, title: 'Organize o backlog', description: 'Transforme prioridades em itens claros de trabalho.', points: 40, challenge: 'Escreva cinco itens priorizados com critério de valor.', instructions: 'Cada item deve explicar o resultado para usuário ou negócio, não apenas uma tarefa técnica.' },
        { id: 2, title: 'Planeje a sprint', description: 'Escolha um recorte entregável para o ciclo atual.', points: 50, challenge: 'Defina uma meta de sprint e o escopo mínimo.', instructions: 'Considere capacidade real do time e deixe explícito o que ficará fora deste ciclo.' },
        { id: 3, title: 'Revise e melhore', description: 'Crie uma cadência de feedback e retrospectiva.', points: 60, challenge: 'Registre uma métrica e uma melhoria de processo.', instructions: 'Defina como demonstrará o incremento, de quem virá o feedback e qual ajuste fará no próximo ciclo.' },
      ],
      'Product-Market Fit': [
        { id: 1, title: 'Escolha o segmento inicial', description: 'Delimite o público em que o fit será testado.', points: 40, challenge: 'Defina um segmento, problema e comportamento observável.', instructions: 'Evite “todos”. Escolha um nicho com dor frequente e acesso viável para pesquisa.' },
        { id: 2, title: 'Defina sinais de fit', description: 'Escolha métricas qualitativas e quantitativas.', points: 50, challenge: 'Defina uma métrica de retenção e uma pergunta de satisfação.', instructions: 'Registre o ponto de partida, a meta e como coletará feedback de usuários ativos.' },
        { id: 3, title: 'Rode o experimento', description: 'Planeje uma iteração orientada por evidência.', points: 60, challenge: 'Escreva hipótese, mudança e critério de decisão.', instructions: 'Determine o período do teste e qual resultado fará você continuar, ajustar ou pivotar.' },
      ],
      'Mapa de Empatia': [
        { id: 1, title: 'Defina a persona', description: 'Escolha uma pessoa ou segmento concreto para analisar.', points: 40, challenge: 'Registre contexto, objetivo e situação da persona.', instructions: 'Use dados de uma entrevista ou cliente real sempre que possível.' },
        { id: 2, title: 'Preencha percepções', description: 'Mapeie o que vê, ouve, pensa, sente, fala e faz.', points: 50, challenge: 'Adicione pelo menos duas evidências em cada quadrante.', instructions: 'Diferencie frases observadas de interpretações. Marque o que ainda é hipótese.' },
        { id: 3, title: 'Sintetize dores e ganhos', description: 'Transforme o mapa em decisões acionáveis.', points: 60, challenge: 'Priorize três dores e três ganhos.', instructions: 'Defina qual dor sua solução deve atacar primeiro e como saberá se gerou ganho.' },
      ],
      'Jornada do Cliente': [
        { id: 1, title: 'Defina as etapas da jornada', description: 'Descreva o caminho do cliente do primeiro contato ao uso.', points: 40, challenge: 'Liste de cinco a sete etapas principais.', instructions: 'Comece antes da compra e termine no sucesso, retenção ou indicação.' },
        { id: 2, title: 'Mapeie pontos de contato', description: 'Identifique ações, canais, emoções e fricções.', points: 50, challenge: 'Registre um ponto de atrito em cada etapa crítica.', instructions: 'Use dados de suporte, vendas e entrevistas para evitar suposições.' },
        { id: 3, title: 'Priorize melhorias', description: 'Escolha a oportunidade de maior impacto.', points: 60, challenge: 'Defina uma melhoria, métrica e responsável.', instructions: 'Dê preferência a fricções que afetam conversão, ativação ou retenção.' },
      ],
      'Proposta de Valor': [
        { id: 1, title: 'Entenda o perfil do cliente', description: 'Mapeie o que ele tenta realizar, suas dores e os ganhos esperados.', points: 35, challenge: 'Liste pelo menos três jobs, dores e ganhos de um segmento específico.', instructions: 'Reserve 15 minutos. Escolha apenas um público e escreva na linguagem dele, usando frases que apareceram em conversas reais sempre que possível.' },
        { id: 2, title: 'Desenhe sua oferta de valor', description: 'Conecte produtos e serviços aos aliviadores de dor e criadores de ganho.', points: 45, challenge: 'Relacione cada elemento da sua oferta a uma dor ou ganho do cliente.', instructions: 'Evite listar funcionalidades soltas. Para cada item da oferta, responda claramente: qual dor ele reduz ou qual ganho ele torna possível?' },
        { id: 3, title: 'Escreva a proposta central', description: 'Transforme o encaixe encontrado em uma mensagem simples e memorável.', points: 55, challenge: 'Escreva uma frase que una público, resultado e diferencial.', instructions: 'Use a estrutura: “Ajudamos [público] a [resultado] sem [principal obstáculo], por meio de [diferencial]”. Corte termos internos e deixe a frase fácil de repetir.' },
        { id: 4, title: 'Valide com o mercado', description: 'Teste a mensagem e aprenda com a reação de clientes reais.', points: 65, challenge: 'Defina um teste e o sinal que mostrará se a mensagem funcionou.', instructions: 'Apresente a mensagem em uma conversa, página ou anúncio para pelo menos cinco pessoas do público. Registre as palavras que despertam perguntas, interesse ou objeções.' },
      ],
      'Lean Canvas': [
        { id: 1, title: 'Problema e cliente', description: 'Defina o problema prioritário e os early adopters.', points: 40, challenge: 'Liste três problemas e um segmento inicial.', instructions: 'Use linguagem de cliente e inclua alternativas já usadas hoje.' },
        { id: 2, title: 'Solução e proposta única', description: 'Conecte solução mínima a um diferencial claro.', points: 50, challenge: 'Preencha solução, UVP e vantagem injusta.', instructions: 'Mantenha a solução pequena e verificável; não descreva um produto completo.' },
        { id: 3, title: 'Modelo e métricas', description: 'Estruture canais, custos, receita e indicadores.', points: 60, challenge: 'Defina um canal inicial, fonte de receita e métrica-chave.', instructions: 'Escolha o menor modelo viável para testar demanda antes de escalar investimento.' },
      ],
    };

    return baseSteps[frameworkName] || [];
  };

  const [gameSteps, setGameSteps] = useState<GameStep[]>([]);

  const getStepExample = (frameworkName: string, stepIndex: number) => {
    const examples: Record<string, string[]> = {
      'Business Model Canvas': ['Exemplo: “Ajudamos gestores de RH de empresas em crescimento a reduzir o tempo de contratação com triagem inteligente.”', 'Exemplo: “Persona 1: líder de RH de SaaS com 50–200 pessoas e alto volume de vagas.”', 'Exemplo: “LinkedIn, parceiros de recrutamento, conteúdo para RH, eventos e indicação.”', 'Exemplo: “Assinatura mensal por recrutador + plano corporativo anual.”', 'Exemplo: “Tecnologia: R$ 2 mil/mês; marketing: R$ 5 mil/mês; time: R$ 30 mil/mês.”'],
      'Customer Development': ['Exemplo: “Donos de clínicas gastam horas por semana confirmando consultas manualmente.”', 'Exemplo: “Pergunta: conte a última vez que uma ausência de paciente prejudicou sua agenda.”', 'Exemplo: “Landing page oferecendo piloto para cinco clínicas com agendamento de demonstração.”'],
      'Design Thinking': ['Exemplo: “Usuário relatou que perde tempo alternando entre planilhas e WhatsApp para acompanhar pedidos.”', 'Exemplo: “Como poderíamos reduzir a incerteza do cliente durante a entrega?”', 'Exemplo: “Protótipo de tela com status do pedido e teste com três clientes.”'],
      'OKRs (Objectives and Key Results)': ['Exemplo: “Tornar a ativação de novos clientes uma experiência previsível e valiosa.”', 'Exemplo: “Elevar ativação em 7 dias de 35% para 55% até o fim do trimestre.”', 'Exemplo: “Check-in semanal toda segunda; responsável: CS; iniciativa: checklist de onboarding.”'],
      'Jobs to be Done': ['Exemplo: “Quando preciso fechar o caixa, quero conciliar vendas rapidamente para saber se posso repor estoque.”', 'Exemplo: “Push: planilhas demoradas; pull: visão consolidada; ansiedade: errar números; hábito: planilha atual.”', 'Exemplo: “Teste: protótipo de conciliação em um clique para cinco lojistas.”'],
      'SAFe / Scrum / Agile': ['Exemplo: “Como gestor, quero exportar o relatório mensal para compartilhar resultados com o time.”', 'Exemplo: “Meta da sprint: permitir exportação de um relatório com dados confiáveis.”', 'Exemplo: “Na review, cinco usuários testam; na retrospectiva, reduzir bloqueios de revisão de PR.”'],
      'Product-Market Fit': ['Exemplo: “Agências B2B com 5–30 pessoas que precisam organizar a operação comercial.”', 'Exemplo: “Retenção de 60% após 90 dias e pesquisa: pelo menos 40% ‘muito desapontados’ sem o produto.”', 'Exemplo: “Hipótese: um onboarding guiado aumenta ativação de 35% para 50% em 30 dias.”'],
      'Mapa de Empatia': ['Exemplo: “Persona: Marina, gerente de marketing em uma SaaS de 80 pessoas, pressionada por pipeline.”', 'Exemplo: “Ouve da diretoria que o CAC está alto; vê relatórios fragmentados; sente insegurança nas decisões.”', 'Exemplo: “Dor prioritária: falta de visão de canal; ganho: decidir investimento em minutos, não dias.”'],
      'Jornada do Cliente': ['Exemplo: “Descoberta → avaliação → demonstração → compra → onboarding → uso recorrente → indicação.”', 'Exemplo: “Na demonstração, o cliente espera dois dias por resposta e abandona o processo.”', 'Exemplo: “Melhoria: resposta em até 15 minutos; métrica: taxa de agendamento de demo.”'],
      'Proposta de Valor': ['Exemplo: “Job: acompanhar entregas sem ligar para o fornecedor; dor: falta de visibilidade; ganho: sentir segurança sobre o prazo.”', 'Exemplo: “Aliviador: timeline com previsão de entrega; criador de ganho: alertas proativos antes de qualquer atraso.”', 'Exemplo: “Ajudamos gestores de compras a acompanhar entregas sem cobrar fornecedores, com alertas proativos e previsão confiável.”', 'Exemplo: “Teste: enviar a mensagem para 5 gestores de compras e considerar válido se 3 pedirem uma demonstração ou quiserem saber como funciona.”'],
      'Lean Canvas': ['Exemplo: “Problema: clínicas têm faltas altas; early adopter: clínicas particulares com agenda cheia.”', 'Exemplo: “Solução: confirmação automática; UVP: reduza faltas sem aumentar a equipe.”', 'Exemplo: “Canal inicial: parceria com software de gestão; métrica: taxa de consultas confirmadas.”'],
    };
    return examples[frameworkName]?.[stepIndex];
  };

  useEffect(() => {
    const currentFramework = sessionStorage.getItem('currentFramework') || (id ? frameworkNamesById[id] : null);
    if (!currentFramework) {
      navigate('/dashboard/frameworks');
      return;
    }
    setFramework(currentFramework);
    setGameSteps(getGameSteps(currentFramework));
    
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
    updateProgress(0, gameSteps.length);
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
      updateProgress(newCompletedSteps.length, gameSteps.length);
      
      const newLevel = Math.floor(newPoints / 200) + 1;
      if (newLevel > level) {
        setLevel(newLevel);
      }
      
      checkAchievements(newPoints, newCompletedSteps, gameSteps.length);
    } else {
      const currentStep = gameSteps[currentStepIndex];
      const newPoints = points + currentStep.points;
      const newCompletedSteps = [...completedSteps, currentStep.id];
      
      setPoints(newPoints);
      setCompletedSteps(newCompletedSteps);
      setProgress(100);
      
      checkAchievements(newPoints, newCompletedSteps, gameSteps.length);
    }
  };

  const updateProgress = (completed: number, total: number) => {
    const progressPercentage = Math.round((completed / total) * 100);
    setProgress(progressPercentage);
    if (id) {
      localStorage.setItem(`orientohub:framework-progress:${id}`, String(progressPercentage));
      window.dispatchEvent(new CustomEvent('orientohub:framework-progress-updated', { detail: { id, progress: progressPercentage } }));
    }
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

  useEffect(() => {
    if (!id) return;
    try {
      const savedNotes = JSON.parse(localStorage.getItem(`orientohub:framework-notes:${id}`) || '{}');
      setNotesByStep(savedNotes);
    } catch {
      setNotesByStep({});
    }
  }, [id]);

  useEffect(() => {
    const step = getCurrentStep();
    setUserNotes(step ? notesByStep[step.id] || '' : '');
    setNoteSaved(false);
  }, [currentStepIndex, notesByStep, gameSteps.length]);

  const saveNotes = () => {
    const step = getCurrentStep();
    if (!step || !id) return;
    const updatedNotes = { ...notesByStep, [step.id]: userNotes.trim() };
    setNotesByStep(updatedNotes);
    localStorage.setItem(`orientohub:framework-notes:${id}`, JSON.stringify(updatedNotes));
    setNoteSaved(true);
  };

  const isGameComplete = () => {
    return completedSteps.length === gameSteps.length;
  };

  const handleStepCompletion = () => {
    setStepCompleted(!stepCompleted);
  };

  if (!framework) {
    return <DashboardPageSkeleton cards={3} columns={2} />;
  }

  return (
    <>
      <Helmet>
        <title>{framework} - Modo Gamificado | Orientohub</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container-custom py-8 space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard/frameworks')}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Gamepad className="w-6 h-6 text-primary-500" />
                  <h1 className="text-3xl font-bold">Modo Gamificado</h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{framework}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gradient-to-r from-primary-50 to-white dark:from-primary-900/20 dark:to-gray-800 border-2 border-primary-200 dark:border-primary-800 px-4 py-2 rounded-xl">
                <Trophy className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <span className="font-bold text-primary-800 dark:text-primary-200">{points} pts</span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-white dark:from-yellow-900/20 dark:to-gray-800 border-2 border-yellow-200 dark:border-yellow-800 px-4 py-2 rounded-xl">
                <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400 fill-current" />
                <span className="font-bold text-yellow-800 dark:text-yellow-200">Nível {level}</span>
              </div>
            </div>
          </motion.div>

          {/* Progress Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Seu Progresso</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{completedSteps.length} de {gameSteps.length} etapas concluídas</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{progress}%</p>
              </div>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Challenge - 2 columns */}
            <motion.div
              className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-gradient-to-r from-gray-100 to-white dark:from-gray-700 dark:to-gray-800 p-6 border-b-2 border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center shadow">
                    <Target className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">
                      {currentStepIndex === -1 ? 'Pronto para Começar?' : isGameComplete() ? 'Parabéns!' : 'Desafio Atual'}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {currentStepIndex === -1 ? 'Inicie sua jornada gamificada' : isGameComplete() ? 'Você concluiu o framework!' : `Etapa ${currentStepIndex + 1} de ${gameSteps.length}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {currentStepIndex === -1 ? (
                    <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-3">
                        <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">{gameSteps.length ? 'Como funciona?' : 'Roteiro em preparação'}</h3>
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            {gameSteps.length
                              ? 'Cada etapa apresenta um desafio prático para ser executado fora da plataforma. Você realizará atividades reais do seu negócio e voltará para marcar como concluído e ganhar pontos.'
                              : 'Este framework ainda não possui um roteiro gamificado próprio. Não vamos reutilizar etapas genéricas: cada jornada será criada com desafios e exemplos específicos para a metodologia.'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {gameSteps.length > 0 && <div className="space-y-3">
                      <h3 className="font-bold">O que você vai ganhar:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          { icon: '🎯', text: 'Experiência prática aplicada' },
                          { icon: '🏆', text: 'Pontos e conquistas' },
                          { icon: '📈', text: 'Progresso mensurável' },
                          { icon: '💡', text: 'Aprendizado estruturado' }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <span className="text-2xl">{item.icon}</span>
                            <span className="text-sm font-medium">{item.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>}

                    <button 
                      onClick={startChallenge} 
                      disabled={!gameSteps.length}
                      className={`w-full px-6 py-4 font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${gameSteps.length ? 'bg-primary-500 hover:bg-primary-600 text-black shadow-lg shadow-primary-500/30' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                    >
                      <Play className="w-5 h-5" />
                      {gameSteps.length ? 'Começar Desafio' : 'Roteiro em breve'}
                    </button>
                  </div>
                ) : isGameComplete() ? (
                  <div className="space-y-6 text-center py-8">
                    <div className="text-8xl mb-4">🎉</div>
                    <h3 className="text-3xl font-bold text-primary-600 dark:text-primary-400">Framework Concluído!</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto">
                      Você completou todas as etapas do framework {framework} com sucesso!
                    </p>
                    <div className="bg-gradient-to-br from-primary-50 to-white dark:from-primary-900/20 dark:to-gray-800 p-6 rounded-xl border-2 border-primary-200 dark:border-primary-800 max-w-sm mx-auto">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total de Pontos</p>
                          <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{points}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Nível Alcançado</p>
                          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{level}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/dashboard/frameworks')}
                      className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"
                    >
                      Voltar aos Frameworks
                    </button>
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStepIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {(() => {
                        const currentStep = getCurrentStep();
                        return currentStep ? (
                          <>
                            <div className="bg-gradient-to-br from-primary-50 to-white dark:from-primary-900/20 dark:to-gray-800 p-6 rounded-xl border-2 border-primary-200 dark:border-primary-800">
                              <div className="flex items-start justify-between mb-3">
                                <h3 className="font-bold text-xl text-primary-900 dark:text-primary-100">
                                  {currentStep.title}
                                </h3>
                                <span className="px-3 py-1 bg-primary-200 dark:bg-primary-800 text-primary-900 dark:text-primary-100 text-sm font-bold rounded-full">
                                  +{currentStep.points} pts
                                </span>
                              </div>
                              <p className="text-primary-800 dark:text-primary-200">
                                {currentStep.description}
                              </p>
                            </div>
                            
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl border border-gray-200 dark:border-gray-600">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Target className="w-4 h-4 text-white dark:text-black" />
                                </div>
                                <div>
                                  <h4 className="font-bold mb-2">Desafio:</h4>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {currentStep.challenge}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-800 p-5 rounded-xl border-2 border-orange-200 dark:border-orange-800">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-orange-900 dark:text-orange-100 mb-2">Como executar:</h4>
                                  <p className="text-sm text-orange-800 dark:text-orange-200">
                                    {currentStep.instructions}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {(currentStep.example || getStepExample(framework, currentStepIndex)) && (
                              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-900/50">
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Exemplo</p>
                                <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">{currentStep.example || getStepExample(framework, currentStepIndex)}</p>
                              </div>
                            )}

                            <div>
                              <label className="block text-sm font-bold mb-2">
                                📝 Resumo do que você fez (opcional):
                              </label>
                              <textarea
                                value={userNotes}
                                onChange={(e) => { setUserNotes(e.target.value); setNoteSaved(false); }}
                                placeholder="Descreva brevemente o que você realizou nesta etapa..."
                                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:ring-0 bg-white dark:bg-gray-900"
                                rows={4}
                              />
                              <div className="mt-3 flex items-center justify-between gap-3">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Salve seu rascunho sem concluir a etapa.</p>
                                <button onClick={saveNotes} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800">
                                  <CheckCircle2 className="w-4 h-4 text-primary-500" />{noteSaved ? 'Rascunho salvo' : 'Salvar rascunho'}
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                              <input
                                type="checkbox"
                                id="step-completed"
                                checked={stepCompleted}
                                onChange={handleStepCompletion}
                                className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                              />
                              <label htmlFor="step-completed" className="text-sm font-medium cursor-pointer flex-1">
                                ✅ Concluí esta etapa - realizei a atividade fora da plataforma
                              </label>
                            </div>

                            <button 
                              onClick={nextStep} 
                              disabled={!stepCompleted}
                              className={`w-full px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                                stepCompleted 
                                  ? 'bg-primary-500 hover:bg-primary-600 text-black shadow-lg shadow-primary-500/30' 
                                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              {currentStepIndex === gameSteps.length - 1 ? (
                                <>
                                  <CheckCircle className="w-5 h-5" />
                                  Finalizar Framework
                                </>
                              ) : (
                                <>
                                  Próximo Passo
                                  <ArrowRight className="w-5 h-5" />
                                </>
                              )}
                            </button>
                          </>
                        ) : null;
                      })()}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </motion.div>

            {/* Achievements Sidebar - 1 column */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-gradient-to-r from-yellow-100 to-white dark:from-yellow-900/20 dark:to-gray-800 p-6 border-b-2 border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center shadow">
                    <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Conquistas</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {achievements.filter(a => a.unlocked).length} de {achievements.length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-3">
                {achievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ scale: achievement.unlocked ? 1 : 0.95 }}
                    animate={{ scale: 1 }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-primary-50 to-white dark:from-primary-900/20 dark:to-gray-800 border-primary-200 dark:border-primary-800'
                        : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`text-3xl ${!achievement.unlocked && 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold mb-1 ${achievement.unlocked ? 'text-primary-900 dark:text-primary-100' : ''}`}>
                          {achievement.title}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.unlocked && (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Steps Overview */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-bold mb-6">Todas as Etapas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gameSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    completedSteps.includes(step.id)
                      ? 'bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-800 border-green-200 dark:border-green-800'
                      : currentStepIndex === index
                      ? 'bg-gradient-to-br from-primary-50 to-white dark:from-primary-900/20 dark:to-gray-800 border-primary-200 dark:border-primary-800'
                      : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                        completedSteps.includes(step.id)
                          ? 'bg-green-500 text-white'
                          : currentStepIndex === index
                          ? 'bg-primary-500 text-black'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        {completedSteps.includes(step.id) ? '✓' : index + 1}
                      </div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        Etapa {index + 1}
                      </span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      completedSteps.includes(step.id)
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    }`}>
                      {step.points} pts
                    </span>
                  </div>
                  <h3 className="font-bold text-sm mb-2">{step.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default FrameworkGamePage;
