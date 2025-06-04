import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  const { t } = useTranslation();
  
  return (
    <>
      <Helmet>
        <title>{t('common.notFound')} | Orientohub</title>
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-md w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-extrabold text-primary-500">404</h1>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
            {t('common.notFound')}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            A página que você está procurando não existe ou foi movida.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Home size={16} className="mr-2" />
              {t('common.backToHome')}
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default NotFoundPage;