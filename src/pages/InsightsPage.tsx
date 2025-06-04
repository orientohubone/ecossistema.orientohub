import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, Users, Target } from 'lucide-react';

const InsightsPage = () => {
  const { t } = useTranslation();

  const metrics = [
    {
      title: 'Validações Realizadas',
      value: '24',
      change: '+12%',
      trend: 'up',
    },
    {
      title: 'Entrevistas com Clientes',
      value: '48',
      change: '+8%',
      trend: 'up',
    },
    {
      title: 'NPS',
      value: '8.7',
      change: '+0.5',
      trend: 'up',
    },
    {
      title: 'Taxa de Conversão',
      value: '3.2%',
      change: '-0.5%',
      trend: 'down',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Insights | Orientohub</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Insights</h1>
          <div className="flex items-center space-x-2">
            <select className="form-select rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800">
              <option>Últimos 7 dias</option>
              <option>Últimos 30 dias</option>
              <option>Últimos 90 dias</option>
            </select>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric) => (
            <motion.div
              key={metric.title}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{metric.title}</h3>
              <div className="mt-2 flex items-baseline">
                <p className="text-2xl font-semibold">{metric.value}</p>
                <p className={`ml-2 text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {metric.change}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Segments */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h2 className="text-lg font-semibold mb-4">Segmentos de Clientes</h2>
            <div className="space-y-4">
              {['B2B', 'B2C', 'Enterprise'].map((segment) => (
                <div key={segment} className="flex items-center">
                  <div className="w-full">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{segment}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {Math.floor(Math.random() * 40 + 20)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${Math.floor(Math.random() * 40 + 20)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Growth Metrics */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold mb-4">Métricas de Crescimento</h2>
            <div className="space-y-4">
              {['CAC', 'LTV', 'Churn Rate'].map((metric) => (
                <div key={metric} className="flex items-center">
                  <div className="w-full">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{metric}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {Math.floor(Math.random() * 40 + 20)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${Math.floor(Math.random() * 40 + 20)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recommendations */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold mb-4">Recomendações</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Target className="h-6 w-6 text-primary-500 mb-2" />
              <h3 className="font-medium mb-1">Aumentar Validações</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Realize mais entrevistas com potenciais clientes para validar suas hipóteses.
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Users className="h-6 w-6 text-primary-500 mb-2" />
              <h3 className="font-medium mb-1">Expandir Base de Usuários</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Foque em aquisição de novos usuários através de canais orgânicos.
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary-500 mb-2" />
              <h3 className="font-medium mb-1">Otimizar Conversão</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Implemente melhorias no funil de conversão para aumentar as taxas.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default InsightsPage;