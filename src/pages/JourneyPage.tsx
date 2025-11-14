import { useState } from 'react';
import { motion } from 'framer-motion';
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

const JourneyPage = () => {
  const [selectedPhase, setSelectedPhase] = useState(0);

  const journeyPhases = [
    {
      id: 1,
      name: 'Ideação',
      icon: Lightbulb,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-500/10',
      status: 'completed',
      progress: 100,
      xpEarned: 500,
      description: 'Validação inicial da sua ideia de negócio',
      missions: [
        { id: 1, title: 'Definir problema a resolver', completed: true, xp: 100 },
        { id: 2, title: 'Identificar público-alvo', completed: true, xp: 100 },
        { id: 3, title: 'Análise de concorrência', completed: true, xp: 150 },
        { id: 4, title: 'Proposta de valor única', completed: true, xp: 150 }
      ]
    },
    {
      id: 2,
      name: 'Validação',
      icon: Target,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-500/10',
      status: 'in-progress',
      progress: 60,
      xpEarned: 360,
      description: 'Teste e validação da sua solução no mercado',
      missions: [
        { id: 5, title: 'Criar MVP', completed: true, xp: 200 },
        { id: 6, title: 'Entrevistar 10 clientes', completed: true, xp: 150 },
        { id: 7, title: 'Testar hipóteses principais', completed: false, xp: 200 },
        { id: 8, title: 'Ajustar produto baseado em feedback', completed: false, xp: 150 }
      ]
    },
    {
      id: 3,
      name: 'Estruturação',
      icon: Users,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-500/10',
      status: 'locked',
      progress: 0,
      xpEarned: 0,
      description: 'Construção da estrutura do negócio',
      missions: [
        { id: 9, title: 'Formalizar a empresa', completed: false, xp: 200 },
        { id: 10, title: 'Montar time inicial', completed: false, xp: 250 },
        { id: 11, title: 'Definir processos operacionais', completed: false, xp: 200 },
        { id: 12, title: 'Criar modelo de negócio', completed: false, xp: 250 }
      ]
    },
    {
      id: 4,
      name: 'Tração',
      icon: TrendingUp,
      color: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-500/10',
      status: 'locked',
      progress: 0,
      xpEarned: 0,
      description: 'Crescimento e conquista de mercado',
      missions: [
        { id: 13, title: 'Alcançar primeiros 100 clientes', completed: false, xp: 300 },
        { id: 14, title: 'Estabelecer canais de aquisição', completed: false, xp: 250 },
        { id: 15, title: 'Otimizar funil de vendas', completed: false, xp: 200 },
        { id: 16, title: 'Atingir Product-Market Fit', completed: false, xp: 350 }
      ]
    },
    {
      id: 5,
      name: 'Escala',
      icon: Rocket,
      color: 'from-red-400 to-red-600',
      bgColor: 'bg-red-500/10',
      status: 'locked',
      progress: 0,
      xpEarned: 0,
      description: 'Crescimento exponencial e expansão',
      missions: [
        { id: 17, title: 'Captar investimento', completed: false, xp: 400 },
        { id: 18, title: 'Expandir equipe', completed: false, xp: 300 },
        { id: 19, title: 'Escalar operações', completed: false, xp: 350 },
        { id: 20, title: 'Expandir mercado', completed: false, xp: 450 }
      ]
    }
  ];

  const achievements = [
    { icon: Trophy, title: 'Primeiro MVP', description: 'Criou seu primeiro produto mínimo viável', unlocked: true },
    { icon: Users, title: 'Validador', description: 'Entrevistou 10 potenciais clientes', unlocked: true },
    { icon: Star, title: 'Persistente', description: 'Completou 7 dias seguidos de atividade', unlocked: true },
    { icon: Zap, title: 'Rápido', description: 'Completou uma fase em menos de 30 dias', unlocked: false },
    { icon: Award, title: 'Mestre', description: 'Alcançou nível 10', unlocked: false },
    { icon: Flag, title: 'Conquistador', description: 'Completou todas as fases', unlocked: false }
  ];

  const currentPhase = journeyPhases[selectedPhase];
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
                const Icon = phase.icon;
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
                      <currentPhase.icon className={`w-7 h-7 bg-gradient-to-br ${currentPhase.color} bg-clip-text`} style={{ WebkitTextFillColor: 'transparent' }} />
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

                {currentPhase.missions.map((mission, index) => (
                  <motion.div
                    key={mission.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 ${
                      mission.completed
                        ? 'border-green-500/30 bg-green-500/5'
                        : currentPhase.status === 'locked'
                        ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-50'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-500 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        mission.completed
                          ? 'bg-green-500'
                          : currentPhase.status === 'locked'
                          ? 'bg-gray-300 dark:bg-gray-700'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}>
                        {mission.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        ) : currentPhase.status === 'locked' ? (
                          <Lock className="w-4 h-4 text-gray-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className={`font-medium ${mission.completed ? 'line-through text-gray-500' : ''}`}>
                          {mission.title}
                        </p>
                        {currentPhase.status === 'in-progress' && !mission.completed && (
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" />
                            Em andamento
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-primary-500">
                        <Star className="w-4 h-4" />
                        <span className="font-bold">{mission.xp}</span>
                      </div>
                      {!mission.completed && currentPhase.status !== 'locked' && (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </motion.div>
                ))}
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
