import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dashboardService, type JourneyPhase } from '../services/dashboardService';
import DashboardPageSkeleton from '../components/ui/DashboardPageSkeleton';
import { 
  Rocket,
  Target,
  Users,
  TrendingUp,
  Award,
  CheckCircle2,
  Circle,
  Lock,
  Star,
  Zap,
  Trophy,
  Flag,
  Lightbulb,
  BarChart,
  DollarSign,
  Sparkles,
  ChevronRight,
  Clock
} from 'lucide-react';

const iconMap: { [key: string]: any } = {
  'Lightbulb': Lightbulb,
  'Target': Target,
  'Users': Users,
  'TrendingUp': TrendingUp,
  'Rocket': Rocket
};

const JourneyPage = () => {
  const [selectedPhase, setSelectedPhase] = useState(0);
  const [expandedMission, setExpandedMission] = useState<number | null>(null);
  const [journeyPhases, setJourneyPhases] = useState<JourneyPhase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadJourney = async () => {
      try {
        setIsLoading(true);
        const data = await dashboardService.getJourneyData();
        setJourneyPhases(data);
        
        // Find first active/in-progress phase
        const activeIndex = data.findIndex(p => p.status === 'in-progress');
        if (activeIndex !== -1) {
          setSelectedPhase(activeIndex);
        } else {
          // If none in progress, select the last completed or first if all locked
          const lastCompleted = data.map(p => p.status).lastIndexOf('completed');
          setSelectedPhase(lastCompleted !== -1 ? lastCompleted : 0);
        }
      } catch (error) {
        console.error('Error loading journey:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadJourney();
  }, []);

  // Removed static mock journeyPhases

  const achievements = [
    { icon: Trophy, title: 'Primeiro MVP', description: 'Criou seu primeiro produto mínimo viável', unlocked: true },
    { icon: Users, title: 'Validador', description: 'Entrevistou 10 potenciais clientes', unlocked: true },
    { icon: Star, title: 'Persistente', description: 'Completou 7 dias seguidos de atividade', unlocked: true },
    { icon: Zap, title: 'Rápido', description: 'Completou uma fase em menos de 30 dias', unlocked: false },
    { icon: Award, title: 'Mestre', description: 'Alcançou nível 10', unlocked: false },
    { icon: Flag, title: 'Conquistador', description: 'Completou todas as fases', unlocked: false }
  ];

  if (isLoading) {
    return <DashboardPageSkeleton hero={true} cards={0} columns={1} />;
  }

  const currentPhase = journeyPhases[selectedPhase] || journeyPhases[0];
  const totalXP = journeyPhases.reduce((acc, phase) => acc + phase.xpEarned, 0);
  const completedMissions = journeyPhases.reduce((acc, phase) => 
    acc + phase.missions.filter(m => m.completed).length, 0
  );
  const totalMissions = journeyPhases.reduce((acc, phase) => 
    acc + phase.missions.length, 0
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-black via-gray-900 to-black py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #FFD700 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-1.5 bg-primary-500/20 border-2 border-primary-500/40 px-5 py-2 rounded-full mb-6 backdrop-blur-sm">
              <Rocket className="w-4 h-4 text-primary-500 flex-shrink-0" />
              <span className="text-primary-500 font-bold text-sm uppercase tracking-wide text-center">
                Sua Jornada
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Jornada Empreendedora
            </h1>
            <p className="text-xl text-gray-300">
              Acompanhe seu progresso e conquiste cada fase rumo ao sucesso
            </p>
          </motion.div>

          {/* Overall Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 text-primary-500 mb-2">
                <Star className="w-5 h-5" />
                <span className="text-sm font-medium">XP Total</span>
              </div>
              <p className="text-2xl font-bold text-white">{totalXP}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">Missões</span>
              </div>
              <p className="text-2xl font-bold text-white">{completedMissions}/{totalMissions}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <Target className="w-5 h-5" />
                <span className="text-sm font-medium">Fases</span>
              </div>
              <p className="text-2xl font-bold text-white">2/5</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 text-yellow-400 mb-2">
                <Trophy className="w-5 h-5" />
                <span className="text-sm font-medium">Conquistas</span>
              </div>
              <p className="text-2xl font-bold text-white">3/6</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Phase Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {journeyPhases.map((phase, index) => {
                const Icon = iconMap[phase.icon as string] || Target;
                const isLocked = phase.status === 'locked';
                const isActive = phase.status === 'in-progress';
                const isCompleted = phase.status === 'completed';

                return (
                  <motion.button
                    key={phase.id}
                    onClick={() => !isLocked && setSelectedPhase(index)}
                    className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                      selectedPhase === index
                        ? 'border-primary-500 bg-primary-500/10 shadow-xl shadow-primary-500/20'
                        : isLocked
                        ? 'border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-500'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    disabled={isLocked}
                  >
                    {/* Status Badge */}
                    {isCompleted && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-900">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    )}
                    {isActive && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-900 animate-pulse">
                        <Zap className="w-4 h-4 text-black" />
                      </div>
                    )}

                    <div className={`w-12 h-12 ${phase.bgColor} rounded-xl flex items-center justify-center mb-3`}>
                      {isLocked ? (
                        <Lock className="w-6 h-6 text-gray-400" />
                      ) : (
                        <Icon className={`w-6 h-6 bg-gradient-to-br ${phase.color} bg-clip-text`} style={{ WebkitTextFillColor: 'transparent' }} />
                      )}
                    </div>

                    <h3 className="font-bold text-lg mb-2">{phase.name}</h3>

                    {!isLocked && (
                      <>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                          <div 
                            className={`h-full bg-gradient-to-r ${phase.color} rounded-full transition-all duration-500`}
                            style={{ width: `${phase.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {phase.progress}% completo
                        </p>
                      </>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Phase Details */}
            <motion.div
              key={selectedPhase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-14 h-14 ${currentPhase.bgColor} rounded-xl flex items-center justify-center`}>
                      {(() => {
                        const CurrentIcon = iconMap[currentPhase.icon as string] || Target;
                        return <CurrentIcon className={`w-7 h-7 bg-gradient-to-br ${currentPhase.color} bg-clip-text`} style={{ WebkitTextFillColor: 'transparent' }} />;
                      })()}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">{currentPhase.name}</h2>
                      <p className="text-gray-600 dark:text-gray-400">{currentPhase.description}</p>
                    </div>
                  </div>
                </div>

                {currentPhase.status !== 'locked' && (
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-primary-500 mb-1">
                      <Star className="w-5 h-5" />
                      <span className="font-bold text-xl">{currentPhase.xpEarned} XP</span>
                    </div>
                    <p className="text-sm text-gray-500">conquistados</p>
                  </div>
                )}
              </div>

              {/* Missions */}
              <div className="space-y-3">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary-500" />
                  Missões da Fase
                </h3>

                {currentPhase.missions.map((mission, index) => {
                  const isExpanded = expandedMission === mission.id;
                  
                  return (
                    <motion.div
                      key={mission.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex flex-col rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                        mission.completed
                          ? 'border-green-500/30 bg-green-500/5'
                          : currentPhase.status === 'locked'
                          ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-50'
                          : isExpanded 
                          ? 'border-primary-500 shadow-xl shadow-primary-500/10 bg-white dark:bg-gray-800' 
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-500/50 cursor-pointer'
                      }`}
                    >
                      <div 
                        className="flex items-center justify-between p-4 cursor-pointer"
                        onClick={() => {
                          if (currentPhase.status !== 'locked') {
                            setExpandedMission(isExpanded ? null : mission.id);
                          }
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                            mission.completed
                              ? 'bg-green-500'
                              : currentPhase.status === 'locked'
                              ? 'bg-gray-300 dark:bg-gray-700'
                              : isExpanded 
                              ? 'bg-primary-500' 
                              : 'bg-gray-200 dark:bg-gray-700 group-hover:bg-primary-500/20'
                          }`}>
                            {mission.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-white" />
                            ) : currentPhase.status === 'locked' ? (
                              <Lock className="w-4 h-4 text-gray-500" />
                            ) : (
                              <Circle className={`w-5 h-5 ${isExpanded ? 'text-white' : 'text-gray-400'}`} />
                            )}
                          </div>
                          <div>
                            <p className={`font-medium ${mission.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                              {mission.title}
                            </p>
                            {currentPhase.status === 'in-progress' && !mission.completed && (
                              <p className="text-sm text-primary-600 dark:text-primary-400 flex items-center gap-1 mt-1 font-medium">
                                <Zap className="w-3 h-3" />
                                Missão Ativa
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2.5 py-1 rounded-full">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="font-bold text-sm">+{mission.xp}</span>
                          </div>
                          {!mission.completed && currentPhase.status !== 'locked' && (
                            <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}>
                              <ChevronRight className={`w-5 h-5 ${isExpanded ? 'text-primary-500' : 'text-gray-400'}`} />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Expanded Content with Frameworks and Tasks Details */}
                      {isExpanded && !mission.completed && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30"
                        >
                          <div className="flex flex-col gap-4 mt-2">
                            {/* Assitant Suggestion / Gamification Lore */}
                            <div className="text-sm text-gray-600 dark:text-gray-400 flex gap-2">
                              <Sparkles className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                              <p>Concluir esta missão aproximará você de destravar a próxima fase da jornada. Utilize os recursos e tarefas ativas abaixo para acelerar seu progresso e ganhar mais XP.</p>
                            </div>

                            {/* Tarefas Sugeridas */}
                            {mission.tasks && mission.tasks.length > 0 && (
                              <div>
                                <h4 className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-2 flex flex-row items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Checklist recomendado
                                </h4>
                                <div className="space-y-2">
                                  {mission.tasks.map((task: any, tIndex: number) => (
                                    <a 
                                      key={tIndex}
                                      href={task.path}
                                      className="flex justify-between items-center bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 hover:border-primary-500 transition-colors"
                                    >
                                      <span className="text-sm font-medium">{task.name}</span>
                                      <span className="text-xs bg-primary-500/10 text-primary-600 dark:text-primary-400 px-2 py-1 rounded">Fazer agora</span>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Frameworks Relacionados */}
                            {mission.frameworks && mission.frameworks.length > 0 && (
                              <div>
                                <h4 className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-2 flex flex-row items-center gap-1">
                                  <BarChart className="w-3 h-3" />
                                  Frameworks Relacionados
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {mission.frameworks.map((fw: any, fwIndex: number) => (
                                    <a 
                                      key={fwIndex}
                                      href={fw.path}
                                      className="flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-lg p-2.5 hover:shadow-md transition-shadow"
                                    >
                                      <Target className="w-4 h-4 text-blue-500" />
                                      <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">{fw.name}</span>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {(!mission.tasks || mission.tasks.length === 0) && (!mission.frameworks || mission.frameworks.length === 0) && (
                              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-600 mt-2">
                                <p className="text-sm text-gray-500">Nenhum atalho disponível para esta missão, use sua expertise para validá-la.</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-12 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/30 px-4 py-2 rounded-full mb-4">
                <Trophy className="w-4 h-4 text-primary-500" />
                <span className="text-primary-500 font-semibold text-sm">CONQUISTAS</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Suas Conquistas</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Badges e troféus conquistados ao longo da jornada
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative p-6 rounded-2xl border-2 text-center transition-all duration-300 ${
                      achievement.unlocked
                        ? 'border-primary-500 bg-gradient-to-br from-primary-500/10 to-primary-600/5 hover:shadow-xl hover:shadow-primary-500/20'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 opacity-50'
                    }`}
                  >
                    {achievement.unlocked && (
                      <div className="absolute -top-2 -right-2">
                        <Sparkles className="w-6 h-6 text-primary-500" />
                      </div>
                    )}

                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-primary-400 to-primary-600'
                        : 'bg-gray-300 dark:bg-gray-700'
                    }`}>
                      <Icon className={`w-8 h-8 ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`} />
                    </div>

                    <h3 className={`font-bold text-sm mb-1 ${achievement.unlocked ? '' : 'text-gray-500'}`}>
                      {achievement.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {achievement.description}
                    </p>

                    {!achievement.unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JourneyPage;
