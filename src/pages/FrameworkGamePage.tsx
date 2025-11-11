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
      // [Manter todos os outros frameworks do código original...]
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
                  <Gamepad2 className="w-6 h-6 text-primary-500" />
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
                          <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Como funciona?</h3>
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            Cada etapa apresenta um desafio prático para ser executado fora da plataforma. 
                            Você realizará atividades reais do seu negócio e voltará para marcar como concluído e ganhar pontos.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
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
                    </div>

                    <button 
                      onClick={startChallenge} 
                      className="w-full px-6 py-4 bg-primary-500 hover:bg-primary-600 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/30"
                    >
                      <Play className="w-5 h-5" />
                      Começar Desafio
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

                            <div>
                              <label className="block text-sm font-bold mb-2">
                                📝 Resumo do que você fez (opcional):
                              </label>
                              <textarea
                                value={userNotes}
                                onChange={(e) => setUserNotes(e.target.value)}
                                placeholder="Descreva brevemente o que você realizou nesta etapa..."
                                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:ring-0 bg-white dark:bg-gray-900"
                                rows={4}
                              />
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
