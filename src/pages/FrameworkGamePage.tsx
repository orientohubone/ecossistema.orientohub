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