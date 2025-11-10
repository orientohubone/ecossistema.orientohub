import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart2, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Target,
  Zap,
  Brain,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  ArrowRight,
  Eye,
  MessageSquare,
  ThumbsUp,
  DollarSign,
  Percent,
  Activity,
  Filter,
  Download,
  Share2,
  Sparkles,
  Rocket,
  Trophy,
  Flame,
  TrendingUpIcon,
  AlertCircle,
  Info,
  ChevronRight,
  RefreshCw,
  Settings
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

const InsightsPage = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('30days');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - Em produção viria de uma API
  const metrics = [
    {
      id: 'validations',
      title: 'Validações Realizadas',
      value: 48,
      change: 12,
      trend: 'up',
      icon: Target,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      description: 'Entrevistas com clientes',
      goal: 60,
      status: 'on-track'
    },
    {
      id: 'interviews',
      title: 'Horas de Pesquisa',
      value: 127,
      change: 8,
      trend: 'up',
      icon: Clock,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      description: 'Tempo investido',
      goal: 150,
      status: 'on-track'
    },
    {
      id: 'nps',
      title: 'NPS Score',
      value: 8.7,
      change: 0.5,
      trend: 'up',
      icon: ThumbsUp,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      description: 'Satisfação média',
      goal: 9.0,
      status: 'excellent'
    },
    {
      id: 'conversion',
      title: 'Taxa de Conversão',
      value: 3.2,
      change: -0.5,
      trend: 'down',
      icon: TrendingDown,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10',
      description: 'Visitantes → Clientes',
      goal: 5.0,
      status: 'needs-attention'
    },
    {
      id: 'cac',
      title: 'CAC',
      value: 145,
      change: -8,
      trend: 'up',
      icon: DollarSign,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-500/10',
      description: 'Custo de aquisição',
      goal: 120,
      status: 'needs-attention'
    },
    {
      id: 'ltv',
      title: 'LTV',
      value: 890,
      change: 15,
      trend: 'up',
      icon: TrendingUp,
      color: 'from-primary-400 to-primary-600',
      bgColor: 'bg-primary-500/10',
      description: 'Valor do cliente',
      goal: 1000,
      status: 'on-track'
    }
  ];

  const weeklyData = [
    { day: 'Seg', validacoes: 4, entrevistas: 8, conversoes: 2 },
    { day: 'Ter', validacoes: 7, entrevistas: 12, conversoes: 3 },
    { day: 'Qua', validacoes: 5, entrevistas: 10, conversoes: 4 },
    { day: 'Qui', validacoes: 9, entrevistas: 15, conversoes: 5 },
    { day: 'Sex', validacoes: 11, entrevistas: 18, conversoes: 6 },
    { day: 'Sáb', validacoes: 3, entrevistas: 5, conversoes: 1 },
    { day: 'Dom', validacoes: 2, entrevistas: 4, conversoes: 1 }
  ];

  const monthlyGrowth = [
    { month: 'Jan', usuarios: 120, receita: 4500 },
    { month: 'Fev', usuarios: 180, receita: 6200 },
    { month: 'Mar', usuarios: 250, receita: 8900 },
    { month: 'Abr', usuarios: 320, receita: 11500 },
    { month: 'Mai', usuarios: 410, receita: 15200 },
    { month: 'Jun', usuarios: 520, receita: 19800 }
  ];

  const customerSegments = [
    { name: 'B2B SaaS', value: 45, color: '#FFD700' },
    { name: 'B2C Marketplace', value: 30, color: '#6366F1' },
    { name: 'Enterprise', value: 15, color: '#10B981' },
    { name: 'Outros', value: 10, color: '#8B5CF6' }
  ];

  const radarData = [
    { subject: 'Validação', A: 85, fullMark: 100 },
    { subject: 'Produto', A: 70, fullMark: 100 },
    { subject: 'Marketing', A: 65, fullMark: 100 },
    { subject: 'Vendas', A: 75, fullMark: 100 },
    { subject: 'Financeiro', A: 80, fullMark: 100 },
    { subject: 'Equipe', A: 60, fullMark: 100 }
  ];

  const insights = [
    {
      id: 1,
      type: 'success',
      icon: Rocket,
      title: 'Parabéns! Meta de validações atingida',
      description: 'Você completou 48 validações este mês, superando sua meta de 40. Continue assim!',
      action: 'Ver detalhes',
      color: 'green',
      priority: 'high'
    },
    {
      id: 2,
      type: 'warning',
      icon: AlertTriangle,
      title: 'Taxa de conversão abaixo da meta',
      description: 'Sua conversão caiu 0.5%. Revise seu funil de vendas e faça testes A/B no CTA.',
      action: 'Otimizar funil',
      color: 'yellow',
      priority: 'high'
    },
    {
      id: 3,
      type: 'info',
      icon: Brain,
      title: 'Padrão identificado nos dados',
      description: 'Clientes B2B têm 3x mais chance de conversão quando entrevistados por vídeo.',
      action: 'Aplicar insight',
      color: 'blue',
      priority: 'medium'
    },
    {
      id: 4,
      type: 'tip',
      icon: Lightbulb,
      title: 'Sugestão de crescimento',
      description: 'Seu CAC está alto. Considere investir mais em marketing de conteúdo e SEO.',
      action: 'Ver estratégias',
      color: 'purple',
      priority: 'medium'
    }
  ];

  const recommendations = [
    {
      id: 1,
      icon: Target,
      title: 'Foque em validação qualitativa',
      impact: 'Alto',
      effort: 'Médio',
      description: 'Realize entrevistas em profundidade com seus top 10 clientes para descobrir pain points ocultos.',
      estimatedGain: '+25% no NPS',
      category: 'Validação'
    },
    {
      id: 2,
      icon: Users,
      title: 'Expanda para segmento Enterprise',
      impact: 'Muito Alto',
      effort: 'Alto',
      description: 'Dados mostram que Enterprise tem 80% maior LTV. Adapte seu produto para esse segmento.',
      estimatedGain: '+40% na receita',
      category: 'Crescimento'
    },
    {
      id: 3,
      icon: Zap,
      title: 'Automatize follow-ups',
      impact: 'Médio',
      effort: 'Baixo',
      description: 'Configure sequências automáticas de e-mail para leads que não convertem em 7 dias.',
      estimatedGain: '+15% conversão',
      category: 'Otimização'
    },
    {
      id: 4,
      icon: MessageSquare,
      title: 'Implemente chat ao vivo',
      impact: 'Alto',
      effort: 'Baixo',
      description: 'Visitantes com dúvidas têm 60% mais chance de conversão com chat em tempo real.',
      estimatedGain: '+20% conversão',
      category: 'Conversão'
    }
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <>
      <Helmet>
        <title>Insights Avançados - Orientohub</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container-custom py-8 space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold flex items-center gap-2">
                    Insights Inteligentes
                    <Sparkles className="w-6 h-6 text-primary-500" />
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Análises em tempo real para decisões mais inteligentes
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:ring-0 transition-all"
              >
                <option value="7days">Últimos 7 dias</option>
                <option value="30days">Últimos 30 dias</option>
                <option value="90days">Últimos 90 dias</option>
                <option value="12months">Últimos 12 meses</option>
              </select>

              <button
                onClick={handleRefresh}
                className="p-2.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-500 transition-all"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>

              <button className="p-2.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-500 transition-all">
                <Download className="w-5 h-5" />
              </button>

              <button className="px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-black font-medium rounded-xl transition-all flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Compartilhar
              </button>
            </div>
          </motion.div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              const progress = (metric.value / metric.goal) * 100;

              return (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-5 transition-opacity`} />

                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 ${metric.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-6 h-6 bg-gradient-to-br ${metric.color} bg-clip-text`} style={{ WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
                      </div>

                      {/* Trend Badge */}
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                        metric.trend === 'up' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}>
                        {metric.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </div>
                    </div>

                    {/* Value */}
                    <div className="mb-2">
                      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {metric.title}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                          {metric.id === 'cac' || metric.id === 'ltv' ? `R$ ${metric.value}` : metric.value}
                        </p>
                        {metric.id === 'conversion' && <span className="text-lg text-gray-500">%</span>}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {metric.description}
                      </p>
                    </div>

                    {/* Progress to Goal */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>Meta: {metric.id === 'cac' || metric.id === 'ltv' ? `R$ ${metric.goal}` : metric.goal}</span>
                        <span className="font-medium">{Math.min(progress, 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${metric.color} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(progress, 100)}%` }}
                          transition={{ duration: 1, delay: 0.2 + index * 0.05 }}
                        />
                      </div>
                    </div>

                    {/* Status */}
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-xs">
                        {metric.status === 'excellent' && (
                          <>
                            <Trophy className="w-4 h-4 text-green-500" />
                            <span className="text-green-600 dark:text-green-400 font-medium">Excelente!</span>
                          </>
                        )}
                        {metric.status === 'on-track' && (
                          <>
                            <CheckCircle className="w-4 h-4 text-blue-500" />
                            <span className="text-blue-600 dark:text-blue-400 font-medium">No caminho certo</span>
                          </>
                        )}
                        {metric.status === 'needs-attention' && (
                          <>
                            <AlertCircle className="w-4 h-4 text-yellow-500" />
                            <span className="text-yellow-600 dark:text-yellow-400 font-medium">Precisa atenção</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* AI Insights Alert */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  🎯 Insight da IA: Oportunidade de Crescimento Detectada!
                </h3>
                <p className="text-white/90 mb-4">
                  Nossa IA identificou que clientes validados por entrevista em vídeo têm <strong>3.2x mais taxa de conversão</strong>. 
                  Recomendamos priorizar esse canal nas próximas 2 semanas para potencializar resultados.
                </p>
                <div className="flex items-center gap-3">
                  <button className="px-6 py-2.5 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 transition-all">
                    Implementar Agora
                  </button>
                  <button className="px-6 py-2.5 bg-white/10 backdrop-blur-sm text-white font-medium rounded-xl hover:bg-white/20 transition-all">
                    Ver Análise Completa
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Weekly Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Activity className="w-6 h-6 text-primary-500" />
                  Atividade Semanal
                </h2>
                <select className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                  <option>Esta semana</option>
                  <option>Semana passada</option>
                </select>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                  <XAxis dataKey="day" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="validacoes" fill="#FFD700" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="entrevistas" fill="#6366F1" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="conversoes" fill="#10B981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Monthly Growth */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                  Crescimento Mensal
                </h2>
                <div className="flex items-center gap-2 text-sm">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-green-600 dark:text-green-400 font-bold">+127% este mês</span>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyGrowth}>
                  <defs>
                    <linearGradient id="colorUsuarios" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="usuarios" stroke="#FFD700" fillOpacity={1} fill="url(#colorUsuarios)" />
                  <Area type="monotone" dataKey="receita" stroke="#10B981" fillOpacity={1} fill="url(#colorReceita)" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Customer Segments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-500" />
                  Segmentos de Clientes
                </h2>
              </div>

              <div className="flex items-center justify-between gap-8">
                <ResponsiveContainer width="60%" height={250}>
                  <PieChart>
                    <Pie
                      data={customerSegments}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {customerSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="flex-1 space-y-3">
                  {customerSegments.map((segment, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: segment.color }}
                        />
                        <span className="text-sm font-medium">{segment.name}</span>
                      </div>
                      <span className="text-sm font-bold">{segment.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Startup Health Radar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Target className="w-6 h-6 text-purple-500" />
                  Saúde da Startup
                </h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">Saudável</span>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="subject" stroke="#9CA3AF" />
                  <PolarRadiusAxis stroke="#9CA3AF" />
                  <Radar name="Score" dataKey="A" stroke="#FFD700" fill="#FFD700" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Smart Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                Insights Inteligentes
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Atualizados há 5 minutos
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight, index) => {
                const Icon = insight.icon;
                const colorClasses = {
                  green: 'from-green-500 to-green-600',
                  yellow: 'from-yellow-500 to-yellow-600',
                  blue: 'from-blue-500 to-blue-600',
                  purple: 'from-purple-500 to-purple-600'
                };

                return (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group p-5 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[insight.color as keyof typeof colorClasses]} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold mb-2 group-hover:text-primary-500 transition-colors">
                          {insight.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {insight.description}
                        </p>
                        <button className="text-sm font-medium text-primary-500 hover:text-primary-600 flex items-center gap-1">
                          {insight.action}
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                Recomendações Personalizadas
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recommendations.map((rec, index) => {
                const Icon = rec.icon;
                return (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                        <Icon className="w-6 h-6 text-primary-500 group-hover:text-black transition-colors" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold group-hover:text-primary-500 transition-colors">
                            {rec.title}
                          </h3>
                          <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                            {rec.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {rec.description}
                        </p>
                        
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-1 text-xs">
                            <span className="text-gray-500 dark:text-gray-400">Impacto:</span>
                            <span className={`font-bold ${
                              rec.impact === 'Muito Alto' ? 'text-green-600 dark:text-green-400' :
                              rec.impact === 'Alto' ? 'text-blue-600 dark:text-blue-400' :
                              'text-yellow-600 dark:text-yellow-400'
                            }`}>
                              {rec.impact}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <span className="text-gray-500 dark:text-gray-400">Esforço:</span>
                            <span className="font-bold">{rec.effort}</span>
                          </div>
                        </div>

                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg mb-4">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <span className="text-sm font-bold text-green-700 dark:text-green-400">
                              Ganho estimado: {rec.estimatedGain}
                            </span>
                          </div>
                        </div>

                        <button className="w-full py-2.5 bg-primary-500 hover:bg-primary-600 text-black font-medium rounded-lg transition-all flex items-center justify-center gap-2">
                          Implementar
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default InsightsPage;
