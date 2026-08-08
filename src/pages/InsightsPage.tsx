import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown,
  Target,
  Clock,
  ThumbsUp,
  TrendingUp as TrendingUpIcon,
  AlertTriangle,
  Brain,
  Lightbulb,
  Users,
  Zap,
  ArrowRight
} from 'lucide-react';
import { insightsService, type InsightData } from '../services/insightsService';
import DashboardPageSkeleton from '../components/ui/DashboardPageSkeleton';
import { getCachedValue, getOrLoadCachedValue } from '../lib/memoryCache';

// Mapeamento de ícones para métricas
const iconMap: { [key: string]: any } = {
  'validations': Target,
  'interviews': Clock,
  'experiments': Brain,
  'tasks': Clock,
  'frameworks': Target,
  'streak': Zap,
  'goals': Target,
  'networking': Users,
  'conversion': TrendingUpIcon,
  'progress': Users,
  'nps': ThumbsUp
};

const InsightsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const cachedInsightsData = getCachedValue<InsightData>('insights:data');
  const [insightsData, setInsightsData] = useState<InsightData | null>(cachedInsightsData);
  const [isLoading, setIsLoading] = useState(!cachedInsightsData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInsightsData = async () => {
      try {
        if (!cachedInsightsData) {
          setIsLoading(true);
        }
        setError(null);
        const data = await getOrLoadCachedValue(
          'insights:data',
          30000,
          () => insightsService.getInsightsData()
        );
        setInsightsData(data);
      } catch (err: any) {
        console.error('Error loading insights data:', err);
        setError(err.message || 'Não foi possível carregar os insights');
      } finally {
        setIsLoading(false);
      }
    };

    loadInsightsData();
  }, []);

  if (isLoading) {
    return <DashboardPageSkeleton cards={3} columns={1} />;
  }

  if (error || !insightsData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0c121b] p-5">
        <div className="max-w-md rounded-2xl border border-[#273548] bg-[#101722] p-8 text-center shadow-2xl">
          <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-orange-300" />
          <p className="mb-4 text-gray-200">{error || 'Dados não disponíveis'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="rounded-xl bg-primary-500 px-4 py-2 font-bold text-black transition-colors hover:bg-primary-400"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const { metrics, recommendations } = insightsData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-emerald-300 bg-emerald-400/10';
      case 'good': return 'text-blue-300 bg-blue-400/10';
      case 'on-track': return 'text-yellow-300 bg-yellow-400/10';
      case 'warning': return 'text-orange-300 bg-orange-400/10';
      case 'critical': return 'text-red-300 bg-red-400/10';
      default: return 'text-gray-300 bg-gray-400/10';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-400/35 hover:border-red-400/70';
      case 'medium': return 'border-yellow-400/35 hover:border-yellow-400/70';
      case 'low': return 'border-emerald-400/35 hover:border-emerald-400/70';
      default: return 'border-[#34455a] hover:border-[#4c6078]';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Bom';
      case 'on-track': return 'No caminho';
      case 'warning': return 'Atenção';
      case 'critical': return 'Crítico';
      default: return 'Sem status';
    }
  };

  const getPriorityLabel = (priority: string) => {
    if (priority === 'high') return 'Alta prioridade';
    if (priority === 'medium') return 'Prioridade média';
    return 'Baixa prioridade';
  };

  const handleRecommendationAction = (recommendationId: string) => {
    const routes: Record<string, string> = {
      'create-project': '/dashboard/projects',
      'pending-tasks': '/dashboard/projects',
      'create-hypothesis': '/dashboard/projects',
      'validate-hypothesis': '/dashboard/projects',
      'excellent-progress': '/dashboard/projects',
    };
    navigate(routes[recommendationId] || '/dashboard/projects');
  };

  return (
    <>
      <Helmet>
        <title>Insights - Orientohub</title>
      </Helmet>

      <div className="min-h-screen bg-[#0c121b]">
        <div className="container-custom py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-primary-300">Visão de performance</p>
              <h1 className="mb-2 text-3xl font-bold text-white">
              Insights Avançados
            </h1>
            <p className="text-[#9ba9bc]">
              Análise detalhada do seu progresso e métricas
            </p>
          </motion.div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {metrics.map((metric, index) => {
              const Icon = iconMap[metric.id] || Target;
              return (
                <motion.article
                  key={metric.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group overflow-hidden rounded-2xl border border-[#273548] bg-[#101722] shadow-[0_12px_28px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-400/70 hover:shadow-[0_20px_38px_rgba(0,0,0,0.28)]"
                >
                  <div className="border-b border-[#273548] bg-[#151f2b]">
                    <div className="flex items-start justify-between gap-3 p-5">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-[#34455a] bg-[#0c121b] shadow-inner shadow-black/20">
                          <Icon className={`h-5 w-5 ${
                        metric.bgColor.includes('blue') ? 'text-blue-300' :
                        metric.bgColor.includes('purple') ? 'text-purple-300' :
                        metric.bgColor.includes('green') ? 'text-emerald-300' :
                        metric.bgColor.includes('orange') ? 'text-orange-300' :
                        metric.bgColor.includes('pink') ? 'text-pink-300' :
                        metric.bgColor.includes('indigo') ? 'text-indigo-300' :
                        'text-primary-300'
                          }`} />
                        </div>
                        <div className="min-w-0">
                          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#718096]">Indicador</p>
                          <h3 className="line-clamp-2 text-base font-bold text-white">{metric.title}</h3>
                        </div>
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-1 rounded-full border border-[#34455a] bg-[#0c121b] px-2.5 py-1 text-xs font-bold">
                        {metric.trend === 'up' && <TrendingUp className="h-3.5 w-3.5 text-green-500" />}
                        {metric.trend === 'down' && <TrendingDown className="h-3.5 w-3.5 text-red-500" />}
                        <span className={metric.trend === 'up' ? 'text-green-500' : metric.trend === 'down' ? 'text-red-500' : 'text-gray-500'}>
                          {metric.change > 0 ? '+' : ''}{metric.change}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-3xl font-black tracking-tight text-white">{metric.value}</p>
                        <p className="mt-1 text-xs text-[#9ba9bc]">{metric.description}</p>
                      </div>
                      <p className="text-right text-xs text-[#9ba9bc]">Meta<br /><span className="font-bold text-gray-100">{metric.goal}</span></p>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-[#0c121b]">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${metric.color} transition-all duration-700`}
                        style={{ width: `${metric.goal > 0 ? Math.min((metric.value / metric.goal) * 100, 100) : 0}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-[#273548] pt-3">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${getStatusColor(metric.status)}`}>
                        {getStatusLabel(metric.status)}
                      </span>
                      <span className="text-[11px] font-medium text-[#9ba9bc]">Evolução no período</span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="overflow-hidden rounded-2xl border border-[#273548] bg-[#101722] shadow-[0_12px_28px_rgba(0,0,0,0.16)]"
          >
            <div className="flex items-center justify-between gap-4 border-b border-[#273548] bg-[#151f2b] px-6 py-5">
              <div>
                <p className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#718096]">Próximos movimentos</p>
                <h2 className="text-xl font-bold text-white">Recomendações Inteligentes</h2>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#34455a] bg-[#0c121b]">
                <Zap className="h-5 w-5 text-primary-300" />
              </div>
            </div>

            <div className="space-y-4 p-5 md:p-6">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className={`group rounded-2xl border bg-[#0c121b] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${getPriorityColor(rec.priority)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#34455a] bg-[#151f2b]">
                      {rec.priority === 'high' && <AlertTriangle className="h-5 w-5 text-red-500" />}
                      {rec.priority === 'medium' && <Brain className="h-5 w-5 text-yellow-500" />}
                      {rec.priority === 'low' && <Lightbulb className="h-5 w-5 text-green-500" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-bold text-white">{rec.title}</h3>
                        <span className="rounded-full border border-[#34455a] bg-[#151f2b] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gray-300">
                          {getPriorityLabel(rec.priority)}
                        </span>
                      </div>
                      <p className="mb-4 text-sm leading-relaxed text-[#9ba9bc]">
                        {rec.description}
                      </p>
                      
                      <button onClick={() => handleRecommendationAction(rec.id)} className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2 text-sm font-bold text-black transition-all hover:bg-primary-400 group-hover:shadow-md group-hover:shadow-primary-500/20">
                        {rec.action}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {recommendations.length === 0 && (
              <div className="py-8 text-center">
                <Zap className="mx-auto mb-4 h-12 w-12 text-primary-300" />
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Excelente progresso!
                </h3>
                <p className="text-[#9ba9bc]">
                  Continue assim e novas recomendações aparecerão conforme necessário.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default InsightsPage;
