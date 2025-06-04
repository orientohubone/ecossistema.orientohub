import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { BarChart2, CheckSquare, FileText, Target, Award, Zap } from 'lucide-react';

const DashboardPage = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  
  // Mock data for dashboard
  const progressData = {
    level: 2,
    points: 350,
    nextLevel: 500,
    percentage: 70,
  };
  
  const tasks = [
    { id: 1, title: 'Completar perfil da startup', completed: true },
    { id: 2, title: 'Criar Business Model Canvas', completed: true },
    { id: 3, title: 'Validar problema com 5 clientes', completed: false },
    { id: 4, title: 'Definir proposta de valor', completed: false },
  ];
  
  const frameworks = [
    { id: 1, name: t('frameworks.bmc'), progress: 80 },
    { id: 2, name: t('frameworks.empathyMap'), progress: 60 },
    { id: 3, name: t('frameworks.customerJourney'), progress: 30 },
    { id: 4, name: t('frameworks.valueProposition'), progress: 10 },
  ];
  
  return (
    <>
      <Helmet>
        <title>Dashboard | Orientohub</title>
      </Helmet>
      
      <div className="space-y-6">
        {/* Welcome section */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold mb-2">
            {t('dashboard.welcome', { name: user?.email?.split('@')[0] || 'Empreendedor' })}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Continue sua jornada empreendedora de onde parou.
          </p>
        </motion.div>
        
        {/* Progress and tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <Target size={20} className="mr-2 text-primary-500" />
                {t('dashboard.progress')}
              </h2>
              <span className="text-sm font-medium bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-300 py-1 px-2 rounded-full">
                {t('gamification.progress.level', { level: progressData.level })}
              </span>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>{progressData.points} XP</span>
                <span>{progressData.nextLevel} XP</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-primary-500 h-2.5 rounded-full" 
                  style={{ width: `${progressData.percentage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t('gamification.phases.title')}
              </h3>
              <div className="flex justify-between">
                {['ideation', 'validation', 'mvp', 'traction', 'growth'].map((phase, index) => (
                  <div 
                    key={phase} 
                    className={`flex flex-col items-center`}
                  >
                    <div 
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        index < 2 
                          ? 'bg-primary-500 text-black' 
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="text-xs mt-1 text-center">
                      {t(`gamification.phases.${phase}`)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Tasks */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <CheckSquare size={20} className="mr-2 text-primary-500" />
                {t('dashboard.tasks')}
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {tasks.filter(t => t.completed).length}/{tasks.length} {t('common.completed')}
              </span>
            </div>
            
            <div className="space-y-3">
              {tasks.map((task) => (
                <div 
                  key={task.id}
                  className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    readOnly
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <span className={`ml-3 ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                    {task.title}
                  </span>
                  {task.completed && (
                    <span className="ml-auto text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 py-0.5 px-2 rounded-full">
                      Concluído
                    </span>
                  )}
                </div>
              ))}
            </div>
            
            <button className="mt-4 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300">
              Ver todas as tarefas
            </button>
          </motion.div>
        </div>
        
        {/* Frameworks and insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Frameworks */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <FileText size={20} className="mr-2 text-primary-500" />
                {t('dashboard.frameworks')}
              </h2>
              <button className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300">
                Ver todos
              </button>
            </div>
            
            <div className="space-y-4">
              {frameworks.map((framework) => (
                <div key={framework.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{framework.name}</span>
                    <span>{framework.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full" 
                      style={{ width: `${framework.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Insights */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <BarChart2 size={20} className="mr-2 text-primary-500" />
                {t('dashboard.insights')}
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Award size={18} className="text-primary-500 mr-2" />
                    <h3 className="text-sm font-medium">Conquistas</h3>
                  </div>
                  <p className="text-2xl font-bold">7/25</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Desbloqueadas</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Zap size={18} className="text-primary-500 mr-2" />
                    <h3 className="text-sm font-medium">Streak</h3>
                  </div>
                  <p className="text-2xl font-bold">5 dias</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Consecutivos</p>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Próximos passos recomendados</h3>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2">•</span>
                    <span>Complete a validação do problema com pelo menos 5 clientes potenciais</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2">•</span>
                    <span>Refine sua proposta de valor com base no feedback recebido</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;