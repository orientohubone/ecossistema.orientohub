import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Star, Target } from 'lucide-react';

const FrameworkGamePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [framework, setFramework] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [level, setLevel] = useState(1);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const currentFramework = sessionStorage.getItem('currentFramework');
    if (!currentFramework) {
      navigate('/dashboard/frameworks');
      return;
    }
    setFramework(currentFramework);
  }, [navigate]);

  if (!framework) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{framework} - Modo Gamificado | Orientohub</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard/frameworks')}
              className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold">{framework} - Modo Gamificado</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-200 px-3 py-1 rounded-full">
              <Trophy size={16} />
              <span className="font-medium">{points} pontos</span>
            </div>
            <div className="flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-200 px-3 py-1 rounded-full">
              <Star size={16} />
              <span className="font-medium">Nível {level}</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Seu Progresso</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">{progress}% completo</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Game Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Challenge */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Target className="h-6 w-6 text-primary-500" />
              <h2 className="text-lg font-semibold">Desafio Atual</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Complete as etapas do framework de forma interativa e ganhe pontos por cada realização.
              </p>
              <button className="btn-primary w-full">
                Começar Desafio
              </button>
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Trophy className="h-6 w-6 text-primary-500" />
              <h2 className="text-lg font-semibold">Conquistas</h2>
            </div>
            <div className="space-y-3">
              {[
                'Completar primeira etapa',
                'Atingir 100 pontos',
                'Compartilhar framework',
                'Completar todas as etapas'
              ].map((achievement, index) => (
                <div
                  key={achievement}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                      <Star size={16} className="text-primary-500" />
                    </div>
                    <span>{achievement}</span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {index === 0 ? 'Completado' : 'Bloqueado'}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default FrameworkGamePage;