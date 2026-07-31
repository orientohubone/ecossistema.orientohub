import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
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

  const { metrics, recommendations } = insightsData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'good': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      case 'on-track': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'warning': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30';
      case 'critical': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      default: return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
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

  return (
    <>
      <Helmet>
        <title>Insights - Orientohub</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container-custom py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Insights Avançados
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
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
                  className="group overflow-hidden rounded-2xl border-2 border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary-500 hover:shadow-xl hover:shadow-primary-500/10 dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="relative min-h-[112px] overflow-hidden border-b-2 border-gray-100 bg-gradient-to-br from-gray-50 via-white to-primary-50/40 dark:border-gray-700 dark:from-gray-800 dark:via-gray-800 dark:to-primary-950/30">
                    <div className={`absolute -right-10 -top-12 h-36 w-36 rounded-full bg-gradient-to-br ${metric.color} opacity-10 blur-2xl transition-opacity group-hover:opacity-20`} />
                    <div className="relative flex items-start justify-between gap-3 p-5">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${metric.bgColor} shadow-sm`}>
                          <Icon className={`h-5 w-5 ${
                        metric.bgColor.includes('blue') ? 'text-blue-600' :
                        metric.bgColor.includes('purple') ? 'text-purple-600' :
                        metric.bgColor.includes('green') ? 'text-green-600' :
                        metric.bgColor.includes('orange') ? 'text-orange-600' :
                        metric.bgColor.includes('pink') ? 'text-pink-600' :
                        metric.bgColor.includes('indigo') ? 'text-indigo-600' :
                        'text-white'
                          }`} />
                        </div>
                        <div className="min-w-0">
                          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">Indicador</p>
                          <h3 className="line-clamp-2 text-base font-bold text-gray-900 dark:text-white">{metric.title}</h3>
                        </div>
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-xs font-bold shadow-sm dark:bg-gray-900/70">
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
                        <p className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">{metric.value}</p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{metric.description}</p>
                      </div>
                      <p className="text-right text-xs text-gray-500 dark:text-gray-400">Meta<br /><span className="font-bold text-gray-700 dark:text-gray-200">{metric.goal}</span></p>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${metric.color} transition-all duration-700`}
                        style={{ width: `${metric.goal > 0 ? Math.min((metric.value / metric.goal) * 100, 100) : 0}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-3 dark:border-gray-700">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${getStatusColor(metric.status)}`}>
                        {getStatusLabel(metric.status)}
                      </span>
                      <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Evolução no período</span>
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
            className="overflow-hidden rounded-2xl border-2 border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-center justify-between gap-4 border-b-2 border-gray-100 bg-gradient-to-r from-gray-50 via-white to-primary-50/30 px-6 py-5 dark:border-gray-700 dark:from-gray-800 dark:via-gray-800 dark:to-primary-950/20">
              <div>
                <p className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">Próximos movimentos</p>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recomendações Inteligentes</h2>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/15">
                <Zap className="h-5 w-5 text-primary-500" />
              </div>
            </div>

            <div className="space-y-4 p-5 md:p-6">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className={`group rounded-2xl border-2 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:bg-gray-900/40 ${getPriorityColor(rec.priority)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/80 shadow-sm dark:bg-gray-800/80">
                      {rec.priority === 'high' && <AlertTriangle className="h-5 w-5 text-red-500" />}
                      {rec.priority === 'medium' && <Brain className="h-5 w-5 text-yellow-500" />}
                      {rec.priority === 'low' && <Lightbulb className="h-5 w-5 text-green-500" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-bold text-gray-900 dark:text-white">{rec.title}</h3>
                        <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gray-600 dark:bg-gray-800/80 dark:text-gray-300">
                          {getPriorityLabel(rec.priority)}
                        </span>
                      </div>
                      <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        {rec.description}
                      </p>
                      
                      <button className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2 text-sm font-bold text-black transition-all hover:bg-primary-600 group-hover:shadow-md group-hover:shadow-primary-500/20">
                        {rec.action}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {recommendations.length === 0 && (
              <div className="text-center py-8">
                <Zap className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Excelente progresso!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
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
