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
  Zap
} from 'lucide-react';
import { insightsService, type InsightData } from '../services/insightsService';

// Mapeamento de ícones para métricas
const iconMap: { [key: string]: any } = {
  'validations': Target,
  'interviews': Clock,
  'experiments': Brain,
  'conversion': TrendingUpIcon,
  'progress': Users,
  'nps': ThumbsUp
};

const InsightsPage = () => {
  const { t } = useTranslation();
  const [insightsData, setInsightsData] = useState<InsightData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInsightsData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await insightsService.getInsightsData();
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
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando insights...</p>
        </div>
      </div>
    );
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
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${metric.bgColor} rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${
                        metric.bgColor.includes('blue') ? 'text-blue-600' :
                        metric.bgColor.includes('purple') ? 'text-purple-600' :
                        metric.bgColor.includes('green') ? 'text-green-600' :
                        metric.bgColor.includes('orange') ? 'text-orange-600' :
                        metric.bgColor.includes('pink') ? 'text-pink-600' :
                        metric.bgColor.includes('indigo') ? 'text-indigo-600' :
                        'text-white'
                      }`} />
                    </div>
                    <div className="flex items-center gap-1">
                      {metric.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                      {metric.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                      <span className={`text-sm font-medium ${
                        metric.trend === 'up' ? 'text-green-500' : 
                        metric.trend === 'down' ? 'text-red-500' : 
                        'text-gray-500'
                      }`}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {metric.title}
                  </h3>
                  
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {metric.value}
                  </p>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {metric.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                      {metric.status === 'excellent' ? 'Excelente' :
                       metric.status === 'good' ? 'Bom' :
                       metric.status === 'on-track' ? 'No caminho' :
                       metric.status === 'warning' ? 'Atenção' : 'Crítico'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Meta: {metric.goal}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Recomendações Inteligentes
            </h2>

            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className={`p-4 rounded-lg border-2 ${getPriorityColor(rec.priority)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {rec.priority === 'high' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                      {rec.priority === 'medium' && <Brain className="w-5 h-5 text-yellow-500" />}
                      {rec.priority === 'low' && <Lightbulb className="w-5 h-5 text-green-500" />}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {rec.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {rec.description}
                      </p>
                      
                      <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-black rounded-lg text-sm font-medium transition-colors">
                        {rec.action}
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
