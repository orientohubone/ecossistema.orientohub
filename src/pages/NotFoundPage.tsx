import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, Mail } from 'lucide-react';

const NotFoundPage = () => {
  const { t } = useTranslation();
  
  return (
    <>
      <Helmet>
        <title>{t('common.notFound')} | Orientohub</title>
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 -left-48 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 -right-48 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <motion.div
          className="max-w-4xl w-full relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center">
            {/* 404 Number with premium effect */}
            <motion.div
              className="relative inline-block mb-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="absolute inset-0 bg-primary-500/20 blur-3xl" />
              <h1 className="relative text-[12rem] md:text-[16rem] font-black text-primary-500 leading-none">
                404
              </h1>
            </motion.div>

            {/* Title and description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Página Não Encontrada
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                Ops! Parece que você se perdeu no espaço digital. A página que você está procurando não existe ou foi movida.
              </p>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link
                to="/"
                className="group relative inline-flex items-center px-8 py-4 overflow-hidden rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Home size={20} className="mr-2" />
                Voltar para Home
              </Link>

              <Link
                to="/blog"
                className="group inline-flex items-center px-8 py-4 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Search size={20} className="mr-2 group-hover:text-primary-500 transition-colors" />
                Explorar o Blog
              </Link>
            </motion.div>

            {/* Help section */}
            <motion.div
              className="mt-16 p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Precisa de ajuda?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Se você acredita que isso é um erro ou precisa de assistência, nossa equipe está pronta para ajudar.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/sobre"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <ArrowLeft size={18} className="mr-2" />
                  Sobre Nós
                </Link>
                <a
                  href="mailto:support@orientohub.com"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Mail size={18} className="mr-2" />
                  Contatar Suporte
                </a>
              </div>
            </motion.div>

            {/* Quick links */}
            <motion.div
              className="mt-12 flex flex-wrap gap-4 justify-center text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <Link to="/planos" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                Planos
              </Link>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <Link to="/ecossistema" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                Ecossistema
              </Link>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <Link to="/manifesto" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                Manifesto
              </Link>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <Link to="/glossario" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                Glossário
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default NotFoundPage;
