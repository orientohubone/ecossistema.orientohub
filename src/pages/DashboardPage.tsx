import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { dashboardService, type DashboardData } from '../services/dashboardService';
import DashboardPageSkeleton from '../components/ui/DashboardPageSkeleton';
import { getCachedValue, getOrLoadCachedValue, invalidateCache } from '../lib/memoryCache';
import { 
  CheckSquare, 
  FileText, 
  Target, 
  Zap,
  Rocket,
  Users,
  Calendar,
  Clock,
  Star,
  Trophy,
  Flame,
  ChevronRight,
  Play,
  Bell,
  Crown,
  Activity,
  TrendingUp,
  Award,
  Lightbulb,
  Compass,
  Flag,
  BarChart,
  LineChart,
  Sparkles
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();
  const cachedDashboardData = getCachedValue<DashboardData>('dashboard:data');
  const [selectedPhase, setSelectedPhase] = useState('validation');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(cachedDashboardData);
  const [isLoading, setIsLoading] = useState(!cachedDashboardData);
  const [error, setError] = useState<string | null>(null);
  
  // Carregar dados do dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        if (!cachedDashboardData) {
          setIsLoading(true);
        }
        setError(null);
        const data = await getOrLoadCachedValue(
          'dashboard:data',
          30000,
          () => dashboardService.getDashboardData()
        );
        setDashboardData(data);
        setSelectedPhase(data.userProfile.phase);
      } catch (err: any) {
        console.error('Error loading dashboard data:', err);
        setError(err.message || 'Não foi possível carregar os dados do dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

  if (isLoading) {
    return <DashboardPageSkeleton hero cards={4} columns={2} />;
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Dados não disponíveis'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-500 text-black rounded-lg hover:bg-primary-600 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // Funções para saudação personalizada
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getMotivationalData = (level: number) => {
    if (level <= 3) return { icon: Compass, text: 'Estruture suas premissas e direcione o foco do seu negócio.' };
    if (level <= 6) return { icon: LineChart, text: 'Suas validações estão gerando dados consistentes. Mantenha a cadência.' };
    if (level <= 9) return { icon: Activity, text: 'O ecossistema do seu projeto está tracionando em alta performance.' };
    return { icon: Crown, text: 'Operação estabelecida com excelência estratégica.' };
  };

  const userData = dashboardData.userProfile;
  const xpPercentage = (userData.currentXP / userData.nextLevelXP) * 100;
  const quickStats = [
    {
      icon: Trophy,
      label: 'Conquistas',
      value: `${dashboardData.stats.achievements.completed}/${dashboardData.stats.achievements.total}`,
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'bg-yellow-500/10',
      change: '+3 esta semana'
    },
    {
      icon: Flame,
      label: 'Sequência',
      value: `${dashboardData.stats.streak} dias`,
      color: 'from-orange-400 to-red-600',
      bgColor: 'bg-orange-500/10',
      change: dashboardData.stats.streak >= 5 ? 'Recorde pessoal!' : 'Continue assim!'
    },
    {
      icon: Target,
      label: 'Metas Concluídas',
      value: `${dashboardData.stats.completedGoals.completed}/${dashboardData.stats.completedGoals.total}`,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-500/10',
      change: `${Math.round((dashboardData.stats.completedGoals.completed / dashboardData.stats.completedGoals.total) * 100)}% completo`
    },
    {
      icon: Users,
      label: 'Networking',
      value: dashboardData.stats.networking.toString(),
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-500/10',
      change: '+5 conexões'
    }
  ];

  // Mapeamento de strings para componentes de ícone
  const iconMap: { [key: string]: any } = {
    'Trophy': Trophy,
    'Flame': Flame,
    'Target': Target,
    'Users': Users,
    'Award': Award,
    'Rocket': Rocket,
    'Lightbulb': Lightbulb,
    'TrendingUp': TrendingUp,
    'Activity': Activity
  };

  // Função para mudar o status da tarefa
  const handleTaskToggle = async (e: React.ChangeEvent<HTMLInputElement>, task: any) => {
    e.stopPropagation();
    try {
      const isCompleting = !task.completed;
      const newProgress = isCompleting ? 100 : 0;
      
      // Atualização otimista na UI
      setDashboardData(prev => {
        if (!prev) return prev;
        
        const newTasks = prev.tasks.map(t => {
          if (t.id === task.id) {
            return {
              ...t,
              completed: isCompleting,
              progress: newProgress,
              priority: isCompleting ? 'low' : 'high'
            };
          }
          return t;
        });

        // Ordenar: tarefas não concluídas primeiro
        newTasks.sort((a, b) => Number(a.completed) - Number(b.completed));

        return {
          ...prev,
          tasks: newTasks
        };
      });

      // Atualizar no backend
      await dashboardService.updateTaskProgress(task.id, newProgress);
      
      // Invalidar o cache da dashboard para refletir as mudanças permanentemente
      invalidateCache('dashboard:data');
    } catch (err: any) {
      console.error('Error toggling task:', err);
      // Se falhar, tenta recarregar os dados do backend
      dashboardService.getDashboardData().then(data => {
        setDashboardData(data);
      }).catch(console.error);
    }
  };

  // Função para lidar com clique em tarefas
  const handleTaskClick = async (task: any) => {
    if (!task.completed) {
      try {
        // Navegar para a página do projeto se tiver project_id
        if (task.project_id) {
          navigate(`/dashboard/projects/${task.project_id}`);
        } else {
          // Se não tiver projeto, navegar para página de tarefas
          navigate('/dashboard/tarefas');
        }
      } catch (error) {
        console.error('Error navigating to task:', error);
      }
    }
  };

  // Função para lidar com clique em frameworks
  const handleFrameworkClick = (framework: any) => {
    if (framework.project_id) {
      navigate(`/dashboard/projects/${framework.project_id}`);
    } else {
      navigate('/dashboard/frameworks');
    }
  };

  // Função para lidar com recomendações
  const handleRecommendationClick = (recommendation: any) => {
    switch (recommendation.action) {
      case 'Criar projeto':
        navigate('/dashboard/projects');
        break;
      case 'Começar agora':
        navigate('/dashboard/frameworks');
        break;
      case 'Ver progresso':
        navigate('/dashboard/jornada');
        break;
      default:
        navigate('/dashboard');
    }
  };

  const recentTasks = dashboardData.tasks;
  const frameworks = dashboardData.frameworks;
  const upcomingEvents = dashboardData.events;
  const recentActivity = dashboardData.activity;
  const recommendations = dashboardData.recommendations;
  const phases = dashboardData.phases;

  return (
    <>
      <Helmet>
        <title>Dashboard - Orientohub</title>
      </Helmet>

      <div className="min-h-screen bg-[#0c121b]">
        <div className="container-custom py-8 space-y-8">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-2xl border border-[#34455a] bg-[#101722] p-6 shadow-[0_16px_36px_rgba(0,0,0,0.2)] sm:p-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  {/* Avatar com efeito de hover e fallback melhorado */}
                  <div className="relative overflow-hidden rounded-full border-4 border-primary-500 shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:border-primary-400">
                    {userData.avatar ? (
                      <img
                        src={userData.avatar}
                        alt={userData.name}
                        className="w-20 h-20 object-cover"
                        onError={(e) => {
                          // Fallback para avatar gerado se a imagem falhar
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&size=80&background=FFD700&color=000&bold=true&format=png`;
                        }}
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center bg-[#151f2b]">
                        <span className="text-2xl font-bold text-primary-300">
                          {userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Badge de nível com animação */}
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-primary-500 to-primary-600 text-black w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg border-2 border-gray-900 transition-all duration-300 group-hover:scale-110">
                    {userData.level}
                  </div>
                  
                  {/* Efeito de brilho no hover */}
                  <div className="absolute inset-0 rounded-full bg-primary-500/20 scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
                </div>

                <div className="space-y-3">
                  {/* Saudação personalizada com base no horário */}
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                      {getGreeting()}, <span className="text-primary-300">{userData.name}</span>!
                    </h1>
                    {(() => {
                      const motivation = getMotivationalData(userData.level);
                      const MotivationIcon = motivation.icon;
                      return (
                        <p className="flex items-center gap-2 text-lg text-[#b8c4d4]">
                          <MotivationIcon className="h-5 w-5 text-primary-300" />
                          {motivation.text}
                        </p>
                      );
                    })()}
                  </div>

                  {/* XP Bar melhorada */}
                  <div className="max-w-md">
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                      <span className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-primary-500" />
                        <span className="text-white font-medium">Nível {userData.level}</span>
                      </span>
                      <span className="font-medium text-primary-300">{userData.currentXP} / {userData.nextLevelXP} XP</span>
                    </div>
                    <div className="relative h-3 overflow-hidden rounded-full bg-[#0c121b]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${xpPercentage}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                      </motion.div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5 font-medium">
                      <Flag className="w-3.5 h-3.5 text-gray-500" />
                      Faltam {userData.nextLevelXP - userData.currentXP} XP para avançar de nível
                    </p>
                  </div>
                </div>
              </div>

              {/* Rank Card melhorado */}
              <div className="hidden lg:block">
                <div className="relative group">
                  <div className="relative rounded-2xl border border-primary-400/30 bg-primary-400/10 p-6 text-center transition-all duration-300 group-hover:scale-105">
                    <div className="relative">
                      <Crown className="mx-auto mb-2 h-10 w-10 text-primary-300" />
                      <p className="text-lg font-bold text-white">Rank {userData.rank}</p>
                      <p className="text-sm text-[#b8c4d4]">Top 10%</p>
                    </div>
                  </div>
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
                  className="group rounded-2xl border border-[#273548] bg-[#101722] p-5 shadow-[0_12px_28px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-400/70 hover:shadow-[0_20px_38px_rgba(0,0,0,0.28)]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#34455a] bg-[#0c121b] transition-transform group-hover:scale-105">
                      <Icon className={`w-6 h-6 ${
                        stat.bgColor.includes('orange') ? 'text-orange-300' :
                        stat.bgColor.includes('yellow') ? 'text-yellow-300' :
                        stat.bgColor.includes('blue') ? 'text-blue-300' :
                        stat.bgColor.includes('purple') ? 'text-purple-300' : 'text-primary-300'
                      }`} />
                    </div>
                  </div>
                  <h3 className="mb-1 text-sm font-medium text-[#9ba9bc]">
                    {stat.label}
                  </h3>
                  <p className="mb-2 text-2xl font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-[#718096]">
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
            className="rounded-2xl border border-[#273548] bg-[#101722] p-6 shadow-[0_12px_28px_rgba(0,0,0,0.16)]"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
                <Rocket className="h-6 w-6 text-primary-300" />
                Sua Jornada Empreendedora
              </h2>
              <Link to="/dashboard/jornada" className="flex items-center gap-1 text-sm font-medium text-primary-300 hover:text-primary-200">
                Ver detalhes
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between">
                {phases.map((phase, index) => {
                  const Icon = iconMap[phase.icon] || Lightbulb; // Fallback para Lightbulb
                  return (
                    <div key={phase.id} className="flex flex-col items-center flex-1 relative">
                      {/* Connector Line */}
                      {index < phases.length - 1 && (
                        <div className={`absolute top-6 left-1/2 w-full h-1 ${
                          phase.completed ? 'bg-primary-500' : 'bg-[#273548]'
                        }`} style={{ zIndex: 0 }} />
                      )}

                      {/* Phase Icon */}
                      <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                        phase.active 
                          ? 'bg-primary-500 border-primary-300 shadow-lg shadow-primary-500/50 scale-110' 
                          : phase.completed
                          ? 'bg-green-500 border-green-300'
                          : 'bg-[#151f2b] border-[#34455a]'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          phase.active || phase.completed ? 'text-white' : 'text-[#718096]'
                        }`} />
                      </div>

                      {/* Phase Label */}
                      <p className={`mt-3 text-sm font-medium text-center ${
                        phase.active 
                          ? 'text-primary-500' 
                          : phase.completed
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-[#718096]'
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
                className="rounded-2xl border border-[#273548] bg-[#101722] p-6 shadow-[0_12px_28px_rgba(0,0,0,0.16)]"
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
                          ? 'bg-emerald-400/5 border-emerald-400/25'
                          : 'bg-[#0c121b] border-[#273548] hover:border-primary-400/70'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={(e) => handleTaskToggle(e, task)}
                            className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 text-primary-500 focus:ring-primary-500 cursor-pointer"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className={`font-semibold mb-1 ${
                                task.completed ? 'line-through text-[#718096]' : 'text-white'
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
                                <span className="flex items-center gap-1 text-[#9ba9bc]">
                                  <Zap className="h-3 w-3 text-primary-300" />
                                  +{task.xp} XP
                                </span>
                              </div>
                            </div>

                            {!task.completed && (
                              <button
                                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-black text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleTaskClick(task)}
                              >
                                Começar
                              </button>
                            )}
                          </div>

                          {/* Progress Bar */}
                          {!task.completed && task.progress !== undefined && (
                            <div className="mt-3">
                              <div className="mb-1 flex items-center justify-between text-xs text-[#9ba9bc]">
                                <span>Progresso</span>
                                <span>{task.progress}%</span>
                              </div>
                              <div className="h-2 overflow-hidden rounded-full bg-[#151f2b]">
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
                  className="mt-4 w-full rounded-xl border border-dashed border-[#34455a] py-3 font-medium text-[#9ba9bc] transition-all duration-300 hover:border-primary-400 hover:text-primary-300"
                  onClick={() => navigate('/dashboard/tarefas')}
                >
                  + Ver todas as tarefas
                </button>
              </motion.div>

              {/* Frameworks Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="rounded-2xl border border-[#273548] bg-[#101722] p-6 shadow-[0_12px_28px_rgba(0,0,0,0.16)]"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <FileText className="w-6 h-6 text-primary-500" />
                    Frameworks em Andamento
                  </h2>
                  <button
                    className="text-primary-500 hover:text-primary-600 font-medium text-sm flex items-center gap-1"
                    onClick={() => navigate('/dashboard/frameworks')}
                  >
                    Ver todos
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {frameworks.map((framework, index) => {
                    const FrameworkIcon = iconMap[framework.icon] || Target;
                    return (
                    <motion.div
                      key={framework.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="group cursor-pointer rounded-xl border border-[#273548] bg-[#0c121b] p-5 transition-all duration-300 hover:border-primary-400/70 hover:bg-[#151f2b]"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#34455a] bg-[#151f2b] text-primary-300">
                            <FrameworkIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-white transition-colors group-hover:text-primary-300">
                              {framework.name}
                            </h3>
                            <p className="text-xs text-[#718096]">
                              {framework.lastUpdate}
                            </p>
                          </div>
                        </div>
                        {(framework as any).badge === 'new' && (
                          <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                            NOVO
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#9ba9bc]">{framework.status}</span>
                          <span className="font-bold text-primary-300">{framework.progress}%</span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-[#151f2b]">
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
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary-500/10 py-2 font-medium text-primary-300 transition-all duration-300 hover:bg-primary-500 hover:text-black"
                        onClick={() => handleFrameworkClick(framework)}
                      >
                        <Play className="w-4 h-4" />
                        Continuar
                      </button>
                    </motion.div>
                  );
                })}
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
                className="rounded-2xl border border-[#273548] bg-[#101722] p-6 shadow-[0_12px_28px_rgba(0,0,0,0.16)]"
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
                  onClick={() => navigate('/dashboard/calendario')}
                >
                  Ver calendário completo
                </button>
              </motion.div>

              {/* Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="rounded-2xl border border-primary-400/25 bg-[#101722] p-6 shadow-[0_12px_28px_rgba(0,0,0,0.16)]"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-primary-500" />
                  <h2 className="text-xl font-bold text-white">Recomendado pra Você</h2>
                </div>

                <div className="space-y-3">
                  {recommendations.map((rec, index) => {
                    const Icon = iconMap[rec.icon] || Target; // Fallback para Target
                    return (
                      <motion.div
                        key={rec.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                        className="rounded-xl border border-[#273548] bg-[#0c121b] p-4"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            rec.color === 'primary' ? 'bg-primary-500/10' :
                            rec.color === 'blue' ? 'bg-blue-500/10' :
                            'bg-purple-500/10'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              rec.color === 'primary' ? 'text-primary-600 dark:text-primary-500' :
                              rec.color === 'blue' ? 'text-blue-600 dark:text-blue-500' :
                              'text-purple-600 dark:text-purple-500'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="mb-1 text-sm font-semibold text-white">{rec.title}</h4>
                            <p className="text-xs text-[#9ba9bc]">{rec.description}</p>
                          </div>
                        </div>
                        <button
                          className={`w-full py-2 rounded-lg font-medium text-sm transition-all ${
                            rec.color === 'primary' ? 'bg-primary-500 hover:bg-primary-600 text-black' :
                            rec.color === 'blue' ? 'bg-blue-500 hover:bg-blue-600 text-white' :
                            'bg-purple-500 hover:bg-purple-600 text-white'
                          }`}
                          onClick={() => handleRecommendationClick(rec)}
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
                className="rounded-2xl border border-[#273548] bg-[#101722] p-6 shadow-[0_12px_28px_rgba(0,0,0,0.16)]"
              >
                <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                  <Activity className="w-5 h-5 text-primary-500" />
                  Atividade Recente
                </h2>

                <div className="space-y-4">
                  {recentActivity.map((activity, index) => {
                    const Icon = iconMap[activity.icon] || Award; // Fallback para Award
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0 + index * 0.1 }}
                        className="flex items-start gap-3 border-b border-[#273548] pb-4 last:border-0 last:pb-0"
                      >
                        <div className="w-8 h-8 bg-primary-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-primary-600 dark:text-primary-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="text-[#9ba9bc]">{activity.action}</span>
                            {' '}
                            <span className="font-semibold text-white">{activity.target}</span>
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-[#718096]">{activity.time}</span>
                            <span className="text-xs font-medium text-primary-300">+{activity.xp} XP</span>
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
