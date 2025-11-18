import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { 
  BarChart2, 
  CheckSquare, 
  FileText, 
  Target, 
  Award, 
  Zap,
  TrendingUp,
  Rocket,
  Users,
  Calendar,
  Clock,
  Star,
  Trophy,
  Flame,
  ChevronRight,
  Play,
  BookOpen,
  MessageSquare,
  Bell,
  Settings,
  Sparkles,
  ArrowRight,
  Brain,
  Lightbulb,
  Crown,
  Gift,
  Activity
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [selectedPhase, setSelectedPhase] = useState('validation');
  
  // Mock data for dashboard
  const userData = {
    name:
      user?.user_metadata?.name?.trim() ||
      user?.user_metadata?.full_name?.trim() ||
      user?.email?.split('@')[0] ||
      'Founder',
    avatar: user?.avatar || '',
    level: 12,
    currentXP: 2850,
    nextLevelXP: 3500,
    streak: 7,
    totalPoints: 12450,
    rank: 'Gold',
    phase: 'validation'
  };

  const xpPercentage = (userData.currentXP / userData.nextLevelXP) * 100;
  
  const quickStats = [
    {
      icon: Trophy,
      label: 'Conquistas',
      value: '24/50',
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'bg-yellow-500/10',
      change: '+3 esta semana'
    },
    {
      icon: Flame,
      label: 'Sequência',
      value: `${userData.streak} dias`,
      color: 'from-orange-400 to-red-600',
      bgColor: 'bg-orange-500/10',
      change: 'Recorde pessoal!'
    },
    {
      icon: Target,
      label: 'Metas Concluídas',
      value: '18/25',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-500/10',
      change: '72% completo'
    },
    {
      icon: Users,
      label: 'Networking',
      value: '43',
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-500/10',
      change: '+5 conexões'
    }
  ];

  const recentTasks = [
    { 
      id: 1, 
      title: 'Completar Business Model Canvas', 
      completed: true,
      xp: 150,
      category: 'Framework',
      priority: 'high'
    },
    { 
      id: 2, 
      title: 'Entrevistar 5 clientes potenciais', 
      completed: true,
      xp: 200,
      category: 'Validação',
      priority: 'high'
    },
    { 
      id: 3, 
      title: 'Criar proposta de valor', 
      completed: false,
      xp: 100,
      category: 'Framework',
      priority: 'medium',
      progress: 60
    },
    { 
      id: 4, 
      title: 'Definir métricas principais (KPIs)', 
      completed: false,
      xp: 120,
      category: 'Estratégia',
      priority: 'medium',
      progress: 30
    },
    { 
      id: 5, 
      title: 'Mapear jornada do cliente', 
      completed: false,
      xp: 180,
      category: 'Framework',
      priority: 'low',
      progress: 0
    }
  ];

  const frameworks = [
    { 
      id: 1, 
      name: 'Business Model Canvas', 
      progress: 85,
      icon: '🎯',
      status: 'Quase lá!',
      lastUpdate: 'Há 2 horas'
    },
    { 
      id: 2, 
      name: 'Mapa de Empatia', 
      progress: 100,
      icon: '💭',
      status: 'Completo',
      lastUpdate: 'Ontem',
      badge: 'new'
    },
    { 
      id: 3, 
      name: 'Jornada do Cliente', 
      progress: 45,
      icon: '🗺️',
      status: 'Em andamento',
      lastUpdate: 'Há 1 dia'
    },
    { 
      id: 4, 
      name: 'Proposta de Valor', 
      progress: 30,
      icon: '💎',
      status: 'Iniciado',
      lastUpdate: 'Há 3 dias'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Mentoria com João Silva',
      type: 'Mentoria',
      date: 'Hoje, 15:00',
      duration: '45 min',
      avatar: 'https://ui-avatars.com/api/?name=João+Silva&background=FFD700&color=000'
    },
    {
      id: 2,
      title: 'Workshop: Validação de Problemas',
      type: 'Workshop',
      date: 'Amanhã, 10:00',
      duration: '2h',
      avatar: 'https://ui-avatars.com/api/?name=Workshop&background=6366F1&color=fff'
    },
    {
      id: 3,
      title: 'Networking com Investidores',
      type: 'Evento',
      date: '15 Fev, 18:00',
      duration: '3h',
      avatar: 'https://ui-avatars.com/api/?name=Networking&background=10B981&color=fff'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Completou',
      target: 'Business Model Canvas',
      xp: 150,
      time: 'Há 2 horas',
      icon: Award
    },
    {
      id: 2,
      action: 'Desbloqueou conquista',
      target: 'Validador de Ideias',
      xp: 50,
      time: 'Há 5 horas',
      icon: Trophy
    },
    {
      id: 3,
      action: 'Conectou com',
      target: 'Maria Santos (Investidora)',
      xp: 25,
      time: 'Ontem',
      icon: Users
    }
  ];

  const recommendations = [
    {
      id: 1,
      title: 'Complete sua validação de problema',
      description: 'Você está a 2 entrevistas de desbloquear o próximo nível',
      action: 'Começar agora',
      icon: Target,
      color: 'primary'
    },
    {
      id: 2,
      title: 'Participe do workshop de hoje',
      description: 'Aprenda técnicas avançadas de validação com especialistas',
      action: 'Ver detalhes',
      icon: Lightbulb,
      color: 'blue'
    },
    {
      id: 3,
      title: 'Conecte-se com outros founders',
      description: '15 founders na sua área estão online agora',
      action: 'Explorar',
      icon: Users,
      color: 'purple'
    }
  ];

  const phases = [
    { id: 'ideation', name: 'Ideação', icon: Lightbulb, active: false, completed: true },
    { id: 'validation', name: 'Validação', icon: Target, active: true, completed: false },
    { id: 'mvp', name: 'MVP', icon: Rocket, active: false, completed: false },
    { id: 'traction', name: 'Tração', icon: TrendingUp, active: false, completed: false },
    { id: 'growth', name: 'Crescimento', icon: Activity, active: false, completed: false }
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard - Orientohub</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container-custom py-8 space-y-8">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black rounded-2xl p-8 border-2 border-primary-500/30"
          >
            {/* Background effects */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-400 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img
                    src={userData.avatar || `https://ui-avatars.com/api/?name=${userData.name}&size=80&background=FFD700&color=000&bold=true`}
                    alt={userData.name}
                    className="w-20 h-20 rounded-full border-4 border-primary-500 shadow-xl"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-primary-500 text-black w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                    {userData.level}
                  </div>
                </div>

                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Bem-vindo de volta, <span className="text-primary-500">{userData.name}</span>! 🚀
                  </h1>
                  <p className="text-gray-300 text-lg">
                    Continue sua jornada empreendedora. Você está indo muito bem!
                  </p>

                  {/* XP Bar */}
                  <div className="mt-4 max-w-md">
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                      <span className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-primary-500" />
                        Nível {userData.level}
                      </span>
                      <span>{userData.currentXP} / {userData.nextLevelXP} XP</span>
                    </div>
                    <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${xpPercentage}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Faltam {userData.nextLevelXP - userData.currentXP} XP para o próximo nível
                    </p>
                  </div>
                </div>
              </div>

              {/* Rank Badge */}
              <div className="hidden lg:block">
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-6 rounded-2xl text-center shadow-2xl">
                  <Crown className="w-12 h-12 text-black mx-auto mb-2" />
                  <p className="text-black font-bold text-lg">Rank {userData.rank}</p>
                  <p className="text-black/80 text-sm">Top 10%</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-all duration-300 hover:shadow-xl group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.change}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Journey Phases */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Rocket className="w-6 h-6 text-primary-500" />
                Sua Jornada Empreendedora
              </h2>
              <Link to="jornada" className="text-primary-500 hover:text-primary-600 font-medium text-sm flex items-center gap-1">
                Ver detalhes
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between">
                {phases.map((phase, index) => {
                  const Icon = phase.icon;
                  return (
                    <div key={phase.id} className="flex flex-col items-center flex-1 relative">
                      {/* Connector Line */}
                      {index < phases.length - 1 && (
                        <div className={`absolute top-6 left-1/2 w-full h-1 ${
                          phase.completed ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                        }`} style={{ zIndex: 0 }} />
                      )}

                      {/* Phase Icon */}
                      <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                        phase.active 
                          ? 'bg-primary-500 border-primary-300 shadow-lg shadow-primary-500/50 scale-110' 
                          : phase.completed
                          ? 'bg-green-500 border-green-300'
                          : 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          phase.active || phase.completed ? 'text-white' : 'text-gray-500'
                        }`} />
                      </div>

                      {/* Phase Label */}
                      <p className={`mt-3 text-sm font-medium text-center ${
                        phase.active 
                          ? 'text-primary-500' 
                          : phase.completed
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {phase.name}
                      </p>

                      {/* Active Indicator */}
                      {phase.active && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 left-1/2 -translate-x-1/2"
                        >
                          <Sparkles className="w-4 h-4 text-primary-500" />
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Tasks & Frameworks */}
            <div className="lg:col-span-2 space-y-8">
              {/* Tasks */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <CheckSquare className="w-6 h-6 text-primary-500" />
                    Tarefas Ativas
                  </h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {recentTasks.filter(t => t.completed).length}/{recentTasks.length} concluídas
                  </span>
                </div>

                <div className="space-y-3">
                  {recentTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className={`group p-4 rounded-xl border-2 transition-all duration-300 ${
                        task.completed
                          ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                          : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 hover:border-primary-500'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            readOnly
                            className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 text-primary-500 focus:ring-primary-500 cursor-pointer"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className={`font-semibold mb-1 ${
                                task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
                              }`}>
                                {task.title}
                              </h3>
                              <div className="flex items-center gap-3 text-sm">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  task.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                                  task.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                                  'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                }`}>
                                  {task.category}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                  <Zap className="w-3 h-3 text-primary-500" />
                                  +{task.xp} XP
                                </span>
                              </div>
                            </div>

                            {!task.completed && (
                              <button
                                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-black text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => alert(`Inicie a tarefa: ${task.title}`)}
                              >
                                Começar
                              </button>
                            )}
                          </div>

                          {/* Progress Bar */}
                          {!task.completed && task.progress !== undefined && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                                <span>Progresso</span>
                                <span>{task.progress}%</span>
                              </div>
                              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary-500 rounded-full transition-all duration-300"
                                  style={{ width: `${task.progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <button
                  className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 hover:border-primary-500 hover:text-primary-500 transition-all duration-300 font-medium"
                  onClick={() => navigate('/tarefas')}
                >
                  + Ver todas as tarefas
                </button>
              </motion.div>

              {/* Frameworks Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <FileText className="w-6 h-6 text-primary-500" />
                    Frameworks em Andamento
                  </h2>
                  <button
                    className="text-primary-500 hover:text-primary-600 font-medium text-sm flex items-center gap-1"
                    onClick={() => navigate('/frameworks')}
                  >
                    Ver todos
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {frameworks.map((framework, index) => (
                    <motion.div
                      key={framework.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="group p-5 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-all duration-300 hover:shadow-lg cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{framework.icon}</span>
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
                              {framework.name}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {framework.lastUpdate}
                            </p>
                          </div>
                        </div>
                        {framework.badge === 'new' && (
                          <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                            NOVO
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">{framework.status}</span>
                          <span className="font-bold text-primary-500">{framework.progress}%</span>
                        </div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${
                              framework.progress === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-primary-400 to-primary-600'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${framework.progress}%` }}
                            transition={{ duration: 1, delay: 0.9 + index * 0.1 }}
                          />
                        </div>
                      </div>

                      <button
                        className="mt-4 w-full py-2 bg-primary-500/10 hover:bg-primary-500 text-primary-600 hover:text-black rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100"
                        onClick={() => alert(`Continuar framework: ${framework.name}`)}
                      >
                        <Play className="w-4 h-4" />
                        Continuar
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Events, Activity & Recommendations */}
            <div className="space-y-8">
              {/* Upcoming Events */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary-500" />
                    Próximos Eventos
                  </h2>
                  <Bell className="w-5 h-5 text-gray-400 cursor-pointer hover:text-primary-500" />
                </div>

                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-primary-500/10 transition-colors cursor-pointer group"
                    >
                      <img
                        src={event.avatar}
                        alt={event.title}
                        className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-800"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm group-hover:text-primary-500 transition-colors">
                          {event.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {event.date}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full">
                            {event.type}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {event.duration}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <button
                  className="mt-4 w-full py-2 text-primary-500 hover:text-primary-600 font-medium text-sm"
                  onClick={() => navigate('/calendario')}
                >
                  Ver calendário completo
                </button>
              </motion.div>

              {/* Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-br from-primary-500/10 to-primary-600/10 rounded-2xl p-6 border-2 border-primary-500/30"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-primary-500" />
                  <h2 className="text-xl font-bold">Recomendado pra Você</h2>
                </div>

                <div className="space-y-3">
                  {recommendations.map((rec, index) => {
                    const Icon = rec.icon;
                    return (
                      <motion.div
                        key={rec.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                        className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            rec.color === 'primary' ? 'bg-primary-500/10' :
                            rec.color === 'blue' ? 'bg-blue-500/10' :
                            'bg-purple-500/10'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              rec.color === 'primary' ? 'text-primary-500' :
                              rec.color === 'blue' ? 'text-blue-500' :
                              'text-purple-500'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-1">{rec.title}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{rec.description}</p>
                          </div>
                        </div>
                        <button
                          className={`w-full py-2 rounded-lg font-medium text-sm transition-all ${
                            rec.color === 'primary' ? 'bg-primary-500 hover:bg-primary-600 text-black' :
                            rec.color === 'blue' ? 'bg-blue-500 hover:bg-blue-600 text-white' :
                            'bg-purple-500 hover:bg-purple-600 text-white'
                          }`}
                          onClick={() => alert(`Ação: ${rec.action}`)}
                        >
                          {rec.action}
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700"
              >
                <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                  <Activity className="w-5 h-5 text-primary-500" />
                  Atividade Recente
                </h2>

                <div className="space-y-4">
                  {recentActivity.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0 + index * 0.1 }}
                        className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0"
                      >
                        <div className="w-8 h-8 bg-primary-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-primary-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="text-gray-600 dark:text-gray-400">{activity.action}</span>
                            {' '}
                            <span className="font-semibold text-gray-900 dark:text-white">{activity.target}</span>
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                            <span className="text-xs text-primary-500 font-medium">+{activity.xp} XP</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
